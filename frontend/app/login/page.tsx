"use client";

import { useState, FormEvent } from "react";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/auth";
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login(username, password);
      setToken(data.access_token);
      window.location.href = "/";
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg viewBox="0 0 14 14" fill="white" width="16" height="16">
              <path d="M7 1L2 4.5v5L7 13l5-3.5v-5L7 1z" />
            </svg>
          </div>
          <div>
            <div className="login-brand-name">Dev Life OS</div>
            <div className="login-brand-sub">Personal developer platform</div>
          </div>
        </div>

        <div className="login-heading">Welcome back.</div>
        <div className="login-sub">Sign in to access your platform.</div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="centrine"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="login-footer">Your data stays on your machine.</div>
      </div>
    </div>
  );
}
