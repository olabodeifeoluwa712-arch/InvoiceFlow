import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { useTheme } from '../../Context/ThemeContext'
import { formatStockValue, getNameInitials } from '../../utils/formatter'
import {
  invoices as invoiceData,
  customers,
  products,
} from '../../Database/data.json'
import {
  UsersIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  CubeIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
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

const ACCOUNT_KEY = 'invoiceflow'

const parseAmount = (value) => {
  if (typeof value === 'number') return value
  return Number(String(value).replace(/[^0-9.-]/g, '')) || 0
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const formatHeroDate = () => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function TrendBadge({ value, label, positiveIsGood = true }) {
  const isPositive = value >= 0
  const isGood = positiveIsGood ? isPositive : !isPositive
  const display =
    typeof value === 'number' && !Number.isInteger(value)
      ? `${value > 0 ? '+' : ''}${value}%`
      : `${value > 0 ? '+' : ''}${value}`

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
        isGood
          ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
          : 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
      }`}
    >
      {label ?? display}
    </span>
  )
}

function MetricCard({ icon: Icon, iconBg, iconColor, title, value, subtext, trend, trendLabel, positiveIsGood }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-md dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
        </div>
        {trend != null && (
          <TrendBadge value={trend} label={trendLabel} positiveIsGood={positiveIsGood} />
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{title}</p>
        {subtext && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{subtext}</p>
        )}
      </div>
    </div>
  )
}

function HeroBanner({ firstName, stats }) {
  const openInvoices = stats.pendingCount + stats.overdueCount
  const teamActive = stats.totalUsers
  const teamCapacity = Math.max(teamActive, 5)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5b4cdb] via-[#6d5ce8] to-[#4f8ef7] p-6 md:p-8 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-8">
        <div className="flex-1 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-sm font-semibold text-white/70 mb-2">{formatHeroDate()}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {firstName}{' '}
              <span className="inline-block" aria-hidden>
                👋
              </span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium mt-2 max-w-md">
              Business operations are running smoothly today.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 pt-6 border-t border-white/20">
            <div>
              <p className="text-lg font-extrabold text-white">+18.4%</p>
              <p className="text-xs font-semibold text-white/70">Revenue Growth</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">{stats.lowStockCount}</p>
              <p className="text-xs font-semibold text-white/70">SKUs Low Stock</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">
                {teamActive}/{teamCapacity}
              </p>
              <p className="text-xs font-semibold text-white/70">Team Active</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">{stats.overdueCount}</p>
              <p className="text-xs font-semibold text-white/70">Overdue Invoices</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-4 lg:w-[220px] flex-shrink-0">
          <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-5 py-4 min-w-[140px]">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Revenue Today</p>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {formatCurrency(stats.revenueToday)}
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-5 py-4 min-w-[140px]">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Open Invoices</p>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{openInvoices}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const revenueExpensesData = [
  { month: 'Jan', revenue: 42000, expenses: 31000 },
  { month: 'Feb', revenue: 48000, expenses: 34000 },
  { month: 'Mar', revenue: 52000, expenses: 36000 },
  { month: 'Apr', revenue: 58000, expenses: 39000 },
  { month: 'May', revenue: 54000, expenses: 41000 },
  { month: 'Jun', revenue: 65000, expenses: 43000 },
  { month: 'Jul', revenue: 70000, expenses: 45000 },
  { month: 'Aug', revenue: 76000, expenses: 48000 },
  { month: 'Sep', revenue: 82000, expenses: 50000 },
  { month: 'Oct', revenue: 90000, expenses: 52000 },
  { month: 'Nov', revenue: 105000, expenses: 55000 },
  { month: 'Dec', revenue: 115000, expenses: 58000 },
]

const INVOICE_STATUS_COLORS = {
  Paid: '#10B981',
  Pending: '#F59E0B',
  Overdue: '#E11D48',
  Draft: '#94A3B8',
}

const INVOICE_STATUS_ORDER = ['Paid', 'Pending', 'Overdue', 'Draft']

const roleColors = {
  business: 'bg-purple-100 text-purple-600 dark:bg-neon-purple/10 dark:text-neon-cyan',
  admin: 'bg-indigo-100 text-indigo-600 dark:bg-neon-purple/10 dark:text-neon-purple',
  inventory: 'bg-blue-100 text-blue-600 dark:bg-neon-cyan/10 dark:text-neon-cyan',
  accountant: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  solopreneur: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-neon-pink/10 dark:text-neon-pink',
  sales: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  user: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

function RevenueOverviewChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const revenueStroke = isDark ? '#a78bfa' : '#8B5CF6'
  const expensesStroke = isDark ? '#60a5fa' : '#3B82F6'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full h-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Revenue Overview</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Revenue vs Expenses — 2024</p>
        </div>
        <div className="flex items-center gap-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] dark:bg-purple-400" />
            Revenue
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6] dark:bg-blue-400" />
            Expenses
          </span>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueExpensesData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueStroke} stopOpacity={0.2} />
                <stop offset="95%" stopColor={revenueStroke} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="adminExpensesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={expensesStroke} stopOpacity={0.15} />
                <stop offset="95%" stopColor={expensesStroke} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? 'transparent' : '#F1F5F9'} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(v) => formatStockValue(v)}
              domain={[0, 120000]}
              ticks={[0, 30000, 60000, 90000, 120000]}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0e1320' : '#ffffff',
                border: isDark ? '1px solid #1f2937' : '1px solid #F1F5F9',
                borderRadius: '12px',
                boxShadow: isDark ? '0 20px 35px rgba(0, 0, 0, 0.35)' : '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                color: isDark ? '#F8FAFC' : '#0F172A',
                padding: '12px',
              }}
              formatter={(value, name) => [formatStockValue(value), name === 'revenue' ? 'Revenue' : 'Expenses']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={revenueStroke}
              strokeWidth={2.5}
              fill="url(#adminRevenueFill)"
              dot={false}
              activeDot={{ r: 5, fill: revenueStroke, stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={expensesStroke}
              strokeWidth={2.5}
              fill="url(#adminExpensesFill)"
              dot={false}
              activeDot={{ r: 5, fill: expensesStroke, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function InvoiceStatusChart({ statusBreakdown }) {
  const ordered = INVOICE_STATUS_ORDER.map((name) =>
    statusBreakdown.find((d) => d.name === name) ?? {
      name,
      value: 0,
      percent: 0,
      color: INVOICE_STATUS_COLORS[name],
    }
  )
  const chartData = ordered.filter((d) => d.value > 0)
  const pieData = chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1, color: '#E2E8F0' }]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-6 w-full h-full flex flex-col transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
      <header className="mb-1">
        <h2 className="text-[17px] font-bold text-[#0F172A] tracking-tight dark:text-slate-100">
          Invoice Status
        </h2>
        <p className="text-[13px] text-[#64748B] font-normal mt-0.5 dark:text-slate-500">
          Distribution by status
        </p>
      </header>

      <div className="flex-1 flex items-center gap-2 sm:gap-4 min-h-[240px] mt-4">
        <div className="w-[48%] max-w-[200px] aspect-square flex-shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={chartData.length > 1 ? 3 : 0}
                stroke="transparent"
                strokeWidth={chartData.length > 1 ? 4 : 0}
                isAnimationActive
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 flex flex-col justify-center gap-[18px] py-2 min-w-0">
          {ordered.map((item) => (
            <li key={item.name} className="flex items-center w-full gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="h-[9px] w-[9px] rounded-full flex-shrink-0 ring-2 ring-white dark:ring-slate-900"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span className="text-[13px] font-medium text-[#64748B] truncate dark:text-slate-400">
                  {item.name}
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#0F172A] tabular-nums flex-shrink-0 dark:text-slate-100">
                {item.percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { currentUser } = useAuth()
  const stats = useMemo(() => {
    const accounts = (() => {
      try {
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]')
      } catch {
        return []
      }
    })()

    const roleCounts = accounts.reduce((acc, user) => {
      const key = (user.role || 'user').toLowerCase().replace(/[\s_-]/g, '')
      const normalized = key === 'soloprenuer' ? 'solopreneur' : key
      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {})

    const invoiceList = [...invoiceData]
    const totalInvoiceValue = invoiceList.reduce((sum, inv) => sum + parseAmount(inv.amount), 0)
    const pendingCount = invoiceList.filter((i) => i.status === 'Pending').length
    const overdueCount = invoiceList.filter((i) => i.status === 'Overdue').length
    const paidCount = invoiceList.filter((i) => i.status === 'Paid').length
    const lowStockCount = products.filter((p) =>
      ['low stock', 'out of stock'].includes(String(p.status).toLowerCase())
    ).length
    const recentInvoices = invoiceList.slice(-5).reverse()

    const recentUsers = [...accounts]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

    const outstandingPayments = invoiceList
      .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
      .reduce((sum, inv) => sum + parseAmount(inv.amount), 0)

    const inventoryValue = products.reduce(
      (sum, p) => sum + Number(p.unitPrice || 0) * Number(p.qty || 0),
      0
    )

    const paidToday = invoiceList
      .filter((i) => i.status === 'Paid')
      .reduce((sum, inv) => sum + parseAmount(inv.amount), 0)
    const revenueToday = paidToday > 0 ? Math.round(paidToday / 6) : 12840

    const monthlyProfit = Math.round(totalInvoiceValue * 0.24)

    const statusCounts = { Paid: 0, Pending: 0, Overdue: 0, Draft: 0 }
    invoiceList.forEach((inv) => {
      const key = ['Paid', 'Pending', 'Overdue'].includes(inv.status) ? inv.status : 'Draft'
      statusCounts[key] += 1
    })
    const invoiceTotal = invoiceList.length || 1
    const invoiceStatusBreakdown = INVOICE_STATUS_ORDER.map((name) => ({
      name,
      value: statusCounts[name],
      percent: Math.round((statusCounts[name] / invoiceTotal) * 100),
      color: INVOICE_STATUS_COLORS[name],
    }))

    return {
      totalUsers: accounts.length,
      roleCounts,
      totalCustomers: customers.length,
      totalProducts: products.length,
      totalInvoiceValue,
      activeInvoices: invoiceList.length,
      pendingCount,
      overdueCount,
      paidCount,
      systemAlerts: lowStockCount + overdueCount,
      lowStockCount,
      recentInvoices,
      recentUsers,
      outstandingPayments,
      inventoryValue,
      revenueToday,
      monthlyProfit,
      skuCount: products.length,
      invoiceStatusBreakdown,
    }
  }, [])

  const roleEntries = Object.entries(stats.roleCounts).sort((a, b) => b[1] - a[1])
  const maxRoleCount = Math.max(...roleEntries.map(([, c]) => c), 1)

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-5 md:p-8 font-sans overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <HeroBanner firstName={currentUser?.firstName || 'Admin'} stats={stats} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard
            icon={BanknotesIcon}
            iconBg="bg-purple-100 dark:bg-neon-purple/15"
            iconColor="text-purple-600 dark:text-neon-purple"
            title="Total Revenue"
            subtext="vs last month"
            value={formatCurrency(stats.totalInvoiceValue)}
            trend={18.4}
          />
          <MetricCard
            icon={ClockIcon}
            iconBg="bg-amber-100 dark:bg-amber-500/15"
            iconColor="text-amber-600 dark:text-amber-400"
            title="Outstanding Payments"
            subtext={`${stats.pendingCount + stats.overdueCount} invoices pending`}
            value={formatCurrency(stats.outstandingPayments)}
            trend={-6.2}
            positiveIsGood={false}
          />
          <MetricCard
            icon={UsersIcon}
            iconBg="bg-teal-100 dark:bg-emerald-500/15"
            iconColor="text-teal-600 dark:text-emerald-400"
            title="Active Customers"
            subtext={`${Math.min(stats.totalCustomers, 63)} new this month`}
            value={stats.totalCustomers.toLocaleString()}
            trend={9.1}
          />
          <MetricCard
            icon={CubeIcon}
            iconBg="bg-blue-100 dark:bg-neon-cyan/15"
            iconColor="text-blue-600 dark:text-neon-cyan"
            title="Inventory Value"
            subtext={`${stats.skuCount.toLocaleString()} SKUs tracked`}
            value={formatCurrency(stats.inventoryValue)}
            trend={4.7}
          />
          <MetricCard
            icon={ExclamationCircleIcon}
            iconBg="bg-rose-100 dark:bg-neon-pink/15"
            iconColor="text-rose-500 dark:text-neon-pink"
            title="Pending Invoices"
            subtext="Requires attention"
            value={String(stats.pendingCount + stats.overdueCount)}
            trend={stats.pendingCount}
            trendLabel={`+${stats.pendingCount}`}
            positiveIsGood={false}
          />
          <MetricCard
            icon={ArrowTrendingUpIcon}
            iconBg="bg-fuchsia-100 dark:bg-fuchsia-500/15"
            iconColor="text-fuchsia-600 dark:text-fuchsia-400"
            title="Monthly Profit"
            subtext="After expenses & tax"
            value={formatCurrency(stats.monthlyProfit)}
            trend={22.9}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          <div className="lg:col-span-8 w-full min-h-[380px]">
            <RevenueOverviewChart />
          </div>
          <div className="lg:col-span-4 w-full min-h-[380px]">
            <InvoiceStatusChart statusBreakdown={stats.invoiceStatusBreakdown} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Users by Role
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-5">
                Distribution across the platform
              </p>
              {roleEntries.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold py-4">
                  No registered users yet. Accounts appear after sign-up.
                </p>
              ) : (
                <div className="space-y-4">
                  {roleEntries.map(([role, count]) => (
                    <div key={role}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="capitalize text-slate-600 dark:text-slate-300">{role}</span>
                        <span className="text-slate-800 dark:text-slate-100 font-extrabold">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-neon-cyan dark:to-neon-purple transition-all duration-500"
                          style={{ width: `${(count / maxRoleCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl h-full">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60 " />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/admin-receipts"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-all dark:bg-purple-950/20 dark:hover:bg-purple-950/30 dark:border dark:border-purple-900/10 group"
                >
                  <ReceiptPercentIcon className="w-5 h-5 text-[#7C3AED] dark:text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-400">Receipts</span>
                </Link>
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-all dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:border dark:border-blue-900/10 group"
                >
                  <ChartBarIcon className="w-5 h-5 text-[#2563EB] dark:text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400">Business</span>
                </Link>
                <Link
                  to="/inventory-dashboard"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-all dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 dark:border dark:border-emerald-900/10 group"
                >
                  <CubeIcon className="w-5 h-5 text-[#059669] dark:text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#059669] dark:text-emerald-400">Inventory</span>
                </Link>
                <Link
                  to="/accountant-dashboard"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFF7ED] hover:bg-[#FFEDD5] transition-all dark:bg-amber-950/20 dark:hover:bg-amber-950/30 dark:border dark:border-amber-900/10 group"
                >
                  <UserGroupIcon className="w-5 h-5 text-[#D97706] dark:text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#D97706] dark:text-amber-400">Finance</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Recent Invoices
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Cross-tenant
              </span>
            </div>
            <div className="space-y-6">
              {stats.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs dark:bg-neon-purple/10 dark:border dark:border-neon-purple/30 dark:text-neon-cyan ${invoice.avatarBg || roleColors.business}`}
                    >
                      {invoice.initials || getNameInitials(invoice.customerName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {invoice.customerName}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        {invoice.invoiceNo}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {typeof invoice.amount === 'string'
                        ? invoice.amount
                        : `$${invoice.amount.toLocaleString()}`}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold mt-1 border ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                          : invoice.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
                            : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-neon-pink/10 dark:text-neon-pink dark:border-neon-pink/30'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Recent Sign-ups
              </h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Latest accounts
              </span>
            </div>
            {stats.recentUsers.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold">
                No users registered yet.
              </p>
            ) : (
              <div className="space-y-6">
                {stats.recentUsers.map((user) => {
                  const roleKey = (user.role || 'user')
                    .toLowerCase()
                    .replace(/[\s_-]/g, '')
                  const normalized = roleKey === 'soloprenuer' ? 'solopreneur' : roleKey
                  return (
                    <div key={user.id || user.email} className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-[#7f5cff] to-[#a45cff] text-white dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
                          {getNameInitials(
                            [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                          </h4>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold truncate max-w-[180px] block">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold border capitalize ${roleColors[normalized] || roleColors.user}`}
                      >
                        {normalized}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
