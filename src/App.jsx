import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Login from './Pages/user/login'
import Register from './Pages/user/Register'
import MainLayout from './components/Layout/MainLayout'
import { AuthProvider } from './Context/AuthContext'
import { ThemeProvider } from './Context/ThemeContext'
import Audit from './Pages/Accountant/Audit'
import Accountantdashboard from './Pages/Accountant/Dashboard'
import Payments from './Pages/Accountant/Payments'
import Reports from './Pages/Accountant/Reports'
import Records from './Pages/Accountant/Records'
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
import Dashboard from './Pages/user/Dashboard'
import CreateReceipt from './Pages/Admin/createReceipt'
import CreateInvoice from './Pages/Admin/CreateInvoice'


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
           <Route path='/' element={<MainLayout />}>

  <Route path="/dashboard" element={<Dashboard />} />

  <Route
    path="/solopreneur/dashboard"
    element={<SolopreneurDashboard />}
  />

  <Route
    path="/admin/customers"
    element={<AdminCustomers />}
  />

  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />

  <Route
    path="/admin/invoices"
    element={<AdminInvoices />}
  />

  <Route
    path="/admin/products"
    element={<AdminProducts />}
  />

  <Route
    path="/admin/receipts"
    element={<AdminReceipts />}
  />

  <Route
    path="/admin/settings"
    element={<AdminSettings />}
  />

  <Route
    path="/sales/dashboard"
    element={<SalesDashboard />}
  />

  <Route
    path="/sales/notifications"
    element={<Notifications />}
  />

  <Route
    path="/sales/receipt"
    element={<Receipt />}
  />

  <Route
    path="/sales/sales"
    element={<Sales />}
  />

  <Route
    path="/sales/stocks"
    element={<Stocks />}
  />

  <Route
    path="/solopreneur/catalogue"
    element={<Catalogue />}
  />

  <Route
    path="/solopreneur/customers"
    element={<Customers />}
  />

  <Route
    path="/solopreneur/invoice"
    element={<Invoice />}
  />

  <Route
    path="/solopreneur/orders"
    element={<Orders />}
  />

  <Route
    path="/solopreneur/profile"
    element={<Profile />}
  />

  <Route
    path="/accountant/audit"
    element={<Audit />}
  />

  <Route
    path="/accountant/dashboard"
    element={<Accountantdashboard />}
  />

  <Route
    path="/accountant/payments"
    element={<Payments />}
  />

  <Route
    path="/accountant/reports"
    element={<Reports />}
  />

  <Route
    path="/accountant/records"
    element={<Records />}
  />

  <Route
    path="/admin/create-invoice"
    element={<CreateInvoice />}
  />

  <Route
    path="/admin/create-receipt"
    element={<CreateReceipt />}
  />

</Route>
            
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
