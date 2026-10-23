export const PYTHON_KEY = "olh.python.v1";
export interface Notebook {
  version: 1;
  notes: Record<string, string>;
  code: Record<string, string>;
  passed: string[];
  recall: string[];
  completed: string[];
  lastLesson: string;
}
export const emptyNotebook = (): Notebook => ({
  version: 1,
  notes: {},
  code: {},
  passed: [],
  recall: [],
  completed: [],
  lastLesson: "",
});
export function parseNotebook(text: string): Notebook {
  if (text.length > 2000000) throw Error("Notebook exceeds 2 MB.");
  const n = JSON.parse(text);
  if (!n || n.version !== 1) throw Error("Unknown notebook format.");
  for (const key of ["notes", "code"]) {
    const map = n[key];
    if (
      !map ||
      typeof map !== "object" ||
      Array.isArray(map) ||
      Object.keys(map).length > 1000 ||
      Object.entries(map).some(
        ([k, v]) =>
          !/^[-a-z0-9]+$/.test(k) || typeof v !== "string" || v.length > 100000,
      )
    )
      throw Error(`Invalid ${key}.`);
  }
  for (const key of ["passed", "recall", "completed"])
    if (
      !Array.isArray(n[key]) ||
      n[key].length > 1000 ||
      n[key].some(
        (s: unknown) => typeof s !== "string" || !/^[-a-z0-9]+$/.test(s),
      )
    )
      throw Error(`Invalid ${key}.`);
  if (typeof n.lastLesson !== "string" || !/^[-a-z0-9]*$/.test(n.lastLesson))
    throw Error("Invalid resume lesson.");
  return {
    version: 1,
    notes: n.notes,
    code: n.code,
    passed: n.passed,
    recall: n.recall,
    completed: n.completed,
    lastLesson: n.lastLesson,
  };
}
export function loadNotebook(): { notebook: Notebook; error: string } {
  try {
    const text = localStorage.getItem(PYTHON_KEY);
    return {
      notebook: text ? parseNotebook(text) : emptyNotebook(),
      error: "",
    };
  } catch {
    return {
      notebook: emptyNotebook(),
      error:
        "Your saved Python notebook could not be read. It has been preserved. Export the raw backup before resetting or importing a valid notebook.",
    };
  }
}
