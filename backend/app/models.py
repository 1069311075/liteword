"""ORM 模型定义。"""
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)  # 手机号登录标识（可空）
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    sync_items = relationship("SyncItem", back_populates="user", cascade="all, delete-orphan")


class SyncItem(Base):
    """每条待同步数据（按 data_type + entity_id 组织，做 LWW 时间戳合并）。"""

    __tablename__ = "sync_items"
    __table_args__ = (UniqueConstraint("user_id", "data_type", "entity_id", name="uq_user_type_entity"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    data_type = Column(String(32), nullable=False)  # config | records | streak | word_banks
    entity_id = Column(String(200), nullable=False)  # 记录用 word；其余类型用 "main"
    data_json = Column(Text, nullable=False)  # 客户端原始 JSON 字符串
    updated_at = Column(Integer, nullable=False)  # 客户端毫秒时间戳（LWW 依据）
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="sync_items")