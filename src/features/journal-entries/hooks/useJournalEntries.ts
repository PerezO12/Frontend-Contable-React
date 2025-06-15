import { useState, useEffect, useCallback } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import { useJournalEntryEventEmitter } from './useJournalEntryEvents';
import type {
  JournalEntry,
  JournalEntryCreate,
  JournalEntryUpdate,
  JournalEntryFilters,
  JournalEntryStatistics,
  JournalEntryFormData,
  BulkJournalEntryDelete,
  JournalEntryDeleteValidation,
  BulkJournalEntryDeleteResult
} from '../types';
import { JournalEntryStatus } from '../types';

/**
 * Hook principal para gestión de asientos contables
 * Maneja el estado, loading, errores y operaciones CRUD
 */
export const useJournalEntries = (initialFilters?: JournalEntryFilters) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentFilters, setCurrentFilters] = useState<JournalEntryFilters | undefined>(initialFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    has_next: false,
    has_prev: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { success, error: showError } = useToast();
  const { emitApproved, emitPosted, emitCancelled, emitReversed, emitDeleted } = useJournalEntryEventEmitter();  const fetchEntries = useCallback(async (filters?: JournalEntryFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = filters || currentFilters;
      const response = await JournalEntryService.getJournalEntries(filtersToUse);
      setEntries(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages,
        has_next: response.has_next,
        has_prev: response.has_prev
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los asientos contables';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, showError]);

  const refetchWithFilters = useCallback(async (newFilters: JournalEntryFilters) => {
    setCurrentFilters(newFilters);
    await fetchEntries(newFilters);
  }, [fetchEntries]);
  const refetch = useCallback(async () => {
    await fetchEntries(currentFilters);
  }, [fetchEntries]);
  const createEntry = useCallback(async (data: JournalEntryCreate): Promise<JournalEntry | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newEntry = await JournalEntryService.createJournalEntry(data);
      setEntries(prev => [newEntry, ...prev]);
      success('Asiento contable creado exitosamente');
      // No emitimos evento 'updated' para evitar bucles infinitos
      // emitUpdated(newEntry.id, newEntry);
      return newEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);
  const updateEntry = useCallback(async (id: string, data: JournalEntryUpdate): Promise<JournalEntry | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await JournalEntryService.updateJournalEntry(id, data);
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      success('Asiento contable actualizado exitosamente');
      // Solo emitimos eventos para operaciones que afectan el estado, no para updates simples
      // emitUpdated(id, updatedEntry);
      return updatedEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await JournalEntryService.deleteJournalEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      success('Asiento contable eliminado exitosamente');
      emitDeleted(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitDeleted]);
  const approveEntry = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await JournalEntryService.approveJournalEntry(id);
      // Actualizar estado local inmediatamente
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      success('Asiento contable aprobado exitosamente');
      
      // Emitir evento de aprobación para actualización en tiempo real
      emitApproved(id, updatedEntry);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitApproved]);
  const postEntry = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await JournalEntryService.postJournalEntry(id, reason);
      // Actualizar estado local inmediatamente
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      success('Asiento contable contabilizado exitosamente');
      
      // Emitir evento de contabilización para actualización en tiempo real
      emitPosted(id, updatedEntry);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al contabilizar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitPosted]);
  const cancelEntry = useCallback(async (id: string, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await JournalEntryService.cancelJournalEntry(id, reason);
      // Actualizar estado local inmediatamente
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      success('Asiento contable cancelado exitosamente');
      
      // Emitir evento de cancelación para actualización en tiempo real
      emitCancelled(id, updatedEntry);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitCancelled]);  const reverseEntry = useCallback(async (id: string, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const reversalEntry = await JournalEntryService.reverseJournalEntry(id, reason);
      // En lugar de refrescar toda la lista, simplemente emitimos el evento
      // y dejamos que el sistema de eventos maneje la actualización
      success('Asiento de reversión creado exitosamente');
      
      // Emitir evento de reversión
      emitReversed(id, reversalEntry);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la reversión';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitReversed]);
  const searchEntries = useCallback(async (query: string, filters?: JournalEntryFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await JournalEntryService.getJournalEntries({ ...filters, search: query });
      setEntries(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages,
        has_next: response.has_next,
        has_prev: response.has_prev
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la búsqueda';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);
  // Validar eliminación masiva
  const validateDeletion = useCallback(async (entryIds: string[]): Promise<JournalEntryDeleteValidation[]> => {    try {
      const validations = await JournalEntryService.validateBulkDelete({ journal_entry_ids: entryIds });
      return validations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar la eliminación';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  // Eliminar asientos masivamente
  const bulkDeleteEntries = useCallback(async (deleteData: BulkJournalEntryDelete): Promise<BulkJournalEntryDeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await JournalEntryService.bulkDeleteJournalEntries(deleteData);
      
      // Actualizar la lista removiendo los asientos eliminados exitosamente
      if (result.deleted_entries.length > 0) {
        const deletedIds = result.deleted_entries.map((entry: any) => entry.journal_entry_id);
        setEntries(prev => prev.filter(entry => !deletedIds.includes(entry.id)));
        
        // Emitir eventos de eliminación para cada asiento eliminado
        deletedIds.forEach((id: string) => emitDeleted(id));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la eliminación masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError, emitDeleted]);  // Restaurar un asiento contable a borrador
  const restoreEntryToDraft = useCallback(async (id: string, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await JournalEntryService.resetJournalEntryToDraft(id, reason);
      
      // Actualizar el estado del asiento en la lista local
      setEntries(prev => 
        prev.map(entry => 
          entry.id === id ? { ...entry, status: JournalEntryStatus.DRAFT } : entry
        )
      );
      
      success(`Asiento ${id} restaurado a borrador exitosamente`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restaurar asiento a borrador';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, success]);

  // Restaurar múltiples asientos contables a borrador
  const bulkRestoreToDraft = useCallback(async (entryIds: string[], reason: string) => {    setLoading(true);
    setError(null);
    
    try {
      const resetData = {
        journal_entry_ids: entryIds,
        reason,
        force_reset: false
      };
      const result = await JournalEntryService.bulkResetToDraftEntries(resetData);
      
      // Actualizar la lista actualizando el estado de los asientos restaurados exitosamente
      if (result.reset_entries && result.reset_entries.length > 0) {
        const restoredIds = result.reset_entries.map((entry: any) => entry.journal_entry_id);
        
        setEntries(prev => 
          prev.map(entry => 
            restoredIds.includes(entry.id) 
              ? { ...entry, status: JournalEntryStatus.DRAFT } 
              : entry
          )
        );
        
        // Podríamos añadir un evento de restauración si fuera necesario
      }
      
      success(`${result.total_reset} de ${result.total_requested} asientos restaurados a borrador`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la restauración masiva a borrador';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError, success]);  useEffect(() => {
    // Ejecutar solo una vez al montar con los filtros iniciales
    fetchEntries(initialFilters);
  }, []); // Array vacío para ejecutar solo una vez
  
  // No agregamos fetchEntries porque eso causaría re-ejecución innecesaria
  
  return {
    entries,
    pagination,
    loading,
    error,
    refetch,
    refetchWithFilters,
    createEntry,
    updateEntry,
    deleteEntry,
    approveEntry,
    postEntry,
    cancelEntry,
    reverseEntry,
    searchEntries,
    validateDeletion,
    bulkDeleteEntries,
    restoreEntryToDraft,
    bulkRestoreToDraft
  };
};

/**
 * Hook para gestionar un asiento contable individual
 */
export const useJournalEntry = (id?: string) => {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();
  const fetchEntry = useCallback(async (entryId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await JournalEntryService.getJournalEntryById(entryId);
      setEntry(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Removemos showError de las dependencias

  const fetchByNumber = useCallback(async (number: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await JournalEntryService.getJournalEntryByNumber(number);
      setEntry(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Removemos showError de las dependencias

  useEffect(() => {
    if (id) {
      fetchEntry(id);
    }
  }, [id]); // Solo depende del id, no de fetchEntry

  // Función para actualizar el entry localmente (para actualizaciones en tiempo real)
  const updateLocalEntry = useCallback((updatedEntry: JournalEntry) => {
    setEntry(updatedEntry);
  }, []);
  // Función para refrescar solo si el ID coincide
  const refetchIfMatches = useCallback((entryId: string) => {
    if (id === entryId) {
      fetchEntry(entryId);
    }
  }, [id]); // Solo depende del id

  return {
    entry,
    loading,
    error,
    refetch: fetchEntry,
    fetchByNumber,
    updateLocalEntry,
    refetchIfMatches
  };
};

/**
 * Hook para estadísticas de asientos contables
 */
export const useJournalEntryStatistics = (filters?: JournalEntryFilters) => {
  const [statistics, setStatistics] = useState<JournalEntryStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();
  const fetchStatistics = useCallback(async (_statsFilters?: JournalEntryFilters) => {
    setLoading(true);
    setError(null);
    
    try {      // const filtersToUse = statsFilters || filters; // TODO: Add filters support to statistics endpoint
      const data = await JournalEntryService.getJournalEntryStatistics();
      setStatistics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Removemos las dependencias para evitar bucle infinito

  useEffect(() => {
    fetchStatistics(filters);
  }, []); // Solo ejecutar una vez al montar

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
};

/**
 * Hook para validación de balance en tiempo real
 */
export const useJournalEntryBalance = (lines: JournalEntryFormData['lines']) => {
  const [balance, setBalance] = useState({
    total_debit: 0,
    total_credit: 0,
    difference: 0,
    is_balanced: false
  });

  useEffect(() => {    // Simple balance validation - calculate total debits and credits
    const totalDebits = lines.reduce((sum, line) => sum + parseFloat(line.debit_amount || '0'), 0);
    const totalCredits = lines.reduce((sum, line) => sum + parseFloat(line.credit_amount || '0'), 0);
    const newBalance = {
      total_debit: totalDebits,
      total_credit: totalCredits,
      difference: totalDebits - totalCredits,
      is_balanced: Math.abs(totalDebits - totalCredits) < 0.01
    };
    setBalance(newBalance);
  }, [lines]);

  return balance;
};