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
  JournalEntryFormData
} from '../types';

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
  }, [fetchEntries, currentFilters]);
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
      const response = await JournalEntryService.approveJournalEntry(id);
      if (response.success && response.journal_entry) {
        // Actualizar estado local inmediatamente
        setEntries(prev => prev.map(entry => 
          entry.id === id ? response.journal_entry! : entry
        ));
        success(response.message || 'Asiento contable aprobado exitosamente');
        
        // Emitir evento de aprobación para actualización en tiempo real
        emitApproved(id, response.journal_entry);
        
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitApproved]);

  const postEntry = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await JournalEntryService.postJournalEntry(id);
      if (response.success && response.journal_entry) {
        // Actualizar estado local inmediatamente
        setEntries(prev => prev.map(entry => 
          entry.id === id ? response.journal_entry! : entry
        ));
        success(response.message || 'Asiento contable contabilizado exitosamente');
        
        // Emitir evento de contabilización para actualización en tiempo real
        emitPosted(id, response.journal_entry);
        
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al contabilizar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitPosted]);

  const cancelEntry = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await JournalEntryService.cancelJournalEntry(id, reason);
      if (response.success && response.journal_entry) {
        // Actualizar estado local inmediatamente
        setEntries(prev => prev.map(entry => 
          entry.id === id ? response.journal_entry! : entry
        ));
        success(response.message || 'Asiento contable cancelado exitosamente');
        
        // Emitir evento de cancelación para actualización en tiempo real
        emitCancelled(id, response.journal_entry);
        
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, emitCancelled]);
  const reverseEntry = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await JournalEntryService.reverseJournalEntry(id, reason);
      if (response.success) {
        // En lugar de refrescar toda la lista, simplemente emitimos el evento
        // y dejamos que el sistema de eventos maneje la actualización
        success(response.message || 'Asiento de reversión creado exitosamente');
        
        // Emitir evento de reversión
        emitReversed(id);
        
        return true;
      }
      return false;
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
      const response = await JournalEntryService.searchJournalEntries(query, filters);
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
  }, [showError]);  useEffect(() => {
    // Ejecutar solo una vez al montar con los filtros iniciales
    if (initialFilters) {
      fetchEntries(initialFilters);
    } else {
      fetchEntries();
    }
  }, []); // Array vacío para ejecutar solo una vez
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
    searchEntries
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
  const fetchStatistics = useCallback(async (statsFilters?: JournalEntryFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = statsFilters || filters;
      const data = await JournalEntryService.getStatistics(filtersToUse);
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

  useEffect(() => {
    const newBalance = JournalEntryService.validateBalance(lines);
    setBalance(newBalance);
  }, [lines]);

  return balance;
};