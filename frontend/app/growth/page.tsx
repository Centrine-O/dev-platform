"use client";

import { useState, KeyboardEvent } from "react";
import "./growth.css";

interface Skill {
  id: number;
  name: string;
  pct: number;
}

interface Cert {
  id: number;
  label: string;
  done: boolean;
  date: string;
}

interface Feedback {
  id: number;
  text: string;
  from: string;
}

const initialSkills: Skill[] = [
  { id: 1, name: "Scrum facilitation",         pct: 55 },
  { id: 2, name: "Backlog management",          pct: 45 },
  { id: 3, name: "Stakeholder communication",   pct: 70 },
  { id: 4, name: "Conflict resolution",         pct: 40 },
  { id: 5, name: "Full-stack development",      pct: 65 },
  { id: 6, name: "Technical documentation",     pct: 75 },
  { id: 7, name: "Report writing",              pct: 72 },
];

const initialCerts: Cert[] = [
  { id: 1, label: "Agile & Scrum fundamentals",          done: true,  date: "Mar '25" },
  { id: 2, label: "PSM I — Professional Scrum Master",   done: false, date: "Jun '25" },
  { id: 3, label: "Conflict resolution workshop",        done: false, date: "May '25" },
  { id: 4, label: "Advanced facilitation techniques",    done: false, date: "Jul '25" },
  { id: 5, label: "PSM II",                              done: false, date: "Dec '25" },
];

const initialFeedback: Feedback[] = [
  { id: 1, text: "Ran the planning session really well for a first time — kept us focused.", from: "James · 28 Mar" },
  { id: 2, text: "Good job flagging that blocker early, saved us half a day.",               from: "Aisha · 30 Mar" },
  { id: 3, text: "The retro format you introduced worked great — team opened up more.",      from: "Team · 31 Mar" },
];

export default function Growth() {
  const [skills, setSkills]         = useState(initialSkills);
  const [certs, setCerts]           = useState(initialCerts);
  const [feedback, setFeedback]     = useState(initialFeedback);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved]           = useState(false);
  const [editing, setEditing]       = useState(false);

  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [newFeedbackFrom, setNewFeedbackFrom] = useState("");

  function updateSkill(id: number, pct: number) {
    const clamped = Math.min(100, Math.max(0, pct));
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, pct: clamped } : s)));
  }

  function toggleCert(id: number) {
    setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  function saveReflection() {
    if (!reflection.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addFeedback() {
    if (!newFeedbackText.trim()) return;
    setFeedback((prev) => [
      { id: Date.now(), text: newFeedbackText.trim(), from: newFeedbackFrom.trim() || "Anonymous" },
      ...prev,
    ]);
    setNewFeedbackText("");
    setNewFeedbackFrom("");
  }

  function handleFeedbackKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addFeedback();
  }

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Self-assessment · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
          <h1>Personal <em>growth.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done editing" : "Reassess"}
          </button>
        </div>
      </div>

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
                <span className="cert-date">{c.date}</span>
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
                  <div className="feedback-from">{f.from}</div>
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
    </main>
  );
}
