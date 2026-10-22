import { useState } from "react";
import { findCourse } from "../content/catalog";
import { download, localDate, type Progress } from "../progress";
import { PageHeading, Empty } from "../components/LearningShared";
export default function Project({
  id,
  progress,
  update,
}: {
  id: string;
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
}) {
  const c = findCourse(id),
    [checks, setChecks] = useState<number[]>([]),
    [notes, setNotes] = useState("");
  if (!c)
    return (
      <Empty
        title="Project not found"
        text="Choose a project from the project library."
      />
    );
  const eligible = c.lessons.every((l) => progress.completed.includes(l.id)),
    done = progress.capstones.includes(id);
  return (
    <>
      <a href={`#/course/${id}`} className="backlink">
        ← {c.title}
      </a>
      <PageHeading
        kicker="YOUR CAPSTONE"
        title={c.capstone.title}
        description="Connect the lessons. Build a deliverable. Review the evidence."
      />
      <section className="panel">
        <h2>The brief</h2>
        <p>{c.capstone.brief}</p>
        <h3>Course-specific work to include</h3>
        <ul>
          {c.lessons.map((l) => (
            <li key={l.id}>{l.assignment}</li>
          ))}
        </ul>
        <label>
          Project notes (download to keep these)
          <textarea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Your approach, evidence, edge cases and limitations…"
          />
        </label>
        <button
          onClick={() =>
            download(
              `${id}-project-notes.txt`,
              `${c.capstone.title}\n\n${notes}`,
              "text/plain",
            )
          }
          disabled={!notes.trim()}
        >
          Download project notes
        </button>
        <p className="muted">
          Notes remain in memory until downloaded; they are not part of progress
          export.
        </p>
      </section>
      <section className="panel">
        <h2>Self-review rubric</h2>
        {c.capstone.rubric.map((r, i) => (
          <label className="check-label rubric" key={r}>
            <input
              type="checkbox"
              checked={checks.includes(i)}
              onChange={(e) =>
                setChecks(
                  e.target.checked
                    ? [...checks, i]
                    : checks.filter((n) => n !== i),
                )
              }
            />
            {r}
          </label>
        ))}
        <button
          className="primary"
          disabled={done || !eligible || checks.length !== 4}
          onClick={() =>
            update((p) => ({
              ...p,
              capstones: [...new Set([...p.capstones, id])],
              activity: [...new Set([...p.activity, localDate()])],
            }))
          }
        >
          {done ? "Self-review recorded" : "Record capstone self-review"}
        </button>
        <p role="status" className="muted">
          {done
            ? "Recorded locally. This is self-attestation, not external grading."
            : !eligible
              ? "Complete all course lessons first."
              : "Confirm all four rubric criteria to record your self-review."}
        </p>
      </section>
    </>
  );
}
