import { describe, it, expect } from "vitest";
import {
  courses,
  lessons,
  tracks,
  searchContent,
} from "../src/content/catalog";
import { sources } from "../src/content/sources";
describe("Curriculum integrity", () => {
  it("contains exactly 36 unique course IDs and titles, six tracks of six", () => {
    expect(courses).toHaveLength(36);
    expect(new Set(courses.map((c) => c.id)).size).toBe(36);
    expect(new Set(courses.map((c) => c.title)).size).toBe(36);
    expect(tracks).toHaveLength(6);
    tracks.forEach((t) =>
      expect(courses.filter((c) => c.track === t)).toHaveLength(6),
    );
  });
  it("has distinct lesson IDs and substantial nonempty topic-specific content", () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    expect(new Set(lessons.map((l) => l.explanation)).size).toBe(
      lessons.length,
    );
    for (const l of lessons) {
      expect(l.explanation.length).toBeGreaterThan(220);
      for (const key of [
        "title",
        "example",
        "question",
        "answer",
        "distractor",
        "assignment",
      ] as const)
        expect(l[key].trim().length).toBeGreaterThan(0);
      expect(l.answer).not.toBe(l.distractor);
      expect(sources.some((s) => s.id === l.source)).toBe(true);
    }
  });
  it("has valid acyclic prerequisites and ordered levels", () => {
    for (const c of courses) {
      expect(c.lessons.map((l) => l.level)).toEqual([
        "Beginner",
        "Intermediate",
        "Advanced",
      ]);
      const visit = (id: string, seen: Set<string>) => {
        expect(seen.has(id)).toBe(false);
        const next = courses.find((x) => x.id === id);
        expect(next).toBeDefined();
        next!.prerequisites.forEach((p) => visit(p, new Set([...seen, id])));
      };
      visit(c.id, new Set());
      expect(c.capstone.rubric).toHaveLength(4);
    }
  });
  it("finds content within explanations and returns no unrelated result", () => {
    expect(
      searchContent("shrinkage").some((l) => l.courseId === "staffing"),
    ).toBe(true);
    expect(searchContent("null").some((l) => l.courseId === "sql")).toBe(true);
    expect(searchContent("   ")).toEqual([]);
    expect(searchContent("unfindablezzzz")).toEqual([]);
    expect(searchContent("SQL")).toEqual(searchContent("sql"));
  });
});
