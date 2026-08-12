# ============================================================
# 轻词 LiteWord - 一键构建并安装到已连接手机
# 用法:  powershell -ExecutionPolicy Bypass -File scripts\install_to_phone.ps1
# 说明: 自动构建 debug APK 并 via adb 覆盖安装到手机，保留应用数据
# ============================================================
$ErrorActionPreference = 'Stop'

# --- 重建完整 PATH ---
# node/git 等命令行工具可能不在脚本进程的默认 PATH 里（如 Node 装在 G:\nodejs），
# 从注册表读取 Machine + User 的 PATH 合并进来，确保 npx/cap 可调用。
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [Environment]::GetEnvironmentVariable('Path','User') + ';' +
            $env:Path

# --- 路径配置 ---
$projRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$adb = 'C:\Users\djjjjj\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$variant = if ($args -contains '-release') { 'Release' } else { 'Debug' }
$apkDir = "C:\trae_build\danci\app-build\outputs\apk\$($variant.ToLower())"
$apk = Join-Path $apkDir "app-$($variant.ToLower()).apk"

Write-Host "==> 轻词 自动安装 (variant: $variant)" -ForegroundColor Cyan

# --- 1. 检查 adb ---
if (-not (Test-Path $adb)) { Write-Error "未找到 adb: $adb"; exit 1 }

# --- 2. 查找已连接设备 ---
Write-Host "==> 检测设备..." -ForegroundColor Cyan
# @() 强制为数组，避免仅一台设备时 scalar 被当成字符串、[0] 取到首字符
$devices = @(& $adb devices | Where-Object { $_ -match '^\S+\s+device$' })
if ($devices.Count -eq 0) { Write-Error "未检测到已连接的 Android 设备，请先通过 USB 连接并开启 USB 调试"; exit 1 }
# 取第一个设备
$serial = ($devices[0] -split '\s+')[0]
Write-Host "    设备: $serial" -ForegroundColor Green

# --- 2.5 同步 www -> 手机资源 (cap copy) ---
# www/ 是 Capacitor 的 webDir 唯一源，cap copy 将其复制到 android/app/src/main/assets/public，
# 手机 WebView 加载的是后者。这样只需维护 www/ 一处，无需手动同步两份。
Write-Host "==> 同步页面资源 (www -> android assets) ..." -ForegroundColor Cyan
Push-Location $projRoot
try {
    npx cap copy android
    if ($LASTEXITCODE -ne 0) { Write-Error "cap copy 同步失败"; exit 1 }
} finally { Pop-Location }

# --- 3. 构建 APK ---
Write-Host "==> 构建 $variant APK ..." -ForegroundColor Cyan
Push-Location (Join-Path $projRoot 'android')
try {
    if ($variant -eq 'Release') {
        & $projRoot\android\gradlew.bat assembleRelease --console=plain
    } else {
        & $projRoot\android\gradlew.bat assembleDebug --console=plain
    }
    if ($LASTEXITCODE -ne 0) { Write-Error "构建失败"; exit 1 }
} finally { Pop-Location }

if (-not (Test-Path $apk)) { Write-Error "未找到 APK: $apk"; exit 1 }
Write-Host "    APK: $apk" -ForegroundColor Green

# --- 4. 覆盖安装（保留数据）---
Write-Host "==> 安装到设备 ..." -ForegroundColor Cyan
# 若签名不符需先卸载（会清空数据），此处默认同签名覆盖安装
$result = & $adb -s $serial install -r $apk
if ($result -match 'Success') {
    Write-Host "==> 安装成功！保留数据完成覆盖升级" -ForegroundColor Green
} elseif ($result -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE') {
    Write-Warning "签名不匹配，需先卸载旧版本（会清空应用数据）"
    $confirm = Read-Host "是否卸载并重装？(y/N)"
    if ($confirm -eq 'y') {
        & $adb -s $serial uninstall com.liteword.app
        $result = & $adb -s $serial install $apk
        if ($result -match 'Success') { Write-Host "==> 卸载重装成功" -ForegroundColor Green }
        else { Write-Error "重装失败: $result" }
    }
} else {
    Write-Error "安装失败: $result"
}

# --- 5. 启动应用 ---
# 脚本顶部设了 ErrorActionPreference='Stop'，adb 会把正常信息写到 stderr，
# 从而被当成 NativeCommandError。这里临时改回 Continue 并合并 stderr 以吞掉它。
$oldEA = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& $adb -s $serial shell monkey -p com.liteword.app -c android.intent.category.LAUNCHER 1 2>&1 | Out-Null
$ErrorActionPreference = $oldEA
Write-Host "==> 已启动轻词，完成！" -ForegroundColor Green