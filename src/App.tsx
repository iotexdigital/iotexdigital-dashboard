import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { EfficiencyScore } from './pages/dashboard/EfficiencyScore';
import DeviceMonitoring from './pages/dashboard/DeviceMonitoring';
import { AnomalyAlerts } from './pages/dashboard/AnomalyAlerts';
import { Reports } from './pages/dashboard/Reports';
import { AISuggestions } from './pages/dashboard/AISuggestions';
import { Settings } from './pages/dashboard/Setting';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<EfficiencyScore />} />
              <Route path="devices" element={<DeviceMonitoring />} />
              <Route path="alerts" element={<AnomalyAlerts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="ai-suggestions" element={<AISuggestions />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
