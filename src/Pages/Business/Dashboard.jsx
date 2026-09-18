import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../Context/ThemeContext";
import { formatStockValue, getNameInitials } from "../../utils/formatter";
import api from "../../api/http";


const RevenueChart = ({ chart }) => {
  const { theme } = useTheme();

  const monthlyData = chart?.monthly || [];

  if (!monthlyData.length) {
    return (
      <div className="h-[320px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
          <span className="text-purple-600 dark:text-purple-400 text-xl">
            ₦
          </span>
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          No revenue data yet
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Revenue statistics will appear here once payments are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#334155" : "#E2E8F0"}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: theme === "dark" ? "#94A3B8" : "#64748B",
              fontSize: 12,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: theme === "dark" ? "#94A3B8" : "#64748B",
              fontSize: 12,
            }}
            tickFormatter={(value) => `₦${value.toLocaleString()}`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1E293B" : "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [
              `₦${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7C3AED"
            strokeWidth={3}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err?.message || "Unable to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  // getAnalytics()

  if (loading) {  

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 bg-white dark:bg-slate-900 rounded-2xl"
              />
            ))}
          </div>

          <div className="h-96 bg-white dark:bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <span className="text-red-600 dark:text-red-400 text-xl">
                !
              </span>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Unable to load dashboard
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const recentInvoices = dashboard?.recentInvoices || [];
  const lowStockProducts = dashboard?.lowStockProducts || [];
  const customerActivity = dashboard?.customerActivity || [];
  const chart = dashboard?.chart || {};

  const metricCards = [
    {
      title: "Total Revenue",
      value: `₦${Number(summary.totalRevenue || 0).toLocaleString()}`,
      description: "From recorded payments",
      icon: "₦",
      iconClass:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Total Invoices",
      value: summary.totalInvoices || 0,
      description: `${summary.paidInvoices || 0} paid`,
      icon: "▤",
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Pending Invoices",
      value: summary.pendingInvoices || 0,
      description: `${summary.unpaidInvoices || 0} unpaid`,
      icon: "◷",
      iconClass:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      title: "Low Stock Items",
      value: summary.lowStockItems || 0,
      description: "Need attention",
      icon: "!",
      iconClass:
        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your business activity
          </p>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricCards.map((card) => (
            <div
              key={card.title}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${card.iconClass}`}
                >
                  {card.icon}
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* REVENUE OVERVIEW */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Revenue generated from recorded payments
              </p>
            </div>

            <div className="mt-3 sm:mt-0 text-sm font-medium text-purple-600 dark:text-purple-400">
              ₦{Number(summary.totalRevenue || 0).toLocaleString()} total
            </div>
          </div>

          <RevenueChart chart={chart} />
        </div>

        {/* RECENT INVOICES + LOW STOCK */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* RECENT INVOICES */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Invoices
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your latest invoice activity
                  </p>
                </div>

                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {recentInvoices.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentInvoices.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    No invoices yet
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Your recent invoices will appear here.
                  </p>
                </div>
              ) : (
                recentInvoices.map((invoice) => {
                  const status = invoice.status?.toUpperCase();

                  let statusClass =
                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

                  if (status === "PAID") {
                    statusClass =
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                  }

                  if (status === "UNPAID") {
                    statusClass =
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
                  }

                  if (status === "PARTIALLY PAID") {
                    statusClass =
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
                  }

                  if (status === "CANCELLED") {
                    statusClass =
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
                  }

                  return (
                    <div
                      key={invoice.id}
                      className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                          {getNameInitials(
                            invoice.customerName || "Unknown"
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-800 dark:text-white truncate">
                            {invoice.customerName || "Unknown Customer"}
                          </p>

                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {invoice.invoiceNo}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                          {invoice.currency || "NGN"}{" "}
                          {Number(invoice.amount || 0).toLocaleString()}
                        </p>

                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusClass}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* LOW STOCK */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Low Stock
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Products that need attention
                  </p>
                </div>

                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {lowStockProducts.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {lowStockProducts.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Inventory looks good
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    No low-stock products at the moment.
                  </p>
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {product.name}
                      </p>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        SKU: {product.sku || "N/A"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          product.remaining === 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {formatStockValue(product.remaining)}
                      </p>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {product.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CUSTOMER ACTIVITY */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Customer Activity
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Recent customer invoice activity
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {customerActivity.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  No customer activity yet
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Customer invoice activity will appear here.
                </p>
              </div>
            ) : (
              customerActivity.map((customer) => (
                <div
                  key={customer.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
                      {getNameInitials(customer.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {customer.name}
                      </p>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {customer.unpaidCount || 0} unpaid invoice
                        {customer.unpaidCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      ₦{Number(customer.totalInvoiced || 0).toLocaleString()}
                    </p>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      Total invoiced
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;