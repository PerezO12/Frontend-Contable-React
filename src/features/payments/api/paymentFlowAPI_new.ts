/**
 * Cliente API para el flujo de pagos
 * Implementa todas las operaciones del backend payments (consolidado)
 * ACTUALIZADO: Migrado de payment-flow a payments endpoints consolidados
 */
import { apiClient } from '@/shared/api/client';
import { normalizePaymentsList, normalizePaymentStatus, normalizePaymentType } from '../utils/statusNormalizer';
import type {
  PaymentFlowImportRequest,
  PaymentFlowImportResult,
  PaymentBatchConfirmation,
  Payment,
  PaymentCreate,
  PaymentListResponse,
  PaymentFilters,
  PaymentStatus,
  FileImportRequest,
  BulkPaymentValidationResponse,
  BulkPaymentOperationResponse
} from '../types';

// ACTUALIZADO: Ahora todos los endpoints están consolidados bajo /api/v1/payments
const API_BASE = '/api/v1/payments';

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
   * ACTUALIZADO: Para usar el nuevo endpoint consolidado
   */
  static async importFromFile(data: FileImportRequest): Promise<PaymentFlowImportResult> {
    const formData = new FormData();
    formData.append('file', data.file);
    
    // Adaptación de parámetros para el nuevo endpoint
    formData.append('extract_name', data.extract_reference || `Extract_${Date.now()}`);
    formData.append('account_id', data.account_id || ''); 
    formData.append('statement_date', data.statement_date || new Date().toISOString().split('T')[0]);
    formData.append('auto_match', String(data.auto_match ?? true));

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
   * ACTUALIZADO: Ya usa la ruta correcta
   */
  static async confirmPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(`${API_BASE}/${paymentId}/confirm`);
    
    // Normalizar el estado y tipo del pago confirmado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Confirmar múltiples pagos en lote
   * ACTUALIZADO: Nuevo endpoint bulk/confirm
   */
  static async batchConfirmPayments(paymentIds: string[]): Promise<PaymentBatchConfirmation> {
    const response = await apiClient.post<PaymentBatchConfirmation>(
      `${API_BASE}/bulk/confirm`,
      paymentIds  // El backend espera directamente el array en el body
    );
    return response.data;
  }

  /**
   * Obtener lista de pagos con filtros
   * ACTUALIZADO: Usa el endpoint principal
   */
  static async getPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.payment_type) params.append('payment_type', filters.payment_type);
      if (filters.partner_id) params.append('customer_id', filters.partner_id); // customer_id en lugar de partner_id
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('size', filters.per_page.toString()); // size en lugar de per_page
      if (filters.status) params.append('status', filters.status);
    }

    const response = await apiClient.get<PaymentListResponse>(
      `${API_BASE}?${params.toString()}`
    );
    
    // Normalizar los estados de pagos que vienen del backend
    if (response.data && response.data.data) {
      response.data.data = normalizePaymentsList(response.data.data);
    }
    
    return response.data;
  }

  /**
   * Obtener lista de pagos en borrador pendientes
   * ACTUALIZADO: Usa el endpoint principal con filtros
   */
  static async getDraftPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const filterWithDraft = { ...filters, status: 'DRAFT' as PaymentStatus };
    return this.getPayments(filterWithDraft);
  }

  /**
   * Obtener pago individual por ID
   */
  static async getPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`${API_BASE}/${paymentId}`);
    
    // Normalizar el estado y tipo del pago
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Crear nuevo pago
   */
  static async createPayment(data: PaymentCreate): Promise<Payment> {
    const response = await apiClient.post<Payment>(`${API_BASE}`, data);
    
    // Normalizar el estado y tipo del pago creado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Actualizar pago existente
   */
  static async updatePayment(paymentId: string, data: Partial<PaymentCreate>): Promise<Payment> {
    const response = await apiClient.put<Payment>(`${API_BASE}/${paymentId}`, data);
    
    // Normalizar el estado y tipo del pago actualizado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Eliminar pago (solo si está en DRAFT)
   */
  static async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(`${API_BASE}/${paymentId}`);
  }

  /**
   * Resetear pago individual a borrador (POSTED/CANCELLED → DRAFT)
   * ACTUALIZADO: Nuevo endpoint reset-to-draft
   */
  static async resetPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(`${API_BASE}/${paymentId}/reset-to-draft`);
    
    // Normalizar el estado y tipo del pago
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  // =============================================
  // OPERACIONES BULK DE ALTO RENDIMIENTO
  // =============================================

  /**
   * Validar si múltiples pagos pueden ser confirmados
   * ACTUALIZADO: Nuevo endpoint bulk/validate con formato correcto
   */
  static async validatePaymentConfirmation(paymentIds: string[]): Promise<BulkPaymentValidationResponse> {
    const response = await apiClient.post<BulkPaymentValidationResponse>(
      `${API_BASE}/bulk/validate`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Confirmar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/confirm con formato correcto
   */
  static async bulkConfirmPayments(paymentIds: string[]): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/confirm`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Cancelar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/cancel
   */
  static async bulkCancelPayments(
    paymentIds: string[], 
    cancellationReason?: string
  ): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/cancel`,
      { 
        payment_ids: paymentIds,
        cancellation_reason: cancellationReason
      }
    );
    return response.data;
  }

  /**
   * Eliminar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/delete con formato correcto
   */
  static async bulkDeletePayments(paymentIds: string[]): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/delete`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Resetear múltiples pagos a borrador en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/reset-to-draft con formato correcto
   */
  static async bulkResetPayments(paymentIds: string[]): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/reset-to-draft`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Contabilizar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/post
   */
  static async bulkPostPayments(
    paymentIds: string[], 
    postingNotes?: string
  ): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/post`,
      { 
        payment_ids: paymentIds,
        posting_notes: postingNotes
      }
    );
    return response.data;
  }

  // =============================================
  // ENDPOINTS DE UTILIDAD
  // =============================================

  /**
   * Obtener tipos de pago disponibles
   */
  static async getPaymentTypes(): Promise<Array<{value: string, label: string}>> {
    const response = await apiClient.get<Array<{value: string, label: string}>>(`${API_BASE}/types/`);
    return response.data;
  }

  /**
   * Obtener estados de pago disponibles
   */
  static async getPaymentStatuses(): Promise<Array<{value: string, label: string}>> {
    const response = await apiClient.get<Array<{value: string, label: string}>>(`${API_BASE}/statuses/`);
    return response.data;
  }

  /**
   * Obtener resumen estadístico de pagos
   */
  static async getPaymentSummary(filters?: {
    customer_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.customer_id) params.append('customer_id', filters.customer_id);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
    }

    const response = await apiClient.get(`${API_BASE}/summary/statistics?${params.toString()}`);
    return response.data;
  }
}
