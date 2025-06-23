/**
 * API client para el módulo de facturas
 * Implementa todas las llamadas al backend siguiendo el flujo de Odoo
 */
import { apiClient } from '@/shared/api/client';
import type { 
  Invoice, 
  InvoiceCreateData, 
  InvoiceUpdateData, 
  InvoiceFilters,
  InvoiceWorkflowAction,
  InvoiceSummary 
} from '../types';

const API_BASE = '/api/v1/invoices';

export class InvoiceAPI {
  /**
   * PASO 2 DEL FLUJO ODOO: Crear factura borrador
   */
  static async createInvoice(data: InvoiceCreateData): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(API_BASE, data);
    return response.data;
  }
  /**
   * Obtener factura por ID
   */
  static async getInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`${API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Obtener factura con líneas completas
   */
  static async getInvoiceWithLines(id: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`${API_BASE}/${id}/with-lines`);
    return response.data;
  }

  /**
   * Listar facturas con filtros
   */
  static async getInvoices(filters?: InvoiceFilters): Promise<{
    items: Invoice[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`${API_BASE}?${params.toString()}`);
    return response.data;
  }

  /**
   * Actualizar factura
   */
  static async updateInvoice(data: InvoiceUpdateData): Promise<Invoice> {
    const { id, ...updateData } = data;
    const response = await apiClient.put<Invoice>(`${API_BASE}/${id}`, updateData);
    return response.data;
  }

  /**
   * Eliminar factura
   */
  static async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`${API_BASE}/${id}`);
  }

  /**
   * PASO 3 DEL FLUJO ODOO: Confirmar factura
   */
  static async confirmInvoice(id: string, data?: { notes?: string }): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${API_BASE}/${id}/confirm`, data || {});
    return response.data;
  }

  /**
   * PASO 3 DEL FLUJO ODOO: Emitir/contabilizar factura (genera asiento automático)
   */
  static async postInvoice(id: string, data?: { notes?: string }): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${API_BASE}/${id}/post`, data || {});
    return response.data;
  }

  /**
   * Marcar factura como pagada
   */
  static async markAsPaid(id: string, data?: { notes?: string }): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${API_BASE}/${id}/mark-paid`, data || {});
    return response.data;
  }

  /**
   * Cancelar factura
   */
  static async cancelInvoice(id: string, data?: { reason?: string }): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${API_BASE}/${id}/cancel`, data || {});
    return response.data;
  }

  /**
   * Ejecutar acción de workflow
   */
  static async executeWorkflowAction(id: string, action: InvoiceWorkflowAction): Promise<Invoice> {
    switch (action.action) {
      case 'confirm':
        return this.confirmInvoice(id, { notes: action.notes });
      case 'post':
        return this.postInvoice(id, { notes: action.notes });
      case 'mark_paid':
        return this.markAsPaid(id, { notes: action.notes });
      case 'cancel':
        return this.cancelInvoice(id, { reason: action.notes });
      default:
        throw new Error(`Acción no válida: ${action.action}`);
    }
  }

  /**
   * Obtener resumen de facturas
   */
  static async getInvoiceSummary(filters?: Partial<InvoiceFilters>): Promise<InvoiceSummary> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<InvoiceSummary>(`${API_BASE}/summary?${params.toString()}`);
    return response.data;
  }

  /**
   * Duplicar factura
   */
  static async duplicateInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`${API_BASE}/${id}/duplicate`);
    return response.data;
  }

  /**
   * Obtener facturas vencidas
   */
  static async getOverdueInvoices(filters?: Partial<InvoiceFilters>): Promise<Invoice[]> {
    const params = new URLSearchParams();
    params.append('status', 'overdue');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'status') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`${API_BASE}?${params.toString()}`);
    return response.data.items;
  }

  /**
   * Validar datos de factura antes de crear/actualizar
   */
  static async validateInvoiceData(data: InvoiceCreateData | InvoiceUpdateData): Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await apiClient.post(`${API_BASE}/validate`, data);
    return response.data;
  }
}
