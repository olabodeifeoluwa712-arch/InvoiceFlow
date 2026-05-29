import React from 'react'
import { Link } from 'react-router-dom'
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownOnSquareIcon,
  PlusIcon,
  ArrowsUpDownIcon,

} from '@heroicons/react/24/outline'

import { useState } from 'react';
import { products } from '../../Database/data.json';


const totalInStock = products.filter(p => p.status.toLowerCase() === 'in stock').length;
const totalLowStock = products.filter(p => p.status.toLowerCase() === 'low stock').length;
const totalOutOfStock = products.filter(p => p.status.toLowerCase() === 'out of stock').length;
const activeAlertsCount = totalLowStock + totalOutOfStock;

const alerts = products.filter(p => p.status.toLowerCase() === 'low stock' || p.status.toLowerCase() === 'out of stock');

const Inventory = () => {
  
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [product, setProducts] = useState({id: '', name: '', brand: '', sku: '', category: '', unitCost: '', unitPrice: '', qty: '', status: ''});
  const [editProducts, setEditProducts] = useState({id: '', name: '', brand: '', sku: '', category: '', unitCost: '', unitPrice: '', qty: '', status: ''});

  const displayedProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const inStock = products.filter(p => p.status.toLowerCase() === "in stock");
  const lowStock = products.filter(p => p.status.toLowerCase() === "low stock");
  const outOfStock = products.filter(p => p.status.toLowerCase() === "out of stock");

  //get status color. in stock = green, low stock = amber, out of stock = red
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20';
      case 'low stock':
        return 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
      case 'out of stock':
        return 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20';
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60';
    }
  }

  const countInstock = inStock.reduce((a,b) => a + b.stock, 0)
  const countLowStock = lowStock.reduce((a,b) => a + b.stock, 0)
  const countOutOfStock = outOfStock.reduce((a,b) => a + b.stock, 0)

  const deleteProduct = async (id) => {
  await fetch(`http://localhost:3001/products/${id}`, {
    method: 'DELETE'
  });

  setProducts(prev =>
    prev.filter(product => product.id !== id)
  );
};

