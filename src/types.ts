export type MatthewChapter = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  chapter: MatthewChapter;
  verse: string;
  question: string;
  answer: string;
  options: string[]; // 4 choices (including the correct answer)
  explanation?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSettings {
  selectedChapter: 'all' | MatthewChapter;
  questionCount: number; // 5, 10, 20, 30, or total
  shuffle: boolean;
  soundEnabled: boolean;
}

export interface QuizResultRecord {
  id: string;
  date: string;
  chapter: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
}
