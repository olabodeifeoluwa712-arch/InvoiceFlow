import { useMemo, useState } from 'react'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CubeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { products as initialProducts } from '../../Database/data.json'

const categoryColors = {
  Electronics: {
    bg: 'bg-[#EEF2FF] dark:bg-indigo-500/10',
    text: 'text-[#6366F1] dark:text-indigo-400',
  },
  Accessories: {
    bg: 'bg-[#F0FDF4] dark:bg-emerald-500/10',
    text: 'text-[#16A34A] dark:text-emerald-400',
  },
  Peripherals: {
    bg: 'bg-[#EFF6FF] dark:bg-sky-500/10',
    text: 'text-[#2563EB] dark:text-sky-400',
  },
  Cables: {
    bg: 'bg-[#FFF7ED] dark:bg-orange-500/10',
    text: 'text-[#EA580C] dark:text-orange-400',
  },
  Lighting: {
    bg: 'bg-[#FDF4FF] dark:bg-fuchsia-500/10',
    text: 'text-[#C026D3] dark:text-fuchsia-400',
  },
}

const ADJUSTMENT_REASONS = [
  'Purchase Order Received',
  'Damaged Goods Write-off',
  'Cycle Count Correction',
  'Customer Return',
  'Transfer Between Warehouses',
  'Other',
]

const LOW_STOCK_THRESHOLD = 10

const num = (v) => Number(v) || 0

const getStatusFromQty = (qty) => {
  if (qty <= 0) return 'Out of Stock'
  if (qty <= LOW_STOCK_THRESHOLD) return 'Low Stock'
  return 'In Stock'
}

const emptyForm = {
  productId: '',
  type: 'stock-in',
  quantity: '',
  reason: ADJUSTMENT_REASONS[0],
  notes: '',
}

