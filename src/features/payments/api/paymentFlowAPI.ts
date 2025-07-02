/**
 * Cliente API para el flujo de pagos
 * Implementa todas las operaciones del backend payment-flow
 */
import { apiClient } from '@/shared/api/client';
import type {
  PaymentFlowImportRequest,
  PaymentFlowImportResult,
  PaymentFlowStatus,
  PaymentConfirmation,
  PaymentBatchConfirmation,
  PaymentReconciliationSummary,
  Payment,
  PaymentCreate,
  BankExtract,
  PaymentListResponse,
  BankExtractListResponse,
  PaymentFilters,
  BankExtractFilters,
  FileImportRequest
} from '../types';

const API_BASE = '/api/v1/payment-flow';

export class PaymentFlowAPI {
  /**
   * PASO 2 DEL FLUJO: Importar extracto bancario con auto-matching
   */
  static async importBankStatement(data: PaymentFlowImportRequest): Promise<PaymentFlowImportResult> {
    const response = await apiClient.post<PaymentFlowImportResult>(`${API_BASE}/import`, data);
    return response.data;
  }

  /**
   * Importar extracto desde archivo (CSV, Excel)
   */
  static async importFromFile(data: FileImportRequest): Promise<PaymentFlowImportResult> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('format', data.format);
    if (data.extract_reference) {
      formData.append('extract_reference', data.extract_reference);
    }

    const response = await apiClient.post<PaymentFlowImportResult>(
      `${API_BASE}/import-file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * PASO 3 DEL FLUJO: Confirmar pago individual
   */
  static async confirmPayment(paymentId: string): Promise<PaymentConfirmation> {
    const response = await apiClient.post<PaymentConfirmation>(`${API_BASE}/confirm/${paymentId}`);
    return response.data;
  }

  /**
   * Confirmar múltiples pagos en lote
   */
  static async batchConfirmPayments(paymentIds: string[]): Promise<PaymentBatchConfirmation> {
    const response = await apiClient.post<PaymentBatchConfirmation>(
      `${API_BASE}/batch-confirm`,
      { payment_ids: paymentIds }
    );
    return response.data;
  }

  /**
   * Obtener estado del flujo de pagos para un extracto
   */
  static async getPaymentFlowStatus(extractId: string): Promise<PaymentFlowStatus> {
    const response = await apiClient.get<PaymentFlowStatus>(`${API_BASE}/status/${extractId}`);
    return response.data;
  }

  /**
   * Obtener lista de pagos en borrador pendientes
   */
  static async getDraftPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      // Solo pagos DRAFT
      params.append('status', 'DRAFT');
      
      if (filters.payment_type) params.append('payment_type', filters.payment_type);
      if (filters.partner_id) params.append('partner_id', filters.partner_id);
      if (filters.journal_id) params.append('journal_id', filters.journal_id);
      if (filters.currency_code) params.append('currency_code', filters.currency_code);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.amount_min) params.append('amount_min', filters.amount_min.toString());
      if (filters.amount_max) params.append('amount_max', filters.amount_max.toString());
      if (filters.reference) params.append('reference', filters.reference);
      if (filters.description) params.append('description', filters.description);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }

    const response = await apiClient.get<PaymentListResponse>(
      `${API_BASE}/drafts?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtener resumen de conciliación pendiente
   */
  static async getPendingReconciliation(): Promise<PaymentReconciliationSummary> {
    const response = await apiClient.get<PaymentReconciliationSummary>(`${API_BASE}/pending-reconciliation`);
    return response.data;
  }

  /**
   * Obtener lista de todos los pagos (con filtros)
   */
  static async getPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_type) params.append('payment_type', filters.payment_type);
      if (filters.partner_id) params.append('partner_id', filters.partner_id);
      if (filters.journal_id) params.append('journal_id', filters.journal_id);
      if (filters.currency_code) params.append('currency_code', filters.currency_code);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.amount_min) params.append('amount_min', filters.amount_min.toString());
      if (filters.amount_max) params.append('amount_max', filters.amount_max.toString());
      if (filters.reference) params.append('reference', filters.reference);
      if (filters.description) params.append('description', filters.description);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }

    const response = await apiClient.get<any>(`/api/v1/payments?${params.toString()}`);
    
    // Mapear la respuesta del backend al formato esperado por el frontend
    return {
      data: response.data.payments || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      pages: response.data.pages || 1,
      per_page: response.data.size || 50
    };
  }

  /**
   * Obtener pago individual por ID
   */
  static async getPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/api/v1/payments/${paymentId}`);
    return response.data;
  }

  /**
   * Crear nuevo pago
   */
  static async createPayment(data: PaymentCreate): Promise<Payment> {
    const response = await apiClient.post<Payment>(`/api/v1/payments`, data);
    return response.data;
  }

  /**
   * Actualizar pago existente
   */
  static async updatePayment(paymentId: string, data: PaymentCreate): Promise<Payment> {
    const response = await apiClient.put<Payment>(`/api/v1/payments/${paymentId}`, data);
    return response.data;
  }

  /**
   * Obtener lista de extractos bancarios
   */
  static async getBankExtracts(filters?: BankExtractFilters): Promise<BankExtractListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.reference) params.append('reference', filters.reference);
      if (filters.import_date_from) params.append('import_date_from', filters.import_date_from);
      if (filters.import_date_to) params.append('import_date_to', filters.import_date_to);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }

    const response = await apiClient.get<BankExtractListResponse>(`/api/v1/bank-extracts?${params.toString()}`);
    return response.data;
  }

  /**
   * Obtener extracto bancario individual con líneas
   */
  static async getBankExtract(extractId: string): Promise<BankExtract> {
    const response = await apiClient.get<BankExtract>(`/api/v1/bank-extracts/${extractId}`);
    return response.data;
  }

  /**
   * Cancelar pago (cambiar a CANCELLED)
   */
  static async cancelPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(`/api/v1/payments/${paymentId}/cancel`);
    return response.data;
  }

  /**
   * Eliminar pago (solo si está en DRAFT)
   */
  static async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(`/api/v1/payments/${paymentId}`);
  }

  /**
   * Operaciones bulk para eliminar múltiples pagos
   */
  static async bulkDeletePayments(paymentIds: string[]): Promise<{ deleted: number; errors: string[] }> {
    const response = await apiClient.post(`/api/v1/payments/bulk-delete`, {
      payment_ids: paymentIds
    });
    return response.data;
  }

  /**
   * Operaciones bulk para cancelar múltiples pagos
   */
  static async bulkCancelPayments(paymentIds: string[]): Promise<{ cancelled: number; errors: string[] }> {
    const response = await apiClient.post(`/api/v1/payments/bulk-cancel`, {
      payment_ids: paymentIds
    });
    return response.data;
  }
}
