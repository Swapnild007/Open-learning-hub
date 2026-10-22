import { useState } from "react";
import { Search } from "lucide-react";
import { courses, tracks } from "../content/catalog";
import type { Progress } from "../progress";
import CourseCard from "../components/CourseCard";
import { PageHeading, Empty } from "../components/LearningShared";
export default function Catalog({ progress }: { progress: Progress }) {
  const [query, setQuery] = useState(""),
    [track, setTrack] = useState("All tracks");
  const filtered = courses.filter(
    (c) =>
      (track === "All tracks" || c.track === track) &&
      `${c.title} ${c.description} ${c.track}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        kicker="A LIBRARY FOR YOUR NEXT CHAPTER"
        title="Course catalog"
        description="Explore 36 original course pilots across six tracks. Each introduces beginner, intermediate and advanced concepts."
      />
      <div className="filter-bar">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label="Search courses"
            placeholder="Search a subject or skill…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Filter by track</span>
          <select
            aria-label="Filter by track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          >
            {["All tracks", ...tracks].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <span className="muted" role="status">
          {filtered.length} courses
        </span>
      </div>
      <div className="course-grid">
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} progress={progress} />
        ))}
      </div>
      {filtered.length === 0 && (
        <Empty
          title="No courses match yet."
          text="Try another keyword or choose all tracks."
        />
      )}
    </>
  );
}
