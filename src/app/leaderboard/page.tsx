'use client';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

// Define the type for leaderboard entries
interface LeaderboardEntry {
  id: number;
  name: string;
  email: string;
  score: number;
  duration_text: string;
  duration_seconds: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data } = await supabase
        .from('quiz_results')
        .select('id, name, email, score, duration_text, duration_seconds')
        .order('score', { ascending: false }) // priority 1
        .order('duration_seconds', { ascending: true }); // priority 2 (faster is better)
      setLeaders(data || []);
    };
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">🏆 Leaderboard</h1>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">#</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2 text-right">Score</th>
              <th className="pb-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user.id} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 text-gray-700 text-left font-semibold ">{index + 1}</td>
                <td className="py-3 text-gray-800 text-left">{user.name}</td>
                <td className="py-3 text-gray-800 text-left">{user.email}</td>
                <td className="py-3 text-purple-700 text-center font-medium">{user.score}</td>
                <td className="py-3 text-gray-500 text-right">{user.duration_text}</td>
              </tr>
            ))}
          </tbody>
        </table>  
        {leaders.length === 0 && (
          <p className="mt-6 text-gray-500">No results yet. Be the first to take the quiz!</p>
        )}
      </div>
    </div>
  );
}