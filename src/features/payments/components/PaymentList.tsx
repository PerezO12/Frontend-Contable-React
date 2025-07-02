/**
 * Lista principal de pagos con DataTable
 * Implementa el flujo completo de gestión de pagos
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../stores/paymentStore';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { PaymentBulkActionsBar } from './PaymentBulkActionsBar';
import { PaymentFilters } from './PaymentFilters';
import { PaymentImportModal } from './PaymentImportModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import type { Payment, StatusConfig } from '../types';
import { PaymentStatus, PaymentType } from '../types';
import {
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon
} from '@/shared/components/icons';

// Configuración de estados con colores y iconos
const statusConfig: Record<PaymentStatus, StatusConfig> = {
  [PaymentStatus.DRAFT]: {
    label: 'Borrador',
    color: 'gray',
    icon: ExclamationCircleIcon
  },
  [PaymentStatus.PENDING]: {
    label: 'Pendiente',
    color: 'yellow',
    icon: ExclamationCircleIcon
  },
  [PaymentStatus.CONFIRMED]: {
    label: 'Confirmado',
    color: 'blue',
    icon: CheckCircleIcon
  },
  [PaymentStatus.POSTED]: {
    label: 'Contabilizado',
    color: 'green',
    icon: CheckCircleIcon
  },
  [PaymentStatus.RECONCILED]: {
    label: 'Conciliado',
    color: 'green',
    icon: CheckCircleIcon
  },
  [PaymentStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'red',
    icon: XCircleIcon
  }
};

const typeConfig: Record<PaymentType, StatusConfig> = {
  [PaymentType.CUSTOMER_PAYMENT]: {
    label: 'Pago Cliente',
    color: 'green'
  },
  [PaymentType.SUPPLIER_PAYMENT]: {
    label: 'Pago Proveedor',
    color: 'blue'
  },
  [PaymentType.INTERNAL_TRANSFER]: {
    label: 'Transferencia',
    color: 'purple'
  },
  [PaymentType.ADVANCE_PAYMENT]: {
    label: 'Anticipo',
    color: 'orange'
  },
  [PaymentType.REFUND]: {
    label: 'Reembolso',
    color: 'red'
  }
};

export function PaymentList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const {
    payments,
    loading,
    error,
    pagination,
    selectedPayments,
    fetchPayments,
    confirmPayment,
    cancelPayment,
    deletePayment,
    setFilters,
    selectAllPayments,
    clearPaymentSelection
  } = usePaymentStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Cargar pagos al montar el componente
  useEffect(() => {
    fetchPayments();
  }, []);

  // Manejar confirmación individual
  const handleConfirmPayment = async (paymentId: string) => {
    try {
      await confirmPayment(paymentId);
      showToast('Pago confirmado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al confirmar pago', 'error');
    }
  };

  // Manejar cancelación individual
  const handleCancelPayment = async (paymentId: string) => {
    try {
      await cancelPayment(paymentId);
      showToast('Pago cancelado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al cancelar pago', 'error');
    }
  };

  // Manejar eliminación individual
  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      showToast('Pago eliminado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar pago', 'error');
    }
  };

  // Renderizar columnas de la tabla
  const renderColumns = () => (
    <tr className="bg-gray-50">
      <th className="w-12 px-6 py-3 text-left">
        <input
          type="checkbox"
          checked={selectedPayments.length === payments.length && payments.length > 0}
          onChange={() => selectedPayments.length === payments.length ? clearPaymentSelection() : selectAllPayments()}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Fecha
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Referencia
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Partner
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Tipo
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Monto
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Estado
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Descripción
      </th>
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        Acciones
      </th>
    </tr>
  );

  // Renderizar fila de la tabla
  const renderRow = (payment: Payment, isSelected: boolean, onSelect: (id: string) => void) => (
    <tr 
      key={payment.id} 
      className={`${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 border-b border-gray-200`}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(payment.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatDate(payment.payment_date)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
        {payment.reference || '-'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {payment.partner_name || '-'}
      </td>
      <td className="px-6 py-4">
        <Badge color={typeConfig[payment.payment_type].color}>
          {typeConfig[payment.payment_type].label}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
        {formatCurrency(payment.amount, payment.currency_code)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Badge color={statusConfig[payment.status].color}>
            {statusConfig[payment.status].label}
          </Badge>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {payment.description || '-'}
      </td>
      <td className="px-6 py-4 text-right text-sm space-x-2">
        {/* Ver detalle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/payments/${payment.id}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>

        {/* Confirmar (solo DRAFT) */}
        {payment.status === PaymentStatus.DRAFT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleConfirmPayment(payment.id)}
            className="text-green-600 hover:text-green-900"
            title="Confirmar pago"
          >
            <CheckCircleIcon className="h-4 w-4" />
          </Button>
        )}

        {/* Cancelar (no CANCELLED) */}
        {payment.status !== PaymentStatus.CANCELLED && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelPayment(payment.id)}
            className="text-orange-600 hover:text-orange-900"
            title="Cancelar pago"
          >
            <XCircleIcon className="h-4 w-4" />
          </Button>
        )}

        {/* Eliminar (solo DRAFT) */}
        {payment.status === PaymentStatus.DRAFT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePayment(payment.id)}
            className="text-red-600 hover:text-red-900"
            title="Eliminar pago"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setFilters({ page });
    fetchPayments();
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (per_page: number) => {
    setFilters({ page: 1, per_page });
    fetchPayments();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({ page: 1, per_page: 20 });
    fetchPayments();
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error al cargar pagos</div>
        <div className="text-gray-500 text-sm">{error}</div>
        <Button
          onClick={() => fetchPayments()}
          className="mt-4"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de acciones bulk */}
      <PaymentBulkActionsBar />

      {/* DataTable con todos los datos */}
      <DataTable
        title="Gestión de Pagos"
        description="Administre el flujo completo de pagos: importación, confirmación y reconciliación"
        data={payments}
        renderColumns={renderColumns}
        renderRow={renderRow}
        pagination={{
          ...pagination,
          perPage: pagination.per_page
        }}
        filters={{}} // Filtros manejados por el store
        onFilterChange={() => {}} // No usado, manejado por componente separado
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onClearFilters={handleClearFilters}
        getItemId={(payment) => payment.id}
        
        // Acciones principales
        primaryAction={{
          label: 'Importar Pagos',
          onClick: () => setShowImportModal(true),
          icon: <PlusIcon className="h-5 w-5" />
        }}
        
        additionalActions={[
          <Button
            key="drafts"
            variant="outline"
            onClick={() => {
              setFilters({ status: PaymentStatus.DRAFT });
              fetchPayments();
            }}
            className="flex items-center space-x-2"
          >
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>Solo Borradores</span>
          </Button>,
          <Button
            key="create"
            variant="outline"
            onClick={() => navigate('/payments/create')}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Crear Pago</span>
          </Button>
        ]}
        
        // Filtros
        filterContent={showFilters ? <PaymentFilters /> : null}
        filterActions={
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <span>Filtros</span>
          </Button>
        }
        
        // Configuración de selección
        showSelection={true}
        onSelectionChange={(_selectedIds) => {
          // La selección ya está manejada por el store
        }}
        
        // Estado de carga
        loading={loading}
        error={error || undefined}
        
        // Estado vacío
        emptyStateProps={{
          title: 'No hay pagos',
          description: 'Comience importando un extracto bancario o creando un pago manual',
          action: (
            <Button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Importar Primer Extracto</span>
            </Button>
          )
        }}
      />

      {/* Modal de importación */}
      <PaymentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setShowImportModal(false);
          fetchPayments(); // Recargar datos
        }}
      />
    </div>
  );
}
