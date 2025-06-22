import { useState, useCallback } from 'react';
import { ProductService } from '../services';
import type {
  Product,
  ProductDeletionValidation,
  BulkProductDeleteResult,
  BulkProductOperationResult,
  StockAdjustmentResult,
  ReorderProduct,
  ProductMovement,
  ProductDetailedStats,
  BulkProductOperation
} from '../types';

/**
 * Hook para operaciones masivas de productos
 */
export function useBulkProductOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateDeletion = useCallback(async (productIds: string[]): Promise<ProductDeletionValidation[]> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.validateDeletion(productIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar eliminación';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (productIds: string[]): Promise<BulkProductDeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.bulkDeleteProducts(productIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar productos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeactivate = useCallback(async (productIds: string[]): Promise<BulkProductOperationResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.bulkDeactivateProducts(productIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar productos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkOperation = useCallback(async (operation: BulkProductOperation): Promise<BulkProductOperationResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.bulkOperation(operation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en operación masiva';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    validateDeletion,
    bulkDelete,
    bulkDeactivate,
    bulkOperation,
    loading,
    error
  };
}

/**
 * Hook para operaciones de estado de productos
 */
export function useProductStatusOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.activateProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.deactivateProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const discontinueProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.discontinueProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al descontinuar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activateProduct,
    deactivateProduct,
    discontinueProduct,
    loading,
    error
  };
}

/**
 * Hook para operaciones de stock
 */
export function useStockOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = useCallback(async (
    id: string, 
    adjustment: {
      adjustment_type: 'increase' | 'decrease' | 'set';
      quantity: number;
      reason: string;
      unit_cost?: number;
      reference_document?: string;
    }
  ): Promise<StockAdjustmentResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.adjustStock(id, adjustment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al ajustar stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addStock = useCallback(async (
    id: string, 
    data: {
      quantity: number;
      unit_cost?: number;
      reason: string;
      reference?: string;
    }
  ): Promise<StockAdjustmentResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.addStock(id, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const subtractStock = useCallback(async (
    id: string, 
    data: {
      quantity: number;
      reason: string;
      reference?: string;
    }
  ): Promise<StockAdjustmentResult> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.subtractStock(id, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reducir stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateStockAvailability = useCallback(async (
    productId: string, 
    requiredQuantity: number
  ): Promise<{
    available: boolean;
    currentStock: number;
    message?: string;
  }> => {
    setLoading(true);
    setError(null);
    
    try {
      return await ProductService.validateStockAvailability(productId, requiredQuantity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adjustStock,
    addStock,
    subtractStock,
    validateStockAvailability,
    loading,
    error
  };
}

/**
 * Hook para productos que necesitan reorden
 */
export function useReorderProducts() {
  const [products, setProducts] = useState<ReorderProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReorderProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductsNeedingReorder();
      setProducts(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos que necesitan reorden';
      setError(errorMessage);
      console.error('Error al cargar productos que necesitan reorden:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchReorderProducts,
    fetchReorderProducts
  };
}

/**
 * Hook para movimientos de producto
 */
export function useProductMovements(productId: string) {
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentStock, setCurrentStock] = useState('0');

  const fetchMovements = useCallback(async (filters?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    movement_type?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductMovements(productId, filters);
      setMovements(response.movements);
      setTotal(response.total);
      setCurrentStock(response.current_stock);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar movimientos';
      setError(errorMessage);
      console.error('Error al cargar movimientos:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return {
    movements,
    total,
    currentStock,
    loading,
    error,
    fetchMovements,
    refreshMovements: fetchMovements
  };
}

/**
 * Hook para estadísticas detalladas de producto
 */
export function useProductDetailedStats(productId: string) {
  const [stats, setStats] = useState<ProductDetailedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (params?: {
    period?: 'month' | 'quarter' | 'year';
    start_date?: string;
    end_date?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductDetailedStats(productId, params);
      setStats(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      console.error('Error al cargar estadísticas detalladas:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats: fetchStats
  };
}
