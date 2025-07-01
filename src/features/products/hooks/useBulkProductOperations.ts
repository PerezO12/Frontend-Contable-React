/**
 * Hook personalizado para operaciones bulk en productos
 * Basado en el hook de facturas pero adaptado para productos
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useToast } from '@/shared/contexts/ToastContext';
import { ProductService } from '../services';
import type { Product } from '../types';

interface UseBulkProductOperationsProps {
  products: Product[];
  onOperationComplete?: () => void;
}

interface BulkSelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function useBulkProductOperations({
  products,
  onOperationComplete
}: UseBulkProductOperationsProps) {
  const { showToast } = useToast();
  
  // Usar ref para mantener referencia estable a los productos
  const productsRef = useRef<Product[]>(products);
  
  // Actualizar ref cuando cambien los productos
  useEffect(() => {
    productsRef.current = products;
  }, [products]);
  
  // Estado de selección
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track products length separately for stable dependencies
  const [productsLength, setProductsLength] = useState(products.length);
  
  // Update products length when products change
  useEffect(() => {
    setProductsLength(products.length);
  }, [products.length]);

  // Estado calculado de selección - crear objeto estable
  const selectionState: BulkSelectionState = useMemo(() => {
    const selectedCount = selectedIds.size;
    
    const state = {
      selectedIds,
      isAllSelected: productsLength > 0 && selectedCount === productsLength,
      isIndeterminate: selectedCount > 0 && selectedCount < productsLength
    };
    
    return state;
  }, [selectedIds, productsLength]); // Include selectedIds to track changes

  // Manejar selección individual
  const toggleSelection = useCallback((productId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  // Manejar selección múltiple (todos/ninguno)
  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      const currentProducts = productsRef.current;
      const selectedCount = prev.size;
      const totalProducts = currentProducts.length;
      const isAllSelected = totalProducts > 0 && selectedCount === totalProducts;
      
      if (isAllSelected) {
        return new Set();
      } else {
        return new Set(currentProducts.map(product => product.id));
      }
    });
  }, []); // No dependencies needed

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Actualizar selección externamente (para sincronizar con ListView)
  const updateSelection = useCallback((newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
  }, []);

  // Ejecutar activación masiva
  const bulkActivateProducts = useCallback(async (options: { reason?: string }) => {
    const currentSelectedIds = selectedIds; // Capture current selection
    if (currentSelectedIds.size === 0) {
      showToast('Debe seleccionar al menos un producto', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      // Para cada producto seleccionado, cambiarlo a activo
      const promises = Array.from(currentSelectedIds).map(async (productId) => {
        const product = productsRef.current.find(p => p.id === productId);
        if (!product) return { success: false, error: 'Producto no encontrado' };

        try {
          await ProductService.updateProduct(productId, {
            status: 'active',
            notes: options.reason ? `Activado masivamente: ${options.reason}` : 'Activado masivamente'
          });
          return { success: true, productId };
        } catch (error: any) {
          return { success: false, productId, error: error.message };
        }
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        showToast(
          `${successful} producto${successful !== 1 ? 's' : ''} activado${successful !== 1 ? 's' : ''} exitosamente`,
          'success'
        );
      }

      if (failed > 0) {
        showToast(
          `${failed} producto${failed !== 1 ? 's' : ''} fallaron en la activación`,
          'error'
        );
      }

      clearSelection();
      onOperationComplete?.();
    } catch (error: any) {
      showToast(
        error.message || 'Error en la activación masiva',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]);

  // Ejecutar desactivación masiva
  const bulkDeactivateProducts = useCallback(async (options: { reason?: string }) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos un producto', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const promises = Array.from(selectedIds).map(async (productId) => {
        const product = productsRef.current.find(p => p.id === productId);
        if (!product) return { success: false, error: 'Producto no encontrado' };

        try {
          await ProductService.updateProduct(productId, {
            status: 'inactive',
            notes: options.reason ? `Desactivado masivamente: ${options.reason}` : 'Desactivado masivamente'
          });
          return { success: true, productId };
        } catch (error: any) {
          return { success: false, productId, error: error.message };
        }
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        showToast(
          `${successful} producto${successful !== 1 ? 's' : ''} desactivado${successful !== 1 ? 's' : ''} exitosamente`,
          'success'
        );
      }

      if (failed > 0) {
        showToast(
          `${failed} producto${failed !== 1 ? 's' : ''} fallaron en la desactivación`,
          'error'
        );
      }

      clearSelection();
      onOperationComplete?.();
    } catch (error: any) {
      showToast(
        error.message || 'Error en la desactivación masiva',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]); // Removed products dependency

  // Ejecutar eliminación masiva
  const bulkDeleteProducts = useCallback(async (options: { reason: string }) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos un producto', 'warning');
      return;
    }

    if (!options.reason?.trim()) {
      showToast('Debe proporcionar un motivo para la eliminación', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const promises = Array.from(selectedIds).map(async (productId) => {
        const product = productsRef.current.find(p => p.id === productId);
        if (!product) return { success: false, error: 'Producto no encontrado' };

        try {
          await ProductService.deleteProduct(productId);
          return { success: true, productId };
        } catch (error: any) {
          return { success: false, productId, error: error.message };
        }
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        showToast(
          `${successful} producto${successful !== 1 ? 's' : ''} eliminado${successful !== 1 ? 's' : ''} exitosamente`,
          'success'
        );
      }

      if (failed > 0) {
        const errorDetails = results
          .filter(r => !r.success)
          .map(r => r.error)
          .slice(0, 3) // Mostrar solo los primeros 3 errores
          .join(', ');
        
        showToast(
          `${failed} producto${failed !== 1 ? 's' : ''} fallaron en la eliminación${failed <= 3 ? `: ${errorDetails}` : ''}`,
          'error'
        );
      }

      clearSelection();
      onOperationComplete?.();
    } catch (error: any) {
      showToast(
        error.message || 'Error en la eliminación masiva',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]); // Removed products dependency

  // Exportar productos seleccionados
  const bulkExportProducts = useCallback((selectedProducts: Product[]) => {
    if (selectedProducts.length === 0) {
      showToast('No hay productos seleccionados para exportar', 'warning');
      return;
    }

    // Crear un modal de exportación o usar el servicio de exportación directamente
    showToast(
      `Iniciando exportación de ${selectedProducts.length} producto${selectedProducts.length !== 1 ? 's' : ''}...`,
      'info'
    );

    // Aquí se puede integrar con el modal de exportación existente
    // o llamar directamente al servicio de exportación
  }, [showToast]);

  return {
    // Estado de selección
    selectionState,
    selectedIds,
    selectedCount: selectedIds.size,
    totalProducts: productsLength,
    
    // Estados de procesamiento
    isProcessing,
    
    // Acciones de selección
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    updateSelection,
    
    // Operaciones bulk
    bulkActivateProducts,
    bulkDeactivateProducts,
    bulkDeleteProducts,
    bulkExportProducts
  };
}
