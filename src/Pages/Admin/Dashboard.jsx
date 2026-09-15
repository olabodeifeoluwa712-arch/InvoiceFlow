import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { useTheme } from '../../Context/ThemeContext'
import { formatStockValue, getNameInitials } from '../../utils/formatter'
import { getAllUsers } from '../../api/superadmin.api'
import {
  UsersIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ComputerDesktopIcon,
  CommandLineIcon,
  UserGroupIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ACCOUNT_KEY = 'invoiceflow'

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
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5b4cdb] via-[#6d5ce8] to-[#4f8ef7] p-6 md:p-8 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-8">
        <div className="flex-1 flex flex-col justify-between min-h-[190px]">
          <div>
            <p className="text-sm font-semibold text-white/70 mb-2">{formatHeroDate()}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {firstName}{' '}
              <span className="inline-block" aria-hidden>
                👋
              </span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium mt-2 max-w-md">
              Platform administration and user access control overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 pt-6 border-t border-white/20">
            <div>
              <p className="text-lg font-extrabold text-white">{formatCurrency(stats.totalProfits)}</p>
              <p className="text-xs font-semibold text-white/70">Total Profits</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">+24.8%</p>
              <p className="text-xs font-semibold text-white/70">Platform Growth</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">{stats.totalUsers}</p>
              <p className="text-xs font-semibold text-white/70">Total Users</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">{stats.activeUsers}</p>
              <p className="text-xs font-semibold text-white/70">Active Now</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">100%</p>
              <p className="text-xs font-semibold text-white/70">System Health</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-4 lg:w-[220px] flex-shrink-0">
          <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-5 py-4 min-w-[140px]">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Platform MRR</p>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              {formatCurrency(84500)}
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-5 py-4 min-w-[140px]">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Connected Nodes</p>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">4 / 4 Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const platformGrowthData = [
  { month: 'Jan', revenue: 42000, users: 14 },
  { month: 'Feb', revenue: 48000, users: 22 },
  { month: 'Mar', revenue: 52000, users: 35 },
  { month: 'Apr', revenue: 58000, users: 48 },
  { month: 'May', revenue: 54000, users: 62 },
  { month: 'Jun', revenue: 65000, users: 80 },
  { month: 'Jul', revenue: 70000, users: 95 },
  { month: 'Aug', revenue: 76000, users: 110 },
  { month: 'Sep', revenue: 82000, users: 134 },
  { month: 'Oct', revenue: 90000, users: 155 },
  { month: 'Nov', revenue: 105000, users: 180 },
  { month: 'Dec', revenue: 115000, users: 210 },
]

const roleColors = {
  superadmin: 'bg-purple-100 text-purple-600 dark:bg-neon-purple/15 dark:text-neon-purple',
  admin: 'bg-indigo-100 text-indigo-600 dark:bg-neon-cyan/15 dark:text-neon-cyan',
  inventory: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  accountant: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  sales: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  manager: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400',
  viewer: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  user: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

function RevenueOverviewChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const revenueStroke = isDark ? '#a78bfa' : '#8B5CF6'
  const usersStroke = isDark ? '#38bdf8' : '#0ea5e9'

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full h-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Platform Analytics</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Platform Revenue & User Growth</p>
        </div>
        <div className="flex items-center gap-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] dark:bg-purple-400" />
            Revenue ($)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9] dark:bg-sky-400" />
            Active Users
          </span>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={platformGrowthData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueStroke} stopOpacity={0.25} />
                <stop offset="95%" stopColor={revenueStroke} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="adminUsersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={usersStroke} stopOpacity={0.2} />
                <stop offset="95%" stopColor={usersStroke} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#1e293b' : '#F1F5F9'} />
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
              formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value) : value,
                name === 'revenue' ? 'Revenue' : 'User Base',
              ]}
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchUsersData = async () => {
      try {
        const response = await getAllUsers()
        if (mounted && response?.success && Array.isArray(response.data)) {
          setUsersList(response.data)
        }
      } catch (e) {
        console.error('Failed to load superadmin users for dashboard:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchUsersData()
    return () => {
      mounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const accounts = usersList.length > 0
      ? usersList
      : (() => {
          try {
            return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]')
          } catch {
            return []
          }
        })()

    const roleCounts = accounts.reduce((acc, user) => {
      let roleName = (user.role || 'viewer').toLowerCase().trim()
      if (roleName === 'superadmin') roleName = 'accountant'
      acc[roleName] = (acc[roleName] || 0) + 1
      return acc
    }, {})

    // Standard fallback if no accounts loaded yet
    if (Object.keys(roleCounts).length === 0) {
      roleCounts['admin'] = 2
      roleCounts['accountant'] = 2
      roleCounts['inventory'] = 1
    }

    const totalUsers = Math.max(accounts.length, 5)
    const activeUsers = accounts.filter(u => u.status !== 'Inactive' && u.isActive !== false).length || totalUsers

    const recentUsers = [...accounts]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

    return {
      totalUsers,
      activeUsers,
      roleCounts,
      uniqueRolesCount: Object.keys(roleCounts).length,
      recentUsers: recentUsers.length > 0 ? recentUsers : [
        { name: 'Sarah Johnson', email: 'sarah@acmecorp.com', role: 'accountant' },
        { name: 'Marcus Lee', email: 'marcus@acmecorp.com', role: 'admin' },
        { name: 'Priya Patel', email: 'priya@acmecorp.com', role: 'inventory' },
        { name: 'Tom Rivera', email: 'tom@acmecorp.com', role: 'accountant' },
        { name: 'Aisha Okonkwo', email: 'aisha@acmecorp.com', role: 'viewer' },
      ],
    }
  }, [usersList])

  const roleEntries = Object.entries(stats.roleCounts).sort((a, b) => b[1] - a[1])
  const maxRoleCount = Math.max(...roleEntries.map(([, c]) => c), 1)

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-5 md:p-8 font-sans overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <HeroBanner firstName={currentUser?.firstName || currentUser?.name || 'Super Admin'} stats={stats} />

        {/* 4 CORE PLATFORM METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            icon={UsersIcon}
            iconBg="bg-purple-100 dark:bg-neon-purple/15"
            iconColor="text-purple-600 dark:text-neon-purple"
            title="Total Registered Users"
            subtext="Platform members count"
            value={stats.totalUsers.toLocaleString()}
            trend={14.2}
          />
          <MetricCard
            icon={ComputerDesktopIcon}
            iconBg="bg-teal-100 dark:bg-emerald-500/15"
            iconColor="text-teal-600 dark:text-emerald-400"
            title="Active Sessions"
            subtext="Currently authenticated"
            value={stats.activeUsers.toLocaleString()}
            trend={8.5}
          />
          <MetricCard
            icon={ShieldCheckIcon}
            iconBg="bg-blue-100 dark:bg-neon-cyan/15"
            iconColor="text-blue-600 dark:text-neon-cyan"
            title="Security Roles Defined"
            subtext="Granular permissions"
            value={String(stats.uniqueRolesCount)}
            trend={0}
            trendLabel="Stable"
          />
          <MetricCard
            icon={ArrowTrendingUpIcon}
            iconBg="bg-fuchsia-100 dark:bg-fuchsia-500/15"
            iconColor="text-fuchsia-600 dark:text-fuchsia-400"
            title="Platform Growth"
            subtext="Monthly ARR Expansion"
            value="+24.8%"
            trend={24.8}
          />
        </div>

        {/* ANALYTICS & ROLE DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          <div className="lg:col-span-8 w-full min-h-[380px]">
            <RevenueOverviewChart />
          </div>

          <div className="lg:col-span-4 w-full">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full h-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl flex flex-col justify-between">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Users by Role
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-5">
                  Platform access level allocation
                </p>
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
                          style={{ width: `${Math.max((count / maxRoleCount) * 100, 15)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-6">
                <Link
                  to="/admin-permissions"
                  className="flex items-center justify-between text-xs font-bold text-neon-purple dark:text-neon-cyan hover:underline"
                >
                  <span>Manage Role Permissions</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: RECENT SIGN-UPS & QUICK ACCESS SHORTCUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RECENT SIGNUPS */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Recent Sign-ups & Team
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Latest registered accounts
                  </p>
                </div>
                <Link
                  to="/admin-management"
                  className="text-xs font-bold text-neon-purple dark:text-neon-cyan hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {stats.recentUsers.map((user, idx) => {
                  const roleKey = (user.role || 'user').toLowerCase().trim()
                  const userName =
                    user.name ||
                    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
                    user.email?.split('@')[0] ||
                    'User'

                  return (
                    <div
                      key={user.id || user._id || idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-[#7f5cff] to-[#a45cff] text-white dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
                          {getNameInitials(userName)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {userName}
                          </h4>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold truncate max-w-[200px] block mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                          roleColors[roleKey] || roleColors.user
                        }`}
                      >
                        {user.role || 'user'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ADMIN SHORTCUTS */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 w-full relative overflow-hidden transition-all duration-300 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-neon-purple opacity-30 dark:opacity-60" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Admin Control Center
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-5">
                Quick operational shortcuts
              </p>

              <div className="grid grid-cols-2 gap-3.5">
                <Link
                  to="/admin-management"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-all dark:bg-purple-950/20 dark:hover:bg-purple-950/30 dark:border dark:border-purple-900/20 group"
                >
                  <UserGroupIcon className="w-6 h-6 text-[#7C3AED] dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-400 text-center">
                    Team Management
                  </span>
                </Link>

                <Link
                  to="/admin-permissions"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-all dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:border dark:border-blue-900/20 group"
                >
                  <KeyIcon className="w-6 h-6 text-[#2563EB] dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 text-center">
                    Permissions
                  </span>
                </Link>

                <Link
                  to="/admin-integrations"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-all dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 dark:border dark:border-emerald-900/20 group"
                >
                  <CommandLineIcon className="w-6 h-6 text-[#059669] dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#059669] dark:text-emerald-400 text-center">
                    Integrations
                  </span>
                </Link>

                <Link
                  to="/admin-profile"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFF7ED] hover:bg-[#FFEDD5] transition-all dark:bg-amber-950/20 dark:hover:bg-amber-950/30 dark:border dark:border-amber-900/20 group"
                >
                  <Cog6ToothIcon className="w-6 h-6 text-[#D97706] dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#D97706] dark:text-amber-400 text-center">
                    Settings & Profile
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
