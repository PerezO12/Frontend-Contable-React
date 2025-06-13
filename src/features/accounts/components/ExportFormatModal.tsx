import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';

interface ExportFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccountIds: string[];
  accountCount: number;
}

export const ExportFormatModal: React.FC<ExportFormatModalProps> = ({
  isOpen,
  onClose,
  selectedAccountIds,
  accountCount
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Obtener información del formato
  const getFormatInfo = (format: string) => {
    const formats = {
      csv: {
        icon: '📊',
        name: 'CSV',
        description: 'Compatible con Excel',
        detail: 'Archivo separado por comas, ideal para análisis'
      },
      json: {
        icon: '🔧',
        name: 'JSON',
        description: 'Para APIs y sistemas',
        detail: 'Formato estructurado para integraciones'
      },
      xlsx: {
        icon: '📗',
        name: 'Excel',
        description: 'Archivo nativo de Excel',
        detail: 'Mantiene formato y fórmulas'
      }
    };
    return formats[format as keyof typeof formats];
  };

  // Exportar cuentas seleccionadas
  const handleExport = async () => {
    console.log('🚀 Iniciando exportación...', { selectedAccountIds, accountCount, exportFormat });
    
    if (selectedAccountIds.length === 0) {
      showError('No hay cuentas seleccionadas para exportar');
      return;
    }

    setIsExporting(true);
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
      onClose();
      
    } catch (error) {
      console.error('❌ Error al exportar cuentas:', error);
      showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Exportar Cuentas Seleccionadas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {accountCount} cuenta{accountCount === 1 ? '' : 's'} seleccionada{accountCount === 1 ? '' : 's'}
            </p>
          </div>
          <Button
            onClick={onClose}
            disabled={isExporting}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Selecciona el formato de exportación:
              </label>
              <div className="space-y-3">
                {(['csv', 'json', 'xlsx'] as const).map((format) => {
                  const formatInfo = getFormatInfo(format);
                  return (
                    <label
                      key={format}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        exportFormat === format
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={exportFormat === format}
                        onChange={(e) => setExportFormat(e.target.value as any)}
                        disabled={isExporting}
                        className="sr-only"
                      />
                      <div className="flex items-center w-full">
                        <div className="text-2xl mr-4">{formatInfo.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{formatInfo.name}</div>
                          <div className="text-sm text-gray-600">{formatInfo.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatInfo.detail}</div>
                        </div>
                        {exportFormat === format && (
                          <div className="text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Info del formato seleccionado */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600 mr-2">💡</div>
                <span className="text-sm text-blue-800">
                  {exportFormat === 'csv' && 'Ideal para análisis en Excel o importar en otros sistemas.'}
                  {exportFormat === 'json' && 'Perfecto para integraciones con APIs y sistemas externos.'}
                  {exportFormat === 'xlsx' && 'Mantiene el formato original y permite fórmulas avanzadas.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            disabled={isExporting}
            variant="secondary"
            className="px-4 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="primary"
            className="px-4 py-2"
          >
            {isExporting ? (
              <div className="flex items-center">
                <Spinner size="sm" />
                <span className="ml-2">Exportando...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{getFormatInfo(exportFormat).icon}</span>
                <span className="ml-2">Exportar {exportFormat.toUpperCase()}</span>
              </div>
            )}
          </Button>        </div>
        </div>
      </div>
    </div>
  );
};