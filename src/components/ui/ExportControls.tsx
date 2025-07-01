import React, { useState } from 'react';
import { Button } from './Button';
import { Spinner } from './Spinner';

export interface ExportControlsProps {
  /**
   * IDs de los elementos seleccionados para exportar
   */
  selectedIds: string[];
  
  /**
   * Número total de elementos seleccionados
   */
  selectedCount: number;
  
  /**
   * Función para exportar los datos
   */
  onExport: (format: 'csv' | 'json' | 'xlsx') => Promise<void>;
  
  /**
   * Texto para el botón de exportación (por defecto: "Exportar")
   */
  exportButtonText?: string;
  
  /**
   * Texto para el contador de elementos (por defecto: "registros")
   */
  itemsText?: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  selectedIds,
  selectedCount,
  onExport,
  exportButtonText = 'Exportar',
  itemsText = 'registros'
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    if (selectedIds.length === 0) return;
    
    setIsExporting(true);
    try {
      await onExport(exportFormat);
    } finally {
      setIsExporting(false);
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
        disabled={isExporting || selectedIds.length === 0}
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
            <span>
              {exportButtonText} {exportFormat.toUpperCase()}
              {selectedIds.length > 0 ? ` (${selectedCount} ${itemsText})` : ''}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}; 