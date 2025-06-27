import type { PaymentTerms, PaymentTermsCreate, PaymentTermsUpdate, PaymentTermsFilters, PaymentTermsListResponse, PaymentTermsActiveResponse, PaymentCalculationRequest, PaymentCalculationResult, PaymentTermsValidationResult, PaymentTermsStatistics } from '../types';
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
export declare class PaymentTermsService {
    private static readonly BASE_URL;
    /**
     * Crear nuevas condiciones de pago
     */
    static createPaymentTerms(data: PaymentTermsCreate): Promise<PaymentTerms>;
    /**
     * Obtener lista de condiciones de pago con filtros
     */
    static getPaymentTermsList(filters?: PaymentTermsFilters): Promise<PaymentTermsListResponse>;
    /**
     * Obtener condiciones de pago activas (para selects)
     */
    static getActivePaymentTerms(): Promise<PaymentTermsActiveResponse>;
    /**
     * Obtener condiciones de pago por ID
     */
    static getPaymentTermsById(id: string): Promise<PaymentTerms>;
    /**
     * Obtener condiciones de pago por código
     */
    static getPaymentTermsByCode(code: string): Promise<PaymentTerms>;
    /**
     * Actualizar condiciones de pago
     */
    static updatePaymentTerms(id: string, data: PaymentTermsUpdate): Promise<PaymentTerms>;
    /**
     * Activar/Desactivar condiciones de pago
     */
    static toggleActiveStatus(id: string): Promise<PaymentTerms>;
    /**
     * Eliminar condiciones de pago
     */
    static deletePaymentTerms(id: string): Promise<void>;
    /**
     * Verificar si las condiciones de pago se pueden eliminar
     */
    static checkCanDeletePaymentTerms(id: string): Promise<{
        can_delete: boolean;
        can_deactivate: boolean;
        usage_count: number;
        is_active: boolean;
        message: string;
    }>;
    /**
     * Calcular cronograma de pagos
     */
    static calculatePaymentSchedule(request: PaymentCalculationRequest): Promise<PaymentCalculationResult>;
    /**
     * Validar condiciones de pago
     */
    static validatePaymentTerms(id: string): Promise<PaymentTermsValidationResult>;
    /**
     * Obtener estadísticas de condiciones de pago
     */
    static getPaymentTermsStatistics(): Promise<PaymentTermsStatistics>;
    /**
     * Verificar si un código de condición de pago está disponible
     */
    static isCodeAvailable(code: string, excludeId?: string): Promise<boolean>;
    /**
     * Obtener condiciones de pago más utilizadas
     */
    static getMostUsedPaymentTerms(limit?: number): Promise<PaymentTerms[]>;
    /**
     * Validar cronograma de pagos antes de enviar
     */
    static validatePaymentSchedules(schedules: Array<{
        sequence: number;
        days: number;
        percentage: number;
    }>): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Formatear condiciones de pago para mostrar
     */
    static formatPaymentTermsDisplay(paymentTerms: PaymentTerms): string;
    /**
     * Calcular fecha de vencimiento basada en condiciones de pago
     */
    static calculateDueDate(invoiceDate: string, paymentTerms: PaymentTerms): string;
}
