import React from 'react'

const Topbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 border-b border-slate-100 dark:border-slate-800/70">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            InvoiceFlow
          </span>
        </div>
        
        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-3 ml-6 text-sm font-medium text-slate-400">
          <span className="hover:text-purple-600 cursor-pointer transition-colors">Dashboard</span>
          <svg className="h-3 w-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600 dark:text-slate-300">Invoices</span>
          <svg className="h-3 w-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-800 dark:text-slate-100 font-semibold">Create Invoice</span>
        </div>
      </div>

      {/* Right Section - Search & Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-transparent outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 hover:border-purple-200 transition-all dark:from-slate-950/50 dark:to-slate-950/30 dark:border-slate-800 group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-purple-600 transition-colors hidden sm:block">
              Admin
            </span>
            <svg className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Topbar