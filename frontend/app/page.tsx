"use client";

import { useState, useEffect } from "react";
import { sprintApi, blockerApi, goalApi, logApi, meetingApi, Sprint, Blocker, Goal, LogEntry, Meeting } from "@/lib/api";
import "./page.css";

// ── Static local sections (no backend yet) ───────────────────────────────────

const schedule = [
  { time: "09:00", title: "Daily standup",            tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", duration: "15 min", now: true  },
  { time: "10:00", title: "Auth API integration",     tag: "Dev",      tagClass: "tag-blue",   color: "#93c5fd", duration: "2h",     now: false },
  { time: "13:00", title: "Backlog refinement",       tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", duration: "60 min", now: false },
  { time: "15:00", title: "Sprint mid-point report",  tag: "Doc",      tagClass: "tag-amber",  color: "#fcd34d", duration: "",       now: false },
  { time: "16:30", title: "1-on-1s — James & Aisha", tag: "Team",     tagClass: "tag-green",  color: "#6ee7b7", duration: "",       now: false },
];

const defaultChecklist = [
  { id: 1, label: "Ran standup",                      done: true  },
  { id: 2, label: "Updated sprint board",             done: true  },
  { id: 3, label: "Write & share meeting minutes",    done: false },
  { id: 4, label: "Log blockers",                     done: false },
  { id: 5, label: "Review tomorrow's schedule",       done: false },
  { id: 6, label: "Log dev work",                     done: false },
];

const metrics = [
  { label: "Deep work (coding)",    value: "7.5h", pct: 65, color: "var(--purple)" },
  { label: "Meetings & ceremonies", value: "4.5h", pct: 40, color: "var(--amber)"  },
  { label: "Documentation",         value: "2.5h", pct: 22, color: "var(--blue)"   },
  { label: "Planning & strategy",   value: "1.5h", pct: 15, color: "var(--green)"  },
];

// ── Activity helpers ──────────────────────────────────────────────────────────

type ActivityItem = { title: string; time: string; color: string; ts: number };

function relativeTime(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `Today · ${new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  if (days === 1) return `Yesterday · ${new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function buildActivity(logs: LogEntry[], meetings: Meeting[], blockers: Blocker[]): ActivityItem[] {
  const items: ActivityItem[] = [
    ...logs.map((l) => ({
      title: `Log — ${l.title}`,
      time:  relativeTime(l.created_at),
      color: "#93c5fd",
      ts:    new Date(l.created_at).getTime(),
    })),
    ...meetings.map((m) => ({
      title: `Meeting — ${m.title}`,
      time:  relativeTime(m.created_at),
      color: "#a78bfa",
      ts:    new Date(m.created_at).getTime(),
    })),
    ...blockers
      .filter((b) => b.status === "resolved" && b.resolved_at)
      .map((b) => ({
        title: `Blocker resolved — ${b.title}`,
        time:  relativeTime(b.resolved_at!),
        color: "#6ee7b7",
        ts:    new Date(b.resolved_at!).getTime(),
      })),
  ];

  return items.sort((a, b) => b.ts - a.ts).slice(0, 6);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Overview() {
  const [greeting,  setGreeting]  = useState("Good morning");
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [note,      setNote]      = useState("");

  // Real data
  const [sprint,    setSprint]    = useState<Sprint | null>(null);
  const [blockers,  setBlockers]  = useState<Blocker[]>([]);
  const [goals,     setGoals]     = useState<Goal[]>([]);
  const [activity,  setActivity]  = useState<ActivityItem[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17)         setGreeting("Good evening");
  }, []);

  useEffect(() => {
    Promise.all([
      sprintApi.getSprint(),
      blockerApi.getAll("active"),
      goalApi.getAll(),
      logApi.getAll(),
      meetingApi.getAll(),
      blockerApi.getAll(),
    ])
      .then(([sprintData, activeBlockers, goalsData, logs, meetings, allBlockers]) => {
        setSprint(sprintData);
        setBlockers(activeBlockers);
        setGoals(goalsData);
        setActivity(buildActivity(logs, meetings, allBlockers));
      })
      .catch((err) => console.error("Overview fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  function toggleCheck(id: number) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  // Derived stats
  const sprintPct     = sprint && sprint.total_points > 0
    ? Math.round((sprint.done_points / sprint.total_points) * 100)
    : 0;
  const highBlockers  = blockers.filter((b) => b.severity === "High").length;
  const goalsDone     = goals.filter((g) => g.done).length;
  const goalsTotal    = goals.length;

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Command centre</div>
          <h1>{greeting}, <em>Centrine.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Export week</button>
          <button className="btn btn-solid">+ Log entry</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4">
        <div className="card-dark">
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Sprint progress</div>
          <div className="stat" style={{ color: "#fff" }}>
            {loading ? "—" : sprintPct}<span className="stat-unit">%</span>
          </div>
          <div className="bar-track-light">
            <div className="bar-fill-light" style={{ width: `${sprintPct}%` }} />
          </div>
          <div className="stat-sub-light">
            {sprint ? `${sprint.name} · ${sprint.days_remaining} days left` : "Loading…"}
          </div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Open blockers</div>
          <div className="stat">{loading ? "—" : blockers.length}</div>
          <div className="stat-sub">
            {loading ? "" : highBlockers > 0 ? `${highBlockers} high priority` : "None high priority"}
          </div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Goals this month</div>
          <div className="stat">
            {loading ? "—" : goalsDone}
            <span className="stat-unit-dark">/{goalsTotal}</span>
          </div>
          <div className="stat-sub">
            {loading ? "" : goalsDone === goalsTotal && goalsTotal > 0 ? "All done" : "In progress"}
          </div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Sprint points done</div>
          <div className="stat">
            {loading ? "—" : sprint?.done_points ?? "—"}
            <span className="stat-unit-dark">/{sprint?.total_points ?? ""}</span>
          </div>
          <div className="stat-sub">story points</div>
        </div>
      </div>

      {/* Schedule + Checklist/Note */}
      <div className="grid-2">

        <div className="card">
          <div className="card-label-row">
            <div className="card-label">Today&apos;s schedule</div>
            <span className="card-link">full week →</span>
          </div>
          {schedule.map((item) => (
            <div
              key={item.time}
              className={`timeline-item ${item.now ? "timeline-item--now" : ""}`}
            >
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-body">
                <div className="timeline-dot" style={{ background: item.color }} />
                <div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-meta">
                    <span className={`tag ${item.tagClass}`}>{item.tag}</span>
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col">
          <div className="card">
            <div className="card-label-row">
              <div className="card-label">End-of-day checklist</div>
              <span className="card-link" onClick={() => setChecklist(defaultChecklist)}>reset</span>
            </div>
            {checklist.map((item) => (
              <div key={item.id} className="check-item">
                <button
                  className={`checkbox ${item.done ? "checkbox--checked" : ""}`}
                  onClick={() => toggleCheck(item.id)}
                  aria-label={item.done ? "Mark incomplete" : "Mark complete"}
                />
                <span className={`check-label ${item.done ? "check-label--done" : ""}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="card quick-note">
            <div className="card-label">Quick note</div>
            <textarea
              rows={4}
              placeholder="Capture anything worth remembering today — wins, blockers, ideas, observations..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="quick-note-footer">
              <button className="btn btn-solid btn-sm">Save note</button>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity + Activity */}
      <div className="grid-2">

        <div className="card">
          <div className="card-label">Weekly productivity</div>
          {metrics.map((m) => (
            <div key={m.label} className="metric-row">
              <div className="metric-label">{m.label}</div>
              <div className="metric-bar-wrap">
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
              <div className="metric-value">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-label">Recent activity</div>
          {loading ? (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink4)" }}>Loading...</p>
          ) : activity.length === 0 ? (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink4)" }}>No activity yet.</p>
          ) : (
            activity.map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: item.color }} />
                <div className="activity-title">{item.title}</div>
                <div className="activity-time">{item.time}</div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
