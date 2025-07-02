/**
 * Página de detalles de un pago específico
 * Muestra toda la información del pago en una página dedicada
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';
import { PaymentDetail } from '../components';
import { usePayment, useDeletePayment } from '../hooks';

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { payment, loading, error } = usePayment(id);
  const { deletePayment, loading: deleteLoading, error: deleteError } = useDeletePayment();

  const handleEdit = () => {
    // TODO: Implementar navegación a edición cuando esté disponible
    console.log('Editar pago:', id);
    // navigate(`/payments/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    const success = await deletePayment(id);
    if (success) {
      navigate('/payments/list');
    }
  };

  const handleBackToList = () => {
    navigate('/payments/list');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar la información del pago'}
            </p>
            <Button onClick={handleBackToList}>
              Volver a la lista
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToList}
          className="mb-4"
        >
          ← Volver a Pagos
        </Button>
      </div>

      {deleteError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{deleteError}</p>
        </div>
      )}

      <PaymentDetail
        payment={payment}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={deleteLoading}
      />

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="p-6 space-y-6">
          {/* Icono de advertencia */}
          <div className="flex justify-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              ¿Está seguro de que desea eliminar este pago? Esta acción no se puede deshacer.
            </p>
            <p className="text-sm font-medium text-gray-900">
              {payment.reference || 'Sin referencia'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline"
              className="flex-1"
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
