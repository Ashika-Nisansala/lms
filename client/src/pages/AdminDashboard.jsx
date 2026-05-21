import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const scoreData = [
  { lesson: 'Variables', avg: 85 },
  { lesson: 'Loops', avg: 62 },
  { lesson: 'Functions', avg: 74 },
  { lesson: 'OOP', avg: 55 },
  { lesson: 'Lists', avg: 80 },
];

const enrollData = [
  { month: 'Jan', students: 20 },
  { month: 'Feb', students: 35 },
  { month: 'Mar', students: 50 },
  { month: 'Apr', students: 42 },
  { month: 'May', students: 68 },
];

const students = [
  { name: 'Alice Tan', email: 'alice@uni.edu', score: 88, progress: 75, status: 'Active' },
  { name: 'Bob Malik', email: 'bob@uni.edu', score: 62, progress: 40, status: 'Active' },
  { name: 'Chloe Lee', email: 'chloe@uni.edu', score: 95, progress: 90, status: 'Active' },
  { name: 'David Obi', email: 'david@uni.edu', score: 45, progress: 25, status: 'Inactive' },
];

const COURSES_LIST = [
  { id: '1', title: 'Python for Beginners', category: 'Python', lessons: 12, enrolled: 204, emoji: '🐍' },
  { id: '2', title: 'ICT Fundamentals', category: 'ICT', lessons: 10, enrolled: 189, emoji: '💻' },
  { id: '3', title: 'Python OOP', category: 'Python', lessons: 8, enrolled: 98, emoji: '🔧' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'students', label: '👥 Students' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-black">Instructor Dashboard</h1>
          <p className="text-slate-300 mt-1">Manage courses, track student progress, and view analytics.</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md">
          + Create New Course
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: '491', icon: '👥', color: 'bg-blue-50 text-blue-700' },
              { label: 'Active Courses', value: '6', icon: '📚', color: 'bg-green-50 text-green-700' },
              { label: 'Quizzes Created', value: '24', icon: '📝', color: 'bg-amber-50 text-amber-700' },
              { label: 'Avg Score', value: '73%', icon: '🎯', color: 'bg-purple-50 text-purple-700' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-2xl p-5 flex items-center gap-4`}>
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-xs font-medium opacity-70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4">📈 Avg Score by Topic</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="lesson" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Avg Score']} />
                  <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4">👥 Monthly Enrollments</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-800 mb-2">⚠️ Weak Area Alert</h3>
            <p className="text-amber-700 text-sm">Students are struggling most with <strong>OOP (55%)</strong> and <strong>Loops (62%)</strong>. Consider adding more practice materials for these topics.</p>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {COURSES_LIST.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5">
              <div className="text-4xl">{course.emoji}</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{course.title}</h3>
                <p className="text-sm text-slate-400">{course.category} • {course.lessons} lessons • {course.enrolled} enrolled</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">Edit</button>
                <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Score</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Progress</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${s.score >= 80 ? 'text-green-600' : s.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {s.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
