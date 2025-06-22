import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services';
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
  ProductStatistics,
  ProductSummary,
  LowStockProduct,
  ProductDeletionValidation,
  BulkProductDeleteResult,
  BulkProductOperationResult,
  StockAdjustmentResult
} from '../types';

/**
 * Hook para manejar la lista de productos con filtros
 */
export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 50,
    pages: 1
  });
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProducts(filters);
      setProducts(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        per_page: response.per_page,
        pages: response.pages
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refetchWithFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    // El fetchProducts se ejecutará automáticamente por el useEffect cuando cambien los filters
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);
  // Función para validar eliminación
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

  // Función para eliminar múltiples productos
  const bulkDeleteProducts = useCallback(async (productIds: string[]): Promise<BulkProductDeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.bulkDeleteProducts(productIds);
      
      // Refrescar la lista después de la eliminación
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar productos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Función para desactivar múltiples productos
  const bulkDeactivateProducts = useCallback(async (productIds: string[]): Promise<BulkProductOperationResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.bulkDeactivateProducts(productIds);
      
      // Refrescar la lista después de la desactivación
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar productos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Función para activar producto
  const activateProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.activateProduct(id);
      
      // Refrescar la lista después de la activación
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Función para desactivar producto
  const deactivateProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.deactivateProduct(id);
      
      // Refrescar la lista después de la desactivación
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Función para descontinuar producto
  const discontinueProduct = useCallback(async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.discontinueProduct(id);
      
      // Refrescar la lista después de descontinuar
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al descontinuar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Función para ajustar stock
  const adjustStock = useCallback(async (id: string, adjustment: {
    adjustment_type: 'increase' | 'decrease' | 'set';
    quantity: number;
    reason: string;
    unit_cost?: number;
    reference_document?: string;
  }): Promise<StockAdjustmentResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.adjustStock(id, adjustment);
      
      // Refrescar la lista después del ajuste
      await fetchProducts();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al ajustar stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);  return {
    products,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refetchWithFilters,
    resetFilters,
    refreshProducts,
    // Nuevas funciones agregadas
    validateDeletion,
    bulkDeleteProducts,
    bulkDeactivateProducts,
    activateProduct,
    deactivateProduct,
    discontinueProduct,
    adjustStock
  };
}

/**
 * Hook para búsqueda de productos
 */
export function useProductSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalFound, setTotalFound] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const searchProducts = useCallback(async (query: string, limit: number = 20) => {
    if (!query.trim()) {
      setResults([]);
      setTotalFound(0);
      setSearchTerm('');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchTerm(query);
    
    try {
      const response = await ProductService.searchProducts(query, limit);
      setResults(response.results);
      setTotalFound(response.total_found);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar productos';
      setError(errorMessage);
      console.error('Error al buscar productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setTotalFound(0);
    setSearchTerm('');
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    totalFound,
    searchTerm,
    searchProducts,
    clearSearch
  };
}

/**
 * Hook para obtener un producto específico
 */
export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductById(id);
      setProduct(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar producto';
      setError(errorMessage);
      console.error('Error al cargar producto:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  const refreshProduct = useCallback(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refreshProduct
  };
}

/**
 * Hook para crear productos
 */
export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (productData: ProductCreate): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.createProduct(productData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto';
      setError(errorMessage);
      console.error('Error al crear producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    loading,
    error
  };
}

/**
 * Hook para actualizar productos
 */
export function useUpdateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = useCallback(async (id: string, productData: ProductUpdate): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.updateProduct(id, productData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(errorMessage);
      console.error('Error al actualizar producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateProduct,
    loading,
    error
  };
}

/**
 * Hook para eliminar productos
 */
export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await ProductService.deleteProduct(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(errorMessage);
      console.error('Error al eliminar producto:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteProduct,
    loading,
    error
  };
}

/**
 * Hook para obtener estadísticas de productos
 */
export function useProductStatistics() {
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductStatistics();
      setStatistics(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refreshStatistics: fetchStatistics
  };
}

/**
 * Hook para obtener productos para selectors
 */
export function useProductsForSelector(limit: number = 100) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getProductsForSelector(limit);
      setProducts(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error al cargar productos para selector:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts
  };
}

/**
 * Hook para validar disponibilidad de stock
 */
export function useStockValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateStock = useCallback(async (productId: string, requiredQuantity: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.validateStockAvailability(productId, requiredQuantity);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar stock';
      setError(errorMessage);
      console.error('Error al validar stock:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    validateStock,
    loading,
    error
  };
}

/**
 * Hook para obtener productos con stock bajo
 */
export function useLowStockProducts() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLowStockProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getLowStockProducts();
      setProducts(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos con stock bajo';
      setError(errorMessage);
      console.error('Error al cargar productos con stock bajo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchLowStockProducts
  };
}

/**
 * Hook para alternar estado de productos
 */
export function useToggleProductStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = useCallback(async (id: string, isActive: boolean): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.toggleProductStatus(id, isActive);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del producto';
      setError(errorMessage);
      console.error('Error al cambiar estado del producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    toggleStatus,
    loading,
    error
  };
}
