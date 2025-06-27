import type { InvoiceCreateWithLines, InvoiceCreate, InvoiceResponse, InvoiceWithLines, InvoiceFilters, InvoiceListResponse, InvoiceWorkflowAction, InvoiceSummary } from '../types';
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
     * Listar facturas con filtros
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
     * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
     * Genera asiento contable automáticamente
     */
    static postInvoice(id: string, data?: {
        notes?: string;
        posting_date?: string;
        force_post?: boolean;
    }): Promise<InvoiceResponse>;
    /**
     * Cancelar factura (POSTED → CANCELLED)
     * Revierte el asiento contable
     */
    static cancelInvoice(id: string, data?: {
        reason?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Restablecer a borrador (ANY → DRAFT)
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
     * Obtener pagos aplicados a una factura
     */
    static getInvoicePayments(id: string): Promise<any[]>;
    /**
     * Operaciones masivas - Contabilizar múltiples facturas
     */
    static bulkPostInvoices(ids: string[]): Promise<{
        successful: string[];
        failed: {
            id: string;
            error: string;
        }[];
    }>;
    /**
     * Operaciones masivas - Cancelar múltiples facturas
     */
    static bulkCancelInvoices(ids: string[]): Promise<{
        successful: string[];
        failed: {
            id: string;
            error: string;
        }[];
    }>;
    /**
     * Duplicar factura
     */
    static duplicateInvoice(id: string): Promise<InvoiceResponse>;
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
