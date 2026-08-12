"""数据库连接与会话管理（SQLite + SQLAlchemy）。"""
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

settings = get_settings()

# SQLite 需要 check_same_thread=False 以便 FastAPI 多线程访问
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


def get_db():
    """FastAPI 依赖：提供数据库会话，请求结束后自动关闭。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """建表（幂等）+ 轻量迁移（兼容已有库新增字段）。"""
    from . import models  # noqa: F401  确保模型已注册
    Base.metadata.create_all(bind=engine)
    migrate_phone_column()


def migrate_phone_column():
    """为已存在的 users 表补充 phone 列（SQLite 无 ALTER 多列，逐列判断）。"""
    try:
        insp = inspect(engine)
        if "users" not in insp.get_table_names():
            return
        cols = {c["name"] for c in insp.get_columns("users")}
        if "phone" not in cols:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))
    except Exception:
        # 迁移失败不阻塞启动，下次启动重试
        pass