from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.all_models import (
    Skill as SkillModel,
    Cert as CertModel,
    GrowthFeedback as FeedbackModel,
    Reflection as ReflectionModel,
)
from schemas.growth import (
    SkillResponse, SkillUpdate,
    CertResponse,
    FeedbackCreate, FeedbackResponse,
    ReflectionCreate, ReflectionResponse,
)

router = APIRouter(prefix="/growth", tags=["Growth"])


# ── Skills ────────────────────────────────────────────────────────────────────

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(SkillModel).order_by(SkillModel.id).all()


@router.patch("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, body: SkillUpdate, db: Session = Depends(get_db)):
    skill = db.get(SkillModel, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.pct = max(0, min(100, body.pct))
    db.commit()
    db.refresh(skill)
    return skill


# ── Certs ─────────────────────────────────────────────────────────────────────

@router.get("/certs", response_model=List[CertResponse])
def get_certs(db: Session = Depends(get_db)):
    return db.query(CertModel).order_by(CertModel.id).all()


@router.patch("/certs/{cert_id}/toggle", response_model=CertResponse)
def toggle_cert(cert_id: int, db: Session = Depends(get_db)):
    cert = db.get(CertModel, cert_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Cert not found")
    cert.done = not cert.done
    db.commit()
    db.refresh(cert)
    return cert


# ── Feedback ──────────────────────────────────────────────────────────────────

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_feedback(db: Session = Depends(get_db)):
    return db.query(FeedbackModel).order_by(FeedbackModel.created_at.desc()).all()


@router.post("/feedback", response_model=FeedbackResponse, status_code=201)
def add_feedback(body: FeedbackCreate, db: Session = Depends(get_db)):
    entry = FeedbackModel(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/feedback/{feedback_id}", status_code=204)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    entry = db.get(FeedbackModel, feedback_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(entry)
    db.commit()


# ── Reflections ───────────────────────────────────────────────────────────────

@router.get("/reflections", response_model=List[ReflectionResponse])
def get_reflections(db: Session = Depends(get_db)):
    return db.query(ReflectionModel).order_by(ReflectionModel.created_at.desc()).all()


@router.post("/reflections", response_model=ReflectionResponse, status_code=201)
def add_reflection(body: ReflectionCreate, db: Session = Depends(get_db)):
    entry = ReflectionModel(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
