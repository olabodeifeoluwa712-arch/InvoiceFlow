import { Link } from 'react-router-dom'
import {
  ArrowDownTrayIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ReceiptPercentIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../Context/ThemeContext'

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const compactMoney = (value) => {
  if (value === 0) return '0'
  return `${Math.round(value / 1000)}000`
}

const monthlyRevenue = [
  { month: 'Jan', revenue: 78000, expenses: 30000 },
  { month: 'Feb', revenue: 95000, expenses: 27000 },
  { month: 'Mar', revenue: 112000, expenses: 33000 },
]

const statusData = [
  { name: 'Paid', value: 62, color: '#8B5CF6' },
  { name: 'Pending', value: 21, color: '#F59E0B' },
  { name: 'Overdue', value: 11, color: '#EF4444' },
  { name: 'Draft', value: 6, color: '#CBD5E1' },
]

const metrics = [
  {
    title: 'Total Revenue',
    value: '$284,750',
    subtext: '+12.4%',
    trend: 'good',
    icon: ArrowTrendingUpIcon,
    iconStyle: 'bg-violet-100 text-violet-600 dark:bg-neon-purple/15 dark:text-neon-purple',
  },
  {
    title: 'Outstanding Invoices',
    value: '$47,320',
    detail: '23 invoices',
    icon: ExclamationTriangleIcon,
    iconStyle: 'bg-amber-100 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300',
  },
  {
    title: 'Total Expenses',
    value: '$91,480',
    subtext: '+3.2%',
    trend: 'bad',
    icon: ArrowTrendingDownIcon,
    iconStyle: 'bg-rose-100 text-rose-500 dark:bg-neon-pink/15 dark:text-neon-pink',
  },
  {
    title: 'Net Profit',
    value: '$193,270',
    subtext: '+18.7%',
    trend: 'good',
    icon: WalletIcon,
    iconStyle: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  {
    title: 'Tax Collected',
    value: '$28,640',
    detail: 'Collected this period',
    icon: ReceiptPercentIcon,
    iconStyle: 'bg-violet-100 text-violet-500 dark:bg-neon-purple/15 dark:text-neon-purple',
  },
  {
    title: 'Overdue Payments',
    value: '$14,890',
    subtext: '8 invoices overdue',
    trend: 'bad',
    icon: ClockIcon,
    iconStyle: 'bg-rose-100 text-rose-500 dark:bg-neon-pink/15 dark:text-neon-pink',
  },
]

const recentActivity = [
  {
    title: 'Invoice #INV-2041 marked as Paid',
    amount: '$3,200',
    meta: 'Acme Corp - 2h ago',
    dotStyle: 'bg-emerald-500',
    iconStyle: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: 'Expense receipt uploaded',
    amount: '$840',
    meta: 'Office supplies - 5h ago',
    dotStyle: 'bg-violet-500',
    iconStyle: 'bg-violet-50 text-violet-500 dark:bg-neon-purple/15 dark:text-neon-purple',
    icon: ReceiptPercentIcon,
  },
  {
    title: 'Payment reminder scheduled',
    amount: '$1,450',
    meta: 'Northline Studio - 1d ago',
    dotStyle: 'bg-amber-500',
    iconStyle: 'bg-amber-50 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300',
    icon: ClockIcon,
  },
]

const quickActions = [
  { label: 'Reports', to: '/reports', icon: DocumentChartBarIcon, style: 'bg-violet-600 text-white' },
  { label: 'Payments', to: '/payments', icon: ArrowDownTrayIcon, style: 'bg-indigo-600 text-white' },
  { label: 'Records', to: '/records', icon: DocumentTextIcon, style: 'bg-emerald-500 text-white' },
  { label: 'Audit', to: '/audit', icon: BanknotesIcon, style: 'bg-amber-500 text-white' },
]

function MetricCard({ metric }) {
  const Icon = metric.icon
  const isGood = metric.trend === 'good'

  return (
    <article className="min-h-[132px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{metric.title}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.iconStyle}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100">
        {metric.value}
      </p>

      {metric.subtext ? (
        <span
          className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
            isGood
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-600 dark:bg-neon-pink/15 dark:text-neon-pink'
          }`}
        >
          {metric.subtext}
        </span>
      ) : (
        <p className="mt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">{metric.detail}</p>
      )}
    </article>
  )
}

function RevenueAnalytics() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100">Monthly Revenue Analytics</h2>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-500">
            Revenue vs Expenses - Jan - Mar 2025
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Expenses
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="accountantRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="accountantExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FB7185" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#FB7185" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDark ? '#1F2937' : '#EDEFF4'} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
              tickFormatter={compactMoney}
              ticks={[0, 30000, 60000, 90000, 120000]}
              domain={[0, 120000]}
            />
            <Tooltip
              cursor={{ stroke: isDark ? '#334155' : '#CBD5E1', strokeDasharray: '4 4' }}
              contentStyle={{
                background: isDark ? '#0e1320' : '#ffffff',
                border: isDark ? '1px solid #1f2937' : '1px solid #E2E8F0',
                borderRadius: 12,
                boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)',
                color: isDark ? '#F8FAFC' : '#0F172A',
              }}
              formatter={(value, name) => [money(value), name === 'revenue' ? 'Revenue' : 'Expenses']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fill="url(#accountantRevenue)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#8B5CF6', stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#FB7185"
              strokeWidth={2.2}
              fill="url(#accountantExpenses)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#FB7185', stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function StatusOverview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition-colors duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
      <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100">Invoice Status Overview</h2>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-500">Distribution by status</p>

      <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center gap-5">
        <div className="h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="88%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="transparent"
              >
                {statusData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
          {statusData.map((item) => (
            <span key={item.name} className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name} {item.value}%
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-[#F8F9FC] p-5 font-sans transition-colors duration-300 dark:bg-cyber-dark md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} metric={metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RevenueAnalytics />
          </div>
          <div className="lg:col-span-4">
            <StatusOverview />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100">Recent Financial Activity</h2>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-500">Latest transactions and events</p>
            <div className="mt-5 space-y-4">
              {recentActivity.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${item.dotStyle}`} />
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconStyle}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{item.meta}</p>
                      </div>
                    </div>
                    <p className="flex-shrink-0 text-sm font-extrabold text-slate-900 dark:text-slate-100">{item.amount}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)] dark:border-slate-800/80 dark:bg-cyber-card/85 dark:shadow-2xl">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100">Quick Finance Actions</h2>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-500">Common tasks at a glance</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="group flex min-h-[82px] items-center justify-between rounded-xl bg-slate-50 p-4 no-underline transition hover:bg-slate-100 dark:bg-slate-950/45 dark:hover:bg-slate-900"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.style}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{action.label}</span>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
