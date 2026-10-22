import { useState } from "react";
const stages = [
  {
    title: "1 · Define the input",
    text: "A synthetic interval receives 120 contacts. Mean handling time is 300 seconds. Both measures cover the same queue and period.",
    value: "120 contacts × 300 seconds",
  },
  {
    title: "2 · Calculate effort",
    text: "Multiply contacts by handling time. The result is seconds of handling effort, before availability or queue service assumptions.",
    value: "120 × 300 = 36,000 seconds",
  },
  {
    title: "3 · Convert units",
    text: "There are 3,600 seconds in one hour. Divide effort by 3,600. This is workload, not an agent requirement.",
    value: "36,000 ÷ 3,600 = 10 productive hours",
  },
  {
    title: "4 · Apply availability",
    text: "If shrinkage is 30% of scheduled time and is not already deducted, 70% of scheduled hours is productive. Divide by 0.70.",
    value: "10 ÷ 0.70 = 14.29 scheduled hours",
  },
];
export default function GuidedExample() {
  const [step, setStep] = useState(0);
  return (
    <section className="panel">
      <span className="eyebrow">A GUIDED EXAMPLE</span>
      <h2>From contacts to scheduled hours.</h2>
      <div className="guide-steps" role="group" aria-label="Calculation steps">
        {stages.map((s, i) => (
          <button
            aria-label={s.title}
            aria-pressed={step === i}
            key={s.title}
            onClick={() => setStep(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        <h3>{stages[step].title}</h3>
        <p>{stages[step].text}</p>
        <pre>{stages[step].value}</pre>
      </div>
      <div className="button-row">
        <button disabled={step === 0} onClick={() => setStep(step - 1)}>
          Previous step
        </button>
        <button disabled={step === 3} onClick={() => setStep(step + 1)}>
          Next step
        </button>
      </div>
    </section>
  );
}
