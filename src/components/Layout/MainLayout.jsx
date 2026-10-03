import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import Topbar from './Topbar'

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0B0D10] text-slate-900 dark:text-[#F3F4F6] transition-colors duration-200">
      
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Topbar */}
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto min-w-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-[#272D35] dark:scrollbar-track-transparent">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout