import fs from "node:fs";
import path from "node:path";
import { loadPyodide } from "pyodide";
import { pythonLessons } from "../src/python/lessons.ts";
const py = await loadPyodide({
  indexURL: path.resolve("public/python-runtime") + "/",
});
await py.loadPackage("pandas");
let count = 0;
function execute(code, tests) {
  let output = "";
  py.setStdout({
    write: (buffer) => {
      output += new TextDecoder().decode(buffer);
      return buffer.length;
    },
  });
  const scope = py.toPy({ __name__: "__main__" });
  try {
    scope.set("__code", code);
    py.runPython(
      'try:\n    exec(compile(__code,"learner.py","exec"),globals())\nfinally:\n    __import__("sys").stdout.flush()\n    __import__("sys").stderr.flush()',
      {
        globals: scope,
      },
    );
    if (tests) {
      scope.set("__observed_stdout", output);
      scope.set("__tests", tests);
      py.runPython('exec(compile(__tests,"checks.py","exec"),globals())', {
        globals: scope,
      });
    }
    return output;
  } finally {
    scope.destroy();
  }
}
const recallProofs = {
  variables: "x = 4\ny = x + 1\nx = 9\nprint(0 if y == 5 else 1)",
  loops:
    "accepted = [x for x in [-1, 0, 1] if x >= 0]\nprint(1 if accepted == [0, 1] else 0)",
  functions:
    "def calculation():\n    pass\nprint(2 if calculation() is None else 0)",
  exceptions: 'try:\n    "bad" / 2\nexcept TypeError:\n    print(1)',
  objects:
    'from dataclasses import dataclass\n@dataclass\nclass Record:\n    contacts: int\nrecord = Record("unvalidated")\nprint(1 if isinstance(record.contacts, str) else 0)',
  pandas:
    'import pandas as pd\nf = pd.DataFrame({"timely":[90,10],"offered":[100,20]})\nprint(1 if abs(f.timely.sum()/f.offered.sum() - 100/120) < 1e-12 else 0)',
};
for (const l of pythonLessons) {
  for (const e of l.examples) {
    const out = execute(e.code);
    if (out !== e.output)
      throw Error(
        `${l.id}/${e.title}: expected ${JSON.stringify(e.output)}, got ${JSON.stringify(out)}`,
      );
    count++;
  }
  for (const e of l.exercises) {
    execute(e.solution, e.tests);
    count++;
    let failed = false;
    try {
      execute(e.starter, e.tests);
    } catch {
      failed = true;
    }
    if (!failed) throw Error(`Starter already passes: ${e.id}`);
    count++;
  }
  const recallOutput = execute(recallProofs[l.id]);
  if (recallOutput !== String(l.recall[0].correct) + "\n")
    throw Error(`Recall answer mismatch: ${l.id}`);
  count++;
  console.log(
    `Verified ${l.id}: ${l.examples.length} outputs, ${l.exercises.length} passing solutions, ${l.exercises.length} rejected starters`,
  );
}
console.log(
  `PASS: ${count} executable curriculum checks using Python ${py.runPython("import sys; sys.version.split()[0]")}`,
);
fs.mkdirSync("docs/python", { recursive: true });
fs.writeFileSync(
  "docs/python/execution-evidence.json",
  JSON.stringify(
    {
      runtime: "Pyodide 0.27.7 / CPython 3.12",
      checks: count,
      lessons: pythonLessons.map((l) => ({
        id: l.id,
        examples: l.examples.length,
        solutions: l.exercises.length,
        rejectedStarters: l.exercises.length,
        recallProofs: l.recall.length,
      })),
      review:
        "Automated executable checks only; independent editorial review pending.",
    },
    null,
    2,
  ) + "\n",
);
