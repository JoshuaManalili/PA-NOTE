import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Note, Quiz, QuizQuestion } from '../types';

interface AppContextType {
  notes: Note[];
  quizzes: Quiz[];
  addNote: (title: string, subject: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, subject: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateQuizFromNote(note: Note): Quiz {
  const sentences = note.subject.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const questions: QuizQuestion[] = [];

  // Generate up to 5 multiple-choice questions
  sentences.slice(0, 3).forEach((sentence, i) => {
    const words = sentence.trim().split(' ').filter(w => w.length > 3);
    if (words.length < 3) return;
    const answerWord = words[Math.floor(words.length / 2)];
    const question = sentence.replace(answerWord, '______').trim();

    questions.push({
      id: `mc-${note.id}-${i}`,
      type: 'multiple_choice',
      question: `Fill in the blank: "${question}"`,
      options: [
        { label: 'A', text: answerWord },
        { label: 'B', text: words[0] || 'Option B' },
        { label: 'C', text: words[words.length - 1] || 'Option C' },
        { label: 'D', text: words[1] || 'Option D' },
      ],
      correctAnswer: answerWord,
    });
  });

  // Generate identification questions from remaining sentences
  sentences.slice(3, 5).forEach((sentence, i) => {
    const words = sentence.trim().split(' ').filter(w => w.length > 3);
    if (words.length < 2) return;
    const answerWord = words[0];
    const question = sentence.replace(answerWord, '______').trim();

    questions.push({
      id: `id-${note.id}-${i}`,
      type: 'identification',
      question: `Identify: "${question}"`,
      correctAnswer: answerWord,
    });
  });

  // Ensure at least 3 questions
  if (questions.length < 3) {
    questions.push({
      id: `mc-fallback-${note.id}-1`,
      type: 'multiple_choice',
      question: `What is the main topic of the note titled "${note.title}"?`,
      options: [
        { label: 'A', text: note.title },
        { label: 'B', text: 'Mathematics' },
        { label: 'C', text: 'History' },
        { label: 'D', text: 'Science' },
      ],
      correctAnswer: note.title,
    });
    questions.push({
      id: `id-fallback-${note.id}-2`,
      type: 'identification',
      question: `What is the title of this note?`,
      correctAnswer: note.title,
    });
    questions.push({
      id: `mc-fallback-${note.id}-3`,
      type: 'multiple_choice',
      question: `Which of the following best describes the subject of "${note.title}"?`,
      options: [
        { label: 'A', text: note.subject.substring(0, 30) + '...' },
        { label: 'B', text: 'Unrelated topic A' },
        { label: 'C', text: 'Unrelated topic B' },
        { label: 'D', text: 'Unrelated topic C' },
      ],
      correctAnswer: note.subject.substring(0, 30) + '...',
    });
  }

  return {
    id: `quiz-${note.id}`,
    noteId: note.id,
    noteTitle: note.title,
    notePreview: note.subject.substring(0, 80) + (note.subject.length > 80 ? '...' : ''),
    questions,
    createdAt: new Date().toISOString(),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const addNote = (title: string, subject: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      subject,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
    };
    setNotes(prev => [newNote, ...prev]);

    // Auto-generate quiz
    const quiz = generateQuizFromNote(newNote);
    setQuizzes(prev => [quiz, ...prev.filter(q => q.noteId !== newNote.id)]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setQuizzes(prev => prev.filter(q => q.noteId !== id));
  };

  const updateNote = (id: string, title: string, subject: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, title, subject } : n))
    );
    const updatedNote = notes.find(n => n.id === id);
    if (updatedNote) {
      const updatedQuiz = generateQuizFromNote({ ...updatedNote, title, subject });
      setQuizzes(prev => [updatedQuiz, ...prev.filter(q => q.noteId !== id)]);
    }
  };

  return (
    <AppContext.Provider value={{ notes, quizzes, addNote, deleteNote, updateNote }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
