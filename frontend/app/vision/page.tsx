"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { goalApi, Goal, Achievement } from "@/lib/api";
import "./vision.css";

const visionPills = [
  "PSM I certified",
  "Velocity ↑ 30%",
  "Platform shipped",
  "Mentor 1 junior",
  "Zero missed sprints",
];

export default function Vision() {
  const [goals,          setGoals]          = useState<Goal[]>([]);
  const [achievements,   setAchievements]   = useState<Achievement[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [newGoal,        setNewGoal]        = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  async function fetchAll() {
    try {
      const [goalsData, achievementsData] = await Promise.all([
        goalApi.getAll(),
        goalApi.getAchievements(),
      ]);
      setGoals(goalsData);
      setAchievements(achievementsData);
    } catch (err) {
      console.error("Failed to fetch vision data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function toggleGoal(id: number, current: boolean) {
    // Optimistic update
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !current } : g)));
    try {
      await goalApi.toggle(id, !current);
    } catch (err) {
      console.error("Failed to toggle goal:", err);
      await fetchAll();
    }
  }

  async function addGoal() {
    if (!newGoal.trim()) return;
    try {
      await goalApi.create({ label: newGoal.trim() });
      setNewGoal("");
      await fetchAll();
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  }

  async function addAchievement() {
    if (!newAchievement.trim()) return;
    try {
      await goalApi.addAchievement(newAchievement.trim());
      setNewAchievement("");
      await fetchAll();
    } catch (err) {
      console.error("Failed to add achievement:", err);
    }
  }

  function handleGoalKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addGoal();
  }

  function handleAchievementKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addAchievement();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  const done  = goals.filter((g) => g.done).length;
  const total = goals.length;

  return (
    <main className="page">

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
            <div className="stat-sub">April · {done === total && total > 0 ? "all done" : "in progress"}</div>
          </div>
          <div className="card">
            <div className="stat-label">Achievements logged</div>
            <div className="stat">{achievements.length}</div>
            <div className="stat-sub">Since platform launch</div>
          </div>
        </div>
      </div>

      {/* Goals + Achievements */}
      {loading ? (
        <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading...</p>
      ) : (
        <div className="grid-2">

          {/* Goals checklist */}
          <div className="card">
            <div className="card-label">April goals</div>

            {goals.map((g) => (
              <div key={g.id} className="check-item">
                <button
                  className={`checkbox ${g.done ? "checkbox--checked" : ""}`}
                  onClick={() => toggleGoal(g.id, g.done)}
                  aria-label={g.done ? "Mark incomplete" : "Mark complete"}
                />
                <span className={`check-label ${g.done ? "check-label--done" : ""}`}>
                  {g.label}
                </span>
                {g.due_date && (
                  <span className="check-date">{g.due_date}</span>
                )}
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
                  <div className="achievement-date">{formatDate(a.created_at)}</div>
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
      )}
    </main>
  );
}
