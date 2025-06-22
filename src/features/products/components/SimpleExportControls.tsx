import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { ProductService } from '../services';

interface SimpleExportControlsProps {
  selectedProductIds: string[];
  productCount: number;
  onExportStart?: () => void;
  onExportEnd?: () => void;
}

export const SimpleExportControls: React.FC<SimpleExportControlsProps> = ({
  selectedProductIds,
  productCount,
  onExportStart,
  onExportEnd
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const { success, error: showError } = useToast();
  // Manejar exportación directa
  const handleExport = async () => {
    console.log('🚀 Iniciando exportación de productos...', { selectedProductIds, productCount, exportFormat });
    
    if (selectedProductIds.length === 0) {
      showError('No hay productos seleccionados para exportar');
      return;
    }

    setIsExporting(true);
    onExportStart?.();
      try {
      console.log('📤 Llamando al servicio de exportación de productos...');
      
      // Por ahora, exportamos todos los productos disponibles
      // TODO: Implementar selección específica de productos
      const allProductIds: string[] = []; // Array vacío para exportar todos
      const blob = await ProductService.exportProducts(allProductIds, exportFormat as 'xlsx' | 'csv' | 'json');
      
      // Generar nombre de archivo descriptivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `productos_${productCount}_registros_${timestamp}.${exportFormat}`;
      
      console.log('💾 Iniciando descarga del archivo:', fileName);
      
      // Descargar archivo usando el método clásico
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      success(`✅ Se exportaron los productos exitosamente en formato ${exportFormat.toUpperCase()}`);
      
    } catch (error) {
      console.error('❌ Error al exportar productos:', error);
      showError('❌ Error al exportar los productos. Verifique su conexión e inténtelo nuevamente.');
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
        disabled={isExporting || selectedProductIds.length === 0}
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
            <span>Exportar {exportFormat.toUpperCase()}{selectedProductIds.length > 0 ? ` (${productCount})` : ''}</span>
          </>
        )}
      </Button>
    </div>
  );
};
