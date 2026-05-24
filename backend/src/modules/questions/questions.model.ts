export type Question = {
  id: number;
  chapterId: number;
  questionText: string;
  questionType: "mcq";
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  difficulty: number;
  source: "manual" | "ai";
  createdAt: string;
};
