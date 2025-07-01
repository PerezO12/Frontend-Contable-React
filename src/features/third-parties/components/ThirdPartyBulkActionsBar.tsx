/**
 * Componente de barra flotante de acciones para operaciones bulk en terceros
 * Basado en el panel de productos con las mismas funcionalidades
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@/shared/components/icons';
import type { ThirdParty } from '@/features/third-parties/types';

interface ThirdPartyBulkActionsBarProps {
  selectedCount: number;
  selectedThirdParties: ThirdParty[];
  isProcessing: boolean;
  onBulkActivate: (options: { reason?: string }) => void;
  onBulkDeactivate: (options: { reason?: string }) => void;
  onBulkDelete: (options: { reason: string }) => void;
  onBulkExport: (thirdParties: ThirdParty[]) => void;
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
    description: 'Activar terceros seleccionados',
    confirmMessage: 'Esta acción activará los terceros seleccionados haciéndolos disponibles para operaciones.',
    requiresReason: false
  },
  deactivate: {
    label: 'Desactivar',
    color: 'yellow',
    icon: ExclamationCircleIcon,
    description: 'Desactivar terceros seleccionados',
    confirmMessage: 'Esta acción desactivará los terceros seleccionados. No se eliminarán pero no estarán disponibles para nuevas operaciones.',
    requiresReason: false
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar terceros seleccionados',
    confirmMessage: 'Esta acción eliminará permanentemente los terceros seleccionados. Esta operación no se puede deshacer.',
    requiresReason: true
  },
  export: {
    label: 'Exportar',
    color: 'blue',
    icon: ArrowDownTrayIcon,
    description: 'Exportar terceros seleccionados',
    confirmMessage: 'Se exportarán los terceros seleccionados en el formato elegido.',
    requiresReason: false
  }
};

export function ThirdPartyBulkActionsBar({
  selectedCount,
  selectedThirdParties,
  isProcessing,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkExport,
  onClearSelection
}: ThirdPartyBulkActionsBarProps) {
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
      onBulkExport(selectedThirdParties);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentOperation(null);
    setFormData({ reason: '' });
  };

  const renderThirdPartyInfo = (thirdParty: ThirdParty) => (
    <div key={thirdParty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          {thirdParty.code} - {thirdParty.name}
        </div>
        <div className="text-sm text-gray-600">
          {thirdParty.commercial_name && thirdParty.commercial_name !== thirdParty.name ? 
            thirdParty.commercial_name : 
            thirdParty.document_number || 'Sin documento'
          }
        </div>
      </div>
      <div className="ml-4">
        <Badge color={thirdParty.is_active ? 'green' : 'gray'} variant="subtle">
          {thirdParty.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
    </div>
  );

  const currentConfig = currentOperation ? operationConfigs[currentOperation] : null;

  return (
    <>
      {/* Barra flotante de acciones */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-4 min-w-[400px]">
          {/* Información de selección */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <EyeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedCount} tercero{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500">
                {selectedThirdParties.filter(tp => tp.is_active).length} activo{selectedThirdParties.filter(tp => tp.is_active).length !== 1 ? 's' : ''} • {' '}
                {selectedThirdParties.filter(tp => !tp.is_active).length} inactivo{selectedThirdParties.filter(tp => !tp.is_active).length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOperationClick('activate')}
              disabled={isProcessing}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Activar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOperationClick('deactivate')}
              disabled={isProcessing}
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            >
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              Desactivar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOperationClick('export')}
              disabled={isProcessing}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Exportar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOperationClick('delete')}
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && currentConfig && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`${currentConfig.label} Terceros`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Descripción de la operación */}
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${currentConfig.color}-100`}>
                <currentConfig.icon className={`w-4 h-4 text-${currentConfig.color}-600`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {currentConfig.description}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {currentConfig.confirmMessage}
                </p>
              </div>
            </div>

            {/* Lista de terceros seleccionados */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Terceros seleccionados ({selectedCount}):
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {selectedThirdParties.map(renderThirdPartyInfo)}
              </div>
            </div>

            {/* Campo de razón (si es requerido) */}
            {currentConfig.requiresReason && (
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Razón de la operación *
                </label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Describe el motivo de esta operación..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Acciones del modal */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                variant={currentConfig.color === 'red' ? 'danger' : 'primary'}
                onClick={handleConfirmOperation}
                disabled={isProcessing || (currentConfig.requiresReason && !formData.reason.trim())}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <currentConfig.icon className="w-4 h-4 mr-2" />
                    {currentConfig.label}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}