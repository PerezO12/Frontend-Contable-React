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
   * ACTUALIZADO: Nuevo endpoint bulk/confirm con formato de request corregido
   */
  static async batchConfirmPayments(paymentIds: string[]): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/confirm`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Obtener lista de pagos en borrador pendientes
   * ACTUALIZADO: Usa el endpoint principal con filtros
   */
  static async getDraftPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    
    // Forzar estado DRAFT
    params.append('status', 'DRAFT');
    
    if (filters) {
      if (filters.payment_type) params.append('payment_type', filters.payment_type);
      if (filters.partner_id) params.append('customer_id', filters.partner_id); // Actualizado: customer_id en lugar de partner_id
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('size', filters.per_page.toString()); // Actualizado: size en lugar de per_page
    }

    const response = await apiClient.get<PaymentListResponse>(
      `${API_BASE}?${params.toString()}`  // Usa el endpoint principal
    );
    
    // Normalizar los estados de pagos que vienen del backend
    if (response.data && response.data.data) {
      response.data.data = normalizePaymentsList(response.data.data);
    }

    return response.data;
  }

  /**
   * Obtener pago por ID
   * ACTUALIZADO: Usa endpoint consolidado
   */
  static async getPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`${API_BASE}/${paymentId}`);
    
    // Normalizar el estado del pago
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Crear nuevo pago
   * ACTUALIZADO: Usa endpoint consolidado
   */
  static async createPayment(data: PaymentCreate): Promise<Payment> {
    const response = await apiClient.post<Payment>(`${API_BASE}`, data);
    
    // Normalizar el estado del pago creado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Actualizar pago existente
   * ACTUALIZADO: Usa endpoint consolidado
   */
  static async updatePayment(paymentId: string, data: Partial<PaymentCreate>): Promise<Payment> {
    const response = await apiClient.put<Payment>(`${API_BASE}/${paymentId}`, data);
    
    // Normalizar el estado del pago actualizado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Eliminar pago individual
   * ACTUALIZADO: Usa endpoint consolidado
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
    
    // Normalizar el estado del pago reseteado
    if (response.data) {
      response.data.status = normalizePaymentStatus(response.data.status);
      response.data.payment_type = normalizePaymentType(response.data.payment_type);
    }
    
    return response.data;
  }

  /**
   * Validar múltiples pagos antes de confirmación (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/validate con formato corregido
   */
  static async validateBulkConfirmation(paymentIds: string[]): Promise<BulkPaymentValidationResponse> {
    const response = await apiClient.post<BulkPaymentValidationResponse>(
      `${API_BASE}/bulk/validate`,
      { payment_ids: paymentIds }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Cancelar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/cancel con formato corregido
   */
  static async bulkCancelPayments(paymentIds: string[], reason?: string): Promise<BulkPaymentOperationResponse> {
    const response = await apiClient.post<BulkPaymentOperationResponse>(
      `${API_BASE}/bulk/cancel`,
      { 
        payment_ids: paymentIds,
        cancellation_reason: reason
      }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Eliminar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/delete con formato corregido
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
   * ACTUALIZADO: Nuevo endpoint bulk/reset-to-draft con formato corregido
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
   * ACTUALIZADO: Nuevo endpoint bulk/post con formato corregido
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
      }  // Formato correcto para el backend
    );
    return response.data;
  }

  /**
   * Obtener estados de pago disponibles
   * ACTUALIZADO: Usa endpoint consolidado
   */
  static async getPaymentStatuses(): Promise<Array<{value: string, label: string}>> {
    const response = await apiClient.get<Array<{value: string, label: string}>>(`${API_BASE}/statuses/`);
    return response.data;
  }

  /**
   * Obtener tipos de pago disponibles
   * ACTUALIZADO: Usa endpoint consolidado
   */
  static async getPaymentTypes(): Promise<Array<{value: string, label: string}>> {
    const response = await apiClient.get<Array<{value: string, label: string}>>(`${API_BASE}/types/`);
    return response.data;
  }
}
