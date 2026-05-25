import React from 'react'
import { useTheme } from '../../Context/ThemeContext'

const receipts = [
  {
    receiptNo: 'RCP-001',
    invoiceRef: 'INV-001',
    customer: 'Apex Design Co.',
    datePaid: '2024-12-01',
    paymentType: 'Bank Transfer',
    amount: 4200,
  },
  {
    receiptNo: 'RCP-004',
    invoiceRef: 'INV-004',
    customer: 'Delta Logistics',
    datePaid: '2024-12-08',
    paymentType: 'Bank Transfer',
    amount: 3300,
  },
  {
    receiptNo: 'RCP-006',
    invoiceRef: 'INV-006',
    customer: 'Faro Consulting',
    datePaid: '2024-11-28',
    paymentType: 'Bank Transfer',
    amount: 5800,
  },
]

// const formatCurrency = (amount) =>
//   new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0,
//   }).format(amount)

const ReceiptCard = ({ receipt }) => {
  return (
    <article className="overflow-hidden rounded-[1.45rem] border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.16)] dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
      <div className="bg-gradient-to-br from-[#7c1fff] via-[#8b35f7] to-[#8a41f3] px-7 py-8 text-white dark:from-neon-purple dark:via-[#8b2cff] dark:to-neon-cyan">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/10">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 3v5h5" />
              </svg>
            </span>
            <span className="text-base font-extrabold tracking-wide">INVOICEFLOW</span>
          </div>

          <span className="rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.14em] shadow-inner">
            Paid
          </span>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Amount Received</p>
        <p className="mt-2 text-5xl font-extrabold tracking-tight">${receipt.amount}</p>
      </div>

      <div className="px-7 py-7">
        <dl className="space-y-4">
          <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-center gap-4">
            <dt className="text-lg font-medium text-slate-400 dark:text-slate-500">Receipt No.</dt>
            <dd className="text-right text-lg font-semibold text-slate-950 dark:text-slate-100">{receipt.receiptNo}</dd>
          </div>

          <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-center gap-4">
            <dt className="text-lg font-medium text-slate-400 dark:text-slate-500">Invoice Ref.</dt>
            <dd className="text-right font-mono text-lg font-semibold text-[#6f18ff] dark:text-neon-cyan">{receipt.invoiceRef}</dd>
          </div>

          <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-center gap-4">
            <dt className="text-lg font-medium text-slate-400 dark:text-slate-500">Customer</dt>
            <dd className="text-right text-lg font-semibold text-slate-950 dark:text-slate-100">{receipt.customer}</dd>
          </div>

          <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-center gap-4">
            <dt className="text-lg font-medium text-slate-400 dark:text-slate-500">Date Paid</dt>
            <dd className="text-right text-lg font-semibold text-slate-950 dark:text-slate-100">{receipt.datePaid}</dd>
          </div>

          <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-center gap-4">
            <dt className="text-lg font-medium text-slate-400 dark:text-slate-500">Payment</dt>
            <dd className="text-right text-lg font-semibold text-slate-950 dark:text-slate-100">{receipt.paymentType}</dd>
          </div>
        </dl>

        <div className="my-5 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-extrabold text-slate-950 dark:text-slate-100">Total Paid</span>
          <span className="text-2xl font-extrabold text-[#6f18ff] dark:text-neon-cyan">${receipt.amount}</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button className="flex h-15 items-center justify-center gap-3 rounded-2xl bg-slate-100 text-lg font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 14h12v8H6z" />
            </svg>
            Print
          </button>

          <button className="flex h-15 items-center justify-center gap-3 rounded-2xl bg-[#7c1fff] text-lg font-extrabold text-white shadow-[0_12px_22px_rgba(124,31,255,0.25)] transition-all duration-200 hover:bg-[#6817e7] hover:shadow-[0_14px_26px_rgba(124,31,255,0.34)] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
            </svg>
            PDF
          </button>
        </div>
      </div>
    </article>
  )
}

const Receipts = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 p-6 font-sans text-slate-950 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-10">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 flex items-center justify-center p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950/40 dark:border-slate-800 dark:text-neon-cyan dark:hover:bg-slate-900/60 shadow-md"
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

      <div className="absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-purple/10"></div>
      <div className="absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-cyan/10"></div>

      <section className="relative z-10 mx-auto max-w-7xl space-y-7">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 transition-all duration-300 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-3xl dark:text-transparent dark:text-glow-cyan">
            Receipts
          </h1>
          <p className="mt-1 text-xl font-medium text-slate-400 dark:text-slate-500">
            {receipts.length === 0 ? 'No receipts found' : receipts.length} payment receipts
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt.receiptNo} receipt={receipt} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Receipts
