import { useState, useEffect, useCallback } from 'react';
import { CostCenterService } from '../services';
import type { CostCenterTree } from '../types';

export const useCostCenterTree = (activeOnly: boolean = true) => {
  const [costCenterTree, setCostCenterTree] = useState<CostCenterTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCostCenterTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CostCenterService.getCostCenterTree(activeOnly);
      setCostCenterTree(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el árbol de centros de costo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchCostCenterTree();
  }, [fetchCostCenterTree]);

  const refetch = useCallback(() => {
    fetchCostCenterTree();
  }, [fetchCostCenterTree]);

  return {
    costCenterTree,
    loading,
    error,
    refetch
  };
};
