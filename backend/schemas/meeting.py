from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class MeetingType(str, Enum):
    standup     = "Daily standup"
    planning    = "Sprint planning"
    refinement  = "Backlog refinement"
    review      = "Sprint review"
    retro       = "Retrospective"
    stakeholder = "Stakeholder"
    one_on_one  = "1-on-1"
    other       = "Other"


class MeetingCreate(BaseModel):
    title:       str
    date:        str
    duration:    Optional[str] = None
    type:        MeetingType
    attendees:   Optional[str] = None
    key_points:  str
    action_items: Optional[str] = None


class MeetingResponse(BaseModel):
    id:           int
    title:        str
    date:         str
    duration:     Optional[str] = None
    type:         MeetingType
    attendees:    Optional[str] = None
    key_points:   str
    action_items: Optional[str] = None
    created_at:   datetime
