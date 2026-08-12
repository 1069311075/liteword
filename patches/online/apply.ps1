# ============================================================
# 轻词 LiteWord - 联网补丁包 · 一键合入脚本
# 作用：把"联网版"独有的一套（后端 + 云同步 + 手机号登录）合入"不联网版"项目，
#       用于发布带云同步功能的版本。不联网版后续的新功能改动会保留，不会被覆盖。
#
# 用法：  powershell -ExecutionPolicy Bypass -File patches\online\apply.ps1
#
# 幂等：  可重复执行。已安装的部分会自动跳过，不会重复插入。
# 回滚：  见 README.md 的"如何撤销"一节（用 git 恢复被改动的文件即可）。
# ============================================================
$ErrorActionPreference = 'Stop'

# --- 重建完整 PATH（node/git 等工具可能不在默认 PATH） ---
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [Environment]::GetEnvironmentVariable('Path','User') + ';' + $env:Path

# --- 路径 ---
$patchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path        # patches\online
$projRoot  = Split-Path -Parent (Split-Path -Parent $patchRoot)     # 项目根
$www       = Join-Path $projRoot 'www'
$android   = Join-Path $projRoot 'android'
$robocopy  = 'C:\Windows\System32\robocopy.exe'

Write-Host "==> 联网补丁合入 (项目: $projRoot)" -ForegroundColor Cyan

# --- 工具函数：读文件、写文件、幂等补丁 ---
function Read-Text($p) { return [IO.File]::ReadAllText($p) }
function Write-Text($p, $c) { [IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding($false))) }

# 在 anchor 第一次出现处插入 insertText（before=$true 插前面，否则插后面）
function Insert-AfterAnchor($file, $anchor, $marker, $insertText, $before = $false) {
  $c = Read-Text $file
  if ($c.Contains($marker)) { Write-Host "  [跳过] 已存在: $marker" -ForegroundColor DarkGray; return }
  if (-not $c.Contains($anchor)) { Write-Host "  [警告] 找不到锚点，未修改: $anchor" -ForegroundColor Yellow; return }
  $idx = $c.IndexOf($anchor)
  $pos = if ($before) { $idx } else { $idx + $anchor.Length }
  $c = $c.Substring(0, $pos) + $insertText + $c.Substring($pos)
  Write-Text $file $c
  Write-Host "  [完成] 已插入: $marker" -ForegroundColor Green
}

# 字面量替换（info 文案等精确替换）
function Replace-Text($file, $old, $new, $marker) {
  $c = Read-Text $file
  if ($c.Contains($new)) { Write-Host "  [跳过] 已存在: $marker" -ForegroundColor DarkGray; return }
  if (-not $c.Contains($old)) { Write-Host "  [警告] 找不到原文，未替换: $marker" -ForegroundColor Yellow; return }
  $c = $c.Replace($old, $new)
  Write-Text $file $c
  Write-Host "  [完成] 已替换: $marker" -ForegroundColor Green
}

# ============================================================
# 1. 后端源码（独立目录，直接复制）
# ============================================================
$backendDst = Join-Path $projRoot 'backend'
if (Test-Path (Join-Path $backendDst 'app\main.py')) {
  Write-Host "  [跳过] backend 已存在" -ForegroundColor DarkGray
} else {
  & $robocopy (Join-Path $patchRoot 'backend') $backendDst /E /IS /NFL /NDL /NJH | Out-Null
  Write-Host "  [完成] 已复制 backend $(Get-ChildItem $backendDst -Recurse -File).Count 个文件" -ForegroundColor Green
}

# ============================================================
# 2. 云同步模块 sync.js（独立文件）
# ============================================================
$syncDst = Join-Path $www 'sync.js'
if (Test-Path $syncDst) {
  Write-Host "  [跳过] www\sync.js 已存在" -ForegroundColor DarkGray
} else {
  Copy-Item (Join-Path $patchRoot 'www\sync.js') $syncDst -Force
  Write-Host "  [完成] 已复制 www\sync.js" -ForegroundColor Green
}

# ============================================================
# 3. 接线改动（幂等插入 / 替换）
# ============================================================
$idx = Join-Path $www 'index.html'
$app = Join-Path $www 'app.js'
$css = Join-Path $www 'style.css'
$main = Join-Path $android 'app\src\main\java\com\liteword\app\MainActivity.java'
$manifest = Join-Path $android 'app\src\main\AndroidManifest.xml'

