"""云同步服务：按 (data_type, entity_id) 做 LWW（Last-Write-Wins）时间戳合并。"""
from sqlalchemy.orm import Session

from .. import schemas
from ..models import SyncItem, User
from ..schemas import SyncItemOut


def _fetch(db: Session, user_id: int, data_type: str, entity_id: str) -> SyncItem | None:
    return (
        db.query(SyncItem)
        .filter(
            SyncItem.user_id == user_id,
            SyncItem.data_type == data_type,
            SyncItem.entity_id == entity_id,
        )
        .first()
    )


def upsert(db: Session, user: User, item: schemas.SyncItemIn) -> SyncItem:
    """按时间戳合并单条数据：新数据更新于既有数据时才覆盖。"""
    existing = _fetch(db, user.id, item.data_type, item.entity_id)
    if existing is not None and existing.updated_at >= item.updated_at:
        return existing  # 服务端数据更新，忽略过期客户端数据
    if existing is None:
        existing = SyncItem(
            user_id=user.id,
            data_type=item.data_type,
            entity_id=item.entity_id,
            data_json=item.data,
            updated_at=item.updated_at,
            deleted=item.deleted,
        )
        db.add(existing)
    else:
        existing.data_json = item.data
        existing.updated_at = item.updated_at
        existing.deleted = item.deleted
    return existing


def push(db: Session, user: User, payload: schemas.SyncPushIn) -> list[SyncItemOut]:
    """批量推送并合并，返回合并后受影响条目。"""
    out: list[SyncItemOut] = []
    for item in payload.items:
        stored = upsert(db, user, item)
        out.append(SyncItemOut(
            data_type=stored.data_type, entity_id=stored.entity_id,
            data=stored.data_json, updated_at=stored.updated_at, deleted=stored.deleted,
        ))
    db.commit()
    return out


def snapshot(db: Session, user: User) -> list[SyncItemOut]:
    """拉取该用户的全部云端数据快照。"""
    rows = db.query(SyncItem).filter(SyncItem.user_id == user.id).all()
    return [SyncItemOut(
        data_type=r.data_type, entity_id=r.entity_id,
        data=r.data_json, updated_at=r.updated_at, deleted=r.deleted,
    ) for r in rows]