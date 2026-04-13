from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.all_models import LogEntry as LogEntryModel
from schemas.log import LogEntryCreate, LogEntryResponse

router = APIRouter(prefix="/log", tags=["Daily Log"])


@router.get("/", response_model=List[LogEntryResponse])
def get_all_entries(db: Session = Depends(get_db)):
    return db.query(LogEntryModel).order_by(LogEntryModel.created_at.desc()).all()


@router.get("/{entry_id}", response_model=LogEntryResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(LogEntryModel, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.post("/", response_model=LogEntryResponse, status_code=201)
def create_entry(body: LogEntryCreate, db: Session = Depends(get_db)):
    entry = LogEntryModel(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(LogEntryModel, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
