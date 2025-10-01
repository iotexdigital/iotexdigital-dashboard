import React, { useState } from 'react';
import { 
  Monitor, 
  Thermometer, 
  Droplets, 
  Zap, 
  Activity, 
  Waves,
  Circle,
  Filter,
  Search,
  X
} from 'lucide-react';

// Mock EfficiencyGauge component
const EfficiencyGauge = ({ score, size = "md", showLabel = true }) => {
  const getColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-700 flex items-center justify-center ${getColor(score)}`}>
        <span className="font-bold">{Math.round(score)}%</span>
      </div>
      {showLabel && <span className="text-xs text-gray-400 mt-1">Efficiency</span>}
    </div>
  );
};

const deviceIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  energy: Zap,
  pressure: Activity,
  vibration: Waves,
};

const statusColors = {
  online: 'text-green-400 bg-green-400/20',
  warning: 'text-yellow-400 bg-yellow-400/20',
  error: 'text-red-400 bg-red-400/20',
  offline: 'text-gray-400 bg-gray-400/20',
};

// Mock data
const mockDevices = [
  {
    id: '1',
    name: 'Temp Sensor A1',
    location: 'Warehouse North',
    type: 'temperature',
    status: 'online',
    currentValue: 22.5,
    unit: '°C',
    normalRange: [18, 25],
    maxValue: 50,
    efficiency: 87,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Humidity Monitor',
    location: 'Production Floor',
    type: 'humidity',
    status: 'warning',
    currentValue: 68,
    unit: '%',
    normalRange: [40, 60],
    maxValue: 100,
    efficiency: 72,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Energy Meter B2',
    location: 'Main Building',
    type: 'energy',
    status: 'online',
    currentValue: 145.3,
    unit: 'kW',
    normalRange: [100, 200],
    maxValue: 300,
    efficiency: 91,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pressure Gauge',
    location: 'Compressor Room',
    type: 'pressure',
    status: 'error',
    currentValue: 95,
    unit: 'PSI',
    normalRange: [60, 80],
    maxValue: 120,
    efficiency: 45,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vibration Sensor',
    location: 'Motor Assembly',
    type: 'vibration',
    status: 'online',
    currentValue: 2.1,
    unit: 'mm/s',
    normalRange: [0, 3],
    maxValue: 10,
    efficiency: 88,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Temp Sensor B3',
    location: 'Server Room',
    type: 'temperature',
    status: 'offline',
    currentValue: 0,
    unit: '°C',
    normalRange: [18, 24],
    maxValue: 50,
    efficiency: 0,
    lastUpdate: new Date(Date.now() - 3600000).toISOString()
  }
];

export default function DeviceMonitoring() {
  const devices = mockDevices;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  const isValueInRange = (device) => {
    return device.currentValue >= device.normalRange[0] && device.currentValue <= device.normalRange[1];
  };

  const deviceTypes = [...new Set(devices.map(d => d.type))];
  const deviceStatuses = [...new Set(devices.map(d => d.status))];

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Device Monitoring</h1>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">Real-time IoT device status and performance</p>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
            <span className="font-medium text-white">{filteredDevices.length}</span> of {devices.length} devices
          </div>
        </div>

        {/* Search and Filter Toggle */}
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-between w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Filters - Hidden on mobile by default, always visible on desktop */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col sm:flex-row gap-3`}>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="hidden md:block w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
                >
                  <option value="all">All Status</option>
                  {deviceStatuses.map(status => (
                    <option key={status} value={status}>{getStatusText(status)}</option>
                  ))}
                </select>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
              >
                <option value="all">All Types</option>
                {deviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="w-full sm:w-auto px-3 py-2 text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {filteredDevices.map((device) => {
            const Icon = deviceIcons[device.type];
            const isInRange = isValueInRange(device);
            
            return (
              <div 
                key={device.id} 
                className="bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{device.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{device.location}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[device.status]}`}>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Circle className="w-2 h-2 fill-current" />
                      <span className="hidden sm:inline">{getStatusText(device.status)}</span>
                      <span className="sm:hidden">{getStatusText(device.status).slice(0, 3)}</span>
                    </div>
                  </div>
                </div>

                {/* Value & Efficiency */}
                <div className="flex justify-between items-center mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-white truncate">
                      {device.currentValue.toFixed(1)} {device.unit}
                    </div>
                    <div className={`text-xs sm:text-sm ${isInRange ? 'text-green-400' : 'text-red-400'}`}>
                      Range: {device.normalRange[0]}-{device.normalRange[1]} {device.unit}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <EfficiencyGauge score={device.efficiency} size="sm" showLabel={false} />
                  </div>
                </div>

                {/* Status Indicator Bar */}
                <div className="mb-4 w-full bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isInRange ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, (device.currentValue / device.maxValue) * 100)}%` }}
                  />
                </div>

                {/* Footer Info */}
                <div className="border-t border-gray-700 pt-3 sm:pt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-white font-medium">{new Date(device.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-right sm:text-left">
                    <span className="text-gray-400">Efficiency</span>
                    <span className="text-yellow-400 font-bold">{Math.round(device.efficiency)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Devices Message */}
        {filteredDevices.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <Monitor className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">No devices found</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
            {(searchTerm || activeFiltersCount > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}