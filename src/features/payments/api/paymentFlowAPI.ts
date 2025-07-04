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
  Payment,
  PaymentCreate,
  PaymentListResponse,
  PaymentFilters,
  FileImportRequest,
  BulkPaymentValidationResponse,
  BulkPaymentOperationResponse,
  BankExtractFilters,
  BankExtractListResponse,
  BankExtract,
  PaymentFlowStatus,
  PaymentReconciliationSummary
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
    console.log('✅ API - batchConfirmPayments iniciado');
    console.log('✅ API - paymentIds:', paymentIds);

    const requestData = { payment_ids: paymentIds };  // Formato correcto para el backend

    console.log('✅ API - Request data:', requestData);

    try {
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/confirm`,
        requestData
      );
      
      console.log('✅ API - Response status:', response.status);
      console.log('✅ API - Response data:', response.data);
      
      // Verificar si realmente hubo éxito aunque el status sea 200
      if (response.data.failed > 0) {
        console.warn('✅ API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('✅ API - Error en batchConfirmPayments:', error);
      console.error('✅ API - Error response:', error.response?.data);
      console.error('✅ API - Error status:', error.response?.status);
      
      // Manejar códigos de error específicos
      if (error.response?.status === 422) {
        console.error('✅ API - Error 422 (Unprocessable Entity): Ningún pago pudo ser confirmado');
      }
      
      throw error;
    }
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
    console.log('❌ API - bulkCancelPayments iniciado');
    console.log('❌ API - paymentIds:', paymentIds);
    console.log('❌ API - reason:', reason);

    const requestData = { 
      payment_ids: paymentIds,
      cancellation_reason: reason
    };

    console.log('❌ API - Request data:', requestData);

    try {
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/cancel`,
        requestData
      );
      
      console.log('❌ API - Response status:', response.status);
      console.log('❌ API - Response data:', response.data);
      
      // Verificar si realmente hubo éxito aunque el status sea 200
      if (response.data.failed > 0) {
        console.warn('❌ API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ API - Error en bulkCancelPayments:', error);
      console.error('❌ API - Error response:', error.response?.data);
      console.error('❌ API - Error status:', error.response?.status);
      
      // Manejar códigos de error específicos
      if (error.response?.status === 422) {
        console.error('❌ API - Error 422 (Unprocessable Entity): Ningún pago pudo ser cancelado');
      }
      
      throw error;
    }
  }

  /**
   * Eliminar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/delete con formato corregido
   */
  static async bulkDeletePayments(paymentIds: string[]): Promise<BulkPaymentOperationResponse> {
    console.log('🗑️ API - bulkDeletePayments iniciado');
    console.log('🗑️ API - paymentIds:', paymentIds);

    const requestData = { payment_ids: paymentIds };

    console.log('🗑️ API - Request data:', requestData);

    try {
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/delete`,
        requestData
      );
      
      console.log('🗑️ API - Response status:', response.status);
      console.log('🗑️ API - Response data:', response.data);
      
      // Verificar si realmente hubo éxito aunque el status sea 200
      if (response.data.failed > 0) {
        console.warn('🗑️ API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('🗑️ API - Error en bulkDeletePayments:', error);
      console.error('🗑️ API - Error response:', error.response?.data);
      console.error('🗑️ API - Error status:', error.response?.status);
      
      // Manejar códigos de error específicos
      if (error.response?.status === 422) {
        console.error('🗑️ API - Error 422 (Unprocessable Entity): Ningún pago pudo ser eliminado');
      }
      
      throw error;
    }
  }

  /**
   * Resetear múltiples pagos a borrador en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/reset-to-draft con formato corregido
   */
  static async bulkResetPayments(
    paymentIds: string[], 
    resetReason?: string
  ): Promise<BulkPaymentOperationResponse> {
    console.log('🔄 API - bulkResetPayments iniciado');
    console.log('🔄 API - paymentIds:', paymentIds);
    console.log('🔄 API - resetReason:', resetReason);

    const requestData = { 
      payment_ids: paymentIds,
      reset_reason: resetReason,
      batch_size: 30  // Usar batch_size fijo
    };

    console.log('🔄 API - Request data:', requestData);

    try {
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/reset-to-draft`,
        requestData
      );
      
      console.log('🔄 API - Response status:', response.status);
      console.log('🔄 API - Response data:', response.data);
      
      // Verificar si realmente hubo éxito aunque el status sea 200
      if (response.data.failed > 0) {
        console.warn('🔄 API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('🔄 API - Error en bulkResetPayments:', error);
      console.error('🔄 API - Error response:', error.response?.data);
      console.error('🔄 API - Error status:', error.response?.status);
      
      // Manejar códigos de error específicos
      if (error.response?.status === 422) {
        console.error('🔄 API - Error 422 (Unprocessable Entity): Ningún pago pudo ser reseteado');
      }
      
      throw error;
    }
  }

  /**
   * Contabilizar múltiples pagos en lote (hasta 1000)
   * ACTUALIZADO: Nuevo endpoint bulk/post con formato corregido
   */
  static async bulkPostPayments(
    paymentIds: string[], 
    postingNotes?: string
  ): Promise<BulkPaymentOperationResponse> {
    console.log('💳 API - bulkPostPayments iniciado');
    console.log('💳 API - paymentIds:', paymentIds);
    console.log('💳 API - postingNotes:', postingNotes);

    const requestData = { 
      payment_ids: paymentIds,
      posting_notes: postingNotes
    };

    console.log('💳 API - Request data:', requestData);

    try {
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/post`,
        requestData
      );
      
      console.log('💳 API - Response status:', response.status);
      console.log('💳 API - Response data:', response.data);
      
      // Verificar si realmente hubo éxito aunque el status sea 200
      if (response.data.failed > 0) {
        console.warn('💳 API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('💳 API - Error en bulkPostPayments:', error);
      console.error('💳 API - Error response:', error.response?.data);
      console.error('💳 API - Error status:', error.response?.status);
      
      // Manejar códigos de error específicos
      if (error.response?.status === 422) {
        console.error('💳 API - Error 422 (Unprocessable Entity): Ningún pago pudo ser contabilizado');
      }
      
      throw error;
    }
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
   * Obtener extractos bancarios con filtros
   * TODO: Implementar cuando esté disponible en el backend
   */
  static async getBankExtracts(filters?: BankExtractFilters): Promise<BankExtractListResponse> {
    // Implementación temporal hasta que esté disponible en el backend
    console.log('getBankExtracts called with filters:', filters);
    return {
      data: [],
      page: 1,
      per_page: 20,
      total: 0,
      pages: 0
    };
  }

  /**
   * Obtener extracto bancario individual
   * TODO: Implementar cuando esté disponible en el backend
   */
  static async getBankExtract(extractId: string): Promise<BankExtract> {
    // Implementación temporal hasta que esté disponible en el backend
    console.log('getBankExtract called with extractId:', extractId);
    throw new Error('getBankExtract not implemented yet');
  }

  /**
   * Confirmar múltiples pagos en lote
   * ACTUALIZADO: Implementación real usando el endpoint bulk/confirm
   */
  static async bulkConfirmPayments(
    paymentIds: string[], 
    confirmationNotes?: string, 
    force?: boolean
  ): Promise<BulkPaymentOperationResponse> {
    try {
      console.log('✅ API - bulkConfirmPayments iniciado');
      console.log('✅ API - Request completo:', {
        payment_ids: paymentIds,
        confirmation_notes: confirmationNotes,
        force: force,
        endpoint: `${API_BASE}/bulk/confirm`
      });
      
      const response = await apiClient.post<BulkPaymentOperationResponse>(
        `${API_BASE}/bulk/confirm`,
        { 
          payment_ids: paymentIds,
          confirmation_notes: confirmationNotes,
          force: force
        }
      );
      
      console.log('✅ API - Response completa del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      // Verificar si hay fallos
      if (response.data.failed > 0) {
        console.warn('✅ API - Operación con fallos parciales:', {
          successful: response.data.successful,
          failed: response.data.failed,
          results: response.data.results
        });
        
        // Log detallado de cada fallo
        Object.entries(response.data.results || {}).forEach(([paymentId, result]: [string, any]) => {
          if (!result.success) {
            console.error(`✅ API - FALLO en pago ${paymentId}:`, {
              payment_id: paymentId,
              error: result.error,
              message: result.message,
              payment_number: result.payment_number,
              full_result: result
            });
          }
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('✅ API - Error completo en bulkConfirmPayments:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        } : 'No response'
      });
      
      if (error.response?.status === 422) {
        console.error('✅ API - Error 422: Ningún pago pudo ser confirmado');
        console.error('✅ API - Detalle del error del servidor:', error.response.data);
      }
      
      throw error;
    }
  }

  /**
   * Validar confirmación de pagos
   * Valida si múltiples pagos pueden ser confirmados/contabilizados
   */
  static async validatePaymentConfirmation(paymentIds: string[]): Promise<BulkPaymentValidationResponse> {
    try {
      console.log('🔍 API - Validando confirmación de pagos:', paymentIds);
      const response = await apiClient.post<any>(
        `${API_BASE}/bulk/validate`,
        { payment_ids: paymentIds }
      );
      
      console.log('🔍 API - Respuesta de validación:', response.data);
      
      // Convertir la respuesta del backend al formato esperado por el frontend
      const backendData = response.data;
      const validationResults = Object.entries(backendData.validation_results || {}).map(([paymentId, result]: [string, any]) => ({
        payment_id: paymentId,
        payment_number: result.payment_number || '',
        can_confirm: result.valid === true,
        blocking_reasons: result.errors || [],
        warnings: result.warnings || [],
        requires_confirmation: (result.warnings || []).length > 0
      }));
      
      return {
        total_payments: backendData.total_payments || paymentIds.length,
        can_confirm_count: backendData.summary?.valid || 0,
        blocked_count: backendData.summary?.invalid || 0,
        warnings_count: backendData.summary?.warnings || 0,
        validation_results: validationResults
      };
    } catch (error: any) {
      console.error('🔍 API - Error en validación:', error);
      // En caso de error, devolver respuesta indicando que todos están bloqueados
      return {
        total_payments: paymentIds.length,
        can_confirm_count: 0,
        blocked_count: paymentIds.length,
        warnings_count: 0,
        validation_results: paymentIds.map(id => ({
          payment_id: id,
          payment_number: '',
          can_confirm: false,
          blocking_reasons: [error.response?.data?.detail || error.message || 'Error de validación'],
          warnings: [],
          requires_confirmation: false
        }))
      };
    }
  }

  /**
   * Obtener estado del flujo de pagos
   * TODO: Implementar cuando esté disponible en el backend
   */
  static async getPaymentFlowStatus(extractId: string): Promise<PaymentFlowStatus> {
    // Implementación temporal hasta que esté disponible en el backend
    console.log('getPaymentFlowStatus called with extractId:', extractId);
    throw new Error('getPaymentFlowStatus not implemented yet');
  }

  /**
   * Obtener resumen de conciliación pendiente
   * TODO: Implementar cuando esté disponible en el backend
   */
  static async getPendingReconciliation(): Promise<PaymentReconciliationSummary> {
    // Implementación temporal hasta que esté disponible en el backend
    return {
      total_pending: 0,
      total_amount_pending: 0,
      by_currency: {},
      by_partner: []
    };
  }

  /**
   * Cancelar pago individual
   * ACTUALIZADO: Usa el endpoint bulk con un solo elemento
   */
  static async cancelPayment(paymentId: string): Promise<void> {
    try {
      const result = await this.bulkCancelPayments([paymentId], 'Cancelación individual');
      if (result.failed > 0) {
        const errorDetails = result.results?.[paymentId];
        throw new Error(errorDetails?.error || errorDetails?.message || 'Error al cancelar pago');
      }
    } catch (error: any) {
      console.error('❌ API - Error en cancelPayment individual:', error);
      throw error;
    }
  }
}
