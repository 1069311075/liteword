// ========== 7阶间隔配置（毫秒）==========
const INTERVALS = [
  0,
  0,       // 第1轮：立即（学完即可复习，便于即时测试）
  2 * 60 * 60 * 1000,   // 2小时
  24 * 60 * 60 * 1000,  // 1天
  2 * 24 * 60 * 60 * 1000, // 2天
  7 * 24 * 60 * 60 * 1000, // 7天
  15 * 24 * 60 * 60 * 1000, // 15天
];
// 忘记时回到的轮次
const FORGOT_RESET_ROUND = 1;

// ========== 数据层 ==========
const STORAGE_KEY_CONFIG = 'lw_config';
const STORAGE_KEY_RECORDS = 'lw_records';
const STORAGE_KEY_ONBOARD = 'lw_onboard';
const STORAGE_KEY_STREAK = 'lw_streak';
const STORAGE_KEY_PROGRESS = 'lw_progress';

let selectedCategories = new Set();

function getConfig() {
  const defaultConfig = { groupSize:20, notifyEnabled:false, notifyTime:'20:00', voiceType:'us', categories:['ai-prompt'], bgVideoUrl:'', bgVideoEnabled:true, themeMode:'frost', showHints:true, fontMode:'classic', calendarReview:false, calendarDefer:'08:00' };
  try {
    const saved = Store.getItem(STORAGE_KEY_CONFIG);
    return saved ? {...defaultConfig, ...JSON.parse(saved)} : defaultConfig;
  } catch(e) { return defaultConfig; }
}

// 返回当前用户已选中的场景集合（Set）
function getActiveCategories() {
  const config = getConfig();
  const cats = config.categories && config.categories.length>0 ? config.categories : null;
  return new Set(cats ? cats : ['ai-prompt']);
}

// 按用户已选场景返回某词应展示的释义列表。
// 主场景释义通常始终显示；但若该词的主场景未被选中、却有其它已选场景的专门义，
// 则只显示这些已选场景义（避免"只选 git 却看到酒店义"）。
function getVisibleMeanings(word, bw) {
  const active = getActiveCategories();
  const extra = (typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS) ? SCENE_WORD_MEANINGS[word] : null;
  // 词的主场景未被选中，但存在其它已选场景的专门义 → 只返回这些场景义
  if (bw && bw.category && extra) {
    const hasMainActive = active.has(bw.category);
    const hasExtraActive = Object.keys(extra).some(sc => active.has(sc));
    if (!hasMainActive && hasExtraActive) {
      const out = [];
      Object.keys(extra).forEach(sc => {
        if (active.has(sc)) extra[sc].forEach(m => { if (out.indexOf(m) === -1) out.push(m); });
      });
      return out;
    }
  }
  const base = bw && bw.meanings ? bw.meanings.slice() : [];
  if (!extra) return base;
  Object.keys(extra).forEach(scene => {
    if (active.has(scene)) {
      extra[scene].forEach(m => { if (base.indexOf(m) === -1) base.push(m); });
    }
  });
  return base;
}
function saveConfigData(config) { Store.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config)); }

// 返回某词在当前已选场景下"实际展示的场景义集合"。
// 与 getVisibleMeanings 的判定逻辑保持一致：
//  - 关键场景未选、但其它场景义已选 → 只算这些场景义
//  - 否则 = 主场景（若已选）+ 所有已选场景义
function getVisibleSceneKeys(word, bw) {
  const active = getActiveCategories();
  const out = new Set();
  const extra = (typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS) ? SCENE_WORD_MEANINGS[word] : null;
  const mainCat = bw ? bw.category : null;
  // 与 getVisibleMeanings 相同的"只显示场景义"分支
  if (bw && mainCat && extra) {
    const hasMainActive = active.has(mainCat);
    const hasExtraActive = Object.keys(extra).some(sc => active.has(sc));
    if (!hasMainActive && hasExtraActive) {
      Object.keys(extra).forEach(sc => { if (active.has(sc)) out.add(sc); });
      return out;
    }
  }
  if (mainCat && active.has(mainCat)) out.add(mainCat);
  if (extra) {
    Object.keys(extra).forEach(sc => { if (active.has(sc)) out.add(sc); });
  }
  return out;
}

// 返回某词"当前实际展示的场景"：主场景未选中、但有其它已选场景的专门义时，取该已选场景；
// 否则返回主场景。用于确定例句、场景标签等应使用哪个场景。
function getDisplayCategory(w) {
  const active = getActiveCategories();
  const mainCat = w ? w.category : null;
  if (mainCat && !active.has(mainCat)) {
    const extra = (typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS) ? SCENE_WORD_MEANINGS[w.word] : null;
    if (extra) {
      for (const sc of Object.keys(extra)) {
        if (active.has(sc)) return sc;
      }
    }
  }
  return mainCat;
}
// 将当前词在"当前已选场景"下展示的场景义标记为已学，写入 learnedScenes。
// 这样按词记录学习进度时，能精确区分哪些场景义已学过、哪些还没学，
// 从而实现：在场景A学过该义，切到场景B时若B义未学，则该词会再次出现。
function recordLearnedScenes(records, w) {
  const rec = records[w.word];
  if (!rec) return;
  const bw = WORD_BANK.find(b => b.word === w.word);
  const visible = getVisibleSceneKeys(w.word, bw || w);
  const learned = new Set(rec.learnedScenes || []);
  visible.forEach(sc => learned.add(sc));
  rec.learnedScenes = Array.from(learned);
}
function getRecords() {
  try { return Store.getItem(STORAGE_KEY_RECORDS) ? JSON.parse(Store.getItem(STORAGE_KEY_RECORDS)) : {}; }
  catch(e) { return {}; }
}
function saveRecords(records) { Store.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records)); }

// 清理孤儿学习记录：删除不属于当前词库（WORD_BANK）的残留记录。
// 用于删除/清除自定义词库后，避免不可复习的旧记录污染复习队列与掌握统计。
// 必须在 mergeCustomWords() 重建 WORD_BANK 之后调用。
function cleanupOrphanRecords() {
  const records = getRecords();
  let changed = false;
  for (const w in records) {
    if (!WORD_BANK.some(b => b.word === w)) { delete records[w]; changed = true; }
  }
  if (changed) saveRecords(records);
}

// 综合复习：把某词所有"已学过"的场景释义整合在一起展示。
// 基础释义（主场景已学）+ 每个已学场景的专门释义（带场景标签）。
// 复习不依赖当前专注词库，跨词库整合已掌握的词义。
function getReviewMeanings(word, rec) {
  const bw = WORD_BANK.find(b => b.word === word);
  const learned = (rec && rec.learnedScenes && rec.learnedScenes.length) ? new Set(rec.learnedScenes) : null;
  const out = [];
  const add = (m, label) => {
    let text;
    if (label) {
      // 复习：释义 + 场景软标签（简洁克制，同时让用户看出是哪个场景）
      text = m + ' <em class="rm-scene">· ' + label + '</em>';
    } else {
      text = m;
    }
    if (out.indexOf(text) === -1) out.push(text);
  };
  if (bw && bw.meanings && bw.meanings.length) {
    const mainCat = bw.category;
    // 无 learnedScenes（旧数据）或主场景已学过 → 展示基础释义
    if (!learned || learned.has(mainCat)) {
      // 基础释义也标注主场景，让复习时每个含义都能看出归属场景
      const baseLabel = mainCat ? (SCENE_LABELS[mainCat] || mainCat) : null;
      bw.meanings.forEach(m => add(m, baseLabel));
    }
  }
  if (learned && typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS && SCENE_WORD_MEANINGS[word]) {
    Object.keys(SCENE_WORD_MEANINGS[word]).forEach(sc => {
      if (!learned.has(sc)) return;
      SCENE_WORD_MEANINGS[word][sc].forEach(m => add(m, SCENE_LABELS[sc] || sc));
    });
  }
  return out;
}

// ========== 学习进度持久化（中断恢复） ==========
function saveStudyProgress() {
  if (!currentQueue || currentQueue.length === 0) return;
  try {
    const progress = {
      queue: currentQueue.map(w => w.word),
      index: currentIndex,
      mode: currentMode,
      startCount: studyStartCount,
      startTime: studyStartTime,
      processed: [...processedIndices]
    };
    Store.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch(e) {}
}
function clearStudyProgress() {
  Store.removeItem(STORAGE_KEY_PROGRESS);
}
function getStudyProgress() {
  try {
    const s = Store.getItem(STORAGE_KEY_PROGRESS);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}
function resumeStudy() {
  const p = getStudyProgress();
  if (!p || !p.queue || p.queue.length === 0) return false;
  const records = getRecords();
  // 从 WORD_BANK 重建队列对象
  const queue = p.queue.map(word => {
    const bw = WORD_BANK.find(b => b.word === word);
    if (!bw) return null;
    const rec = records[word];
    const round = rec && typeof rec.currentRound === 'number' ? rec.currentRound : 1;
    return {...bw, mode: p.mode === 'review' ? 'review' : 'new', _round: round};
  }).filter(Boolean);
  if (queue.length === 0) { clearStudyProgress(); return false; }
  currentQueue = queue;
  currentIndex = Math.min(p.index, queue.length - 1);
  currentMode = p.mode;
  studyStartCount = p.startCount;
  studyStartTime = p.startTime;
  processedIndices = new Set(p.processed || []);
  slideDirection = 'right';
  // 恢复学习模式文字
  document.getElementById('study-mode').textContent = p.mode === 'review' ? '复习旧词' : '学习新词';
  showPage('study');
  showCurrentWord();
  return true;
}

// ========== 连续学习天数 ==========
function getStreak() {
  try {
    const s = Store.getItem(STORAGE_KEY_STREAK);
    return s ? JSON.parse(s) : { count:0, lastDate:null };
  } catch(e) { return { count:0, lastDate:null }; }
}
function saveStreak(streak) { Store.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak)); }
function updateStreak() {
  const today = new Date().toDateString();
  const s = getStreak();
  if (s.lastDate === today) return s.count; // 今天已记录
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (s.lastDate === yesterday) {
    s.count = (s.count||0) + 1;
  } else {
    s.count = 1;
  }
  s.lastDate = today;
  saveStreak(s);
  return s.count;
}

// ========== SRS算法 ==========
function calcNextReview(currentRound, now) { return now + (INTERVALS[currentRound] || 0); }

// 格式化剩余时间
function formatTimeUntil(timestamp) {
  if (!timestamp || timestamp<=0) return null;
  const diff = timestamp - Date.now();
  if (diff <= 0) return '现在';
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return '即将';
  if (mins < 60) return mins + '分钟后';
  if (hours < 24) return hours + '小时后';
  if (days === 1) return '明天';
  if (days < 7) return days + '天后';
  if (days < 15) return '下周';
  return Math.floor(days/7) + '周后';
}

// 获取最近到期词的时间
function getNextDueTime(records) {
  const now = Date.now();
  let earliest = Infinity;
  Object.values(records).forEach(r => {
    if (r.currentRound > 0 && r.currentRound < 7 && r.nextReviewTime > now) {
      if (r.nextReviewTime < earliest) earliest = r.nextReviewTime;
    }
  });
  return earliest === Infinity ? null : earliest;
}

// 更新记忆进度点
function updateMemoryDots(word) {
  const records = getRecords();
  const rec = records[word];
  const dotsEl = document.getElementById('memory-dots');
  if (!dotsEl) return;
  let round = 0;
  if (rec) round = rec.currentRound || 0;
  if (round === 0) {
    dotsEl.classList.remove('visible');
    return;
  }
  let html = '';
  for (let i = 1; i <= 7; i++) {
    let cls = 'mdot';
    if (i < round) cls += ' mastered';
    else if (i === round) cls += ' active';
    html += '<div class="'+cls+'"></div>';
  }
  html += '<span class="mdots-label">'+round+'/7</span>';
  dotsEl.innerHTML = html;
  dotsEl.classList.add('visible');
}
function getDueWords(records) {
  const now = Date.now();
  return Object.entries(records).filter(([w,r]) => {
    // 仅统计当前词库（WORD_BANK）中确实可复习的词，
    // 排除已删除词库残留的学习记录（孤儿词），避免空复习与按钮误点亮
    if (!WORD_BANK.some(b => b.word === w)) return false;
    // 严格过滤：必须有有效轮次、未掌握、且到了复习时间
    const round = r.currentRound;
    if (typeof round !== 'number' || isNaN(round) || round <= 0 || round >= 7) return false;
    // nextReviewTime 必须是未来的有效时间戳
    if (typeof r.nextReviewTime !== 'number' || r.nextReviewTime <= 0) return false;
    return r.nextReviewTime <= now;
  }).map(([w])=>w);
}
// 判断某词在当前已选场景下是否"还有未学过的场景义"
// 返回 true 表示该词应纳入学习（有冲动要学的新场景义）；false 表示在当前场景下已全部学过
function isSceneLearnable(w, word, records) {
  const rec = records[word];
  // 完全没学过 → 纳入
  if (!rec || typeof rec.currentRound !== 'number' || rec.currentRound <= 0) return true;
  // 学过但未掌握，且当前场景下还有未学过的场景义 → 纳入
  // learnedScenes 记录已学过的场景义集合；未记录时视为主场景义已学
  const learned = (rec.learnedScenes && rec.learnedScenes.length) ? new Set(rec.learnedScenes) : null;
  // 当前展示的场景义集合
  const visible = getVisibleSceneKeys(word, w);
  // 若 learnedScenes 未初始化（旧数据），且当前展示的场景就是词的主场景 → 视为已学，不重复
  if (!learned) {
    // 旧数据无 learnedScenes：仅当该词有多个可见场景义且至少一个未学时纳入
    // 简化：无 learnedScenes 时，只有当前展示集合包含主场景之外的新场景义才纳入
    const mainCat = w ? w.category : null;
    const hasNewScene = [...visible].some(sc => sc !== mainCat);
    return hasNewScene;
  }
  // 有 learnedScenes：检查当前展示的场景义是否都已学过
  for (const sc of visible) {
    if (!learned.has(sc)) return true;
  }
  return false;
}

// 返回某词在当前已选场景集合下的"归属词库"。
// 归属规则（与 getSceneLearnableCounts 一致）：主分类已选则归主分类；
// 否则归该词第一个已选场景义。用于学习时按词库独立取词。
function getAssignedScene(w, active) {
  if (active.has(w.category)) return w.category;
  if (SCENE_WORD_MEANINGS && SCENE_WORD_MEANINGS[w.word]) {
    const hit = Object.keys(SCENE_WORD_MEANINGS[w.word]).find(sc => active.has(sc));
    return hit || null;
  }
  return null;
}

// 返回每个选中场景当前"可学词全量"统计，口径与 getNewWords 在首次学习时完全一致（含跨场景义与合成词）。
// total = 该场景可学词全量（稳定值，不随学习进度减少，学完后显示 N/N 而非 0/N）；
// learned = 其中已学过的词数（currentRound > 0）。
// 每词归属到唯一场景：主分类已选则归主分类，否则归给定词上第一个已选场景义。
// 首次学习时 total 之和恒等于 getNewWords().length，保证词库气泡总词数 = 顶部新词数。
function getSceneLearnableCounts(records) {
  const config = getConfig();
  const cats = (config.categories && config.categories.length>0) ? config.categories : ['ai-prompt'];
  const active = new Set(cats);
  const out = {};
  cats.forEach(c => out[c] = { total:0, learned:0, mastered:0 });
  function add(word, w, scene) {
    out[scene].total++;
    const rec = records[word];
    if (rec && typeof rec.currentRound === 'number' && rec.currentRound > 0) out[scene].learned++;
    if (rec && rec.currentRound === 7) out[scene].mastered++;
  }
  WORD_BANK.forEach(w => {
    const ass = getAssignedScene(w, active);
    if (ass) add(w.word, w, ass);
  });
  // 合成词（不在 WORD_BANK、仅有场景义）
  if (SCENE_WORD_MEANINGS) {
    Object.keys(SCENE_WORD_MEANINGS).forEach(word => {
      if (WORD_BANK.some(w => w.word === word)) return;
      const hit = Object.keys(SCENE_WORD_MEANINGS[word]).find(sc => active.has(sc));
      if (hit) add(word, { word: word, category: hit }, hit);
    });
  }
  return out;
}

