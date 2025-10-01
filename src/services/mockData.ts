import type { Device, Alert, EfficiencyData, AISuggestion } from '../types';

export function generateMockDevices(): Device[] {
  const deviceTypes = [
    { type: 'temperature' as const, unit: '°C', min: 15, max: 35, normal: [18, 28] },
    { type: 'humidity' as const, unit: '%', min: 0, max: 100, normal: [30, 70] },
    { type: 'energy' as const, unit: 'kWh', min: 0, max: 1000, normal: [100, 800] },
    { type: 'pressure' as const, unit: 'PSI', min: 0, max: 150, normal: [20, 100] },
    { type: 'vibration' as const, unit: 'Hz', min: 0, max: 60, normal: [5, 30] },
  ];

  const locations = ['Factory Floor A', 'Factory Floor B', 'Warehouse', 'Office Building', 'Production Line 1', 'Production Line 2'];
  const statuses: Device['status'][] = ['online', 'online', 'online', 'warning', 'offline'];

  return Array.from({ length: 12 }, (_, i) => {
    const deviceType = deviceTypes[i % deviceTypes.length];
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    
    return {
      id: `device-${i + 1}`,
      name: `${deviceType.type.charAt(0).toUpperCase() + deviceType.type.slice(1)} Sensor ${i + 1}`,
      type: deviceType.type,
      status,
      location,
      currentValue: Math.random() * (deviceType.max - deviceType.min) + deviceType.min,
      unit: deviceType.unit,
      minValue: deviceType.min,
      maxValue: deviceType.max,
      normalRange: deviceType.normal as [number, number],
      lastUpdate: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
      efficiency: Math.random() * 40 + 60, // 60-100% efficiency
    };
  });
}

export function generateMockAlerts(): Alert[] {
  const devices = generateMockDevices();
  const alertTypes: Alert['type'][] = ['anomaly', 'threshold', 'offline', 'maintenance'];
  const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
  
  const alertMessages = {
    anomaly: 'Anomalous behavior detected in sensor readings',
    threshold: 'Value exceeded normal operating range',
    offline: 'Device communication lost',
    maintenance: 'Scheduled maintenance required'
  };

  return Array.from({ length: 8 }, (_, i) => {
    const device = devices[i % devices.length];
    const type = alertTypes[i % alertTypes.length];
    const severity = severities[i % severities.length];
    
    return {
      id: `alert-${i + 1}`,
      deviceId: device.id,
      deviceName: device.name,
      type,
      severity,
      message: alertMessages[type],
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Last 24 hours
      acknowledged: Math.random() > 0.7,
    };
  });
}

export function generateMockEfficiencyData(): EfficiencyData[] {
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - (19 - i) * 300000), // Every 5 minutes
    overallScore: Math.random() * 30 + 70, // 70-100% efficiency
    deviceScores: {},
    factors: {
      uptime: Math.random() * 20 + 80,
      performance: Math.random() * 25 + 75,
      energy: Math.random() * 30 + 70,
      maintenance: Math.random() * 35 + 65,
    }
  }));
}

export function generateMockAISuggestions(): AISuggestion[] {
  const suggestions = [
    {
      title: 'Optimize Energy Consumption During Off-Peak Hours',
      description: 'AI analysis suggests shifting 30% of energy-intensive operations to off-peak hours could reduce costs by 15%.',
      category: 'energy' as const,
      estimatedSavings: 12500,
      implementationTime: '2-3 weeks',
      impact: 'high' as const,
    },
    {
      title: 'Predictive Maintenance for Vibration Sensors',
      description: 'Machine learning models indicate potential bearing failure in 2-3 weeks based on vibration patterns.',
      category: 'maintenance' as const,
      estimatedSavings: 8500,
      implementationTime: '1 week',
      impact: 'medium' as const,
    },
    {
      title: 'Temperature Control Optimization',
      description: 'Adjust temperature thresholds by 2°C to maintain quality while reducing energy consumption.',
      category: 'performance' as const,
      estimatedSavings: 5200,
      implementationTime: '3-5 days',
      impact: 'medium' as const,
    },
    {
      title: 'Automated Alert Prioritization',
      description: 'Implement AI-driven alert classification to reduce false positives by 40% and improve response times.',
      category: 'optimization' as const,
      estimatedSavings: 15000,
      implementationTime: '4-6 weeks',
      impact: 'high' as const,
    },
  ];

  return suggestions.map((suggestion, i) => ({
    ...suggestion,
    id: `suggestion-${i + 1}`,
    priority: Math.floor(Math.random() * 10) + 1,
  }));
}