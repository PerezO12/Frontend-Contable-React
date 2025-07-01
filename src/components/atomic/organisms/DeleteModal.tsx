import { useState, useEffect } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import type { DeletableItem, DeleteModalProps, DeletionCheckResult } from '../types';

export const DeleteModal = <T extends DeletableItem>({
  isOpen,
  onClose,
  selectedItems,
  deletionService,
  itemDisplayName,
  itemTypeName,
  onSuccess,
  onError,
}: DeleteModalProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<DeletionCheckResult<T> | null>(null);
  const [confirmText, setConfirmText] = useState('');

  // Verificar qué elementos se pueden eliminar cuando se abre el modal
  useEffect(() => {
    if (isOpen && selectedItems.length > 0) {
      checkDeletable();
    }
  }, [isOpen, selectedItems]);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setCheckResult(null);
      setConfirmText('');
      setLoading(false);
      setChecking(false);
    }
  }, [isOpen]);

  const checkDeletable = async () => {
    setChecking(true);
    try {
      const result = await deletionService.checkDeletable(selectedItems);
      setCheckResult(result);
    } catch (error) {
      console.error('Error al verificar elementos eliminables:', error);
      onError?.('Error al verificar qué elementos se pueden eliminar');
    } finally {
      setChecking(false);
    }
  };

  const handleDelete = async () => {
    if (!checkResult || checkResult.canDelete.length === 0) return;

    setLoading(true);
    try {
      await deletionService.deleteItems(checkResult.canDelete);
      onSuccess?.(checkResult.canDelete);
      onClose();
    } catch (error) {
      console.error('Error al eliminar elementos:', error);
      onError?.('Error al eliminar los elementos seleccionados');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = checkResult && checkResult.canDelete.length > 0;
  const requiresConfirmation = canProceed && checkResult.canDelete.length > 1;
  const confirmationText = 'ELIMINAR';
  const isConfirmationValid = !requiresConfirmation || confirmText === confirmationText;

  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
      >
        Cancelar
      </Button>
      
      {canProceed && (
        <Button
          variant="error"
          onClick={handleDelete}
          disabled={loading || !isConfirmationValid}
          loading={loading}
        >
          {loading ? 'Eliminando...' : `Eliminar ${checkResult.canDelete.length} ${itemTypeName}${checkResult.canDelete.length > 1 ? 's' : ''}`}
        </Button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Eliminar ${itemTypeName}${selectedItems.length > 1 ? 's' : ''}`}
      size="fixed"
      footer={footer}
    >
      <div className="space-y-6">
        {checking && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <Typography variant="body1" color="secondary">
                Verificando elementos...
              </Typography>
            </div>
          </div>
        )}

        {checkResult && !checking && (
          <>
            {/* Advertencia principal */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <Typography variant="h6" color="error" weight="semibold">
                    ⚠️ Acción Irreversible
                  </Typography>
                  <Typography variant="body2" color="error" className="mt-1">
                    Esta acción no se puede deshacer. Los elementos eliminados se perderán permanentemente.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Elementos que SÍ se pueden eliminar */}
            {checkResult.canDelete.length > 0 && (
              <div className="space-y-3">
                <Typography variant="h6" weight="semibold" color="success">
                  ✅ Se pueden eliminar ({checkResult.canDelete.length})
                </Typography>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {checkResult.canDelete.map((item) => (
                      <li key={item.id} className="text-sm text-green-800">
                        • {itemDisplayName(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Elementos que NO se pueden eliminar */}
            {checkResult.cannotDelete.length > 0 && (
              <div className="space-y-3">
                <Typography variant="h6" weight="semibold" color="error">
                  ❌ No se pueden eliminar ({checkResult.cannotDelete.length})
                </Typography>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <ul className="space-y-2">
                    {checkResult.cannotDelete.map((item) => (
                      <li key={item.id} className="text-sm">
                        <div className="text-red-800 font-medium">
                          • {itemDisplayName(item)}
                        </div>
                        {checkResult.reasons?.[item.id] && (
                          <div className="text-red-600 ml-4 mt-1">
                            Motivo: {checkResult.reasons[item.id]}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Campo de confirmación para múltiples elementos */}
            {requiresConfirmation && (
              <div className="space-y-3">
                <Typography variant="body1" weight="medium">
                  Para confirmar la eliminación de múltiples elementos, escribe "{confirmationText}" en el campo siguiente:
                </Typography>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Escribe "${confirmationText}" para confirmar`}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  autoComplete="off"
                />
                <Typography variant="body2" color="secondary">
                  Debes escribir exactamente "{confirmationText}" para habilitar el botón de eliminación.
                </Typography>
              </div>
            )}

            {/* Mensaje cuando no hay elementos eliminables */}
            {checkResult.canDelete.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Typography variant="body1" color="warning">
                    No se puede eliminar ninguno de los elementos seleccionados.
                  </Typography>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