// 返回某词库当前"可学新词"列表（归属该词库、且 isSceneLearnable 为真）。
// 用于"每组独立学习"：一次只从单个词库取词，学完只影响该词库。
function getLearnableWordsForScene(records, scene) {
  const active = new Set(getConfig().categories || []);
  const result = [];
  WORD_BANK.forEach(w => {
    if (getAssignedScene(w, active) !== scene) return;
    if (isSceneLearnable(w, w.word, records)) result.push(w);
  });
  if (SCENE_WORD_MEANINGS) {
    Object.keys(SCENE_WORD_MEANINGS).forEach(word => {
      if (WORD_BANK.some(w => w.word === word)) return;
      const hit = Object.keys(SCENE_WORD_MEANINGS[word]).find(sc => active.has(sc));
      if (hit !== scene) return;
      const meanings = SCENE_WORD_MEANINGS[word][hit] || [];
      const synth = { word: word, phonetic: '', meanings: meanings, sentence: '', category: hit, _synthetic: true };
      if (isSceneLearnable(synth, word, records)) result.push(synth);
    });
  }
  return result;
}

function getNewWords(records) {
  const config = getConfig();
  const cats = config.categories && config.categories.length>0 ? config.categories : null;
  const active = cats ? new Set(cats) : null;
  const result = [];

  WORD_BANK.forEach(w => {
    if (!active) { result.push(w); return; }
    // 该词在当前已选场景下是否应纳入（主场景已选 或 有其它已选场景专门义）
    const sceneRelevant = active.has(w.category) || (SCENE_WORD_MEANINGS && SCENE_WORD_MEANINGS[w.word] && Object.keys(SCENE_WORD_MEANINGS[w.word]).some(sc => active.has(sc)));
    if (!sceneRelevant) return;
    if (isSceneLearnable(w, w.word, records)) result.push(w);
  });
  // 补充：仅在 SCENE_WORD_MEANINGS 有场景义、但不在 WORD_BANK 的词（如 menu、reset）
  // 为它们合成临时词条，保证所选场景能学到这些场景义
  if (active && SCENE_WORD_MEANINGS) {
    Object.keys(SCENE_WORD_MEANINGS).forEach(word => {
      if (WORD_BANK.some(w => w.word === word)) return; // 已在词库，跳过
      const extraMap = SCENE_WORD_MEANINGS[word];
      const hitScene = Object.keys(extraMap).find(sc => active.has(sc));
      if (!hitScene) return;
      const meanings = extraMap[hitScene] || [];
      const synth = { word: word, phonetic: '', meanings: meanings, sentence: '', category: hitScene, _synthetic: true };
      if (isSceneLearnable(synth, word, records)) result.push(synth);
    });
  }
  return result;
}
function getMasteredCount(records) { return Object.values(records).filter(r=>r.currentRound===7).length; }

// 累计掌握（历史峰值，防止重置后丢失——直接读 records 为准）
function getCumulativeMastered(records) { return getMasteredCount(records); }

// ========== 学习状态 ==========
let currentQueue = [];
let currentIndex = 0;
let currentMode = 'learn';
let studyStartCount = 0;
let studyStartTime = 0;
let answerRevealed = false;

// ========== 页面切换 ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  // 完成页和首页时隐藏右侧深度面板
  const rightPanel = document.querySelector('.panel-right');
  if (rightPanel) {
    if (name==='done' || name==='home' || name==='settings') {
      rightPanel.style.opacity = '0';
      rightPanel.style.pointerEvents = 'none';
    } else {
      rightPanel.style.opacity = '';
      rightPanel.style.pointerEvents = '';
    }
  }
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2000);
}

// 数字滚动动画（带取消机制，避免多次调用叠加）
const _animFrames = new Map();
function animateNumber(el, from, to, duration) {
  if (!el) return;
  if (_animFrames.has(el)) cancelAnimationFrame(_animFrames.get(el));
  const start = performance.now();
  const diff = to - from;
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + diff * eased);
    if (t < 1) { _animFrames.set(el, requestAnimationFrame(step)); }
    else { _animFrames.delete(el); }
  }
  _animFrames.set(el, requestAnimationFrame(step));
}
function animateText(el, from, to, duration, suffix) {
  if (!el) return;
  if (_animFrames.has(el)) cancelAnimationFrame(_animFrames.get(el));
  const start = performance.now();
  const diff = to - from;
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + diff * eased) + (suffix||'');
    if (t < 1) { _animFrames.set(el, requestAnimationFrame(step)); }
    else { _animFrames.delete(el); }
  }
  _animFrames.set(el, requestAnimationFrame(step));
}

// 学习热力图
let _hmSelectedCell = null;
function renderHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  if (!grid) return;
  grid.innerHTML = '';
  _hmSelectedCell = null;
  const records = getRecords();
  // 构建日期->学习数量映射
  const dateMap = {};
  Object.values(records).forEach(r => {
    // createTime = 首次学习日期
    if (r.createTime) {
      const d = new Date(r.createTime).toDateString();
      dateMap[d] = (dateMap[d]||0) + 1;
    }
    // lastReviewTime = 最后复习日期
    if (r.lastReviewTime) {
      const d = new Date(r.lastReviewTime).toDateString();
      dateMap[d] = (dateMap[d]||0) + 1;
    }
  });
  // 生成最近30天
  const days = 30;
  const today = new Date();
  // 取最近30天内单日学习量的最大值，用于按相对强度归一化颜色
  let maxCount = 0;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const c = dateMap[date.toDateString()] || 0;
    if (c > maxCount) maxCount = c;
  }
  let firstActiveIdx = -1; // 第一个有学习记录的格子（用于默认选中）
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const ds = date.toDateString();
    const count = dateMap[ds] || 0;
    const cell = document.createElement('div');
    // 归一化：当天量相对最大值映射到 1~4 级，最高的一天永远最深
    let level = 0;
    if (count > 0 && maxCount > 0) {
      level = Math.max(1, Math.min(4, Math.ceil(count / maxCount * 4)));
    }
    cell.className = 'hm-cell hm-' + level;
    // 存储数据供 tooltip 使用
    const dateStr = (date.getMonth()+1)+'月'+date.getDate()+'日';
    cell.dataset.date = dateStr;
    cell.dataset.count = count;
    cell.dataset.level = level;
    // 绑定交互：hover + tap 都显示 tooltip
    cell.addEventListener('mouseenter', () => showHmTooltip(cell));
    cell.addEventListener('mouseleave', () => hideHmTooltip());
    cell.addEventListener('click', () => {
      // 点击：选中状态切换
      if (_hmSelectedCell) _hmSelectedCell.classList.remove('selected');
      _hmSelectedCell = cell;
      cell.classList.add('selected');
      showHmTooltip(cell);
    });
    // 入场动画延迟
    cell.style.opacity = '0';
    cell.style.transform = 'scale(0.3)';
    cell.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      cell.style.opacity = '1';
      cell.style.transform = 'scale(1)';
    }, i * 15);
    grid.appendChild(cell);
    // 记录最后一个有记录的格子（即最近的一天有记录）用于默认选中
    if (count > 0 && firstActiveIdx === -1) {
      // 不立即选中，动画完成后再选
    }
  }
  // 点击空白处取消选中
  document.getElementById('heatmap-grid').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      if (_hmSelectedCell) { _hmSelectedCell.classList.remove('selected'); _hmSelectedCell = null; }
      hideHmTooltip();
    }
  });
}
// 热力图 tooltip
function showHmTooltip(cell) {
  const tip = document.getElementById('hm-tooltip');
  if (!tip) return;
  tip.querySelector('.hm-tip-date').textContent = cell.dataset.date;
  const cnt = parseInt(cell.dataset.count);
  tip.querySelector('.hm-tip-count').textContent = cnt > 0 ? cnt + ' 词' : '未学习';
  // 定位到格子上方
  const grid = document.getElementById('heatmap-grid');
  const gridRect = grid.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();
  const left = cellRect.left - gridRect.left + cellRect.width / 2;
  tip.style.left = left + 'px';
  tip.classList.add('visible');
}
function hideHmTooltip() {
  const tip = document.getElementById('hm-tooltip');
  if (tip) tip.classList.remove('visible');
}
function showConfirm(title, msg) {
  return new Promise(resolve => {
    const mask = document.getElementById('modal-mask');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-msg').textContent = msg;
    mask.classList.add('show');
    const ok = document.getElementById('modal-ok');
    const cancel = document.getElementById('modal-cancel');
    function hOk(){ cleanup(); resolve(true); }
    function hCancel(){ cleanup(); resolve(false); }
    function hMask(e){ if(e.target===mask){ cleanup(); resolve(false); } }
    function cleanup(){
      mask.classList.remove('show');
      ok.removeEventListener('click',hOk); cancel.removeEventListener('click',hCancel);
      mask.removeEventListener('click',hMask);
    }
    ok.addEventListener('click',hOk); cancel.addEventListener('click',hCancel); mask.addEventListener('click',hMask);
  });
}

// ========== 首页刷新 ==========
function refreshHome() {
  const config = getConfig();
  const records = getRecords();
  const dueWords = getDueWords(records);
  const newWords = getNewWords(records);
  const mastered = getMasteredCount(records);

  const reviewBtn = document.getElementById('btn-review');
  const reviewBadge = document.getElementById('review-count');
  const reviewSub = document.getElementById('review-sub');
  const reviewTitle = reviewBtn.querySelector('.main-btn-title');
  const cats = config.categories && config.categories.length>0 ? config.categories : null;
  const learnedWords = Object.keys(records).filter(w => {
    const r = records[w];
    if (!r || typeof r.currentRound !== 'number' || r.currentRound <= 0) return false;
    if (cats) {
      const bw = WORD_BANK.find(b => b.word === w);
      if (bw) {
        return cats.includes(bw.category);
      }
      return true;
    }
    return true;
  });
  if (dueWords.length>0) {
    reviewBtn.classList.remove('empty'); reviewBtn.style.pointerEvents='auto';
    reviewBadge.textContent = dueWords.length+'词';
    reviewSub.textContent = '综合已学词义';
    if (reviewTitle) reviewTitle.textContent = '开始复习';
    reviewBtn.onclick = () => startReview();
  } else {
    // 没有到期词：展示下次复习倒计时，按钮置灰
    reviewBtn.classList.add('empty'); reviewBtn.style.pointerEvents='none';
    const nextTime = getNextDueTime(records);
    reviewBadge.textContent = '暂无';
    reviewSub.textContent = nextTime ? '下次复习 '+formatTimeUntil(nextTime) : '暂无待复习';
    if (reviewTitle) reviewTitle.textContent = '开始复习';
  }

  const learnBtn = document.getElementById('btn-learn');
  const learnBadge = document.getElementById('learn-count');
  const learnSub = document.getElementById('learn-sub');
  const learnTitle = learnBtn.querySelector('.main-btn-title');
  // 单词库优先：当前专注词库 = 已选词库的第一个
  const activeScene = (config.categories && config.categories.length>0) ? config.categories[0] : 'ai-prompt';
  const curNewWords = getLearnableWordsForScene(records, activeScene);
  if (curNewWords.length > 0) {
    learnBtn.classList.remove('empty'); learnBtn.style.pointerEvents='auto';
    const count = Math.min(config.groupSize, curNewWords.length);
    const curLabel = SCENE_LABELS[activeScene] || activeScene;
    learnBadge.textContent = count+'词';
    learnSub.textContent = curLabel + ' · 专注学习';
    if (learnTitle) learnTitle.textContent = '学一组新词';
    learnBtn.onclick = () => startLearn();
  } else {
    const curLabel = SCENE_LABELS[activeScene] || activeScene;
    learnBtn.classList.add('empty'); learnBtn.style.pointerEvents='none';
    learnBadge.textContent = '已学完';
    learnSub.textContent = '「' + curLabel + '」已学完，可切换词库';
    if (learnTitle) learnTitle.textContent = '学一组新词';
  }

  // 环形进度图（并入词库大按钮）：中心数字 = 当前专注词库的总词数（与词列表同口径，含合成场景词）；
  // 环形填充 = 该词库的加权学习进度；完成度/连续天数写入词库大按钮 meta。
  const ringWords = getWordsForCat(activeScene);
  const ringTotal = ringWords.length;
  let ringLearnedW = 0;
  ringWords.forEach(it => {
    const rec = it.rec;
    if (rec && typeof rec.currentRound === 'number' && !isNaN(rec.currentRound) && rec.currentRound > 0) {
      ringLearnedW += Math.min(rec.currentRound / 7, 1);
    }
  });
  const ringFill = document.getElementById('ring-fill');
  const ringNum = document.getElementById('ring-num');
  const pct = ringTotal>0 ? ringLearnedW/ringTotal : 0;
  const circumference = 326.7; // 2*PI*52
  if (ringFill) ringFill.style.strokeDashoffset = circumference * (1 - pct);
  if (ringNum) animateNumber(ringNum, 0, ringTotal, 800);
  // 词库大按钮：名称 + 完成度 + 连续天数
  const libBigName = document.getElementById('lib-big-name');
  if (libBigName) {
    libBigName.textContent = (config.categories && config.categories.length > 0)
      ? (SCENE_LABELS[activeScene] || activeScene)
      : '点击选择词库';
  }
  const streak = getStreak();
  const libBigMeta = document.getElementById('lib-big-meta');
  if (libBigMeta) libBigMeta.textContent = '完成度 ' + Math.round(pct*100) + '% · 连续 ' + streak.count + ' 天';

  // 热力图
  renderHeatmap();

  // 数字动画
  animateNumber(document.getElementById('stat-review'), 0, dueWords.length, 600);
  animateNumber(document.getElementById('stat-new'), 0, newWords.length, 600);
  animateNumber(document.getElementById('stat-done'), 0, mastered, 600);

  document.getElementById('set-groupSize').value = config.groupSize;
  const bgVideoName = document.getElementById('bg-video-name');
  if (bgVideoName) {
    bgVideoName.textContent = config.bgVideoUrl && config.bgVideoUrl !== DEFAULT_BG_VIDEO
      ? '已选择自定义视频' : '从相册选择视频文件';
  }
  updateBgVideoUI();
  // 同步口音选择
  const voiceUs = document.getElementById('voice-us');
  const voiceUk = document.getElementById('voice-uk');
  if (voiceUs) voiceUs.classList.toggle('active', config.voiceType !== 'uk');
  if (voiceUk) voiceUk.classList.toggle('active', config.voiceType === 'uk');
  updateNotifyButton();
  updateCalendarButton();
}

