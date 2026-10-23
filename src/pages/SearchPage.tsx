import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { searchContent } from "../content/catalog";
import { PageHeading, LessonLinks } from "../components/LearningShared";
export default function SearchPage() {
  const [q, setQ] = useState("");
  const result = searchContent(q);
  return (
    <>
      <PageHeading
        kicker="FOLLOW YOUR CURIOSITY"
        title="Find the idea you need."
        description="Search lesson titles, explanations, examples, courses and tracks."
      />
      <label className="search-input large">
        <Search size={21} />
        <input
          aria-label="Search all lessons"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try weighted averages, SQL, or queueing…"
        />
      </label>
      {q.trim() ? (
        <>
          <p className="muted" role="status">
            {result.length} matching lessons
          </p>
          <LessonLinks ids={result.map((l) => l.id)} />
        </>
      ) : (
        <div className="search-suggestions">
          {["Python", "SQL", "shrinkage", "TypeScript", "forecast"].map((t) => (
            <button key={t} onClick={() => setQ(t)}>
              {t}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
