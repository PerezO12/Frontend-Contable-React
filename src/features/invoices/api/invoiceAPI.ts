/**
 * API client para el módulo de facturas
 * Implementa todas las llamadas al backend siguiendo IMPLEMENTAR.md
 */
import { apiClient } from '@/shared/api/client';
import axios from 'axios';
import { TokenManager } from '@/features/auth/utils/tokenManager';
import { APP_CONFIG } from '@/shared/constants';
import type { 
  InvoiceCreateWithLines,
  InvoiceCreate,
  InvoiceResponse,
  InvoiceWithLines,
  InvoiceFilters,
  InvoiceListResponse,
  InvoiceWorkflowAction,
  InvoiceSummary,
  PaymentSchedulePreview,
  PaymentTermsValidation
} from '../types';

// Cliente API especial para operaciones bulk con timeout extendido
const bulkApiClient = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 60000, // 60 segundos para operaciones bulk
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a operaciones bulk
bulkApiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
   * Listar facturas con filtros avanzados
   * Ahora incluye todas las nuevas capacidades de búsqueda del backend
   */
  static async getInvoices(filters?: InvoiceFilters): Promise<InvoiceListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      // Filtros básicos
      if (filters.status) params.append('status', filters.status);
      if (filters.invoice_type) params.append('invoice_type', filters.invoice_type);
      if (filters.third_party_id) params.append('third_party_id', filters.third_party_id);
      if (filters.currency_code) params.append('currency_code', filters.currency_code);
      if (filters.created_by_id) params.append('created_by_id', filters.created_by_id);
      
      // Filtros de fecha flexibles
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      
      // Búsquedas de texto parciales (nuevas)
      if (filters.invoice_number) params.append('invoice_number', filters.invoice_number);
      if (filters.third_party_name) params.append('third_party_name', filters.third_party_name);
      if (filters.description) params.append('description', filters.description);
      if (filters.reference) params.append('reference', filters.reference);
      
      // Filtros de monto (nuevos)
      if (filters.amount_from !== undefined) params.append('amount_from', filters.amount_from.toString());
      if (filters.amount_to !== undefined) params.append('amount_to', filters.amount_to.toString());
      
      // Ordenamiento (nuevos)
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
      
      // Paginación
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.size) params.append('size', filters.size.toString());
      
      // Legacy search (mantener compatibilidad)
      if (filters.search) params.append('search', filters.search);
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

  // ===== BULK OPERATIONS =====
  /**
   * Validar operación bulk antes de ejecutar
   */
  static async validateBulkOperation(operation: 'post' | 'cancel' | 'reset' | 'delete', invoiceIds: string[]): Promise<{
    operation: string;
    total_requested: number;
    valid_count: number;
    invalid_count: number;
    not_found_count: number;
    valid_invoices: Array<{
      id: string;
      invoice_number: string;
      status: string;
      total_amount: number;
    }>;
    invalid_invoices: Array<{
      id: string;
      invoice_number: string;
      status: string;
      reasons: string[];
    }>;
    not_found_ids: string[];
    can_proceed: boolean;
  }> {
    try {
      console.log('🔍 Validando operación bulk:', { operation, invoiceIds });
      const params = new URLSearchParams();
      params.append('operation', operation);
      invoiceIds.forEach(id => params.append('invoice_ids', id));
      
      const response = await bulkApiClient.post(`${API_BASE}/bulk/validate?${params.toString()}`);
      console.log('✅ Validación exitosa:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en validación bulk:');
      console.error('Operation:', operation);
      console.error('Invoice IDs:', invoiceIds);
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }

  /**
   * Contabilizar múltiples facturas en lote (DRAFT → POSTED)
   */
  static async bulkPostInvoices(data: {
    invoice_ids: string[];
    posting_date?: string;
    notes?: string;
    force_post?: boolean;
    stop_on_error?: boolean;
  }): Promise<{
    total_requested: number;
    successful: number;
    failed: number;
    skipped: number;
    successful_ids: string[];
    failed_items: Array<{
      id: string;
      error: string;
      invoice_number?: string;
    }>;
    skipped_items: Array<{
      id: string;
      reason: string;
      current_status?: string;
    }>;
    execution_time_seconds: number;
  }> {
    const response = await bulkApiClient.post(`${API_BASE}/bulk/post`, data);
    return response.data;
  }

  /**
   * Cancelar múltiples facturas en lote (POSTED → CANCELLED)
   */
  static async bulkCancelInvoices(data: {
    invoice_ids: string[];
    reason?: string;
    stop_on_error?: boolean;
  }): Promise<{
    total_requested: number;
    successful: number;
    failed: number;
    skipped: number;
    successful_ids: string[];
    failed_items: Array<{
      id: string;
      error: string;
      invoice_number?: string;
    }>;
    skipped_items: Array<{
      id: string;
      reason: string;
      current_status?: string;
    }>;
    execution_time_seconds: number;
  }> {
    const response = await bulkApiClient.post(`${API_BASE}/bulk/cancel`, data);
    return response.data;
  }
  /**
   * Restablecer múltiples facturas a borrador (POSTED → DRAFT)
   */
  static async bulkResetToDraftInvoices(data: {
    invoice_ids: string[];
    reason?: string;
    force_reset?: boolean;
    stop_on_error?: boolean;
  }): Promise<{
    total_requested: number;
    successful: number;
    failed: number;
    skipped: number;
    successful_ids: string[];
    failed_items: Array<{
      id: string;
      error: string;
      invoice_number?: string;
    }>;
    skipped_items: Array<{
      id: string;
      reason: string;
      current_status?: string;
    }>;
    execution_time_seconds: number;
  }> {
    try {
      console.log('🔄 Enviando request bulk reset-to-draft:', data);
      const response = await bulkApiClient.post(`${API_BASE}/bulk/reset-to-draft`, data);
      console.log('✅ Respuesta exitosa bulk reset-to-draft:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en bulk reset-to-draft:');
      console.error('Request data:', data);
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      throw error;
    }
  }

  /**
   * Eliminar múltiples facturas en lote (solo DRAFT)
   */
  static async bulkDeleteInvoices(data: {
    invoice_ids: string[];
    confirmation: 'CONFIRM_DELETE';
    reason?: string;
  }): Promise<{
    total_requested: number;
    successful: number;
    failed: number;
    skipped: number;
    successful_ids: string[];
    failed_items: Array<{
      id: string;
      error: string;
      invoice_number?: string;
    }>;
    skipped_items: Array<{
      id: string;
      reason: string;
      current_status?: string;
    }>;
    execution_time_seconds: number;
  }> {
    const response = await bulkApiClient.delete(`${API_BASE}/bulk/delete`, { data });
    return response.data;
  }
  /**
   * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
   * Genera asiento contable automáticamente
   * Usa el endpoint específico POST /invoices/{id}/post
   */
  static async postInvoice(id: string, data?: { notes?: string; posting_date?: string; force_post?: boolean }): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/post`, data || {});
    return response.data;
  }

  /**
   * Cancelar factura (POSTED → CANCELLED)
   * Revierte el asiento contable
   * Usa el endpoint específico POST /invoices/{id}/cancel
   */
  static async cancelInvoice(id: string, data?: { reason?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/cancel`, data || {});
    return response.data;
  }

  /**
   * Restablecer a borrador (ANY → DRAFT)
   * Usa el endpoint específico POST /invoices/{id}/reset-to-draft
   */
  static async resetToDraft(id: string, data?: { reason?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/reset-to-draft`, data || {});
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
   * NUEVO: Vista previa de cómo se dividirán los pagos según payment terms (Flujo Odoo)
   */
  static async getPaymentSchedulePreview(id: string): Promise<PaymentSchedulePreview[]> {
    const response = await apiClient.get<PaymentSchedulePreview[]>(`${API_BASE}/${id}/payment-schedule-preview`);
    return response.data;
  }

  /**
   * NUEVO: Validar condiciones de pago para uso en facturas (Flujo Odoo)
   */
  static async validatePaymentTerms(paymentTermsId: string): Promise<PaymentTermsValidation> {
    const response = await apiClient.get<PaymentTermsValidation>(`${API_BASE}/payment-terms/${paymentTermsId}/validate`);
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
   * Duplicar factura
   */
  static async duplicateInvoice(id: string): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/duplicate`);
    return response.data;
  }
  /**
   * Métodos legacy para compatibilidad con el store existente
   */
  static async createInvoice(data: InvoiceCreateWithLines): Promise<InvoiceWithLines> {
    // Alias para createInvoiceWithLines
    return this.createInvoiceWithLines(data);
  }

  /**
   * Confirmar factura (DRAFT → PENDING) - método legacy
   * Nota: En el flujo actual se usa directamente postInvoice
   */
  static async confirmInvoice(id: string, data?: { notes?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/confirm`, data || {});
    return response.data;
  }

  /**
   * Marcar como pagada - método para marcar factura como pagada
   * Usa endpoint específico POST /invoices/{id}/mark-paid
   */
  static async markAsPaid(id: string, data?: { notes?: string }): Promise<InvoiceResponse> {
    const response = await apiClient.post<InvoiceResponse>(`${API_BASE}/${id}/mark-paid`, data || {});
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
