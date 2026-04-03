from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class ActivityType(str, Enum):
    dev        = "Dev work"
    ceremony   = "Scrum ceremony"
    meeting    = "Meeting"
    docs       = "Documentation"
    planning   = "Planning"
    report     = "Report"
    other      = "Other"


# What the client sends when creating a log entry
class LogEntryCreate(BaseModel):
    title:    str
    type:     ActivityType
    duration: Optional[str] = None
    tags:     Optional[str] = None
    notes:    Optional[str] = None


# What the API sends back (includes id and timestamp)
class LogEntryResponse(BaseModel):
    id:        int
    title:     str
    type:      ActivityType
    duration:  Optional[str] = None
    tags:      Optional[str] = None
    notes:     Optional[str] = None
    created_at: datetime
