import { FolderOpen, ArrowUpRight } from "lucide-react";
import { courses } from "../content/catalog";
import type { Progress } from "../progress";
import { PageHeading } from "../components/LearningShared";
export default function Projects({ progress }: { progress: Progress }) {
  return (
    <>
      <PageHeading
        kicker="TURN UNDERSTANDING INTO SOMETHING REAL"
        title="Your next build starts here."
        description="Original capstone briefs, deliverables and transparent self-review criteria."
      />
      <div className="paths-grid">
        {courses.map((c) => (
          <a
            className="panel project-card"
            href={`#/project/${c.id}`}
            key={c.id}
          >
            <FolderOpen size={25} />
            <span className="eyebrow">{c.title}</span>
            <h2>{c.capstone.title}</h2>
            <p>
              {progress.capstones.includes(c.id)
                ? "Self-review recorded"
                : "4 rubric criteria · local self-review"}
            </p>
            <span>
              Open project brief <ArrowUpRight size={16} />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
