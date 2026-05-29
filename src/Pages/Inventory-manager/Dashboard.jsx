import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../Context/ThemeContext'
import { formatStockValue } from '../../utils/formatter'
import {
  CubeIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts'

import { useAuth } from '../../Context/AuthContext'
import { products as ProductsData } from '../../Database/data.json';


const weeklyMovementData = [
  { day: "Mon", stockIn: 30, stockOut: 12 },
  { day: "Tue", stockIn: 15, stockOut: 20 },
  { day: "Wed", stockIn: 55, stockOut: 30 },
  { day: "Thu", stockIn: 8, stockOut: 18 },
  { day: "Fri", stockIn: 65, stockOut: 18 },
  { day: "Sat", stockIn: 5, stockOut: 8 },
  { day: "Sun", stockIn: 4, stockOut: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.06)] p-4 text-xs select-none dark:bg-cyber-card dark:border-slate-800/80 dark:shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
        <p className="font-extrabold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="space-y-1 font-bold">
          <p className="text-[#8B5CF6] dark:text-purple-400">Stock In : {payload[0]?.value}</p>
          <p className="text-[#3B82F6] dark:text-neon-cyan">Stock Out : {payload[1]?.value}</p>
        </div>
      </div>
    );
  }
  return null;
};



// const ProductsData = [
//   { id: 1, name: 'Business Starter Kit', sku: 'BSK-001', price: 299, stock: 42, category: 'Bundles', status: 'in stock' },
//   { id: 2, name: 'Enterprise License', sku: 'ENT-001', price: 1299, stock: 8, category: 'Licenses', status: 'in stock' },
//   { id: 3, name: 'Analytics Add-on', sku: 'ANA-001', price: 149, stock: 3, category: 'Add-ons', status: 'low stock' },
//   { id: 4, name: 'API Access Module', sku: 'API-001', price: 499, stock: 0, category: 'Modules', status: 'out of stock' },
//   { id: 5, name: 'Team Collaboration Suite', sku: 'TEM-001', price: 799, stock: 15, category: 'Bundles', status: 'in stock' },
//   { id: 6, name: 'Advanced Security Firewall', sku: 'SEC-002', price: 899, stock: 2, category: 'Add-ons', status: 'low stock' },
//   { id: 7, name: 'Cloud Storage 1TB', sku: 'CLD-1TB', price: 99, stock: 4, category: 'Add-ons', status: 'low stock' },
//   { id: 8, name: 'Premium Support Desk', sku: 'SUP-001', price: 1500, stock: 5, category: 'Support', status: 'low stock' },
//   { id: 9, name: 'Data Migrator Pro', sku: 'MIG-001', price: 349, stock: 0, category: 'Modules', status: 'out of stock' },
//   { id: 10, name: 'Custom Setup Service', sku: 'SVC-001', price: 1324, stock: 1, category: 'Support', status: 'in stock' },
// ];

const recentActivities = [
  { id: 1, action: "Stock Adjusted", product: "Business Starter Kit", details: "+12 units added", time: "2 hours ago", user: "Marcus", type: "info" },
  { id: 2, action: "Low Stock Alert", product: "Analytics Add-on", details: "Fell below safety threshold (3 remaining)", time: "5 hours ago", user: "System", type: "warning" },
  { id: 3, action: "Out of Stock", product: "API Access Module", details: "Inventory depleted", time: "1 day ago", user: "System", type: "danger" },
  { id: 4, action: "New Product Added", product: "Custom Setup Service", details: "New service item created", time: "2 days ago", user: "Marcus", type: "success" },
];

