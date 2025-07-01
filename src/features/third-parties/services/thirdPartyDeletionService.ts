import type { DeletionService, DeletionCheckResult } from '../../../components/atomic/types';
import type { ThirdParty } from '../types';
import { ThirdPartyService } from './third-party.service';

/**
 * Service for handling third party deletion operations
 * Implements the generic deletion interface for use with DeleteModal
 */
export class ThirdPartyDeletionService implements DeletionService<ThirdParty> {
  
  async checkDeletable(thirdParties: ThirdParty[]): Promise<DeletionCheckResult<ThirdParty>> {
    try {
      // Llamada al endpoint que verifica si los terceros se pueden eliminar
      const thirdPartyIds = thirdParties.map(tp => tp.id);
      const validationResults = await ThirdPartyService.validateDeletion(thirdPartyIds);
      
      // Separar terceros en eliminables y no eliminables
      const canDelete: ThirdParty[] = [];
      const cannotDelete: ThirdParty[] = [];
      const reasons: Record<string | number, string> = {};

      thirdParties.forEach(thirdParty => {
        const validation = validationResults.find((v: any) => v.third_party_id === thirdParty.id);
        if (validation?.can_delete) {
          canDelete.push(thirdParty);
        } else {
          cannotDelete.push(thirdParty);
          if (validation?.blocking_reasons && validation.blocking_reasons.length > 0) {
            reasons[thirdParty.id] = validation.blocking_reasons.join(', ');
          } else {
            reasons[thirdParty.id] = 'No se puede eliminar este tercero';
          }
        }
      });

      return {
        canDelete,
        cannotDelete,
        reasons,
      };
    } catch (error) {
      console.error('Error al verificar terceros eliminables:', error);
      throw new Error('No se pudo verificar qué terceros se pueden eliminar');
    }
  }

  async deleteItems(thirdParties: ThirdParty[]): Promise<void> {
    try {
      const thirdPartyIds = thirdParties.map(tp => tp.id);
      await ThirdPartyService.bulkDeleteReal(
        thirdPartyIds, 
        false, // forceDelete = false por defecto
        'Eliminación desde interfaz de usuario'
      );
    } catch (error) {
      console.error('Error al eliminar terceros:', error);
      throw new Error('No se pudieron eliminar los terceros seleccionados');
    }
  }
}
