from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from schemas.portfolio import (
    XpBarResponse, XpBarUpdate,
    ProjectCreate, ProjectResponse,
    PortfolioAchievementCreate, PortfolioAchievementResponse,
)

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

# ── In-memory stores ─────────────────────────────────────────────────────────

_xp_bars: List[dict] = [
    { "id": 1, "label": "Full-stack development",   "level": "Mid",     "pct": 65 },
    { "id": 2, "label": "Scrum / Agile delivery",   "level": "Growing", "pct": 55 },
    { "id": 3, "label": "Technical documentation",  "level": "Strong",  "pct": 75 },
    { "id": 4, "label": "API design & integration", "level": "Mid",     "pct": 60 },
]

_projects: List[dict] = [
    {
        "id": 1,
        "title": "Dev Life OS",
        "role":  "Solo developer · Full-stack",
        "desc":  "Personal developer platform to track daily work, sprint progress, meetings, goals, and growth. Audit-ready evidence trail for professional reviews.",
        "tags":  [
            { "label": "Next.js",  "cls": "tag-blue" },
            { "label": "Python",   "cls": "tag-amber" },
            { "label": "FastAPI",  "cls": "tag-green" },
            { "label": "Pure CSS", "cls": "tag-default" },
        ],
        "banner_color": "#5b4fcf",
        "period":       "Apr 2025 – ongoing",
        "impact":       "Self-owned platform",
        "created_at":   datetime(2025, 4, 1, 12, 0),
    },
    {
        "id": 2,
        "title": "Auth & User Profile Module",
        "role":  "Developer · Sprint 1",
        "desc":  "Built the full auth flow — login, registration, session management — and user profile persistence for the team project. Delivered on time within Sprint 1.",
        "tags":  [
            { "label": "Backend", "cls": "tag-blue" },
            { "label": "Auth",    "cls": "tag-purple" },
            { "label": "API",     "cls": "tag-default" },
        ],
        "banner_color": "#1d4ed8",
        "period":       "Apr 1 – Apr 10, 2025",
        "impact":       "Sprint 1 core deliverable",
        "created_at":   datetime(2025, 4, 1, 12, 1),
    },
    {
        "id": 3,
        "title": "Scrum Process Implementation",
        "role":  "Scrum Master · First SM in org",
        "desc":  "Designed and introduced Scrum ceremonies, board structure, and team norms from scratch. Onboarded a team of 5 from zero Agile experience to first sprint in 5 days.",
        "tags":  [
            { "label": "Scrum",        "cls": "tag-purple" },
            { "label": "Facilitation", "cls": "tag-green" },
            { "label": "Team lead",    "cls": "tag-amber" },
        ],
        "banner_color": "#1e7a4e",
        "period":       "Mar 2025 – ongoing",
        "impact":       "Team velocity ↑ sprint over sprint",
        "created_at":   datetime(2025, 4, 1, 12, 2),
    },
]

_achievements: List[dict] = [
    {
        "id": 1,
        "title":     "First Scrum Master in the organisation",
        "desc":      "Introduced Agile from scratch — no playbook, no precedent.",
        "bar_color": "#5b4fcf",
        "created_at": datetime(2025, 4, 1, 12, 0),
    },
    {
        "id": 2,
        "title":     "Shipped Auth module in Sprint 1",
        "desc":      "POST /login, token handling, and session management — all merged to dev branch.",
        "bar_color": "#1d4ed8",
        "created_at": datetime(2025, 4, 1, 12, 1),
    },
    {
        "id": 3,
        "title":     "Zero missed sprint ceremonies in first sprint",
        "desc":      "100% standup attendance, planning, refinement, and retro held on schedule.",
        "bar_color": "#1e7a4e",
        "created_at": datetime(2025, 4, 1, 12, 2),
    },
    {
        "id": 4,
        "title":     "Resolved 2 blockers within 24 hours of being raised",
        "desc":      "DB credentials and design files — both unblocked same day.",
        "bar_color": "#b45309",
        "created_at": datetime(2025, 4, 1, 12, 3),
    },
]

_next_project_id     = 4
_next_achievement_id = 5


# ── XP Bars ───────────────────────────────────────────────────────────────────

@router.get("/xp", response_model=List[XpBarResponse])
def get_xp():
    return _xp_bars


@router.patch("/xp/{xp_id}", response_model=XpBarResponse)
def update_xp(xp_id: int, body: XpBarUpdate):
    for x in _xp_bars:
        if x["id"] == xp_id:
            x["pct"] = max(0, min(100, body.pct))
            if body.level:
                x["level"] = body.level
            return x
    raise HTTPException(status_code=404, detail="XP bar not found")


# ── Projects ──────────────────────────────────────────────────────────────────

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects():
    return sorted(_projects, key=lambda p: p["created_at"])


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(body: ProjectCreate):
    global _next_project_id
    project = {
        "id":         _next_project_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _projects.append(project)
    _next_project_id += 1
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int):
    global _projects
    before = len(_projects)
    _projects = [p for p in _projects if p["id"] != project_id]
    if len(_projects) == before:
        raise HTTPException(status_code=404, detail="Project not found")


# ── Achievements ──────────────────────────────────────────────────────────────

@router.get("/achievements", response_model=List[PortfolioAchievementResponse])
def get_achievements():
    return sorted(_achievements, key=lambda a: a["created_at"])


@router.post("/achievements", response_model=PortfolioAchievementResponse, status_code=201)
def create_achievement(body: PortfolioAchievementCreate):
    global _next_achievement_id
    entry = {
        "id":         _next_achievement_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _achievements.append(entry)
    _next_achievement_id += 1
    return entry


@router.delete("/achievements/{achievement_id}", status_code=204)
def delete_achievement(achievement_id: int):
    global _achievements
    before = len(_achievements)
    _achievements = [a for a in _achievements if a["id"] != achievement_id]
    if len(_achievements) == before:
        raise HTTPException(status_code=404, detail="Achievement not found")
