import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { useTheme } from '../../Context/ThemeContext'
import { useNotifications } from '../../Context/NotificationContext'
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  UserCircleIcon,
  SunIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'

const PAGE_TITLES = {
  '/inventory-dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/inventory-products': 'Products',
  '/stock-adjustments': 'Stock Adjustments',
  '/stock-history': 'Stock History',
  '/low-stock-alerts': 'Low Stock Alerts',
  '/add-products': 'Add Product',
  '/solopreneur-dashboard': 'Dashboard',
  '/catalogue': 'Catalogue',
  '/customers': 'Customers',
  '/invoice': 'Invoice',
  '/orders': 'Orders',
  '/profile': 'Business Profile',
  '/business-profile': 'Business Profile',
  '/admin-profile': 'Business Profile',
  '/admin-permissions': 'Edit Team Member',
  '/permissions': 'Edit Team Member',
  '/team-permissions': 'Edit Team Member',
  '/business-permissions': 'Edit Team Member',
  '/business-dashboard': 'Dashboard',
  '/business-customers': 'Customers',
  '/business-invoices': 'Invoices',
  '/business-create-receipt': 'Create Receipt',
  '/business-settings': 'Settings',
  '/create-invoice': 'Create Invoice',
  '/business-products': 'Products',
  '/business-create-business':'Profile',
  '/accountant-dashboard': 'Dashboard',
  '/audit': 'Audit',
  '/payments': 'Payments',
  '/reports': 'Reports',
  '/records': 'Records',
  '/sales-dashboard': 'Dashboard',
  '/notifications': 'Notifications',
  '/sales-receipt': 'Receipt',
  '/sales-sales': 'Sales',
  '/sales-stocks': 'Stocks',
  '/admin-dashboard': 'Dashboard',
}

const notificationCategoryStyles = {
  success: {
    card: 'dark:bg-emerald-950/20 dark:border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  failed: {
    card: 'dark:bg-rose-950/20 dark:border-rose-500/20',
    dot: 'bg-rose-500',
  },
  danger: {
    card: 'dark:bg-rose-950/20 dark:border-rose-500/20',
    dot: 'bg-rose-500',
  },
  deposit: {
    card: 'dark:bg-[#8B7CF6]/10 dark:border-[#8B7CF6]/20',
    dot: 'bg-[#8B7CF6]',
  },
  purchase: {
    card: 'dark:bg-blue-950/20 dark:border-blue-500/20',
    dot: 'bg-[#60A5FA]',
  },
  warning: {
    card: 'dark:bg-amber-950/20 dark:border-amber-500/20',
    dot: 'bg-amber-500',
  },
  info: {
    card: 'dark:bg-blue-950/20 dark:border-blue-500/20',
    dot: 'bg-blue-500',
  },
}

