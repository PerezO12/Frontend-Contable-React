/**
 * Modal para mostrar y gestionar operaciones en lote de pagos
 * Proporciona interfaz unificada para todas las operaciones bulk
 */
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBulkPaymentOperations } from '../hooks/useBulkPaymentOperations';

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPaymentIds: string[];
}

export function BulkOperationsModal({ isOpen, onClose, selectedPaymentIds }: BulkOperationsModalProps) {
  const {
    isLoading,
    confirmSelectedPaymentsWithValidation,
    cancelSelectedPayments,
    deleteSelectedPayments,
    postSelectedPayments,
    resetSelectedPayments,
    draftSelectedPayments,
    validateConfirmation,
    getSelectionStats,
    canConfirm,
    canCancel,
    canDelete,
    canPost,
    canReset,
    canDraft
  } = useBulkPaymentOperations();

  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [operationNotes, setOperationNotes] = useState('');
  const [forceOperation, setForceOperation] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidation, setShowValidation] = useState(false);

  const stats = getSelectionStats();

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setActiveOperation(null);
      setOperationNotes('');
      setForceOperation(false);
      setValidationResult(null);
      setShowValidation(false);
    }
  }, [isOpen]);

  const operations = [
    {
      id: 'confirm',
      title: 'Confirmar Pagos',
      description: 'Confirmar pagos en borrador (DRAFT → POSTED)',
      color: 'bg-green-100 text-green-800',
      available: canConfirm,
      requiresNotes: false,
      supportsForce: true,
      supportsValidation: true
    },
    {
      id: 'post',
      title: 'Postear Pagos',
      description: 'Contabilizar pagos en borrador de forma optimizada',
      color: 'bg-blue-100 text-blue-800',
      available: canPost,
      requiresNotes: false,
      supportsForce: true,
      supportsValidation: true
    },
    {
      id: 'reset',
      title: 'Resetear Pagos',
      description: 'Restablecer pagos a borrador (POSTED/CANCELLED → DRAFT)',
      color: 'bg-orange-100 text-orange-800',
      available: canReset,
      requiresNotes: true,
      supportsForce: true,
      supportsValidation: false
    },
    {
      id: 'draft',
      title: 'Cambiar a Borrador',
      description: 'Cambiar pagos a estado borrador',
      color: 'bg-yellow-100 text-yellow-800',
      available: canDraft,
      requiresNotes: true,
      supportsForce: true,
      supportsValidation: false
    },
    {
      id: 'cancel',
      title: 'Cancelar Pagos',
      description: 'Cancelar múltiples pagos',
      color: 'bg-red-100 text-red-800',
      available: canCancel,
      requiresNotes: true,
      supportsForce: false,
      supportsValidation: false
    },
    {
      id: 'delete',
      title: 'Eliminar Pagos',
      description: 'Eliminar pagos en borrador (solo DRAFT)',
      color: 'bg-red-200 text-red-900',
      available: canDelete,
      requiresNotes: false,
      supportsForce: true,
      supportsValidation: false
    }
  ];

  const availableOperations = operations.filter(op => op.available);

  const handleValidateOperation = async () => {
    if (!activeOperation) return;

    try {
      setShowValidation(true);
      const result = await validateConfirmation(selectedPaymentIds);
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating operation:', error);
    }
  };

  const executeOperation = async () => {
    if (!activeOperation) return;

    try {
      let result;
      
      switch (activeOperation) {
        case 'confirm':
          result = await confirmSelectedPaymentsWithValidation(operationNotes, forceOperation);
          break;
        case 'post':
          result = await postSelectedPayments(operationNotes, forceOperation);
          break;
        case 'reset':
          result = await resetSelectedPayments(operationNotes);
          break;
        case 'draft':
          result = await draftSelectedPayments(operationNotes, forceOperation);
          break;
        case 'cancel':
          result = await cancelSelectedPayments();
          break;
        case 'delete':
          result = await deleteSelectedPayments();
          break;
      }
      
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Error executing operation:', error);
    }
  };

  const renderOperationCard = (operation: typeof operations[0]) => {
    const isActive = activeOperation === operation.id;
    
    return (
      <Card 
        key={operation.id}
        className={`cursor-pointer transition-all p-4 ${
          isActive 
            ? 'ring-2 ring-blue-500 shadow-md' 
            : 'hover:shadow-sm'
        } ${operation.color}`}
        onClick={() => setActiveOperation(operation.id)}
      >
        <div className="flex items-center gap-3">
          <div>
            <h4 className="text-sm font-medium">{operation.title}</h4>
            <p className="text-xs opacity-75">
              {operation.description}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  const renderValidationResult = () => {
    if (!validationResult || !showValidation) return null;

    return (
      <Alert className="mt-4">
        <div className="space-y-2">
          <p><strong>Validación completada:</strong></p>
          <ul className="text-sm space-y-1">
            <li>✅ {validationResult.valid_count} pagos válidos</li>
            {validationResult.blocked_count > 0 && (
              <li>❌ {validationResult.blocked_count} pagos con errores</li>
            )}
            {validationResult.warning_count > 0 && (
              <li>⚠️ {validationResult.warning_count} pagos con advertencias</li>
            )}
          </ul>
        </div>
      </Alert>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Operaciones en Lote">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Resumen de selección */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Resumen de Selección</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de pagos:</span> {stats.total}
            </div>
            <div>
              <span className="font-medium">Monto total:</span> ${stats.totalAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="mt-3">
            <span className="font-medium text-sm">Por estado:</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <Badge key={status}>
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Operaciones disponibles */}
        <div>
          <h3 className="text-lg font-medium mb-3">Operaciones Disponibles</h3>
          
          {availableOperations.length === 0 ? (
            <Alert>
              No hay operaciones disponibles para la selección actual.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {availableOperations.map(renderOperationCard)}
            </div>
          )}
        </div>

        {/* Configuración de operación */}
        {activeOperation && (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">
              {operations.find(op => op.id === activeOperation)?.title}
            </h3>
            
            <div className="space-y-4">
              {/* Notas de operación */}
              {operations.find(op => op.id === activeOperation)?.requiresNotes && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notas de la operación *
                  </label>
                  <Textarea
                    placeholder="Ingrese notas para esta operación..."
                    value={operationNotes}
                    onChange={(e) => setOperationNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Opción de forzar operación */}
              {operations.find(op => op.id === activeOperation)?.supportsForce && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="force-operation"
                    checked={forceOperation}
                    onChange={(e) => setForceOperation(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="force-operation" className="text-sm">
                    Forzar operación (ignorar advertencias)
                  </label>
                </div>
              )}

              {/* Validación */}
              {operations.find(op => op.id === activeOperation)?.supportsValidation && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleValidateOperation}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    {isLoading ? 'Validando...' : 'Validar Operación'}
                  </Button>
                  
                  {renderValidationResult()}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        
        {activeOperation && (
          <Button 
            onClick={executeOperation}
            disabled={isLoading || (operations.find(op => op.id === activeOperation)?.requiresNotes && !operationNotes.trim())}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Procesando...
              </div>
            ) : (
              `Ejecutar ${operations.find(op => op.id === activeOperation)?.title}`
            )}
          </Button>
        )}
      </div>
    </Modal>
  );
}
