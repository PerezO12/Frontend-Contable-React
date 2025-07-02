import type { DeletionService, DeletionCheckResult } from '../../../components/atomic/types';
import type { Payment } from '../types';
import { PaymentStatus } from '../types';

export class PaymentDeletionService implements DeletionService<Payment> {
  async checkDeletable(payments: Payment[]): Promise<DeletionCheckResult<Payment>> {
    // Solo se pueden eliminar pagos en estado DRAFT
    const canDelete = payments.filter(payment => 
      payment.status === PaymentStatus.DRAFT
    );
    const cannotDelete = payments.filter(payment => 
      payment.status !== PaymentStatus.DRAFT
    );
    
    const reasons: Record<string, string> = {};
    cannotDelete.forEach(payment => {
      reasons[payment.id] = 'Solo se pueden eliminar pagos en estado borrador';
    });

    return {
      canDelete,
      cannotDelete,
      reasons,
    };
  }

  async deleteItems(payments: Payment[]): Promise<void> {
    // Aquí iría la lógica de eliminación real
    // Por ahora delegamos al store que ya tiene la lógica implementada
    const { usePaymentStore } = await import('../stores/paymentStore');
    const { bulkDeletePayments } = usePaymentStore.getState();
    
    const paymentIds = payments.map(payment => payment.id);
    await bulkDeletePayments(paymentIds);
  }
}

export const paymentDeletionService = new PaymentDeletionService();
