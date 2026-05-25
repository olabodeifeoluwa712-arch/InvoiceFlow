import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate, Link, NavLink } from 'react-router-dom'
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
    <div className='w-72 bg-white border-r p-4'>
       
       {currentUser.role.toLowerCase().trim() == "admin" && (
        <div>

          <NavLink to="/admin/customers" className="block p-3 rounded-xl hover:bg-purple-100">customers</NavLink>
          <NavLink to='/admin/products' className="block p-3 rounded-xl hover:bg-purple-100">Products</NavLink>
          <NavLink to='/admin/invoices' className="block p-3 rounded-xl hover:bg-purple-100">Invoices</NavLink>
          <NavLink to='/admin/receipts' className="block p-3 rounded-xl hover:bg-purple-100">Receipts</NavLink>
          <NavLink to='/admin/settings' className="block p-3 rounded-xl hover:bg-purple-100">Settings</NavLink>
          <NavLink to='/admin/create-receipt' className="block p-3 rounded-xl hover:bg-purple-100">create-receipt</ NavLink>
          <NavLink to='/admin/create-invoice' className="block p-3 rounded-xl hover:bg-purple-100">create-invoice</NavLink>
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