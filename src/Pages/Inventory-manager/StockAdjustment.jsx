import React, { useMemo, useState, useEffect } from 'react'
import {
  AdjustmentsHorizontalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CubeIcon,
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { getProducts, adjustStock } from '../../api/inventory.api'

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

const num = (v) => Number(v) || 0

const emptyForm = {
  productId: '',
  type: 'Stock In',
  quantity: '',
  reason: ADJUSTMENT_REASONS[0],
  notes: '',
}
    

const StockAdjustment = () => {
  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log('form.type',form.type)

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
        setProductList(items)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsList()
  }, [])

  const stats = useMemo(() => {
    const inStockCount = productList.filter((p) => (p.status || '').toLowerCase() === 'in stock').length
    const lowStockCount = productList.filter((p) => (p.status || '').toLowerCase() === 'low stock').length
    const outOfStockCount = productList.filter((p) => (p.status || '').toLowerCase() === 'out of stock').length

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

  const selectedProduct = productList.find((p) => (p._id || p.id) === form.productId)

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

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId) {
        setFormError('Please select a product.');
        return;
    }

    let qtyChange = num(form.quantity);

    if (form.type === 'Stock In' && qtyChange < 1) {
        setFormError('Quantity must be at least 1.');
        return;
    }

    // Stock Out should be negative
    if (form.type === 'Stock Out') {
        if (qtyChange < 1) {
            setFormError('Quantity must be at least 1.');
            return;
        }

        qtyChange *= -1;
    }

    console.log('qtyChange:', qtyChange);

    const product = productList.find(
        (p) => (p._id || p.id) === form.productId
    );

    if (!product) {
        setFormError('Product not found.');
        return;
    }

    const currentQty = num(product.quantity ?? 0);

    // Compare absolute amount because qtyChange is negative
    if (form.type === 'Stock Out' && Math.abs(qtyChange) > currentQty) {
        setFormError(
            `Only ${currentQty} units available to remove.`
        );
        return;
    }

    const delta = qtyChange;
    const newQty = currentQty + delta;

    console.log('delta:', delta);
    console.log('new quantity:', newQty);

    const resolveStatus = (qty) => {
        if (qty === 0) {
            return 'Out of Stock';
        }

        if (qty <= 30) {
            return 'Low Stock';
        }

        return 'In Stock';
    };

    setIsSubmitting(true);

    try {
        const response = await adjustStock(product._id, {
            quantity: delta,
            type: form.type,
        });

        if (response && !response.error) {
            await fetchProductsList();
            closeModal();
        } else {
            setFormError(
                response?.error || 'Failed to update stock.'
            );
        }
    } catch (err) {
        setFormError(
            err?.message || 'Error executing stock adjustment.'
        );
    } finally {
        setIsSubmitting(false);
    }
};
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

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProductsList}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card/85 dark:text-slate-300 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex h-10 items-center gap-2 self-start rounded-xl bg-[#7F22FE] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(124,31,255,0.18)] transition hover:bg-[#7016ea] dark:bg-neon-purple dark:text-white dark:shadow-[0_0_18px_rgba(189,0,255,0.22)] sm:self-auto"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Adjustment</span>
            </button>
          </div>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
                <p className="text-sm font-medium">Loading inventory products...</p>
              </div>
            ) : productList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <CubeIcon className="w-8 h-8 mb-2 text-slate-300" />
                <p className="text-sm font-bold">No inventory products found</p>
              </div>
            ) : (
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="h-11 border-y border-slate-100 bg-slate-50/75 transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/25">
                    <th className="px-5 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Product Name</th>
                    <th className="px-4 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500">Brand</th>
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
                    const pId = product._id || product.id
                    const categoryName = product.category || 'General'
                    const catStyle = categoryColors[categoryName] || {
                      bg: 'bg-slate-100 dark:bg-slate-800/60',
                      text: 'text-slate-600 dark:text-slate-300',
                    }
                    const status = product.status || ''
                    const qty = num(product.qty ?? product.quantity ?? product.stock ?? 0)

                    return (
                      <tr key={pId} className="h-16 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/25">
                        <td className="px-5 text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {product.name}
                        </td>
                        <td className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {product.brand || '—'}
                        </td>
                        <td className="px-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${catStyle.bg} ${catStyle.text}`}>
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400">
                          ${num(product.unitCost).toFixed(2)}
                        </td>
                        <td className="px-4 text-right text-xs font-bold text-slate-800 dark:text-slate-100">
                          ${num(product.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-4 text-center text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {qty}
                        </td>
                        <td className="px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                              status === 'Out of Stock'
                                ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
                                : status === 'Low Stock'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-5 text-right">
                          <button
                            type="button"
                            onClick={() => openModal(pId)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card/85 dark:text-slate-200 dark:hover:border-neon-cyan/30 dark:hover:text-neon-cyan"
                          >
                            <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" />
                            <span>Adjust</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Adjustment Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md dark:bg-slate-950/70"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adjustment-modal-title"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-cyber-card overflow-hidden">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-cyan"></div>

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
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Product
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => setField('productId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-purple-500 focus:outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                  required
                >
                  <option value="">Select a product…</option>
                  {productList.map((p) => {
                    const pId = p._id || p.id
                    const qty = num(p.qty ?? p.quantity ?? p.stock ?? 0)
                    return (
                      <option key={pId} value={pId}>
                        {p.name} — {qty} in stock
                      </option>
                    )
                  })}
                </select>
              </div>

              {selectedProduct && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Current quantity:{' '}
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {num(selectedProduct.qty ?? selectedProduct.quantity ?? selectedProduct.stock ?? 0)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{selectedProduct.status || ''}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setField('type', 'Stock In')}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                      form.type === 'Stock In'
                        ? 'border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    + Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setField('type', 'Stock Out')}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                      form.type === 'Stock Out'
                        ? 'border-rose-500/50 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    − Stock Out
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={form.quantity}
                  onChange={(e) => setField('quantity', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-purple-500 focus:outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Reason
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => setField('reason', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-purple-500 focus:outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                >
                  {ADJUSTMENT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Add details about this stock adjustment…"
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-purple-500 focus:outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
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
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#7F22FE] text-white hover:bg-[#7016ea] dark:bg-neon-purple font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Apply Adjustment'
                  )}
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
