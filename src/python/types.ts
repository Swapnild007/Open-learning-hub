export interface PythonExample {
  title: string;
  code: string;
  output: string;
  walkthrough: string[];
}
export interface PythonExercise {
  id: string;
  title: string;
  prompt: string;
  starter: string;
  solution: string;
  tests: string;
  hints: string[];
}
export interface Recall {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}
export interface PythonLesson {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  prerequisites: string[];
  objectives: string[];
  sections: { title: string; paragraphs: string[] }[];
  syntax: { token: string; meaning: string }[];
  examples: PythonExample[];
  debugging: { symptom: string; explanation: string }[];
  exercises: PythonExercise[];
  recall: Recall[];
  references: {
    title: string;
    url: string;
    version: string;
    license: string;
    retrieved: string | null;
  }[];
  packages: string[];
}
