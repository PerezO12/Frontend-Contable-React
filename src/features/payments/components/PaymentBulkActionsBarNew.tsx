/**
 * Barra de acciones bulk para pagos
 * Ahora utiliza el componente genérico GenericBulkActionsBar
 */
import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { GenericBulkActionsBar, type BulkAction, type OperationConfig } from '@/components/ui/GenericBulkActionsBar';
import { BulkConfirmationModal } from './BulkConfirmationModal';
import { useBulkPaymentOperations } from '../hooks/useBulkPaymentOperations';
import { usePaymentStore } from '../stores/paymentStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  ArrowPathIcon
} from '@/shared/components/icons';

export function PaymentBulkActionsBar() {
  const { clearPaymentSelection, selectedPayments } = usePaymentStore();
  const {
    selectedPaymentCount,
    confirmSelectedPaymentsWithValidation,
    cancelSelectedPayments,
    deleteSelectedPayments,
    resetSelectedPayments,
    getSelectionStats,
    canConfirm,
    canCancel,
    canReset,
    isLoading,
    selectedPaymentData
  } = useBulkPaymentOperations();

  const [showConfirmDialog, setShowConfirmDialog] = React.useState<string | null>(null);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = React.useState(false);

  if (selectedPaymentCount === 0) {
    return null;
  }

  const stats = getSelectionStats();

  // Configurar las acciones rápidas
  const quickActions: BulkAction[] = [
    // Contabilizar (solo para DRAFT)
    ...(canConfirm ? [{
      key: 'confirm',
      label: 'Contabilizar',
      icon: CheckCircleIcon,
      onClick: () => setShowBulkConfirmModal(true),
      disabled: isLoading,
      className: "text-green-600 hover:text-green-700 hover:bg-green-50"
    }] : []),
    
    // Resetear a borrador (para POSTED/CANCELLED)
    ...(canReset ? [{
      key: 'reset',
      label: 'Restablecer a Borrador',
      icon: ArrowPathIcon,
      onClick: () => setShowConfirmDialog('reset'),
      disabled: isLoading,
      className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    }] : []),
    
    // Cancelar (solo para POSTED)
    ...(canCancel ? [{
      key: 'cancel',
      label: 'Cancelar',
      icon: XCircleIcon,
      onClick: () => setShowConfirmDialog('cancel'),
      disabled: isLoading,
      className: "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
    }] : []),
    
    // Exportar
    {
      key: 'export',
      label: 'Exportar',
      icon: ArrowDownTrayIcon,
      onClick: () => {
        // TODO: Implementar exportación
        console.log('Export clicked');
      },
      disabled: isLoading,
      className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    },
    
    // Eliminar
    {
      key: 'delete',
      label: 'Eliminar',
      icon: TrashIcon,
      onClick: () => setShowConfirmDialog('delete'),
      disabled: isLoading,
      className: "text-red-600 hover:text-red-700 hover:bg-red-50"
    }
  ];

  // Configurar operaciones con modal (para las que ya usan ConfirmDialog)
  const operationConfigs: Record<string, OperationConfig> = {
    // No necesitamos operaciones aquí porque usamos ConfirmDialog personalizado
  };

  // Función para renderizar estadísticas
  const renderStats = () => (
    <>
      {stats.byStatus.DRAFT > 0 && (
        <span>
          <Badge color="yellow" variant="subtle" className="text-xs px-1 py-0">
            {stats.byStatus.DRAFT} borrador{stats.byStatus.DRAFT !== 1 ? 's' : ''}
          </Badge>
        </span>
      )}
      {stats.byStatus.POSTED > 0 && (
        <span>
          <Badge color="green" variant="subtle" className="text-xs px-1 py-0">
            {stats.byStatus.POSTED} contabilizado{stats.byStatus.POSTED !== 1 ? 's' : ''}
          </Badge>
        </span>
      )}
      {stats.byStatus.CANCELLED > 0 && (
        <span>
          <Badge color="red" variant="subtle" className="text-xs px-1 py-0">
            {stats.byStatus.CANCELLED} cancelado{stats.byStatus.CANCELLED !== 1 ? 's' : ''}
          </Badge>
        </span>
      )}
    </>
  );

  const executeAction = async () => {
    try {
      switch (showConfirmDialog) {
        case 'cancel':
          await cancelSelectedPayments();
          break;
        case 'delete':
          await deleteSelectedPayments();
          break;
        case 'reset':
          await resetSelectedPayments();
          break;
      }
    } finally {
      setShowConfirmDialog(null);
    }
  };

  return (
    <>
      {/* Usar el componente genérico */}
      <GenericBulkActionsBar
        selectedCount={selectedPaymentCount}
        selectedItems={selectedPaymentData}
        isProcessing={isLoading}
        icon={BanknotesIcon}
        itemTypeName="pago"
        itemTypeNamePlural="pagos"
        quickActions={quickActions}
        renderStats={renderStats}
        operationConfigs={operationConfigs}
        onClearSelection={clearPaymentSelection}
        className="min-w-[600px]"
      />

      {/* Modal de confirmación masiva con validación */}
      <BulkConfirmationModal
        isOpen={showBulkConfirmModal}
        onClose={() => setShowBulkConfirmModal(false)}
        paymentIds={selectedPayments}
        onConfirm={confirmSelectedPaymentsWithValidation}
      />

      {/* Diálogos de confirmación simples */}
      <ConfirmDialog
        open={showConfirmDialog === 'cancel'}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={executeAction}
        title="Cancelar pagos"
        description={`¿Está seguro de que desea cancelar ${selectedPaymentCount} pago(s)? Los pagos cambiarán a estado CANCELADO y no se podrán procesar.`}
        confirmText="Cancelar Pagos"
        confirmButtonClass="bg-orange-600 hover:bg-orange-700"
        loading={isLoading}
      />

      <ConfirmDialog
        open={showConfirmDialog === 'reset'}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={executeAction}
        title="Restablecer pagos a borrador"
        description={`¿Está seguro de que desea restablecer ${selectedPaymentCount} pago(s) a estado BORRADOR? Los pagos podrán ser editados y procesados nuevamente.`}
        confirmText="Restablecer a Borrador"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
        loading={isLoading}
      />

      <ConfirmDialog
        open={showConfirmDialog === 'delete'}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={executeAction}
        title="Eliminar pagos"
        description={`¿Está seguro de que desea eliminar ${selectedPaymentCount} pago(s)? Esta acción es permanente y no se puede deshacer. Solo se pueden eliminar pagos en estado BORRADOR.`}
        confirmText="Eliminar Pagos"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        loading={isLoading}
      />
    </>
  );
}
