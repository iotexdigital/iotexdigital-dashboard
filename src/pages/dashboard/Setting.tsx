import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Wifi, 
  Save,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

export function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      criticalAlerts: true,
      maintenanceReminders: true,
      weeklyReports: false
    },
    dashboard: {
      theme: 'dark',
      refreshRate: '3000',
      defaultView: 'efficiency',
      showAnimations: true
    },
    integrations: {
      awsIot: false,
      azureIot: true,
      googleCloud: false,
      mqtt: true
    }
  });
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'dashboard', name: 'Dashboard', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Database },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    // Simulate saving settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Manage your account and dashboard preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <X className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Sidebar - Horizontal scroll on mobile */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-3 sm:p-4">
              <h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">Settings</h3>
              
              {/* Mobile: Horizontal scrolling tabs */}
              <div className="flex lg:hidden overflow-x-auto pb-2 -mx-3 px-3 space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm whitespace-nowrap">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Desktop: Vertical tabs */}
              <nav className="hidden lg:block space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Profile Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 sm:pt-6">
                  <h4 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Change Password</h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.profile.currentPassword}
                          onChange={(e) => updateSetting('profile', 'currentPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 sm:top-3 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={settings.profile.newPassword}
                          onChange={(e) => updateSetting('profile', 'newPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={settings.profile.confirmPassword}
                          onChange={(e) => updateSetting('profile', 'confirmPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Notification Preferences</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base text-white font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {key === 'emailAlerts' && 'Receive alerts via email'}
                          {key === 'pushNotifications' && 'Browser push notifications'}
                          {key === 'criticalAlerts' && 'Immediate alerts for critical issues'}
                          {key === 'maintenanceReminders' && 'Scheduled maintenance notifications'}
                          {key === 'weeklyReports' && 'Weekly summary reports'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Dashboard Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Data Refresh Rate
                    </label>
                    <select
                      value={settings.dashboard.refreshRate}
                      onChange={(e) => updateSetting('dashboard', 'refreshRate', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="1000">1 second</option>
                      <option value="3000">3 seconds</option>
                      <option value="5000">5 seconds</option>
                      <option value="10000">10 seconds</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Default View
                    </label>
                    <select
                      value={settings.dashboard.defaultView}
                      onChange={(e) => updateSetting('dashboard', 'defaultView', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="efficiency">Efficiency Score</option>
                      <option value="devices">Device Monitoring</option>
                      <option value="alerts">Anomaly Alerts</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base text-white font-medium">Show Animations</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Enable smooth transitions and animations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.dashboard.showAnimations}
                      onChange={(e) => updateSetting('dashboard', 'showAnimations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">IoT Platform Integrations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(settings.integrations).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base text-white font-medium truncate">
                            {key === 'awsIot' && 'AWS IoT Core'}
                            {key === 'azureIot' && 'Azure IoT Hub'}
                            {key === 'googleCloud' && 'Google Cloud IoT'}
                            {key === 'mqtt' && 'MQTT Broker'}
                          </h4>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {value ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting('integrations', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Security Settings</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-sm sm:text-base text-white font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Add an extra layer of security to your account</p>
                    <button className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base rounded-lg transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-sm sm:text-base text-white font-medium mb-2">API Keys</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Manage API keys for external integrations</p>
                    <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base rounded-lg transition-colors">
                      Manage Keys
                    </button>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-sm sm:text-base text-white font-medium mb-2">Session Management</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">View and manage active sessions</p>
                    <button className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base rounded-lg transition-colors">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}