'use client';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data } = await supabase
        .from('quiz_results')
        .select('id, name, score, duration_text, duration_seconds')
        .order('score', { ascending: false }) // priority 1
        .order('duration_seconds', { ascending: true }); // priority 2 (faster is better)
      setLeaders(data || []);
    };
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">🏆 Leaderboard</h1>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">#</th>
              <th className="pb-2">Name</th>
              <th className="pb-2 text-right">Score</th>
              <th className="pb-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user.id} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 font-semibold text-gray-700">{index + 1}</td>
                <td className="py-3 text-gray-800">{user.name}</td>
                <td className="py-3 text-right font-medium text-purple-700">{user.score}</td>
                <td className="py-3 text-right text-gray-500">{user.duration_text}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <a
          href="/"
          className="mt-8 inline-block bg-gray-700 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-md transition"
        >
          Retake Quiz
        </a>
      </div>
    </div>
  );
}
