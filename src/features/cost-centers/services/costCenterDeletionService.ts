import type { DeletionService, DeletionCheckResult } from '../../../components/atomic/types';
import type { CostCenter } from '../types';
import { CostCenterService } from './costCenterService';

export class CostCenterDeletionService implements DeletionService<CostCenter> {
  
  async checkDeletable(costCenters: CostCenter[]): Promise<DeletionCheckResult<CostCenter>> {
    const canDelete: CostCenter[] = [];
    const cannotDelete: CostCenter[] = [];
    const reasons: Record<string, string> = {};

    for (const costCenter of costCenters) {
      try {
        // Los centros de costo con hijos no se pueden eliminar
        if (costCenter.children_count > 0) {
          cannotDelete.push(costCenter);
          reasons[costCenter.id] = `El centro de costo tiene ${costCenter.children_count} subcentros`;
          continue;
        }

        // Verificar si el centro de costo tiene movimientos contables
        // TODO: Implementar verificación de movimientos cuando el endpoint esté disponible
        
        canDelete.push(costCenter);
      } catch (error) {
        cannotDelete.push(costCenter);
        reasons[costCenter.id] = 'Error al verificar dependencias';
      }
    }

    return {
      canDelete,
      cannotDelete,
      reasons
    };
  }

  async deleteItems(costCenters: CostCenter[]): Promise<void> {
    if (costCenters.length === 0) {
      return;
    }

    try {
      if (costCenters.length === 1) {
        // Eliminar un solo centro de costo
        await CostCenterService.deleteCostCenter(costCenters[0].id);
      } else {
        // Eliminar múltiples centros de costo
        await CostCenterService.bulkDeleteCostCenters({
          cost_center_ids: costCenters.map(cc => cc.id),
          force_delete: false,
          delete_reason: 'Eliminación desde interfaz de usuario'
        });
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar los centros de costo seleccionados'
      );
    }
  }
}

export const costCenterDeletionService = new CostCenterDeletionService();
