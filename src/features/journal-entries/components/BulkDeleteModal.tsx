import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import type { 
  JournalEntryDeleteValidation, 
  BulkJournalEntryDelete, 
  BulkJournalEntryDeleteResult,
  JournalEntryStatus 
} from '../types';
import { JOURNAL_ENTRY_STATUS_LABELS } from '../types';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntryIds: string[];
  onValidate: (entryIds: string[]) => Promise<JournalEntryDeleteValidation[]>;
  onBulkDelete: (deleteData: BulkJournalEntryDelete) => Promise<BulkJournalEntryDeleteResult>;
  onSuccess?: (result: BulkJournalEntryDeleteResult) => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  isOpen,
  onClose,
  selectedEntryIds,
  onValidate,
  onBulkDelete,
  onSuccess
}) => {  const [validationResults, setValidationResults] = useState<JournalEntryDeleteValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [deleteResult, setDeleteResult] = useState<BulkJournalEntryDeleteResult | null>(null);
  const [hasValidated, setHasValidated] = useState(false); // Para prevenir re-validaciones  // Validar automáticamente cuando se abre el modal
  const handleValidation = useCallback(async () => {
    if (validating) return; // Prevenir múltiples llamadas simultáneas
    
    setValidating(true);
    setError(null);
    try {
      const results = await onValidate(selectedEntryIds);
      setValidationResults(results);
      setHasValidated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar asientos');
    } finally {
      setValidating(false);
    }
  }, [onValidate, selectedEntryIds, validating]);

  // Handler para revalidación manual
  const handleManualValidation = () => {
    setHasValidated(false);
    setValidationResults([]);
    handleValidation();
  };

  useEffect(() => {
    if (isOpen && selectedEntryIds.length > 0 && !validating && !hasValidated) {
      handleValidation();
    }
  }, [isOpen, selectedEntryIds.length, handleValidation, validating, hasValidated]); // Dependencias completas

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('La razón de eliminación es requerida');
      return;
    }

    setLoading(true);
    setError(null);    
    try {
      const result = await onBulkDelete({
        entry_ids: selectedEntryIds, // Volvemos a entry_ids según la documentación oficial
        force_delete: forceDelete,
        reason: deleteReason.trim()
      });
      
      setDeleteResult(result);
      setShowResults(true);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar asientos');
    } finally {
      setLoading(false);
    }
  };  const handleClose = () => {
    // Limpiar todo el estado del modal
    setValidationResults([]);
    setDeleteReason('');
    setForceDelete(false);
    setError(null);
    setShowResults(false);
    setDeleteResult(null);
    setValidating(false);
    setLoading(false);
    setHasValidated(false);
    onClose();
  };

  // No mostrar el modal si no está abierto
  if (!isOpen) {
    return null;
  }

  // Categorizar resultados de validación
  const canDelete = validationResults.filter(result => result.can_delete);
  const cannotDelete = validationResults.filter(result => !result.can_delete);
  const hasWarnings = validationResults.filter(result => result.warnings.length > 0);

  if (showResults && deleteResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <Card>
            <div className="card-header border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Resultado de Eliminación Masiva</h2>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="card-body max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Resumen */}
                <Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">Resumen de la Operación</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{deleteResult.total_requested}</div>
                        <div className="text-sm text-gray-600">Solicitados</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{deleteResult.total_deleted}</div>
                        <div className="text-sm text-gray-600">Eliminados</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{deleteResult.total_failed}</div>
                        <div className="text-sm text-gray-600">Fallidos</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Asientos eliminados exitosamente */}
                {deleteResult.deleted_entries.length > 0 && (
                  <Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-green-600 mb-4">
                        ✅ Asientos Eliminados ({deleteResult.deleted_entries.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {deleteResult.deleted_entries.map((entry) => (
                          <div key={entry.journal_entry_id} className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium">{entry.journal_entry_number}</div>
                            <div className="text-sm text-gray-600">{entry.journal_entry_description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Asientos que fallaron */}
                {deleteResult.failed_entries.length > 0 && (
                  <Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">
                        ❌ Asientos No Eliminados ({deleteResult.failed_entries.length})
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {deleteResult.failed_entries.map((entry) => (
                          <div key={entry.journal_entry_id} className="p-3 bg-red-50 rounded-lg">
                            <div className="font-medium">{entry.journal_entry_number}</div>
                            <div className="text-sm text-gray-600 mb-2">{entry.journal_entry_description}</div>
                            {entry.errors.map((error, index) => (
                              <div key={index} className="text-sm text-red-600">• {error}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Advertencias globales */}
                {deleteResult.warnings.length > 0 && (
                  <Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-yellow-600 mb-4">⚠️ Advertencias</h3>
                      <div className="space-y-2">
                        {deleteResult.warnings.map((warning, index) => (
                          <div key={index} className="p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg">
          <div className="card-body text-center py-8">
            <Spinner size="lg" />
            <h3 className="text-lg font-medium text-gray-900 mt-4">
              Validando asientos contables
            </h3>
            <p className="text-gray-600 mt-2">
              Verificando {selectedEntryIds.length} asientos seleccionados...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card>
          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Eliminar {selectedEntryIds.length} Asientos Contables</h2>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="card-body max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {error && (
                <ValidationMessage type="error" message={error} />
              )}

              {/* Resumen de validación */}
              <Card>
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-4">Resumen de Validación</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{canDelete.length}</div>
                      <div className="text-sm text-gray-600">Pueden eliminarse</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{cannotDelete.length}</div>
                      <div className="text-sm text-gray-600">No pueden eliminarse</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{hasWarnings.length}</div>
                      <div className="text-sm text-gray-600">Con advertencias</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Asientos que pueden eliminarse */}
              {canDelete.length > 0 && (
                <Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-green-600 mb-4">
                      ✅ Pueden Eliminarse ({canDelete.length})
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {canDelete.map((entry) => (
                        <div key={entry.journal_entry_id} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{entry.journal_entry_number}</div>
                              <div className="text-sm text-gray-600">{entry.journal_entry_description}</div>
                              <div className="text-xs text-gray-500">
                                Estado: {JOURNAL_ENTRY_STATUS_LABELS[entry.status as JournalEntryStatus]}
                              </div>
                            </div>
                          </div>
                          {entry.warnings.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {entry.warnings.map((warning, index) => (
                                <div key={index} className="text-xs text-yellow-600">⚠️ {warning}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Asientos que NO pueden eliminarse */}
              {cannotDelete.length > 0 && (
                <Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">
                      ❌ No Pueden Eliminarse ({cannotDelete.length})
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cannotDelete.map((entry) => (
                        <div key={entry.journal_entry_id} className="p-3 bg-red-50 rounded-lg">
                          <div className="font-medium">{entry.journal_entry_number}</div>
                          <div className="text-sm text-gray-600 mb-2">{entry.journal_entry_description}</div>
                          <div className="text-xs text-gray-500 mb-2">
                            Estado: {JOURNAL_ENTRY_STATUS_LABELS[entry.status as JournalEntryStatus]}
                          </div>
                          {entry.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-600">• {error}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Formulario de eliminación */}
              {canDelete.length > 0 && (
                <Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Razón de la eliminación *
                        </label>
                        <textarea
                          value={deleteReason}
                          onChange={(e) => setDeleteReason(e.target.value)}
                          placeholder="Describa el motivo de la eliminación (requerido para auditoría)"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          disabled={loading}
                        />
                      </div>

                      {hasWarnings.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="forceDelete"
                            checked={forceDelete}
                            onChange={(e) => setForceDelete(e.target.checked)}
                            disabled={loading}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="forceDelete" className="text-sm text-gray-700">
                            Forzar eliminación a pesar de las advertencias
                          </label>
                        </div>
                      )}

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <span className="text-yellow-600">⚠️</span>
                          <div className="text-sm text-yellow-800">
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. 
                            Se eliminarán {canDelete.length} asientos contables de forma permanente.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="card-footer border-t bg-gray-50">
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <div className="space-x-3">                <Button
                  variant="secondary"
                  onClick={handleManualValidation}
                  disabled={loading || validating}
                >
                  🔄 Revalidar
                </Button>
                
                {canDelete.length > 0 && (
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={loading || !deleteReason.trim() || (hasWarnings.length > 0 && !forceDelete)}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="ml-2">Eliminando...</span>
                      </>
                    ) : (
                      `🗑️ Eliminar ${canDelete.length} Asientos`
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
