"""
Seed the database with initial data.
Run once after creating the database:
    python seed.py
"""

from datetime import datetime
from core.database import SessionLocal, engine, Base
import models.all_models as m

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Guard: only seed if tables are empty
if db.query(m.LogEntry).count() > 0:
    print("Database already seeded — skipping.")
    db.close()
    exit()

print("Seeding database...")

# ── Daily Log ────────────────────────────────────────────────────────────────
db.add_all([
    m.LogEntry(title="Daily standup — all 5 attended, 2 blockers surfaced", type="Scrum ceremony", duration="15 min", tags="#standup #sprint1", created_at=datetime(2025, 4, 1, 9, 0)),
    m.LogEntry(title="Auth API integration — POST /login connected, token handling implemented", type="Dev work", duration="2h", tags="#backend #auth #sprint1", notes="Used JWT. Refresh token flow still to do.", created_at=datetime(2025, 4, 1, 10, 0)),
    m.LogEntry(title="Backlog refinement — 8 stories groomed for Sprint 2", type="Scrum ceremony", duration="60 min", tags="#refinement #sprint2", created_at=datetime(2025, 4, 1, 13, 0)),
])

# ── Meetings ─────────────────────────────────────────────────────────────────
db.add_all([
    m.Meeting(title="Sprint 1 planning", date="28 Mar 2025", duration="60 min", type="Sprint planning", attendees="All team", key_points="Agreed sprint goal around auth module. 16 story points committed.", action_items="Centrine to share sprint board by EOD.", created_at=datetime(2025, 3, 28, 10, 0)),
    m.Meeting(title="Kickoff with Product Owner", date="27 Mar 2025", duration="45 min", type="Stakeholder", attendees="Centrine, PO", key_points="Q2 roadmap priorities aligned. PO availability confirmed for Wednesday refinements.", action_items="PO to review backlog by Friday.", created_at=datetime(2025, 3, 27, 14, 0)),
    m.Meeting(title="Backlog refinement — session 1", date="1 Apr 2025", duration="60 min", type="Backlog refinement", attendees="All team", key_points="Sprint 2 backlog groomed. 8 stories estimated.", action_items="James to spike on payment gateway by Wed.", created_at=datetime(2025, 4, 1, 13, 0)),
])

# ── Sprint ────────────────────────────────────────────────────────────────────
sprint = m.Sprint(id=1, name="Sprint 1", goal="Auth flow + user profile module. Testable build to QA by end of sprint.", start_date="1 Apr 2025", end_date="10 Apr 2025")
db.add(sprint)
db.flush()

db.add_all([
    m.Story(title="Password reset flow",           points=5, assignee="C", status="backlog",    sprint_id=1),
    m.Story(title="Email notification service",    points=3, assignee="J", status="backlog",    sprint_id=1),
    m.Story(title="API docs — auth endpoints",     points=2, assignee="C", status="backlog",    sprint_id=1),
    m.Story(title="Auth module — API integration", points=8, assignee="C", status="inprogress", sprint_id=1),
    m.Story(title="User profile UI",               points=5, assignee="J", status="inprogress", sprint_id=1),
    m.Story(title="Profile data persistence",      points=5, assignee="A", status="inprogress", sprint_id=1),
    m.Story(title="Session management",            points=3, assignee="J", status="inprogress", sprint_id=1),
    m.Story(title="Login page UI",                 points=3, assignee="A", status="review",     sprint_id=1),
    m.Story(title="Register page UI",              points=3, assignee="J", status="review",     sprint_id=1),
    m.Story(title="DB schema design",              points=5, assignee="C", status="done",       sprint_id=1),
    m.Story(title="CI/CD pipeline setup",          points=3, assignee="C", status="done",       sprint_id=1),
    m.Story(title="Project scaffolding",           points=2, assignee="J", status="done",       sprint_id=1),
    m.Story(title="Wireframes approved",           points=1, assignee="A", status="done",       sprint_id=1),
    m.Story(title="Env setup for all devs",        points=2, assignee="C", status="done",       sprint_id=1),
])

