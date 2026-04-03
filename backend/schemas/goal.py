from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class GoalType(str, Enum):
    goal        = "goal"
    achievement = "achievement"


class GoalCreate(BaseModel):
    label:     str
    type:      GoalType = GoalType.goal
    due_date:  Optional[str] = None


class GoalToggle(BaseModel):
    done: bool


class GoalResponse(BaseModel):
    id:         int
    label:      str
    type:       GoalType
    done:       bool
    due_date:   Optional[str] = None
    created_at: datetime


class AchievementCreate(BaseModel):
    title: str


class AchievementResponse(BaseModel):
    id:         int
    title:      str
    created_at: datetime
