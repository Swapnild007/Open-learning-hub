import { courses, tracks } from "../content/catalog";
import { coursePassed, streak, type Progress } from "../progress";
import { PageHeading, LessonLinks } from "../components/LearningShared";
export default function ProgressPage({ progress }: { progress: Progress }) {
  const finished = courses.filter((c) => coursePassed(c.id, progress));
  return (
    <>
      <PageHeading
        kicker="EVERY STEP COUNTS"
        title="Look how far you’re going."
        description="A record of your learning on this device, with assessments and project self-reviews clearly distinguished."
      />
      <div className="stats-grid">
        {[
          [progress.completed.length, "lessons completed"],
          [progress.assessments.length, "checkpoints passed"],
          [finished.length, "course pilots completed"],
          [streak(progress.activity), "day learning streak"],
        ].map(([n, label]) => (
          <div className="panel stat" key={String(label)}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="panel">
        <h2>Across your learning paths</h2>
        {tracks.map((t) => {
          const ls = courses
            .filter((c) => c.track === t)
            .flatMap((c) => c.lessons);
          const n = ls.filter((l) => progress.completed.includes(l.id)).length;
          return (
            <div className="track-progress" key={t}>
              <div>
                <span>{t}</span>
                <span>
                  {n} / {ls.length} lessons
                </span>
              </div>
              <progress
                value={n}
                max={ls.length}
                aria-label={`${t} completion`}
              />
            </div>
          );
        })}
      </section>
      <h2>Completed lessons</h2>
      <LessonLinks ids={progress.completed} />
    </>
  );
}
