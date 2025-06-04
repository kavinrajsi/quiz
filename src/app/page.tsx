'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useQuiz } from './context/QuizContext';

export default function Home() {
  const router = useRouter();
  const { setUserData } = useQuiz();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateName = (name: string) => /^[a-zA-Z\s]+$/.test(name.trim());
  const validateEmail = (email: string) => /^[^\s@]+@[a-z]+\.[a-z]+$/.test(email);

  const startQuiz = async () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!validateName(name)) {
      setError('Name can only contain letters and spaces.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Enter a valid email with alphabetic domain and extension (e.g., name@gmail.com).');
      return;
    }

    setLoading(true);

    // Check if user already submitted
    const { data, error: dbError } = await supabase
      .from('quiz_results')
      .select('id')
      .eq('name', name.trim())
      .eq('email', email.trim())
      .maybeSingle();

    if (dbError) {
      setError('Database error. Please try again.');
      setLoading(false);
      return;
    }

    if (data) {
      setError('You have already participated in the quiz.');
      setLoading(false);
      return;
    }

    // Save user data in context and continue
    setUserData({ name: name.trim(), email: email.trim() });
    router.push('/quiz');
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-700">🌱 Eco Awareness Quiz</h1>
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => {
            setName(e.target.value);
            setError('');
          }}
          className="w-full border border-gray-300 p-2 rounded text-black"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError('');
          }}
          className="w-full border border-gray-300 p-2 rounded text-black"
        />
        {error && (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        )}
        <button
          onClick={startQuiz}
          disabled={loading}
          className={`w-full py-2 rounded text-white hover:cursor-pointer ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Checking...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
