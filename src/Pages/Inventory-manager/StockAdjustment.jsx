import React from 'react'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

const adjustments = [
  {
    ref: 'ADJ-0091',
    product: 'Bluetooth Headphones Pro',
    sku: 'SKU-1001',
    type: 'Stock In',
    before: 163,
    change: '+80',
    after: 243,
    reason: 'Purchase Order Received',
    adjustedBy: 'Marcus Webb',
    date: 'Dec 20, 2024 09:14',
  },
  {
    ref: 'ADJ-0090',
    product: 'Wireless Ergonomic Mouse',
    sku: 'SKU-1003',
    type: 'Write-off',
    before: 6,
    change: '-6',
    after: 0,
    reason: 'Damaged Goods Write-off',
    adjustedBy: 'Sam Okafor',
    date: 'Dec 19, 2024 15:32',
  },
  {
    ref: 'ADJ-0089',
    product: 'HDMI Cable 2m Braided',
    sku: 'SKU-1006',
    type: 'Write-off',
    before: 4,
    change: '-4',
    after: 0,
    reason: 'Damaged Goods Write-off',
    adjustedBy: 'Marcus Webb',
    date: 'Dec 18, 2024 11:05',
  },
  {
    ref: 'ADJ-0088',
    product: 'LED Desk Lamp Smart',
    sku: 'SKU-1007',
    type: 'Stock In',
    before: 106,
    change: '+50',
    after: 156,
    reason: 'Purchase Order Received',
    adjustedBy: 'Sam Okafor',
    date: 'Dec 17, 2024 14:20',
  },
  {
    ref: 'ADJ-0087',
    product: 'Laptop Stand Aluminum',
    sku: 'SKU-1009',
    type: 'Stock Out',
    before: 100,
    change: '-12',
    after: 88,
    reason: 'Customer Order Fulfilled',
    adjustedBy: 'Marcus Webb',
    date: 'Dec 16, 2024 10:48',
  },
  {
    ref: 'ADJ-0086',
    product: '4K Webcam Ultra HD',
    sku: 'SKU-1010',
    type: 'Manual Adjustment',
    before: 15,
    change: '-3',
    after: 12,
    reason: 'Manual Stock Count',
    adjustedBy: 'Priya Sethi',
    date: 'Dec 15, 2024 16:00',
  },
  {
    ref: 'ADJ-0085',
    product: 'USB-C Hub 7-in-1',
    sku: 'SKU-1012',
    type: 'Stock In',
    before: 34,
    change: '+2',
    after: 36,
    reason: 'Customer Return',
    adjustedBy: 'Marcus Webb',
    date: 'Dec 14, 2024 13:25',
  },
]

const typeStyles = {
  'Stock In': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Write-off': 'border-red-200 bg-red-50 text-red-600',
  'Stock Out': 'border-blue-200 bg-blue-50 text-blue-700',
  'Manual Adjustment': 'border-violet-200 bg-violet-50 text-violet-700',
}

const stats = [
  {
    label: 'Total Adjustments',
    value: '7',
    helper: 'Last 30 days',
    icon: AdjustmentsHorizontalIcon,
    iconStyle: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'Stocks Added',
    value: '+132',
    helper: 'Units received/returned',
    icon: ArrowUpIcon,
    iconStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Stock Removed',
    value: '-25',
    helper: 'Units dispatched/written off',
    icon: ArrowDownIcon,
    iconStyle: 'bg-red-50 text-red-600',
  },
]

const StockAdjustment = () => {
  return (
    <div className="min-h-screen bg-[#F8F8FF] px-6 py-8 font-sans text-[#1F2033] md:px-10">
      <div className="mx-auto max-w-[1700px] space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#191A2D]">
              Stock Adjustments
            </h1>
            <p className="mt-2 text-base text-[#8180A6]">
              Manual and system-generated stock changes
            </p>
          </div>

          <button className="inline-flex h-12 items-center gap-2 self-start rounded-lg bg-[#7F22FE] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7016ea] sm:self-auto">
            <PlusIcon className="h-5 w-5" />
            <span>New Adjustment</span>
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="rounded-lg border border-[#ECEBFA] bg-white p-5 shadow-sm"
              >
                <div className=" gap-4 p-2">
                  <div className={`flex mb-2 h-11 w-11 items-center justify-center rounded-lg ${item.iconStyle}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#191A2D]">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold text-[#191A2D]">{item.label}</p>
                    <p className="mt-1 text-sm text-[#8584A9]">{item.helper}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="overflow-hidden rounded-lg border border-[#E8E6F8] bg-white">
          <div className="px-8 py-5">
            <h2 className="text-2xl font-bold leading-tight text-[#191A2D]">
              Adjustment Log
            </h2>
            <p className="mt-2 text-base leading-none text-[#8180A6]">
              7 recent adjustments
            </p>
          </div>

          <div className="w-full overflow-hidden">
            <table className="w-full table-auto border-collapse text-left">
              <thead className="bg-[#FBFAFD]">
                <tr className="border-y border-[#E8E6F8]">
                  <th className="px-8 py-[21px] text-sm font-bold text-[#8584A9]">Ref</th>
                  <th className="px-8 py-[21px] text-sm font-bold text-[#8584A9]">Product</th>
                  <th className="px-8 py-[21px] text-sm font-bold text-[#8584A9]">Type</th>
                  <th className="px-5 py-[21px] text-center text-sm font-bold text-[#8584A9]">Before</th>
                  <th className="px-5 py-[21px] text-center text-sm font-bold text-[#8584A9]">Change</th>
                  <th className="px-5 py-[21px] text-center text-sm font-bold text-[#8584A9]">After</th>
                  <th className="px-8 py-[21px] text-sm font-bold text-[#8584A9]">Reason</th>
                  <th className="px-8 py-[21px] text-sm font-bold text-[#8584A9]">Adjusted By</th>
                  <th className="px-8 py-[21px] text-right text-sm font-bold text-[#8584A9]">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EFF8]">
                {adjustments.map((adjustment) => {
                  const isPositive = adjustment.change.startsWith('+')

                  return (
                    <tr key={adjustment.ref} className="h-24 bg-white">
                      <td className="px-8 py-5 text-sm font-medium text-[#8180A6]">
                        {adjustment.ref}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-base font-bold leading-tight text-[#1E1F2F]">
                          {adjustment.product}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#77769F]">
                          {adjustment.sku}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex h-8 items-center rounded-full border px-4 text-sm font-semibold ${typeStyles[adjustment.type]}`}>
                          {adjustment.type}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-center text-base font-medium text-[#8180A6]">
                        {adjustment.before}
                      </td>
                      <td className={`px-5 py-5 text-center text-base font-bold ${isPositive ? 'text-[#00A36B]' : 'text-[#FF1F2D]'}`}>
                        {adjustment.change}
                      </td>
                      <td className="px-5 py-5 text-center text-base font-bold text-[#1E1F2F]">
                        {adjustment.after}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[#7D7CA8]">
                        {adjustment.reason}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-[#1E1F2F]">
                        {adjustment.adjustedBy}
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-medium text-[#7D7CA8]">
                        {adjustment.date}
                      </td>
                    </tr>


                  )
                })}
              </tbody>
            </table>
          </div>
            <div className="px-8 py-5">
              <h2 className="mt-2 text-base leading-none text-[#8180A6]">
                Showing {adjustments.length} adjustments.
              </h2>
            </div>
        </section>
      </div>
    </div>
  )
}

export default StockAdjustment
