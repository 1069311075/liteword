"""用户鉴权路由：注册 / 登录 / 当前用户 / 手机号验证码。"""
import random
import re
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

# 模拟短信验证码（内存存储）：phone -> {"code": str, "expires": 毫秒时间戳}
_SMS_TTL_MS = 5 * 60 * 1000  # 5 分钟有效
_sms_codes: dict[str, dict] = {}

_PHONE_RE = re.compile(r"^1\d{10}$")


def _gen_code() -> str:
    return f"{random.randint(0, 999999):06d}"


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "用户名已存在")
    user = User(username=payload.username, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return schemas.Token(access_token=create_access_token(user.id, user.username))


@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "用户名或密码错误")
    return schemas.Token(access_token=create_access_token(user.id, user.username))


@router.post("/sms/send", response_model=schemas.SmsSendOut)
def send_sms_code(payload: schemas.SmsSendIn):
    """模拟发送短信验证码：生成验证码存内存，5 分钟有效。

    演示模式：直接把验证码放在 devCode 字段返回，方便自媒体演示时自动填入。
    """
    if not _PHONE_RE.match(payload.phone):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "手机号格式不正确")
    # 简单限流：同一手机号 60 秒内只能发一次
    now = time.time() * 1000
    prev = _sms_codes.get(payload.phone)
    if prev and now - (prev.get("sent_at") or 0) < 60_000:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "发送过于频繁，请稍后再试")
    code = _gen_code()
    _sms_codes[payload.phone] = {"code": code, "expires": now + _SMS_TTL_MS, "sent_at": now}
    # 真实生产环境这里应调用短信服务商把 code 发给用户，且绝不返回 devCode
    return schemas.SmsSendOut(success=True, devCode=code)


@router.post("/sms/login", response_model=schemas.Token)
def sms_login(payload: schemas.SmsLoginIn, db: Session = Depends(get_db)) -> schemas.Token:
    """手机号 + 验证码登录；验证通过后若该手机号未注册则自动注册（一键登录）。"""
    if not _PHONE_RE.match(payload.phone):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "手机号格式不正确")
    rec = _sms_codes.get(payload.phone)
    now = time.time() * 1000
    if rec is None or not _safe_equals(rec["code"], payload.code) or now > rec["expires"]:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "验证码错误或已过期")
    # 验证通过后作废该验证码，防止重放
    _sms_codes.pop(payload.phone, None)

    user = db.query(User).filter(User.phone == payload.phone).first()
    if user is None:
        # 自动注册：username 用手机号兜底，密码用随机值（不走密码登录）
        user = User(
            username=payload.phone,
            phone=payload.phone,
            password_hash=hash_password(_gen_code() + str(now)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return schemas.Token(access_token=create_access_token(user.id, user.username))


def _safe_equals(a: str, b: str) -> bool:
    import hmac

    return hmac.compare_digest(a.encode("utf-8"), b.encode("utf-8"))


@router.get("/me", response_model=schemas.UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.delete("/account", response_model=schemas.Message)
def delete_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """注销账号：永久删除该用户及其云端同步数据（级联删除 SyncItem）。

    仅删除云端数据，客户端本地数据由调用方自行清理。
    """
    db.delete(user)  # cascade="all, delete-orphan" 会一并删除其 sync_items
    db.commit()
    return schemas.Message(detail="账号已注销")