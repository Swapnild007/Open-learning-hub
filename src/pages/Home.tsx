import { ArrowRight, ArrowUpRight, Check, BookOpen } from "lucide-react";
import { courses, findLesson } from "../content/catalog";
import type { Progress } from "../progress";
import CourseCard from "../components/CourseCard";
export default function Home({ progress }: { progress: Progress }) {
  const resume = findLesson(progress.lastLesson || "");
  return (
    <>
      <div className="welcome-line">
        <span>A LITTLE CURIOSITY GOES A LONG WAY.</span>
        <span>
          YOUR NEXT CHAPTER STARTS HERE <span className="sparkle">✦</span>
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">
            <span />
            OPEN KNOWLEDGE. REAL POSSIBILITIES.
          </span>
          <h1>
            Don’t just learn it.
            <br />
            <em>Make it yours.</em>
          </h1>
          <p>
            Understand the idea. Try it yourself. Build something that matters.
            Your next skill starts with a little curiosity.
          </p>
          <div className="button-row">
            <a className="primary" href="#/catalog">
              Explore the courses
              <ArrowRight size={18} />
            </a>
            <a className="quiet-link" href="#/paths">
              Find your path
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-facts">
            <span>
              <strong>36</strong>course pilots
            </span>
            <span>
              <strong>6</strong>learning tracks
            </span>
            <span>
              <strong>∞</strong>curiosity encouraged
            </span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="floating-tag tag-code">
            &lt; / &gt;<span>Build something.</span>
          </div>
          <div className="knowledge-stack">
            <div />
            <div />
            <div>
              <BookOpen size={70} strokeWidth={1} />
              <span>
                YOUR NEXT
                <br />
                BIG IDEA.
              </span>
              <small>OPEN LEARNING HUB</small>
            </div>
          </div>
          <div className="floating-tag tag-idea">
            ✦<span>Connect the dots.</span>
          </div>
          <div className="art-dot dot-one" />
          <div className="art-dot dot-two" />
        </div>
      </section>
      <div className="home-strip">
        <span>
          <Check size={17} />
          Learn without an account
        </span>
        <span>
          <Check size={17} />
          Practice, not just reading
        </span>
        <span>
          <Check size={17} />
          Keep your progress local
        </span>
      </div>
      {resume && (
        <section className="continue panel">
          <div>
            <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
            <h2>{resume.title}</h2>
            <p>{resume.courseTitle}</p>
          </div>
          <a className="primary" href={`#/lesson/${resume.id}`}>
            Continue learning
            <ArrowRight size={17} />
          </a>
        </section>
      )}
      <div className="section-heading">
        <div>
          <span className="eyebrow">FIND YOUR NEXT POSSIBILITY</span>
          <h2>A skill for every kind of curious.</h2>
          <p>Start small. Go deeper. Put your knowledge to work.</p>
        </div>
        <a href="#/catalog">
          View all 36 courses
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="course-grid">
        {[
          courses[0],
          courses[6],
          courses[12],
          courses[18],
          courses[24],
          courses[31],
        ].map((c) => (
          <CourseCard key={c.id} course={c} progress={progress} />
        ))}
      </div>
      <section className="learning-method">
        <div>
          <span className="eyebrow">LESS PASSIVE. MORE POSSIBLE.</span>
          <h2>
            Knowledge sticks
            <br />
            when you use it.
          </h2>
          <p>
            Each pilot moves from an idea to an example, an experiment and a
            practical deliverable.
          </p>
          <a href="#/practice">
            Open the practice studio
            <ArrowRight size={17} />
          </a>
        </div>
        <ol>
          {[
            [
              "01",
              "Understand",
              "Clear ideas, without the unnecessary complexity.",
            ],
            ["02", "Experiment", "Change an input. See what happens. Ask why."],
            ["03", "Build", "Connect the pieces in an original project."],
          ].map(([n, t, d]) => (
            <li key={n}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <p className="publication-note">
        Curriculum status: 36 course pilots with three authored lessons each.
        Full course depth, expanded assessments and external editorial
        validation remain in development.
      </p>
    </>
  );
}
