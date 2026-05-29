import React, { useState } from 'react'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  CubeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { products } from '../../Database/data.json'

// const products = [
//   { id: 1, name: 'Bluetooth Headphones Pro', brand: 'SoundTech Co.', sku: 'SKU-1001', category: 'Electronics', unitCost: 89.99, unitPrice: 159.99, qty: 243, status: 'In Stock' },
//   { id: 2, name: 'USB-C Hub 7-Port', brand: 'ConnectPro Ltd.', sku: 'SKU-1002', category: 'Accessories', unitCost: 34.50, unitPrice: 69.99, qty: 18, status: 'Low Stock' },
//   { id: 3, name: 'Wireless Ergonomic Mouse', brand: 'HID Solutions', sku: 'SKU-1003', category: 'Peripherals', unitCost: 42.00, unitPrice: 89.99, qty: 0, status: 'Out of Stock' },
//   { id: 4, name: 'Mechanical Keyboard TKL', brand: 'KeyCraft Inc.', sku: 'SKU-1004', category: 'Peripherals', unitCost: 119.00, unitPrice: 219.00, qty: 67, status: 'In Stock' },
//   { id: 5, name: 'LED Desk Lamp Smart', brand: 'LumiTech', sku: 'SKU-1005', category: 'Lighting', unitCost: 45.00, unitPrice: 89.99, qty: 112, status: 'In Stock' },
//   { id: 6, name: 'HDMI Cable 2m Braided', brand: 'LinkSpeed', sku: 'SKU-1006', category: 'Cables', unitCost: 8.50, unitPrice: 19.99, qty: 5, status: 'Low Stock' },
//   { id: 7, name: 'USB-A to USB-C Adapter', brand: 'ConnectPro Ltd.', sku: 'SKU-1007', category: 'Accessories', unitCost: 5.99, unitPrice: 14.99, qty: 340, status: 'In Stock' },
//   { id: 8, name: 'Thunderbolt 4 Cable 1m', brand: 'LinkSpeed', sku: 'SKU-1008', category: 'Cables', unitCost: 22.00, unitPrice: 49.99, qty: 0, status: 'Out of Stock' },
//   { id: 9, name: '4K Webcam Ultra HD', brand: 'VisionPro', sku: 'SKU-1009', category: 'Electronics', unitCost: 95.00, unitPrice: 199.99, qty: 28, status: 'In Stock' },
//   { id: 10, name: 'Ring Light 12-inch', brand: 'LumiTech', sku: 'SKU-1010', category: 'Lighting', unitCost: 29.99, unitPrice: 59.99, qty: 9, status: 'Low Stock' },
// ]

const categories = ['All', 'Electronics', 'Accessories', 'Peripherals', 'Cables', 'Lighting']

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

// console.log(products)

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory
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

          {/* Add Product Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-purple hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add Product
          </button>
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
                placeholder="Search by name or SKU..."
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

            {/* Filter Button */}
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-default">
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pl-2 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 text-right font-semibold">Unit Cost</th>
                  <th className="pb-3 text-right font-semibold ">Unit Price</th>
                  <th className="pb-3 text-center font-semibold">Qty</th>
                  <th className="pb-3 text-center font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30 text-sm">
                {filteredProducts.map((product) => {
                  const catStyle = categoryColors[product.category] || {
                    bg: 'bg-slate-100 dark:bg-slate-800/60',
                    text: 'text-slate-600 dark:text-slate-350',
                  }

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                    >
                      {/* Product Name */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              product.status === 'Out of Stock'
                                ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                                : product.status === 'Low Stock'
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
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 text-xs font-mono text-slate-500 dark:text-slate-450">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Unit Cost */}
                      <td className="py-4 text-right text-sm text-slate-600 dark:text-slate-400 font-medium">
                        ${product.unitCost}
                      </td>

                      {/* Unit Price */}
                      <td className="py-4 text-right text-sm text-slate-800 dark:text-slate-200 font-bold">
                        ${product.unitPrice}
                      </td>

                      {/* Qty */}
                      <td className="py-4 text-center">
                        <span
                          className={`font-extrabold text-sm ${
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

                      {/* Status */}
                      <td className="py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            product.status === 'In Stock'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : product.status === 'Low Stock'
                              ? 'bg-amber-50 text-amber-700 border-amber-100/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                              : 'bg-rose-50 text-rose-700 border-rose-100/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
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

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-cyan hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-default">
                            <PencilSquareIcon className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-default">
                            <TrashIcon className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                         
                        </div>
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

          {/* Table Footer / Summary */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Showing <span className="font-bold text-slate-600 dark:text-slate-300">{filteredProducts.length}</span> of{' '}
                <span className="font-bold text-slate-600 dark:text-slate-300">{products.length}</span> products
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {products.filter((p) => p.status === 'In Stock').length} In Stock
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  {products.filter((p) => p.status === 'Low Stock').length} Low Stock
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  {products.filter((p) => p.status === 'Out of Stock').length} Out of Stock
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Products