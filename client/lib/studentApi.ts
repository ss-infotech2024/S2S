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
  progress?: number;
  totalLessons?: number;
};

export type LessonResource =
  | { id: string; kind: "link"; title: string; url: string }
  | { id: string; kind: "file"; title: string; file_id: string; file_name: string };

export type Lesson = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  body: string;
  duration: string;
  required: boolean;
  resources: LessonResource[];
};

export type CourseModule = { id: string; title: string; description: string; lessons: Lesson[] };

export type CompletionStatus = {
  progress: number;
  completedLessonIds: string[];
  totalLessons: number;
  requirements: { key: string; label: string; met: boolean }[];
  eligible: boolean;
  requiresApproval: boolean;
};

export type CertificateInfo = {
  certificate_id: string;
  status: "issued" | "pending_approval";
  issued_at: string | null;
};

export type Assignment = {
  id: string;
  title: string;
  instructions: string;
  module_id: string;
  due_date: string;
  max_marks: number;
  pass_marks: number | null;
  required: boolean;
  is_final: boolean;
  allow_text: boolean;
  allow_file: boolean;
  submission: null | {
    status: "submitted" | "evaluated";
    text: string;
    file: { id: string; name: string } | null;
    submitted_at: string;
    late: boolean;
    marks?: number;
    feedback?: string;
    evaluated_at?: string;
  };
};

export const studentFileUrl = (fileId: string) => `${API}/api/student/files/${encodeURIComponent(fileId)}`;
export const certificatePdfUrl = (certificateId: string) =>
  `${API}/api/student/certificates/${encodeURIComponent(certificateId)}/pdf`;

/** Reads a File as base64 (without the data: prefix) for JSON uploads. */
export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ""));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

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
  curriculum: CourseModule[];
  completion: CompletionStatus;
  certificate: CertificateInfo | null;
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
