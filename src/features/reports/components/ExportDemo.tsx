// ==========================================
// Componente de demostración para exportación de reportes
// ==========================================

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useClientExport } from '../hooks/useClientExport';
import type { ReportResponse } from '../types';

// Datos de ejemplo para demostrar la exportación
const mockReport: ReportResponse = {
  success: true,
  project_context: "Empresa Demo - Sistema Contable",
  report_type: "balance_general",
  period: {
    from_date: "2024-01-01",
    to_date: "2024-12-31"
  },
  generated_at: new Date().toISOString(),  table: {
    summary: {
      description: "Balance General consolidado con activos totales de $8.5M distribuidos principalmente en efectivo y bancos.",
      total_accounts: 4,
      balance_verified: true
    },
    sections: [
      {
        section_name: "ACTIVOS",
        items: [          {
            account_code: "1100",
            account_name: "Caja",
            account_group: "ACTIVOS",
            opening_balance: "1,000,000",
            movements: "500,000",
            closing_balance: "1,500,000",
            level: 0,
            children: []
          },
          {
            account_code: "1200",
            account_name: "Bancos",
            account_group: "ACTIVOS",
            opening_balance: "5,000,000",
            movements: "2,000,000",
            closing_balance: "7,000,000",
            level: 0,
            children: []
          }
        ],
        total: "8,500,000"
      },
      {
        section_name: "PASIVOS",
        items: [          {
            account_code: "2100",
            account_name: "Proveedores",
            account_group: "PASIVOS",
            opening_balance: "2,000,000",
            movements: "500,000",
            closing_balance: "2,500,000",
            level: 0,
            children: []
          }
        ],
        total: "2,500,000"
      },
      {
        section_name: "PATRIMONIO",
        items: [          {
            account_code: "3100",
            account_name: "Capital Social",
            account_group: "PATRIMONIO",
            opening_balance: "6,000,000",
            movements: "0",
            closing_balance: "6,000,000",
            level: 0,
            children: []
          }
        ],
        total: "6,000,000"
      }
    ],
    totals: {
      total_activos: "8,500,000",
      total_pasivos: "2,500,000",
      total_patrimonio: "6,000,000"
    }
  },
  narrative: {
    executive_summary: "La empresa muestra una posición financiera saludable con activos totales de $8.5M, donde el efectivo y equivalentes representan el 100% de los activos líquidos.",
    key_insights: [
      "Los activos líquidos (caja y bancos) representan el 100% del total de activos",
      "La empresa mantiene un bajo nivel de endeudamiento (29.4%)",
      "El patrimonio representa el 70.6% del total de activos"
    ],
    recommendations: [
      "Considerar diversificar las inversiones más allá del efectivo",
      "Evaluar oportunidades de crecimiento con el exceso de liquidez",
      "Mantener el control sobre el nivel de endeudamiento"
    ],
    financial_highlights: {
      debt_ratio: "0.294",
      equity_ratio: "0.706",
      liquidity_ratio: "3.40"
    }
  }
};

export const ExportDemo: React.FC = () => {
  const { exportToPDF, exportToExcel, exportToCSV, isExporting } = useClientExport();
  const [includeNarrative, setIncludeNarrative] = useState(true);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    const options = { 
      includeNarrative,
      customFilename: `demo-reporte-${format}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`
    };

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(mockReport, options);
          break;
        case 'excel':
          await exportToExcel(mockReport, options);
          break;
        case 'csv':
          await exportToCSV(mockReport, options);
          break;
      }
    } catch (error) {
      console.error('Error en exportación:', error);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🧪 Demo de Exportación de Reportes
      </h2>
      
      <p className="text-gray-600 mb-6">
        Prueba la nueva funcionalidad de exportación desde el frontend. 
        Los archivos se generan completamente en el navegador sin necesidad del backend.
      </p>

      <div className="space-y-4">
        {/* Toggle para narrativa */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeNarrative"
            checked={includeNarrative}
            onChange={(e) => setIncludeNarrative(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="includeNarrative" className="text-sm font-medium text-gray-700">
            Incluir análisis y narrativa en la exportación
          </label>
        </div>

        {/* Botones de exportación */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center space-x-2"
          >
            <span>📄</span>
            <span>Exportar PDF</span>
          </Button>

          <Button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Exportar Excel</span>
          </Button>

          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <span>📋</span>
            <span>Exportar CSV</span>
          </Button>
        </div>

        {isExporting && (
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span className="text-sm">Generando archivo...</span>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">✨ Características:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Exportación completa desde el frontend</li>
          <li>• No requiere conexión al backend</li>
          <li>• Incluye datos tabulares y narrativa</li>
          <li>• Formateo profesional automático</li>
          <li>• Múltiples formatos: PDF, Excel, CSV</li>
        </ul>
      </div>
    </Card>
  );
};
