// ==========================================
// Rutas para el módulo de reportes
// ==========================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReportsDashboard } from '../pages/ReportsDashboard';
export var ReportsRoutes = function () {
    return (<Routes>
      <Route path="/" element={<ReportsDashboard />}/>
      <Route path="/dashboard" element={<ReportsDashboard />}/>
    </Routes>);
};
