import { it, expect } from "vitest";
import {
  emptyProgress,
  validateProgress,
  parseProgress,
  streak,
  coursePassed,
} from "../src/progress";
it("round-trips valid data and rejects schema/version/foreign IDs", () => {
  expect(parseProgress(JSON.stringify(emptyProgress()))).toEqual(
    emptyProgress(),
  );
  expect(() => validateProgress({ ...emptyProgress(), version: 1 })).toThrow();
  expect(() =>
    validateProgress({ ...emptyProgress(), bookmarks: ["unknown"] }),
  ).toThrow();
  expect(() => parseProgress("x")).toThrow();
  expect(() => parseProgress(" ".repeat(1000001))).toThrow();
  expect(() =>
    validateProgress({ ...emptyProgress(), fontSize: 99 }),
  ).toThrow();
});
it("does not accept a completed lesson without an assessment or an unearned capstone", () => {
  expect(() =>
    validateProgress({ ...emptyProgress(), completed: ["wfm-1"] }),
  ).toThrow();
  expect(() =>
    validateProgress({ ...emptyProgress(), capstones: ["wfm"] }),
  ).toThrow();
  const p = {
    ...emptyProgress(),
    completed: ["wfm-1", "wfm-2", "wfm-3"],
    assessments: ["wfm-1", "wfm-2", "wfm-3"],
  };
  expect(coursePassed("wfm", p)).toBe(false);
  expect(coursePassed("wfm", { ...p, capstones: ["wfm"] })).toBe(true);
});
it("deduplicates known identifiers and rejects malformed dates", () => {
  expect(
    validateProgress({ ...emptyProgress(), bookmarks: ["wfm-1", "wfm-1"] })
      .bookmarks,
  ).toEqual(["wfm-1"]);
  for (const date of ["2026-02-30", "bad", "2026-13-01"])
    expect(() =>
      validateProgress({ ...emptyProgress(), activity: [date] }),
    ).toThrow();
});
it("computes local day streak across yesterday, month boundaries and gaps", () => {
  expect(streak(["2026-10-20", "2026-10-21"], new Date(2026, 9, 22, 9))).toBe(
    2,
  );
  expect(streak(["2026-09-30", "2026-10-01"], new Date(2026, 9, 1, 9))).toBe(2);
  expect(streak(["2026-10-18"], new Date(2026, 9, 22, 9))).toBe(0);
});
