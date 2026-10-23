import fs from "node:fs";
import { pythonLessons } from "../src/python/lessons.ts";
const required = {
  "Setup, REPL and scripts": "variables",
  "Variables and assignment": "variables",
  "Data types and operators": "variables",
  "Strings and input/output": "variables",
  Conditionals: "loops",
  "Loops and comprehensions": "loops",
  "Lists, tuples, dictionaries and sets": null,
  "Functions and scope": "functions",
  "Modules and packages": null,
  "Standard library": null,
  "Exceptions and debugging": "exceptions",
  "Files, pathlib, CSV and JSON": null,
  "Virtual environments and pip": null,
  "Typing and docstrings": null,
  "Testing with unittest and pytest": null,
  "OOP and dataclasses": "objects",
  "Iterators and generators": null,
  Decorators: null,
  "Context managers": null,
  "Concurrency and async": null,
  Performance: null,
  Security: null,
  NumPy: null,
  "Pandas cleaning and aggregation": "pandas",
  "Pandas joins": "pandas",
  Visualization: null,
  "HTTP APIs": null,
  "Automation and reproducibility": null,
  "Reporting pipeline capstone": null,
};
const coverage = {
  version: 1,
  courseComplete: false,
  editorialReview: "pending independent review",
  physicalAndroid: "unverified",
  requiredTopics: Object.entries(required).map(([topic, id]) => {
    const l = pythonLessons.find((l) => l.id === id);
    return {
      topic,
      status: l
        ? "foundation chapter implemented; wider topic acceptance pending"
        : "not authored",
      lessonURL: l ? `#/python/${l.id}` : null,
      examples: l?.examples.map((e) => e.title) || [],
      behaviorTests: l?.exercises.map((e) => e.id) || [],
      review: "pending",
    };
  }),
  chapters: pythonLessons.map((l) => ({
    id: l.id,
    url: `#/python/${l.id}`,
    words: l.sections
      .flatMap((s) => s.paragraphs)
      .join(" ")
      .split(/\s+/).length,
    examples: l.examples.length,
    exercises: l.exercises.length,
    recall: l.recall.length,
    referenceURLs: l.references.map((r) => r.url),
  })),
};
fs.mkdirSync("docs/python", { recursive: true });
for (const file of ["docs/python/coverage.json", "public/python-coverage.json"])
  fs.writeFileSync(file, JSON.stringify(coverage, null, 2) + "\n");
console.log(
  `${pythonLessons.length} authored chapters; ${coverage.requiredTopics.filter((t) => !t.lessonURL).length} required topic groups have no dedicated chapter. Full course acceptance: INCOMPLETE.`,
);
if (process.argv.includes("--release")) process.exitCode = 1;
