/**
 * Componente para botones de acciones individuales de pagos
 * Proporciona acciones contextuales según el estado del pago
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { usePaymentOperations } from '../hooks/usePaymentOperations';
import type { Payment } from '../types';

interface PaymentActionsProps {
  payment: Payment;
  onSuccess?: () => void;
  variant?: 'full' | 'compact' | 'dropdown';
}

export function PaymentActions({ payment, onSuccess, variant = 'full' }: PaymentActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  const {
    isLoading,
    confirmPaymentAction,
    cancelPaymentAction,
    resetPaymentAction,
    deletePaymentAction,
    getAvailableOperations,
    getPaymentStatusInfo
  } = usePaymentOperations();

  const operations = getAvailableOperations(payment);
  const statusInfo = getPaymentStatusInfo(payment.status);

  const handleActionClick = (actionType: string) => {
    let action: () => Promise<void>;
    let title: string;
    let message: string;

    switch (actionType) {
      case 'confirm':
        action = async () => {
          await confirmPaymentAction(payment.id);
          onSuccess?.();
        };
        title = 'Confirmar Pago';
        message = `¿Está seguro que desea confirmar el pago ${payment.number}? Esta acción creará el asiento contable correspondiente.`;
        break;

      case 'cancel':
        action = async () => {
          await cancelPaymentAction(payment.id);
          onSuccess?.();
        };
        title = 'Cancelar Pago';
        message = `¿Está seguro que desea cancelar el pago ${payment.number}?`;
        break;

      case 'reset':
        action = async () => {
          await resetPaymentAction(payment.id);
          onSuccess?.();
        };
        title = 'Resetear Pago';
        message = `¿Está seguro que desea resetear el pago ${payment.number} a borrador? Esto eliminará el asiento contable asociado.`;
        break;

      case 'delete':
        action = async () => {
          await deletePaymentAction(payment.id);
          onSuccess?.();
        };
        title = 'Eliminar Pago';
        message = `¿Está seguro que desea eliminar el pago ${payment.number}? Esta acción no se puede deshacer.`;
        break;

      default:
        return;
    }

    setPendingAction({
      type: actionType,
      title,
      message,
      action
    });
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!pendingAction) return;

    try {
      await pendingAction.action();
      setShowConfirmDialog(false);
      setPendingAction(null);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const renderStatusBadge = () => (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
        statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
        statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}
    >
      {statusInfo.label}
    </span>
  );

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {renderStatusBadge()}
        
        {operations.canConfirm && (
          <Button
            size="sm"
            onClick={() => handleActionClick('confirm')}
            disabled={isLoading}
          >
            Confirmar
          </Button>
        )}
        
        {operations.canReset && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('reset')}
            disabled={isLoading}
          >
            Resetear
          </Button>
        )}
        
        {operations.canCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('cancel')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        
        {operations.canDelete && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('delete')}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        )}

        <ConfirmDialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={executeAction}
          title={pendingAction?.title || ''}
          description={pendingAction?.message || ''}
          confirmText="Confirmar"
          cancelText="Cancelar"
          loading={isLoading}
        />
      </div>
    );
  }

  if (variant === 'dropdown') {
    // TODO: Implementar dropdown menu cuando tengamos el componente
    return (
      <div className="text-right">
        {renderStatusBadge()}
      </div>
    );
  }

  // Variante completa (default)
  return (
    <div className="space-y-4">
      {/* Estado actual */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Estado actual:</span>
        {renderStatusBadge()}
      </div>

      {/* Descripción del estado */}
      <p className="text-sm text-gray-600">
        {statusInfo.description}
      </p>

      {/* Acciones disponibles */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Acciones disponibles:</h4>
        
        <div className="grid grid-cols-2 gap-2">
          {operations.canConfirm && (
            <Button
              onClick={() => handleActionClick('confirm')}
              disabled={isLoading}
              className="w-full"
            >
              Confirmar
            </Button>
          )}
          
          {operations.canReset && (
            <Button
              variant="outline"
              onClick={() => handleActionClick('reset')}
              disabled={isLoading}
              className="w-full"
            >
              Resetear
            </Button>
          )}
          
          {operations.canCancel && (
            <Button
              variant="outline"
              onClick={() => handleActionClick('cancel')}
              disabled={isLoading}
              className="w-full"
            >
              Cancelar
            </Button>
          )}
          
          {operations.canDelete && (
            <Button
              variant="outline"
              onClick={() => handleActionClick('delete')}
              disabled={isLoading}
              className="w-full text-red-600 hover:text-red-700"
            >
              Eliminar
            </Button>
          )}
        </div>

        {statusInfo.availableActions.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Acciones posibles:</strong> {statusInfo.availableActions.join(', ')}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={executeAction}
        title={pendingAction?.title || ''}
        description={pendingAction?.message || ''}
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isLoading}
      />
    </div>
  );
}
