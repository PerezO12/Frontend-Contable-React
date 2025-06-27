/**
 * Tipos para el módulo de facturas siguiendo IMPLEMENTAR.md
 * Schema actualizado para coincidir con el backend Odoo
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var InvoiceTypeEnum = {
    CUSTOMER_INVOICE: "CUSTOMER_INVOICE",
    SUPPLIER_INVOICE: "SUPPLIER_INVOICE",
    CREDIT_NOTE: "CREDIT_NOTE",
    DEBIT_NOTE: "DEBIT_NOTE"
};
// Legacy types para compatibilidad con archivos existentes
export var InvoiceTypeConst = {
    CUSTOMER_INVOICE: "CUSTOMER_INVOICE",
    SUPPLIER_INVOICE: "SUPPLIER_INVOICE",
    CREDIT_NOTE: "CREDIT_NOTE",
    DEBIT_NOTE: "DEBIT_NOTE"
};
export var InvoiceStatusEnum = {
    DRAFT: "DRAFT",
    POSTED: "POSTED",
    CANCELLED: "CANCELLED"
};
// Legacy types para compatibilidad con archivos existentes
export var InvoiceStatusConst = {
    DRAFT: "DRAFT",
    POSTED: "POSTED",
    CANCELLED: "CANCELLED"
};
export var INVOICE_WORKFLOW_STEPS = [
    {
        step: 1,
        title: "Tercero registrado",
        description: "Cliente/Proveedor dado de alta en el sistema",
        status: 'completed'
    },
    {
        step: 2,
        title: "Factura borrador",
        description: "Crear factura con líneas de productos/servicios (estado DRAFT)",
        status: 'current',
        action: "Crear Factura",
        api_endpoint: "/invoices/"
    },
    {
        step: 3,
        title: "Contabilizar",
        description: "Contabilizar factura - genera asiento automático (DRAFT → POSTED)",
        status: 'pending',
        action: "Contabilizar",
        api_endpoint: "/invoices/{id}/post"
    },
    {
        step: 4,
        title: "Gestión de pagos",
        description: "Registrar y aplicar pagos (funcionalidad futura)",
        status: 'pending'
    }
];
// ================================
// FUNCIONES DE CONVERSIÓN
// ================================
// Convertir de Response a Legacy
export function convertInvoiceResponseToLegacy(response) {
    return __assign(__assign({}, response), { number: response.invoice_number, remaining_amount: response.outstanding_amount, lines: (response.lines || []).map(function (line) { return (__assign(__assign({}, line), { line_number: line.sequence, line_total: line.total_amount, product_name: '', product_code: '', tax_rate: 0 // TODO: calcular del tax_amount
         })); }) });
}
// Convertir InvoiceResponse a formato legacy (sin líneas)
export function convertInvoiceResponseToLegacyWithLines(response) {
    return __assign(__assign({}, response), { number: response.invoice_number, remaining_amount: response.outstanding_amount, lines: [] // Respuestas simples no incluyen líneas
     });
}
// Convertir InvoiceWithLines a formato legacy
export function convertInvoiceWithLinesToLegacy(response) {
    return __assign(__assign({}, response), { number: response.invoice_number, remaining_amount: response.outstanding_amount, lines: (response.lines || []).map(function (line) { return (__assign(__assign({}, line), { line_number: line.sequence, line_total: line.total_amount, product_name: line.product_name || '', product_code: line.product_code || '', tax_rate: 0 // TODO: calcular del tax_amount
         })); }) });
}
// Convertir lista de responses
export function convertInvoiceListResponseToLegacy(response) {
    // Verificar que response existe
    if (!response) {
        console.warn('convertInvoiceListResponseToLegacy: response is null/undefined');
        return {
            items: [],
            total: 0,
            page: 1,
            size: 20,
            page_size: 20,
            total_pages: 0
        };
    }
    // Verificar que items existe
    if (!Array.isArray(response.items)) {
        console.warn('convertInvoiceListResponseToLegacy: response.items is not an array', response);
        return __assign(__assign({}, response), { page_size: response.size || 20, items: [] });
    }
    return __assign(__assign({}, response), { page_size: response.size, items: response.items.map(function (item) { return (__assign(__assign({}, item), { number: item.invoice_number, remaining_amount: item.outstanding_amount, lines: [] // Lista no incluye líneas por defecto
         })); }) });
}