# --- 3.1 登录页（全屏） ---
$loginPage = @'
<!-- ===== 登录页（全屏） ===== -->
<div id="page-login">
  <div class="login-glass lg-strong">
    <div class="login-content">
      <nav class="login-nav">
        <div class="onboard-nav-logo">
          <div class="logo-dot lg">轻</div>
          <span>LiteWord</span>
        </div>
        <button class="login-close lg" onclick="closeLogin()" title="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </nav>
      <div class="login-hero">
        <h1 class="login-title">Sign <em>in</em></h1>
        <p class="login-sub">手机号登录 · 多设备同步</p>

        <div class="login-form" id="login-form-wrap">
          <div class="login-field">
            <input type="tel" class="login-input" id="login-phone" placeholder="请输入手机号" maxlength="11" autocomplete="tel">
          </div>
          <div class="login-field row">
            <input type="text" class="login-input" id="login-code" placeholder="6 位验证码" maxlength="6" autocomplete="one-time-code">
            <button class="login-code-btn lg" id="login-btn-code" onclick="sync.sendCodeFromLogin()">获取验证码</button>
          </div>
          <button class="login-submit lg" id="login-btn-submit" onclick="sync.loginWithSmsFromLogin()">
            <span>登录 / 注册</span>
          </button>
        </div>

        <div class="login-signedin" id="login-signedin" style="display:none;">
          <div class="login-avatar lg">✓</div>
          <div class="login-phone" id="login-user-phone"></div>
          <button class="login-submit lg muted" onclick="sync.logoutFromLogin()">退出登录</button>
        </div>

        <div class="login-status" id="login-status"></div>
      </div>
    </div>
  </div>
</div>
'@
Insert-AfterAnchor $idx '<!-- ===== 主应用壳 ===== -->' 'id="page-login"' ("`n`n" + $loginPage + "`n") $true

# --- 3.2 首页 header 登录按钮 ---
Insert-AfterAnchor $idx '<div class="header-actions">' 'id="btn-hdr-login"' "`n              <button class=`"header-login lg`" id=`"btn-hdr-login`" onclick=`"openLogin()`">登录</button>" $false

# --- 3.3 云同步设置区块（设置在"数据管理"组之前） ---
$syncSettings = @'
<div class="settings-group-title">云同步</div>
          <div class="settings-group lg">
            <div class="setting-item">
              <div class="setting-label">服务器地址<br/><span class="setting-sub">后端 API 地址</span></div>
              <input type="text" class="setting-input" id="set-sync-server" placeholder="http://127.0.0.1:8000" value="http://127.0.0.1:8000" onchange="sync.saveServer(this.value)">
            </div>
            <div class="setting-item" id="sync-login-fields">
              <div class="setting-label">手机号<br/><span class="setting-sub">一键登录，未注册自动开通</span></div>
              <input type="tel" class="setting-input" id="set-sync-phone" placeholder="11 位手机号">
            </div>
            <div class="setting-item" id="sync-pass-fields">
              <div class="setting-label">验证码</div>
              <div class="sync-actions">
                <input type="text" class="setting-input" id="set-sync-code" placeholder="6 位验证码" style="flex:1;">
                <button class="setting-btn" id="btn-send-code" onclick="sync.sendCode()">获取验证码</button>
              </div>
            </div>
            <div class="setting-item">
              <div class="setting-label">登录</div>
              <button class="setting-btn primary" id="btn-sync-login" onclick="sync.loginWithSms()">登录 / 注册</button>
            </div>
            <div class="setting-item" id="sync-user-row" style="display:none;">
              <div class="setting-label">已登录<br/><span class="setting-sub" id="sync-user-name"></span></div>
              <button class="setting-btn" onclick="sync.logout()">退出</button>
            </div>
            <div class="setting-item">
              <div class="setting-label">立即同步</div>
              <button class="setting-btn" id="btn-sync-run" onclick="sync.syncNow()">同步</button>
            </div>
            <div class="setting-item">
              <div class="setting-label">同步状态</div>
              <div class="sync-status" id="sync-status">未登录</div>
            </div>
          </div>
'@
Insert-AfterAnchor $idx '<div class="settings-group-title">数据管理</div>' 'id="set-sync-server"' ("`n          " + $syncSettings + "`n          ") $true

# --- 3.4 注销账号（在"重置所有数据"之后） ---
$accountDel = @'

            <div class="setting-item single" id="account-delete-row" style="cursor:pointer;">
              <div class="setting-label">注销账号<br/><span class="setting-sub">删除云端账号与同步数据</span></div>
              <button class="setting-btn danger" onclick="deleteAccount()">注销</button>
            </div>
