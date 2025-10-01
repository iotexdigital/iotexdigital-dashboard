import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { EfficiencyGauge } from '../../components/ui/EfficiencyGauge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';

export function EfficiencyScore() {
  const { efficiencyData, devices } = useDashboard();

  const currentEfficiency = efficiencyData[efficiencyData.length - 1];
  const previousEfficiency = efficiencyData[efficiencyData.length - 2];
  const trend = currentEfficiency && previousEfficiency 
    ? currentEfficiency.overallScore - previousEfficiency.overallScore 
    : 0;

  const chartData = efficiencyData.slice(-20).map(data => ({
    time: format(data.timestamp, 'HH:mm'),
    score: Math.round(data.overallScore),
    uptime: Math.round(data.factors.uptime),
    performance: Math.round(data.factors.performance),
    energy: Math.round(data.factors.energy),
    maintenance: Math.round(data.factors.maintenance),
  }));

  const activeDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;
  const avgDeviceEfficiency = devices.reduce((sum, device) => sum + device.efficiency, 0) / devices.length;

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Operational Efficiency Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Real-time AI-powered efficiency monitoring and analytics</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 sm:px-4 py-2 w-fit">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
          <span className="text-sm sm:text-base text-green-400 font-medium">Live Data</span>
        </div>
      </div>

      {/* Main efficiency score and trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Overall Efficiency Score</h3>
              <EfficiencyGauge score={currentEfficiency?.overallScore || 0} size="lg" showLabel={false} />
              <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2">
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(trend).toFixed(1)}% from last update
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Efficiency Trend (Last 24 Hours)</h3>
            <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#F59E0B" 
                    fillOpacity={1} 
                    fill="url(#efficiencyGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Device Uptime</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(currentEfficiency?.factors.uptime || 0)}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-400 text-xs sm:text-sm">
              {activeDevices}/{totalDevices} devices online
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Performance</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(currentEfficiency?.factors.performance || 0)}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-blue-400 text-xs sm:text-sm">
              Avg device efficiency: {Math.round(avgDeviceEfficiency)}%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Energy Efficiency</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(currentEfficiency?.factors.energy || 0)}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-yellow-400 text-xs sm:text-sm">
              Optimized consumption
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Maintenance Score</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(currentEfficiency?.factors.maintenance || 0)}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-purple-400 text-xs sm:text-sm">
              Predictive maintenance
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency factors breakdown */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Efficiency Factors Breakdown</h3>
        <div className="h-48 sm:h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={2} name="Uptime" />
              <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} name="Performance" />
              <Line type="monotone" dataKey="energy" stroke="#F59E0B" strokeWidth={2} name="Energy" />
              <Line type="monotone" dataKey="maintenance" stroke="#8B5CF6" strokeWidth={2} name="Maintenance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}