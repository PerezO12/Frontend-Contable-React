/**
 * Barra de acciones bulk para pagos
 * Permite confirmar, cancelar y eliminar múltiples pagos
 * Diseño flotante idéntico a facturas
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useBulkPaymentOperations } from '../hooks/useBulkPaymentOperations';
import { usePaymentStore } from '../stores/paymentStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  BanknotesIcon
} from '@/shared/components/icons';

export function PaymentBulkActionsBar() {
  const { clearPaymentSelection } = usePaymentStore();
  const {
    selectedPaymentCount,
    confirmSelectedPayments,
    cancelSelectedPayments,
    deleteSelectedPayments,
    getSelectionStats,
    canConfirm,
    canCancel,
    isLoading
  } = useBulkPaymentOperations();

  const [showConfirmDialog, setShowConfirmDialog] = React.useState<string | null>(null);

  if (selectedPaymentCount === 0) {
    return null;
  }

  const stats = getSelectionStats();

  const handleConfirmPayments = () => {
    setShowConfirmDialog('confirm');
  };

  const handleCancelPayments = () => {
    setShowConfirmDialog('cancel');
  };

  const handleDeletePayments = () => {
    setShowConfirmDialog('delete');
  };

  const handleExport = () => {
    // TODO: Implementar exportación
    console.log('Export clicked');
  };

  const executeAction = async () => {
    try {
      switch (showConfirmDialog) {
        case 'confirm':
          await confirmSelectedPayments();
          break;
        case 'cancel':
          await cancelSelectedPayments();
          break;
        case 'delete':
          await deleteSelectedPayments();
          break;
      }
    } finally {
      setShowConfirmDialog(null);
    }
  };

  return (
    <>
      {/* Barra flotante de acciones - IDÉNTICA A FACTURAS */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-4 min-w-[600px]">
          {/* Información de selección */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <BanknotesIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedPaymentCount} pago{selectedPaymentCount !== 1 ? 's' : ''} seleccionado{selectedPaymentCount !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
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
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Acciones de cambio de estado */}
          <div className="flex items-center space-x-2">
            {/* Contabilizar pagos (solo disponible para DRAFT) */}
            {canConfirm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConfirmPayments}
                disabled={isLoading}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Contabilizar
              </Button>
            )}

            {/* Cancelar pagos (solo disponible para POSTED) */}
            {canCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPayments}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircleIcon className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            )}
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Acciones generales */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Exportar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeletePayments}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Eliminar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearPaymentSelection}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogos de confirmación */}
      <ConfirmDialog
        open={showConfirmDialog === 'confirm'}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={executeAction}
        title="Confirmar pagos"
        description={`¿Está seguro de que desea confirmar ${selectedPaymentCount} pago(s)? Los pagos cambiarán de BORRADOR a CONFIRMADO y se generarán asientos contables automáticamente. Esta acción no se puede deshacer.`}
        confirmText="Confirmar Pagos"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
        loading={isLoading}
      />

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
