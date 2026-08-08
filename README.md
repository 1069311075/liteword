# 轻词 LiteWord

场景化英语词汇学习 App。核心诉求：**学词是为了马上用，学和用之间不该有延迟**——按真实使用场景组织词汇，学到的词立刻能在对应场景里用上。

目标平台：Android（Capacitor 打包为 APK）。

## 技术栈

- **Capacitor 8**（@capacitor/core、android、app、preferences、local-notifications、@capacitor-community/text-to-speech）
- **纯原生 HTML / CSS / JavaScript**，无前端框架，无构建步骤，源码直接打包进 WebView
- 数据持久化：**Capacitor Preferences**（原生层存储），浏览器环境自动回退 `localStorage` 并做自动迁移

## 场景与词库

按使用场景组织词库，内置 8 个场景：

| 场景 key | 标签 |
|---|---|
| `ai-prompt` | AI 提示词 |
| `ai-model` | AI 模型 |
| `git` | Git |
| `devops` | 开发部署 |
| `ios` | iOS |
| `software` | 软件 |
| `travel-air` | 航班 |
| `travel-stay` | 酒店 |

- **跨场景词义**：同一单词在不同场景可有不同释义（如 `checkout` 在 Git 场景是"检出分支"，`approach` 在航班场景是"进近"）。仅当用户选中对应场景时展示对应释义。
- **自定义词库**：支持导入自定义词库（粘贴 JSON），自动追加进词库列表，可删除、可重置进度。
- **单词库优先**：一次只专注学习一个词库（单选切换），保证可学新词数严格等于选中分类词数。

## 核心功能

- **引导页**：首次启动选择使用场景，定制词库。
- **首页**：三张统计卡（待复习 / 可学新词 / 已掌握）、「学一组新词」与「开始复习」两个主入口、词库进度环、近 30 天学习热力图。
- **学一组新词**：从当前专注词库取新词，一组一组学（每组词数可配置）。
- **综合复习**：独立入口，复习所有词库已学到的词，展示每个词的场景词义并标注场景。
- **词库管理**：查看/切换专注词库、查看词表（按未学/学习中/已掌握筛选）、导入/删除自定义词库、重置进度。
- **深度解析**：单词卡展示词义、音标、发音；滑动/翻页查看该词在当前场景的高频搭配与例句。
- **设置**：每组词数、发音口音（美音/英音）、主题、字体、背景视频、学习提醒通知。

## 学习机制

- 每个词有 **7 级掌握度**（`currentRound` 1~7，达到 7 即"已掌握"）。
- 新词学习：学一次记录一轮；已掌握的词不再进入新词队列。
- 复习：到期（待复习）的词进入综合复习，按轮次穿插排列，避免同轮次连续。
- 学习进度按场景词义记录（`learnedScenes`），同一词在不同场景可分别记忆。

## 主题与外观

- 三种主题：**浅色**、**深色**、**磨砂**（默认）；磨砂主题使用视频背景 + 毛玻璃效果。
- 两种字体：**经典**（Source Serif 4 斜体用于关键英文元素 + Poppins 正文）与**精选**（全系统无衬线）。
- 浅色主题采用暖色"书香"配色（米色底 `#f0ebe0`、深棕文字）。

## 数据存储（Capacitor Preferences keys）

| key | 内容 |
|---|---|
| `lw_config` | 用户配置（组词数、口音、主题、字体、背景视频、专注词库等） |
| `lw_records` | 学习记录（每词 `currentRound`、`learnedScenes` 等） |
| `lw_onboard` | 引导完成状态 |
| `lw_streak` | 连续学习天数 |
| `lw_progress` | 进度存档 |
| `lw_custom_words` | 导入的自定义词库数据 |
| `lw_custom_cats` | 自定义词库分类标签 |
| `lw_schema_version` | 数据契约版本号（为未来多设备同步预留的迁移锚点） |

## 目录结构

```
d:\开发\danci
├── www/                     # 前端源码（唯一源码目录）
│   ├── index.html            # 页面结构（引导页/首页/学习/复习/完成/设置/词库/词表）
│   ├── style.css             # 全部样式（主题、玻璃卡、响应式）
│   ├── app.js                # 核心逻辑（渲染、学习流程、复习、词库管理、设置）
│   ├── words.js              # 词库数据（WORD_BANK、SCENE_LABELS、场景词义、深度搭配）
│   ├── store.js              # 持久化层（Preferences/localStorage + schema 迁移）
│   └── bg.mp4                # 背景视频（磨砂主题）
├── android/                  # Android 工程（Capacitor 生成）
├── capacitor.config.json     # Capacitor 配置（appId: com.liteword.app）
└── *.apk                     # 构建产物
```

## 构建 APK

1. 修改 `www/` 下的源码。
2. 在项目根目录运行 `npx cap sync android`，把 `www` 资源拷入 Android assets。
3. 在 `android/` 目录运行 `./gradlew assembleDebug`。
4. 产物在重定向的构建目录 `C:/trae_build/danci/app-build/outputs/apk/debug/app-debug.apk`，复制回项目根目录并按规范命名（如 `danci-YYYYMMDD-feature.apk`）。

> 注意：构建目录被重定向到纯 ASCII 路径 `C:/trae_build/danci`，避免中文路径导致 Gradle VFS snapshot 报错。