"use client";

import "./portfolio.css";

interface Project {
  id: number;
  title: string;
  role: string;
  desc: string;
  tags: { label: string; cls: string }[];
  bannerColor: string;
  period: string;
  impact: string;
}

interface Achievement {
  id: number;
  title: string;
  desc: string;
  barColor: string;
}

const xpBars = [
  { label: "Full-stack development", level: "Mid",    pct: 65 },
  { label: "Scrum / Agile delivery", level: "Growing", pct: 55 },
  { label: "Technical documentation", level: "Strong", pct: 75 },
  { label: "API design & integration", level: "Mid",   pct: 60 },
];

const projects: Project[] = [
  {
    id: 1,
    title: "Dev Life OS",
    role: "Solo developer · Full-stack",
    desc: "Personal developer platform to track daily work, sprint progress, meetings, goals, and growth. Audit-ready evidence trail for professional reviews.",
    tags: [
      { label: "Next.js",  cls: "tag-blue" },
      { label: "Python",   cls: "tag-amber" },
      { label: "FastAPI",  cls: "tag-green" },
      { label: "Pure CSS", cls: "tag-default" },
    ],
    bannerColor: "#5b4fcf",
    period: "Apr 2025 – ongoing",
    impact: "Self-owned platform",
  },
  {
    id: 2,
    title: "Auth & User Profile Module",
    role: "Developer · Sprint 1",
    desc: "Built the full auth flow — login, registration, session management — and user profile persistence for the team project. Delivered on time within Sprint 1.",
    tags: [
      { label: "Backend",  cls: "tag-blue" },
      { label: "Auth",     cls: "tag-purple" },
      { label: "API",      cls: "tag-default" },
    ],
    bannerColor: "#1d4ed8",
    period: "Apr 1 – Apr 10, 2025",
    impact: "Sprint 1 core deliverable",
  },
  {
    id: 3,
    title: "Scrum Process Implementation",
    role: "Scrum Master · First SM in org",
    desc: "Designed and introduced Scrum ceremonies, board structure, and team norms from scratch. Onboarded a team of 5 from zero Agile experience to first sprint in 5 days.",
    tags: [
      { label: "Scrum",        cls: "tag-purple" },
      { label: "Facilitation", cls: "tag-green" },
      { label: "Team lead",    cls: "tag-amber" },
    ],
    bannerColor: "#1e7a4e",
    period: "Mar 2025 – ongoing",
    impact: "Team velocity ↑ sprint over sprint",
  },
];

const achievements: Achievement[] = [
  {
    id: 1,
    title: "First Scrum Master in the organisation",
    desc: "Introduced Agile from scratch — no playbook, no precedent.",
    barColor: "#5b4fcf",
  },
  {
    id: 2,
    title: "Shipped Auth module in Sprint 1",
    desc: "POST /login, token handling, and session management — all merged to dev branch.",
    barColor: "#1d4ed8",
  },
  {
    id: 3,
    title: "Zero missed sprint ceremonies in first sprint",
    desc: "100% standup attendance, planning, refinement, and retro held on schedule.",
    barColor: "#1e7a4e",
  },
  {
    id: 4,
    title: "Resolved 2 blockers within 24 hours of being raised",
    desc: "DB credentials and design files — both unblocked same day.",
    barColor: "#b45309",
  },
];

export default function Portfolio() {
  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Work · impact · proof</div>
          <h1>My <em>portfolio.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Export PDF</button>
          <button className="btn btn-solid">+ Add project</button>
        </div>
      </div>

      {/* XP bars */}
      <div className="card">
        <div className="card-label">Technical XP</div>
        {xpBars.map((x) => (
          <div key={x.label} className="xp-bar">
            <div className="xp-label">
              <span>{x.label}</span>
              <span>{x.level}</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${x.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid-3">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <div className="project-banner" style={{ background: p.bannerColor }} />
            <div className="project-body">
              <div className="project-title">{p.title}</div>
              <div className="project-role">{p.role}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>
                ))}
              </div>
              <div className="project-foot">
                <span className="project-period">{p.period}</span>
                <span className="project-impact">{p.impact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key achievements */}
      <div className="card">
        <div className="card-label">Key achievements</div>
        {achievements.map((a) => (
          <div key={a.id} className="achievement">
            <div className="achievement-bar" style={{ background: a.barColor }} />
            <div>
              <div className="achievement-title">{a.title}</div>
              <div className="achievement-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
