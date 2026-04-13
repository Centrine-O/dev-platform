from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from models.all_models import RetroCard as RetroCardModel
from schemas.retro import RetroCardCreate, RetroCardResponse

router = APIRouter(prefix="/retros", tags=["Retros"])


@router.get("/", response_model=List[RetroCardResponse])
def get_cards(sprint: Optional[str] = None, column: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(RetroCardModel)
    if sprint:
        q = q.filter(RetroCardModel.sprint == sprint)
    if column:
        q = q.filter(RetroCardModel.column == column)
    return q.order_by(RetroCardModel.created_at).all()


@router.post("/", response_model=RetroCardResponse, status_code=201)
def create_card(body: RetroCardCreate, db: Session = Depends(get_db)):
    card = RetroCardModel(**body.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    card = db.get(RetroCardModel, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
