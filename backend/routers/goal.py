from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.all_models import Goal as GoalModel, GoalAchievement as AchievementModel
from schemas.goal import GoalCreate, GoalToggle, GoalResponse, AchievementCreate, AchievementResponse

router = APIRouter(prefix="/goals", tags=["Goals & Achievements"])


@router.get("/", response_model=List[GoalResponse])
def get_goals(db: Session = Depends(get_db)):
    return db.query(GoalModel).order_by(GoalModel.created_at).all()


@router.post("/", response_model=GoalResponse, status_code=201)
def create_goal(body: GoalCreate, db: Session = Depends(get_db)):
    goal = GoalModel(**body.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/{goal_id}/toggle", response_model=GoalResponse)
def toggle_goal(goal_id: int, body: GoalToggle, db: Session = Depends(get_db)):
    goal = db.get(GoalModel, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.done = body.done
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.get(GoalModel, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()


@router.get("/achievements", response_model=List[AchievementResponse])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(AchievementModel).order_by(AchievementModel.created_at.desc()).all()


@router.post("/achievements", response_model=AchievementResponse, status_code=201)
def create_achievement(body: AchievementCreate, db: Session = Depends(get_db)):
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
