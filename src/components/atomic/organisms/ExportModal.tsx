import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { Typography } from '../atoms/Typography';
import { 
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon
} from '../../../shared/components/icons';

export interface ExportFormat {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  formats?: ExportFormat[];
  onExport: (format: string, options?: any) => Promise<void>;
  loading?: boolean;
  entityName?: string;
  totalItems?: number;
  selectedItems?: number;
}

const DEFAULT_FORMATS: ExportFormat[] = [
  {
    value: 'csv',
    label: 'CSV',
    description: 'Archivo de valores separados por comas. Compatible con Excel y otras hojas de cálculo.',
    icon: <span className="text-green-600">📊</span>
  },
  {
    value: 'xlsx',
    label: 'Excel (XLSX)',
    description: 'Archivo de Microsoft Excel con formato completo y estilos.',
    icon: <span className="text-green-600">📈</span>
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'Formato de intercambio de datos JavaScript. Ideal para desarrollo.',
    icon: <span className="text-blue-600">⚡</span>
  }
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title = 'Exportar Datos',
  description,
  formats = DEFAULT_FORMATS,
  onExport,
  loading = false,
  entityName = 'elementos',
  totalItems = 0,
  selectedItems = 0
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('xlsx');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all');

  const handleExport = async () => {
    const options = {
      includeFilters,
      scope: exportScope,
      selectedItems: exportScope === 'selected' ? selectedItems : undefined
    };

    try {
      await onExport(selectedFormat, options);
      onClose();
    } catch (error) {
      console.error('Error al exportar:', error);
      // El error se maneja en el componente padre
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getExportCount = () => {
    if (exportScope === 'selected') {
      return selectedItems;
    }
    return totalItems;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="lg"
      className="max-w-2xl"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-6 w-6 text-primary-600" />
            <Typography variant="h5" weight="semibold">
              {title}
            </Typography>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
        {description && (
          <Typography variant="body2" color="secondary" className="mt-2">
            {description}
          </Typography>
        )}
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Alcance de exportación */}
        <div>
          <Typography variant="h6" weight="medium" className="mb-3">
            ¿Qué datos deseas exportar?
          </Typography>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="exportScope"
                value="all"
                checked={exportScope === 'all'}
                onChange={(e) => setExportScope(e.target.value as 'all' | 'selected')}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div>
                <Typography variant="body1" weight="medium">
                  Todos los {entityName}
                </Typography>
                <Typography variant="body2" color="secondary">
                  Exportar {totalItems.toLocaleString()} {entityName} (aplicando filtros actuales)
                </Typography>
              </div>
            </label>
            
            {selectedItems > 0 && (
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="exportScope"
                  value="selected"
                  checked={exportScope === 'selected'}
                  onChange={(e) => setExportScope(e.target.value as 'all' | 'selected')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <Typography variant="body1" weight="medium">
                    Solo elementos seleccionados
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    Exportar {selectedItems.toLocaleString()} {entityName} seleccionados
                  </Typography>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Formato de exportación */}
        <div>
          <Typography variant="h6" weight="medium" className="mb-3">
            Selecciona el formato de exportación
          </Typography>
          <div className="grid gap-3">
            {formats.map((format) => (
              <label
                key={format.value}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedFormat === format.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-3 flex-1">
                  {format.icon && <div className="text-2xl">{format.icon}</div>}
                  <div className="flex-1">
                    <Typography variant="body1" weight="medium">
                      {format.label}
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {format.description}
                    </Typography>
                  </div>
                  {selectedFormat === format.value && (
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div>
          <Typography variant="h6" weight="medium" className="mb-3">
            Opciones adicionales
          </Typography>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeFilters}
                onChange={(e) => setIncludeFilters(e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <Typography variant="body2">
                Aplicar filtros actuales al exportar
              </Typography>
            </label>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="body2" weight="medium" className="mb-1">
            Resumen de exportación:
          </Typography>
          <Typography variant="body2" color="secondary">
            Se exportarán <strong>{getExportCount().toLocaleString()}</strong> {entityName} en formato{' '}
            <strong>{formats.find(f => f.value === selectedFormat)?.label}</strong>
            {includeFilters && ' (con filtros aplicados)'}
          </Typography>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          loading={loading}
          disabled={getExportCount() === 0}
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Exportar {getExportCount().toLocaleString()} {entityName}
        </Button>
      </div>
    </Modal>
  );
};
