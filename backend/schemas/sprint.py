from pydantic import BaseModel
from typing import Optional
from enum import Enum


class StoryStatus(str, Enum):
    backlog    = "backlog"
    inprogress = "inprogress"
    review     = "review"
    done       = "done"


class StoryCreate(BaseModel):
    title:    str
    points:   int
    assignee: Optional[str] = None
    status:   StoryStatus = StoryStatus.backlog


class StoryStatusUpdate(BaseModel):
    status: StoryStatus


class StoryResponse(BaseModel):
    id:       int
    title:    str
    points:   int
    assignee: Optional[str] = None
    status:   StoryStatus


class SprintResponse(BaseModel):
    id:            int
    name:          str
    goal:          str
    start_date:    str
    end_date:      str
    total_points:  int
    done_points:   int
    days_remaining: int
    capacity_pct:  int
