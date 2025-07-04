/**
 * Página principal para la gestión avanzada de pagos
 * Integra todas las nuevas funcionalidades implementadas
 */
import { PaymentListEnhanced } from '../components/PaymentListEnhanced';

export function PaymentManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentListEnhanced />
      </div>
    </div>
  );
}
