import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import {
  getProducts,
  addProduct,
} from '../../api/inventory.api';

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();

  if (s === 'in stock') {
    return {
      light: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dark: 'dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    };
  }

  if (s === 'low stock') {
    return {
      light: 'bg-amber-50 text-amber-700 border border-amber-200',
      dark: 'dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    };
  }

  return {
    light: 'bg-red-50 text-red-600 border border-red-200',
    dark: 'dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
};

const getStatusLabel = (status) => {
  const s = status?.toLowerCase();

  if (s === 'in stock') return 'In Stock';
  if (s === 'low stock') return 'Low Stock';

  return 'Out of Stock';
};

const getBarColor = (stock) => {
  if (stock === 0) return 'bg-slate-300 dark:bg-slate-600';
  if (stock <= 10) return 'bg-red-400 dark:bg-red-400';
  if (stock <= 30) return 'bg-amber-400 dark:bg-amber-400';

  return 'bg-[#7C3AED] dark:bg-purple-500';
};

const Products = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [addError, setAddError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    unitCost: '',
    unitPrice: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getProducts();

        const formattedProducts = response.products.map((product) => ({
          id: product._id,
          name: product.name,
          sku: product.sku,
          price: product.unitPrice ?? 0,
          stock: product.quantity ?? 0,
          status: product.status,
        }));

        setProductsList(formattedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load products. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = productsList.filter(
    (product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setAddingProduct(true);
      setAddError('');

      const data = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim() || undefined,
        unitCost: formData.unitCost
          ? Number(formData.unitCost)
          : undefined,
        unitPrice: formData.unitPrice
          ? Number(formData.unitPrice)
          : undefined,
        quantity: formData.quantity
          ? Number(formData.quantity)
          : 0,
      };

      const newProduct = await addProduct(data);

      setProductsList((prev) => [
        {
          id: newProduct._id,
          name: newProduct.name,
          sku: newProduct.sku,
          price: newProduct.unitPrice ?? 0,
          stock: newProduct.quantity ?? 0,
          status: newProduct.status,
        },
        ...prev,
      ]);

      setFormData({
        name: '',
        category: '',
        brand: '',
        unitCost: '',
        unitPrice: '',
        quantity: '',
      });

      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add product:', err);

      setAddError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to add product. Please try again.'
      );
    } finally {
      setAddingProduct(false);
    }
  };

  const maxStock = 100;

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* Background Glow */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />

      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:text-slate-100 transition-all duration-300">
              Products &amp; Inventory
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              {loading
                ? 'Loading products...'
                : `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? 's' : ''
                  } tracked`}
            </p>
          </div>

          {/* Add Product */}
          <button
            type="button"
            onClick={() => {
              setAddError('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm transition-all"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>

        </div>

        {/* Products Card */}
        <div className="bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">

          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-40 dark:opacity-60 transition-all duration-300" />

          {/* Search */}
          <div className="relative max-w-md mb-6 group">

            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#7C3AED] dark:group-focus-within:text-purple-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search products or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-[#7C3AED] focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-purple-500/30 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800">

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Product
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    SKU
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Price
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Stock
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Status
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium"
                    >
                      {search
                        ? 'No products match your search.'
                        : 'No products found.'}
                    </td>
                  </tr>

                ) : (

                  filteredProducts.map((product) => {

                    const statusStyle = getStatusStyle(product.status);

                    const percentage =
                      maxStock > 0
                        ? Math.min((product.stock / maxStock) * 100, 100)
                        : 0;

                    const barWidth =
                      percentage <= 20
                        ? 20
                        : percentage <= 40
                        ? 40
                        : percentage <= 60
                        ? 60
                        : percentage <= 80
                        ? 80
                        : 100;

                    const barColor = getBarColor(product.stock);

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors duration-200 group/row"
                      >

                        {/* Product */}
                        <td className="py-4 px-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-slate-100 border border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500 group-hover/row:border-purple-200 group-hover/row:text-[#7C3AED] dark:group-hover/row:border-purple-800 dark:group-hover/row:text-purple-400">

                              <svg
                                className="w-4.5 h-4.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>

                            </div>

                            <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm group-hover/row:text-[#7C3AED] dark:group-hover/row:text-purple-400 transition-colors">
                              {product.name}
                            </span>

                          </div>

                        </td>

                        {/* SKU */}
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm font-mono">
                          {product.sku}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 text-slate-800 dark:text-slate-100 font-bold text-sm font-mono">
                          ₦{product.price.toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4">

                          <div className="flex items-center gap-3">

                            <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">

                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                style={{
                                  width: `${barWidth}%`,
                                }}
                              />

                            </div>

                            <span className="text-slate-700 dark:text-slate-300 text-sm font-mono font-medium w-6 text-right">
                              {product.stock}
                            </span>

                          </div>

                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">

                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold font-mono ${statusStyle.light} ${statusStyle.dark}`}
                          >
                            {getStatusLabel(product.status)}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/products/${product.id}`)
                            }
                            title="View product"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-[#7C3AED] hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 transition-all"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>

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

      {/* =========================================================
          ADD PRODUCT MODAL
      ========================================================= */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !addingProduct && setShowAddModal(false)}
        >

          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Add Product
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Add a new product to your inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={addingProduct}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleAddProduct}>

              <div className="p-6 space-y-5">

                {addError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {addError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Oraimo FreePods"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  />
                </div>

                {/* Category + Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Headphones"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleFormChange}
                      placeholder="e.g. Oraimo"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                </div>

                {/* Cost + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Unit Cost
                    </label>

                    <input
                      type="number"
                      name="unitCost"
                      value={formData.unitCost}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Selling Price
                    </label>

                    <input
                      type="number"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    min="0"
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  />

                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Status is calculated automatically from the quantity.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 dark:border-slate-800">

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={addingProduct}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold disabled:opacity-50 transition"
                >
                  {addingProduct ? 'Adding...' : 'Add Product'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;