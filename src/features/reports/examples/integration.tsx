// ==========================================
// Ejemplo de integración del módulo de reportes
// ==========================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  ReportsDashboard,
  ReportsRoutes,
  useReports,
  REPORT_TYPES 
} from '@/features/reports';

// ==========================================
// 1. Ejemplo básico - Página principal de reportes
// ==========================================

export const ReportsMainPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <ReportsDashboard />
    </div>
  );
};

// ==========================================
// 2. Ejemplo - Widget de reporte rápido
// ==========================================

export const QuickReportWidget: React.FC = () => {
  const { generateReport, reportsState } = useReports();

  const generateBalanceGeneral = async () => {
    await generateReport({
      reportType: REPORT_TYPES.BALANCE_GENERAL,
      filters: {
        from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        detail_level: 'medio'
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Reporte Rápido</h3>
      
      <button
        onClick={generateBalanceGeneral}
        disabled={reportsState.isGenerating}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {reportsState.isGenerating ? 'Generando...' : 'Balance General Este Mes'}
      </button>

      {reportsState.currentReport && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            ✅ Reporte generado exitosamente
          </p>
        </div>
      )}

      {reportsState.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">
            ❌ {reportsState.error}
          </p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. Ejemplo - Configuración de rutas en App.tsx
// ==========================================

export const AppRoutesExample: React.FC = () => {
  return (
    <Routes>
      {/* Ruta principal de reportes */}
      <Route path="/reportes/*" element={<ReportsRoutes />} />
      
      {/* Página específica usando el dashboard */}
      <Route path="/dashboard/reportes" element={<ReportsMainPage />} />
      
      {/* Redirección por defecto */}
      <Route path="/reportes" element={<Navigate to="/reportes/dashboard" replace />} />
      
      {/* Otras rutas de la aplicación */}
      <Route path="/cuentas/*" element={<div>Módulo de Cuentas</div>} />
      <Route path="/asientos/*" element={<div>Módulo de Asientos</div>} />
    </Routes>
  );
};

// ==========================================
// 4. Ejemplo - Hook personalizado para dashboard ejecutivo
// ==========================================

export const useExecutiveDashboard = () => {
  const { generateReport, reportsState } = useReports();

  const generateMonthlyReports = async () => {
    const thisMonth = {
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      to_date: new Date().toISOString().split('T')[0],
      detail_level: 'bajo' as const,
      project_context: 'Dashboard Ejecutivo'
    };

    // Generar múltiples reportes para el dashboard
    const reports = await Promise.allSettled([
      generateReport({
        reportType: REPORT_TYPES.BALANCE_GENERAL,
        filters: thisMonth
      }),
      generateReport({
        reportType: REPORT_TYPES.PERDIDAS_GANANCIAS,
        filters: thisMonth
      }),
      generateReport({
        reportType: REPORT_TYPES.FLUJO_EFECTIVO,
        filters: thisMonth
      })
    ]);

    return reports;
  };

  return {
    generateMonthlyReports,
    isLoading: reportsState.isGenerating,
    currentReport: reportsState.currentReport,
    error: reportsState.error
  };
};

// ==========================================
// 5. Ejemplo - Componente de navegación con reportes
// ==========================================

export const NavigationWithReports: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <a href="/dashboard" className="hover:text-blue-300">
            Dashboard
          </a>
          <a href="/cuentas" className="hover:text-blue-300">
            Cuentas
          </a>
          <a href="/asientos" className="hover:text-blue-300">
            Asientos
          </a>
          <a href="/reportes" className="hover:text-blue-300">
            📊 Reportes
          </a>
          <a href="/importar" className="hover:text-blue-300">
            Importar
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <QuickReportWidget />
        </div>
      </div>
    </nav>
  );
};

// ==========================================
// 6. Ejemplo - Provider/Context personalizado (opcional)
// ==========================================

import { createContext, useContext, type ReactNode } from 'react';

interface ReportsContextType {
  companyName: string;
  defaultFilters: any;
  permissions: {
    canExport: boolean;
    canViewDetails: boolean;
  };
}

const ReportsContext = createContext<ReportsContextType | null>(null);

export const ReportsProvider: React.FC<{ 
  children: ReactNode;
  companyName: string;
  permissions?: Partial<ReportsContextType['permissions']>;
}> = ({ 
  children, 
  companyName, 
  permissions = {} 
}) => {
  const value: ReportsContextType = {
    companyName,
    defaultFilters: {
      project_context: companyName,
      detail_level: 'medio'
    },
    permissions: {
      canExport: true,
      canViewDetails: true,
      ...permissions
    }
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReportsContext debe usarse dentro de ReportsProvider');
  }
  return context;
};

// ==========================================
// 7. Ejemplo de uso en App.tsx principal
// ==========================================

export const ExampleApp: React.FC = () => {
  return (
    <ReportsProvider 
      companyName="Mi Empresa S.A."
      permissions={{ canExport: true, canViewDetails: true }}
    >
      <div className="min-h-screen bg-gray-50">
        <NavigationWithReports />
        
        <main className="container mx-auto px-4 py-8">
          <AppRoutesExample />
        </main>
      </div>
    </ReportsProvider>
  );
};

// ==========================================
// 8. Ejemplo - Tests básicos
// ==========================================

/*
// reports.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useReports } from '@/features/reports';

describe('Reports Module', () => {
  test('should generate balance general report', async () => {
    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.generateReport({
        reportType: 'balance_general',
        filters: {
          from_date: '2025-01-01',
          to_date: '2025-06-10',
          detail_level: 'medio'
        }
      });
    });

    expect(result.current.reportsState.currentReport).toBeTruthy();
    expect(result.current.reportsState.error).toBeNull();
  });

  test('should validate filters correctly', () => {
    const { result } = renderHook(() => useReports());
    
    const validation = result.current.validateFilters({
      from_date: '',
      to_date: '2025-06-10'
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('La fecha de inicio es requerida');
  });
});
*/
