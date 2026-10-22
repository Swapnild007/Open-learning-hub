import { Check } from "lucide-react";
import { courses, tracks } from "../content/catalog";
import { coursePassed, type Progress } from "../progress";
import { PageHeading } from "../components/LearningShared";
export default function Paths({ progress }: { progress: Progress }) {
  return (
    <>
      <PageHeading
        kicker="A DIRECTION, NOT A DEADLINE"
        title="Find your learning path."
        description="Follow prerequisite-aware sequences or explore freely. A course’s overview lists dependencies across tracks."
      />
      <div className="paths-grid">
        {tracks.map((t, i) => (
          <section className="panel path-card" key={t}>
            <span className={`track-symbol art-${i}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2>{t}</h2>
            <ol>
              {courses
                .filter((c) => c.track === t)
                .map((c) => (
                  <li key={c.id}>
                    <a href={`#/course/${c.id}`}>
                      {c.title}
                      {coursePassed(c.id, progress) && <Check size={15} />}
                    </a>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