// ========== 词库管理面板 ==========
function openLibPanel() {
  document.getElementById('lib-mask').classList.add('show');
  renderLibPanelList();
}
function closeLibPanel() {
  document.getElementById('lib-mask').classList.remove('show');
}
// 统一词库进度/状态口径：所有词库（无论选中与否）都用同一词集与学习记录计算，
// 保证同一词库在"未选中"与"选中"时显示的进度条、百分比、状态完全一致。
function libStats(cat) {
  const records = getRecords();
  const items = getWordsForCat(cat);
  let total = items.length, learned = 0, mastered = 0, score = 0;
  items.forEach(it => {
    const r = it.rec;
    if (r && typeof r.currentRound === 'number' && !isNaN(r.currentRound) && r.currentRound > 0) {
      learned++;
      score += Math.min(r.currentRound / 7, 1);
      if (r.currentRound === 7) mastered++;
    }
  });
  return {
    total,
    learned,
    mastered,
    // 加权掌握度均值，与首页进度环一致
    progress: total > 0 ? score / total : 0
  };
}
function renderLibPanelList() {
  const config = getConfig();
  const records = getRecords();
  const cats = config.categories || [];
  const activeCat = cats[0] || null;
  // 选中词库的 total 需与顶部新词数对齐（可学新词 = 选中分类词数）
  const learnable = getSceneLearnableCounts(records);

  const builtInOrder = ['ai-prompt','ai-model','git','devops','ios','software','travel-air','travel-stay'];
  const allCats = [...builtInOrder];
  // 补充自定义词库分类（含导入词库标签）
  Object.keys(SCENE_LABELS || {}).forEach(cat => {
    if (!allCats.includes(cat)) allCats.push(cat);
  });

  const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  const listEl = document.getElementById('lib-panel-list');
  const countEl = document.getElementById('lib-panel-count');
  if (countEl) countEl.textContent = activeCat ? (SCENE_LABELS[activeCat] || activeCat) : '未选择';

  let html = '';
  allCats.forEach(cat => {
    // 统一口径：进度/状态来自同一词集与学习记录，选中与未选显示一致
    const st = libStats(cat);
    const wordCount = st.total; // 词库实际词数（在 learnable 覆盖前保留）
    // 选中词库 total 与顶部新词数对齐
    if (activeCat === cat && learnable[cat]) st.total = learnable[cat].total;
    const label = SCENE_LABELS[cat] || cat;
    const isSelected = activeCat === cat;
    // "已完成"统一用掌握口径（currentRound===7），与首页完成度一致
    const isDone = (st.total > 0 && st.mastered === st.total);
    const isLearning = st.learned > 0 && !isDone;
    const progress = st.progress;

    let statusText = '未开始';
    let statusClass = '';
    if (isDone) { statusText = '已完成'; statusClass = 'done'; }
    else if (isLearning) { statusText = '学习中'; statusClass = 'learning'; }

    const itemClass = 'lib-item lg' + (isSelected ? ' selected' : '') + (isDone ? ' done' : '');
    const isBuiltin = BUILTIN_SCENE_KEYS.has(cat);
    const pct = Math.round(progress * 100);
    const wlIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
    html += '<div class="'+itemClass+'" data-cat="'+cat+'" onclick="toggleCategory(this)">';
    html += '<div class="lib-check">'+checkSvg+'</div>';
    html += '<div class="lib-item-body">';
    // 行1：名称 + 词数 + 状态
    html += '<div class="lib-item-title-row">';
    html += '<div class="lib-item-name-wrap">';
    html += '<div class="lib-item-name">'+label+'</div>';
    html += '<span class="lib-item-count">'+wordCount+' 词</span>';
    html += '</div>';
    html += '<span class="lib-item-status '+statusClass+'">'+statusText+'</span>';
    html += '</div>';
    // 行2：进度条 + 百分比 + 操作（浓缩为单行，紧凑）
    html += '<div class="lib-item-progress-row">';
    html += '<div class="lib-progress-bar"><div class="lib-progress-fill" style="width:'+pct+'%"></div></div>';
    html += '<span class="lib-item-pct">'+pct+'%</span>';
    html += '<div class="lib-item-actions">';
    html += '<button class="lib-wordlist-btn" onclick="event.stopPropagation();openWordList(\''+cat+'\')">'+wlIcon+'<span>词表</span></button>';
    if (!isBuiltin) {
      html += '<button class="lib-del-btn" onclick="event.stopPropagation();deleteCustomLib(\''+cat+'\',\''+label+'\')">删除</button>';
    } else if (isDone && st.learned > 0) {
      html += '<button class="lib-reset-btn" onclick="event.stopPropagation();resetCategoryProgress(\''+cat+'\',\''+label+'\')" title="重置此词库进度">↻</button>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });

  listEl.innerHTML = html;
}

// 重置单个词库分类的学习进度
function resetCategoryProgress(cat, label) {
  showConfirm('重置「' + label + '」', '这将清除该词库中所有词的学习记录，确定要重置吗？').then(ok => {
    if (!ok) return;
    const records = getRecords();
    // 找出该分类下的所有词
    const catWords = new Set();
    WORD_BANK.forEach(w => {
      if ((w.category || '') === cat) {
        catWords.add(w.word);
      }
    });
    // 删除这些词的记录
    let removed = 0;
    catWords.forEach(w => {
      if (records[w]) {
        delete records[w];
        removed++;
      }
    });
    saveRecords(records);
    toast('已重置「' + label + '」的' + removed + '个词');
    renderLibPanelList();
    refreshHome();
  });
}

// ========== 词库分类切换（单词库优先：一次只专注一个词库） ==========
function toggleCategory(el) {
  const cat = el.dataset.cat;
  const catName = el.querySelector('.lib-item-name') ? el.querySelector('.lib-item-name').textContent : cat;
  const config = getConfig();
  let cats = config.categories || [];
  if (cats[0] === cat) { toast('「' + catName + '」已是当前学习词库'); return; }
  cats = [cat];
  config.categories = cats;
  saveConfigData(config);
  toast('当前专注学习「' + catName + '」');
  renderLibPanelList();
  refreshHome();
}

// ========== 词表面板 ==========
let _wordlistCat = null;
let _wordlistFilter = 'all';
function openWordList(cat) {
  _wordlistCat = cat;
  _wordlistFilter = 'all';
  document.getElementById('wordlist-title').textContent = SCENE_LABELS[cat] || cat;
  // 关闭底层词库管理面板，避免双层遮罩导致背景过亮（与词库市场观感一致）
  document.getElementById('lib-mask').classList.remove('show');
  document.getElementById('wordlist-mask').classList.add('show');
  renderWordList();
}
function closeWordList() {
  document.getElementById('wordlist-mask').classList.remove('show');
  // 返回词库管理面板
  document.getElementById('lib-mask').classList.add('show');
}
function setWordFilter(f) {
  _wordlistFilter = f;
  document.querySelectorAll('#wordlist-tabs .wl-tab').forEach(t => t.classList.toggle('active', t.dataset.f === f));
  renderWordList();
}
// 获取某词库的所有词（含合成场景词）
function getWordsForCat(cat) {
  const records = getRecords();
  const items = [];
  const seen = new Set();
  WORD_BANK.forEach(w => {
    if (w.category === cat && !seen.has(w.word)) {
      seen.add(w.word);
      items.push({ word:w.word, phonetic:w.phonetic||'', meanings:w.meanings||[], rec:records[w.word], scene:null });
    }
  });
  // 合成词（在 SCENE_WORD_MEANINGS 有该场景义、但在 WORD_BANK 主分类下的词）
  if (typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS) {
    Object.keys(SCENE_WORD_MEANINGS).forEach(word => {
      if (WORD_BANK.some(w => w.word === word)) return; // 已在主词库
      if (SCENE_WORD_MEANINGS[word][cat]) {
        seen.add(word);
        items.push({ word:word, phonetic:'', meanings:SCENE_WORD_MEANINGS[word][cat], rec:records[word], scene:cat });
      }
    });
  }
  return items;
}
function renderWordList() {
  const listEl = document.getElementById('wordlist-list');
  if (!listEl || !_wordlistCat) return;
  const records = getRecords();
  const _now = Date.now();
  let items = getWordsForCat(_wordlistCat);
  // 学习状态分类
  items.forEach(it => {
    const round = it.rec && it.rec.currentRound || 0;
    it._mastered = round >= 7;
    it._learning = round > 0 && round < 7;
    it._unlearned = round <= 0;
    it._due = it._learning && it.rec.nextReviewTime <= _now;
  });
  // 过滤
  if (_wordlistFilter === 'due') items = items.filter(it => it._due);
  else if (_wordlistFilter === 'learning') items = items.filter(it => it._learning);
  else if (_wordlistFilter === 'done') items = items.filter(it => it._mastered);
  // 排序：待复习 → 未学 → 学习中 → 已掌握
  items.sort((a,b) => (a._due?-3:a._unlearned?-2:a._learning?-1:0) - (b._due?-3:b._unlearned?-2:b._learning?-1:0));
  const countEl = document.getElementById('wordlist-count');
  if (countEl) {
    const total = getWordsForCat(_wordlistCat).length;
    countEl.textContent = items.length + '/' + total;
  }
  if (items.length === 0) {
    const emptyMsg = {
      all:'这个词库暂时没有词',
      due:'当前没有待复习的词，请先学习新词',
      learning:'还没有进入"学习中"的词',
      done:'还没有已掌握的词'
    }[_wordlistFilter] || '没有符合条件的词';
    listEl.innerHTML = '<div class="wordlist-empty">'+emptyMsg+'</div>';
    return;
  }
  let html = '';
  items.forEach(it => {
    let status = '未学', cls = 'un';
    if (it._mastered) { status = it.rec.currentRound+'/7'; cls = 'done'; }
    else if (it._due) { status = '待复习'; cls = 'due'; }
    else if (it._learning) { status = it.rec.currentRound+'/7'; cls = 'learning'; }
    const meanings = (it.meanings||[]).join('；');
    html += '<div class="wl-item" onclick="speakWordList(\''+it.word.replace(/'/g,"\\'")+'\')">';
    html += '<div class="wl-main">';
    html += '<div class="wl-word">'+it.word+'</div>';
    if (it.phonetic) html += '<div class="wl-phonetic">'+it.phonetic+'</div>';
    html += '</div>';
    html += '<div class="wl-meaning">'+meanings+'</div>';
    html += '<span class="wl-status '+cls+'">'+status+'</span>';
    html += '</div>';
  });
  listEl.innerHTML = html;
}
// 词表点击发音
function speakWordList(word) {
  const bw = WORD_BANK.find(b => b.word === word);
  const text = bw && bw.phonetic ? word : word;
  speakWithSystemTTS(text, 0.9, function(){});
}

// ========== 开始学习/复习 ==========
// 单词库优先：一次只从"当前专注词库"取词，学完只影响该词库。
function startLearn() {
  const config = getConfig();
  const records = getRecords();
  const cats = (config.categories && config.categories.length>0) ? config.categories : ['ai-prompt'];
  const targetScene = cats[0];
  const curLabel = SCENE_LABELS[targetScene] || targetScene;
  const newWords = getLearnableWordsForScene(records, targetScene);
  if (newWords.length === 0) {
    toast('「' + curLabel + '」没有新词可学，可在词库中切换其他词库');
    return;
  }
  const count = Math.min(config.groupSize, newWords.length);
  // 打乱新词顺序，避免同分类连续出现
  const shuffled = shuffleArray(newWords).slice(0, count);
  currentQueue = shuffled.map(w=>({...w,mode:'new',_scene:getAssignedScene(w, new Set(cats))}));
  currentIndex = 0; currentMode = 'learn'; studyStartCount = count;
  studyStartTime = Date.now();
  slideDirection = 'right';
  processedIndices = new Set();
  saveStudyProgress();
  document.getElementById('study-mode').textContent = '学习「'+curLabel+'」';
  showPage('study'); showCurrentWord();
}
function startReview() {
  const records = getRecords();
  const dueWords = getDueWords(records);
  if (dueWords.length===0) { toast('暂时没有待复习的词'); return; }
  // 穿插混合：打乱复习队列，混合不同轮次和分类
  const reviewItems = dueWords.map(w => {
    const bw = WORD_BANK.find(b=>b.word===w);
    if (!bw) return null;
    const rec = records[w];
    return {...bw, mode:'review', _round: rec ? rec.currentRound : 1, _cat: bw.category};
  }).filter(Boolean);
  // 防御：若队列为空（如记录存在但词库缺失），提示而非直接进入完成页
  if (reviewItems.length === 0) { toast('暂时没有可复习的词'); return; }
  // 按轮次分组后穿插排列：不同轮次的词交叉出现
  currentQueue = interleaveByRound(reviewItems);
  currentIndex = 0; currentMode = 'review'; studyStartCount = currentQueue.length;
  studyStartTime = Date.now();
  slideDirection = 'right';
  processedIndices = new Set();
  saveStudyProgress();
  document.getElementById('study-mode').textContent = '综合复习';
  showPage('study'); showCurrentWord();
}


// Fisher-Yates 洗牌
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 按轮次穿插排列：不同轮次的词交叉出现，避免同轮次连续
function interleaveByRound(items) {
  // 按轮次分组
  const groups = {};
  items.forEach(item => {
    const r = item._round || 1;
    if (!groups[r]) groups[r] = [];
    groups[r].push(item);
  });
  // 每组内部打乱
  Object.keys(groups).forEach(r => {
    groups[r] = shuffleArray(groups[r]);
  });
  // 轮流取词穿插
  const rounds = Object.keys(groups).sort((a,b) => a-b);
  const result = [];
  let added = true;
  while (added) {
    added = false;
    rounds.forEach(r => {
      if (groups[r].length > 0) {
        result.push(groups[r].shift());
        added = true;
      }
    });
  }
  return result;
}

// ========== 深度面板渲染 ==========
// 常见功能词（虚词）的简释，用于词组拆分
const FUNCTION_WORDS = {
  'of':'的','the':'(冠词)','a':'一(个)','an':'一(个)','to':'到;向','in':'在…里',
  'on':'在…上','at':'在','by':'通过;被','for':'为了','and':'和','or':'或者',
  'is':'是','it':'它','be':'是','up':'向上','out':'向外','off':'离开;关闭',
  'do':'做','not':'不','all':'全部','set':'设置','step':'步骤','by':'通过'
};

// 常见基础词（高中水平）的简释，用于词组拆分展示
const BASIC_WORD_HINTS = {
  'sign':'签名;登录','log':'记录;日志','terms':'条款;术语','service':'服务',
  'privacy':'隐私','policy':'政策;策略','cookie':'浏览器缓存','drag':'拖','drop':'丢;放',
  'add':'添加','cart':'购物车','stay':'保持','signed':'已登录的','sort':'排序',
  'opt':'选择','control':'控制','center':'中心','home':'主页','screen':'屏幕',
  'lock':'锁定','disturb':'打扰','power':'电源;电力','mode':'模式','low':'低的',
  'time':'时间','face':'脸;面部','touch':'触摸','app':'应用','store':'商店',
  'silent':'静音的','location':'位置','services':'服务','cellular':'蜂窝的','data':'数据',
  'night':'夜晚','shift':'切换;班次','pull':'拉','request':'请求','code':'代码',
  'review':'审查;评审','merge':'合并','conflict':'冲突','feature':'功能;特性',
  'branch':'分支','commit':'提交','message':'信息','api':'应用程序接口','key':'密钥;键',
  'access':'访问;接入','token':'令牌','status':'状态','code':'代码','error':'错误',
  'environment':'环境','variable':'变量','config':'配置','file':'文件','log':'日志',
  'stack':'栈','trace':'追踪','rate':'速率;频率','limit':'限制','breaking':'破坏性的',
  'change':'变更','chain':'链','thought':'思考;思维','role':'角色','play':'扮演;玩',
  'system':'系统','prompt':'提示词','output':'输出','format':'格式','think':'思考',
  'engineering':'工程','context':'上下文','window':'窗口','training':'训练',
  'learning':'学习','rate':'比率','batch':'一批','size':'大小','loss':'损失',
  'function':'函数;功能','state':'状态','art':'技术;艺术','open':'开放的','source':'源',
  'boarding':'登机','pass':'通行证;票','checked':'已托运的','baggage':'行李',
  'window':'窗户','seat':'座位','aisle':'过道','overhead':'头顶上方的','bin':'储物箱',
  'flight':'航班','attendant':'服务员','tray':'小桌板','table':'桌子','connecting':'中转的',
  'claim':'提取;认领','customs':'海关','declaration':'申报','final':'最后的','call':'呼叫',
  'time':'时间','ground':'地面','transportation':'交通','rental':'租赁','car':'汽车',
  'room':'房间','front':'前面的','desk':'前台','wake-up':'叫醒','late':'晚的',
  'checkout':'退房','air':'空气','conditioning':'调节','laundry':'洗衣','power':'电力',
  'outlet':'插座','fully':'完全地','booked':'预订的','complimentary':'免费赠送的',
  'breakfast':'早餐'
};

function buildPhraseBreakdown(phrase) {
  const words = phrase.split(' ');
  let html = '<div class="deep-module phrase-breakdown">';
  html += '<div class="deep-module-title">Word Breakdown 词组拆分 <span class="tag">理解记忆</span></div>';
  html += '<div class="breakdown-words">';
  words.forEach((w, i) => {
    const lower = w.toLowerCase();
    const isFunc = !!FUNCTION_WORDS[lower];
    // Check if this word exists in WORD_BANK
    const bankEntry = WORD_BANK.find(b => b.word.toLowerCase() === lower);
    let meaning = '';
    if (isFunc) {
      meaning = FUNCTION_WORDS[lower];
    } else if (bankEntry) {
      meaning = bankEntry.meanings[0].replace(/^[a-z]+\.\s*/i, '');
    } else if (BASIC_WORD_HINTS[lower]) {
      meaning = BASIC_WORD_HINTS[lower];
    }
    html += '<div class="bd-word' + (isFunc ? ' bd-func' : '') + '">';
    html += '<span class="bd-en">' + w + '</span>';
    if (meaning) html += '<span class="bd-zh">' + meaning + '</span>';
    html += '</div>';
    // +号放在词块外面，作为flex容器的直接子元素，自然垂直居中
    if (i < words.length - 1) html += '<span class="bd-plus">+</span>';
  });
  html += '</div>';
  html += '</div>';
  return html;
}

function buildDeepHTML(word) {
  const data = DEEP_DATA[word];
  let bw = WORD_BANK.find(b => b.word === word);
  // 合成词条（仅在 SCENE_WORD_MEANINGS、不在 WORD_BANK 的词）从当前队列补取
  if (!bw && currentQueue && currentQueue.length) {
    bw = currentQueue.find(b => b.word === word && b._synthetic);
  }
  let html = '';

  // 词组拆分学习（放在最前面）
  const isPhrase = word.indexOf(' ') !== -1;
  if (isPhrase) {
    html += buildPhraseBreakdown(word);
  }

  // 统一例句区：合并当前场景例句 + 跨场景例句 + 额外例句
  const exItems = [];
  const activeCats = getActiveCategories();
  const mainCat = bw ? bw.category : null;
  const hasMainActive = mainCat ? activeCats.has(mainCat) : true;
  // 当前实际展示的场景（主场景未选中但有其它已选场景义时，取该场景）
  const displayCat = getDisplayCategory(bw);
  // 自定义场景词：优先取该场景的例句作为当前例句（该场景必为已选场景，故始终展示）
  const customSentMap = (typeof SCENE_SENTENCES_CUSTOM !== 'undefined' && SCENE_SENTENCES_CUSTOM[word]) ? SCENE_SENTENCES_CUSTOM[word] : null;
  const customCurrentSent = customSentMap && displayCat ? customSentMap[displayCat] : null;
  if (customCurrentSent) {
    exItems.push({en: String(customCurrentSent).replace(/<[^>]*>/g, ''), zh: '', cat: displayCat, isCurrent: true});
  }
  // 1. 内置当前场景例句：优先从 SCENE_SENTENCES 取当前场景（有翻译），否则用 bw.sentence。
  //    仅当主场景被选中时才作为"当前例句"展示。
  if (SCENE_SENTENCES[word]) {
    const currentScene = SCENE_SENTENCES[word].find(s => bw && s.cat === (displayCat || bw.category));
    if (currentScene && hasMainActive) {
      exItems.push({en: currentScene.en.replace(/<[^>]*>/g, ''), zh: currentScene.zh, cat: currentScene.cat, isCurrent: true});
    } else if (bw && bw.sentence && hasMainActive) {
      exItems.push({en: bw.sentence.replace(/<[^>]*>/g, ''), zh: SENTENCE_ZH[word] || '', cat: bw.category, isCurrent: true});
    }
  } else if (bw && bw.sentence && hasMainActive) {
    exItems.push({en: bw.sentence.replace(/<[^>]*>/g, ''), zh: SENTENCE_ZH[word] || '', cat: bw.category, isCurrent: true});
  }
  // 2. 跨场景例句（内置：只展示用户已选场景的）
  if (SCENE_SENTENCES[word]) {
    SCENE_SENTENCES[word].forEach(s => {
      if (!bw || s.cat !== bw.category) {
        if (activeCats.has(s.cat)) {
          exItems.push({en: s.en.replace(/<[^>]*>/g, ''), zh: s.zh, cat: s.cat, isCurrent: false});
        }
      }
    });
  }
  // 2b. 自定义跨场景例句（只展示用户已选、且非当前场景的）
  if (customSentMap) {
    Object.keys(customSentMap).forEach(sc => {
      if (!activeCats.has(sc)) return;
      if (displayCat && sc === displayCat) return; // 当前场景已作为首条展示
      const clean = String(customSentMap[sc]).replace(/<[^>]*>/g, '');
      if (!exItems.some(e => e.en === clean)) {
        exItems.push({en: clean, zh: '', cat: sc, isCurrent: false});
      }
    });
  }
  // 3. DEEP_DATA 额外例句（去重；仅当主场景选中才展示）
  if (data && data.extraSentences && hasMainActive) {
    data.extraSentences.forEach(ex => {
      const cleanEx = ex.en.replace(/<[^>]*>/g, '');
      if (!exItems.some(e => e.en === cleanEx)) {
        exItems.push({en: cleanEx, zh: ex.zh, cat: '', isCurrent: false});
      }
    });
  }
  // 4. 场景化深度例句（SCENE_DEEP，仅展示用户已选场景的）
  if (SCENE_DEEP && SCENE_DEEP[word]) {
    Object.keys(SCENE_DEEP[word]).forEach(scene => {
      if (!activeCats.has(scene)) return;
      const sd = SCENE_DEEP[word][scene];
      if (sd.extraSentences) {
        sd.extraSentences.forEach(ex => {
          const cleanEx = ex.en.replace(/<[^>]*>/g, '');
          if (!exItems.some(e => e.en === cleanEx)) {
            exItems.push({en: cleanEx, zh: ex.zh, cat: scene, isCurrent: false});
          }
        });
      }
    });
  }
  // 渲染统一例句模块
  if (exItems.length > 0) {
    html += '<div class="deep-module scene-module">';
    html += '<div class="deep-module-title">Examples 例句 <span class="tag">多场景</span></div>';
    html += '<div class="scene-list">';
    exItems.forEach((ex, i) => {
      const label = ex.isCurrent ? '当前 · ' + (SCENE_LABELS[ex.cat]||'') : (ex.cat ? SCENE_LABELS[ex.cat]||'' : '更多用法');
      html += '<div class="scene-row' + (ex.isCurrent ? ' scene-current' : '') + '">';
      if (label) html += '<div class="scene-tag">' + label + '</div>';
      // 例句内容 + 发音按钮
      const cleanEn = ex.en.replace(/<[^>]*>/g, '');
      // 高亮：转义正则特殊字符，词组用空格直接匹配
      const escWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlighted = ex.en.replace(new RegExp('\\b'+escWord+'\\b','gi'), '<span class="hl">$&</span>');
      html += '<div class="scene-en-wrap">';
      html += '<div class="scene-en">' + highlighted + '</div>';
      html += '<button class="speak-btn speak-sentence" onclick="event.stopPropagation();speakSentence(this)" data-text="'+cleanEn.replace(/"/g,'&quot;')+'" title="朗读"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>';
      html += '</div>';
      if (ex.zh) html += '<div class="scene-zh">' + ex.zh + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  if (data) {
    // 搭配
    const collocRows = [];
    // 当词的主场景未被选中、但存在其它已选场景的专门搭配时，只展示已选场景的搭配
    const mainCat = bw ? bw.category : null;
    const hasMainActive = mainCat ? activeCats.has(mainCat) : true;
    if (data.collocations && data.collocations.length && hasMainActive) {
      data.collocations.forEach(c => collocRows.push(c));
    }
    // 场景化搭配（SCENE_DEEP，仅展示用户已选场景的）
    if (SCENE_DEEP && SCENE_DEEP[word]) {
      Object.keys(SCENE_DEEP[word]).forEach(scene => {
        if (!activeCats.has(scene)) return;
        const sd = SCENE_DEEP[word][scene];
        if (sd.collocations) sd.collocations.forEach(c => collocRows.push(c));
      });
    }
    if (collocRows.length) {
      html += '<div class="deep-module">';
      html += '<div class="deep-module-title">Collocations 搭配 <span class="tag">高频</span></div>';
      html += '<div class="coll-list">';
      collocRows.forEach(c => {
        html += '<div class="coll-row">';
        html += '<span class="coll-type">'+c.type+'</span>';
        html += '<span class="coll-phrase">'+c.phrase+'</span>';
        html += '<span class="coll-zh">'+c.zh+'</span>';
        html += '</div>';
      });
      html += '</div></div>';
    }
    // 词族
    if (data.wordFamily && data.wordFamily.length) {
      html += '<div class="deep-module">';
      html += '<div class="deep-module-title">Word Family 词族 <span class="tag">扩展</span></div>';
      html += '<div class="wf-list">';
      data.wordFamily.forEach(wf => {
        html += '<div class="wf-chip">'+wf.word+'<span class="pos">'+wf.pos+'</span></div>';
      });
      html += '</div></div>';
    }
    // 同义词
    if (data.synonyms && data.synonyms.length) {
      html += '<div class="deep-module">';
      html += '<div class="deep-module-title">Synonyms 同义辨析 <span class="tag">辨析</span></div>';
      html += '<div class="syn-list">';
      data.synonyms.forEach(s => {
        html += '<div class="syn-row"><span class="syn-word">'+s.word+'</span><span class="syn-note">'+s.note+'</span></div>';
      });
      html += '</div></div>';
    }
  } else if (bw) {
    // 无深度数据的词：显示基础释义
    html += '<div class="deep-module">';
    html += '<div class="deep-module-title">Definition 释义 <span class="tag">基础</span></div>';
    html += '<div class="syn-list">';
    bw.meanings.forEach(m => {
      html += '<div class="syn-row"><span class="syn-word">'+m+'</span></div>';
    });
    html += '</div></div>';
  }
  return html;
}

function updateDeepPanel(word, revealed) {
  const desktopPanel = document.getElementById('deep-panel');
  const mobilePanel = document.getElementById('deep-panel-mobile');
  const deepHTML = buildDeepHTML(word);

  // 桌面端
  if (deepHTML) {
    if (!revealed) {
      // 未揭示：显示回忆提示（纯文字）
      desktopPanel.innerHTML = '<div class="deep-panel-recall"><div class="recall-icon">Recall</div><div class="recall-text">先回忆词义再看解析</div><div class="recall-hint">点击卡片揭示释义</div></div>';
      mobilePanel.innerHTML = '';
    } else {
      // 已揭示：显示深度内容（带淡入）
      const fullHTML = '<div class="deep-label">深度记忆 <span class="dw">· '+word+'</span></div><div class="deep-content" id="deep-content">'+deepHTML+'</div>';
      desktopPanel.innerHTML = fullHTML;
      mobilePanel.innerHTML = '<div class="deep-label">深度记忆 <span class="dw">· '+word+'</span></div><div class="deep-content visible">'+deepHTML+'</div>';
      requestAnimationFrame(() => {
        const content = document.getElementById('deep-content');
        if (content) {
          requestAnimationFrame(() => content.classList.add('visible'));
        }
        // 滚动到顶部
        if (desktopPanel) desktopPanel.scrollTop = 0;
        if (mobilePanel) mobilePanel.scrollTop = 0;
      });
    }
  } else {
    desktopPanel.innerHTML = '<div class="deep-panel-empty">该词暂无深度数据</div>';
    mobilePanel.innerHTML = '';
  }
}
function revealDeepContent() {
  const word = currentQueue[currentIndex]?.word;
  if (!word) return;
  updateDeepPanel(word, true);
}

// 全局动画方向控制
let slideDirection = 'right';
// 记录已处理过的词索引，避免 prev→next 重复加分
let processedIndices = new Set();

function showCurrentWord() {
  if (currentIndex >= currentQueue.length) { finishStudy(); return; }
  if (currentIndex < 0) currentIndex = 0;
  const w = currentQueue[currentIndex];
  const card = document.getElementById('word-card');
  const prevBtn = document.getElementById('btn-prev');
  const skipBtn = document.getElementById('btn-skip');
  const nextBtn = document.getElementById('btn-next');

  // 设置滑动方向并重播动画
  const dir = slideDirection === 'right' ? 1 : -1;
  card.style.setProperty('--slide-x', (15*dir)+'px');
  // 强制重排以重播 CSS animation
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  updateCardContent(w, card, prevBtn, skipBtn, nextBtn);
  saveStudyProgress();
}

function updateCardContent(w, card, prevBtn, skipBtn, nextBtn) {
  const isPhrase = w.word.indexOf(' ') !== -1;
  const isHyphenated = w.word.indexOf('-') !== -1 && !isPhrase;
  const wordEl = document.getElementById('w-en');
  wordEl.textContent = w.word;
  document.getElementById('w-phonetic').textContent = w.phonetic || '';
  // 音标行处理：单词有音标→正常显示；词组无音标→只显示发音按钮
  const phoneticWrap = document.getElementById('w-phonetic-wrap');
  const phoneticSpan = document.getElementById('w-phonetic');
  if (phoneticWrap && phoneticSpan) {
    if (isPhrase && !w.phonetic) {
      phoneticSpan.style.display = 'none';
      phoneticWrap.style.display = 'flex';
      phoneticWrap.style.justifyContent = 'center';
      phoneticWrap.classList.add('phrase-speak-only');
    } else {
      phoneticSpan.style.display = '';
      phoneticWrap.style.display = 'flex';
      phoneticWrap.style.justifyContent = '';
      phoneticWrap.classList.remove('phrase-speak-only');
    }
  }
  card.classList.toggle('is-phrase', isPhrase);
  card.classList.toggle('is-hyphen', isHyphenated);
  // 智能长度分类：词组按空格分词计算视觉宽度，单词按字符数
  let effectiveLen = w.word.length;
  if (isPhrase) {
    // 词组：空格占的视觉宽度小，用加权长度
    const words = w.word.split(' ');
    effectiveLen = words.reduce((sum, word) => sum + word.length, 0) + (words.length - 1) * 0.3;
    // 词组额外考虑词数：3个词以上直接是long
    if (words.length >= 4) effectiveLen = Math.max(effectiveLen, 18);
    else if (words.length >= 3) effectiveLen = Math.max(effectiveLen, 14);
  }
  card.classList.toggle('is-mid', effectiveLen > 10 && effectiveLen <= 15);
  card.classList.toggle('is-long', effectiveLen > 15 && effectiveLen <= 22);
  card.classList.toggle('is-vlong', effectiveLen > 22);
  // 场景标签（头部，点击模式文字时短暂显示）：学习显示当前专注词库；复习显示已学场景集合
  const sceneTag = document.getElementById('w-scene-tag');
  if (sceneTag) {
    if (currentMode === 'review') {
      const rr = getRecords()[w.word];
      const ls = (rr && rr.learnedScenes && rr.learnedScenes.length) ? rr.learnedScenes : (w.category ? [w.category] : []);
      sceneTag.textContent = ls.length > 1 ? '综合·' + ls.length + '场景' : (SCENE_LABELS[ls[0]] || ls[0] || '');
    } else {
      const tagCat = getDisplayCategory(w);
      sceneTag.textContent = SCENE_LABELS[tagCat] || '';
    }
    sceneTag.classList.remove('peek');
  }
  // 释义分行显示：学习按当前专注词库的词义；复习综合整合所有已学场景词义
  const meanEl = document.getElementById('w-mean');
  const visibleMeanings = (currentMode === 'review')
    ? getReviewMeanings(w.word, getRecords()[w.word])
    : getVisibleMeanings(w.word, w);
  meanEl.innerHTML = visibleMeanings.map(m => '<div class="w-mean-line">'+m+'</div>').join('');
  // 锁定释义高度：将释义区高度固定为当前词的实际渲染高度（含未揭示时），
  // 使卡片在 justify-content:center 下语义字节稳定，揭示释义时单词不被顶动。
  meanEl.style.height = meanEl.scrollHeight + 'px';
  // 顶部进度条
  const pct = ((currentIndex+1)/currentQueue.length)*100;
  const spf = document.getElementById('study-progress-fill');
  if (spf) spf.style.width = pct+'%';
  document.getElementById('study-progress').textContent = (currentIndex+1)+' / '+currentQueue.length;

  // 停止之前的发音（包括有道 Audio 和系统 TTS）
  stopAllSpeech();
  const speakBtn = document.getElementById('speak-btn');
  if (speakBtn) speakBtn.classList.remove('playing');

  // 更新记忆进度条
  updateMemoryDots(w.word);

  // 移动端：切换词时回到单词卡视图
  if (typeof setMobileView === 'function') setMobileView('word');

  // 渲染后动态调整字号，确保单行显示
  requestAnimationFrame(() => fitWordToSingleLine(wordEl, card));

  if (currentMode==='learn') {
    // 学习新词：直接显示释义，不需要主动回忆
    card.classList.remove('hidden-answer');
    answerRevealed = true;
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    skipBtn.style.display = 'block';
    skipBtn.textContent = '认识，跳过';
    nextBtn.textContent = (currentIndex === currentQueue.length-1) ? '完成' : '下一个';
    nextBtn.className = 'btn btn-primary';
    document.getElementById('btn-forgot').style.display = 'none';
    document.getElementById('hint-prev').style.display = currentIndex > 0 ? 'flex' : 'none';
    document.getElementById('hint-skip').style.display = 'flex';
    updateDeepPanel(w.word, true);
    revealDeepContent();
    // 自动发音
    speakWord();
  } else {
    // 复习旧词：先隐藏释义，主动回忆
    card.classList.add('hidden-answer');
    answerRevealed = false;
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    skipBtn.style.display = 'none';
    document.getElementById('btn-forgot').style.display = 'none';
    nextBtn.textContent = '显示释义';
    nextBtn.className = 'btn btn-primary';
    document.getElementById('hint-prev').style.display = currentIndex > 0 ? 'flex' : 'none';
    document.getElementById('hint-skip').style.display = 'none';
    updateDeepPanel(w.word, false);
  }
}

// 动态调整单词/词组字号，确保始终单行显示不换行
function fitWordToSingleLine(el, card) {
  if (!el) return;
  // 先重置inline样式，让CSS类生效
  el.style.fontSize = '';
  // 等待两帧确保布局完成
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const container = card || el.parentElement;
      if (!container) return;
      // 获取容器实际可用宽度（减去padding）
      const computedStyle = getComputedStyle(container);
      const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
      const containerWidth = container.clientWidth - paddingX - 16; // 额外安全边距
      const elWidth = el.scrollWidth;
      if (elWidth <= containerWidth) return;
      // 计算需要的缩放比例
      const ratio = containerWidth / elWidth;
      const currentSize = parseFloat(getComputedStyle(el).fontSize);
      const newSize = Math.floor(currentSize * ratio * 100) / 100;
      // 设置最小字号限制
      const minSize = window.innerWidth <= 768 ? 14 : 16;
      el.style.fontSize = Math.max(newSize, minSize) + 'px';
    });
  });
}

// TTS 发音 —— 三级回退：Capacitor 原生 TTS → 浏览器 speechSynthesis → 有道在线 API
let ttsVoicesReady = false;
// 全局跟踪当前播放的 Audio 元素，快速切词时停止上一个
let currentAudioEl = null;
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { ttsVoicesReady = true; };
  setTimeout(() => { if (window.speechSynthesis.getVoices().length > 0) ttsVoicesReady = true; }, 100);
}

// 停止所有正在播放的发音（Audio + speechSynthesis）
function stopAllSpeech() {
  // 停止有道 Audio
  if (currentAudioEl) {
    try { currentAudioEl.pause(); currentAudioEl.currentTime = 0; } catch(e) {}
    currentAudioEl.onended = null; currentAudioEl.onerror = null;
    currentAudioEl = null;
  }
  // 停止浏览器 TTS
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  // 停止 Capacitor TTS
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
    try { window.Capacitor.Plugins.TextToSpeech.stop(); } catch(e) {}
  }
  // 停止时立即清理卡片流光共振与播放态：
  // 发音被切断时 onended 不再触发，finish() 不会执行，若不在此清理，
  // .resonating 类会残留导致"没声音却一直显示流光特效"。任何停止/切词都统一收敛。
  const wc = document.getElementById('word-card');
  if (wc) {
    wc.classList.remove('resonating');
    wc.classList.remove('resonating-fade');
  }
  const sb = document.getElementById('speak-btn');
  if (sb) sb.classList.remove('playing');
}

// 检测 Capacitor TTS 插件是否可用（APP 环境下可用，浏览器预览时不可用）
let _capTTSChecked = false;
let _capTTSAvailable = false;
async function checkCapTTS() {
  if (_capTTSChecked) return _capTTSAvailable;
  _capTTSChecked = true;
  try {
    // 动态访问 Capacitor 插件（通过全局 Capacitor.Plugins 注入）
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.TextToSpeech) {
      const res = await cap.Plugins.TextToSpeech.getSupportedLanguages();
      _capTTSAvailable = Array.isArray(res.languages) && res.languages.some(l => l.startsWith('en'));
    }
  } catch(e) { _capTTSAvailable = false; }
  return _capTTSAvailable;
}

async function speakWord(isManual) {
  const w = currentQueue[currentIndex];
  if (!w) return;
  // 停止上一个发音，避免快速切词时语音叠加
  stopAllSpeech();
  const speakBtn = document.getElementById('speak-btn');
  const wordCard = document.getElementById('word-card');
  if (speakBtn) speakBtn.classList.add('playing');
  // 卡片共振：仅用户主动点击播放时触发，自动切换单词时不触发。
  // 仅在"未共振"时添加动画类，已共振则保持静默，避免 remove→reflow→add 强制同步布局导致卡片"闪一下"。
  if (isManual && wordCard && !wordCard.classList.contains('resonating')) {
    wordCard.classList.add('resonating');
  }
  const finish = () => {
    if (speakBtn) speakBtn.classList.remove('playing');
    if (wordCard) {
      // 丝滑淡出：先加结束态类让流光/光晕平滑渐隐，再延迟移除共振类，
      // 避免伪元素动画瞬间消失导致"突然跳回初始状态"。
      wordCard.classList.add('resonating-fade');
      setTimeout(() => {
        wordCard.classList.remove('resonating');
        wordCard.classList.remove('resonating-fade');
      }, 560);
    }
    currentAudioEl = null;
  };

  const config = getConfig();
  const youdaoType = config.voiceType === 'uk' ? 1 : 0; // 0=美音 1=英音

  // 有道真人发音优先（单词和词组都支持，少数专业词组失败时回退系统TTS）
  try {
    const audio = new Audio('https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(w.word) + '&type=' + youdaoType);
    currentAudioEl = audio;
    audio.onended = finish;
    audio.onerror = () => {
      currentAudioEl = null;
      // 有道失败，回退到系统 TTS
      speakWithSystemTTS(w.word, 0.85, finish);
    };
    audio.play().catch(() => {
      currentAudioEl = null;
      speakWithSystemTTS(w.word, 0.85, finish);
    });
    return;
  } catch(e) {
    currentAudioEl = null;
    speakWithSystemTTS(w.word, 0.85, finish);
  }
}

// 系统 TTS 封装（Capacitor 原生 → 浏览器 → 有道）
async function speakWithSystemTTS(text, rate, finish) {
  // Capacitor 原生 TTS（离线）
  try {
    const capOk = await checkCapTTS();
    if (capOk) {
      await window.Capacitor.Plugins.TextToSpeech.speak({
        text: text, lang: 'en-US', rate: rate, pitch: 1.0, volume: 1.0, category: 'ambient', queueStrategy: 0
      });
      finish(); return;
    }
  } catch(e) {}
  // 浏览器 TTS
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en')) : [];
  if (voices.length > 0) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voices[0]; u.lang = voices[0].lang; u.rate = rate;
    u.onend = finish; u.onerror = finish;
    window.speechSynthesis.speak(u); return;
  }
  // 最终回退：有道
  const config = getConfig();
  const youdaoType = config.voiceType === 'uk' ? 1 : 0;
  const audio = new Audio('https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(text) + '&type=' + youdaoType);
  currentAudioEl = audio;
  audio.onended = finish; audio.onerror = finish;
  audio.play().catch(finish);
}

// 例句朗读：系统 TTS 优先（有道对长句效果差），最终回退有道
async function speakSentence(btn) {
  const text = btn.dataset.text;
  if (!text) return;
  stopAllSpeech();
  btn.classList.add('playing');
  const finish = () => { btn.classList.remove('playing'); };
  // 系统 TTS（Capacitor → 浏览器 → 有道）
  await speakWithSystemTTS(text, 0.8, finish);
}

function revealWord() {
  // 学习模式：点击卡片等同于"下一个"（记录为已学并前进）
  if (currentMode === 'learn') { nextWord(); return; }
  if (!answerRevealed) {
    document.getElementById('word-card').classList.remove('hidden-answer');
    answerRevealed = true;
    const isLast = currentIndex === currentQueue.length-1;
    const nextBtn = document.getElementById('btn-next');
    nextBtn.textContent = isLast ? '完成' : '记住了 →';
    revealDeepContent();
    // 自动发音
    speakWord();
    // 第7次复习（_round===6，即将掌握）：显示"还没有记住"
    const w = currentQueue[currentIndex];
    const forgotBtn = document.getElementById('btn-forgot');
    if (forgotBtn && w && w._round === 6) forgotBtn.style.display = 'block';
  } else {
    nextWord();
  }
}
function nextWord() {
  if (currentMode==='review' && !answerRevealed) { revealWord(); return; }
  // 学习模式：点"下一个"时记录为已学（第1轮）
  // 复习模式：点"记住了"时推进轮次
  // 避免同一个词被重复记录（prev后再next不重复加分）
  if (!processedIndices.has(currentIndex)) {
    recordCurrentWord(true);
    processedIndices.add(currentIndex);
  }
  currentIndex++;
  slideDirection = 'right';
  showCurrentWord();
}
function prevWord() {
  if (currentIndex > 0) {
    currentIndex--;
    slideDirection = 'left';
    showCurrentWord();
  }
}
function skipWord() {
  if (currentMode!=='learn') return;
  if (processedIndices.has(currentIndex)) { currentIndex++; slideDirection='right'; showCurrentWord(); return; }
  processedIndices.add(currentIndex);
  const w = currentQueue[currentIndex];
  const records = getRecords();
  // 标记为认识：直接视为已掌握（7轮学完），不再进入复习
  const now = Date.now();
  records[w.word] = {
    word:w.word, currentRound:7,
    nextReviewTime:0,
    createTime:records[w.word]?.createTime||now, lastReviewTime:now,
    learnedScenes: records[w.word]?.learnedScenes   // 保留已学场景，避免覆盖丢失
  };
  recordLearnedScenes(records, w);
  saveRecords(records);
  toast('已标记为认识');
  currentIndex++;
  slideDirection = 'right';
  showCurrentWord();
}
// 第7次复习时"还没有记住"：回到第1轮重新开始七次记忆
function forgotWord() {
  if (currentMode !== 'review') return;
  const w = currentQueue[currentIndex];
  if (!processedIndices.has(currentIndex)) {
    recordCurrentWord(false);
    processedIndices.add(currentIndex);
  }
  currentIndex++;
  slideDirection = 'right';
  showCurrentWord();
}
function recordCurrentWord(remembered) {
  const w = currentQueue[currentIndex];
  const records = getRecords();
  const existing = records[w.word] || { createTime:Date.now(), currentRound:0 };
  // 防御性校验：确保 currentRound 是有效数字
  const existingRound = (typeof existing.currentRound === 'number' && !isNaN(existing.currentRound)) ? existing.currentRound : 0;
  const now = Date.now();

  let nextRound;
  if (remembered) {
    // 学习新词时，若该词已有记录（当前词是旧词的新场景义），从头重新学完整 SRS；
    // 复习时则正常推进轮次。这样新意思能做到"学完立即复习、马上用"。
    if (currentMode === 'learn' && existingRound > 0) {
      nextRound = 1;
    } else {
      nextRound = existingRound + 1;
    }
  } else {
    // 忘记了：回到第1轮重新开始
    nextRound = FORGOT_RESET_ROUND;
  }
  if (nextRound > 7) nextRound = 7;
  records[w.word] = {
    word:w.word, currentRound:nextRound,
    nextReviewTime: nextRound>=7 ? 0 : calcNextReview(nextRound, now),
    createTime:existing.createTime, lastReviewTime:now,
    learnedScenes: existing.learnedScenes   // 保留已学场景，避免覆盖丢失
  };
  // 记住时，把当前展示的场景义标记为已学（忘记时保留已学场景，便于重新出现）
  if (remembered) recordLearnedScenes(records, w);
  saveRecords(records);
}
function finishStudy() {
  stopAllSpeech();
  const records = getRecords();
  const mastered = getMasteredCount(records);
  const streak = updateStreak();
  document.getElementById('done-count').textContent = studyStartCount;
  // 学习时长
  const durationEl = document.getElementById('done-duration');
  if (durationEl && studyStartTime) {
    const secs = Math.round((Date.now() - studyStartTime) / 1000);
    if (secs < 60) durationEl.textContent = secs + '秒';
    else durationEl.textContent = Math.floor(secs / 60) + '分' + (secs % 60) + '秒';
  }
  document.getElementById('done-streak').textContent = streak;
  document.getElementById('done-total').textContent = mastered;

  // 判断当前学习模式类型（仅保留"学新词"与"复习"两种）
  let modeTitle, modeSub, nextText, againText, againAction;

  if (currentMode === 'learn') {
    modeTitle = '学完啦！';
    modeSub = '这些词已加入复习计划';
    const nextTime = getNextDueTime(records);
    nextText = nextTime ? '下次复习 <span class="next-time">'+formatTimeUntil(nextTime)+'</span>' : '间隔重复让记忆更牢固';
    againText = '再学一组';
    againAction = () => startLearn();
  } else {
    modeTitle = '复习完成！';
    modeSub = '巩固了一轮，记忆更牢固了';
    const nextTime = getNextDueTime(records);
    nextText = nextTime ? '下次复习 <span class="next-time">'+formatTimeUntil(nextTime)+'</span>' : '所有词已掌握';
    againText = '再复习一组';
    againAction = () => startReview();
  }

  document.getElementById('done-title').textContent = modeTitle;
  document.getElementById('done-sub').textContent = modeSub;
  const nextEl = document.getElementById('done-next');
  if (nextEl) nextEl.innerHTML = nextText;

  showPage('done');
  clearStudyProgress();
  // 完成页按钮：根据当前模式切换文案和行为
  const againBtn = document.getElementById('btn-again');
  if (againBtn) {
    againBtn.textContent = againText;
    againBtn.onclick = againAction;
  }
  // 刷新首页数据
  setTimeout(() => refreshHome(), 100);
  // 复习日程：若已开启，学完后自动写入系统日历
  if (getConfig().calendarReview) {
    setTimeout(() => addReviewCalendarEvent(false), 300);
  }
}
function confirmExit() {
  if (currentIndex>0 && currentIndex<currentQueue.length) {
    showConfirm('退出学习','学习还没完成，确定要退出吗？进度会保存。').then(ok=>{
      if(ok){ stopAllSpeech(); clearStudyProgress(); showPage('home'); refreshHome(); }
    });
  } else { stopAllSpeech(); clearStudyProgress(); showPage('home'); refreshHome(); }
}

// ========== 设置 ==========
function autoSaveSettings() {
  const gs = parseInt(document.getElementById('set-groupSize').value)||20;
  const config = getConfig();
  config.groupSize = Math.max(5,Math.min(100,gs));
  saveConfigData(config);
  applyBgVideo();
}
// 背景视频管理
const DEFAULT_BG_VIDEO = 'bg.mp4';

// 检测是否应使用降级背景（低端设备 / 系统减少动效）
function shouldDegradeVideo() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch(e) {}
  // 低内存设备（Android 常见 2GB 以下）降级，避免视频挤占内存
  try {
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
  } catch(e) {}
  return false;
}

// 更新"背景动画"开关 UI，并联动其他控件禁用态
function updateBgVideoUI() {
  const config = getConfig();
  const on = config.bgVideoEnabled !== false;
  const btn = document.getElementById('btn-bgVideo');
  const upBtn = document.getElementById('btn-bgVideoUpload');
  const upRow = document.getElementById('bg-video-upload-row');
  const resetBtn = document.getElementById('btn-bgVideoReset');
  if (btn) {
    btn.textContent = on ? '已开启' : '已关闭';
    btn.style.background = on ? 'var(--tg-on-bg)' : 'var(--tg-off-bg)';
    btn.style.borderColor = on ? 'var(--tg-on-border)' : 'var(--tg-off-border)';
    btn.style.color = on ? 'var(--tg-on-color)' : 'var(--tg-off-color)';
  }
  [upBtn, resetBtn].forEach(el => { if (el) el.disabled = !on; });
  if (upRow) upRow.style.opacity = on ? '1' : '0.4';
  if (upRow) upRow.style.pointerEvents = on ? 'auto' : 'none';
}

// 开关背景动画
function toggleBgVideo() {
  const config = getConfig();
  config.bgVideoEnabled = !(config.bgVideoEnabled !== false);
  saveConfigData(config);
  updateBgVideoUI();
  applyBgVideo();
  toast(config.bgVideoEnabled === false ? '已关闭背景动画' : '已开启背景动画');
}

// ========== 主题模式管理 ==========
function getThemeConfig() {
  const config = getConfig();
  return config.themeMode || 'frost';
}
// 解析当前应生效的主题
function resolveTheme() {
  const mode = getThemeConfig();
  if (mode === 'light' || mode === 'dark' || mode === 'frost') return mode;
  // 兼容旧值 'system'，默认转 frost
  return 'frost';
}
// 应用主题到 <html> 的 data-theme 属性
function applyTheme() {
  const resolved = resolveTheme();
  document.documentElement.setAttribute('data-theme', resolved);
  // 同步背景视频显示状态
  if (typeof applyBgVideo === 'function') applyBgVideo();
  // 同步设置页背景视频组的显示/隐藏
  applyThemeSettings();
}
// 根据主题控制设置页"背景视频"组的显示/隐藏（仅磨砂模式可见）
function applyThemeSettings() {
  const isFrost = resolveTheme() === 'frost';
  const bgSettings = document.getElementById('bg-video-settings');
  const bgTitle = document.getElementById('bg-video-settings-title');
  if (bgSettings) bgSettings.style.display = isFrost ? '' : 'none';
  if (bgTitle) bgTitle.style.display = isFrost ? '' : 'none';
}
// 用户在设置页切换主题
function setTheme(mode) {
  const config = getConfig();
  config.themeMode = mode;
  saveConfigData(config);
  applyTheme();
  updateThemeUI();
  const label = mode === 'light' ? '浅色' : (mode === 'dark' ? '深色' : '磨砂');
  toast('主题已切换为' + label);
}
// 同步设置页主题按钮高亮
function updateThemeUI() {
  const mode = getThemeConfig();
  ['light', 'dark', 'frost'].forEach(m => {
    const btn = document.getElementById('theme-' + m);
    if (btn) btn.classList.toggle('active', mode === m);
  });
}
// 初始化主题
function initTheme() {
  applyTheme();
  updateThemeUI();
}

// ========== 字体模式管理 ==========
function getFontMode() {
  const config = getConfig();
  return config.fontMode === 'refined' ? 'refined' : 'classic';
}
// 应用字体方案到 <html> 的 data-font 属性
function applyFont() {
  document.documentElement.setAttribute('data-font', getFontMode());
}
// 用户在设置页切换字体
function setFontMode(mode) {
  const config = getConfig();
  config.fontMode = mode;
  saveConfigData(config);
  applyFont();
  updateFontUI();
  toast(mode === 'classic' ? '已切换为经典字体' : '已切换为精选字体');
}
// 同步设置页字体按钮高亮
function updateFontUI() {
  const mode = getFontMode();
  ['classic', 'refined'].forEach(m => {
    const btn = document.getElementById('font-' + m);
    if (btn) btn.classList.toggle('active', mode === m);
  });
}
// 初始化字体
function initFont() {
  applyFont();
  updateFontUI();
}

// ========== 操作提示开关 ==========
// 应用提示显示状态（隐藏/显示移动端滑动提示）
function applyHints() {
  const config = getConfig();
  const show = config.showHints !== false;
  const hint = document.getElementById('mobile-swipe-hint');
  if (hint) hint.style.display = show ? '' : 'none';
  document.body.classList.toggle('hints-hidden', !show);
}
// 设置页切换操作提示
function toggleHints() {
  const config = getConfig();
  config.showHints = !(config.showHints !== false);
  saveConfigData(config);
  applyHints();
  updateHintsUI();
  toast(config.showHints === false ? '已隐藏操作提示' : '已显示操作提示');
}
// 同步设置页提示开关按钮
function updateHintsUI() {
  const config = getConfig();
  const on = config.showHints !== false;
  const btn = document.getElementById('btn-hints');
  if (btn) {
    btn.textContent = on ? '已开启' : '已关闭';
    btn.style.background = on ? 'var(--tg-on-bg)' : 'var(--tg-off-bg)';
    btn.style.borderColor = on ? 'var(--tg-on-border)' : 'var(--tg-off-border)';
    btn.style.color = on ? 'var(--tg-on-color)' : 'var(--tg-off-color)';
  }
}

// 视频异步加载：首屏先用渐变背景，视频就绪后淡入
function applyBgVideo() {
  const config = getConfig();
  const video = document.getElementById('bg-video');
  if (!video) return;
  const url = config.bgVideoUrl || DEFAULT_BG_VIDEO;
  // 仅磨砂主题下显示视频背景，其他主题走纯渐变背景
  const isFrost = resolveTheme() === 'frost';
  const enabled = isFrost && config.bgVideoEnabled !== false && !shouldDegradeVideo();
  if (!enabled) {
    video.style.opacity = '0';
    video.dataset.loaded = '0';
    video.pause();
    document.body.classList.add('video-fallback');
    return;
  }
  // 如果 URL 没变就不重新加载
  const currentSrc = video.querySelector('source')?.src || '';
  if (currentSrc === url && video.dataset.loaded === '1') return;
  // 重置状态：隐藏视频，显示渐变背景
  video.style.opacity = '0';
  video.dataset.loaded = '0';
  video.classList.remove('failed');
  document.body.classList.remove('video-fallback');
  // 更新 source
  video.innerHTML = '<source src="'+url+'" type="video/mp4">';
  video.load();
  // 异步加载：canplay 事件触发后才播放并淡入
  const onReady = () => {
    video.removeEventListener('canplay', onReady);
    video.removeEventListener('loadeddata', onReady);
    video.play().then(() => {
      video.dataset.loaded = '1';
      // 触发重排后再设置 opacity，确保 transition 生效
      void video.offsetWidth;
      video.style.opacity = '1';
    }).catch(() => {
      // 自动播放被阻止，标记失败走渐变背景
      video.classList.add('failed');
      document.body.classList.add('video-fallback');
    });
  };
  const onErr = () => {
    video.removeEventListener('error', onErr);
    video.removeEventListener('canplay', onReady);
    video.classList.add('failed');
    document.body.classList.add('video-fallback');
  };
  video.addEventListener('canplay', onReady);
  video.addEventListener('loadeddata', onReady);
  video.addEventListener('error', onErr);
  // 超时保护：5秒未就绪则走渐变背景
  setTimeout(() => {
    if (video.dataset.loaded !== '1' && !video.classList.contains('failed')) {
      document.body.classList.add('video-fallback');
    }
  }, 5000);
}

// 后台性能优化：APP 切到后台或页面隐藏时暂停视频，回到前台再恢复
function setupVideoAppState() {
  const video = document.getElementById('bg-video');
  if (!video) return;
  const pause = () => { if (!video.paused) video.pause(); };
  const play = () => {
    const config = getConfig();
    if (config.bgVideoEnabled === false) return;
    if (video.dataset.loaded === '1' && video.paused) video.play().catch(()=>{});
  };
  // 浏览器可见性
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else play();
  });
  // Capacitor APP 生命周期（原生）
  try {
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.App) {
      cap.Plugins.App.addListener('appStateChange', (state) => {
        if (!state.isActive) pause(); else play();
      });
    }
  } catch(e) {}
}

