import React from 'react'
import { useState } from 'react'    
import { useTheme } from '../../Context/ThemeContext'

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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
      <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Revenue Overview
          </h2>

          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Monthly revenue — 2024
          </p>
        </div>

        <button className="bg-purple-100/50 text-[#8B5CF6] font-semibold text-sm px-4 py-1.5 rounded-full cursor-default dark:bg-neon-cyan/10 dark:text-neon-cyan dark:border dark:border-neon-cyan/20">
          2024
        </button>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={isDark ? '#1f2937' : '#F1F5F9'}
            />

            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 13, fontWeight: 500 }}
              tickFormatter={(value) => `$${value / 1000}k`}
              domain={[0, 60000]}
              ticks={[0, 15000, 30000, 45000, 60000]}
              dx={-5}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0e1320' : '#ffffff',
                border: isDark ? '1px solid #1f2937' : '1px solid #F1F5F9',
                borderRadius: '16px',
                boxShadow: isDark ? '0 20px 35px rgba(0, 0, 0, 0.35)' : '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                color: isDark ? '#F8FAFC' : '#0F172A',
                padding: '12px'
              }}
              formatter={(value) => [
                `$${value.toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke={isDark ? '#00f3ff' : '#8B5CF6'}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 6, fill: isDark ? "#00f3ff" : "#8B5CF6", stroke: isDark ? "#0e1320" : "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const recentInvoices = [
  { id: 1, customer: "Apex Design Co.", amount: 4200, status: "Paid", number: "INV-001", initials: "AD", avatarBg: "bg-purple-100 text-purple-600" },
  { id: 2, customer: "Brightfield Media", amount: 1850, status: "Pending", number: "INV-002", initials: "BM", avatarBg: "bg-fuchsia-100 text-fuchsia-600" },
  { id: 3, customer: "ClearPath Systems", amount: 7600, status: "Overdue", number: "INV-003", initials: "CS", avatarBg: "bg-indigo-100 text-indigo-600" },
  { id: 4, customer: "Delta Logistics", amount: 3300, status: "Paid", number: "INV-004", initials: "DL", avatarBg: "bg-blue-100 text-blue-600" },
];

const lowStockProducts = [
  { id: 1, name: "Analytics Add-on", sku: "ANA-001", remaining: 3, status: "Low Stock" },
  { id: 2, name: "API Access Module", sku: "API-001", remaining: 0, status: "Out of Stock" }
];

const customerActivity = [
  { id: 1, customer: "Apex Design Co.", spend: 18400, initials: "AD", unpaidCount: 0, avatarBg: "bg-purple-100 text-purple-600" },
  { id: 2, customer: "Brightfield Media", spend: 7200, initials: "BM", unpaidCount: 1, avatarBg: "bg-fuchsia-100 text-fuchsia-600" },
  { id: 3, customer: "ClearPath Systems", spend: 31500, initials: "CS", unpaidCount: 2, avatarBg: "bg-indigo-100 text-indigo-600" },
  { id: 4, customer: "Delta Logistics", spend: 12800, initials: "DL", unpaidCount: 0, avatarBg: "bg-blue-100 text-blue-600" },
  { id: 5, customer: "Ember Analytics", spend: 4600, initials: "EA", unpaidCount: 1, avatarBg: "bg-[#EEF2FF] text-[#4F46E5]" },
];

const Dashboard = () => {
  const totalRevenue = 13300;
  const totalInvoices = 7;
  const pendingInvoices = 4;
  const lowStockItems = 2;

  const [paid, setPaid] = useState(3);
  const [oustanding, setOutstanding] = useState(4);

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Revenue */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-0 dark:opacity-60 transition-opacity duration-300"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center dark:bg-neon-purple/10 dark:border dark:border-neon-purple/20">
                  <span className="text-purple-600 font-extrabold text-xl leading-none dark:text-neon-cyan">$</span>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-4">
                ${totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="text-emerald-500 text-sm font-semibold flex items-center gap-1 mt-6">
              <span>↗</span> +12.4% vs last month
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-0 dark:opacity-60 transition-opacity duration-300"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Invoices</span>
                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center dark:bg-neon-cyan/10 dark:border dark:border-neon-cyan/20">
                  <svg className="w-5 h-5 text-blue-600 dark:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-4">
                {paid + oustanding}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-sm font-semibold mt-6">
              {paid} paid · {oustanding} outstanding
            </div>
          </div>

          {/* Pending / Overdue */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-0 dark:opacity-60 transition-opacity duration-300"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Pending / Overdue</span>
                <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center dark:bg-neon-pink/10 dark:border dark:border-neon-pink/20">
                  <svg className="w-5 h-5 text-amber-600 dark:text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-4">
                {pendingInvoices}
              </h3>
            </div>
            <div className="mt-3">
              <div className="text-slate-400 dark:text-slate-500 text-sm font-semibold">Requires attention</div>
              <div className="text-red-500 dark:text-neon-pink text-sm font-semibold flex items-center gap-1 mt-1">
                <span>↗</span> +2 vs last month
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-0 dark:opacity-60 transition-opacity duration-300"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Low Stock Items</span>
                <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center dark:bg-neon-pink/10 dark:border dark:border-neon-pink/20">
                  <svg className="w-5 h-5 text-red-500 dark:text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-4">
                {lowStockItems}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-sm font-semibold mt-6">
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
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-4 w-full h-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Invoices</h2>
              <a href="#view-all" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-neon-cyan dark:hover:text-neon-pink">
                View all <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-6">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Circle initials avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 dark:bg-neon-purple/10 dark:border dark:border-neon-purple/30 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(189,0,255,0.15)] ${invoice.avatarBg}`}>
                      {invoice.initials}
                    </div>

                    {/* Customer information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {invoice.customer}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        {invoice.number}
                      </span>
                    </div>

                  </div>

                  {/* Price and Status Badge */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      ${invoice.amount.toLocaleString()}
                    </span>
                    <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold mt-1 border ${
                      invoice.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                        : invoice.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
                        : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
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
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Low Stock Products</h2>
              <a href="#manage" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-neon-cyan dark:hover:text-neon-pink">
                Manage <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-6">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Package outline box avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800">
                      <svg className="w-5 h-5 text-slate-400 dark:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>

                    {/* Product information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {product.name}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        {product.sku} · {product.remaining} remaining
                      </span>
                    </div>

                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold border ${
                    product.status === 'Low Stock'
                      ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
                      : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
                  }`}>
                    {product.status}
                  </span>

                </div>
              ))}
            </div>
          </div>

          {/* Customer Activity */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Customer Activity</h2>
              <a href="#view-all" className="text-[#8B5CF6] hover:text-[#7C3AED] text-sm font-semibold transition-colors flex items-center gap-1 dark:text-neon-cyan dark:hover:text-neon-pink">
                View all <span className="text-xs">→</span>
              </a>
            </div>

            <div className="space-y-6">
              {customerActivity.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    
                    {/* Circular avatar badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 dark:bg-neon-purple/10 dark:border dark:border-neon-purple/30 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(189,0,255,0.15)] ${customer.avatarBg}`}>
                      {customer.initials}
                    </div>

                    {/* Spend information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {customer.customer}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        ${customer.spend.toLocaleString()} lifetime spend
                      </span>
                    </div>

                  </div>

                  {/* Unpaid Badge */}
                  {customer.unpaidCount > 0 && (
                    <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30">
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
