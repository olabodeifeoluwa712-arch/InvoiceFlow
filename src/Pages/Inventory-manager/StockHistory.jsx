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
    iconStyle: 'bg-[#E6FBF1] text-[#00A879]',
    badge: 'border-[#A6EFD4] bg-[#EFFFF8] text-[#008E68]',
  },
  'Stock Out': {
    icon: ArrowDownCircleIcon,
    iconStyle: 'bg-[#EAF4FF] text-[#1478FF]',
    badge: 'border-[#B9D8FF] bg-[#F0F7FF] text-[#005BFF]',
  },
  'Manual Adjustment': {
    icon: AdjustmentsHorizontalIcon,
    iconStyle: 'bg-[#F3EEFF] text-[#7F22FE]',
    badge: 'border-[#D8C8FF] bg-[#F6F1FF] text-[#6917FF]',
  },
  Return: {
    icon: ArrowPathIcon,
    iconStyle: 'bg-[#EAF8FF] text-[#009FEA]',
    badge: 'border-[#B9E4FF] bg-[#F1FAFF] text-[#007BB7]',
  },
  'Write-off': {
    icon: TrashIcon,
    iconStyle: 'bg-[#FFF0F0] text-[#FF1F2D]',
    badge: 'border-[#FFC5C5] bg-[#FFF6F6] text-[#FF1F2D]',
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8F8FF] font-sans text-[#19192B]">
      <section className="rounded-b-[18px] border-b border-[#ECEBFA] bg-white px-4 py-3 md:px-6">
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center">
          <label className="flex h-11 w-full max-w-[430px] items-center gap-3 rounded-[18px] bg-[#EEEEF8] px-4 text-[#7D7CA4]">
            <MagnifyingGlassIcon className="h-5 w-5 shrink-0" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#9A99B8]"
              placeholder="Search product, SKU, reference..."
            />
          </label>

          <div className="flex min-h-11 flex-1 flex-wrap items-center gap-1 rounded-[18px] bg-[#EDECF7] p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-9 rounded-[14px] px-4 text-xs font-extrabold transition ${
                  filter === activeFilter
                    ? 'bg-[#7A66F4] text-white shadow-[0_6px_13px_rgba(122,102,244,0.34)]'
                    : 'text-[#77769D] hover:bg-white/45'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-0 py-6">
        <div className="overflow-hidden rounded-[18px] border border-[#ECEBFA] bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="h-12 border-b border-[#ECEBFA] bg-[#FBFAFF]">
                  <th className="w-[140px] px-6 text-xs font-extrabold text-[#7D7CA4]">
                    Date & Time
                  </th>
                  <th className="w-[310px] px-5 text-xs font-extrabold text-[#7D7CA4]">
                    Product
                  </th>
                  <th className="w-[180px] px-5 text-xs font-extrabold text-[#7D7CA4]">
                    Movement Type
                  </th>
                  <th className="w-[115px] px-4 text-center text-xs font-extrabold text-[#7D7CA4]">
                    Qty Change
                  </th>
                  <th className="w-[145px] px-4 text-center text-xs font-extrabold text-[#7D7CA4]">
                    Reference
                  </th>
                  <th className="w-[135px] px-4 text-xs font-extrabold text-[#7D7CA4]">
                    User
                  </th>
                  <th className="px-5 text-xs font-extrabold text-[#7D7CA4]">
                    Note
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EFF8]">
                {filteredMovements.map((movement) => {
                  const meta = typeMeta[movement.type]
                  const Icon = meta.icon
                  const isPositive = movement.qty.startsWith('+')

                  return (
                    <tr key={`${movement.reference}-${movement.product}`} className="h-[92px] bg-white">
                      <td className="px-6 py-4 align-middle">
                        <p className="text-base font-extrabold leading-tight text-[#1B1B2F]">
                          {movement.day}
                        </p>
                        <p className="mt-1 text-xs font-medium leading-snug text-[#7D7CA4]">
                          {movement.date}
                          <br />
                          {movement.time}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="text-base font-extrabold leading-tight text-[#1B1B2F]">
                          {movement.product}
                        </p>
                        <p className="mt-1 font-mono text-xs font-medium text-[#7D7CA4]">
                          {movement.sku}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${meta.iconStyle}`}>
                            <Icon className="h-4.5 w-4.5 stroke-[2.4]" />
                          </span>
                          <span className={`inline-flex min-h-7 items-center rounded-full border px-3 text-sm font-extrabold leading-tight ${meta.badge}`}>
                            {movement.type}
                          </span>
                        </div>
                      </td>

                      <td className={`px-4 py-4 text-center text-lg font-extrabold align-middle ${isPositive ? 'text-[#009E73]' : 'text-[#FF1F2D]'}`}>
                        {movement.qty}
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <span className="break-words font-mono text-xs font-extrabold leading-relaxed text-[#7467FF]">
                          {movement.reference}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-middle text-sm font-medium text-[#1B1B2F]">
                        {movement.user}
                      </td>

                      <td className="px-5 py-4 align-middle text-sm font-medium leading-6 text-[#7D7CA4]">
                        {movement.note}
                      </td>
                    </tr>
                  )
                })}
                {filteredMovements.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm font-medium text-[#7D7CA4]"
                    >
                      No stock movements match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-4 border-t border-[#ECEBFA] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#7D7CA4]">
              Showing {filteredMovements.length} of {movements.length} movements
            </p>
            <div className="flex items-center gap-3 text-sm font-extrabold text-[#7D7CA4]">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    page === 1 ? 'bg-[#7A66F4] text-white' : 'hover:bg-[#F0EFF8]'
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
  )
}

export default StockHistory
