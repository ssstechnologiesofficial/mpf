import { useState } from 'react'
import { Outlet, Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import DashboardHome from '../pages/DashboardHome'
import PortfolioBuilder from '../pages/PortfolioBuilder'
import CalculatorSelection from '../pages/CalculatorSelection'

export default function DashboardLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} setIsAuthenticated={setIsAuthenticated} />
      
      <div className="flex-1 flex flex-col lg:pl-32">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main content area */}
        <main className="flex-1 p-4">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<div className="p-4"><h1 className="text-2xl font-bold">Profile</h1></div>} />
            <Route path="portfolio" element={<div className="p-4"><h1 className="text-2xl font-bold">Portfolio Builder</h1></div>} />
            <Route path="portfolio-builder" element={<PortfolioBuilder />} />
            <Route path="portfolio-builder/calculators" element={<CalculatorSelection />} />
            <Route path="analytics" element={<div className="p-4"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
            <Route path="settings" element={<div className="p-4"><h1 className="text-2xl font-bold">Settings</h1></div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}