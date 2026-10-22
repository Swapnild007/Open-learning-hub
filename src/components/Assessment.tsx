import { useState } from "react";
import type { Lesson } from "../content/types";
export function Assessment({
  lesson,
  passed,
  onPass,
}: {
  lesson: Lesson;
  passed: boolean;
  onPass: () => void;
}) {
  const [choice, setChoice] = useState(""),
    [checked, setChecked] = useState(false);
  const options =
    lesson.id.length % 2
      ? [lesson.distractor, lesson.answer]
      : [lesson.answer, lesson.distractor];
  const correct = choice === lesson.answer;
  return (
    <section className="assessment panel" aria-labelledby="assessment-title">
      <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
      <h2 id="assessment-title">A small test. A stronger memory.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
          if (correct) onPass();
        }}
      >
        <fieldset>
          <legend>{lesson.question}</legend>
          {options.map((answer, i) => (
            <label
              className={`option ${checked && choice === answer ? (correct ? "correct" : "incorrect") : ""}`}
              key={answer}
            >
              <input
                type="radio"
                name={lesson.id}
                value={answer}
                checked={choice === answer}
                onChange={() => {
                  setChoice(answer);
                  setChecked(false);
                }}
              />
              <span aria-hidden="true" className="option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{answer}</span>
            </label>
          ))}
        </fieldset>
        <button className="primary" disabled={!choice} type="submit">
          Check answer
        </button>
        <p role="status">
          {checked
            ? correct
              ? `Correct. ${lesson.example}`
              : `Try again. ${lesson.explanation}`
            : passed
              ? "Checkpoint previously passed on this device."
              : ""}
        </p>
      </form>
    </section>
  );
}
export function Flashcard({
  prompt,
  answer,
}: {
  prompt: string;
  answer: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      className="flashcard"
      onClick={() => setRevealed(!revealed)}
      aria-expanded={revealed}
    >
      <span className="eyebrow">
        ACTIVE RECALL · TAP TO {revealed ? "HIDE" : "REVEAL"}
      </span>
      <strong>{revealed ? answer : prompt}</strong>
      <span>
        {revealed
          ? "Explain it in your own words before moving on."
          : "Pause. Retrieve the answer before revealing it."}
      </span>
    </button>
  );
}
