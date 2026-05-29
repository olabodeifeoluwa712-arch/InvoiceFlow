import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { invoices as invoiceList, customers } from '../../Database/data.json'
import { formatCurrency, getNameInitials, getFormattedDate } from '../../utils/formatter'
import {
  ArrowDownTrayIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const parseAmount = (value) => {
  if (typeof value === 'number') return value
  return Number(String(value).replace(/[^0-9.-]/g, '')) || 0
}

const FEATURED_INVOICE = {
  id: 'featured-0041',
  invoiceNo: 'INV-0041',
  customerName: 'Acme Corp',
  contactName: 'John Mitchell',
  email: 'john.mitchell@acmecorp.com',
  address: '742 Evergreen Terrace, New York, NY 10001',
  amount: 3456,
  issueDate: '2026-05-20',
  dueDate: '2026-06-03',
  paidDate: '2026-05-26',
  status: 'Paid',
  initials: 'JM',
  lineItems: [
    { description: 'Web Design Services', qty: 1, unitPrice: 2400, total: 2400 },
    { description: 'SEO Optimization', qty: 1, unitPrice: 600, total: 600 },
    { description: 'Hosting Setup', qty: 1, unitPrice: 200, total: 200 },
  ],
  lifetimeValue: 48920,
  totalInvoices: 14,
  daysUntilDue: 'Paid Early',
}

const buildLineItems = (total) => {
  const subtotal = Math.round(total / 1.08)
  const a = Math.round(subtotal * 0.62)
  const b = Math.round(subtotal * 0.28)
  const c = subtotal - a - b
  return [
    { description: 'Professional Services', qty: 1, unitPrice: a, total: a },
    { description: 'Platform Subscription', qty: 1, unitPrice: b, total: b },
    { description: 'Support & Maintenance', qty: 1, unitPrice: c, total: c },
  ]
}

const enrichInvoice = (inv) => {
  const total = typeof inv.amount === 'number' ? inv.amount : parseAmount(inv.amount)
  const subtotal = inv.lineItems
    ? inv.lineItems.reduce((s, i) => s + i.total, 0)
    : Math.round(total / 1.08)
  const tax = total - subtotal
  const customerRecord = customers.find((c) => c.name === inv.customerName)
  const contactName =
    inv.contactName ||
    (inv.customerName?.includes(' ')
      ? inv.customerName
      : customerRecord?.name || inv.customerName)

  return {
    ...inv,
    contactName,
    email: inv.email || `billing@${inv.customerName.toLowerCase().replace(/\s+/g, '')}.com`,
    address: inv.address || '742 Business Park Dr, Suite 100',
    lineItems: inv.lineItems || buildLineItems(total),
    subtotal,
    tax,
    total,
    lifetimeValue: customerRecord?.totalSpent ?? Math.round(total * 8.5),
    totalInvoices: inv.totalInvoices ?? 12,
    daysUntilDue:
      inv.daysUntilDue ??
      (inv.status === 'Paid' ? 'Paid Early' : inv.status === 'Overdue' ? 'Overdue' : '7 days'),
    paidDate: inv.paidDate || inv.datePaid,
    issueDate: inv.issueDate || inv.datePaid,
  }
}

const allInvoices = [
  FEATURED_INVOICE,
  ...invoiceList
    .filter((inv) => inv.invoiceNo !== FEATURED_INVOICE.invoiceNo)
    .map((inv) => enrichInvoice({ ...inv, amount: parseAmount(inv.amount) })),
]

const statusStyles = {
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  Draft: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

function StatusBadge({ status, showDot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[status] || statusStyles.Draft}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === 'Paid'
              ? 'bg-emerald-400'
              : status === 'Pending'
                ? 'bg-amber-400'
                : 'bg-rose-400'
          }`}
        />
      )}
      {status}
    </span>
  )
}

function SideCard({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-xl ${className}`}
    >
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      {children}
    </div>
  )
}

