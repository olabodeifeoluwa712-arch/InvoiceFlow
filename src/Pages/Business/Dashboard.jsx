import React from 'react'
import { useState } from 'react'    
import { useTheme } from '../../Context/ThemeContext'
import { formatStockValue } from '../../utils/formatter'
import { getNameInitials } from '../../utils/formatter'
import { customers as customerActivity, invoices as recent, products } from '../../Database/data.json'
import { getAnalytics } from '../../api/analytics.api'

const recentInvoices = recent.slice(0, 5).reverse(); // Get the 5 most recent invoices
const low = products.filter(product => product.status.toLowerCase() === "low stock" || product.status.toLowerCase() === "out of stock");
const lowStockProducts = low.slice(0, 5); // Get the first 5 low stock products

console.log(lowStockProducts);
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 20000 },
  { month: "Apr", revenue: 29000 },
  { month: "May", revenue: 24000 },
  { month: "Jun", revenue: 31000 },
  { month: "Jul", revenue: 30000 },
  { month: "Aug", revenue: 35000 },
  { month: "Sep", revenue: 32000 },
  { month: "Oct", revenue: 39000 },
  { month: "Nov", revenue: 41000 },
  { month: "Dec", revenue: 45000 },
];

export function RevenueChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">
            Revenue Overview
          </h2>

          <p className="text-sm text-slate-400 dark:text-[#A1A7B0] mt-1">
            Monthly revenue — 2024
          </p>
        </div>

        <button className="bg-purple-100/50 text-[#8B5CF6] font-semibold text-sm px-4 py-1.5 rounded-full cursor-default dark:bg-[#8B7CF6]/15 dark:text-[#8B7CF6] dark:border dark:border-[#8B7CF6]/30">
          2024
        </button>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B7CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B7CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={isDark ? '#1E242B' : '#F1F5F9'}
            />

            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#A1A7B0' : '#94A3B8', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#A1A7B0' : '#94A3B8', fontSize: 13, fontWeight: 500 }}
              tickFormatter={(value) => formatStockValue(value)}
              domain={[0, 60000]}
              ticks={[0, 15000, 30000, 45000, 60000]}
              dx={-5}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1D2229' : '#ffffff',
                border: isDark ? '1px solid #272D35' : '1px solid #F1F5F9',
                borderRadius: '12px',
                boxShadow: isDark ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                color: isDark ? '#F3F4F6' : '#0F172A',
                padding: '12px'
              }}
              formatter={(value) => [
                formatStockValue(value),
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B7CF6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 6, fill: "#8B7CF6", stroke: isDark ? "#171B21" : "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const totalRevenue = 13300;
  const totalInvoices = 7;
  const pendingInvoices = 4;
  const lowStockItems = 2;

  const [paid, setPaid] = useState(3);
  const [oustanding, setOutstanding] = useState(4);
  getAnalytics()

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-200 dark:bg-[#0B0D10] dark:text-[#F3F4F6]">
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-[#A1A7B0]">Total Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center dark:bg-[#1D2229] dark:border dark:border-[#272D35]">
                  <span className="text-purple-600 font-extrabold text-xl leading-none dark:text-[#8B7CF6]">$</span>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-[#F3F4F6] mt-4">
                {formatStockValue(totalRevenue)}
              </h3>
            </div>
            <div className="text-emerald-500 text-sm font-semibold flex items-center gap-1 mt-6 dark:text-emerald-400">
              <span>↗</span> +12.4% vs last month
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-[#A1A7B0]">Total Invoices</span>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center dark:bg-[#1D2229] dark:border dark:border-[#272D35]">
                  <svg className="w-5 h-5 text-blue-600 dark:text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-[#F3F4F6] mt-4">
                {paid + oustanding}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-[#6F7782] text-sm font-semibold mt-6">
              {paid} paid · {oustanding} outstanding
            </div>
          </div>

          {/* Pending / Overdue */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-[#A1A7B0]">Pending / Overdue</span>
                <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center dark:bg-[#1D2229] dark:border dark:border-[#272D35]">
                  <svg className="w-5 h-5 text-amber-600 dark:text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-[#F3F4F6] mt-4">
                {pendingInvoices}
              </h3>
            </div>
            <div className="mt-3">
              <div className="text-slate-400 dark:text-[#6F7782] text-sm font-semibold">Requires attention</div>
              <div className="text-red-500 dark:text-[#F87171] text-sm font-semibold flex items-center gap-1 mt-1">
                <span>↗</span> +2 vs last month
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-[#A1A7B0]">Low Stock Items</span>
                <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center dark:bg-[#1D2229] dark:border dark:border-[#272D35]">
                  <svg className="w-5 h-5 text-red-500 dark:text-[#F87171]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-[#F3F4F6] mt-4">
                {lowStockItems}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-[#6F7782] text-sm font-semibold mt-6">
              Need restocking
            </div>
          </div>

        </div>

        {/* Lower Row Grid: Chart + Invoices List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Revenue Chart - 8 cols */}
          <div className="lg:col-span-8 w-full">
            <RevenueChart />
          </div>

          {/* Recent Invoices List - 4 cols */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full h-full relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">Recent Invoices</h2>
              <a href="#view-all" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-[#8B7CF6] dark:hover:text-[#9B8CFF]">
                View all <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-5">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Circle initials avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 dark:bg-[#1D2229] dark:border dark:border-[#272D35] dark:text-[#8B7CF6] ${invoice.avatarBg}`}>
                      {getNameInitials(invoice.customerName)}
                    </div>

                    {/* Customer information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-[#F3F4F6] leading-tight">
                        {invoice.customerName}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-[#6F7782] font-medium">
                        {invoice.invoiceNo}
                      </span>
                    </div>

                  </div>

                  {/* Price and Status Badge */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800 dark:text-[#F3F4F6]">
                      {invoice.amount.toLocaleString()}
                    </span>
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 border ${
                      invoice.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/25'
                        : invoice.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/25'
                        : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/25'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Bottom Row Grid: Low Stock Products + Customer Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Low Stock Products */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">Low Stock Products</h2>
              <a href="#manage" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-[#8B7CF6] dark:hover:text-[#9B8CFF]">
                Manage <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-5">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Package outline box avatar */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 dark:bg-[#1D2229] dark:border-[#272D35]">
                      <svg className="w-4 h-4 text-slate-400 dark:text-[#8B7CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>

                    {/* Product information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-[#F3F4F6] leading-tight">
                        {product.name}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-[#6F7782] font-medium">
                        {product.sku} · {product.remaining} remaining
                      </span>
                    </div>

                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    product.status === 'Low Stock'
                      ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/25'
                      : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/25'
                  }`}>
                    {product.status}
                  </span>

                </div>
              ))}
            </div>
          </div>

          {/* Customer Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-200 dark:bg-[#171B21] dark:border-[#272D35] dark:shadow-subtle-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">Customer Activity</h2>
              <a href="#view-all" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-[#8B7CF6] dark:hover:text-[#9B8CFF]">
                View all <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-5">
              {customerActivity.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Circular avatar badge */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 dark:bg-[#1D2229] dark:border dark:border-[#272D35] dark:text-[#8B7CF6] ${customer.avatarBg}`}>
                      {getNameInitials(customer.name)}
                    </div>

                    {/* Spend information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-[#F3F4F6] leading-tight">
                        {customer.name}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-[#6F7782] font-medium">
                        ${customer.totalSpent.toLocaleString()} lifetime spend
                      </span>
                    </div>

                  </div>

                  {/* Unpaid Badge */}
                  {customer.unpaidCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/25">
                      {customer.unpaidCount} unpaid
                    </span>
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard
