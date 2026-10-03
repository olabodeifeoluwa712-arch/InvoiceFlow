import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import {
  getOneProduct,
  updateProduct,
  deleteProduct,
} from '../../api/inventory.api';

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();

  if (s === 'in stock') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
  }

  if (s === 'low stock') {
    return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
  }

  return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
};

const ProductDetails = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editData, setEditData] = useState({
    name: '',
    category: '',
    brand: '',
    unitCost: '',
    unitPrice: '',
    quantity: '',
  });

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getOneProduct(id);

        setProduct(response);

        setEditData({
          name: response?.name || '',
          category: response?.category || '',
          brand: response?.brand || '',
          unitCost: response?.unitCost ?? '',
          unitPrice: response?.unitPrice ?? '',
          quantity: response?.quantity ?? 0,
        });
      } catch (err) {
        console.error('Failed to fetch product:', err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load product.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setActionError('');

      const data = {
        name: editData.name.trim(),
        category: editData.category.trim(),
        brand: editData.brand.trim() || undefined,
        unitCost: editData.unitCost
          ? Number(editData.unitCost)
          : undefined,
        unitPrice: editData.unitPrice
          ? Number(editData.unitPrice)
          : undefined,
        quantity: editData.quantity
          ? Number(editData.quantity)
          : 0,
      };

      const updatedProduct = await updateProduct(id, data);

      setProduct(updatedProduct);

      setEditData({
        name: updatedProduct?.name || '',
        category: updatedProduct?.category || '',
        brand: updatedProduct?.brand || '',
        unitCost: updatedProduct?.unitCost ?? '',
        unitPrice: updatedProduct?.unitPrice ?? '',
        quantity: updatedProduct?.quantity ?? 0,
      });

      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update product:', err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update product.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setActionError('');

      await deleteProduct(id);

      navigate('/business-products');
    } catch (err) {
      console.error('Failed to delete product:', err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete product.'
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen p-6 md:p-10 bg-slate-50 dark:bg-slate-950">
        <button
          type="button"
          onClick={() => navigate('/business-products')}
          className="mb-6 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] dark:text-purple-400 dark:hover:text-purple-300"
        >
          ← Back to Products
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error || 'Product not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* Background */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/business-products')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#7C3AED] dark:text-slate-400 dark:hover:text-purple-400 transition"
        >
          ← Back to Products
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

          <div>
            <p className="text-sm font-mono text-slate-400 dark:text-slate-500 mb-2">
              Product Details
            </p>

            <h1 className="text-3xl font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>

            <p className="mt-2 text-sm font-mono text-slate-500 dark:text-slate-400">
              SKU: {product.sku || 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => {
                setActionError('');
                setShowEditModal(true);
              }}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              Edit Product
            </button>

            <button
              type="button"
              onClick={() => {
                setActionError('');
                setShowDeleteModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
            >
              Delete
            </button>

          </div>

        </div>

        {/* Error */}
        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {actionError}
          </div>
        )}

        {/* Product Details */}
        <div className="bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-2xl rounded-3xl p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Category */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Category
              </p>

              <p className="mt-2 text-lg font-semibold">
                {product.category || 'N/A'}
              </p>
            </div>

            {/* Brand */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Brand
              </p>

              <p className="mt-2 text-lg font-semibold">
                {product.brand || 'N/A'}
              </p>
            </div>

            {/* Unit Cost */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Unit Cost
              </p>

              <p className="mt-2 text-lg font-semibold font-mono">
                ₦{Number(product.unitCost || 0).toLocaleString()}
              </p>
            </div>

            {/* Selling Price */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Selling Price
              </p>

              <p className="mt-2 text-lg font-semibold font-mono">
                ₦{Number(product.unitPrice || 0).toLocaleString()}
              </p>
            </div>

            {/* Quantity */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Quantity
              </p>

              <p className="mt-2 text-lg font-semibold font-mono">
                {product.quantity ?? 0}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-950 dark:border-slate-800">
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Status
              </p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold font-mono ${getStatusStyle(
                  product.status
                )}`}
              >
                {product.status || 'Out of Stock'}
              </span>
            </div>

          </div>

          {/* Added Date */}
          {product.addedDate && (
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">

              <p className="text-xs uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500">
                Added
              </p>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {new Date(product.addedDate).toLocaleDateString()}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* =========================================================
          EDIT PRODUCT MODAL
      ========================================================= */}

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !updating && setShowEditModal(false)}
        >

          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">

              <div>
                <h2 className="text-xl font-bold">
                  Edit Product
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update your product information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={updating}
                className="w-9 h-9 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleUpdate}>

              <div className="p-6 space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  />
                </div>

                {/* Category + Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={editData.brand}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                </div>

                {/* Cost + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Unit Cost
                    </label>

                    <input
                      type="number"
                      name="unitCost"
                      value={editData.unitCost}
                      onChange={handleEditChange}
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Selling Price
                    </label>

                    <input
                      type="number"
                      name="unitPrice"
                      value={editData.unitPrice}
                      onChange={handleEditChange}
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    />
                  </div>

                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={editData.quantity}
                    onChange={handleEditChange}
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    The backend will update the product status based on quantity.
                  </p>
                </div>

              </div>

              <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 dark:border-slate-800">

                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold disabled:opacity-50 transition"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================= */}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >

          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center dark:bg-red-900/30 dark:text-red-400 mb-5">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.7 13.32A2 2 0 004.32 20h15.36a2 2 0 001.73-2.82l-7.7-13.32a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {product.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProductDetails;