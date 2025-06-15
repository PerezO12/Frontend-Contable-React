import { useState, useCallback } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type {
  BulkJournalEntryPost,
  BulkJournalEntryCancel,
  BulkJournalEntryReverse,
  BulkJournalEntryResetToDraft,
  JournalEntryApproveValidation,
  JournalEntryPostValidation,
  JournalEntryCancelValidation,
  JournalEntryReverseValidation,
  JournalEntryResetToDraftValidation,
  BulkJournalEntryApproveResult,
  BulkJournalEntryPostResult,
  BulkJournalEntryCancelResult,
  BulkJournalEntryReverseResult,
  BulkJournalEntryResetResult
} from '../types';

/**
 * Hook especializado para operaciones masivas de asientos contables
 * Implementa las 5 operaciones principales documentadas en el backend
 */
export const useBulkJournalEntryOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  // ==========================================
  // APROBACIÓN MASIVA
  // ==========================================
  const validateBulkApprove = useCallback(async (entryIds: string[]): Promise<JournalEntryApproveValidation[]> => {
    try {
      setError(null);
      // Por ahora usar un placeholder hasta que se implemente el endpoint de validación
      // TODO: Implementar JournalEntryService.validateBulkApprove(entryIds)
      return entryIds.map(id => ({
        journal_entry_id: id,
        journal_entry_number: `JE-${id.slice(0, 8)}`,
        journal_entry_description: 'Asiento contable',
        current_status: 'DRAFT' as any,
        can_approve: true,
        errors: [],
        warnings: []
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar aprobación masiva';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkApprove = useCallback(async (
    entryIds: string[], 
    reason: string, 
    force: boolean = false
  ): Promise<BulkJournalEntryApproveResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar el método existente por ahora
      const result = await JournalEntryService.bulkApproveEntries(entryIds, reason, force);
      
      success(`${result.total_approved} de ${result.total_requested} asientos aprobados exitosamente`);
      
      if (result.total_failed > 0) {
        showError(`${result.total_failed} asientos no pudieron ser aprobados`);
      }
      
      // Adaptar la respuesta al tipo esperado
      return {
        operation_id: crypto.randomUUID(),
        total_requested: result.total_requested,
        total_processed: result.total_approved,
        total_failed: result.total_failed,
        execution_time_ms: 0,
        processed_entries: [],
        failed_entries: [],
        operation_summary: {
          reason,
          executed_by: 'current_user',
          executed_at: new Date().toISOString()
        },
        total_approved: result.total_approved,
        approved_entries: []
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la aprobación masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // ==========================================
  // CONTABILIZACIÓN MASIVA
  // ==========================================

  const validateBulkPost = useCallback(async (entryIds: string[]): Promise<JournalEntryPostValidation[]> => {
    try {
      setError(null);      const validations = await JournalEntryService.validateBulkPost({ 
        journal_entry_ids: entryIds, 
        reason: 'Validación para contabilización masiva' 
      });
      return [validations]; // Wrap single validation in array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar contabilización masiva';
      setError(errorMessage);
      throw err;
    }
  }, []);
  const bulkPost = useCallback(async (
    entryIds: string[], 
    reason: string, 
    force: boolean = false
  ): Promise<BulkJournalEntryPostResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: BulkJournalEntryPost = {
        journal_entry_ids: entryIds,
        reason,
        force_post: force
      };
      
      const result = await JournalEntryService.bulkPostEntries(data);
      
      success(`${result.total_posted} de ${result.total_requested} asientos contabilizados exitosamente`);
      
      if (result.total_failed > 0) {
        showError(`${result.total_failed} asientos no pudieron ser contabilizados`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la contabilización masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // ==========================================
  // CANCELACIÓN MASIVA
  // ==========================================

  const validateBulkCancel = useCallback(async (entryIds: string[]): Promise<JournalEntryCancelValidation[]> => {
    try {
      setError(null);      const validations = await JournalEntryService.validateBulkCancel({ 
        journal_entry_ids: entryIds, 
        reason: 'Validación para cancelación masiva' 
      });
      return [validations]; // Wrap single validation in array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar cancelación masiva';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkCancel = useCallback(async (
    entryIds: string[], 
    reason: string, 
    force: boolean = false
  ): Promise<BulkJournalEntryCancelResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: BulkJournalEntryCancel = {
        journal_entry_ids: entryIds,
        reason,
        force_cancel: force
      };
      
      const result = await JournalEntryService.bulkCancelEntries(data);
      
      success(`${result.total_cancelled} de ${result.total_requested} asientos cancelados exitosamente`);
      
      if (result.total_failed > 0) {
        showError(`${result.total_failed} asientos no pudieron ser cancelados`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la cancelación masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // ==========================================
  // REVERSIÓN MASIVA
  // ==========================================

  const validateBulkReverse = useCallback(async (
    entryIds: string[], 
    reversalDate: string
  ): Promise<JournalEntryReverseValidation[]> => {
    try {
      setError(null);      const validations = await JournalEntryService.validateBulkReverse({ 
        journal_entry_ids: entryIds, 
        reason: 'Validación para reversión masiva',
        reversal_date: reversalDate 
      });
      return [validations]; // Wrap single validation in array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar reversión masiva';
      setError(errorMessage);
      throw err;
    }
  }, []);
  const bulkReverse = useCallback(async (
    entryIds: string[], 
    reason: string, 
    reversalDate: string, 
    force: boolean = false
  ): Promise<BulkJournalEntryReverseResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: BulkJournalEntryReverse = {
        journal_entry_ids: entryIds,
        reason,
        reversal_date: reversalDate,
        force_reverse: force
      };
      
      const result = await JournalEntryService.bulkReverseEntries(data);
      
      success(`${result.total_reversed} de ${result.total_requested} asientos revertidos exitosamente`);
      
      if (result.total_failed > 0) {
        showError(`${result.total_failed} asientos no pudieron ser revertidos`);
      }
      
      if (result.created_reversal_entries && result.created_reversal_entries.length > 0) {
        success(`Se crearon ${result.created_reversal_entries.length} asientos de reversión`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la reversión masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // ==========================================
  // RESTABLECIMIENTO A BORRADOR MASIVO
  // ==========================================

  const validateBulkResetToDraft = useCallback(async (entryIds: string[]): Promise<JournalEntryResetToDraftValidation[]> => {
    try {
      setError(null);      const validations = await JournalEntryService.validateBulkResetToDraft({ 
        journal_entry_ids: entryIds, 
        reason: 'Validación para restablecimiento masivo a borrador' 
      });
      return [validations]; // Wrap single validation in array
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar restablecimiento masivo';
      setError(errorMessage);
      throw err;
    }
  }, []);
  const bulkResetToDraft = useCallback(async (
    entryIds: string[], 
    reason: string, 
    force: boolean = false
  ): Promise<BulkJournalEntryResetResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: BulkJournalEntryResetToDraft = {
        journal_entry_ids: entryIds,
        reason,
        force_reset: force
      };
      
      const result = await JournalEntryService.bulkResetToDraftEntries(data);
      
      success(`${result.total_reset} de ${result.total_requested} asientos restablecidos a borrador exitosamente`);
      
      if (result.total_failed > 0) {
        showError(`${result.total_failed} asientos no pudieron ser restablecidos`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el restablecimiento masivo';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // ==========================================
  // UTILIDADES Y ESTADOS
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calcular resumen de validaciones
  const getValidationSummary = useCallback((
    validations: (JournalEntryApproveValidation | JournalEntryPostValidation | JournalEntryCancelValidation | JournalEntryReverseValidation | JournalEntryResetToDraftValidation)[]
  ) => {
    const valid = validations.filter(v => 
      ('can_approve' in v && v.can_approve) ||
      ('can_post' in v && v.can_post) ||
      ('can_cancel' in v && v.can_cancel) ||
      ('can_reverse' in v && v.can_reverse) ||
      ('can_reset' in v && v.can_reset)
    ).length;
    
    const invalid = validations.length - valid;
    const totalErrors = validations.reduce((sum, v) => sum + v.errors.length, 0);
    const totalWarnings = validations.reduce((sum, v) => sum + v.warnings.length, 0);

    return {
      total: validations.length,
      valid,
      invalid,
      canProceed: valid > 0,
      totalErrors,
      totalWarnings
    };
  }, []);

  return {
    // Estados
    loading,
    error,
    clearError,
    
    // Operaciones de aprobación
    validateBulkApprove,
    bulkApprove,
    
    // Operaciones de contabilización
    validateBulkPost,
    bulkPost,
    
    // Operaciones de cancelación
    validateBulkCancel,
    bulkCancel,
    
    // Operaciones de reversión
    validateBulkReverse,
    bulkReverse,
    
    // Operaciones de restablecimiento
    validateBulkResetToDraft,
    bulkResetToDraft,
    
    // Utilidades
    getValidationSummary
  };
};

// ==========================================
// TIPOS PARA EL COMPONENTE
// ==========================================

export type BulkOperationType = 'approve' | 'post' | 'cancel' | 'reverse' | 'reset-to-draft';

export interface BulkOperationConfig {
  type: BulkOperationType;
  label: string;
  description: string;
  icon: string;
  confirmMessage: string;
  requiresReason: boolean;
  requiresDate?: boolean; // Para reversiones
  buttonColor: 'primary' | 'success' | 'warning' | 'danger';
}

export const BULK_OPERATION_CONFIGS: Record<BulkOperationType, BulkOperationConfig> = {
  'approve': {
    type: 'approve',
    label: 'Aprobar',
    description: 'Aprobar asientos seleccionados',
    icon: 'check-circle',
    confirmMessage: '¿Está seguro de aprobar los asientos seleccionados?',
    requiresReason: true,
    buttonColor: 'success'
  },
  'post': {
    type: 'post',
    label: 'Contabilizar',
    description: 'Contabilizar asientos aprobados',
    icon: 'save',
    confirmMessage: '¿Está seguro de contabilizar los asientos seleccionados? Esta acción afectará los saldos de las cuentas.',
    requiresReason: true,
    buttonColor: 'primary'
  },
  'cancel': {
    type: 'cancel',
    label: 'Cancelar',
    description: 'Cancelar asientos seleccionados',
    icon: 'x-circle',
    confirmMessage: '¿Está seguro de cancelar los asientos seleccionados?',
    requiresReason: true,
    buttonColor: 'warning'
  },
  'reverse': {
    type: 'reverse',
    label: 'Revertir',
    description: 'Revertir asientos contabilizados',
    icon: 'rotate-ccw',
    confirmMessage: '¿Está seguro de revertir los asientos seleccionados? Se crearán asientos de reversión.',
    requiresReason: true,
    requiresDate: true,
    buttonColor: 'danger'
  },
  'reset-to-draft': {
    type: 'reset-to-draft',
    label: 'Restablecer a Borrador',
    description: 'Restablecer asientos a estado borrador',
    icon: 'refresh-cw',
    confirmMessage: '¿Está seguro de restablecer los asientos seleccionados a borrador?',
    requiresReason: true,
    buttonColor: 'warning'
  }
};
