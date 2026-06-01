import './index.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Login from './Pages/user/Login'
import Register from './Pages/user/Register'
import MainLayout from './components/Layout/MainLayout'
import { AuthProvider } from './Context/AuthContext'
import Audit from './Pages/Accountant/Audit'
import AccountantDashboard from './Pages/Accountant/Dashboard'
import Payments from './Pages/Accountant/Payments'
import Reports from './Pages/Accountant/Reports'
import Records from './Pages/Accountant/Records'
import CreateInvoice from './Pages/Business/CreateInvoice'
import BusinessDashboard from './Pages/Business/Dashboard'
import BusinessCustomers from './Pages/Business/Customers'
import BusinessInvoices from './Pages/Business/Invoices'
import BusinessCreateReceipt from './Pages/Business/CreateReceipt'
import BusinessSettings from './Pages/Business/Settings'
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
import InventoryDashboard from './Pages/Inventory-manager/Dashboard'
import Inventory from './Pages/Inventory-manager/Inventory'
import Products from './Pages/Inventory-manager/Products'
import StockHistory from './Pages/Inventory-manager/StockHistory'
import StockAdjustment from './Pages/Inventory-manager/StockAdjustment'
import LowStockAlerts from './Pages/Inventory-manager/LowStockAlerts'
import AdminReceipt from './Pages/Admin/Receipts'
import AdminDashboard from './Pages/Admin/Dashboard'
// import AdminInvoices from './Pages/Admin/Invoices'
import AdminInventory from './Pages/Admin/Inventory'
import BusinessProducts from './Pages/Business/Products'
import AddProducts from './Pages/Inventory-manager/addProducts'
import { ThemeProvider } from './Context/ThemeContext'
import AdminManagement from './Pages/Admin/Management'
import AdminPermissions from './Pages/Admin/Permissions'
import AdminIntegrations from './Pages/Admin/integrations'
import AdminSettings from './Pages/Admin/Settings'
import AdminReports from './Pages/Admin/Reports'
import BusinessManagement from './Pages/Business/Management'
import EditBusinessInvoice from './Pages/Business/seeInvoices'
import LandingPage from './Pages/landingPage'
import {useAuth} from './Context/AuthContext'
import { Navigate } from 'react-router-dom'
// import {ProtectedRoute} from './utils/protected'

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, currentUser } = useAuth()
//   // if (currentUser.role === 'admin') {
//   //   return children
//   // }

//   if (!isAuthenticated) {
//     return (<Navigate to='/' />)
//   }
//   return children
// }

function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();
  // const navigate = useNavigate();

  if (!currentUser) {
     return ( 
     <Navigate to="/" replace />
    );
    //  return navigate('/');
    
  }

  if (!allowedRoles.includes(currentUser.role)) {
     return <Navigate to="/unauthorized" replace />;
    // return navigate('/');
  }

  return children;
}


function App() {

  return (
    <>
    
      <AuthProvider>
        <ThemeProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
            
              {/* Inventory Manager */}
              <Route index path="/inventory-dashboard" element={<ProtectedRoute allowedRoles={['inventory']}><InventoryDashboard /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute allowedRoles={['inventory']}><Inventory /></ProtectedRoute>} />
              <Route path="/inventory-products" element={<ProtectedRoute allowedRoles={['inventory']}><Products /></ProtectedRoute>} />
              <Route path="/stock-adjustments" element={<ProtectedRoute allowedRoles={['inventory']}><StockAdjustment /></ProtectedRoute>} />
              <Route path="/stock-history" element={<ProtectedRoute allowedRoles={['inventory']}><StockHistory /></ProtectedRoute>} />
              <Route path="/low-stock-alerts" element={<ProtectedRoute allowedRoles={['inventory']}><LowStockAlerts /></ProtectedRoute>} />
              <Route path="/add-products" element={<ProtectedRoute allowedRoles={['inventory']}><AddProducts /></ProtectedRoute>} />
              {/* Solopreneur */}
              {/* <Route index path="/solopreneur-dashboard" element={<ProtectedRoute><SolopreneurDashboard /></ProtectedRoute>} />
              <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
              {/* Business */}
              <Route index path="/business-dashboard" element={<ProtectedRoute allowedRoles={['business']}><BusinessDashboard /></ProtectedRoute>} />
              <Route path="/business-customers" element={<ProtectedRoute allowedRoles={['business']}><BusinessCustomers /></ProtectedRoute>} />
              <Route path="/business-invoices" element={<ProtectedRoute allowedRoles={['business']}><BusinessInvoices /></ProtectedRoute>} />
              <Route path="/business-create-receipt" element={<ProtectedRoute allowedRoles={['business']}><BusinessCreateReceipt /></ProtectedRoute>} />
              <Route path="/business-settings" element={<ProtectedRoute allowedRoles={['business']}><BusinessSettings /></ProtectedRoute>} />
              <Route path="/create-invoice" element={<ProtectedRoute allowedRoles={['business']}><CreateInvoice /></ProtectedRoute>} />
              <Route path="/business-products" element={<ProtectedRoute allowedRoles={['business']}><BusinessProducts /></ProtectedRoute>} />
              <Route path="/business-management" element={<ProtectedRoute allowedRoles={['business']}><BusinessManagement /></ProtectedRoute>} />
              <Route path="/business-view-invoices" element={<ProtectedRoute allowedRoles={['business']}><EditBusinessInvoice /></ProtectedRoute>} />
              {/* Accountant */}
              <Route index path="/accountant-dashboard" element={<ProtectedRoute allowedRoles={['accountant']}><AccountantDashboard /></ProtectedRoute>} />
              <Route path="/audit" element={<ProtectedRoute allowedRoles={['accountant']}><Audit /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute allowedRoles={['accountant']}><Payments /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute allowedRoles={['accountant']}><Reports /></ProtectedRoute>} />
              <Route path="/records" element={<ProtectedRoute allowedRoles={['accountant']}><Records /></ProtectedRoute>} />
              {/* Sales */}
              {/* <Route index path="/sales-dashboard" element={<SalesDashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/sales-receipt" element={<Receipt />} />
              <Route path="/sales-sales" element={<Sales />} />
              <Route path="/sales-stocks" element={<Stocks />} /> */}
              {/* Admin */}
              <Route index path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-inventory" element={<ProtectedRoute allowedRoles={['admin']}><AdminInventory /></ProtectedRoute>} />
              <Route path="/admin-receipts" element={<ProtectedRoute allowedRoles={['admin']}><AdminReceipt /></ProtectedRoute>} />
              <Route path="/admin-management" element={<ProtectedRoute allowedRoles={['admin']}><AdminManagement /></ProtectedRoute>} />
              <Route path="/admin-permissions" element={<ProtectedRoute allowedRoles={['admin']}><AdminPermissions /></ProtectedRoute>} />
              <Route path="/admin-integrations" element={<ProtectedRoute allowedRoles={['admin']}><AdminIntegrations /></ProtectedRoute>} />
              <Route path="/admin-settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin-analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
            </Route>
      {/* user */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                 <Route path="/" element={<LandingPage />} />
          </Routes>
          
        </Router>
        </ThemeProvider>
       
      </AuthProvider>
    
    </>
  )
}

export default App
