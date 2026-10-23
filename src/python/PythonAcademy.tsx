import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { pythonLessons } from "./lessons";
import { executePython, type RunResult } from "./runtime";
import {
  loadNotebook,
  parseNotebook,
  PYTHON_KEY,
  type Notebook,
} from "./storage";
import { download } from "../progress";
import type { PythonLesson } from "./types";
const baseExtensions = [
  python(),
  EditorView.lineWrapping,
  EditorView.contentAttributes.of({ "aria-label": "Python code editor" }),
];
const extensions = [
  ...baseExtensions,
  syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, class: "py-token-keyword" },
      {
        tag: [tags.string, tags.special(tags.string), tags.character],
        class: "py-token-string",
      },
      { tag: [tags.number, tags.bool, tags.null], class: "py-token-number" },
      { tag: tags.comment, class: "py-token-comment" },
      { tag: tags.variableName, class: "py-token-variable" },
      { tag: [tags.operator, tags.punctuation], class: "py-token-operator" },
    ]),
  ),
];
export default function PythonAcademy({
  id,
  dark,
}: {
  id?: string;
  dark: boolean;
}) {
  const initial = useRef<ReturnType<typeof loadNotebook> | null>(null);
  if (!initial.current) initial.current = loadNotebook();
  const [book, setBook] = useState(initial.current.notebook);
  const current = useRef(book);
  const [error, setError] = useState(initial.current.error);
  const blocked = useRef(Boolean(initial.current.error));
  const [saved, setSaved] = useState(
    initial.current.error
      ? "Saved data preserved; current edits are not saved."
      : "Saved on this device",
  );
  const [tab, setTab] = useState("Read");
  const lesson = pythonLessons.find((l) => l.id === id);
  function change(fn: (b: Notebook) => Notebook) {
    const next = fn(current.current);
    if (JSON.stringify(next).length > 2000000) {
      setSaved(
        "Change not accepted: the notebook exceeds 2 MB. Export a backup, then shorten notes or code.",
      );
      return;
    }
    current.current = next;
    setBook(next);
    if (blocked.current) {
      setSaved("Changes are in memory only. Restore or export your notebook.");
      return;
    }
    try {
      localStorage.setItem(PYTHON_KEY, JSON.stringify(next));
      setSaved("Saved on this device");
    } catch {
      setSaved(
        "Not saved: storage is unavailable or full. Export your notebook now.",
      );
    }
  }
  useEffect(() => {
    if (lesson) change((b) => ({ ...b, lastLesson: lesson.id }));
    const handler = (e: StorageEvent) => {
      if (e.key === PYTHON_KEY) {
        blocked.current = true;
        setError(
          "The notebook changed in another tab. Export current edits, then reload to avoid overwriting that work.",
        );
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
    // A new keyed reader loads a fresh notebook on navigation.
  }, []);
  return (
    <div className="python-academy">
      <header className="python-heading">
        <span className="eyebrow">PYTHON ACADEMY · DEVELOPMENT EDITION</span>
        <p className="python-build" aria-label="Python build">
          Studio build {import.meta.env.OLH_BUILD_ID} · Pyodide 0.27.7
        </p>
        <h1>
          {lesson ? lesson.title : "Learn the language. Build the evidence."}
        </h1>
        <p>
          A local-first Python learning studio. Real CPython execution, your own
          notebook, and checks that test behavior.
        </p>
      </header>
      <div className="python-notebook-actions">
        <button
          onClick={() =>
            download("python-notebook.json", JSON.stringify(book, null, 2))
          }
        >
          Export notebook
        </button>
        <label className="python-import">
          Import notebook
          <input
            type="file"
            accept="application/json"
            aria-label="Import Python notebook"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 2000000) throw Error("Notebook exceeds 2 MB.");
                const next = parseNotebook(await file.text());
                if (
                  !window.confirm(
                    "Replace this browser’s Python notebook with the selected backup?",
                  )
                )
                  return;
                localStorage.setItem(PYTHON_KEY, JSON.stringify(next));
                blocked.current = false;
                current.current = next;
                setBook(next);
                setError("");
                setSaved("Imported and saved on this device");
              } catch (e) {
                setError(`Import rejected: ${String(e)}`);
              } finally {
                e.target.value = "";
              }
            }}
          />
        </label>
        <span role="status">{saved}</span>
      </div>
      {error && (
        <div role="alert" className="status-banner error">
          <p>{error}</p>
          <button
            onClick={() =>
              download(
                "python-notebook-raw.txt",
                localStorage.getItem(PYTHON_KEY) || "",
                "text/plain",
              )
            }
          >
            Export raw saved data
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Discard unreadable saved data and save the current in-memory notebook? Export a raw backup first.",
                )
              ) {
                try {
                  localStorage.setItem(
                    PYTHON_KEY,
                    JSON.stringify(current.current),
                  );
                  blocked.current = false;
                  setError("");
                  setSaved("Saved on this device");
                } catch {
                  setError(
                    "Storage is still unavailable. Export your notebook.",
                  );
                }
              }
            }}
          >
            Replace saved data
          </button>
        </div>
      )}
      {!lesson ? (
        <>
          {id && (
            <p role="alert">
              That Python lesson is not available. Choose a published lesson
              below.
            </p>
          )}
          <section className="panel">
            <h2>Build a durable understanding</h2>
            <p>
              No prerequisites for the first lesson. Start with names and
              values, predict the examples, run them, then solve both exercises
              and the recall check. Each lesson records completion only after
              its behavior checks and recall checks pass. You can read any
              lesson without unlocking it.
            </p>
            <p>
              {pythonLessons.length} foundation chapters are available in this
              implementation checkpoint. This is{" "}
              <strong>not yet the complete beginner-to-advanced course</strong>:
              modules, files, packaging, typing/testing, iterators, decorators,
              concurrency, NumPy, visualization, HTTP, automation and the
              reporting capstone still need full chapters and assessment.
            </p>
            {book.lastLesson &&
              pythonLessons.some((l) => l.id === book.lastLesson) && (
                <a className="primary" href={`#/python/${book.lastLesson}`}>
                  Resume Python learning
                </a>
              )}
          </section>
          <div className="python-syllabus-grid">
            {pythonLessons.map((l, i) => (
              <a
                className="panel python-chapter"
                href={`#/python/${l.id}`}
                key={l.id}
              >
                <span className="eyebrow">
                  CHAPTER {String(i + 1).padStart(2, "0")} · {l.level}
                </span>
                <h2>{l.title}</h2>
                <p>{l.objectives[0]}</p>
                <span>
                  {l.minutes} minutes ·{" "}
                  {book.completed.includes(l.id)
                    ? "Completed"
                    : "Ready to study"}
                </span>
              </a>
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className="python-mobile-tabs"
            role="group"
            aria-label="Lesson workspace"
          >
            <span>Workspace:</span>
            {["Read", "Code", "Notes"].map((t) => (
              <button
                key={t}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={`python-workspace workspace-${tab.toLowerCase()}`}>
            <aside className="python-syllabus">
              <a href="#/python">← Python syllabus</a>
              <h2>Your learning path</h2>
              <ol>
                {pythonLessons.map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#/python/${l.id}`}
                      aria-current={l.id === id ? "page" : undefined}
                    >
                      {book.completed.includes(l.id) ? "✓ " : ""}
                      {l.title}
                    </a>
                  </li>
                ))}
              </ol>
              <p>
                {book.completed.length} / {pythonLessons.length} published
                chapters completed
              </p>
              <p>
                Local learning evidence only; no trusted grades or
                certification.
              </p>
            </aside>
            <article
              className="python-prose"
              aria-label="Python lesson reading"
            >
              <span className="eyebrow">
                {lesson.level} · {lesson.minutes} MINUTES
              </span>
              <section>
                <h2>What you will learn</h2>
                <ul>
                  {lesson.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <p>
                  Prerequisites:{" "}
                  {lesson.prerequisites.length
                    ? lesson.prerequisites
                        .map(
                          (p) => pythonLessons.find((l) => l.id === p)?.title,
                        )
                        .join("; ")
                    : "None. Start here."}
                </p>
              </section>
              {lesson.sections.map((s) => (
                <section key={s.title}>
                  <h2>{s.title}</h2>
                  {s.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </section>
              ))}
              <section>
                <h2>Read the syntax</h2>
                <dl className="python-syntax">
                  {lesson.syntax.map((s) => (
                    <div key={s.token}>
                      <dt>
                        <code>{s.token}</code>
                      </dt>
                      <dd>{s.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              {lesson.examples.map((example, i) => (
                <section key={example.title}>
                  <h2>
                    Worked example {i + 1}: {example.title}
                  </h2>
                  <CodeMirror
                    value={example.code}
                    extensions={extensions}
                    theme={dark ? "dark" : "light"}
                    editable={false}
                    basicSetup={{ foldGutter: false }}
                  />
                  <h3>Expected stdout</h3>
                  <pre className="python-output">{example.output}</pre>
                  <h3>Walk through it</h3>
                  <ol>
                    {example.walkthrough.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <button
                    onClick={() => {
                      document.dispatchEvent(
                        new CustomEvent("python-example", {
                          detail: { code: example.code, index: i },
                        }),
                      );
                      setTab("Code");
                      requestAnimationFrame(() =>
                        document
                          .querySelector(".python-workspace")
                          ?.scrollIntoView({
                            block: "start",
                            behavior: "smooth",
                          }),
                      );
                    }}
                  >
                    Open example {i + 1} in the coding lab
                  </button>
                </section>
              ))}
              <section>
                <h2>Debug with a hypothesis</h2>
                {lesson.debugging.map((d) => (
                  <div key={d.symptom}>
                    <h3>{d.symptom}</h3>
                    <p>{d.explanation}</p>
                  </div>
                ))}
              </section>
              <RecallChecks
                lesson={lesson}
                passed={book.recall}
                onPass={(key) =>
                  change((b) => ({
                    ...b,
                    recall: [...new Set([...b.recall, key])],
                  }))
                }
              />
              <section className="source-note">
                <h2>Official references</h2>
                <p>
                  Original teaching text and synthetic examples. Source
                  retrieval and editorial status are recorded separately from
                  executable checks.
                </p>
                <ul>
                  {lesson.references.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.title}
                      </a>{" "}
                      — {r.version}. {r.license}{" "}
                      {r.retrieved
                        ? `Retrieved ${r.retrieved}.`
                        : "Web reference retrieval pending; automated examples are verified separately."}
                    </li>
                  ))}
                </ul>
              </section>
              <button
                className="primary"
                disabled={
                  book.completed.includes(lesson.id) ||
                  !lesson.exercises.every((e) => book.passed.includes(e.id)) ||
                  !lesson.recall.every((q) => book.recall.includes(q.id))
                }
                onClick={() =>
                  change((b) => ({
                    ...b,
                    completed: [...new Set([...b.completed, lesson.id])],
                  }))
                }
              >
                {book.completed.includes(lesson.id)
                  ? "Chapter completed"
                  : "Complete Python chapter"}
              </button>
              <p>
                Pass both coding exercises and the recall check to complete this
                chapter. Editing an assessed solution clears its pass and
                chapter completion until you recheck it.
              </p>
              <nav
                aria-label="Python chapter navigation"
                className="button-row"
              >
                {pythonLessons.indexOf(lesson) > 0 && (
                  <a
                    href={`#/python/${pythonLessons[pythonLessons.indexOf(lesson) - 1].id}`}
                  >
                    ← Previous chapter
                  </a>
                )}
                {pythonLessons.indexOf(lesson) < pythonLessons.length - 1 && (
                  <a
                    href={`#/python/${pythonLessons[pythonLessons.indexOf(lesson) + 1].id}`}
                  >
                    Next chapter →
                  </a>
                )}
              </nav>
            </article>
            <div className="python-lab-rail">
              <PythonLab
                lesson={lesson}
                dark={dark}
                book={book}
                change={change}
              />
              <section className="python-notes panel">
                <h2>My lesson notes</h2>
                <p>
                  Record your prediction, the result, and the rule you would
                  explain to a colleague. Notes stay in this browser and are
                  included in notebook export.
                </p>
                <label htmlFor="python-notes">Personal notes</label>
                <textarea
                  id="python-notes"
                  value={book.notes[lesson.id] || ""}
                  maxLength={100000}
                  onChange={(e) => {
                    const value = e.target.value;
                    change((b) => ({
                      ...b,
                      notes: { ...b.notes, [lesson.id]: value },
                    }));
                  }}
                  placeholder="What surprised you? What will you try next?"
                />
                <p>{saved}</p>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function RecallChecks({
  lesson,
  passed,
  onPass,
}: {
  lesson: PythonLesson;
  passed: string[];
  onPass: (id: string) => void;
}) {
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <section className="panel">
      <h2>Recall and explain</h2>
      {lesson.recall.map((q) => (
        <form
          key={q.id}
          onSubmit={(e) => {
            e.preventDefault();
            setChecked((c) => ({ ...c, [q.id]: true }));
            if (choices[q.id] === q.correct) onPass(q.id);
          }}
        >
          <fieldset>
            <legend>{q.prompt}</legend>
            {q.options.map((o, i) => (
              <label className="option" key={o}>
                <input
                  type="radio"
                  name={q.id}
                  checked={choices[q.id] === i}
                  onChange={() => {
                    setChoices((c) => ({ ...c, [q.id]: i }));
                    setChecked((c) => ({ ...c, [q.id]: false }));
                  }}
                />
                {o}
              </label>
            ))}
          </fieldset>
          <button type="submit" disabled={choices[q.id] === undefined}>
            Check recall answer
          </button>
          <p role="status">
            {checked[q.id]
              ? `${choices[q.id] === q.correct ? "Correct." : "Review and retry."} ${q.explanation}`
              : passed.includes(q.id)
                ? "Previously passed on this device."
                : ""}
          </p>
        </form>
      ))}
    </section>
  );
}
function PythonLab({
  lesson,
  dark,
  book,
  change,
}: {
  lesson: PythonLesson;
  dark: boolean;
  book: Notebook;
  change: (fn: (b: Notebook) => Notebook) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [example, setExample] = useState<{
    code: string;
    index: number;
  } | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready to initialize Python.");
  const [hint, setHint] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const runSequence = useRef(0);
  const exercise = lesson.exercises[selected];
  const key = example ? `${lesson.id}-example-${example.index}` : exercise.id;
  const code = book.code[key] ?? example?.code ?? exercise.starter;
  const editor = useRef<EditorView | null>(null);
  useEffect(() => {
    mounted.current = true;
    const on = (e: Event) => {
      runSequence.current++;
      controller.current?.abort();
      setBusy(false);
      setExample((e as CustomEvent).detail);
      setResult(null);
      setStatus("Example loaded. Predict its output, then run.");
      editor.current?.focus();
    };
    document.addEventListener("python-example", on);
    return () => {
      mounted.current = false;
      controller.current?.abort();
      document.removeEventListener("python-example", on);
    };
  }, []);
  function edit(value: string) {
    if (value.length > 100000) {
      setStatus(
        "Code exceeds 100,000 characters. Shorten it before saving or running.",
      );
      return;
    }
    setResult(null);
    change((b) => ({
      ...b,
      code: { ...b.code, [key]: value },
      passed: b.passed.filter((p) => p !== key),
      completed: example
        ? b.completed
        : b.completed.filter((p) => p !== lesson.id),
    }));
  }
  async function run(grade: boolean) {
    if (busy) return;
    const control = new AbortController();
    controller.current = control;
    setBusy(true);
    setResult(null);
    setStatus("Loading local CPython runtime…");
    const activeKey = key;
    const sequence = ++runSequence.current;
    const response = await executePython(
      code,
      grade ? exercise.tests : undefined,
      lesson.packages,
      () => {
        if (mounted.current && sequence === runSequence.current)
          setStatus("Running Python…");
      },
      control.signal,
    );
    if (!mounted.current || sequence !== runSequence.current) return;
    setResult(response);
    setBusy(false);
    setStatus(
      response.stderr
        ? "Run finished with feedback."
        : grade
          ? response.passed
            ? "All behavior checks passed."
            : "Checks did not pass."
          : "Run finished.",
    );
    if (grade)
      change((b) => ({
        ...b,
        passed: response.passed
          ? [...new Set([...b.passed, activeKey])]
          : b.passed.filter((k) => k !== activeKey),
        completed: response.passed
          ? b.completed
          : b.completed.filter((k) => k !== lesson.id),
      }));
  }
  return (
    <section className="python-lab panel" aria-label="Python coding lab">
      <span className="eyebrow">CPYTHON 3.12 · REAL EXECUTION</span>
      <h2>Coding lab</h2>
      <label htmlFor="python-task">Choose a practice task</label>
      <select
        id="python-task"
        disabled={busy}
        value={example ? "example" : selected}
        onChange={(e) => {
          setExample(null);
          setSelected(Number(e.target.value));
          setHint(0);
          setResult(null);
        }}
      >
        {example && <option value="example">Worked example sandbox</option>}
        {lesson.exercises.map((e, i) => (
          <option key={e.id} value={i}>
            {book.passed.includes(e.id) ? "✓ " : ""}
            {i + 1}. {e.title}
          </option>
        ))}
      </select>
      <h3>{example ? "Explore this worked example" : exercise.title}</h3>
      <p>
        {example
          ? "Edit, predict and execute. Example runs do not pass an assessed exercise."
          : exercise.prompt}
      </p>
      <CodeMirror
        key={key}
        value={code}
        extensions={extensions}
        theme={dark ? "dark" : "light"}
        indentWithTab
        editable={!busy}
        onCreateEditor={(view) => {
          editor.current = view;
        }}
        onChange={(value) => edit(value)}
        basicSetup={{ foldGutter: false }}
      />
      <p className="muted">
        Tab indents. Escape, then Tab leaves the editor. Draft autosaves on each
        edit.
      </p>
      <div className="python-code-actions">
        <button className="primary" disabled={busy} onClick={() => run(false)}>
          Run code
        </button>
        {!example && (
          <button disabled={busy} onClick={() => run(true)}>
            Check exercise
          </button>
        )}
        <button disabled={!busy} onClick={() => controller.current?.abort()}>
          Stop execution
        </button>
        <button
          disabled={busy}
          onClick={() => {
            edit(example?.code ?? exercise.starter);
            setStatus("Starter restored.");
          }}
        >
          Reset code
        </button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setStatus("Code copied.");
            } catch {
              setStatus(
                "Clipboard unavailable. Select and copy the code in the editor.",
              );
            }
          }}
        >
          Copy code
        </button>
      </div>
      <p role="status">{status}</p>
      <h3>stdout</h3>
      <pre className="python-output" aria-label="Python stdout">
        {result?.stdout || "(no output)"}
      </pre>
      <h3>stderr & check feedback</h3>
      {result?.stderr && (
        <p role="alert" className="python-error-summary">
          {result.stderr
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .at(-1)}
        </p>
      )}
      <pre className="python-output python-stderr" aria-label="Python stderr">
        {result?.stderr || "(no errors)"}
      </pre>
      {!example && (
        <>
          <p>
            {result?.passed === true
              ? "✓ Behavior checks passed."
              : book.passed.includes(exercise.id)
                ? "✓ Passed solution saved on this device."
                : "Pass requires running Check exercise successfully."}
          </p>
          <button
            disabled={hint >= exercise.hints.length}
            onClick={() => setHint((h) => h + 1)}
          >
            Show next hint
          </button>
          <ol>
            {exercise.hints.slice(0, hint).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
        </>
      )}
      <details>
        <summary>Runtime limits & offline use</summary>
        <p>
          Every run gets a disposable Web Worker with a fresh Python namespace
          and temporary filesystem. The worker has no DOM or application
          localStorage. Initialization is limited to 60 seconds, execution to 8
          seconds and captured output to 32 KiB. Stop discards the worker. A
          browser-wide memory cap cannot be guaranteed: avoid huge allocations
          and never enter secrets.
        </p>
        <p>
          The standard library is available in every chapter. The data chapter
          additionally loads bundled pandas 2.2.3 and NumPy 2.0.2. Arbitrary pip
          packages, subprocesses, interactive stdin and desktop integrations are
          unsupported. The production service worker caches runtime assets
          (roughly 23 MB) on installation. Development mode has no offline
          cache. Local behavior checks are learning feedback, not tamper-proof
          grades.
        </p>
      </details>
    </section>
  );
}
