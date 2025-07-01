/**
 * Servicio para el manejo de facturas
 * Implementa el patrón genérico de exportación y operaciones CRUD
 */
import { ExportService } from '../../../shared/services/exportService';
import { InvoiceAPI } from '../api/invoiceAPI';
import type { 
  InvoiceFilters,
  InvoiceListResponse,
  InvoiceResponse,
  InvoiceCreateWithLines,
  InvoiceWithLines
} from '../types';

export class InvoiceService {
  /**
   * Obtener facturas con filtros y paginación
   */
  static async getInvoices(filters?: InvoiceFilters): Promise<InvoiceListResponse> {
    return await InvoiceAPI.getInvoices(filters);
  }

  /**
   * Obtener factura por ID
   */
  static async getInvoice(id: string): Promise<InvoiceResponse> {
    return await InvoiceAPI.getInvoice(id);
  }

  /**
   * Crear factura con líneas
   */
  static async createInvoiceWithLines(data: InvoiceCreateWithLines): Promise<InvoiceWithLines> {
    return await InvoiceAPI.createInvoiceWithLines(data);
  }

  /**
   * Actualizar factura
   */
  static async updateInvoice(id: string, data: Partial<InvoiceCreateWithLines>): Promise<InvoiceResponse> {
    return await InvoiceAPI.updateInvoice(id, data);
  }

  /**
   * Eliminar factura
   */
  static async deleteInvoice(id: string): Promise<void> {
    return await InvoiceAPI.deleteInvoice(id);
  }

  /**
   * Exportar facturas - Método específico que usa ExportService genérico
   * Siguiendo el patrón de productos, terceros y asientos contables
   */
  static async exportInvoices(
    ids: string[],
    format: 'csv' | 'xlsx' | 'json' = 'xlsx'
  ): Promise<Blob> {
    return await ExportService.exportByIds({
      table: 'invoices',
      format,
      ids,
      file_name: ExportService.generateFileName('facturas', format)
    });
  }

  /**
   * Operaciones masivas
   */
  static async bulkPostInvoices(request: any) {
    return await InvoiceAPI.bulkPostInvoices(request);
  }

  static async bulkCancelInvoices(request: any) {
    return await InvoiceAPI.bulkCancelInvoices(request);
  }

  static async bulkResetToDraftInvoices(request: any) {
    return await InvoiceAPI.bulkResetToDraftInvoices(request);
  }

  static async bulkDeleteInvoices(request: any) {
    return await InvoiceAPI.bulkDeleteInvoices(request);
  }
}
