// ========== 词库 ==========
const WORD_BANK = [
  // ===== AI & Prompt 高频词 =====
  {word:"prompt",phonetic:"/prɑːmpt/",meanings:["n. 提示词","v. 促使"],sentence:"Write a clear prompt for the AI model.",category:"ai-prompt"},
  {word:"elaborate",phonetic:"/ɪˈlæbəreɪt/",meanings:["v. 详细阐述"],sentence:"Please elaborate on your reasoning.",category:"ai-prompt"},
  {word:"synthesize",phonetic:"/ˈsɪnθəsaɪz/",meanings:["v. 综合；合成"],sentence:"Synthesize the key points from all sources.",category:"ai-prompt"},
  {word:"nuance",phonetic:"/ˈnuːɑːns/",meanings:["n. 细微差别"],sentence:"The nuance in the prompt matters a lot.",category:"ai-prompt"},
  {word:"refine",phonetic:"/rɪˈfaɪn/",meanings:["v. 优化；精炼"],sentence:"Refine the output to be more concise.",category:"ai-prompt"},
  {word:"iterative",phonetic:"/ˈɪtərətɪv/",meanings:["adj. 迭代的"],sentence:"We take an iterative approach to prompt design.",category:"ai-prompt"},
  {word:"hallucination",phonetic:"/həˌluːsɪˈneɪʃn/",meanings:["n. AI幻觉"],sentence:"The model may produce hallucinations on rare topics.",category:"ai-model"},
  {word:"grounding",phonetic:"/ˈɡraʊndɪŋ/",meanings:["n. 事实锚定"],sentence:"Good grounding reduces hallucination.",category:"ai-model"},
  {word:"context",phonetic:"/ˈkɑːntekst/",meanings:["n. 上下文；语境"],sentence:"Provide enough context for better results.",category:"ai-prompt"},
  {word:"token",phonetic:"/ˈtoʊkən/",meanings:["n. 词元"],sentence:"Longer prompts use more tokens.",category:"ai-model"},
  {word:"generate",phonetic:"/ˈdʒenəreɪt/",meanings:["v. 生成"],sentence:"The model can generate high quality content.",category:"ai-prompt"},
  {word:"fine-tune",phonetic:"/faɪn tuːn/",meanings:["v. 微调"],sentence:"Fine-tune the model on your custom dataset.",category:"ai-model"},
  {word:"inference",phonetic:"/ˈɪnfərəns/",meanings:["n. 推理"],sentence:"Run inference on the trained model.",category:"ai-model"},
  {word:"embedding",phonetic:"/ɪmˈbedɪŋ/",meanings:["n. 嵌入向量"],sentence:"Use embeddings for semantic search.",category:"ai-model"},
  {word:"agent",phonetic:"/ˈeɪdʒənt/",meanings:["n. 智能体"],sentence:"Build an AI agent that can use tools.",category:"ai-model"},
  {word:"workflow",phonetic:"/ˈwɜːrkfloʊ/",meanings:["n. 工作流"],sentence:"Automate your workflow with AI.",category:"ai-model"},
  {word:"coherent",phonetic:"/koʊˈhɪrənt/",meanings:["adj. 连贯的"],sentence:"Make sure the output is coherent and logical.",category:"ai-prompt"},
  {word:"concise",phonetic:"/kənˈsaɪs/",meanings:["adj. 简洁的"],sentence:"Keep your answer concise and to the point.",category:"ai-prompt"},
  {word:"relevant",phonetic:"/ˈreləvənt/",meanings:["adj. 相关的"],sentence:"Only include relevant information.",category:"ai-prompt"},
  {word:"ambiguous",phonetic:"/æmˈbɪɡjuəs/",meanings:["adj. 模糊的"],sentence:"The request was too ambiguous for the AI.",category:"ai-prompt"},
  {word:"explicit",phonetic:"/ɪkˈsplɪsɪt/",meanings:["adj. 明确的"],sentence:"Be explicit about your requirements.",category:"ai-prompt"},
  {word:"comprehensive",phonetic:"/ˌkɑːmprɪˈhensɪv/",meanings:["adj. 全面的"],sentence:"Give a comprehensive overview of the topic.",category:"ai-prompt"},
  {word:"summarize",phonetic:"/ˈsʌməraɪz/",meanings:["v. 总结"],sentence:"Summarize the article in three sentences.",category:"ai-prompt"},
  {word:"paraphrase",phonetic:"/ˈpærəfreɪz/",meanings:["v. 改写"],sentence:"Paraphrase this paragraph in simpler terms.",category:"ai-prompt"},
  {word:"brainstorm",phonetic:"/ˈbreɪnstɔːrm/",meanings:["v. 头脑风暴"],sentence:"Brainstorm some ideas for the project.",category:"ai-prompt"},
  {word:"draft",phonetic:"/dræft/",meanings:["v. 起草","n. 草稿"],sentence:"Draft a professional email for me.",category:"ai-prompt"},
  {word:"revise",phonetic:"/rɪˈvaɪz/",meanings:["v. 修改；修订"],sentence:"Revise the document based on feedback.",category:"ai-prompt"},
  {word:"format",phonetic:"/ˈfɔːrmæt/",meanings:["v. 格式化","n. 格式"],sentence:"Format the output as a markdown table.",category:"ai-prompt"},
  {word:"tone",phonetic:"/toʊn/",meanings:["n. 语气"],sentence:"Adjust the tone to be more professional.",category:"ai-prompt"},
  {word:"perspective",phonetic:"/pərˈspektɪv/",meanings:["n. 视角；观点"],sentence:"Consider this from a different perspective.",category:"ai-prompt"},
  {word:"scenario",phonetic:"/səˈnærioʊ/",meanings:["n. 场景；方案"],sentence:"Describe a scenario where this would be useful.",category:"ai-prompt"},
  {word:"constraint",phonetic:"/kənˈstreɪnt/",meanings:["n. 约束；限制"],sentence:"Work within the given constraints.",category:"ai-prompt"},
  {word:"assumption",phonetic:"/əˈsʌmpʃn/",meanings:["n. 假设"],sentence:"State your assumptions clearly.",category:"ai-prompt"},
  {word:"parameter",phonetic:"/pəˈræmɪtər/",meanings:["n. 参数"],sentence:"Tweak the parameters for better output.",category:"ai-model"},
  {word:"benchmark",phonetic:"/ˈbentʃmɑːrk/",meanings:["n. 基准测试"],sentence:"Run benchmarks to compare performance.",category:"ai-model"},
  {word:"integration",phonetic:"/ˌɪntɪˈɡreɪʃn/",meanings:["n. 集成"],sentence:"The integration with third-party tools is seamless.",category:"ai-model"},
  {word:"bias",phonetic:"/ˈbaɪəs/",meanings:["n. 偏见"],sentence:"Check the model output for bias.",category:"ai-model"},
  {word:"accuracy",phonetic:"/ˈækjərəsi/",meanings:["n. 准确度"],sentence:"This approach improves accuracy significantly.",category:"ai-model"},
  {word:"reliable",phonetic:"/rɪˈlaɪəbl/",meanings:["adj. 可靠的"],sentence:"Make sure the results are reliable.",category:"ai-model"},
  {word:"consistent",phonetic:"/kənˈsɪstənt/",meanings:["adj. 一致的"],sentence:"Keep the style consistent throughout.",category:"ai-model"},
  {word:"insight",phonetic:"/ˈɪnsaɪt/",meanings:["n. 洞见"],sentence:"Extract key insights from the data.",category:"ai-model"},
  {word:"evaluate",phonetic:"/ɪˈvæljueɪt/",meanings:["v. 评估"],sentence:"Evaluate the pros and cons of each option.",category:"ai-model"},
  {word:"snippet",phonetic:"/ˈsnɪpɪt/",meanings:["n. 代码片段"],sentence:"Here is a code snippet showing how to use it.",category:"ai-model"},
  {word:"template",phonetic:"/ˈtempleɪt/",meanings:["n. 模板"],sentence:"Use this template as a starting point.",category:"ai-model"},
  {word:"clarify",phonetic:"/ˈklærəfaɪ/",meanings:["v. 澄清"],sentence:"Let me clarify what I mean by that.",category:"ai-prompt"},
  {word:"outline",phonetic:"/ˈaʊtlaɪn/",meanings:["v. 概述","n. 大纲"],sentence:"Outline the main steps of the process.",category:"ai-prompt"},
  {word:"feasible",phonetic:"/ˈfiːzəbl/",meanings:["adj. 可行的"],sentence:"Check if this approach is feasible.",category:"ai-prompt"},
  {word:"alternative",phonetic:"/ɔːlˈtɜːrnətɪv/",meanings:["n. 替代方案","adj. 替代的"],sentence:"Suggest an alternative solution.",category:"ai-prompt"},
  {word:"potential",phonetic:"/pəˈtenʃl/",meanings:["adj. 潜在的","n. 潜力"],sentence:"Identify potential issues early on.",category:"ai-prompt"},
  {word:"effective",phonetic:"/ɪˈfektɪv/",meanings:["adj. 有效的"],sentence:"This is the most effective method.",category:"ai-prompt"},

  // ===== 科技/开发高频词 =====
  {word:"deploy",phonetic:"/dɪˈplɔɪ/",meanings:["v. 部署"],sentence:"Deploy the update to production.",category:"devops"},
  {word:"integrate",phonetic:"/ˈɪntɪɡreɪt/",meanings:["v. 集成"],sentence:"Integrate the API into your app.",category:"devops"},
  {word:"framework",phonetic:"/ˈfreɪmwɜːrk/",meanings:["n. 框架"],sentence:"Choose the right framework for the project.",category:"devops"},
  {word:"algorithm",phonetic:"/ˈælɡərɪðəm/",meanings:["n. 算法"],sentence:"This algorithm improves search speed.",category:"devops"},
  {word:"compatible",phonetic:"/kəmˈpætəbl/",meanings:["adj. 兼容的"],sentence:"This plugin is compatible with all browsers.",category:"devops"},
  {word:"deprecated",phonetic:"/ˈdeprəkeɪtɪd/",meanings:["adj. 已弃用的"],sentence:"This method is deprecated, use the new one.",category:"devops"},
  {word:"mitigate",phonetic:"/ˈmɪtɪɡeɪt/",meanings:["v. 缓解"],sentence:"Add retries to mitigate failures.",category:"devops"},
  {word:"leverage",phonetic:"/ˈlevərɪdʒ/",meanings:["v. 利用"],sentence:"Leverage existing libraries when possible.",category:"devops"},
  {word:"optimize",phonetic:"/ˈɑːptɪmaɪz/",meanings:["v. 优化"],sentence:"Optimize the database queries.",category:"devops"},
  {word:"validate",phonetic:"/ˈvælɪdeɪt/",meanings:["v. 验证"],sentence:"Validate user input before saving.",category:"devops"},
  {word:"implement",phonetic:"/ˈɪmplɪment/",meanings:["v. 实现"],sentence:"Implement the feature this sprint.",category:"devops"},
  {word:"enhance",phonetic:"/ɪnˈhæns/",meanings:["v. 增强"],sentence:"This update enhances performance.",category:"devops"},
  {word:"robust",phonetic:"/roʊˈbʌst/",meanings:["adj. 健壮的"],sentence:"Build a robust error handling system.",category:"devops"},
  {word:"scalable",phonetic:"/ˈskeɪləbl/",meanings:["adj. 可扩展的"],sentence:"Design the system to be scalable.",category:"devops"},
  {word:"architecture",phonetic:"/ˈɑːrkɪtektʃər/",meanings:["n. 架构"],sentence:"The new architecture is much cleaner.",category:"devops"},
  {word:"repository",phonetic:"/rɪˈpɑːzətɔːri/",meanings:["n. 仓库"],sentence:"Clone the repository to get started.",category:"git"},
  {word:"dependency",phonetic:"/dɪˈpendənsi/",meanings:["n. 依赖"],sentence:"Install the required dependencies first.",category:"devops"},
  {word:"middleware",phonetic:"/ˈmɪdlwer/",meanings:["n. 中间件"],sentence:"Add middleware for authentication.",category:"devops"},
  {word:"endpoint",phonetic:"/ˈendpɔɪnt/",meanings:["n. 接口端点"],sentence:"Call the API endpoint with a POST request.",category:"devops"},
  {word:"payload",phonetic:"/ˈpeɪloʊd/",meanings:["n. 请求数据"],sentence:"Send the payload as JSON.",category:"devops"},
  {word:"response",phonetic:"/rɪˈspɑːns/",meanings:["n. 响应"],sentence:"The server returned a 200 response.",category:"devops"},
  {word:"request",phonetic:"/rɪˈkwest/",meanings:["n./v. 请求"],sentence:"The request timed out after 30 seconds.",category:"devops"},
  {word:"cache",phonetic:"/kæʃ/",meanings:["n./v. 缓存"],sentence:"Cache the result to avoid repeated calls.",category:"devops"},
  {word:"async",phonetic:"/ˈeɪsɪŋk/",meanings:["adj. 异步的"],sentence:"Use async calls for better performance.",category:"devops"},
  {word:"debug",phonetic:"/ˌdiːˈbʌɡ/",meanings:["v. 调试"],sentence:"Debug the issue in the dev console.",category:"devops"},
  {word:"compile",phonetic:"/kəmˈpaɪl/",meanings:["v. 编译"],sentence:"The code compiles without errors.",category:"devops"},
  {word:"build",phonetic:"/bɪld/",meanings:["v. 构建","n. 版本"],sentence:"Run the build before deploying.",category:"devops"},
  {word:"release",phonetic:"/rɪˈliːs/",meanings:["v./n. 发布"],sentence:"Prepare for the next release.",category:"devops"},
  {word:"version",phonetic:"/ˈvɜːrʒn/",meanings:["n. 版本"],sentence:"Update to the latest version.",category:"devops"},
  {word:"feature",phonetic:"/ˈfiːtʃər/",meanings:["n. 功能"],sentence:"This feature is available in beta.",category:"devops"},
  {word:"bug",phonetic:"/bʌɡ/",meanings:["n. 缺陷"],sentence:"Fix the bug before the release.",category:"devops"},
  {word:"merge",phonetic:"/mɜːrdʒ/",meanings:["v. 合并"],sentence:"Merge the branch into main.",category:"git"},
  {word:"commit",phonetic:"/kəˈmɪt/",meanings:["v. 提交"],sentence:"Commit your changes with a clear message.",category:"git"},
  {word:"branch",phonetic:"/bræntʃ/",meanings:["n. 分支"],sentence:"Create a new branch for this feature.",category:"git"},
  {word:"refactor",phonetic:"/ˌriːˈfæktər/",meanings:["v. 重构"],sentence:"Refactor this function to be cleaner.",category:"devops"},
  {word:"document",phonetic:"/ˈdɑːkjumənt/",meanings:["v. 记录","n. 文档"],sentence:"Document the API endpoints clearly.",category:"devops"},
  {word:"test",phonetic:"/test/",meanings:["v./n. 测试"],sentence:"Write tests for the new feature.",category:"devops"},
  {word:"production",phonetic:"/prəˈdʌkʃn/",meanings:["n. 生产环境"],sentence:"Never test directly in production.",category:"devops"},
  {word:"monitor",phonetic:"/ˈmɑːnɪtər/",meanings:["v. 监控"],sentence:"Monitor server performance closely.",category:"devops"},
  {word:"latency",phonetic:"/ˈleɪtənsi/",meanings:["n. 延迟"],sentence:"Reduce latency with caching.",category:"devops"},
  {word:"scalability",phonetic:"/ˌskeɪləˈbɪləti/",meanings:["n. 可扩展性"],sentence:"Scalability is a key design goal.",category:"devops"},
  {word:"maintainable",phonetic:"/meɪnˈteɪnəbl/",meanings:["adj. 可维护的"],sentence:"Write clean, maintainable code.",category:"devops"},
  {word:"migration",phonetic:"/maɪˈɡreɪʃn/",meanings:["n. 迁移"],sentence:"Plan the database migration carefully.",category:"devops"},
  {word:"rollback",phonetic:"/ˈroʊlbæk/",meanings:["n. 回滚"],sentence:"Prepare a rollback plan just in case.",category:"devops"},
  {word:"frontend",phonetic:"/frʌntend/",meanings:["n. 前端"],sentence:"The frontend is built with React.",category:"devops"},
  {word:"backend",phonetic:"/ˈbækend/",meanings:["n. 后端"],sentence:"The backend handles all business logic.",category:"devops"},

  // ===== 系统/软件/日常操作词 =====
  {word:"configure",phonetic:"/kənˈfɪɡjər/",meanings:["v. 配置"],sentence:"Configure the settings before use.",category:"software"},
  {word:"install",phonetic:"/ɪnˈstɔːl/",meanings:["v. 安装"],sentence:"Install the app from the official site.",category:"software"},
  {word:"update",phonetic:"/ˈʌpdeɪt/",meanings:["v. 更新"],sentence:"Install the latest security update.",category:"software"},
  {word:"permission",phonetic:"/pərˈmɪʃn/",meanings:["n. 权限"],sentence:"Grant storage permission to save files.",category:"ios"},
  {word:"sync",phonetic:"/sɪŋk/",meanings:["v. 同步"],sentence:"Sync your files across devices.",category:"software"},
  {word:"backup",phonetic:"/ˈbækʌp/",meanings:["v./n. 备份"],sentence:"Always backup important data.",category:"software"},
  {word:"preference",phonetic:"/ˈprefrəns/",meanings:["n. 偏好设置"],sentence:"Change preferences in the settings menu.",category:"software"},
  {word:"navigate",phonetic:"/ˈnævɪɡeɪt/",meanings:["v. 导航"],sentence:"Navigate to Settings > Privacy.",category:"software"},
  {word:"toggle",phonetic:"/ˈtɑːɡl/",meanings:["v. 切换"],sentence:"Toggle dark mode on or off.",category:"software"},
  {word:"settings",phonetic:"/ˈsetɪŋz/",meanings:["n. 设置"],sentence:"Adjust the settings to your liking.",category:"ios"},
  {word:"default",phonetic:"/dɪˈfɔːlt/",meanings:["n./adj. 默认"],sentence:"Reset to default settings if needed.",category:"software"},
  {word:"upload",phonetic:"/ˌʌpˈloʊd/",meanings:["v. 上传"],sentence:"Upload the file to the cloud.",category:"software"},
  {word:"download",phonetic:"/ˌdaʊnˈloʊd/",meanings:["v. 下载"],sentence:"Download the attachment first.",category:"software"},
  {word:"export",phonetic:"/ɪkˈspɔːrt/",meanings:["v. 导出"],sentence:"Export your data as a JSON file.",category:"software"},
  {word:"import",phonetic:"/ɪmˈpɔːrt/",meanings:["v. 导入"],sentence:"Import data from a backup file.",category:"software"},
  {word:"filter",phonetic:"/ˈfɪltər/",meanings:["v. 筛选"],sentence:"Filter results by date.",category:"software"},
  {word:"refresh",phonetic:"/rɪˈfreʃ/",meanings:["v. 刷新"],sentence:"Refresh the page to see updates.",category:"software"},
  {word:"restart",phonetic:"/ˈriːstɑːrt/",meanings:["v. 重启"],sentence:"Restart the app after updating.",category:"software"},
  {word:"notification",phonetic:"/ˌnoʊtɪfɪˈkeɪʃn/",meanings:["n. 通知"],sentence:"Enable push notifications for reminders.",category:"ios"},
  {word:"privacy",phonetic:"/ˈpraɪvəsi/",meanings:["n. 隐私"],sentence:"Check the privacy policy for details.",category:"ios"},
  {word:"security",phonetic:"/sɪˈkjʊrəti/",meanings:["n. 安全"],sentence:"Enable two-factor for better security.",category:"software"},
  {word:"access",phonetic:"/ˈækses/",meanings:["v./n. 访问"],sentence:"You don't have access to this folder.",category:"software"},
  {word:"storage",phonetic:"/ˈstɔːrɪdʒ/",meanings:["n. 存储"],sentence:"Check your available storage space.",category:"ios"},
  {word:"cloud",phonetic:"/klaʊd/",meanings:["n. 云"],sentence:"Files are saved to the cloud automatically.",category:"software"},
  {word:"shortcut",phonetic:"/ˈʃɔːrtkʌt/",meanings:["n. 快捷键"],sentence:"Use keyboard shortcuts to work faster.",category:"software"},

  // ===== 日常高频词 =====
  {word:"available",phonetic:"/əˈveɪləbl/",meanings:["adj. 可用的"],sentence:"The feature is now available.",category:"software"},

  // ===== 旅行出行高频词 =====
  {word:"boarding",phonetic:"/ˈbɔːrdɪŋ/",meanings:["n. 登机"],sentence:"Boarding starts in 20 minutes.",category:"travel-air"},
  {word:"passport",phonetic:"/ˈpæspɔːrt/",meanings:["n. 护照"],sentence:"Don't forget your passport.",category:"travel-air"},
  {word:"luggage",phonetic:"/ˈlʌɡɪdʒ/",meanings:["n. 行李"],sentence:"Where can I pick up my luggage?",category:"travel-air"},
  {word:"terminal",phonetic:"/ˈtɜːrmɪnl/",meanings:["n. 航站楼"],sentence:"The flight departs from Terminal 2.",category:"travel-air"},
  {word:"departure",phonetic:"/dɪˈpɑːrtʃər/",meanings:["n. 出发"],sentence:"Check the departure board for updates.",category:"travel-air"},
  {word:"arrival",phonetic:"/əˈraɪvl/",meanings:["n. 到达"],sentence:"Arrival time is 3:30 PM.",category:"travel-air"},
  {word:"delay",phonetic:"/dɪˈleɪ/",meanings:["v./n. 延误"],sentence:"The flight is delayed by an hour.",category:"travel-air"},
  {word:"booking",phonetic:"/ˈbʊkɪŋ/",meanings:["n. 预订"],sentence:"I have a booking under this name.",category:"travel-stay"},
  {word:"reservation",phonetic:"/ˌrezərˈveɪʃn/",meanings:["n. 预约"],sentence:"I'd like to make a reservation.",category:"travel-stay"},
  {word:"checkout",phonetic:"/ˈtʃekaʊt/",meanings:["n. 退房"],sentence:"Checkout time is 11 AM.",category:"travel-stay"},
  {word:"reception",phonetic:"/rɪˈsepʃn/",meanings:["n. 前台"],sentence:"Ask at the reception for directions.",category:"travel-stay"},
  {word:"destination",phonetic:"/ˌdestɪˈneɪʃn/",meanings:["n. 目的地"],sentence:"What's your final destination?",category:"travel-stay"},
  {word:"transfer",phonetic:"/trænsˈfɜːr/",meanings:["v. 换乘"],sentence:"We need to transfer in Hong Kong.",category:"travel-air"},
  {word:"customs",phonetic:"/ˈkʌstəmz/",meanings:["n. 海关"],sentence:"Go through customs after landing.",category:"travel-air"},
  {word:"visa",phonetic:"/ˈviːzə/",meanings:["n. 签证"],sentence:"Do I need a visa for this country?",category:"travel-air"},
  {word:"currency",phonetic:"/ˈkɜːrənsi/",meanings:["n. 货币"],sentence:"Where can I exchange currency?",category:"travel-stay"},
  {word:"exchange",phonetic:"/ɪksˈtʃeɪndʒ/",meanings:["v. 兑换"],sentence:"I need to exchange some money.",category:"travel-stay"},
  {word:"receipt",phonetic:"/rɪˈsiːt/",meanings:["n. 收据"],sentence:"Can I get a receipt, please?",category:"travel-stay"},
  {word:"recommend",phonetic:"/ˌrekəˈmend/",meanings:["v. 推荐"],sentence:"What do you recommend?",category:"travel-stay"},
  {word:"direction",phonetic:"/dəˈrekʃn/",meanings:["n. 方向"],sentence:"Can you give me directions?",category:"travel-stay"},
  {word:"nearby",phonetic:"/ˌnɪrˈbaɪ/",meanings:["adj. 附近的"],sentence:"Is there a restaurant nearby?",category:"travel-stay"},
  {word:"straight",phonetic:"/streɪt/",meanings:["adv. 直走"],sentence:"Go straight for two blocks.",category:"travel-stay"},
  {word:"ticket",phonetic:"/ˈtɪkɪt/",meanings:["n. 票"],sentence:"Where can I buy a ticket?",category:"travel-air"},
  {word:"platform",phonetic:"/ˈplætfɔːrm/",meanings:["n. 站台"],sentence:"The train leaves from Platform 3.",category:"travel-air"},
  {word:"schedule",phonetic:"/ˈskedʒuːl/",meanings:["n. 时刻表"],sentence:"Check the schedule for the next train.",category:"travel-air"},
  {word:"emergency",phonetic:"/ɪˈmɜːrdʒənsi/",meanings:["n. 紧急情况"],sentence:"Call this number in case of emergency.",category:"travel-air"},
  {word:"pharmacy",phonetic:"/ˈfɑːrməsi/",meanings:["n. 药店"],sentence:"Is there a pharmacy nearby?",category:"travel-stay"},
  {word:"wifi",phonetic:"/ˈwaɪfaɪ/",meanings:["n. 无线网络"],sentence:"Do you have free WiFi?",category:"travel-stay"},
  {word:"password",phonetic:"/ˈpæswɜːrd/",meanings:["n. 密码"],sentence:"What's the WiFi password?",category:"travel-stay"},
  {word:"souvenir",phonetic:"/ˌsuːvəˈnɪr/",meanings:["n. 纪念品"],sentence:"I bought some souvenirs.",category:"travel-stay"},
  {word:"tip",phonetic:"/tɪp/",meanings:["n. 小费"],sentence:"Do we need to leave a tip?",category:"travel-stay"},

  // ===== git 新增词 =====
  {word:"clone",phonetic:"/kloʊn/",meanings:["v. 克隆"],sentence:"Clone the repo to your local machine.",category:"git"},
  {word:"fork",phonetic:"/fɔːrk/",meanings:["v./n. 派生"],sentence:"Fork the project to make your own changes.",category:"git"},
  {word:"push",phonetic:"/pʊʃ/",meanings:["v. 推送"],sentence:"Push your commits to the remote branch.",category:"git"},
  {word:"pull",phonetic:"/pʊl/",meanings:["v. 拉取"],sentence:"Pull the latest changes before you start.",category:"git"},
  {word:"issue",phonetic:"/ˈɪʃuː/",meanings:["n. 议题"],sentence:"Open an issue if you find a bug.",category:"git"},
  {word:"stash",phonetic:"/stæʃ/",meanings:["v. 暂存"],sentence:"Stash your changes before switching branches.",category:"git"},
  {word:"revert",phonetic:"/rɪˈvɜːrt/",meanings:["v. 回退"],sentence:"Revert the last commit if something breaks.",category:"git"},
  {word:"tag",phonetic:"/tæɡ/",meanings:["n. 标签"],sentence:"Create a tag for the release version.",category:"git"},
  {word:"contribute",phonetic:"/kənˈtrɪbjuːt/",meanings:["v. 贡献"],sentence:"Anyone can contribute to open source.",category:"git"},
  {word:"license",phonetic:"/ˈlaɪsns/",meanings:["n. 许可证"],sentence:"Check the license before using the code.",category:"git"},
  {word:"readme",phonetic:"/ˈriːdmiː/",meanings:["n. 说明文档"],sentence:"Read the README before getting started.",category:"git"},
  {word:"milestone",phonetic:"/ˈmaɪlstoʊn/",meanings:["n. 里程碑"],sentence:"We reached a major milestone this sprint.",category:"git"},
  {word:"conflict",phonetic:"/kənˈflɪkt/",meanings:["n. 冲突"],sentence:"Resolve the merge conflict before committing.",category:"git"},

  // ===== ios 新增词 =====
  {word:"screenshot",phonetic:"/ˈskriːnʃɑːt/",meanings:["n. 截图"],sentence:"Take a screenshot of the error.",category:"ios"},
  {word:"bluetooth",phonetic:"/ˈbluːtuːθ/",meanings:["n. 蓝牙"],sentence:"Turn on Bluetooth to pair your device.",category:"ios"},
  {word:"battery",phonetic:"/ˈbætəri/",meanings:["n. 电池"],sentence:"Your battery is running low.",category:"ios"},
  {word:"cellular",phonetic:"/ˈseljələr/",meanings:["n. 蜂窝网络"],sentence:"Turn off cellular data to save battery.",category:"ios"},
  {word:"airplane",phonetic:"/ˈerpleɪn/",meanings:["n. 飞行模式"],sentence:"Switch to Airplane Mode during the flight.",category:"ios"},
  {word:"widget",phonetic:"/ˈwɪdʒɪt/",meanings:["n. 小组件"],sentence:"Add a widget to your home screen.",category:"ios"},
  {word:"airdrop",phonetic:"/ˈerdrɑːp/",meanings:["n. 隔空投送"],sentence:"Use AirDrop to share photos nearby.",category:"ios"},
  {word:"hotspot",phonetic:"/ˈhɑːtspɑːt/",meanings:["n. 热点"],sentence:"Turn on your personal hotspot.",category:"ios"},
  {word:"tracking",phonetic:"/ˈtrækɪŋ/",meanings:["n. 追踪"],sentence:"Allow tracking for a better experience.",category:"ios"},
  {word:"focus",phonetic:"/ˈfoʊkəs/",meanings:["n. 专注模式"],sentence:"Set up Focus mode to avoid distractions.",category:"ios"},
  {word:"icloud",phonetic:"/aɪˈklaʊd/",meanings:["n. 云服务"],sentence:"Back up your photos to iCloud.",category:"ios"},
  {word:"facetime",phonetic:"/ˈfeɪstaɪm/",meanings:["n. 视频通话"],sentence:"Let's FaceTime later tonight.",category:"ios"},

  // ===== 高频词补充（场景全覆盖）=====
  {word:"instruction",phonetic:"/ɪnˈstrʌkʃn/",meanings:["n. 指令；说明"],sentence:"Follow the instruction carefully.",category:"ai-prompt"},
  {word:"persona",phonetic:"/pərˈsoʊnə/",meanings:["n. 人设；角色"],sentence:"Set a persona for the AI to role-play.",category:"ai-prompt"},
  {word:"delimiter",phonetic:"/dɪˈlɪmɪtər/",meanings:["n. 分隔符"],sentence:"Use triple quotes as a delimiter.",category:"ai-prompt"},
  {word:"multimodal",phonetic:"/ˌmʌltiˈmoʊdl/",meanings:["adj. 多模态的"],sentence:"Multimodal models can process text and images.",category:"ai-prompt"},
  {word:"modality",phonetic:"/moʊˈdæləti/",meanings:["n. 模态"],sentence:"The model supports multiple modalities.",category:"ai-prompt"},
  {word:"verbose",phonetic:"/vərˈboʊs/",meanings:["adj. 冗长的"],sentence:"The output is too verbose, make it shorter.",category:"ai-prompt"},
  {word:"chunk",phonetic:"/tʃʌŋk/",meanings:["n. 文本块","v. 分块"],sentence:"Split the text into manageable chunks.",category:"ai-prompt"},
  {word:"parse",phonetic:"/pɑːrs/",meanings:["v. 解析"],sentence:"Parse the JSON response from the API.",category:"ai-prompt"},
  {word:"extract",phonetic:"/ɪkˈstrækt/",meanings:["v. 提取"],sentence:"Extract the main ideas from the article.",category:"ai-prompt"},
  {word:"entity",phonetic:"/ˈentəti/",meanings:["n. 实体"],sentence:"Identify named entities in the text.",category:"ai-prompt"},
  {word:"sentiment",phonetic:"/ˈsentɪmənt/",meanings:["n. 情感"],sentence:"Analyze the sentiment of the reviews.",category:"ai-prompt"},
  {word:"scaffold",phonetic:"/ˈskæfoʊld/",meanings:["v. 搭建框架"],sentence:"Scaffold the prompt with examples.",category:"ai-prompt"},
  {word:"rubric",phonetic:"/ˈruːbrɪk/",meanings:["n. 评分标准"],sentence:"Grade the essay using this rubric.",category:"ai-prompt"},
  {word:"granularity",phonetic:"/ˌɡrænjəˈlærəti/",meanings:["n. 粒度"],sentence:"Adjust the granularity of the summary.",category:"ai-prompt"},
  {word:"distill",phonetic:"/dɪˈstɪl/",meanings:["v. 提炼"],sentence:"Distill the key insights from the data.",category:"ai-prompt"},
  {word:"extrapolate",phonetic:"/ɪkˈstræpəleɪt/",meanings:["v. 推断"],sentence:"Don't extrapolate beyond the given data.",category:"ai-prompt"},
  {word:"infer",phonetic:"/ɪnˈfɜːr/",meanings:["v. 推论"],sentence:"We can infer the user's intent from context.",category:"ai-prompt"},
  {word:"premise",phonetic:"/ˈpremɪs/",meanings:["n. 前提"],sentence:"The argument is based on a false premise.",category:"ai-prompt"},
  {word:"caveat",phonetic:"/ˈkeɪviæt/",meanings:["n. 注意事项"],sentence:"There's one caveat to keep in mind.",category:"ai-prompt"},
  {word:"enumerate",phonetic:"/ɪˈnuːməreɪt/",meanings:["v. 列举"],sentence:"Enumerate the steps in order.",category:"ai-prompt"},
  {word:"underscore",phonetic:"/ˌʌndərˈskɔːr/",meanings:["v. 强调"],sentence:"I want to underscore the importance of clarity.",category:"ai-prompt"},
  {word:"delineate",phonetic:"/dɪˈlɪnieɪt/",meanings:["v. 勾勒；描绘"],sentence:"Delineate the scope of the project.",category:"ai-prompt"},
  {word:"transformer",phonetic:"/trænsˈfɔːrmər/",meanings:["n. 变换器架构"],sentence:"The transformer architecture revolutionized NLP.",category:"ai-model"},
  {word:"attention",phonetic:"/əˈtenʃn/",meanings:["n. 注意力机制"],sentence:"Self-attention allows the model to focus on relevant parts.",category:"ai-model"},
  {word:"neural",phonetic:"/ˈnʊrəl/",meanings:["adj. 神经的"],sentence:"Neural networks learn from examples.",category:"ai-model"},
  {word:"dataset",phonetic:"/ˈdeɪtəset/",meanings:["n. 数据集"],sentence:"Train the model on a labeled dataset.",category:"ai-model"},
  {word:"epoch",phonetic:"/ˈepək/",meanings:["n. 训练轮次"],sentence:"Train for 50 epochs to converge.",category:"ai-model"},
  {word:"gradient",phonetic:"/ˈɡreɪdiənt/",meanings:["n. 梯度"],sentence:"Gradient descent minimizes the loss.",category:"ai-model"},
  {word:"overfitting",phonetic:"/ˌoʊvərˈfɪtɪŋ/",meanings:["n. 过拟合"],sentence:"Regularization helps prevent overfitting.",category:"ai-model"},
  {word:"regularization",phonetic:"/ˌreɡjələrəˈzeɪʃn/",meanings:["n. 正则化"],sentence:"Apply L2 regularization to the weights.",category:"ai-model"},
  {word:"pretrain",phonetic:"/priːˈtreɪn/",meanings:["v. 预训练"],sentence:"Pretrain the model on a large corpus.",category:"ai-model"},
  {word:"retrieval",phonetic:"/rɪˈtriːvl/",meanings:["n. 检索"],sentence:"RAG combines retrieval with generation.",category:"ai-model"},
  {word:"semantic",phonetic:"/sɪˈmæntɪk/",meanings:["adj. 语义的"],sentence:"Embeddings capture semantic meaning.",category:"ai-model"},
  {word:"quantization",phonetic:"/ˌkwɑːntəˈzeɪʃn/",meanings:["n. 量化"],sentence:"Quantization reduces model size significantly.",category:"ai-model"},
  {word:"alignment",phonetic:"/əˈlaɪnmənt/",meanings:["n. 对齐"],sentence:"RLHF improves model alignment with human values.",category:"ai-model"},
  {word:"guardrail",phonetic:"/ˈɡɑːrdreɪl/",meanings:["n. 安全护栏"],sentence:"Add guardrails to prevent harmful output.",category:"ai-model"},
  {word:"generative",phonetic:"/ˈdʒenərətɪv/",meanings:["adj. 生成式的"],sentence:"Generative AI creates new content from prompts.",category:"ai-model"},
  {word:"encoder",phonetic:"/ɪnˈkoʊdər/",meanings:["n. 编码器"],sentence:"The encoder processes the input sequence.",category:"ai-model"},
  {word:"decoder",phonetic:"/dɪˈkoʊdər/",meanings:["n. 解码器"],sentence:"The decoder generates the output sequence.",category:"ai-model"},
  {word:"reinforcement",phonetic:"/ˌriːɪnˈfɔːrsmənt/",meanings:["n. 强化"],sentence:"Reinforcement learning improves the model over time.",category:"ai-model"},
  {word:"distillation",phonetic:"/ˌdɪstɪˈleɪʃn/",meanings:["n. 蒸馏"],sentence:"Knowledge distillation compresses large models.",category:"ai-model"},
  {word:"loss",phonetic:"/lɔːs/",meanings:["n. 损失"],sentence:"The loss function measures prediction error.",category:"ai-model"},
  {word:"fetch",phonetic:"/fetʃ/",meanings:["v. 获取"],sentence:"Fetch the latest changes from remote.",category:"git"},
  {word:"cherry-pick",phonetic:"/ˈtʃeri pɪk/",meanings:["v. 摘选"],sentence:"Cherry-pick the commit from another branch.",category:"git"},
  {word:"rebase",phonetic:"/rɪˈbeɪs/",meanings:["v. 变基"],sentence:"Rebase your branch onto main.",category:"git"},
  {word:"diff",phonetic:"/dɪf/",meanings:["n. 差异"],sentence:"Review the diff before committing.",category:"git"},
  {word:"blame",phonetic:"/bleɪm/",meanings:["v. 追溯"],sentence:"Use git blame to find who changed this line.",category:"git"},
  {word:"remote",phonetic:"/rɪˈmoʊt/",meanings:["n. 远程仓库"],sentence:"Add a new remote repository.",category:"git"},
  {word:"amend",phonetic:"/əˈmend/",meanings:["v. 修补"],sentence:"Amend the last commit message.",category:"git"},
  {word:"squash",phonetic:"/skwɑːʃ/",meanings:["v. 压缩"],sentence:"Squash the commits into one.",category:"git"},
  {word:"submodule",phonetic:"/ˈsʌbmoʊdʒuːl/",meanings:["n. 子模块"],sentence:"Add the library as a submodule.",category:"git"},
  {word:"reflog",phonetic:"/ˈreflɒɡ/",meanings:["n. 引用日志"],sentence:"Check the reflog to find lost commits.",category:"git"},
  {word:"bisect",phonetic:"/ˈbaɪsekt/",meanings:["v. 二分排查"],sentence:"Use bisect to find the bug-introducing commit.",category:"git"},
  {word:"detached",phonetic:"/dɪˈtætʃt/",meanings:["adj. 分离的"],sentence:"You're in a detached HEAD state.",category:"git"},
  {word:"staged",phonetic:"/steɪdʒd/",meanings:["adj. 已暂存的"],sentence:"The file is staged and ready to commit.",category:"git"},
  {word:"containerize",phonetic:"/kənˈteɪnəraɪz/",meanings:["v. 容器化"],sentence:"Containerize the app for easy deployment.",category:"devops"},
  {word:"orchestrate",phonetic:"/ˈɔːrkɪstreɪt/",meanings:["v. 编排"],sentence:"Orchestrate microservices with Kubernetes.",category:"devops"},
  {word:"provision",phonetic:"/prəˈvɪʒn/",meanings:["v. 配置供应"],sentence:"Provision the servers automatically.",category:"devops"},
  {word:"serialize",phonetic:"/ˈsɪriəlaɪz/",meanings:["v. 序列化"],sentence:"Serialize the object to JSON.",category:"devops"},
  {word:"persist",phonetic:"/pərˈsɪst/",meanings:["v. 持久化"],sentence:"Persist the data to disk.",category:"devops"},
  {word:"stateful",phonetic:"/ˈsteɪtfəl/",meanings:["adj. 有状态的"],sentence:"Stateful services are harder to scale.",category:"devops"},
  {word:"stateless",phonetic:"/ˈsteɪtləs/",meanings:["adj. 无状态的"],sentence:"Stateless APIs are easy to scale.",category:"devops"},
  {word:"idempotent",phonetic:"/ˌaɪdəmˈpoʊtənt/",meanings:["adj. 幂等的"],sentence:"PUT requests should be idempotent.",category:"devops"},
  {word:"concurrent",phonetic:"/kənˈkʌrənt/",meanings:["adj. 并发的"],sentence:"Handle concurrent requests safely.",category:"devops"},
  {word:"throughput",phonetic:"/ˈθruːpʊt/",meanings:["n. 吞吐量"],sentence:"The system handles high throughput.",category:"devops"},
  {word:"bottleneck",phonetic:"/ˈbɑːtlnek/",meanings:["n. 瓶颈"],sentence:"The database is the performance bottleneck.",category:"devops"},
  {word:"daemon",phonetic:"/ˈdiːmən/",meanings:["n. 守护进程"],sentence:"The daemon runs in the background.",category:"devops"},
  {word:"spawn",phonetic:"/spɑːn/",meanings:["v. 创建；生成"],sentence:"Spawn a new process for each task.",category:"devops"},
  {word:"deadlock",phonetic:"/ˈdedlɑːk/",meanings:["n. 死锁"],sentence:"Avoid deadlock with proper locking order.",category:"devops"},
  {word:"schema",phonetic:"/ˈskiːmə/",meanings:["n. 模式；结构"],sentence:"Update the database schema.",category:"devops"},
  {word:"query",phonetic:"/ˈkwɪri/",meanings:["n./v. 查询"],sentence:"Optimize the database query.",category:"devops"},
  {word:"transaction",phonetic:"/trænˈzækʃn/",meanings:["n. 事务"],sentence:"Wrap the operations in a transaction.",category:"devops"},
  {word:"protocol",phonetic:"/ˈproʊtəkɑːl/",meanings:["n. 协议"],sentence:"Use the HTTPS protocol for security.",category:"devops"},
  {word:"handshake",phonetic:"/ˈhændʃeɪk/",meanings:["n. 握手"],sentence:"The TLS handshake establishes a secure connection.",category:"devops"},
  {word:"credential",phonetic:"/krəˈdenʃl/",meanings:["n. 凭证"],sentence:"Store credentials securely.",category:"devops"},
  {word:"encrypt",phonetic:"/ɪnˈkrɪpt/",meanings:["v. 加密"],sentence:"Encrypt sensitive data at rest.",category:"devops"},
  {word:"decrypt",phonetic:"/dɪˈkrɪpt/",meanings:["v. 解密"],sentence:"Decrypt the message with the private key.",category:"devops"},
  {word:"vulnerability",phonetic:"/ˌvʌlnərəˈbɪləti/",meanings:["n. 漏洞"],sentence:"Patch the security vulnerability immediately.",category:"devops"},
  {word:"sanitize",phonetic:"/ˈsænɪtaɪz/",meanings:["v. 净化"],sentence:"Sanitize user input to prevent injection.",category:"devops"},
  {word:"ingress",phonetic:"/ˈɪnɡres/",meanings:["n. 入口"],sentence:"Configure the ingress controller.",category:"devops"},
  {word:"gesture",phonetic:"/ˈdʒestʃər/",meanings:["n. 手势"],sentence:"Use a pinch gesture to zoom in.",category:"ios"},
  {word:"biometric",phonetic:"/ˌbaɪoʊˈmetrɪk/",meanings:["adj. 生物识别的"],sentence:"Enable biometric authentication.",category:"ios"},
  {word:"authenticate",phonetic:"/ɔːˈθentɪkeɪt/",meanings:["v. 认证"],sentence:"Authenticate with Face ID.",category:"ios"},
  {word:"geolocation",phonetic:"/ˌdʒiːoʊloʊˈkeɪʃn/",meanings:["n. 定位"],sentence:"The app requests geolocation access.",category:"ios"},
  {word:"proximity",phonetic:"/prɑːkˈsɪməti/",meanings:["n. 近距离"],sentence:"The proximity sensor detects nearby objects.",category:"ios"},
  {word:"haptic",phonetic:"/ˈhæptɪk/",meanings:["adj. 触觉的"],sentence:"Enable haptic feedback for buttons.",category:"ios"},
  {word:"portrait",phonetic:"/ˈpɔːrtrət/",meanings:["n. 竖屏"],sentence:"The app works in portrait mode.",category:"ios"},
  {word:"landscape",phonetic:"/ˈlændskeɪp/",meanings:["n. 横屏"],sentence:"Rotate to landscape for a wider view.",category:"ios"},
  {word:"restore",phonetic:"/rɪˈstɔːr/",meanings:["v. 恢复"],sentence:"Restore from a previous backup.",category:"ios"},
  {word:"carrier",phonetic:"/ˈkæriər/",meanings:["n. 运营商"],sentence:"Contact your carrier for SIM issues.",category:"ios"},
  {word:"cursor",phonetic:"/ˈkɜːrsər/",meanings:["n. 光标"],sentence:"Move the cursor to the next line.",category:"software"},
  {word:"clipboard",phonetic:"/ˈklɪpbɔːrd/",meanings:["n. 剪贴板"],sentence:"Copy the text to the clipboard.",category:"software"},
  {word:"viewport",phonetic:"/ˈvjuːpɔːrt/",meanings:["n. 视口"],sentence:"The layout adapts to the viewport size.",category:"software"},
  {word:"render",phonetic:"/ˈrendər/",meanings:["v. 渲染"],sentence:"The browser renders the page quickly.",category:"software"},
  {word:"layout",phonetic:"/ˈleɪaʊt/",meanings:["n. 布局"],sentence:"Choose a grid layout for the dashboard.",category:"software"},
  {word:"resize",phonetic:"/rɪˈsaɪz/",meanings:["v. 调整大小"],sentence:"Resize the window to fit.",category:"software"},
  {word:"scroll",phonetic:"/skroʊl/",meanings:["v. 滚动"],sentence:"Scroll down to see more.",category:"software"},
  {word:"zoom",phonetic:"/zuːm/",meanings:["v. 缩放"],sentence:"Zoom in on the image.",category:"software"},
  {word:"hover",phonetic:"/ˈhʌvər/",meanings:["v. 悬停"],sentence:"Hover over the icon for a tooltip.",category:"software"},
  {word:"placeholder",phonetic:"/ˈpleɪshoʊldər/",meanings:["n. 占位符"],sentence:"Enter your name in the placeholder field.",category:"software"},
  {word:"tooltip",phonetic:"/ˈtuːltɪp/",meanings:["n. 提示框"],sentence:"The tooltip shows extra information.",category:"software"},
  {word:"modal",phonetic:"/ˈmoʊdl/",meanings:["n. 模态框"],sentence:"Close the modal to return.",category:"software"},
  {word:"sidebar",phonetic:"/ˈsaɪdbɑːr/",meanings:["n. 侧边栏"],sentence:"The sidebar contains navigation links.",category:"software"},
  {word:"badge",phonetic:"/bædʒ/",meanings:["n. 徽标"],sentence:"A red badge shows unread count.",category:"software"},
  {word:"check-in",phonetic:"/ˈtʃek ɪn/",meanings:["n. 值机"],sentence:"Online check-in opens 24 hours before.",category:"travel-air"},
  {word:"gate",phonetic:"/ɡeɪt/",meanings:["n. 登机口"],sentence:"Proceed to gate B12 for boarding.",category:"travel-air"},
  {word:"aisle",phonetic:"/aɪl/",meanings:["n. 过道"],sentence:"I prefer an aisle seat.",category:"travel-air"},
  {word:"turbulence",phonetic:"/ˈtɜːrbjələns/",meanings:["n. 颠簸"],sentence:"Fasten your seatbelt during turbulence.",category:"travel-air"},
  {word:"crew",phonetic:"/kruː/",meanings:["n. 机组人员"],sentence:"The cabin crew is ready for departure.",category:"travel-air"},
  {word:"attendant",phonetic:"/əˈtendənt/",meanings:["n. 乘务员"],sentence:"Ask the flight attendant for water.",category:"travel-air"},
  {word:"fasten",phonetic:"/ˈfæsn/",meanings:["v. 系紧"],sentence:"Please fasten your seatbelt.",category:"travel-air"},
  {word:"seatbelt",phonetic:"/ˈsiːtbelt/",meanings:["n. 安全带"],sentence:"Keep your seatbelt fastened.",category:"travel-air"},
  {word:"tray",phonetic:"/treɪ/",meanings:["n. 小桌板"],sentence:"Put your tray table up for landing.",category:"travel-air"},
  {word:"layover",phonetic:"/ˈleɪoʊvər/",meanings:["n. 中转停留"],sentence:"We have a 3-hour layover in Tokyo.",category:"travel-air"},
  {word:"carousel",phonetic:"/ˌkærəˈsel/",meanings:["n. 行李转盘"],sentence:"Go to carousel 4 for your luggage.",category:"travel-air"},
  {word:"jetlag",phonetic:"/ˈdʒetlæɡ/",meanings:["n. 时差反应"],sentence:"I need a day to recover from jetlag.",category:"travel-air"},
  {word:"amenities",phonetic:"/əˈmenɪtiz/",meanings:["n. 设施"],sentence:"The hotel offers free amenities.",category:"travel-stay"},
  {word:"complimentary",phonetic:"/ˌkɑːmplɪˈmentri/",meanings:["adj. 免费赠送的"],sentence:"Breakfast is complimentary.",category:"travel-stay"},
  {word:"concierge",phonetic:"/ˌkɑːnsiˈerʒ/",meanings:["n. 礼宾"],sentence:"Ask the concierge for restaurant recommendations.",category:"travel-stay"},
  {word:"housekeeping",phonetic:"/ˈhaʊskiːpɪŋ/",meanings:["n. 客房服务"],sentence:"Housekeeping comes at 10 AM.",category:"travel-stay"},
  {word:"suite",phonetic:"/swiːt/",meanings:["n. 套房"],sentence:"We upgraded to a suite.",category:"travel-stay"},
  {word:"deposit",phonetic:"/dɪˈpɑːzɪt/",meanings:["n. 押金"],sentence:"A deposit is required at check-in.",category:"travel-stay"},
  {word:"voucher",phonetic:"/ˈvaʊtʃər/",meanings:["n. 凭证；代金券"],sentence:"Present your voucher at the counter.",category:"travel-stay"},
  {word:"buffet",phonetic:"/bəˈfeɪ/",meanings:["n. 自助餐"],sentence:"The buffet includes various options.",category:"travel-stay"},
  {word:"allergy",phonetic:"/ˈælərdʒi/",meanings:["n. 过敏"],sentence:"I have a peanut allergy.",category:"travel-stay"},
  {word:"shuttle",phonetic:"/ˈʃʌtl/",meanings:["n. 班车"],sentence:"Take the free shuttle to the airport.",category:"travel-stay"},
  {word:"keycard",phonetic:"/ˈkiːkɑːrd/",meanings:["n. 房卡"],sentence:"Your keycard opens the main entrance.",category:"travel-stay"},
  {word:"valet",phonetic:"/væˈleɪ/",meanings:["n. 代客泊车"],sentence:"Valet parking is available.",category:"travel-stay"},
  {word:"sign in",phonetic:"/saɪn ɪn/",meanings:["v. 登录"],sentence:"Please sign in to your account to continue.",category:"software"},
  {word:"sign up",phonetic:"/saɪn ʌp/",meanings:["v. 注册"],sentence:"Sign up for free to get started.",category:"software"},
  {word:"log out",phonetic:"/lɔːɡ aʊt/",meanings:["v. 退出登录"],sentence:"Log out when you're done using the shared computer.",category:"software"},
  {word:"terms of service",phonetic:"/tɜːrmz əv ˈsɜːrvɪs/",meanings:["n. 服务条款"],sentence:"By continuing, you agree to our terms of service.",category:"software"},
  {word:"privacy policy",phonetic:"/ˈpraɪvəsi ˈpɑːləsi/",meanings:["n. 隐私政策"],sentence:"Read our privacy policy to learn how we handle your data.",category:"software"},
  {word:"cookie policy",phonetic:"/ˈkʊki ˈpɑːləsi/",meanings:["n. Cookie政策"],sentence:"Our cookie policy explains how we use cookies on this site.",category:"software"},
  {word:"drag and drop",phonetic:"/dræɡ ænd drɑːp/",meanings:["v. 拖放"],sentence:"Drag and drop files here to upload them.",category:"software"},
  {word:"add to cart",phonetic:"/æd tə kɑːrt/",meanings:["v. 加入购物车"],sentence:"Click 'Add to Cart' to save this item for later.",category:"software"},
  {word:"stay signed in",phonetic:"/steɪ saɪnd ɪn/",meanings:["v. 保持登录"],sentence:"Check 'Stay signed in' so you don't have to log in again.",category:"software"},
  {word:"all set",phonetic:"/ɔːl set/",meanings:["adj. 全部就绪"],sentence:"You're all set! Your account is ready to use.",category:"software"},
  {word:"sort by",phonetic:"/sɔːrt baɪ/",meanings:["v. 排序方式"],sentence:"Sort by price to find the cheapest options first.",category:"software"},
  {word:"opt out",phonetic:"/ɑːpt aʊt/",meanings:["v. 选择退出"],sentence:"You can opt out of marketing emails at any time.",category:"software"},
  {word:"drop-down",phonetic:"",meanings:["n. 下拉菜单"],sentence:"Select your country from the drop-down menu.",category:"software"},
  {word:"pop-up",phonetic:"",meanings:["n. 弹窗"],sentence:"A pop-up appeared asking me to enable notifications.",category:"software"},
  {word:"checkbox",phonetic:"/ˈtʃekbɑːks/",meanings:["n. 复选框"],sentence:"Tick the checkbox to agree to the terms.",category:"software"},
  {word:"newsletter",phonetic:"/ˈnuːzletər/",meanings:["n. 订阅邮件"],sentence:"Subscribe to our newsletter for weekly updates.",category:"software"},
  {word:"dismiss",phonetic:"/dɪsˈmɪs/",meanings:["v. 关闭；忽略"],sentence:"Dismiss the notification by tapping the X.",category:"software"},
  {word:"preview",phonetic:"/ˈpriːvjuː/",meanings:["n./v. 预览"],sentence:"Preview your document before printing.",category:"software"},
  {word:"archive",phonetic:"/ˈɑːrkaɪv/",meanings:["v. 归档","n. 归档"],sentence:"Archive old emails to keep your inbox clean.",category:"software"},
  {word:"pin",phonetic:"/pɪn/",meanings:["v. 固定","n. 图钉"],sentence:"Pin important notes to the top of the list.",category:"software"},
  {word:"bookmark",phonetic:"/ˈbʊkmɑːrk/",meanings:["v. 加入书签","n. 书签"],sentence:"Bookmark this page for quick access later.",category:"software"},
  {word:"collapse",phonetic:"/kəˈlæps/",meanings:["v. 折叠；收起"],sentence:"Collapse the sidebar to get more screen space.",category:"software"},
  {word:"tab",phonetic:"/tæb/",meanings:["n. 标签页"],sentence:"Close unused tabs to free up memory.",category:"software"},
  {word:"slider",phonetic:"/ˈslaɪdər/",meanings:["n. 滑块"],sentence:"Drag the slider to adjust the volume.",category:"software"},
  {word:"thumbnail",phonetic:"/ˈθʌmneɪl/",meanings:["n. 缩略图"],sentence:"Click the thumbnail to view the full-size image.",category:"software"},
  {word:"avatar",phonetic:"/ˈævətɑːr/",meanings:["n. 头像"],sentence:"Upload a new avatar for your profile.",category:"software"},
  {word:"embed",phonetic:"/ɪmˈbed/",meanings:["v. 嵌入"],sentence:"Embed the video on your website.",category:"software"},
  {word:"plugin",phonetic:"/ˈplʌɡɪn/",meanings:["n. 插件"],sentence:"Install a plugin to add extra features.",category:"software"},
  {word:"extension",phonetic:"/ɪkˈstenʃn/",meanings:["n. 扩展程序"],sentence:"The ad blocker extension blocks pop-ups.",category:"software"},
  {word:"dashboard",phonetic:"/ˈdæʃbɔːrd/",meanings:["n. 仪表盘；控制台"],sentence:"The dashboard shows your monthly usage statistics.",category:"software"},
  {word:"workspace",phonetic:"/ˈwɜːrkspeɪs/",meanings:["n. 工作区"],sentence:"Switch to a different workspace for each project.",category:"software"},
  {word:"subscription",phonetic:"/səbˈskrɪpʃn/",meanings:["n. 订阅"],sentence:"Your subscription renews automatically each month.",category:"software"},
  {word:"discard",phonetic:"/dɪsˈkɑːrd/",meanings:["v. 放弃；丢弃"],sentence:"Discard unsaved changes and close the editor.",category:"software"},
  {word:"session",phonetic:"/ˈseʃn/",meanings:["n. 会话"],sentence:"Your session expired. Please log in again.",category:"software"},
  {word:"trial",phonetic:"/ˈtraɪəl/",meanings:["n. 试用"],sentence:"Start your free 14-day trial today.",category:"software"},
  {word:"unsubscribe",phonetic:"/ˌʌnsəbˈskraɪb/",meanings:["v. 取消订阅"],sentence:"Click here to unsubscribe from marketing emails.",category:"software"},
  {word:"pending",phonetic:"/ˈpendɪŋ/",meanings:["adj. 待处理的"],sentence:"Your payment is pending approval.",category:"software"},
  {word:"control center",phonetic:"/kənˈtroʊl ˈsentər/",meanings:["n. 控制中心"],sentence:"Swipe down from the top-right to open Control Center.",category:"ios"},
  {word:"home screen",phonetic:"/hoʊm skriːn/",meanings:["n. 主屏幕"],sentence:"Tap the home button to return to the home screen.",category:"ios"},
  {word:"lock screen",phonetic:"/lɑːk skriːn/",meanings:["n. 锁屏"],sentence:"Notifications appear on the lock screen.",category:"ios"},
  {word:"do not disturb",phonetic:"/duː nɑːt dɪˈstɜːrb/",meanings:["n. 勿扰模式"],sentence:"Turn on Do Not Disturb during meetings.",category:"ios"},
  {word:"low power mode",phonetic:"/loʊ ˈpaʊər moʊd/",meanings:["n. 低电量模式"],sentence:"Low Power Mode reduces battery usage.",category:"ios"},
  {word:"screen time",phonetic:"/skriːn taɪm/",meanings:["n. 屏幕使用时间"],sentence:"Check your screen time report for weekly usage.",category:"ios"},
  {word:"face id",phonetic:"/feɪs ˌaɪˈdiː/",meanings:["n. 面容ID"],sentence:"Use Face ID to unlock your phone instantly.",category:"ios"},
  {word:"touch id",phonetic:"/tʌtʃ ˌaɪˈdiː/",meanings:["n. 触控ID"],sentence:"Touch ID lets you unlock with your fingerprint.",category:"ios"},
  {word:"app store",phonetic:"/æp stɔːr/",meanings:["n. App Store"],sentence:"Download new apps from the App Store.",category:"ios"},
  {word:"silent mode",phonetic:"/ˈsaɪlənt moʊd/",meanings:["n. 静音模式"],sentence:"Switch to silent mode during the movie.",category:"ios"},
  {word:"location services",phonetic:"/loʊˈkeɪʃn ˈsɜːrvɪsɪz/",meanings:["n. 定位服务"],sentence:"Enable location services for navigation apps.",category:"ios"},
  {word:"cellular data",phonetic:"/ˈseljələr ˈdeɪtə/",meanings:["n. 蜂窝数据"],sentence:"Turn off cellular data to avoid roaming charges.",category:"ios"},
  {word:"wallpaper",phonetic:"/ˈwɔːlpeɪpər/",meanings:["n. 壁纸"],sentence:"Change your wallpaper to a personal photo.",category:"ios"},
  {word:"ringtone",phonetic:"/ˈrɪŋtoʊn/",meanings:["n. 铃声"],sentence:"Set a custom ringtone for your contacts.",category:"ios"},
  {word:"siri",phonetic:"/ˈsɪri/",meanings:["n. Siri语音助手"],sentence:"Ask Siri to set a reminder for you.",category:"ios"},
  {word:"night shift",phonetic:"/naɪt ʃɪft/",meanings:["n. 夜览模式"],sentence:"Night Shift shifts colors to warmer tones after sunset.",category:"ios"},
  {word:"airplay",phonetic:"/ˈerpleɪ/",meanings:["n. AirPlay投屏"],sentence:"Use AirPlay to mirror your screen to Apple TV.",category:"ios"},
  {word:"pull request",phonetic:"/pʊl rɪˈkwest/",meanings:["n. 拉取请求(PR)"],sentence:"Open a pull request to merge your changes.",category:"git"},
  {word:"code review",phonetic:"/koʊd rɪˈvjuː/",meanings:["n. 代码审查"],sentence:"Your code needs a code review before merging.",category:"git"},
  {word:"merge conflict",phonetic:"/mɜːrdʒ ˈkɑːnflɪkt/",meanings:["n. 合并冲突"],sentence:"Resolve the merge conflict before you can push.",category:"git"},
  {word:"feature branch",phonetic:"/ˈfiːtʃər bræntʃ/",meanings:["n. 功能分支"],sentence:"Create a feature branch for each new feature.",category:"git"},
  {word:"commit message",phonetic:"/kəˈmɪt ˈmesɪdʒ/",meanings:["n. 提交信息"],sentence:"Write a clear commit message describing your changes.",category:"git"},
  {word:"changelog",phonetic:"/ˈtʃeɪndʒlɔːɡ/",meanings:["n. 更新日志"],sentence:"Read the changelog to see what's new in this version.",category:"git"},
  {word:"reviewer",phonetic:"/rɪˈvjuːər/",meanings:["n. 审查者"],sentence:"Add a reviewer to approve your pull request.",category:"git"},
  {word:"assignee",phonetic:"/ˌæsaɪˈniː/",meanings:["n. 被分配人"],sentence:"Set yourself as the assignee for this issue.",category:"git"},
  {word:"label",phonetic:"/ˈleɪbl/",meanings:["n. 标签"],sentence:"Add the 'bug' label to mark this issue.",category:"git"},
  {word:"api key",phonetic:"/ˌeɪ piːˈaɪ kiː/",meanings:["n. API密钥"],sentence:"Store your API key securely and never commit it to code.",category:"devops"},
  {word:"access token",phonetic:"/ˈækses ˈtoʊkən/",meanings:["n. 访问令牌"],sentence:"Use an access token to authenticate API requests.",category:"devops"},
  {word:"status code",phonetic:"/ˈsteɪtəs koʊd/",meanings:["n. 状态码"],sentence:"A 200 status code means the request succeeded.",category:"devops"},
  {word:"error message",phonetic:"/ˈerər ˈmesɪdʒ/",meanings:["n. 错误信息"],sentence:"Read the error message to understand what went wrong.",category:"devops"},
  {word:"environment variable",phonetic:"/ɪnˈvaɪrənmənt ˈveriəbl/",meanings:["n. 环境变量"],sentence:"Set the database URL as an environment variable.",category:"devops"},
  {word:"config file",phonetic:"/kənˈfɪɡ faɪl/",meanings:["n. 配置文件"],sentence:"Edit the config file to change the server port.",category:"devops"},
  {word:"log file",phonetic:"/lɔːɡ faɪl/",meanings:["n. 日志文件"],sentence:"Check the log file for error details.",category:"devops"},
  {word:"stack trace",phonetic:"/stæk treɪs/",meanings:["n. 堆栈跟踪"],sentence:"The stack trace shows where the error occurred.",category:"devops"},
  {word:"rate limit",phonetic:"/reɪt ˈlɪmɪt/",meanings:["n. 速率限制"],sentence:"You've hit the rate limit. Try again in a minute.",category:"devops"},
  {word:"timeout",phonetic:"/ˈtaɪmaʊt/",meanings:["n. 超时"],sentence:"The request timed out after 30 seconds.",category:"devops"},
  {word:"uptime",phonetic:"/ˈʌptaɪm/",meanings:["n. 正常运行时间"],sentence:"Our service has 99.9% uptime.",category:"devops"},
  {word:"downtime",phonetic:"/ˈdaʊntaɪm/",meanings:["n. 停机时间"],sentence:"Scheduled downtime is planned for tonight.",category:"devops"},
  {word:"webhook",phonetic:"/ˈwebhʊk/",meanings:["n. Webhook回调"],sentence:"Set up a webhook to receive event notifications.",category:"devops"},
  {word:"hotfix",phonetic:"/ˈhɑːtfɪks/",meanings:["n. 热修复"],sentence:"We released a hotfix for the critical bug.",category:"devops"},
  {word:"breaking change",phonetic:"/ˈbreɪkɪŋ tʃeɪndʒ/",meanings:["n. 破坏性变更"],sentence:"This update contains a breaking change. Read the migration guide.",category:"devops"},
  {word:"chain of thought",phonetic:"/tʃeɪn əv θɔːt/",meanings:["n. 思维链"],sentence:"Use chain of thought prompting for complex reasoning tasks.",category:"ai-prompt"},
  {word:"role play",phonetic:"/roʊl pleɪ/",meanings:["v. 角色扮演"],sentence:"Role play as an experienced senior developer.",category:"ai-prompt"},
  {word:"system prompt",phonetic:"/ˈsɪstəm prɑːmpt/",meanings:["n. 系统提示词"],sentence:"Set the behavior in the system prompt.",category:"ai-prompt"},
  {word:"output format",phonetic:"/ˈaʊtpʊt ˈfɔːrmæt/",meanings:["n. 输出格式"],sentence:"Specify the output format as JSON for easy parsing.",category:"ai-prompt"},
  {word:"think step by step",phonetic:"/θɪŋk step baɪ step/",meanings:["v. 逐步思考"],sentence:"Add \"think step by step\" to improve reasoning accuracy.",category:"ai-prompt"},
  {word:"few-shot",phonetic:"",meanings:["n. 少样本"],sentence:"Use few-shot examples to guide the model output.",category:"ai-prompt"},
  {word:"zero-shot",phonetic:"",meanings:["n. 零样本"],sentence:"Zero-shot classification works without labeled examples.",category:"ai-prompt"},
  {word:"prompt engineering",phonetic:"/prɑːmpt ˌendʒɪˈnɪrɪŋ/",meanings:["n. 提示词工程"],sentence:"Prompt engineering is key to getting good results from LLMs.",category:"ai-prompt"},
  {word:"context window",phonetic:"/ˈkɑːntekst ˈwɪndoʊ/",meanings:["n. 上下文窗口"],sentence:"This model has a 128K context window.",category:"ai-model"},
  {word:"training data",phonetic:"/ˈtreɪnɪŋ ˈdeɪtə/",meanings:["n. 训练数据"],sentence:"The model learns patterns from training data.",category:"ai-model"},
  {word:"learning rate",phonetic:"/ˈlɜːrnɪŋ reɪt/",meanings:["n. 学习率"],sentence:"A lower learning rate leads to more stable training.",category:"ai-model"},
  {word:"batch size",phonetic:"/bætʃ saɪz/",meanings:["n. 批量大小"],sentence:"Increase the batch size for faster training.",category:"ai-model"},
  {word:"loss function",phonetic:"/lɔːs ˈfʌŋkʃn/",meanings:["n. 损失函数"],sentence:"The loss function measures prediction error.",category:"ai-model"},
  {word:"state of the art",phonetic:"/steɪt əv ðə ɑːrt/",meanings:["adj. 最先进的(SOTA)"],sentence:"This model achieves state of the art performance on benchmarks.",category:"ai-model"},
  {word:"open source",phonetic:"/ˈoʊpən sɔːrs/",meanings:["adj. 开源的"],sentence:"Many developers prefer open source models for privacy.",category:"ai-model"},
  {word:"rag",phonetic:"",meanings:["n. 检索增强生成"],sentence:"Use RAG to ground the model in your own documents.",category:"ai-model"},
  {word:"llm",phonetic:"",meanings:["n. 大语言模型"],sentence:"An LLM can generate human-like text responses.",category:"ai-model"},
  {word:"boarding pass",phonetic:"/ˈbɔːrdɪŋ pæs/",meanings:["n. 登机牌"],sentence:"Show your boarding pass and passport at the gate.",category:"travel-air"},
  {word:"carry-on",phonetic:"/ˈkæri ɑːn/",meanings:["n. 随身行李","adj. 随身携带的"],sentence:"You can bring one carry-on bag on the plane.",category:"travel-air"},
  {word:"checked baggage",phonetic:"/tʃekt ˈbæɡɪdʒ/",meanings:["n. 托运行李"],sentence:"Checked baggage allowance is 23kg per passenger.",category:"travel-air"},
  {word:"window seat",phonetic:"/ˈwɪndoʊ siːt/",meanings:["n. 靠窗座位"],sentence:"I prefer a window seat so I can see the view.",category:"travel-air"},
  {word:"aisle seat",phonetic:"/aɪl siːt/",meanings:["n. 靠过道座位"],sentence:"An aisle seat makes it easier to get up.",category:"travel-air"},
  {word:"overhead bin",phonetic:"/ˌoʊvərˈhed bɪn/",meanings:["n. 头顶行李架"],sentence:"Place your bag in the overhead bin above your seat.",category:"travel-air"},
  {word:"flight attendant",phonetic:"/flaɪt əˈtendənt/",meanings:["n. 空乘人员"],sentence:"Ask the flight attendant for a glass of water.",category:"travel-air"},
  {word:"tray table",phonetic:"/treɪ ˈteɪbl/",meanings:["n. 小桌板"],sentence:"Please put your tray table up for landing.",category:"travel-air"},
  {word:"connecting flight",phonetic:"/kəˈnektɪŋ flaɪt/",meanings:["n. 联程航班"],sentence:"We have a connecting flight in Dubai.",category:"travel-air"},
  {word:"baggage claim",phonetic:"/ˈbæɡɪdʒ kleɪm/",meanings:["n. 行李提取处"],sentence:"Proceed to baggage claim after landing.",category:"travel-air"},
  {word:"customs declaration",phonetic:"/ˈkʌstəmz ˌdekləˈreɪʃn/",meanings:["n. 海关申报"],sentence:"Fill out a customs declaration form before arrival.",category:"travel-air"},
  {word:"final call",phonetic:"/ˈfaɪnl kɔːl/",meanings:["n. 最后召集"],sentence:"This is the final call for flight CA123 to Beijing.",category:"travel-air"},
  {word:"boarding time",phonetic:"/ˈbɔːrdɪŋ taɪm/",meanings:["n. 登机时间"],sentence:"Boarding time is 20 minutes before departure.",category:"travel-air"},
  {word:"ground transportation",phonetic:"/ɡraʊnd ˌtrænspɔːrˈteɪʃn/",meanings:["n. 地面交通"],sentence:"Follow signs for ground transportation after exiting.",category:"travel-air"},
  {word:"rental car",phonetic:"/ˈrentl kɑːr/",meanings:["n. 租车"],sentence:"I booked a rental car for our trip.",category:"travel-air"},
  {word:"room service",phonetic:"/ruːm ˈsɜːrvɪs/",meanings:["n. 客房送餐"],sentence:"Order room service if you don't want to go out.",category:"travel-stay"},
  {word:"front desk",phonetic:"/frʌnt desk/",meanings:["n. 前台"],sentence:"Call the front desk if you need extra towels.",category:"travel-stay"},
  {word:"wake-up call",phonetic:"/weɪk ʌp kɔːl/",meanings:["n. 叫醒服务"],sentence:"Can I get a wake-up call at 6 AM tomorrow?",category:"travel-stay"},
  {word:"late checkout",phonetic:"/leɪt ˈtʃekaʊt/",meanings:["n. 延迟退房"],sentence:"We requested late checkout so we can sleep in.",category:"travel-stay"},
  {word:"air conditioning",phonetic:"/er kənˈdɪʃənɪŋ/",meanings:["n. 空调"],sentence:"The air conditioning in my room isn't working.",category:"travel-stay"},
  {word:"laundry service",phonetic:"/ˈlɔːndri ˈsɜːrvɪs/",meanings:["n. 洗衣服务"],sentence:"The hotel offers same-day laundry service.",category:"travel-stay"},
  {word:"power outlet",phonetic:"/ˈpaʊər ˈaʊtlet/",meanings:["n. 电源插座"],sentence:"Is there a power outlet near the bed?",category:"travel-stay"},
  {word:"fully booked",phonetic:"/ˈfʊli bʊkt/",meanings:["adj. 客满的"],sentence:"The hotel is fully booked for the holiday weekend.",category:"travel-stay"},
  {word:"complimentary breakfast",phonetic:"/ˌkɑːmplɪˈmentri ˈbrekfəst/",meanings:["n. 免费早餐"],sentence:"Complimentary breakfast is served from 7 to 10 AM.",category:"travel-stay"},
  {word:"non-smoking",phonetic:"",meanings:["adj. 无烟的"],sentence:"I'd like a non-smoking room, please.",category:"travel-stay"}
];