# ── Blockers ──────────────────────────────────────────────────────────────────
db.add_all([
    m.Blocker(title="QA environment not provisioned — blocking entire testing pipeline", severity="High", status="active",   owner="DevOps",   impact="No testing possible until resolved.", created_at=datetime(2025, 3, 30, 9, 0)),
    m.Blocker(title="PO unavailable for story clarification on payment flow",            severity="Med",  status="active",   owner="Centrine", impact="Payment stories cannot be started.", created_at=datetime(2025, 3, 31, 10, 0)),
    m.Blocker(title="DB access credentials missing for two devs",                        severity="Low",  status="resolved", owner="Centrine", impact="Two devs could not run local DB.", resolved_note="Credentials shared via password manager.", created_at=datetime(2025, 3, 27, 9, 0), resolved_at=datetime(2025, 3, 29, 11, 0)),
    m.Blocker(title="Design files not finalised before sprint start",                    severity="Low",  status="resolved", owner="Centrine", impact="UI stories had no source of truth on day 1.", resolved_note="Designer shared final Figma on sprint day 2.", created_at=datetime(2025, 3, 28, 8, 0), resolved_at=datetime(2025, 3, 29, 9, 0)),
])

# ── Goals & Achievements ──────────────────────────────────────────────────────
db.add_all([
    m.Goal(label="Run first sprint planning session", done=True,  created_at=datetime(2025, 3, 28)),
    m.Goal(label="1-on-1s with all team members",      done=True,  created_at=datetime(2025, 3, 29)),
    m.Goal(label="Onboard team to Scrum ceremonies",   done=True,  created_at=datetime(2025, 3, 30)),
    m.Goal(label="Build Dev Life OS MVP",              done=True,  created_at=datetime(2025, 4,  1)),
    m.Goal(label="Enrol in PSM I certification",       done=False, due_date="Apr 15", created_at=datetime(2025, 4, 1)),
    m.Goal(label="Deliver Sprint 1 successfully",      done=False, due_date="Apr 10", created_at=datetime(2025, 4, 1)),
    m.Goal(label="Write Scrum process wiki for team",  done=False, due_date="Apr 30", created_at=datetime(2025, 4, 1)),
])

db.add_all([
    m.GoalAchievement(title="Appointed first Scrum Master in the organisation", created_at=datetime(2025, 4, 1)),
    m.GoalAchievement(title="Onboarded team from 0 to first sprint in 5 days",  created_at=datetime(2025, 3, 28)),
    m.GoalAchievement(title="Resolved 2 blockers within 24h of being raised",   created_at=datetime(2025, 3, 29)),
    m.GoalAchievement(title="Launched Dev Life OS platform",                     created_at=datetime(2025, 4, 1)),
])

# ── Retros ────────────────────────────────────────────────────────────────────
retro_cards = [
    ("Team adapted quickly to daily standups — no resistance at all.",    "went-well"),
    ("Clear sprint goal from day one, no scope confusion mid-sprint.",     "went-well"),
    ("Strong collaboration between front and back-end dev.",               "went-well"),
    ("Blockers surfaced faster in week 2 than week 1.",                    "went-well"),
    ("Blockers not raised until they were already causing delays.",        "improve"),
    ("Backlog not fully refined before sprint start.",                     "improve"),
    ("Estimation variance too high — needs calibration.",                  "improve"),
    ("Mid-sprint PO communication was patchy.",                            "improve"),
    ("Blockers flagged in standup — not after the meeting ends.",          "actions"),
    ("Refinement session midway through sprint — locked in calendar.",     "actions"),
    ("Planning poker for all stories above 3 points.",                     "actions"),
    ("Weekly async update to PO via shared doc.",                          "actions"),
]
for i, (text, col) in enumerate(retro_cards):
    db.add(m.RetroCard(text=text, column=col, sprint="Sprint 1", created_at=datetime(2025, 4, 1, 10, i)))

# ── Growth ────────────────────────────────────────────────────────────────────
db.add_all([
    m.Skill(name="Scrum facilitation",       pct=55),
    m.Skill(name="Backlog management",       pct=45),
    m.Skill(name="Stakeholder communication",pct=70),
    m.Skill(name="Conflict resolution",      pct=40),
    m.Skill(name="Full-stack development",   pct=65),
    m.Skill(name="Technical documentation",  pct=75),
    m.Skill(name="Report writing",           pct=72),
])

db.add_all([
    m.Cert(label="Agile & Scrum fundamentals",        done=True,  due_date="Mar '25"),
    m.Cert(label="PSM I — Professional Scrum Master", done=False, due_date="Jun '25"),
    m.Cert(label="Conflict resolution workshop",      done=False, due_date="May '25"),
    m.Cert(label="Advanced facilitation techniques",  done=False, due_date="Jul '25"),
    m.Cert(label="PSM II",                            done=False, due_date="Dec '25"),
])

db.add_all([
    m.GrowthFeedback(text="Ran the planning session really well for a first time — kept us focused.", author="James · 28 Mar", created_at=datetime(2025, 3, 28, 17, 0)),
    m.GrowthFeedback(text="Good job flagging that blocker early, saved us half a day.",               author="Aisha · 30 Mar", created_at=datetime(2025, 3, 30, 18, 0)),
    m.GrowthFeedback(text="The retro format you introduced worked great — team opened up more.",      author="Team · 31 Mar",  created_at=datetime(2025, 3, 31, 18, 0)),
])

