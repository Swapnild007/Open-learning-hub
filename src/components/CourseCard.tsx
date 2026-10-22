import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Course } from "../content/types";
import { tracks } from "../content/catalog";
import type { Progress } from "../progress";
export default function CourseCard({
  course,
  progress,
}: {
  course: Course;
  progress: Progress;
}) {
  const n = course.lessons.filter((l) =>
    progress.completed.includes(l.id),
  ).length;
  return (
    <a className="course-card" href={`#/course/${course.id}`}>
      <div
        className={`course-art art-${tracks.indexOf(course.track)}`}
        aria-hidden="true"
      >
        <span>
          {course.title
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div className="art-orbit" />
        <BookOpen size={42} strokeWidth={1.2} />
        <span className="art-label">{course.track}</span>
      </div>
      <div className="course-copy">
        <span className="eyebrow">{course.track}</span>
        <h3>
          {course.title}
          <ArrowUpRight size={18} />
        </h3>
        <p>{course.description}</p>
        <div className="card-meta">
          <span>{course.lessons.length} pilot lessons</span>
          <span>3 levels</span>
        </div>
        {n > 0 && (
          <progress
            value={n}
            max={course.lessons.length}
            aria-label={`${course.title} lesson completion`}
          />
        )}
      </div>
    </a>
  );
}
