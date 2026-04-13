from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.all_models import Meeting as MeetingModel
from schemas.meeting import MeetingCreate, MeetingResponse

router = APIRouter(prefix="/meetings", tags=["Meetings"])


@router.get("/", response_model=List[MeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    return db.query(MeetingModel).order_by(MeetingModel.created_at.desc()).all()


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(MeetingModel, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("/", response_model=MeetingResponse, status_code=201)
def create_meeting(body: MeetingCreate, db: Session = Depends(get_db)):
    meeting = MeetingModel(**body.model_dump())
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(MeetingModel, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
