"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { growthApi, Skill, Cert, GrowthFeedback } from "@/lib/api";
import "./growth.css";

export default function Growth() {
  const [skills,         setSkills]         = useState<Skill[]>([]);
  const [certs,          setCerts]          = useState<Cert[]>([]);
  const [feedback,       setFeedback]       = useState<GrowthFeedback[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [editing,        setEditing]        = useState(false);
  const [reflection,     setReflection]     = useState("");
  const [saved,          setSaved]          = useState(false);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [newFeedbackFrom, setNewFeedbackFrom] = useState("");

  async function fetchAll() {
    try {
      const [skillsData, certsData, feedbackData] = await Promise.all([
        growthApi.getSkills(),
        growthApi.getCerts(),
        growthApi.getFeedback(),
      ]);
      setSkills(skillsData);
      setCerts(certsData);
      setFeedback(feedbackData);
    } catch (err) {
      console.error("Failed to load growth data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function updateSkill(id: number, pct: number) {
    const clamped = Math.min(100, Math.max(0, pct));
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, pct: clamped } : s)));
    try {
      await growthApi.updateSkill(id, clamped);
    } catch (err) {
      console.error("Failed to update skill:", err);
      await fetchAll();
    }
  }

  async function toggleCert(id: number) {
    setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
    try {
      await growthApi.toggleCert(id);
    } catch (err) {
      console.error("Failed to toggle cert:", err);
      await fetchAll();
    }
  }

  async function saveReflection() {
    if (!reflection.trim()) return;
    try {
      await growthApi.addReflection(reflection.trim());
      setSaved(true);
      setReflection("");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save reflection:", err);
    }
  }

  async function addFeedback() {
    if (!newFeedbackText.trim()) return;
    try {
      await growthApi.addFeedback(
        newFeedbackText.trim(),
        newFeedbackFrom.trim() || "Anonymous"
      );
      setNewFeedbackText("");
      setNewFeedbackFrom("");
      await fetchAll();
    } catch (err) {
      console.error("Failed to add feedback:", err);
    }
  }

  function handleFeedbackKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addFeedback();
  }

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">
            Self-assessment · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </div>
          <h1>Personal <em>growth.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done editing" : "Reassess"}
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading...</p>
      ) : (
        <div className="grid-2">

          {/* Left column */}
          <div className="col">

            {/* Skills */}
            <div className="card">
              <div className="card-label">Skills self-assessment</div>
              {skills.map((s) => (
                <div key={s.id} className="skill">
                  <div className="skill-top">
                    <span className="skill-name">{s.name}</span>
                    {editing ? (
                      <input
                        className="skill-input"
                        type="number"
                        min={0}
                        max={100}
                        value={s.pct}
                        onChange={(e) => updateSkill(s.id, Number(e.target.value))}
                      />
                    ) : (
                      <span className="skill-pct">{s.pct}%</span>
                    )}
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="card">
              <div className="card-label">Certifications roadmap</div>
              {certs.map((c) => (
                <div key={c.id} className="cert-item">
                  <button
                    className={`checkbox ${c.done ? "checkbox--checked" : ""}`}
                    onClick={() => toggleCert(c.id)}
                    aria-label={c.done ? "Mark incomplete" : "Mark complete"}
                  />
                  <span className={`cert-label ${c.done ? "cert-label--done" : ""}`}>
                    {c.label}
                  </span>
                  {c.due_date && <span className="cert-date">{c.due_date}</span>}
                </div>
              ))}
            </div>

          </div>

          {/* Right column */}
          <div className="col">

            {/* Weekly reflection */}
            <div className="card reflection">
              <div className="card-label">Weekly reflection</div>
              <textarea
                rows={6}
                placeholder="What did I learn this week? What would I do differently? What am I proud of?"
                value={reflection}
                onChange={(e) => { setReflection(e.target.value); setSaved(false); }}
              />
              <div className="reflection-footer">
                {saved && <span className="reflection-saved">Saved</span>}
                <button
                  className="btn btn-solid btn-sm"
                  style={{ marginLeft: "auto" }}
                  onClick={saveReflection}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Feedback received */}
            <div className="card">
              <div className="card-label">Feedback received</div>

              {feedback.map((f) => (
                <div key={f.id} className="feedback-item">
                  <div className="feedback-bar" />
                  <div>
                    <div className="feedback-text">&ldquo;{f.text}&rdquo;</div>
                    <div className="feedback-from">{f.author}</div>
                  </div>
                </div>
              ))}

              <div className="add-feedback">
                <input
                  type="text"
                  placeholder="What did someone say?"
                  value={newFeedbackText}
                  onChange={(e) => setNewFeedbackText(e.target.value)}
                  onKeyDown={handleFeedbackKey}
                />
                <div className="add-feedback-row">
                  <input
                    type="text"
                    placeholder="From (name · date)"
                    value={newFeedbackFrom}
                    onChange={(e) => setNewFeedbackFrom(e.target.value)}
                    onKeyDown={handleFeedbackKey}
                  />
                  <button className="btn btn-solid btn-sm" onClick={addFeedback}>Add</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
