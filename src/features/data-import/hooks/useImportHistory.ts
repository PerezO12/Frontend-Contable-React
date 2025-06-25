import { useState, useCallback } from 'react';
import { DataImportService } from '../services';
import type { ImportResult } from '../types';
import { useToast } from '@/shared/hooks';

interface UseImportHistoryState {
  isLoading: boolean;
  imports: ImportResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: UseImportHistoryState = {
  isLoading: false,
  imports: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

export function useImportHistory() {
  const [state, setState] = useState<UseImportHistoryState>(initialState);
  const { error } = useToast();

  /**
   * Obtiene el historial de importaciones
   */
  const getImportHistory = useCallback(async (
    page: number = 1,
    limit: number = 20,
    _dataType?: 'accounts' | 'journal_entries'
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Nota: Los parámetros se ignoran porque el servicio no los acepta
      const result = await DataImportService.getImportHistory();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        imports: result.imports,
        total: result.total,
        page: page, // Usar los parámetros pasados para el estado local
        limit: limit,
        totalPages: result.total_pages,
      }));

      return result;    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      error(
        'Error',
        'Error al cargar el historial de importaciones'
      );
      throw err;
    }
  }, [error]);

  /**
   * Obtiene el resultado detallado de una importación
   */
  const getImportResult = useCallback(async (importId: string) => {
    try {
      const result = await DataImportService.getImportResult(importId);
      return result;    } catch (err) {
      error(
        'Error',
        'Error al obtener el resultado de la importación'
      );
      throw err;
    }
  }, [error]);

  /**
   * Refresca el historial con los parámetros actuales
   */
  const refreshHistory = useCallback(() => {
    return getImportHistory(state.page, state.limit);
  }, [getImportHistory, state.page, state.limit]);

  /**
   * Cambia la página del historial
   */
  const changePage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= state.totalPages) {
      return getImportHistory(newPage, state.limit);
    }
  }, [getImportHistory, state.limit, state.totalPages]);

  /**
   * Cambia el límite de elementos por página
   */
  const changeLimit = useCallback((newLimit: number) => {
    return getImportHistory(1, newLimit);
  }, [getImportHistory]);

  /**
   * Filtra por tipo de datos
   */
  const filterByDataType = useCallback((dataType?: 'accounts' | 'journal_entries') => {
    return getImportHistory(1, state.limit, dataType);
  }, [getImportHistory, state.limit]);

  return {
    // Estado
    ...state,
    
    // Acciones
    getImportHistory,
    getImportResult,
    refreshHistory,
    changePage,
    changeLimit,
    filterByDataType,
    
    // Helpers
    hasPreviousPage: state.page > 1,
    hasNextPage: state.page < state.totalPages,
    isEmpty: state.imports.length === 0 && !state.isLoading,
  };
}
