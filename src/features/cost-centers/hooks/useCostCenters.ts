import { useState, useEffect, useCallback } from 'react';
import { CostCenterService } from '../services';
import type { CostCenter, CostCenterFilters } from '../types';

export const useCostCenters = (initialFilters?: CostCenterFilters) => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCostCenters = useCallback(async (filters?: CostCenterFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CostCenterService.getCostCenters(filters);
      setCostCenters(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los centros de costo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchCostCenters(initialFilters);
  }, [fetchCostCenters, initialFilters]);

  const refetchWithFilters = useCallback(async (newFilters: CostCenterFilters) => {
    await fetchCostCenters(newFilters);
  }, [fetchCostCenters]);

  useEffect(() => {
    fetchCostCenters(initialFilters);
  }, [fetchCostCenters, initialFilters]);

  const deleteCostCenter = useCallback(async (id: string) => {
    try {
      await CostCenterService.deleteCostCenter(id);
      // Refrescar la lista después de eliminar
      refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el centro de costo';
      setError(errorMessage);
      throw err;
    }
  }, [refetch]);

  const createCostCenter = useCallback(async (data: any) => {
    try {
      const result = await CostCenterService.createCostCenter(data);
      // Refrescar la lista después de crear
      refetch();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el centro de costo';
      setError(errorMessage);
      throw err;
    }
  }, [refetch]);

  const updateCostCenter = useCallback(async (id: string, data: any) => {
    try {
      const result = await CostCenterService.updateCostCenter(id, data);
      // Refrescar la lista después de actualizar
      refetch();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el centro de costo';
      setError(errorMessage);
      throw err;
    }
  }, [refetch]);

  return {
    costCenters,
    loading,
    error,
    total,
    refetch,
    refetchWithFilters,
    deleteCostCenter,
    createCostCenter,
    updateCostCenter
  };
};
