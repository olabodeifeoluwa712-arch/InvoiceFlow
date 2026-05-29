import React, { useState } from 'react'

import { invoices } from '../../Database/data.json'

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Compute filtered list dynamically in real-time
  const displayedInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          invoice.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || invoice.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F8F9FC] p-6 font-sans text-slate-955 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-10 select-none">
      
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-purple/10"></div>
      <div className="absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Invoices
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-400 dark:text-slate-500">
              {invoices.length} total invoices
            </p>
          </div>

          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-[#7c1fff] text-white hover:bg-[#6817e7] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Create Invoice</span>
          </button>
        </header>

        {/* Main List Card Container */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 dark:bg-cyber-card/85 dark:border-slate-800/80 w-full relative overflow-hidden">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

          {/* Filtering & Search Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#8B5CF6] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100"
              />
            </div>

            {/* Active Status Tabs */}
            <div className="bg-slate-100/70 border border-slate-200/20 p-1 flex gap-1 rounded-full text-sm font-semibold dark:bg-slate-950/40 dark:border-slate-850">
              {["All", "Paid", "Pending", "Overdue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full transition-all text-xs font-bold cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60">
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Invoice</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Customer</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Amount</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Status</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Date</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider text-xs uppercase font-mono">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                {displayedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-550 font-medium">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  displayedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      
                      {/* Invoice No */}
                      <td className="py-5 px-4 font-extrabold text-[#6f18ff] dark:text-neon-cyan text-sm cursor-pointer hover:underline">
                        {invoice.invoiceNo}
                      </td>

                      {/* Customer Avatar & Name */}
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3.5">
                          {/* Circular initials badge */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${invoice.avatarBg}`}>
                            {invoice.initials}
                          </div>
                          <span className="text-slate-800 dark:text-slate-100 font-bold text-sm">
                            {invoice.customerName}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-5 px-4 text-slate-800 dark:text-slate-100 font-extrabold text-sm">
                        {invoice.amount}
                      </td>

                      {/* Status Tag */}
                      <td className="py-5 px-4">
                        <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-semibold border ${
                          invoice.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : invoice.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-5 px-4 text-slate-400 dark:text-slate-550 text-sm font-medium">
                        {invoice.datePaid}
                      </td>

                      {/* Due Date */}
                      <td className="py-5 px-4 text-slate-400 dark:text-slate-550 text-sm font-medium">
                        {invoice.dueDate}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Invoices