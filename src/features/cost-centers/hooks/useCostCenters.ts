import { useState, useEffect, useCallback } from 'react';
import { CostCenterService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type { 
  CostCenter, 
  CostCenterTree, 
  CostCenterCreate, 
  CostCenterUpdate, 
  CostCenterFilters,
  CostCenterAnalysis
} from '../types';

export const useCostCenters = (initialFilters?: CostCenterFilters) => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [currentFilters, setCurrentFilters] = useState<CostCenterFilters | undefined>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { success, error: showError } = useToast();

  const fetchCostCenters = useCallback(async (filters?: CostCenterFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = filters || currentFilters;
      const response = await CostCenterService.getCostCenters(filtersToUse);
      setCostCenters(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los centros de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, showError]);

  const refetchWithFilters = useCallback(async (newFilters: CostCenterFilters) => {
    setCurrentFilters(newFilters);
    await fetchCostCenters(newFilters);
  }, [fetchCostCenters]);

  const refetch = useCallback(async () => {
    await fetchCostCenters(currentFilters);
  }, [fetchCostCenters, currentFilters]);

  const createCostCenter = useCallback(async (costCenterData: CostCenterCreate): Promise<CostCenter | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newCostCenter = await CostCenterService.createCostCenter(costCenterData);
      setCostCenters(prev => [...prev, newCostCenter]);
      success('Centro de costo creado exitosamente');
      return newCostCenter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el centro de costo';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const updateCostCenter = useCallback(async (id: string, updateData: CostCenterUpdate): Promise<CostCenter | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCostCenter = await CostCenterService.updateCostCenter(id, updateData);
      setCostCenters(prev => prev.map(costCenter => 
        costCenter.id === id ? updatedCostCenter : costCenter
      ));
      success('Centro de costo actualizado exitosamente');
      return updatedCostCenter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el centro de costo';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const deleteCostCenter = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await CostCenterService.deleteCostCenter(id);
      setCostCenters(prev => prev.filter(costCenter => costCenter.id !== id));
      success('Centro de costo eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el centro de costo';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const toggleCostCenterStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCostCenter = await CostCenterService.toggleCostCenterStatus(id, isActive);
      setCostCenters(prev => prev.map(costCenter => 
        costCenter.id === id ? updatedCostCenter : costCenter
      ));
      success(`Centro de costo ${isActive ? 'activado' : 'desactivado'} exitosamente`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el estado del centro de costo';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  useEffect(() => {
    // Ejecutar solo una vez al montar con los filtros iniciales
    if (initialFilters) {
      fetchCostCenters(initialFilters);
    } else {
      fetchCostCenters();
    }
  }, []); // Array vacío para ejecutar solo una vez

  return {
    costCenters,
    total,
    loading,
    error,
    refetch,
    refetchWithFilters,
    createCostCenter,
    updateCostCenter,
    deleteCostCenter,
    toggleCostCenterStatus
  };
};

export const useCostCenterTree = (parentId?: string, activeOnly: boolean = true) => {
  const [costCenterTree, setCostCenterTree] = useState<CostCenterTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchCostCenterTree = useCallback(async (parent?: string, active?: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CostCenterService.getCostCenterTree(parent, active);
      setCostCenterTree(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la estructura de centros de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchCostCenterTree(parentId, activeOnly);
  }, []); // Array vacío para ejecutar solo una vez

  return {
    costCenterTree,
    loading,
    error,
    refetch: fetchCostCenterTree
  };
};

export const useCostCenter = (id?: string) => {
  const [costCenter, setCostCenter] = useState<CostCenter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchCostCenter = useCallback(async (costCenterId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CostCenterService.getCostCenterById(costCenterId);
      setCostCenter(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el centro de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchCostCenterByCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CostCenterService.getCostCenterByCode(code);
      setCostCenter(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el centro de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (id) {
      fetchCostCenter(id);
    }
  }, [id]); // Solo depende del id

  return {
    costCenter,
    loading,
    error,
    fetchCostCenter,
    fetchCostCenterByCode,
    setCostCenter
  };
};

export const useCostCenterValidation = () => {
  const [checking, setChecking] = useState(false);

  const checkCodeAvailability = useCallback(async (code: string, excludeId?: string): Promise<boolean> => {
    setChecking(true);
    
    try {
      const isAvailable = await CostCenterService.checkCodeAvailability(code, excludeId);
      return isAvailable;
    } catch (err) {
      console.error('Error checking code availability:', err);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    checking,
    checkCodeAvailability
  };
};

export const useCostCenterMovements = (costCenterId?: string) => {
  const [movements, setMovements] = useState<Array<{
    id: string;
    date: string;
    description: string;
    account_code: string;
    account_name: string;
    debit_amount: string;
    credit_amount: string;
    journal_entry_number: string;
    reference?: string;
  }>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchMovements = useCallback(async (
    id: string, 
    filters?: {
      start_date?: string;
      end_date?: string;
      skip?: number;
      limit?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CostCenterService.getCostCenterMovements(id, filters);
      setMovements(data.movements);
      setTotalCount(data.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los movimientos del centro de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (costCenterId) {
      fetchMovements(costCenterId);
    }
  }, [costCenterId]); // Solo depende del costCenterId

  return {
    movements,
    totalCount,
    loading,
    error,
    refetch: fetchMovements
  };
};

export const useCostCenterAnalysis = () => {
  const [analysis, setAnalysis] = useState<CostCenterAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchAnalysis = useCallback(async (
    id: string,
    startDate: string,
    endDate: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CostCenterService.getCostCenterAnalysis(id, startDate, endDate);
      setAnalysis(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el análisis del centro de costo';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return {
    analysis,
    loading,
    error,
    fetchAnalysis
  };
};
