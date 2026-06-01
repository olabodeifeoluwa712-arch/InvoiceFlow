import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { useTheme } from '../../Context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  UserCircleIcon,
  SunIcon,
  XMarkIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon,
  ArrowRightEndOnRectangleIcon
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
  '/profile': 'Profile',
  '/business-dashboard': 'Dashboard',
  '/business-customers': 'Customers',
  '/business-invoices': 'Invoices',
  '/business-create-receipt': 'Create Receipt',
  '/business-settings': 'Settings',
  '/create-invoice': 'Create Invoice',
  '/business-products': 'Products',
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
  '/admin-invoices': 'Invoices',
  '/admin-inventory': 'Inventory',
  '/admin-receipts': 'Receipts',
}

const notifications = [
  {
    title: 'New invoice created',
    message: 'Invoice INV-2049 is ready for review.',
    time: '2 min ago',
  },
  {
    title: 'Low stock alert',
    message: 'Premium paper rolls dropped below the reorder point.',
    time: '18 min ago',
  },
  {
    title: 'Payment received',
    message: 'A customer payment has been recorded successfully.',
    time: '1 hr ago',
  },
]
const formatRole = (role) =>
  role
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const Topbar = () => {
  const { currentUser, getInitials,logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard'
  const userName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || 'User'
  const role = formatRole(currentUser?.role || 'user')

  const initials = useMemo(() => getInitials(userName), [getInitials, userName])
 const navigate =useNavigate()
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-6 font-sans shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-[#080B11]/95 md:px-10">
        <h1 className="min-w-0 max-w-[220px] truncate text-base font-extrabold text-slate-950 dark:text-slate-100">
          {pageTitle}
        </h1>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-4">
          <label className="hidden h-11 w-full max-w-[335px] items-center gap-3 rounded-[16px] border border-slate-200 bg-slate-50/80 px-4 text-slate-400 transition-colors duration-300 focus-within:border-[#7f5cff] focus-within:ring-2 focus-within:ring-[#7f5cff]/15 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-500 dark:focus-within:border-neon-cyan/70 dark:focus-within:ring-neon-cyan/15 sm:flex">
            <MagnifyingGlassIcon className="h-5 w-5 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[15px] border border-slate-200 bg-white text-[#7f5cff] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7f5cff]/50 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-950/45 dark:text-neon-cyan dark:hover:border-neon-cyan/60 dark:hover:bg-neon-cyan/10"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-[#7f5cff] dark:text-slate-500 dark:hover:bg-slate-900/70 dark:hover:text-neon-cyan"
            aria-label="Open notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_14px_rgba(255,0,127,0.75)]"></span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex h-11 max-w-[180px] flex-shrink-0 items-center gap-2.5 rounded-[18px] border border-slate-200 bg-white px-2.5 pr-3 text-left shadow-sm transition-all duration-300 hover:border-[#7f5cff]/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/45 dark:hover:border-neon-purple/50 dark:hover:bg-slate-900/60"
            aria-label="Open profile menu"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6ee7ff] via-[#8b5cf6] to-[#e056fd] text-sm font-normal text-slate-950 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
              {initials}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-medium capitalize text-slate-800 dark:text-slate-100">
                {role}
              </span>
              <span className="block truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                {userName}
              </span>
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500 sm:block" />
          </button>
        </div>
      </header>

      {isNotificationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/45 px-4 py-6 backdrop-blur-sm sm:px-8"
          role="presentation"
          onMouseDown={() => setIsNotificationOpen(false)}
        >
          <section
            className="w-full max-w-md overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl transition-colors duration-300 dark:border-slate-800 dark:bg-cyber-card dark:text-slate-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="notifications-title" className="text-lg font-extrabold text-slate-950 dark:text-slate-100">
                  Notifications
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
                  {notifications.length} unread updates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                aria-label="Close notifications"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {notifications.map((notification) => (
                <article
                  key={`${notification.title}-${notification.time}`}
                  className="flex gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                >
                  <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-neon-pink shadow-[0_0_12px_rgba(255,0,127,0.6)]"></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h31  className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {notification.title}
                      </h31>
                      <span className="flex-shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {notification.message}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

     {isProfileOpen && (
  <div
    className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/45 px-2 py-3 backdrop-blur-sm sm:px-8"
    role="presentation"
    onMouseDown={() => setIsProfileOpen(false)}
  >
    <section
      className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-cyber-card"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        
        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {[currentUser?.firstName, currentUser?.lastName]
              .filter(Boolean)
              .join(' ') || 'User'}
          </h2>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {role}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsProfileOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* MENU */}
      <div className="p-3">

        {/* PROFILE */}
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
          <UserCircleIcon className="h-5 w-5 text-slate-500" />
          Profile
        </button>

        {/* SETTINGS */}
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
          <Cog6ToothIcon className="h-5 w-5 text-slate-500" />
          Settings
        </button>

        {/* DIVIDER */}
        <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

        {/* LOGOUT */}
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"onClick={handleLogout}>
          <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
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
