/**
 * Lista mejorada de pagos con todas las operaciones bulk implementadas
 * Integra las nuevas funcionalidades de operaciones en lote y acciones individuales
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../stores/paymentStore';
import { useBulkPaymentOperations } from '../hooks/useBulkPaymentOperations';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentFilters } from './PaymentFilters';
import { PaymentImportModal } from './PaymentImportModal';
import { BulkOperationsModal } from './BulkOperationsModal';
import { PaymentActions } from './PaymentActions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import type { Payment, StatusConfig } from '../types';
import { PaymentStatus, PaymentType } from '../types';

// Configuración de estados actualizada según el backend
const statusConfig: Record<PaymentStatus, StatusConfig> = {
  [PaymentStatus.DRAFT]: {
    label: 'Borrador',
    color: 'yellow',
    icon: '📝'
  },
  [PaymentStatus.POSTED]: {
    label: 'Contabilizado',
    color: 'green',
    icon: '✅'
  },
  [PaymentStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'red',
    icon: '❌'
  }
};

// Configuración de tipos de pago (usando solo los disponibles)
const typeConfig: Record<PaymentType, { label: string; color: string }> = {
  [PaymentType.CUSTOMER_PAYMENT]: {
    label: 'Cobro Cliente',
    color: 'blue'
  },
  [PaymentType.SUPPLIER_PAYMENT]: {
    label: 'Pago Proveedor',
    color: 'purple'
  }
};

export function PaymentListEnhanced() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Store y hooks
  const {
    payments,
    selectedPayments,
    loading,
    error,
    pagination,
    fetchPayments,
    togglePaymentSelection,
    selectAllPayments,
    clearPaymentSelection,
    setFilters
  } = usePaymentStore();

  const {
    selectedPaymentCount,
    canConfirm,
    canCancel,
    canDelete,
    canPost,
    canReset,
    getSelectionStats,
    confirmSelectedPayments,
    cancelSelectedPayments,
    deleteSelectedPayments,
    postSelectedPayments,
    resetSelectedPayments
  } = useBulkPaymentOperations();

  // Estados locales
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Cargar pagos al montar el componente
  useEffect(() => {
    fetchPayments();
  }, []);

  // Configuración de columnas para DataTable
  const columns = [
    {
      key: 'number',
      label: 'Número',
      sortable: true,
      render: (payment: Payment) => (
        <button
          onClick={() => navigate(`/payments/${payment.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {payment.number}
        </button>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (payment: Payment) => {
        const config = statusConfig[payment.status];
        return (
          <Badge variant={config.color as any}>
            {config.icon} {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'payment_type',
      label: 'Tipo',
      sortable: true,
      render: (payment: Payment) => {
        const config = typeConfig[payment.payment_type];
        return (
          <Badge variant={config.color as any}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'partner_name',
      label: 'Tercero',
      sortable: true,
      render: (payment: Payment) => payment.partner_name || 'N/A'
    },
    {
      key: 'amount',
      label: 'Monto',
      sortable: true,
      render: (payment: Payment) => formatCurrency(payment.amount, payment.currency_code)
    },
    {
      key: 'payment_date',
      label: 'Fecha',
      sortable: true,
      render: (payment: Payment) => formatDate(payment.payment_date)
    },
    {
      key: 'reference',
      label: 'Referencia',
      sortable: false,
      render: (payment: Payment) => payment.reference || 'N/A'
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (payment: Payment) => (
        <PaymentActions
          payment={payment}
          variant="compact"
          onSuccess={() => fetchPayments()}
        />
      )
    }
  ];

  // Estadísticas de selección
  const stats = selectedPaymentCount > 0 ? getSelectionStats() : null;

  // Renderizar barra de acciones en lote
  const renderBulkActions = () => {
    if (selectedPaymentCount === 0) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedPaymentCount} pagos seleccionados
            </span>
            
            {stats && (
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <span>Total: {formatCurrency(stats.totalAmount)}</span>
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <Badge key={status} variant="subtle">
                    {status}: {count}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBulkModal(true)}
            >
              Operaciones en Lote
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={clearPaymentSelection}
            >
              Limpiar Selección
            </Button>
          </div>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex items-center gap-2 mt-3">
          {canConfirm && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => confirmSelectedPayments()}
            >
              Confirmar ({selectedPaymentCount})
            </Button>
          )}
          
          {canPost && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => postSelectedPayments()}
            >
              Postear ({selectedPaymentCount})
            </Button>
          )}
          
          {canReset && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => resetSelectedPayments()}
            >
              Resetear ({selectedPaymentCount})
            </Button>
          )}
          
          {canCancel && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-orange-600 hover:text-orange-700"
              onClick={() => cancelSelectedPayments()}
            >
              Cancelar ({selectedPaymentCount})
            </Button>
          )}
          
          {canDelete && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => deleteSelectedPayments()}
            >
              Eliminar ({selectedPaymentCount})
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-600 mt-1">
            Administre el flujo completo de pagos y cobros
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
          >
            Importar Extracto
          </Button>
          
          <Button
            onClick={() => navigate('/payments/create')}
          >
            Crear Pago
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-600">Borradores</div>
          <div className="text-2xl font-bold text-yellow-900">
            {payments.filter(p => p.status === PaymentStatus.DRAFT).length}
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600">Contabilizados</div>
          <div className="text-2xl font-bold text-green-900">
            {payments.filter(p => p.status === PaymentStatus.POSTED).length}
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600">Cancelados</div>
          <div className="text-2xl font-bold text-red-900">
            {payments.filter(p => p.status === PaymentStatus.CANCELLED).length}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600">Total</div>
          <div className="text-2xl font-bold text-blue-900">
            {payments.length}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros {showFilters ? '▲' : '▼'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setFilters({ status: PaymentStatus.DRAFT });
              fetchPayments();
            }}
          >
            Solo Borradores
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
              fetchPayments();
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <PaymentFilters />
        </div>
      )}

      {/* Barra de acciones en lote */}
      {renderBulkActions()}

      {/* Tabla de pagos */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          Error: {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos</h3>
          <p className="text-gray-600 mb-6">
            Comience importando un extracto bancario o creando un pago manual
          </p>
          <Button onClick={() => setShowImportModal(true)}>
            Importar Primer Extracto
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === payments.length && payments.length > 0}
                    onChange={() => {
                      if (selectedPayments.length === payments.length) {
                        clearPaymentSelection();
                      } else {
                        selectAllPayments();
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                {columns.slice(0, -1).map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr 
                  key={payment.id}
                  className={`hover:bg-gray-50 ${
                    selectedPayments.includes(payment.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => togglePaymentSelection(payment.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  {columns.slice(0, -1).map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render(payment)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <PaymentActions
                      payment={payment}
                      variant="compact"
                      onSuccess={() => fetchPayments()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Paginación simple */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ page: pagination.page - 1 });
                    fetchPayments();
                  }}
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.pages} 
                  ({pagination.total} total)
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ page: pagination.page + 1 });
                    fetchPayments();
                  }}
                  disabled={pagination.page >= pagination.pages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <PaymentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setShowImportModal(false);
          fetchPayments();
          showToast('Extracto importado exitosamente', 'success');
        }}
      />

      <BulkOperationsModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedPaymentIds={selectedPayments}
      />
    </div>
  );
}
