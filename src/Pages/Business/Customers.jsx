import React, { useState } from 'react'
import { useTheme } from '../../Context/ThemeContext'
import { formatDate } from '../../utils/formatter';
import { customers as initialCustomers } from '../../Database/data.json';
import { getFormattedDate } from '../../utils/formatter';



const getInitials = (name) => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Customers = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [customersList, setCustomersList] = useState(initialCustomers);

  const filteredCustomers = customersList.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">
      {/* Background Decorative Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Customers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              {filteredCustomers.length === 0 ? 'No customers found' : filteredCustomers.length} total customer{filteredCustomers.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
          

            {/* Add Customer Button */}
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
          {/* Top glow decoration */}
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

          {/* Search Box */}
          <div className="relative max-w-md mb-6 group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-850 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50">
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Customer</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Email</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Total Spent</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono text-center">Unpaid</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Joined</th>
                  <th className="py-4 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No Customers Found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => {
                    const initials = getInitials(customer.name);
                    const unpaidCount = parseInt(customer.unPaidInvoices, 10) || 0;
                    return (
                      <tr key={index} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors duration-200 group/row">
                        {/* CUSTOMER */}
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all bg-purple-100 border border-purple-200 text-purple-700 dark:bg-neon-purple/10 dark:border-neon-purple/30 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(189,0,255,0.15)] dark:group-hover/row:shadow-[0_0_12px_rgba(189,0,255,0.3)]">
                            {initials}
                          </div>
                          <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors">
                            {customer.name}
                          </span>
                        </td>

                        {/* EMAIL */}
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                          {customer.email}
                        </td>

                        {/* TOTAL SPENT */}
                        <td className="py-4 px-4 text-slate-800 dark:text-slate-100 font-bold text-sm font-mono">
                          {`$${customer.totalSpent}`}
                        </td>

                        {/* UNPAID */}
                        <td className="py-4 px-4 text-center">
                          {unpaidCount > 0 ? (
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30 dark:shadow-[0_0_8px_rgba(255,0,127,0.1)]">
                              {unpaidCount} {unpaidCount === 1 ? 'invoice' : 'invoices'}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 font-mono">—</span>
                          )}
                        </td>

                        {/* JOINED */}
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono text-sm">
                          {getFormattedDate(customer.Joined)}
                        </td>

                        {/* ACTION / CHEVRON */}
                        <td className="py-4 px-4 text-right">
                          <button className="text-slate-400 dark:text-slate-500 group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors duration-200 cursor-pointer">
                            <svg className="w-5 h-5 transform group-hover/row:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers