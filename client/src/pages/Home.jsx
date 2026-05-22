import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@lms.edu');
      setPassword('Admin@1234');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col justify-between font-sans antialiased relative overflow-hidden">

      {/* Soft, scholarly atmospheric glow spheres (subtle Emerald & Mint to match Register portal) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-200/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-200/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Premium Scholarly Navigation Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-sm shadow-md shadow-emerald-500/10 text-white font-bold">
            🎓
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">EduLMS</span>
            <span className="text-[9px] text-emerald-600 font-bold block leading-none tracking-widest uppercase">Academic Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="hidden sm:inline-block">University Gateway</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Network Active
          </span>
        </div>
      </header>

      {/* Main Focus: Grid layout with Student/Lecturer highlights + Elegant Login Card */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Side: Smart and Attractive Highlights for Students & Lectures */}
        <section className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
              Higher Education Suite
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
              Empowering Smart <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500">Learning & Instruction</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-xl">
              An advanced, minimalist workspace designed for university students and lecturers to streamline digital coursework, assessments, and AI support.
            </p>
          </div>

          {/* Structured Roles Focus: Student & Lecturer */}
          <div className="space-y-4 max-w-lg">

            {/* For Students */}
            <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/5 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                👨‍🎓
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Interactive Student Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse structured modules, complete instant-grading quizzes, view metrics, and chat with your AI study assistant.
                </p>
              </div>
            </div>

            {/* For Lecturers */}
            <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-teal-500/20 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-teal-500/5 text-teal-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                👩‍🏫
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Advanced Academic Management</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage curriculum tracks, seed sample datasets, monitor learning diagnostics, and manage administrative settings.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Right Side: Unified Scholarly Login Card */}
        <section className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.02)] relative overflow-hidden space-y-6 p-8">

            {/* The Scholarly Top Gradient Line: Emerald to Teal to Gold */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

            {/* Header info */}
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Portal Access</h3>
              <p className="text-xs text-slate-500">Enter your credentials to enter your dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Academic Email
                </label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Secure Password
                </label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2 animate-shake">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Authenticating...' : 'Enter Academic Workspace'}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Options</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Micro-Minimal Developer Seed Tool & Register Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5 font-bold border border-emerald-200 hover:border-emerald-300 px-3 py-1 rounded bg-emerald-500/5"
              >
                👑 Seed Administrator
              </button>

              <p className="text-slate-400">
                New student?{' '}
                <Link to="/register" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors hover:underline">
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Crisp Academic Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4 relative z-10">
        <div>
          © {new Date().getFullYear()} EduLMS. Academic Platform for Advanced Learning.
        </div>
        <div className="flex gap-4 font-semibold text-slate-400">
          <span className="hover:text-emerald-700 transition-colors cursor-pointer">Security Guidelines</span>
          <span className="hover:text-emerald-700 transition-colors cursor-pointer">Privacy Charter</span>
          <span className="hover:text-emerald-700 transition-colors cursor-pointer">Platform Status</span>
        </div>
      </footer>

    </div>
  );
}
