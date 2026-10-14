
import {
  courses as fallbackCourses,
  type Course,
} from "@/data/courses";

const API_URL = import.meta.env.VITE_ADMIN_API_URL;

interface ApiCourse {
  id?: string;
  slug?: string;
  title?: string;
  short?: string;
  description?: string;
  duration?: string;
  fees?: string | number;
  level?: string;
  category?: string;
  syllabus?: string[];
  modules?: Course["modules"];
  projects?: string[];
  outcomes?: string[];
  prerequisites?: string[];
  schedule?: string;
  image?: string;
  published?: boolean;
}

export async function fetchCourses(): Promise<Course[]> {
  if (!API_URL) {
    return fallbackCourses;
  }

  try {
    const response = await fetch(`${API_URL}/api/courses`);

    if (!response.ok) {
      throw new Error(`Courses API failed: ${response.status}`);
    }

    const result: unknown = await response.json();

    // API normally returns an array; also support { value: [...] }.
    const data: ApiCourse[] = Array.isArray(result)
      ? result
      : result &&
          typeof result === "object" &&
          "value" in result &&
          Array.isArray((result as { value: unknown }).value)
        ? (result as { value: ApiCourse[] }).value
        : [];

    if (data.length === 0) {
      return fallbackCourses;
    }

    return data
      .filter((item) => item.published !== false)
      .map((item) => {
        const id = item.slug || item.id || "";
        const existing = fallbackCourses.find(
          (course) => course.id === id,
        );

        return {
          ...existing,
          id,
          title: item.title || existing?.title || "Untitled Course",
          short: item.short || existing?.short || "",
          description:
            item.description || existing?.description || "",
          duration: item.duration || existing?.duration || "",
          fees: String(item.fees ?? existing?.fees ?? ""),
          level:
            item.level === "Beginner" ||
            item.level === "Intermediate" ||
            item.level === "Advanced"
              ? item.level
              : existing?.level || "Beginner",
          category: item.category || existing?.category || "General",
          syllabus: item.syllabus || existing?.syllabus || [],
          modules: item.modules || existing?.modules,
          projects: item.projects || existing?.projects,
          outcomes: item.outcomes || existing?.outcomes || [],
          prerequisites:
            item.prerequisites || existing?.prerequisites,
          schedule: item.schedule || existing?.schedule,
          image: item.image || existing?.image,
        } satisfies Course;
      });
  } catch (error) {
    console.error("Unable to fetch courses from Admin API:", error);
    return fallbackCourses;
  }
}
