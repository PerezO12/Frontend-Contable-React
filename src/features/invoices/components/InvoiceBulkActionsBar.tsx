/**
 * Componente de barra flotante de acciones para operaciones bulk en facturas
 * Incluye cambios de estado, exportar y eliminar
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowDownTrayIcon,
  TrashIcon,
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon
} from '@/shared/components/icons';
import { InvoiceStatusEnum } from '../types';
import type { Invoice } from '../types/legacy';

export interface InvoiceBulkActionsBarProps {
  selectedCount: number;
  selectedInvoices: Invoice[];
  onExport: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  onBulkPost?: (options: { notes?: string; force_post?: boolean }) => void;
  onBulkCancel?: (options: { reason?: string }) => void;
  onBulkResetToDraft?: (options: { reason?: string; force_reset?: boolean }) => void;
  isProcessing?: boolean;
}

type BulkOperation = 'post' | 'cancel' | 'reset_to_draft' | 'export' | 'delete';

interface OperationConfig {
  label: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
  requiresReason?: boolean;
}

const operationConfigs: Record<BulkOperation, OperationConfig> = {
  post: {
    label: 'Contabilizar',
    color: 'green',
    icon: CheckCircleIcon,
    description: 'Contabilizar facturas seleccionadas',
    confirmMessage: 'Esta acción contabilizará las facturas seleccionadas (DRAFT → POSTED). Se generarán asientos contables automáticos.',
    requiresReason: false
  },
  cancel: {
    label: 'Cancelar',
    color: 'red',
    icon: ExclamationCircleIcon,
    description: 'Cancelar facturas seleccionadas',
    confirmMessage: 'Esta acción cancelará las facturas seleccionadas (POSTED → CANCELLED). Esta operación no se puede deshacer.',
    requiresReason: true
  },
  reset_to_draft: {
    label: 'Volver a Borrador',
    color: 'yellow',
    icon: PencilIcon,
    description: 'Restablecer facturas a borrador',
    confirmMessage: 'Esta acción restablecerá las facturas seleccionadas a borrador (POSTED → DRAFT). Los asientos contables serán revertidos.',
    requiresReason: true
  },
  export: {
    label: 'Exportar',
    color: 'blue',
    icon: ArrowDownTrayIcon,
    description: 'Exportar facturas seleccionadas',
    confirmMessage: 'Se exportarán todas las facturas seleccionadas.'
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar facturas seleccionadas',
    confirmMessage: 'Esta acción eliminará permanentemente las facturas seleccionadas. Solo se pueden eliminar facturas en estado DRAFT.',
    requiresReason: true
  }
};

export const InvoiceBulkActionsBar: React.FC<InvoiceBulkActionsBarProps> = ({
  selectedCount,
  selectedInvoices,
  onExport,
  onDelete,
  onClearSelection,
  onBulkPost,
  onBulkCancel,
  onBulkResetToDraft,
  isProcessing = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    force_post: false,
    force_reset: false
  });

  if (selectedCount === 0) return null;

  const handleOperationClick = (operation: BulkOperation) => {
    setCurrentOperation(operation);
    
    // Para exportar, ejecutar directamente
    if (operation === 'export') {
      onExport();
      return;
    }

    // Para eliminar, usar el handler existente
    if (operation === 'delete') {
      onDelete();
      return;
    }

    // Para operaciones de estado, mostrar modal de confirmación
    setShowModal(true);
  };

  const handleConfirmOperation = () => {
    if (!currentOperation) return;

    switch (currentOperation) {
      case 'post':
        if (onBulkPost) {
          onBulkPost({ notes: formData.notes, force_post: formData.force_post });
        }
        break;
      case 'cancel':
        if (onBulkCancel) {
          onBulkCancel({ reason: formData.reason });
        }
        break;
      case 'reset_to_draft':
        if (onBulkResetToDraft) {
          onBulkResetToDraft({ reason: formData.reason, force_reset: formData.force_reset });
        }
        break;
    }

    setShowModal(false);
    setCurrentOperation(null);
    setFormData({ reason: '', notes: '', force_post: false, force_reset: false });
  };

  const currentConfig = currentOperation ? operationConfigs[currentOperation] : null;

  // Estadísticas de facturas seleccionadas
  const stats = {
    draft: selectedInvoices.filter(inv => inv.status === InvoiceStatusEnum.DRAFT).length,
    posted: selectedInvoices.filter(inv => inv.status === InvoiceStatusEnum.POSTED).length,
    cancelled: selectedInvoices.filter(inv => inv.status === InvoiceStatusEnum.CANCELLED).length,
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case InvoiceStatusEnum.DRAFT:
        return { label: 'Borrador', color: 'yellow' as const, icon: DocumentTextIcon };
      case InvoiceStatusEnum.POSTED:
        return { label: 'Contabilizada', color: 'green' as const, icon: CheckCircleIcon };
      case InvoiceStatusEnum.CANCELLED:
        return { label: 'Cancelada', color: 'red' as const, icon: ExclamationCircleIcon };
      default:
        return { label: status, color: 'gray' as const, icon: DocumentTextIcon };
    }
  };

  return (
    <>
      {/* Barra flotante de acciones */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-4 min-w-[600px]">
          {/* Información de selección */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedCount} factura{selectedCount !== 1 ? 's' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {stats.draft > 0 && (
                  <span>
                    <Badge color="yellow" variant="subtle" className="text-xs px-1 py-0">
                      {stats.draft} borrador{stats.draft !== 1 ? 's' : ''}
                    </Badge>
                  </span>
                )}
                {stats.posted > 0 && (
                  <span>
                    <Badge color="green" variant="subtle" className="text-xs px-1 py-0">
                      {stats.posted} contabilizada{stats.posted !== 1 ? 's' : ''}
                    </Badge>
                  </span>
                )}
                {stats.cancelled > 0 && (
                  <span>
                    <Badge color="red" variant="subtle" className="text-xs px-1 py-0">
                      {stats.cancelled} cancelada{stats.cancelled !== 1 ? 's' : ''}
                    </Badge>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Acciones de cambio de estado */}
          <div className="flex items-center space-x-2">
            {/* Contabilizar (solo disponible para DRAFT) */}
            {stats.draft > 0 && onBulkPost && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOperationClick('post')}
                disabled={isProcessing}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Contabilizar
              </Button>
            )}

            {/* Cancelar (solo disponible para POSTED) */}
            {stats.posted > 0 && onBulkCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOperationClick('cancel')}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            )}

            {/* Volver a borrador (solo disponible para POSTED) */}
            {stats.posted > 0 && onBulkResetToDraft && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOperationClick('reset_to_draft')}
                disabled={isProcessing}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                A Borrador
              </Button>
            )}
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Acciones generales */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              disabled={isProcessing}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Exportar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Eliminar
            </Button>

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
          </div>

          {/* Indicador de procesamiento */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              <span className="text-sm font-medium">Procesando operación...</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {currentConfig && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Confirmar ${currentConfig.label}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${currentConfig.color}-100`}>
                <currentConfig.icon className={`w-4 h-4 text-${currentConfig.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{currentConfig.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{currentConfig.confirmMessage}</p>
              </div>
            </div>

            {/* Facturas afectadas */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Facturas que serán afectadas ({selectedCount})
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedInvoices.slice(0, 5).map((invoice) => {
                  const statusInfo = getStatusInfo(invoice.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div key={invoice.id} className="flex items-center justify-between text-xs">
                      <span className="font-mono">{invoice.number}</span>
                      <div className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                  );
                })}
                {selectedCount > 5 && (
                  <div className="text-xs text-gray-500 italic">
                    ... y {selectedCount - 5} más
                  </div>
                )}
              </div>
            </div>

            {/* Campo de razón/notas si es requerido */}
            {currentConfig.requiresReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentOperation === 'post' ? 'Notas (opcional)' : 'Razón'}
                  {currentOperation !== 'post' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Textarea
                  value={currentOperation === 'post' ? formData.notes : formData.reason}
                  onChange={(e) => {
                    if (currentOperation === 'post') {
                      setFormData(prev => ({ ...prev, notes: e.target.value }));
                    } else {
                      setFormData(prev => ({ ...prev, reason: e.target.value }));
                    }
                  }}
                  placeholder={currentOperation === 'post' ? 'Notas adicionales...' : 'Especifica la razón para esta acción...'}
                  rows={3}
                  className="w-full"
                />
              </div>
            )}

            {/* Acciones del modal */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmOperation}
                disabled={isProcessing || (currentConfig.requiresReason && currentOperation !== 'post' && !formData.reason.trim())}
                className={`bg-${currentConfig.color}-600 hover:bg-${currentConfig.color}-700`}
              >
                {isProcessing ? 'Procesando...' : `Confirmar ${currentConfig.label}`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
