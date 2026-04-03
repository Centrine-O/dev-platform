# Dev Life OS

A personal developer platform built to track, document, and showcase the full picture of how you work — coding sessions, meetings, reports, sprint progress, goals, and growth — all in one place.

Built for audit-readiness: every entry you make becomes evidence of your output and professional growth.

---

## What it does

- **Daily log** — record every coding session, meeting, report, and task as it happens
- **Sprint board** — Kanban view of your current sprint with story points and progress
- **Meeting minutes** — capture and store minutes for standups, planning, retros, and stakeholder meetings
- **Retrospectives** — structured sprint retro boards (went well / needs improvement / actions)
- **Blockers tracker** — log impediments with severity, owner, and resolution status
- **Vision & goals** — personal vision board, monthly goals checklist, and achievements log
- **Growth tracker** — skills self-assessment, certifications roadmap, weekly reflections, and feedback received
- **Portfolio** — showcase your projects, tech stack, and measurable impact
- **Reports & documents** — upload and organise reports, documentation, and any project-related materials
- **Archive** — searchable storage for all uploaded files, categorised by type and project

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 · React 19 · Pure CSS |
| Backend | Python · FastAPI |
| Database | TBD (PostgreSQL planned) |

---

## Project structure

```
Dev-platform/
├── frontend/          # Next.js application
│   ├── app/           # App router pages and layouts
│   ├── components/    # Reusable UI components
│   ├── styles/        # Global and page CSS
│   └── public/        # Static assets
├── backend/           # Python FastAPI application (coming soon)
│   ├── api/           # Route handlers
│   ├── models/        # Data models
│   └── db/            # Database layer
└── README.md
```

---

## Getting started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`

---

## Design principles

- **Evidence-first** — every action logged here can be pulled into an audit or performance review
- **No noise** — clean, minimal interface; nothing you don't need
- **Pure CSS** — no UI frameworks, full control over every style decision
- **Yours to own** — self-hosted, your data stays with you

---

## Status

Currently in active development. Building one section at a time.

| Section | Status |
|---------|--------|
| Frontend scaffold | Done |
| Backend scaffold | Pending |
| Overview page | In progress |
| Daily log | Pending |
| Sprint board | Pending |
| Meetings | Pending |
| Vision & goals | Pending |
| Growth tracker | Pending |
| Reports / Archive | Pending |

---

## Author

Centrine — developer, builder, works-in-public.
