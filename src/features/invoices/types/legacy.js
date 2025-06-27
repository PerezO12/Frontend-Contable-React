/**
 * Parche temporal para corregir errores de TypeScript
 * Este archivo proporciona tipos y funciones de compatibilidad
 * mientras migramos completamente al sistema Odoo
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
// Funciones de conversión simples
export function mapToLegacyInvoice(data) {
    return __assign(__assign({}, data), { number: data.invoice_number || data.number, remaining_amount: data.outstanding_amount || data.remaining_amount || 0, lines: (data.lines || []).map(function (line) { return (__assign(__assign({}, line), { line_number: line.sequence || line.line_number, line_total: line.total_amount || line.line_total || 0, product_name: line.product_name || '', product_code: line.product_code || '', tax_rate: line.tax_rate || 0 })); }) });
}
export function mapToLegacyInvoiceList(response) {
    return __assign(__assign({}, response), { page_size: response.size || response.page_size || 20, items: (response.items || []).map(mapToLegacyInvoice) });
}
