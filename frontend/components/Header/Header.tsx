"use client";

import { useEffect, useState } from "react";
import "./header.css";

export default function Header() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDate(
        now.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };
    update();
  }, []);

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 14 14" fill="white" width="14" height="14">
            <path d="M7 1L2 4.5v5L7 13l5-3.5v-5L7 1z" />
          </svg>
        </div>
        <div>
          <div className="brand-name">Dev Life OS</div>
          <div className="brand-role">Centrine · Developer</div>
        </div>
      </div>

      <div className="header-right">
        {date && <span className="date-chip">{date}</span>}

        <button className="icon-btn" aria-label="Notifications">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M7 1.5a4.5 4.5 0 014.5 4.5v3l1 1.5H1.5L2.5 9V6A4.5 4.5 0 017 1.5z" />
            <path d="M5.5 11a1.5 1.5 0 003 0" />
          </svg>
          <span className="notif-dot" />
        </button>

        <button className="btn btn-ghost">Audit mode</button>
        <button className="btn btn-solid">+ New entry</button>

        <div className="avatar" aria-label="Profile">C</div>
      </div>
    </header>
  );
}
