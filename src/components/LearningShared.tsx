import { BookOpen, ArrowRight, ArrowUpRight } from "lucide-react";
import { findLesson } from "../content/catalog";
export function PageHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function LessonLinks({ ids }: { ids: string[] }) {
  return ids.length ? (
    <div className="result-list">
      {ids.map((id) => {
        const l = findLesson(id);
        return (
          l && (
            <a href={`#/lesson/${id}`} key={id}>
              <span className="eyebrow">
                {l.courseTitle} · {l.level}
              </span>
              <h2>{l.title}</h2>
              <p>{l.objective}</p>
              <ArrowUpRight size={18} />
            </a>
          )
        );
      })}
    </div>
  ) : (
    <Empty
      title="A fresh page."
      text="Visit a lesson to start learning or save an idea with its bookmark button."
    />
  );
}
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <section className="empty panel">
      <BookOpen size={35} />
      <h2>{title}</h2>
      <p>{text}</p>
      <a href="#/catalog">
        Explore the catalog
        <ArrowRight size={16} />
      </a>
    </section>
  );
}
