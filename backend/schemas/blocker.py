from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class Severity(str, Enum):
    high = "High"
    med  = "Med"
    low  = "Low"


class BlockerStatus(str, Enum):
    active   = "active"
    resolved = "resolved"


class BlockerCreate(BaseModel):
    title:    str
    severity: Severity
    owner:    Optional[str] = None
    impact:   Optional[str] = None


class BlockerResolve(BaseModel):
    resolved_note: Optional[str] = None


class BlockerResponse(BaseModel):
    id:            int
    title:         str
    severity:      Severity
    status:        BlockerStatus
    owner:         Optional[str] = None
    impact:        Optional[str] = None
    resolved_note: Optional[str] = None
    created_at:    datetime
    resolved_at:   Optional[datetime] = None
