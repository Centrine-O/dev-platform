"use client";

import { useState, useEffect } from "react";
import { portfolioApi, XpBar, Project, PortfolioAchievement } from "@/lib/api";
import "./portfolio.css";

export default function Portfolio() {
  const [xpBars,       setXpBars]       = useState<XpBar[]>([]);
  const [projects,     setProjects]     = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<PortfolioAchievement[]>([]);
  const [loading,      setLoading]      = useState(true);

  async function fetchAll() {
    try {
      const [xpData, projectsData, achievementsData] = await Promise.all([
        portfolioApi.getXp(),
        portfolioApi.getProjects(),
        portfolioApi.getAchievements(),
      ]);
      setXpBars(xpData);
      setProjects(projectsData);
      setAchievements(achievementsData);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <main className="page">

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

      {loading ? (
        <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading...</p>
      ) : (
        <>
          {/* XP bars */}
          <div className="card">
            <div className="card-label">Technical XP</div>
            {xpBars.map((x) => (
              <div key={x.id} className="xp-bar">
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
                <div className="project-banner" style={{ background: p.banner_color }} />
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
                <div className="achievement-bar" style={{ background: a.bar_color }} />
                <div>
                  <div className="achievement-title">{a.title}</div>
                  <div className="achievement-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </main>
  );
}
