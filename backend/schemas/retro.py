from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RetroCardCreate(BaseModel):
    text:    str
    column:  str   # "went-well" | "improve" | "actions"
    sprint:  Optional[str] = None


class RetroCardResponse(BaseModel):
    id:         int
    text:       str
    column:     str
    sprint:     Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