// 内置词库快照：用于在合并自定义词库时按需重建 WORD_BANK（保证合并幂等、非破坏）
const BUILTIN_WORD_BANK = JSON.parse(JSON.stringify(WORD_BANK));

// ========== 例句中文翻译 ==========
const SENTENCE_ZH = {"prompt": "为AI模型写一个清晰的提示词。","elaborate": "请详细说明你的理由。","synthesize": "综合所有来源的要点。","nuance": "提示词中的细微差别很重要。","refine": "优化输出，使其更简洁。","iterative": "我们采用迭代的方式来设计提示词。","hallucination": "模型在罕见话题上可能会产生幻觉。","grounding": "良好的事实锚定能减少幻觉。","context": "提供足够的上下文以获得更好的结果。","token": "更长的提示词会消耗更多词元。","generate": "模型可以生成高质量的内容。","fine-tune": "在你的自定义数据集上微调模型。","inference": "在训练好的模型上运行推理。","embedding": "使用嵌入向量进行语义搜索。","agent": "构建一个能使用工具的AI智能体。","workflow": "用AI自动化你的工作流。","coherent": "确保输出连贯且合乎逻辑。","concise": "保持回答简洁且切中要害。","relevant": "只包含相关的信息。","ambiguous": "这个请求对AI来说太模糊了。","explicit": "明确说明你的要求。","comprehensive": "对该主题进行全面概述。","summarize": "用三句话总结这篇文章。","paraphrase": "用更简单的语言改写这段话。","brainstorm": "为这个项目头脑风暴一些想法。","draft": "帮我起草一封专业的邮件。","revise": "根据反馈修改文档。","format": "将输出格式化为Markdown表格。","tone": "调整语气，使其更专业。","perspective": "从不同的角度来考虑这件事。","scenario": "描述一个这会有用的场景。","constraint": "在给定的约束条件下工作。","assumption": "清楚地说明你的假设。","parameter": "微调参数以获得更好的输出。","benchmark": "运行基准测试来比较性能。","integration": "与第三方工具的集成是无缝的。","bias": "检查模型输出是否存在偏见。","accuracy": "这种方法显著提高了准确度。","reliable": "确保结果是可靠的。","consistent": "始终保持风格一致。","insight": "从数据中提取关键洞见。","recommend": "你有什么推荐？","evaluate": "评估每个选项的优缺点。","snippet": "这里有一段代码示例，展示如何使用它。","template": "用这个模板作为起点。","clarify": "让我澄清一下我的意思。","outline": "概述这个过程的主要步骤。","feasible": "检查这个方案是否可行。","alternative": "提出一个替代方案。","potential": "尽早发现潜在的问题。","effective": "这是最有效的方法。","deploy": "将更新部署到生产环境。","integrate": "将API集成到你的应用中。","framework": "为项目选择合适的框架。","algorithm": "这个算法提升了搜索速度。","compatible": "这个插件与所有浏览器兼容。","deprecated": "此方法已弃用，请使用新的方法。","mitigate": "添加重试机制来缓解失败。","leverage": "尽可能利用现有的库。","optimize": "优化数据库查询。","validate": "保存前验证用户输入。","implement": "在这个迭代中实现这个功能。","enhance": "这次更新提升了性能。","robust": "构建一个健壮的错误处理系统。","scalable": "将系统设计为可扩展的。","architecture": "新的架构更加清晰。","repository": "克隆仓库即可开始。","dependency": "先安装所需的依赖。","middleware": "添加中间件用于身份验证。","endpoint": "用POST请求调用API端点。","payload": "以JSON格式发送请求数据。","response": "服务器返回了200响应。","request": "请求在30秒后超时。","cache": "缓存结果以避免重复调用。","async": "使用异步调用以获得更好的性能。","debug": "在开发者控制台中调试问题。","compile": "代码编译没有错误。","build": "部署前先运行构建。","release": "为下一个版本发布做准备。","version": "更新到最新版本。","feature": "此功能已在测试版中提供。","bug": "在发布前修复这个缺陷。","merge": "将分支合并到主分支。","commit": "用清晰的提交信息提交你的更改。","branch": "为此功能创建一个新分支。","refactor": "重构这个函数使其更简洁。","document": "清晰地记录API端点。","test": "为新功能编写测试。","production": "绝不要在生产环境中直接测试。","monitor": "密切监控服务器性能。","latency": "通过缓存减少延迟。","scalability": "可扩展性是关键的设计目标。","maintainable": "编写简洁、可维护的代码。","migration": "仔细规划数据库迁移。","rollback": "准备一个回滚方案以防万一。","frontend": "前端是用React构建的。","backend": "后端处理所有的业务逻辑。","configure": "使用前先配置设置。","install": "从官方网站安装应用。","update": "安装最新的安全更新。","permission": "授予存储权限以保存文件。","sync": "在设备间同步你的文件。","backup": "始终备份重要数据。","preference": "在设置菜单中更改偏好设置。","navigate": "导航到设置 > 隐私。","toggle": "打开或关闭深色模式。","settings": "根据自己的喜好调整设置。","default": "如有需要，恢复默认设置。","confirm": "确认你的操作以继续。","save": "记得保存你的更改。","delete": "删除你不再需要的文件。","upload": "将文件上传到云端。","download": "先下载附件。","export": "将数据导出为JSON文件。","import": "从备份文件导入数据。","share": "将链接分享给你的团队。","search": "使用搜索栏快速找到它。","filter": "按日期筛选结果。","refresh": "刷新页面以查看更新。","restart": "更新后重启应用。","account": "你的账户设置在这里。","notification": "启用推送通知以获取提醒。","privacy": "查看隐私政策了解详情。","security": "启用双重认证以提高安全性。","access": "你没有访问此文件夹的权限。","storage": "查看你的可用存储空间。","cloud": "文件会自动保存到云端。","shortcut": "使用键盘快捷键来提高效率。","efficient": "这是一个节省时间的高效方法。","approach": "简单的方法在这里最有效。","concept": "让我解释一下基本概念。","essential": "这是一项必须学习的技能。","significant": "有显著的改善。","crucial": "这一步对成功至关重要。","obvious": "答案现在看起来很明显。","similar": "这两种方法很相似。","specific": "更具体地说明你的需求。","common": "这是一个常见的错误。","frequent": "频繁练习才能熟能生巧。","recent": "查看最近的更新。","initial": "最初版本已就绪。","final": "这是最终版本。","primary": "主要目标是简洁。","major": "这是一次重大更新。","minor": "只是一些小的缺陷修复。","complex": "简单的方法行得通时，避免使用复杂的方案。","simple": "保持简单实用。","flexible": "这个工具非常灵活。","convenient": "这样方便多了。","available": "此功能现已可用。","required": "填写所有必填项。","automatic": "整个过程完全自动化。","improve": "你的英语会随着时间慢慢提升。","reduce": "这减少了所需的时间。","avoid": "避免一次死记太多单词。","progress": "跟踪你随时间推移的进展。","review": "定期复习旧单词。","practice": "每天练习一点效果最好。","familiar": "这个词看起来很眼熟，但我忘了它的意思。","comfortable": "在你觉得自在的时候随时使用。","boarding": "20分钟后开始登机。","passport": "别忘了带护照。","luggage": "我在哪里可以取行李？","terminal": "航班从2号航站楼出发。","departure": "查看出发航班信息屏获取最新动态。","arrival": "到达时间是下午3:30。","delay": "航班延误了一个小时。","booking": "我用这个名字预订了。","reservation": "我想做个预订。","checkout": "退房时间是上午11点。","reception": "向前台询问路线。","destination": "你的最终目的地是哪里？","transfer": "我们需要在香港转机。","customs": "降落后过海关。","visa": "去这个国家需要签证吗？","currency": "我在哪里可以兑换货币？","exchange": "我需要兑换一些钱。","receipt": "请给我一张收据好吗？","menu": "能给我看一下菜单吗？","direction": "你能告诉我怎么走吗？","nearby": "附近有餐厅吗？","straight": "直走两个街区。","ticket": "我在哪里可以买票？","platform": "火车从3号站台出发。","schedule": "查看时刻表了解下一班火车。","emergency": "紧急情况下拨打这个号码。","pharmacy": "附近有药店吗？","wifi": "你们有免费WiFi吗？","password": "WiFi密码是多少？","souvenir": "我买了一些纪念品。","tip": "我们需要给小费吗？","clone": "将仓库克隆到本地。","fork": "派生项目来进行你自己的修改。","push": "将你的提交推送到远程分支。","pull": "开始前先拉取最新更改。","issue": "如果发现缺陷，请提交一个issue。","stash": "切换分支前先暂存你的更改。","revert": "如果出了问题，回退上一次提交。","tag": "为发布版本创建一个标签。","contribute": "任何人都可以为开源项目做贡献。","license": "使用代码前先检查许可证。","readme": "开始前先阅读README。","milestone": "我们在这个迭代中达成了一个重要里程碑。","conflict": "提交前先解决合并冲突。","screenshot": "截一张错误的截图。","bluetooth": "打开蓝牙来配对你的设备。","battery": "你的电池电量不足了。","cellular": "关闭蜂窝数据以节省电量。","airplane": "飞行期间切换到飞行模式。","widget": "在主屏幕上添加一个小组件。","airdrop": "使用隔空投送与附近的人分享照片。","hotspot": "打开你的个人热点。","tracking": "允许追踪以获得更好的体验。","focus": "设置专注模式以避免分心。","icloud": "将你的照片备份到iCloud。","facetime": "今晚晚些时候我们FaceTime吧。","instruction": "仔细遵循指令。","persona": "为AI设定一个角色来扮演。","delimiter": "用三重引号作为分隔符。","multimodal": "多模态模型能处理文本和图像。","modality": "该模型支持多种模态。","verbose": "输出太冗长了，缩短一些。","chunk": "将文本分成易于处理的块。","parse": "解析API返回的JSON响应。","extract": "从文章中提取主要观点。","entity": "识别文本中的命名实体。","sentiment": "分析评论的情感倾向。","scaffold": "用示例来搭建提示词框架。","rubric": "用这个评分标准来给作文打分。","granularity": "调整摘要的粒度。","distill": "从数据中提炼关键洞见。","extrapolate": "不要超出给定数据进行推断。","infer": "我们可以从上下文推论用户的意图。","premise": "这个论点基于一个错误的前提。","caveat": "有一个注意事项要记住。","enumerate": "按顺序列举步骤。","underscore": "我想强调清晰性的重要。","delineate": "勾勒项目的范围。","transformer": "Transformer架构彻底改变了自然语言处理。","attention": "自注意力机制使模型能聚焦于相关部分。","neural": "神经网络从示例中学习。","dataset": "在有标签的数据集上训练模型。","epoch": "训练50个轮次以达到收敛。","gradient": "梯度下降法最小化损失。","overfitting": "正则化有助于防止过拟合。","regularization": "对权重应用L2正则化。","pretrain": "在大型语料库上预训练模型。","retrieval": "RAG将检索与生成结合。","semantic": "嵌入向量捕捉语义信息。","quantization": "量化显著减小模型大小。","alignment": "RLHF提升模型与人类价值观的对齐。","guardrail": "添加安全护栏以防止有害输出。","generative": "生成式AI根据提示词创造新内容。","encoder": "编码器处理输入序列。","decoder": "解码器生成输出序列。","reinforcement": "强化学习让模型随时间改进。","distillation": "知识蒸馏压缩大模型。","loss": "损失函数衡量预测误差。","fetch": "从远程获取最新更改。","cherry-pick": "从其他分支摘选提交。","rebase": "将你的分支变基到主分支。","reset": "将暂存区重置到最后一次提交。","diff": "提交前审查差异。","blame": "用git blame查找谁修改了这行。","remote": "添加一个新的远程仓库。","amend": "修补最后一次提交信息。","squash": "将多个提交压缩为一个。","submodule": "将该库添加为子模块。","reflog": "查看引用日志找到丢失的提交。","bisect": "用二分排查找到引入缺陷的提交。","detached": "你处于分离头指针状态。","staged": "文件已暂存，可以提交了。","containerize": "将应用容器化以便于部署。","orchestrate": "用Kubernetes编排微服务。","provision": "自动配置服务器。","serialize": "将对象序列化为JSON。","persist": "将数据持久化到磁盘。","stateful": "有状态服务更难扩展。","stateless": "无状态API易于扩展。","idempotent": "PUT请求应该是幂等的。","concurrent": "安全地处理并发请求。","throughput": "系统处理高吞吐量。","bottleneck": "数据库是性能瓶颈。","daemon": "守护进程在后台运行。","spawn": "为每个任务创建新进程。","deadlock": "用正确的锁定顺序避免死锁。","schema": "更新数据库模式。","query": "优化数据库查询。","transaction": "将操作包装在事务中。","protocol": "使用HTTPS协议以确保安全。","handshake": "TLS握手建立安全连接。","credential": "安全地存储凭证。","encrypt": "对静态敏感数据进行加密。","decrypt": "用私钥解密消息。","vulnerability": "立即修补安全漏洞。","sanitize": "净化用户输入以防止注入攻击。","ingress": "配置入口控制器。","gesture": "用捏合手势放大。","biometric": "启用生物识别认证。","authenticate": "用面容ID进行认证。","geolocation": "应用请求定位权限。","proximity": "接近传感器检测附近物体。","haptic": "启用按钮的触觉反馈。","portrait": "应用支持竖屏模式。","landscape": "旋转到横屏以获得更宽视野。","brightness": "调整屏幕亮度。","volume": "调高音量。","restore": "从之前的备份恢复。","carrier": "联系你的运营商处理SIM卡问题。","cursor": "将光标移到下一行。","clipboard": "将文本复制到剪贴板。","viewport": "布局自适应视口大小。","render": "浏览器快速渲染页面。","layout": "为仪表盘选择网格布局。","resize": "调整窗口大小以适应。","drag": "将文件拖放到这里。","scroll": "向下滚动查看更多。","zoom": "放大图像。","hover": "将鼠标悬停在图标上查看提示。","placeholder": "在占位符字段中输入你的名字。","tooltip": "提示框显示额外信息。","modal": "关闭模态框返回。","sidebar": "侧边栏包含导航链接。","badge": "红色徽标显示未读数量。","check-in": "在线值机在起飞前24小时开放。","gate": "前往B12登机口登机。","aisle": "我偏好靠过道的座位。","turbulence": "颠簸时请系好安全带。","crew": "机组人员已准备好出发。","attendant": "向乘务员要水。","fasten": "请系好安全带。","seatbelt": "保持安全带系好。","tray": "降落时收起小桌板。","layover": "我们在东京中转停留3小时。","carousel": "到4号行李转盘取行李。","jetlag": "我需要一天来倒时差。","amenities": "酒店提供免费设施。","complimentary": "早餐是免费赠送的。","concierge": "向礼宾询问餐厅推荐。","housekeeping": "客房服务上午10点来。","suite": "我们升级到了套房。","deposit": "入住时需要押金。","voucher": "在柜台出示你的凭证。","buffet": "自助餐包含多种选择。","allergy": "我对花生过敏。","shuttle": "乘坐免费班车去机场。","keycard": "你的房卡可以开正门。","valet": "提供代客泊车服务。","sign in": "请登录你的账户以继续。","sign up": "免费注册即可开始使用。","log out": "使用完公共电脑后请退出登录。","terms of service": "继续即表示你同意我们的服务条款。","privacy policy": "阅读我们的隐私政策，了解我们如何处理你的数据。","cookie policy": "我们的Cookie政策说明了本网站如何使用Cookie。","drag and drop": "将文件拖放到此处以上传。","add to cart": "点击「加入购物车」保存这个商品。","stay signed in": "勾选「保持登录」就不用再次登录了。","all set": "全部就绪！你的账户可以使用了。","sort by": "按价格排序，先找到最便宜的选项。","opt out": "你可以随时选择退出营销邮件。","drop-down": "从下拉菜单中选择你的国家。","pop-up": "一个弹窗出现了，要求我启用通知。","checkbox": "勾选复选框以同意条款。","newsletter": "订阅我们的邮件通讯获取每周更新。","submit": "点击提交发送你的表单。","cancel": "点击取消放弃你的更改。","reject": "拒绝所有非必要Cookie。","decline": "我不得不谢绝这个邀请。","approve": "你的请求已被批准。","dismiss": "点击X关闭这条通知。","select": "按住Ctrl键选择多个项目。","attach": "在支持工单中附上文件。","preview": "打印前先预览文档。","apply": "点击应用保存筛选设置。","archive": "将旧邮件归档以保持收件箱整洁。","pin": "将重要笔记固定到列表顶部。","bookmark": "将此页面加入书签以便以后快速访问。","mute": "将标签页静音以停止播放音频。","collapse": "折叠侧边栏以获得更多屏幕空间。","expand": "展开菜单查看所有选项。","tab": "关闭不用的标签页以释放内存。","slider": "拖动滑块调节音量。","banner": "顶部的横幅提示订阅已过期。","thumbnail": "点击缩略图查看全尺寸图片。","avatar": "为你的资料上传一个新头像。","embed": "将视频嵌入到你的网站上。","plugin": "安装插件来添加额外功能。","extension": "广告拦截扩展程序可以阻止弹窗。","theme": "切换到深色主题以减轻眼睛疲劳。","dashboard": "仪表盘显示你每月的使用统计。","workspace": "为每个项目切换到不同的工作区。","subscription": "你的订阅每月自动续费。","verify": "点击链接验证你的邮箱地址。","discard": "放弃未保存的更改并关闭编辑器。","session": "你的会话已过期，请重新登录。","expired": "你的会话已过期，请重新登录。","invalid": "邮箱地址无效，请检查后重试。","billing": "在支付设置中更新你的账单地址。","promo": "结账时输入优惠码享受折扣。","feedback": "我们感谢你对新设计的反馈。","trial": "今天开始你的14天免费试用。","subscribe": "订阅以解锁所有高级功能。","unsubscribe": "点击此处取消订阅营销邮件。","profile": "编辑你的个人资料来更新显示名称。","loading": "页面仍在加载中，请稍候。","pending": "你的付款正在等待批准。","enabled": "深色模式当前已启用。","disabled": "JavaScript在你的浏览器中已被禁用。","denied": "访问被拒绝，你没有权限。","rate": "你愿意在App Store给这个应用评分吗？","control center": "从右上角下滑打开控制中心。","home screen": "按主屏幕按钮返回主屏幕。","lock screen": "通知显示在锁屏上。","do not disturb": "把「请勿打扰」牌子挂在门上。","low power mode": "低电量模式会减少电池消耗。","screen time": "查看屏幕使用时间报告了解每周使用情况。","face id": "使用面容ID立即解锁手机。","touch id": "触控ID让你用指纹解锁。","app store": "从App Store下载新应用。","silent mode": "看电影时切换到静音模式。","location services": "为导航应用启用定位服务。","cellular data": "关闭蜂窝数据以避免漫游费用。","wallpaper": "把你的壁纸换成一张个人照片。","ringtone": "为你的联系人设置自定义铃声。","siri": "让Siri帮你设置一个提醒。","night shift": "日落后夜览模式会将色调调暖。","airplay": "使用AirPlay将屏幕镜像到Apple TV。","pull request": "创建一个拉取请求来合并你的更改。","code review": "你的代码在合并前需要经过代码审查。","merge conflict": "解决合并冲突后才能推送。","feature branch": "为每个新功能创建一个功能分支。","commit message": "写清晰的提交信息描述你的更改。","changelog": "阅读更新日志查看此版本的新功能。","reviewer": "添加一名审查者来批准你的拉取请求。","assignee": "将自己设为这个issue的处理人。","label": "添加「bug」标签来标记这个问题。","api key": "安全地存储你的API密钥，绝不要提交到代码中。","access token": "使用访问令牌来认证API请求。","status code": "200状态码表示请求成功。","error message": "阅读错误信息了解哪里出了问题。","environment variable": "将数据库URL设置为环境变量。","config file": "编辑配置文件更改服务器端口。","log file": "检查日志文件查看错误详情。","stack trace": "堆栈跟踪显示了错误发生的位置。","rate limit": "你已触发速率限制，请一分钟后再试。","timeout": "请求在30秒后超时。","uptime": "我们的服务有99.9%的正常运行时间。","downtime": "计划停机时间安排在今晚。","webhook": "设置webhook来接收事件通知。","hotfix": "我们为这个严重缺陷发布了一个热修复。","breaking change": "此更新包含破坏性变更，请阅读迁移指南。","chain of thought": "对复杂推理任务使用思维链提示。","role play": "角色扮演一位经验丰富的高级开发者。","system prompt": "在系统提示词中设定行为。","output format": "将输出格式指定为JSON以便解析。","think step by step": "添加「逐步思考」来提高推理准确性。","few-shot": "使用少样本示例引导模型输出。","zero-shot": "零样本分类不需要标注示例就能工作。","prompt engineering": "提示词工程是从LLM获得好结果的关键。","context window": "这个模型有128K的上下文窗口。","training data": "模型从训练数据中学习模式。","learning rate": "较低的学习率使训练更稳定。","batch size": "增加批量大小以加快训练速度。","loss function": "损失函数衡量预测误差。","state of the art": "该模型在基准测试中达到最先进的性能。","open source": "许多开发者出于隐私原因偏好开源模型。","rag": "使用RAG将模型锚定在你自己的文档上。","llm": "大语言模型可以生成类似人类的文本回复。","boarding pass": "在登机口出示你的登机牌和护照。","carry-on": "你可以带一件随身行李上飞机。","checked baggage": "托运行李限额为每位乘客23公斤。","window seat": "我更喜欢靠窗座位可以看风景。","aisle seat": "靠过道座位方便起身。","overhead bin": "将你的包放在座位上方的头顶行李架里。","flight attendant": "向空乘人员要一杯水。","tray table": "降落时请收起小桌板。","connecting flight": "我们在迪拜有一个联程航班。","baggage claim": "降落后前往行李提取处。","customs declaration": "到达前填写海关申报单。","final call": "这是飞往北京的CA123航班的最后召集。","boarding time": "登机时间为起飞前20分钟。","ground transportation": "出机场后跟随地面交通指示牌。","rental car": "我为旅行预订了一辆租车。","room service": "不想出门就叫客房送餐。","front desk": "如果你需要额外毛巾打电话给前台。","wake-up call": "明天早上6点能给我叫醒服务吗？","late checkout": "我们申请了延迟退房可以睡个懒觉。","air conditioning": "我房间的空调坏了。","laundry service": "酒店提供当日洗衣服务。","power outlet": "床边有电源插座吗？","fully booked": "酒店在假期周末已经客满了。","complimentary breakfast": "免费早餐供应时间为早上7点到10点。","non-smoking": "请给我一间无烟房，谢谢。"};

