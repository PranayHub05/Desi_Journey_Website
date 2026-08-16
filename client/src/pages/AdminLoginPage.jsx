import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081325] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-ocean/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative z-10">
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-slate-900">Admin Authentication</h1>
          <p className="text-slate-500 text-xs mt-1.5">Enter password to access the Content Management Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium placeholder:text-slate-400"
                placeholder="Enter password (default: 1234)"
                required
              />
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 text-red-600 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-ocean to-cyan text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-cyan/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            {!loading && <HiOutlineArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">Desi Journey Content Engine • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
