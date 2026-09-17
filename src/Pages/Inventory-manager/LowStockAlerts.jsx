import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { getProducts } from '../../api/inventory.api'

const ActionButton = ({ children, icon: Icon, intent = 'neutral', to, onClick }) => {
  const styles =
    intent === 'danger'
      ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
      : intent === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan'

  const content = (
    <button
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3.5 text-xs font-extrabold transition-all hover:-translate-y-0.5 shadow-sm ${styles}`}
    >
      {Icon && <Icon className="h-4 w-4 stroke-[2.2]" />}
      <span>{children}</span>
    </button>
  )

  if (to) {
    return <Link to={to}>{content}</Link>
  }
  return content
}

const LowStockAlerts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchProductsList = async () => {
    setIsLoading(true)
    try {
      const response = await getProducts()
      if (response && !response.error) {
        let items = []
        if (Array.isArray(response)) items = response
        else if (response?.products && Array.isArray(response.products)) items = response.products
        else if (response?.data && Array.isArray(response.data)) items = response.data
        else if (response?.items && Array.isArray(response.items)) items = response.items
        setProducts(items)
      }
    } catch (err) {
      console.error('Error fetching products for low stock alerts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsList()
  }, [])

  // Identify out-of-stock and low-stock items cleanly from API data
  const unavailable = useMemo(() => {
    return products.filter((p) => {
      const status = (p.status || '').toLowerCase()
      const qty = Number(p.quantity ?? p.qty ?? p.stock ?? 0)
      return status === 'out of stock' || qty === 0
    })
  }, [products])

  const lowStock = useMemo(() => {
    return products.filter((p) => {
      const status = (p.status || '').toLowerCase()
      const qty = Number(p.quantity ?? p.qty ?? p.stock ?? 0)
      return (status === 'low stock' || (qty > 0 && qty <= 10)) && !unavailable.some((u) => (u._id || u.id) === (p._id || p.id))
    })
  }, [products, unavailable])

  const totalAffected = unavailable.length + lowStock.length

  // Filter list based on search and tab selection
  const filteredList = useMemo(() => {
    let source = []
    if (activeTab === 'out-of-stock') source = unavailable
    else if (activeTab === 'low-stock') source = lowStock
    else source = [...unavailable, ...lowStock]

    if (!searchTerm.trim()) return source

    const term = searchTerm.toLowerCase()
    return source.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    )
  }, [activeTab, unavailable, lowStock, searchTerm])

  const stats = [
    {
      value: unavailable.length,
      label: 'Out of Stock',
      helper: 'Immediate restock required',
      badge: `${unavailable.length} Critical`,
      icon: XCircleIcon,
      card: 'border-rose-200 bg-rose-50/40 dark:border-rose-500/30 dark:bg-rose-950/20',
      iconBox: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20',
      badgeStyle: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
    },
    {
      value: lowStock.length,
      label: 'Low Stock Alerts',
      helper: 'Below 10 unit reorder threshold',
      badge: `${lowStock.length} Warning`,
      icon: ExclamationTriangleIcon,
      card: 'border-amber-200 bg-amber-50/30 dark:border-amber-500/30 dark:bg-amber-950/15',
      iconBox: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border dark:border-amber-500/20',
      badgeStyle: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    },
    {
      value: totalAffected,
      label: 'Total Affected Items',
      helper: 'Requiring inventory adjustment',
      badge: `${totalAffected} Total`,
      icon: CubeIcon,
      card: 'border-purple-100 bg-purple-50/20 dark:border-slate-800/80 dark:bg-cyber-card/85',
      iconBox: 'bg-purple-100 text-purple-600 dark:bg-neon-cyan/10 dark:text-neon-cyan dark:border dark:border-neon-cyan/20',
      badgeStyle: 'bg-purple-100 text-purple-700 dark:bg-neon-cyan/20 dark:text-neon-cyan border-purple-200 dark:border-neon-cyan/30',
    },
  ]

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8F9FC] p-4 font-sans text-slate-900 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-6 lg:p-8">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 dark:bg-neon-purple/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        {/* Header Title Bar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
                Low Stock Alerts
              </h1>
              {totalAffected > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.35)] flex items-center gap-1.5 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  {totalAffected} Alerts Active
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
              Monitor critical inventory levels, reorder thresholds, and out-of-stock items in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProductsList}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card/85 dark:text-slate-300 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2.2} />
              <span>Refresh Alerts</span>
            </button>

            <Link
              to="/add-products"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 text-xs font-extrabold text-white shadow-[0_6px_16px_rgba(124,58,237,0.25)] transition hover:bg-[#6D28D9] dark:bg-neon-cyan dark:text-slate-950 dark:shadow-[0_0_16px_rgba(0,243,255,0.2)]"
            >
              <PlusIcon className="h-4 w-4 stroke-[2.5]" />
              <span>Add Stock</span>
            </Link>
          </div>
        </header>

        {/* Metric Summary Cards */}
        <section className="grid gap-4 lg:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.label}
                className={`relative min-h-[148px] min-w-0 overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 dark:shadow-2xl ${item.card}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBox}`}>
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold leading-none text-slate-900 dark:text-slate-100">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {item.helper}
                  </p>
                </div>
              </article>
            )
          })}
        </section>

        {/* Toolbar: Search and Filter Tabs */}
        <section className="rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex h-10 w-full max-w-[360px] items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 text-slate-400 transition-colors duration-300 focus-within:border-[#7C3AED] dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-500 dark:focus-within:border-neon-cyan">
              <MagnifyingGlassIcon className="h-4 w-4 shrink-0" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                placeholder="Search product name, SKU, brand..."
              />
            </label>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-950/30">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`h-8 rounded-lg px-3 text-xs font-extrabold transition ${
                  activeTab === 'all'
                    ? 'bg-[#7C3AED] text-white shadow-sm dark:bg-neon-cyan/20 dark:text-neon-cyan dark:ring-1 dark:ring-neon-cyan/30'
                    : 'text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-200'
                }`}
              >
                All ({totalAffected})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('out-of-stock')}
                className={`h-8 rounded-lg px-3 text-xs font-extrabold transition ${
                  activeTab === 'out-of-stock'
                    ? 'bg-rose-600 text-white shadow-sm dark:bg-rose-500/20 dark:text-rose-400 dark:ring-1 dark:ring-rose-500/30'
                    : 'text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-200'
                }`}
              >
                Out of Stock ({unavailable.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('low-stock')}
                className={`h-8 rounded-lg px-3 text-xs font-extrabold transition ${
                  activeTab === 'low-stock'
                    ? 'bg-amber-500 text-white shadow-sm dark:bg-amber-500/20 dark:text-amber-400 dark:ring-1 dark:ring-amber-500/30'
                    : 'text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-200'
                }`}
              >
                Low Stock ({lowStock.length})
              </button>
            </div>
          </div>
        </section>

        {/* Affected Items Listing */}
        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
          <div className="border-b border-slate-100 bg-slate-50/75 px-5 py-4 dark:border-slate-800/80 dark:bg-slate-950/25">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Alert Items ({filteredList.length})
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Sorted by priority level
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
                <p className="text-xs font-semibold">Loading live low stock alerts from server...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-16 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                {searchTerm
                  ? `No low stock items match "${searchTerm}".`
                  : totalAffected === 0
                  ? 'All products are fully stocked above reorder thresholds!'
                  : 'No items found in this filter tab.'}
              </div>
            ) : (
              filteredList.map((item, idx) => {
                const itemId = item._id || item.id || `prod-${idx}`
                const qty = Number(item.quantity ?? item.qty ?? item.stock ?? 0)
                const isOutOfStock = qty === 0 || (item.status || '').toLowerCase() === 'out of stock'
                const threshold = 10
                const percent = Math.min(100, Math.round((qty / threshold) * 100))

                return (
                  <div
                    key={itemId}
                    className="grid min-w-0 gap-4 px-5 py-5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-900/30 md:px-6 xl:grid-cols-[48px_minmax(0,1fr)_140px_auto] xl:items-center"
                  >
                    {/* Status Badge Icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        isOutOfStock
                          ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400'
                          : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}
                    >
                      {isOutOfStock ? (
                        <XCircleIcon className="h-6 w-6 stroke-[2.2]" />
                      ) : (
                        <ExclamationTriangleIcon className="h-6 w-6 stroke-[2.2]" />
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                          {item.name}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${
                            isOutOfStock
                              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/15 dark:text-rose-400'
                              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-400'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {item.brand || item.category || 'General Product'}
                        <span className="px-2">·</span>
                        SKU: <span className="font-mono text-slate-600 dark:text-slate-300">{item.sku || `SKU-${1000 + idx}`}</span>
                        <span className="px-2">·</span>
                        Unit Cost: ${Number(item.unitCost || 0).toFixed(2)}
                        <span className="px-2">·</span>
                        Unit Price: ${Number(item.unitPrice || 0).toFixed(2)}
                      </p>

                      {/* Stock Level Progress Bar */}
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOutOfStock ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${isOutOfStock ? 0 : percent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {qty} / {threshold} min reorder limit
                        </span>
                      </div>
                    </div>

                    {/* Stock Quantity Column */}
                    <div className="text-left xl:text-right">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Current Stock
                      </p>
                      <p
                        className={`mt-0.5 text-xl font-extrabold ${
                          isOutOfStock ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {qty} {qty === 1 ? 'unit' : 'units'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex min-w-0 flex-wrap gap-2 xl:justify-end">
                      <ActionButton
                        icon={AdjustmentsHorizontalIcon}
                        intent={isOutOfStock ? 'danger' : 'warning'}
                        to="/stock-adjustments"
                      >
                        Adjust Stock
                      </ActionButton>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LowStockAlerts
