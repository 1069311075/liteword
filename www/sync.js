// ========== 云同步模块 ==========
// 对接 FastAPI 后端：账号系统 + 跨设备数据备份与 LWW 合并。
// 数据按类型同步：records 按"单词"为实体做词级合并，其余类型（config/streak/word_banks）按整块合并。
// 协议：
//   pull  -> GET  /api/sync/snapshot   拉取云端快照，服务端时间戳较新则覆盖本地
//   push  -> POST /api/sync/push       推送本地"脏"数据（内容与上次同步快照不同者）
// 本地追踪：meta.snapshot 记录"上次已同步内容"，meta.ts 记录"每个实体的最新时间戳"。
(function (global) {
  'use strict';

  // 捕获存储层（浏览器中与全局 Store 一致；此处显式绑定以免依赖环境全局名）
  var Store = global.Store;

  var KEY_TO_TYPE = {
    'lw_config': 'config',
    'lw_records': 'records',
    'lw_streak': 'streak',
    'lw_custom_words': 'word_banks',
    'lw_custom_cats': 'word_banks'
  };
  var STORAGE_KEY_AUTH = 'lw_auth';
  var STORAGE_KEY_META = 'lw_sync_meta';
  var DEFAULT_SERVER = 'http://127.0.0.1:8000';

  var sync = {
    auth: null,      // { server, token, username }
    meta: null,      // { ts:{...}, snapshot:{...} }
    draft: null,     // 内存态当前内容（比 snapshot 新）
    _initDone: false,
    _pushTimer: null
  };

  // ========== 持久化读写 ==========
  function readJSON(key, fallback) {
    try {
      var s = Store.getItem(key);
      return s ? JSON.parse(s) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, obj) { Store.setItem(key, JSON.stringify(obj)); }

  function loadState() {
    sync.auth = readJSON(STORAGE_KEY_AUTH, { server: DEFAULT_SERVER, token: null, username: null });
    if (!sync.auth.server) sync.auth.server = DEFAULT_SERVER;
    sync.meta = readJSON(STORAGE_KEY_META, null) || defaultMeta();
    buildDraft();
  }
  function defaultMeta() {
    return { ts: { config: 0, streak: 0, word_banks: 0, records: {} }, snapshot: { records: {} } };
  }
  function saveMeta() { writeJSON(STORAGE_KEY_META, sync.meta); }
  function saveAuth() { writeJSON(STORAGE_KEY_AUTH, sync.auth); }

  // 从 Store 重建"当前内容"草稿（records 统一存 word -> 内容字符串）
  function buildDraft() {
    sync.draft = { records: {} };
    try {
      var rec = JSON.parse(Store.getItem('lw_records') || '{}') || {};
      for (var w in rec) sync.draft.records[w] = JSON.stringify(rec[w]);
    } catch (e) { sync.draft.records = {}; }
    ['config', 'streak', 'word_banks'].forEach(function (t) {
      sync.draft[t] = collectBlob(t);
    });
  }
  // 读取某整块类型的当前原始值
  function collectBlob(type) {
    if (type === 'config') return Store.getItem('lw_config') || '';
    if (type === 'streak') return Store.getItem('lw_streak') || '';
    if (type === 'word_banks') {
      var words = Store.getItem('lw_custom_words') || '[]';
      var cats = Store.getItem('lw_custom_cats') || '{}';
      return JSON.stringify({ words: words, cats: cats });
    }
    return '';
  }

  // ========== 写入钩子：追踪本地变化 ==========
  function onStoreWrite(key, value) {
    var type = KEY_TO_TYPE[key];
    if (!type || !sync.meta) return;
    var now = Date.now();
    if (type === 'records') {
      var newRec = {};
      try { newRec = JSON.parse(value) || {}; } catch (e) { newRec = {}; }
      var draftRec = sync.draft.records || (sync.draft.records = {});
      var metaRec = sync.meta.ts.records || (sync.meta.ts.records = {});
      // 新增/变更的词：相对上次写入内容有变化 -> 记录时间戳
      for (var w in newRec) {
        var c = JSON.stringify(newRec[w]);
        if (draftRec[w] !== c) metaRec[w] = now;
        draftRec[w] = c;
      }
      // 本地删除的词（旧草稿里有、新记录里没有）：保留 snapRec 以便推删除
      for (var old in sync.draft.records) {
        if (!(old in newRec)) {
          metaRec[old] = now;
          delete draftRec[old];
        }
      }
      dirtyPush();
    } else {
      sync.meta.ts[type] = now;
      sync.draft[type] = collectBlob(type);
      dirtyPush();
    }
    saveMeta();
  }

  // 防抖触发自动推送（仅已登录时）
  function dirtyPush() {
    if (!sync.auth || !sync.auth.token) return;
    if (sync._pushTimer) return;
    sync._pushTimer = setTimeout(function () {
      sync._pushTimer = null;
      doPush().catch(function () {});
    }, 2500);
  }

  // ========== API 客户端 ==========
  async function call(method, base, path, body, token) {
    var opts = { method: method, headers: {} };
    if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    var res = await fetch(base + path, opts);
    var text = await res.text();
    var data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
    if (!res.ok) {
      var detail = data && data.detail;
      var msg;
      if (typeof detail === 'string') msg = detail;
      else if (detail != null) msg = JSON.stringify(detail);
      else msg = 'HTTP ' + res.status;
      throw new Error(msg);
    }
    return data;
  }
  sync.api = {
    register: function (server, username, password) {
      return call('POST', server, '/api/auth/register', { username: username, password: password });
    },
    login: function (server, username, password) {
      return call('POST', server, '/api/auth/login', { username: username, password: password });
    },
    sendSms: function (server, phone) {
      return call('POST', server, '/api/auth/sms/send', { phone: phone });
    },
    smsLogin: function (server, phone, code) {
      return call('POST', server, '/api/auth/sms/login', { phone: phone, code: code });
    },
    me: function (server, token) {
      return call('GET', server, '/api/auth/me', null, token);
    },
    push: function (server, token, items) {
      return call('POST', server, '/api/sync/push', { items: items }, token);
    },
    snapshot: function (server, token) {
      return call('GET', server, '/api/sync/snapshot', null, token);
    }
  };

  // 同步成功后，把"上次已同步内容"对账为当前草稿，避免重复推送已同步的数据
  function reconcileSnapshot() {
    var snap = sync.meta.snapshot;
    snap.records = {};
    var draftRec = sync.draft.records || {};
    for (var w in draftRec) snap.records[w] = draftRec[w];
    ['config', 'streak', 'word_banks'].forEach(function (t) {
      if (sync.draft[t] != null) snap[t] = sync.draft[t];
    });
  }

  // ========== 推送本地脏数据 ==========
  async function doPush() {
    if (!sync.auth || !sync.auth.token) return;
    var items = collectPushItems();
    if (items.length === 0) return;
    var res = await sync.api.push(sync.auth.server, sync.auth.token, items);
    if (res && res.items) {
      // 推送成功：把当前内容标记为已同步
      acceptMerged(res.items);
      applyMergedToStore();
      reconcileSnapshot();
      saveMeta();
    }
    return res;
  }

  // 收集需要推送的条目：内容与上次同步快照不同者
  function collectPushItems() {
    var items = [];
    var now = Date.now();
    // records：脏词
    var draftRec = sync.draft.records || {};
    var snapRec = sync.meta.snapshot.records || {};
    var metaRec = sync.meta.ts.records || {};
    for (var w in draftRec) {
      if (snapRec[w] !== draftRec[w]) {
        items.push({ data_type: 'records', entity_id: w, data: draftRec[w], updated_at: metaRec[w] || now, deleted: false });
      }
    }
    // 本地删除的词（在快照中但不在当前记录里）
    for (var gone in snapRec) {
      if (!(gone in draftRec)) {
        items.push({ data_type: 'records', entity_id: gone, data: '{}', updated_at: metaRec[gone] || now, deleted: true });
      }
    }
    // 其余整块类型
    ['config', 'streak', 'word_banks'].forEach(function (t) {
      if (sync.draft[t] !== (sync.meta.snapshot[t] || '')) {
        items.push({ data_type: t, entity_id: 'main', data: sync.draft[t], updated_at: sync.meta.ts[t] || now, deleted: false });
      }
    });
    return items;
  }

  // ========== 拉取云端快照并合并 ==========
  async function doPull() {
    if (!sync.auth || !sync.auth.token) return;
    var res = await sync.api.snapshot(sync.auth.server, sync.auth.token);
    if (res && res.items) {
      acceptMerged(res.items);
      applyMergedToStore();
      // 注意：pull 后不整体对账快照，否则会把本地已写入但未推送的脏数据误标为已同步，
      // 导致后续 push 漏掉它们。仅 acceptMerged 内部对"来自服务端"的条目更新了快照。
      saveMeta();
    }
    return res;
  }

  // 按 LWW 规则把服务端条目合并进 meta.ts / meta.snapshot / draft
  function acceptMerged(items) {
    var metaRec = sync.meta.ts.records || (sync.meta.ts.records = {});
    var snapRec = sync.meta.snapshot.records || (sync.meta.snapshot.records = {});
    var draftRec = sync.draft.records || (sync.draft.records = {});
    items.forEach(function (it) {
      if (it.deleted) {
        // 服务端删除较新 -> 本地删除该词
        if ((metaRec[it.entity_id] || 0) < it.updated_at) {
          metaRec[it.entity_id] = it.updated_at;
          delete snapRec[it.entity_id];
          delete draftRec[it.entity_id];
        }
        return;
      }
      if (it.data_type === 'records') {
        if ((metaRec[it.entity_id] || 0) < it.updated_at) {
          metaRec[it.entity_id] = it.updated_at;
          snapRec[it.entity_id] = it.data;
          draftRec[it.entity_id] = it.data;
        }
      } else {
        var lts = sync.meta.ts[it.data_type] || 0;
        if (lts < it.updated_at) {
          sync.meta.ts[it.data_type] = it.updated_at;
          sync.meta.snapshot[it.data_type] = it.data;
          sync.draft[it.data_type] = it.data;
        }
      }
    });
  }

  // 把合并后的 draft 写回 Store。
  // records：以 draft（本地当前 + 服务端合并后的权威状态）为基准整体重建，
  //   从而正确清除那些"被本地或服务端删除"的词（draftRec 中已无该词）。
  function applyMergedToStore() {
    var draftRec = sync.draft.records || {};
    var merged = {};
    for (var w in draftRec) {
      var val = null;
      try { val = JSON.parse(draftRec[w]); } catch (e) { val = null; }
      if (val != null) merged[w] = val;
    }
    var cur = {};
    try { cur = JSON.parse(Store.getItem('lw_records') || '{}') || {}; } catch (e) { cur = {}; }
    if (JSON.stringify(cur) !== JSON.stringify(merged)) {
      Store.setItem('lw_records', JSON.stringify(merged));
    }
    // 整块类型
    ['config', 'streak', 'word_banks'].forEach(function (t) {
      applyBlob(t);
    });
  }

  function applyBlob(type) {
    var val = sync.draft[type];
    if (val == null) return;
    if (type === 'config' && val !== Store.getItem('lw_config')) Store.setItem('lw_config', val);
    else if (type === 'streak' && val !== Store.getItem('lw_streak')) Store.setItem('lw_streak', val);
    else if (type === 'word_banks') {
      var parsed = null;
      try { parsed = JSON.parse(val); } catch (e) { parsed = null; }
      if (parsed) {
        if (parsed.words && parsed.words !== Store.getItem('lw_custom_words')) Store.setItem('lw_custom_words', parsed.words);
        if (parsed.cats && parsed.cats !== Store.getItem('lw_custom_cats')) Store.setItem('lw_custom_cats', parsed.cats);
      }
    }
  }

  // ========== 对外主流程 ==========
  sync.init = function () {
    if (sync._initDone) return;
    sync._initDone = true;
    loadState();
    Store.onWrite(onStoreWrite);
    // 已登录则启动时自动拉取合并（后台静默）
    if (sync.auth && sync.auth.token) {
      doPull().then(function () {
        return doPush();
      }).catch(function () {});
    }
  };

  // 全量同步：先拉取合并，再推送本地脏数据
  sync.fullSync = function () {
    return doPull().then(function () { return doPush(); });
  };

  sync.server = function () { return sync.auth ? sync.auth.server : DEFAULT_SERVER; };

  sync.saveServer = function (url) {
    url = (url || '').trim().replace(/\/+$/, '');
    if (!sync.auth) sync.auth = {};
    sync.auth.server = url || DEFAULT_SERVER;
    saveAuth();
  };

  // 获取验证码（模拟模式：后端直接返回 devCode，自动填入）
  sync.sendCode = async function () {
    var server = ((document.getElementById('set-sync-server') || {}).value || '').trim().replace(/\/+$/, '') || DEFAULT_SERVER;
    var phone = (document.getElementById('set-sync-phone') || {}).value || '';
    if (!/^1\d{10}$/.test(phone)) { sync.setStatus('请输入正确的 11 位手机号', false); return; }
    var btn = document.getElementById('btn-send-code');
    if (btn) { btn.disabled = true; btn.textContent = '发送中...'; }
    sync.setStatus('正在发送验证码...');
    try {
      var data = await sync.api.sendSms(server, phone);
      var codeEl = document.getElementById('set-sync-code');
      // 演示模式：自动填入验证码，方便自媒体录制
      if (data && data.devCode && codeEl) { codeEl.value = data.devCode; }
      sync.setStatus('验证码已发送' + (data && data.devCode ? '（演示码已自动填入）' : ''), true);
      // 60 秒倒计时
      var left = 60;
      var timer = setInterval(function () {
        left--;
        if (btn) btn.textContent = left > 0 ? (left + 's') : '重新获取';
        if (left <= 0) { clearInterval(timer); if (btn) btn.disabled = false; }
      }, 1000);
    } catch (e) {
      sync.setStatus('发送失败：' + (e.message || e), false);
      if (btn) { btn.disabled = false; btn.textContent = '获取验证码'; }
    }
  };

  // 手机号 + 验证码一键登录（未注册自动开通）
  sync.loginWithSms = async function () {
    var server = ((document.getElementById('set-sync-server') || {}).value || '').trim().replace(/\/+$/, '') || DEFAULT_SERVER;
    var phone = (document.getElementById('set-sync-phone') || {}).value || '';
    var code = (document.getElementById('set-sync-code') || {}).value || '';
    if (!/^1\d{10}$/.test(phone)) { sync.setStatus('请输入正确的 11 位手机号', false); return; }
    if (!code) { sync.setStatus('请输入验证码', false); return; }
    var btn = document.getElementById('btn-sync-login');
    if (btn) { btn.disabled = true; btn.textContent = '登录中...'; }
    sync.setStatus('正在登录...');
    try {
      var data = await sync.api.smsLogin(server, phone, code);
      sync.auth.server = server;
      sync.auth.token = data.access_token;
      sync.auth.username = sync.auth.username || phone;
      saveAuth();
      sync.setStatus('登录成功，正在同步...');
      await sync.fullSync();
      sync.setStatus('已登录并同步完成', true);
      sync.loadSettingsUI();
      notifyAuthChange();
    } catch (e) {
      sync.setStatus('登录失败：' + (e.message || e), false);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '登录 / 注册'; }
    }
  };

  sync.logout = function () {
    sync.auth.token = null;
    sync.auth.username = null;
    saveAuth();
    sync.setStatus('已退出登录');
    sync.loadSettingsUI();
    notifyAuthChange();
  };

  // ========== 独立登录页专用 ==========
  function loginServer() {
    var el = document.getElementById('set-sync-server');
    return ((el && el.value) || sync.auth.server || DEFAULT_SERVER).trim().replace(/\/+$/, '');
  }
  sync.setLoginStatus = function (text, ok) {
    var el = document.getElementById('login-status');
    if (!el) return;
    el.textContent = text;
    el.className = 'login-status' + (ok ? ' ok' : (text ? ' err' : ''));
  };
  sync.sendCodeFromLogin = async function () {
    var phone = (document.getElementById('login-phone') || {}).value || '';
    if (!/^1\d{10}$/.test(phone)) { sync.setLoginStatus('请输入正确的 11 位手机号', false); return; }
    var btn = document.getElementById('login-btn-code');
    if (btn) { btn.disabled = true; btn.textContent = '发送中...'; }
    sync.setLoginStatus('正在发送验证码...');
    try {
      var data = await sync.api.sendSms(loginServer(), phone);
      var codeEl = document.getElementById('login-code');
      if (data && data.devCode && codeEl) codeEl.value = data.devCode;
      sync.setLoginStatus('验证码已发送' + (data && data.devCode ? '（演示码已自动填入）' : ''), true);
      var left = 60;
      var timer = setInterval(function () {
        left--;
        if (btn) btn.textContent = left > 0 ? (left + 's') : '重新获取';
        if (left <= 0) { clearInterval(timer); if (btn) btn.disabled = false; }
      }, 1000);
    } catch (e) {
      sync.setLoginStatus('发送失败：' + (e.message || e), false);
      if (btn) { btn.disabled = false; btn.textContent = '获取验证码'; }
    }
  };
  sync.loginWithSmsFromLogin = async function () {
    var phone = (document.getElementById('login-phone') || {}).value || '';
    var code = (document.getElementById('login-code') || {}).value || '';
    if (!/^1\d{10}$/.test(phone)) { sync.setLoginStatus('请输入正确的 11 位手机号', false); return; }
    if (!code) { sync.setLoginStatus('请输入验证码', false); return; }
    var btn = document.getElementById('login-btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = '登录中...'; }
    sync.setLoginStatus('正在登录...');
    try {
      var data = await sync.api.smsLogin(loginServer(), phone, code);
      sync.auth.server = loginServer();
      sync.auth.token = data.access_token;
      sync.auth.username = phone;
      saveAuth();
      sync.setLoginStatus('登录成功，正在同步...');
      await sync.fullSync();
      sync.setLoginStatus('已登录并同步完成', true);
      notifyAuthChange();
      setTimeout(function () { if (typeof closeLogin === 'function') closeLogin(); }, 700);
    } catch (e) {
      sync.setLoginStatus('登录失败：' + (e.message || e), false);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '登录 / 注册'; }
    }
  };
  sync.logoutFromLogin = function () {
    sync.logout();
    if (typeof openLogin === 'function') openLogin();
  };

  // 登录状态变化：通知 app.js 刷新 header 入口
  function notifyAuthChange() {
    if (typeof window.onSyncAuthChange === 'function') { try { window.onSyncAuthChange(); } catch (e) {} }
  }

  sync.syncNow = async function () {
    if (!sync.auth || !sync.auth.token) { sync.setStatus('请先登录', false); return; }
    var btn = document.getElementById('btn-sync-run');
    if (btn) { btn.disabled = true; btn.textContent = '同步中...'; }
    sync.setStatus('正在同步...');
    try {
      await sync.fullSync();
      sync.setStatus('同步完成：云端数据已合并', true);
    } catch (e) {
      sync.setStatus('同步失败：' + (e.message || e), false);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '同步'; }
    }
  };

  sync.setStatus = function (text, ok) {
    var el = document.getElementById('sync-status');
    if (!el) return;
    el.textContent = text;
    el.className = 'sync-status' + (ok ? ' ok' : (text === '未登录' ? '' : ' err'));
  };

  // 设置页打开时刷新登录状态 UI
  sync.loadSettingsUI = function () {
    var serverEl = document.getElementById('set-sync-server');
    if (serverEl) serverEl.value = sync.auth.server || DEFAULT_SERVER;
    var loggedIn = !!(sync.auth && sync.auth.token);
    var loginFields = document.getElementById('sync-login-fields');
    var passFields = document.getElementById('sync-pass-fields');
    var userRow = document.getElementById('sync-user-row');
    if (loginFields) loginFields.style.display = loggedIn ? 'none' : '';
    if (passFields) passFields.style.display = loggedIn ? 'none' : '';
    if (userRow) {
      userRow.style.display = loggedIn ? '' : 'none';
      if (loggedIn) {
        var nameEl = document.getElementById('sync-user-name');
        if (nameEl) nameEl.textContent = sync.auth.username || '';
      }
    }
    if (loggedIn) sync.setStatus('已登录，可随时同步');
    else sync.setStatus('未登录');
  };

  global.sync = sync;
})(window);