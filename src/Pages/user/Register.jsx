import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext'

const Register = () => {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: ""
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [animateShake, setAnimateShake] = useState(false);

  const [params] = useSearchParams();
  const set = (k, v) => { 
    setForm(p => ({ ...p, [k]: v })); 
    setError(''); 
    setSuccess('');
  };

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(params.get('from') || '/', { replace: true });
  }, [isAuthenticated]);

  const triggerError = (msg) => {
    setError(msg);
    setAnimateShake(true);
    setTimeout(() => setAnimateShake(false), 500);
  };

  const validate = () => {
    if (!form.firstName.trim()) return 'First Name is required.';
    if (!form.lastName.trim())  return 'Last Name is required.';
    if (!form.email.trim())     return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password)         return 'Password is required.';
    if (form.password.length < 6)
      return 'Password must be at least 6 characters.';
    if (!form.role)             return 'Please select a role.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    const validationError = validate();
    if (validationError) { 
      triggerError(validationError); 
      return; 
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate network latency
    const res = register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role
    });
    
    setLoading(false);
    if (res && res.success) {
      setSuccess('Account created successfully! Welcome aboard.');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      triggerError(res?.error || 'Registration failed. Please try again.');
    }
  }

  return (
    <div className="transition-colors duration-300 bg-slate-50 text-slate-800 dark:bg-cyber-dark dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 flex items-center justify-center p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950/40 dark:border-slate-800 dark:text-neon-cyan dark:hover:bg-slate-900/60 shadow-md"
        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 18.364l-.707-.707M6.364 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        )}
      </button>

      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/15 rounded-full blur-[110px] animate-float-1 pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/15 rounded-full blur-[110px] animate-float-2 pointer-events-none transition-all duration-300"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-neon-pink/5 dark:bg-neon-pink/10 rounded-full blur-[130px] animate-float-2 pointer-events-none transition-all duration-300"></div>

      {/* Main Glassmorphic Container */}
      <div className={`w-full max-w-lg bg-white border border-slate-200 shadow-xl dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800 rounded-3xl p-8 md:p-10 dark:shadow-2xl relative z-10 duration-500 transition-all hover:border-slate-300 dark:hover:border-slate-700/80 ${animateShake ? 'animate-shake' : ''}`}>
        
        {/* Glow Border Overlay Accent */}
        <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan dark:to-transparent opacity-80"></div>
        
        {/* Logo and Subtitle */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-purple p-[2px] mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-pulse">
            <div className="w-full h-full bg-white dark:bg-cyber-card rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-purple dark:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider text-center text-slate-900 bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan">
            INVOICE FLOW
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-xs mt-1 tracking-widest font-mono uppercase text-center">
            Cyberpunk Business Portal
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-455 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-cyan transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="First Name" 
                onChange={e => set('firstName', e.target.value)} 
                value={form.firstName}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/35 text-slate-850 placeholder-slate-450 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50 focus:neon-glow-cyan"
              />
            </div>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-455 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-cyan transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Last Name" 
                onChange={e => set('lastName', e.target.value)} 
                value={form.lastName}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/35 text-slate-850 placeholder-slate-450 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50 focus:neon-glow-cyan"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-455 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Email Address" 
              onChange={e => set('email', e.target.value)} 
              value={form.email}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/35 text-slate-855 placeholder-slate-450 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50 focus:neon-glow-cyan"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-455 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </span>
            <input 
              type="password" 
              placeholder="Password (Min. 6 chars)" 
              onChange={e => set('password', e.target.value)} 
              value={form.password}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/35 text-slate-855 placeholder-slate-450 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-purple/80 dark:focus:ring-neon-purple/50 focus:neon-glow-purple"
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-455 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </span>
            <select 
              name="role" 
              id="role" 
              value={form.role} 
              onChange={e => set('role', e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 text-slate-700 placeholder-slate-450 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-300 dark:placeholder-slate-500 dark:focus:border-neon-purple/80 dark:focus:ring-neon-purple/50 dark:focus:neon-glow-purple appearance-none cursor-pointer"
            >
              <option value="" className="bg-white text-slate-500 dark:bg-[#0e1320] dark:text-slate-400">Select Cyber Role</option>
              <option value="Soloprenuer" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Solopreneur</option>
              <option value="Admin" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Admin Portal Operator</option>
              <option value="Accountant" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Accountant Ledger</option>
              <option value="inventory" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Inventory Manager</option>
              <option value="business" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">business</option>
            </select>
            {/* Custom chevron arrow */}
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within:text-neon-purple dark:text-slate-500 dark:group-focus-within:text-neon-purple">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full relative mt-4 py-3.5 rounded-xl font-extrabold tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-slate-950 hover:from-neon-cyan hover:to-neon-pink transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
          >
            {/* Ambient button reflection */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-out"></div>
            
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <span>REGISTER</span>
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-slate-550 dark:text-slate-400">
            Already registered?{' '}
            <Link 
              to="/login" 
              className="text-neon-purple dark:text-neon-cyan font-bold hover:text-neon-pink dark:hover:text-neon-pink transition-colors relative group py-1"
            >
              Access Account
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register