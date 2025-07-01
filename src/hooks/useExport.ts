import { useState } from 'react';
import { ExportService } from '../services/exportService';
import { ExportService as GenericExportService } from '../shared/services/exportService';
import { ProductService } from '../features/products/services/productService';
import { CostCenterService } from '../features/cost-centers/services/costCenterService';
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
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any) => {
    try {
      setIsExporting(true);
      setError(null);
      
      console.log('Exportando terceros con opciones:', { format, options });
      
      // Determinar IDs a exportar
      let thirdPartyIds: string[] = [];
      
      if (options.scope === 'selected' && options.selectedItems) {
        thirdPartyIds = options.selectedItems.map((thirdParty: any) => thirdParty.id);
      } else {
        // Para scope 'all', obtener todos los terceros con los filtros actuales
        console.log('Obteniendo todos los terceros con filtros:', options.filters);
        
        // Obtener todos los terceros aplicando los filtros actuales
        const { ThirdPartyService } = await import('../features/third-parties/services');
        const allThirdPartiesResponse = await ThirdPartyService.getThirdParties(options.filters);
        thirdPartyIds = allThirdPartiesResponse.items.map((thirdParty: any) => thirdParty.id);
        
        console.log(`Se encontraron ${thirdPartyIds.length} terceros para exportar`);
      }
      
      if (thirdPartyIds.length === 0) {
        throw new Error('No hay terceros para exportar con los filtros aplicados');
      }
      
      // Usar ThirdPartyService.exportThirdParties que usa el sistema genérico
      const { ThirdPartyService } = await import('../features/third-parties/services');
      const blob = await ThirdPartyService.exportThirdParties(
        thirdPartyIds,
        format as 'csv' | 'xlsx' | 'json'
      );
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `terceros_${thirdPartyIds.length}_registros_${timestamp}.${format}`;
      
      // Descargar archivo
      GenericExportService.downloadBlob(blob, filename);
      
      console.log(`✅ Exportación de terceros completada: ${filename}`);
      
    } catch (error) {
      console.error('Error al exportar terceros:', error);
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

export const useAccountsExport = () => {
  return useExport({
    entityName: 'cuentas',
    exportFunction: ExportService.exportAccounts
  });
};

export const useCostCentersExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any) => {
    try {
      setIsExporting(true);
      setError(null);
      
      console.log('Exportando centros de costo con opciones:', { format, options });
      
      // Determinar IDs a exportar
      let costCenterIds: string[] = [];
      
      if (options.scope === 'selected' && options.selectedItems) {
        costCenterIds = options.selectedItems.map((costCenter: any) => costCenter.id);
      } else {
        // Para scope 'all', obtener todos los centros de costo con los filtros actuales
        console.log('Obteniendo todos los centros de costo con filtros:', options.filters);
        
        // Obtener todos los centros de costo aplicando los filtros actuales
        const allCostCentersResponse = await CostCenterService.getCostCenters(options.filters);
        costCenterIds = allCostCentersResponse.data.map((costCenter: any) => costCenter.id);
        
        console.log(`Se encontraron ${costCenterIds.length} centros de costo para exportar`);
      }
      
      if (costCenterIds.length === 0) {
        throw new Error('No hay centros de costo para exportar con los filtros aplicados');
      }
      
      // Usar CostCenterService.exportCostCenters que usa el sistema genérico
      const blob = await CostCenterService.exportCostCenters(
        costCenterIds,
        format as 'csv' | 'xlsx' | 'json'
      );
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `centros_de_costo_${costCenterIds.length}_registros_${timestamp}.${format}`;
      
      // Descargar archivo
      GenericExportService.downloadBlob(blob, filename);
      
      console.log(`✅ Exportación de centros de costo completada: ${filename}`);
      
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
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

export const useJournalEntriesExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any) => {
    try {
      setIsExporting(true);
      setError(null);
      
      console.log('Exportando asientos contables con opciones:', { format, options });
      
      // Determinar IDs a exportar
      let entryIds: string[] = [];
      
      if (options.scope === 'selected' && options.selectedItems) {
        entryIds = options.selectedItems.map((entry: any) => entry.id);
      } else {
        // Para scope 'all', obtener todos los asientos con los filtros actuales
        console.log('Obteniendo todos los asientos contables con filtros:', options.filters);
        
        // Obtener todos los asientos aplicando los filtros actuales
        const { JournalEntryService } = await import('../features/journal-entries/services');
        const allEntriesResponse = await JournalEntryService.getJournalEntries(options.filters);
        entryIds = allEntriesResponse.items.map((entry: any) => entry.id);
        
        console.log(`Se encontraron ${entryIds.length} asientos contables para exportar`);
      }
      
      if (entryIds.length === 0) {
        throw new Error('No hay asientos contables para exportar con los filtros aplicados');
      }
      
      // Usar JournalEntryService.exportJournalEntries que usa el sistema genérico
      const { JournalEntryService } = await import('../features/journal-entries/services');
      const blob = await JournalEntryService.exportJournalEntries(
        entryIds,
        format as 'csv' | 'xlsx' | 'json'
      );
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `asientos_contables_${entryIds.length}_registros_${timestamp}.${format}`;
      
      // Descargar archivo
      const { ExportService } = await import('../shared/services/exportService');
      ExportService.downloadBlob(blob, filename);
      
      console.log(`✅ Exportación de asientos contables completada: ${filename}`);
      
    } catch (error) {
      console.error('Error al exportar asientos contables:', error);
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

export const useInvoicesExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: string, options: any) => {
    try {
      setIsExporting(true);
      setError(null);
      
      console.log('Exportando facturas con opciones:', { format, options });
      
      // Determinar IDs a exportar
      let invoiceIds: string[] = [];
      
      if (options.scope === 'selected' && options.selectedItems) {
        invoiceIds = options.selectedItems.map((invoice: any) => invoice.id);
      } else {
        // Para scope 'all', obtener todas las facturas con los filtros actuales
        console.log('Obteniendo todas las facturas con filtros:', options.filters);
        
        // Obtener todas las facturas aplicando los filtros actuales
        const { InvoiceService } = await import('../features/invoices/services');
        const allInvoicesResponse = await InvoiceService.getInvoices(options.filters);
        invoiceIds = allInvoicesResponse.items.map((invoice: any) => invoice.id);
        
        console.log(`Se encontraron ${invoiceIds.length} facturas para exportar`);
      }
      
      if (invoiceIds.length === 0) {
        throw new Error('No hay facturas para exportar con los filtros aplicados');
      }
      
      // Usar InvoiceService.exportInvoices que usa el sistema genérico
      const { InvoiceService } = await import('../features/invoices/services');
      const blob = await InvoiceService.exportInvoices(
        invoiceIds,
        format as 'csv' | 'xlsx' | 'json'
      );
      
      // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `facturas_${invoiceIds.length}_registros_${timestamp}.${format}`;
      
      // Descargar archivo
      const { ExportService } = await import('../shared/services/exportService');
      ExportService.downloadBlob(blob, filename);
      
      console.log(`✅ Exportación de facturas completada: ${filename}`);
      
    } catch (error) {
      console.error('Error al exportar facturas:', error);
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

export const useJournalsExport = () => {
  return useExport({
    entityName: 'diarios',
    exportFunction: ExportService.exportJournals
  });
};