// ========== 深度学习数据（高频词）==========
const DEEP_DATA = {
  "prompt": { pos:"n./v.", collocations:[{type:"n.",phrase:"write a <span class=\"hl\">prompt</span>",zh:"写提示词"},{type:"n.",phrase:"clear <span class=\"hl\">prompt</span>",zh:"清晰的提示词"},{type:"v.",phrase:"<span class=\"hl\">prompt</span> someone to do",zh:"促使某人做某事"}], wordFamily:[{word:"promptly",pos:"adv."},{word:"prompting",pos:"n."}], synonyms:[{word:"cue",note:"提示，较正式"},{word:"hint",note:"暗示，更隐晦"}], extraSentences:[{en:"A well-crafted prompt can dramatically improve AI output quality.",zh:"精心编写的提示词能显著提升AI输出质量。"},{en:"The teacher prompted the student to elaborate.",zh:"老师促使学生详细说明。"}] },
  "elaborate": { pos:"v./adj.", collocations:[{type:"v.",phrase:"<span class=\"hl\">elaborate</span> on",zh:"详细说明"},{type:"adj.",phrase:"<span class=\"hl\">elaborate</span> plan",zh:"精心制作的计划"},{type:"adj.",phrase:"<span class=\"hl\">elaborate</span> design",zh:"精美的设计"}], wordFamily:[{word:"elaboration",pos:"n."},{word:"elaborately",pos:"adv."}], synonyms:[{word:"expound",note:"详述，更学术"},], extraSentences:[{en:"Could you elaborate on the technical details?",zh:"你能详细说明一下技术细节吗？"},{en:"They prepared an elaborate strategy for the launch.",zh:"他们为发布准备了精心制作的策略。"}] },
  "synthesize": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">synthesize</span> data",zh:"综合数据"},{type:"v.",phrase:"<span class=\"hl\">synthesize</span> information",zh:"综合信息"},{type:"v.",phrase:"<span class=\"hl\">synthesize</span> findings",zh:"综合发现"}], wordFamily:[{word:"synthesis",pos:"n."},{word:"synthetic",pos:"adj."}], synonyms:[{word:"integrate",note:"整合，强调合为一体"},{word:"combine",note:"结合，更通用"}], extraSentences:[{en:"The report synthesizes data from multiple sources.",zh:"报告综合了多个来源的数据。"},{en:"Researchers synthesized findings from three studies.",zh:"研究人员综合了三项研究的发现。"}] },
  "refine": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">refine</span> a process",zh:"完善流程"},{type:"v.",phrase:"<span class=\"hl\">refine</span> search results",zh:"优化搜索结果"},{type:"v.",phrase:"<span class=\"hl\">refine</span> a strategy",zh:"完善策略"}], wordFamily:[{word:"refinement",pos:"n."},{word:"refined",pos:"adj."}], synonyms:[{word:"polish",note:"润色，强调细节完善"}], extraSentences:[{en:"We need to refine our approach based on feedback.",zh:"我们需要根据反馈完善方法。"},{en:"The team refined the algorithm to reduce processing time.",zh:"团队优化了算法以减少处理时间。"}] },
  "context": { pos:"n.", collocations:[{type:"n.",phrase:"provide <span class=\"hl\">context</span>",zh:"提供背景"},{type:"n.",phrase:"in <span class=\"hl\">context</span>",zh:"在上下文中"},{type:"n.",phrase:"out of <span class=\"hl\">context</span>",zh:"断章取义"}], wordFamily:[{word:"contextual",pos:"adj."},{word:"contextualize",pos:"v."}], synonyms:[{word:"background",note:"背景，更通用"},{word:"setting",note:"环境，更具体"}], extraSentences:[{en:"Without proper context, the data can be misinterpreted.",zh:"没有适当背景，数据容易被误解。"},{en:"The quote was taken out of context.",zh:"这段引语被断章取义了。"}] },
  "generate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">generate</span> output",zh:"生成输出"},{type:"v.",phrase:"<span class=\"hl\">generate</span> ideas",zh:"产生想法"},{type:"v.",phrase:"<span class=\"hl\">generate</span> revenue",zh:"创造收入"}], wordFamily:[{word:"generation",pos:"n."},{word:"generator",pos:"n."}], synonyms:[{word:"produce",note:"产生，更通用"},{word:"create",note:"创造，强调原创性"}], extraSentences:[{en:"The model can generate human-like text from a short prompt.",zh:"模型能根据简短提示生成类人文本。"},{en:"Brainstorming often generates innovative ideas.",zh:"头脑风暴常产生创新想法。"}] },
  "concise": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">concise</span> summary",zh:"简明的摘要"},{type:"adj.",phrase:"<span class=\"hl\">concise</span> manner",zh:"简洁的方式"},{type:"adj.",phrase:"<span class=\"hl\">concise</span> explanation",zh:"简明的解释"}], wordFamily:[{word:"concisely",pos:"adv."},{word:"conciseness",pos:"n."}], synonyms:[{word:"succinct",note:"简练的，更正式"},{word:"brief",note:"简短的，更通用"}], extraSentences:[{en:"Please provide a concise summary of the findings.",zh:"请提供关键发现的简明摘要。"},{en:"Her concise manner made the presentation effective.",zh:"她简洁的方式使演示很有效。"}] },
  "summarize": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">summarize</span> findings",zh:"总结发现"},{type:"v.",phrase:"<span class=\"hl\">summarize</span> key points",zh:"总结要点"},{type:"v.",phrase:"briefly <span class=\"hl\">summarize</span>",zh:"简要总结"}], wordFamily:[{word:"summary",pos:"n."},{word:"summarization",pos:"n."}], synonyms:[{word:"recap",note:"概述，更口语"},{word:"outline",note:"概述，强调框架"}], extraSentences:[{en:"Let me summarize the key points before we continue.",zh:"继续之前让我总结一下要点。"},{en:"The report summarizes the entire project.",zh:"报告总结了整个项目。"}] },
  "clarify": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">clarify</span> meaning",zh:"澄清含义"},{type:"v.",phrase:"<span class=\"hl\">clarify</span> a point",zh:"澄清观点"},{type:"v.",phrase:"<span class=\"hl\">clarify</span> requirements",zh:"澄清需求"}], wordFamily:[{word:"clarification",pos:"n."},{word:"clarity",pos:"n."}], synonyms:[{word:"explain",note:"解释，更通用"},{word:"elucidate",note:"阐明，更正式"}], extraSentences:[{en:"Could you clarify what you mean by 'scalable'?",zh:"你能澄清一下'scalable'的含义吗？"},{en:"The manager clarified the requirements before work started.",zh:"经理在工作开始前澄清了需求。"}] },
  "effective": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">effective</span> solution",zh:"有效的解决方案"},{type:"adj.",phrase:"<span class=\"hl\">effective</span> communication",zh:"有效沟通"},{type:"adj.",phrase:"highly <span class=\"hl\">effective</span>",zh:"非常有效"}], wordFamily:[{word:"effectively",pos:"adv."},{word:"effectiveness",pos:"n."}], synonyms:[{word:"efficient",note:"高效的，侧重效率"},{word:"efficacious",note:"有效的，更正式"}], extraSentences:[{en:"This is a highly effective approach to reducing costs.",zh:"这是减少成本的有效方法。"},{en:"Effective communication is essential for teamwork.",zh:"有效沟通对团队合作至关重要。"}] },
  "deploy": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">deploy</span> an application",zh:"部署应用"},{type:"v.",phrase:"<span class=\"hl\">deploy</span> to production",zh:"部署到生产环境"},{type:"v.",phrase:"<span class=\"hl\">deploy</span> resources",zh:"部署资源"}], wordFamily:[{word:"deployment",pos:"n."},{word:"deployable",pos:"adj."}], synonyms:[{word:"launch",note:"启动，强调开始运行"},{word:"roll out",note:"推出，更口语"}], extraSentences:[{en:"The team deployed the new app to production last night.",zh:"团队昨晚将新应用部署到了生产环境。"},{en:"Cloud platforms make it easier to deploy and scale.",zh:"云平台使部署和扩展更容易。"}] },
  "integrate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">integrate</span> with",zh:"与...集成"},{type:"v.",phrase:"<span class=\"hl\">integrate</span> into",zh:"集成到...中"},{type:"v.",phrase:"<span class=\"hl\">integrate</span> systems",zh:"集成系统"}], wordFamily:[{word:"integration",pos:"n."},{word:"integrated",pos:"adj."}], synonyms:[{word:"incorporate",note:"并入，更正式"},{word:"merge",note:"合并，强调融为一体"}], extraSentences:[{en:"The new API integrates seamlessly with existing systems.",zh:"新API与现有系统无缝集成。"},{en:"We need to integrate the payment gateway into the platform.",zh:"我们需要将支付网关集成到平台中。"}] },
  "optimize": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">optimize</span> performance",zh:"优化性能"},{type:"v.",phrase:"<span class=\"hl\">optimize</span> for speed",zh:"为速度优化"},{type:"v.",phrase:"<span class=\"hl\">optimize</span> resources",zh:"优化资源"}], wordFamily:[{word:"optimization",pos:"n."},{word:"optimal",pos:"adj."}], synonyms:[{word:"streamline",note:"精简，强调简化流程"},{word:"fine-tune",note:"微调，强调精细调整"}], extraSentences:[{en:"We optimized the database queries to improve response time.",zh:"我们优化了数据库查询以改善响应时间。"},{en:"The algorithm is optimized for speed.",zh:"该算法为速度进行了优化。"}] },
  "implement": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">implement</span> a solution",zh:"实施解决方案"},{type:"v.",phrase:"<span class=\"hl\">implement</span> changes",zh:"实施变更"},{type:"v.",phrase:"<span class=\"hl\">implement</span> a strategy",zh:"实施策略"}], wordFamily:[{word:"implementation",pos:"n."},{word:"implementable",pos:"adj."}], synonyms:[{word:"execute",note:"执行，强调付诸行动"},{word:"carry out",note:"执行，更口语"}], extraSentences:[{en:"The team implemented the new feature in two weeks.",zh:"团队在两周内实现了新功能。"},{en:"Designing a strategy is one thing, implementing it is another.",zh:"设计策略是一回事，实施是另一回事。"}] },
  "robust": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">robust</span> system",zh:"健壮的系统"},{type:"adj.",phrase:"<span class=\"hl\">robust</span> solution",zh:"稳健的方案"},{type:"adj.",phrase:"<span class=\"hl\">robust</span> framework",zh:"健壮的框架"}], wordFamily:[{word:"robustly",pos:"adv."},{word:"robustness",pos:"n."}], synonyms:[{word:"resilient",note:"有韧性的，强调恢复力"},{word:"sturdy",note:"坚固的，侧重物理强度"}], extraSentences:[{en:"A robust system should handle errors gracefully.",zh:"健壮的系统应能优雅地处理错误。"},{en:"The framework provides a robust foundation.",zh:"该框架提供了稳健的基础。"}] },
  "scalable": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">scalable</span> architecture",zh:"可扩展的架构"},{type:"adj.",phrase:"<span class=\"hl\">scalable</span> solution",zh:"可扩展的方案"},{type:"adj.",phrase:"highly <span class=\"hl\">scalable</span>",zh:"高度可扩展"}], wordFamily:[{word:"scale",pos:"v./n."},{word:"scalability",pos:"n."}], synonyms:[{word:"expandable",note:"可扩展的，更通用"},{word:"flexible",note:"灵活的，范围更广"}], extraSentences:[{en:"Cloud computing provides highly scalable infrastructure.",zh:"云计算提供了高度可扩展的基础设施。"},{en:"We designed a scalable architecture for millions of users.",zh:"我们设计了支持数百万用户的可扩展架构。"}] },
  "debug": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">debug</span> code",zh:"调试代码"},{type:"v.",phrase:"<span class=\"hl\">debug</span> issues",zh:"调试问题"},{type:"n.",phrase:"<span class=\"hl\">debug</span> mode",zh:"调试模式"}], wordFamily:[{word:"debugger",pos:"n."},{word:"debugging",pos:"n."}], synonyms:[{word:"troubleshoot",note:"排查，范围更广"},{word:"fix",note:"修复，更口语"}], extraSentences:[{en:"It took hours to debug the memory leak.",zh:"调试内存泄漏花了几个小时。"},{en:"Running in debug mode helps identify errors.",zh:"在调试模式下运行有助于定位错误。"}] },
  "refactor": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">refactor</span> code",zh:"重构代码"},{type:"v.",phrase:"<span class=\"hl\">refactor</span> into modules",zh:"重构为模块"},{type:"v.",phrase:"<span class=\"hl\">refactor</span> for readability",zh:"为可读性重构"}], wordFamily:[{word:"refactoring",pos:"n."},{word:"refactored",pos:"adj."}], synonyms:[{word:"restructure",note:"重构，不限于代码"},{word:"rewrite",note:"重写，更彻底"}], extraSentences:[{en:"The team decided to refactor the codebase first.",zh:"团队决定先重构代码库。"},{en:"Refactoring for readability reduces maintenance costs.",zh:"为可读性重构能降低维护成本。"}] },
  "configure": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">configure</span> settings",zh:"配置设置"},{type:"v.",phrase:"<span class=\"hl\">configure</span> a system",zh:"配置系统"},{type:"v.",phrase:"<span class=\"hl\">configure</span> a network",zh:"配置网络"}], wordFamily:[{word:"configuration",pos:"n."},{word:"configurable",pos:"adj."}], synonyms:[{word:"set up",note:"设置，更口语"},{word:"arrange",note:"安排，更通用"}], extraSentences:[{en:"Configure the settings before first use.",zh:"首次使用前配置设置。"},{en:"The IT department configured the network for remote access.",zh:"IT部门配置了网络以支持远程访问。"}] },
  "efficient": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">efficient</span> process",zh:"高效的流程"},{type:"adj.",phrase:"highly <span class=\"hl\">efficient</span>",zh:"高度高效"},{type:"adj.",phrase:"<span class=\"hl\">efficient</span> use of resources",zh:"资源的高效利用"}], wordFamily:[{word:"efficiently",pos:"adv."},{word:"efficiency",pos:"n."}], synonyms:[{word:"productive",note:"多产的，强调产出"},{word:"effective",note:"有效的，侧重效果"}], extraSentences:[{en:"Automation made the process highly efficient.",zh:"自动化使流程变得高度高效。"},{en:"Efficient use of resources is key to sustainability.",zh:"资源的高效利用是可持续发展的关键。"}] },
  "approach": { pos:"n./v.", collocations:[{type:"n.",phrase:"new <span class=\"hl\">approach</span>",zh:"新方法"},{type:"v.",phrase:"<span class=\"hl\">approach</span> a problem",zh:"处理问题"},{type:"n.",phrase:"take an <span class=\"hl\">approach</span>",zh:"采取某种方法"}], wordFamily:[{word:"approachable",pos:"adj."},{word:"approachability",pos:"n."}], synonyms:[{word:"method",note:"方法，更正式"},{word:"strategy",note:"策略，强调计划性"}], extraSentences:[{en:"We need a new approach to solve this problem.",zh:"我们需要新方法来解决这个问题。"},{en:"The team took a data-driven approach.",zh:"团队采用了数据驱动的方法。"}] },
  "essential": { pos:"adj./n.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">essential</span> component",zh:"核心组件"},{type:"adj.",phrase:"<span class=\"hl\">essential</span> for",zh:"对...必不可少"},{type:"adj.",phrase:"absolutely <span class=\"hl\">essential</span>",zh:"绝对必要"}], wordFamily:[{word:"essentially",pos:"adv."},{word:"essentials",pos:"n."}], synonyms:[{word:"crucial",note:"关键的，强调决定性"},{word:"vital",note:"至关重要的，强调不可或缺"}], extraSentences:[{en:"Clear communication is essential for collaboration.",zh:"清晰沟通对协作必不可少。"},{en:"Testing is an absolutely essential part of development.",zh:"测试是开发中绝对必要的一环。"}] },
  "crucial": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">crucial</span> role",zh:"关键作用"},{type:"adj.",phrase:"<span class=\"hl\">crucial</span> factor",zh:"关键因素"},{type:"adj.",phrase:"<span class=\"hl\">crucial</span> to success",zh:"对成功至关重要"}], wordFamily:[{word:"crucially",pos:"adv."},{word:"crucialness",pos:"n."}], synonyms:[{word:"critical",note:"关键的，更正式"},{word:"vital",note:"至关重要的，更强调必要性"}], extraSentences:[{en:"Timing plays a crucial role in product launches.",zh:"时机在产品发布中起关键作用。"},{en:"User feedback is crucial to improving the product.",zh:"用户反馈对改进产品至关重要。"}] },
  "improve": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">improve</span> performance",zh:"提升性能"},{type:"v.",phrase:"<span class=\"hl\">improve</span> on",zh:"在...基础上改进"},{type:"v.",phrase:"<span class=\"hl\">improve</span> quality",zh:"提升质量"}], wordFamily:[{word:"improvement",pos:"n."},{word:"improvable",pos:"adj."}], synonyms:[{word:"enhance",note:"增强，更正式"},{word:"upgrade",note:"升级，强调等级提升"}], extraSentences:[{en:"Regular exercise can significantly improve your health.",zh:"规律运动能显著改善健康。"},{en:"The new version improves on the previous one.",zh:"新版本比前一版本有所改进。"}] },
  "consistent": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">consistent</span> results",zh:"一致的结果"},{type:"adj.",phrase:"<span class=\"hl\">consistent</span> with",zh:"与...一致"},{type:"adj.",phrase:"highly <span class=\"hl\">consistent</span>",zh:"高度一致"}], wordFamily:[{word:"consistently",pos:"adv."},{word:"consistency",pos:"n."}], synonyms:[{word:"steady",note:"稳定的，强调持续不变"},{word:"uniform",note:"统一的，强调无差异"}], extraSentences:[{en:"The algorithm produces consistent results.",zh:"该算法产生一致的结果。"},{en:"Her performance has been highly consistent.",zh:"她的表现一直高度稳定。"}] },
  "luggage": { pos:"n.", collocations:[{type:"n.",phrase:"pack <span class=\"hl\">luggage</span>",zh:"打包行李"},{type:"n.",phrase:"check <span class=\"hl\">luggage</span>",zh:"托运行李"},{type:"n.",phrase:"carry-on <span class=\"hl\">luggage</span>",zh:"随身行李"}], wordFamily:[], synonyms:[{word:"baggage",note:"行李，美式英语更常用"},{word:"bags",note:"袋子，更口语"}], extraSentences:[{en:"Make sure to label your luggage before checking in.",zh:"托运前确保给行李贴好标签。"},{en:"The airline allows one carry-on luggage.",zh:"航空公司允许一件随身行李。"}] },
  "boarding": { pos:"n./adj.", collocations:[{type:"n.",phrase:"<span class=\"hl\">boarding</span> pass",zh:"登机牌"},{type:"n.",phrase:"<span class=\"hl\">boarding</span> gate",zh:"登机口"},{type:"n.",phrase:"<span class=\"hl\">boarding</span> time",zh:"登机时间"}], wordFamily:[{word:"board",pos:"v."},{word:"onboard",pos:"adv./adj."}], synonyms:[{word:"embarkation",note:"登机，更正式"},], extraSentences:[{en:"Have your boarding pass and ID ready at the gate.",zh:"在登机口准备好登机牌和证件。"},{en:"Boarding begins 30 minutes before departure.",zh:"出发前30分钟开始登机。"}] },
  "passport": { pos:"n.", collocations:[{type:"n.",phrase:"valid <span class=\"hl\">passport</span>",zh:"有效护照"},{type:"n.",phrase:"<span class=\"hl\">passport</span> control",zh:"护照检查处"},{type:"v.",phrase:"show <span class=\"hl\">passport</span>",zh:"出示护照"}], wordFamily:[], synonyms:[{word:"travel document",note:"旅行证件，更宽泛"},{word:"ID",note:"身份证件，更口语"}], extraSentences:[{en:"Make sure your passport is valid for six months.",zh:"确保护照至少还有六个月有效期。"},{en:"Present your passport at passport control.",zh:"在护照检查处出示护照。"}] },
  "departure": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">departure</span> time",zh:"出发时间"},{type:"n.",phrase:"<span class=\"hl\">departure</span> gate",zh:"出发登机口"},{type:"n.",phrase:"<span class=\"hl\">departure</span> lounge",zh:"候机室"}], wordFamily:[{word:"depart",pos:"v."},{word:"departed",pos:"adj."}], synonyms:[{word:"exit",note:"出口，更通用"},{word:"leaving",note:"离开，更口语"}], extraSentences:[{en:"The departure time has been delayed by two hours.",zh:"出发时间推迟了两小时。"},{en:"Passengers should proceed to the departure lounge.",zh:"乘客应前往候机室。"}] },
  "reservation": { pos:"n.", collocations:[{type:"v.",phrase:"make a <span class=\"hl\">reservation</span>",zh:"预订"},{type:"v.",phrase:"cancel a <span class=\"hl\">reservation</span>",zh:"取消预订"},{type:"v.",phrase:"confirm a <span class=\"hl\">reservation</span>",zh:"确认预订"}], wordFamily:[{word:"reserve",pos:"v."},{word:"reserved",pos:"adj."}], synonyms:[{word:"booking",note:"预订，英式英语常用"},{word:"appointment",note:"预约，多用于会面"}], extraSentences:[{en:"I'd like to make a reservation for two at 7 PM.",zh:"我想预订晚上七点两人的位子。"},{en:"Please call to confirm your reservation.",zh:"请致电确认您的预订。"}] },

  // ===== Travel 更多高频词 =====
  "terminal": { pos:"n.", collocations:[{type:"n.",phrase:"airport <span class=\"hl\">terminal</span>",zh:"机场航站楼"},{type:"n.",phrase:"<span class=\"hl\">terminal</span> building",zh:"航站楼建筑"}], wordFamily:[{word:"terminate",pos:"v."}], synonyms:[{word:"departure hall",note:"出发大厅"}], extraSentences:[{en:"Your flight departs from Terminal 3.",zh:"您的航班从3号航站楼出发。"}] },
  "arrival": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">arrival</span> time",zh:"到达时间"},{type:"n.",phrase:"<span class=\"hl\">arrival</span> hall",zh:"到达大厅"}], wordFamily:[{word:"arrive",pos:"v."}], synonyms:[{word:"coming",note:"到来，更通用"}], extraSentences:[{en:"The estimated arrival time is 3:30 PM.",zh:"预计到达时间是下午3:30。"}] },
  "delay": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">delay</span> a flight",zh:"延误航班"},{type:"adj.",phrase:"delayed flight",zh:"延误的航班"}], wordFamily:[{word:"delayed",pos:"adj."}], synonyms:[{word:"postpone",note:"推迟，更正式"},{word:"put off",note:"推迟，口语"}], extraSentences:[{en:"The flight was delayed due to bad weather.",zh:"航班因恶劣天气延误了。"}] },
  "booking": { pos:"n.", collocations:[{type:"v.",phrase:"make a <span class=\"hl\">booking</span>",zh:"预订"},{type:"n.",phrase:"online <span class=\"hl\">booking</span>",zh:"在线预订"}], wordFamily:[{word:"book",pos:"v."}], synonyms:[{word:"reservation",note:"预订，可互换"}], extraSentences:[{en:"I have a booking under the name Smith.",zh:"我以Smith的名字预订了。"}] },
  "checkout": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">checkout</span> time",zh:"退房时间"},{type:"n.",phrase:"express <span class=\"hl\">checkout</span>",zh:"快速退房"}], wordFamily:[{word:"check out",pos:"v.phr."}], synonyms:[], extraSentences:[{en:"Checkout time is 11 AM.",zh:"退房时间是上午11点。"}] },
  "destination": { pos:"n.", collocations:[{type:"n.",phrase:"final <span class=\"hl\">destination</span>",zh:"最终目的地"},{type:"v.",phrase:"reach your <span class=\"hl\">destination</span>",zh:"到达目的地"}], wordFamily:[{word:"destine",pos:"v."}], synonyms:[{word:"end point",note:"终点"}], extraSentences:[{en:"What's your final destination?",zh:"您的最终目的地是哪里？"}] },
  "customs": { pos:"n.", collocations:[{type:"v.",phrase:"go through <span class=\"hl\">customs</span>",zh:"过海关"},{type:"n.",phrase:"<span class=\"hl\">customs</span> declaration",zh:"海关申报"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Please have your passport ready for customs.",zh:"请准备好护照过海关。"}] },
  "visa": { pos:"n.", collocations:[{type:"n.",phrase:"tourist <span class=\"hl\">visa</span>",zh:"旅游签证"},{type:"v.",phrase:"apply for a <span class=\"hl\">visa</span>",zh:"申请签证"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Do I need a visa to enter this country?",zh:"我需要签证才能入境这个国家吗？"}] },
  "currency": { pos:"n.", collocations:[{type:"n.",phrase:"local <span class=\"hl\">currency</span>",zh:"当地货币"},{type:"v.",phrase:"exchange <span class=\"hl\">currency</span>",zh:"兑换货币"}], wordFamily:[], synonyms:[{word:"money",note:"钱，更通用"},{word:"cash",note:"现金"}], extraSentences:[{en:"Where can I exchange foreign currency?",zh:"我在哪里可以兑换外币？"}] },
  "exchange": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">exchange</span> money",zh:"换钱"},{type:"n.",phrase:"<span class=\"hl\">exchange</span> rate",zh:"汇率"}], wordFamily:[{word:"exchangeable",pos:"adj."}], synonyms:[{word:"swap",note:"交换，更口语"}], extraSentences:[{en:"I need to exchange some dollars for euros.",zh:"我需要把一些美元换成欧元。"}] },
  "receipt": { pos:"n.", collocations:[{type:"v.",phrase:"get a <span class=\"hl\">receipt</span>",zh:"拿收据"},{type:"n.",phrase:"<span class=\"hl\">receipt</span> number",zh:"收据号"}], wordFamily:[{word:"receive",pos:"v."}], synonyms:[{word:"proof of purchase",note:"购物凭证"}], extraSentences:[{en:"Can I get a receipt, please?",zh:"请给我一张收据好吗？"}] },
  "direction": { pos:"n.", collocations:[{type:"v.",phrase:"give <span class=\"hl\">directions</span>",zh:"指路"},{type:"v.",phrase:"ask for <span class=\"hl\">directions</span>",zh:"问路"}], wordFamily:[{word:"direct",pos:"v./adj."},{word:"directly",pos:"adv."}], synonyms:[{word:"way",note:"路，更口语"}], extraSentences:[{en:"Can you give me directions to the nearest station?",zh:"你能告诉我去最近的车站怎么走吗？"}] },
  "schedule": { pos:"n./v.", collocations:[{type:"n.",phrase:"train <span class=\"hl\">schedule</span>",zh:"列车时刻表"},{type:"adj.",phrase:"on <span class=\"hl\">schedule</span>",zh:"准时"}], wordFamily:[{word:"scheduled",pos:"adj."}], synonyms:[{word:"timetable",note:"时刻表，英式英语"}], extraSentences:[{en:"The train is running on schedule.",zh:"列车正点运行。"}] },
  "emergency": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">emergency</span> exit",zh:"紧急出口"},{type:"n.",phrase:"in case of <span class=\"hl\">emergency</span>",zh:"万一发生紧急情况"}], wordFamily:[{word:"emerge",pos:"v."}], synonyms:[{word:"crisis",note:"危机，更严重"}], extraSentences:[{en:"Call 120 in case of emergency.",zh:"紧急情况请拨打120。"}] },
  "souvenir": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">souvenir</span> shop",zh:"纪念品商店"},{type:"v.",phrase:"buy <span class=\"hl\">souvenirs</span>",zh:"买纪念品"}], wordFamily:[], synonyms:[{word:"memento",note:"纪念品，更正式"}], extraSentences:[{en:"I bought some souvenirs for my friends.",zh:"我给朋友们买了一些纪念品。"}] },

  // ===== AI 补充高频词 =====
  "nuance": { pos:"n.", collocations:[{type:"adj.",phrase:"subtle <span class=\"hl\">nuance</span>",zh:"细微差别"},{type:"v.",phrase:"understand the <span class=\"hl\">nuance</span>",zh:"理解细微差别"}], wordFamily:[{word:"nuanced",pos:"adj."}], synonyms:[{word:"subtlety",note:"微妙之处"}], extraSentences:[{en:"The nuance in tone changes the meaning completely.",zh:"语气上的细微差别完全改变了意思。"}] },
  "iterative": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">iterative</span> process",zh:"迭代过程"},{type:"adj.",phrase:"<span class=\"hl\">iterative</span> approach",zh:"迭代方法"}], wordFamily:[{word:"iterate",pos:"v."},{word:"iteration",pos:"n."}], synonyms:[{word:"repetitive",note:"重复的，但iterative强调改进"}], extraSentences:[{en:"Design is an iterative process, not a one-time task.",zh:"设计是一个迭代过程，不是一次性任务。"}] },
  "hallucination": { pos:"n.", collocations:[{type:"n.",phrase:"AI <span class=\"hl\">hallucination</span>",zh:"AI幻觉"},{type:"v.",phrase:"produce <span class=\"hl\">hallucinations</span>",zh:"产生幻觉"}], wordFamily:[{word:"hallucinate",pos:"v."}], synonyms:[], extraSentences:[{en:"Adding citations helps reduce hallucinations in AI output.",zh:"添加引用有助于减少AI输出中的幻觉。"}] },
  "grounding": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">grounding</span> in facts",zh:"基于事实"},{type:"adj.",phrase:"well-grounded",zh:"有根据的"}], wordFamily:[{word:"ground",pos:"v."},{word:"grounded",pos:"adj."}], synonyms:[{word:"foundation",note:"基础"}], extraSentences:[{en:"Good grounding in real data makes AI answers more reliable.",zh:"基于真实数据的良好锚定使AI回答更可靠。"}] },
  "token": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">token</span> limit",zh:"词元限制"},{type:"v.",phrase:"count <span class=\"hl\">tokens</span>",zh:"计算词元"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Each API call consumes a certain number of tokens.",zh:"每次API调用消耗一定数量的词元。"}] },
  "fine-tune": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">fine-tune</span> a model",zh:"微调模型"},{type:"n.",phrase:"<span class=\"hl\">fine-tune</span> parameters",zh:"微调参数"}], wordFamily:[{word:"fine-tuning",pos:"n."}], synonyms:[{word:"adjust",note:"调整，更通用"}], extraSentences:[{en:"You can fine-tune the model on your own dataset for better results.",zh:"你可以在自己的数据集上微调模型以获得更好效果。"}] },
  "inference": { pos:"n.", collocations:[{type:"v.",phrase:"run <span class=\"hl\">inference</span>",zh:"运行推理"},{type:"n.",phrase:"<span class=\"hl\">inference</span> speed",zh:"推理速度"}], wordFamily:[{word:"infer",pos:"v."}], synonyms:[{word:"deduction",note:"推断，更正式"}], extraSentences:[{en:"The model runs inference in real time on the server.",zh:"模型在服务器上实时运行推理。"}] },
  "embedding": { pos:"n.", collocations:[{type:"n.",phrase:"word <span class=\"hl\">embedding</span>",zh:"词嵌入"},{type:"v.",phrase:"generate <span class=\"hl\">embeddings</span>",zh:"生成嵌入向量"}], wordFamily:[{word:"embed",pos:"v."}], synonyms:[], extraSentences:[{en:"Embeddings capture the semantic meaning of text.",zh:"嵌入向量捕捉文本的语义含义。"}] },
  "agent": { pos:"n.", collocations:[{type:"n.",phrase:"AI <span class=\"hl\">agent</span>",zh:"AI智能体"},{type:"adj.",phrase:"autonomous <span class=\"hl\">agent</span>",zh:"自主智能体"}], wordFamily:[{word:"agency",pos:"n."}], synonyms:[{word:"assistant",note:"助手，更口语"}], extraSentences:[{en:"An AI agent can plan and execute multi-step tasks.",zh:"AI智能体可以规划和执行多步骤任务。"}] },
  "coherent": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">coherent</span> argument",zh:"连贯的论证"},{type:"adj.",phrase:"<span class=\"hl\">coherent</span> response",zh:"连贯的回复"}], wordFamily:[{word:"coherence",pos:"n."},{word:"coherently",pos:"adv."}], synonyms:[{word:"logical",note:"合乎逻辑的"},{word:"consistent",note:"一致的"}], extraSentences:[{en:"Make sure your answer is coherent and easy to follow.",zh:"确保你的回答连贯易懂。"}] },
  "ambiguous": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">ambiguous</span> wording",zh:"含糊的措辞"},{type:"v.",phrase:"remain <span class=\"hl\">ambiguous</span>",zh:"保持模糊"}], wordFamily:[{word:"ambiguity",pos:"n."}], synonyms:[{word:"unclear",note:"不清楚的"},{word:"vague",note:"模糊的"}], extraSentences:[{en:"The prompt was ambiguous, so the AI gave a confusing answer.",zh:"提示词太模糊，所以AI给出了令人困惑的回答。"}] },
  "explicit": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">explicit</span> instructions",zh:"明确的指示"},{type:"v.",phrase:"make it <span class=\"hl\">explicit</span>",zh:"说清楚"}], wordFamily:[{word:"explicitly",pos:"adv."}], synonyms:[{word:"clear",note:"清楚的"},{word:"specific",note:"具体的"}], extraSentences:[{en:"Be explicit about what format you want the output in.",zh:"明确说明你想要的输出格式。"}] },
  "comprehensive": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">comprehensive</span> overview",zh:"全面概述"},{type:"adj.",phrase:"<span class=\"hl\">comprehensive</span> guide",zh:"全面指南"}], wordFamily:[{word:"comprehend",pos:"v."},{word:"comprehensively",pos:"adv."}], synonyms:[{word:"thorough",note:"彻底的"},{word:"complete",note:"完整的"}], extraSentences:[{en:"The report provides a comprehensive review of the topic.",zh:"报告对该主题进行了全面回顾。"}] },
  "paraphrase": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">paraphrase</span> a sentence",zh:"改写句子"},{type:"n.",phrase:"a <span class=\"hl\">paraphrase</span> of the text",zh:"文本的改写"}], wordFamily:[{word:"paraphrasing",pos:"n."}], synonyms:[{word:"rephrase",note:"换种说法"},{word:"rewrite",note:"重写"}], extraSentences:[{en:"Can you paraphrase this in simpler language?",zh:"你能用更简单的语言改写一下吗？"}] },
  "brainstorm": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">brainstorm</span> ideas",zh:"头脑风暴想法"},{type:"n.",phrase:"<span class=\"hl\">brainstorm</span> session",zh:"头脑风暴会议"}], wordFamily:[{word:"brainstorming",pos:"n."}], synonyms:[{word:"think up",note:"想出，口语"}], extraSentences:[{en:"Let's brainstorm some ideas for the campaign.",zh:"我们来为活动头脑风暴一些想法。"}] },
  "perspective": { pos:"n.", collocations:[{type:"adj.",phrase:"different <span class=\"hl\">perspective</span>",zh:"不同视角"},{type:"prep.",phrase:"from a <span class=\"hl\">perspective</span>",zh:"从...角度"}], wordFamily:[], synonyms:[{word:"viewpoint",note:"观点"},{word:"angle",note:"角度，更口语"}], extraSentences:[{en:"Looking at it from a user's perspective changes everything.",zh:"从用户角度看问题会改变一切。"}] },
  "scenario": { pos:"n.", collocations:[{type:"n.",phrase:"real-world <span class=\"hl\">scenario</span>",zh:"真实场景"},{type:"n.",phrase:"worst-case <span class=\"hl\">scenario</span>",zh:"最坏情况"}], wordFamily:[], synonyms:[{word:"situation",note:"情况"},{word:"case",note:"案例"}], extraSentences:[{en:"Describe a scenario where this feature would be useful.",zh:"描述一个这个功能会有用的场景。"}] },
  "constraint": { pos:"n.", collocations:[{type:"n.",phrase:"budget <span class=\"hl\">constraints</span>",zh:"预算约束"},{type:"v.",phrase:"work within <span class=\"hl\">constraints</span>",zh:"在限制内工作"}], wordFamily:[{word:"constrain",pos:"v."},{word:"constrained",pos:"adj."}], synonyms:[{word:"limitation",note:"限制"},{word:"restriction",note:"限制"}], extraSentences:[{en:"We need to work within the given time constraints.",zh:"我们需要在给定的时间限制内工作。"}] },
  "assumption": { pos:"n.", collocations:[{type:"v.",phrase:"make an <span class=\"hl\">assumption</span>",zh:"做假设"},{type:"adj.",phrase:"false <span class=\"hl\">assumption</span>",zh:"错误假设"}], wordFamily:[{word:"assume",pos:"v."}], synonyms:[{word:"presumption",note:"假定，更正式"}], extraSentences:[{en:"Don't make assumptions about what the user wants.",zh:"不要对用户想要什么做假设。"}] },
  "parameter": { pos:"n.", collocations:[{type:"v.",phrase:"set <span class=\"hl\">parameters</span>",zh:"设置参数"},{type:"v.",phrase:"adjust <span class=\"hl\">parameters</span>",zh:"调整参数"}], wordFamily:[{word:"parametrize",pos:"v."}], synonyms:[{word:"setting",note:"设置，更口语"}], extraSentences:[{en:"Tweak the parameters to get better output.",zh:"调整参数以获得更好的输出。"}] },
  "benchmark": { pos:"n./v.", collocations:[{type:"n.",phrase:"performance <span class=\"hl\">benchmark</span>",zh:"性能基准"},{type:"v.",phrase:"<span class=\"hl\">benchmark</span> against",zh:"与...做基准对比"}], wordFamily:[{word:"benchmarking",pos:"n."}], synonyms:[{word:"standard",note:"标准"}], extraSentences:[{en:"Run benchmarks to compare different models.",zh:"运行基准测试来比较不同模型。"}] },
  "bias": { pos:"n.", collocations:[{type:"n.",phrase:"data <span class=\"hl\">bias</span>",zh:"数据偏见"},{type:"v.",phrase:"remove <span class=\"hl\">bias</span>",zh:"消除偏见"}], wordFamily:[{word:"biased",pos:"adj."}], synonyms:[{word:"prejudice",note:"偏见，更贬义"}], extraSentences:[{en:"Training data may contain biases that affect output.",zh:"训练数据可能包含影响输出的偏见。"}] },
  "accuracy": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">accuracy</span> rate",zh:"准确率"},{type:"v.",phrase:"improve <span class=\"hl\">accuracy</span>",zh:"提高准确度"}], wordFamily:[{word:"accurate",pos:"adj."},{word:"accurately",pos:"adv."}], synonyms:[{word:"precision",note:"精确度"}], extraSentences:[{en:"This approach significantly improves accuracy.",zh:"这种方法显著提高了准确度。"}] },
  "reliable": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">reliable</span> data",zh:"可靠数据"},{type:"adj.",phrase:"<span class=\"hl\">reliable</span> source",zh:"可靠来源"}], wordFamily:[{word:"reliability",pos:"n."},{word:"rely",pos:"v."}], synonyms:[{word:"trustworthy",note:"值得信赖的"},{word:"dependable",pos:"adj.",note:"可靠的"}], extraSentences:[{en:"Make sure your data comes from reliable sources.",zh:"确保你的数据来自可靠来源。"}] },
  "insight": { pos:"n.", collocations:[{type:"adj.",phrase:"key <span class=\"hl\">insight</span>",zh:"关键洞见"},{type:"v.",phrase:"gain <span class=\"hl\">insights</span>",zh:"获得洞见"}], wordFamily:[{word:"insightful",pos:"adj."}], synonyms:[{word:"understanding",note:"理解"},{word:"finding",note:"发现"}], extraSentences:[{en:"The analysis revealed valuable insights into user behavior.",zh:"分析揭示了关于用户行为的宝贵洞见。"}] },
  "evaluate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">evaluate</span> performance",zh:"评估表现"},{type:"v.",phrase:"<span class=\"hl\">evaluate</span> options",zh:"评估选项"}], wordFamily:[{word:"evaluation",pos:"n."}], synonyms:[{word:"assess",note:"评估"},{word:"judge",note:"判断"}], extraSentences:[{en:"Evaluate the pros and cons before deciding.",zh:"在决定之前评估利弊。"}] },
  "snippet": { pos:"n.", collocations:[{type:"n.",phrase:"code <span class=\"hl\">snippet</span>",zh:"代码片段"},{type:"n.",phrase:"<span class=\"hl\">snippet</span> of text",zh:"文本片段"}], wordFamily:[], synonyms:[{word:"fragment",note:"片段"}], extraSentences:[{en:"Here's a code snippet showing how to use the API.",zh:"这里有一个展示如何使用API的代码片段。"}] },
  "template": { pos:"n.", collocations:[{type:"v.",phrase:"use a <span class=\"hl\">template</span>",zh:"使用模板"},{type:"n.",phrase:"<span class=\"hl\">template</span> file",zh:"模板文件"}], wordFamily:[], synonyms:[{word:"blueprint",note:"蓝图"}], extraSentences:[{en:"Use this email template as a starting point.",zh:"用这个邮件模板作为起点。"}] },
  "outline": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">outline</span> the steps",zh:"概述步骤"},{type:"n.",phrase:"course <span class=\"hl\">outline</span>",zh:"课程大纲"}], wordFamily:[], synonyms:[{word:"summarize",note:"总结"},{word:"sketch",note:"概述，更简略"}], extraSentences:[{en:"Let me outline the main points first.",zh:"让我先概述要点。"}] },
  "feasible": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">feasible</span> plan",zh:"可行计划"},{type:"v.",phrase:"prove <span class=\"hl\">feasible</span>",zh:"证明可行"}], wordFamily:[{word:"feasibility",pos:"n."}], synonyms:[{word:"possible",note:"可能的"},{word:"viable",note:"可行的"}], extraSentences:[{en:"Is it feasible to finish this by Friday?",zh:"周五之前完成这个可行吗？"}] },
  "alternative": { pos:"n./adj.", collocations:[{type:"n.",phrase:"<span class=\"hl\">alternative</span> solution",zh:"替代方案"},{type:"n.",phrase:"<span class=\"hl\">alternative</span> approach",zh:"替代方法"}], wordFamily:[{word:"alternatively",pos:"adv."}], synonyms:[{word:"option",note:"选项"},{word:"substitute",note:"替代品"}], extraSentences:[{en:"Let me suggest an alternative approach.",zh:"让我建议一个替代方法。"}] },
  "potential": { pos:"adj./n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">potential</span> issues",zh:"潜在问题"},{type:"v.",phrase:"have <span class=\"hl\">potential</span>",zh:"有潜力"}], wordFamily:[{word:"potentially",pos:"adv."}], synonyms:[{word:"possible",note:"可能的"},{word:"prospective",note:"预期的"}], extraSentences:[{en:"Identify potential risks before launching.",zh:"在发布前识别潜在风险。"}] },

  // ===== Tech 补充高频词 =====
  "framework": { pos:"n.", collocations:[{type:"v.",phrase:"use a <span class=\"hl\">framework</span>",zh:"使用框架"},{type:"n.",phrase:"web <span class=\"hl\">framework</span>",zh:"Web框架"}], wordFamily:[], synonyms:[{word:"platform",note:"平台"},{word:"structure",note:"结构"}], extraSentences:[{en:"React is a popular framework for building UIs.",zh:"React是一个流行的UI构建框架。"}] },
  "algorithm": { pos:"n.", collocations:[{type:"n.",phrase:"search <span class=\"hl\">algorithm</span>",zh:"搜索算法"},{type:"v.",phrase:"design an <span class=\"hl\">algorithm</span>",zh:"设计算法"}], wordFamily:[{word:"algorithmic",pos:"adj."}], synonyms:[], extraSentences:[{en:"This algorithm sorts data in O(n log n) time.",zh:"这个算法以O(n log n)的时间复杂度排序数据。"}] },
  "compatible": { pos:"adj.", collocations:[{type:"prep.",phrase:"<span class=\"hl\">compatible</span> with",zh:"与...兼容"},{type:"adv.",phrase:"backward <span class=\"hl\">compatible</span>",zh:"向后兼容"}], wordFamily:[{word:"compatibility",pos:"n."}], synonyms:[{word:"interoperable",note:"可互操作的，更技术化"}], extraSentences:[{en:"This file format is compatible with all major browsers.",zh:"这种文件格式与所有主流浏览器兼容。"}] },
  "deprecated": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">deprecated</span> feature",zh:"已弃用功能"},{type:"v.",phrase:"mark as <span class=\"hl\">deprecated</span>",zh:"标记为弃用"}], wordFamily:[{word:"deprecate",pos:"v."},{word:"deprecation",pos:"n."}], synonyms:[{word:"obsolete",note:"过时的"}], extraSentences:[{en:"This API is deprecated, please use v2 instead.",zh:"此API已弃用，请改用v2版本。"}] },
  "mitigate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">mitigate</span> risks",zh:"缓解风险"},{type:"v.",phrase:"<span class=\"hl\">mitigate</span> the impact",zh:"减轻影响"}], wordFamily:[{word:"mitigation",pos:"n."}], synonyms:[{word:"alleviate",note:"缓解"}], extraSentences:[{en:"Add error handling to mitigate potential failures.",zh:"添加错误处理以缓解潜在故障。"}] },
  "leverage": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">leverage</span> existing resources",zh:"利用现有资源"},{type:"v.",phrase:"<span class=\"hl\">leverage</span> technology",zh:"利用技术"}], wordFamily:[], synonyms:[{word:"utilize",note:"利用"},{word:"use",note:"使用，更简单"}], extraSentences:[{en:"Leverage cloud services to scale your application.",zh:"利用云服务来扩展你的应用。"}] },
  "validate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">validate</span> input",zh:"验证输入"},{type:"v.",phrase:"<span class=\"hl\">validate</span> data",zh:"验证数据"}], wordFamily:[{word:"validation",pos:"n."},{word:"valid",pos:"adj."}], synonyms:[{word:"check",note:"检查"}], extraSentences:[{en:"Always validate user input on the server side.",zh:"始终在服务端验证用户输入。"}] },
  "enhance": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">enhance</span> performance",zh:"增强性能"},{type:"v.",phrase:"<span class=\"hl\">enhance</span> user experience",zh:"提升用户体验"}], wordFamily:[{word:"enhancement",pos:"n."}], synonyms:[{word:"boost",note:"提升"}], extraSentences:[{en:"The new update enhances security significantly.",zh:"新更新显著增强了安全性。"}] },
  "architecture": { pos:"n.", collocations:[{type:"n.",phrase:"system <span class=\"hl\">architecture</span>",zh:"系统架构"},{type:"adj.",phrase:"microservices <span class=\"hl\">architecture</span>",zh:"微服务架构"}], wordFamily:[{word:"architect",pos:"n."},{word:"architectural",pos:"adj."}], synonyms:[{word:"structure",note:"结构"},{word:"design",note:"设计"}], extraSentences:[{en:"Good architecture makes the system easy to maintain.",zh:"良好的架构使系统易于维护。"}] },
  "repository": { pos:"n.", collocations:[{type:"n.",phrase:"code <span class=\"hl\">repository</span>",zh:"代码仓库"},{type:"v.",phrase:"clone the <span class=\"hl\">repository</span>",zh:"克隆仓库"}], wordFamily:[{word:"repo",pos:"n.",note:"缩写"}], synonyms:[{word:"repo",note:"仓库，缩写/口语"}], extraSentences:[{en:"Clone the repository and follow the setup instructions.",zh:"克隆仓库并按照设置说明操作。"}] },
  "dependency": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">dependency</span> management",zh:"依赖管理"},{type:"v.",phrase:"install <span class=\"hl\">dependencies</span>",zh:"安装依赖"}], wordFamily:[{word:"depend",pos:"v."},{word:"dependent",pos:"adj."}], synonyms:[], extraSentences:[{en:"Run npm install to install all dependencies.",zh:"运行npm install安装所有依赖。"}] },
  "middleware": { pos:"n.", collocations:[{type:"n.",phrase:"authentication <span class=\"hl\">middleware</span>",zh:"认证中间件"},{type:"v.",phrase:"add <span class=\"hl\">middleware</span>",zh:"添加中间件"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Middleware runs between the request and response.",zh:"中间件在请求和响应之间运行。"}] },
  "endpoint": { pos:"n.", collocations:[{type:"n.",phrase:"API <span class=\"hl\">endpoint</span>",zh:"API端点"},{type:"v.",phrase:"call an <span class=\"hl\">endpoint</span>",zh:"调用端点"}], wordFamily:[], synonyms:[{word:"API route",note:"API路由"}], extraSentences:[{en:"The POST endpoint creates a new resource.",zh:"POST端点创建新资源。"}] },
  "payload": { pos:"n.", collocations:[{type:"v.",phrase:"send a <span class=\"hl\">payload</span>",zh:"发送请求数据"},{type:"n.",phrase:"JSON <span class=\"hl\">payload</span>",zh:"JSON数据体"}], wordFamily:[], synonyms:[{word:"data",note:"数据"}], extraSentences:[{en:"Include the authentication token in the request payload.",zh:"在请求数据中包含认证令牌。"}] },
  "cache": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">cache</span> results",zh:"缓存结果"},{type:"n.",phrase:"browser <span class=\"hl\">cache</span>",zh:"浏览器缓存"}], wordFamily:[{word:"caching",pos:"n."}], synonyms:[{word:"store",note:"存储"}], extraSentences:[{en:"Cache frequently accessed data to improve speed.",zh:"缓存频繁访问的数据以提升速度。"}] },
  "async": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">async</span> operation",zh:"异步操作"},{type:"n.",phrase:"<span class=\"hl\">async</span>/await",zh:"异步/等待语法"}], wordFamily:[{word:"asynchronous",pos:"adj."}], synonyms:[], extraSentences:[{en:"Use async functions for non-blocking operations.",zh:"对非阻塞操作使用异步函数。"}] },
  "compile": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">compile</span> code",zh:"编译代码"},{type:"v.",phrase:"<span class=\"hl\">compile</span> from source",zh:"从源码编译"}], wordFamily:[{word:"compiler",pos:"n."},{word:"compilation",pos:"n."}], synonyms:[{word:"build",note:"构建"}], extraSentences:[{en:"The code compiles without errors.",zh:"代码编译无错误。"}] },
  "release": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">release</span> a new version",zh:"发布新版本"},{type:"n.",phrase:"production <span class=\"hl\">release</span>",zh:"生产发布"}], wordFamily:[], synonyms:[{word:"launch",note:"发布"},{word:"deploy",note:"部署"}], extraSentences:[{en:"We're planning a release next month.",zh:"我们计划下个月发布。"}] },
  "merge": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">merge</span> branches",zh:"合并分支"},{type:"v.",phrase:"<span class=\"hl\">merge</span> into main",zh:"合并到主分支"}], wordFamily:[{word:"merger",pos:"n."}], synonyms:[{word:"combine",note:"合并"}], extraSentences:[{en:"Merge your feature branch into main after review.",zh:"审查后将功能分支合并到主分支。"}] },
  "commit": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">commit</span> changes",zh:"提交更改"},{type:"n.",phrase:"<span class=\"hl\">commit</span> message",zh:"提交信息"}], wordFamily:[{word:"commitment",pos:"n.",note:"注意：不同含义"}], synonyms:[], extraSentences:[{en:"Write clear commit messages for better traceability.",zh:"写清晰的提交信息以便更好追踪。"}] },
  "latency": { pos:"n.", collocations:[{type:"adj.",phrase:"low <span class=\"hl\">latency</span>",zh:"低延迟"},{type:"v.",phrase:"reduce <span class=\"hl\">latency</span>",zh:"减少延迟"}], wordFamily:[{word:"latent",pos:"adj."}], synonyms:[{word:"delay",note:"延迟"}], extraSentences:[{en:"CDN helps reduce latency for global users.",zh:"CDN帮助减少全球用户的延迟。"}] },
  "scalability": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">scalability</span> issues",zh:"可扩展性问题"},{type:"v.",phrase:"improve <span class=\"hl\">scalability</span>",zh:"提升可扩展性"}], wordFamily:[{word:"scalable",pos:"adj."},{word:"scale",pos:"v."}], synonyms:[], extraSentences:[{en:"Horizontal scaling improves system scalability.",zh:"水平扩展提升系统可扩展性。"}] },
  "maintainable": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">maintainable</span> code",zh:"可维护代码"},{type:"adv.",phrase:"easily <span class=\"hl\">maintainable</span>",zh:"易于维护的"}], wordFamily:[{word:"maintain",pos:"v."},{word:"maintainability",pos:"n."}], synonyms:[{word:"manageable",note:"可管理的"}], extraSentences:[{en:"Clean code is more maintainable in the long run.",zh:"从长远来看，整洁的代码更易维护。"}] },
  "migration": { pos:"n.", collocations:[{type:"n.",phrase:"database <span class=\"hl\">migration</span>",zh:"数据库迁移"},{type:"v.",phrase:"run <span class=\"hl\">migrations</span>",zh:"执行迁移"}], wordFamily:[{word:"migrate",pos:"v."}], synonyms:[{word:"transition",note:"过渡"}], extraSentences:[{en:"Plan the database migration carefully to avoid data loss.",zh:"仔细规划数据库迁移以避免数据丢失。"}] },
  "rollback": { pos:"n./v.", collocations:[{type:"n.",phrase:"<span class=\"hl\">rollback</span> plan",zh:"回滚计划"},{type:"v.",phrase:"<span class=\"hl\">rollback</span> to previous version",zh:"回滚到之前版本"}], wordFamily:[], synonyms:[{word:"revert",note:"还原"}], extraSentences:[{en:"Always have a rollback plan when deploying to production.",zh:"部署到生产环境时始终要有回滚计划。"}] },
  "monitor": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">monitor</span> performance",zh:"监控性能"},{type:"n.",phrase:"system <span class=\"hl\">monitor</span>",zh:"系统监控"}], wordFamily:[{word:"monitoring",pos:"n."}], synonyms:[{word:"track",note:"追踪"},{word:"watch",note:"监视"}], extraSentences:[{en:"Monitor server metrics to detect issues early.",zh:"监控服务器指标以及早发现问题。"}] },
  "production": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">production</span> environment",zh:"生产环境"},{type:"v.",phrase:"deploy to <span class=\"hl\">production</span>",zh:"部署到生产环境"}], wordFamily:[{word:"produce",pos:"v."},{word:"productive",pos:"adj."}], synonyms:[{word:"live environment",note:"线上环境"}], extraSentences:[{en:"Never test new features directly in production.",zh:"永远不要直接在生产环境测试新功能。"}] },

  // ===== Daily 补充高频词 =====
  "install": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">install</span> an app",zh:"安装应用"},{type:"v.",phrase:"<span class=\"hl\">install</span> updates",zh:"安装更新"}], wordFamily:[{word:"installation",pos:"n."}], synonyms:[{word:"set up",note:"设置"}], extraSentences:[{en:"Install the latest update for better security.",zh:"安装最新更新以获得更好的安全性。"}] },
  "permission": { pos:"n.", collocations:[{type:"v.",phrase:"grant <span class=\"hl\">permission</span>",zh:"授予权限"},{type:"v.",phrase:"request <span class=\"hl\">permission</span>",zh:"请求权限"}], wordFamily:[{word:"permit",pos:"v."}], synonyms:[{word:"access",note:"访问权"}], extraSentences:[{en:"The app needs camera permission to scan QR codes.",zh:"应用需要相机权限才能扫描二维码。"}] },
  "sync": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">sync</span> files",zh:"同步文件"},{type:"v.",phrase:"<span class=\"hl\">sync</span> across devices",zh:"跨设备同步"}], wordFamily:[{word:"synchronize",pos:"v."},{word:"synchronization",pos:"n."}], synonyms:[], extraSentences:[{en:"Your data will sync automatically when online.",zh:"联网时你的数据会自动同步。"}] },
  "backup": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">backup</span> data",zh:"备份数据"},{type:"n.",phrase:"<span class=\"hl\">backup</span> copy",zh:"备份副本"}], wordFamily:[], synonyms:[{word:"copy",note:"副本"}], extraSentences:[{en:"Always backup important files before making changes.",zh:"更改前务必备份重要文件。"}] },
  "preference": { pos:"n.", collocations:[{type:"n.",phrase:"personal <span class=\"hl\">preferences</span>",zh:"个人偏好"},{type:"n.",phrase:"<span class=\"hl\">preference</span> settings",zh:"偏好设置"}], wordFamily:[{word:"prefer",pos:"v."},{word:"preferred",pos:"adj."}], synonyms:[{word:"setting",note:"设置"}], extraSentences:[{en:"Customize the app to match your preferences.",zh:"自定义应用以符合你的偏好。"}] },
  "navigate": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">navigate</span> to",zh:"导航到"},{type:"adv.",phrase:"easily <span class=\"hl\">navigate</span>",zh:"轻松导航"}], wordFamily:[{word:"navigation",pos:"n."},{word:"navigator",pos:"n."}], synonyms:[{word:"go to",note:"去到，口语"}], extraSentences:[{en:"Navigate to Settings > Privacy to change permissions.",zh:"导航到设置 > 隐私来更改权限。"}] },
  "toggle": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">toggle</span> between",zh:"在...之间切换"},{type:"v.",phrase:"<span class=\"hl\">toggle</span> on/off",zh:"开关"}], wordFamily:[], synonyms:[{word:"switch",note:"开关"}], extraSentences:[{en:"Toggle dark mode in the appearance settings.",zh:"在外观设置中切换深色模式。"}] },
  "default": { pos:"n./adj.", collocations:[{type:"n.",phrase:"restore <span class=\"hl\">defaults</span>",zh:"恢复默认"},{type:"adj.",phrase:"<span class=\"hl\">default</span> setting",zh:"默认设置"}], wordFamily:[], synonyms:[{word:"standard",note:"标准的"}], extraSentences:[{en:"Reset to default settings if something goes wrong.",zh:"出问题时重置为默认设置。"}] },
  "upload": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">upload</span> a file",zh:"上传文件"},{type:"v.",phrase:"<span class=\"hl\">upload</span> to the cloud",zh:"上传到云端"}], wordFamily:[{word:"uploader",pos:"n."}], synonyms:[], extraSentences:[{en:"Upload your document to share it with the team.",zh:"上传你的文档与团队分享。"}] },
  "download": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">download</span> an app",zh:"下载应用"},{type:"n.",phrase:"<span class=\"hl\">download</span> speed",zh:"下载速度"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Download the attachment before it expires.",zh:"在附件过期前下载它。"}] },
  "export": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">export</span> data",zh:"导出数据"},{type:"n.",phrase:"<span class=\"hl\">export</span> format",zh:"导出格式"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Export your data as a CSV file for analysis.",zh:"将数据导出为CSV文件进行分析。"}] },
  "import": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">import</span> data",zh:"导入数据"},{type:"v.",phrase:"<span class=\"hl\">import</span> from a file",zh:"从文件导入"}], wordFamily:[{word:"importation",pos:"n."}], synonyms:[], extraSentences:[{en:"Import your contacts from a backup file.",zh:"从备份文件导入联系人。"}] },
  "filter": { pos:"v./n.", collocations:[{type:"v.",phrase:"<span class=\"hl\">filter</span> results",zh:"筛选结果"},{type:"n.",phrase:"search <span class=\"hl\">filter</span>",zh:"搜索筛选器"}], wordFamily:[{word:"filtering",pos:"n."}], synonyms:[{word:"sort",note:"排序（注意：不同含义）"}], extraSentences:[{en:"Filter the list by date to find recent items.",zh:"按日期筛选列表以找到最近的项目。"}] },
  "notification": { pos:"n.", collocations:[{type:"n.",phrase:"push <span class=\"hl\">notification</span>",zh:"推送通知"},{type:"v.",phrase:"enable <span class=\"hl\">notifications</span>",zh:"启用通知"}], wordFamily:[{word:"notify",pos:"v."}], synonyms:[{word:"alert",note:"提醒"}], extraSentences:[{en:"Enable notifications to get study reminders.",zh:"启用通知以获得学习提醒。"}] },
  "privacy": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">privacy</span> policy",zh:"隐私政策"},{type:"n.",phrase:"<span class=\"hl\">privacy</span> settings",zh:"隐私设置"}], wordFamily:[{word:"private",pos:"adj."}], synonyms:[], extraSentences:[{en:"Review the privacy policy before creating an account.",zh:"创建账户前查看隐私政策。"}] },
  "storage": { pos:"n.", collocations:[{type:"n.",phrase:"cloud <span class=\"hl\">storage</span>",zh:"云存储"},{type:"n.",phrase:"<span class=\"hl\">storage</span> space",zh:"存储空间"}], wordFamily:[{word:"store",pos:"v."}], synonyms:[], extraSentences:[{en:"Check your available storage space in settings.",zh:"在设置中检查可用存储空间。"}] },
  "shortcut": { pos:"n.", collocations:[{type:"n.",phrase:"keyboard <span class=\"hl\">shortcut</span>",zh:"键盘快捷键"},{type:"v.",phrase:"use <span class=\"hl\">shortcuts</span>",zh:"使用快捷键"}], wordFamily:[], synonyms:[{word:"hotkey",note:"热键"}], extraSentences:[{en:"Use keyboard shortcuts to work more efficiently.",zh:"使用键盘快捷键更高效地工作。"}] },
  "concept": { pos:"n.", collocations:[{type:"adj.",phrase:"basic <span class=\"hl\">concept</span>",zh:"基本概念"},{type:"v.",phrase:"understand a <span class=\"hl\">concept</span>",zh:"理解概念"}], wordFamily:[{word:"conceptual",pos:"adj."},{word:"conceive",pos:"v."}], synonyms:[{word:"idea",note:"想法"}], extraSentences:[{en:"Let me explain the core concept first.",zh:"让我先解释核心概念。"}] },
  "significant": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">significant</span> improvement",zh:"显著改善"},{type:"adj.",phrase:"<span class=\"hl\">significant</span> difference",zh:"显著差异"}], wordFamily:[{word:"significantly",pos:"adv."},{word:"significance",pos:"n."}], synonyms:[{word:"important",note:"重要的"},{word:"notable",note:"值得注意的"}], extraSentences:[{en:"There's a significant performance improvement in v2.",zh:"v2版本有显著的性能提升。"}] },
  "obvious": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">obvious</span> solution",zh:"明显的解决方案"},{type:"v.",phrase:"seem <span class=\"hl\">obvious</span>",zh:"似乎显而易见"}], wordFamily:[{word:"obviously",pos:"adv."}], synonyms:[{word:"clear",note:"清楚的"},{word:"apparent",note:"明显的"}], extraSentences:[{en:"The cause of the bug was obvious after reading the logs.",zh:"读完日志后bug的原因很明显。"}] },
  "similar": { pos:"adj.", collocations:[{type:"prep.",phrase:"<span class=\"hl\">similar</span> to",zh:"与...相似"},{type:"adv.",phrase:"very <span class=\"hl\">similar</span>",zh:"非常相似"}], wordFamily:[{word:"similarity",pos:"n."},{word:"similarly",pos:"adv."}], synonyms:[{word:"alike",note:"相似的"},{word:"comparable",note:"可比较的"}], extraSentences:[{en:"These two approaches are similar in performance.",zh:"这两种方法在性能上相似。"}] },
  "specific": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">specific</span> requirement",zh:"具体需求"},{type:"v.",phrase:"be more <span class=\"hl\">specific</span>",zh:"更具体一些"}], wordFamily:[{word:"specifically",pos:"adv."},{word:"specify",pos:"v."}], synonyms:[{word:"particular",note:"特定的"},{word:"precise",note:"精确的"}], extraSentences:[{en:"Can you be more specific about the error message?",zh:"你能更具体地说一下错误信息吗？"}] },
  "common": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">common</span> mistake",zh:"常见错误"},{type:"n.",phrase:"in <span class=\"hl\">common</span>",zh:"共同的"}], wordFamily:[{word:"commonly",pos:"adv."}], synonyms:[{word:"usual",note:"通常的"}], extraSentences:[{en:"This is a common mistake for beginners.",zh:"这是初学者常犯的错误。"}] },
  "frequent": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">frequent</span> updates",zh:"频繁更新"},{type:"adj.",phrase:"<span class=\"hl\">frequent</span> errors",zh:"频繁错误"}], wordFamily:[{word:"frequently",pos:"adv."},{word:"frequency",pos:"n."}], synonyms:[{word:"regular",note:"规律的"}], extraSentences:[{en:"Frequent practice leads to better retention.",zh:"频繁练习带来更好的记忆保持。"}] },
  "flexible": { pos:"adj.", collocations:[{type:"adv.",phrase:"highly <span class=\"hl\">flexible</span>",zh:"高度灵活"},{type:"adj.",phrase:"<span class=\"hl\">flexible</span> schedule",zh:"灵活的日程"}], wordFamily:[{word:"flexibility",pos:"n."},{word:"flexibly",pos:"adv."}], synonyms:[{word:"adaptable",note:"适应性强的"}], extraSentences:[{en:"The tool is flexible enough for various use cases.",zh:"这个工具足够灵活以应对各种使用场景。"}] },
  "convenient": { pos:"adj.", collocations:[{type:"adj.",phrase:"<span class=\"hl\">convenient</span> location",zh:"便利位置"},{type:"prep.",phrase:"<span class=\"hl\">convenient</span> for",zh:"对...方便"}], wordFamily:[{word:"convenience",pos:"n."},{word:"conveniently",pos:"adv."}], synonyms:[{word:"handy",note:"方便的，口语"}], extraSentences:[{en:"Mobile apps make learning more convenient.",zh:"移动应用让学习更方便。"}] },
  "available": { pos:"adj.", collocations:[{type:"adv.",phrase:"now <span class=\"hl\">available</span>",zh:"现已可用"},{type:"prep.",phrase:"<span class=\"hl\">available</span> for",zh:"可供...使用"}], wordFamily:[{word:"availability",pos:"n."}], synonyms:[{word:"accessible",note:"可访问的"}], extraSentences:[{en:"The feature is now available on all platforms.",zh:"该功能现已在所有平台上可用。"}] },
  "automatic": { pos:"adj.", collocations:[{type:"adv.",phrase:"fully <span class=\"hl\">automatic</span>",zh:"全自动的"},{type:"adj.",phrase:"<span class=\"hl\">automatic</span> backup",zh:"自动备份"}], wordFamily:[{word:"automatically",pos:"adv."},{word:"automate",pos:"v."}], synonyms:[{word:"automated",note:"自动化的"}], extraSentences:[{en:"The system creates automatic backups every day.",zh:"系统每天自动创建备份。"}] },
  "reduce": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">reduce</span> costs",zh:"减少成本"},{type:"v.",phrase:"<span class=\"hl\">reduce</span> errors",zh:"减少错误"}], wordFamily:[{word:"reduction",pos:"n."}], synonyms:[{word:"decrease",note:"减少"},{word:"minimize",note:"最小化"}], extraSentences:[{en:"Automation reduces the chance of human error.",zh:"自动化减少人为错误的可能性。"}] },
  "avoid": { pos:"v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">avoid</span> mistakes",zh:"避免错误"},{type:"v.",phrase:"<span class=\"hl\">avoid</span> doing",zh:"避免做某事"}], wordFamily:[{word:"avoidance",pos:"n."},{word:"avoidable",pos:"adj."}], synonyms:[{word:"prevent",note:"预防"},{word:"stay away from",note:"远离"}], extraSentences:[{en:"Avoid learning too many new words at once.",zh:"避免一次学太多新词。"}] },
  "progress": { pos:"n./v.", collocations:[{type:"v.",phrase:"make <span class=\"hl\">progress</span>",zh:"取得进展"},{type:"v.",phrase:"track <span class=\"hl\">progress</span>",zh:"追踪进度"}], wordFamily:[{word:"progressive",pos:"adj."}], synonyms:[{word:"advancement",note:"进步"}], extraSentences:[{en:"Track your learning progress with the dashboard.",zh:"用仪表板追踪你的学习进度。"}] },
  "practice": { pos:"n./v.", collocations:[{type:"adj.",phrase:"regular <span class=\"hl\">practice</span>",zh:"规律练习"},{type:"v.",phrase:"<span class=\"hl\">practice</span> daily",zh:"每天练习"}], wordFamily:[{word:"practise",pos:"v.",note:"英式拼写"}], synonyms:[{word:"exercise",note:"练习"}], extraSentences:[{en:"A little practice every day is better than cramming.",zh:"每天一点练习比临时抱佛脚好。"}] },
  "familiar": { pos:"adj.", collocations:[{type:"prep.",phrase:"<span class=\"hl\">familiar</span> with",zh:"熟悉"},{type:"v.",phrase:"look <span class=\"hl\">familiar</span>",zh:"看起来熟悉"}], wordFamily:[{word:"familiarity",pos:"n."},{word:"familiarize",pos:"v."}], synonyms:[{word:"known",note:"已知的"}], extraSentences:[{en:"The word looks familiar but I can't remember the meaning.",zh:"这个词看起来眼熟但我记不住意思。"}] },
  // ===== Git & GitHub 新增词 =====
  "clone": { pos:"v./n.", collocations:[{type:"adv.",phrase:"<span class=\"hl\">clone</span> locally",zh:"克隆到本地"},{type:"prep.",phrase:"<span class=\"hl\">clone</span> from",zh:"从...克隆"}], wordFamily:[], synonyms:[{word:"copy",note:"复制"}], extraSentences:[{en:"Clone the repo and start coding.",zh:"克隆仓库然后开始编码。"}] },
  "fork": { pos:"v./n.", collocations:[{type:"prep.",phrase:"<span class=\"hl\">fork</span> a repo",zh:"派生仓库"},{type:"adv.",phrase:"<span class=\"hl\">fork</span> and modify",zh:"派生并修改"}], wordFamily:[], synonyms:[{word:"branch off",note:"分叉"}], extraSentences:[{en:"Fork the project to contribute changes.",zh:"派生项目以贡献修改。"}] },
  "push": { pos:"v.", collocations:[{type:"adv.",phrase:"<span class=\"hl\">push</span> commits",zh:"推送提交"},{type:"prep.",phrase:"<span class=\"hl\">push</span> to remote",zh:"推送到远程"}], wordFamily:[], synonyms:[{word:"upload",note:"上传"}], extraSentences:[{en:"Push your code before leaving work.",zh:"下班前推送你的代码。"}] },
  "pull": { pos:"v.", collocations:[{type:"adv.",phrase:"<span class=\"hl\">pull</span> latest",zh:"拉取最新"},{type:"n.",phrase:"send a <span class=\"hl\">pull</span> request",zh:"发送拉取请求"}], wordFamily:[], synonyms:[{word:"fetch",note:"获取"}], extraSentences:[{en:"Pull changes to stay up to date.",zh:"拉取变更以保持最新。"}] },
  "issue": { pos:"n.", collocations:[{type:"v.",phrase:"open an <span class=\"hl\">issue</span>",zh:"开一个议题"},{type:"adj.",phrase:"<span class=\"hl\">issue</span> tracker",zh:"议题追踪器"}], wordFamily:[], synonyms:[{word:"ticket",note:"工单"}], extraSentences:[{en:"Report bugs by opening an issue.",zh:"通过开 issue 报告 bug。"}] },
  "stash": { pos:"v./n.", collocations:[{type:"adv.",phrase:"<span class=\"hl\">stash</span> changes",zh:"暂存修改"},{type:"v.",phrase:"<span class=\"hl\">stash</span> pop",zh:"恢复暂存"}], wordFamily:[], synonyms:[{word:"set aside",note:"搁置"}], extraSentences:[{en:"Stash your work before switching tasks.",zh:"切换任务前暂存你的工作。"}] },
  "revert": { pos:"v.", collocations:[{type:"n.",phrase:"<span class=\"hl\">revert</span> commit",zh:"回退提交"},{type:"prep.",phrase:"<span class=\"hl\">revert</span> to previous",zh:"回退到之前"}], wordFamily:[{word:"reversion",pos:"n."}], synonyms:[{word:"undo",note:"撤销"}], extraSentences:[{en:"Revert the commit if it breaks the build.",zh:"如果破坏了构建就回退提交。"}] },
  "contribute": { pos:"v.", collocations:[{type:"prep.",phrase:"<span class=\"hl\">contribute</span> to",zh:"贡献给"},{type:"n.",phrase:"<span class=\"hl\">contribute</span> code",zh:"贡献代码"}], wordFamily:[{word:"contribution",pos:"n."},{word:"contributor",pos:"n."}], synonyms:[{word:"participate",note:"参与"}], extraSentences:[{en:"Anyone can contribute to open source.",zh:"任何人都可以为开源做贡献。"}] },
  "conflict": { pos:"n./v.", collocations:[{type:"adj.",phrase:"merge <span class=\"hl\">conflict</span>",zh:"合并冲突"},{type:"v.",phrase:"<span class=\"hl\">conflict</span> with",zh:"与...冲突"}], wordFamily:[{word:"conflicting",pos:"adj."}], synonyms:[{word:"clash",note:"冲突"}], extraSentences:[{en:"Resolve conflicts before merging.",zh:"合并前解决冲突。"}] },
  "milestone": { pos:"n.", collocations:[{type:"adj.",phrase:"major <span class=\"hl\">milestone</span>",zh:"重要里程碑"},{type:"v.",phrase:"reach a <span class=\"hl\">milestone</span>",zh:"达到里程碑"}], wordFamily:[], synonyms:[{word:"landmark",note:"标志"}], extraSentences:[{en:"v1.0 was a major milestone for the team.",zh:"v1.0 是团队的重要里程碑。"}] },
  // ===== iPhone & iOS 新增词 =====
  "screenshot": { pos:"n./v.", collocations:[{type:"v.",phrase:"take a <span class=\"hl\">screenshot</span>",zh:"截图"},{type:"n.",phrase:"<span class=\"hl\">screenshot</span> tool",zh:"截图工具"}], wordFamily:[], synonyms:[{word:"screen capture",note:"屏幕捕获"}], extraSentences:[{en:"Take a screenshot of the error message.",zh:"截取错误信息的截图。"}] },
  "bluetooth": { pos:"n.", collocations:[{type:"v.",phrase:"turn on <span class=\"hl\">Bluetooth</span>",zh:"打开蓝牙"},{type:"n.",phrase:"<span class=\"hl\">Bluetooth</span> device",zh:"蓝牙设备"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Connect your AirPods via Bluetooth.",zh:"通过蓝牙连接你的 AirPods。"}] },
  "battery": { pos:"n.", collocations:[{type:"adj.",phrase:"low <span class=\"hl\">battery</span>",zh:"低电量"},{type:"v.",phrase:"drain <span class=\"hl\">battery</span>",zh:"耗电"}], wordFamily:[], synonyms:[{word:"power",note:"电源"}], extraSentences:[{en:"Your battery is below 20%.",zh:"你的电量低于 20%。"}] },
  "cellular": { pos:"n./adj.", collocations:[{type:"n.",phrase:"<span class=\"hl\">cellular</span> data",zh:"蜂窝数据"},{type:"n.",phrase:"<span class=\"hl\">cellular</span> plan",zh:"蜂窝套餐"}], wordFamily:[{word:"cell",pos:"n."}], synonyms:[{word:"mobile data",note:"移动数据"}], extraSentences:[{en:"Turn off cellular data to save battery.",zh:"关闭蜂窝数据以省电。"}] },
  "airplane": { pos:"n.", collocations:[{type:"n.",phrase:"<span class=\"hl\">Airplane</span> Mode",zh:"飞行模式"},{type:"n.",phrase:"<span class=\"hl\">airplane</span> ticket",zh:"机票"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Switch to Airplane Mode on flights.",zh:"飞行时切换到飞行模式。"}] },
  "widget": { pos:"n.", collocations:[{type:"v.",phrase:"add a <span class=\"hl\">widget</span>",zh:"添加小组件"},{type:"adj.",phrase:"smart <span class=\"hl\">widget</span>",zh:"智能小组件"}], wordFamily:[], synonyms:[{word:"gadget",note:"小工具"}], extraSentences:[{en:"Add a weather widget to your home screen.",zh:"在主屏幕添加天气小组件。"}] },
  "airdrop": { pos:"n./v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">AirDrop</span> photos",zh:"隔空投送照片"},{type:"prep.",phrase:"<span class=\"hl\">AirDrop</span> to",zh:"投送给"}], wordFamily:[], synonyms:[], extraSentences:[{en:"Use AirDrop to share files between Apple devices.",zh:"用隔空投送在苹果设备间分享文件。"}] },
  "hotspot": { pos:"n.", collocations:[{type:"adj.",phrase:"personal <span class=\"hl\">hotspot</span>",zh:"个人热点"},{type:"v.",phrase:"turn on <span class=\"hl\">hotspot</span>",zh:"开启热点"}], wordFamily:[], synonyms:[{word:"tethering",note:"网络共享"}], extraSentences:[{en:"Use your phone as a hotspot for your laptop.",zh:"用手机给电脑开热点。"}] },
  "tracking": { pos:"n.", collocations:[{type:"n.",phrase:"app <span class=\"hl\">tracking</span>",zh:"应用追踪"},{type:"adj.",phrase:"<span class=\"hl\">tracking</span> permission",zh:"追踪权限"}], wordFamily:[{word:"track",pos:"v."}], synonyms:[{word:"monitoring",note:"监控"}], extraSentences:[{en:"Allow tracking for personalized ads.",zh:"允许追踪以获取个性化广告。"}] },
  "focus": { pos:"n./v.", collocations:[{type:"n.",phrase:"<span class=\"hl\">Focus</span> mode",zh:"专注模式"},{type:"prep.",phrase:"<span class=\"hl\">focus</span> on",zh:"专注于"}], wordFamily:[{word:"focused",pos:"adj."}], synonyms:[{word:"concentrate",note:"集中"}], extraSentences:[{en:"Set up Focus mode to avoid distractions.",zh:"设置专注模式以避免分心。"}] },
  "icloud": { pos:"n.", collocations:[{type:"v.",phrase:"back up to <span class=\"hl\">iCloud</span>",zh:"备份到 iCloud"},{type:"n.",phrase:"<span class=\"hl\">iCloud</span> storage",zh:"iCloud 存储"}], wordFamily:[], synonyms:[{word:"cloud storage",note:"云存储"}], extraSentences:[{en:"Your photos are synced to iCloud.",zh:"你的照片已同步到 iCloud。"}] },
  "facetime": { pos:"n./v.", collocations:[{type:"v.",phrase:"<span class=\"hl\">FaceTime</span> someone",zh:"和某人视频通话"},{type:"n.",phrase:"<span class=\"hl\">FaceTime</span> call",zh:"视频通话"}], wordFamily:[], synonyms:[{word:"video call",note:"视频通话"}], extraSentences:[{en:"Let's FaceTime later tonight.",zh:"今晚晚些视频通话吧。"}] }
};

// ========== 场景化例句（同一词在不同场景的用法对比）==========
const SCENE_LABELS = {
  'ai-prompt':'AI 提示词', 'ai-model':'AI 模型', 'git':'Git', 'devops':'开发部署',
  'ios':'iOS', 'software':'软件', 'travel-air':'航班', 'travel-stay':'酒店'
};

// ========== 跨场景词义（同一词在不同场景的不同释义）==========
// word -> { sceneKey: [释义...] }。释义只在用户选择了对应场景时展示。
const SCENE_WORD_MEANINGS = {
  "checkout": { "git": ["v. 检出（分支/文件）"] },
  "commit": { "devops": ["v. 致力于"], "travel-air": ["v. 致力于"] },
  "branch": { "travel-air": ["n. 分部；分公司"], "devops": ["v. 分流（流水线）"] },
  "tag": { "ai-model": ["v. 标注（词性/标签）"] },
  "menu": { "software": ["n. 菜单（界面）"] },
  "reset": { "software": ["v. 重置（设置）"] },
  "review": { "git": ["v. 审查（代码）"], "travel-stay": ["v. 评价；点评"] },
  "issue": { "devops": ["n. 问题；故障"] },
  "transfer": { "ios": ["v. 转移（数据）"] },
  "exchange": { "software": ["v. 交换（数据）"] },
  "license": { "travel-air": ["n. 执照（驾照）"] },
  "push": { "ios": ["n. 推送（通知）"] },
  "validate": { "travel-air": ["v. 验票"] },
  "approach": { "travel-air": ["n. 进近（着陆）"] }
};

// 内置场景义的快照（用于删除自定义词库时恢复初始状态）
const BUILTIN_SCENE_WORD_MEANINGS = JSON.parse(JSON.stringify(SCENE_WORD_MEANINGS));

// ========== 场景化深度搭配（同一词在其他场景的高频搭配）==========
// word -> { sceneKey: { collocations:[...], extraSentences:[...] } }。
// 仅当用户选择了对应场景时在深度记忆中展示。
const SCENE_DEEP = {
  "checkout": {
    "git": {
      collocations: [
        {type:"v.", phrase:'<span class="hl">checkout</span> a branch', zh:"检出分支"},
        {type:"v.", phrase:'git <span class="hl">checkout</span> .', zh:"检出当前目录更改"}
      ],
      extraSentences: [
        {en:"Checkout the main branch to start working.", zh:"检出主分支开始工作。"},
        {en:"You can checkout a specific commit hash.", zh:"你可以检出某个具体的提交哈希。"}
      ]
    }
  },
  "commit": {
    "devops": {
      collocations: [
        {type:"v.", phrase:'be <span class="hl">committed</span> to', zh:"致力于"},
        {type:"v.", phrase:'<span class="hl">commit</span> to a deadline', zh:"对截止日期作出承诺"}
      ],
      extraSentences: [
        {en:"The team is committed to shipping weekly.", zh:"团队致力于每周发布。"}
      ]
    }
  },
  "review": {
    "git": {
      collocations: [
        {type:"v.", phrase:'<span class="hl">review</span> a pull request', zh:"审查拉取请求"},
        {type:"n.", phrase:'code <span class="hl">review</span>', zh:"代码审查"}
      ],
      extraSentences: [
        {en:"Please review my pull request.", zh:"请审查我的拉取请求。"}
      ]
    }
  }
};
// 内置场景化深度数据的快照（用于清除自定义词库时恢复初始状态）
const BUILTIN_SCENE_DEEP = JSON.parse(JSON.stringify(SCENE_DEEP));
const SCENE_SENTENCES = {
  "context": [
    {cat:'ai-prompt', en:"Provide enough <span class=\"hl\">context</span> for better results.", zh:"提供足够上下文以获得更好结果"},
    {cat:'git', en:"Merge conflicts depend on <span class=\"hl\">context</span> lines.", zh:"合并冲突取决于上下文行"},
    {cat:'software', en:"The app remembers your <span class=\"hl\">context</span> across sessions.", zh:"应用跨会话记住你的上下文"}
  ],
  "generate": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Generate</span> a summary of the article.", zh:"生成文章摘要"},
    {cat:'devops', en:"The build script can <span class=\"hl\">generate</span> API docs.", zh:"构建脚本可以生成 API 文档"},
    {cat:'travel-stay', en:"The system will <span class=\"hl\">generate</span> a booking confirmation.", zh:"系统将生成预订确认"}
  ],
  "draft": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Draft</span> a professional email for me.", zh:"帮我起草一封专业邮件"},
    {cat:'devops', en:"Save your changes as a <span class=\"hl\">draft</span> commit.", zh:"将更改保存为草稿提交"},
    {cat:'travel-stay', en:"I need a <span class=\"hl\">draft</span> of the itinerary.", zh:"我需要一份行程草稿"}
  ],
  "format": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Format</span> the output as a markdown table.", zh:"将输出格式化为 Markdown 表格"},
    {cat:'software', en:"Quick <span class=\"hl\">format</span> erases all data.", zh:"快速格式化会擦除所有数据"},
    {cat:'devops', en:"Use prettier to <span class=\"hl\">format</span> the code.", zh:"用 prettier 格式化代码"}
  ],
  "refine": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Refine</span> the output to be more concise.", zh:"优化输出使其更简洁"},
    {cat:'devops', en:"<span class=\"hl\">Refine</span> the pipeline to reduce latency.", zh:"优化流水线以降低延迟"},
    {cat:'ios', en:"Apple <span class=\"hl\">refined</span> the UI in iOS 18.", zh:"苹果在 iOS 18 中优化了 UI"}
  ],
  "commit": [
    {cat:'git', en:"<span class=\"hl\">Commit</span> your changes with a clear message.", zh:"用清晰的说明提交更改"},
    {cat:'devops', en:"The team is <span class=\"hl\">committed</span> to shipping weekly.", zh:"团队致力于每周发布"},
    {cat:'travel-air', en:"Airlines are <span class=\"hl\">committed</span> to safety.", zh:"航空公司致力于安全"}
  ],
  "merge": [
    {cat:'git', en:"<span class=\"hl\">Merge</span> the feature branch into main.", zh:"将功能分支合并到 main"},
    {cat:'software', en:"<span class=\"hl\">Merge</span> duplicate contacts in one tap.", zh:"一键合并重复联系人"},
    {cat:'travel-stay', en:"The hotel <span class=\"hl\">merged</span> with a rival chain.", zh:"酒店与竞争对手合并了"}
  ],
  "branch": [
    {cat:'git', en:"Create a new <span class=\"hl\">branch</span> for the feature.", zh:"为新功能创建分支"},
    {cat:'travel-air', en:"The airline opened a new <span class=\"hl\">branch</span> in Tokyo.", zh:"航空公司在东京开设了新分部"},
    {cat:'devops', en:"<span class=\"hl\">Branch</span> the pipeline for staging.", zh:"为预发布环境分流流水线"}
  ],
  "push": [
    {cat:'git', en:"<span class=\"hl\">Push</span> the commits to remote.", zh:"将提交推送到远程"},
    {cat:'ios', en:"Enable <span class=\"hl\">push</span> notifications for messages.", zh:"为消息启用推送通知"},
    {cat:'software', en:"Don't <span class=\"hl\">push</span> updates during work hours.", zh:"工作时间不要推送更新"}
  ],
  "release": [
    {cat:'git', en:"Tag the <span class=\"hl\">release</span> with a version number.", zh:"用版本号标记发布"},
    {cat:'devops', en:"The new <span class=\"hl\">release</span> fixes critical bugs.", zh:"新版本修复了关键 bug"},
    {cat:'ios', en:"The app was rejected in <span class=\"hl\">release</span> review.", zh:"应用在发布审核中被拒"}
  ],
  "deploy": [
    {cat:'devops', en:"<span class=\"hl\">Deploy</span> the service to production.", zh:"将服务部署到生产环境"},
    {cat:'ai-model', en:"<span class=\"hl\">Deploy</span> the model as an API endpoint.", zh:"将模型部署为 API 端点"},
    {cat:'software', en:"Auto-<span class=\"hl\">deploy</span> when tests pass.", zh:"测试通过后自动部署"}
  ],
  "validate": [
    {cat:'devops', en:"<span class=\"hl\">Validate</span> the config before deploying.", zh:"部署前验证配置"},
    {cat:'ai-model', en:"<span class=\"hl\">Validate</span> the model on a test set.", zh:"在测试集上验证模型"},
    {cat:'travel-air', en:"Please <span class=\"hl\">validate</span> your ticket at the gate.", zh:"请在登机口验票"}
  ],
  "optimize": [
    {cat:'devops', en:"<span class=\"hl\">Optimize</span> the query for faster results.", zh:"优化查询以加快结果"},
    {cat:'ai-model', en:"<span class=\"hl\">Optimize</span> hyperparameters for accuracy.", zh:"优化超参数以提高准确度"},
    {cat:'ios', en:"<span class=\"hl\">Optimize</span> battery usage in background.", zh:"优化后台电池消耗"}
  ],
  "configure": [
    {cat:'software', en:"<span class=\"hl\">Configure</span> preferences in Settings.", zh:"在设置中配置偏好"},
    {cat:'devops', en:"<span class=\"hl\">Configure</span> the CI pipeline steps.", zh:"配置 CI 流水线步骤"},
    {cat:'ios', en:"<span class=\"hl\">Configure</span> Focus mode for work hours.", zh:"为工作时间配置专注模式"}
  ],
  "monitor": [
    {cat:'devops', en:"<span class=\"hl\">Monitor</span> server health in real-time.", zh:"实时监控服务器健康"},
    {cat:'ai-model', en:"<span class=\"hl\">Monitor</span> model drift in production.", zh:"监控生产中的模型漂移"},
    {cat:'ios', en:"Screen Time <span class=\"hl\">monitors</span> your usage.", zh:"屏幕使用时间监控你的使用"}
  ],
  "update": [
    {cat:'software', en:"<span class=\"hl\">Update</span> the app to the latest version.", zh:"更新应用到最新版本"},
    {cat:'ios', en:"iOS <span class=\"hl\">update</span> available — tap to install.", zh:"有 iOS 更新—点击安装"},
    {cat:'git', en:"<span class=\"hl\">Update</span> the changelog before tagging.", zh:"打标签前更新变更日志"}
  ],
  "access": [
    {cat:'software', en:"Grant <span class=\"hl\">access</span> to your photos.", zh:"授予照片访问权限"},
    {cat:'ios', en:"Use Face ID to <span class=\"hl\">access</span> locked notes.", zh:"用 Face ID 访问锁定笔记"},
    {cat:'travel-stay', en:"Room <span class=\"hl\">access</span> via digital key.", zh:"通过数字钥匙进入房间"}
  ],
  "notification": [
    {cat:'ios', en:"Silence <span class=\"hl\">notifications</span> in Focus mode.", zh:"在专注模式下静音通知"},
    {cat:'devops', en:"Set up <span class=\"hl\">notifications</span> for failed builds.", zh:"为构建失败设置通知"},
    {cat:'travel-air', en:"Enable flight <span class=\"hl\">notifications</span> for gate changes.", zh:"启用登机口变更通知"}
  ],
  "review": [
    {cat:'git', en:"Please <span class=\"hl\">review</span> my pull request.", zh:"请审查我的 PR"},
    {cat:'travel-stay', en:"Leave a <span class=\"hl\">review</span> for the hotel.", zh:"为酒店留下评价"},
    {cat:'ios', en:"The app is pending App Store <span class=\"hl\">review</span>.", zh:"应用正在等待 App Store 审核"}
  ],
  "schedule": [
    {cat:'travel-air', en:"Check the flight <span class=\"hl\">schedule</span> for delays.", zh:"查看航班时刻表是否有延误"},
    {cat:'software', en:"<span class=\"hl\">Schedule</span> backups to run nightly.", zh:"安排每晚运行备份"},
    {cat:'devops', en:"<span class=\"hl\">Schedule</span> the deploy for off-peak hours.", zh:"安排在低峰时段部署"}
  ],
  "recommend": [
    {cat:'travel-stay', en:"Can you <span class=\"hl\">recommend</span> a nearby restaurant?", zh:"能推荐附近的餐厅吗？"},
    {cat:'ai-prompt', en:"The model can <span class=\"hl\">recommend</span> relevant content.", zh:"模型可以推荐相关内容"},
    {cat:'software', en:"The app <span class=\"hl\">recommends</span> actions based on usage.", zh:"应用根据使用推荐操作"}
  ],
  "alternative": [
    {cat:'ai-prompt', en:"Suggest an <span class=\"hl\">alternative</span> approach.", zh:"建议一个替代方案"},
    {cat:'software', en:"Is there an <span class=\"hl\">alternative</span> to Photoshop?", zh:"有 Photoshop 的替代品吗？"},
    {cat:'travel-air', en:"Book an <span class=\"hl\">alternative</span> flight if delayed.", zh:"如果延误就改签替代航班"}
  ],
  "transfer": [
    {cat:'travel-air', en:"Book an airport <span class=\"hl\">transfer</span> in advance.", zh:"提前预订机场接送"},
    {cat:'ios', en:"<span class=\"hl\">Transfer</span> data to your new iPhone.", zh:"将数据转移到新 iPhone"},
    {cat:'devops', en:"<span class=\"hl\">Transfer</span> files via secure SCP.", zh:"通过安全 SCP 传输文件"}
  ],
  "available": [
    {cat:'travel-air', en:"No seats <span class=\"hl\">available</span> on this flight.", zh:"此航班无可用座位"},
    {cat:'software', en:"Storage <span class=\"hl\">available</span>: 32 GB.", zh:"可用存储：32 GB"}
  ],
  "resolve": [
    {cat:'git', en:"<span class=\"hl\">Resolve</span> conflicts before merging.", zh:"合并前解决冲突"},
    {cat:'devops', en:"The team <span class=\"hl\">resolved</span> the incident in 10 min.", zh:"团队 10 分钟内解决了事件"},
    {cat:'travel-stay', en:"The hotel <span class=\"hl\">resolved</span> the complaint quickly.", zh:"酒店迅速解决了投诉"}
  ],
  "template": [
    {cat:'ai-prompt', en:"Use a <span class=\"hl\">template</span> for consistent prompts.", zh:"使用模板保持提示词一致"},
    {cat:'devops', en:"Define a CI <span class=\"hl\">template</span> for reuse.", zh:"定义可复用的 CI 模板"},
    {cat:'software', en:"Start from a project <span class=\"hl\">template</span>.", zh:"从项目模板开始"}
  ],
  "consistent": [
    {cat:'ai-model', en:"Ensure <span class=\"hl\">consistent</span> output across runs.", zh:"确保多次运行输出一致"},
    {cat:'devops', en:"Keep naming <span class=\"hl\">consistent</span> across services.", zh:"跨服务保持命名一致"},
    {cat:'software', en:"The UI feels <span class=\"hl\">consistent</span> on every screen.", zh:"UI 在每个界面都很一致"}
  ],
  "reliable": [
    {cat:'ai-model', en:"GPT-4 is more <span class=\"hl\">reliable</span> for reasoning.", zh:"GPT-4 在推理上更可靠"},
    {cat:'devops', en:"We need a <span class=\"hl\">reliable</span> backup strategy.", zh:"我们需要可靠的备份策略"},
    {cat:'travel-air', en:"Choose a <span class=\"hl\">reliable</span> airline for long trips.", zh:"长途旅行选可靠的航空公司"}
  ],
  "prompt": [
    {cat:'ai-model', en:"The <span class=\"hl\">prompt</span> determines the quality of output.", zh:"提示词决定输出质量"},
    {cat:'software', en:"Click Yes when <span class=\"hl\">prompted</span> by the installer.", zh:"安装程序提示时点击是"},
    {cat:'ios', en:"Siri <span class=\"hl\">prompts</span> you for permission.", zh:"Siri 会提示你授权"}
  ],
  "evaluate": [
    {cat:'ai-model', en:"<span class=\"hl\">Evaluate</span> the model on a held-out set.", zh:"在留出集上评估模型"},
    {cat:'software', en:"Users can <span class=\"hl\">evaluate</span> the app for free.", zh:"用户可以免费试用应用"},
    {cat:'travel-stay', en:"We <span class=\"hl\">evaluated</span> three hotels before booking.", zh:"我们比较了三家酒店后预订"}
  ],
  "enhance": [
    {cat:'software', en:"The update <span class=\"hl\">enhances</span> performance.", zh:"更新提升了性能"},
    {cat:'ai-prompt', en:"Add detail to <span class=\"hl\">enhance</span> the output.", zh:"添加细节以提升输出"},
    {cat:'ios', en:"Night mode <span class=\"hl\">enhances</span> low-light photos.", zh:"夜间模式增强低光照片"}
  ],
  "implement": [
    {cat:'devops', en:"<span class=\"hl\">Implement</span> the API with proper error handling.", zh:"实现 API 并做好错误处理"},
    {cat:'software', en:"They <span class=\"hl\">implemented</span> dark mode in v2.", zh:"他们在 v2 中实现了深色模式"},
    {cat:'ai-model', en:"<span class=\"hl\">Implement</span> the model with PyTorch.", zh:"用 PyTorch 实现模型"}
  ],
  "integrate": [
    {cat:'devops', en:"<span class=\"hl\">Integrate</span> the payment gateway.", zh:"集成支付网关"},
    {cat:'ai-model', en:"<span class=\"hl\">Integrate</span> the model into your app.", zh:"将模型集成到你的应用"},
    {cat:'software', en:"The tools <span class=\"hl\">integrate</span> seamlessly.", zh:"工具间无缝集成"}
  ],
  "build": [
    {cat:'devops', en:"The <span class=\"hl\">build</span> failed on CI.", zh:"CI 构建失败了"},
    {cat:'git', en:"Don't <span class=\"hl\">build</span> on top of a broken branch.", zh:"不要在坏分支上构建"},
    {cat:'software', en:"<span class=\"hl\">Build</span> your own workflow.", zh:"构建你自己的工作流"}
  ],
  "focus": [
    {cat:'ios', en:"<span class=\"hl\">Focus</span> mode silences notifications.", zh:"专注模式静音通知"},
    {cat:'ai-prompt', en:"Keep the <span class=\"hl\">focus</span> on one topic per prompt.", zh:"每个提示词聚焦一个主题"},
    {cat:'devops', en:"<span class=\"hl\">Focus</span> on the critical path first.", zh:"先关注关键路径"}
  ],
  "approach": [
    {cat:'ai-prompt', en:"Try a different <span class=\"hl\">approach</span> to prompting.", zh:"尝试不同的提示方法"},
    {cat:'devops', en:"An iterative <span class=\"hl\">approach</span> reduces risk.", zh:"迭代方法降低风险"},
    {cat:'travel-air', en:"The <span class=\"hl\">approach</span> to the runway was bumpy.", zh:"接近跑道时很颠簸"}
  ],
  "improve": [
    {cat:'ai-model', en:"Fine-tuning can <span class=\"hl\">improve</span> accuracy.", zh:"微调可以提高准确度"},
    {cat:'ios', en:"iOS updates <span class=\"hl\">improve</span> battery life.", zh:"iOS 更新改善电池续航"},
    {cat:'travel-stay', en:"They <span class=\"hl\">improved</span> the breakfast menu.", zh:"他们改善了早餐菜单"}
  ],
  "issue": [
    {cat:'git', en:"File a bug <span class=\"hl\">issue</span> on GitHub.", zh:"在 GitHub 上提交 bug issue"},
    {cat:'travel-air', en:"The boarding <span class=\"hl\">issue</span> was delayed.", zh:"登机牌发放延迟了"},
    {cat:'devops', en:"The production <span class=\"hl\">issue</span> was resolved.", zh:"生产问题已解决"}
  ],
  "tag": [
    {cat:'git', en:"<span class=\"hl\">Tag</span> the release with v1.0.", zh:"用 v1.0 标记发布"},
    {cat:'software', en:"Add a <span class=\"hl\">tag</span> to organize notes.", zh:"添加标签来整理笔记"},
    {cat:'ai-model', en:"POS <span class=\"hl\">tagging</span> labels each word.", zh:"词性标注标记每个词"}
  ],
  "conflict": [
    {cat:'git', en:"Resolve the merge <span class=\"hl\">conflict</span>.", zh:"解决合并冲突"},
    {cat:'travel-stay', en:"A <span class=\"hl\">conflict</span> in booking dates.", zh:"预订日期冲突"},
    {cat:'devops', en:"Port <span class=\"hl\">conflict</span> between two services.", zh:"两个服务间端口冲突"}
  ],
  "exchange": [
    {cat:'travel-stay', en:"The <span class=\"hl\">exchange</span> rate is favorable.", zh:"汇率很划算"},
    {cat:'software', en:"<span class=\"hl\">Exchange</span> data via the API.", zh:"通过 API 交换数据"},
    {cat:'devops', en:"Set up a message <span class=\"hl\">exchange</span>.", zh:"搭建消息交换服务"}
  ],
  "license": [
    {cat:'git', en:"Add a <span class=\"hl\">license</span> file to the repo.", zh:"给仓库添加许可证文件"},
    {cat:'software', en:"Buy a <span class=\"hl\">license</span> to unlock features.", zh:"购买许可证解锁功能"},
    {cat:'travel-air', en:"Check if your driver's <span class=\"hl\">license</span> is valid.", zh:"检查驾照是否有效"}
  ],
  "potential": [
    {cat:'ai-model', en:"The model has <span class=\"hl\">potential</span> for improvement.", zh:"模型还有改进潜力"},
    {cat:'travel-stay', en:"This area has <span class=\"hl\">potential</span> for tourism.", zh:"这个地区有旅游潜力"},
    {cat:'devops', en:"Identify <span class=\"hl\">potential</span> bottlenecks early.", zh:"尽早识别潜在瓶颈"}
  ],
  "clarify": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Clarify</span> your intent in the prompt.", zh:"在提示词中明确你的意图"},
    {cat:'travel-stay', en:"Let me <span class=\"hl\">clarify</span> the check-out time.", zh:"让我确认一下退房时间"},
    {cat:'devops', en:"The docs <span class=\"hl\">clarify</span> the setup steps.", zh:"文档说明了安装步骤"}
  ],
  "scenario": [
    {cat:'ai-prompt', en:"Describe a <span class=\"hl\">scenario</span> for the AI.", zh:"为 AI 描述一个场景"},
    {cat:'devops', en:"Test the worst-case <span class=\"hl\">scenario</span>.", zh:"测试最坏情况"},
    {cat:'travel-air', en:"Plan for a delayed-flight <span class=\"hl\">scenario</span>.", zh:"为航班延误做好预案"}
  ],
  "insight": [
    {cat:'ai-model', en:"The model provides <span class=\"hl\">insights</span> from data.", zh:"模型从数据中提供洞察"},
    {cat:'travel-stay', en:"Reviews offer <span class=\"hl\">insight</span> into the hotel.", zh:"评价提供了酒店的洞察"},
    {cat:'devops', en:"Dashboards give real-time <span class=\"hl\">insights</span>.", zh:"仪表盘提供实时洞察"}
  ],
  "summarize": [
    {cat:'ai-prompt', en:"<span class=\"hl\">Summarize</span> the article in three points.", zh:"用三点总结文章"},
    {cat:'devops', en:"<span class=\"hl\">Summarize</span> the incident report.", zh:"总结事件报告"},
    {cat:'travel-stay', en:"Can you <span class=\"hl\">Summarize</span> the booking policy?", zh:"能总结一下预订政策吗？"}
  ]
};

