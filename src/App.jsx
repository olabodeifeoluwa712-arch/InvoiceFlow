import React from 'react'
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
import { ThemeProvider } from './Context/ThemeContext'

function App() {

  return (
    <>
    
      <AuthProvider>
       
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
            
              {/* Inventory Manager */}
              <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory-products" element={<Products />} />
              <Route path="/stock-adjustment" element={<StockAdjustment />} />
              <Route path="/stock-history" element={<StockHistory />} />
              <Route path="/low-stock-alerts" element={<LowStockAlerts />} />
              {/* Solopreneur */}
              <Route path="/solopreneur-dashboard" element={<SolopreneurDashboard />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              {/* Business */}
              <Route path="/" element={<BusinessDashboard />} />
              <Route path="/business-customers" element={<BusinessCustomers />} />
              <Route path="/business-invoices" element={<BusinessInvoices />} />
              <Route path="/business-create-receipt" element={<BusinessCreateReceipt />} />
              <Route path="/business-settings" element={<BusinessSettings />} />
              <Route path="/create-invoice" element={<CreateInvoice />} />
              {/* Accountant */}
              <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/records" element={<Records />} />
              {/* Sales */}
              <Route path="/sales-dashboard" element={<SalesDashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/sales-receipt" element={<Receipt />} />
              <Route path="/sales-sales" element={<Sales />} />
              <Route path="/sales-stocks" element={<Stocks />} />
              {/* Admin */}
              <Route path="/admin-receipts" element={<AdminReceipt />} />
            </Route>
      {/* user */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
       
      </AuthProvider>
    
    </>
  )
}

export default App