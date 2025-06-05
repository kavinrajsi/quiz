'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { useQuiz } from '../context/QuizContext';

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const router = useRouter();
  const { userData, setQuizData } = useQuiz();

  // Redirect if no user data
  useEffect(() => {
    if (!userData) {
      router.push('/');
    }
  }, [userData, router]);

  // Start the timer when quiz loads
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[current].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(prev => prev + 1);
      } else {
        // Calculate duration and prepare result data
        const end = Date.now();
        const duration = Math.floor((end - startTime) / 1000); // in seconds
        const finalScore = score + (isCorrect ? 1 : 0);

        // Save quiz data in context
        setQuizData({
          score: finalScore,
          duration
        });
        
        router.push('/result');
      }
    }, 200); // Short delay for smoother UX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-10 transition-all duration-300">
        {/* Progress */}
        <div className="text-sm text-gray-600 mb-4">
          Question {current + 1} of {questions.length}
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          {questions[current].question}
        </h2>

        {/* Answer Options */}
        <div className="grid gap-4">
          {questions[current].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full border border-gray-300 text-lg rounded-md py-3 px-4 hover:bg-[#ef4130] hover:text-white transition-colors duration-150 text-left text-gray-800 hover:cursor-pointer"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-center text-gray-400">
          Eco Awareness Quiz • One question at a time
        </div>
      </div>
    </div>
  );
}
