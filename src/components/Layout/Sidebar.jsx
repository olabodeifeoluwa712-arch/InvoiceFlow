import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Audit from './Pages/Accountant/Audit'
import Accountantdashboard from './Pages/Accountant/Dashboard'
import Payments from './Pages/Accountant/Payments'
import Reports from './Pages/Accountant/Reports'
import Records from './Pages/Accountant/Records'
import CreateInvoice from './Pages/Admin/CreateInvoice'
import AdminDashboard from './Pages/Admin/Dashboard'
import AdminCustomers from './Pages/Admin/Customers'
import AdminInvoices from './Pages/Admin/Invoices'
import AdminProducts from './Pages/Admin/Products'
import AdminReceipts from './Pages/Admin/Receipts'
import AdminSettings from './Pages/Admin/Settings'
import Catalogue from './Pages/solopreneur/Catalogue'
import Customers from './Pages/solopreneur/Customers'
import Invoice from './Pages/solopreneur/Invoice'
import Orders from './Pages/solopreneur/Orders'
import Profile from './Pages/solopreneur/Profile'
import SolopreneurDashboard from './Pages/solopreneur/Dashboard'
import SalesDashboard from './Pages/Sales/Dashboard'
import Notifications from './Pages/Sales/Notifications'
import Receipt from './Pages/Sales/Receipt'
import Sales from './Pages/Sales/Sales'
import Stocks from './Pages/Sales/Stocks'
import Register from './Pages/user/Register'
import Dashboard from './Pages/user/Dashboard'
const Sidebar = () => {
  const { currentUser, logout, getInitials } = useAuth();
  const navigate = useNavigate()

  if (currentUser == null) {
    return null;
  }

  const role = currentUser.role?.toLowerCase().trim() || 'user';
  const normalizedRole = role.replace(/[\s_-]/g, '');
  const displayRole = formatRole(role);

  const SIDEBAR_LINKS = {
    inventorymanager: [
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
            to: "/business/create-receipt",
            label: "Create Receipt",
            icon: CubeIconOutline,
            activeIcon: CubeIconSolid,
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
admin:[
  {
    title:"MAIN MENU",
    items:[
      {
            to: "/admin-receipts",
            label: "Receipts",
            icon: ReceiptPercentIconOutline,
            activeIcon: ReceiptPercentIconSolid,
          },
    ]
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
    <div>
       
       {currentUser.role.toLowerCase().trim() == "admin" && (
        <div>
          <div>
            <img src="" alt="" />
            <h2>Invoiceflow</h2>
          </div>
        </div>

        <button
          type="button"
          className="w-5 h-5 rounded-full bg-[#f0eff9] text-[#827ea6] flex items-center justify-center hover:bg-[#e8e6f5] transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIconOutline className="w-3 h-3" />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div className="mb-5 rounded-xl border border-[#ded7ff] bg-[var(--color--focus-lightpurple)] px-3 py-1.5 text-sm font-normal text-[var(--color--purple-ish)]">
          {displayRole}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-3.5">
            <h3 className="px-1.5 mb-1.5  font-light text-[15px] tracking-[0.16em] text-[#817da5]">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="block no-underline"
                >
                  {({ isActive }) => (
                    <div className={`min-h-7 rounded-[22px] px-3 flex items-center gap-5 transition-colors ${isActive ? 'bg-[#efedf7] text-[#17162b] font-normal' : 'text-[#7f7da5] hover:bg-[#f6f4fb]'}`}>
                      {(() => {
                        const Icon = isActive ? item.activeIcon : item.icon;
                        return <Icon className="w-5 h-5 flex-shrink-0" />;
                      })()}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="min-w-4 h-4 px-2 rounded-full bg-[var(--bgcolor--notif-yellow)] border border-[#ffd96b] text-[var(--color--notif-brown)] font-normal flex items-center justify-center">
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
      <div className="border-t border-[#e8e5f7] px-3 py-3 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7f5cff] to-[#a45cff] text-white flex items-center justify-center  font-normal">
          {getInitials(currentUser?.firstName || 'User')}
        </div>
        <div className="min-w-0 flex-1">
          <p className=" leading-tight text-[#08071a] truncate">
            {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || 'User'}
          </p>
          <p className="font-normal leading-tight text-[#7f7da5] truncate capitalize">{role}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-5 h-5 rounded-full text-[#7f7da5] hover:bg-[#f0eff9] flex items-center justify-center transition-colors"
          aria-label="Log out"
        >
          <ArrowRightOnRectangleIconOutline className="w-3 h-3" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
