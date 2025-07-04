/**
 * Componente para mostrar detalles de validación de pagos bulk
 * Muestra errores de bloqueo, advertencias y estado de cada pago
 */
import React from 'react';
import { ValidationMessage } from '@/components/forms/ValidationMessage';
import type { BulkPaymentValidationResponse, PaymentValidationResult } from '../types';

interface PaymentValidationDetailsProps {
  validation: BulkPaymentValidationResponse;
  onClose?: () => void;
  onProceedWithWarnings?: () => void;
  showProceedButton?: boolean;
}

export const PaymentValidationDetails: React.FC<PaymentValidationDetailsProps> = ({
  validation,
  onClose,
  onProceedWithWarnings,
  showProceedButton = false
}) => {
  const { validation_results, total_payments, can_confirm_count, blocked_count, warnings_count } = validation;

  const blockedPayments = validation_results.filter(r => !r.can_confirm);
  const warningPayments = validation_results.filter(r => r.can_confirm && r.warnings.length > 0);
  const validPayments = validation_results.filter(r => r.can_confirm && r.warnings.length === 0);

  return (
    <div className="space-y-6">
      {/* Resumen de validación */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Resumen de Validación
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total_payments}</div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{can_confirm_count}</div>
            <div className="text-gray-600">Válidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{blocked_count}</div>
            <div className="text-gray-600">Bloqueados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{warnings_count}</div>
            <div className="text-gray-600">Con Advertencias</div>
          </div>
        </div>
      </div>

      {/* Pagos bloqueados */}
      {blockedPayments.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-red-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pagos Bloqueados ({blockedPayments.length})
          </h4>
          <div className="space-y-3">
            {blockedPayments.map((payment) => (
              <PaymentValidationItem 
                key={payment.payment_id} 
                payment={payment} 
                type="error" 
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagos con advertencias */}
      {warningPayments.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-yellow-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pagos con Advertencias ({warningPayments.length})
          </h4>
          <div className="space-y-3">
            {warningPayments.map((payment) => (
              <PaymentValidationItem 
                key={payment.payment_id} 
                payment={payment} 
                type="warning" 
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagos válidos */}
      {validPayments.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-green-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Pagos Válidos ({validPayments.length})
          </h4>
          <div className="space-y-2">
            {validPayments.map((payment) => (
              <div key={payment.payment_id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <div>
                  <span className="font-medium text-green-800">
                    {payment.payment_number || payment.payment_id.slice(0, 8)}
                  </span>
                </div>
                <div className="text-green-600 text-sm">✓ Listo para contabilizar</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        )}
        
        {showProceedButton && can_confirm_count > 0 && onProceedWithWarnings && (
          <button
            onClick={onProceedWithWarnings}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={blocked_count > 0}
          >
            {blocked_count > 0 
              ? 'No se puede proceder (hay pagos bloqueados)'
              : `Continuar con ${can_confirm_count} pago${can_confirm_count !== 1 ? 's' : ''}`
            }
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente para mostrar un pago individual con sus errores/advertencias
 */
interface PaymentValidationItemProps {
  payment: PaymentValidationResult;
  type: 'error' | 'warning';
}

const PaymentValidationItem: React.FC<PaymentValidationItemProps> = ({ payment, type }) => {
  const issues = type === 'error' ? payment.blocking_reasons : payment.warnings;
  
  return (
    <div className={`border rounded-lg p-3 ${
      type === 'error' 
        ? 'border-red-200 bg-red-50' 
        : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h5 className={`font-medium ${
          type === 'error' ? 'text-red-800' : 'text-yellow-800'
        }`}>
          Pago: {payment.payment_number || payment.payment_id.slice(0, 8)}
        </h5>
        <span className={`text-xs px-2 py-1 rounded ${
          type === 'error' 
            ? 'bg-red-200 text-red-800' 
            : 'bg-yellow-200 text-yellow-800'
        }`}>
          {type === 'error' ? 'Bloqueado' : 'Advertencia'}
        </span>
      </div>
      
      <div className="space-y-1">
        {issues.map((issue, index) => (
          <ValidationMessage
            key={index}
            type={type}
            message={issue}
            className="text-xs"
          />
        ))}
      </div>
    </div>
  );
};
