/**
 * API client para el módulo de facturas
 * Implementa todas las llamadas al backend siguiendo IMPLEMENTAR.md
 */
import { apiClient } from '@/shared/api/client';
import type { 
  InvoiceCreateWithLines,
  InvoiceCreate,
  InvoiceResponse,
  InvoiceWithLines,
  InvoiceFilters,
  InvoiceListResponse,
  InvoiceWorkflowAction,
  InvoiceSummary
} from '../types';

const API_BASE = '/api/v1/invoices';

export class InvoiceAPI {
  /**
   * PASO 2 DEL FLUJO ODOO: Crear factura completa con líneas (endpoint principal)
   * Usa InvoiceCreateWithLines según IMPLEMENTAR.md
   */
  static async createInvoiceWithLines(data: InvoiceCreateWithLines): Promise<InvoiceWithLines> {
    const response = await apiClient.post<InvoiceWithLines>(API_BASE, data);
    return response.data;
  }

  /**
   * Crear solo encabezado de factura (para casos especiales)
   */
  static async createInvoiceHeaderOnly(data: InvoiceCreate): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/header-only`, data);
    return response.data;
  }

  /**
   * Obtener factura por ID
   */
  static async getInvoice(id: string): Promise<InvoiceResponse> {
    const response = await apiClient.get<InvoiceResponse>(`${API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Obtener factura con líneas completas
   */
  static async getInvoiceWithLines(id: string): Promise<InvoiceWithLines> {
    const response = await apiClient.get<InvoiceWithLines>(`${API_BASE}/${id}/with-lines`);
    return response.data;
  }

  /**
   * Listar facturas con filtros
   */
  static async getInvoices(filters?: InvoiceFilters): Promise<InvoiceListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<InvoiceListResponse>(`${API_BASE}?${params.toString()}`);
    return response.data;
  }

  /**
   * Actualizar factura (solo en estado DRAFT)
   */
  static async updateInvoice(id: string, data: Partial<InvoiceCreate>): Promise<InvoiceResponse> {
    const response = await apiClient.put<InvoiceResponse>(`${API_BASE}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar factura (solo en estado DRAFT)
   */
  static async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`${API_BASE}/${id}`);
  }

  /**
   * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
   * Genera asiento contable automáticamente
   */
  static async postInvoice(id: string, data?: { notes?: string; posting_date?: string; force_post?: boolean }): Promise<InvoiceResponse> {
    const response = await apiClient.put<InvoiceResponse>(`${API_BASE}/${id}/post`, data || {});
    return response.data;
  }

  /**
   * Cancelar factura (POSTED → CANCELLED)
   * Revierte el asiento contable
   */
  static async cancelInvoice(id: string, data?: { reason?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.put<InvoiceResponse>(`${API_BASE}/${id}/cancel`, data || {});
    return response.data;
  }

  /**
   * Restablecer a borrador (ANY → DRAFT)
   */
  static async resetToDraft(id: string, data?: { reason?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.put<InvoiceResponse>(`${API_BASE}/${id}/reset-to-draft`, data || {});
    return response.data;
  }

  /**
   * Ejecutar acción de workflow
   */
  static async executeWorkflowAction(id: string, action: InvoiceWorkflowAction): Promise<InvoiceResponse> {
    switch (action.action) {
      case 'post':
        return this.postInvoice(id, { 
          notes: action.notes, 
          posting_date: action.posting_date,
          force_post: action.force_post 
        });
      case 'cancel':
        return this.cancelInvoice(id, { reason: action.notes });
      case 'reset_to_draft':
        return this.resetToDraft(id, { reason: action.notes });
      default:
        throw new Error(`Acción no válida: ${action.action}`);
    }
  }

  /**
   * Obtener resumen estadístico de facturas
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

    const response = await apiClient.get<InvoiceSummary>(`${API_BASE}/summary/statistics?${params.toString()}`);
    return response.data;
  }

  /**
   * Obtener asiento contable de una factura contabilizada
   */
  static async getInvoiceJournalEntry(id: string): Promise<any> {
    const response = await apiClient.get(`${API_BASE}/${id}/journal-entry`);
    return response.data;
  }

  /**
   * Obtener pagos aplicados a una factura
   */
  static async getInvoicePayments(id: string): Promise<any[]> {
    const response = await apiClient.get(`${API_BASE}/${id}/payments`);
    return response.data;
  }

  /**
   * Operaciones masivas - Contabilizar múltiples facturas
   */
  static async bulkPostInvoices(ids: string[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> {
    const response = await apiClient.put(`${API_BASE}/bulk/post`, { invoice_ids: ids });
    return response.data;
  }

  /**
   * Operaciones masivas - Cancelar múltiples facturas
   */
  static async bulkCancelInvoices(ids: string[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> {
    const response = await apiClient.put(`${API_BASE}/bulk/cancel`, { invoice_ids: ids });
    return response.data;
  }

  /**
   * Duplicar factura
   */
  static async duplicateInvoice(id: string): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/duplicate`);
    return response.data;
  }

  /**
   * Validar datos de factura antes de crear/actualizar
   */
  static async validateInvoiceData(data: InvoiceCreateWithLines): Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await apiClient.post(`${API_BASE}/validate`, data);
    return response.data;
  }

  /**
   * Calcular totales de factura
   */
  static async calculateInvoiceTotals(lines: any[]): Promise<{
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
  }> {
    const response = await apiClient.post(`${API_BASE}/calculate-totals`, { lines });
    return response.data;
  }
}

// Alias para compatibilidad
export const invoiceAPI = InvoiceAPI;
