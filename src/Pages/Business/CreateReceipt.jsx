import React, { useState } from 'react';

const CreateReceipt = () => {
  const [customer, setCustomer] = useState('Apex Design Co.');
  const [invoiceRef, setInvoiceRef] = useState('INV-001');
  const [receiptNo, setReceiptNo] = useState('RCP-004');
  const [datePaid, setDatePaid] = useState('2026-05-25');
  const [paymentType, setPaymentType] = useState('Bank Transfer');
  const [amount, setAmount] = useState(4200);
  const [notes, setNotes] = useState(
    'Payment received in full. Thank you for your business!'
  );

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
    <div className="min-h-screen w-full bg-slate-50 p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Create Receipt
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Issue and preview custom customer payment receipts
            </p>
          </div>

          <a
            href="/admin/receipts"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ← Back to Receipts
          </a>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

          {/* LEFT - FORM */}
          <div className="relative w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8 lg:col-span-7">

            <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
              Receipt Details
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* CUSTOMER */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Customer Name
                </label>

                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                >
                  <option value="Apex Design Co.">Apex Design Co.</option>
                  <option value="Brightfield Media">Brightfield Media</option>
                  <option value="ClearPath Systems">ClearPath Systems</option>
                  <option value="Delta Logistics">Delta Logistics</option>
                  <option value="Ember Analytics">Ember Analytics</option>
                </select>
              </div>

              {/* INVOICE REFERENCE */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Invoice Reference
                </label>

                <input
                  type="text"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
                  placeholder="e.g. INV-001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                />
              </div>

              {/* RECEIPT NUMBER */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Receipt Number
                </label>

                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  placeholder="e.g. RCP-004"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                />
              </div>

              {/* DATE PAID */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Payment Date
                </label>

                <input
                  type="date"
                  value={datePaid}
                  onChange={(e) => setDatePaid(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                />
              </div>

              {/* PAYMENT METHOD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Payment Method
                </label>

                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* AMOUNT */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Amount Paid (₦)
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="e.g. 4200"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                />
              </div>

              {/* NOTES */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Notes / Remarks
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any receipt remarks..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">

              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Issue Receipt
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Reset Details
              </button>
            </div>
          </div>

          {/* RIGHT - PREVIEW */}
          <div className="w-full lg:sticky lg:top-8 lg:col-span-5">

            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-sm">👁</span>
              Live Receipt Preview
            </h3>

            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* PREVIEW HEADER */}
              <div className="bg-[#7C3AED] px-6 py-7 text-white">
                <div className="mb-6 flex items-center justify-between gap-4">

                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/10">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M14 3v5h5"
                        />
                      </svg>
                    </span>

                    <span className="text-sm font-extrabold uppercase tracking-wide">
                      INVOICEFLOW
                    </span>
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest">
                    Paid
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Amount Received
                </p>

                <p className="mt-1 text-4xl font-extrabold tracking-tight">
                  ₦{amount.toLocaleString()}
                </p>
              </div>

              {/* PREVIEW BODY */}
              <div className="px-6 py-6">

                <dl className="space-y-3.5">

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Receipt No.
                    </dt>

                    <dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {receiptNo || '—'}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Invoice Ref.
                    </dt>

                    <dd className="text-right font-mono text-sm font-semibold text-[#7C3AED] dark:text-purple-300">
                      {invoiceRef || '—'}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Customer
                    </dt>

                    <dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {customer}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Date Paid
                    </dt>

                    <dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {datePaid || '—'}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Payment
                    </dt>

                    <dd className="text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {paymentType}
                    </dd>
                  </div>

                </dl>

                {/* NOTES */}
                {notes && (
                  <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Remarks
                    </dt>

                    <dd className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-medium italic text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      "{notes}"
                    </dd>
                  </div>
                )}

                <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-800" />

                {/* TOTAL */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Total Paid
                  </span>

                  <span className="text-xl font-bold text-[#7C3AED] dark:text-purple-300">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>

                {/* PREVIEW ACTIONS */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                  <button
                    className="flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-400"
                    disabled
                  >
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 14h12v8H6z"
                      />
                    </svg>
                    Print
                  </button>

                  <button
                    className="flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#7C3AED] text-xs font-semibold text-white transition hover:bg-[#6D28D9]"
                    disabled
                  >
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                      />
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