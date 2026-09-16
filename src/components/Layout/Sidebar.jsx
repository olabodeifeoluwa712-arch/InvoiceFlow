import { useState, useEffect } from 'react'

import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import { useNotifications } from '../../Context/NotificationContext'
import { getProducts } from '../../api/inventory.api'
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/http";

import {
  ChevronLeftIcon as ChevronLeftIconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
  UsersIcon as UsersIconOutline,
  ReceiptPercentIcon as ReceiptPercentIconOutline,
  CubeIcon as CubeIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  CreditCardIcon as CreditCardIconOutline,
  ClipboardDocumentListIcon as ClipboardDocumentListIconOutline,
  ChartBarIcon as ChartBarIconOutline,
  ShieldCheckIcon as ShieldCheckIconOutline,
  BuildingOffice2Icon as BuildingOffice2IconOutline,
  BellIcon as BellIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  ArchiveBoxIcon as ArchiveBoxIconOutline,
  BookOpenIcon as BookOpenIconOutline,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
  UserCircleIcon as UserCircleIconOutline,
  DocumentDuplicateIcon as DocumentDuplicateIconOutline,
  UserPlusIcon as UserPlusIconOutline,
  ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconOutline,
  ArrowsUpDownIcon as ArrowUpDownIconOutline,
  ExclamationTriangleIcon as ExclamationTriangleIconOutline,
  ClockIcon as ClockIconOutline,
  UserGroupIcon as UserGroupIconOutline,
  ArrowTrendingUpIcon as ArrowTrendingUpIconOutline,
  ShieldCheckIcon  as permissionsIconOutline,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  CommandLineIcon     as plugIconOutline,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  BoltIcon as BoltIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  UsersIcon as UsersIconSolid,
  ReceiptPercentIcon as ReceiptPercentIconSolid,
  CubeIcon as CubeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  BellIcon as BellIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconSolid,
  ArrowsUpDownIcon as ArrowUpDownIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  ClockIcon as ClockIconSolid,
  ArrowTrendingUpIcon as ArrowTrendingUpIconSolid,
   UserGroupIcon as UserGroupIconSolid,
  ShieldCheckIcon  as permissionsIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  CommandLineIcon     as plugIconSolid,
} from "@heroicons/react/24/solid";