const AdminInvoices = () => {
  const [selectedId, setSelectedId] = useState(FEATURED_INVOICE.id)

  const invoice = useMemo(() => {
    const found = allInvoices.find((inv) => inv.id === selectedId) || allInvoices[0]
    return enrichInvoice(found)
  }, [selectedId])

  const activities = [
    {
      label: 'Payment Received',
      date: getFormattedDate(invoice.paidDate || invoice.dueDate),
      color: 'bg-emerald-500',
      ring: 'ring-emerald-500/30',
    },
    {
      label: 'Email Sent',
      date: getFormattedDate(invoice.issueDate),
      color: 'bg-purple-500',
      ring: 'ring-purple-500/30',
    },
    {
      label: 'Invoice Created',
      date: getFormattedDate(invoice.issueDate),
      color: 'bg-amber-500',
      ring: 'ring-amber-500/30',
    },
  ]

  const payments = [
    {
      id: 1,
      method: 'Bank Transfer',
      date: getFormattedDate(invoice.paidDate || invoice.dueDate),
      amount: invoice.total,
      status: 'Completed',
    },
  ]

  return (
    <div className="relative min-h-full w-full overflow-y-auto bg-[#F8F9FC] p-5 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0a0c10] dark:text-slate-100 md:p-6 lg:p-8">
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] dark:bg-neon-purple/10" />
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] dark:bg-neon-cyan/10" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        {/* Invoice picker */}
        <div className="flex flex-wrap gap-2">
          {allInvoices.map((inv) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => setSelectedId(inv.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                selectedId === inv.id
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-700 dark:border-neon-cyan/40 dark:bg-neon-cyan/10 dark:text-neon-cyan'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
              }`}
            >
              {inv.invoiceNo}
            </button>
          ))}
        </div>

        {/* Breadcrumb + header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 mb-2">
              <Link to="/admin-invoices" className="hover:text-purple-600 dark:hover:text-neon-cyan">
                Invoices
              </Link>
              <ChevronRightIcon className="h-3.5 w-3.5" />
              <span className="text-slate-600 dark:text-slate-300">{invoice.invoiceNo}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Invoice #{invoice.invoiceNo}
              </h1>
              <StatusBadge status={invoice.status} showDot />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <EnvelopeIcon className="h-4 w-4" />
              Send Email
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-transform hover:scale-[1.02]"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Mark as Paid
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Main invoice document */}
          <div className="xl:col-span-8">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800/80 dark:bg-[#12151c] dark:shadow-2xl">
              <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-neon-cyan dark:to-neon-purple">
                    <svg className="h-5 w-5 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">InvoiceFlow</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">San Francisco, CA</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Invoice
                  </p>
                  <p className="font-mono text-lg font-bold text-purple-600 dark:text-neon-cyan">
                    #{invoice.invoiceNo}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Issue: {getFormattedDate(invoice.issueDate)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Due: {getFormattedDate(invoice.dueDate)}
                  </p>
                </div>
              </div>

              <div className="py-6 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Bill To
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{invoice.customerName}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.contactName}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{invoice.email}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">{invoice.address}</p>
              </div>

              <div className="overflow-x-auto py-2">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="py-3 pr-4 font-semibold text-slate-400 dark:text-slate-500">Item Description</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 dark:text-slate-500 text-center">Qty</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 dark:text-slate-500 text-right">Unit Price</th>
                      <th className="py-3 pl-4 font-semibold text-slate-400 dark:text-slate-500 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {invoice.lineItems.map((item) => (
                      <tr key={item.description}>
                        <td className="py-4 pr-4 font-medium text-slate-800 dark:text-slate-200">
                          {item.description}
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{item.qty}</td>
                        <td className="py-4 px-4 text-right text-slate-600 dark:text-slate-400">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-4 pl-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <dl className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(invoice.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <dt>Tax (8%)</dt>
                    <dd className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(invoice.tax)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <dt className="text-base font-bold text-slate-900 dark:text-white">Total</dt>
                    <dd className="text-xl font-extrabold text-emerald-500 dark:text-emerald-400">
                      {formatCurrency(invoice.total)}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 pt-4 dark:border-slate-800">
                Payment due within 14 days. Thank you for your business.
              </p>
            </article>
          </div>

          {/* Right column */}
          <div className="xl:col-span-4 space-y-5">
            <SideCard title="Invoice Summary">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                  <dd>
                    <StatusBadge status={invoice.status} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
                  <dd className="font-bold text-emerald-500 dark:text-emerald-400">
                    {formatCurrency(invoice.total)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Due Date</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">
                    {getFormattedDate(invoice.dueDate)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Days Until Due</dt>
                  <dd className="font-semibold text-emerald-500 dark:text-emerald-400">
                    {invoice.daysUntilDue}
                  </dd>
                </div>
              </dl>
            </SideCard>

            <SideCard title="Customer Info">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
                  {invoice.initials || getNameInitials(invoice.contactName)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{invoice.contactName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{invoice.customerName}</p>
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-400 dark:text-slate-500">Email</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-300 truncate">{invoice.email}</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <dt className="text-slate-500 dark:text-slate-400">Total Invoices</dt>
                  <dd className="font-bold text-slate-800 dark:text-slate-200">{invoice.totalInvoices}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Lifetime Value</dt>
                  <dd className="font-bold text-emerald-500 dark:text-emerald-400">
                    {formatCurrency(invoice.lifetimeValue)}
                  </dd>
                </div>
              </dl>
            </SideCard>

            <SideCard title="Activity Timeline">
              <ul className="space-y-5">
                {activities.map((item, idx) => (
                  <li key={item.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`h-2.5 w-2.5 rounded-full ring-4 ${item.color} ${item.ring}`} />
                      {idx < activities.length - 1 && (
                        <span className="mt-1 w-px flex-1 min-h-[24px] bg-slate-200 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{item.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SideCard>
          </div>
        </div>

        {/* Payment history */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-xl">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500">Method</th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500">Amount</th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/60">
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{p.method}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{p.date}</td>
                    <td className="px-5 py-4 font-bold text-emerald-500 dark:text-emerald-400">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-500 dark:text-emerald-400">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminInvoices
