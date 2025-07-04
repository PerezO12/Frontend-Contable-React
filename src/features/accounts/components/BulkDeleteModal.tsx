import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks/useToast';
import { AccountService } from '../services/accountService';
import type { 
  Account, 
  AccountDeleteValidation, 
  BulkAccountDeleteResult 
} from '../types';

interface BulkDeleteModalProps {
  selectedAccounts: Account[];
  onClose: () => void;
  onSuccess: (result: BulkAccountDeleteResult) => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  selectedAccounts,
  onClose,
  onSuccess
}) => {  const [validating, setValidating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validationResults, setValidationResults] = useState<AccountDeleteValidation[]>([]);
  const [deleteReason, setDeleteReason] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const { success, error: showError } = useToast();

  // Validar cuentas al abrir el modal
  useEffect(() => {
    validateAccounts();
  }, [selectedAccounts]);
  const validateAccounts = async () => {
    setValidating(true);
    try {
      const accountIds = selectedAccounts.map(account => account.id);
      const results = await AccountService.validateDeletion(accountIds);
      setValidationResults(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al validar las cuentas';
      showError(errorMessage);
      onClose();
    } finally {
      setValidating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      showError('Por favor ingresa una razón para la eliminación');
      return;
    }

    setDeleting(true);
    try {
      const accountIds = selectedAccounts.map(account => account.id);
      const result = await AccountService.bulkDeleteAccounts({
        account_ids: accountIds,
        force_delete: forceDelete,
        delete_reason: deleteReason.trim()
      });

      success(`Eliminación completada: ${result.success_count} exitosas, ${result.failure_count} fallos`);
      onSuccess(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar las cuentas';
      showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteAccounts = validationResults.filter(v => v.can_delete);
  const blockedAccounts = validationResults.filter(v => !v.can_delete);
  const accountsWithWarnings = validationResults.filter(v => v.can_delete && v.warnings.length > 0);  if (validating) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-96 max-w-[90vw] transform transition-all duration-300 ease-out">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8 text-center">
            <div className="flex justify-center mb-4">
              <Spinner size="lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Validando eliminación
            </h3>
            <p className="text-gray-600">
              Verificando {selectedAccounts.length} cuenta{selectedAccounts.length !== 1 ? 's' : ''} seleccionada{selectedAccounts.length !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </div>
    );
  }  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <Card>
          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-red-600">
                🗑️ Eliminación Masiva de Cuentas
              </h3>              
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
          </div>

          <div className="card-body max-h-[70vh] overflow-y-auto">            {/* Resumen de validación */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-green-900 text-sm">Se pueden eliminar</h4>
                <p className="text-2xl font-bold text-green-600 mt-1">{canDeleteAccounts.length}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-amber-900 text-sm">Con advertencias</h4>
                <p className="text-2xl font-bold text-amber-600 mt-1">{accountsWithWarnings.length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-red-900 text-sm">Bloqueadas</h4>
                <p className="text-2xl font-bold text-red-600 mt-1">{blockedAccounts.length}</p>
              </div>
            </div>

            {/* Detalles de validación */}
            <div className="space-y-4">
              {/* Cuentas bloqueadas */}
              {blockedAccounts.length > 0 && (
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    ❌ Cuentas que NO se pueden eliminar ({blockedAccounts.length})
                  </h4>
                  <div className="space-y-2">
                    {blockedAccounts.map((validation) => {
                      const account = selectedAccounts.find(a => a.id === validation.account_id);
                      return (
                        <div key={validation.account_id} className="bg-red-50 p-3 rounded">
                          <div className="font-medium text-red-900">
                            {account?.code} - {account?.name}
                          </div>
                          <ul className="text-sm text-red-700 mt-1">
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

              {/* Cuentas con advertencias */}
              {accountsWithWarnings.length > 0 && (
                <div className="border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-3">
                    ⚠️ Cuentas con advertencias ({accountsWithWarnings.length})
                  </h4>
                  <div className="space-y-2">
                    {accountsWithWarnings.map((validation) => {
                      const account = selectedAccounts.find(a => a.id === validation.account_id);
                      return (
                        <div key={validation.account_id} className="bg-yellow-50 p-3 rounded">
                          <div className="font-medium text-yellow-900">
                            {account?.code} - {account?.name}
                          </div>
                          <ul className="text-sm text-yellow-700 mt-1">
                            {validation.warnings.map((warning, idx) => (
                              <li key={idx}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cuentas que se pueden eliminar sin problemas */}
              {canDeleteAccounts.filter(v => v.warnings.length === 0).length > 0 && (
                <div className="border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">
                    ✅ Cuentas que se pueden eliminar sin problemas ({canDeleteAccounts.filter(v => v.warnings.length === 0).length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {canDeleteAccounts.filter(v => v.warnings.length === 0).map((validation) => {
                      const account = selectedAccounts.find(a => a.id === validation.account_id);
                      return (
                        <div key={validation.account_id} className="bg-green-50 p-2 rounded text-sm">
                          <span className="font-medium text-green-900">
                            {account?.code} - {account?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de eliminación */}
            {canDeleteAccounts.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">⚙️ Configuración de eliminación</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón para la eliminación <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe el motivo de la eliminación (ej: Limpieza de cuentas obsoletas del ejercicio 2024)"
                      disabled={deleting}
                    />
                  </div>

                  {accountsWithWarnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={forceDelete}
                          onChange={(e) => setForceDelete(e.target.checked)}
                          disabled={deleting}
                          className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-amber-900">
                            Forzar eliminación de cuentas con advertencias
                          </span>
                          <p className="text-xs text-amber-700 mt-1">
                            Permite eliminar cuentas con advertencias pero sin errores críticos.
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card-footer border-t bg-gray-50 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={deleting}
              className="px-6"
            >
              Cancelar
            </Button>

            {canDeleteAccounts.length > 0 && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting || !deleteReason.trim()}
                className="px-6 min-w-[140px]"
              >
                {deleting ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>Eliminando...</span>
                  </div>
                ) : (
                  `Eliminar ${canDeleteAccounts.length} cuenta${canDeleteAccounts.length === 1 ? '' : 's'}`
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
