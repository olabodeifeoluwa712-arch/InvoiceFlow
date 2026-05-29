import React from 'react'
import { useTheme } from '../../Context/ThemeContext'

const Topbar = () => {
    const { theme, toggleTheme } = useTheme()
  return (
    <nav className="relative flex items-center justify-between px-4 md:px-6 lg:px-8 py-2 border-b border-[#e8e5f7] bg-white transition-colors duration-300 dark:bg-cyber-dark dark:backdrop-blur-xl dark:border-slate-800/80 dark:text-slate-100">
      <div className="absolute -bottom-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-30 transition-all duration-300 dark:via-neon-cyan dark:opacity-60 pointer-events-none"></div>

      <div className="flex items-center gap-3">

        
        {/* Breadcrumbs */}
        {/* <div className="hidden sm:flex items-center gap-3 ml-6 text-sm font-medium text-slate-400 dark:text-slate-500">
          <span className="hover:text-purple-600 cursor-pointer transition-colors dark:hover:text-neon-cyan">Dashboard</span>
          <svg className="h-3 w-3 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600 dark:text-slate-300">Invoices</span>
          <svg className="h-3 w-3 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-800 dark:text-slate-100 font-semibold">Create Invoice</span>
        </div> */}
      </div>

      {/* Right Section - Search & Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-300 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-transparent outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
          />
        </div>

          {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950/40 dark:border-slate-800 dark:text-neon-cyan dark:hover:bg-slate-900/60 shadow-sm"
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

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative dark:text-slate-500 dark:hover:text-neon-cyan dark:hover:bg-slate-900/60">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:bg-neon-pink dark:border-cyber-card dark:shadow-[0_0_8px_rgba(255,0,127,0.8)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 hover:border-purple-200 transition-all dark:from-slate-950/50 dark:to-slate-950/30 dark:border-slate-800 dark:hover:border-neon-cyan/30 group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transition-all duration-300 dark:from-neon-cyan dark:to-neon-purple dark:shadow-[0_0_12px_rgba(0,243,255,0.22)]">
              <span className="text-white dark:text-slate-950 font-semibold text-sm">A</span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-neon-cyan transition-colors hidden sm:block">
              Admin
            </span>
            <svg className="h-4 w-4 text-slate-400 group-hover:text-purple-600 dark:text-slate-500 dark:group-hover:text-neon-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Topbar
