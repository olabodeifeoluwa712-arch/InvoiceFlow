import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import {
  UserPlusIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  getCustomers,
  createCustomer,
} from "../../api/customer.service.js";
import { getFormattedDate } from "../../utils/formatter";


// =====================================================
// GET CUSTOMER INITIALS
// =====================================================

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return (
      words[0][0] +
      words[1][0]
    ).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
};


// =====================================================
// CUSTOMERS PAGE
// =====================================================

const Customers = () => {
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [customersList, setCustomersList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add customer modal
  const [showAddCustomer, setShowAddCustomer] =
    useState(false);

  const [creatingCustomer, setCreatingCustomer] =
    useState(false);

  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const navigate = useNavigate();
  // =====================================================
  // FETCH CUSTOMERS
  // =====================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const customers = await getCustomers();

      setCustomersList(customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomers();
  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCustomers = customersList.filter(
    (customer) => {
      const search = searchTerm.toLowerCase();

      return (
        customer.displayName
          ?.toLowerCase()
          .includes(search) ||
        customer.email
          ?.toLowerCase()
          .includes(search) ||
        customer.phone
          ?.toLowerCase()
          .includes(search)
      );
    }
  );


  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =====================================================
  // OPEN ADD CUSTOMER FORM
  // =====================================================

  const handleOpenAddCustomer = () => {
    setFormError("");

    setFormData({
      displayName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });

    setShowAddCustomer(true);
  };


  // =====================================================
  // CLOSE ADD CUSTOMER FORM
  // =====================================================

  const handleCloseAddCustomer = () => {
    if (creatingCustomer) return;

    setShowAddCustomer(false);
    setFormError("");
  };


  // =====================================================
  // CREATE CUSTOMER
  // =====================================================

  const handleSubmitCustomer = async (e) => {
    e.preventDefault();

    setFormError("");

    // Display name is required by the backend
    if (!formData.displayName.trim()) {
      setFormError("Customer name is required.");
      return;
    }

    try {
      setCreatingCustomer(true);

      const newCustomer =
        await createCustomer({
          displayName:
            formData.displayName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),

          notes:
            formData.notes.trim(),
        });

      // Add the newly created customer
      // to the beginning of the list
      setCustomersList((prev) => [
        newCustomer,
        ...prev,
      ]);

      // Reset form
      setFormData({
        displayName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      });

      setShowAddCustomer(false);
    } catch (err) {
      console.error(
        "Error creating customer:",
        err
      );

      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create customer."
      );
    } finally {
      setCreatingCustomer(false);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">

      {/* =================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>


      <div className="relative z-10 max-w-6xl mx-auto space-y-6">


        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>

            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Customers
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">

              {loading
                ? "Loading customers..."
                : filteredCustomers.length === 0
                  ? "No customers found"
                  : `${filteredCustomers.length} total customer${filteredCustomers.length !== 1
                    ? "s"
                    : ""
                  }`}

            </p>

          </div>


          <div className="flex items-center gap-3">

            {/* ADD CUSTOMER */}

            <button
              type="button"
              onClick={handleOpenAddCustomer}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]"
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
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span>
                Add Customer
              </span>

            </button>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}


        {/* =================================================
            CUSTOMER TABLE CARD
        ================================================== */}

        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">

          {/* Top glow */}

          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>


          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="relative max-w-md mb-6 group">

            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors">

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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-850 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50"
            />

          </div>


          {/* =================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="border-b border-slate-200/60 dark:border-slate-800/50">

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Customer
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Email
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Total Spent
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono text-center">
                    Unpaid
                  </th>

                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Joined
                  </th>

                  <th className="py-4 px-4 text-right"></th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">


                {/* LOADING */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium"
                    >
                      Loading customers...
                    </td>

                  </tr>


                ) : filteredCustomers.length === 0 ? (

                  /* EMPTY */

                  <tr>

                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium"
                    >
                      {searchTerm
                        ? "No customers match your search."
                        : "No customers found."}
                    </td>

                  </tr>


                ) : (

                  /* CUSTOMERS */

                  filteredCustomers.map(
                    (customer) => {

                      const initials =
                        getInitials(
                          customer.displayName
                        );

                      return (

                        <tr
                          key={customer._id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors duration-200 group/row"
                        >

                          {/* CUSTOMER */}

                          <td className="py-4 px-4">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all bg-purple-100 border border-purple-200 text-purple-700 dark:bg-neon-purple/10 dark:border-neon-purple/30 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(189,0,255,0.15)] dark:group-hover/row:shadow-[0_0_12px_rgba(189,0,255,0.3)]">
                                {initials}
                              </div>

                              <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors">
                                {customer.displayName}
                              </span>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            {customer.email || "—"}
                          </td>


                          {/* TOTAL SPENT */}

                          <td className="py-4 px-4 text-slate-400 dark:text-slate-500 font-bold text-sm font-mono">
                            —
                          </td>


                          {/* UNPAID */}

                          <td className="py-4 px-4 text-center">

                            <span className="text-slate-400 dark:text-slate-600 font-mono">
                              —
                            </span>

                          </td>


                          {/* JOINED */}

                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono text-sm">
                            {customer.createdAt
                              ? getFormattedDate(
                                customer.createdAt
                              )
                              : "—"}
                          </td>


                          {/* ACTION */}

                          <td className="py-4 px-4 text-right">

                            <button
                              type="button"
                              onClick={() => navigate(`/customers/${customer._id}`)}
                              className="text-slate-400 dark:text-slate-500 group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors duration-200 cursor-pointer"
                            >

                              <svg
                                className="w-5 h-5 transform group-hover/row:translate-x-0.5 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>

                            </button>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =====================================================
          ADD CUSTOMER MODAL
      ====================================================== */}
      {/* ===============================
    ADD CUSTOMER MODAL
================================ */}
      {showAddCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[4px]"
          onClick={handleCloseAddCustomer}
        >
          <div
            className="relative w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Purple top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <UserPlusIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Add Customer
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create a new customer profile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAddCustomer}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCustomer} className="px-6 py-5">
              {formError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Customer Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800"
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
                      placeholder="customer@email.com"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800"
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
                      placeholder="08012345678"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800"
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
                    placeholder="Customer address"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800"
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
                    placeholder="Optional notes about this customer..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseAddCustomer}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingCustomer}
                  className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingCustomer ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Add Customer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;