const editProduct = async (id) => {
  await fetch(`http://localhost:3001/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: editProducts.id,
      name: editProducts.name,
      brand: editProducts.brand,
      sku: editProducts.sku,
      category: editProducts.category,
      unitCost: editProducts.unitCost,
      unitPrice: editProducts.unitPrice,
      qty: editProducts.qty,
      status: editProducts.status
    })
  });

 
};

  
  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      {/* Background blurs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">

          <Link to="/add-products" > 
            <button className="px-4 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-bold flex items-center gap-2 shadow-[0_8px_18px_rgba(124,31,255,0.22)] dark:shadow-[0_0_18px_rgba(189,0,255,0.28)] text-sm cursor-default dark:bg-neon-purple">
          <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
            <span>Add New Product</span>
          </button>
          </Link>

          <button className="px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm text-sm flex items-center gap-2 cursor-default">
            <ArrowsUpDownIcon className="w-4 h-4" strokeWidth={2} />
            <span>Adjust Stock Manually</span>
          </button>

          <button className="px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm text-sm flex items-center gap-2 cursor-default">
            <ArrowDownOnSquareIcon className="w-4 h-4" strokeWidth={2} />
            <span>Receive Stock (Goods In)</span>
          </button>

          <button className="px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm text-sm flex items-center gap-2 cursor-default">
            <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={2} />
            <span>Export Inventory Data</span>
          </button>

        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">

          {/* Left: Product Table */}
          <div className="lg:col-span-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

            <div className="flex flex-col gap-6">

              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Inventory</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{displayedProducts.length} of {products.length} products</p>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Search Input */}
                <div className="relative w-full sm:w-48 flex-shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}

                    className="w-full pl-9 pr-4 py-2 text-xs text-slate-650 bg-slate-50 border border-slate-150/40 rounded-xl outline-none dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500"

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
                      onClick={() => setActiveTab(label)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === label
                          ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/25 dark:bg-neon-purple/20 dark:text-neon-cyan dark:border-neon-cyan/30'
                          : 'text-slate-500 dark:text-slate-400 border border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {label} {count}
                    </button>
                  ))}
                </div>

                <button className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-cyber-card rounded-xl p-2 text-slate-500 dark:text-slate-400 cursor-default">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                </button>

              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full mt-2">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Product</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-center">Reorder</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850/30 text-sm">
                    {displayedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">

                        {/* Product */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              getStatusColor(product.status)
                            }`}>
                              <CubeIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{product.name}</h4>
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{product.brand}</span>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-4 text-xs font-mono text-slate-500 dark:text-slate-450">
                          {product.sku}
                        </td>

                        {/* Category */}
                        <td className="py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5] dark:bg-slate-800/60 dark:text-slate-350">
                            {product.category}
                          </span>
                        </td>

                        {/* Qty */}
                        <td className="py-4 text-center">
                          <span className={`font-extrabold text-sm ${
                           getStatusColor(product.status)
                          }`}>
                            {product.stock}
                          </span>
                        </td>

                        {/* Reorder */}
                        <td className="py-4 text-center font-semibold text-slate-400 dark:text-slate-500">
                          {product.reorder}
                        </td>

                        {/* Status */}
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                            getStatusColor(product.status)
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                             product.status.toLowerCase() === 'in stock' ? 'bg-emerald-500 dark:bg-emerald-400' :
                             product.status.toLowerCase() === 'low stock' ? 'bg-amber-500 dark:bg-amber-400' :
                             product.status.toLowerCase() === 'out of stock' ? 'bg-rose-500 dark:bg-rose-400' :
                             'bg-slate-400 dark:bg-slate-500'
                            }`}></span>
                            <span className="capitalize">{product.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-cyan cursor-default">
                              <PencilSquareIcon className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                            <button className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-rose-500 dark:text-rose-400 cursor-default">
                              <TrashIcon className="w-3.5 h-3.5" strokeWidth={2} onClick={() => deleteProduct(product.id)}/>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Right: Stock Alerts */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-45 dark:opacity-60 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" strokeWidth={2} />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Stock Alerts</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                {activeAlertsCount} active
              </span>
            </div>

            <div className="space-y-4">
              {alerts.map((product) => (
                <div key={product.id} className="p-4 rounded-2xl bg-slate-50/40 border border-slate-100 dark:bg-slate-900/10 dark:border-slate-850/60">

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm leading-snug">{product.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{product.sku}</span>
                        <span className="text-[10px] font-bold text-slate-400">·</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          getStatusColor(product.status)
                        }`}>
                          {product.status === 'out of stock' ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </div>
                    </div>

                    {product.status === 'out of stock' ? (
                      <XCircleIcon className="w-5 h-5 text-rose-500" strokeWidth={2} />
                    ) : (
                      <span className="text-base font-extrabold text-amber-500">{product.stock}</span>
                    )}
                  </div>

                  {/* Progress bar for low stock */}
                  {product.status === 'low stock' && (
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                        <span>Reorder level: {product.reorder}</span>
                        <span>{Math.round((product.stock / product.reorder) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (product.stock / product.reorder) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Static Action Buttons */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-150/20 dark:border-slate-850/20">
                    {product.status === 'out of stock' ? (
                      <>
                        <button className="flex-1 py-1.5 rounded-xl text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-100/50 text-center dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 cursor-default">
                          Adjust Stock
                        </button>
                        <button className="flex-1 py-1.5 rounded-xl text-[11px] font-extrabold text-slate-700 bg-white border border-slate-200/50 text-center dark:bg-slate-950/25 dark:text-slate-350 dark:border-slate-800 cursor-default">
                          Create PO
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 py-1.5 rounded-xl text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100/50 text-center dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200 dark:hover:bg-amber-500/25 dark:hover:text-amber-300 transition-colors cursor-default">
                          Restock
                        </button>
                        <button className="flex-1 py-1.5 rounded-xl text-[11px] font-extrabold text-slate-700 bg-white border border-slate-200/50 text-center dark:bg-slate-950/25 dark:text-slate-350 dark:border-slate-800 hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] hover:border-[#7C3AED]/25 dark:hover:bg-neon-cyan/15 dark:hover:text-neon-cyan dark:hover:border-neon-cyan/30 transition-colors cursor-default">
                          Adjust
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Inventory
