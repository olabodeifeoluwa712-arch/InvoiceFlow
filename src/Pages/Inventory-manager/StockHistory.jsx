import { useMemo, useState } from 'react'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const filters = ['All', 'Stock In', 'Stock Out', 'Manual Adjustment', 'Return', 'Write-off']

const movements = [
  {
    day: 'Dec',
    date: '20, 2024',
    time: '09:14',
    product: 'Bluetooth Headphones Pro',
    sku: 'SKU-1001',
    type: 'Stock In',
    qty: '+80',
    reference: 'PO-2024-042',
    user: 'Marcus Webb',
    note: 'Goods received from SoundTech Co.',
  },
  {
    day: 'Dec',
    date: '19, 2024',
    time: '15:32',
    product: 'Wireless Ergonomic Mouse',
    sku: 'SKU-1003',
    type: 'Write-off',
    qty: '-6',
    reference: 'ADJ-0090',
    user: 'Sam Okafor',
    note: 'Damaged in transit, written off',
  },
  {
    day: 'Dec',
    date: '19, 2024',
    time: '11:00',
    product: 'USB-C Hub 7-Port',
    sku: 'SKU-1002',
    type: 'Stock Out',
    qty: '-7',
    reference: 'ORD-5588',
    user: 'System',
    note: 'Auto-deducted on order fulfilment',
  },
  {
    day: 'Dec',
    date: '18, 2024',
    time: '11:05',
    product: 'HDMI Cable 2m Braided',
    sku: 'SKU-1006',
    type: 'Write-off',
    qty: '-4',
    reference: 'ADJ-0089',
    user: 'Marcus Webb',
    note: 'Packaging defect, written off',
  },
  {
    day: 'Dec',
    date: '17, 2024',
    time: '14:20',
    product: 'LED Desk Lamp Smart',
    sku: 'SKU-1007',
    type: 'Stock In',
    qty: '+50',
    reference: 'PO-2024-044',
    user: 'Sam Okafor',
    note: 'Received from LumiHome',
  },
  {
    day: 'Dec',
    date: '16, 2024',
    time: '10:48',
    product: 'Laptop Stand Aluminum',
    sku: 'SKU-1009',
    type: 'Stock Out',
    qty: '-12',
    reference: 'ORD-5591',
    user: 'Marcus Webb',
    note: 'Order fulfilment',
  },
  {
    day: 'Dec',
    date: '15, 2024',
    time: '16:00',
    product: '4K Webcam Ultra HD',
    sku: 'SKU-1005',
    type: 'Manual Adjustment',
    qty: '-3',
    reference: 'CNT-2024-12',
    user: 'Priya Sethi',
    note: 'Inventory count discrepancy correction',
  },
  {
    day: 'Dec',
    date: '14, 2024',
    time: '13:11',
    product: 'Noise-Cancelling Earbuds',
    sku: 'SKU-1010',
    type: 'Return',
    qty: '+2',
    reference: 'RET-0412',
    user: 'Sam Okafor',
    note: 'Customer return, resaleable condition',
  },
  {
    day: 'Dec',
    date: '13, 2024',
    time: '09:30',
    product: 'Smart Power Strip 6-Outlet',
    sku: 'SKU-1008',
    type: 'Stock Out',
    qty: '-6',
    reference: 'ORD-5579',
    user: 'System',
    note: 'Order fulfilment',
  },
  {
    day: 'Dec',
    date: '12, 2024',
    time: '15:45',
    product: 'Mechanical Keyboard TKL',
    sku: 'SKU-1004',
    type: 'Stock In',
    qty: '+20',
    reference: 'PO-2024-046',
    user: 'Marcus Webb',
    note: 'Partial receipt from HID Solutions',
  },
]