const Dashboard = () => {
  const {currentUser} = useAuth()
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState(ProductsData);

  // Compute stats dynamically from the mock data to match the screenshot
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.unitPrice * p.qty), 0);
  const lowStockCount = products.filter(p => p.status.toLowerCase() === 'low stock').length;
  const outOfStockCount = products.filter(p => p.status.toLowerCase() === 'out of stock').length;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  // Format stock value for presentation (e.g. 46400 -> "$46.4k")
 

  // Weekly movement computations
  const totalReceived = weeklyMovementData.reduce((sum, d) => sum + d.stockIn, 0);
  const totalDispatched = weeklyMovementData.reduce((sum, d) => sum + d.stockOut, 0);
  const netMovement = totalReceived - totalDispatched;

  // Stock health computations
  const inStockCount = products.filter(p => p.status.toLowerCase() === 'in stock').length;
  const lowStockCountVal = products.filter(p => p.status.toLowerCase() === 'low stock').length;
  const outOfStockCountVal = products.filter(p => p.status.toLowerCase() === 'out of stock').length;
  const totalProductsVal = products.length;
  const inStockPercentage = totalProductsVal > 0 ? Math.round((inStockCount / totalProductsVal) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      {/* Visual background blurs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Greeting Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              Good morning, {currentUser.firstName} <span className="animate-bounce inline-block">👋</span>
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Warehouse is operational · {totalProducts} products tracked</span>
            </div>
          </div>

          <Link 
            to="/inventory" 
            className="self-start sm:self-center inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors dark:text-neon-cyan dark:hover:text-neon-pink group"
          >
            View full inventory 
            <span className="text-base transform transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </Link>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Products */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-40 dark:opacity-60"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Products</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-neon-purple/10 dark:border dark:border-neon-purple/20 flex items-center justify-center transition-colors">
                  <CubeIcon className="w-5 h-5 text-purple-600 dark:text-neon-cyan" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-850 dark:text-slate-100 mt-4 tracking-tight">
                {totalProducts}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-6 tracking-normal">
              Across {categoriesCount} categories
            </div>
          </div>

          {/* Card 2: Total Stock Value */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-neon-cyan opacity-40 dark:opacity-60"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Stock Value</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-neon-cyan/10 dark:border dark:border-neon-cyan/20 flex items-center justify-center transition-colors">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 dark:text-neon-cyan" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-850 dark:text-slate-100 mt-4 tracking-tight">
                {formatStockValue(totalStockValue)}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-6 tracking-normal">
              Based on unit costs
            </div>
          </div>

          {/* Card 3: Low Stock Items (Highlighted Border) */}
          <div className="bg-white rounded-3xl border border-amber-300 bg-amber-50/15 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-amber-950/10 dark:backdrop-blur-xl dark:border-amber-500/40 dark:shadow-[0_0_18px_rgba(245,158,11,0.08)]">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Low Stock Items</span>
                <div className="w-10 h-10 rounded-xl bg-amber-100/50 dark:bg-amber-500/10 dark:border dark:border-amber-500/20 flex items-center justify-center transition-colors">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-850 dark:text-slate-100 mt-4 tracking-tight">
                {lowStockCount}
              </h3>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-6 tracking-normal">
              Below reorder level
            </div>
          </div>

          {/* Card 4: Out of Stock */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500 to-transparent dark:via-neon-pink opacity-40 dark:opacity-60"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Out of Stock</span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-neon-pink/10 dark:border dark:border-neon-pink/20 flex items-center justify-center transition-colors">
                  <XCircleIcon className="w-5 h-5 text-rose-600 dark:text-neon-pink" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-850 dark:text-slate-100 mt-4 tracking-tight">
                {outOfStockCount}
              </h3>
            </div>
            <div className="text-rose-500 dark:text-neon-pink text-xs font-semibold mt-6 tracking-normal">
              Needs immediate action
            </div>
          </div>

        </div>

        {/* Lower Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Weekly Stock Movement Line Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-2 w-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Weekly Stock Movement</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Stock In vs. Stock Out this week</p>
                </div>
                
                {/* Legend Indicators */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-4 rounded-full bg-[#8B5CF6] dark:bg-purple-400"></span>
                    <span className="text-slate-500 dark:text-slate-400">Stock In</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-4 rounded-full bg-[#3B82F6] dark:bg-neon-cyan"></span>
                    <span className="text-slate-500 dark:text-slate-400">Stock Out</span>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="w-full h-[320px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyMovementData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isDark ? '#a78bfa' : '#8b5cf6'} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={isDark ? '#a78bfa' : '#8b5cf6'} stopOpacity={0.00} />
                      </linearGradient>
                      <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isDark ? '#00f3ff' : '#3b82f6'} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={isDark ? '#00f3ff' : '#3b82f6'} stopOpacity={0.00} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke={isDark ? '#1f2937' : '#F1F5F9'}
                    />

                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 500 }}
                      dy={8}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 500 }}
                      domain={[0, 80]}
                      ticks={[0, 20, 40, 60, 80]}
                      dx={-5}
                    />

                    <ChartTooltip content={<CustomTooltip />} />

                    {/* Stock In - Purple */}
                    <Area
                      type="monotone"
                      dataKey="stockIn"
                      stroke={isDark ? '#a78bfa' : '#8b5cf6'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorStockIn)"
                      dot={false}
                      activeDot={{ r: 5, fill: isDark ? "#a78bfa" : "#8b5cf6", stroke: isDark ? "#0e1320" : "#FFFFFF", strokeWidth: 2 }}
                    />

                    {/* Stock Out - Blue */}
                    <Area
                      type="monotone"
                      dataKey="stockOut"
                      stroke={isDark ? '#00f3ff' : '#3b82f6'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorStockOut)"
                      dot={false}
                      activeDot={{ r: 5, fill: isDark ? "#00f3ff" : "#3b82f6", stroke: isDark ? "#0e1320" : "#FFFFFF", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Summaries */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/80">
              <div className="flex items-center gap-10">
                <div>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{totalReceived}</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Units received this week</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{totalDispatched}</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Units dispatched</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                <span>✓</span> Net {netMovement >= 0 ? `+${netMovement}` : netMovement} units
              </div>
            </div>
          </div>

          {/* Right Column - Stock Health & Quick Access Grid (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-8 h-full">
            
            {/* Stock Health circular progress Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl flex-1 flex flex-col justify-between">
              <div className="absolute -top-[1px] left-10 right-10 h-[] bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-neon-cyan opacity-30 dark:opacity-60 pointer-events-none"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Stock Health</h2>
              
              <div className="flex items-center justify-between gap-6 mt-6">
                
                {/* SVG Circular Progress Ring */}
                <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="28"
                      stroke="#ECEFF8"
                      strokeWidth="6.5"
                      fill="transparent"
                      className="dark:stroke-slate-800/60"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="28"
                      stroke="#6366f1"
                      strokeWidth="6.5"
                      fill="transparent"
                      strokeDasharray="175.93"
                      strokeDashoffset={175.93 * (1 - inStockCount / totalProductsVal)}
                      strokeLinecap="round"
                      className="transition-all duration-500 dark:stroke-neon-cyan"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{inStockPercentage}%</span>
                  </div>
                </div>

                {/* Stock Legend List */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>In Stock</span>
                    </div>
                    <span className="font-extrabold text-slate-850 dark:text-slate-200">{inStockCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Low Stock</span>
                    </div>
                    <span className="font-extrabold text-slate-850 dark:text-slate-200">{lowStockCountVal}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                      <span>Out of Stock</span>
                    </div>
                    <span className="font-extrabold text-slate-850 dark:text-slate-200">{outOfStockCountVal}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Access Actions Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl flex-1">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Access</h2>
              
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-5 mb-25">
                
                {/* 1. Inventory (Purple) */}
                <Link
                  to="/inventory"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-all dark:bg-purple-950/20 dark:hover:bg-purple-950/30 dark:border dark:border-purple-900/10 group"
                >
                  <CubeIcon className="w-5 h-5 text-[#7C3AED] dark:text-purple-400 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-400">Inventory</span>
                </Link>

                {/* 2. Low Stock Alerts (Amber with Border) */}
                <Link
                  to="/low-stock-alerts"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFDF5] hover:bg-[#FEF9E7] border border-amber-200 hover:border-amber-300 transition-all dark:bg-amber-950/20 dark:hover:bg-amber-950/30 dark:border-amber-500/20 group animate-pulse"
                >
                  <ExclamationTriangleIcon className="w-5 h-5 text-[#D97706] dark:text-amber-400 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#D97706] dark:text-amber-400">Low Stock Alerts</span>
                </Link>

                {/* 3. Purchase Orders (Blue) */}
                <Link
                  to="/inventory"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-all dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:border dark:border-blue-900/10 group"
                >
                  <ShoppingCartIcon className="w-5 h-5 text-[#2563EB] dark:text-blue-400 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400">Purchase Orders</span>
                </Link>

                {/* 4. Suppliers (Green) */}
                <Link
                  to="/inventory"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-all dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 dark:border dark:border-emerald-900/10 group"
                >
                  <TruckIcon className="w-5 h-5 text-[#059669] dark:text-emerald-450 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#059669] dark:text-emerald-450">Suppliers</span>
                </Link>

                {/* 5. Stock History (Purple) */}
                <Link
                  to="/stock-history"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#F3E8FF] transition-all dark:bg-purple-950/20 dark:hover:bg-purple-950/30 dark:border dark:border-purple-900/10 group"
                >
                  <ClockIcon className="w-5 h-5 text-[#8B5CF6] dark:text-purple-400 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#8B5CF6] dark:text-purple-400">Stock History</span>
                </Link>

                {/* 6. Products (Blue) */}
                <Link
                  to="/inventory-products"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F0F9FF] hover:bg-[#E0F2FE] transition-all dark:bg-sky-950/20 dark:hover:bg-sky-950/30 dark:border dark:border-sky-900/10 group"
                >
                  <CubeIcon className="w-5 h-5 text-[#0284C7] dark:text-sky-400 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold text-[#0284C7] dark:text-sky-400">Products</span>
                </Link>

              </div>
            </div>

          </div>

        </div>

        {/* Recent Adjustments Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Adjustments</h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Last 7 stock movements</p>
            </div>
            <Link 
              to="/stock-history" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#7C3AED] hover:text-purple-700 dark:text-neon-cyan dark:hover:text-neon-pink transition-colors group"
            >
              View history 
              <span className="text-base transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-800/30">
            
            {/* Adjustment 1 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 transform scale-x-[-1] rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Bluetooth Headphones Pro</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Purchase Order Received · Marcus Webb</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+80</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Dec</span>
              </div>
            </div>

            {/* Adjustment 2 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 transform scale-x-[-1] rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Wireless Ergonomic Mouse</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Damaged Goods Write-off · Sam Okafor</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-450">-6</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Dec</span>
              </div>
            </div>

            {/* Adjustment 3 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 transform scale-x-[-1] rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">HDMI Cable 2m Braided</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Damaged Goods Write-off · Marcus Webb</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-450">-4</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Dec</span>
              </div>
            </div>

            {/* Adjustment 4 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 transform scale-x-[-1] rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">LED Desk Lamp Smart</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Purchase Order Received · Sam Okafor</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+50</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Dec</span>
              </div>
            </div>

            {/* Adjustment 5 */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 transform scale-x-[-1] rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Laptop Stand Aluminum</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Customer Order Fulfilled · Marcus Webb</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-450">-12</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Dec</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

