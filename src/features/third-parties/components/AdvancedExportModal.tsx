import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../shared/hooks';
import { ThirdPartyService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
import type { ThirdPartyFilters, ThirdPartyExportRequest } from '../types';

interface AdvancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters?: ThirdPartyFilters;
  selectedIds?: string[];
}

export const AdvancedExportModal: React.FC<AdvancedExportModalProps> = ({
  isOpen,
  onClose,
  currentFilters = {},
  selectedIds = []
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
  const [fileName, setFileName] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<'selected' | 'filtered' | 'all'>('selected');
  
  const { success, error: showError } = useToast();  const handleAdvancedExport = async () => {
    setIsExporting(true);
    
    try {
      // Preparar los filtros combinando todos los criterios
      const combinedFilters: ThirdPartyFilters = {
        ...currentFilters
      };

      // Agregar filtros específicos del modal
      if (dateFrom) {
        combinedFilters.created_after = dateFrom;
      }
      if (dateTo) {
        combinedFilters.created_before = dateTo;
      }
      if (!includeInactive) {
        combinedFilters.is_active = true;
      }

      const request: ThirdPartyExportRequest = {
        format: exportFormat,
        filters: combinedFilters,
        include_balances: includeMetadata,
        include_aging: includeMetadata
      };

      console.log('🚀 Iniciando exportación avanzada:', request);
      
      const response = await ThirdPartyService.exportThirdPartiesAdvanced(request);
      
      if (response.status === 'ready' && response.download_url) {
        // Si la exportación está lista, intentar descargar
        try {
          const downloadResponse = await fetch(response.download_url);
          const blob = await downloadResponse.blob();
          
          const finalFileName = fileName || `terceros_avanzado_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.${exportFormat}`;
          ExportService.downloadBlob(blob, finalFileName);
          
          success(`✅ Exportación completada: ${finalFileName}`);
        } catch (downloadError) {
          console.error('Error en descarga:', downloadError);
          success(`✅ Exportación completada. ID: ${response.export_id} - Usar URL de descarga proporcionada.`);
        }
      } else {
        // Exportación en proceso
        success(`🚀 Exportación iniciada. ID: ${response.export_id}. Estado: ${response.status}`);
      }
      
      onClose();
      
    } catch (error) {
      console.error('❌ Error en exportación avanzada:', error);
      showError('❌ Error en la exportación avanzada. Verifique los parámetros e inténtelo nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const isValidExport = true; // La exportación avanzada siempre es válida

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportación Avanzada de Terceros"
      size="lg"
    >
      <div className="space-y-6">
        {/* Modo de exportación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datos a exportar
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="selected"
                checked={exportMode === 'selected'}
                onChange={(e) => setExportMode(e.target.value as any)}
                className="mr-2"
                disabled={selectedIds.length === 0}
              />
              <span className={selectedIds.length === 0 ? 'text-gray-400' : ''}>
                Registros seleccionados ({selectedIds.length})
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="filtered"
                checked={exportMode === 'filtered'}
                onChange={(e) => setExportMode(e.target.value as any)}
                className="mr-2"
              />
              <span>Registros con filtros actuales</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="all"
                checked={exportMode === 'all'}
                onChange={(e) => setExportMode(e.target.value as any)}
                className="mr-2"
              />
              <span>Todos los registros</span>
            </label>
          </div>
        </div>

        {/* Formato y nombre de archivo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de exportación
            </label>            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              disabled={isExporting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">📊 CSV (Excel)</option>
              <option value="xlsx">� XLSX (Excel)</option>
              <option value="pdf">� PDF (Reporte)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de archivo (opcional)
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="terceros_exportacion"
              disabled={isExporting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtros de fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha desde (opcional)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={isExporting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha hasta (opcional)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              disabled={isExporting}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={!includeInactive}
              onChange={(e) => setIncludeInactive(!e.target.checked)}
              disabled={isExporting}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Solo terceros activos</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
              disabled={isExporting}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Incluir metadatos (fechas de creación/modificación)</span>
          </label>
        </div>        {/* Información de estado */}
        {exportMode === 'selected' && selectedIds.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Modo de registros seleccionados no disponible con la exportación avanzada. Se exportarán todos los registros que coincidan con los filtros aplicados.
            </p>
          </div>
        )}

        {exportMode === 'selected' && selectedIds.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              ℹ️ La exportación avanzada aplicará los filtros de la tabla. Para exportar solo registros específicos, use la exportación básica.
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          
          <Button
            variant="primary"
            onClick={handleAdvancedExport}
            disabled={isExporting || !isValidExport}
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
                <span>Exportar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
