import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import jsPDF from 'jspdf';

export function Reports() {
  const { devices, alerts, efficiencyData } = useDashboard();
  const [reportType, setReportType] = useState<'efficiency' | 'devices' | 'alerts'>('efficiency');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('24h');

  const generateReport = (format: 'csv' | 'pdf') => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      generateCSVReport(timestamp);
    } else {
      generatePDFReport(timestamp);
    }
  };

  const generateCSVReport = (timestamp: string) => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'efficiency':
        csvContent = 'Timestamp,Overall Score,Uptime,Performance,Energy,Maintenance\n';
        efficiencyData.forEach(data => {
          csvContent += `${data.timestamp.toISOString()},${data.overallScore},${data.factors.uptime},${data.factors.performance},${data.factors.energy},${data.factors.maintenance}\n`;
        });
        filename = `efficiency-report-${timestamp}.csv`;
        break;
        
      case 'devices':
        csvContent = 'Device Name,Type,Status,Location,Current Value,Unit,Efficiency,Last Update\n';
        devices.forEach(device => {
          csvContent += `${device.name},${device.type},${device.status},${device.location},${device.currentValue},${device.unit},${device.efficiency},${device.lastUpdate.toISOString()}\n`;
        });
        filename = `devices-report-${timestamp}.csv`;
        break;
        
      case 'alerts':
        csvContent = 'Device Name,Type,Severity,Message,Timestamp,Acknowledged\n';
        alerts.forEach(alert => {
          csvContent += `${alert.deviceName},${alert.type},${alert.severity},"${alert.message}",${alert.timestamp.toISOString()},${alert.acknowledged}\n`;
        });
        filename = `alerts-report-${timestamp}.csv`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFReport = (timestamp: string) => {
    const pdf = new jsPDF();
    let filename = '';

    // Header
    pdf.setFontSize(20);
    pdf.text('IoTeXDigital - Operational Report', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

    switch (reportType) {
      case 'efficiency':
        filename = `efficiency-report-${timestamp}.pdf`;
        pdf.setFontSize(16);
        pdf.text('Efficiency Analysis', 20, 50);
        
        const currentEfficiency = efficiencyData[efficiencyData.length - 1];
        if (currentEfficiency) {
          pdf.setFontSize(12);
          pdf.text(`Current Overall Score: ${Math.round(currentEfficiency.overallScore)}%`, 20, 70);
          pdf.text(`Uptime Factor: ${Math.round(currentEfficiency.factors.uptime)}%`, 20, 80);
          pdf.text(`Performance Factor: ${Math.round(currentEfficiency.factors.performance)}%`, 20, 90);
          pdf.text(`Energy Factor: ${Math.round(currentEfficiency.factors.energy)}%`, 20, 100);
          pdf.text(`Maintenance Factor: ${Math.round(currentEfficiency.factors.maintenance)}%`, 20, 110);
        }
        break;
        
      case 'devices':
        filename = `devices-report-${timestamp}.pdf`;
        pdf.setFontSize(16);
        pdf.text('Device Status Report', 20, 50);
        
        const onlineDevices = devices.filter(d => d.status === 'online').length;
        const avgEfficiency = devices.reduce((sum, d) => sum + d.efficiency, 0) / devices.length;
        
        pdf.setFontSize(12);
        pdf.text(`Total Devices: ${devices.length}`, 20, 70);
        pdf.text(`Online Devices: ${onlineDevices} (${Math.round((onlineDevices / devices.length) * 100)}%)`, 20, 80);
        pdf.text(`Average Efficiency: ${Math.round(avgEfficiency)}%`, 20, 90);
        break;
        
      case 'alerts':
        filename = `alerts-report-${timestamp}.pdf`;
        pdf.setFontSize(16);
        pdf.text('Alerts Summary', 20, 50);
        
        const totalAlerts = alerts.length;
        const unacknowledged = alerts.filter(a => !a.acknowledged).length;
        const critical = alerts.filter(a => a.severity === 'critical').length;
        
        pdf.setFontSize(12);
        pdf.text(`Total Alerts: ${totalAlerts}`, 20, 70);
        pdf.text(`Unacknowledged: ${unacknowledged}`, 20, 80);
        pdf.text(`Critical Alerts: ${critical}`, 20, 90);
        break;
    }

    pdf.save(filename);
  };

  const reportStats = {
    efficiency: {
      title: 'Efficiency Report',
      description: 'Overall operational efficiency metrics and trends',
      icon: BarChart3,
      data: efficiencyData.length,
      metric: `${Math.round(efficiencyData[efficiencyData.length - 1]?.overallScore || 0)}% Current Score`
    },
    devices: {
      title: 'Device Report',
      description: 'Device status, performance, and operational metrics',
      icon: Activity,
      data: devices.length,
      metric: `${devices.filter(d => d.status === 'online').length} Online`
    },
    alerts: {
      title: 'Alerts Report',
      description: 'Anomalies, alerts, and system notifications',
      icon: AlertTriangle,
      data: alerts.length,
      metric: `${alerts.filter(a => !a.acknowledged).length} Unacknowledged`
    }
  };

  const currentReport = reportStats[reportType];
  const Icon = currentReport.icon;

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Generate detailed reports and export operational data</p>
        </div>
      </div>

      {/* Report selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {Object.entries(reportStats).map(([key, report]) => {
          const ReportIcon = report.icon;
          const isSelected = reportType === key;
          
          return (
            <button
              key={key}
              onClick={() => setReportType(key as any)}
              className={`p-4 sm:p-6 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-yellow-400/10 border-yellow-400/30 shadow-lg shadow-yellow-400/10' 
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <ReportIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span className={`text-xl sm:text-2xl font-bold ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {report.data}
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                {report.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">{report.description}</p>
              <p className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>
                {report.metric}
              </p>
            </button>
          );
        })}
      </div>

      {/* Report configuration and preview */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">{currentReport.title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Report preview */}
        <div className="bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Report Preview</h3>
          
          {reportType === 'efficiency' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {Math.round(efficiencyData[efficiencyData.length - 1]?.overallScore || 0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {Math.round(efficiencyData[efficiencyData.length - 1]?.factors.uptime || 0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {Math.round(efficiencyData[efficiencyData.length - 1]?.factors.performance || 0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {Math.round(efficiencyData[efficiencyData.length - 1]?.factors.energy || 0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Energy</div>
              </div>
            </div>
          )}

          {reportType === 'devices' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{devices.length}</div>
                <div className="text-xs sm:text-sm text-gray-400">Total Devices</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {devices.filter(d => d.status === 'online').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Online</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {devices.filter(d => d.status === 'warning').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Warning</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-400">
                  {devices.filter(d => d.status === 'offline').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Offline</div>
              </div>
            </div>
          )}

          {reportType === 'alerts' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-400">
                  {alerts.filter(a => a.severity === 'critical').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-400">
                  {alerts.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">High</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {alerts.filter(a => a.severity === 'medium').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {alerts.filter(a => a.severity === 'low').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Low</div>
              </div>
            </div>
          )}
        </div>

        {/* Export buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-gray-400">
            <p className="text-sm sm:text-base">Export {currentReport.title.toLowerCase()} data for the selected time range.</p>
            <p className="text-xs sm:text-sm">Includes all relevant metrics and device information.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => generateReport('csv')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={() => generateReport('pdf')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent exports */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Exports</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-base text-white font-medium truncate">efficiency-report-2024-01-15.pdf</div>
                <div className="text-gray-400 text-xs sm:text-sm">Generated 2 hours ago</div>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 ml-2" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-base text-white font-medium truncate">devices-report-2024-01-15.csv</div>
                <div className="text-gray-400 text-xs sm:text-sm">Generated 5 hours ago</div>
              </div>
            </div>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}