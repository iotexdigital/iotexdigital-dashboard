import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Monitor,
  AlertTriangle,
  FileText,
  Brain,
  Settings,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Efficiency Score', href: '/dashboard', icon: BarChart3 },
  { name: 'Device Monitoring', href: '/dashboard/devices', icon: Monitor },
  { name: 'Anomaly Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'AI Suggestions', href: '/dashboard/ai-suggestions', icon: Brain },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
     {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-[100] p-3 bg-gray-900 border-2 border-yellow-400/50 rounded-lg text-yellow-400 hover:bg-gray-800 hover:border-yellow-400 transition-all shadow-lg shadow-yellow-400/20"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-gray-900 border-r border-gray-800
          transition-transform duration-300 ease-in-out
          w-72 lg:w-64
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:static lg:transform-none
        `}
      >
        {/* Logo Section */}
        <div className="flex h-16 sm:h-20 items-center px-4 sm:px-6 border-b border-gray-800">
          <div className="flex items-center space-x-2 w-full justify-center lg:justify-start">
            <div className="flex justify-center">
              <img
                src="/logo.svg"
                alt="IoTeXDigital Logo"
                className="h-12 sm:h-16 lg:h-20 w-auto max-h-20 object-contain filter drop-shadow-lg brightness-110 contrast-110"
                style={{
                  maxWidth: '180px',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 sm:mt-6 px-2 sm:px-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`
                    group flex items-center px-3 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400 shadow-lg shadow-yellow-400/10'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                    ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'}
                  `} />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* System Status */}
        <div className="absolute bottom-4 left-2 right-2 sm:left-4 sm:right-4">
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-lg p-2.5 sm:p-3">
            <div className="text-yellow-400 text-xs font-medium">System Status</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
              <div className="text-green-400 text-xs sm:text-sm truncate">All Systems Operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for desktop - pushes content to the right */}
      <div className="hidden lg:block w-64" />
    </>
  );
}