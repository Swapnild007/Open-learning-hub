import { describe, it, expect } from "vitest";
import { pythonLessons } from "../src/python/lessons";
import { emptyNotebook, parseNotebook } from "../src/python/storage";
describe("Python authored content contracts", () => {
  it("provides unique, structured chapters with substantive prose and executable tasks", () => {
    expect(new Set(pythonLessons.map((l) => l.id)).size).toBe(
      pythonLessons.length,
    );
    const exerciseIds = new Set<string>();
    for (const l of pythonLessons) {
      expect(
        l.sections
          .flatMap((s) => s.paragraphs)
          .join(" ")
          .split(/\s+/).length,
      ).toBeGreaterThan(500);
      expect(l.examples.length).toBeGreaterThanOrEqual(2);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
      expect(l.objectives.length).toBeGreaterThanOrEqual(3);
      expect(l.syntax.length).toBeGreaterThanOrEqual(3);
      expect(l.debugging.length).toBeGreaterThanOrEqual(3);
      for (const e of l.examples) {
        expect(e.walkthrough.length).toBeGreaterThanOrEqual(4);
        expect(e.output.length).toBeGreaterThan(0);
      }
      for (const e of l.exercises) {
        expect(exerciseIds.has(e.id)).toBe(false);
        exerciseIds.add(e.id);
        expect(e.tests).toContain("assert");
        expect(e.hints.length).toBeGreaterThanOrEqual(2);
      }
      for (const q of l.recall) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(50);
      }
      for (const p of l.prerequisites)
        expect(pythonLessons.findIndex((x) => x.id === p)).toBeLessThan(
          pythonLessons.indexOf(l),
        );
    }
  });
});
describe("Notebook backup validation", () => {
  it("round trips code, notes, exercise evidence and resume without changing text", () => {
    const b = emptyNotebook();
    b.notes.variables = "<script>literal note</script>\nPrediction: 7";
    b.code["variables-workload"] = "print(7)";
    b.passed = ["variables-workload"];
    b.lastLesson = "variables";
    expect(parseNotebook(JSON.stringify(b))).toEqual(b);
  });
  it("rejects corrupt, oversized and invalid records", () => {
    expect(() => parseNotebook("{bad")).toThrow();
    expect(() => parseNotebook(" ".repeat(2000001))).toThrow();
    for (const extra of [
      { version: 2 },
      { notes: [] },
      { code: { bad: 42 } },
      { completed: [5] },
      { recall: "no" },
      { lastLesson: "../escape" },
      { notes: { x: "x".repeat(100001) } },
    ])
      expect(() =>
        parseNotebook(JSON.stringify({ ...emptyNotebook(), ...extra })),
      ).toThrow();
  });
});
