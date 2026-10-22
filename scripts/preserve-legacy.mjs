// Only evaluates the trusted repository-authored array literal in an empty VM.
// This is a build-time migration, not a learner code execution path.
import fs from "node:fs";
import vm from "node:vm";
const html = fs.readFileSync("python-curriculum.html", "utf8");
const start = html.indexOf("const lessons = ") + 16;
const end = html.indexOf("\n];", start) + 2;
if (start < 16 || end < 2)
  throw Error("Legacy lesson boundary changed; review the migration.");
const lessons = vm.runInNewContext(
  html.slice(start, end),
  Object.create(null),
  { timeout: 1000 },
);
for (const lesson of lessons) {
  for (const key of ["code", "output"])
    if (typeof lesson[key] === "string")
      lesson[key] = lesson[key].replace(/\\+"/g, '"').replace(/\\+\n/g, "\n");
}
let migrated =
  html.slice(0, start) + JSON.stringify(lessons, null, 2) + html.slice(end);
migrated = migrated
  .replace("16 guided lessons", `${lessons.length} guided lessons`)
  .replace('aria-valuemax="16"', `aria-valuemax="${lessons.length}"`)
  .replace("0 of 16 lessons passed", `0 of ${lessons.length} lessons passed`);
for (const prefix of ["public/", "public/legacy/"])
  fs.writeFileSync(prefix + "python-curriculum.html", migrated);
fs.writeFileSync(
  "/tmp/legacy-python-examples.json",
  JSON.stringify(lessons.map((l) => ({ id: l.id, code: l.code }))),
);
console.log(
  `Preserved ${lessons.length} legacy Python lessons; repaired display escaping in served copies only.`,
);
