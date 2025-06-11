// ==========================================
// Rutas para el módulo de reportes
// ==========================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReportsDashboard } from '../pages/ReportsDashboard';

export const ReportsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportsDashboard />} />
      <Route path="/dashboard" element={<ReportsDashboard />} />
    </Routes>
  );
};
