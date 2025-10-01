import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Device, Alert, EfficiencyData, AISuggestion } from '../types';
import { generateMockDevices, generateMockAlerts, generateMockEfficiencyData, generateMockAISuggestions } from '../services/mockData';

interface DashboardContextType {
  devices: Device[];
  alerts: Alert[];
  efficiencyData: EfficiencyData[];
  aiSuggestions: AISuggestion[];
  acknowledgeAlert: (alertId: string) => void;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    // Initialize mock data
    refreshData();
    
    // Set up real-time data updates
    const interval = setInterval(() => {
      updateDeviceData();
      updateEfficiencyData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setDevices(generateMockDevices());
    setAlerts(generateMockAlerts());
    setEfficiencyData(generateMockEfficiencyData());
    setAiSuggestions(generateMockAISuggestions());
  };

  const updateDeviceData = () => {
    setDevices(prevDevices => 
      prevDevices.map(device => ({
        ...device,
        currentValue: generateNewValue(device),
        lastUpdate: new Date(),
        efficiency: Math.max(0, Math.min(100, device.efficiency + (Math.random() - 0.5) * 5))
      }))
    );
  };

  const updateEfficiencyData = () => {
    setEfficiencyData(prevData => {
      const newData = [...prevData];
      if (newData.length > 50) {
        newData.shift(); // Keep only last 50 data points
      }
      
      const lastScore = newData[newData.length - 1]?.overallScore || 75;
      const newScore = Math.max(0, Math.min(100, lastScore + (Math.random() - 0.5) * 3));
      
      newData.push({
        timestamp: new Date(),
        overallScore: newScore,
        deviceScores: {},
        factors: {
          uptime: Math.random() * 100,
          performance: Math.random() * 100,
          energy: Math.random() * 100,
          maintenance: Math.random() * 100,
        }
      });
      
      return newData;
    });
  };

  const generateNewValue = (device: Device) => {
    const variance = (device.maxValue - device.minValue) * 0.1;
    const trend = Math.sin(Date.now() / 10000) * variance;
    let newValue = device.currentValue + trend + (Math.random() - 0.5) * variance;
    
    // Keep within bounds
    newValue = Math.max(device.minValue, Math.min(device.maxValue, newValue));
    return Math.round(newValue * 100) / 100;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const value = {
    devices,
    alerts,
    efficiencyData,
    aiSuggestions,
    acknowledgeAlert,
    refreshData,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}