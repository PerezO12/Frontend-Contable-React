/**
 * Hook personalizado para gestión de journals
 * Proporciona una interfaz simplificada para operaciones con journals
 */
import { useEffect, useCallback } from 'react';
import { useJournalStore } from '../stores/journalStore';
import type {
  JournalFilter,
  JournalPagination,
  JournalCreate,
  JournalUpdate,
  JournalResetSequence,
} from '../types';

/**
 * Hook para listado de journals con filtros y paginación
 */
export function useJournals(
  initialFilters?: JournalFilter,
  initialPagination?: JournalPagination,
  autoFetch: boolean = true
) {
  const {
    journals,
    loading,
    error,
    total,
    skip,
    limit,
    fetchJournals: storeFetchJournals,
    clearError,
    refresh,
  } = useJournalStore();

  // Memoizar la función fetchJournals para evitar dependencias cambiantes
  const fetchJournals = useCallback((filters?: JournalFilter, pagination?: JournalPagination) => {
    return storeFetchJournals(filters, pagination);
  }, [storeFetchJournals]);

  // Solo ejecutar autoFetch si está habilitado
  useEffect(() => {
    if (autoFetch) {
      fetchJournals(initialFilters, initialPagination);
    }
  }, []); // Array vacío - solo ejecutar una vez al montar

  return {
    journals,
    loading,
    error,
    total,
    skip,
    limit,
    fetchJournals,
    clearError,
    refresh,
  };
}

/**
 * Hook para operaciones con un journal específico
 */
export function useJournal(id?: string, autoFetch: boolean = true) {
  const {
    currentJournal,
    currentStats,
    currentSequenceInfo,
    loading,
    saving,
    error,
    fetchJournal: storeFetchJournal,
    createJournal,
    updateJournal,
    deleteJournal,
    fetchJournalStats,
    fetchJournalSequenceInfo,
    resetJournalSequence,
    setCurrentJournal,
    clearError,
  } = useJournalStore();

  // Memoizar función fetchJournal
  const fetchJournal = useCallback((journalId: string) => {
    return storeFetchJournal(journalId);
  }, [storeFetchJournal]);

  useEffect(() => {
    if (id && autoFetch) {
      fetchJournal(id);
    }
  }, [id]); // Solo depender del id, no del fetchJournal

  const handleCreate = async (data: JournalCreate) => {
    try {
      const journal = await createJournal(data);
      return journal;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (data: JournalUpdate) => {
    if (!id) throw new Error('ID de journal requerido para actualizar');
    
    try {
      const journal = await updateJournal(id, data);
      return journal;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!id) throw new Error('ID de journal requerido para eliminar');
    
    try {
      await deleteJournal(id);
    } catch (error) {
      throw error;
    }
  };

  const handleResetSequence = async (data: JournalResetSequence) => {
    if (!id) throw new Error('ID de journal requerido para resetear secuencia');
    
    try {
      const journal = await resetJournalSequence(id, data);
      return journal;
    } catch (error) {
      throw error;
    }
  };

  const loadStats = async () => {
    if (!id) throw new Error('ID de journal requerido para cargar estadísticas');
    
    try {
      await fetchJournalStats(id);
    } catch (error) {
      throw error;
    }
  };

  const loadSequenceInfo = async () => {
    if (!id) throw new Error('ID de journal requerido para cargar información de secuencia');
    
    try {
      await fetchJournalSequenceInfo(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    journal: currentJournal,
    stats: currentStats,
    sequenceInfo: currentSequenceInfo,
    loading,
    saving,
    error,
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
    resetSequence: handleResetSequence,
    loadStats,
    loadSequenceInfo,
    setJournal: setCurrentJournal,
    clearError,
  };
}

/**
 * Hook para opciones de journals (para selects)
 */
export function useJournalOptions() {
  const { journals, loading, error, fetchJournals } = useJournalStore();

  // Función memoizada para cargar opciones
  const loadOptions = useCallback(() => {
    return fetchJournals(
      { is_active: true },
      { skip: 0, limit: 1000, order_by: 'name', order_dir: 'asc' }
    );
  }, [fetchJournals]);

  useEffect(() => {
    loadOptions();
  }, []); // Solo ejecutar una vez al montar

  const options = journals.map(journal => ({
    value: journal.id,
    label: `${journal.name} (${journal.code})`,
    type: journal.type,
    sequence_prefix: journal.sequence_prefix,
    is_active: journal.is_active,
  }));

  return {
    options,
    loading,
    error,
  };
}

/**
 * Hook para estadísticas de journals
 */
export function useJournalStats(id: string, autoFetch: boolean = true) {
  const {
    currentStats,
    loading,
    error,
    fetchJournalStats: storeFetchJournalStats,
    clearError,
  } = useJournalStore();

  // Memoizar función fetchJournalStats
  const fetchJournalStats = useCallback((statsId: string) => {
    return storeFetchJournalStats(statsId);
  }, [storeFetchJournalStats]);

  useEffect(() => {
    if (id && autoFetch) {
      fetchJournalStats(id);
    }
  }, [id]); // Solo depender del id

  return {
    stats: currentStats,
    loading,
    error,
    refresh: () => fetchJournalStats(id),
    clearError,
  };
}

/**
 * Hook para información de secuencia de journals
 */
export function useJournalSequence(id: string, autoFetch: boolean = true) {
  const {
    currentSequenceInfo,
    loading,
    error,
    fetchJournalSequenceInfo: storeFetchJournalSequenceInfo,
    resetJournalSequence,
    clearError,
  } = useJournalStore();

  // Memoizar función fetchJournalSequenceInfo
  const fetchJournalSequenceInfo = useCallback((sequenceId: string) => {
    return storeFetchJournalSequenceInfo(sequenceId);
  }, [storeFetchJournalSequenceInfo]);

  useEffect(() => {
    if (id && autoFetch) {
      fetchJournalSequenceInfo(id);
    }
  }, [id]); // Solo depender del id

  const handleReset = async (data: JournalResetSequence) => {
    try {
      const journal = await resetJournalSequence(id, data);
      return journal;
    } catch (error) {
      throw error;
    }
  };

  return {
    sequenceInfo: currentSequenceInfo,
    loading,
    error,
    resetSequence: handleReset,
    refresh: () => fetchJournalSequenceInfo(id),
    clearError,
  };
}