'@
Insert-AfterAnchor $idx '<button class="setting-btn danger" onclick="resetData()">清空</button>' 'id="account-delete-row"' $accountDel $false

# --- 3.5 加载 sync.js ---
Insert-AfterAnchor $idx '<script src="words.js"></script>' 'src="sync.js"' "`n<script src=`"sync.js`"></script>" $false

# --- 3.6 app.js：showPage 钩子 ---
$showPageHook = @'
  // 打开设置页时刷新云同步登录状态
  if (name === 'settings' && typeof sync !== 'undefined' && sync.loadSettingsUI) {
    sync.loadSettingsUI();
  }
'@
Insert-AfterAnchor $app 'document.getElementById(''page-''+name).classList.add(''active'');' 'sync.loadSettingsUI' ("`n  " + $showPageHook) $false

# --- 3.7 app.js：登录函数 ---
$loginFuncs = @'
// ========== 独立登录页 ==========
function updateLoginEntry() {
  const loggedIn = !!(window.sync && sync.auth && sync.auth.token);
  const btn = document.getElementById('btn-hdr-login');
  if (!btn) return;
  if (loggedIn) {
    btn.textContent = '已同步';
    btn.classList.add('signed-in');
  } else {
    btn.textContent = '登录';
    btn.classList.remove('signed-in');
  }
}
function openLogin() {
  const loggedIn = !!(window.sync && sync.auth && sync.auth.token);
  const form = document.getElementById('login-form-wrap');
  const signed = document.getElementById('login-signedin');
  const fine = document.getElementById('login-fine-tip');
  if (loggedIn) {
    if (form) form.style.display = 'none';
    if (signed) signed.style.display = 'flex';
    if (fine) fine.style.display = 'none';
    const phoneEl = document.getElementById('login-user-phone');
    if (phoneEl) phoneEl.textContent = sync.auth.username || '';
  } else {
    if (form) form.style.display = '';
    if (signed) signed.style.display = 'none';
    if (fine) fine.style.display = '';
  }
  document.body.classList.add('logined');
  document.getElementById('page-login').classList.add('active');
}
function closeLogin() {
  document.getElementById('page-login').classList.remove('active');
  document.body.classList.remove('logined');
}

'@
Insert-AfterAnchor $app 'function toast(msg) {' 'function updateLoginEntry' ("`n" + $loginFuncs) $true

# --- 3.8 app.js：注销账号函数 ---
$deleteAccount = @'
// 注销账号：二次确认后删除云端账号，保留本地数据
async function deleteAccount() {
  const loggedIn = !!(window.sync && sync.auth && sync.auth.token);
  if (!loggedIn) { toast('当前未登录'); return; }
  const ok = await showConfirm('注销账号', '确定要注销当前账号吗？将永久删除云端账号及其同步数据。本地学习数据会保留在你的设备上。此操作不可恢复。');
  if (!ok) return;
  const done = await sync.deleteAccount();
  if (done) { toast('账号已注销'); refreshHome(); }
}

'@
Insert-AfterAnchor $app '// ========== 导入词库 ==========' 'async function deleteAccount' ("`n" + $deleteAccount) $true

# --- 3.9 app.js：隐私/协议文案（替换为联网版表述） ---
Replace-Text $app "['数据归属', '你的学习记录、词库与连续天数全部保存在设备本地，不会上传到任何服务器。']," "['数据归属', '你的学习记录、词库与连续天数默认保存在设备本地，不会上传到任何服务器。'],
      ['账号与云同步', '当你登录云端同步时，仅会同步你的学习数据用于多设备备份。我们不会收集你的通讯录、相册、位置等无关信息。']," '隐私-数据归属'
Replace-Text $app "['数据安全', '所有学习数据仅存于本机，不会被上传或以任何方式传输到外部。']," "['数据安全', '我们采用加密连接传输你的登录凭据与学习数据，并尽力保障数据不被未授权访问。']," '隐私-数据安全'
Replace-Text $app "['你的权利', '你可以随时在设置中清空全部数据，无需担心账号或云端残留。']" "['你的权利', '你可以随时在设置中清空全部数据，或通过账号注销删除云端备份。']" '隐私-你的权利'
Replace-Text $app "['服务说明', '轻词 LiteWord 是一款本地优先的英语单词学习应用，提供分类学习与记忆复习功能。']," "['服务说明', '轻词 LiteWord 是一款本地优先的英语单词学习应用，提供分类学习、记忆复习与云端同步（可选）功能。']," '协议-服务说明'
Replace-Text $app "['数据与隐私', '全部数据仅保存在你的设备本地，不上传任何服务器，具体见《隐私政策》。']," "['数据与隐私', '未登录时，全部数据仅保存在你的设备。登录后，学习数据将用于同步备份，具体见《隐私政策》。']," '协议-数据与隐私'

