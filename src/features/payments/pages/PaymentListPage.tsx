/**
 * Página principal de lista de pagos
 * Navega a página dedicada de detalle al seleccionar un pago
 */
import { useNavigate } from 'react-router-dom';
import { PaymentListView } from '../../../components/atomic/templatesViews/PaymentListView';
import type { Payment } from '../types';

export function PaymentListPage() {
  const navigate = useNavigate();

  const handlePaymentSelect = (payment: Payment) => {
    navigate(`/payments/${payment.id}`);
  };

  const handleCreatePayment = () => {
    navigate('/payments/new');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PaymentListView
        onPaymentSelect={handlePaymentSelect}
        onCreatePayment={handleCreatePayment}
        showActions={true}
      />
    </div>
  );
}
