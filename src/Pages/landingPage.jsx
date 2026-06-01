import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';

/* ─── Animated Counter Hook ─────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  return [count, ref];
}

/* ─── SVG Icons (inline to avoid dependency) ────────────────────────────── */
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckCircle = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─── Feature Icons ─────────────────────────────────────────────────────── */
const FeatureIcon = ({ type }) => {
  const icons = {
    invoice: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    receipt: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    tracking: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    customers: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    team: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    analytics: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };
  return icons[type] || icons.invoice;
};

/* ─── Navbar ────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-cyber-dark/95 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple flex items-center justify-center shadow-lg shadow-purple-500/20 dark:shadow-[0_0_15px_rgba(0,243,255,0.25)] group-hover:shadow-purple-500/40 transition-all duration-300">
            <svg className="h-4.5 w-4.5 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">InvoiceFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-[#7F22FE] dark:hover:text-neon-cyan transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#7F22FE] dark:hover:text-neon-cyan transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-[#7F22FE] dark:hover:text-neon-cyan transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-[#7F22FE] dark:hover:text-neon-cyan transition-colors">Reviews</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-slate-200 text-slate-650 hover:bg-slate-50 dark:bg-slate-900/60 dark:border-slate-800 dark:text-neon-cyan dark:hover:bg-slate-900/90 shadow-sm"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 18.364l-.707-.707M6.364 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            )}
          </button>

          <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-350 hover:text-[#7F22FE] dark:hover:text-neon-cyan transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 rounded-xl shadow-lg shadow-purple-500/25 dark:shadow-[0_0_15px_rgba(0,243,255,0.25)] hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-700 dark:text-slate-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 dark:bg-cyber-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-semibold text-slate-600 dark:text-slate-350 py-2">Features</a>
          <a href="#how-it-works" className="block text-sm font-semibold text-slate-600 dark:text-slate-350 py-2">How It Works</a>
          <a href="#pricing" className="block text-sm font-semibold text-slate-600 dark:text-slate-350 py-2">Pricing</a>
          <a href="#testimonials" className="block text-sm font-semibold text-slate-600 dark:text-slate-350 py-2">Reviews</a>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-bold bg-white border-slate-200 text-slate-650 dark:bg-slate-900/60 dark:border-slate-800 dark:text-neon-cyan"
            >
              <span>Theme Mode</span>
              <span className="font-mono uppercase text-xs">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            <Link to="/login" className="text-center py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300">Sign In</Link>
            <Link to="/register" className="text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] rounded-xl dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ─── Hero Section ──────────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    {/* Background decorations */}
    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-200/30 dark:bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-200/20 dark:bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#7F22FE] dark:bg-neon-purple/10 dark:border-neon-purple/30 dark:text-neon-cyan text-xs font-bold tracking-wider mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7F22FE] dark:bg-neon-cyan animate-pulse" />
        NOW IN PUBLIC BETA
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] mb-6">
        Run Your Entire Business From{' '}
        <span className="bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple bg-clip-text text-transparent">
          One Platform
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
        Create invoices, generate receipts, manage inventory, and collaborate with your team — 
        all from a single, beautifully designed dashboard.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/register"
          className="group px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 rounded-2xl shadow-xl shadow-purple-500/25 dark:shadow-[0_0_15px_rgba(0,243,255,0.25)] hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          Get Started Free
          <ChevronRight />
        </Link>
        <a
          href="#features"
          className="px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-purple-200 dark:hover:border-neon-cyan/50 dark:hover:text-neon-cyan transition-all duration-300"
        >
          See Features
        </a>
      </div>

      {/* Mini dashboard preview */}
      <div className="mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] dark:from-cyber-dark via-transparent to-transparent z-10 pointer-events-none" />
        <div className="bg-white dark:bg-cyber-card/90 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-8 mx-auto max-w-4xl">
          {/* Fake dashboard header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-5 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-slate-100 dark:bg-slate-850 rounded-lg" />
              <div className="h-8 w-8 bg-purple-100 dark:bg-neon-purple/10 rounded-lg" />
            </div>
          </div>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: 'Revenue', value: '$248,000', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', change: '+18.4%' },
              { label: 'Invoices', value: '1,284', color: 'text-purple-600 dark:text-neon-purple', bg: 'bg-purple-50 dark:bg-neon-purple/10', change: '+12.3%' },
              { label: 'Customers', value: '3,420', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', change: '+9.1%' },
              { label: 'Paid Rate', value: '94.2%', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', change: '+2.7%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 dark:border-slate-800/60 p-4">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl md:text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</p>
                <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
              </div>
            ))}
          </div>
          {/* Fake chart */}
          <div className="h-40 bg-gradient-to-br from-slate-50 to-purple-50/40 dark:from-slate-950/40 dark:to-neon-purple/5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-end justify-between px-6 pb-4 gap-2 overflow-hidden">
            {[35, 50, 42, 65, 55, 72, 60, 80, 70, 90, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#7F22FE] to-[#a78bfa] dark:from-neon-cyan dark:to-neon-purple rounded-t-md opacity-80"
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Stats Bar ─────────────────────────────────────────────────────────── */
const StatsBar = () => {
  const [v1, r1] = useCountUp(10000);
  const [v2, r2] = useCountUp(500000);
  const [v3, r3] = useCountUp(53);
  const [v4, r4] = useCountUp(99);

  return (
    <section className="py-12 border-y border-slate-100 dark:border-slate-800/80 bg-white dark:bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div ref={r1}>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">{v1.toLocaleString()}+</p>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">Businesses Trust Us</p>
        </div>
        <div ref={r2}>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">{v2.toLocaleString()}+</p>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">Invoices Generated</p>
        </div>
        <div ref={r3}>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">${v3}M+</p>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">Processed Monthly</p>
        </div>
        <div ref={r4}>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">{v4}.9%</p>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">Uptime Guarantee</p>
        </div>
      </div>
    </section>
  );
};

/* ─── Features Grid ─────────────────────────────────────────────────────── */
const FeaturesSection = () => {
  const features = [
    { icon: 'invoice', title: 'Invoice Management', desc: 'Create, send, and track professional invoices. Automate recurring billing and payment reminders.' },
    { icon: 'receipt', title: 'Receipt Generation', desc: 'Generate beautiful, branded receipts instantly. Digital delivery with download and print options.' },
    { icon: 'tracking', title: 'Expense Tracking', desc: 'Real-time expense monitoring with category breakdowns. AI-powered spending insights and forecasts.' },
    { icon: 'customers', title: 'Customer Management', desc: 'Centralized customer profiles with full history. Smart segmentation and communication tools.' },
    { icon: 'team', title: 'Team Management', desc: 'Role-based access for your entire team. Assign permissions, track activity, and collaborate.' },
    { icon: 'analytics', title: 'Reports & Analytics', desc: 'Interactive dashboards with real-time data. Custom reports, export options, and trend analysis.' },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F8F9FC] dark:bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
            Everything You Need To Run Your Business
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-medium mt-4">
            A comprehensive suite of tools designed to simplify operations and accelerate growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-cyber-card/90 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-7 hover:border-purple-200 dark:hover:border-neon-cyan/40 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-neon-purple/10 dark:to-neon-cyan/10 border border-purple-100 dark:border-neon-purple/20 flex items-center justify-center text-[#7F22FE] dark:text-neon-cyan mb-5 group-hover:shadow-md group-hover:shadow-purple-500/10 dark:group-hover:shadow-neon-cyan/15 transition-all">
                <FeatureIcon type={f.icon} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Dashboard Showcase ────────────────────────────────────────────────── */
const ShowcaseSection = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-cyber-dark overflow-hidden">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Powerful Tools</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
          Powerful Tools Designed For Growing Businesses
        </h2>
        <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-medium mt-4">
          Our dashboard gives you complete visibility and control over every aspect of your business.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart card */}
        <div className="bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-cyber-card/90 dark:to-slate-950/40 dark:border dark:border-slate-800/80 rounded-3xl p-8 text-white dark:text-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl font-bold mb-2 relative z-10">Revenue Analytics</h3>
          <p className="text-white/70 dark:text-slate-400 text-sm mb-8 relative z-10">Track growth in real-time with live charts</p>
          <div className="relative z-10 flex items-end gap-2 h-48">
            {[30, 45, 38, 55, 42, 68, 52, 75, 60, 82, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-white/20 to-white/40 dark:from-neon-cyan dark:to-neon-purple rounded-t-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="relative z-10 flex justify-between mt-4 text-xs text-white/50 dark:text-slate-500 font-medium">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="space-y-4">
          {[
            { label: 'Invoice Automation', value: '94%', desc: 'Of invoices sent automatically', color: 'from-purple-500 to-indigo-500 dark:from-neon-purple dark:to-neon-cyan', width: '94%' },
            { label: 'Payment Collection', value: '87%', desc: 'Collected within 7 days', color: 'from-emerald-500 to-teal-500', width: '87%' },
            { label: 'Customer Satisfaction', value: '98%', desc: 'Positive feedback score', color: 'from-amber-500 to-orange-500', width: '98%' },
            { label: 'Time Saved', value: '12hrs', desc: 'Per week on average', color: 'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-neon-cyan', width: '75%' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-cyber-card/90 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 hover:shadow-md dark:hover:border-neon-cyan/20 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.label}</span>
                <span className="text-sm font-extrabold text-[#7F22FE] dark:text-neon-cyan">{item.value}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{item.desc}</p>
              <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── How It Works ──────────────────────────────────────────────────────── */
const HowItWorks = () => {
  const steps = [
    { num: '1', title: 'Create Your Account', desc: 'Sign up in under 60 seconds. No credit card required. Instantly access your dashboard.' },
    { num: '2', title: 'Set Up Your Business', desc: 'Add your business details, upload your logo, and configure your preferences.' },
    { num: '3', title: 'Start Managing', desc: 'Create your first invoice, add team members, and watch your business grow.' },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#F8F9FC] dark:bg-cyber-dark">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Getting Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
            Get Started In Three Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-purple-200 dark:from-neon-purple/20 to-transparent" />
              )}
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-6 shadow-xl shadow-purple-500/20 dark:shadow-[0_0_15px_rgba(0,243,255,0.25)]">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Value Prop (Save Time & Money) ────────────────────────────────────── */
const ValueProp = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-cyber-dark">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visual */}
        <div className="relative">
          <div className="bg-white dark:bg-cyber-card/90 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl p-6">
            {/* Mini chart header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Savings</p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">$12,840</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400 text-xs font-bold">+24%</span>
                <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[#7F22FE] dark:bg-neon-purple/10 dark:border-neon-purple/25 dark:text-neon-cyan text-xs font-bold">82h saved</span>
              </div>
            </div>
            {/* Stacked bars */}
            <div className="space-y-3">
              {[
                { label: 'Manual Processing', before: 85, after: 15 },
                { label: 'Payment Collection', before: 70, after: 25 },
                { label: 'Report Generation', before: 90, after: 10 },
                { label: 'Client Communication', before: 60, after: 30 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{item.label}</span>
                    <span className="text-emerald-500 dark:text-emerald-450">-{item.before - item.after}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-gradient-to-r from-[#7F22FE] to-[#a78bfa] dark:from-neon-cyan dark:to-neon-purple rounded-full transition-all duration-1000" style={{ width: `${item.after}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 bg-white dark:bg-cyber-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg px-4 py-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">ROI Positive</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Within first month</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Why InvoiceFlow</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 mb-6 tracking-tight">
            Built To Save You Time And Money
          </h2>
          <div className="space-y-4">
            {[
              'Reduce invoice processing time by 85%',
              'Get paid 3x faster with automated reminders',
              'Eliminate manual data entry errors completely',
              'Real-time financial insights at your fingertips',
              'Scale from 1 to 1000+ team members seamlessly',
              'Bank-grade security for all your data',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#7F22FE] dark:text-neon-cyan flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-3.50">{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-[0_0_15px_rgba(0,243,255,0.25)] hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Free Trial
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Team Roles ────────────────────────────────────────────────────────── */
const TeamRoles = () => {
  const roles = [
    { name: 'Business Owner', desc: 'Full control over business operations, invoices, and team management.', color: 'from-purple-500 to-indigo-500 dark:from-neon-purple/20 dark:to-neon-purple/10 dark:border dark:border-neon-purple/30', icon: '👔' },
    { name: 'Accountant', desc: 'Access financial reports, audit trails, payment records, and compliance tools.', color: 'from-emerald-500 to-teal-500 dark:from-emerald-500/20 dark:to-emerald-500/10 dark:border dark:border-emerald-500/30', icon: '📊' },
    { name: 'Sales Manager', desc: 'Track sales performance, customer relationships, and revenue targets.', color: 'from-amber-500 to-orange-500 dark:from-amber-500/20 dark:to-amber-500/10 dark:border dark:border-amber-500/30', icon: '📈' },
    { name: 'Inventory Manager', desc: 'Monitor stock levels, manage suppliers, and track product movements.', color: 'from-blue-500 to-cyan-500 dark:from-blue-500/20 dark:to-blue-500/10 dark:border dark:border-blue-500/30', icon: '📦' },
    { name: 'Solopreneur', desc: 'Simplified dashboard for independent professionals and freelancers.', color: 'from-pink-500 to-rose-500 dark:from-pink-500/20 dark:to-pink-500/10 dark:border dark:border-pink-500/30', icon: '🚀' },
    { name: 'Admin', desc: 'System-wide control with user management and platform configuration.', color: 'from-slate-600 to-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 dark:border dark:border-slate-800/30', icon: '⚙️' },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8F9FC] dark:bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Team Access</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
            Built For Every Team Member
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-medium mt-4">
            Tailored dashboards and permissions for every role in your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role, i) => (
            <div key={i} className="group bg-white dark:bg-cyber-card/90 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-6 hover:border-purple-200 dark:hover:border-neon-cyan/30 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all duration-300 hover:-translate-y-1">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-xl mb-4 shadow-md`}>
                {role.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">{role.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Testimonials ──────────────────────────────────────────────────────── */
const Testimonials = () => {
  const testimonials = [
    { name: 'Sarah Chen', role: 'CEO, TechStart', text: 'InvoiceFlow cut our billing time by 80%. The dashboard is incredibly intuitive and our team adopted it within days.', rating: 5 },
    { name: 'Marcus Johnson', role: 'CFO, GreenLeaf Co.', text: 'Finally, a platform that combines invoicing with real inventory management. The analytics alone have paid for themselves.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Founder, PixelCraft', text: 'As a solopreneur, this is a game-changer. Professional invoices, instant receipts, and expense tracking — all in one place.', rating: 5 },
    { name: 'David Kim', role: 'Operations, ScaleUp', text: 'We moved our entire team to InvoiceFlow. The role-based access and approval workflows are exactly what we needed.', rating: 5 },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white dark:bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
            Loved By Thousands Of Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-slate-50 dark:bg-cyber-card/75 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-7 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Pricing Section ───────────────────────────────────────────────────── */
const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      desc: 'Perfect for solopreneurs and freelancers just getting started.',
      features: ['Up to 50 invoices/month', 'Basic reports', '1 team member', 'Email support', 'Receipt generation'],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      desc: 'Best for growing businesses that need advanced features.',
      features: ['Unlimited invoices', 'Advanced analytics', 'Up to 10 team members', 'Priority support', 'Inventory management', 'Custom branding', 'API access'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organizations with specific requirements.',
      features: ['Everything in Professional', 'Unlimited team members', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#F8F9FC] dark:bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#7F22FE] dark:text-neon-cyan uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-medium mt-4">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white dark:bg-cyber-card/90 rounded-3xl border p-8 flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(189,0,255,0.1)] hover:-translate-y-1 ${
                plan.popular
                  ? 'border-[#7F22FE] dark:border-neon-purple shadow-xl shadow-purple-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800/80 hover:border-purple-200 dark:hover:border-neon-cyan/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 text-white text-xs font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{plan.price}</span>
                  <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#7F22FE] dark:text-neon-cyan flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`text-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-355 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA Section ───────────────────────────────────────────────────────── */
const CTASection = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-cyber-dark">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <div className="bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-cyber-card/90 dark:to-slate-950/40 dark:border dark:border-slate-800/80 rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] pointer-events-none" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 dark:bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 dark:bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white dark:text-slate-100 tracking-tight mb-4">
            Ready To Transform Your Business?
          </h2>
          <p className="text-white/70 dark:text-slate-450 text-base md:text-lg font-medium max-w-lg mx-auto mb-8">
            Join thousands of businesses that already trust InvoiceFlow to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple text-[#7F22FE] dark:text-slate-950 font-bold text-sm rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800 text-white dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-white/20 dark:hover:bg-slate-800 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Footer ────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="bg-slate-950 dark:bg-black text-slate-400 dark:text-slate-500 pt-16 pb-8 border-t border-slate-900">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#7F22FE] to-[#5b4cdb] dark:from-neon-cyan dark:to-neon-purple flex items-center justify-center">
              <svg className="h-4 w-4 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-white">InvoiceFlow</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-600 leading-relaxed max-w-xs">
            The all-in-one business management platform designed for modern teams.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-650">&copy; {new Date().getFullYear()} InvoiceFlow. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {/* Social icons */}
          {['Twitter', 'LinkedIn', 'GitHub'].map(name => (
            <a key={name} href="#" className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all text-xs font-bold">
              {name[0]}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Landing Page Root ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#F8F9FC] text-slate-800 dark:bg-cyber-dark dark:text-slate-100 font-sans antialiased">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorks />
      <ValueProp />
      <TeamRoles />
      <Testimonials />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
