import { useState, useContext, useEffect } from 'react';
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

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
  const isRealGoogleConfigured = GOOGLE_CLIENT_ID && 
    !GOOGLE_CLIENT_ID.includes('your-') && 
    !GOOGLE_CLIENT_ID.includes('client-id') && 
    !GOOGLE_CLIENT_ID.includes('placeholder') && 
    GOOGLE_CLIENT_ID.trim() !== '';

  useEffect(() => {
    // Only load Google SDK script if a real Client ID is configured
    if (isRealGoogleConfigured) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleGoogleLoginSuccess
            });
            // Render Google's official secure Sign-In popup button
            window.google.accounts.id.renderButton(
              document.getElementById('google-real-btn'),
              { theme: 'outline', size: 'large', text: 'signin_with', width: 340 }
            );
          }
        } catch (gsiErr) {
          console.warn('Google Identity Services SDK failed to initialize gracefully:', gsiErr);
        }
      };
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
      };
    }
  }, [GOOGLE_CLIENT_ID, isRealGoogleConfigured]);

  const handleGoogleLoginSuccess = async (response) => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: response.credential,
        isMock: false
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError(err.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google Sign-In with a developer mock student account
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        email: 'developer.google@lms.edu',
        name: 'Google Developer Student',
        isMock: true
      });
      login(res.data.user, res.data.token);
      // Store flag to display a helpful developer notification in the Student Dashboard
      localStorage.setItem('google_mock_notice', 'true');
      navigate('/student/dashboard');
    } catch (err) {
      console.error('Mock Google Auth Error:', err);
      setError(err.response?.data?.message || 'Mock Google login failed.');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Focus: Side-by-side minimal tagline + Login Card */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Column: Bold Tagline Statement (No extra descriptive words) */}
        <section className="lg:col-span-7 flex flex-col justify-center space-y-4 lg:pr-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Empowering Smart <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 block sm:inline">Learning & Instruction</span>
          </h2>
        </section>

        {/* Right Column: Unified Scholarly Login Card */}
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
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Secure Password
                  </label>
                  <Link to="/forgot-password" className="text-[10px] text-emerald-700 hover:text-emerald-800 transition-colors font-bold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
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
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Enter Academic Workspace'}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Google Integration</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Custom Google Buttons Container */}
            <div className="space-y-3 pt-1 flex flex-col items-center w-full">
              {isRealGoogleConfigured ? (
                // Real official Google Sign-In secure iframe button
                <div id="google-real-btn" className="w-full flex justify-center"></div>
              ) : (
                // Local Developer Mock Google Button
                <button
                  type="button"
                  onClick={handleGoogleMockLogin}
                  className="w-full py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.99]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.64 15 1 12 1 7.24 1 3.22 3.73 1.34 7.69l3.86 3C6.12 7.74 8.84 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.91c2.28-2.1 3.54-5.19 3.54-8.71z" />
                    <path fill="#FBBC05" d="M5.2 10.69c-.24-.73-.38-1.51-.38-2.31s.14-1.58.38-2.31l-3.86-3C.56 4.77 0 6.27 0 8.38s.56 3.61 1.34 5.31l3.86-3z" />
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.91-2.98c-1.08.72-2.48 1.15-4.05 1.15-3.16 0-5.88-2.7-6.86-5.65l-3.86 3C3.22 20.27 7.24 23 12 23z" />
                  </svg>
                  <span>Continue with Google (Local Mock)</span>
                </button>
              )}
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Admin Access</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Micro-Minimal Developer Seed Tool & Register Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5 font-bold border border-emerald-200 hover:border-emerald-300 px-3 py-1 rounded bg-emerald-500/5 cursor-pointer"
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
