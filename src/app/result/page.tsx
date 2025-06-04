'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';
import { useQuiz } from '../context/QuizContext';

export default function ResultPage() {
  const [error, setError] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { userData, quizData } = useQuiz();

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Redirect if no user data or quiz data
    if (!userData || !quizData) {
      router.push('/');
      return;
    }

    const submitResult = async () => {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);

      const { name, email } = userData;
      const { score: numericScore, duration: durationSec } = quizData;
      const durationText = formatDuration(durationSec);

      setScore(numericScore);

      if (!name || !email || isNaN(numericScore) || isNaN(durationSec)) {
        setError('Invalid data. Please retake the quiz.');
        return;
      }

      try {
        // First check if the result already exists
        const { data: existing, error: checkError } = await supabase
          .from('quiz_results')
          .select('id, score')
          .eq('name', name)
          .eq('email', email)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing result:', checkError);
          setError('Error checking previous submission. Please try again.');
          return;
        }

        if (existing) {
          setError('⚠️ You have already submitted the quiz.');
          setScore(existing.score); // Show the previous score
          return;
        }

        // If no existing result, proceed with insertion
        const { error: insertError } = await supabase.from('quiz_results').insert([
          {
            name,
            email,
            score: numericScore,
            duration_seconds: durationSec,
            duration_text: durationText,
          },
        ]);

        if (insertError) {
          console.error('Error saving result:', insertError);
          if (insertError.code === '23505') {
            setError('This name and email combination has already been used. Please use different details.');
          } else {
            setError('Something went wrong while saving your result. Please try again later.');
          }
          return;
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitResult();
  }, [router, isSubmitting, userData, quizData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="bg-white shadow-xl rounded-xl px-10 py-12 max-w-lg w-full text-center transition-all duration-300">
        {error ? (
          <div className="text-red-500 text-center">
            <h1 className="text-3xl font-bold text-red-700 mb-3">⚠️ Error ⚠️</h1>
            <p className="text-lg text-gray-700 mb-4">{error}</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-700 mb-3">🎉 Quiz Completed!</h1>
            <p className="text-lg text-gray-700 mb-4">Your Score:</p>
            <p className="text-5xl font-extrabold text-green-600 mb-6">{score}</p>

            <Link
              href="/leaderboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-md transition"
            >
              View Leaderboard
            </Link>

            <div className="mt-6 text-sm text-gray-400">
              Thank you for participating in the Eco Awareness Quiz! 🌍
            </div>
          </>
        )}
      </div>
    </div>
  );
}