// ========== 自定义词库（用户导入）==========
const STORAGE_KEY_CUSTOM_WORDS = 'lw_custom_words';
const STORAGE_KEY_CUSTOM_CATS = 'lw_custom_cats';

// 获取自定义词库
function getCustomWords() {
  try {
    const s = Store.getItem(STORAGE_KEY_CUSTOM_WORDS);
    return s ? JSON.parse(s) : [];
  } catch(e) { return []; }
}

// 获取自定义分类
function getCustomCategories() {
  try {
    const s = Store.getItem(STORAGE_KEY_CUSTOM_CATS);
    return s ? JSON.parse(s) : {};
  } catch(e) { return {}; }
}

// 保存自定义词库
function saveCustomWords(words) {
  Store.setItem(STORAGE_KEY_CUSTOM_WORDS, JSON.stringify(words));
}

// 保存自定义分类
function saveCustomCategories(cats) {
  Store.setItem(STORAGE_KEY_CUSTOM_CATS, JSON.stringify(cats));
}

// 自定义词条的场景例句（word -> {cat -> sentence}），供学习时按选中场景展示
const SCENE_SENTENCES_CUSTOM = {};

// 内置分类标识集合（用于清理 SCENE_LABELS 中已删除的自定义分类残留标签）
const BUILTIN_SCENE_KEYS = new Set(['ai-prompt','ai-model','git','devops','ios','software','travel-air','travel-stay']);

