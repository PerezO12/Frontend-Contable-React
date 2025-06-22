import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useBulkProductOperations } from '../hooks';
import type { ProductDeletionValidation } from '../types';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  onSuccess: () => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  isOpen,
  onClose,
  productIds,
  onSuccess
}) => {
  const [validations, setValidations] = useState<ProductDeletionValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const { 
    bulkDelete, 
    bulkDeactivate, 
    validateDeletion 
  } = useBulkProductOperations();
  useEffect(() => {
    if (isOpen && productIds.length > 0) {
      performValidation();
    } else if (!isOpen) {
      // Limpiar estado cuando se cierre el modal
      setValidations([]);
      setLoading(false);
      setValidationLoading(false);
      setShowAlternatives(false);
    }
  }, [isOpen, productIds]);

  const performValidation = async () => {
    setValidationLoading(true);
    try {
      const validationResults = await validateDeletion(productIds);
      setValidations(validationResults);
        // Si hay productos que no se pueden eliminar, mostrar alternativas
      const hasBlockedProducts = validationResults.some((v: ProductDeletionValidation) => !v.can_delete);
      setShowAlternatives(hasBlockedProducts);
    } catch (error) {
      console.error('Error al validar eliminación:', error);
    } finally {
      setValidationLoading(false);
    }
  };
  const handleConfirmDelete = async () => {
    const deletableIds = validations
      .filter((v: ProductDeletionValidation) => v.can_delete)
      .map((v: ProductDeletionValidation) => v.product_id);

    if (deletableIds.length === 0) {
      return;
    }    setLoading(true);
    try {
      await bulkDelete(deletableIds);
      // Llamar onSuccess primero para refrescar los datos
      onSuccess();
      // Luego cerrar el modal
      onClose();
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      // En caso de error, no cerrar el modal para que el usuario vea el error
      alert('Error al eliminar los productos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {    setLoading(true);
    try {
      await bulkDeactivate(productIds);
      // Llamar onSuccess primero para refrescar los datos
      onSuccess();
      // Luego cerrar el modal
      onClose();
    } catch (error) {
      console.error('Error en desactivación masiva:', error);
      alert('Error al desactivar los productos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  const deletableCount = validations.filter((v: ProductDeletionValidation) => v.can_delete).length;
  const blockedCount = validations.filter((v: ProductDeletionValidation) => !v.can_delete).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar productos seleccionados"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Has seleccionado {productIds.length} producto(s) para eliminar.
        </p>

        {validationLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-sm text-gray-600">Validando eliminación...</span>
          </div>
        )}

        {!validationLoading && validations.length > 0 && (
          <div className="space-y-4">
            {deletableCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-green-800">
                  Productos que se pueden eliminar: {deletableCount}
                </h4>                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  {validations
                    .filter((v: ProductDeletionValidation) => v.can_delete)
                    .map((v: ProductDeletionValidation) => (
                      <li key={v.product_id}>• {v.product_name}</li>
                    ))}
                </ul>
              </div>
            )}

            {blockedCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-red-800">
                  Productos que NO se pueden eliminar: {blockedCount}
                </h4>                <div className="mt-2 space-y-2">
                  {validations
                    .filter((v: ProductDeletionValidation) => !v.can_delete)
                    .map((v: ProductDeletionValidation) => (
                      <div key={v.product_id} className="text-sm text-red-700">
                        <div className="font-medium">• {v.product_name}</div>
                        <div className="ml-4 text-xs">
                          Razones: {v.blocking_reasons.join(', ')}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {showAlternatives && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800">
                  Alternativas disponibles
                </h4>
                <p className="mt-2 text-sm text-blue-700">
                  Como algunos productos no se pueden eliminar, puedes optar por:
                </p>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                  <li>Desactivar todos los productos seleccionados (recomendado)</li>
                  <li>Eliminar solo los productos que se pueden eliminar</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading || validationLoading}
          >
            Cancelar
          </Button>

          {showAlternatives && (
            <Button
              variant="warning"
              onClick={handleBulkDeactivate}
              disabled={loading || validationLoading}
            >
              {loading ? 'Desactivando...' : 'Desactivar todos'}
            </Button>
          )}

          {deletableCount > 0 && (
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={loading || validationLoading}
            >
              {loading ? 'Eliminando...' : `Eliminar ${deletableCount > 0 ? deletableCount : ''} producto(s)`}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
