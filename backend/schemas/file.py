from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class FileCategory(str, Enum):
    report          = "Report"
    documentation   = "Documentation"
    meeting_minutes = "Meeting minutes"
    specification   = "Specification"
    other           = "Other"


class FileResponse(BaseModel):
    id:         int
    filename:   str
    ext:        str
    category:   FileCategory
    project:    Optional[str] = None
    notes:      Optional[str] = None
    size_bytes: int
    size_label: str
    uploaded_at: datetime
