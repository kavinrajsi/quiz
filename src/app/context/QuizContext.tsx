'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  userData: {
    name: string;
    email: string;
  } | null;
  setUserData: (data: { name: string; email: string }) => void;
  quizData: {
    score: number;
    duration: number;
  } | null;
  setQuizData: (data: { score: number; duration: number }) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [quizData, setQuizData] = useState<{ score: number; duration: number } | null>(null);

  return (
    <QuizContext.Provider value={{ userData, setUserData, quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
} 