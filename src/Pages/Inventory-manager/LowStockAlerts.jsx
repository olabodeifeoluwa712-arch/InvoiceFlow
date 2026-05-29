import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    value: '2',
    label: 'Out of Stock',
    helper: 'Requires immediate action',
    icon: XCircleIcon,
    card: 'border-rose-200 bg-rose-50/45 dark:border-rose-500/35 dark:bg-rose-950/15',
    iconBox: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20',
  },
  {
    value: '4',
    label: 'Low Stock',
    helper: 'Below reorder threshold',
    icon: ExclamationTriangleIcon,
    card: 'border-amber-200 bg-white dark:border-amber-500/35 dark:bg-amber-950/10',
    iconBox: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border dark:border-amber-500/20',
  },
  {
    value: '6',
    label: 'Total Affected',
    helper: 'Products needing attention',
    icon: ExclamationTriangleIcon,
    card: 'border-slate-100 bg-white dark:border-slate-800/80 dark:bg-cyber-card/85',
    iconBox: 'bg-indigo-50 text-indigo-500 dark:bg-neon-cyan/10 dark:text-neon-cyan dark:border dark:border-neon-cyan/20',
  },
]

const unavailable = [
  {
    name: 'Wireless Ergonomic Mouse',
    sku: 'SKU-1003',
    category: 'Peripherals',
    company: 'HID Solutions',
    reorder: '20 units',
  },
  {
    name: 'HDMI Cable 2m Braided',
    sku: 'SKU-1006',
    category: 'Cables',
    company: 'CableMaster',
    reorder: '40 units',
  },
]

const lowStock = [
  {
    name: 'USB-C Hub 7-Port',
    sku: 'SKU-1002',
    company: 'ConnectPro Ltd.',
    left: 18,
    reorder: 25,
  },
  {
    name: '4K Webcam Ultra HD',
    sku: 'SKU-1005',
    company: 'VisionTech',
    left: 12,
    reorder: 20,
  },
  {
    name: 'Smart Power Strip 6-Outlet',
    sku: 'SKU-1008',
    company: 'PowerSafe Ltd.',
    left: 9,
    reorder: 15,
  },
  {
    name: 'Noise-Cancelling Earbuds',
    sku: 'SKU-1010',
    company: 'SoundTech Co.',
    left: 5,
    reorder: 30,
  },
]

const ActionButton = ({ children, icon: Icon, intent = 'neutral' }) => {
  const styles =
    intent === 'danger'
      ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
      : intent === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/25 dark:text-slate-300 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan'

  return (
    <button className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition hover:-translate-y-0.5 ${styles}`}>
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  )
}

const LowStockAlerts = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8F9FC] p-4 font-sans text-slate-900 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-6 lg:p-8">
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 dark:bg-neon-purple/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
              Low Stock Alerts
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
              2 out of stock . 4 below threshold
            </p>
          </div>

          <button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card/85 dark:text-slate-300 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan">
            <ArrowPathIcon className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.label}
                className={`min-h-[148px] min-w-0 rounded-2xl border p-5 shadow-sm transition-colors duration-300 dark:shadow-2xl ${item.card}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBox}`}>
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="mt-5">
                  <p className="text-3xl font-extrabold leading-none text-slate-900 dark:text-slate-100">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-base font-bold leading-tight text-slate-700 dark:text-slate-300">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
                    {item.helper}
                  </p>
                </div>
              </article>
            )
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm transition-colors duration-300 dark:border-rose-500/30 dark:bg-cyber-card/85 dark:shadow-2xl">
          <div className="flex flex-col gap-3 border-b border-rose-200 bg-rose-50/35 px-5 py-4 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between dark:border-rose-500/25 dark:bg-rose-950/10 md:px-6">
            <div className="flex items-start gap-3">
              <XCircleIcon className="mt-1 h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
              <div>
                <h2 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">
                  Out of Stock - Critical
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500 md:text-sm">
                  These products have zero inventory and need immediate restocking
                </p>
              </div>
            </div>
            <span className="inline-flex h-8 items-center self-start rounded-full border border-rose-200 bg-rose-100 px-3 text-xs font-extrabold text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 sm:self-center">
              {unavailable.length} items
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {unavailable.map((item) => (
              <div
                key={item.sku}
                className="grid min-w-0 gap-4 px-5 py-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/25 md:px-6 xl:grid-cols-[44px_minmax(0,1fr)_120px_auto] xl:items-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400">
                  <XCircleIcon className="h-5 w-5 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-extrabold leading-tight text-slate-800 dark:text-slate-100 md:text-lg">
                    {item.name}
                  </h3>
                  <p className="mt-1 break-words text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {item.sku}
                    <span className="px-3">.</span>
                    {item.category}
                    <span className="px-3">.</span>
                    {item.company}
                  </p>
                </div>

                <div className="text-left xl:text-right">
                  <p className="text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
                    Reorder at
                  </p>
                  <p className="mt-1 text-base font-extrabold leading-tight text-slate-800 dark:text-slate-100">
                    {item.reorder}
                  </p>
                </div>

                <div className="flex min-w-0 flex-wrap gap-3 xl:justify-end">
                  <ActionButton icon={AdjustmentsHorizontalIcon} intent="danger">
                    Adjust
                  </ActionButton>
                  <ActionButton icon={ShoppingCartIcon}>Create PO</ActionButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition-colors duration-300 dark:border-amber-500/30 dark:bg-cyber-card/85 dark:shadow-2xl">
          <div className="flex flex-col gap-3 border-b border-amber-200 bg-amber-50/35 px-5 py-4 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/25 dark:bg-amber-950/10 md:px-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="mt-1 h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
              <div>
                <h2 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">
                  Low Stock - Warning
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500 md:text-sm">
                  Products below their reorder threshold
                </p>
              </div>
            </div>
            <span className="inline-flex h-8 items-center self-start rounded-full border border-amber-200 bg-amber-100 px-3 text-xs font-extrabold text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 sm:self-center">
              {lowStock.length} items
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {lowStock.map((item) => {
              const percent = Math.min(100, Math.round((item.left / item.reorder) * 100))

              return (
                <div
                  key={item.sku}
                  className="grid min-w-0 gap-4 px-5 py-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/25 md:px-6 xl:grid-cols-[44px_minmax(0,1fr)_92px_auto] xl:items-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400">
                    <ExclamationTriangleIcon className="h-5 w-5 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold leading-tight text-slate-800 dark:text-slate-100 md:text-lg">
                      {item.name}
                    </h3>
                    <p className="mt-1 break-words text-xs font-semibold text-slate-400 dark:text-slate-500">
                      {item.sku}
                      <span className="px-3">.</span>
                      {item.company}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="h-2 w-full max-w-[170px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {item.left} / {item.reorder} reorder level
                      </span>
                    </div>
                  </div>

                  <div className="text-left xl:text-right">
                    <p className="text-xl font-extrabold leading-none text-amber-600 dark:text-amber-400">
                      {item.left}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
                      units left
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-wrap gap-3 xl:justify-end">
                    <ActionButton icon={ShoppingCartIcon} intent="warning">
                      Restock
                    </ActionButton>
                    <ActionButton icon={AdjustmentsHorizontalIcon}>
                      Adjust
                    </ActionButton>
                    <ActionButton icon={ShoppingCartIcon}>PO</ActionButton>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LowStockAlerts
