import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { CashFlowImportWizard } from './CashFlowImportWizard';
import { useClientExport } from '../hooks/useClientExport';
import type { CashFlowResponse } from '../types';

interface CashFlowImportExportControlsProps {
  report?: CashFlowResponse;
  className?: string;
}

export const CashFlowImportExportControls: React.FC<CashFlowImportExportControlsProps> = ({
  report,
  className = ''
}) => {
  const [showImportWizard, setShowImportWizard] = useState(false);
  const { exportToPDF, exportToExcel, exportToCSV, isExporting } = useClientExport();

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!report) return;

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(report, { 
            includeNarrative: true,
            customFilename: 'flujo_efectivo'
          });
          break;
        case 'excel':
          await exportToExcel(report, { 
            includeNarrative: true,
            customFilename: 'flujo_efectivo'
          });
          break;
        case 'csv':
          await exportToCSV(report, { 
            includeNarrative: false,
            customFilename: 'flujo_efectivo'
          });
          break;
      }
    } catch (error) {
      console.error('Error exporting cash flow report:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Export Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📤 Exportar Flujo de Efectivo
            </h3>
            <p className="text-sm text-gray-600">
              Descarga el reporte en diferentes formatos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExporting || !report}
            variant="primary"
            className="flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <span>📄</span>
                <span>Exportar PDF</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('excel')}
            disabled={isExporting || !report}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <span>📊</span>
                <span>Exportar Excel</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting || !report}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Exportar CSV</span>
              </>
            )}
          </Button>
        </div>

        {!report && (
          <p className="text-sm text-gray-500 mt-2">
            💡 Genera un reporte de flujo de efectivo para habilitar las opciones de exportación
          </p>
        )}
      </div>      {/* Import Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📥 Importar Datos de Flujo de Efectivo
            </h3>
            <p className="text-sm text-gray-600">
              Importa transacciones y ajustes para análisis de flujo de efectivo
            </p>
          </div>
          <Button
            onClick={() => setShowImportWizard(!showImportWizard)}
            variant="secondary"
            size="sm"
          >
            {showImportWizard ? 'Ocultar Importador' : 'Mostrar Importador'}
          </Button>
        </div>

        {showImportWizard && (
          <div className="mt-4">
            <CashFlowImportWizard 
              onComplete={(result) => {
                console.log('Import completed:', result);
                setShowImportWizard(false);
              }}
            />
          </div>
        )}

        {!showImportWizard && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  💡 Consejos para importar datos de flujo de efectivo:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Incluye todas las transacciones que afecten efectivo y equivalentes</li>
                  <li>• Clasifica correctamente las actividades: operativas, de inversión y financiamiento</li>
                  <li>• Asegúrate de que los asientos estén balanceados (débitos = créditos)</li>
                  <li>• Usa los códigos de cuenta correctos para cada tipo de actividad</li>
                  <li>• Incluye referencias claras para facilitar la auditoría</li>
                  <li>• Haz clic en "Mostrar Importador" para acceder al asistente completo</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
