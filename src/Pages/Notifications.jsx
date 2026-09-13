import React, { useState, useEffect } from 'react'
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeOpenIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useNotifications } from '../Context/NotificationContext'
import { useAuth } from '../Context/AuthContext'

const CATEGORY_ICONS = {
  payments: { icon: CurrencyDollarIcon, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' },
  inventory: { icon: ArchiveBoxIcon, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' },
  security: { icon: ShieldCheckIcon, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/40' },
  sales: { icon: SparklesIcon, color: 'text-[#7C3AED] bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/40' },
  system: { icon: Cog6ToothIcon, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400 border-sky-100 dark:border-sky-900/40' },
}

const TYPE_BADGES = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  info: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
}

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    userRole,
  } = useNotifications()

  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'payments', label: 'Payments & Billing' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'sales', label: 'Sales & Orders' },
    { id: 'security', label: 'Security' },
    { id: 'system', label: 'System' },
  ]

  const filteredNotifications = notifications.filter((n) => {
    // Filter by tab
    if (activeTab === 'unread' && n.read) return false
    if (activeTab !== 'all' && activeTab !== 'unread' && n.category !== activeTab) return false

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const titleMatch = n.title?.toLowerCase().includes(q)
      const msgMatch = n.message?.toLowerCase().includes(q)
      return titleMatch || msgMatch
    }

    return true
  })

  const formatRoleName = (role) => {
    if (!role) return 'User'
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans select-none overflow-hidden transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.35)] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  {unreadCount} Unread
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-neon-purple/15 dark:text-neon-cyan border border-[#7C3AED]/20 dark:border-neon-cyan/20 capitalize">
                {formatRoleName(userRole)} Workspace
              </span>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Stay updated with system updates, transactions, inventory status, and alerts
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <CheckIcon className="w-4 h-4 text-emerald-500" />
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all notifications?')) {
                    clearAllNotifications()
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Search & Tabs Navigation */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-xs text-slate-700 bg-slate-50/80 border border-slate-200/70 rounded-xl outline-none focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10 transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-neon-cyan/40 dark:focus:ring-neon-cyan/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  {unreadCount} Unread
                </span>
              )}
              <span>
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredNotifications.length}</span> of{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">{notifications.length}</span> notifications
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/60 pt-3">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-sm dark:bg-neon-purple dark:text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm dark:bg-cyber-card/85 dark:border-slate-800/80">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <BellIcon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No notifications found</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery
                ? `No notifications matched your search query "${searchQuery}".`
                : activeTab === 'unread'
                ? 'Great job! You have read all your notifications.'
                : 'You have no notifications in this category.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => {
              const categoryConfig = CATEGORY_ICONS[n.category] || CATEGORY_ICONS.system
              const CategoryIcon = categoryConfig.icon
              const typeBadgeClass = TYPE_BADGES[n.type] || TYPE_BADGES.info

              return (
                <div
                  key={n.id}
                  className={`group relative rounded-3xl border p-5 transition-all duration-200 ${
                    !n.read
                      ? 'bg-white dark:bg-cyber-card/90 border-[#7C3AED]/30 dark:border-neon-purple/30 shadow-sm'
                      : 'bg-white/60 dark:bg-cyber-card/40 border-slate-100 dark:border-slate-800/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${categoryConfig.color}`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#7C3AED] dark:bg-neon-cyan animate-pulse"></span>}
                          <h3 className={`font-extrabold text-sm ${!n.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                            {n.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${typeBadgeClass}`}>
                            {n.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">{n.message}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1">{n.time}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      <button
                        onClick={() => (n.read ? markAsUnread(n.id) : markAsRead(n.id))}
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          n.read
                            ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800'
                            : 'border-[#7C3AED]/20 bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 dark:border-neon-cyan/25 dark:bg-neon-purple/15 dark:text-neon-cyan'
                        }`}
                        title={n.read ? 'Mark as unread' : 'Mark as read'}
                        aria-label={n.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {n.read ? <EnvelopeIcon className="w-4 h-4" /> : <EnvelopeOpenIcon className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-rose-500 hover:bg-rose-50 dark:border-slate-800 dark:bg-cyber-card dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
