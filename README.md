# Dev Life OS

> A personal developer platform — your complete, audit-ready record of how you work.

Dev Life OS is a fullstack web application built to centralise everything that happens in a developer's working life: coding sessions, meetings, sprint progress, documentation, reports, personal goals, and growth. When the audit comes, or a performance review, or just end-of-year reflection — it is all here, timestamped and searchable.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Frontend](#frontend)
- [Backend](#backend)
- [Environment variables](#environment-variables)
- [Pages & sections](#pages--sections)
- [API overview](#api-overview)
- [Database](#database)
- [Development workflow](#development-workflow)
- [Build status](#build-status)
- [Roadmap](#roadmap)

---

## Why this exists

Developers wear many hats — coding, attending ceremonies, writing reports, documenting decisions, managing people, chasing blockers. That work is often invisible because it is scattered: standup notes in Slack, reports in email, tasks in Jira, reflections nowhere. Dev Life OS puts it all in one owned, structured, searchable place. No third-party subscriptions. Your data, your platform.

---

## Features

### Daily operations
- **Daily log** — log every work activity as it happens: coding, meetings, documentation, planning. Each entry is tagged, timestamped, and becomes audit evidence.
- **Sprint board** — Kanban view (Backlog → In Progress → Review → Done) with story points, team assignment, and sprint progress metrics.
- **Blockers tracker** — log impediments with severity (High / Med / Low), owner, impact, and resolution status. Tracks time-to-resolve.
- **Meeting minutes** — structured capture for standups, sprint planning, backlog refinement, retros, stakeholder meetings, and 1-on-1s. Stores attendees, key decisions, and action items.
- **Retrospectives** — sprint retro boards with three columns: Went Well, Needs Improvement, Actions Next Sprint. Full history across sprints.

### Personal development
- **Vision & goals** — 12-month vision statement, monthly goal checklists, and a running achievements log.
- **Growth tracker** — skills self-assessment with progress bars, certifications roadmap, weekly reflection journal, and feedback received from colleagues.

### Portfolio & evidence
- **Portfolio** — project showcase cards with tech stack, your role, measurable impact, and timeline. Designed to be shown in reviews or interviews.
- **Reports & documents** — upload and organise any project material: reports, specs, architecture docs, client deliverables. Categorised, searchable.
- **Archive** — full searchable store of all uploaded files, filterable by type, project, date, and category.

### Command centre (Overview)
- Today's schedule timeline
- End-of-day checklist
- Quick note capture
- Weekly productivity breakdown (dev hours, meetings, documentation, planning)
- Recent activity feed
- Sprint progress at a glance
- Open blockers count

---

## Tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | Next.js | 16.x |
| UI library | React | 19.x |
| Styling | Pure CSS (no frameworks) | — |
| Language (frontend) | TypeScript | 5.x |
| Backend framework | FastAPI | 0.11x |
| Language (backend) | Python | 3.12 |
| Database | PostgreSQL | 16.x (planned) |
| ORM | SQLAlchemy | 2.x (planned) |
| Auth | JWT (planned) | — |
| File storage | Local / S3-compatible (planned) | — |

---

## Project structure

```
Dev-platform/
│
├── frontend/                  # Next.js application
│   ├── app/                   # App router
│   │   ├── layout.tsx         # Root layout (fonts, global nav)
│   │   ├── page.tsx           # Home / Overview page
│   │   ├── globals.css        # Global CSS reset and variables
│   │   ├── daily-log/         # Daily log page
│   │   ├── sprint/            # Sprint board page
│   │   ├── meetings/          # Meeting minutes page
│   │   ├── retros/            # Retrospectives page
│   │   ├── blockers/          # Blockers page
│   │   ├── vision/            # Vision & goals page
│   │   ├── growth/            # Growth tracker page
│   │   ├── portfolio/         # Portfolio page
│   │   ├── reports/           # Reports & documents page
│   │   └── archive/           # Archive page
│   ├── components/            # Reusable UI components
│   │   ├── nav/               # Sidebar / tab navigation
│   │   ├── cards/             # Card components
│   │   ├── forms/             # Form components
│   │   └── shared/            # Buttons, tags, modals, etc.
│   ├── styles/                # Component-level CSS files
│   ├── lib/                   # API client, helpers, constants
│   ├── public/                # Static assets
│   └── package.json
│
├── backend/                   # Python FastAPI application (in progress)
│   ├── main.py                # App entry point
│   ├── routers/               # Route handlers per domain
│   │   ├── log.py             # Daily log endpoints
│   │   ├── sprint.py          # Sprint / Kanban endpoints
│   │   ├── meetings.py        # Meeting minutes endpoints
│   │   ├── goals.py           # Vision & goals endpoints
│   │   ├── files.py           # File upload / retrieval
│   │   └── growth.py          # Growth tracker endpoints
│   ├── models/                # SQLAlchemy ORM models
│   ├── schemas/               # Pydantic request/response schemas
│   ├── db/                    # Database connection and migrations
│   ├── core/                  # Config, security, dependencies
│   └── requirements.txt
│
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+ and npm
- Python 3.12+
- PostgreSQL (when backend is ready)

### Clone

```bash
git clone https://github.com/Centrine-O/dev-platform.git
cd dev-platform
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

---

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at `http://localhost:8000`

API docs auto-generated at `http://localhost:8000/docs`

---

## Environment variables

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devlifeos
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Pages & sections

| Route | Page | Description |
|-------|------|-------------|
| `/` | Overview | Command centre — today's schedule, sprint status, quick log |
| `/daily-log` | Daily log | Timestamped work entries, timeline view, audit filter |
| `/sprint` | Sprint board | Kanban board, story points, velocity tracking |
| `/meetings` | Meetings | Minutes capture, meeting history, action items |
| `/retros` | Retros | Sprint retrospective boards across all sprints |
| `/blockers` | Blockers | Impediment log with severity and resolution tracking |
| `/vision` | Vision & goals | Vision statement, monthly goals, achievements |
| `/growth` | Growth | Skills, certifications, reflections, feedback |
| `/portfolio` | Portfolio | Project showcase with impact and tech stack |
| `/reports` | Reports | Upload and manage documents and reports |
| `/archive` | Archive | Searchable file store across all categories |

---

## API overview

Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/log` | Fetch all log entries |
| POST | `/log` | Create a log entry |
| GET | `/sprint` | Get current sprint and stories |
| POST | `/sprint/story` | Create a story |
| PATCH | `/sprint/story/:id` | Update story status |
| GET | `/meetings` | List all meeting minutes |
| POST | `/meetings` | Save meeting minutes |
| GET | `/goals` | Get goals and achievements |
| POST | `/goals` | Add a goal or achievement |
| POST | `/files/upload` | Upload a document or file |
| GET | `/files` | List all uploaded files |

Full interactive API docs available at `/docs` when backend is running.

---

## Database

PostgreSQL with SQLAlchemy ORM. Core tables planned:

| Table | Description |
|-------|-------------|
| `log_entries` | Daily work log records |
| `sprint_stories` | Kanban cards / user stories |
| `meeting_minutes` | Meeting records and action items |
| `blockers` | Impediment records |
| `goals` | Goals and achievements |
| `skills` | Skill self-assessments over time |
| `reflections` | Weekly growth journal entries |
| `files` | Uploaded file metadata |

---

## Development workflow

1. Work is done in feature branches off `main`
2. Each section of the platform is built one page at a time
3. Frontend pages are built first (static), then wired to the backend API
4. Every significant change is committed with a clear message
5. No external CSS frameworks — all styling is handwritten pure CSS

---

## Build status

| Section | Frontend | Backend |
|---------|----------|---------|
| Project scaffold | Done | Done |
| Overview page | Done | — |
| Daily log | Done | Done |
| Sprint board | Done | Done |
| Meetings | Done | Done |
| Retros | Done | — |
| Blockers | Done | Done |
| Vision & goals | Done | Done |
| Growth tracker | Done | — |
| Portfolio | Done | — |
| Reports / upload | Done | Done |
| Archive | Done | — |
| Connect frontend to API | In progress | — |
| Database (PostgreSQL) | Pending | Pending |
| Auth / login | Pending | Pending |

---

## Roadmap

- [ ] Frontend: all pages built as static UI
- [ ] Backend: FastAPI scaffold with all routers
- [ ] Database: PostgreSQL schema and migrations
- [ ] Connect frontend to backend API
- [ ] File upload and storage
- [ ] Authentication (login / protected routes)
- [ ] Audit export — generate a PDF summary of any date range
- [ ] Mobile-responsive layout
- [ ] Dark mode

---

## Author

Built by Centrine. A personal tool, built the right way.
