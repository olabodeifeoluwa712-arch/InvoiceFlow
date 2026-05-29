import React from 'react'
import { useState, useEffect } from 'react'
import {
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { products } from '../../Database/data.json'

// { id: 10, name: 'Ring Light 12-inch', brand: 'LumiTech', sku: 'SKU-1010', category: 'Lighting', unitCost: 29.99, unitPrice: 59.99, qty: 9, status: 'Low Stock' },

const addProducts = () => {
    const [product, setProducts] = useState({id: '', name: '', brand: '', sku: '', category: '', unitCost: '', unitPrice: '', qty: '', status: ''});
     const [editProducts, setEditProducts] = useState({id: '', name: '', brand: '', sku: '', category: '', unitCost: '', unitPrice: '', qty: '', status: ''});
    const [openEdit, setOpenEdit] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const firstProductIndex = (currentPage - 1) * itemsPerPage;
    const lastProductIndex = Math.min(currentPage * itemsPerPage, products.length);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToPage = (page) => {
      setCurrentPage(page);
      setOpenEdit(null);
    };
    
  const fields = [
    { key: 'name', label: 'Product name', type: 'text', placeholder: 'Bluetooth Headphones Pro' },
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'SoundTech Co.' },
    { key: 'sku', label: 'SKU', type: 'text', placeholder: 'SKU-1001' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Electronics' },
    { key: 'unitCost', label: 'Unit cost', type: 'number', placeholder: '89.99' },
    { key: 'unitPrice', label: 'Unit price', type: 'number', placeholder: '159.99' },
    { key: 'qty', label: 'Quantity', type: 'number', placeholder: '243' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      options: [
        { value: 'In Stock', label: 'In Stock' },
        { value: 'Low Stock', label: 'Low Stock' },
        { value: 'Out of Stock', label: 'Out of Stock' },
      ],
    },
  ];

  const statusStyles = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === 'out of stock') {
      return 'bg-rose-50 text-rose-700 border-rose-100/70 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
    }

    if (normalized === 'low stock') {
      return 'bg-amber-50 text-amber-700 border-amber-100/70 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    }

    return 'bg-emerald-50 text-emerald-700 border-emerald-100/70 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
  };

  const statusDot = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === 'out of stock') return 'bg-rose-500';
    if (normalized === 'low stock') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  useEffect(() => {

    const fetchProducts = async () => {
      const res = await fetch('http://localhost:3001/products');
      const data = await res.json();
      //setProducts(data);
      console.log(data);
    };
    fetchProducts();
  }, []);



  const add = async () => {
   
   
 fetch('http://localhost:3001/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: product.id,
    name: product.name,
    brand: product.brand,
    sku: product.sku,
    category: product.category,
    unitCost: product.unitCost,
    unitPrice: product.unitPrice,
    qty: product.qty,
    status: product.status
  })
  
})
  }

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
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Add Product</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create inventory items and manage catalogue records</p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
            <ArchiveBoxIcon className="w-4 h-4 text-[#7C3AED] dark:text-neon-cyan" />
            {products.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field) => (
                <label key={field.key} className={field.key === 'name' ? 'sm:col-span-2' : ''}>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{field.label}</span>
                  {field.type === 'select' ? (
                    <select
                      name={field.key}
                      id={field.key}
                      value={product[field.key]}
                      onChange={(e) => setProducts({...product, [field.key]: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm text-slate-700 bg-slate-50/70 border border-slate-200/60 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      placeholder={field.placeholder}
                      type={field.type}
                      value={product[field.key]}
                      onChange={(e) => setProducts({...product, [field.key]: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm text-slate-700 bg-slate-50/70 border border-slate-200/60 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                    />
                  )}
                </label>
              ))}
            </div>

            <button
              onClick={add}
              className="mt-6 w-full px-4 py-3 rounded-2xl bg-[#7C3AED] text-white font-bold flex items-center justify-center gap-2 shadow-[0_8px_18px_rgba(124,31,255,0.22)] hover:bg-[#6D28D9] transition-colors dark:bg-neon-purple dark:hover:bg-neon-purple/90 dark:shadow-[0_0_18px_rgba(189,0,255,0.28)]"
            >
              <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
              Add Product
            </button>
          </div>

          <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Product catalogue</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review, edit, or delete existing products</p>
              </div>
            </div>

            <div className="space-y-3">
              {paginatedProducts.map(product => (
                <div key={product.id} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800/70 dark:bg-slate-900/20 dark:hover:bg-slate-900/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-50 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400">
                        <CubeIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{product.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{product.brand}</span>
                          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{product.sku}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] dark:bg-slate-800/60 dark:text-slate-300">{product.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles(product.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot(product.status)}`}></span>
                        {product.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          aria-label={`Delete ${product.name}`}
                        >
                          <TrashIcon className="w-4 h-4" strokeWidth={2} />
                        </button>

                        <button
                          onClick={() => setOpenEdit(openEdit === product.id ? null : product.id)}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-cyber-card text-[#7C3AED] dark:text-neon-cyan hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                          aria-label={`Edit ${product.name}`}
                        >
                          <PencilSquareIcon className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {openEdit === product.id && (
                    <div className="relative z-50 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/70">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {fields.map((field) => (
                          field.type === 'select' ? (
                            <select
                              key={field.key}
                              name={`edit-${field.key}`}
                              value={editProducts[field.key]}
                              onChange={(e) => setEditProducts({...editProducts, [field.key]: e.target.value})}
                              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                            >
                              <option value="">{field.placeholder}</option>
                              {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              key={field.key}
                              placeholder={field.label.toLowerCase()}
                              type={field.type}
                              value={editProducts[field.key]}
                              onChange={(e) => setEditProducts({...editProducts, [field.key]: e.target.value})}
                              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
                            />
                          )
                        ))}
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => editProduct(product.id)}
                          className="px-4 py-2 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 text-sm font-bold hover:bg-[#7C3AED]/15 transition-colors dark:bg-neon-purple/15 dark:text-neon-cyan dark:border-neon-cyan/25"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  )
}

export default addProducts