// 弹窗/遮罩打开时压暗视频背景（backdrop-filter 对视频层不生效，需直接调低视频亮度）
function initMaskDimVideo() {
  const masks = document.querySelectorAll('.lib-mask, .import-mask, .modal-mask, .info-mask');
  const update = () => {
    let anyOpen = false;
    masks.forEach(m => {
      if (m.classList.contains('show') || m.style.display === 'flex' || m.style.display === 'block') anyOpen = true;
    });
    document.body.classList.toggle('mask-open', anyOpen);
  };
  masks.forEach(m => new MutationObserver(update).observe(m, { attributes: true, attributeFilter: ['class', 'style'] }));
  update();
}

function handleBgVideoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 30 * 1024 * 1024) {
    toast('视频太大，建议小于 30MB');
    return;
  }
  const url = URL.createObjectURL(file);
  const config = getConfig();
  config.bgVideoUrl = url;
  saveConfigData(config);
  const bgVideoName = document.getElementById('bg-video-name');
  if (bgVideoName) bgVideoName.textContent = file.name;
  applyBgVideo();
  toast('背景视频已更新');
}

function resetBgVideo() {
  const config = getConfig();
  config.bgVideoUrl = '';
  saveConfigData(config);
  const bgVideoName = document.getElementById('bg-video-name');
  if (bgVideoName) bgVideoName.textContent = '从相册选择视频文件';
  applyBgVideo();
  toast('已恢复默认背景');
}

