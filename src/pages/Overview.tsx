import {
  ArrowRight,
  Check,
  ChevronRight,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";
import { findCourse } from "../content/catalog";
import { coursePassed, type Progress } from "../progress";
import { PageHeading, Empty } from "../components/LearningShared";
export default function Overview({
  id,
  progress,
}: {
  id: string;
  progress: Progress;
}) {
  const c = findCourse(id);
  if (!c)
    return (
      <Empty
        title="Course not found"
        text="Choose a course from the catalog."
      />
    );
  if (id === "python")
    return (
      <section className="panel python-feature">
        <span className="eyebrow">PYTHON · EXECUTABLE LEARNING</span>
        <h1>Learn Python by running it.</h1>
        <p>
          Foundation chapters with editable code, real Python output, behavior
          checks and personal notes saved on this device.
        </p>
        <a className="primary" href="#/python/variables">
          Start the beginner lesson
        </a>{" "}
        <a href="#/python">View the Python syllabus</a>
        <p>
          The full beginner-to-advanced curriculum and capstone are still in
          development.
        </p>
      </section>
    );
  const first =
    c.lessons.find((l) => !progress.completed.includes(l.id)) || c.lessons[0];
  return (
    <>
      <a href="#/catalog" className="backlink">
        ← Course catalog
      </a>
      <PageHeading
        kicker={c.track}
        title={c.title}
        description={c.description}
      />
      <section className="overview-hero panel">
        <div>
          <span className="pill">3 authored pilot lessons</span>
          <span className="pill">Beginner → Advanced concepts</span>
          <h2>Understand it, then put it to work.</h2>
          <p>
            Complete the checkpoint and applied assignment for each lesson, then
            use the project rubric for a self-reviewed capstone. Completion
            records your local activity; it is not a professional certification.
          </p>
          <a className="primary" href={`#/lesson/${first.id}`}>
            {progress.completed.length ? "Continue course" : "Start learning"}
            <ArrowRight size={17} />
          </a>
        </div>
        <div className="overview-count">
          <strong>
            {c.lessons.filter((l) => progress.completed.includes(l.id)).length}/
            {c.lessons.length}
          </strong>
          <span>lessons completed</span>
        </div>
      </section>
      <section className="panel">
        <h2>Before you begin</h2>
        {c.prerequisites.length ? (
          <ul>
            {c.prerequisites.map((p) => (
              <li key={p}>
                <a href={`#/course/${p}`}>{findCourse(p)!.title}</a> ·{" "}
                {coursePassed(p, progress)
                  ? "Completed locally"
                  : "Recommended prerequisite"}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No prior course required. Bring curiosity and a place to record your
            work.
          </p>
        )}
        <p className="muted">
          Prerequisites guide your sequence; they do not lock browsing.
        </p>
      </section>
      <section className="panel">
        <h2>Your course path</h2>
        <div className="module-list">
          {c.lessons.map((l, i) => (
            <a key={l.id} href={`#/lesson/${l.id}`}>
              <span className="lesson-number">
                {progress.completed.includes(l.id) ? (
                  <Check size={18} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div>
                <span className="eyebrow">
                  MODULE {i + 1} · {l.level}
                </span>
                <h3>{l.title}</h3>
                <p>{l.objective}</p>
              </div>
              <ChevronRight size={18} />
            </a>
          ))}
        </div>
        <a className="project-link" href={`#/project/${id}`}>
          <FolderOpen size={23} />
          <div>
            <strong>Capstone: {c.capstone.title}</strong>
            <p>Brief, deliverables and self-review rubric</p>
          </div>
          <ArrowUpRight size={18} />
        </a>
      </section>
      {id === "wfm" && (
        <a href="./wfm-curriculum.html">
          Explore the preserved original WFM lesson ↗
        </a>
      )}
      <p className="publication-note">
        Pilot scope: three concept lessons are usable. Additional teaching
        depth, exercises and independent source review are required before this
        is a complete beginner-to-advanced course.
      </p>
    </>
  );
}
