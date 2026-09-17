import React, { useMemo, useState, useEffect } from 'react'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { getStockHistory, getProducts } from '../../api/inventory.api'

const filters = ['All', 'Stock In', 'Stock Out', 'Manual Adjustment', 'Return', 'Write-off']

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
  const [movements, setMovements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [feedback, setFeedback] = useState(null)
  const itemsPerPage = 8

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const formatMovement = (item, idx) => {
    const dateObj = item.createdAt
      ? new Date(item.createdAt)
      : item.date
      ? new Date(item.date)
      : new Date()

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dayStr = months[dateObj.getMonth()] || 'Dec'
    const dateStr = `${dateObj.getDate()}, ${dateObj.getFullYear()}`
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

    // Determine productType matching backend notifications
    let productType = item.productType || item.type || 'Stock In'
    const normType = String(productType).toLowerCase()
    if (normType === 'stock out' || normType.includes('out')) productType = 'Stock Out'
    else if (normType === 'stock in' || normType.includes('in')) productType = 'Stock In'
    else if (normType.includes('manual') || normType.includes('adjust')) productType = 'Manual Adjustment'
    else if (normType.includes('return')) productType = 'Return'
    else if (normType.includes('write')) productType = 'Write-off'

    // Format quantity delta based on productType & quantity value
    const numQty = Math.abs(Number(item.quantity ?? 0))
    const formattedQty =
      productType === 'Stock Out' || normType.includes('write')
        ? `-${numQty}`
        : `+${numQty}`

    const prodName =
      item.productName ||
      item.product?.name ||
      (typeof item.product === 'string' ? item.product : 'Product Item')
    const prodSku =
      item.product?.sku ||
      item.sku ||
      (item._id ? `SKU-${item._id.slice(-4).toUpperCase()}` : `SKU-${1000 + idx}`)
    const refCode =
      item.reference ||
      item.ref ||
      (item._id ? `REF-${item._id.slice(-6).toUpperCase()}` : `REF-${2024 + idx}`)
    const userName =
      item.performedBy ||
      item.user?.name ||
      (typeof item.user === 'string' ? item.user : 'System')
    const noteMsg =
      item.message || item.note || item.notes || item.reason || `${productType} recorded`

    return {
      id: item._id || item.id || `mov-${idx}`,
      day: item.day || dayStr,
      date: item.dateStr || dateStr,
      time: item.time || timeStr,
      product: prodName,
      sku: prodSku,
      productType: productType,
      quantity: formattedQty,
      reference: refCode,
      user: userName,
      note: noteMsg,
    }
  }

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await getStockHistory()
      console.log('Stock history API payload:', response)

      let items = []
      if (response && !response.error) {
        if (Array.isArray(response)) items = response
        else if (response?.data && Array.isArray(response.data)) items = response.data
        else if (response?.movements && Array.isArray(response.movements)) items = response.movements
        else if (response?.history && Array.isArray(response.history)) items = response.history
      }

      // Fallback: If no history returned, construct items from products listing
      if (items.length === 0) {
        const prodRes = await getProducts()
        let prodList = []
        if (Array.isArray(prodRes)) prodList = prodRes
        else if (prodRes?.products && Array.isArray(prodRes.products)) prodList = prodRes.products
        else if (prodRes?.data && Array.isArray(prodRes.data)) prodList = prodRes.data

        if (prodList.length > 0) {
          items = prodList.map((p, idx) => ({
            _id: p._id || p.id,
            productName: p.name,
            sku: p.sku || `SKU-${1000 + idx}`,
            productType: p.stockOut ? 'Stock Out' : 'Stock In',
            quantity: p.qty ?? p.quantity ?? p.stock ?? 0,
            reference: `ADJ-${1000 + idx}`,
            performedBy: 'System',
            message: `Initial stock recording for ${p.name}`,
            createdAt: p.updatedAt || p.createdAt || new Date().toISOString(),
          }))
        }
      }

      setMovements(items.map(formatMovement))
    } catch (err) {
      console.error('Error fetching stock history:', err)
      showFeedback('error', 'Failed to load stock history from server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredMovements = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return movements.filter((movement) => {
      const matchesFilter = activeFilter === 'All' || movement.productType === activeFilter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          movement.product,
          movement.sku,
          movement.reference,
          movement.user,
          movement.note,
          movement.productType,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm, movements])

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / itemsPerPage))
  const firstIndex = filteredMovements.length === 0 ? 0 : (currentPage - 1) * itemsPerPage
  const lastIndex = Math.min(currentPage * itemsPerPage, filteredMovements.length)
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8F9FC] p-4 font-sans text-slate-900 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-6 lg:p-8">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 dark:bg-neon-purple/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all shadow-md ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
              Stock History
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
              Track stock movement, references, and adjustment notes.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            <span>Refresh History</span>
          </button>
        </header>

        {/* Search & Filter Toolbar */}
        <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl md:p-4">
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
            <label className="flex h-10 w-full max-w-[390px] items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 text-slate-400 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-500">
              <MagnifyingGlassIcon className="h-4 w-4 shrink-0" />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                placeholder="Search product, SKU, reference..."
              />
            </label>

            <div className="flex min-h-10 flex-1 flex-wrap items-center gap-1 rounded-xl border border-slate-100 bg-slate-100/70 p-1 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/30">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter)
                    setCurrentPage(1)
                  }}
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

        {/* Movements Table */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
            <div className="w-full overflow-x-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <ArrowPathIcon className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
                  <p className="text-sm font-medium">Loading stock history from server...</p>
                </div>
              ) : (
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
                    {paginatedMovements.map((movement) => {
                      const meta = typeMeta[movement.productType] || typeMeta['Stock In']
                      const Icon = meta.icon
                      const isPositive = movement.quantity.startsWith('+')

                      return (
                        <tr
                          key={movement.id || Math.random()}
                          className="h-[74px] bg-white transition-colors hover:bg-slate-50/50 dark:bg-transparent dark:hover:bg-slate-900/25"
                        >
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
                              <span
                                className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-extrabold leading-tight ${meta.badge}`}
                              >
                                {movement.productType}
                              </span>
                            </div>
                          </td>

                          <td
                            className={`px-4 py-3 text-center text-base font-extrabold align-middle ${
                              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {movement.quantity}
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
                          {searchTerm
                            ? `No stock movements match "${searchTerm}".`
                            : 'No stock movements match the selected filter tab.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Footer */}
            {filteredMovements.length > itemsPerPage && (
              <footer className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-3.5 transition-colors duration-300 dark:border-slate-800/80 dark:bg-transparent sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Showing <span className="font-bold text-slate-700 dark:text-slate-300">{firstIndex + 1}</span> to{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{lastIndex}</span> of{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{filteredMovements.length}</span> movements
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60"
                  >
                    <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`h-8 min-w-8 rounded-lg px-2 text-xs font-extrabold transition-colors ${
                        currentPage === page
                          ? 'bg-[#7A66F4] text-white shadow-[0_6px_13px_rgba(122,102,244,0.25)] dark:bg-neon-cyan/15 dark:text-neon-cyan dark:ring-1 dark:ring-neon-cyan/30'
                          : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60"
                  >
                    <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </footer>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default StockHistory