// 发音口音切换
function setVoiceType(type) {
  const config = getConfig();
  config.voiceType = type;
  saveConfigData(config);
  document.getElementById('voice-us').classList.toggle('active', type === 'us');
  document.getElementById('voice-uk').classList.toggle('active', type === 'uk');
  toast(type === 'uk' ? '已切换为英音' : '已切换为美音');
}

// 打开系统 TTS 设置（让用户切换引擎/音色）
function openSystemTTS() {
  try {
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.TextToSpeech && cap.Plugins.TextToSpeech.openInstall) {
      cap.Plugins.TextToSpeech.openInstall();
      return;
    }
  } catch(e) {}
  // 浏览器环境无法打开系统设置
  toast('请在手机设置 → 辅助功能 → 文本转语音中切换引擎');
}

// 每日复习提醒 —— 基于 Capacitor Local Notifications（原生定时推送，APP 关闭也可触发）
const LOCAL_NOTIFY_ID = 1001;

// 获取 Local Notifications 插件（APP 环境），浏览器预览时返回 null
function getLocalNotify() {
  try {
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.LocalNotifications) return cap.Plugins.LocalNotifications;
  } catch(e) {}
  return null;
}

async function updateNotifyButton() {
  const config = getConfig();
  const btn = document.getElementById('btn-notify');
  const timeRow = document.getElementById('notify-time-row');
  const timeInput = document.getElementById('set-notifyTime');
  if (!btn) return;
  if (timeInput) timeInput.value = config.notifyTime || '20:00';

  const ln = getLocalNotify();
  if (!ln) {
    // 浏览器预览环境：不支持原生通知
    btn.textContent = '仅APP支持';
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
    if (timeRow) timeRow.style.display = 'none';
    return;
  }

  if (config.notifyEnabled) {
    btn.textContent = '已开启';
    btn.style.background = 'var(--tg-on-bg)';
    btn.style.borderColor = 'var(--tg-on-border)';
    btn.style.color = 'var(--tg-on-color)';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    if (timeRow) timeRow.style.display = 'flex';
  } else {
    btn.textContent = '开启';
    btn.style.background = 'var(--tg-off-bg)';
    btn.style.borderColor = 'var(--tg-off-border)';
    btn.style.color = 'var(--tg-off-color)';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    if (timeRow) timeRow.style.display = 'none';
  }
}

