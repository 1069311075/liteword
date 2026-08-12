// ========== 持久化存储层 ==========
// 原生环境：使用 Capacitor Preferences（系统级持久化，数据在原生层保存，不受 WebView 清理影响）
// 浏览器环境：自动回退到 localStorage（用于预览调试）
// 首次启动：自动把旧的 localStorage 数据迁移到 Preferences，并清空 localStorage。
(function (global) {
  'use strict';

  var cache = {}; // 内存缓存，保证同步读取

  // 已知的业务键（用于启动时预加载 + 迁移）
  var KNOWN_KEYS = [
    'lw_config',
    'lw_records',
    'lw_onboard',
    'lw_streak',
    'lw_progress',
    'lw_custom_words',
    'lw_custom_cats',
    'lw_schema_version'
  ];

  function hasPreferences() {
    try {
      return !!(global.Capacitor && global.Capacitor.Plugins && global.Capacitor.Plugins.Preferences);
    } catch (e) { return false; }
  }

  var Store = {
    // 写入回调（供云同步等模块监听数据变化）：onWrite(key, valueString)
    _writeCbs: [],
    onWrite: function (cb) {
      if (typeof cb === 'function') Store._writeCbs.push(cb);
    },
    // 同步读取（从内存缓存，init 后即为最新）
    getItem: function (key) {
      return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : null;
    },
    // 同步写入（先写缓存，再异步持久化）
    setItem: function (key, value) {
      var str = String(value);
      cache[key] = str;
      if (hasPreferences()) {
        global.Capacitor.Plugins.Preferences.set({ key: key, value: str }).catch(function () {});
      } else {
        try { global.localStorage.setItem(key, str); } catch (e) {}
      }
      for (var i = 0; i < Store._writeCbs.length; i++) {
        try { Store._writeCbs[i](key, str); } catch (e) {}
      }
    },
    removeItem: function (key) {
      delete cache[key];
      if (hasPreferences()) {
        global.Capacitor.Plugins.Preferences.remove({ key: key }).catch(function () {});
      } else {
        try { global.localStorage.removeItem(key); } catch (e) {}
      }
    },
    // 启动时调用：加载全部数据到缓存，并迁移旧 localStorage 数据
    init: function () {
      var usePrefs = hasPreferences();
      var tasks = KNOWN_KEYS.map(function (key) {
        if (usePrefs) {
          return global.Capacitor.Plugins.Preferences.get({ key: key }).then(function (res) {
            var value = res && res.value != null ? res.value : null;
            if (value != null) {
              cache[key] = value;
            } else {
              // 迁移：旧数据在 localStorage 中
              var legacy = null;
              try { legacy = global.localStorage.getItem(key); } catch (e) {}
              if (legacy != null) {
                cache[key] = legacy;
                return global.Capacitor.Plugins.Preferences.set({ key: key, value: legacy })
                  .then(function () {
                    try { global.localStorage.removeItem(key); } catch (e) {}
                  }).catch(function () {});
              }
            }
            return null;
          }).catch(function () { return null; });
        }
        // 浏览器：直接读 localStorage
        try { cache[key] = global.localStorage.getItem(key); } catch (e) { cache[key] = null; }
        return Promise.resolve(null);
      });
      return Promise.all(tasks);
    }
  };

  /* ===== Schema 版本号接口 =====
   * 用途：记录当前数据契约（7 个业务 key 的字段结构）的版本。
   * 原则：只有当字段结构发生"破坏性变更"（新增必填字段、重命名、改类型、拆分 key）时才 +1。
   *      纯新增的可选字段、只改界面样式、只改逻辑，都不需要升版本。
   * 价值：这是将来接入"多设备同步"的契约锚点——同步时按版本号判断旧数据要不要迁移，
   *      避免因两台设备数据版本不一致而互相覆盖出问题。也是本地结构演进的安全网。
   */
  var SCHEMA_VERSION = 1;               // 当前版本。每次破坏性结构变更必须 +1。
  var STORAGE_KEY_SCHEMA = 'lw_schema_version';
  // 迁移注册表：MIGRATIONS[fromVersion][toVersion] = function(){}，从 from 升到 to 时执行。
  // 例如从 1 升到 2： MIGRATIONS[1] = { 2: function() { /* 把旧数据改成新结构 */ } };
  var MIGRATIONS = {};

  function readSchemaVersion() {
    var raw = Store.getItem(STORAGE_KEY_SCHEMA);
    var v = parseInt(raw, 10);
    return isNaN(v) ? 0 : v;            // 0 = 旧数据（尚无关版本号）
  }

  // 读取当前已落盘的 schema 版本号（0 表示旧数据）
  Store.getSchemaVersion = function () {
    return readSchemaVersion();
  };

  // 执行从当前版本到 SCHEMA_VERSION 的逐级迁移。
  // 返回迁移完成后的最终版本号。可传入 onMigrate/onError 回调跟踪进度。
  Store.runMigrations = function (opts) {
    opts = opts || {};
    var from = readSchemaVersion();
    if (from >= SCHEMA_VERSION) return from;
    var step = from;
    while (step < SCHEMA_VERSION) {
      var next = step + 1;
      var fn = MIGRATIONS[step] && MIGRATIONS[step][next];
      if (typeof fn === 'function') {
        try {
          fn();
          if (opts.onMigrate) opts.onMigrate(step, next);
        } catch (e) {
          if (opts.onError) opts.onError(e, step, next);
          break;                        // 迁移失败则停在当前版本，下次启动重试
        }
      }
      step = next;
    }
    Store.setItem(STORAGE_KEY_SCHEMA, String(step));
    return step;
  };

  global.Store = Store;
})(window);