# --- 3.10 app.js：init 钩子 ---
$initHook = @'
  // 初始化云同步模块（注册写入钩子；已登录则后台拉取合并）
  if (typeof sync !== 'undefined' && sync.init) { try { sync.init(); } catch(e) {} }
  // 登录入口状态 & 监听登录态变化（登录/退出后刷新首页按钮）
  window.onSyncAuthChange = updateLoginEntry;
  updateLoginEntry();
'@
Insert-AfterAnchor $app 'try { Store.runMigrations(); } catch(e) {}' 'sync.init' ("`n  " + $initHook) $false

# --- 3.11 style.css：云同步样式 ---
$cssSync = @'
/* 云同步 */
#set-sync-server { width:150px; text-align:left; flex-shrink:1; }
#set-sync-phone { width:150px; text-align:left; flex-shrink:1; }
#set-sync-code { width:110px; text-align:left; flex-shrink:1; }
.sync-actions { display:flex; gap:8px; align-items:center; }
.sync-actions .setting-btn:first-child { background:var(--tg-off-bg); border-color:var(--tg-off-border); color:var(--tg-off-color); }
#btn-send-code {
  background:#fff; color:#000; font-weight:600; border-color:rgba(120,120,120,0.25);
  white-space:nowrap; min-width:88px;
}
#btn-send-code:disabled { opacity:0.6; cursor:not-allowed; }
.sync-status {
  font-size:0.75rem; color:var(--setting-sub-color); max-width:150px;
  text-align:right; line-height:1.5; word-break:break-all;
}
.sync-status.ok { color:var(--accent, #10b981); }
.sync-status.err { color:#f87171; }
'@
Insert-AfterAnchor $css '/* 音色切换 */' '.sync-actions' ("`n" + $cssSync) $true

# --- 3.12 style.css：登录页样式 ---
$cssLogin = @'
/* ===== 独立登录页（全屏） ===== */
#page-login {
  position:fixed; top:0; left:0; width:100%; height:100%; z-index:200;
  font-family:inherit; background:transparent; display:none; overflow:hidden;
  padding:24px; box-sizing:border-box;
}
#page-login.active { display:flex; align-items:center; justify-content:center; }
body.logined .app-shell { display:none; }
.login-glass {
  width:min(400px,100%); border-radius:1.5rem;
  display:flex; flex-direction:column; overflow:hidden;
  position:relative; max-height:100%;
}
.login-content {
  position:relative; z-index:1; width:100%; height:100%;
  display:flex; flex-direction:column; padding:28px; box-sizing:border-box;
  overflow-y:auto; -webkit-overflow-scrolling:touch;
}
.login-nav {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:auto;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.15s forwards;
}
.login-close {
  width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  background:transparent; border:1px solid var(--text-dim); color:var(--text-mid);
  cursor:pointer; transition:transform 0.2s, background 0.2s;
}
.login-close:active { transform:scale(0.9); }
.login-hero {
  flex:1; display:flex; flex-direction:column; justify-content:center;
  padding:0 4px;
}
.login-badge {
  display:inline-flex; align-items:center; gap:8px;
  padding:5px 16px 5px 6px; border-radius:var(--radius-pill);
  margin:0 auto 18px; color:var(--text-mid);
  font-size:0.6875rem; font-weight:400;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.25s forwards;
}
.login-badge .badge-chip {
  background:white; color:#1a1a1a; padding:3px 10px;
  border-radius:var(--radius-pill); font-size:0.625rem; font-weight:600;
  letter-spacing:0.03em;
}
.login-title {
  font-size:clamp(2.4rem,6vw,3.4rem); font-weight:500;
  color:var(--text-strong); text-align:center; line-height:1.05;
  letter-spacing:-0.05em; margin-bottom:10px;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.35s forwards;
}
.login-title em {
  font-family:var(--accent-font); font-style:var(--accent-style); font-weight:var(--accent-weight);
  color:var(--onboard-title-em-color);
}
.login-sub {
  font-size:0.8125rem; color:var(--text-dim); text-align:center;
  line-height:1.6; font-weight:300; margin-bottom:28px;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.5s forwards;
}
.login-form {
  display:flex; flex-direction:column; gap:12px;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.6s forwards;
}
.login-field { position:relative; }
.login-field.row { display:flex; gap:10px; }
.login-field.row .login-input { flex:1; }
.login-input {
  width:100%; box-sizing:border-box;
  background:var(--setting-input-bg); border:1px solid var(--setting-input-border);
  border-radius:0.8rem; padding:14px 16px; font-size:1rem;
  color:var(--setting-input-color); outline:none; font-family:inherit;
  transition:border-color 0.2s, box-shadow 0.2s;
}
.login-input::placeholder { color:var(--text-dim); }
.login-input:focus { border-color:var(--setting-input-focus-border); box-shadow:0 0 0 3px var(--setting-input-border); }
.login-code-btn {
  padding:0 18px; border-radius:0.8rem; background:#fff; color:#000; font-weight:600;
  font-size:0.8125rem; cursor:pointer; border:none; white-space:nowrap;
  transition:transform 0.15s, opacity 0.2s;
}
.login-code-btn:active { transform:scale(0.95); }
.login-code-btn:disabled { opacity:0.6; cursor:not-allowed; }
.login-submit {
  width:100%; padding:15px; border-radius:0.8rem;
  background:#fff; color:#000; font-weight:600; font-size:1rem;
  box-shadow:0 8px 24px rgba(0,0,0,0.18); cursor:pointer; border:none; font-family:inherit;
  transition:transform 0.15s, opacity 0.2s;
}
.login-submit:active { transform:scale(0.97); }
.login-submit.muted {
  background:transparent; color:var(--text-dim); box-shadow:none;
  border:1px solid var(--text-dim); font-weight:400; padding:12px; margin-top:6px;
}
.login-signedin {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.6s forwards;
}
.login-avatar {
  width:56px; height:56px; border-radius:50%; background:#10b981; color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:600;
  margin-bottom:6px;
}
.login-phone {
  font-size:1.125rem; font-weight:600; color:var(--text-strong);
  font-family:var(--accent-font); font-style:var(--accent-style); font-weight:var(--accent-weight);
}
.login-fine {
  font-size:0.6875rem; color:var(--text-dim); text-align:center; margin-top:14px;
  opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.7s forwards;
}
.login-status {
  min-height:18px; font-size:0.75rem; text-align:center; margin-top:10px;
  color:var(--text-mid); opacity:0; filter:blur(10px); transform:translateY(10px);
  animation: onboardFade 0.8s ease-out 0.75s forwards;
}
.login-status.ok { color:#10b981; }
.login-status.err { color:#f87171; }
/* 首页 header 登录入口 */
.header-login {
  height:40px; padding:0 16px; border-radius:0.75rem;
  background:var(--lg-bg); border:1px solid var(--lg-border-mid);
  color:var(--text-strong); font-size:0.8125rem; font-weight:500;
  cursor:pointer; font-family:inherit; display:flex; align-items:center;
  transition:transform 0.15s, background 0.2s;
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
}
.header-login:active { transform:scale(0.95); }
.header-login.signed-in { color:#10b981; }
.header-login-dot {
  width:8px; height:8px; border-radius:50%; background:#10b981;
  box-shadow:0 0 0 3px rgba(16,185,129,0.2);
}

'@
Insert-AfterAnchor $css '/* ===== Toast ===== */' '#page-login' ("`n" + $cssLogin) $true

# --- 3.13 Android：允许明文 HTTP 混合内容（访问本地后端） ---
$mainCode = @'
      // 允许明文 HTTP 混合内容：
      // Capacitor 页面 origin 为 https://localhost，而云同步后端为 http://127.0.0.1:8000，
      // 属于混合内容，WebView 默认会拦截导致 fetch 失败。此处放开以便访问本地开发/演示后端。
      // 生产环境若后端改为 https，可移除本段。
      ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
'@
Insert-AfterAnchor $main 'ws.setAllowFileAccess(true);' 'MIXED_CONTENT_ALWAYS_ALLOW' ("`n        " + $mainCode) $true

# --- 3.14 Android：允许明文流量 ---
Insert-AfterAnchor $manifest 'android:supportsRtl="true"' 'usesCleartextTraffic' "`n        android:usesCleartextTraffic=`"true`"" $false

Write-Host "`n==> 完成。请执行 cap copy android 后重新打包（联网版还需先启动后端）。" -ForegroundColor Cyan