async function toggleNotification() {
  const ln = getLocalNotify();
  if (!ln) { toast('提醒功能仅在APP中可用'); return; }
  const config = getConfig();

  if (!config.notifyEnabled) {
    // 开启：先请求权限
    try {
      const perm = await ln.requestPermissions();
      if (!perm || perm.display !== 'granted') {
        toast('需要通知权限才能提醒');
        return;
      }
    } catch(e) { toast('权限请求失败'); return; }

    config.notifyEnabled = true;
    saveConfigData(config);
    await scheduleDailyNotify(config.notifyTime || '20:00');
    toast('已开启每日提醒');
  } else {
    // 关闭：取消所有定时通知
    config.notifyEnabled = false;
    saveConfigData(config);
    try { await ln.cancel({ notifications: [{ id: LOCAL_NOTIFY_ID }] }); } catch(e) {}
    toast('已关闭提醒');
  }
  updateNotifyButton();
}

// 更改提醒时间
async function updateNotifyTime() {
  const config = getConfig();
  const timeInput = document.getElementById('set-notifyTime');
  if (timeInput) config.notifyTime = timeInput.value;
  saveConfigData(config);
  if (config.notifyEnabled) {
    await scheduleDailyNotify(config.notifyTime);
    toast('提醒时间已更新');
  }
}

// 注册每日定时通知
async function scheduleDailyNotify(timeStr) {
  const ln = getLocalNotify();
  if (!ln) return;
  const [h, m] = (timeStr || '20:00').split(':').map(n => parseInt(n) || 0);

  // 先取消旧的
  try { await ln.cancel({ notifications: [{ id: LOCAL_NOTIFY_ID }] }); } catch(e) {}

  // Android 8+ 必须先创建通知通道，否则通知不会显示
  try {
    await ln.createChannel({
      id: 'reminder',
      name: '复习提醒',
      description: '每日单词复习提醒',
      importance: 4,
      visibility: 1,
      sound: null
    });
  } catch(e) {}

  // 计算下一次触发时间
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(h, m, 0, 0);
  if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

  try {
    await ln.schedule({
      notifications: [{
        id: LOCAL_NOTIFY_ID,
        title: '轻词 LiteWord',
        body: '该复习单词啦，趁热打铁记得更牢',
        schedule: {
          at: scheduled,
          repeats: true,
          allowWhileIdle: true
        },
        smallIcon: 'ic_stat_icon',
        channelId: 'reminder'
      }]
    });
  } catch(e) {}
}

// APP 启动时检查：如果配置了提醒但权限被系统关闭，同步状态
async function checkReminder() {
  const config = getConfig();
  if (!config.notifyEnabled) return;
  const ln = getLocalNotify();
  if (!ln) return;
  try {
    const perm = await ln.checkPermissions();
    if (!perm || perm.display !== 'granted') {
      config.notifyEnabled = false;
      saveConfigData(config);
      updateNotifyButton();
    } else {
      // 权限正常，重新注册确保通知有效
      await scheduleDailyNotify(config.notifyTime || '20:00');
    }
  } catch(e) {}
}

// ========== 复习日程（写入系统日历） ==========
// 学完一组后，把下一次复习时间写入手机系统日历，到点提醒复习。
// 若复习时间落在深夜"安静时段"，自动顺延到次日晨间，避免半夜打扰。
const STORAGE_KEY_CALENDAR_EVENTS = 'lw_calendar_events';
const CALENDAR_EVENT_TITLE = '轻词 · 复习单词';
const CALENDAR_QUIET_START = 23;  // 安静时段起点（23:00）
const CALENDAR_QUIET_END = 8;     // 安静时段终点（08:00，此点不再视为安静）

// 获取 CapacitorCalendar 插件（APP 环境），浏览器预览时返回 null
function getCalendarPlugin() {
  try {
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.CapacitorCalendar) return cap.Plugins.CapacitorCalendar;
  } catch(e) {}
  return null;
}

// 读取已记录的轻词日程事件ID
function getCalendarEvents() {
  try {
    const s = Store.getItem(STORAGE_KEY_CALENDAR_EVENTS);
    return s ? JSON.parse(s) : [];
  } catch(e) { return []; }
}
function saveCalendarEvents(list) { Store.setItem(STORAGE_KEY_CALENDAR_EVENTS, JSON.stringify(list)); }

// 深夜顺延：把落在安静时段(23:00-08:00)的复习时间顺延到指定时刻（默认次日08:00）
function normalizeReviewTime(ts, deferTime) {
  const d = new Date(ts);
  const h = d.getHours();
  if (h >= CALENDAR_QUIET_START || h < CALENDAR_QUIET_END) {
    const parts = (deferTime || '08:00').split(':').map(n => parseInt(n) || 0);
    const target = new Date(d);
    target.setHours(parts[0], parts[1], 0, 0);
    if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1);
    return target.getTime();
  }
  return ts;
}

// 格式化日程时间（今天/明天/具体日期 + 时分）
function formatEventTime(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 86400000).toDateString();
  if (d.toDateString() === today) return '今天 ' + hm;
  if (d.toDateString() === tomorrow) return '明天 ' + hm;
  return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
}

// 请求日历读写权限（createEvent 需先查询默认日历，故需同时具备读权限）
async function ensureCalendarPermission() {
  const cc = getCalendarPlugin();
  if (!cc) return false;
  try {
    const res = await cc.requestFullCalendarAccess();
    return !!(res && res.result === 'granted');
  } catch(e) { return false; }
}

// 删除之前添加的轻词日程
async function deleteCalendarEvents() {
  const cc = getCalendarPlugin();
  if (!cc) return;
  const list = getCalendarEvents();
  for (const ev of list) {
    try { await cc.deleteEvent({ id: ev.id }); } catch(e) {}
  }
  saveCalendarEvents([]);
}

// 添加复习日程到系统日历。manual=true 表示用户手动触发（完成页按钮）
async function addReviewCalendarEvent(manual) {
  const cc = getCalendarPlugin();
  if (!cc) { toast('日程功能仅在APP中可用'); return; }
  const config = getConfig();
  const records = getRecords();
  const rawTime = getNextDueTime(records);
  if (!rawTime) { toast('当前没有待复习的安排'); return; }
  const start = normalizeReviewTime(rawTime, config.calendarDefer || '08:00');
  const end = start + 15 * 60 * 1000; // 复习日程时长15分钟

  // 先删除旧的轻词日程，避免日历堆积
  await deleteCalendarEvents();

  // 请求日历权限
  const ok = await ensureCalendarPermission();
  if (!ok) { toast('需要日历权限才能添加日程'); return; }

  try {
    // 先创建事件（不带提醒），确保一定能写入系统日历；再尽力附加"到点提醒"。
    // 若日历不支持提醒（部分无账户/本地日历），提醒附加失败不影响事件本身。
    const res = await cc.createEvent({
      title: CALENDAR_EVENT_TITLE,
      description: '间隔复习，趁热打铁记得更牢',
      startDate: start,
      endDate: end
    });
    if (!res || !res.id) { toast('日程添加失败'); return; }
    // 尽力添加"到点提醒"（0 = 日程开始时刻）
    try { await cc.modifyEvent({ id: res.id, alerts: [0] }); } catch(e2) {}
    saveCalendarEvents([{ id: res.id, start: start }]);
    toast('已添加到系统日历 · ' + formatEventTime(start));
  } catch(e) {
    const msg = (e && e.message) ? String(e.message) : '';
    if (msg.indexOf('No calendars') !== -1) {
      toast('手机未找到日历账户，请先在系统「日历」中添加账户');
    } else {
      toast('日程添加失败，请检查日历权限');
    }
  }
}

// 设置页开关：复习日程
async function toggleCalendarReview() {
  const cc = getCalendarPlugin();
  if (!cc) { toast('日程功能仅在APP中可用'); return; }
  const config = getConfig();
  if (!config.calendarReview) {
    // 开启：先请求权限
    const ok = await ensureCalendarPermission();
    if (!ok) { toast('需要日历权限才能添加日程'); return; }
    config.calendarReview = true;
    saveConfigData(config);
    toast('已开启复习日程');
  } else {
    // 关闭：删除已添加的日程
    config.calendarReview = false;
    saveConfigData(config);
    await deleteCalendarEvents();
    toast('已关闭复习日程');
  }
  updateCalendarButton();
}

