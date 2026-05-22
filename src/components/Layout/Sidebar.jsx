import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext'


const Sidebar = () => {
const { currentUser, setCurrentUser } = useAuth();
console.log(currentUser)



  return (
    <div>
        {currentUser.role == 'admin' && (
            <div>welcome admin</div>
        )}
        {currentUser.role == 'customer' && (
            <div>welcome customer</div>
        )}
    


    </div>
  )
}

export default Sidebar