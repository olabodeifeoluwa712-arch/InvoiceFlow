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
    card: 'border-[#FFB9B9] bg-[#FFF9FB]',
    iconBox: 'bg-[#FFF0F0] text-[#FF2E39]',
  },
  {
    value: '4',
    label: 'Low Stock',
    helper: 'Below reorder threshold',
    icon: ExclamationTriangleIcon,
    card: 'border-[#FFD251] bg-white',
    iconBox: 'bg-[#FFF3BF] text-[#FF8700]',
  },
  {
    value: '6',
    label: 'Total Affected',
    helper: 'Products needing attention',
    icon: ExclamationTriangleIcon,
    card: 'border-[#ECEBFA] bg-white',
    iconBox: 'bg-[#F0EEFF] text-[#7972FF]',
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
      ? 'border-[#FFC9C9] bg-[#FFECEC] text-[#D71920]'
      : intent === 'warning'
        ? 'border-[#FFD15C] bg-[#FFFDF5] text-[#C95C00]'
        : 'border-[#ECEBFA] bg-white text-[#1C1C2E]'

  return (
    <button className={`inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border px-4 text-sm font-bold transition hover:-translate-y-0.5 ${styles}`}>
      <Icon className="h-4.5 w-4.5" />
      <span>{children}</span>
    </button>
  )
}

const LowStockAlerts = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8F8FF] px-4 py-7 font-sans text-[#19192B] sm:px-5 md:px-6">
      <div className="mx-auto w-full max-w-full space-y-9">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-[#17172A]">
              Low Stock Alerts
            </h1>
            <p className="mt-2 text-base font-medium text-[#8180A6]">
              2 out of stock . 4 below threshold
            </p>
          </div>

          <button className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-[18px] border border-[#E7E5F8] bg-white px-5 text-base font-bold text-[#7E7DA1] shadow-sm transition hover:bg-[#FBFAFF]">
            <ArrowPathIcon className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.label}
                className={`min-h-[250px] min-w-0 rounded-[22px] border p-8 shadow-[0_16px_35px_rgba(84,76,130,0.04)] ${item.card}`}
              >
                <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-[22px] ${item.iconBox}`}>
                  <Icon className="h-7 w-7 stroke-[2.2]" />
                </div>
                <div className="mt-7">
                  <p className="text-[34px] font-extrabold leading-none text-[#17172A]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-tight text-[#555568]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-medium leading-tight text-[#8180A6]">
                    {item.helper}
                  </p>
                </div>
              </article>
            )
          })}
        </section>

        <section className="overflow-hidden rounded-[22px] border border-[#FFB9B9] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#FFC9C9] bg-[#FFFCFC] px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <XCircleIcon className="mt-2 h-6 w-6 shrink-0 text-[#FF2E39]" />
              <div>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#17172A]">
                  Out of Stock - Critical
                </h2>
                <p className="mt-1 text-base font-medium text-[#8180A6]">
                  These products have zero inventory and need immediate restocking
                </p>
              </div>
            </div>
            <span className="inline-flex h-9 items-center self-start rounded-full border border-[#FFC9C9] bg-[#FFE5E5] px-4 text-base font-extrabold text-[#FF1F2D] sm:self-center">
              {unavailable.length} items
            </span>
          </div>

          <div className="divide-y divide-[#F3EEF0]">
            {unavailable.map((item) => (
              <div
                key={item.sku}
                className="grid min-w-0 gap-5 px-5 py-7 md:px-8 xl:grid-cols-[56px_minmax(0,1fr)_150px_auto] xl:items-center"
              >
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#FFC1C1] bg-[#FFF0F0] text-[#FF2E39]">
                  <XCircleIcon className="h-6 w-6 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold leading-tight text-[#1D1D30]">
                    {item.name}
                  </h3>
                  <p className="mt-1 break-words text-sm font-medium text-[#8180A6]">
                    {item.sku}
                    <span className="px-3">.</span>
                    {item.category}
                    <span className="px-3">.</span>
                    {item.company}
                  </p>
                </div>

                <div className="text-left xl:text-right">
                  <p className="text-base font-medium leading-tight text-[#8180A6]">
                    Reorder at
                  </p>
                  <p className="mt-1 text-lg font-extrabold leading-tight text-[#1D1D30]">
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

        <section className="overflow-hidden rounded-[22px] border border-[#FFD251] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#FFD251] bg-[#FFFEFB] px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="mt-2 h-6 w-6 shrink-0 text-[#FF8700]" />
              <div>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#17172A]">
                  Low Stock - Warning
                </h2>
                <p className="mt-1 text-base font-medium text-[#8180A6]">
                  Products below their reorder threshold
                </p>
              </div>
            </div>
            <span className="inline-flex h-9 items-center self-start rounded-full border border-[#FFD15C] bg-[#FFF5CF] px-4 text-base font-extrabold text-[#C95C00] sm:self-center">
              {lowStock.length} items
            </span>
          </div>

          <div className="divide-y divide-[#F5EED8]">
            {lowStock.map((item) => {
              const percent = Math.min(100, Math.round((item.left / item.reorder) * 100))

              return (
                <div
                  key={item.sku}
                  className="grid min-w-0 gap-5 px-5 py-7 md:px-8 xl:grid-cols-[56px_minmax(0,1fr)_110px_auto] xl:items-center"
                >
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#FFD15C] bg-[#FFFDF5] text-[#FF8700]">
                    <ExclamationTriangleIcon className="h-6 w-6 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold leading-tight text-[#1D1D30]">
                      {item.name}
                    </h3>
                    <p className="mt-1 break-words text-sm font-medium text-[#8180A6]">
                      {item.sku}
                      <span className="px-3">.</span>
                      {item.company}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="h-2.5 w-full max-w-[180px] overflow-hidden rounded-full bg-[#EEEFF8]">
                        <div
                          className="h-full rounded-full bg-[#FFB300]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#8180A6]">
                        {item.left} / {item.reorder} reorder level
                      </span>
                    </div>
                  </div>

                  <div className="text-left xl:text-right">
                    <p className="text-2xl font-extrabold leading-none text-[#DD6900]">
                      {item.left}
                    </p>
                    <p className="mt-1 text-base font-medium leading-tight text-[#8180A6]">
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