// 更新设置页"复习日程"开关UI
function updateCalendarButton() {
  const config = getConfig();
  const btn = document.getElementById('btn-calendar');
  const deferRow = document.getElementById('calendar-defer-row');
  const deferInput = document.getElementById('set-calendarDefer');
  if (!btn) return;
  if (deferInput) deferInput.value = config.calendarDefer || '08:00';
  const cc = getCalendarPlugin();
  if (!cc) {
    btn.textContent = '仅APP支持';
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
    if (deferRow) deferRow.style.display = 'none';
    return;
  }
  if (config.calendarReview) {
    btn.textContent = '已开启';
    btn.style.background = 'var(--tg-on-bg)';
    btn.style.borderColor = 'var(--tg-on-border)';
    btn.style.color = 'var(--tg-on-color)';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    if (deferRow) deferRow.style.display = 'flex';
  } else {
    btn.textContent = '开启';
    btn.style.background = 'var(--tg-off-bg)';
    btn.style.borderColor = 'var(--tg-off-border)';
    btn.style.color = 'var(--tg-off-color)';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    if (deferRow) deferRow.style.display = 'none';
  }
}

// 更改深夜顺延时间：更新配置并（若已开启）重建日程
async function updateCalendarDefer() {
  const config = getConfig();
  const input = document.getElementById('set-calendarDefer');
  if (input) config.calendarDefer = input.value;
  saveConfigData(config);
  if (config.calendarReview) await addReviewCalendarEvent(true);
}
async function resetData() {
  const ok = await showConfirm('重置数据','确定要清空所有学习记录，并移除所有导入的词库、恢复默认分类吗？此操作不可恢复。');
  if (!ok) return;
  // 1) 清空学习记录与连续天数
  Store.removeItem(STORAGE_KEY_RECORDS);
  Store.removeItem(STORAGE_KEY_STREAK);
  // 2) 清空自定义词库与自定义分类标签
  Store.removeItem(STORAGE_KEY_CUSTOM_WORDS);
  Store.removeItem(STORAGE_KEY_CUSTOM_CATS);
  if (typeof SCENE_LABELS !== 'undefined') {
    Object.keys(SCENE_LABELS).forEach(k => {
      if (!BUILTIN_SCENE_KEYS.has(k)) delete SCENE_LABELS[k];
    });
  }
  if (typeof selectedCategories !== 'undefined' && selectedCategories.clear) selectedCategories.clear();
  // 3) 重建 WORD_BANK 与场景义索引为内置快照
  if (typeof mergeCustomWords === 'function') mergeCustomWords();
  // 4) 重置分类选择为默认内置分类（单词库优先）
  const cfg = getConfig();
  cfg.categories = ['ai-prompt'];
  saveConfigData(cfg);
  // 5) 清理进行中的学习进度
  Store.removeItem(STORAGE_KEY_PROGRESS);
  toast('所有数据已重置'); refreshHome();
}

// ========== 导入词库 ==========
function openImportPanel() {
  document.getElementById('import-mask').classList.add('show');
  document.getElementById('import-prompt-box').textContent = IMPORT_PROMPT_TEMPLATE;
  document.getElementById('import-textarea').value = '';
  document.getElementById('import-stats').textContent = '';
  document.getElementById('import-stats').className = 'import-stats';
  refreshImportList();
}
function closeImportPanel() {
  document.getElementById('import-mask').classList.remove('show');
}

// ========== 关于：协议 / 隐私 / 反馈 ==========
const INFO_CONTENT = {
  feedback: {
    title: '意见反馈',
    body: [
      ['告诉我们你的想法', '轻词还很年轻，你的每一条建议都在帮助它变得更好。无论是单词库、发音、界面，还是某个让你觉得不顺手的地方，都欢迎告诉我们。'],
      ['如何反馈', '本期为演示版本，暂未开放线上反馈通道。你可以通过以下方式联系我们：\n· 在应用商店评论区留言\n· 通过自媒体账号私信我们\n· 后续版本将接入站内反馈与社区'],
      ['反馈内容建议', '描述你遇到的问题或期望的功能，如果可以，附上你的设备型号与系统版本，能帮我们更快定位问题。']
    ]
  },
  privacy: {
    title: '隐私政策',
    body: [
      ['数据归属', '你的学习记录、词库与连续天数全部保存在设备本地，不会上传到任何服务器。'],
      ['背景视频', '若你选择从相册选取背景视频，该文件仅保存在本机，不会被上传或共享。'],
      ['数据安全', '所有学习数据仅存于本机，不会被上传或以任何方式传输到外部。'],
      ['你的权利', '你可以随时在设置中清空全部数据，无需担心账号或云端残留。']
    ]
  },
  terms: {
    title: '用户协议',
    body: [
      ['服务说明', '轻词 LiteWord 是一款本地优先的英语单词学习应用，提供分类学习与记忆复习功能。'],
      ['数据与隐私', '全部数据仅保存在你的设备本地，不上传任何服务器，具体见《隐私政策》。'],
      ['合理使用', '请勿利用本应用从事任何违反法律法规或侵犯他人权益的行为。'],
      ['服务变更', '我们保留优化、调整或终止部分功能的权利，并会在此处及时更新本协议。'],
      ['联系方式', '如对本协议有任何疑问，可通过设置页的意见反馈入口与我们联系。']
    ]
  }
};

function openInfo(key) {
  const c = INFO_CONTENT[key];
  if (!c) return;
  document.getElementById('info-title').textContent = c.title;
  const body = document.getElementById('info-body');
  body.innerHTML = c.body.map(function (b) {
    return '<div class="info-sec"><div class="info-sec-title">' + b[0] + '</div><div class="info-sec-text">' + b[1].replace(/\n/g, '<br>') + '</div></div>';
  }).join('');
  document.getElementById('info-mask').classList.add('show');
}
function closeInfo() {
  document.getElementById('info-mask').classList.remove('show');
}

// ========== 词库市场（占位模块，待后端接入） ==========
// 假数据：真实场景下应改为从后端 API 拉取
const MARKET_MOCK = [
  { name:"AI 提示词精选", desc:"120 个 AI 对话与写 prompt 高频词", meta:"1.2k 人学习", cat:"ai", words:120 },
  { name:"AI 模型术语", desc:"训练、推理、微调、评估专业词汇", meta:"860 人学习", cat:"ai", words:160 },
  { name:"Python 开发", desc:"Python 语法与常用库词汇", meta:"856 人学习", cat:"dev", words:200 },
  { name:"前端三剑客", desc:"HTML / CSS / JS 高频术语", meta:"645 人学习", cat:"dev", words:170 },
  { name:"出国旅行必备", desc:"机场、酒店、问路、点餐", meta:"2.1k 人学习", cat:"travel", words:150 },
  { name:"商务出行英语", desc:"邮件、会面、出差常用表达", meta:"732 人学习", cat:"travel", words:180 },
  { name:"日常口语高频", desc:"生活场景常用动词与短语", meta:"3.4k 人学习", cat:"life", words:220 },
  { name:"美食与点餐", desc:"点单、评价、预订词汇", meta:"598 人学习", cat:"life", words:130 }
];
let _marketTab = 'all';
let _marketSearch = '';

function openMarketPanel() {
  document.getElementById('market-mask').classList.add('show');
  _marketTab = 'all'; _marketSearch = '';
  const input = document.getElementById('market-search-input');
  if (input) input.value = '';
  document.querySelectorAll('#market-tabs .market-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === 'all');
  });
  renderMarket('');
}
function closeMarketPanel() {
  document.getElementById('market-mask').classList.remove('show');
}
function switchMarketTab(btn) {
  _marketTab = btn.dataset.cat;
  document.querySelectorAll('#market-tabs .market-tab').forEach(t => t.classList.toggle('active', t === btn));
  renderMarket(_marketSearch);
}
function renderMarket(kw) {
  _marketSearch = (kw || '').trim().toLowerCase();
  const listEl = document.getElementById('market-list');
  const countEl = document.getElementById('market-count');
  if (!listEl) return;
  let items = MARKET_MOCK.filter(i => _marketTab === 'all' || i.cat === _marketTab);
  if (_marketSearch) items = items.filter(i => i.name.toLowerCase().includes(_marketSearch));
  if (countEl) countEl.textContent = items.length + ' 个';
  const installed = getConfig().categories || [];
  let html = '';
  if (!items.length) {
    html = '<div class="market-empty">没有找到匹配的词库</div>';
  }
  items.forEach(i => {
    const isInstalled = installed.includes(i.name);
    html += `
      <div class="market-item">
        <div class="market-item-main">
          <div class="market-item-name">${i.name}</div>
          <div class="market-item-desc">${i.desc}</div>
          <div class="market-item-meta">${i.meta} · ${i.words} 词</div>
        </div>
        <button class="market-install ${isInstalled ? 'done' : ''}" onclick="installMarketItem(this, '${i.name}')">${isInstalled ? '已安装' : '安装'}</button>
      </div>`;
  });
  listEl.innerHTML = html;
}
// 占位：真实安装逻辑应调用后端下载词库后写入本地词库，这里仅提示
function installMarketItem(btn, name) {
  if (btn.classList.contains('done')) return;
  toast('「' + name + '」即将上线，敬请期待');
}

function copyImportPrompt() {
  const text = IMPORT_PROMPT_TEMPLATE;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      toast('提示词已复制');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); toast('提示词已复制'); }
  catch(e) { toast('复制失败，请手动选择复制'); }
  document.body.removeChild(ta);
}

// 解析 AI 返回的 JSON（容错处理：去除 markdown 代码块标记）
function parseWordBankJSON(raw) {
  let text = raw.trim();
  // 去除 markdown 代码块标记 ```json ... ``` 或 ``` ... ```
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  // 尝试找到 JSON 数组的起始和结束
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.substring(start, end + 1);
  }
  return JSON.parse(text);
}

// 校验单个词条
function validateWordEntry(entry, index) {
  const errors = [];
  if (!entry || typeof entry !== 'object') {
    return [`第${index+1}条：不是有效对象`];
  }
  if (!entry.word || typeof entry.word !== 'string' || entry.word.trim().length === 0) {
    errors.push(`第${index+1}条：缺少 word 字段`);
  }
  if (!entry.meanings || !Array.isArray(entry.meanings) || entry.meanings.length === 0) {
    errors.push(`第${index+1}条：缺少 meanings 字段`);
  }
  if (!entry.sentence || typeof entry.sentence !== 'string' || entry.sentence.trim().length === 0) {
    errors.push(`第${index+1}条：缺少 sentence 字段`);
  }
  // 补全可选字段
  if (!entry.phonetic) entry.phonetic = '';
  if (!entry.category) entry.category = 'custom';
  return errors;
}

function confirmImport() {
  const textarea = document.getElementById('import-textarea');
  const statsEl = document.getElementById('import-stats');
  const raw = textarea.value.trim();

  if (!raw) {
    statsEl.textContent = '请先粘贴 AI 生成的词库 JSON';
    statsEl.className = 'import-stats error';
    return;
  }

  let words;
  try {
    words = parseWordBankJSON(raw);
  } catch(e) {
    statsEl.textContent = 'JSON 解析失败：' + e.message;
    statsEl.className = 'import-stats error';
    return;
  }

  if (!Array.isArray(words) || words.length === 0) {
    statsEl.textContent = '词库格式不正确：需要一个非空 JSON 数组';
    statsEl.className = 'import-stats error';
    return;
  }

  // 校验所有词条
  const allErrors = [];
  words.forEach((w, i) => {
    const errs = validateWordEntry(w, i);
    allErrors.push(...errs);
  });

  if (allErrors.length > 0) {
    statsEl.innerHTML = '校验发现 ' + allErrors.length + ' 个错误：<br/>' + allErrors.slice(0, 5).join('<br/>') + (allErrors.length > 5 ? '<br/>…等' : '');
    statsEl.className = 'import-stats error';
    return;
  }

  // 补全缺失音标：从内置词库复用同词音标（覆盖 AI 漏填的常见词），
  // 本地完成、无需联网，使导入词也尽量带音标。
  const builtinPhone = {};
  BUILTIN_WORD_BANK.forEach(w => { if (w.phonetic) builtinPhone[w.word] = w.phonetic; });
  let filledPhone = 0;
  words.forEach(w => {
    if (!w.phonetic) {
      const p = builtinPhone[(w.word || '').trim()];
      if (p) { w.phonetic = p; filledPhone++; }
    }
  });

  // 导入：纯追加，不做任何对全局词库的去重/合并。
  // 去重与合并推迟到"选中词库开始学习"时，由 mergeCustomWords 按选中场景统一处理。
  // 这样即使不学已有的那些词库、只学导入的新词库，也能完整学到所有导入的词。
  const customWords = getCustomWords();
  const customBefore = customWords instanceof Array ? customWords : [];
  words.forEach(w => {
    customBefore.push({
      word: w.word.trim(),
      phonetic: w.phonetic || '',
      meanings: w.meanings,
      sentence: w.sentence,
      category: w.category || 'custom',
      deep: w.deep || null
    });
  });
  saveCustomWords(customBefore);

  // 更新自定义分类标签
  const customCats = getCustomCategories();
  const newCats = {};
  words.forEach(w => {
    const cat = w.category || 'custom';
    if (!SCENE_LABELS[cat] && !customCats[cat]) {
      // 从 category 生成中文标签：短横线转空格，首字母大写
      const label = cat.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      newCats[cat] = label;
    }
  });
  if (Object.keys(newCats).length > 0) {
    Object.assign(customCats, newCats);
    saveCustomCategories(customCats);
    Object.assign(SCENE_LABELS, newCats);
  }

  // 重建合并：把新导入的词并入 WORD_BANK（含场景义索引与例句）
  mergeCustomWords();

  // 自动把新导入的词库设为当前专注词库（单词库优先）
  const config = getConfig();
  const firstCat = words[0] ? (words[0].category || 'custom') : 'custom';
  config.categories = [firstCat];
  saveConfigData(config);

  const parts = [];
  parts.push(words.length + ' 个新增');
  if (filledPhone > 0) parts.push('补全 ' + filledPhone + ' 个音标');
  statsEl.innerHTML = '✓ ' + parts.join('，') + '';
  statsEl.className = 'import-stats success';
  textarea.value = '';

  refreshImportList();
  refreshHome();
  toast('已导入 ' + words.length + ' 个单词');
}

function refreshImportList() {
  const listEl = document.getElementById('import-list');
  const customWords = getCustomWords();
  if (customWords.length === 0) {
    listEl.innerHTML = '<div class="import-empty">尚未导入任何自定义词库</div>';
    return;
  }
  // 按分类分组统计
  const groups = {};
  customWords.forEach(w => {
    const cat = w.category || 'custom';
    if (!groups[cat]) groups[cat] = { count: 0, label: SCENE_LABELS[cat] || cat, words: [] };
    groups[cat].count++;
    groups[cat].words.push(w);
  });
  listEl.innerHTML = Object.entries(groups).map(([cat, info]) => {
    return '<div class="import-list-item">' +
      '<div class="ili-info">' +
        '<div class="ili-name">' + info.label + '</div>' +
        '<div class="ili-meta">' + info.count + ' 词 · ' + cat + '</div>' +
      '</div>' +
      '<button class="ili-delete" onclick="deleteCustomGroup(\'' + cat + '\')">×</button>' +
    '</div>';
  }).join('');
}

function deleteCustomGroup(cat) {
  // 从自定义词库中移除该分类下的所有词
  const customWords = getCustomWords();
  const filtered = customWords.filter(w => (w.category || 'custom') !== cat);
  saveCustomWords(filtered);
  // 移除分类标签（持久化 + 内存 SCENE_LABELS）
  const customCats = getCustomCategories();
  if (customCats[cat]) { delete customCats[cat]; saveCustomCategories(customCats); }
  if (SCENE_LABELS[cat]) delete SCENE_LABELS[cat];
  // 重建 WORD_BANK 与场景义索引（由 mergeCustomWords 统一处理，避免脏状态残留）
  mergeCustomWords();
  // 清理该词库残留的学习记录（孤儿词），与删除确认文案"全部学习记录将被移除"一致
  cleanupOrphanRecords();
  // 从配置中移除该分类，并清理内存选中的残留
  const config = getConfig();
  config.categories = config.categories.filter(c => c !== cat);
  saveConfigData(config);
  if (typeof selectedCategories !== 'undefined' && selectedCategories.delete) selectedCategories.delete(cat);
  refreshImportList();
  refreshHome();
  toast('已删除该分类词库');
}

