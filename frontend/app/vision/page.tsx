"use client";

import { useState, KeyboardEvent } from "react";
import "./vision.css";

interface Goal {
  id: number;
  label: string;
  done: boolean;
  date: string;
}

interface Achievement {
  id: number;
  title: string;
  date: string;
}

const initialGoals: Goal[] = [
  { id: 1, label: "Run first sprint planning session",   done: true,  date: "Done" },
  { id: 2, label: "1-on-1s with all team members",       done: true,  date: "Done" },
  { id: 3, label: "Onboard team to Scrum ceremonies",    done: true,  date: "Done" },
  { id: 4, label: "Build Dev Life OS MVP",               done: true,  date: "Done" },
  { id: 5, label: "Enrol in PSM I certification",        done: false, date: "Apr 15" },
  { id: 6, label: "Deliver Sprint 1 successfully",       done: false, date: "Apr 10" },
  { id: 7, label: "Write Scrum process wiki for team",   done: false, date: "Apr 30" },
];

const initialAchievements: Achievement[] = [
  { id: 1, title: "Appointed first Scrum Master in the organisation", date: "1 Apr 2025" },
  { id: 2, title: "Onboarded team from 0 to first sprint in 5 days",  date: "28 Mar 2025" },
  { id: 3, title: "Resolved 2 blockers within 24h of being raised",   date: "29 Mar 2025" },
  { id: 4, title: "Launched Dev Life OS platform",                     date: "1 Apr 2025" },
];

const visionPills = [
  "PSM I certified",
  "Velocity ↑ 30%",
  "Platform shipped",
  "Mentor 1 junior",
  "Zero missed sprints",
];

export default function Vision() {
  const [goals, setGoals] = useState(initialGoals);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [newGoal, setNewGoal] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  const done  = goals.filter((g) => g.done).length;
  const total = goals.length;

  function toggleGoal(id: number) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  }

  function addGoal() {
    if (!newGoal.trim()) return;
    setGoals((prev) => [
      ...prev,
      { id: Date.now(), label: newGoal.trim(), done: false, date: "" },
    ]);
    setNewGoal("");
  }

  function addAchievement() {
    if (!newAchievement.trim()) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    setAchievements((prev) => [
      { id: Date.now(), title: newAchievement.trim(), date: today },
      ...prev,
    ]);
    setNewAchievement("");
  }

  function handleGoalKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addGoal();
  }

  function handleAchievementKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addAchievement();
  }

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Personal & professional</div>
          <h1>Vision & <em>goals.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-solid">+ Add goal</button>
        </div>
      </div>

      {/* Vision + stat cards */}
      <div className="grid-2">
        <div className="vision-card">
          <div className="vision-eyebrow">12-month vision</div>
          <div className="vision-quote">
            Build, ship, and document everything — become the developer who can show their work, <em>prove their impact,</em> and grow deliberately.
          </div>
          <div className="vision-pills">
            {visionPills.map((p) => (
              <span key={p} className="vision-pill">{p}</span>
            ))}
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="stat-label">Goals completed</div>
            <div className="stat">
              {done}<span className="stat-unit">/{total}</span>
            </div>
            <div className="stat-sub">April · {done === total ? "all done" : "in progress"}</div>
          </div>
          <div className="card">
            <div className="stat-label">Achievements logged</div>
            <div className="stat">{achievements.length}</div>
            <div className="stat-sub">Since platform launch</div>
          </div>
        </div>
      </div>

      {/* Goals + Achievements */}
      <div className="grid-2">

        {/* Goals checklist */}
        <div className="card">
          <div className="card-label">April goals</div>

          {goals.map((g) => (
            <div key={g.id} className="check-item">
              <button
                className={`checkbox ${g.done ? "checkbox--checked" : ""}`}
                onClick={() => toggleGoal(g.id)}
                aria-label={g.done ? "Mark incomplete" : "Mark complete"}
              />
              <span className={`check-label ${g.done ? "check-label--done" : ""}`}>
                {g.label}
              </span>
              {g.date && <span className="check-date">{g.date}</span>}
            </div>
          ))}

          <div className="add-goal">
            <input
              type="text"
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={handleGoalKey}
            />
            <button className="add-goal-btn" onClick={addGoal}>Add</button>
          </div>
        </div>

        {/* Achievements log */}
        <div className="card">
          <div className="card-label">Achievements log</div>

          {achievements.map((a) => (
            <div key={a.id} className="achievement">
              <div className="achievement-bar" />
              <div>
                <div className="achievement-title">{a.title}</div>
                <div className="achievement-date">{a.date}</div>
              </div>
            </div>
          ))}

          <div className="add-achievement">
            <input
              type="text"
              placeholder="Log an achievement..."
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyDown={handleAchievementKey}
            />
            <button className="add-achievement-btn" onClick={addAchievement}>Add</button>
          </div>
        </div>

      </div>
    </main>
  );
}
