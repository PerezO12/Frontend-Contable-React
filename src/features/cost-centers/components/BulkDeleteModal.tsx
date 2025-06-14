import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks/useToast';
import { CostCenterService } from '../services/costCenterService';
import type { 
  CostCenter, 
  CostCenterDeleteValidation, 
  BulkCostCenterDeleteResult 
} from '../types';

interface BulkDeleteModalProps {
  selectedCostCenters: CostCenter[];
  onClose: () => void;
  onSuccess: (result: BulkCostCenterDeleteResult) => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  selectedCostCenters,
  onClose,
  onSuccess
}) => {
  const [validating, setValidating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validationResults, setValidationResults] = useState<CostCenterDeleteValidation[]>([]);
  const [deleteReason, setDeleteReason] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const { success, error: showError } = useToast();

  // Validar centros de costo al abrir el modal
  useEffect(() => {
    validateCostCenters();
  }, [selectedCostCenters]);

  const validateCostCenters = async () => {
    setValidating(true);
    try {
      const costCenterIds = selectedCostCenters.map(costCenter => costCenter.id);
      const results = await CostCenterService.validateDeletion(costCenterIds);
      setValidationResults(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al validar los centros de costo';
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
      const costCenterIds = selectedCostCenters.map(costCenter => costCenter.id);
      const result = await CostCenterService.bulkDeleteCostCenters({
        cost_center_ids: costCenterIds,
        force_delete: forceDelete,
        delete_reason: deleteReason.trim()
      });

      success(`Eliminación completada: ${result.success_count} exitosas, ${result.failure_count} fallos`);
      onSuccess(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar los centros de costo';
      showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteCostCenters = validationResults.filter(v => v.can_delete);
  const blockedCostCenters = validationResults.filter(v => !v.can_delete);
  const costCentersWithWarnings = validationResults.filter(v => v.can_delete && v.warnings.length > 0);

  if (validating) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div 
          className="w-[448px] max-w-[90vw] transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95"
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            <Spinner size="lg" />
            <h3 className="text-lg font-medium text-gray-900 mt-4">
              Validando eliminación
            </h3>
            <p className="text-gray-600 mt-2">
              Verificando {selectedCostCenters.length} centros de costo seleccionados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-[768px] max-w-[90vw] max-h-[90vh] overflow-hidden">
        <Card>
          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-red-600">
                🗑️ Eliminación Masiva de Centros de Costo
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

          <div className="card-body max-h-[70vh] overflow-y-auto">
            {/* Resumen de validación */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Se pueden eliminar</h4>
                <p className="text-2xl font-bold text-green-600">{canDeleteCostCenters.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900">Con advertencias</h4>
                <p className="text-2xl font-bold text-yellow-600">{costCentersWithWarnings.length}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900">Bloqueados</h4>
                <p className="text-2xl font-bold text-red-600">{blockedCostCenters.length}</p>
              </div>
            </div>

            {/* Detalles de validación */}
            <div className="space-y-4">
              {/* Centros de costo bloqueados */}
              {blockedCostCenters.length > 0 && (
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    ❌ Centros de Costo que NO se pueden eliminar ({blockedCostCenters.length})
                  </h4>
                  <div className="space-y-2">
                    {blockedCostCenters.map((validation) => {
                      const costCenter = selectedCostCenters.find(cc => cc.id === validation.cost_center_id);
                      return (
                        <div key={validation.cost_center_id} className="bg-red-50 p-3 rounded">
                          <div className="font-medium text-red-900">
                            {costCenter?.code} - {costCenter?.name}
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

              {/* Centros de costo con advertencias */}
              {costCentersWithWarnings.length > 0 && (
                <div className="border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-3">
                    ⚠️ Centros de Costo con advertencias ({costCentersWithWarnings.length})
                  </h4>
                  <div className="space-y-2">
                    {costCentersWithWarnings.map((validation) => {
                      const costCenter = selectedCostCenters.find(cc => cc.id === validation.cost_center_id);
                      return (
                        <div key={validation.cost_center_id} className="bg-yellow-50 p-3 rounded">
                          <div className="font-medium text-yellow-900">
                            {costCenter?.code} - {costCenter?.name}
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

              {/* Centros de costo que se pueden eliminar sin problemas */}
              {canDeleteCostCenters.filter(v => v.warnings.length === 0).length > 0 && (
                <div className="border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">
                    ✅ Centros de Costo que se pueden eliminar sin problemas ({canDeleteCostCenters.filter(v => v.warnings.length === 0).length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {canDeleteCostCenters.filter(v => v.warnings.length === 0).map((validation) => {
                      const costCenter = selectedCostCenters.find(cc => cc.id === validation.cost_center_id);
                      return (
                        <div key={validation.cost_center_id} className="bg-green-50 p-2 rounded text-sm">
                          <span className="font-medium text-green-900">
                            {costCenter?.code} - {costCenter?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de eliminación */}
            {canDeleteCostCenters.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Configuración de eliminación</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón para la eliminación *
                    </label>
                    <textarea
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe el motivo de la eliminación (ej: Reorganización de centros de costo del ejercicio 2024)"
                      disabled={deleting}
                    />
                  </div>

                  {costCentersWithWarnings.length > 0 && (
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={forceDelete}
                          onChange={(e) => setForceDelete(e.target.checked)}
                          disabled={deleting}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          Forzar eliminación de centros de costo con advertencias
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card-footer border-t bg-gray-50 flex justify-between">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={deleting}
            >
              Cancelar
            </Button>

            {canDeleteCostCenters.length > 0 && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting || !deleteReason.trim()}
              >
                {deleting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Eliminando...
                  </>
                ) : (
                  `Eliminar ${canDeleteCostCenters.length} centro${canDeleteCostCenters.length === 1 ? '' : 's'} de costo`
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
