import { readFileSync } from "node:fs";
import { it, expect } from "vitest";
it("practice dataset reconciles counts and expected totals", () => {
  const text = readFileSync("public/data/contact-intervals.csv", "utf8")
    .trim()
    .split(/\r?\n/);
  const headers = text.shift()!.split(",");
  const rows = text.map((row) => row.split(","));
  const dict = JSON.parse(
    readFileSync("public/data/data-dictionary.json", "utf8"),
  );
  expect(rows).toHaveLength(1344);
  const keys = new Set();
  for (const row of rows) {
    const key = row.slice(0, 3).join("|");
    expect(keys.has(key)).toBe(false);
    keys.add(key);
    expect(Number(row[3])).toBe(Number(row[4]) + Number(row[5]));
    expect(Number(row[6])).toBeLessThanOrEqual(Number(row[4]));
  }
  for (const [name, total] of Object.entries(dict.totals)) {
    const col = headers.indexOf(name);
    expect(rows.reduce((n, row) => n + Number(row[col]), 0)).toBe(total);
  }
});
