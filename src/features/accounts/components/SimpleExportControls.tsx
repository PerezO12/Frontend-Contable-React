import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';

interface SimpleExportControlsProps {
  selectedAccountIds: string[];
  accountCount: number;
  onExportStart?: () => void;
  onExportEnd?: () => void;
}

export const SimpleExportControls: React.FC<SimpleExportControlsProps> = ({
  selectedAccountIds,
  accountCount,
  onExportStart,
  onExportEnd
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Manejar exportación directa
  const handleExport = async () => {
    console.log('🚀 Iniciando exportación...', { selectedAccountIds, accountCount, exportFormat });
    
    if (selectedAccountIds.length === 0) {
      showError('No hay cuentas seleccionadas para exportar');
      return;
    }

    setIsExporting(true);
    onExportStart?.();
    
    try {
      console.log('📤 Llamando al servicio de exportación...');
      const blob = await AccountService.exportAccounts(selectedAccountIds, exportFormat);
      
      // Generar nombre de archivo descriptivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `cuentas_${accountCount}_registros_${timestamp}.${exportFormat}`;
      
      console.log('💾 Iniciando descarga del archivo:', fileName);
      // Descargar archivo
      ExportService.downloadBlob(blob, fileName);
      
      success(`✅ Se exportaron ${accountCount} cuenta${accountCount === 1 ? '' : 's'} exitosamente en formato ${exportFormat.toUpperCase()}`);
      
    } catch (error) {
      console.error('❌ Error al exportar cuentas:', error);
      showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
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
          onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json' | 'xlsx')}
          disabled={isExporting}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="csv">📊 CSV (Excel)</option>
          <option value="json">🔧 JSON (APIs)</option>
          <option value="xlsx">📗 XLSX (Excel)</option>
        </select>
      </div>

      {/* Botón de exportar */}
      <Button
        onClick={handleExport}
        disabled={isExporting || selectedAccountIds.length === 0}
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
      
      {selectedAccountIds.length > 0 && (
        <span className="text-sm text-gray-600">
          ({accountCount} seleccionada{accountCount === 1 ? '' : 's'})
        </span>
      )}
    </div>
  );
};
