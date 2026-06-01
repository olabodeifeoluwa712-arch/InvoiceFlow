import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  EyeIcon,
  TableCellsIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const destinations = [
  {
    name: 'QuickBooks Online',
    description: 'Sync invoices, payments & expenses',
    icon: CloudArrowUpIcon,
    iconStyle: 'bg-emerald-100 text-emerald-600',
    status: 'Connected',
    statusStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    meta: 'Last synced: Today 09:24 AM',
    action: 'Sync Now',
    primary: true,
  },
  {
    name: 'Xero Accounting',
    description: 'Export chart of accounts & transactions',
    icon: ClockIcon,
    iconStyle: 'bg-indigo-100 text-indigo-600',
    status: 'Sync Failed',
    statusStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    meta: 'Last attempted: Yesterday 7:20 PM',
    warning: 'Authentication token expired',
  },
  {
    name: 'CSV Export',
    description: 'Download raw financial records',
    icon: DocumentTextIcon,
    iconStyle: 'bg-slate-100 text-slate-500',
    meta: 'Jan 2025 - Mar 2025',
    action: 'Download CSV',
  },
  {
    name: 'Excel Workbook (.xlsx)',
    description: 'Formatted spreadsheet with pivot tables',
    icon: TableCellsIcon,
    iconStyle: 'bg-emerald-100 text-emerald-600',
    meta: 'Ready for download',
    action: 'Download XLSX',
  },
]

