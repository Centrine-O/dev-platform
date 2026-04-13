"""
All SQLAlchemy ORM models for Dev Life OS.
Imported together so Alembic can see them all via Base.metadata.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Integer, String, Text, Boolean, DateTime, JSON,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


# ── Daily Log ────────────────────────────────────────────────────────────────

class LogEntry(Base):
    __tablename__ = "log_entries"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    title:      Mapped[str]           = mapped_column(String(300))
    type:       Mapped[str]           = mapped_column(String(100))
    duration:   Mapped[Optional[str]] = mapped_column(String(50),  nullable=True)
    tags:       Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    notes:      Mapped[Optional[str]] = mapped_column(Text,        nullable=True)
    created_at: Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())


# ── Meetings ──────────────────────────────────────────────────────────────────

class Meeting(Base):
    __tablename__ = "meetings"

    id:           Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    title:        Mapped[str]           = mapped_column(String(300))
    date:         Mapped[str]           = mapped_column(String(50))
    duration:     Mapped[Optional[str]] = mapped_column(String(50),  nullable=True)
    type:         Mapped[str]           = mapped_column(String(100))
    attendees:    Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    key_points:   Mapped[str]           = mapped_column(Text)
    action_items: Mapped[Optional[str]] = mapped_column(Text,        nullable=True)
    created_at:   Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())


# ── Sprint ────────────────────────────────────────────────────────────────────

class Sprint(Base):
    __tablename__ = "sprints"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    name:       Mapped[str]      = mapped_column(String(100))
    goal:       Mapped[str]      = mapped_column(Text)
    start_date: Mapped[str]      = mapped_column(String(50))
    end_date:   Mapped[str]      = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Story(Base):
    __tablename__ = "stories"

    id:        Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    title:     Mapped[str]           = mapped_column(String(300))
    points:    Mapped[int]           = mapped_column(Integer, default=1)
    assignee:  Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status:    Mapped[str]           = mapped_column(String(50), default="backlog")
    sprint_id: Mapped[int]           = mapped_column(Integer, default=1)
    created_at: Mapped[datetime]     = mapped_column(DateTime, server_default=func.now())


# ── Blockers ──────────────────────────────────────────────────────────────────

class Blocker(Base):
    __tablename__ = "blockers"

    id:            Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    title:         Mapped[str]           = mapped_column(String(500))
    severity:      Mapped[str]           = mapped_column(String(10), default="Med")
    status:        Mapped[str]           = mapped_column(String(20), default="active")
    owner:         Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    impact:        Mapped[Optional[str]] = mapped_column(Text,        nullable=True)
    resolved_note: Mapped[Optional[str]] = mapped_column(Text,        nullable=True)
    created_at:    Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
    resolved_at:   Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


# ── Goals & Achievements ──────────────────────────────────────────────────────

class Goal(Base):
    __tablename__ = "goals"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    label:      Mapped[str]           = mapped_column(String(500))
    type:       Mapped[str]           = mapped_column(String(20), default="goal")
    done:       Mapped[bool]          = mapped_column(Boolean, default=False)
    due_date:   Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())


class GoalAchievement(Base):
    __tablename__ = "goal_achievements"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    title:      Mapped[str]      = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ── Retros ────────────────────────────────────────────────────────────────────

class RetroCard(Base):
    __tablename__ = "retro_cards"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    text:       Mapped[str]           = mapped_column(Text)
    column:     Mapped[str]           = mapped_column(String(50))
    sprint:     Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())


# ── Growth ────────────────────────────────────────────────────────────────────

class Skill(Base):
    __tablename__ = "skills"

    id:   Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    pct:  Mapped[int] = mapped_column(Integer, default=0)


class Cert(Base):
    __tablename__ = "certs"

    id:       Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    label:    Mapped[str]           = mapped_column(String(300))
    done:     Mapped[bool]          = mapped_column(Boolean, default=False)
    due_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)


class GrowthFeedback(Base):
    __tablename__ = "growth_feedback"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    text:       Mapped[str]      = mapped_column(Text)
    author:     Mapped[str]      = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Reflection(Base):
    __tablename__ = "reflections"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    text:       Mapped[str]      = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ── Portfolio ─────────────────────────────────────────────────────────────────

class XpBar(Base):
    __tablename__ = "xp_bars"

    id:    Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    label: Mapped[str] = mapped_column(String(200))
    level: Mapped[str] = mapped_column(String(100))
    pct:   Mapped[int] = mapped_column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id:           Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    title:        Mapped[str]      = mapped_column(String(300))
    role:         Mapped[str]      = mapped_column(String(300))
    desc:         Mapped[str]      = mapped_column(Text)
    tags:         Mapped[list]     = mapped_column(JSON, default=list)
    banner_color: Mapped[str]      = mapped_column(String(20), default="#5b4fcf")
    period:       Mapped[str]      = mapped_column(String(200), default="")
    impact:       Mapped[str]      = mapped_column(String(300), default="")
    created_at:   Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class PortfolioAchievement(Base):
    __tablename__ = "portfolio_achievements"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    title:      Mapped[str]      = mapped_column(String(500))
    desc:       Mapped[str]      = mapped_column(Text)
    bar_color:  Mapped[str]      = mapped_column(String(20), default="#5b4fcf")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ── Files ─────────────────────────────────────────────────────────────────────

class FileRecord(Base):
    __tablename__ = "file_records"

    id:          Mapped[int]           = mapped_column(Integer, primary_key=True, index=True)
    filename:    Mapped[str]           = mapped_column(String(500))
    ext:         Mapped[str]           = mapped_column(String(20))
    category:    Mapped[str]           = mapped_column(String(100))
    project:     Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    notes:       Mapped[Optional[str]] = mapped_column(Text,        nullable=True)
    size_bytes:  Mapped[int]           = mapped_column(Integer, default=0)
    size_label:  Mapped[str]           = mapped_column(String(30))
    uploaded_at: Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
