from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from schemas.goal import (
    GoalCreate,
    GoalToggle,
    GoalResponse,
    AchievementCreate,
    AchievementResponse,
)

router = APIRouter(prefix="/goals", tags=["Goals & Achievements"])

_goals: List[dict] = [
    { "id": 1, "label": "Run first sprint planning session",  "type": "goal", "done": True,  "due_date": None,       "created_at": datetime(2025, 3, 28) },
    { "id": 2, "label": "1-on-1s with all team members",      "type": "goal", "done": True,  "due_date": None,       "created_at": datetime(2025, 3, 29) },
    { "id": 3, "label": "Onboard team to Scrum ceremonies",   "type": "goal", "done": True,  "due_date": None,       "created_at": datetime(2025, 3, 30) },
    { "id": 4, "label": "Build Dev Life OS MVP",              "type": "goal", "done": True,  "due_date": None,       "created_at": datetime(2025, 4,  1) },
    { "id": 5, "label": "Enrol in PSM I certification",       "type": "goal", "done": False, "due_date": "Apr 15",   "created_at": datetime(2025, 4,  1) },
    { "id": 6, "label": "Deliver Sprint 1 successfully",      "type": "goal", "done": False, "due_date": "Apr 10",   "created_at": datetime(2025, 4,  1) },
    { "id": 7, "label": "Write Scrum process wiki for team",  "type": "goal", "done": False, "due_date": "Apr 30",   "created_at": datetime(2025, 4,  1) },
]
_next_goal_id = 8

_achievements: List[dict] = [
    { "id": 1, "title": "Appointed first Scrum Master in the organisation",  "created_at": datetime(2025, 4, 1) },
    { "id": 2, "title": "Onboarded team from 0 to first sprint in 5 days",   "created_at": datetime(2025, 3, 28) },
    { "id": 3, "title": "Resolved 2 blockers within 24h of being raised",    "created_at": datetime(2025, 3, 29) },
    { "id": 4, "title": "Launched Dev Life OS platform",                      "created_at": datetime(2025, 4, 1) },
]
_next_achievement_id = 5


# ── GOALS ──

@router.get("/", response_model=List[GoalResponse])
def get_goals(done: bool = None):
    """Return all goals. Filter by ?done=true or ?done=false."""
    if done is not None:
        return [g for g in _goals if g["done"] == done]
    return _goals


@router.post("/", response_model=GoalResponse, status_code=201)
def create_goal(body: GoalCreate):
    """Add a new goal."""
    global _next_goal_id
    goal = {
        "id": _next_goal_id,
        **body.model_dump(),
        "done": False,
        "created_at": datetime.now(),
    }
    _goals.append(goal)
    _next_goal_id += 1
    return goal


@router.patch("/{goal_id}/toggle", response_model=GoalResponse)
def toggle_goal(goal_id: int, body: GoalToggle):
    """Mark a goal as done or not done."""
    for g in _goals:
        if g["id"] == goal_id:
            g["done"] = body.done
            return g
    raise HTTPException(status_code=404, detail="Goal not found")


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int):
    """Remove a goal."""
    global _goals
    before = len(_goals)
    _goals = [g for g in _goals if g["id"] != goal_id]
    if len(_goals) == before:
        raise HTTPException(status_code=404, detail="Goal not found")


# ── ACHIEVEMENTS ──

@router.get("/achievements", response_model=List[AchievementResponse])
def get_achievements():
    """Return all achievements, newest first."""
    return sorted(_achievements, key=lambda a: a["created_at"], reverse=True)


@router.post("/achievements", response_model=AchievementResponse, status_code=201)
def create_achievement(body: AchievementCreate):
    """Log a new achievement."""
    global _next_achievement_id
    achievement = {
        "id": _next_achievement_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _achievements.append(achievement)
    _next_achievement_id += 1
    return achievement


@router.delete("/achievements/{achievement_id}", status_code=204)
def delete_achievement(achievement_id: int):
    """Remove an achievement."""
    global _achievements
    before = len(_achievements)
    _achievements = [a for a in _achievements if a["id"] != achievement_id]
    if len(_achievements) == before:
        raise HTTPException(status_code=404, detail="Achievement not found")
