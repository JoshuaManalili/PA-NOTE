export interface Note {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
}

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'identification';
  question: string;
  options?: QuizOption[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  noteId: string;
  noteTitle: string;
  notePreview: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  QuizList: undefined;
  NoteDetail: { note: Note };
  AddNote: undefined;
  ActiveQuiz: { quiz: Quiz };
  QuizResults: { results: QuizResult[]; quiz: Quiz };
  Settings: undefined;
  Archives: undefined;
  Trash: undefined;
};