# ── Portfolio ─────────────────────────────────────────────────────────────────
db.add_all([
    m.XpBar(label="Full-stack development",   level="Mid",     pct=65),
    m.XpBar(label="Scrum / Agile delivery",   level="Growing", pct=55),
    m.XpBar(label="Technical documentation",  level="Strong",  pct=75),
    m.XpBar(label="API design & integration", level="Mid",     pct=60),
])

db.add_all([
    m.Project(title="Dev Life OS", role="Solo developer · Full-stack", desc="Personal developer platform to track daily work, sprint progress, meetings, goals, and growth.", tags=[{"label": "Next.js", "cls": "tag-blue"}, {"label": "Python", "cls": "tag-amber"}, {"label": "FastAPI", "cls": "tag-green"}, {"label": "Pure CSS", "cls": "tag-default"}], banner_color="#5b4fcf", period="Apr 2025 – ongoing", impact="Self-owned platform", created_at=datetime(2025, 4, 1, 12, 0)),
    m.Project(title="Auth & User Profile Module", role="Developer · Sprint 1", desc="Built the full auth flow — login, registration, session management — and user profile persistence.", tags=[{"label": "Backend", "cls": "tag-blue"}, {"label": "Auth", "cls": "tag-purple"}, {"label": "API", "cls": "tag-default"}], banner_color="#1d4ed8", period="Apr 1 – Apr 10, 2025", impact="Sprint 1 core deliverable", created_at=datetime(2025, 4, 1, 12, 1)),
    m.Project(title="Scrum Process Implementation", role="Scrum Master · First SM in org", desc="Designed and introduced Scrum ceremonies, board structure, and team norms from scratch.", tags=[{"label": "Scrum", "cls": "tag-purple"}, {"label": "Facilitation", "cls": "tag-green"}, {"label": "Team lead", "cls": "tag-amber"}], banner_color="#1e7a4e", period="Mar 2025 – ongoing", impact="Team velocity ↑ sprint over sprint", created_at=datetime(2025, 4, 1, 12, 2)),
])

db.add_all([
    m.PortfolioAchievement(title="First Scrum Master in the organisation",      desc="Introduced Agile from scratch — no playbook, no precedent.",                              bar_color="#5b4fcf", created_at=datetime(2025, 4, 1, 12, 0)),
    m.PortfolioAchievement(title="Shipped Auth module in Sprint 1",             desc="POST /login, token handling, and session management — all merged to dev branch.",         bar_color="#1d4ed8", created_at=datetime(2025, 4, 1, 12, 1)),
    m.PortfolioAchievement(title="Zero missed sprint ceremonies in first sprint",desc="100% standup attendance, planning, refinement, and retro held on schedule.",             bar_color="#1e7a4e", created_at=datetime(2025, 4, 1, 12, 2)),
    m.PortfolioAchievement(title="Resolved 2 blockers within 24 hours of being raised", desc="DB credentials and design files — both unblocked same day.",                      bar_color="#b45309", created_at=datetime(2025, 4, 1, 12, 3)),
])

# ── Files ─────────────────────────────────────────────────────────────────────
db.add_all([
    m.FileRecord(filename="Sprint-1-midpoint-report.pdf",    ext="pdf",  category="Report",           project="Dev platform", size_bytes=420000,  size_label="420 KB",  uploaded_at=datetime(2025, 4,  1, 15, 0)),
    m.FileRecord(filename="Auth-module-technical-spec.docx", ext="docx", category="Specification",   project="Dev platform", size_bytes=185000,  size_label="185 KB",  uploaded_at=datetime(2025, 3, 28, 10, 0)),
    m.FileRecord(filename="Sprint-1-planning-minutes.docx",  ext="docx", category="Meeting minutes", project="Dev platform", size_bytes=92000,   size_label="92 KB",   uploaded_at=datetime(2025, 3, 28, 11, 0)),
    m.FileRecord(filename="Q2-roadmap-summary.xlsx",         ext="xlsx", category="Report",           project="Strategy",    size_bytes=310000,  size_label="310 KB",  uploaded_at=datetime(2025, 3, 27, 14, 0)),
    m.FileRecord(filename="Onboarding-scrum-guide.pdf",      ext="pdf",  category="Documentation",   project="Dev platform", size_bytes=640000,  size_label="640 KB",  uploaded_at=datetime(2025, 3, 26, 9,  0)),
])

db.commit()
db.close()
print("Done. All tables seeded.")
