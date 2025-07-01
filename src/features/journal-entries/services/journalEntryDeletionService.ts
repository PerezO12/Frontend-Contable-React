import { JournalEntryService } from './journalEntryService';

/**
 * Servicio para operaciones de eliminación de asientos contables
 * Proporciona métodos para eliminar asientos individuales y en lote
 */
export class JournalEntryDeletionService {
  /**
   * Eliminar un asiento contable individual
   */
  static async deleteJournalEntry(id: string): Promise<void> {
    try {
      console.log('Eliminando asiento contable:', id);
      await JournalEntryService.deleteJournalEntry(id);
      console.log('Asiento contable eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar asiento contable:', error);
      throw error;
    }
  }

  /**
   * Eliminar múltiples asientos contables
   */
  static async bulkDelete(ids: string[]): Promise<{
    successful: number;
    failed: number;
    errors: any[];
  }> {
    try {
      console.log('Eliminando asientos contables masivamente:', ids);
      
      const operation = {
        journal_entry_ids: ids
      };
      
      const result = await JournalEntryService.bulkDeleteJournalEntries(operation);
      
      console.log('Resultado de eliminación masiva:', result);
      
      return {
        successful: result.total_processed - result.total_failed,
        failed: result.total_failed,
        errors: result.warnings || []
      };
    } catch (error) {
      console.error('Error en eliminación masiva de asientos contables:', error);
      throw error;
    }
  }

  /**
   * Validar si asientos contables pueden ser eliminados
   */
  static async validateDeletion(ids: string[]): Promise<{
    canDelete: boolean;
    warnings: string[];
    blockers: string[];
  }> {
    try {
      console.log('Validando eliminación de asientos contables:', ids);
      
      const validation = await JournalEntryService.validateBulkDelete({
        journal_entry_ids: ids
      });
      
      const result = {
        canDelete: validation.every(v => v.can_delete),
        warnings: validation.flatMap(v => v.warnings || []),
        blockers: validation
          .filter(v => !v.can_delete)
          .flatMap(v => v.errors || [])
      };
      
      console.log('Resultado de validación:', result);
      return result;
    } catch (error) {
      console.error('Error al validar eliminación:', error);
      // En caso de error, asumimos que no se puede eliminar
      return {
        canDelete: false,
        warnings: [],
        blockers: ['Error al validar eliminación']
      };
    }
  }

  /**
   * Verificar el estado de asientos contables antes de eliminación
   */
  static async checkEntryStatus(ids: string[]): Promise<{
    deletable: string[];
    nonDeletable: string[];
    reasons: Record<string, string>;
  }> {
    try {
      const deletable: string[] = [];
      const nonDeletable: string[] = [];
      const reasons: Record<string, string> = {};

      // Verificar cada asiento individualmente
      for (const id of ids) {
        try {
          const entry = await JournalEntryService.getJournalEntryById(id);
          
          // Verificar si el asiento puede ser eliminado según su estado
          if (entry.status === 'posted') {
            nonDeletable.push(id);
            reasons[id] = 'Los asientos contabilizados no pueden ser eliminados';
          } else if (entry.status === 'approved' && !entry.can_be_edited) {
            nonDeletable.push(id);
            reasons[id] = 'El asiento aprobado no puede ser eliminado';
          } else {
            deletable.push(id);
          }
        } catch (error) {
          nonDeletable.push(id);
          reasons[id] = 'Error al verificar el estado del asiento';
        }
      }

      return { deletable, nonDeletable, reasons };
    } catch (error) {
      console.error('Error al verificar estado de asientos:', error);
      throw error;
    }
  }
}

// Crear instancia singleton para uso en toda la aplicación
export const journalEntryDeletionService = new JournalEntryDeletionService();