// 从词库管理面板删除自定义词库（带确认，删除后刷新词库面板）
function deleteCustomLib(cat, label) {
  showConfirm('删除「' + label + '」', '删除后该自定义词库及其全部学习记录将被移除，且不可恢复。确定删除吗？').then(ok => {
    if (!ok) return;
    deleteCustomGroup(cat);
    renderLibPanelList();
  });
}

function clearCustomWords() {
  if (getCustomWords().length === 0) return;
  showConfirm('清除自定义词库', '确定要删除所有导入的词库吗？').then(ok => {
    if (ok) {
      Store.removeItem(STORAGE_KEY_CUSTOM_WORDS);
      Store.removeItem(STORAGE_KEY_CUSTOM_CATS);
      // 清理内存中残留的自定义分类标签与选中状态
      Object.keys(SCENE_LABELS).forEach(k => {
        if (!BUILTIN_SCENE_KEYS.has(k)) delete SCENE_LABELS[k];
      });
      if (typeof selectedCategories !== 'undefined' && selectedCategories.clear) selectedCategories.clear();
      // 重建 WORD_BANK 与场景义索引，彻底清除自定义数据
      mergeCustomWords();
      // 清理自定义词库的孤儿学习记录
      cleanupOrphanRecords();
      refreshImportList();
      refreshHome();
      toast('已清除所有自定义词库');
    }
  });
}

// ========== 键盘 ==========
document.addEventListener('keydown', e=>{
  const sp = document.getElementById('page-study');
  if(!sp.classList.contains('active')) return;
  if(e.code==='Space' || e.code==='ArrowRight'){ e.preventDefault(); nextWord(); }
  else if(e.code==='KeyA' || e.code==='ArrowLeft'){ e.preventDefault(); prevWord(); }
  else if(e.code==='KeyS'){ e.preventDefault(); if(currentMode==='learn') skipWord(); }
  else if(e.code==='Escape'){ confirmExit(); }
});

// ========== 移动端滑动切换 ==========
let mobileSwipeView = 'word'; // 'word' or 'deep'
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
let isSwiping = false;
let swipeAxis = null; // 'x' or 'y' - determined after initial movement
let mobileViewTimeout = null; // 跟踪setMobileView的清理定时器
let swipeTrackEl = null; // 缓存 track 元素，避免每次 touchmove 都查询
let swipeTrackWidth = 0; // 缓存 track 宽度
let swipeRafId = null; // requestAnimationFrame ID
let swipePendingTranslate = 0; // 待应用的 translate 值

function setMobileView(view) {
  mobileSwipeView = view;
  const track = document.getElementById('mobile-swipe-track');
  const dotWord = document.getElementById('tab-dot-word');
  const dotDeep = document.getElementById('tab-dot-deep');
  const hint = document.getElementById('mobile-swipe-hint');
  if (!track) return;
  // 清除之前的清理定时器
  if (mobileViewTimeout) { clearTimeout(mobileViewTimeout); mobileViewTimeout = null; }
  if (swipeRafId) { cancelAnimationFrame(swipeRafId); swipeRafId = null; }
  const trackWidth = track.parentElement ? track.parentElement.clientWidth : window.innerWidth;
  // 启用过渡动画
  track.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
  // 使用像素值进行过渡，避免百分比和像素混合问题
  if (view === 'deep') {
    track.style.transform = 'translateX(' + (-trackWidth) + 'px)';
    track.classList.add('slide-to-deep');
    if (dotWord) dotWord.classList.remove('active');
    if (dotDeep) dotDeep.classList.add('active');
    if (hint) hint.textContent = '← 右滑返回单词卡';
  } else {
    track.style.transform = 'translateX(0)';
    track.classList.remove('slide-to-deep');
    if (dotWord) dotWord.classList.add('active');
    if (dotDeep) dotDeep.classList.remove('active');
    if (hint) hint.textContent = '左滑查看深度解析 →';
  }
  // 过渡结束后清除内联transform，让CSS类接管（避免resize问题）
  mobileViewTimeout = setTimeout(() => {
    mobileViewTimeout = null;
    if (mobileSwipeView === view) {
      track.style.transition = '';
      track.style.transform = '';
    }
  }, 350);
}

document.addEventListener('touchstart', e=>{
  const sp = document.getElementById('page-study');
  if(!sp || !sp.classList.contains('active')) return;
  // 只在移动端生效
  if (window.innerWidth > 768) return;
  // 忽略按钮和卡片点击区域上的滑动
  const target = e.target;
  if (target.closest('.study-actions') || target.closest('.speak-btn') || target.closest('.study-header') || target.closest('button') || target.closest('input') || target.closest('textarea')) return;
  // 如果在深度解析页面且面板可以向下滚动，禁止水平滑动以避免与垂直滚动冲突
  if (mobileSwipeView === 'deep') {
    const deepPanel = document.getElementById('deep-panel-mobile') || document.querySelector('.deep-panel-mobile');
    if (deepPanel && deepPanel.scrollTop > 5) {
      touchStartX = 0; // 标记为不处理滑动
      return;
    }
  }
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
  isSwiping = false;
  swipeAxis = null;
  // 缓存 track 元素和宽度，避免 touchmove 中反复查询触发重排
  swipeTrackEl = document.getElementById('mobile-swipe-track');
  swipeTrackWidth = swipeTrackEl && swipeTrackEl.parentElement ? swipeTrackEl.parentElement.clientWidth : window.innerWidth;
  // 取消任何进行中的视图切换动画
  if (mobileViewTimeout) { clearTimeout(mobileViewTimeout); mobileViewTimeout = null; }
  if (swipeRafId) { cancelAnimationFrame(swipeRafId); swipeRafId = null; }
}, {passive:true});

document.addEventListener('touchmove', e=>{
  const sp = document.getElementById('page-study');
  if(!sp || !sp.classList.contains('active')) return;
  if (window.innerWidth > 768) return;
  if (touchStartX === 0) return;
  const touch = e.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // 确定滑动方向（只在第一次明显移动时判定，提高阈值到1.5倍避免误触）
  if (!swipeAxis && (absDx > 10 || absDy > 10)) {
    if (absDx > absDy * 1.5) {
      swipeAxis = 'x';
      isSwiping = true;
    } else {
      swipeAxis = 'y';
      isSwiping = false;
    }
  }

  // 水平滑动时，提供视觉跟随
  if (swipeAxis === 'x' && isSwiping) {
    if (!swipeTrackEl) return;
    let translate;
    const baseTranslate = mobileSwipeView === 'deep' ? -swipeTrackWidth : 0;
    // 边界阻尼
    let offset = dx;
    if (mobileSwipeView === 'word' && dx < 0) {
      // 左滑：去深度页
      offset = Math.max(offset, -swipeTrackWidth * 0.6);
    } else if (mobileSwipeView === 'deep' && dx > 0) {
      // 右滑：回单词页（仅在面板顶部时）
      const deepPanel = document.getElementById('deep-panel-mobile');
      if (deepPanel && deepPanel.scrollTop > 5) {
        swipeAxis = 'y'; isSwiping = false; return;
      }
      offset = Math.min(offset, swipeTrackWidth * 0.6);
    } else {
      // 反方向滑动：阻尼效果
      offset = offset * 0.2;
    }
    translate = baseTranslate + offset;
    // 用 requestAnimationFrame 批量更新，避免每帧多次写操作
    swipePendingTranslate = translate;
    if (!swipeRafId) {
      swipeRafId = requestAnimationFrame(() => {
        swipeRafId = null;
        if (swipeTrackEl && isSwiping) {
          swipeTrackEl.style.transition = 'none';
          swipeTrackEl.style.transform = 'translateX(' + swipePendingTranslate + 'px)';
        }
      });
    }
  }
}, {passive:true});

document.addEventListener('touchend', e=>{
  const sp = document.getElementById('page-study');
  if(!sp || !sp.classList.contains('active')) return;
  if (window.innerWidth > 768) return;
  if (touchStartX === 0) { swipeAxis = null; isSwiping = false; return; }
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const dt = Date.now() - touchStartTime;
  touchStartX = 0;
  // 重置手势状态
  const track = document.getElementById('mobile-swipe-track');
  // 水平滑动距离 > 垂直*1.5，且 > 50px（快速滑动30px即可触发）
  const fastSwipe = dt < 250 && Math.abs(dx) > 30;
  const slowSwipe = Math.abs(dx) > 60;
  if (swipeAxis === 'x' && Math.abs(dx) > Math.abs(dy) * 1.5 && (fastSwipe || slowSwipe)) {
    if (dx < 0) {
      // 左滑：去深度解析
      if (mobileSwipeView === 'word') setMobileView('deep');
      else setMobileView(mobileSwipeView); // 保持
    } else {
      // 右滑：回单词卡
      if (mobileSwipeView === 'deep') setMobileView('word');
      else setMobileView(mobileSwipeView); // 保持
    }
  } else if (swipeAxis === 'x' && isSwiping) {
    // 滑动距离不够，回弹
    setMobileView(mobileSwipeView);
  }
  swipeAxis = null;
  isSwiping = false;
}, {passive:true});

// ========== 引导页 ==========
function toggleScene(el) {
  const cat = el.dataset.cat;
  // 单词库优先：引导页也只选一个词库，点击即切换
  if (selectedCategories.has(cat)) return; // 已选中，保持
  selectedCategories.clear();
  document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('selected'));
  selectedCategories.add(cat);
  el.classList.add('selected');
  updateOnboardBtn();
}
function updateOnboardBtn() {
  const btn = document.getElementById('onboard-btn');
  const hint = document.getElementById('onboard-hint');
  const btnText = document.getElementById('onboard-btn-text');
  if (selectedCategories.size>0) {
    const cat = [...selectedCategories][0];
    btn.classList.add('ready');
    hint.textContent = '将从「' + (SCENE_LABELS[cat] || cat) + '」开始学习';
    btnText.textContent = '开启我的词库';
  } else {
    btn.classList.remove('ready');
    hint.textContent = '选择一个词库开始学习';
    btnText.textContent = '开启全部词库';
  }
}
function finishOnboard() {
  if (selectedCategories.size===0) {
    const first = document.querySelector('.scene-card');
    if (first) selectedCategories.add(first.dataset.cat);
  }
  const config = getConfig();
  config.categories = [...selectedCategories].slice(0, 1);
  saveConfigData(config);
  // 新用户引导完成：清除可能残留的旧学习记录和连续天数
  Store.removeItem(STORAGE_KEY_RECORDS);
  Store.removeItem(STORAGE_KEY_STREAK);
  Store.setItem(STORAGE_KEY_ONBOARD,'1');
  document.getElementById('page-onboard').classList.remove('active');
  document.body.classList.remove('onboarding');
  refreshHome();
}
function skipOnboard() {
  Store.setItem(STORAGE_KEY_ONBOARD,'1');
  const config = getConfig();
  config.categories = ['ai-prompt'];
  saveConfigData(config);
  // 跳过引导也清除旧记录
  Store.removeItem(STORAGE_KEY_RECORDS);
  Store.removeItem(STORAGE_KEY_STREAK);
  document.getElementById('page-onboard').classList.remove('active');
  document.body.classList.remove('onboarding');
  refreshHome();
}

function showOnboard(){
  document.body.classList.add('onboarding');
  document.getElementById('page-onboard').classList.add('active');
}
// 场景标签：点击学习模式文字时短暂显示，自动淡出
let _sceneTagTimer = null;
function peekSceneTag() {
  const tag = document.getElementById('w-scene-tag');
  if (!tag || !tag.textContent) return;
  tag.classList.add('peek');
  if (_sceneTagTimer) clearTimeout(_sceneTagTimer);
  _sceneTagTimer = setTimeout(() => tag.classList.remove('peek'), 2500);
}

async function init() {
  // 先加载持久化数据（原生 Preferences / 浏览器 localStorage），确保后续同步读取有值
  try { await Store.init(); } catch(e) {}
  // 执行 schema 版本迁移：为旧数据补上版本号，并运行从旧版本到当前版本的逐级迁移
  try { Store.runMigrations(); } catch(e) {}
  // 将用户导入的自定义词库合并进 WORD_BANK（必须在 Store.init 之后，否则读不到持久化数据）
  if (typeof mergeCustomWords === 'function') mergeCustomWords();
  // 应用主题模式（必须在渲染前设置 data-theme）
  initTheme();
  // 应用字体方案（默认经典字体）
  initFont();
  // 应用操作提示显示状态
  applyHints();
  updateHintsUI();
  // 数据清理：移除无效记录（currentRound 不是有效数字或 nextReviewTime 无效）
  cleanupRecords();
  // 清理孤儿记录：移除不属于当前词库的残留学习记录（需在 mergeCustomWords 之后）
  cleanupOrphanRecords();
  // 应用自定义背景视频
  applyBgVideo();
  // 同步背景动画开关 UI
  updateBgVideoUI();
  // 后台暂停视频（省电）
  setupVideoAppState();
  initMaskDimVideo();
  // 注册 Android 物理返回键
  setupBackButton();
  // 点击学习模式文字时，短暂显示场景标签
  const studyMode = document.getElementById('study-mode');
  if (studyMode) studyMode.addEventListener('click', peekSceneTag);
  // 窗口大小变化时重新适配字号（处理横竖屏切换）
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const studyPage = document.getElementById('page-study');
      if (studyPage && studyPage.classList.contains('active')) {
        const wordEl = document.getElementById('w-en');
        const card = document.getElementById('word-card');
        if (wordEl && card) fitWordToSingleLine(wordEl, card);
      }
    }, 150);
  });
  const onboarded = Store.getItem(STORAGE_KEY_ONBOARD);
  if (!onboarded) showOnboard();
  else {
    refreshHome();
    // 初始状态：首页隐藏右侧面板
    const rightPanel = document.querySelector('.panel-right');
    if (rightPanel) {
      rightPanel.style.opacity = '0';
      rightPanel.style.pointerEvents = 'none';
    }
    checkReminder();
    updateCalendarButton();
    // 检查是否有未完成的学习，提示恢复
    const progress = getStudyProgress();
    if (progress && progress.queue && progress.queue.length > 0) {
      setTimeout(() => {
        showConfirm('继续学习', '上次学到第 ' + (progress.index + 1) + '/' + progress.queue.length + ' 个词，要继续吗？').then(ok => {
          if (ok) resumeStudy();
          else clearStudyProgress();
        });
      }, 500);
    }
  }
}

// ========== Android 物理返回键 ==========
function setupBackButton() {
  // Capacitor APP 插件（原生环境）
  try {
    const cap = window.Capacitor;
    if (cap && cap.Plugins && cap.Plugins.App) {
      cap.Plugins.App.addListener('backButton', () => {
        handleBackButton();
      });
      return;
    }
  } catch(e) {}
  // 浏览器环境：监听 popstate
  window.addEventListener('popstate', () => {
    handleBackButton();
  });
}
function handleBackButton() {
  // 引导页：不处理（让系统默认行为）
  const onboard = document.getElementById('page-onboard');
  if (onboard && onboard.classList.contains('active')) return;
  // 学习页：确认退出
  const study = document.getElementById('page-study');
  if (study && study.classList.contains('active')) {
    confirmExit();
    return;
  }
  // 设置页：回首页
  const settings = document.getElementById('page-settings');
  if (settings && settings.classList.contains('active')) {
    autoSaveSettings(); showPage('home'); refreshHome();
    return;
  }
  // 完成页：回首页
  const done = document.getElementById('page-done');
  if (done && done.classList.contains('active')) {
    showPage('home'); refreshHome();
    return;
  }
  // 首页：退出 APP（Capacitor 默认行为）
}
function cleanupRecords() {
  try {
    const records = getRecords();
    let changed = false;
    for (const [w, r] of Object.entries(records)) {
      // 清理无效的 currentRound
      if (typeof r.currentRound !== 'number' || isNaN(r.currentRound)) {
        delete records[w];
        changed = true;
        continue;
      }
      // 清理 currentRound=0 的记录（不应该存在）
      if (r.currentRound === 0) {
        delete records[w];
        changed = true;
        continue;
      }
      // 修复无效的 nextReviewTime：如果轮次在1-6之间但 nextReviewTime 无效，重新计算
      if (r.currentRound > 0 && r.currentRound < 7) {
        if (typeof r.nextReviewTime !== 'number' || isNaN(r.nextReviewTime) || r.nextReviewTime <= 0) {
          r.nextReviewTime = calcNextReview(r.currentRound, r.lastReviewTime || Date.now());
          changed = true;
        }
      }
    }
    if (changed) saveRecords(records);
  } catch(e) {}
}
init();
