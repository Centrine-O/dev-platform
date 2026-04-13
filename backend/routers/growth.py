from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from schemas.growth import (
    SkillResponse, SkillUpdate,
    CertResponse,
    FeedbackCreate, FeedbackResponse,
    ReflectionCreate, ReflectionResponse,
)

router = APIRouter(prefix="/growth", tags=["Growth"])

# ── In-memory stores ────────────────────────────────────────────────────────

_skills: List[dict] = [
    { "id": 1, "name": "Scrum facilitation",       "pct": 55 },
    { "id": 2, "name": "Backlog management",        "pct": 45 },
    { "id": 3, "name": "Stakeholder communication", "pct": 70 },
    { "id": 4, "name": "Conflict resolution",       "pct": 40 },
    { "id": 5, "name": "Full-stack development",    "pct": 65 },
    { "id": 6, "name": "Technical documentation",   "pct": 75 },
    { "id": 7, "name": "Report writing",            "pct": 72 },
]

_certs: List[dict] = [
    { "id": 1, "label": "Agile & Scrum fundamentals",        "done": True,  "due_date": "Mar '25" },
    { "id": 2, "label": "PSM I — Professional Scrum Master", "done": False, "due_date": "Jun '25" },
    { "id": 3, "label": "Conflict resolution workshop",      "done": False, "due_date": "May '25" },
    { "id": 4, "label": "Advanced facilitation techniques",  "done": False, "due_date": "Jul '25" },
    { "id": 5, "label": "PSM II",                            "done": False, "due_date": "Dec '25" },
]

_feedback: List[dict] = [
    {
        "id": 1,
        "text": "Ran the planning session really well for a first time — kept us focused.",
        "author": "James · 28 Mar",
        "created_at": datetime(2025, 3, 28, 17, 0),
    },
    {
        "id": 2,
        "text": "Good job flagging that blocker early, saved us half a day.",
        "author": "Aisha · 30 Mar",
        "created_at": datetime(2025, 3, 30, 18, 0),
    },
    {
        "id": 3,
        "text": "The retro format you introduced worked great — team opened up more.",
        "author": "Team · 31 Mar",
        "created_at": datetime(2025, 3, 31, 18, 0),
    },
]

_reflections: List[dict] = []

_next_feedback_id    = 4
_next_reflection_id  = 1


# ── Skills ───────────────────────────────────────────────────────────────────

@router.get("/skills", response_model=List[SkillResponse])
def get_skills():
    return _skills


@router.patch("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, body: SkillUpdate):
    for s in _skills:
        if s["id"] == skill_id:
            s["pct"] = max(0, min(100, body.pct))
            return s
    raise HTTPException(status_code=404, detail="Skill not found")


# ── Certs ────────────────────────────────────────────────────────────────────

@router.get("/certs", response_model=List[CertResponse])
def get_certs():
    return _certs


@router.patch("/certs/{cert_id}/toggle", response_model=CertResponse)
def toggle_cert(cert_id: int):
    for c in _certs:
        if c["id"] == cert_id:
            c["done"] = not c["done"]
            return c
    raise HTTPException(status_code=404, detail="Cert not found")


# ── Feedback ─────────────────────────────────────────────────────────────────

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_feedback():
    return sorted(_feedback, key=lambda f: f["created_at"], reverse=True)


@router.post("/feedback", response_model=FeedbackResponse, status_code=201)
def add_feedback(body: FeedbackCreate):
    global _next_feedback_id
    entry = {
        "id":         _next_feedback_id,
        "text":       body.text,
        "author":     body.author,
        "created_at": datetime.now(),
    }
    _feedback.append(entry)
    _next_feedback_id += 1
    return entry


@router.delete("/feedback/{feedback_id}", status_code=204)
def delete_feedback(feedback_id: int):
    global _feedback
    before = len(_feedback)
    _feedback = [f for f in _feedback if f["id"] != feedback_id]
    if len(_feedback) == before:
        raise HTTPException(status_code=404, detail="Feedback not found")


# ── Reflections ───────────────────────────────────────────────────────────────

@router.get("/reflections", response_model=List[ReflectionResponse])
def get_reflections():
    return sorted(_reflections, key=lambda r: r["created_at"], reverse=True)


@router.post("/reflections", response_model=ReflectionResponse, status_code=201)
def add_reflection(body: ReflectionCreate):
    global _next_reflection_id
    entry = {
        "id":         _next_reflection_id,
        "text":       body.text,
        "created_at": datetime.now(),
    }
    _reflections.append(entry)
    _next_reflection_id += 1
    return entry
