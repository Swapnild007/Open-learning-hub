import fs from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = "node_modules/pyodide";
const target = "public/python-runtime";
fs.mkdirSync(target, { recursive: true });
for (const f of [
  "package.json",
  "pyodide.js",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
])
  fs.copyFileSync(`${root}/${f}`, `${target}/${f}`);
const lock = JSON.parse(fs.readFileSync(`${root}/pyodide-lock.json`));
const required = new Set();
function include(name) {
  if (required.has(name)) return;
  required.add(name);
  lock.packages[name].depends.forEach(include);
}
include("pandas");
for (const name of required) {
  const p = lock.packages[name],
    file = `${target}/${p.file_name}`;
  const valid = () =>
    fs.existsSync(file) &&
    createHash("sha256").update(fs.readFileSync(file)).digest("hex") ===
      p.sha256;
  if (!valid()) {
    const url = `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/${p.file_name}`;
    // curl honors the environment's HTTPS proxy; checksums come from the npm-integrity-verified lock.
    execFileSync(
      "curl",
      [
        "--fail",
        "--location",
        "--retry",
        "2",
        "--output",
        `${file}.download`,
        url,
      ],
      { stdio: "inherit" },
    );
    if (
      createHash("sha256")
        .update(fs.readFileSync(`${file}.download`))
        .digest("hex") !== p.sha256
    )
      throw Error(`Checksum mismatch: ${name}`);
    fs.renameSync(`${file}.download`, file);
  }
  console.log(`Verified Python package ${name} ${p.version}`);
}
