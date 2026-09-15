import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'

import {
  getProducts,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from '../../api/inventory.api'

const initialEditState = {
  name: '',
  brand: '',
  category: '',
  unitCost: '',
  unitPrice: '',
  quantity: '',
}

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState(null)

  // Edit & Delete States
  const [openEdit, setOpenEdit] = useState(null)
  const [editProducts, setEditProducts] = useState(initialEditState)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }

  const fetchProductsList = async () => {
    setIsLoading(true)
    try {
      const response = await getProducts()
      if (response && !response.error) {
        let items = []
        if (Array.isArray(response)) {
          items = response
        } else if (response?.products && Array.isArray(response.products)) {
          items = response.products
        } else if (response?.data && Array.isArray(response.data)) {
          items = response.data
        } else if (response?.items && Array.isArray(response.items)) {
          items = response.items
        }
        setProducts(items)
      } else {
        showFeedback('error', response?.error || 'Failed to fetch inventory products.')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Error fetching products from server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsList()
  }, [])

  // Safely derive status without throwing errors if status is omitted in API response
  const getProductStatus = (p) => {
    if (p?.status) return p.status
    const qty = Number(p?.qty ?? p?.quantity ?? p?.stock ?? 0)
    if (qty <= 0) return 'Out of Stock'
    if (qty <= 10) return 'Low Stock'
    return 'In Stock'
  }

  const statusStyles = (status) => {
    const normalized = (status || '').toLowerCase()

    if (normalized === 'out of stock') {
      return 'bg-rose-50 text-rose-700 border-rose-100/70 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
    }

    if (normalized === 'low stock') {
      return 'bg-amber-50 text-amber-700 border-amber-100/70 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
    }

    return 'bg-emerald-50 text-emerald-700 border-emerald-100/70 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
  }

  const statusDot = (status) => {
    const normalized = (status || '').toLowerCase()

    if (normalized === 'out of stock') return 'bg-rose-500'
    if (normalized === 'low stock') return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  // Filtered Lists & Derived Metrics
  const inStock = products.filter((p) => getProductStatus(p).toLowerCase() === 'in stock')
  const lowStock = products.filter((p) => getProductStatus(p).toLowerCase() === 'low stock')
  const outOfStock = products.filter((p) => getProductStatus(p).toLowerCase() === 'out of stock')
  const alerts = products.filter((p) => {
    const st = getProductStatus(p).toLowerCase()
    return st === 'low stock' || st === 'out of stock'
  })

  const displayedProducts = products.filter((p) => {
    const nameMatch = (p.name || '').toLowerCase().includes(search.toLowerCase())
    const brandMatch = (p.brand || '').toLowerCase().includes(search.toLowerCase())
    const categoryMatch = (p.category || '').toLowerCase().includes(search.toLowerCase())
    const matchesSearch = nameMatch || brandMatch || categoryMatch

    const status = getProductStatus(p).toLowerCase()
    const matchesTab = activeTab === 'All' || status === activeTab.toLowerCase()
    return matchesSearch && matchesTab
  })

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / itemsPerPage))
  const firstProductIndex = displayedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage
  const lastProductIndex = Math.min(currentPage * itemsPerPage, displayedProducts.length)
  const paginatedProducts = displayedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page) => {
    setCurrentPage(page)
    setOpenEdit(null)
  }

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name || 'this product' })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: '' })
  }

  const confirmDelete = async () => {
    const { productId } = deleteModal
    if (!productId) return

    setDeletingId(productId)
    try {
      const response = await apiDeleteProduct(productId)
      if (response && !response.error) {
        showFeedback('success', 'Product deleted successfully!')
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId))
        if (openEdit === productId) setOpenEdit(null)
      } else {
        showFeedback('error', response?.error || 'Failed to delete product.')
      }
    } catch (error) {
      showFeedback('error', error?.message || 'Error deleting product.')
    } finally {
      setDeletingId(null)
      closeDeleteModal()
    }
  }

  const handleStartEdit = (p) => {
    const pId = p._id || p.id
    if (openEdit === pId) {
      setOpenEdit(null)
      return
    }

    setOpenEdit(pId)
    setEditProducts({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || '',
      unitCost: p.unitCost ?? '',
      unitPrice: p.unitPrice ?? '',
      quantity: p.quantity ?? p.qty ?? p.stock ?? '',
    })
  }

  const handleSaveEdit = async (id) => {
    if (!id) return
    if (!editProducts.name.trim()) {
      showFeedback('error', 'Product name is required.')
      return
    }
    setIsUpdating(true)
    try {
      const payload = {
        name: editProducts.name.trim(),
        brand: editProducts.brand.trim(),
        category: editProducts.category.trim() || 'General',
        unitCost: editProducts.unitCost ? Number(editProducts.unitCost) : 0,
        unitPrice: editProducts.unitPrice ? Number(editProducts.unitPrice) : 0,
        quantity: editProducts.quantity !== '' ? Number(editProducts.quantity) : 0,
        qty: editProducts.quantity !== '' ? Number(editProducts.quantity) : 0,
      }

      const response = await apiUpdateProduct(id, payload)
      if (response && !response.error) {
        showFeedback('success', 'Product updated successfully!')
        setOpenEdit(null)
        await fetchProductsList()
      } else {
        showFeedback('error', response?.error || 'Failed to update product.')
      }
    } catch (error) {
      showFeedback('error', error?.message || 'Error updating product.')
    } finally {
      setIsUpdating(false)
    }
  }

  const totalStockValue = products.reduce((sum, p) => {
    const price = Number(p.unitPrice || p.price || 0)
    const qty = Number(p.qty ?? p.quantity ?? p.stock ?? 0)
    return sum + price * qty
  }, 0)

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Toast Feedback */}
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

        {/* Top Header & Global Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Inventory</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Manage product stock levels, alerts, and catalogue items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/add-products">
              <button className="px-4 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-bold flex items-center gap-2 shadow-[0_8px_18px_rgba(124,31,255,0.22)] hover:bg-[#6D28D9] transition-colors dark:bg-neon-purple dark:hover:bg-neon-purple/90 dark:shadow-[0_0_18px_rgba(189,0,255,0.28)] text-sm">
                <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
                <span>Add New Product</span>
              </button>
            </Link>

            <button
              onClick={fetchProductsList}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
              <span>Refresh</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              <ArchiveBoxIcon className="w-4 h-4 text-[#7C3AED] dark:text-neon-cyan" />
              <span>${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Stock Value</span>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">
          {/* Product Catalogue Table & Cards Column */}
          <div className="lg:col-span-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

            <div className="flex flex-col gap-6">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Inventory</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Showing {displayedProducts.length} of {products.length} total products
                  </p>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search name, brand, category..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#F1F5F9]/60 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-150/30 dark:border-slate-800/60 flex-wrap">
                  {[
                    { label: 'All', count: products.length },
                    { label: 'In Stock', count: inStock.length },
                    { label: 'Low Stock', count: lowStock.length },
                    { label: 'Out of Stock', count: outOfStock.length },
                  ].map(({ label, count }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setActiveTab(label)
                        setCurrentPage(1)
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        activeTab === label
                          ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/25 dark:bg-neon-purple/20 dark:text-neon-cyan dark:border-neon-cyan/30'
                          : 'text-slate-500 dark:text-slate-400 border border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / List Body */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <ArrowPathIcon className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
                  <p className="text-sm font-medium">Loading inventory from server...</p>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 mb-3">
                    <CubeIcon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">No products found</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                    {search ? `No products matching "${search}".` : 'No inventory items match the selected filter tab.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full mt-1">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Product Name</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-center">Qty</th>
                        <th className="pb-3 text-right">Unit Cost</th>
                        <th className="pb-3 text-right">Unit Price</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-sm">
                      {paginatedProducts.map((p) => {
                        const itemId = p._id || p.id
                        const status = getProductStatus(p)
                        const isItemOpen = openEdit === itemId
                        const isDeleting = deletingId === itemId
                        const quantity = p.qty ?? p.quantity ?? p.stock ?? 0

                        return (
                          <React.Fragment key={itemId || Math.random()}>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                              {/* Product Name & Brand */}
                              <td className="py-4 pl-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-50 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400">
                                    <CubeIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                      {p.name}
                                    </h4>
                                    {p.brand && (
                                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                                        {p.brand}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-4">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] dark:bg-slate-800/60 dark:text-slate-300">
                                  {p.category || 'General'}
                                </span>
                              </td>

                              {/* Qty */}
                              <td className="py-4 text-center">
                                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                                  {quantity}
                                </span>
                              </td>

                              {/* Unit Cost */}
                              <td className="py-4 text-right">
                                <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                                  ${Number(p.unitCost || 0).toFixed(2)}
                                </span>
                              </td>

                              {/* Unit Price */}
                              <td className="py-4 text-right">
                                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                  ${Number(p.unitPrice || 0).toFixed(2)}
                                </span>
                              </td>

                              {/* Status Badge */}
                              <td className="py-4 text-center">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles(
                                    status
                                  )}`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot(status)}`}></span>
                                  {status}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 text-right pr-2">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    className={`p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-cyan hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ${
                                      isItemOpen ? 'ring-2 ring-[#7C3AED]/40' : ''
                                    }`}
                                    title="Edit Product"
                                  >
                                    <PencilSquareIcon className="w-4 h-4" strokeWidth={2} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(itemId, p.name)}
                                    disabled={isDeleting}
                                    className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                                    title="Delete Product"
                                  >
                                    {isDeleting ? (
                                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <TrashIcon className="w-4 h-4" strokeWidth={2} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded Inline Edit Form */}
                            {isItemOpen && (
                              <tr>
                                <td colSpan={7} className="bg-slate-50/80 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-800">
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                      Edit Product Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Product Name
                                        </label>
                                        <input
                                          type="text"
                                          value={editProducts.name}
                                          onChange={(e) => setEditProducts({ ...editProducts, name: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Brand
                                        </label>
                                        <input
                                          type="text"
                                          value={editProducts.brand}
                                          onChange={(e) => setEditProducts({ ...editProducts, brand: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Category
                                        </label>
                                        <input
                                          type="text"
                                          value={editProducts.category}
                                          onChange={(e) => setEditProducts({ ...editProducts, category: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Unit Cost ($)
                                        </label>
                                        <input
                                          type="number"
                                          value={editProducts.unitCost}
                                          onChange={(e) => setEditProducts({ ...editProducts, unitCost: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Unit Price ($)
                                        </label>
                                        <input
                                          type="number"
                                          value={editProducts.unitPrice}
                                          onChange={(e) => setEditProducts({ ...editProducts, unitPrice: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                          Quantity
                                        </label>
                                        <input
                                          type="number"
                                          value={editProducts.quantity}
                                          onChange={(e) => setEditProducts({ ...editProducts, quantity: e.target.value })}
                                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => setOpenEdit(null)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(itemId)}
                                        disabled={isUpdating}
                                        className="px-4 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 dark:bg-neon-purple flex items-center gap-1.5"
                                      >
                                        {isUpdating ? (
                                          <>
                                            <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                                            Saving...
                                          </>
                                        ) : (
                                          'Save changes'
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {displayedProducts.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/70">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Showing <span className="font-bold text-slate-700 dark:text-slate-300">{firstProductIndex + 1}</span> to{' '}
                    <span className="font-bold text-slate-700 dark:text-slate-300">{lastProductIndex}</span> of{' '}
                    <span className="font-bold text-slate-700 dark:text-slate-300">{displayedProducts.length}</span> products
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60"
                      aria-label="Previous page"
                    >
                      <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.5} />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`h-9 min-w-9 rounded-xl px-3 text-xs font-extrabold transition-colors ${
                          currentPage === page
                            ? 'bg-[#7C3AED] text-white shadow-[0_6px_14px_rgba(124,31,255,0.22)] dark:bg-neon-purple dark:shadow-[0_0_14px_rgba(189,0,255,0.28)]'
                            : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60'
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-400 dark:hover:bg-slate-900/60"
                      aria-label="Next page"
                    >
                      <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stock Alerts Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-45 dark:opacity-60 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" strokeWidth={2} />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Stock Alerts</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                {alerts.length} active
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                All inventory items are currently well-stocked. No low stock alerts active.
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((p) => {
                  const itemId = p._id || p.id
                  const status = getProductStatus(p)
                  const quantity = p.qty ?? p.quantity ?? p.stock ?? 0
                  const isOutOfStock = status.toLowerCase() === 'out of stock'

                  return (
                    <div
                      key={itemId || Math.random()}
                      className="p-4 rounded-2xl bg-slate-50/40 border border-slate-100 dark:bg-slate-900/20 dark:border-slate-800/60"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{p.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-slate-400">{p.category || 'General'}</span>
                            <span className="text-[10px] font-bold text-slate-400">·</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles(status)}`}>
                              <span className={`h-1 w-1 rounded-full ${statusDot(status)}`}></span>
                              {status}
                            </span>
                          </div>
                        </div>

                        {isOutOfStock ? (
                          <XCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0" strokeWidth={2} />
                        ) : (
                          <span className="text-base font-extrabold text-amber-500 flex-shrink-0">{quantity}</span>
                        )}
                      </div>

                      {/* Progress indicator for low stock */}
                      {!isOutOfStock && (
                        <div className="mt-3.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                            <span>Stock status</span>
                            <span>{quantity} left</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (quantity / 10) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Global Delete Confirmation Modal Portaled to document.body */}
        {deleteModal.isOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md dark:bg-slate-950/70 select-none">
              <div className="bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <ExclamationTriangleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delete Product</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200">{deleteModal.productName}</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deletingId !== null}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deletingId !== null}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors dark:bg-rose-500 dark:hover:bg-rose-600 shadow-md flex items-center gap-2"
                  >
                    {deletingId !== null ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Product'
                    )}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  )
}

export default Inventory
