"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./nav.css";

const tabs = [
  {
    label: "Overview",
    href: "/",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="1" width="4" height="4" rx=".8" />
        <rect x="7" y="1" width="4" height="4" rx=".8" />
        <rect x="1" y="7" width="4" height="4" rx=".8" />
        <rect x="7" y="7" width="4" height="4" rx=".8" />
      </svg>
    ),
  },
  {
    label: "Daily log",
    href: "/daily-log",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="2" width="10" height="9" rx="1.2" />
        <path d="M4 1v2M8 1v2M1 6h10" />
      </svg>
    ),
  },
  {
    label: "Sprint board",
    href: "/sprint",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="1" width="10" height="10" rx="1.2" />
        <path d="M3 1v10M6 1v10M9 1v10" />
      </svg>
    ),
  },
  {
    label: "Meetings",
    href: "/meetings",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="4" cy="4" r="2.5" />
        <circle cx="9" cy="4" r="1.5" />
        <path d="M1 11c0-2 1.3-3 3-3s3 1 3 3" />
        <path d="M9 8c1.2.3 2 1.2 2 3" />
      </svg>
    ),
  },
  {
    label: "Retros",
    href: "/retros",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M2 9V4a1 1 0 011-1h6a1 1 0 011 1v5l-2-1.2L6 9 4 7.8 2 9z" />
      </svg>
    ),
  },
  {
    label: "Blockers",
    href: "/blockers",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M6 1.5L11 10H1L6 1.5z" />
        <path d="M6 5v2.5" />
        <circle cx="6" cy="9" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Vision & goals",
    href: "/vision",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="6" cy="6" r="4" />
        <circle cx="6" cy="6" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Growth",
    href: "/growth",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M1 9l3-4 2.5 2.5L9 4l3 2" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="3" width="10" height="8" rx="1" />
        <path d="M4 3V2a1 1 0 011-1h2a1 1 0 011 1v1" />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M3 1h5l3 3v7H3V1z" />
        <path d="M8 1v3h3M4 6h5M4 8.5h3" />
      </svg>
    ),
  },
  {
    label: "Archive",
    href: "/archive",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1" y="1" width="10" height="3" rx="1" />
        <path d="M2 4v6a1 1 0 001 1h6a1 1 0 001-1V4" />
        <path d="M5 7h2" />
      </svg>
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav-bar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-tab ${isActive ? "nav-tab--active" : ""}`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
