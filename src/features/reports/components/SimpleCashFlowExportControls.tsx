import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { useClientExport } from '../hooks/useClientExport';
import type { CashFlowResponse } from '../types';

interface SimpleCashFlowExportControlsProps {
  report: CashFlowResponse;
  onExportStart?: () => void;
  onExportEnd?: () => void;
}

export const SimpleCashFlowExportControls: React.FC<SimpleCashFlowExportControlsProps> = ({
  report,
  onExportStart,
  onExportEnd
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const { success, error: showError } = useToast();
  const { exportToPDF, exportToExcel, exportToCSV } = useClientExport();

  // Manejar exportación directa
  const handleExport = async () => {
    console.log('🚀 Iniciando exportación de flujo de efectivo...', { exportFormat });
    
    if (!report) {
      showError('No hay reporte disponible para exportar');
      return;
    }

    setIsExporting(true);
    onExportStart?.();
    
    try {
      console.log('📤 Llamando al servicio de exportación de reportes...');
      
      // Generar nombre de archivo descriptivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `flujo_efectivo_${timestamp}.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;
      
      const options = {
        customFilename: fileName,
        includeNarrative: false // No incluir análisis narrativo para mantener simplicidad
      };

      switch (exportFormat) {
        case 'csv':
          await exportToCSV(report, options);
          break;
        case 'excel':
          await exportToExcel(report, options);
          break;
        case 'pdf':
          await exportToPDF(report, options);
          break;
      }
      
      console.log('💾 Archivo generado:', fileName);
      success(`✅ Reporte de flujo de efectivo exportado exitosamente en formato ${exportFormat.toUpperCase()}`);
      
    } catch (error) {
      console.error('❌ Error al exportar flujo de efectivo:', error);
      showError('❌ Error al exportar el reporte. Verifique su conexión e inténtelo nuevamente.');
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Selector de formato */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Formato:</label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel' | 'pdf')}
          disabled={isExporting}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="csv">📊 CSV (Excel)</option>
          <option value="excel">📗 XLSX (Excel)</option>
          <option value="pdf">📄 PDF</option>
        </select>
      </div>

      {/* Botón de exportar */}
      <Button
        onClick={handleExport}
        disabled={isExporting || !report}
        variant="primary"
        className="flex items-center space-x-2"
      >
        {isExporting ? (
          <>
            <Spinner size="sm" />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Exportar {exportFormat.toUpperCase()}</span>
          </>
        )}
      </Button>
      
      <span className="text-sm text-gray-600">
        (Flujo de Efectivo)
      </span>
    </div>
  );
};
