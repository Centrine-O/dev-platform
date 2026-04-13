from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkillResponse(BaseModel):
    id:   int
    name: str
    pct:  int

    model_config = {"from_attributes": True}


class SkillUpdate(BaseModel):
    pct: int


class CertResponse(BaseModel):
    id:       int
    label:    str
    done:     bool
    due_date: Optional[str] = None

    model_config = {"from_attributes": True}


class FeedbackCreate(BaseModel):
    text:   str
    author: str   # "from" is a Python keyword — using author


class FeedbackResponse(BaseModel):
    id:         int
    text:       str
    author:     str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReflectionCreate(BaseModel):
    text: str


class ReflectionResponse(BaseModel):
    id:         int
    text:       str
    created_at: datetime

    model_config = {"from_attributes": True}
