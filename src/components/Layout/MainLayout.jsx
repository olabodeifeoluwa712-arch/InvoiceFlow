import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <>
            {/* top panel */}
            <div>

            </div>
            {/* Sidebar panel */}
            <div>
                
            </div>
            {/* main panel */}
            <div>
                <Outlet/>
            </div>

        </>
    )
}

export default MainLayout