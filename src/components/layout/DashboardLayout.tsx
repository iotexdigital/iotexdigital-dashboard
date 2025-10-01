import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardProvider } from '../../contexts/DashboardContext';

// Layout Context to manage sidebar state
const LayoutContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <DashboardProvider>
      <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
        <div className="min-h-screen flex bg-gray-900 text-white">
          
          {/* Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 lg:static lg:flex-shrink-0
            `}
          >
            <Sidebar />
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col transition-all duration-300">
            <Header />
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </LayoutContext.Provider>
    </DashboardProvider>
  );
}
