import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/http";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/invoices");

        console.log("Invoices response:", response);

        setInvoices(response.invoices || []);
      } catch (err) {
        console.error("Fetch invoices error:", err);

        setError(err?.message || "Unable to fetch invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Status tabs
  const statusTabs = [
    { label: "All", value: "All" },
    { label: "Draft", value: "DRAFT" },
    { label: "Sent", value: "SENT" },
    { label: "Paid", value: "PAID" },
    { label: "Overdue", value: "OVERDUE" },
  ];

  // Filter invoices dynamically
  const displayedInvoices = invoices.filter((invoice) => {
    const customerName =
      invoice.customer?.displayName?.toLowerCase() || "";

    const invoiceNumber =
      invoice.invoiceNumber?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      customerName.includes(searchValue) ||
      invoiceNumber.includes(searchValue);

    const matchesTab =
      activeTab === "All" ||
      invoice.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:p-10 select-none">

      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-purple-100/40 blur-[120px] transition-all duration-300 dark:bg-purple-900/10"></div>

      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-purple-100/30 blur-[120px] transition-all duration-300 dark:bg-purple-900/10"></div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">

        {/* Header Section */}
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Invoices
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {invoices.length} total invoices
            </p>
          </div>

          <button
            onClick={() => navigate("/create-invoice")}
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#7C3AED] px-5 py-3 font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-[0.98]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>

            <span>Create Invoice</span>
          </button>

        </header>

        {/* Main List Card */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="absolute left-10 right-10 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

          {/* Search + Filters */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800 sm:flex-row sm:items-center">

            {/* Search */}
            <div className="group relative w-full sm:max-w-xs">

              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-[#7C3AED] dark:text-slate-500 dark:group-focus-within:text-purple-400">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
              />

            </div>

            {/* Status Tabs */}
            <div className="flex gap-1 rounded-full border border-slate-200 bg-slate-100/70 p-1 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950">

              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    activeTab === tab.value
                      ? "bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-left">

              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Invoice
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Customer
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Amount
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Date
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Due
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {/* Loading */}
                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center font-medium text-slate-400 dark:text-slate-500"
                    >
                      Loading invoices...
                    </td>
                  </tr>

                ) : displayedInvoices.length === 0 ? (

                  /* Empty */
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center font-medium text-slate-400 dark:text-slate-500"
                    >
                      No invoices found
                    </td>
                  </tr>

                ) : (

                  displayedInvoices.map((invoice) => (

                    <tr
                      key={invoice._id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50"
                    >

                      {/* Invoice Number */}
                      <td
                        onClick={() =>
                          navigate(`/business-view-invoices/${invoice._id}`)
                        }
                        className="cursor-pointer px-4 py-5 text-sm font-extrabold text-[#7C3AED] transition-colors hover:text-[#6D28D9] dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        {invoice.invoiceNumber}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-5">

                        <div className="flex items-center gap-3.5">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            {invoice.customer?.displayName
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {invoice.customer?.displayName ||
                              "Unknown Customer"}
                          </span>

                        </div>

                      </td>

                      {/* Amount */}
                      <td className="px-4 py-5 text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {invoice.currency}{" "}
                        {Number(invoice.totalAmount || 0).toLocaleString(
                          "en-NG",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-5">

                        <span
                          className={`inline-flex items-center justify-center rounded-full border px-3 py-0.5 text-[11px] font-semibold ${
                            invoice.status === "PAID"
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : invoice.status === "SENT"
                                ? "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400"
                                : invoice.status === "OVERDUE"
                                  ? "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                                  : invoice.status === "PARTIALLY PAID"
                                    ? "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400"
                                    : invoice.status === "CANCELLED"
                                      ? "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                      : "border-purple-100 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-400"
                          }`}
                        >
                          {invoice.status}
                        </span>

                      </td>

                      {/* Invoice Date */}
                      <td className="px-4 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {invoice.invoiceDate
                          ? new Date(
                              invoice.invoiceDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {invoice.dueDate
                          ? new Date(
                              invoice.dueDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Invoices;