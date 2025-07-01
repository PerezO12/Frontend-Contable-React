import type { DeletionService, DeletionCheckResult } from '../../../components/atomic/types';
import type { Account } from '../types';
import { AccountService } from './accountService';

/**
 * Service for handling account deletion operations
 * Implements the generic deletion interface for use with DeleteModal
 */
export class AccountDeletionService implements DeletionService<Account> {
  
  async checkDeletable(accounts: Account[]): Promise<DeletionCheckResult<Account>> {
    try {
      // Llamada al endpoint que verifica si las cuentas se pueden eliminar
      const accountIds = accounts.map(account => account.id);
      const validationResults = await AccountService.validateDeletion(accountIds);
      
      // Separar cuentas en eliminables y no eliminables
      const canDelete: Account[] = [];
      const cannotDelete: Account[] = [];
      const reasons: Record<string | number, string> = {};

      accounts.forEach(account => {
        const validation = validationResults.find((v: any) => v.account_id === account.id);
        if (validation?.can_delete) {
          canDelete.push(account);
        } else {
          cannotDelete.push(account);
          if (validation?.blocking_reasons && validation.blocking_reasons.length > 0) {
            reasons[account.id] = validation.blocking_reasons.join(', ');
          } else {
            reasons[account.id] = 'No se puede eliminar esta cuenta';
          }
        }
      });

      return {
        canDelete,
        cannotDelete,
        reasons,
      };
    } catch (error) {
      console.error('Error al verificar cuentas eliminables:', error);
      throw new Error('No se pudo verificar qué cuentas se pueden eliminar');
    }
  }

  async deleteItems(accounts: Account[]): Promise<void> {
    try {
      const accountIds = accounts.map(account => account.id);
      await AccountService.bulkDeleteAccounts({
        account_ids: accountIds,
        force_delete: false,
        delete_reason: 'Eliminación desde interfaz de usuario'
      });
    } catch (error) {
      console.error('Error al eliminar cuentas:', error);
      throw new Error('No se pudieron eliminar las cuentas seleccionadas');
    }
  }
}
