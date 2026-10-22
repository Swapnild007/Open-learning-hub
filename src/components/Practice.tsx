import GuidedExample from "./GuidedExample";
import ArchitectureLab from "./ArchitectureLab";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Play } from "lucide-react";
import { download } from "../progress";
export function FormulaLab() {
  const [contacts, setContacts] = useState("120"),
    [aht, setAht] = useState("300"),
    [shrink, setShrink] = useState("30");
  const c = Number(contacts),
    a = Number(aht),
    s = Number(shrink);
  const valid =
    [contacts, aht, shrink].every((v) => v.trim() !== "") &&
    [c, a, s].every(Number.isFinite) &&
    c >= 0 &&
    c <= 1000000 &&
    a >= 0 &&
    a <= 86400 &&
    s >= 0 &&
    s < 100;
  return (
    <section className="panel">
      <span className="eyebrow">FORMULA PLAYGROUND</span>
      <h2>See what changes.</h2>
      <p>
        Explore workload and the effect of shrinkage. Workload is handling
        effort; this is not an Erlang staffing calculator.
      </p>
      <div className="input-grid">
        <label>
          Contacts
          <input
            type="number"
            min="0"
            max="1000000"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
          />
        </label>
        <label>
          AHT (seconds)
          <input
            type="number"
            min="0"
            max="86400"
            value={aht}
            onChange={(e) => setAht(e.target.value)}
          />
        </label>
        <label>
          Shrinkage (%)
          <input
            type="number"
            min="0"
            max="99.99"
            value={shrink}
            onChange={(e) => setShrink(e.target.value)}
          />
        </label>
      </div>
      <output aria-live="polite">
        {valid ? (
          <div className="metric-row">
            <div>
              <strong>{((c * a) / 3600).toFixed(2)}</strong>
              <span>productive workload hours</span>
            </div>
            <div>
              <strong>{((c * a) / 3600 / (1 - s / 100)).toFixed(2)}</strong>
              <span>scheduled hours at this shrinkage</span>
            </div>
          </div>
        ) : (
          "Enter finite nonnegative inputs within the stated limits and shrinkage below 100%."
        )}
      </output>
      <p className="muted">
        Workload = contacts × AHT ÷ 3,600. Scheduled hours = productive hours ÷
        (1 − shrinkage). Assumes shrinkage is not already deducted.
      </p>
      {valid && (
        <figure>
          <svg
            viewBox="0 0 600 100"
            role="img"
            aria-label={`Productive time is ${100 - s}% of scheduled time; shrinkage is ${s}%.`}
          >
            <rect
              x="0"
              y="15"
              width="600"
              height="50"
              rx="12"
              fill="var(--soft)"
            />
            <rect
              x="0"
              y="15"
              width={600 * (1 - s / 100)}
              height="50"
              rx="12"
              fill="var(--accent)"
            />
            <text x="12" y="92" fill="currentColor" fontSize="15">
              Productive time {100 - s}% · Shrinkage {s}%
            </text>
          </svg>
          <figcaption>
            Share of scheduled time, under the stated shrinkage definition.
          </figcaption>
        </figure>
      )}
    </section>
  );
}
export function SQLLab() {
  const [sql, setSql] = useState(
      "SELECT team, handled, offered FROM contacts ORDER BY handled DESC;",
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [rows, setRows] = useState<
      { columns: string[]; values: (string | number | null)[][] }[]
    >([]);
  const worker = useRef<Worker | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      worker.current?.terminate();
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function run() {
    worker.current?.terminate();
    if (timer.current) clearTimeout(timer.current);
    setBusy(true);
    setError("");
    setRows([]);
    const w = new Worker(new URL("../sql.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.current = w;
    function stop() {
      w.terminate();
      if (timer.current) clearTimeout(timer.current);
      setBusy(false);
    }
    w.onmessage = ({ data }) => {
      setRows(data.rows || []);
      setError(data.error || "");
      stop();
    };
    w.onerror = () => {
      setError(
        "SQL runtime unavailable. Use the worked query below and reason through its three rows.",
      );
      stop();
    };
    w.postMessage(sql);
    timer.current = setTimeout(() => {
      stop();
      setError("Query stopped after 5 seconds. Simplify it and try again.");
    }, 5000);
  }
  return (
    <section className="panel">
      <span className="eyebrow">REAL SQLITE · IN YOUR BROWSER</span>
      <h2>A little data. A real query.</h2>
      <p>
        Synthetic table <code>contacts(team, handled, offered)</code>:
        CountyCare 180/200, Premera 120/150, SOMOS 90/100. Read-only SELECT, 100
        displayed rows, five-second limit.
      </p>
      <label>
        SQL editor
        <textarea
          spellCheck={false}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={5}
        />
      </label>
      <button className="primary" onClick={run} disabled={busy}>
        <Play size={16} />
        {busy ? "Running…" : "Run query"}
      </button>
      <p role="status">{error}</p>
      {rows.map((r, i) => (
        <div className="table-wrap" key={i}>
          <table>
            <caption>Query result</caption>
            <thead>
              <tr>
                {r.columns.map((c, j) => (
                  <th key={j}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.values.map((row, k) => (
                <tr key={k}>
                  {row.map((v, j) => (
                    <td key={j}>{String(v ?? "NULL")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <details>
        <summary>Runtime unavailable? Use the guided fallback</summary>
        <p>
          SELECT SUM(handled) FROM contacts returns 390. Derive this by adding
          180 + 120 + 90. Add a WHERE offered &gt;= 150 clause: the result
          becomes 300. Explain which rows were excluded.
        </p>
      </details>
    </section>
  );
}
export function CodeLab() {
  const [code, setCode] = useState(
      "def workload(contacts, aht):\n    return contacts * aht / ____",
    ),
    [result, setResult] = useState("");
  return (
    <section className="panel">
      <span className="eyebrow">VALIDATED CODE EXERCISE · PYTHON</span>
      <h2>Complete the calculation.</h2>
      <p>
        Replace the blank so the function returns hours from AHT in seconds.
        This checks the expected solution; it does not execute arbitrary Python.
      </p>
      <label>
        Python editor
        <textarea
          spellCheck={false}
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>
      <button
        className="primary"
        onClick={() => {
          const normalized = code.replace(/\s+/g, "").replace(/#.*$/gm, "");
          setResult(
            normalized === "defworkload(contacts,aht):returncontacts*aht/3600"
              ? "Correct. 120 × 300 / 3600 = 10 workload hours."
              : "Not yet. Convert seconds to hours by dividing by 3600. Keep the function and return expression intact.",
          );
        }}
      >
        Validate solution
      </button>
      <p role="status">{result}</p>
    </section>
  );
}
const correctOrder = [
  "Validate source data",
  "Calculate workload",
  "Plan available coverage",
  "Review actual outcomes",
];
export function SequenceLab() {
  const [items, setItems] = useState([
      correctOrder[2],
      correctOrder[0],
      correctOrder[3],
      correctOrder[1],
    ]),
    [message, setMessage] = useState("");
  const drag = useRef<number | null>(null);
  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
    setMessage("");
  }
  return (
    <section className="panel">
      <span className="eyebrow">PUT IT TOGETHER</span>
      <h2>Build a reliable planning sequence.</h2>
      <p>
        Drag to reorder, or use the labeled arrow buttons with your keyboard.
      </p>
      <ol className="sequence">
        {items.map((item, i) => (
          <li
            key={item}
            draggable
            onDragStart={() => {
              drag.current = i;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (drag.current !== null) move(drag.current, i);
              drag.current = null;
            }}
          >
            <span>{item}</span>
            <button
              aria-label={`Move ${item} up`}
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
            >
              <ArrowUp size={16} />
            </button>
            <button
              aria-label={`Move ${item} down`}
              disabled={i === items.length - 1}
              onClick={() => move(i, i + 1)}
            >
              <ArrowDown size={16} />
            </button>
          </li>
        ))}
      </ol>
      <button
        className="primary"
        onClick={() =>
          setMessage(
            items.every((v, i) => v === correctOrder[i])
              ? "Correct. Validate inputs before calculation, plan coverage, then compare actual outcomes."
              : "Review the dependencies: data validation must precede calculation, and actual review follows the plan.",
          )
        }
      >
        Check sequence
      </button>
      <p role="status">{message}</p>
    </section>
  );
}
export default function Practice() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">THE PRACTICE STUDIO</span>
        <h1>Try it. Change it. Understand it.</h1>
        <p>
          Small experiments with immediate feedback. Everything runs locally.
        </p>
      </div>
      <div className="practice-grid">
        <FormulaLab />
        <SQLLab />
        <CodeLab />
        <SequenceLab />
        <GuidedExample />
        <ArchitectureLab />
      </div>
      <section className="panel">
        <h2>Your practice data</h2>
        <p>
          <a href="./data/contact-intervals.csv" download>
            Download 1,344 synthetic contact intervals (CSV)
          </a>{" "}
          ·{" "}
          <a href="./data/data-dictionary.json" download>
            Data dictionary & expected totals (JSON)
          </a>
        </p>
        <p>
          An original, synthetic three-team dataset. No real customer or
          employee records.
        </p>
        <button
          onClick={() =>
            download(
              "olh-synthetic-contacts.csv",
              "team,handled,offered\nCountyCare,180,200\nPremera,120,150\nSOMOS,90,100\n",
              "text/csv",
            )
          }
        >
          Download CSV dataset
        </button>
        <p className="muted">
          Expected totals: 390 handled, 450 offered. The handled share of
          offered is 86.67%; this is not service level because answers within
          threshold are not supplied.
        </p>
      </section>
    </>
  );
}
