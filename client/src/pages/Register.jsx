import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join EduLMS</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" 
              placeholder="John Doe"
              value={name} onChange={e => setName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" 
              placeholder="you@university.edu"
              value={email} onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" 
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-white/80 text-sm">
          Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