const formatRole = (role) =>
  role
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const Sidebar = ({ isMobileOpen = false, onClose }) => {
  
  const { currentUser, logout, getInitials } = useAuth();

  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [businessLoading, setBusinessLoading] = useState(true);


  /*
   * Load business information directly from the backend.
   *
   * The backend endpoint:
   * GET /api/business/my-business
   *
   * Response:
   * {
   *   business: {
   *     owner: {
   *       fullName,
   *       passportPhotoUrl
   *     }
   *   }
   * }
   */
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setBusinessLoading(true);

        const response = await api.get("/business/my-business");

        setBusiness(response.business || null);

      } catch (error) {
        console.error(
          "Failed to load business information:",
          error
        );

        setBusiness(null);

      } finally {
        setBusinessLoading(false);
      }
    };

    if (currentUser) {
      loadBusiness();
    }
  }, [currentUser]);


  if (currentUser == null) {
    return navigate("/login");
  }


  const role =
    currentUser.role?.toLowerCase().trim() ||
    "Business Owner";

  const normalizedRole =
    role.replace(/[\s\_-]/g, "");

  const displayRole =
    formatRole(role);


  const SIDEBAR_LINKS = {

    inventory: [
      {
        title: "OVERVIEW",
        items: [
          {
            to: "/inventory-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          {
            to: "/inventory",
            label: "Inventory",
            icon: CubeIconOutline,
            activeIcon: CubeIconSolid,
          },
          {
            to: "/inventory-products",
            label: "Products",
            icon: ArchiveBoxIconOutline,
            activeIcon: ArchiveBoxIconSolid,
          },
          {
            to: "/notifications",
            label: "Notifications",
            icon: BellIconOutline,
            activeIcon: BellIconSolid,
          },
        ],
      },

      {
        title: "OPERATIONS",
        items: [
          {
            to: "/stock-adjustments",
            label: "Stock Adjustments",
            icon: ArrowUpDownIconOutline,
            activeIcon: ArrowUpDownIconSolid,
          },
          {
            to: "/low-stock-alerts",
            label: "Low Stock Alerts",
            icon: ExclamationTriangleIconOutline,
            activeIcon: ExclamationTriangleIconSolid,
            badge: 4,
          },
          {
            to: "/stock-history",
            label: "Stock History",
            icon: ClockIconOutline,
            activeIcon: ClockIconSolid,
          },
        ],
      },
    ],


    admin: [
      {
        title: "MAIN MENU",
        items: [
          {
            to: "/business-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          {
            to: "/business-invoices",
            label: "Invoices",
            icon: DocumentTextIconOutline,
            activeIcon: DocumentTextIconSolid,
          },
          {
            to: "/create-invoice",
            label: "Create Invoice",
            icon: PlusCircleIconOutline,
            activeIcon: PlusCircleIconSolid,
          },
          {
            to: "/notifications",
            label: "Notifications",
            icon: BellIconOutline,
            activeIcon: BellIconSolid,
          },
        ],
      },

      {
        title: "MANAGEMENT",
        items: [
          {
            to: "/business-customers",
            label: "Customers",
            icon: UsersIconOutline,
            activeIcon: UsersIconSolid,
          },
          {
            to: "/business-create-receipt",
            label: "Create Receipt",
            icon: CubeIconOutline,
            activeIcon: CubeIconSolid,
          },
          {
            to: "/business-view-invoices/:id",
            label: "Manage Invoices",
            icon: DocumentTextIconOutline,
            activeIcon: DocumentTextIconSolid,
          },
          {
            to: "/business-management",
            label: "Team Management",
            icon: UserGroupIconOutline,
            activeIcon: UserGroupIconSolid,
          },
          {
            to: "/business-products",
            label: "Products",
            icon: ArchiveBoxIconOutline,
            activeIcon: ArchiveBoxIconSolid,
          },
          {
            to: "/business-subscription",
            label: "Subscription",
            icon: CreditCardIconOutline,
            activeIcon: CreditCardIconSolid,
            badge: currentUser?.subscriptionPlan ? currentUser.subscriptionPlan.slice(0, 4) : null,
          },
          {
            to: "/business-settings",
            label: "Settings",
            icon: Cog6ToothIconOutline,
            activeIcon: Cog6ToothIconSolid,
          },
          {
            to: "/business-create-business",
            label: "Profile",
            icon: BuildingOffice2IconOutline,
            activeIcon: BuildingOffice2IconSolid,
          },
        ],
      },
    ],
    superadmin: [
      {
        title: "MAIN MENU",
        items: [
          {
            to: "/admin-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          {
            to: "/notifications",
            label: "Notifications",
            icon: BellIconOutline,
            activeIcon: BellIconSolid,
          },
        ],
      },

      {
        title: "Admin",
        items: [
          {
            to: "/admin-management",
            label: "Management",
            icon: UserGroupIconOutline,
            activeIcon: UserGroupIconSolid,
          },
          {
            to: "/admin-integrations",
            label: "Integrations",
            icon: plugIconOutline,
            activeIcon: plugIconSolid,
          },
          {
            to: "/admin-profile",
            label: "Business Profile",
            icon: BuildingOfficeIconOutline,
            activeIcon: BuildingOfficeIconSolid,
          }
        ],
      },
    ],


    accountant: [
      {
        title: "MAIN MENU",
        items: [
          {
            to: "/accountant-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          {
            to: "/payments",
            label: "Payments",
            icon: CreditCardIconOutline,
            activeIcon: CreditCardIconSolid,
          },
          {
            to: "/notifications",
            label: "Notifications",
            icon: BellIconOutline,
            activeIcon: BellIconSolid,
          },
        ],
      },
      {
        title: "FINANCE",
        items: [
          {
            to: "/records",
            label: "Records",
            icon: ClipboardDocumentListIconOutline,
            activeIcon: ClipboardDocumentListIconSolid,
          },
          {
            to: "/reports",
            label: "Reports",
            icon: ChartBarIconOutline,
            activeIcon: ChartBarIconSolid,
          },
          {
            to: "/audit",
            label: "Audit",
            icon: ShieldCheckIconOutline,
            activeIcon: ShieldCheckIconSolid,
          },
        ],
      },
    ],


    user: [
      {
        title: "HOME",
        items: [
          {
            to: "/dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          {
            to: "/notifications",
            label: "Notifications",
            icon: BellIconOutline,
            activeIcon: BellIconSolid,
          },
          {
            to: "/register",
            label: "Register",
            icon: UserPlusIconOutline,
            activeIcon: UserPlusIconSolid,
          },
          {
            to: "/login",
            label: "Login",
            icon: ArrowRightOnRectangleIconOutline,
            activeIcon: ArrowRightOnRectangleIconSolid,
          },
        ],
      },
    ],
  };

  const { unreadCount } = useNotifications();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await getProducts()
        if (response && !response.error) {
          let items = []
          if (Array.isArray(response)) items = response
          else if (response?.products && Array.isArray(response.products)) items = response.products
          else if (response?.data && Array.isArray(response.data)) items = response.data
          else if (response?.items && Array.isArray(response.items)) items = response.items

          const affected = items.filter((p) => {
            const status = (p.status || '').toLowerCase()
            const qty = Number(p.quantity ?? p.qty ?? p.stock ?? 0)
            return status === 'out of stock' || status === 'low stock' || qty <= 10
          })

          setLowStockCount(affected.length)
        }
      } catch (err) {
        console.error('Error fetching low stock count for sidebar:', err)
      }
    }

    fetchLowStockCount()
  }, [])

  const roleKey = normalizedRole === 'soloprenuer' ? 'solopreneur' : normalizedRole;
  const rawSections = SIDEBAR_LINKS[roleKey] || SIDEBAR_LINKS.user;
  const sections = rawSections.map((sec) => ({
    ...sec,
    items: sec.items.map((item) => {
      if (item.to === '/notifications') {
        return {
          ...item,
          badge: unreadCount > 0 ? unreadCount : null,
        }
      }
      if (item.to === '/low-stock-alerts') {
        return {
          ...item,
          badge: lowStockCount > 0 ? lowStockCount : null,
        }
      }
      return item
    }),
  }));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar (Drawer on mobile, static on md+) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[240px] max-w-[85vw] h-full bg-white flex flex-col border-r border-[#e8e5f7] transition-transform duration-300 ease-in-out dark:bg-[#111418] dark:border-[#272D35] dark:text-[#F3F4F6] font-header shadow-2xl
          md:static md:z-auto md:w-[230px] md:max-w-none md:h-screen md:translate-x-0 md:shadow-none md:flex
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo & Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#e8e5f7] transition-colors duration-200 dark:border-[#272D35]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_12px_rgba(124,31,255,0.22)] transition-all duration-200 dark:from-[#8B7CF6] dark:to-[#6366F1] dark:shadow-none">
              <svg className="h-5 w-5 text-white dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#F3F4F6] dark:to-[#A1A7B0]">
              InvoiceFlow
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors dark:text-[#A1A7B0] dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6] md:hidden"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-none">
          <div className="mb-5 rounded-lg border border-[#ded7ff] bg-[var(--color--focus-lightpurple)] px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--color--purple-ish)] transition-colors duration-200 dark:border-[#272D35] dark:bg-[#171B21] dark:text-[#8B7CF6]">
           
          </div>

        
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="px-2.5 mb-2 font-bold text-[11px] uppercase tracking-wider text-[#817da5] transition-colors duration-200 dark:text-[#6F7782]">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => (

                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className="block no-underline"
                  >

                    {({ isActive }) => (

                      <div
                      className={`min-h-9 rounded-lg px-3 py-2 flex items-center gap-3 transition-colors duration-150 text-sm font-medium ${
                        isActive
                          ? "bg-[#efedf7] text-[#17162b] dark:bg-[#8B7CF6]/15 dark:text-[#8B7CF6] dark:border dark:border-[#8B7CF6]/30"
                          : "text-[#7f7da5] hover:bg-[#f6f4fb] dark:text-[#A1A7B0] dark:hover:bg-[#1D2229] dark:hover:text-[#F3F4F6]"
                      }`}
                    >

                        {(() => {
                          const Icon =
                          isActive
                            ? item.activeIcon
                            : item.icon;

                          return (
                          <Icon className="w-4 h-4 flex-shrink-0" />
                        );
                        })()}


                        <span className="flex-1 truncate">
                        {item.label}
                      </span>


                        {item.badge && (
                          <span className="min-w-4 h-4 px-2 rounded-full bg-[var(--bgcolor--notif-yellow)] border border-[#ffd96b] text-[var(--color--notif-brown)] font-normal flex items-center justify-center text-xs dark:bg-[#8B7CF6]/20 dark:border-[#8B7CF6]/30 dark:text-[#8B7CF6]">
                            {item.badge}
                          </span>
                        )}

                      </div>

                    )}

                  </NavLink>

                ))}

              </div>

            </div>

          ))}

        </nav>


        {/* USER INFO */}
        <div className="border-t border-[#e8e5f7] px-3.5 py-3 flex items-center gap-3 transition-colors duration-200 dark:border-[#272D35] dark:bg-[#0F1216]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7f5cff] to-[#a45cff] text-white flex items-center justify-center text-xs font-semibold dark:from-[#8B7CF6] dark:to-[#6366F1]">
            {getInitials(currentUser?.firstName ||  currentUser?.name || 'User')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold leading-tight text-[#08071a] truncate dark:text-[#F3F4F6]">
              {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || currentUser?.name || 'User'}
            </p>
            <p className="text-[11px] font-normal leading-tight text-[#7f7da5] truncate capitalize dark:text-[#6F7782]">{role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-7 h-7 rounded-lg text-[#7f7da5] hover:bg-[#f0eff9] flex items-center justify-center transition-colors dark:text-[#6F7782] dark:hover:bg-[#171B21] dark:hover:text-[#F87171]"
            aria-label="Log out"
          >
            <ArrowRightOnRectangleIconOutline className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  )
}


export default Sidebar;