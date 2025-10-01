import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  Filter,
  Search
} from 'lucide-react';
import type { Alert } from '../../types';

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20' },
  high: { icon: AlertCircle, color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400/20' },
  medium: { icon: Info, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20' },
  low: { icon: CheckCircle, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/20' },
};

const typeLabels = {
  anomaly: 'Anomaly',
  threshold: 'Threshold',
  offline: 'Offline',
  maintenance: 'Maintenance',
};

export function AnomalyAlerts() {
  const { alerts, acknowledgeAlert } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'acknowledged' && alert.acknowledged) ||
                          (statusFilter === 'unacknowledged' && !alert.acknowledged);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const groupedAlerts = filteredAlerts.reduce((groups, alert) => {
    const date = new Date(alert.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(alert);
    return groups;
  }, {} as Record<string, Alert[]>);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Anomaly Alerts</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">AI-powered anomaly detection and alert management</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          {criticalCount > 0 && (
            <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">{criticalCount} Critical</span>
            </div>
          )}
          <div className="text-sm text-gray-400">{unacknowledgedCount} unacknowledged alerts</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(severityConfig).map(([severity, config]) => {
          const count = alerts.filter(alert => alert.severity === severity && !alert.acknowledged).length;
          const Icon = config.icon;
          return (
            <div key={severity} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 sm:p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${config.color} text-sm font-medium`}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">{count}</p>
                </div>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Severity & Status */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All Status</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {Object.entries(groupedAlerts).length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No alerts found</h3>
            <p className="text-gray-400">All systems are operating normally or try adjusting your filters.</p>
          </div>
        ) : (
          Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" /> {date}
              </h3>
              <div className="space-y-3">
                {dateAlerts.map((alert) => {
                  const config = severityConfig[alert.severity];
                  const Icon = config.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${alert.acknowledged ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start sm:items-center gap-3 flex-1">
                        <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-white font-medium">{alert.deviceName}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${config.color} ${config.bgColor}`}>{alert.severity.toUpperCase()}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">{typeLabels[alert.type]}</span>
                          </div>
                          <p className="text-gray-300 mb-2">{alert.message}</p>
                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
                            <span>{getTimeAgo(alert.timestamp)}</span>
                            {alert.acknowledged && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-400" /> Acknowledged
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
