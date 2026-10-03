import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
} from '@heroicons/react/24/outline'
import {
  getProducts,
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from '../../api/inventory.api'

const initialProductState = {
  name: '',
  brand: '',
  category: '',
  unitCost: '',
  unitPrice: '',
  quantity: '',
}

const AddProducts = () => {
  const [product, setProduct] = useState(initialProductState)
  const [editProducts, setEditProducts] = useState(initialProductState)
  const [openEdit, setOpenEdit] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' })
  const [feedback, setFeedback] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage))
  const firstProductIndex = products.length === 0 ? 0 : (currentPage - 1) * itemsPerPage
  const lastProductIndex = Math.min(currentPage * itemsPerPage, products.length)
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        showFeedback('error', response?.error || 'Failed to fetch products')
      }
    } catch (err) {
      showFeedback('error', err?.message || 'Error loading products from server')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsList()
  }, [])

  const goToPage = (page) => {
    setCurrentPage(page)
    setOpenEdit(null)
  }

  const fields = [
    { key: 'name', label: 'Product name', type: 'text', placeholder: 'Bluetooth Headphones Pro', required: true },
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'SoundTech Co.' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Electronics' },
    { key: 'unitCost', label: 'Unit cost ($)', type: 'number', placeholder: '89.99' },
    { key: 'unitPrice', label: 'Unit price ($)', type: 'number', placeholder: '159.99' },
    { key: 'quantity', label: 'Quantity', type: 'number', placeholder: '243' },
  ]

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

  const handleAdd = async (e) => {
    e?.preventDefault()
    if (!product.name.trim()) {
      showFeedback('error', 'Please provide a product name.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: product.name.trim(),
        brand: product.brand.trim(),
        category: product.category.trim() || 'General',
        unitCost: product.unitCost ? Number(product.unitCost) : 0,
        unitPrice: product.unitPrice ? Number(product.unitPrice) : 0,
        quantity: product.quantity !== '' ? Number(product.quantity) : 0,
      }

      const response = await apiAddProduct(payload)
      if (response && !response.error) {
        showFeedback('success', 'Product added successfully!')
        setProduct(initialProductState)
        await fetchProductsList()
      } else {
        showFeedback('error', response?.error || 'Failed to add product.')
      }
    } catch (error) {
      showFeedback('error', error?.message || 'Error occurred while adding product.')
    } finally {
      setIsSubmitting(false)
    }
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
      showFeedback('error', error?.message || 'Error occurred while deleting product.')
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
      quantity: p.quantity ?? '',
    })
  }

  const handleSaveEdit = async (id) => {
    if (!id) return
    if (!editProducts.name.trim()) {
      showFeedback('error', 'Product name cannot be empty.')
      return
    }
    setIsUpdating(true)
    try {
      const payload = {
        name: editProducts.name.trim(),
        brand: editProducts.brand.trim(),
        category: editProducts.category.trim(),
        unitCost: editProducts.unitCost ? Number(editProducts.unitCost) : 0,
        unitPrice: editProducts.unitPrice ? Number(editProducts.unitPrice) : 0,
        qty: editProducts.qty !== '' ? Number(editProducts.qty) : 0,
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
      showFeedback('error', error?.message || 'Error occurred while updating product.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Notification Feedback */}
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

        {/* Page Title & Stats */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Add Product</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create inventory items and manage catalogue records</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProductsList}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh inventory"
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              <ArchiveBoxIcon className="w-4 h-4 text-[#7C3AED] dark:text-neon-cyan" />
              {products.length} products
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Add Product Form */}
          <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-neon-purple/15 dark:text-neon-cyan">
                <PlusIcon className="w-5 h-5" strokeWidth={2.4} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Product details</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Fill the fields below to add stock</p>
              </div>
            </div>

            <form onSubmit={handleAdd}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <label key={field.key} className={field.key === 'name' ? 'sm:col-span-2' : ''}>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </span>
                    <input
                      placeholder={field.placeholder}
                      type={field.type}
                      value={product[field.key]}
                      onChange={(e) => setProduct({ ...product, [field.key]: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm text-slate-700 bg-slate-50/70 border border-slate-200/60 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full px-4 py-3 rounded-2xl bg-[#7C3AED] text-white font-bold flex items-center justify-center gap-2 shadow-[0_8px_18px_rgba(124,31,255,0.22)] hover:bg-[#6D28D9] transition-colors disabled:opacity-60 dark:bg-neon-purple dark:hover:bg-neon-purple/90 dark:shadow-[0_0_18px_rgba(189,0,255,0.28)]"
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
                    Add Product
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Product Catalogue List */}
          <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Product catalogue</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review, edit, or delete existing products</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
                <p className="text-sm font-medium">Loading inventory from server...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 mb-3">
                  <ArchiveBoxIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300">No products found</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                  Your inventory catalogue is currently empty. Use the form on the left to add your first product.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedProducts.map((p) => {
                  const itemId = p._id || p.id
                  const isItemOpen = openEdit === itemId
                  const isDeleting = deletingId === itemId
                  const status = p.status

                  return (
                    <div
                      key={itemId || Math.random()}
                      className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-900/20 dark:hover:bg-slate-900/40"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-50 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400">
                            <CubeIcon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{p.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {p.brand && <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{p.brand}</span>}
                              {p.category && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] dark:bg-slate-800/60 dark:text-slate-300">
                                  {p.category}
                                </span>
                              )}
                              {(p.qty !== undefined || p.quantity !== undefined || p.stock !== undefined) && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                  Qty: {p.qty ?? p.quantity ?? p.stock}
                                </span>
                              )}
                              {p.unitPrice && (
                                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                                  ${Number(p.unitPrice).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles(
                              status
                            )}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusDot(status)}`}></span>
                            {status}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDeleteModal(itemId, p.name)}
                              disabled={isDeleting}
                              className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                              aria-label={`Delete ${p.name}`}
                              title="Delete product"
                            >
                              {isDeleting ? (
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                              ) : (
                                <TrashIcon className="w-4 h-4" strokeWidth={2} />
                              )}
                            </button>

                            <button
                              onClick={() => handleStartEdit(p)}
                              className={`p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-cyan hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ${
                                isItemOpen ? 'ring-2 ring-[#7C3AED]/40' : ''
                              }`}
                              aria-label={`Edit ${p.name}`}
                              title="Edit product"
                            >
                              <PencilSquareIcon className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Edit Form for this product */}
                      {isItemOpen && (
                        <div className="relative z-20 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/70">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Edit Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {fields.map((field) => (
                              <div key={field.key} className={field.key === 'name' ? 'sm:col-span-2 lg:col-span-1' : ''}>
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{field.label}</label>
                                <input
                                  placeholder={field.label.toLowerCase()}
                                  type={field.type}
                                  value={editProducts[field.key]}
                                  onChange={(e) => setEditProducts({ ...editProducts, [field.key]: e.target.value })}
                                  className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setOpenEdit(null)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(itemId)}
                              disabled={isUpdating}
                              className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 dark:bg-neon-purple flex items-center gap-1.5"
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
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {products.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/70">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Showing <span className="font-bold text-slate-700 dark:text-slate-300">{firstProductIndex + 1}</span> to{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{lastProductIndex}</span> of{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{products.length}</span> products
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

        {/* Delete Confirmation Modal */}
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

export default AddProducts
