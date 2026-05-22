import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'


const Sidebar = () => {
const { currentUser, logout, setCurrentUser } = useAuth();

const navigate = useNavigate()


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
        <div><h1>welcome admin</h1></div>
       )}

       {currentUser.role.toLowerCase().trim() == "user" && (
        <div><h1>welcome user</h1></div>
       )}

       {currentUser.role.toLowerCase().trim() == "solopreneur" && (
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