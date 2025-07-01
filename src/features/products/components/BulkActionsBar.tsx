/**
 * Componente de barra flotante de acciones para operaciones bulk en productos
 * Basado en el panel de facturas pero adaptado para las necesidades de productos
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@/shared/components/icons';
import { ProductStatus, ProductType } from '@/features/products/types';
import type { Product } from '@/features/products/types';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedProducts: Product[];
  isProcessing: boolean;
  onBulkActivate: (options: { reason?: string }) => void;
  onBulkDeactivate: (options: { reason?: string }) => void;
  onBulkDelete: (options: { reason: string }) => void;
  onBulkExport: (products: Product[]) => void;
  onClearSelection: () => void;
}

type BulkOperation = 'activate' | 'deactivate' | 'delete' | 'export';

interface OperationConfig {
  label: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
  requiresReason?: boolean;
}

const operationConfigs: Record<BulkOperation, OperationConfig> = {
  activate: {
    label: 'Activar',
    color: 'green',
    icon: CheckCircleIcon,
    description: 'Activar productos seleccionados',
    confirmMessage: 'Esta acción activará los productos seleccionados haciéndolos disponibles para venta.'
  },
  deactivate: {
    label: 'Desactivar',
    color: 'yellow',
    icon: EyeIcon,
    description: 'Desactivar productos seleccionados',
    confirmMessage: 'Esta acción desactivará los productos seleccionados y ya no estarán disponibles para venta.'
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar productos seleccionados',
    confirmMessage: 'Esta acción eliminará permanentemente los productos seleccionados. Esta operación no se puede deshacer.',
    requiresReason: true
  },
  export: {
    label: 'Exportar',
    color: 'blue',
    icon: ArrowDownTrayIcon,
    description: 'Exportar productos seleccionados',
    confirmMessage: 'Se exportarán todos los productos seleccionados.'
  }
};

export function BulkActionsBar({
  selectedCount,
  selectedProducts,
  isProcessing,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkExport,
  onClearSelection
}: BulkActionsBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [formData, setFormData] = useState({
    reason: ''
  });

  if (selectedCount === 0) return null;

  const handleOperationClick = (operation: BulkOperation) => {
    setCurrentOperation(operation);
    
    // Para exportar, ejecutar directamente
    if (operation === 'export') {
      onBulkExport(selectedProducts);
      return;
    }

    // Para otras operaciones, mostrar modal de confirmación
    setShowModal(true);
  };

  const handleConfirmOperation = () => {
    if (!currentOperation) return;

    const options = {
      reason: formData.reason
    };

    switch (currentOperation) {
      case 'activate':
        onBulkActivate(options);
        break;
      case 'deactivate':
        onBulkDeactivate(options);
        break;
      case 'delete':
        onBulkDelete({ reason: formData.reason });
        break;
    }

    setShowModal(false);
    setCurrentOperation(null);
    setFormData({ reason: '' });
  };

  const config = currentOperation ? operationConfigs[currentOperation] : null;

  // Estadísticas de productos seleccionados
  const stats = {
    active: selectedProducts.filter(p => p.status === ProductStatus.ACTIVE).length,
    inactive: selectedProducts.filter(p => p.status === ProductStatus.INACTIVE).length,
    discontinued: selectedProducts.filter(p => p.status === ProductStatus.DISCONTINUED).length,
    products: selectedProducts.filter(p => p.product_type === ProductType.PRODUCT).length,
    services: selectedProducts.filter(p => p.product_type === ProductType.SERVICE).length,
  };

  return (
    <>
      {/* Barra flotante de acciones */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-96">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge color="blue" variant="subtle">
                  {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                </Badge>
                
                {/* Estadísticas rápidas */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {stats.active > 0 && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{stats.active} activos</span>}
                  {stats.inactive > 0 && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">{stats.inactive} inactivos</span>}
                  {stats.discontinued > 0 && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{stats.discontinued} descontinuados</span>}
                </div>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-2 text-blue-600">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">Procesando...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Botones de acción */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick('activate')}
                disabled={isProcessing || stats.active === selectedCount}
                className="flex items-center gap-1 text-green-600 hover:text-green-700"
                title={stats.active === selectedCount ? 'Todos los productos ya están activos' : 'Activar productos'}
              >
                <CheckCircleIcon className="h-4 w-4" />
                Activar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick('deactivate')}
                disabled={isProcessing || stats.inactive === selectedCount}
                className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700"
                title={stats.inactive === selectedCount ? 'Todos los productos ya están inactivos' : 'Desactivar productos'}
              >
                <EyeIcon className="h-4 w-4" />
                Desactivar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick('export')}
                disabled={isProcessing}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick('delete')}
                disabled={isProcessing}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
                Eliminar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                disabled={isProcessing}
              >
                Limpiar
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-2 text-xs text-gray-500 border-t pt-2">
            {stats.products > 0 && <span>{stats.products} producto{stats.products !== 1 ? 's' : ''}</span>}
            {stats.products > 0 && stats.services > 0 && <span> • </span>}
            {stats.services > 0 && <span>{stats.services} servicio{stats.services !== 1 ? 's' : ''}</span>}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && config && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${config.label} Productos`}
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

            {/* Resumen de productos */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Productos seleccionados:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{selectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Activos:</span>
                  <span className="font-medium text-green-600">{stats.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Inactivos:</span>
                  <span className="font-medium text-yellow-600">{stats.inactive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Descontinuados:</span>
                  <span className="font-medium text-red-600">{stats.discontinued}</span>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            {selectedProducts.length <= 10 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Productos afectados:</h4>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {selectedProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 text-sm">
                      <span className="font-medium">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          color={product.status === ProductStatus.ACTIVE ? 'green' : product.status === ProductStatus.INACTIVE ? 'yellow' : 'red'} 
                          size="sm"
                        >
                          {product.status}
                        </Badge>
                        <span className="text-gray-500">{product.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campo de razón */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo {config.requiresReason ? '(obligatorio)' : '(opcional)'}
              </label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Explique el motivo de esta operación..."
                rows={3}
                required={config.requiresReason}
              />
            </div>

            {/* Advertencia para eliminación */}
            {currentOperation === 'delete' && (
              <Alert>
                <ExclamationCircleIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium text-red-600">¡Advertencia de eliminación!</h4>
                  <p className="text-sm mt-1 text-red-600">
                    Esta acción eliminará permanentemente los productos seleccionados y no se puede deshacer.
                    Asegúrese de que no existan referencias a estos productos en facturas o inventario.
                  </p>
                </div>
              </Alert>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
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
