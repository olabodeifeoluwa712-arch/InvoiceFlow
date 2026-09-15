import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { getProducts } from '../../api/inventory.api'

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

const Products = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await getProducts()
      if (res && !res.error) {
        let items = []
        if (Array.isArray(res)) items = res
        else if (res.products && Array.isArray(res.products)) items = res.products
        else if (res.data && Array.isArray(res.data)) items = res.data
        else if (res.items && Array.isArray(res.items)) items = res.items
        setProducts(items)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])



  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'General')))]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === 'All' || (p.category || 'General') === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      {/* Background blurs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Products</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{products.length} products in your catalogue</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Catalogue"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Link to="/add-products">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white font-bold shadow-md hover:bg-[#6D28D9] dark:bg-neon-purple dark:hover:bg-neon-purple/90 transition-colors text-sm">
                <PlusIcon className="w-4 h-4" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

          {/* Search & Category Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Search Input */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-700 bg-slate-50/70 border border-slate-200/60 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)] dark:bg-neon-purple dark:shadow-[0_0_14px_rgba(189,0,255,0.28)]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-neon-cyan mb-3" />
              <p className="text-sm font-medium">Loading catalogue from API...</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pl-2 font-semibold">Product Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 text-right font-semibold">Unit Cost</th>
                    <th className="pb-3 text-right font-semibold">Unit Price</th>
                    <th className="pb-3 text-center font-semibold">Qty</th>
                    <th className="pb-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30 text-sm">
                  {filteredProducts.map((product) => {
                    const status = product.status || ''
                    const qty = product.qty ?? product.quantity ?? product.stock ?? 0
                    const categoryName = product.category || 'General'
                    const catStyle = categoryColors[categoryName] || {
                      bg: 'bg-slate-100 dark:bg-slate-800/60',
                      text: 'text-slate-600 dark:text-slate-350',
                    }

                    return (
                      <tr
                        key={product._id || product.id || Math.random()}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                      >
                        {/* Product Name */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                status === 'Out of Stock'
                                  ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                                  : status === 'Low Stock'
                                  ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400'
                                  : 'bg-indigo-50 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400'
                              }`}
                            >
                              <CubeIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                {product.name}
                              </h4>
                              {product.brand && (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {product.brand}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}
                          >
                            {categoryName}
                          </span>
                        </td>

                        {/* Unit Cost */}
                        <td className="py-4 text-right text-sm text-slate-600 dark:text-slate-400 font-medium">
                          ${Number(product.unitCost || 0).toFixed(2)}
                        </td>

                        {/* Unit Price */}
                        <td className="py-4 text-right text-sm text-slate-800 dark:text-slate-200 font-bold">
                          ${Number(product.unitPrice || 0).toFixed(2)}
                        </td>

                        {/* Qty */}
                        <td className="py-4 text-center">
                          <span
                            className={`font-extrabold text-sm ${
                              status === 'Out of Stock'
                                ? 'text-rose-500 dark:text-rose-400'
                                : status === 'Low Stock'
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {qty}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              status === 'In Stock'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : status === 'Low Stock'
                                ? 'bg-amber-50 text-amber-700 border-amber-100/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                : 'bg-rose-50 text-rose-700 border-rose-100/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                status === 'In Stock'
                                  ? 'bg-emerald-500'
                                  : status === 'Low Stock'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            ></span>
                            {status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4">
                    <CubeIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">No products found</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products