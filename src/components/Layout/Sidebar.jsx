import { useAuth } from '../../Context/AuthContext'
import { useTheme } from '../../Context/ThemeContext'
import { NavLink, useNavigate } from 'react-router-dom'
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
  CommandLineIcon     as plugIconOutline,
 

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
  CommandLineIcon     as plugIconSolid,

} from "@heroicons/react/24/solid";

const formatRole = (role) =>
  role
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

const Sidebar = () => {
  const { currentUser, logout, getInitials } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate()

  if (currentUser == null) {
    return null;
  }

  const role = currentUser.role?.toLowerCase().trim() || 'user';
  const normalizedRole = role.replace(/[\s_-]/g, '');
  const displayRole = formatRole(role);

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

    business: [
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
            to: "/Business-view-invoices",
            label: "Manage Invoices",
            icon: DocumentTextIconOutline,
            activeIcon: DocumentTextIconSolid,
          },

          {
            to: '/business-management',
            label: 'Team Management',
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
            to: "/business-settings",
            label: "Settings",
            icon: Cog6ToothIconOutline,
            activeIcon: Cog6ToothIconSolid,
          },
        ],
      },
    ],
    admin: [
      {
        title: "MAIN MENU",
        items: [
          {
            to: "/admin-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },
          // {
          //   to: "/admin-invoices",
          //   label: "Invoices",
          //   icon: DocumentTextIconOutline,
          //   activeIcon: DocumentTextIconSolid,
          // },
          {
            to: "/admin-receipts",
            label: "Receipts",
            icon: ReceiptPercentIconOutline,
            activeIcon: ReceiptPercentIconSolid,
          },
          {
            to: "/admin-inventory",
            label: "Inventory",
            icon: CubeIconOutline,
            activeIcon: CubeIconSolid,
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
          // {
          //   to: "/admin-permissions",
          //   label: "Permissions",
          //   icon: permissionsIconOutline,
          //   activeIcon: permissionsIconSolid,
          // },
          {
            to: "/admin-integrations",
            label: "Integrations",
            icon: plugIconOutline,
            activeIcon: plugIconSolid,
          },
          {
            to: '/admin-settings',
            label: 'Settings',
            icon: Cog6ToothIconOutline,
            activeIcon: Cog6ToothIconSolid,
          }
        ],
      }
    
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

    sales: [
      {
        title: "SALES",
        items: [
          {
            to: "/sales-dashboard",
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
        title: "OPERATIONS",
        items: [
          {
            to: "/sales-sales",
            label: "Sales",
            icon: ShoppingCartIconOutline,
            activeIcon: ShoppingCartIconSolid,
          },

          {
            to: "/sales-stocks",
            label: "Stocks",
            icon: ArchiveBoxIconOutline,
            activeIcon: ArchiveBoxIconSolid,
          },

          {
            to: "/sales-receipt",
            label: "Receipt",
            icon: ReceiptPercentIconOutline,
            activeIcon: ReceiptPercentIconSolid,
          },
        ],
      },
    ],

    solopreneur: [
      {
        title: "BUSINESS",
        items: [
          {
            to: "/solopreneur-dashboard",
            label: "Dashboard",
            icon: Squares2X2IconOutline,
            activeIcon: Squares2X2IconSolid,
          },

          {
            to: "/customers",
            label: "Customers",
            icon: UsersIconOutline,
            activeIcon: UsersIconSolid,
          },

          {
            to: "/catalogue",
            label: "Catalogue",
            icon: BookOpenIconOutline,
            activeIcon: BookOpenIconSolid,
          },
        ],
      },

      {
        title: "OPERATIONS",
        items: [
          {
            to: "/orders",
            label: "Orders",
            icon: ClipboardDocumentCheckIconOutline,
            activeIcon: ClipboardDocumentCheckIconSolid,
          },

          {
            to: "/profile",
            label: "Profile",
            icon: UserCircleIconOutline,
            activeIcon: UserCircleIconSolid,
          },

          {
            to: "/invoice",
            label: "Invoice",
            icon: DocumentDuplicateIconOutline,
            activeIcon: DocumentDuplicateIconSolid,
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
  const roleKey = normalizedRole === 'soloprenuer' ? 'solopreneur' : normalizedRole;
  const sections = SIDEBAR_LINKS[roleKey] || SIDEBAR_LINKS.user

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <aside className="w-[230px] max-w-full h-screen border-r border-[#e8e5f7] bg-white flex flex-col transition-colors duration-300 dark:bg-[#080B11] dark:border-slate-800 dark:text-slate-100 font-mono">
   
      {/* Logo */}
        <div className="h-10 pb-8 pt-8 flex items-center justify-between border-b border-[#e8e5f7] transition-colors duration-300 dark:border-slate-800">
        <div className="flex items-center gap-2 ml-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_8px_18px_rgba(124,31,255,0.22)] transition-all duration-300 dark:from-neon-cyan dark:to-neon-purple dark:shadow-[0_0_18px_rgba(0,243,255,0.28)]">
            <svg className="h-5 w-5 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-neon-cyan dark:to-neon-purple dark:text-glow-cyan">
            InvoiceFlow
          </span>
        </div>
        
      </div>
        


      {/* NAV */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div className="mb-5 rounded-xl border border-[#ded7ff] bg-[var(--color--focus-lightpurple)] px-3 py-[0.3rem] text-sm font-normal text-[var(--color--purple-ish)] transition-colors duration-300 dark:border-neon-cyan/25 dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_14px_rgba(0,243,255,0.08)]">
          {displayRole}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-3.5">
            <h3 className="px-2.5 mb-2.5 font-bold text-[13px] tracking-[0.16em] text-[#817da5] transition-colors duration-300  dark:text-slate-500">
              {section.title}
            </h3>

            <div className="space-y-3">
             
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="block no-underline"
                >
                  {({ isActive }) => (
                    <div className={`min-h-7 rounded-[22px] px-3 py-[0.3rem] flex items-center gap-5 transition-colors duration-300 ${isActive ? 'bg-[#efedf7] text-[#17162b] font-normal dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_14px_rgba(0,243,255,0.08)]' : 'text-[#7f7da5] hover:bg-[#f6f4fb] dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-100'}`}>
                      {(() => {
                        const Icon = isActive ? item.activeIcon : item.icon;
                        return <Icon className="w-5 h-5 flex-shrink-0" />;
                      })()}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="min-w-4 h-4 px-2 rounded-full bg-[var(--bgcolor--notif-yellow)] border border-[#ffd96b] text-[var(--color--notif-brown)] font-normal flex items-center justify-center dark:bg-neon-pink/10 dark:border-neon-pink/30 dark:text-neon-pink">
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
      <div className="border-t border-[#e8e5f7] px-3 py-3 flex items-center gap-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/20">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7f5cff] to-[#a45cff] text-white flex items-center justify-center font-normal dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950">
          {getInitials(currentUser?.firstName || 'User')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="leading-tight text-[#08071a] truncate dark:text-slate-100">
            {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || 'User'}
          </p>
          <p className="font-normal leading-tight text-[#7f7da5] truncate capitalize dark:text-slate-500">{role}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-5 h-5 rounded-full text-[#7f7da5] hover:bg-[#f0eff9] flex items-center justify-center transition-colors dark:text-slate-500 dark:hover:bg-slate-900/70 dark:hover:text-neon-pink"
          aria-label="Log out"
        >
          <ArrowRightOnRectangleIconOutline className="w-3 h-3" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
