import { useEffect, useState } from "react";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { findLesson, findCourse } from "../content/catalog";
import { sources } from "../content/sources";
import type { Progress } from "../progress";
import { localDate } from "../progress";
import { Assessment, Flashcard } from "./Assessment";
export default function LessonReader({
  id,
  progress,
  update,
}: {
  id: string;
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
}) {
  const lesson = findLesson(id),
    course = lesson && findCourse(lesson.courseId);
  const [applied, setApplied] = useState(false);
  useEffect(() => {
    setApplied(false);
    if (lesson)
      update((p) => (p.lastLesson === id ? p : { ...p, lastLesson: id }));
  }, [id, lesson, update]);
  if (!lesson || !course)
    return (
      <section className="panel">
        <h1>Lesson not found</h1>
        <a href="#/catalog">Browse the catalog</a>
      </section>
    );
  const index = course.lessons.findIndex((l) => l.id === id),
    source = sources.find((s) => s.id === lesson.source)!;
  const passed = progress.assessments.includes(id),
    completed = progress.completed.includes(id),
    bookmarked = progress.bookmarks.includes(id);
  return (
    <div className="reader-layout">
      <aside className="lesson-sidebar">
        <a className="backlink" href={`#/course/${course.id}`}>
          <ChevronLeft size={15} /> Course overview
        </a>
        <h2>{course.title}</h2>
        <p className="muted">
          {
            course.lessons.filter((l) => progress.completed.includes(l.id))
              .length
          }{" "}
          of {course.lessons.length} lessons completed
        </p>
        <ol>
          {course.lessons.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#/lesson/${l.id}`}
                aria-current={id === l.id ? "page" : undefined}
              >
                <span className="lesson-number">
                  {progress.completed.includes(l.id) ? (
                    <Check size={16} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  {l.title}
                  <small>{l.level}</small>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <a href={`#/project/${course.id}`} className="project-sidebar">
          ↗ Capstone & rubric
        </a>
        <div className="sidebar-note">
          Three pilot lessons introduce each level. Extended course depth and
          external editorial review remain in progress.
        </div>
      </aside>
      <article className="reader" style={{ fontSize: progress.fontSize }}>
        <div className="reader-toolbar">
          <span>
            {lesson.level} · Lesson {index + 1} / {course.lessons.length}
          </span>
          <div>
            <button
              aria-label="Decrease reading size"
              disabled={progress.fontSize === 16}
              onClick={() =>
                update((p) => ({ ...p, fontSize: p.fontSize - 1 }))
              }
            >
              A−
            </button>
            <button
              aria-label="Increase reading size"
              disabled={progress.fontSize === 24}
              onClick={() =>
                update((p) => ({ ...p, fontSize: p.fontSize + 1 }))
              }
            >
              A+
            </button>
            <button
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
              aria-pressed={bookmarked}
              onClick={() =>
                update((p) => ({
                  ...p,
                  bookmarks: bookmarked
                    ? p.bookmarks.filter((x) => x !== id)
                    : [...p.bookmarks, id],
                }))
              }
            >
              <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        <span className="eyebrow">
          {course.track} / {course.title}
        </span>
        <h1>{lesson.title}</h1>
        <p className="lesson-objective">{lesson.objective}</p>
        <div className="reading-rule" />
        <h2>Understand the idea</h2>
        <p>{lesson.explanation}</p>
        <section className="worked-example">
          <span className="eyebrow">A WORKED EXAMPLE</span>
          <pre>{lesson.example}</pre>
          <p className="muted">
            Change one input, predict the result, then explain why it changes.
          </p>
        </section>
        <Flashcard prompt={lesson.question} answer={lesson.answer} />
        <section className="assignment">
          <span className="eyebrow">MAKE IT YOURS</span>
          <h2>Apply what you learned</h2>
          <p>{lesson.assignment}</p>
          <p className="muted">
            Write down your result, assumptions and one boundary case.
            Assignment completion is self-attested.
          </p>
          <label className="check-label">
            <input
              type="checkbox"
              checked={applied}
              onChange={(e) => setApplied(e.target.checked)}
            />
            I completed the assignment and checked my result.
          </label>
        </section>
        <Assessment
          key={id}
          lesson={lesson}
          passed={passed}
          onPass={() =>
            update((p) => ({
              ...p,
              assessments: [...new Set([...p.assessments, id])],
              activity: [...new Set([...p.activity, localDate()])],
            }))
          }
        />
        <section className="source-note">
          <h2>Reference & provenance</h2>
          <p>
            Original Open Learning Hub teaching text and synthetic examples.
            Reference for concept review:{" "}
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
              <ArrowUpRight size={13} />
            </a>
            .
          </p>
          <p className="muted">
            {source.verified
              ? "Reference retrieved during development."
              : "Reference suggested; external editorial validation is pending."}{" "}
            {source.license}
          </p>
        </section>
        <div className="lesson-actions">
          <button
            className="primary"
            disabled={completed || !passed || !applied}
            onClick={() =>
              update((p) => ({
                ...p,
                completed: [...new Set([...p.completed, id])],
                activity: [...new Set([...p.activity, localDate()])],
              }))
            }
          >
            {completed ? (
              <>
                <Check size={17} /> Lesson complete
              </>
            ) : (
              "Complete lesson"
            )}
          </button>
          <span className="muted" role="status">
            {!completed &&
              (!passed
                ? "Pass the checkpoint and complete the assignment."
                : !applied
                  ? "Complete and confirm the applied assignment."
                  : "Ready to record completion.")}
          </span>
        </div>
        <nav className="reader-next" aria-label="Adjacent lessons">
          {index > 0 ? (
            <a href={`#/lesson/${course.lessons[index - 1].id}`}>
              <ChevronLeft size={17} />
              Previous lesson
            </a>
          ) : (
            <a href={`#/course/${course.id}`}>Course overview</a>
          )}
          {index < course.lessons.length - 1 ? (
            <a href={`#/lesson/${course.lessons[index + 1].id}`}>
              Next lesson
              <ChevronRight size={17} />
            </a>
          ) : (
            <a href={`#/project/${course.id}`}>
              Your capstone
              <ArrowUpRight size={17} />
            </a>
          )}
        </nav>
      </article>
    </div>
  );
}
