import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const badges = [
  { name: 'First Step', icon: '🌟', earned: true },
  { name: 'Quiz Master', icon: '🏆', earned: true },
  { name: 'Python Pro', icon: '🐍', earned: false },
  { name: 'ICT Expert', icon: '💻', earned: false },
];

const recentActivity = [
  { action: 'Completed lesson: What is Python?', time: '2 hours ago', icon: '✅' },
  { action: 'Scored 80% on Python Basics Quiz', time: '1 day ago', icon: '📝' },
  { action: 'Enrolled in ICT Fundamentals', time: '3 days ago', icon: '📚' },
];

const recommendations = [
  { id: '1', title: 'Python Loops Deep Dive', reason: 'Weak area detected', emoji: '🔁' },
  { id: '3', title: 'Python OOP', reason: 'Next in your learning path', emoji: '🔧' },
];

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-black">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-indigo-200 mt-1">You're on a 3-day learning streak. Keep it up!</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-black">1,250</div>
            <div className="text-xs text-indigo-200">Points</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-black">🔥3</div>
            <div className="text-xs text-indigo-200">Day streak</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: '2', icon: '📚', color: 'bg-blue-50 text-blue-600' },
          { label: 'Completed Lessons', value: '12', icon: '✅', color: 'bg-green-50 text-green-600' },
          { label: 'Quizzes Taken', value: '5', icon: '📝', color: 'bg-amber-50 text-amber-600' },
          { label: 'Avg Score', value: '78%', icon: '🎯', color: 'bg-purple-50 text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 flex items-center gap-4`}>
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs font-medium opacity-70">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4">🎯 Recommended For You</h2>
          <div className="space-y-3">
            {recommendations.map(r => (
              <div key={r.id} onClick={() => navigate(`/student/course/${r.id}`)}
                className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer transition-all group">
                <div className="text-3xl">{r.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700 group-hover:text-indigo-700">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.reason}</p>
                </div>
                <span className="text-indigo-400 group-hover:text-indigo-600">→</span>
              </div>
            ))}
            <button onClick={() => navigate('/student/courses')}
              className="w-full text-center py-2 text-sm text-indigo-600 font-semibold hover:underline">
              Browse all courses →
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4">🏅 Badges</h2>
          <div className="grid grid-cols-2 gap-3">
            {badges.map(b => (
              <div key={b.name}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all
                  ${b.earned ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'}`}>
                <span className="text-3xl">{b.icon}</span>
                <span className="text-xs font-semibold text-slate-600">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4">🕒 Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{a.action}</p>
                <p className="text-xs text-slate-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
