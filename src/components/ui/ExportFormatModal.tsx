/**
 * Modal para seleccionar formato de exportación
 */
import { Modal } from './Modal';
import { Button } from './Button';

export interface ExportFormatModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'xlsx' | 'json') => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function ExportFormatModal({
  open,
  onClose,
  onExport,
  title = 'Exportar Datos',
  description = 'Selecciona el formato de exportación',
  loading = false
}: ExportFormatModalProps) {
  const handleExport = (format: 'csv' | 'xlsx' | 'json') => {
    onExport(format);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600">
          {description}
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleExport('xlsx')}
            disabled={loading}
            className="justify-start p-4 h-auto bg-green-50 hover:bg-green-100 border-green-200 text-green-800"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
                XL
              </div>
              <div className="text-left">
                <div className="font-semibold">Excel (.xlsx)</div>
                <div className="text-sm text-green-600">Ideal para análisis y cálculos</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleExport('csv')}
            disabled={loading}
            className="justify-start p-4 h-auto bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                CSV
              </div>
              <div className="text-left">
                <div className="font-semibold">CSV (.csv)</div>
                <div className="text-sm text-blue-600">Formato universal, compatible con todo</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleExport('json')}
            disabled={loading}
            className="justify-start p-4 h-auto bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
                JSON
              </div>
              <div className="text-left">
                <div className="font-semibold">JSON (.json)</div>
                <div className="text-sm text-purple-600">Para desarrolladores y APIs</div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
