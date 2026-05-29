import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../Context/ThemeContext'
import { products } from '../../Database/data.json'
import { formatStockValue } from '../../utils/formatter'
import {
  CubeIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const num = (v) => Number(v) || 0

const movementData = [
  { day: '1', stockIn: 42, stockOut: 28 },
  { day: '5', stockIn: 55, stockOut: 38 },
  { day: '10', stockIn: 38, stockOut: 52 },
  { day: '15', stockIn: 72, stockOut: 45 },
  { day: '20', stockIn: 48, stockOut: 61 },
  { day: '25', stockIn: 65, stockOut: 40 },
  { day: '30', stockIn: 58, stockOut: 35 },
]

const CATEGORY_COLORS = ['#22d3ee', '#a855f7', '#f59e0b', '#ec4899', '#ef4444', '#64748b']

const accentConfig = {
  teal: {
    iconWrap: 'bg-cyan-50 border-cyan-100 shadow-[0_10px_24px_rgba(6,182,212,0.14)] dark:bg-cyan-500/15 dark:border-cyan-500/30 dark:shadow-[0_0_22px_rgba(34,211,238,0.22)]',
    icon: 'text-cyan-600 dark:text-cyan-400',
    badge: 'border border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-transparent dark:bg-cyan-500/15 dark:text-cyan-400',
    border: 'border-slate-200/80 shadow-sm hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-cyan-500/20',
  },
  purple: {
    iconWrap: 'bg-violet-50 border-violet-100 shadow-[0_10px_24px_rgba(124,58,237,0.14)] dark:bg-purple-500/15 dark:border-purple-500/30 dark:shadow-[0_0_22px_rgba(168,85,247,0.22)]',
    icon: 'text-violet-600 dark:text-purple-400',
    badge: 'border border-violet-100 bg-violet-50 text-violet-700 dark:border-transparent dark:bg-purple-500/15 dark:text-purple-400',
    border: 'border-slate-200/80 shadow-sm hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-purple-500/20',
  },
  amber: {
    iconWrap: 'bg-amber-50 border-amber-100 shadow-[0_10px_24px_rgba(245,158,11,0.16)] dark:bg-amber-500/15 dark:border-amber-500/30 dark:shadow-[0_0_22px_rgba(245,158,11,0.22)]',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'border border-amber-100 bg-amber-50 text-amber-700 dark:border-transparent dark:bg-amber-500/15 dark:text-amber-400',
    border: 'border-slate-200/80 shadow-sm hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-amber-500/20',
  },
  rose: {
    iconWrap: 'bg-rose-50 border-rose-100 shadow-[0_10px_24px_rgba(244,63,94,0.14)] dark:bg-rose-500/15 dark:border-rose-500/30 dark:shadow-[0_0_22px_rgba(244,63,94,0.22)]',
    icon: 'text-rose-600 dark:text-rose-400',
    badge: 'border border-rose-100 bg-rose-50 text-rose-700 dark:border-transparent dark:bg-rose-500/15 dark:text-rose-400',
    border: 'border-slate-200/80 shadow-sm hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-rose-500/20',
  },
}

function StatCard({ accent, icon: Icon, badge, value, label, subtext }) {
  const a = accentConfig[accent]
  return (
    <div
      className={`rounded-2xl border bg-white p-5 transition-all dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-xl ${a.border}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${a.iconWrap}`}
        >
          <Icon className={`h-5 w-5 ${a.icon}`} strokeWidth={2} />
        </div>
        {badge && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${a.badge}`}>{badge}</span>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">{label}</p>
      {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtext}</p>}
    </div>
  )
}

function MovementTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg dark:border-slate-800 dark:bg-[#12151c]">
      <p className="font-bold text-slate-800 dark:text-slate-100 mb-1.5">Day {label}</p>
      <p className="text-cyan-500 font-semibold">Stock In: {payload[0]?.value}</p>
      <p className="text-purple-400 font-semibold">Stock Out: {payload[1]?.value}</p>
    </div>
  )
}

function InventoryMovementChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const stockInColor = isDark ? '#22d3ee' : '#06b6d4'
  const stockOutColor = isDark ? '#a855f7' : '#8b5cf6'

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 h-full dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Movement</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Stock In vs Stock Out — last 30 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="h-2 w-4 rounded-full bg-cyan-400" />
            Stock In
          </span>
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="h-2 w-4 rounded-full bg-purple-500" />
            Stock Out
          </span>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={movementData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="stockInFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stockInColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={stockInColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="stockOutFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stockOutColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={stockOutColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#1f2937' : '#f1f5f9'} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
            />
            <Tooltip content={<MovementTooltip />} />
            <Area
              type="monotone"
              dataKey="stockIn"
              stroke={stockInColor}
              strokeWidth={2.5}
              fill="url(#stockInFill)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="stockOut"
              stroke={stockOutColor}
              strokeWidth={2.5}
              fill="url(#stockOutFill)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StockByCategoryChart({ categoryData }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 h-full dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Stock by Category</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Distribution overview</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 min-h-[280px]">
        <ul className="flex-1 w-full space-y-2.5 order-2 sm:order-1">
          {categoryData.map((cat, i) => (
            <li key={cat.name} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name}</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                {cat.percent}%
              </span>
            </li>
          ))}
        </ul>
        <div className="w-full sm:w-[165px] h-[200px] flex-shrink-0 order-1 sm:order-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
                stroke="transparent"
                strokeWidth={3}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const AdminInventory = () => {
  const stats = useMemo(() => {
    const normalized = products.map((p) => ({
      ...p,
      qty: num(p.qty),
      unitCost: num(p.unitCost),
      unitPrice: num(p.unitPrice),
      statusKey: String(p.status).toLowerCase(),
    }))

    const totalProducts = normalized.length
    const totalValue = normalized.reduce((s, p) => s + p.unitCost * p.qty, 0)
    const lowStock = normalized.filter((p) => p.statusKey === 'low stock')
    const outOfStock = normalized.filter((p) => p.statusKey === 'out of stock')

    const categoryMap = normalized.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.qty
      return acc
    }, {})
    const categoryTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1
    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        percent: Math.round((value / categoryTotal) * 100),
      }))
      .sort((a, b) => b.value - a.value)

    const alertRows = [...lowStock, ...outOfStock].map((p) => ({
      ...p,
      reorder: p.statusKey === 'out of stock' ? 50 : 20,
      supplier: p.brand,
    }))

    return {
      totalProducts,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      categoryData,
      alertRows,
    }
  }, [])

  return (
    <div className="relative min-h-full w-full overflow-y-auto bg-[#F8F9FC] p-5 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0a0c10] dark:text-slate-100 md:p-6 lg:p-8">
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] dark:bg-neon-purple/10" />
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] dark:bg-neon-cyan/10" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Inventory Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Real-time stock analytics and warehouse overview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
            <Link to="/add-products">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,31,255,0.35)] transition-transform hover:scale-[1.02] dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950"
              >
                <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            accent="teal"
            icon={CubeIcon}
            badge="+12"
            value={stats.totalProducts.toLocaleString()}
            label="Total Products"
            subtext="+12 this week"
          />
          <StatCard
            accent="purple"
            icon={BanknotesIcon}
            badge="+22.9%"
            value={formatStockValue(stats.totalValue)}
            label="Total Inventory Value"
            subtext="vs last month"
          />
          <StatCard
            accent="amber"
            icon={ExclamationTriangleIcon}
            badge="Warning"
            value={String(stats.lowStockCount)}
            label="Low Stock Alerts"
            subtext="SKUs need reorder"
          />
          <StatCard
            accent="rose"
            icon={XCircleIcon}
            badge="Critical"
            value={String(stats.outOfStockCount)}
            label="Out of Stock"
            subtext="items unavailable"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <InventoryMovementChart />
          </div>
          <div className="lg:col-span-4">
            <StockByCategoryChart categoryData={stats.categoryData} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-xl">
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Low Stock Alerts</h2>
            </div>
            <Link
              to="/low-stock-alerts"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-neon-cyan dark:hover:text-neon-pink"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40">
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                    SKU
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                    Product Name
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider text-center">
                    Stock
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider text-center">
                    Reorder
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider">
                    Supplier
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-400 dark:text-slate-500 uppercase text-xs tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.alertRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                      All SKUs are adequately stocked
                    </td>
                  </tr>
                ) : (
                  stats.alertRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-cyan-600 dark:text-neon-cyan">
                        {row.sku}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{row.name}</td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{row.category}</td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`font-bold ${
                            row.qty === 0
                              ? 'text-rose-500 dark:text-rose-400'
                              : 'text-amber-500 dark:text-amber-400'
                          }`}
                        >
                          {row.qty}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center text-slate-600 dark:text-slate-400">{row.reorder}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.supplier}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="rounded-lg bg-gradient-to-r from-cyan-500/90 to-purple-600/90 px-3 py-1.5 text-xs font-bold text-white dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950"
                        >
                          Reorder
                        </button>
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
  )
}

export default AdminInventory
