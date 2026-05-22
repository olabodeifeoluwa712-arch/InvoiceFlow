import React, { useState, useEffect } from 'react'
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
const { currentUser, logout, setCurrentUser } = useAuth();

const navigate = useNavigate()
const ADMIN_LINKS={}

const handleLogout = () => {
    logout();
    navigate('/login');
}



if (currentUser == null) {
  return setCurrentUser({role: "user"});
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
       )}

       {currentUser.role.toLowerCase().trim() == "user" && (
        <div><h1>welcome user</h1></div>
       )}

       {currentUser.role.toLowerCase().trim() == "soloprenuer" && (
        <div><h1>welcome solopreneur</h1></div>
       )}

       {currentUser.role.toLowerCase().trim() == "accountant" && (
        <div><h1>welcome accountant</h1></div>
       )}
       {currentUser.role.toLowerCase().trim() == "sales" && (
        <div><h1>welcome sales</h1></div>
       )}

    
       <div>
        <button onClick={handleLogout}>logout</button>
       </div>

    </div>
  )
}

export default Sidebar