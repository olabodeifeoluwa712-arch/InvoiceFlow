import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import heroImg from '../../assets/chart.png';

const Register = () => {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [animateShake, setAnimateShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [params] = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    if (!form.fullName.trim()) return 'Full Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!form.role) return 'Please select an account type.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) { triggerError(validationError); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';

    const res = register({
      email: form.email,
      password: form.password,
      firstName,
      lastName,
      role: form.role,
    });

    setLoading(false);
    if (res && res.success) {
      setSuccess('Account created successfully! Welcome aboard.');
      setTimeout(() => navigate('/'), 1500);
    } else {
      triggerError(res?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEF3] dark:bg-cyber-dark text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 select-none">

      {/* ── Top Navigation ── */}
      <header className="bg-white dark:bg-cyber-dark border-b border-slate-200/80 dark:border-slate-800 py-3 px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/35 transition-all duration-300">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">InvoiceFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-lg border transition-all duration-300 cursor-pointer bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900/60 dark:border-slate-700 dark:text-neon-cyan dark:hover:bg-slate-800 shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 18.364l-.707-.707M6.364 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Sign In
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center p-5 md:p-8">
        {/* Outer card wrapper */}
        <div className="w-full max-w-4xl bg-white dark:bg-cyber-card rounded-3xl shadow-xl shadow-slate-300/40 dark:shadow-black/40 overflow-hidden border border-slate-200/60 dark:border-slate-800">
          <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[620px] ${animateShake ? 'animate-shake' : ''}`}>

            {/* ── LEFT: Promo Panel ── */}
            <div className="bg-gradient-to-br from-[#7F22FE] via-[#6f1ee8] to-[#5248cc] p-8 md:p-10 flex flex-col text-white relative overflow-hidden">
              {/* Subtle radial glow overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(ellipse at 15% 85%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.07) 0%, transparent 45%)' }}
              />

              {/* Logo */}
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="h-8 w-8 rounded-xl bg-white/20 border border-white/15 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                </div>
                <span className="text-base font-extrabold tracking-tight">InvoiceFlow</span>
              </div>

              {/* Platform badge */}
              <div className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/10 text-white/90 text-[11px] font-semibold tracking-wide mb-4 relative z-10">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                All-in-one business platform
              </div>

              {/* Headline */}
              <h1 className="text-[1.65rem] font-extrabold leading-[1.2] mb-3 relative z-10">
                Start growing your<br />business today
              </h1>

              <p className="text-white/70 text-sm leading-relaxed mb-5 relative z-10 max-w-[280px]">
                Join thousands of businesses that trust InvoiceFlow to manage invoices, track payments, and streamline their finances.
              </p>

              {/* Dashboard mockup image */}
              <div className="flex-1 relative z-10 flex flex-col justify-center mb-4 min-h-[160px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                  <img
                    src={heroImg}
                    alt="InvoiceFlow Dashboard"
                    className="w-full object-cover object-top"
                    style={{ maxHeight: '190px' }}
                  />
                  {/* Revenue pill overlay */}
                  <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-slate-500 leading-none mb-0.5">Revenue this month</p>
                      <p className="text-sm font-extrabold text-emerald-600 leading-none">+18.4%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="space-y-2.5 relative z-10">
                {[
                  'Up to 25 invoices free',
                  'No credit card required',
                  'Cancel anytime',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-white/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Registration Form ── */}
            <div className="bg-white dark:bg-cyber-card/95 p-7 md:p-9 flex flex-col justify-center relative overflow-y-auto">
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#7F22FE]/40 dark:via-neon-cyan/40 to-transparent" />

              {/* Free trial badge */}
              <div className="inline-flex items-center self-start gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/40 text-[#7F22FE] dark:text-violet-300 text-[11px] font-bold tracking-wide mb-4">
                🚀 Free Forever — No Credit Card
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">Create Your Account</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">Join 10,000+ businesses on InvoiceFlow</p>

              {/* Error / Success */}
              {error && (
                <div className="mb-4 border border-red-300/50 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2.5 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-semibold">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 border border-emerald-300/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2.5 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#7F22FE] dark:group-focus-within:text-neon-cyan transition-colors pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      id="register-fullname"
                      type="text"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-2 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Work Email</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#7F22FE] dark:group-focus-within:text-neon-cyan transition-colors pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      id="register-email"
                      type="text"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-2 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Password</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#7F22FE] dark:group-focus-within:text-neon-cyan transition-colors pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-2 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Company Name</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#7F22FE] dark:group-focus-within:text-neon-cyan transition-colors pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <input
                      id="register-company"
                      type="text"
                      placeholder="Acme Inc."
                      value={form.companyName}
                      onChange={e => set('companyName', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-2 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Account Type</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#7F22FE] dark:group-focus-within:text-neon-cyan transition-colors pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>

                    <input
                      id="register-role"
                      value={form.role}
                      onChange={e => set('role', e.target.value)}
                      placeholder='Business Owner'
                      readOnly
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#7F22FE] dark:focus:border-neon-cyan focus:ring-2 focus:ring-[#7F22FE]/10 dark:focus:ring-neon-cyan/15 transition-all font-medium appearance-none cursor-pointer"
                    />
                      {/* <option value="business" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Business Owner (Trial)</option> */}
                      {/* <option value="Admin" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">System Admin Portal</option>
                      <option value="Accountant" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Accountant Ledger</option>
                      <option value="inventory" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Inventory Manager</option>
                      <option value="Soloprenuer" className="bg-white text-slate-800 dark:bg-[#0e1320] dark:text-slate-200">Solopreneur</option> */}
                    {/* </select> */}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Create Account CTA */}
                <button
                  type="submit"
                  id="register-submit"
                  disabled={loading}
                  className="w-full relative py-3 rounded-xl font-bold text-sm bg-[#7F22FE] hover:bg-[#6b1fd8] text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 w-1/3 bg-white/15 -skew-x-12 -translate-x-full group-hover/btn:translate-x-[400%] transition-transform duration-700 ease-out" />
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">or sign up with</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60" />
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/60 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.93 1 12 1 7.35 1 3.39 3.65 1.48 7.52l3.75 2.91C6.1 7.21 8.84 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.48 12.25c0-.82-.07-1.62-.21-2.4H12v4.54h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.54z" />
                      <path fill="#FBBC05" d="M5.23 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.48 7.32C.54 9.24 0 11.4 0 13.5s.54 4.26 1.48 6.18l3.75-2.91z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.16 0-5.9-2.17-6.77-5.39l-3.75 2.91C3.39 20.35 7.35 23 12 23z" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/60 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#80bb0a" d="M12 0h11v11H12z" />
                      <path fill="#00a4ef" d="M0 12h11v11H0z" />
                      <path fill="#ffb900" d="M12 12h11v11H12z" />
                    </svg>
                    Microsoft
                  </button>
                </div>

              </form>

              {/* Terms & sign-in link */}
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
                By signing up, you agree to our{' '}
                <a href="#" className="underline text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
                {' and '}
                <a href="#" className="underline text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
              </p>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                Already have an account?{' '}
                <Link to="/login" className="text-[#7F22FE] dark:text-violet-400 font-bold hover:text-[#6b1fd8] dark:hover:text-violet-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-4 text-center text-[11px] text-slate-400 dark:text-slate-600">
        © {new Date().getFullYear()} InvoiceFlow ·{' '}
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Privacy Policy</a>
        {' · '}
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Terms of Service</a>
      </footer>

    </div>
  );
};

export default Register;