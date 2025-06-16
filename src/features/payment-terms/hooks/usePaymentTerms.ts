import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PaymentTermsService } from '../services/paymentTermsService';
import type {
  PaymentTerms,
  PaymentTermsFilters,
  PaymentTermsActiveResponse,
  PaymentTermsCreate,
  PaymentTermsUpdate,
  PaymentCalculationRequest,
  PaymentCalculationResult,
  PaymentTermsValidationResult
} from '../types';

// ==========================================
// HOOK PARA LISTAR PAYMENT TERMS
// ==========================================

export interface UsePaymentTermsListOptions {
  initialFilters?: PaymentTermsFilters;
  autoLoad?: boolean;
}

export interface UsePaymentTermsListResult {
  paymentTerms: PaymentTerms[];
  loading: boolean;
  error: string | null;
  total: number;
  filters: PaymentTermsFilters;
  loadPaymentTerms: (newFilters?: PaymentTermsFilters) => Promise<void>;
  refreshPaymentTerms: () => Promise<void>;
  setFilters: (filters: PaymentTermsFilters) => void;
  clearError: () => void;
}

export function usePaymentTermsList(options: UsePaymentTermsListOptions = {}): UsePaymentTermsListResult {
  const { initialFilters = {}, autoLoad = true } = options;
  
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<PaymentTermsFilters>(initialFilters);

  // Estabilizar options para evitar bucles infinitos
  const stableOptions = useMemo(() => ({ 
    initialFilters, 
    autoLoad 
  }), [
    JSON.stringify(initialFilters), // Comparar contenido, no referencia
    autoLoad
  ]);

  // Ref para evitar fetch duplicado
  const lastFetchFilters = useRef<string>('');
  const isFirstLoad = useRef(true);

  const loadPaymentTerms = useCallback(async (newFilters?: PaymentTermsFilters) => {
    const filtersToUse = newFilters || filters;
    const filtersKey = JSON.stringify(filtersToUse);
    
    // Evitar petición duplicada si los filtros son los mismos
    if (lastFetchFilters.current === filtersKey && !isFirstLoad.current) {
      console.log('🔄 [usePaymentTermsList] Evitando fetch duplicado:', filtersToUse);
      return;
    }
    
    lastFetchFilters.current = filtersKey;
    isFirstLoad.current = false;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [usePaymentTermsList] Fetching with filters:', filtersToUse);
      
      const response = await PaymentTermsService.getPaymentTermsList(filtersToUse);
      
      setPaymentTerms(response.items);
      setTotal(response.total);
      
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar condiciones de pago';
      console.error('❌ [usePaymentTermsList] Error:', err);
      setError(errorMessage);
      setPaymentTerms([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshPaymentTerms = useCallback(() => {
    return loadPaymentTerms();
  }, [loadPaymentTerms]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (stableOptions.autoLoad) {
      loadPaymentTerms(stableOptions.initialFilters);
    }
  }, [stableOptions, loadPaymentTerms]);

  return {
    paymentTerms,
    loading,
    error,
    total,
    filters,
    loadPaymentTerms,
    refreshPaymentTerms,
    setFilters,
    clearError
  };
}

// ==========================================
// HOOK PARA PAYMENT TERMS ACTIVOS (SELECTS)
// ==========================================

export interface UseActivePaymentTermsResult {
  activePaymentTerms: PaymentTermsActiveResponse;
  loading: boolean;
  error: string | null;
  refreshActivePaymentTerms: () => Promise<void>;
  clearError: () => void;
}

export function useActivePaymentTerms(): UseActivePaymentTermsResult {
  const [activePaymentTerms, setActivePaymentTerms] = useState<PaymentTermsActiveResponse>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivePaymentTerms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PaymentTermsService.getActivePaymentTerms();
      setActivePaymentTerms(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar condiciones de pago activas';
      setError(errorMessage);
      setActivePaymentTerms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadActivePaymentTerms();
  }, [loadActivePaymentTerms]);

  return {
    activePaymentTerms,
    loading,
    error,
    refreshActivePaymentTerms: loadActivePaymentTerms,
    clearError
  };
}

// ==========================================
// HOOK PARA PAYMENT TERM INDIVIDUAL
// ==========================================

export interface UsePaymentTermOptions {
  id?: string;
  code?: string;
  autoLoad?: boolean;
}

export interface UsePaymentTermResult {
  paymentTerm: PaymentTerms | null;
  loading: boolean;
  error: string | null;
  loadPaymentTerm: (idOrCode: string, byCode?: boolean) => Promise<void>;
  clearError: () => void;
}

export function usePaymentTerm(options: UsePaymentTermOptions = {}): UsePaymentTermResult {
  const { id, code, autoLoad = true } = options;
  
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerms | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentTerm = useCallback(async (idOrCode: string, byCode: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = byCode 
        ? await PaymentTermsService.getPaymentTermsByCode(idOrCode)
        : await PaymentTermsService.getPaymentTermsById(idOrCode);
      
      setPaymentTerm(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar condición de pago';
      setError(errorMessage);
      setPaymentTerm(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad && (id || code)) {
      loadPaymentTerm(id || code!, !!code);
    }
  }, [autoLoad, id, code, loadPaymentTerm]);

  return {
    paymentTerm,
    loading,
    error,
    loadPaymentTerm,
    clearError
  };
}

// ==========================================
// HOOK PARA OBTENER PAYMENT TERM POR ID
// ==========================================

export interface UsePaymentTermByIdResult {
  paymentTerm: PaymentTerms | null;
  loading: boolean;
  error: string | null;
  getPaymentTermById: (id: string) => Promise<PaymentTerms>;
  clearError: () => void;
  clearPaymentTerm: () => void;
}

export function usePaymentTermById(): UsePaymentTermByIdResult {
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerms | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPaymentTermById = useCallback(async (id: string): Promise<PaymentTerms> => {
    if (!id) {
      throw new Error('ID de payment term requerido');
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [usePaymentTermById] Obteniendo payment term por ID:', id);
      
      const response = await PaymentTermsService.getPaymentTermsById(id);
      
      console.log('✅ [usePaymentTermById] Payment term obtenido:', response);
      console.log('📋 [usePaymentTermById] Payment schedules:', response.payment_schedules);
      
      setPaymentTerm(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener condiciones de pago';
      console.error('❌ [usePaymentTermById] Error:', err);
      setError(errorMessage);
      setPaymentTerm(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPaymentTerm = useCallback(() => {
    setPaymentTerm(null);
    setError(null);
  }, []);

  return {
    paymentTerm,
    loading,
    error,
    getPaymentTermById,
    clearError,
    clearPaymentTerm
  };
}

// ==========================================
// HOOK PARA MUTACIONES (CREATE/UPDATE/DELETE)
// ==========================================

export interface UsePaymentTermsMutationsResult {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  toggling: boolean;
  error: string | null;
  createPaymentTerms: (data: PaymentTermsCreate) => Promise<PaymentTerms>;
  updatePaymentTerms: (id: string, data: PaymentTermsUpdate) => Promise<PaymentTerms>;
  deletePaymentTerms: (id: string) => Promise<void>;
  toggleActiveStatus: (id: string) => Promise<PaymentTerms>;
  clearError: () => void;
}

export function usePaymentTermsMutations(): UsePaymentTermsMutationsResult {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentTerms = useCallback(async (data: PaymentTermsCreate): Promise<PaymentTerms> => {
    try {
      setCreating(true);
      setError(null);
      
      const response = await PaymentTermsService.createPaymentTerms(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear condiciones de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const updatePaymentTerms = useCallback(async (id: string, data: PaymentTermsUpdate): Promise<PaymentTerms> => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await PaymentTermsService.updatePaymentTerms(id, data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar condiciones de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deletePaymentTerms = useCallback(async (id: string): Promise<void> => {
    try {
      setDeleting(true);
      setError(null);
      
      await PaymentTermsService.deletePaymentTerms(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar condiciones de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  const toggleActiveStatus = useCallback(async (id: string): Promise<PaymentTerms> => {
    try {
      setToggling(true);
      setError(null);
      
      const response = await PaymentTermsService.toggleActiveStatus(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado de condiciones de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setToggling(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    creating,
    updating,
    deleting,
    toggling,
    error,
    createPaymentTerms,
    updatePaymentTerms,
    deletePaymentTerms,
    toggleActiveStatus,
    clearError
  };
}

// ==========================================
// HOOK PARA CÁLCULOS DE PAYMENT SCHEDULE
// ==========================================

export interface UsePaymentCalculationResult {
  calculating: boolean;
  error: string | null;
  calculatePaymentSchedule: (request: PaymentCalculationRequest) => Promise<PaymentCalculationResult>;
  clearError: () => void;
}

export function usePaymentCalculation(): UsePaymentCalculationResult {
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePaymentSchedule = useCallback(async (request: PaymentCalculationRequest): Promise<PaymentCalculationResult> => {
    try {
      setCalculating(true);
      setError(null);
      
      const response = await PaymentTermsService.calculatePaymentSchedule(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calcular cronograma de pagos';
      setError(errorMessage);
      throw err;
    } finally {
      setCalculating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    calculating,
    error,
    calculatePaymentSchedule,
    clearError
  };
}

// ==========================================
// HOOK PARA VALIDACIÓN
// ==========================================

export interface UsePaymentTermsValidationResult {
  validating: boolean;
  error: string | null;
  validatePaymentTerms: (id: string) => Promise<PaymentTermsValidationResult>;
  clearError: () => void;
}

export function usePaymentTermsValidation(): UsePaymentTermsValidationResult {
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePaymentTerms = useCallback(async (id: string): Promise<PaymentTermsValidationResult> => {
    try {
      setValidating(true);
      setError(null);
      
      const response = await PaymentTermsService.validatePaymentTerms(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar condiciones de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setValidating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    validating,
    error,
    validatePaymentTerms,
    clearError
  };
}
