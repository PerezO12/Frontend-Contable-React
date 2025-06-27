import type { InvoiceCreateWithLines, InvoiceCreate, InvoiceResponse, InvoiceWithLines, InvoiceFilters, InvoiceListResponse, InvoiceWorkflowAction, InvoiceSummary, PaymentSchedulePreview, PaymentTermsValidation } from '../types';
export declare class InvoiceAPI {
    /**
     * PASO 2 DEL FLUJO ODOO: Crear factura completa con líneas (endpoint principal)
     * Usa InvoiceCreateWithLines según IMPLEMENTAR.md
     */
    static createInvoiceWithLines(data: InvoiceCreateWithLines): Promise<InvoiceWithLines>;
    /**
     * Crear solo encabezado de factura (para casos especiales)
     */
    static createInvoiceHeaderOnly(data: InvoiceCreate): Promise<InvoiceResponse>;
    /**
     * Obtener factura por ID
     */
    static getInvoice(id: string): Promise<InvoiceResponse>;
    /**
     * Obtener factura con líneas completas
     */
    static getInvoiceWithLines(id: string): Promise<InvoiceWithLines>;
    /**
     * Listar facturas con filtros avanzados
     * Ahora incluye todas las nuevas capacidades de búsqueda del backend
     */
    static getInvoices(filters?: InvoiceFilters): Promise<InvoiceListResponse>;
    /**
     * Actualizar factura (solo en estado DRAFT)
     */
    static updateInvoice(id: string, data: Partial<InvoiceCreate>): Promise<InvoiceResponse>;
    /**
     * Eliminar factura (solo en estado DRAFT)
     */
    static deleteInvoice(id: string): Promise<void>;
    /**
   * Validar operación bulk antes de ejecutar
   */
    static validateBulkOperation(operation: 'post' | 'cancel' | 'reset' | 'delete', invoiceIds: string[]): Promise<{
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
    }>;
    /**
     * Contabilizar múltiples facturas en lote (DRAFT → POSTED)
     */
    static bulkPostInvoices(data: {
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
    }>;
    /**
     * Cancelar múltiples facturas en lote (POSTED → CANCELLED)
     */
    static bulkCancelInvoices(data: {
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
    }>;
    /**
     * Restablecer múltiples facturas a borrador (POSTED → DRAFT)
     */
    static bulkResetToDraftInvoices(data: {
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
    }>;
    /**
     * Eliminar múltiples facturas en lote (solo DRAFT)
     */
    static bulkDeleteInvoices(data: {
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
    }>;
    /**
     * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
     * Genera asiento contable automáticamente
     * Usa el endpoint específico POST /invoices/{id}/post
     */
    static postInvoice(id: string, data?: {
        notes?: string;
        posting_date?: string;
        force_post?: boolean;
    }): Promise<InvoiceResponse>;
    /**
     * Cancelar factura (POSTED → CANCELLED)
     * Revierte el asiento contable
     * Usa el endpoint específico POST /invoices/{id}/cancel
     */
    static cancelInvoice(id: string, data?: {
        reason?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Restablecer a borrador (ANY → DRAFT)
     * Usa el endpoint específico POST /invoices/{id}/reset-to-draft
     */
    static resetToDraft(id: string, data?: {
        reason?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Ejecutar acción de workflow
     */
    static executeWorkflowAction(id: string, action: InvoiceWorkflowAction): Promise<InvoiceResponse>;
    /**
     * Obtener resumen estadístico de facturas
     */
    static getInvoiceSummary(filters?: Partial<InvoiceFilters>): Promise<InvoiceSummary>;
    /**
     * Obtener asiento contable de una factura contabilizada
     */
    static getInvoiceJournalEntry(id: string): Promise<any>;
    /**
     * NUEVO: Vista previa de cómo se dividirán los pagos según payment terms (Flujo Odoo)
     */
    static getPaymentSchedulePreview(id: string): Promise<PaymentSchedulePreview[]>;
    /**
     * NUEVO: Validar condiciones de pago para uso en facturas (Flujo Odoo)
     */
    static validatePaymentTerms(paymentTermsId: string): Promise<PaymentTermsValidation>;
    /**
     * Obtener pagos aplicados a una factura
     */
    static getInvoicePayments(id: string): Promise<any[]>;
    /**
     * Duplicar factura
     */
    static duplicateInvoice(id: string): Promise<InvoiceResponse>;
    /**
     * Métodos legacy para compatibilidad con el store existente
     */
    static createInvoice(data: InvoiceCreateWithLines): Promise<InvoiceWithLines>;
    /**
     * Confirmar factura (DRAFT → PENDING) - método legacy
     * Nota: En el flujo actual se usa directamente postInvoice
     */
    static confirmInvoice(id: string, data?: {
        notes?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Marcar como pagada - método para marcar factura como pagada
     * Usa endpoint específico POST /invoices/{id}/mark-paid
     */
    static markAsPaid(id: string, data?: {
        notes?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Validar datos de factura antes de crear/actualizar
     */
    static validateInvoiceData(data: InvoiceCreateWithLines): Promise<{
        is_valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    /**
     * Calcular totales de factura
     */
    static calculateInvoiceTotals(lines: any[]): Promise<{
        subtotal: number;
        tax_amount: number;
        discount_amount: number;
        total_amount: number;
    }>;
}
export declare const invoiceAPI: typeof InvoiceAPI;