// 将自定义词库合入 WORD_BANK（启动或导入后调用）。
// 幂等：先从内置快照重建 WORD_BANK，再逐个合并自定义词条，保证可重复调用、不残留。
// 非破坏：同词同场景取释义并集，同词不同场景并入场景义索引并保留该场景例句，绝不丢弃导入数据。
function mergeCustomWords() {
  const customs = getCustomWords();
  const customCats = getCustomCategories();
  // 合并分类标签前，先清理 SCENE_LABELS 中既不属于内置、也不在自定义词库里的残留标签。
  // 这样删除某分类后，该分类的自定义标签不会残留在气泡/列表中。
  Object.keys(SCENE_LABELS).forEach(k => {
    if (BUILTIN_SCENE_KEYS.has(k)) return;
    if (!customCats[k]) delete SCENE_LABELS[k];
  });
  // 合并分类标签
  Object.assign(SCENE_LABELS, customCats);

  // 1) 重建 WORD_BANK 为内置快照
  WORD_BANK.length = 0;
  BUILTIN_WORD_BANK.forEach(w => WORD_BANK.push({ ...w, meanings: (w.meanings || []).slice() }));

  // 2) 重置场景义索引与场景深度数据为内置快照
  if (typeof SCENE_WORD_MEANINGS !== 'undefined' && SCENE_WORD_MEANINGS) {
    Object.keys(SCENE_WORD_MEANINGS).forEach(k => delete SCENE_WORD_MEANINGS[k]);
    Object.assign(SCENE_WORD_MEANINGS, JSON.parse(JSON.stringify(BUILTIN_SCENE_WORD_MEANINGS)));
  }
  if (typeof SCENE_DEEP !== 'undefined' && SCENE_DEEP) {
    Object.keys(SCENE_DEEP).forEach(k => delete SCENE_DEEP[k]);
    Object.assign(SCENE_DEEP, JSON.parse(JSON.stringify(BUILTIN_SCENE_DEEP)));
  }
  // 3) 清空自定义场景例句索引
  Object.keys(SCENE_SENTENCES_CUSTOM).forEach(k => delete SCENE_SENTENCES_CUSTOM[k]);

  // 4) 逐个合并自定义词条（非破坏）
  customs.forEach(w => {
    const word = w.word;
    const cat = w.category || 'custom';
    const existing = WORD_BANK.find(b => b.word === word);
    if (!existing) {
      // 全新词 → 作为主词条入库
      WORD_BANK.push({
        word: word,
        phonetic: w.phonetic || '',
        meanings: (w.meanings || []).slice(),
        sentence: w.sentence || '',
        category: cat,
        deep: w.deep || null
      });
      // 全新词的主样例也作为主场景例句保留
      if (w.sentence) {
        if (!SCENE_SENTENCES_CUSTOM[word]) SCENE_SENTENCES_CUSTOM[word] = {};
        SCENE_SENTENCES_CUSTOM[word][cat] = w.sentence;
      }
      if (w.deep) mergeDeepEntry(word, cat, w.deep);
      return;
    }
    // 已有词：同词同场景 → 释义取并集保留（不丢弃）
    if ((existing.category || '') === cat) {
      (w.meanings || []).forEach(m => {
        if (existing.meanings.indexOf(m) === -1) existing.meanings.push(m);
      });
      if (!existing.sentence && w.sentence) existing.sentence = w.sentence;
      if (w.deep) mergeDeepEntry(word, cat, w.deep);
      return;
    }
    // 已有词：同词不同场景 → 并入场景义索引，并保留该场景的例句
    if (!SCENE_WORD_MEANINGS[word]) SCENE_WORD_MEANINGS[word] = {};
    if (!SCENE_WORD_MEANINGS[word][cat]) SCENE_WORD_MEANINGS[word][cat] = [];
    (w.meanings || []).forEach(m => {
      if (SCENE_WORD_MEANINGS[word][cat].indexOf(m) === -1) SCENE_WORD_MEANINGS[word][cat].push(m);
    });
    if (w.sentence) {
      if (!SCENE_SENTENCES_CUSTOM[word]) SCENE_SENTENCES_CUSTOM[word] = {};
      SCENE_SENTENCES_CUSTOM[word][cat] = w.sentence;
    }
    if (w.deep) mergeDeepEntry(word, cat, w.deep);
    return;
  });
}

