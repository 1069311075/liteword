"""云同步路由：推送合并 / 拉取快照。"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..services import sync_service

router = APIRouter(prefix="/api/sync", tags=["sync"])


@router.post("/push", response_model=schemas.SyncSnapshotOut)
def push(payload: schemas.SyncPushIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """客户端推送本地数据，服务端按时间戳合并，返回受影响条目。"""
    items = sync_service.push(db, user, payload)
    return schemas.SyncSnapshotOut(items=items)


@router.get("/snapshot", response_model=schemas.SyncSnapshotOut)
def snapshot(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """客户端拉取该用户全部云端数据快照。"""
    items = sync_service.snapshot(db, user)
    return schemas.SyncSnapshotOut(items=items)