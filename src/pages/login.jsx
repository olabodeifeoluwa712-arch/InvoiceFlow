import React from 'react'
import { useAuth } from '../Context/AuthContext'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [animateShake, setAnimateShake] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate(params.get('from') || '/', { replace: true });
  }, [isAuthenticated]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setError('');
    setSuccess('');
  };

  const triggerError = (msg) => {
    setError(msg);
    setAnimateShake(true);
    setTimeout(() => setAnimateShake(false), 500);
  };

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    if (!form.password) return 'Password is required.';
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      triggerError(validationError);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate mock network latency
    const res = login({
      email: form.email,
      password: form.password
    });

    setLoading(false);
    if (res && res.success) {
      setSuccess('Access granted! Authenticating...');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } else {
      triggerError(res?.error || 'Invalid credentials. Access Denied.');
    }
  };

  return (
    <div className="bg-cyber-dark text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background Decorative Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/15 rounded-full blur-[110px] animate-float-1 pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/15 rounded-full blur-[110px] animate-float-2 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-pink/10 rounded-full blur-[130px] animate-float-2 pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className={`w-full max-w-md bg-cyber-card/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 duration-500 transition-all hover:border-slate-700/80 ${animateShake ? 'animate-shake' : ''}`}>

        {/* Glow Border Overlay Accent */}
        <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan via-neon-purple to-transparent opacity-80"></div>

        {/* Logo and Subtitle */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-purple p-[2px] mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-pulse">
            <div className="w-full h-full bg-cyber-card rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-neon-cyan via-slate-100 to-neon-purple bg-clip-text text-transparent text-glow-cyan text-center">
            INVOICE FLOW
          </h1>
          <p className="text-slate-400 text-xs mt-1 tracking-widest font-mono uppercase text-center">
            Operator Access Required
          </p>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="mb-6 border border-neon-pink/30 bg-neon-pink/10 text-neon-pink px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in shadow-[0_0_15px_rgba(255,0,127,0.1)]">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span className="font-medium font-sans">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium font-sans">{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email Input */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Operator Email"
              onChange={(e) => set('email', e.target.value)}
              value={form.email}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-cyan/80 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-cyan/50 text-slate-100 placeholder-slate-500 font-medium focus:neon-glow-cyan"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-neon-purple transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </span>
            <input
              type="password"
              placeholder="Operator Password"
              onChange={(e) => set('password', e.target.value)}
              value={form.password}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-purple/80 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/50 text-slate-100 placeholder-slate-500 font-medium focus:neon-glow-purple"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative mt-6 py-3.5 rounded-xl font-extrabold tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-slate-950 hover:from-neon-cyan hover:to-neon-pink transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
          >
            {/* Ambient button reflection */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-out"></div>

            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                <span>LOGIN</span>
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-slate-400">
            New operator?{' '}
            <Link
              to="/register"
              className="text-neon-cyan font-bold hover:text-neon-pink hover:text-glow-pink transition-colors relative group py-1"
            >
              Request Access
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login