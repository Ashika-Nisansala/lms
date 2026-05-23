import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent successfully.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col justify-between font-sans antialiased relative overflow-hidden">
      
      {/* Soft, scholarly atmospheric glow spheres (subtle Emerald & Mint) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-200/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-200/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Header */}
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
          <span className="hidden sm:inline-block">Security Center</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Network Active
          </span>
        </div>
      </header>

      {/* Main Focus Card */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col justify-center py-12 lg:py-16 relative z-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
              Identity Verification
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Reset Password</h2>
            <p className="text-sm text-slate-500">Provide your registered email to request a secure password reset link.</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.02)] relative overflow-hidden space-y-6 p-8">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

            {message ? (
              <div className="space-y-6 py-2 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                  ✉️
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-950">Check Your Console</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {message}
                  </p>
                </div>
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-left text-xs text-amber-800 leading-relaxed space-y-1">
                  <strong className="block text-amber-900">💻 Local Development Note:</strong>
                  Since this is a local development setup, outbound emails are simulated. 
                  Please **check your backend server logs/terminal** to find the reset URL!
                </div>
                <div className="pt-2">
                  <Link to="/login" className="w-full inline-block text-center py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md">
                    Return to Log In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Academic Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm font-medium"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Processing Request...' : 'Send Reset Link'}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Workspace Access</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <div className="text-center text-xs">
                  <p className="text-slate-400">
                    Remember your key?{' '}
                    <Link to="/login" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors hover:underline">
                      Back to Log In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
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