const formatRole = (role) =>
  role
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const Topbar = ({ onMenuClick }) => {
  const { currentUser, getInitials, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { pathname } = useLocation()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard'
  const userName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || currentUser?.name || 'User'
  const role = formatRole(currentUser?.role || 'user')

  const initials = useMemo(() => getInitials(userName), [getInitials, userName])
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Extract top 4 unread notifications
  const topUnreadNotifications = useMemo(() => {
    const unread = notifications.filter((n) => !n.read)
    if (unread.length > 0) {
      return unread.slice(0, 4)
    }
    // If no unread, return top 4 recent notifications
    return notifications.slice(0, 4)
  }, [notifications])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 font-sans shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur transition-colors duration-200 dark:border-[#272D35] dark:bg-[#111418]/95 md:px-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-[#7f5cff]/50 hover:bg-violet-50 dark:border-[#272D35] dark:bg-[#171B21] dark:text-[#A1A7B0] dark:hover:border-[#8B7CF6]/50 dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6] md:hidden"
            aria-label="Open sidebar menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <h1 className="min-w-0 max-w-[160px] sm:max-w-[240px] md:max-w-[320px] truncate text-base sm:text-lg font-extrabold text-slate-950 dark:text-[#F3F4F6]">
            {pageTitle}
          </h1>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-4">
          <label className="hidden h-10 w-full max-w-[320px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-slate-400 transition-colors duration-200 focus-within:border-[#8B7CF6] focus-within:ring-2 focus-within:ring-[#8B7CF6]/20 dark:border-[#272D35] dark:bg-[#0F1216] dark:text-[#6F7782] dark:focus-within:border-[#8B7CF6] dark:focus-within:ring-[#8B7CF6]/20 sm:flex">
            <MagnifyingGlassIcon className="h-4 w-4 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-[#F3F4F6] dark:placeholder:text-[#6F7782]"
            />
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#7f5cff] shadow-sm transition-all duration-200 hover:border-[#7f5cff]/50 hover:bg-violet-50 dark:border-[#272D35] dark:bg-[#171B21] dark:text-[#8B7CF6] dark:hover:border-[#8B7CF6]/50 dark:hover:bg-[#1D2229]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon className="h-4.5 w-4.5" /> : <MoonIcon className="h-4.5 w-4.5" />}
          </button>

          {/* Bell Notifications Toggle */}
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-[#7f5cff] dark:text-[#A1A7B0] dark:hover:border-[#272D35] dark:hover:bg-[#171B21] dark:hover:text-[#8B7CF6]"
            aria-label="Open notifications"
            title="View Notifications"
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B7CF6] px-1 text-[10px] font-extrabold text-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex h-10 max-w-[180px] flex-shrink-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 text-left shadow-sm transition-all duration-200 hover:border-[#7f5cff]/40 hover:bg-slate-50 dark:border-[#272D35] dark:bg-[#171B21] dark:hover:border-[#8B7CF6]/40 dark:hover:bg-[#1D2229]"
            aria-label="Open profile menu"
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B7CF6] to-[#6366F1] text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-xs font-semibold capitalize text-slate-800 dark:text-[#F3F4F6]">
                {role}
              </span>
              <span className="block truncate text-[11px] font-normal text-slate-400 dark:text-[#6F7782]">
                {userName}
              </span>
            </span>
            <ChevronDownIcon className="hidden h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-[#6F7782] sm:block" />
          </button>
        </div>
      </header>

      {/* Top 4 Unread Notifications Modal Dropdown */}
      {isNotificationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/60 px-4 py-16 backdrop-blur-sm sm:px-8"
          role="presentation"
          onMouseDown={() => setIsNotificationOpen(false)}
        >
          <section
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-colors duration-200 dark:border-[#272D35] dark:bg-[#171B21] dark:text-[#F3F4F6]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#272D35]">
              <div>
                <h2 id="notifications-title" className="text-base font-extrabold text-slate-950 dark:text-[#F3F4F6]">
                  Notifications
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-[#A1A7B0]">
                  {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="text-xs font-bold text-[#8B7CF6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6]"
                  aria-label="Close notifications"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
              {topUnreadNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  No unread notifications.
                </div>
              ) : (
                topUnreadNotifications.map((notification) => {
                  const categoryStyle = notificationCategoryStyles[notification.type] || notificationCategoryStyles.info
                  return (
                    <article
                      key={notification.id || notification._id}
                      onClick={() => markAsRead(notification.id || notification._id)}
                      className={`flex gap-3 rounded-xl p-3 border border-slate-100/70 dark:border-slate-800/60 cursor-pointer transition hover:bg-slate-50 dark:bg-[#111418] dark:hover:bg-[#1D2229] ${categoryStyle.card}`}
                    >
                      <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${categoryStyle.dot}`}></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {notification.title}
                          </h3>
                          <span className="flex-shrink-0 text-[11px] font-medium text-slate-400 dark:text-[#6F7782]">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-[#A1A7B0]">
                          {notification.message}
                        </p>
                      </div>
                    </article>
                  )
                })
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-[#272D35] p-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(false)
                  navigate('/notifications')
                }}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-[#8B7CF6] bg-purple-50 dark:bg-neon-purple/10 hover:bg-purple-100 dark:hover:bg-neon-purple/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View all notifications</span>
                <span>→</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* User Profile Modal Dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/60 px-2 py-3 backdrop-blur-sm sm:px-8"
          role="presentation"
          onMouseDown={() => setIsProfileOpen(false)}
        >
          <section
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#272D35] dark:bg-[#171B21]"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#272D35]">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                  {userName}
                </h2>

                <p className="text-xs font-medium text-slate-500 dark:text-[#A1A7B0]">
                  {role}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6]"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {/* MENU */}
            <div className="p-2 space-y-1">
              {/* PROFILE */}
              <button
                onClick={() => {
                  setIsProfileOpen(false)
                  navigate('/profile')
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-[#A1A7B0] dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6]"
              >
                <UserCircleIcon className="h-4 w-4 text-slate-500 dark:text-[#6F7782]" />
                Profile
              </button>

              {/* SETTINGS */}
              <button
                onClick={() => {
                  setIsProfileOpen(false)
                  navigate('/business-settings')
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-[#A1A7B0] dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6]"
              >
                <Cog6ToothIcon className="h-4 w-4 text-slate-500 dark:text-[#6F7782]" />
                Settings
              </button>

              {/* DIVIDER */}
              <div className="my-1 border-t border-slate-100 dark:border-[#272D35]" />

              {/* LOGOUT */}
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Topbar
