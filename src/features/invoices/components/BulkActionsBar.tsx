/**
 * Componente de barra de acciones para operaciones bulk en facturas
 * Incluye validación, confirmación y feedback de resultados
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/shared/utils/formatters';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@/shared/components/icons';
import { NFEBulkInfo } from './NFEBulkInfo';
import type { 
  BulkOperationValidation,
  BulkPostRequest,
  BulkCancelRequest,
  BulkResetToDraftRequest,
  BulkDeleteRequest
} from '../types';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedInvoices: Array<{ 
    id: string; 
    invoice_number: string; 
    description?: string; 
    notes?: string; 
  }>;
  isProcessing: boolean;
  validationData: BulkOperationValidation | null;
  onValidateOperation: (operation: 'post' | 'cancel' | 'reset' | 'delete') => Promise<BulkOperationValidation | null>;
  onBulkPost: (options: Omit<BulkPostRequest, 'invoice_ids'>) => void;
  onBulkCancel: (options: Omit<BulkCancelRequest, 'invoice_ids'>) => void;
  onBulkResetToDraft: (options: Omit<BulkResetToDraftRequest, 'invoice_ids'>) => void;
  onBulkDelete: (options: Omit<BulkDeleteRequest, 'invoice_ids'>) => void;
  onClearSelection: () => void;
}

type BulkOperation = 'post' | 'cancel' | 'reset' | 'delete';

interface OperationConfig {
  label: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
}

const operationConfigs: Record<BulkOperation, OperationConfig> = {
  post: {
    label: 'Contabilizar',
    color: 'green',
    icon: CheckCircleIcon,
    description: 'Contabilizar facturas (DRAFT → POSTED)',
    confirmMessage: 'Esta acción generará asientos contables automáticamente. ¿Está seguro?'
  },
  cancel: {
    label: 'Cancelar',
    color: 'red',
    icon: XCircleIcon,
    description: 'Cancelar facturas (POSTED → CANCELLED)',
    confirmMessage: 'Esta acción creará asientos de reversión. ¿Está seguro?'
  },  reset: {
    label: 'Reset a Borrador',
    color: 'yellow',
    icon: DocumentDuplicateIcon,
    description: 'Restablecer a borrador (POSTED/CANCELLED → DRAFT)',
    confirmMessage: 'Esta acción eliminará los asientos contables asociados o de reversión. ¿Está seguro?'
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar facturas (solo DRAFT)',
    confirmMessage: 'Esta acción es IRREVERSIBLE. ¿Está absolutamente seguro?'
  }
};

export function BulkActionsBar({
  selectedCount,
  selectedInvoices,
  isProcessing,
  validationData,
  onValidateOperation,
  onBulkPost,
  onBulkCancel,
  onBulkResetToDraft,
  onBulkDelete,
  onClearSelection
}: BulkActionsBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [formData, setFormData] = useState({
    posting_date: new Date().toISOString().split('T')[0],
    notes: '',
    reason: '',
    force_post: false,
    force_reset: false,
    stop_on_error: false
  });
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  if (selectedCount === 0) return null;

  const handleOperationClick = async (operation: BulkOperation) => {
    setCurrentOperation(operation);
    
    // Validar operación
    const validation = await onValidateOperation(operation);
    if (!validation) return;

    // Si no se puede proceder, mostrar solo los detalles
    if (!validation.can_proceed) {
      setShowValidationDetails(true);
      return;
    }

    // Si hay advertencias pero se puede proceder, mostrar modal de confirmación
    setShowModal(true);
  };

  const handleConfirmOperation = () => {
    if (!currentOperation) return;

    const baseOptions = {
      notes: formData.notes,
      reason: formData.reason,
      stop_on_error: formData.stop_on_error
    };

    switch (currentOperation) {
      case 'post':
        onBulkPost({
          ...baseOptions,
          posting_date: formData.posting_date,
          force_post: formData.force_post
        });
        break;
      case 'cancel':
        onBulkCancel(baseOptions);
        break;
      case 'reset':
        onBulkResetToDraft({
          ...baseOptions,
          force_reset: formData.force_reset
        });        break;
      case 'delete':
        onBulkDelete({
          confirmation: 'CONFIRM_DELETE',
          reason: formData.reason
        });
        break;
    }

    setShowModal(false);
    setCurrentOperation(null);
    setFormData({
      posting_date: new Date().toISOString().split('T')[0],
      notes: '',
      reason: '',
      force_post: false,
      force_reset: false,
      stop_on_error: false
    });
  };

  const config = currentOperation ? operationConfigs[currentOperation] : null;

  return (
    <>
      {/* Barra de acciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge color="blue" variant="subtle">
                {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
              </Badge>
              
              {validationData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowValidationDetails(true)}
                  className="flex items-center gap-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  Ver detalles
                </Button>
              )}
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
              onClick={() => handleOperationClick('post')}
              disabled={isProcessing}
              className="flex items-center gap-1 text-green-600 hover:text-green-700"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Contabilizar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOperationClick('cancel')}
              disabled={isProcessing}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <XCircleIcon className="h-4 w-4" />
              Cancelar
            </Button>            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOperationClick('reset')}
              disabled={isProcessing}
              className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Reset
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
      </div>      {/* Modal de confirmación */}
      {showModal && config && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${config.label} Facturas`}
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

            {/* Resumen de validación */}
            {validationData && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Resumen de validación:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total solicitadas:</span>
                    <span className="font-medium">{validationData.total_requested}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Válidas:</span>
                    <span className="font-medium text-green-600">{validationData.valid_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Inválidas:</span>
                    <span className="font-medium text-red-600">{validationData.invalid_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No encontradas:</span>
                    <span className="font-medium text-gray-600">{validationData.not_found_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario según operación */}
            <div className="space-y-4">
              {currentOperation === 'post' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de contabilización
                    </label>
                    <Input
                      type="date"
                      value={formData.posting_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, posting_date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="force_post"
                      checked={formData.force_post}
                      onChange={(e) => setFormData(prev => ({ ...prev, force_post: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="force_post" className="text-sm text-gray-700">
                      Forzar contabilización (ignorar validaciones menores)
                    </label>
                  </div>
                </>
              )}

              {(currentOperation === 'cancel' || currentOperation === 'reset' || currentOperation === 'delete') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo {currentOperation === 'delete' ? '(obligatorio)' : '(opcional)'}
                  </label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Explique el motivo de esta operación..."
                    rows={3}
                    required={currentOperation === 'delete'}
                  />
                </div>
              )}

              {currentOperation === 'reset' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="force_reset"
                    checked={formData.force_reset}
                    onChange={(e) => setFormData(prev => ({ ...prev, force_reset: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="force_reset" className="text-sm text-gray-700">
                    Forzar reset (incluso si hay pagos aplicados)
                  </label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stop_on_error"
                  checked={formData.stop_on_error}
                  onChange={(e) => setFormData(prev => ({ ...prev, stop_on_error: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="stop_on_error" className="text-sm text-gray-700">
                  Detener en el primer error
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas internas sobre esta operación..."
                  rows={2}
                />
              </div>
            </div>            
            {/* Información específica para facturas NFE */}
            {currentOperation && (
              <NFEBulkInfo
                selectedInvoices={selectedInvoices}
                operation={currentOperation}
              />
            )}
            
            {/* Advertencia para eliminación */}
            {currentOperation === 'delete' && (
              <Alert>
                <ExclamationCircleIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium text-red-600">¡Advertencia de eliminación!</h4>
                  <p className="text-sm mt-1 text-red-600">
                    Esta acción eliminará permanentemente las facturas seleccionadas y no se puede deshacer.
                    Solo se pueden eliminar facturas en estado BORRADOR.
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
                disabled={isProcessing || (currentOperation === 'delete' && !formData.reason.trim())}
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
      )}      {/* Modal de detalles de validación */}
      {showValidationDetails && validationData && (
        <Modal
          isOpen={showValidationDetails}
          onClose={() => setShowValidationDetails(false)}
          title="Detalles de Validación"
          size="xl"
        >
          <div className="space-y-6">
            {/* Facturas válidas */}
            {validationData.valid_count > 0 && (
              <div>
                <h4 className="font-medium text-green-600 mb-3">
                  Facturas válidas ({validationData.valid_count})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-green-50">                  {validationData.valid_invoices.map(invoice => (
                    <div key={invoice.id} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="font-medium">{String(invoice.invoice_number || '')}</span>
                      <div className="text-sm text-gray-600">
                        <span className="mr-3">{String(invoice.status || '')}</span>
                        <span>{formatCurrency(Number(invoice.total_amount) || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facturas inválidas */}
            {validationData.invalid_count > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-3">
                  Facturas inválidas ({validationData.invalid_count})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-red-50">                  {validationData.invalid_invoices.map(invoice => (
                    <div key={invoice.id} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{String(invoice.invoice_number || '')}</span>
                        <span className="text-sm text-gray-600">{String(invoice.status || '')}</span>
                      </div>                      <div className="text-sm text-red-600">
                        {Array.isArray(invoice.reasons) ? invoice.reasons.map((reason, idx) => (
                          <div key={idx}>• {typeof reason === 'string' ? reason : typeof reason === 'object' ? JSON.stringify(reason) : String(reason || '')}</div>
                        )) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facturas no encontradas */}
            {validationData.not_found_count > 0 && (
              <div>
                <h4 className="font-medium text-gray-600 mb-3">
                  Facturas no encontradas ({validationData.not_found_count})
                </h4>                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border">
                  {Array.isArray(validationData.not_found_ids) ? validationData.not_found_ids.map(String).join(', ') : String(validationData.not_found_ids || '')}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white">
              <Button onClick={() => setShowValidationDetails(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
