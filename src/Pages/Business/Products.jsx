import React, { useState } from 'react'
import { useTheme } from '../../Context/ThemeContext'

const initialProducts = [
  { id: 1, name: 'Business Starter Kit', sku: 'BSK-001', price: 299, stock: 42, status: 'in stock' },
  { id: 2, name: 'Enterprise License', sku: 'ENT-001', price: 1299, stock: 8, status: 'in stock' },
  { id: 3, name: 'Analytics Add-on', sku: 'ANA-001', price: 149, stock: 3, status: 'low stock' },
  { id: 4, name: 'API Access Module', sku: 'API-001', price: 499, stock: 0, status: 'out of stock' },
  { id: 5, name: 'Team Collaboration', sku: 'TEM-001', price: 799, stock: 15, status: 'in stock' },
];

const getStatusStyle = (status) => {
  const s = status.toLowerCase();
  if (s === 'in stock') {
    return {
      light: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dark: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
    };
  }
  if (s === 'low stock') {
    return {
      light: 'bg-amber-50 text-amber-700 border border-amber-200',
      dark: 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
    };
  }
  return {
    light: 'bg-red-50 text-red-600 border border-red-200',
    dark: 'dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30',
  };
};

const getStatusLabel = (status) => {
  const s = status.toLowerCase();
  if (s === 'in stock') return 'In Stock';
  if (s === 'low stock') return 'Low Stock';
  return 'Out of Stock';
};

const getBarColor = (stock) => {
  if (stock === 0) return 'bg-slate-300 dark:bg-slate-600';
  if (stock <= 10) return 'bg-red-400 dark:bg-red-400';
  if (stock <= 30) return 'bg-amber-400 dark:bg-amber-400';
  return 'bg-neon-purple dark:bg-neon-cyan';
};

const Products = () => {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [productsList, setProductsList] = useState(initialProducts);

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

//   const maxStock = Math.max(...productsList.map(p => p.stock), 1);
const maxStock = 100

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Products &amp; Inventory
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} tracked
            </p>
          </div>

          <div className="flex items-center gap-3">
           

            {/* Add Product Button */}
           
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
          {/* Top glow line */}
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

          {/* Search */}
          <div className="relative max-w-md mb-6 group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50">
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Product</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">SKU</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Price</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Stock</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const statusStyle = getStatusStyle(product.status);
                    // const barWidth = maxStock > 0 ? Math.max((product.stock / maxStock) * 100, product.stock > 0 ? 8 : 0) : 0;
                    const percentage = maxStock > 0 ? Math.max((product.stock / maxStock)* 100 ) : 0;

const barWidth =
  percentage <= 20 ? 20 :
  percentage <= 40 ? 40 :
  percentage <= 60 ? 60 :
  percentage <= 80 ? 80 :
  percentage > 80 ? 100 :
  0;
                    const barColor = getBarColor(product.stock);

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors duration-200 group/row">
                        {/* PRODUCT */}
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-slate-100 border border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500 group-hover/row:border-neon-purple/30 dark:group-hover/row:border-neon-cyan/30">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                          </div>
                          <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors">
                            {product.name}
                          </span>
                        </td>

                        {/* SKU */}
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm font-mono">
                          {product.sku}
                        </td>

                        {/* PRICE */}
                        <td className="py-4 px-4 text-slate-800 dark:text-slate-100 font-bold text-sm font-mono">
                          ${product.price.toLocaleString()}
                        </td>

                        {/* STOCK */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                style={{ width: `${barWidth}%` }}
                              ></div>
                            </div>
                            {/* <meter min={0} max={100} value={product.stock} style={{ width: "80%" }} className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none
         [&::-webkit-meter-bar]:rounded-full 
         [&::-webkit-meter-bar]:bg-gray-200 
         [&::-webkit-meter-optimum-value]:rounded-full 
         [&::-webkit-meter-optimum-value]:bg-red-500
         [&::-moz-meter-bar]:rounded-full
         [&::-moz-meter-bar]:bg-blue-500" ></meter> */}
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-mono font-medium w-6 text-right">
                              {product.stock}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold font-mono ${statusStyle.light} ${statusStyle.dark}`}>
                            {getStatusLabel(product.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products