const StockAdjustment = () => {
  const [productList, setProductList] = useState(() =>
    initialProducts.map((p) => ({
      ...p,
      qty: num(p.qty),
      unitCost: num(p.unitCost),
      unitPrice: num(p.unitPrice),
    }))
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const stats = useMemo(() => {
    const inStockCount = productList.filter((p) => p.status === 'In Stock').length
    const lowStockCount = productList.filter((p) => p.status === 'Low Stock').length
    const outOfStockCount = productList.filter((p) => p.status === 'Out of Stock').length

    return [
      {
        label: 'Total Products',
        value: productList.length,
        helper: 'Tracked in catalogue',
        icon: AdjustmentsHorizontalIcon,
        iconStyle:
          'bg-violet-50 text-violet-600 dark:bg-neon-cyan/10 dark:text-neon-cyan dark:border dark:border-neon-cyan/20',
      },
      {
        label: 'In Stock',
        value: inStockCount,
        helper: 'Ready to sell',
        icon: ArrowUpIcon,
        iconStyle:
          'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20',
      },
      {
        label: 'Needs Attention',
        value: lowStockCount + outOfStockCount,
        helper: 'Low or out of stock',
        icon: ArrowDownIcon,
        iconStyle:
          'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20',
      },
    ]
  }, [productList])

  const selectedProduct = productList.find((p) => p.id === form.productId)

  const openModal = (productId = '') => {
    setForm({ ...emptyForm, productId })
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
    setFormError('')
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFormError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.productId) {
      setFormError('Please select a product.')
      return
    }

    const qtyChange = num(form.quantity)
    if (qtyChange < 1) {
      setFormError('Quantity must be at least 1.')
      return
    }

    const product = productList.find((p) => p.id === form.productId)
    if (!product) {
      setFormError('Product not found.')
      return
    }

    const delta = form.type === 'stock-in' ? qtyChange : -qtyChange
    const newQty = Math.max(0, product.qty + delta)

    if (form.type === 'stock-out' && product.qty < qtyChange) {
      setFormError(`Only ${product.qty} units available to remove.`)
      return
    }

    setProductList((prev) =>
      prev.map((p) =>
        p.id === form.productId
          ? { ...p, qty: newQty, status: getStatusFromQty(newQty) }
          : p
      )
    )

    closeModal()
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8F9FC] p-4 font-sans text-slate-900 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-6 lg:p-8">
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 dark:bg-neon-purple/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
              Stock Adjustments
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
              Manual and system-generated stock changes
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl bg-[#7F22FE] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(124,31,255,0.18)] transition hover:bg-[#7016ea] dark:bg-neon-purple dark:text-white dark:shadow-[0_0_18px_rgba(189,0,255,0.22)] sm:self-auto"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Adjustment</span>
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl"
              >
                <div>
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.iconStyle}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none text-slate-900 dark:text-slate-100">
                      {item.value}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">{item.helper}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
          <div className="px-5 py-4 md:px-6">
            <h2 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100 md:text-xl">
              Product Inventory
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500 md:text-sm">
              {productList.length} products available for stock adjustment
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="h-11 border-y border-slate-100 bg-slate-50/75 transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/25">
                  <th className="px-5 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Product Name</th>
                  <th className="px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">SKU</th>
                  <th className="px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Category</th>
                  <th className="px-4 text-right text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Unit Cost</th>
                  <th className="px-4 text-right text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Unit Price</th>
                  <th className="px-4 text-center text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Qty</th>
                  <th className="px-4 text-center text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Status</th>
                  <th className="px-5 text-right text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {productList.map((product) => {
                  const catStyle = categoryColors[product.category] || {
                    bg: 'bg-slate-100 dark:bg-slate-800/60',
                    text: 'text-slate-600 dark:text-slate-300',
                  }

                  return (
                    <tr
                      key={product.id}
                      className="h-[74px] bg-white transition-colors hover:bg-slate-50/50 dark:bg-transparent dark:hover:bg-slate-900/25"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              product.status === 'Out of Stock'
                                ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                                : product.status === 'Low Stock'
                                  ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400'
                                  : 'bg-indigo-50 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400'
                            }`}
                          >
                            <CubeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold leading-tight text-slate-800 dark:text-slate-100">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {product.sku}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}>
                          {product.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-500 dark:text-slate-400">
                        ${product.unitCost}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        ${product.unitPrice}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-sm font-extrabold ${
                            product.status === 'Out of Stock'
                              ? 'text-rose-500 dark:text-rose-400'
                              : product.status === 'Low Stock'
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {product.qty}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                            product.status === 'In Stock'
                              ? 'border-emerald-100/50 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : product.status === 'Low Stock'
                                ? 'border-amber-100/50 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                                : 'border-rose-100/50 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.status === 'In Stock'
                                ? 'bg-emerald-500'
                                : product.status === 'Low Stock'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                            }`}
                          ></span>
                          {product.status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openModal(product.id)}
                            className="rounded-lg border border-slate-100 bg-white p-1.5 text-[#7C3AED] transition-colors hover:bg-indigo-50 dark:border-slate-800 dark:bg-cyber-card dark:text-neon-cyan dark:hover:bg-indigo-500/10"
                            aria-label={`Adjust stock for ${product.name}`}
                          >
                            <PencilSquareIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-100 bg-white p-1.5 text-rose-500 transition-colors hover:bg-rose-50 dark:border-slate-800 dark:bg-cyber-card dark:text-rose-400 dark:hover:bg-rose-500/10"
                            aria-label={`Remove ${product.name}`}
                          >
                            <TrashIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3.5 transition-colors duration-300 dark:border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Showing {productList.length} products.
            </p>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/40"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adjustment-modal-title"
          >
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan"></div>

            <div className="flex justify-between items-center mb-6">
              <h3
                id="adjustment-modal-title"
                className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100"
              >
                New Stock Adjustment
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Product
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => setField('productId', e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80"
                  required
                >
                  <option value="">Select a product…</option>
                  {productList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — {p.qty} in stock
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Current quantity:{' '}
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedProduct.qty}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{selectedProduct.status}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setField('type', 'stock-in')}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                      form.type === 'stock-in'
                        ? 'border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                    }`}
                  >
                    + Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setField('type', 'stock-out')}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                      form.type === 'stock-out'
                        ? 'border-rose-500/50 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                    }`}
                  >
                    − Stock Out
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={form.quantity}
                  onChange={(e) => setField('quantity', e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80"
                  required
                />
                {selectedProduct && form.quantity && (
                  <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    New quantity:{' '}
                    <span className="text-slate-800 dark:text-slate-200">
                      {Math.max(
                        0,
                        selectedProduct.qty +
                          (form.type === 'stock-in' ? num(form.quantity) : -num(form.quantity))
                      )}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Reason
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => setField('reason', e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80"
                >
                  {ADJUSTMENT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Add any details about this adjustment…"
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  className="w-full resize-none bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80"
                />
              </div>

              {formError && (
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400" role="alert">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7F22FE] text-white hover:bg-[#7016ea] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockAdjustment
