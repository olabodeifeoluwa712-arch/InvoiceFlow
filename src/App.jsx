import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/user/Login'
import Register from './Pages/user/Register'
import MainLayout from './components/Layout/MainLayout'
import { AuthProvider, useAuth } from './Context/AuthContext'
import { ThemeProvider } from './Context/ThemeContext'
import { NotificationProvider } from './Context/NotificationContext'

// Accountant Pages
import Audit from './Pages/Accountant/Audit'
import AccountantDashboard from './Pages/Accountant/Dashboard'
import Payments from './Pages/Accountant/Payments'
import Reports from './Pages/Accountant/Reports'
import Records from './Pages/Accountant/Records'

// Business Pages
import CreateInvoice from './Pages/Business/CreateInvoice'
import CreateBusiness from './Pages/Business/createBusiness'
import BusinessDashboard from './Pages/Business/Dashboard'
import BusinessCustomers from './Pages/Business/Customers'
import BusinessInvoices from './Pages/Business/Invoices'
import BusinessCreateReceipt from './Pages/Business/CreateReceipt'
import BusinessSettings from './Pages/Business/Settings'
import BusinessProducts from './Pages/Business/Products'
import BusinessManagement from './Pages/Business/Management'
import EditBusinessInvoice from './Pages/Business/seeInvoices'
import BusinessSubscription from './Pages/Business/Subscription'
import BusinessProfile from './Pages/Business/BusinessProfile'

// Inventory Manager Pages
import InventoryDashboard from './Pages/Inventory-manager/Dashboard'
import Inventory from './Pages/Inventory-manager/Inventory'
import Products from './Pages/Inventory-manager/Products'
import StockHistory from './Pages/Inventory-manager/StockHistory'
import StockAdjustment from './Pages/Inventory-manager/StockAdjustment'
import LowStockAlerts from './Pages/Inventory-manager/LowStockAlerts'
import AddProducts from './Pages/Inventory-manager/addProducts'

// Admin Pages
import AdminDashboard from './Pages/Admin/Dashboard'
import AdminManagement from './Pages/Admin/Management'
import AdminPermissions from './Pages/Admin/Permissions'
import AdminIntegrations from './Pages/Admin/integrations'
import AdminReports from './Pages/Admin/Reports'
import SeeInvoices from './Pages/Business/seeInvoices'
import CustomerDetails from "./Pages/Business/CustomerDetails";

// Shared Pages
import LandingPage from './Pages/landingPage'
import NotificationsPage from './Pages/Notifications'

function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
     return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                {/* Notifications for All Roles */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'inventory', 'accountant']}>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Profile Route for all logged in roles */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'inventory', 'accountant']}>
                      <BusinessProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Inventory Manager */}
                <Route index path="/inventory-dashboard" element={<ProtectedRoute allowedRoles={['inventory']}><InventoryDashboard /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute allowedRoles={['inventory']}><Inventory /></ProtectedRoute>} />
                <Route path="/inventory-products" element={<ProtectedRoute allowedRoles={['inventory']}><Products /></ProtectedRoute>} />
                <Route path="/stock-adjustments" element={<ProtectedRoute allowedRoles={['inventory']}><StockAdjustment /></ProtectedRoute>} />
                <Route path="/stock-history" element={<ProtectedRoute allowedRoles={['inventory']}><StockHistory /></ProtectedRoute>} />
                <Route path="/low-stock-alerts" element={<ProtectedRoute allowedRoles={['inventory']}><LowStockAlerts /></ProtectedRoute>} />
                <Route path="/add-products" element={<ProtectedRoute allowedRoles={['inventory']}><AddProducts /></ProtectedRoute>} />
               
                {/* Business */}
                <Route index path="/business-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><BusinessDashboard /></ProtectedRoute>} />
                <Route path="/business-customers" element={<ProtectedRoute allowedRoles={['admin']}><BusinessCustomers /></ProtectedRoute>} />
                <Route path="/business-invoices" element={<ProtectedRoute allowedRoles={['admin']}><BusinessInvoices /></ProtectedRoute>} />
                <Route path="/business-create-receipt" element={<ProtectedRoute allowedRoles={['admin']}><BusinessCreateReceipt /></ProtectedRoute>} />
                <Route path="/business-settings" element={<ProtectedRoute allowedRoles={['admin']}><BusinessSettings /></ProtectedRoute>} />
                <Route path="/business-profile" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><BusinessProfile /></ProtectedRoute>} />
                <Route path="/create-invoice" element={<ProtectedRoute allowedRoles={['admin']}><CreateInvoice /></ProtectedRoute>} />
                <Route path="/business-products" element={<ProtectedRoute allowedRoles={['admin']}><BusinessProducts /></ProtectedRoute>} />
                <Route path="/business-management" element={<ProtectedRoute allowedRoles={['admin']}><BusinessManagement /></ProtectedRoute>} />
                <Route path="/customers/:id" element={<ProtectedRoute allowedRoles={['admin']}><CustomerDetails /></ProtectedRoute>} />
                <Route path="/business-view-invoices" element={<ProtectedRoute allowedRoles={['admin']}><EditBusinessInvoice /></ProtectedRoute>} />
                <Route path="/business-subscription" element={<ProtectedRoute allowedRoles={['admin']}><BusinessSubscription /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute allowedRoles={['admin']}><BusinessSubscription /></ProtectedRoute>} />
                 <Route path="/business-customers" element={<ProtectedRoute allowedRoles={['admin']}><BusinessCustomers /></ProtectedRoute>} />
                 <Route
                  path="/business-view-invoices/:id"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <SeeInvoices />
                    </ProtectedRoute>
                  }
                />

                <Route path="/business-create-business" element={<ProtectedRoute allowedRoles={['admin']}><CreateBusiness /></ProtectedRoute>} />


                {/* Accountant */}
                <Route index path="/accountant-dashboard" element={<ProtectedRoute allowedRoles={['accountant']}><AccountantDashboard /></ProtectedRoute>} />
                <Route path="/audit" element={<ProtectedRoute allowedRoles={['accountant']}><Audit /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute allowedRoles={['accountant']}><Payments /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute allowedRoles={['accountant']}><Reports /></ProtectedRoute>} />
                <Route path="/records" element={<ProtectedRoute allowedRoles={['accountant']}><Records /></ProtectedRoute>} />

                  {/* Admin / Superadmin */}
                  <Route index path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin-management" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminManagement /></ProtectedRoute>} />
                  <Route path="/admin-permissions" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminPermissions /></ProtectedRoute>} />
                  <Route path="/permissions" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminPermissions /></ProtectedRoute>} />
                <Route path="/team-permissions" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminPermissions /></ProtectedRoute>} />
                  <Route path="/business-permissions" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminPermissions /></ProtectedRoute>} />
                  <Route path="/admin-integrations" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminIntegrations /></ProtectedRoute>} />
                  {/* <Route path="/admin-profile" element={<ProtectedRoute allowedRoles={['superadmin', 'admin']}><AdminProfile /></ProtectedRoute>} /> */}
                  <Route path="/admin-analytics" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminReports /></ProtectedRoute>} />
                </Route>
                      
              {/* Auth / Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App