/**
 * Componente de barra flotante de acciones para operaciones bulk en centros de costo
 * Basado en el patrón de productos pero adaptado para las necesidades de centros de costo
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
  XCircleIcon,
  ArrowDownTrayIcon,
  CalculatorIcon
} from '@/shared/components/icons';
import type { CostCenter } from '@/features/cost-centers/types';

interface CostCenterBulkActionsBarProps {
  selectedCount: number;
  selectedCostCenters: CostCenter[];
  isProcessing: boolean;
  onBulkActivate: (options: { reason?: string }) => void;
  onBulkDeactivate: (options: { reason?: string }) => void;
  onBulkDelete: (options: { reason: string }) => void;
  onBulkExport: (costCenters: CostCenter[]) => void;
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
    description: 'Activar centros de costo seleccionados',
    confirmMessage: 'Esta acción activará los centros de costo seleccionados haciéndolos disponibles para uso.'
  },
  deactivate: {
    label: 'Desactivar',
    color: 'yellow',
    icon: XCircleIcon,
    description: 'Desactivar centros de costo seleccionados',
    confirmMessage: 'Esta acción desactivará los centros de costo seleccionados y ya no estarán disponibles para nuevas asignaciones.'
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar centros de costo seleccionados',
    confirmMessage: 'Esta acción eliminará permanentemente los centros de costo seleccionados. Esta operación no se puede deshacer.',
    requiresReason: true
  },
  export: {
    label: 'Exportar',
    color: 'blue',
    icon: ArrowDownTrayIcon,
    description: 'Exportar centros de costo seleccionados',
    confirmMessage: 'Se exportarán todos los centros de costo seleccionados.'
  }
};

export function CostCenterBulkActionsBar({
  selectedCount,
  selectedCostCenters,
  isProcessing,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkExport,
  onClearSelection
}: CostCenterBulkActionsBarProps) {
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
      onBulkExport(selectedCostCenters);
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

  // Estadísticas de centros de costo seleccionados
  const stats = {
    active: selectedCostCenters.filter(cc => cc.is_active).length,
    inactive: selectedCostCenters.filter(cc => !cc.is_active).length,
    level1: selectedCostCenters.filter(cc => cc.level === 1).length,
    level2: selectedCostCenters.filter(cc => cc.level === 2).length,
    level3: selectedCostCenters.filter(cc => cc.level === 3).length,
    withChildren: selectedCostCenters.filter(cc => cc.children_count > 0).length,
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
                  <CalculatorIcon className="h-3 w-3 mr-1" />
                  {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                </Badge>
                
                {/* Estadísticas rápidas */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {stats.active > 0 && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{stats.active} activos</span>}
                  {stats.inactive > 0 && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">{stats.inactive} inactivos</span>}
                  {stats.withChildren > 0 && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">{stats.withChildren} con subcentros</span>}
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
                title={stats.active === selectedCount ? 'Todos los centros ya están activos' : 'Activar centros de costo'}
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
                title={stats.inactive === selectedCount ? 'Todos los centros ya están inactivos' : 'Desactivar centros de costo'}
              >
                <XCircleIcon className="h-4 w-4" />
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
            <div className="flex items-center gap-2">
              {stats.level1 > 0 && <span>Nivel 1: {stats.level1}</span>}
              {stats.level2 > 0 && <span>• Nivel 2: {stats.level2}</span>}
              {stats.level3 > 0 && <span>• Nivel 3: {stats.level3}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && config && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${config.label} Centros de Costo`}
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

            {/* Resumen de centros de costo */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Centros de costo seleccionados:</h4>
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
                  <span className="text-blue-600">Con subcentros:</span>
                  <span className="font-medium text-blue-600">{stats.withChildren}</span>
                </div>
              </div>
            </div>

            {/* Lista de centros de costo */}
            {selectedCostCenters.length <= 10 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Centros de costo afectados:</h4>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {selectedCostCenters.map(costCenter => (
                    <div key={costCenter.id} className="flex justify-between items-center p-2 text-sm">
                      <span className="font-medium">{costCenter.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          color={costCenter.is_active ? 'green' : 'red'} 
                          size="sm"
                        >
                          {costCenter.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge 
                          color={costCenter.level === 1 ? 'blue' : costCenter.level === 2 ? 'green' : 'gray'}
                          size="sm"
                        >
                          Nivel {costCenter.level}
                        </Badge>
                        <span className="text-gray-500">{costCenter.code}</span>
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
                    Esta acción eliminará permanentemente los centros de costo seleccionados y no se puede deshacer.
                    Los centros de costo con subcentros no se podrán eliminar.
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
