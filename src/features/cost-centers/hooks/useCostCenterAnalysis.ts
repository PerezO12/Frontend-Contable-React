import { useState, useCallback } from 'react';
import { CostCenterService } from '../services';
import type { CostCenterAnalysis } from '../types';

export const useCostCenterAnalysis = () => {
  const [analysis, setAnalysis] = useState<CostCenterAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (costCenterId: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CostCenterService.getCostCenterAnalysis(costCenterId, startDate, endDate);
      setAnalysis(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el análisis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    loading,
    error,
    fetchAnalysis
  };
};
