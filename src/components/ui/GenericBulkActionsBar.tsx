/**
 * Componente genérico de barra flotante de acciones para operaciones bulk
 * Utilizado como base por todos los features (products, third-parties, cost-centers, etc.)
 */
import React, { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Textarea } from './Textarea';
import { LoadingSpinner } from './LoadingSpinner';
import { Alert } from './Alert';
import { 
  ExclamationCircleIcon,
  XMarkIcon
} from '@/shared/components/icons';

export type BulkOperation = string;

export interface OperationConfig {
  label: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'gray' | 'orange';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
  requiresReason?: boolean;
}

export interface BulkAction {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'ghost' | 'outline' | 'primary' | 'secondary';
}

export interface GenericBulkActionsBarProps<T = any> {
  // Información básica
  selectedCount: number;
  selectedItems: T[];
  isProcessing: boolean;
  
  // Configuración de display
  icon: React.ComponentType<{ className?: string }>;
  itemTypeName: string; // "producto", "tercero", "pago", etc.
  itemTypeNamePlural?: string; // "productos", "terceros", "pagos", etc.
  
  // Acciones rápidas (aparecen como botones)
  quickActions?: BulkAction[];
  
  // Función para renderizar estadísticas/badges de items seleccionados
  renderStats?: (items: T[]) => React.ReactNode;
  
  // Configuración de operaciones con modal
  operationConfigs?: Record<string, OperationConfig>;
  
  // Callbacks para operaciones
  onBulkOperation?: (operation: string, options: { reason?: string }) => void;
  onClearSelection: () => void;
  
  // Configuración de posición y estilo
  position?: 'bottom' | 'top';
  className?: string;
  
  // Información adicional en el pie
  footerInfo?: React.ReactNode;
}

export function GenericBulkActionsBar<T = any>({
  selectedCount,
  selectedItems,
  isProcessing,
  icon: IconComponent,
  itemTypeName,
  itemTypeNamePlural,
  quickActions = [],
  renderStats,
  operationConfigs = {},
  onBulkOperation,
  onClearSelection,
  position = 'bottom',
  className = '',
  footerInfo
}: GenericBulkActionsBarProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    reason: ''
  });

  if (selectedCount === 0) return null;

  const plural = itemTypeNamePlural || `${itemTypeName}s`;

  const handleConfirmOperation = () => {
    if (!currentOperation || !onBulkOperation) return;

    const options = {
      reason: formData.reason
    };

    onBulkOperation(currentOperation, options);

    setShowModal(false);
    setCurrentOperation(null);
    setFormData({ reason: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOperation(null);
    setFormData({ reason: '' });
  };

  const config = currentOperation ? operationConfigs[currentOperation] : null;

  const positionClass = position === 'bottom' 
    ? 'fixed bottom-6 left-1/2 transform -translate-x-1/2' 
    : 'fixed top-6 left-1/2 transform -translate-x-1/2';

  return (
    <>
      {/* Barra flotante de acciones */}
      <div className={`${positionClass} z-50 ${className}`}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-4 min-w-[400px]">
          {/* Información de selección */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <IconComponent className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedCount} {selectedCount === 1 ? itemTypeName : plural} seleccionado{selectedCount !== 1 ? 's' : ''}
              </div>
              {renderStats && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {renderStats(selectedItems)}
                </div>
              )}
            </div>
          </div>

          {/* Separador */}
          {quickActions.length > 0 && (
            <div className="h-8 w-px bg-gray-200" />
          )}

          {/* Acciones rápidas */}
          {quickActions.length > 0 && (
            <div className="flex items-center space-x-2">
              {quickActions.map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant || "ghost"}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled || isProcessing}
                  className={action.className}
                >
                  <action.icon className="w-4 h-4 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Separador final */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Botón limpiar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Limpiar
          </Button>

          {/* Indicador de procesamiento */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <LoadingSpinner size="sm" />
              <span className="text-sm font-medium">Procesando operación...</span>
            </div>
          )}
        </div>

        {/* Información adicional en el pie */}
        {footerInfo && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            {footerInfo}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && config && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`${config.label} ${plural.charAt(0).toUpperCase() + plural.slice(1)}`}
          size="md"
        >
          <div className="space-y-6">
            {/* Información de la operación */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <config.icon className={`h-6 w-6 mt-1 text-${config.color}-600`} />
              <div>
                <h3 className="font-medium text-gray-900">{config.description}</h3>
                <p className="text-sm text-gray-600 mt-1">{config.confirmMessage}</p>
              </div>
            </div>

            {/* Resumen de elementos seleccionados */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{plural.charAt(0).toUpperCase() + plural.slice(1)} seleccionados:</h4>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{selectedCount}</span>
                </div>
              </div>
            </div>

            {/* Campo de razón */}
            {config.requiresReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo (obligatorio)
                </label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Explique el motivo de esta operación..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Advertencia para operaciones destructivas */}
            {config.color === 'red' && (
              <Alert>
                <ExclamationCircleIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium text-red-600">¡Advertencia!</h4>
                  <p className="text-sm mt-1 text-red-600">
                    Esta acción puede ser permanente y no se puede deshacer.
                    Asegúrese de que desea continuar.
                  </p>
                </div>
              </Alert>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmOperation}
                disabled={isProcessing || (config.requiresReason && !formData.reason.trim())}
                className={`bg-${config.color}-600 hover:bg-${config.color}-700`}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Procesando...
                  </>
                ) : (
                  `Confirmar ${config.label}`
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