// 将一个词条的场景化深度数据（deep）合并进 SCENE_DEEP[word][scene]
function mergeDeepEntry(word, cat, deep) {
  if (!deep || typeof deep !== 'object') return;
  const collocations = deep.collocations || [];
  const extraSentences = deep.extraSentences || [];
  // 无实际内容时不创建空条目
  if (collocations.length === 0 && extraSentences.length === 0) return;
  if (!SCENE_DEEP[word]) SCENE_DEEP[word] = {};
  if (!SCENE_DEEP[word][cat]) SCENE_DEEP[word][cat] = { collocations: [], extraSentences: [] };
  const target = SCENE_DEEP[word][cat];
  // 合并搭配（按 phrase 去重）
  collocations.forEach(c => {
    if (c && c.phrase && !target.collocations.some(x => x.phrase === c.phrase)) {
      target.collocations.push({ type: c.type || 'v.', phrase: c.phrase, zh: c.zh || '' });
    }
  });
  // 合并场景例句（按 en 去重）
  extraSentences.forEach(s => {
    if (s && s.en && !target.extraSentences.some(x => x.en === s.en)) {
      target.extraSentences.push({ en: s.en, zh: s.zh || '' });
    }
  });
}

// 启动时合并（由 app.js 在 Store.init() 完成后调用，确保持久化数据已加载）
// mergeCustomWords();

