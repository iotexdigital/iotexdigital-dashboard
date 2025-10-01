export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'energy' | 'pressure' | 'vibration';
  status: 'online' | 'offline' | 'warning' | 'error';
  location: string;
  currentValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  normalRange: [number, number];
  lastUpdate: Date;
  efficiency: number;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'anomaly' | 'threshold' | 'offline' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface EfficiencyData {
  timestamp: Date;
  overallScore: number;
  deviceScores: Record<string, number>;
  factors: {
    uptime: number;
    performance: number;
    energy: number;
    maintenance: number;
  };
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: 'energy' | 'maintenance' | 'performance' | 'optimization';
  estimatedSavings: number;
  implementationTime: string;
  priority: number;
}