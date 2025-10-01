import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { Bell, LogOut, User, Gauge, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Monitor,
  AlertTriangle,
  FileText,
  Brain,
  Settings,
} from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const { alerts, efficiencyData } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const currentEfficiency = efficiencyData[efficiencyData.length - 1]?.overallScore || 0;

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };
    const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const navigation = [
  { name: 'Efficiency Score', href: '/dashboard', icon: BarChart3 },
  { name: 'Device Monitoring', href: '/dashboard/devices', icon: Monitor },
  { name: 'Anomaly Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'AI Suggestions', href: '/dashboard/ai-suggestions', icon: Brain },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];
  return (
    <>
      {/* Header Bar */}
      <div className="bg-gray-900 border-b border-gray-800 h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-white font-semibold text-lg">Dashboard</div>

          {/* Desktop Efficiency Widget */}
          <div className="hidden lg:flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-1">
            <Gauge className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Live Efficiency:</span>
            <span className={`text-sm font-bold ${getEfficiencyColor(currentEfficiency)}`}>
              {Math.round(currentEfficiency)}%
            </span>
          </div>

          {/* Mobile/Tablet Efficiency Widget */}
          <div className="flex lg:hidden items-center space-x-1 bg-gray-800 rounded-lg px-2 py-1">
            <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className={`text-xs sm:text-sm font-bold ${getEfficiencyColor(currentEfficiency)}`}>
              {Math.round(currentEfficiency)}%
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications (Desktop/Tablet) */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {unacknowledgedAlerts.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center">No new alerts</div>
                  ) : (
                    unacknowledgedAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="p-3 border-b border-gray-700 last:border-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-white mt-1 truncate">{alert.deviceName}</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">{alert.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu (Desktop/Tablet) */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
              <span className="text-white text-sm hidden md:inline truncate max-w-[120px]">
                {user?.name}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-gray-700">
                  <div className="text-white font-medium truncate">{user?.name}</div>
                  <div className="text-gray-400 text-sm truncate">{user?.email}</div>
                </div>
                <div className="py-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="absolute top-16 right-0 left-0 bg-gray-900 border-b border-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{user?.name}</div>
                  <div className="text-gray-400 text-sm truncate">{user?.email}</div>
                </div>
              </div>
            </div>
                <div>
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
            {/* Notifications */}
            {/* <div className="border-b border-gray-800">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">Notifications</h3>
                  {unacknowledgedAlerts.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unacknowledgedAlerts.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {unacknowledgedAlerts.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No new alerts</div>
                  ) : (
                    unacknowledgedAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-white truncate">{alert.deviceName}</div>
                        <div className="text-xs text-gray-400 line-clamp-2">{alert.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div> */}

            {/* Logout */}
            <div className="p-4">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
