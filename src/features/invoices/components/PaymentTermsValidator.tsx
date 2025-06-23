/**
 * Componente para validar payment terms en tiempo real
 * Muestra el estado de validación y errores
 */
import { useState, useEffect } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { type PaymentTermsValidation } from '../types';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@/shared/components/icons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PaymentTermsValidatorProps {
  paymentTermsId?: string;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  className?: string;
}

export function PaymentTermsValidator({
  paymentTermsId,
  onValidationChange,
  className = ''
}: PaymentTermsValidatorProps) {
  const [validation, setValidation] = useState<PaymentTermsValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentTermsId) {
      validatePaymentTerms();
    } else {
      setValidation(null);
      onValidationChange?.(true, []);
    }
  }, [paymentTermsId]);

  useEffect(() => {
    if (validation) {
      onValidationChange?.(validation.is_valid, validation.errors);
    }
  }, [validation, onValidationChange]);

  const validatePaymentTerms = async () => {
    if (!paymentTermsId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await InvoiceAPI.validatePaymentTerms(paymentTermsId);
      setValidation(result);
    } catch (err: any) {
      setError(err.message || 'Error al validar términos de pago');
      setValidation(null);
    } finally {
      setLoading(false);
    }
  };

  if (!paymentTermsId) {
    return null;
  }

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Validando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
        <span className="text-sm text-yellow-600">Error de validación</span>
      </div>
    );
  }

  if (!validation) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {validation.is_valid ? (
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">Términos válidos</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">Términos inválidos</span>
          </div>
          
          {validation.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <ul className="text-xs text-red-700 space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
