import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { PaymentTermsForm } from './PaymentTermsForm';
import type { PaymentTerms, PaymentTermsCreate } from '../types';

interface PaymentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (paymentTerms: PaymentTerms) => void;
  initialData?: Partial<PaymentTermsCreate>;
  editingPaymentTerms?: PaymentTerms | null;
  title?: string;
}

export const PaymentTermsModal: React.FC<PaymentTermsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  editingPaymentTerms,
  title
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTrigger, setSubmitTrigger] = useState(0);

  const isEditing = !!editingPaymentTerms;
  const modalTitle = title || (isEditing ? 'Editar Condiciones de Pago' : 'Crear Condiciones de Pago');
  const buttonText = isEditing ? 'Guardar Cambios' : 'Crear Condiciones de Pago';
  
  // Preparar datos iniciales para edición
  const formInitialData = editingPaymentTerms ? {
    code: editingPaymentTerms.code,
    name: editingPaymentTerms.name,
    description: editingPaymentTerms.description,
    is_active: editingPaymentTerms.is_active,
    notes: editingPaymentTerms.notes,
    payment_schedules: editingPaymentTerms.payment_schedules || []
  } : initialData;

  const handleSuccess = (paymentTerms: PaymentTerms) => {
    setIsSubmitting(false);
    onSuccess?.(paymentTerms);
    onClose();
  };
  const handleLoadingChange = (loading: boolean) => {
    setIsSubmitting(loading);
  };

  const handleSubmit = () => {
    setSubmitTrigger(prev => prev + 1);
  };

  const handleFormError = () => {
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (    
  <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
    <div 
        className="w-[800px] max-w-[90vw] max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <Card>          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{modalTitle}</h2>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="card-body max-h-[75vh] overflow-y-auto">            <PaymentTermsForm
              onSuccess={handleSuccess}
              onError={handleFormError}
              onLoadingChange={handleLoadingChange}
              initialData={formInitialData}
              editingPaymentTerms={editingPaymentTerms}
              submitTrigger={submitTrigger}
            />
          </div>          <div className="card-footer border-t bg-gray-50 pt-4">
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creando...
                  </>                ) : (
                  buttonText
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
