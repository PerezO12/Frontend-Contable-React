/**
 * Modal para confirmación masiva de pagos
 * Incluye validación previa y manejo de advertencias
 */
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { ExclamationCircleIcon, XCircleIcon } from '@/shared/components/icons';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';
import type { 
  BulkPaymentValidationResponse, 
  PaymentValidationResult,
  BulkConfirmationModalProps 
} from '../types';

export function BulkConfirmationModal({
  isOpen,
  onClose,
  paymentIds,
  onConfirm
}: BulkConfirmationModalProps) {
  const [validationLoading, setValidationLoading] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<BulkPaymentValidationResponse | null>(null);
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [force, setForce] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar automáticamente cuando se abre el modal
  useEffect(() => {
    if (isOpen && paymentIds.length > 0) {
      validatePayments();
    }
  }, [isOpen, paymentIds]);

  const validatePayments = async () => {
    setValidationLoading(true);
    try {
      const results = await PaymentFlowAPI.validatePaymentConfirmation(paymentIds);
      setValidationResults(results);
      setError(null);
    } catch (error) {
      console.error('Error validating payments:', error);
      setError('Error al validar los pagos. Intente nuevamente.');
    } finally {
      setValidationLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!validationResults) return;
    
    setConfirmationLoading(true);
    try {
      await onConfirm(confirmationNotes || undefined, force);
      onClose();
    } catch (error: any) {
      console.error('🚨 Error confirming payments:', error);
      console.error('🚨 Error response data:', error.response?.data);
      console.error('🚨 Error status:', error.response?.status);
      console.error('🚨 Error message:', error.message);
      
      // Extraer mensaje detallado del servidor
      const serverMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      console.error('🚨 Server error message:', serverMessage);
      
      setError(`Error al confirmar los pagos: ${serverMessage}`);
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleClose = () => {
    setValidationResults(null);
    setConfirmationNotes('');
    setForce(false);
    setError(null);
    onClose();
  };

  if (!validationResults) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Validando pagos...">
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600">Validando {paymentIds.length} pagos...</span>
        </div>
      </Modal>
    );
  }

  const {
    total_payments,
    can_confirm_count: valid_count,
    blocked_count,
    warnings_count: warning_count,
    validation_results: results
  } = validationResults;

  const can_proceed = blocked_count === 0;
  const hasBlockedPayments = blocked_count > 0;
  const hasWarnings = warning_count > 0;
  const blockedPayments = results.filter((r: PaymentValidationResult) => !r.can_confirm && r.blocking_reasons.length > 0);
  const warningPayments = results.filter((r: PaymentValidationResult) => r.can_confirm && r.warnings.length > 0);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Confirmar pagos masivamente"
      size="lg"
    >
      <div className="space-y-6">
        {/* Resumen de validación */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Resumen de validación</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total_payments}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{valid_count}</div>
              <div className="text-xs text-gray-600">Válidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{warning_count}</div>
              <div className="text-xs text-gray-600">Advertencias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{blocked_count}</div>
              <div className="text-xs text-gray-600">Bloqueados</div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {hasBlockedPayments && (
          <Alert variant="error">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <div>
                <strong>Pagos bloqueados encontrados</strong>
                <p className="text-sm mt-1">
                  {blocked_count} pagos tienen errores que impiden su confirmación. 
                  Revise los detalles abajo y corrija los problemas antes de continuar.
                </p>
              </div>
            </div>
          </Alert>
        )}

        {hasWarnings && (
          <Alert variant="warning">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <div>
                <strong>Advertencias detectadas</strong>
                <p className="text-sm mt-1">
                  {warning_count} pagos tienen advertencias. Puede proceder forzando la confirmación 
                  o revisar los detalles primero.
                </p>
              </div>
            </div>
          </Alert>
        )}

        {error && (
          <Alert variant="error">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 mr-2" />
              <div>{error}</div>
            </div>
          </Alert>
        )}

        {/* Lista de problemas */}
        {(hasBlockedPayments || hasWarnings) && (
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="text-sm font-medium text-gray-900">Detalles de validación</h4>
            </div>
            <div className="divide-y">
              {blockedPayments.map((payment, idx) => (
                <PaymentValidationItem 
                  key={`blocked-${idx}`} 
                  payment={payment} 
                  variant="error"
                />
              ))}
              {warningPayments.map((payment, idx) => (
                <PaymentValidationItem 
                  key={`warning-${idx}`} 
                  payment={payment} 
                  variant="warning"
                />
              ))}
            </div>
          </div>
        )}

        {/* Notas de confirmación */}
        {can_proceed && (
          <div>
            <label htmlFor="confirmationNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas de confirmación (opcional)
            </label>
            <textarea
              id="confirmationNotes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese notas adicionales para esta confirmación masiva..."
              value={confirmationNotes}
              onChange={(e) => setConfirmationNotes(e.target.value)}
            />
          </div>
        )}

        {/* Opción de forzar confirmación */}
        {hasWarnings && (
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="forceConfirmation"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="forceConfirmation" className="text-sm text-gray-700">
              <span className="font-medium">Forzar confirmación</span>
              <p className="text-xs text-gray-500 mt-1">
                Confirmar pagos a pesar de las advertencias. Use esta opción solo si está seguro 
                de que desea proceder.
              </p>
            </label>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={confirmationLoading}
          >
            Cancelar
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={validatePayments}
              disabled={validationLoading || confirmationLoading}
            >
              {validationLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Volver a validar
            </Button>

            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={
                confirmationLoading || 
                (!can_proceed && !force) ||
                (hasBlockedPayments && !force)
              }
            >
              {confirmationLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {hasWarnings && force ? 'Forzar confirmación' : 'Confirmar pagos'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Componente para mostrar cada item de validación
interface PaymentValidationItemProps {
  payment: PaymentValidationResult;
  variant: 'warning' | 'error';
}

function PaymentValidationItem({ payment, variant }: PaymentValidationItemProps) {
  const icon = variant === 'error' ? XCircleIcon : ExclamationCircleIcon;
  const iconColor = variant === 'error' ? 'text-red-500' : 'text-yellow-500';
  const Icon = icon;

  return (
    <div className="px-4 py-3 flex items-start space-x-3">
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {payment.payment_number}
          </span>
          <Badge 
            color={variant === 'error' ? 'red' : 'yellow'} 
            variant="subtle"
          >
            {variant === 'error' ? 'Bloqueado' : 'Advertencia'}
          </Badge>
        </div>
        {payment.blocking_reasons && payment.blocking_reasons.length > 0 && (
          <ul className="mt-1 text-sm text-gray-600 space-y-1">
            {payment.blocking_reasons.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        )}
        {payment.warnings && payment.warnings.length > 0 && (
          <ul className="mt-1 text-sm text-gray-600 space-y-1">
            {payment.warnings.map((warning, idx) => (
              <li key={idx}>• {warning}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