// ========== 标准化提示词模板 ==========
const IMPORT_PROMPT_TEMPLATE = `请帮我生成一个英语单词学习词库。

## 目标用户
已掌握高中英语（约3500基础词汇），需要在特定场景的纯英语界面中能看懂文字、知道鼠标点哪里、理解操作反馈。

## 主题
[在这里填写你想要的场景，例如：Photoshop界面、Excel公式、医疗系统、银行App、Figma设计工具、Amazon购物、Netflix等]

## 收录范围（应收尽收，高频优先）
**必须同时收录单词和词组**，真实界面中词组出现频率极高。重点收录以下6类：

1. **界面按钮/菜单项文字**（如 "Sign In"、"Add to Cart"、"Check Out"、"Submit"、"Cancel"、"Apply"）
2. **固定词组和短语动词**（如 "log out"、"turn on"、"set up"、"check in"、"drop-down"、"pop-up"、"drag and drop"）
3. **操作动作词**（如 "align"、"distribute"、"group"、"merge"、"export"、"import"、"undo"、"redo"）
4. **状态提示和反馈文案关键词**（如 "loading"、"error"、"expired"、"pending"、"synchronized"、"up to date"、"out of memory"）
5. **参数、属性、选项名称**（如 "opacity"、"stroke"、"radius"、"font size"、"line height"、"color picker"）
6. **高频术语和缩写**（如 "RGB"、"CMYK"、"DPI"、"API"、"URL"、"PDF"、"JPG"、"CSS"）

## 排除原则（不收录以下词汇）
1. 高中英语已覆盖的基础通用词（如 button, click, open, close, save, file, edit, view, go, get, make, take, good, new 等）
2. 该场景中极少出现的冷僻低频词
3. 通用计算机基础词（如 download, upload, copy, paste, delete, search, select, settings 等已被通用词库覆盖的词）

## 数量要求
应收尽收该场景的所有高频专业词和词组，通常 40-100 个。单词和词组都要收录，宁可多收不要遗漏。

## 多义词与重名处理（重要）
1. 如果某个词在此场景有**与本场景相关的专门含义**，请把该含义作为独立的 meanings 项写入，并与通用含义区分（例如 "check out": ["phr. 结账（购物车）"]）。
2. 如果某个词已是通用高频词（如 transfer、exchange、issue、review），但在此**特定场景**有不同含义，也必须收录，并在 meanings 中给出该场景下的准确释义。
3. 不要因为"这个词可能在其他地方学过"就跳过，只要在此场景含义不同就应收录。

## 场景化深度数据（可选，强烈推荐）
为让该场景的高频词在**深度记忆**中展示更贴合场景的搭配与例句，请为**与当前场景含义紧密相关**的每个词条额外生成一个 \`deep\` 字段。它包含本场景下的高频搭配和真实界面例句，结构与释义、例句并列挂在该词条下。

- **deep 字段规则**：
  1. \`collocations\`：本场景下的高频固定搭配（2-4 个），每个含 \`type\`（词性，如 "v."/"n."/"phr."）、\`phrase\`（搭配英文，用 &lt;span class="hl"&gt;词语&lt;/span&gt; 高亮核心词）、\`zh\`（中文释义）。
  2. \`extraSentences\`：本场景下的真实界面双语例句（1-2 个），每个含 \`en\`（英文）、\`zh\`（中文）。
- **适用范围**：仅对在该场景有专门含义、或在该场景操作中反复出现的高频词提供；普通通用词可省略此字段。
- **示例**（Photoshop 场景下的 "opacity"）：
  \`\`\`json
  {"word":"opacity","phonetic":"/oʊˈpæsəti/","meanings":["n. 不透明度"],"sentence":"Adjust the layer opacity to 50%.","category":"photoshop","deep":{
    "collocations":[{"type":"v.","phrase":"adjust the &lt;span class=&quot;hl&quot;&gt;opacity&lt;/span&gt;","zh":"调整不透明度"},{"type":"n.","phrase":"&lt;span class=&quot;hl&quot;&gt;opacity&lt;/span&gt; slider","zh":"不透明度滑块"}],
    "extraSentences":[{"en":"Lower the layer opacity to blend the image.","zh":"降低图层不透明度以融合图像。"}]
  }}
  \`\`\`

## 输出格式
请严格输出以下 JSON 数组格式，不要包含任何其他文字：

[
  {"word":"单词或词组","phonetic":"/音标/","meanings":["词性. 释义"],"sentence":"英文例句","category":"分类标识"},
  ...
]

## 字段规则
1. **word**: 小写。单个单词直接写（如 "layer"）；词组用空格分隔（如 "sign in"、"add to cart"、"drag and drop"）；复合词用短横线（如 "drop-down"、"check-in"、"carry-on"）；缩写直接写（如 "rgb"、"api"、"pdf"）
2. **phonetic**: 美式音标，用 / / 包裹。词组可不填音标（留空字符串 ""），单词必须填写
3. **meanings**: 每个释义以 "词性. " 开头，如 "n. 图层"、"v. 登录"、"phr. 加入购物车"。词组的词性用 "phr." 标记
4. **sentence**: 必须是包含该词/词组的完整英文例句，必须模拟真实界面或操作语境（如按钮文字、提示文案、菜单路径），不要编造与场景无关的日常例句
5. **category**: 英文短横线格式，如 "photoshop"、"figma"、"medical-sys"、"amazon"
6. 只输出 JSON，不要 markdown 代码块标记，不要任何解释文字

## 示例（以 Photoshop 为主题）
[
  {"word":"layer","phonetic":"/ˈleɪər/","meanings":["n. 图层"],"sentence":"Create a new layer above the background.","category":"photoshop"},
  {"word":"opacity","phonetic":"/oʊˈpæsəti/","meanings":["n. 不透明度"],"sentence":"Adjust the layer opacity to 50%.","category":"photoshop"},
  {"word":"blend mode","phonetic":"","meanings":["phr. 混合模式"],"sentence":"Change the blend mode to Multiply.","category":"photoshop"},
  {"word":"drop-down","phonetic":"","meanings":["n. 下拉菜单"],"sentence":"Select an option from the drop-down menu.","category":"photoshop"},
  {"word":"layer mask","phonetic":"","meanings":["phr. 图层蒙版"],"sentence":"Add a layer mask to hide part of the image.","category":"photoshop"},
  {"word":"stroke","phonetic":"/stroʊk/","meanings":["n. 描边"],"sentence":"Apply a 2px stroke to the shape.","category":"photoshop"},
  {"word":"color picker","phonetic":"","meanings":["phr. 取色器"],"sentence":"Click the swatch to open the color picker.","category":"photoshop"},
  {"word":"rgb","phonetic":"","meanings":["n. RGB色彩模式"],"sentence":"Set the document color mode to RGB.","category":"photoshop"}
]`;
