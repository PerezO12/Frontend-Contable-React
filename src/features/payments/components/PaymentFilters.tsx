/**
 * Componente de filtros para pagos
 */
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentStatus, PaymentType } from '../types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function PaymentFilters() {
  const { filters, setFilters, fetchPayments } = usePaymentStore();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value || undefined });
  };

  const applyFilters = () => {
    fetchPayments();
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 20
    });
    fetchPayments();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <Select
            value={filters.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: PaymentStatus.DRAFT, label: 'Borrador' },
              { value: PaymentStatus.POSTED, label: 'Confirmado' },
              { value: PaymentStatus.CANCELLED, label: 'Cancelado' }
            ]}
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <Select
            value={filters.payment_type || ''}
            onChange={(value) => handleFilterChange('payment_type', value)}
            options={[
              { value: '', label: 'Todos los tipos' },
              { value: PaymentType.CUSTOMER_PAYMENT, label: 'Pago de Cliente' },
              { value: PaymentType.SUPPLIER_PAYMENT, label: 'Pago a Proveedor' },
              { value: PaymentType.INTERNAL_TRANSFER, label: 'Transferencia Interna' },
              { value: PaymentType.ADVANCE_PAYMENT, label: 'Anticipo' },
              { value: PaymentType.REFUND, label: 'Reembolso' }
            ]}
          />
        </div>

        {/* Fecha desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde
          </label>
          <Input
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha hasta
          </label>
          <Input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
          />
        </div>

        {/* Referencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia
          </label>
          <Input
            placeholder="Buscar por referencia..."
            value={filters.reference || ''}
            onChange={(e) => handleFilterChange('reference', e.target.value)}
          />
        </div>
      </div>

      {/* Filtros adicionales en segunda fila */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Moneda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <Input
            placeholder="USD, EUR, etc."
            value={filters.currency_code || ''}
            onChange={(e) => handleFilterChange('currency_code', e.target.value)}
          />
        </div>

        {/* Monto mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto mínimo
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.amount_min || ''}
            onChange={(e) => handleFilterChange('amount_min', e.target.value)}
          />
        </div>

        {/* Monto máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto máximo
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.amount_max || ''}
            onChange={(e) => handleFilterChange('amount_max', e.target.value)}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <Input
            placeholder="Buscar en descripción..."
            value={filters.description || ''}
            onChange={(e) => handleFilterChange('description', e.target.value)}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Filtros activos: {Object.keys(filters).filter(key => filters[key as keyof typeof filters] && !['page', 'per_page'].includes(key)).length}
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={clearFilters}
          >
            Limpiar
          </Button>
          <Button
            onClick={applyFilters}
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
