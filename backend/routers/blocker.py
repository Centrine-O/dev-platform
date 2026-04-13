from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from core.database import get_db
from models.all_models import Blocker as BlockerModel
from schemas.blocker import BlockerCreate, BlockerResolve, BlockerResponse

router = APIRouter(prefix="/blockers", tags=["Blockers"])


@router.get("/", response_model=List[BlockerResponse])
def get_blockers(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(BlockerModel)
    if status:
        q = q.filter(BlockerModel.status == status)
    return q.order_by(BlockerModel.created_at.desc()).all()


@router.get("/{blocker_id}", response_model=BlockerResponse)
def get_blocker(blocker_id: int, db: Session = Depends(get_db)):
    blocker = db.get(BlockerModel, blocker_id)
    if not blocker:
        raise HTTPException(status_code=404, detail="Blocker not found")
    return blocker


@router.post("/", response_model=BlockerResponse, status_code=201)
def create_blocker(body: BlockerCreate, db: Session = Depends(get_db)):
    blocker = BlockerModel(**body.model_dump())
    db.add(blocker)
    db.commit()
    db.refresh(blocker)
    return blocker


@router.patch("/{blocker_id}/resolve", response_model=BlockerResponse)
def resolve_blocker(blocker_id: int, body: BlockerResolve, db: Session = Depends(get_db)):
    blocker = db.get(BlockerModel, blocker_id)
    if not blocker:
        raise HTTPException(status_code=404, detail="Blocker not found")
    if blocker.status == "resolved":
        raise HTTPException(status_code=400, detail="Blocker is already resolved")
    blocker.status        = "resolved"
    blocker.resolved_note = body.resolved_note
    blocker.resolved_at   = datetime.now()
    db.commit()
    db.refresh(blocker)
    return blocker


@router.delete("/{blocker_id}", status_code=204)
def delete_blocker(blocker_id: int, db: Session = Depends(get_db)):
    blocker = db.get(BlockerModel, blocker_id)
    if not blocker:
        raise HTTPException(status_code=404, detail="Blocker not found")
    db.delete(blocker)
    db.commit()
