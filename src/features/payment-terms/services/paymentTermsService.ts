import { apiClient } from '../../../shared/api/client';
import type {
  PaymentTerms,
  PaymentTermsCreate,
  PaymentTermsUpdate,
  PaymentTermsFilters,
  PaymentTermsListResponse,
  PaymentTermsActiveResponse,
  PaymentCalculationRequest,
  PaymentCalculationResult,
  PaymentTermsValidationResult,
  PaymentTermsStatistics
} from '../types';

/**
 * Servicio para operaciones relacionadas con condiciones de pago
 * Maneja todas las interacciones con el API backend para payment terms
 * 
 * Basado en la documentación del backend actualizada:
 * - Base URL: /api/v1/payment-terms
 * - Soporte completo para cronogramas de pago
 * - Validaciones de negocio integradas
 * - Cálculos de fechas y montos
 */
export class PaymentTermsService {
  private static readonly BASE_URL = '/api/v1/payment-terms';

  // ==========================================
  // OPERACIONES CRUD BÁSICAS
  // ==========================================

  /**
   * Crear nuevas condiciones de pago
   */
  static async createPaymentTerms(data: PaymentTermsCreate): Promise<PaymentTerms> {
    console.log('Creando condiciones de pago:', data);
    
    try {
      const response = await apiClient.post<PaymentTerms>(this.BASE_URL, data);
      console.log('Condiciones de pago creadas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear condiciones de pago:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de condiciones de pago con filtros
   */
  static async getPaymentTermsList(filters?: PaymentTermsFilters): Promise<PaymentTermsListResponse> {
    console.log('Obteniendo lista de condiciones de pago con filtros:', filters);
    
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.BASE_URL}?${params}` : this.BASE_URL;
      try {
      const response = await apiClient.get<PaymentTermsListResponse | PaymentTerms[]>(url);
      console.log('Lista de condiciones de pago obtenida:', response.data);
      
      // Normalizar la respuesta en caso de que el backend devuelva un array directo
      if (Array.isArray(response.data)) {
        console.warn('El backend devolvió un array directo en lugar de PaymentTermsListResponse. Normalizando...');
        return {
          items: response.data,
          total: response.data.length,
          skip: 0,
          limit: response.data.length
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener lista de condiciones de pago:', error);
      throw error;
    }
  }

  /**
   * Obtener condiciones de pago activas (para selects)
   */
  static async getActivePaymentTerms(): Promise<PaymentTermsActiveResponse> {
    console.log('Obteniendo condiciones de pago activas');
    
    try {
      const response = await apiClient.get<PaymentTermsActiveResponse>(`${this.BASE_URL}/active`);
      console.log('Condiciones de pago activas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener condiciones de pago activas:', error);
      throw error;
    }
  }

  /**
   * Obtener condiciones de pago por ID
   */
  static async getPaymentTermsById(id: string): Promise<PaymentTerms> {
    console.log('Obteniendo condiciones de pago por ID:', id);
    
    try {
      const response = await apiClient.get<PaymentTerms>(`${this.BASE_URL}/${id}`);
      console.log('Condiciones de pago obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener condiciones de pago por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener condiciones de pago por código
   */
  static async getPaymentTermsByCode(code: string): Promise<PaymentTerms> {
    console.log('Obteniendo condiciones de pago por código:', code);
    
    try {
      const response = await apiClient.get<PaymentTerms>(`${this.BASE_URL}/code/${encodeURIComponent(code)}`);
      console.log('Condiciones de pago obtenidas por código:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener condiciones de pago por código:', error);
      throw error;
    }
  }

  /**
   * Actualizar condiciones de pago
   */
  static async updatePaymentTerms(id: string, data: PaymentTermsUpdate): Promise<PaymentTerms> {
    console.log('Actualizando condiciones de pago:', id, data);
    
    try {
      const response = await apiClient.put<PaymentTerms>(`${this.BASE_URL}/${id}`, data);
      console.log('Condiciones de pago actualizadas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar condiciones de pago:', error);
      throw error;
    }
  }

  /**
   * Activar/Desactivar condiciones de pago
   */
  static async toggleActiveStatus(id: string): Promise<PaymentTerms> {
    console.log('Cambiando estado activo de condiciones de pago:', id);
    
    try {
      const response = await apiClient.patch<PaymentTerms>(`${this.BASE_URL}/${id}/toggle-active`);
      console.log('Estado activo cambiado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado activo:', error);
      throw error;
    }
  }
  /**
   * Eliminar condiciones de pago
   */
  static async deletePaymentTerms(id: string): Promise<void> {
    console.log('Eliminando condiciones de pago:', id);
    
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('Condiciones de pago eliminadas');
    } catch (error) {
      console.error('Error al eliminar condiciones de pago:', error);
      throw error;
    }
  }
  /**
   * Verificar si las condiciones de pago se pueden eliminar
   */
  static async checkCanDeletePaymentTerms(id: string): Promise<{
    can_delete: boolean;
    can_deactivate: boolean;
    usage_count: number;
    is_active: boolean;
    message: string;
  }> {
    console.log('Verificando si se puede eliminar condiciones de pago:', id);
    
    try {
      const response = await apiClient.get<{
        can_delete: boolean;
        can_deactivate: boolean;
        usage_count: number;
        is_active: boolean;
        message: string;
      }>(`${this.BASE_URL}/${id}/can-delete`);      console.log('Verificación completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al verificar eliminación:', error);
      throw error;
    }
  }

  // ==========================================
  // OPERACIONES DE CÁLCULO Y VALIDACIÓN
  // ==========================================

  /**
   * Calcular cronograma de pagos
   */
  static async calculatePaymentSchedule(request: PaymentCalculationRequest): Promise<PaymentCalculationResult> {
    console.log('Calculando cronograma de pagos:', request);
    
    try {
      const response = await apiClient.post<PaymentCalculationResult>(`${this.BASE_URL}/calculate`, request);
      console.log('Cronograma de pagos calculado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al calcular cronograma de pagos:', error);
      throw error;
    }
  }

  /**
   * Validar condiciones de pago
   */
  static async validatePaymentTerms(id: string): Promise<PaymentTermsValidationResult> {
    console.log('Validando condiciones de pago:', id);
    
    try {
      const response = await apiClient.get<PaymentTermsValidationResult>(`${this.BASE_URL}/${id}/validate`);
      console.log('Resultado de validación:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar condiciones de pago:', error);
      throw error;
    }
  }

  // ==========================================
  // OPERACIONES DE ESTADÍSTICAS Y REPORTES
  // ==========================================

  /**
   * Obtener estadísticas de condiciones de pago
   */
  static async getPaymentTermsStatistics(): Promise<PaymentTermsStatistics> {
    console.log('Obteniendo estadísticas de condiciones de pago');
    
    try {
      const response = await apiClient.get<PaymentTermsStatistics>(`${this.BASE_URL}/statistics`);
      console.log('Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // ==========================================
  // MÉTODOS UTILITARIOS
  // ==========================================

  /**
   * Verificar si un código de condición de pago está disponible
   */
  static async isCodeAvailable(code: string, excludeId?: string): Promise<boolean> {
    console.log('Verificando disponibilidad de código:', code);
    
    try {
      const filters: PaymentTermsFilters = {
        search: code,
        limit: 1
      };
      
      const response = await this.getPaymentTermsList(filters);
      const existingTerm = response.items.find(term => 
        term.code.toLowerCase() === code.toLowerCase() && 
        (!excludeId || term.id !== excludeId)
      );
      
      const isAvailable = !existingTerm;
      console.log('Código disponible:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Error al verificar disponibilidad de código:', error);
      return false;
    }
  }

  /**
   * Obtener condiciones de pago más utilizadas
   */
  static async getMostUsedPaymentTerms(limit: number = 5): Promise<PaymentTerms[]> {
    console.log('Obteniendo condiciones de pago más utilizadas');
    
    try {
      const filters: PaymentTermsFilters = {
        is_active: true,
        sort_by: 'name', // Backend debería soportar ordenamiento por uso
        limit
      };
        const response = await this.getPaymentTermsList(filters);
      console.log('Condiciones de pago más utilizadas:', response.items);
      return response.items;
    } catch (error) {
      console.error('Error al obtener condiciones de pago más utilizadas:', error);
      throw error;
    }
  }

  /**
   * Validar cronograma de pagos antes de enviar
   */
  static validatePaymentSchedules(schedules: Array<{ sequence: number; days: number; percentage: number }>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar que existan cronogramas
    if (!schedules || schedules.length === 0) {
      errors.push('Debe incluir al menos un cronograma de pago');
      return { isValid: false, errors };
    }

    // Validar secuencias únicas
    const sequences = schedules.map(s => s.sequence);
    if (new Set(sequences).size !== sequences.length) {
      errors.push('Las secuencias deben ser únicas');
    }    // Validar que los porcentajes sumen exactamente 100% (hasta 6 decimales)
    const totalPercentage = schedules.reduce((sum, s) => sum + s.percentage, 0);
    if (Math.abs(totalPercentage - 100) >= 0.000001) {
      errors.push('Los porcentajes deben sumar exactamente 100.000000%');
    }

    // Validar que los días estén en orden ascendente por secuencia
    const sortedBySequence = [...schedules].sort((a, b) => a.sequence - b.sequence);
    for (let i = 1; i < sortedBySequence.length; i++) {
      if (sortedBySequence[i].days < sortedBySequence[i - 1].days) {
        errors.push('Los días deben estar en orden ascendente por secuencia');
        break;
      }
    }

    // Validar valores individuales
    schedules.forEach((schedule, index) => {
      if (schedule.sequence < 1) {
        errors.push(`Cronograma ${index + 1}: La secuencia debe ser mayor a 0`);
      }
      if (schedule.days < 0) {
        errors.push(`Cronograma ${index + 1}: Los días deben ser mayor o igual a 0`);
      }
      if (schedule.percentage <= 0 || schedule.percentage > 100) {
        errors.push(`Cronograma ${index + 1}: El porcentaje debe estar entre 0.01 y 100`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatear condiciones de pago para mostrar
   */
  static formatPaymentTermsDisplay(paymentTerms: PaymentTerms): string {
    if (!paymentTerms.payment_schedules || paymentTerms.payment_schedules.length === 0) {
      return paymentTerms.name;
    }

    if (paymentTerms.payment_schedules.length === 1) {
      const schedule = paymentTerms.payment_schedules[0];
      if (schedule.days === 0) {
        return `${paymentTerms.name} (Contado)`;
      }
      return `${paymentTerms.name} (${schedule.days} días)`;
    }

    const daysRange = paymentTerms.payment_schedules.map(s => s.days).join('-');
    return `${paymentTerms.name} (${daysRange} días)`;
  }

  /**
   * Calcular fecha de vencimiento basada en condiciones de pago
   */
  static calculateDueDate(invoiceDate: string, paymentTerms: PaymentTerms): string {
    if (!paymentTerms.payment_schedules || paymentTerms.payment_schedules.length === 0) {
      return invoiceDate;
    }

    // Usar la fecha más tardía como fecha de vencimiento final
    const maxDays = Math.max(...paymentTerms.payment_schedules.map(s => s.days));
    const invoice = new Date(invoiceDate);
    const dueDate = new Date(invoice);
    dueDate.setDate(dueDate.getDate() + maxDays);
    
    return dueDate.toISOString().split('T')[0];
  }
}
