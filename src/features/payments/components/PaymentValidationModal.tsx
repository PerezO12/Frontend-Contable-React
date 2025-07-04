/**
 * Modal para mostrar detalles de validación de pagos
 * Permite al usuario ver exactamente por qué los pagos están bloqueados
 */
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { PaymentValidationDetails } from './PaymentValidationDetails';
import type { BulkPaymentValidationResponse } from '../types';

interface PaymentValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: BulkPaymentValidationResponse | null;
  onProceedWithWarnings?: () => void;
  title?: string;
  showProceedButton?: boolean;
}

export const PaymentValidationModal: React.FC<PaymentValidationModalProps> = ({
  isOpen,
  onClose,
  validation,
  onProceedWithWarnings,
  title = 'Detalles de Validación de Pagos',
  showProceedButton = false
}) => {
  if (!validation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <PaymentValidationDetails
          validation={validation}
          onClose={onClose}
          onProceedWithWarnings={onProceedWithWarnings}
          showProceedButton={showProceedButton}
        />
      </div>
    </Modal>
  );
};
