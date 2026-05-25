import React, { useState } from 'react';

const CreateReceipt = () => {
  // Initial states for receipt form
  const [customer, setCustomer] = useState('Apex Design Co.');
  const [invoiceRef, setInvoiceRef] = useState('INV-001');
  const [receiptNo, setReceiptNo] = useState('RCP-004');
  const [datePaid, setDatePaid] = useState('2026-05-25');
  const [paymentType, setPaymentType] = useState('Bank Transfer');
  const [amount, setAmount] = useState(4200);
  const [notes, setNotes] = useState('Payment received in full. Thank you for your business!');

  const handleReset = () => {
    setCustomer('Apex Design Co.');
    setInvoiceRef('INV-001');
    setReceiptNo('RCP-004');
    setDatePaid('2026-05-25');
    setPaymentType('Bank Transfer');
    setAmount(4200);
    setNotes('Payment received in full. Thank you for your business!');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F8F9FC] p-6 font-sans text-slate-950 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-10">
      
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-purple/10"></div>
      <div className="absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Create Receipt
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500">
              Issue and preview custom customer payment receipts
            </p>
          </div>
          
          <a
            href="/admin/receipts"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-800/60 shadow-sm"
          >
            ← Back to Receipts
          </a>
        </header>

        {/* Main Two Column Form/Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Receipt Creation Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 dark:bg-cyber-card/85 dark:border-slate-800/80 w-full relative">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>
            
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-250 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              Receipt Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Select */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Customer Name</label>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                >
                  <option value="Apex Design Co.">Apex Design Co.</option>
                  <option value="Brightfield Media">Brightfield Media</option>
                  <option value="ClearPath Systems">ClearPath Systems</option>
                  <option value="Delta Logistics">Delta Logistics</option>
                  <option value="Ember Analytics">Ember Analytics</option>
                </select>
              </div>

              {/* Invoice Reference */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Invoice Reference</label>
                <input
                  type="text"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
                  placeholder="e.g. INV-001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                />
              </div>

              {/* Receipt Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Receipt Number</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  placeholder="e.g. RCP-004"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                />
              </div>

              {/* Date Paid */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Payment Date</label>
                <input
                  type="date"
                  value={datePaid}
                  onChange={(e) => setDatePaid(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                />
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Payment Method</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Amount Paid ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="e.g. 4200"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-400 dark:text-slate-500">Notes / Remarks</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any receipt remarks..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan resize-none"
                />
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7c1fff] text-white hover:bg-[#6817e7] font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex-1 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Issue Receipt
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold text-sm transition-all duration-200 cursor-pointer"
              >
                Reset Details
              </button>
            </div>

          </div>

          {/* Right Column - Live Receipt Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 w-full">
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <span className="text-sm">👁</span> Live Receipt Preview
            </h3>

            <article className="overflow-hidden rounded-[1.45rem] border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
              
              {/* Header Gradient */}
              <div className="bg-gradient-to-br from-[#7c1fff] via-[#8b35f7] to-[#8a41f3] px-6 py-7 text-white dark:from-neon-purple dark:via-[#8b2cff] dark:to-neon-cyan">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/10">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 3v5h5" />
                      </svg>
                    </span>
                    <span className="text-sm font-extrabold tracking-wide uppercase">INVOICEFLOW</span>
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest shadow-inner">
                    Paid
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Amount Received</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">${amount.toLocaleString()}</p>
              </div>

              {/* Body Details */}
              <div className="px-6 py-6">
                <dl className="space-y-3.5">
                  
                  {/* Receipt No */}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold text-slate-400 dark:text-slate-500">Receipt No.</dt>
                    <dd className="text-right text-sm font-bold text-slate-800 dark:text-slate-100">{receiptNo || '—'}</dd>
                  </div>

                  {/* Invoice Ref */}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold text-slate-400 dark:text-slate-500">Invoice Ref.</dt>
                    <dd className="text-right font-mono text-sm font-bold text-[#6f18ff] dark:text-neon-cyan">{invoiceRef || '—'}</dd>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold text-slate-400 dark:text-slate-500">Customer</dt>
                    <dd className="text-right text-sm font-bold text-slate-800 dark:text-slate-100">{customer}</dd>
                  </div>

                  {/* Date Paid */}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold text-slate-400 dark:text-slate-500">Date Paid</dt>
                    <dd className="text-right text-sm font-bold text-slate-800 dark:text-slate-100">{datePaid || '—'}</dd>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-semibold text-slate-400 dark:text-slate-500">Payment</dt>
                    <dd className="text-right text-sm font-bold text-slate-800 dark:text-slate-100">{paymentType}</dd>
                  </div>

                </dl>

                {/* Notes/Remarks */}
                {notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-550 mb-1.5">Remarks</dt>
                    <dd className="text-xs font-medium text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      "{notes}"
                    </dd>
                  </div>
                )}

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-extrabold text-slate-950 dark:text-slate-100">Total Paid</span>
                  <span className="text-xl font-extrabold text-[#6f18ff] dark:text-neon-cyan">${amount.toLocaleString()}</span>
                </div>

                {/* Preview Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors duration-200 cursor-not-allowed" disabled>
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 14h12v8H6z" />
                    </svg>
                    Print
                  </button>

                  <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7c1fff] text-xs font-bold text-white hover:bg-[#6817e7] transition-all duration-200 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 cursor-not-allowed" disabled>
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                    </svg>
                    PDF
                  </button>
                </div>

              </div>

            </article>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateReceipt;
