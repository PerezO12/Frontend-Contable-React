import { useState, useEffect, useCallback } from 'react';
import { CostCenterService } from '../services';
import type { CostCenter } from '../types';

export const useCostCenter = (id?: string) => {
  const [costCenter, setCostCenter] = useState<CostCenter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCostCenter = useCallback(async (costCenterId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CostCenterService.getCostCenterById(costCenterId);
      setCostCenter(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el centro de costo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCostCenter(id);
    }
  }, [id, fetchCostCenter]);

  const refetch = useCallback(() => {
    if (id) {
      fetchCostCenter(id);
    }
  }, [id, fetchCostCenter]);

  return {
    costCenter,
    loading,
    error,
    refetch
  };
};
