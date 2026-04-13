const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Core fetch wrapper ──────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }

  // 204 No Content has no body
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ── Daily Log ───────────────────────────────────────────────────────────────

export type LogEntry = {
  id:         number;
  title:      string;
  type:       string;
  duration?:  string;
  tags?:      string;
  notes?:     string;
  created_at: string;
};

export const logApi = {
  getAll: ()                          => request<LogEntry[]>("/log/"),
  create: (body: Omit<LogEntry, "id" | "created_at">) =>
    request<LogEntry>("/log/", { method: "POST", body: JSON.stringify(body) }),
  remove: (id: number)                => request<void>(`/log/${id}`, { method: "DELETE" }),
};

// ── Meetings ────────────────────────────────────────────────────────────────

export type Meeting = {
  id:           number;
  title:        string;
  date:         string;
  duration?:    string;
  type:         string;
  attendees?:   string;
  key_points:   string;
  action_items?: string;
  created_at:   string;
};

export const meetingApi = {
  getAll: ()                               => request<Meeting[]>("/meetings/"),
  create: (body: Omit<Meeting, "id" | "created_at">) =>
    request<Meeting>("/meetings/", { method: "POST", body: JSON.stringify(body) }),
  remove: (id: number)                     => request<void>(`/meetings/${id}`, { method: "DELETE" }),
};

// ── Sprint ───────────────────────────────────────────────────────────────────

export type Sprint = {
  id:             number;
  name:           string;
  goal:           string;
  start_date:     string;
  end_date:       string;
  total_points:   number;
  done_points:    number;
  days_remaining: number;
  capacity_pct:   number;
};

export type Story = {
  id:        number;
  title:     string;
  points:    number;
  assignee?: string;
  status:    "backlog" | "inprogress" | "review" | "done";
};

export const sprintApi = {
  getSprint:   ()                              => request<Sprint>("/sprint/"),
  getStories:  (status?: string)               => request<Story[]>(`/sprint/stories${status ? `?status=${status}` : ""}`),
  createStory: (body: Omit<Story, "id">)       =>
    request<Story>("/sprint/stories", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (id: number, status: string)   =>
    request<Story>(`/sprint/stories/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  removeStory:  (id: number)                   => request<void>(`/sprint/stories/${id}`, { method: "DELETE" }),
};

// ── Blockers ─────────────────────────────────────────────────────────────────

export type Blocker = {
  id:            number;
  title:         string;
  severity:      "High" | "Med" | "Low";
  status:        "active" | "resolved";
  owner?:        string;
  impact?:       string;
  resolved_note?: string;
  created_at:    string;
  resolved_at?:  string;
};

export const blockerApi = {
  getAll:   (status?: string) => request<Blocker[]>(`/blockers/${status ? `?status=${status}` : ""}`),
  create:   (body: Pick<Blocker, "title" | "severity" | "owner" | "impact">) =>
    request<Blocker>("/blockers/", { method: "POST", body: JSON.stringify(body) }),
  resolve:  (id: number, resolved_note?: string) =>
    request<Blocker>(`/blockers/${id}/resolve`, { method: "PATCH", body: JSON.stringify({ resolved_note }) }),
  remove:   (id: number) => request<void>(`/blockers/${id}`, { method: "DELETE" }),
};

// ── Goals & Achievements ─────────────────────────────────────────────────────

export type Goal = {
  id:         number;
  label:      string;
  type:       "goal" | "achievement";
  done:       boolean;
  due_date?:  string;
  created_at: string;
};

export type Achievement = {
  id:         number;
  title:      string;
  created_at: string;
};

export const goalApi = {
  getAll:           ()                         => request<Goal[]>("/goals/"),
  create:           (body: Pick<Goal, "label" | "due_date">) =>
    request<Goal>("/goals/", { method: "POST", body: JSON.stringify(body) }),
  toggle:           (id: number, done: boolean) =>
    request<Goal>(`/goals/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ done }) }),
  remove:           (id: number)               => request<void>(`/goals/${id}`, { method: "DELETE" }),
  getAchievements:  ()                         => request<Achievement[]>("/goals/achievements"),
  addAchievement:   (title: string)            =>
    request<Achievement>("/goals/achievements", { method: "POST", body: JSON.stringify({ title }) }),
};

// ── Retros ───────────────────────────────────────────────────────────────────

export type RetroCard = {
  id:         number;
  text:       string;
  column:     "went-well" | "improve" | "actions";
  sprint?:    string;
  created_at: string;
};

export const retroApi = {
  getAll: (sprint?: string) => {
    const qs = sprint ? `?sprint=${encodeURIComponent(sprint)}` : "";
    return request<RetroCard[]>(`/retros/${qs}`);
  },
  create: (body: Pick<RetroCard, "text" | "column"> & { sprint?: string }) =>
    request<RetroCard>("/retros/", { method: "POST", body: JSON.stringify(body) }),
  remove: (id: number) => request<void>(`/retros/${id}`, { method: "DELETE" }),
};

// ── Files ────────────────────────────────────────────────────────────────────

export type FileEntry = {
  id:          number;
  filename:    string;
  ext:         string;
  category:    string;
  project?:    string;
  notes?:      string;
  size_bytes:  number;
  size_label:  string;
  uploaded_at: string;
};

export const fileApi = {
  getAll: (category?: string, project?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (project)  params.set("project", project);
    const qs = params.toString();
    return request<FileEntry[]>(`/files/${qs ? `?${qs}` : ""}`);
  },
  upload: (formData: FormData) =>
    fetch(`${BASE}/files/upload`, { method: "POST", body: formData }).then((r) => r.json()),
  remove: (id: number) => request<void>(`/files/${id}`, { method: "DELETE" }),
};