const history = [
  {
    type: 'QuickBooks Sync',
    date: '01 Jun 2026 09:14',
    by: 'Sarah Mitchell',
    records: '1,247',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'CSV Export',
    date: '01 Jun 2026 07:58',
    by: 'Daniel Okafor',
    records: '430',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Excel Workbook Export',
    date: '31 May 2026 18:22',
    by: 'Amina Yusuf',
    records: '2,014',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Xero Sync Attempt',
    date: '31 May 2026 16:41',
    by: 'Sarah Mitchell',
    records: '1,102',
    status: 'Failed',
    action: 'Retry',
  },
  {
    type: 'Manual Ledger Import',
    date: '30 May 2026 13:09',
    by: 'John Adeyemi',
    records: '268',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'CSV Export',
    date: '30 May 2026 10:33',
    by: 'Grace Williams',
    records: '1,560',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'QuickBooks Sync',
    date: '29 May 2026 22:15',
    by: 'Michael Brown',
    records: '3,102',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Excel Pivot Export',
    date: '29 May 2026 14:52',
    by: 'Sarah Mitchell',
    records: '875',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Xero Sync Failure',
    date: '29 May 2026 09:06',
    by: 'Daniel Okafor',
    records: '1,980',
    status: 'Failed',
    action: 'Retry',
  },
  {
    type: 'Bank Statement Import',
    date: '28 May 2026 17:44',
    by: 'Amina Yusuf',
    records: '612',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'CSV Export (Filtered)',
    date: '28 May 2026 12:19',
    by: 'John Adeyemi',
    records: '389',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'QuickBooks Sync',
    date: '27 May 2026 20:03',
    by: 'Grace Williams',
    records: '2,540',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Excel Export (Tax Report)',
    date: '27 May 2026 15:27',
    by: 'Michael Brown',
    records: '1,128',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'API Data Sync',
    date: '26 May 2026 11:58',
    by: 'Sarah Mitchell',
    records: '4,320',
    status: 'Success',
    action: 'Download',
  },
  {
    type: 'Xero Sync Retry',
    date: '26 May 2026 08:41',
    by: 'Daniel Okafor',
    records: '1,765',
    status: 'Failed',
    action: 'Retry',
  },
]
function DestinationCard({ item, setIsexport, setIscsv, setIsexcel }) {
  const Icon = item.icon

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-cyber-card/85">

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconStyle}`}>
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100">
              {item.name}
            </h2>
            <p className="mt-1 max-w-[260px] text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          </div>
        </div>

        {item.status && (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${item.statusStyle}`}>
            {item.status === 'Connected' ? (
              <CheckCircleIcon className="h-3.5 w-3.5" />
            ) : (
              <XCircleIcon className="h-3.5 w-3.5" />
            )}
            {item.status}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">{item.meta}</p>
        {item.warning && (
          <p className="mt-1 text-xs font-extrabold text-rose-600">
            {item.warning}
          </p>
        )}
      </div>

      {item.action && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (item.name === 'CSV Export') {
                setIscsv(true)
              } else if (item.name === 'Excel Workbook (.xlsx)') {
                setIsexcel(true)
              } else {
                setIsexport(true)
              }
            }}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-extrabold text-white ${item.primary
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
              }`}
          >
            {item.primary ? (
              <ArrowPathIcon className="h-4 w-4" />
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4" />
            )}
            {item.action}
          </button>

          {item.primary && (
            <button
              type="button"
              className="text-sm font-extrabold text-[#8B5CF6] hover:text-[#7C3AED]"
            >
              Configure
            </button>
          )}
        </div>
      )}
    </article>
  )
}

const Reports = () => {
  const [Isexport, setIsexport] = useState(false)
  const [Iscsv, setIscsv] = useState(false)
  const [Isexcel, setIsexcel] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)
  const visibleHistory = showAllHistory ? history : history.slice(0, 4)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F8FB] p-6 font-sans text-slate-950 dark:bg-cyber-dark dark:text-slate-100 md:p-8">

      <div className="mx-auto max-w-7xl">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Export Destinations
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Sync your financial data to external platforms or download locally
          </p>
        </header>

        <section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {destinations.map((item) => (
            <DestinationCard
              key={item.name}
              item={item}
              setIsexport={setIsexport}
              setIscsv={setIscsv}
              setIsexcel={setIsexcel}
            />
          ))}
        </section>

        {/* HISTORY TABLE (UNCHANGED) */}
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-cyber-card/85">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-extrabold">Export History Log</h2>
            <button
              type="button"
              onClick={() => setShowAllHistory((prev) => !prev)}
              className="text-sm font-extrabold text-[#8B5CF6]"
            >
              {showAllHistory ? 'Show Less' : 'View All'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs font-extrabold text-slate-500">
                <tr>
                  <th className="pb-3">Export Type</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Exported By</th>
                  <th className="pb-3">Records</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Download</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleHistory.map((row) => {
                  const success = row.status === 'Success'

                  return (
                    <tr key={`${row.type}-${row.date}`}>
                      <td className="py-3 font-extrabold text-slate-800 dark:text-slate-200">
                        {row.type}
                      </td>
                      <td className="py-3 font-medium text-slate-500">
                        {row.date}
                      </td>
                      <td className="py-3 font-medium text-slate-500">
                        {row.by}
                      </td>
                      <td className="py-3 font-extrabold text-slate-700 dark:text-slate-300">
                        {row.records}
                      </td>

                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${success
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setIsexport(true)}
                          className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${success ? 'text-[#8B5CF6]' : 'text-rose-600'
                            }`}
                        >
                          {success ? (
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          ) : (
                            <ArrowPathIcon className="h-4 w-4" />
                          )}
                          {row.action}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* EXPORT MODAL */}
      {Isexport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm"
          onMouseDown={() => setIsexport(false)}
        >
          <section
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl dark:bg-cyber-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircleIcon className="h-12 w-12 text-emerald-500" />
            </div>

            <h2 className="mt-5 text-lg font-extrabold">
              Export Successful!
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-slate-500">
              QuickBooks sync completed — 1,247 records exported successfully.
            </p>

            <button
              type="button"
              onClick={() => setIsexport(false)}
              className="mt-6 h-11 w-full rounded-lg bg-[#8B5CF6] text-sm font-extrabold text-white"
            >
              Done
            </button>

            <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8B5CF6]">
              <EyeIcon className="h-4 w-4" />
              View Export Log
            </button>
          </section>
        </div>
      )}

      {/* CSV MODAL */}
      {Iscsv && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm"
          onMouseDown={() => setIscsv(false)}
        >
          <section
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl dark:bg-cyber-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircleIcon className="h-12 w-12 text-emerald-500" />
            </div>

            <h2 className="mt-5 text-lg font-extrabold">
              Export Successful!
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-slate-500">
              CSV Export Successful-34 records exported successfully.
            </p>

            <button
              type="button"
              onClick={() => setIscsv(false)}
              className="mt-6 h-11 w-full rounded-lg bg-[#8B5CF6] text-sm font-extrabold text-white"
            >
              Done
            </button>

            <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8B5CF6]">
              <EyeIcon className="h-4 w-4" />
              View Export Log
            </button>
          </section>
        </div>
      )}
      {/* EXCEL MODAL */}
      {Isexcel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm"
          onMouseDown={() => setIsexcel(false)}
        >
          <section
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl dark:bg-cyber-card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircleIcon className="h-12 w-12 text-emerald-500" />
            </div>

            <h2 className="mt-5 text-lg font-extrabold">
              Export Successful!
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-slate-500">
              Excel Workbook Completed-8 records exported successfully!
            </p>

            <button
              type="button"
              onClick={() => setIsexcel(false)}
              className="mt-6 h-11 w-full rounded-lg bg-[#8B5CF6] text-sm font-extrabold text-white"
            >
              Done
            </button>

            <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8B5CF6]">
              <EyeIcon className="h-4 w-4" />
              View Export Log
            </button>
          </section>
        </div>
      )}

    </main>
  )
}

export default Reports