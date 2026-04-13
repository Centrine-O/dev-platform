from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TagItem(BaseModel):
    label: str
    cls:   str


class XpBarResponse(BaseModel):
    id:    int
    label: str
    level: str
    pct:   int

    model_config = {"from_attributes": True}


class XpBarUpdate(BaseModel):
    pct:   int
    level: Optional[str] = None


class ProjectCreate(BaseModel):
    title:        str
    role:         str
    desc:         str
    tags:         List[TagItem] = []
    banner_color: str = "#5b4fcf"
    period:       str = ""
    impact:       str = ""


class ProjectResponse(BaseModel):
    id:           int
    title:        str
    role:         str
    desc:         str
    tags:         List[TagItem]
    banner_color: str
    period:       str
    impact:       str
    created_at:   datetime

    model_config = {"from_attributes": True}


class PortfolioAchievementCreate(BaseModel):
    title:     str
    desc:      str
    bar_color: str = "#5b4fcf"


class PortfolioAchievementResponse(BaseModel):
    id:         int
    title:      str
    desc:       str
    bar_color:  str
    created_at: datetime

    model_config = {"from_attributes": True}
