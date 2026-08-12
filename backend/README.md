# 轻词 LiteWord 后端

FastAPI + SQLite 实现的账号系统与云同步服务，为轻词 App 提供跨设备数据备份与合并。

## 功能

- 账号系统：注册 / 登录 / JWT 鉴权 / 获取当前用户
- 云同步：学习记录、配置、打卡、词库按 `(类型, 实体)` 做 LWW（Last-Write-Wins，时间戳保留较新一侧）合并，杜绝旧数据覆盖新进度
- SQLite 单文件存储，本地零配置部署

## 快速开始

```bash
# 1. 进入目录
cd backend

# 2. 创建虚拟环境并安装依赖
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# 3. 配置 .env（可选，默认值即可用）
copy .env.example .env   # 至少修改 SECRET_KEY 为随机长字符串

# 4. 启动服务
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

启动后访问接口文档：http://127.0.0.1:8000/docs

## 接口一览

| 方法 | 路径 | 说明 | 鉴权 |
|---|---|---|---|
| POST | /api/auth/register | 注册，返回 Token | 否 |
| POST | /api/auth/login | 登录，返回 Token | 否 |
| GET | /api/auth/me | 当前用户信息 | 是 |
| POST | /api/sync/push | 推送并合并本地数据 | 是 |
| GET | /api/sync/snapshot | 拉取云端数据快照 | 是 |

所有鉴权接口需携带请求头：`Authorization: Bearer <token>`

## 同步协议

客户端把各类数据统一封装为 `SyncItem` 推送：

```json
{
  "items": [
    {
      "data_type": "records",      // config | records | streak | word_banks
      "entity_id": "apple",        // records 用单词作为实体；其余类型用 "main"
      "data": "{\"currentRound\":2,\"learnedScenes\":[\"ai-prompt\"]}",
      "updated_at": 1786459273832, // 客户端毫秒时间戳
      "deleted": false
    }
  ]
}
```

服务端按 `(data_type, entity_id)` 存储，仅当客户端 `updated_at` 严格大于服务端已存时间戳时才覆盖，返回服务端合并后的最新条目。客户端「拉取快照](GET)后，用同样规则在本地合并即可实现多端一致。

## 目录结构

```
backend/
├── app/
│   ├── main.py            # FastAPI 入口、CORS、路由注册
│   ├── config.py          # 配置（.env）
│   ├── database.py        # SQLite + SQLAlchemy 会话
│   ├── models.py          # ORM：users / sync_items
│   ├── schemas.py         # Pydantic 请求响应模型
│   ├── security.py        # PBKDF2 密码散列 + JWT
│   ├── deps.py            # 鉴权依赖
│   ├── routers/
│   │   ├── auth.py        # 注册 / 登录 / me
│   │   └── sync.py        # 推送 / 快照
│   └── services/
│       └── sync_service.py # LWW 合并逻辑
├── requirements.txt
└── run.py                 # 便捷启动脚本
```