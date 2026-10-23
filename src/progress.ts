import { courses, lessons } from "./content/catalog";
export const STORAGE_KEY = "olh.progress.v2";
export interface Progress {
  version: 2;
  completed: string[];
  bookmarks: string[];
  assessments: string[];
  capstones: string[];
  activity: string[];
  lastLesson: string | null;
  theme: "light" | "dark";
  fontSize: number;
}
export const emptyProgress = (): Progress => ({
  version: 2,
  completed: [],
  bookmarks: [],
  assessments: [],
  capstones: [],
  activity: [],
  lastLesson: null,
  theme: "light",
  fontSize: 18,
});
const lessonIds = new Set(lessons.map((l) => l.id)),
  courseIds = new Set(courses.map((c) => c.id));
export function validateProgress(raw: unknown): Progress {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Progress must be a JSON object.");
  const p = raw as Record<string, unknown>;
  if (p.version !== 2)
    throw Error("Unsupported progress version. Keep your original export.");
  function ids(key: string, allowed: Set<string>) {
    const a = p[key];
    if (
      !Array.isArray(a) ||
      a.length > 500 ||
      a.some((id) => typeof id !== "string" || !allowed.has(id))
    )
      throw Error(`Invalid ${key}.`);
    return [...new Set(a)] as string[];
  }
  const completed = ids("completed", lessonIds),
    assessments = ids("assessments", lessonIds),
    capstones = ids("capstones", courseIds);
  if (completed.some((id) => !assessments.includes(id)))
    throw Error("Completed lessons require a recorded assessment.");
  if (
    capstones.some(
      (id) =>
        !courses
          .find((c) => c.id === id)!
          .lessons.every((l) => completed.includes(l.id)),
    )
  )
    throw Error("Capstones require completed course lessons.");
  if (
    !Array.isArray(p.activity) ||
    p.activity.length > 10000 ||
    p.activity.some(
      (d) =>
        typeof d !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(d) ||
        new Date(d).toISOString().slice(0, 10) !== d,
    )
  )
    throw Error("Invalid activity dates.");
  if (
    p.lastLesson !== null &&
    (typeof p.lastLesson !== "string" || !lessonIds.has(p.lastLesson))
  )
    throw Error("Unknown resume lesson.");
  if (p.theme !== "light" && p.theme !== "dark") throw Error("Invalid theme.");
  if (
    typeof p.fontSize !== "number" ||
    !Number.isInteger(p.fontSize) ||
    p.fontSize < 16 ||
    p.fontSize > 24
  )
    throw Error("Invalid reading size.");
  return {
    version: 2,
    completed,
    assessments,
    bookmarks: ids("bookmarks", lessonIds),
    capstones,
    activity: [...new Set(p.activity as string[])].sort(),
    lastLesson: p.lastLesson as string | null,
    theme: p.theme,
    fontSize: p.fontSize,
  };
}
export function parseProgress(text: string) {
  if (text.length > 1000000) throw Error("Progress file exceeds 1 MB.");
  return validateProgress(JSON.parse(text));
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function streak(activity: string[], today = new Date()) {
  const set = new Set(activity);
  const d = new Date(today);
  d.setHours(12, 0, 0, 0);
  if (!set.has(localDate(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(localDate(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
export function coursePassed(id: string, p: Progress) {
  const c = courses.find((c) => c.id === id);
  return (
    !!c &&
    c.lessons.every((l) => p.completed.includes(l.id)) &&
    p.capstones.includes(id)
  );
}
export function loadProgress(): { progress: Progress; error: string } {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return {
      progress: text ? parseProgress(text) : emptyProgress(),
      error: "",
    };
  } catch {
    return {
      progress: emptyProgress(),
      error:
        "Saved progress could not be loaded. It has not been overwritten. Export or restore a valid backup before saving new progress.",
    };
  }
}
export function download(
  name: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
