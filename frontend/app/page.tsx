"use client";

import { useState, useEffect } from "react";
import "./page.css";

const schedule = [
  { time: "09:00", title: "Daily standup", tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", duration: "15 min", now: true },
  { time: "10:00", title: "Auth API integration", tag: "Dev", tagClass: "tag-blue", color: "#93c5fd", duration: "2h", now: false },
  { time: "13:00", title: "Backlog refinement", tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", duration: "60 min", now: false },
  { time: "15:00", title: "Sprint mid-point report", tag: "Doc", tagClass: "tag-amber", color: "#fcd34d", duration: "", now: false },
  { time: "16:30", title: "1-on-1s — James & Aisha", tag: "Team", tagClass: "tag-green", color: "#6ee7b7", duration: "", now: false },
];

const defaultChecklist = [
  { id: 1, label: "Ran standup",                done: true },
  { id: 2, label: "Updated sprint board",        done: true },
  { id: 3, label: "Write & share meeting minutes", done: false },
  { id: 4, label: "Log blockers",               done: false },
  { id: 5, label: "Review tomorrow's schedule", done: false },
  { id: 6, label: "Log dev work",               done: false },
];

const activity = [
  { title: "Sprint 1 retro notes uploaded",         time: "Yesterday · 4:12 PM", color: "#6ee7b7" },
  { title: "Blocker resolved — QA env provisioning", time: "Yesterday · 11:30 AM", color: "#6ee7b7" },
  { title: "Goal completed — Team Scrum onboarding", time: "Mon · 3:00 PM",       color: "#a78bfa" },
  { title: "Dev log — session management merged",    time: "Mon · 11:00 AM",      color: "#93c5fd" },
  { title: "Collections report formatted & uploaded", time: "Fri · 2:15 PM",      color: "#fcd34d" },
];

const metrics = [
  { label: "Deep work (coding)",     value: "7.5h", pct: 65, color: "var(--purple)" },
  { label: "Meetings & ceremonies",  value: "4.5h", pct: 40, color: "var(--amber)" },
  { label: "Documentation",          value: "2.5h", pct: 22, color: "var(--blue)" },
  { label: "Planning & strategy",    value: "1.5h", pct: 15, color: "var(--green)" },
];

export default function Overview() {
  const [greeting, setGreeting] = useState("Good morning");
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [note, setNote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");
  }, []);

  function toggleCheck(id: number) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  return (
    <main className="page">

      {/* Page heading */}
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
            68<span className="stat-unit">%</span>
          </div>
          <div className="bar-track-light">
            <div className="bar-fill-light" style={{ width: "68%" }} />
          </div>
          <div className="stat-sub-light">Sprint 1 · Day 6 of 10</div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Open blockers</div>
          <div className="stat">2</div>
          <div className="stat-sub">1 high priority</div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Goals this month</div>
          <div className="stat">
            4<span className="stat-unit-dark">/7</span>
          </div>
          <div className="stat-sub">On track</div>
        </div>

        <div className="card">
          <div className="stat-sub" style={{ marginBottom: 6 }}>Dev hours this week</div>
          <div className="stat">7.5</div>
          <div className="stat-sub">Across 4 tasks</div>
        </div>
      </div>

      {/* Schedule + Checklist/Note */}
      <div className="grid-2">

        {/* Today's schedule */}
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
          {/* End-of-day checklist */}
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

          {/* Quick note */}
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

        {/* Weekly productivity */}
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

        {/* Recent activity */}
        <div className="card">
          <div className="card-label">Recent activity</div>
          {activity.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" style={{ background: item.color }} />
              <div className="activity-title">{item.title}</div>
              <div className="activity-time">{item.time}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
