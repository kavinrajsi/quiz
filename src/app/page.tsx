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
    setError('');

    try {
      // Check if user already submitted by either name OR email
      const { data: existingByName, error: nameError } = await supabase
        .from('quiz_results')
        .select('id, name, email')
        .eq('name', name.trim())
        .maybeSingle();

      const { data: existingByEmail, error: emailError } = await supabase
        .from('quiz_results')
        .select('id, name, email')
        .eq('email', email.trim())
        .maybeSingle();

      if (nameError || emailError) {
        setError('Database error. Please try again.');
        setLoading(false);
        return;
      }

      // Check for duplicate name
      if (existingByName) {
        setError(`The name "${name.trim()}" has already been used. Please use a different name.`);
        setLoading(false);
        return;
      }

      // Check for duplicate email
      if (existingByEmail) {
        setError(`The email "${email.trim()}" has already been used. Please use a different email.`);
        setLoading(false);
        return;
      }

      // Save user data in context and continue
      setUserData({ name: name.trim(), email: email.trim() });
      router.push('/quiz');
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
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
          disabled={loading}
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
          disabled={loading}
        />
        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}
        <button
          onClick={startQuiz}
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:cursor-pointer'
          }`}
        >
          {loading ? 'Checking...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}