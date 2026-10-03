import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useTheme } from "../../Context/ThemeContext";
import {
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api/customer.api";

const CustomerDetails = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // ==========================================
  // FETCH CUSTOMER
  // ==========================================
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setPageError("");

        const data = await getCustomer(id);

        setCustomer(data);

        setFormData({
          displayName: data.displayName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          notes: data.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch customer:", error);

        setPageError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  // ==========================================
  // FORM INPUT
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const handleOpenEdit = () => {
    setFormError("");

    setFormData({
      displayName: customer.displayName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      notes: customer.notes || "",
    });

    setShowEditModal(true);
  };

  // ==========================================
  // UPDATE CUSTOMER
  // ==========================================
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      setFormError("Customer name is required.");
      return;
    }

    try {
      setUpdating(true);
      setFormError("");

      const updatedCustomer = await updateCustomer(id, {
        displayName: formData.displayName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      });

      setCustomer(updatedCustomer);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update customer:", error);

      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update customer."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================
  const handleDeleteCustomer = async () => {
    try {
      setDeleting(true);
      setPageError("");

      await deleteCustomer(id);

      navigate("/business-customers");
    } catch (error) {
      console.error("Failed to delete customer:", error);

      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete customer."
      );

      setDeleting(false);
    }
  };

  // ==========================================
  // INITIALS
  // ==========================================
  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div
        className={`flex min-h-[70vh] items-center justify-center ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-200 border-t-[#7C3AED] dark:border-purple-900/40 dark:border-t-purple-400" />
          Loading customer...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (pageError || !customer) {
    return (
      <div
        className={`min-h-screen px-6 py-7 ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <button
          onClick={() => navigate("/business-customers")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#7C3AED] dark:text-slate-400 dark:hover:text-purple-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Customers
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          {pageError || "Customer not found."}
        </div>
      </div>
    );
  }

  const initials = getInitials(customer.displayName);

  return (
    <div
      className={`min-h-screen px-6 py-7 ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        {/* ==========================================
            BACK
        ========================================== */}
        <button
          onClick={() => navigate("/business-customers")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#7C3AED] dark:text-slate-400 dark:hover:text-purple-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Customers
        </button>

        {/* ==========================================
            CUSTOMER HEADER CARD
        ========================================== */}
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="h-1 w-full bg-[#7C3AED]" />

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-lg font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                {initials}
              </div>

              <div>
                <h1
                  className={`text-xl font-semibold ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {customer.displayName}
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Customer profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            CUSTOMER INFORMATION
        ========================================== */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Contact */}
          <div
            className={`rounded-2xl border p-6 shadow-sm ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <h2
              className={`mb-5 text-sm font-semibold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Contact Information
            </h2>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {customer.email || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <PhoneIcon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {customer.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <MapPinIcon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {customer.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div
            className={`rounded-2xl border p-6 shadow-sm ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <DocumentTextIcon className="h-4 w-4" />
              </div>

              <h2
                className={`text-sm font-semibold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Notes
              </h2>
            </div>

            <div
              className={`min-h-[130px] rounded-xl p-4 ${
                isDark ? "bg-slate-950" : "bg-slate-50"
              }`}
            >
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {customer.notes ||
                  "No notes have been added for this customer."}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            CUSTOMER RECORD
        ========================================== */}
        <div
          className={`mt-5 rounded-2xl border p-6 shadow-sm ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <h2
            className={`mb-5 text-sm font-semibold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Customer Record
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Customer ID</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                {customer._id}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Date Added</p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString(
                      "en-NG",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {customer.updatedAt
                  ? new Date(customer.updatedAt).toLocaleDateString(
                      "en-NG",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          EDIT CUSTOMER MODAL
      ========================================== */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[4px]"
          onClick={() => !updating && setShowEditModal(false)}
        >
          <div
            className={`relative w-full max-w-[500px] overflow-hidden rounded-2xl border shadow-2xl ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-[#7C3AED]" />

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Edit Customer
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Update customer information
                </p>
              </div>

              <button
                type="button"
                disabled={updating}
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="px-6 py-5">
              {formError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Customer Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:bg-slate-950 dark:focus:ring-purple-900/30"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-5 flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE MODAL
      ========================================== */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[4px]"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className={`w-full max-w-[390px] rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <TrashIcon className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Delete Customer?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {customer.displayName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteCustomer}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}

                {deleting ? "Deleting..." : "Delete Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;