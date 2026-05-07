import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Note, Quiz, QuizQuestion } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  notes: Note[];
  quizzes: Quiz[];
  addNote: (title: string, subject: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (id: string, title: string, subject: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateQuizFromNote(note: Note): Omit<Quiz, 'id' | 'createdAt'> {
  const sentences = note.subject.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const questions: QuizQuestion[] = [];

  // Generate up to 5 multiple-choice questions
  sentences.slice(0, 3).forEach((sentence, i) => {
    const words = sentence.trim().split(' ').filter(w => w.length > 3);
    if (words.length < 3) return;
    const answerWord = words[Math.floor(words.length / 2)];
    const question = sentence.replace(answerWord, '______').trim();

    questions.push({
      id: `mc-${i}`,
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
      id: `id-${i}`,
      type: 'identification',
      question: `Identify: "${question}"`,
      correctAnswer: answerWord,
    });
  });

  // Ensure at least 3 questions
  if (questions.length < 3) {
    questions.push({
      id: `mc-fallback-1`,
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
  }

  return {
    noteId: note.id,
    noteTitle: note.title,
    notePreview: note.subject.substring(0, 80) + (note.subject.length > 80 ? '...' : ''),
    questions,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesData) {
        setNotes(notesData.map(n => ({
          id: n.id,
          title: n.title,
          subject: n.subject,
          createdAt: new Date(n.created_at).toLocaleDateString()
        })));
      }
      
      if (quizzesData) {
        setQuizzes(quizzesData.map(q => ({
          id: q.id,
          noteId: q.note_id,
          noteTitle: q.note_title,
          notePreview: q.note_preview,
          questions: q.questions,
          createdAt: new Date(q.created_at).toISOString()
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addNote = async (title: string, subject: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Save Note
    const { data: noteData, error: noteError } = await supabase
      .from('notes')
      .insert({ title, subject, user_id: user.id })
      .select()
      .single();

    if (noteError || !noteData) {
      console.error('Error adding note:', noteError);
      return;
    }

    const newNote: Note = {
      id: noteData.id,
      title: noteData.title,
      subject: noteData.subject,
      createdAt: new Date(noteData.created_at).toLocaleDateString()
    };
    setNotes(prev => [newNote, ...prev]);

    // 2. Generate and Save Quiz
    const quizBase = generateQuizFromNote(newNote);
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        note_id: newNote.id,
        note_title: quizBase.noteTitle,
        note_preview: quizBase.notePreview,
        questions: quizBase.questions
      })
      .select()
      .single();

    if (quizError || !quizData) {
      console.error('Error adding quiz:', quizError);
      return;
    }

    const newQuiz: Quiz = {
      ...quizBase,
      id: quizData.id,
      createdAt: quizData.created_at
    };
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id));
      setQuizzes(prev => prev.filter(q => q.noteId !== id));
    }
  };

  const updateNote = async (id: string, title: string, subject: string) => {
    const { error } = await supabase
      .from('notes')
      .update({ title, subject })
      .eq('id', id);

    if (error) {
      console.error('Error updating note:', error);
      return;
    }

    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, title, subject } : n))
    );

    // Refresh quiz after update
    const updatedNote: Note = { id, title, subject, createdAt: '' };
    const quizBase = generateQuizFromNote(updatedNote);
    
    // Update existing quiz for this note
    await supabase
      .from('quizzes')
      .update({
        note_title: quizBase.noteTitle,
        note_preview: quizBase.notePreview,
        questions: quizBase.questions
      })
      .eq('note_id', id);

    // Refresh quizzes from server to be sure
    const { data: refreshedQuizzes } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (refreshedQuizzes) {
      setQuizzes(refreshedQuizzes.map(q => ({
        id: q.id,
        noteId: q.note_id,
        noteTitle: q.note_title,
        notePreview: q.note_preview,
        questions: q.questions,
        createdAt: q.created_at
      })));
    }
  };

  return (
    <AppContext.Provider value={{ notes, quizzes, addNote, deleteNote, updateNote, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
