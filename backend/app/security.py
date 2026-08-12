"""安全工具：PBKDF2 密码散列 + JWT 签发/校验。"""
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt

from .config import get_settings

ALGORITHM = "HS256"
_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    """使用 PBKDF2-HMAC-SHA256 生成 {salt}${hash}。"""
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _ITERATIONS)
    return f"{salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, hash_hex = stored.split("$", 1)
        salt = bytes.fromhex(salt_hex)
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _ITERATIONS)
        return hmac.compare_digest(dk.hex(), hash_hex)
    except Exception:
        return False


def create_access_token(user_id: int, username: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(user_id), "username": username, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None