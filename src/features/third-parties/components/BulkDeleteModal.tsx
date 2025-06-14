import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Spinner } from '../../../components/ui/Spinner';
import { useBulkDeleteValidation } from '../hooks';
import type { ThirdParty, BulkDeleteResult } from '../types';

interface BulkDeleteModalProps {
  onClose: () => void;
  onSuccess: (result: BulkDeleteResult) => void;
  selectedThirdParties: ThirdParty[];
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  onClose,
  onSuccess,
  selectedThirdParties
}) => {  const [step, setStep] = useState<'validation' | 'confirmation' | 'deleting'>('validation');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  
  const { validationData, validateDeletion, bulkDeleteReal, loading, error } = useBulkDeleteValidation();

  // Validar al cargar el modal
  useEffect(() => {
    const thirdPartyIds = selectedThirdParties.map(tp => tp.id);
    validateDeletion(thirdPartyIds);
  }, [selectedThirdParties, validateDeletion]);
  const handleDelete = async () => {
    if (!confirmDelete) return;

    setStep('deleting');
    const thirdPartyIds = selectedThirdParties.map(tp => tp.id);
    const result = await bulkDeleteReal(thirdPartyIds, forceDelete, deleteReason);
    
    if (result) {
      onSuccess(result);
    }
  };
  // Verificar si hay terceros que no se pueden eliminar
  const cannotDelete = validationData.filter(v => !v.can_delete);
  const canDelete = validationData.filter(v => v.can_delete);  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Eliminar Terceros Masivamente"
      size="lg"
    >      
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
        {/* Contenido principal con scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Estado de carga de validación */}
        {loading && step === 'validation' && (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
            <span className="ml-3 text-gray-600">Validando terceros...</span>
          </div>
        )}

        {/* Mostrar resultados de validación */}
        {!loading && validationData.length > 0 && (
          <>
            {/* Advertencia principal */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Advertencia: Eliminación Permanente
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Está a punto de <strong>eliminar permanentemente</strong> terceros.
                      Esta acción <strong>NO se puede deshacer</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terceros que NO se pueden eliminar */}
            {cannotDelete.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">                <h4 className="text-sm font-medium text-red-800 mb-3">
                  ❌ Terceros que NO se pueden eliminar ({cannotDelete.length})
                </h4>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                  {cannotDelete.map((validation) => {
                    const thirdParty = selectedThirdParties.find(tp => tp.id === validation.third_party_id);
                    return (
                      <div key={validation.third_party_id} className="text-sm text-red-700 mb-2">
                        <span className="font-medium">
                          {thirdParty?.commercial_name || thirdParty?.name}
                        </span>
                        <ul className="ml-4 mt-1">
                          {validation.blocking_reasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Terceros que SÍ se pueden eliminar */}
            {canDelete.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">                <h4 className="text-sm font-medium text-yellow-800 mb-3">
                  ✅ Terceros que se pueden eliminar ({canDelete.length})
                </h4>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                  {canDelete.map((validation) => {
                    const thirdParty = selectedThirdParties.find(tp => tp.id === validation.third_party_id);
                    return (
                      <div key={validation.third_party_id} className="text-sm text-yellow-700 mb-1">
                        <span className="font-medium">
                          {thirdParty?.commercial_name || thirdParty?.name}
                        </span>
                        {validation.warnings.length > 0 && (
                          <ul className="ml-4 mt-1 text-yellow-600">
                            {validation.warnings.map((warning, idx) => (
                              <li key={idx}>⚠️ {warning}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opción de forzar eliminación si hay bloqueados */}
            {cannotDelete.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-orange-800">
                    <strong>Forzar eliminación</strong> de terceros bloqueados (use con extrema precaución)
                  </span>
                </label>
              </div>
            )}

            {/* Campo de razón para eliminación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón para la eliminación (opcional):
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Explique por qué está eliminando estos terceros..."
              />
            </div>            {/* Confirmación con checkbox */}
            {(canDelete.length > 0 || forceDelete) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-red-800">
                      Confirmo que entiendo que esta acción eliminará permanentemente los terceros seleccionados
                    </span>
                    <p className="text-red-700 mt-1">
                      Esta acción <strong>NO se puede deshacer</strong>. Los terceros serán eliminados definitivamente del sistema.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Resumen de la operación */}
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen de la Operación:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Terceros seleccionados: {selectedThirdParties.length}</li>
                <li>• Se pueden eliminar: <span className="text-green-600 font-medium">{canDelete.length}</span></li>
                <li>• No se pueden eliminar: <span className="text-red-600 font-medium">{cannotDelete.length}</span></li>
                <li>• Con advertencias: <span className="text-yellow-600 font-medium">{validationData.filter(v => v.warnings.length > 0).length}</span></li>
                <li>• Tipo de operación: <span className="text-red-600 font-medium">Eliminación Permanente</span></li>
              </ul>
            </div>          </>
        )}
        </div>

        {/* Botones de acción - fijos en la parte inferior */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button            onClick={handleDelete}
            disabled={
              loading || 
              !confirmDelete || 
              (canDelete.length === 0 && !forceDelete) ||
              step === 'deleting'
            }
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
            >
              {step === 'deleting' ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Eliminando...
                </>
              ) : (
                `🗑️ Eliminar ${forceDelete ? selectedThirdParties.length : canDelete.length} Terceros`
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
