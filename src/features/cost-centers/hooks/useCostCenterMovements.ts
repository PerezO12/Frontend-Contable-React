import { useState, useCallback } from 'react';
import { CostCenterService } from '../services';

export const useCostCenterMovements = (costCenterId?: string) => {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMovements = useCallback(async (filters?: any) => {
    if (!costCenterId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await CostCenterService.getCostCenterMovements(costCenterId, filters);
      setMovements(response.movements);
      setTotal(response.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los movimientos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [costCenterId]);

  const refetch = useCallback((filters?: any) => {
    fetchMovements(filters);
  }, [fetchMovements]);

  return {
    movements,
    loading,
    error,
    total,
    totalCount: total,
    fetchMovements,
    refetch
  };
};
