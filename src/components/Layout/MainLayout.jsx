import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-700">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout