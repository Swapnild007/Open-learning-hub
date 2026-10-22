export type Level = "Beginner" | "Intermediate" | "Advanced";
export interface Lesson {
  id: string;
  title: string;
  level: Level;
  objective: string;
  explanation: string;
  example: string;
  question: string;
  answer: string;
  distractor: string;
  assignment: string;
  source: string;
}
export interface Course {
  id: string;
  title: string;
  track: string;
  description: string;
  prerequisites: string[];
  lessons: Lesson[];
  capstone: { title: string; brief: string; rubric: string[] };
  status: "pilot";
}
export interface Source {
  id: string;
  title: string;
  url: string;
  license: string;
  verified: boolean;
}