const typeMeta = {
  'Stock In': {
    icon: ArrowUpCircleIcon,
    iconStyle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  'Stock Out': {
    icon: ArrowDownCircleIcon,
    iconStyle: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 dark:border dark:border-blue-500/20',
    badge: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400',
  },
  'Manual Adjustment': {
    icon: AdjustmentsHorizontalIcon,
    iconStyle: 'bg-purple-50 text-purple-600 dark:bg-neon-purple/10 dark:text-neon-cyan dark:border dark:border-neon-cyan/20',
    badge: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-neon-cyan/25 dark:bg-neon-cyan/10 dark:text-neon-cyan',
  },
  Return: {
    icon: ArrowPathIcon,
    iconStyle: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border dark:border-cyan-500/20',
    badge: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-300',
  },
  'Write-off': {
    icon: TrashIcon,
    iconStyle: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20',
    badge: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400',
  },
}

const StockHistory = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMovements = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return movements.filter((movement) => {
      const matchesFilter = activeFilter === 'All' || movement.type === activeFilter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          movement.product,
          movement.sku,
          movement.reference,
          movement.user,
          movement.note,
          movement.type,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8F9FC] p-4 font-sans text-slate-900 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-6 lg:p-8">
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 dark:bg-neon-purple/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-5">
        <header>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            Stock History
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
            Track stock movement, references, and adjustment notes.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl md:p-4">
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
            <label className="flex h-10 w-full max-w-[390px] items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 text-slate-400 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-500">
              <MagnifyingGlassIcon className="h-4 w-4 shrink-0" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                placeholder="Search product, SKU, reference..."
              />
            </label>

            <div className="flex min-h-10 flex-1 flex-wrap items-center gap-1 rounded-xl border border-slate-100 bg-slate-100/70 p-1 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/30">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`h-8 rounded-lg px-3 text-xs font-extrabold transition ${
                    filter === activeFilter
                      ? 'bg-[#7A66F4] text-white shadow-[0_6px_13px_rgba(122,102,244,0.25)] dark:bg-neon-cyan/15 dark:text-neon-cyan dark:ring-1 dark:ring-neon-cyan/30 dark:shadow-[0_0_16px_rgba(0,243,255,0.10)]'
                      : 'text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="h-11 border-b border-slate-100 bg-slate-50/75 transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/25">
                  <th className="w-[125px] px-5 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Date & Time
                  </th>
                  <th className="w-[280px] px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Product
                  </th>
                  <th className="w-[175px] px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Movement Type
                  </th>
                  <th className="w-[105px] px-4 text-center text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Qty Change
                  </th>
                  <th className="w-[135px] px-4 text-center text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Reference
                  </th>
                  <th className="w-[125px] px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    User
                  </th>
                  <th className="px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">
                    Note
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredMovements.map((movement) => {
                  const meta = typeMeta[movement.type]
                  const Icon = meta.icon
                  const isPositive = movement.qty.startsWith('+')

                  return (
                    <tr key={`${movement.reference}-${movement.product}`} className="h-[74px] bg-white transition-colors hover:bg-slate-50/50 dark:bg-transparent dark:hover:bg-slate-900/25">
                      <td className="px-5 py-3 align-middle">
                        <p className="text-sm font-extrabold leading-tight text-slate-800 dark:text-slate-100">
                          {movement.day}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-snug text-slate-400 dark:text-slate-500">
                          {movement.date}
                          <br />
                          {movement.time}
                        </p>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <p className="text-sm font-extrabold leading-tight text-slate-800 dark:text-slate-100">
                          {movement.product}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {movement.sku}
                        </p>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${meta.iconStyle}`}>
                            <Icon className="h-4 w-4 stroke-[2.4]" />
                          </span>
                          <span className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-extrabold leading-tight ${meta.badge}`}>
                            {movement.type}
                          </span>
                        </div>
                      </td>

                      <td className={`px-4 py-3 text-center text-base font-extrabold align-middle ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {movement.qty}
                      </td>

                      <td className="px-4 py-3 text-center align-middle">
                        <span className="break-words font-mono text-xs font-extrabold leading-relaxed text-[#7467FF] dark:text-neon-cyan">
                          {movement.reference}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {movement.user}
                      </td>

                      <td className="px-4 py-3 align-middle text-xs font-semibold leading-5 text-slate-400 dark:text-slate-500">
                        {movement.note}
                      </td>
                    </tr>
                  )
                })}
                {filteredMovements.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm font-semibold text-slate-400 dark:text-slate-500"
                    >
                      No stock movements match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>

            <footer className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-3.5 transition-colors duration-300 dark:border-slate-800/80 dark:bg-transparent sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Showing {filteredMovements.length} of {movements.length} movements
              </p>
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 dark:text-slate-500">
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      page === 1
                        ? 'bg-[#7A66F4] text-white dark:bg-neon-cyan/15 dark:text-neon-cyan dark:ring-1 dark:ring-neon-cyan/30'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-900/70 dark:hover:text-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </footer>
          </div>
        </section>
      </div>
    </div>
  )
}

export default StockHistory
