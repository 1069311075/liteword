# iOS 版（轻词 LiteWord）— 构建与上架指南

本目录是 Capacitor 生成的 iOS 原生工程（`ios/`），配合 GitHub Actions 云编译，**不需要 Mac 也能产出 iOS 安装包**。

> 当前状态：工程骨架已就绪，Bundle ID 与 App 名称暂用占位，等你起好名字后统一替换。

---

## 一、现在能做什么（无需 Mac）

Linux/macOS/Windows 都能把「轻词」编译成 iOS 应用，全靠 GitHub 的 macOS 云机器（免费额度内）。

### 1. 首次启用 CI

把本仓库推到 GitHub（含 `ios/` 目录和 `.github/workflows/build-ios.yml`）。

### 2. 手动触发编译

1. 打开 GitHub 仓库 → **Actions** 标签页
2. 左侧选 **Build iOS (.ipa)**
3. 点 **Run workflow** → 绿色按钮
4. 等几分钟，构建完成后在本次运行页底部 **Artifacts** 里下载 `xcodebuild-log`（当前为无签名编译，用于验证工程可构建）

---

## 二、上架 App Store 的完整流程（需要一次性准备）

### 第 1 步：注册 Apple Developer 账号

- 进入 https://developer.apple.com/programs/ 注册，费用 **$99/年**
- 需要：Apple ID、真实身份信息（姓名/身份证/银行卡）
- 你计划用家人身份注册，注意：注册信息必须与该身份完全一致，且后续涉及税务（如果应用有内购/付费）

### 第 2 步：确定 Bundle ID 和 App 名称

- **Bundle ID**：全局唯一，一旦用于上架不建议改。建议形如 `com.<你的标识>.liteword`（当前占位 `com.liteword.app`）
- **App 名称**：显示在 App Store 的名称，如「轻词 LiteWord」

定好后，把下面两处占位替换掉：
- `capacitor.config.json` 的 `appId`
- Android 与 iOS 各自不能共用同一个 Bundle ID，先用 `com.liteword.ios` 这类区分

### 第 3 步：在 Apple Developer 后台创建 App 标识与描述文件

登录 developer.apple.com → **Certificates, IDs & Profiles**：
1. 添加 **App ID**（Bundle ID 唯一标识）
2. 创建 **Distribution 证书**（上架用）和 **Development 证书**（真机测试用）
3. 为对应证书创建 **Provisioning Profile**

### 第 4 步：把签名材料配置到 GitHub 仓库

仓库页面 → **Settings → Secrets and variables → Actions**，新增以下 Secrets：

| Secret 名称 | 内容 |
|---|---|
| `APPLE_CERT_P12` | 分发证书 `.p12` 文件的 base64 编码 |
| `APPLE_CERT_PASSWORD` | `.p12` 的密码 |
| `APPLE_PROVISION_PROFILE` | 描述文件 `.mobileprovision` 的 base64 编码 |
| `APPLE_CERT_NAME` | 证书名称，如 `Apple Distribution: 你的名字 (TEAMID)` |

> base64 编码（在电脑上执行）：`cert.p12` → `base64 cert.p12`（macOS/Linux）或 PowerShell 的 `[Convert]::ToBase64String(...)`。

### 第 5 步：启用 workflow 里的真机签名步骤

编辑 `.github/workflows/build-ios.yml`，把「真机签名版本」那段注释取消，并把 `YOUR_TEAM_ID` 替换成你的 Team ID（developer.apple.com 账户页可查）。

### 第 6 步：编译并上传 App Store

启用签名后，CI 编译出的 `.ipa` 即可：
- **下载真机安装**：用 Apple Configurator 或 Xcode 安装到你的 iPhone 测试
- **上传 App Store**：把 `.ipa` 用 Transporter 或 Xcode Organizer 上传到 App Store Connect，再填写商品信息、截图、隐私声明后提交审核

> 完整上传 App Store 的 CI 步骤（`xcrun altool` / `notarytool`）可在后续阶段补充，见 workflow 内注释。

---

## 三、权限说明（已配置在 Info.plist）

| 权限 | Info.plist 键 | 用途 |
|---|---|---|
| 日历 | `NSCalendarsUsageDescription` / `NSCalendarsFullAccessUsageDescription` | 写入每日复习计划到系统日历 |
| 通知 | `NSUserNotificationsUsageDescription` | 每日复习时间提醒 |

TTS 发音（有道 HTTPS）无需额外权限，App Transport Security 默认放行 HTTPS。

---

## 四、常见问题

- **为什么无签名产物装不上真机？** iOS 强制要求真机安装必须签名，无签名产物只能用于验证工程能编译。真机安装需走第 4–5 步签名。
- **一定要 Mac 吗？** 不需要。GitHub Actions 代你在云端 macOS 上编译。你只需要在网页上点按钮、下载产物。
- **名字没定怎么办？** 先用占位名开发测试，起好名字后替换 `capacitor.config.json` 的 `appId` 和 `appName`，再 `npx cap sync ios` 重新生成即可。