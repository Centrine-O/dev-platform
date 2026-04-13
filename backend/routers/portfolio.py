from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.all_models import (
    XpBar as XpBarModel,
    Project as ProjectModel,
    PortfolioAchievement as AchievementModel,
)
from schemas.portfolio import (
    XpBarResponse, XpBarUpdate,
    ProjectCreate, ProjectResponse,
    PortfolioAchievementCreate, PortfolioAchievementResponse,
)

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


# ── XP Bars ───────────────────────────────────────────────────────────────────

@router.get("/xp", response_model=List[XpBarResponse])
def get_xp(db: Session = Depends(get_db)):
    return db.query(XpBarModel).order_by(XpBarModel.id).all()


@router.patch("/xp/{xp_id}", response_model=XpBarResponse)
def update_xp(xp_id: int, body: XpBarUpdate, db: Session = Depends(get_db)):
    xp = db.get(XpBarModel, xp_id)
    if not xp:
        raise HTTPException(status_code=404, detail="XP bar not found")
    xp.pct = max(0, min(100, body.pct))
    if body.level:
        xp.level = body.level
    db.commit()
    db.refresh(xp)
    return xp


# ── Projects ──────────────────────────────────────────────────────────────────

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(ProjectModel).order_by(ProjectModel.created_at).all()


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(body: ProjectCreate, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["tags"] = [t.model_dump() for t in body.tags]
    project = ProjectModel(**data)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(ProjectModel, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


# ── Achievements ──────────────────────────────────────────────────────────────

@router.get("/achievements", response_model=List[PortfolioAchievementResponse])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(AchievementModel).order_by(AchievementModel.created_at).all()


@router.post("/achievements", response_model=PortfolioAchievementResponse, status_code=201)
def create_achievement(body: PortfolioAchievementCreate, db: Session = Depends(get_db)):
    entry = AchievementModel(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/achievements/{achievement_id}", status_code=204)
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    entry = db.get(AchievementModel, achievement_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(entry)
    db.commit()
