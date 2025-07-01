import { useState } from 'react';
import { ExportService } from '../services/exportService';
import { ExportService as GenericExportService } from '../shared/services/exportService';
import { ProductService } from '../features/products/services/productService';
import type { ExportParams } from '../services/exportService';

export interface UseExportOptions {
  entityName: string;
  exportFunction: (params: ExportParams) => Promise<void>;
}

export interface UseExportReturn {
  isExporting: boolean;
  error: string | null;
  exportData: (format: string, options?: any) => Promise<void>;
  clearError: () => void;
}

export const useExport = ({ entityName, exportFunction }: UseExportOptions): UseExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any = {}) => {
    setIsExporting(true);
    setError(null);

    try {
      const params: ExportParams = {
        format: format as 'csv' | 'xlsx' | 'json',
        filters: options.filters,
        scope: options.scope || 'all',
        selectedIds: options.selectedItems ? options.selectedItems.map((item: any) => item.id) : undefined,
        includeFilters: options.includeFilters ?? true,
        ...options
      };

      await exportFunction(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error al exportar ${entityName}`;
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isExporting,
    error,
    exportData,
    clearError
  };
};

// Hooks específicos para cada entidad
export const useProductsExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any) => {
    try {
      setIsExporting(true);
      setError(null);
      
      console.log('Exportando productos con opciones:', { format, options });
      
      // Determinar IDs a exportar
      let productIds: string[] = [];
      
      if (options.scope === 'selected' && options.selectedItems) {
        productIds = options.selectedItems.map((product: any) => product.id);
      } else {
        // Para scope 'all', obtener todos los productos con los filtros actuales
        console.log('Obteniendo todos los productos con filtros:', options.filters);
        
        // Obtener todos los productos aplicando los filtros actuales
        const allProductsResponse = await ProductService.getProducts(options.filters);
        productIds = allProductsResponse.items.map((product: any) => product.id);
        
        console.log(`Se encontraron ${productIds.length} productos para exportar`);
      }
      
      if (productIds.length === 0) {
        throw new Error('No hay productos para exportar con los filtros aplicados');
      }
      
      // Usar ProductService.exportProducts que usa el sistema genérico
      const blob = await ProductService.exportProducts(
        productIds,
        format as 'csv' | 'xlsx' | 'json'
      );
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `productos_${productIds.length}_registros_${timestamp}.${format}`;
      
      // Descargar archivo
      GenericExportService.downloadBlob(blob, filename);
      
      console.log(`✅ Exportación de productos completada: ${filename}`);
      
    } catch (error) {
      console.error('Error al exportar productos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isExporting,
    error,
    exportData,
    clearError
  };
};

export const useThirdPartiesExport = () => {
  return useExport({
    entityName: 'terceros',
    exportFunction: ExportService.exportThirdParties
  });
};

export const useAccountsExport = () => {
  return useExport({
    entityName: 'cuentas',
    exportFunction: ExportService.exportAccounts
  });
};

export const useCostCentersExport = () => {
  return useExport({
    entityName: 'centros de costo',
    exportFunction: ExportService.exportCostCenters
  });
};

export const useJournalEntriesExport = () => {
  return useExport({
    entityName: 'asientos contables',
    exportFunction: ExportService.exportJournalEntries
  });
};

export const useInvoicesExport = () => {
  return useExport({
    entityName: 'facturas',
    exportFunction: ExportService.exportInvoices
  });
};

export const useJournalsExport = () => {
  return useExport({
    entityName: 'diarios',
    exportFunction: ExportService.exportJournals
  });
};
