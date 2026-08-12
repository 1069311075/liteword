# 轻词 LiteWord · 联网补丁包

把「联网版」独有的一套功能（后端 + 云同步 + 手机号登录）合入「不联网版」项目，用于发布带云同步能力的版本。

## 什么时候用它

- 你平时在 **不联网版** 分支上持续开发新功能（本地学习、释义、UI 等）。
- 需要发布 **带云同步** 的正式版时，用本补丁把联网功能一键套回来。
- 联网功能本身相对稳定，不会跟着主线的开发一起漂移，所以可以长期复用。

## 里面有什么

```
patches/online/
├── apply.ps1        # 一键合入脚本（幂等，可重复执行）
├── backend/         # FastAPI 后端完整源码
├── www/sync.js      # 云同步模块
└── README.md        # 本说明
```

## 怎么用

在项目根目录执行（联网版发布前）：

```powershell
powershell -ExecutionPolicy Bypass -File patches\online\apply.ps1
```

脚本会自动完成：
1. 复制 `backend/` 和 `www/sync.js` 到项目（已存在则跳过）
2. 在 `index.html` 加入登录页、首页登录按钮、云同步设置、注销账号、`sync.js` 引用
3. 在 `app.js` 加入登录函数、注销函数、云同步初始化，并更新隐私/协议文案
4. 在 `style.css` 加入登录页与云同步样式
5. 在 `Android` 侧放开明文 HTTP（访问本地后端）

已安装的部分会被检测并跳过，重复执行不会重复插入。

合入后，按联网版的流程打包：`cap copy android` → 构建 → 启动后端 → `adb reverse tcp:8000 tcp:8000`。

## 如何撤销

补丁只改动 `index.html`、`app.js`、`style.css`、`MainActivity.java`、`AndroidManifest.xml` 五个文件，以及新增 `backend/`、`www/sync.js`。如要回到纯不联网版：

```powershell
# 恢复被改动的文件
git checkout 不联网版 -- www/index.html www/app.js www/style.css
git checkout 不联网版 -- android/app/src/main/java/com/liteword/app/MainActivity.java
git checkout 不联网版 -- android/app/src/main/AndroidManifest.xml
# 删除新增文件
Remove-Item backend -Recurse -Force
Remove-Item www/sync.js -Force
```

## 注意

- 默认后端地址为 `http://127.0.0.1:8000`（配合 `adb reverse` 供手机访问本机后端）。
- 正式上架前需把 `send_sms_code` 接入真实短信服务，并移除 `devCode` 演示验证码逻辑。