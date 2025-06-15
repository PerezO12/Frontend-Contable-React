import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ThirdPartyService } from '../services';
import type {
  ThirdParty,
  ThirdPartyCreate,
  ThirdPartyUpdate,
  ThirdPartyFilters,
  ThirdPartyStatement,
  ThirdPartyBalance,
  BulkThirdPartyResult,
  ThirdPartyDeleteValidation,
  BulkDeleteResult
} from '../types';

// Hook para listar terceros con filtros
export const useThirdParties = (initialFilters?: ThirdPartyFilters) => {
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  // Estabilizar initialFilters para evitar bucles infinitos
  const stableFilters = useMemo(() => initialFilters, [
    initialFilters?.is_active,
    initialFilters?.third_party_type,
    initialFilters?.document_type,
    initialFilters?.document_number,
    initialFilters?.name,
    initialFilters?.commercial_name,
    initialFilters?.email,
    initialFilters?.has_balance,
    initialFilters?.created_after,
    initialFilters?.created_before,
    initialFilters?.credit_limit_min,
    initialFilters?.credit_limit_max,
    initialFilters?.order_by,
    initialFilters?.order_desc,
    initialFilters?.skip,
    initialFilters?.limit
  ]);

  // Ref para evitar fetch duplicado
  const lastFetchFilters = useRef<string>('');

  const fetchThirdParties = useCallback(async (filters?: ThirdPartyFilters) => {
    const filtersKey = JSON.stringify(filters || {});
    
    // Evitar petición duplicada si los filtros son los mismos
    if (lastFetchFilters.current === filtersKey) {
      console.log('🔄 [useThirdParties] Evitando fetch duplicado:', filters);
      return;
    }
    
    lastFetchFilters.current = filtersKey;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [useThirdParties] Fetching with filters:', filters);
      const response = await ThirdPartyService.getThirdParties(filters);
      setThirdParties(response.items || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('❌ [useThirdParties] Error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar terceros');
      setThirdParties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchThirdParties(stableFilters);
  }, [fetchThirdParties, stableFilters]);

  const refetchWithFilters = useCallback((filters: ThirdPartyFilters) => {
    fetchThirdParties(filters);
  }, [fetchThirdParties]);

  useEffect(() => {
    fetchThirdParties(stableFilters);
  }, [fetchThirdParties, stableFilters]);

  return {
    thirdParties,
    loading,
    error,
    total,
    refetch,
    refetchWithFilters
  };
};

// Hook para un tercero específico
export const useThirdParty = (id?: string) => {
  const [thirdParty, setThirdParty] = useState<ThirdParty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThirdParty = useCallback(async (thirdPartyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ThirdPartyService.getThirdParty(thirdPartyId);
      setThirdParty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tercero');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (id) {
      fetchThirdParty(id);
    }
  }, [fetchThirdParty, id]);

  useEffect(() => {
    if (id) {
      fetchThirdParty(id);
    }
  }, [fetchThirdParty, id]);

  return {
    thirdParty,
    loading,
    error,
    refetch
  };
};

// Hook para crear tercero
export const useCreateThirdParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createThirdParty = useCallback(async (data: ThirdPartyCreate): Promise<ThirdParty | null> => {
    console.log('🎯 [useCreateThirdParty] Recibiendo datos del formulario:');
    console.log('📝 Datos del formulario:', JSON.stringify(data, null, 2));
    
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.createThirdParty(data);
      console.log('✅ [useCreateThirdParty] Tercero creado exitosamente:', result);
      return result;
    } catch (err) {
      console.error('❌ [useCreateThirdParty] Error al crear tercero:', err);
      setError(err instanceof Error ? err.message : 'Error al crear tercero');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createThirdParty,
    loading,
    error
  };
};

// Hook para actualizar tercero
export const useUpdateThirdParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateThirdParty = useCallback(async (id: string, data: ThirdPartyUpdate): Promise<ThirdParty | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.updateThirdParty(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tercero');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateThirdParty,
    loading,
    error
  };
};

// Hook para eliminar tercero
export const useDeleteThirdParty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteThirdParty = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ThirdPartyService.deleteThirdParty(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tercero');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteThirdParty,
    loading,
    error
  };
};

// Hook para estado de cuenta
export const useThirdPartyStatement = (id?: string) => {
  const [statement, setStatement] = useState<ThirdPartyStatement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatement = useCallback(async (
    thirdPartyId: string,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ThirdPartyService.getThirdPartyStatement(thirdPartyId, startDate, endDate);
      setStatement(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estado de cuenta');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((startDate?: string, endDate?: string) => {
    if (id) {
      fetchStatement(id, startDate, endDate);
    }
  }, [fetchStatement, id]);

  return {
    statement,
    loading,
    error,
    fetchStatement,
    refetch
  };
};

// Hook para balance
export const useThirdPartyBalance = (id?: string) => {
  const [balance, setBalance] = useState<ThirdPartyBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async (
    thirdPartyId: string,
    asOfDate?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ThirdPartyService.getThirdPartyBalance(thirdPartyId, asOfDate);
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar balance');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((asOfDate?: string) => {
    if (id) {
      fetchBalance(id, asOfDate);
    }
  }, [fetchBalance, id]);

  useEffect(() => {
    if (id) {
      fetchBalance(id);
    }
  }, [fetchBalance, id]);

  return {
    balance,
    loading,
    error,
    fetchBalance,
    refetch
  };
};

// Hook para búsqueda
export const useThirdPartySearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: Partial<ThirdPartyFilters>) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ThirdPartyService.searchThirdParties(query, filters);
      setResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};

// Hook para operaciones masivas
export const useBulkThirdPartyOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bulkDelete = useCallback(async (
    thirdPartyIds: string[]
  ): Promise<BulkThirdPartyResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.bulkDelete(thirdPartyIds);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en eliminación masiva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdate = useCallback(async (
    thirdPartyIds: string[],
    updates: Partial<ThirdPartyUpdate>
  ): Promise<BulkThirdPartyResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.bulkUpdate(thirdPartyIds, updates);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en actualización masiva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkActivate = useCallback(async (
    thirdPartyIds: string[]
  ): Promise<BulkThirdPartyResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.bulkActivate(thirdPartyIds);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en activación masiva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeactivate = useCallback(async (
    thirdPartyIds: string[]
  ): Promise<BulkThirdPartyResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.bulkDeactivate(thirdPartyIds);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en desactivación masiva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bulkDelete,
    bulkUpdate,
    bulkActivate,
    bulkDeactivate,
    loading,
    error
  };
};

// Hook para validación y eliminación masiva real
export const useBulkDeleteValidation = () => {
  const [validationData, setValidationData] = useState<ThirdPartyDeleteValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateDeletion = useCallback(async (
    thirdPartyIds: string[]
  ): Promise<ThirdPartyDeleteValidation[] | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.validateDeletion(thirdPartyIds);
      setValidationData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en validación de eliminación');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteReal = useCallback(async (
    thirdPartyIds: string[],
    forceDelete: boolean = false,
    deleteReason: string = ''
  ): Promise<BulkDeleteResult | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ThirdPartyService.bulkDeleteReal(thirdPartyIds, forceDelete, deleteReason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en eliminación masiva');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    validationData,
    validateDeletion,
    bulkDeleteReal,
    loading,
    error
  };
};
