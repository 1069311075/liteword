"""请求/响应 Pydantic 模型。"""
from datetime import datetime

from pydantic import BaseModel, Field


# ---------- 用户 / 鉴权 ----------
class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=64)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    username: str
    password: str


class SmsSendIn(BaseModel):
    phone: str = Field(min_length=11, max_length=11)


class SmsLoginIn(BaseModel):
    phone: str = Field(min_length=11, max_length=11)
    code: str = Field(min_length=4, max_length=8)


class SmsSendOut(BaseModel):
    success: bool
    devCode: str | None = None  # 模拟模式：直接把验证码返回给客户端，便于演示


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- 云同步 ----------
class SyncItemIn(BaseModel):
    data_type: str = Field(pattern="^(config|records|streak|word_banks)$")
    entity_id: str = Field(default="main", max_length=200)
    data: str = Field(description="JSON 字符串")
    updated_at: int = Field(description="客户端毫秒时间戳")
    deleted: bool = False


class SyncPushIn(BaseModel):
    items: list[SyncItemIn]


class SyncItemOut(BaseModel):
    data_type: str
    entity_id: str
    data: str
    updated_at: int
    deleted: bool


class SyncSnapshotOut(BaseModel):
    items: list[SyncItemOut]


class Message(BaseModel):
    detail: str