// Student portal API helpers. The session lives in an HttpOnly cookie, so every call sends credentials.
export const API = (
  import.meta.env.VITE_API_URL || "http://localhost:8787"
).replace(/\/$/, "");

export const AUTH_CHANGED_EVENT = "student-auth-changed";

export const notifyAuthChanged = () =>
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

export type StudentProfile = {
  studentId: string;
  name: string;
  email: string;
  course?: string;
};

export type AssignedCourse = {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  category: string;
  level: string;
  duration: string;
};

export type StudentBatch = {
  id: string;
  mode: "Online" | "Classroom";
  batch_name: string;
  status: string;
  start_date: string;
  days: string;
  timing: string;
  trainer: string;
  center: string;
  platform: string;
  meeting_link: string;
};

export type AssignedCourseDetails = AssignedCourse & {
  syllabus?: string[];
  modules?: { title: string; topics: string[] }[];
  outcomes?: string[];
  projects?: string[];
  prerequisites?: string[];
  schedule?: string;
  batches: StudentBatch[];
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function studentFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: { Accept: "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || `Request failed (${response.status})`, response.status);
  }

  return data as T;
}

export const logoutStudent = async () => {
  try {
    await studentFetch("/api/student-auth/logout", { method: "POST" });
  } finally {
    notifyAuthChanged();
  }
};

/** Only same-site, in-app paths are accepted as a post-login destination. */
export function safeRedirectPath(value: unknown, fallback = "/student-dashboard") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  if (value.startsWith("/login") || value.startsWith("/register")) return fallback;
  return value;
}
