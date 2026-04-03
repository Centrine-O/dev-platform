"use client";

import { useState, useEffect } from "react";
import { blockerApi, Blocker } from "@/lib/api";
import "./blockers.css";

type Severity = "High" | "Med" | "Low";

const barClass: Record<string, string> = {
  High: "blocker-bar--high",
  Med:  "blocker-bar--med",
  Low:  "blocker-bar--low",
};

const badgeClass: Record<string, string> = {
  High: "badge--high",
  Med:  "badge--med",
  Low:  "badge--low",
};

const blankForm = {
  title:    "",
  severity: "High" as Severity,
  owner:    "",
  impact:   "",
};

function formatMeta(b: Blocker): string {
  const raised   = new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const resolved = b.resolved_at
    ? new Date(b.resolved_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : null;
  const parts = [
    b.owner ? `Owner: ${b.owner}` : null,
    `Raised: ${raised}`,
    resolved ? `Resolved: ${resolved}` : null,
    b.resolved_note ?? null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export default function Blockers() {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(blankForm);

  async function fetchBlockers() {
    try {
      const data = await blockerApi.getAll();
      setBlockers(data);
    } catch (err) {
      console.error("Failed to fetch blockers:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBlockers(); }, []);

  async function resolve(id: number) {
    // Optimistic update
    setBlockers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "resolved" as const } : b))
    );
    try {
      await blockerApi.resolve(id, "Marked resolved");
      await fetchBlockers();
    } catch (err) {
      console.error("Failed to resolve blocker:", err);
      await fetchBlockers();
    }
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await blockerApi.create({
        title:    form.title,
        severity: form.severity,
        owner:    form.owner  || undefined,
        impact:   form.impact || undefined,
      });
      await fetchBlockers();
      setForm(blankForm);
    } catch (err) {
      console.error("Failed to log blocker:", err);
    } finally {
      setSaving(false);
    }
  }

  const active   = blockers.filter((b) => b.status === "active");
  const resolved = blockers.filter((b) => b.status === "resolved");

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Sprint 1</div>
          <h1>Blockers & <em>impediments.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-solid" style={{ width: "auto" }}>+ Log blocker</button>
        </div>
      </div>

      <div className="grid-2">

        {/* Left — blocker list */}
        <div>
          {loading ? (
            <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading blockers...</p>
          ) : (
            <>
              <div className="section-label">Active — {active.length} open</div>

              {active.length === 0 && (
                <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)", marginBottom: 16 }}>
                  No active blockers.
                </p>
              )}

              {active.map((b) => (
                <div key={b.id} className="blocker">
                  <div className={`blocker-bar ${barClass[b.severity]}`} />
                  <div className="blocker-body">
                    <div className="blocker-title">{b.title}</div>
                    <div className="blocker-meta">{formatMeta(b)}</div>
                  </div>
                  <div className="blocker-right">
                    <span className={`badge ${badgeClass[b.severity]}`}>{b.severity}</span>
                    <button className="resolve-btn" onClick={() => resolve(b.id)}>
                      Mark resolved
                    </button>
                  </div>
                </div>
              ))}

              <div className="divider" />

              <div className="section-label">Resolved this sprint</div>

              {resolved.length === 0 && (
                <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>
                  None resolved yet.
                </p>
              )}

              {resolved.map((b) => (
                <div key={b.id} className="blocker blocker--resolved">
                  <div className="blocker-bar blocker-bar--done" />
                  <div className="blocker-body">
                    <div className="blocker-title">{b.title}</div>
                    <div className="blocker-meta">{formatMeta(b)}</div>
                  </div>
                  <div className="blocker-right">
                    <span className="badge badge--done">Done</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right — form */}
        <div className="card">
          <div className="card-label">Log a blocker</div>
          <div className="form-group">

            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="What is blocking the team?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}
                >
                  <option>High</option>
                  <option>Med</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="field">
                <label>Owner</label>
                <input
                  type="text"
                  placeholder="Who resolves this?"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label>Impact</label>
              <textarea
                rows={2}
                placeholder="What work is affected?"
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
              />
            </div>

            <button className="btn btn-solid" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Log blocker"}
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}
