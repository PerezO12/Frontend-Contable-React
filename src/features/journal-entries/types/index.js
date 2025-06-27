var _a, _b, _c, _d;
import { z } from 'zod';
// Tipos como constantes para evitar enum issues
export var JournalEntryType = {
    MANUAL: 'manual',
    AUTOMATIC: 'automatic',
    ADJUSTMENT: 'adjustment',
    OPENING: 'opening',
    CLOSING: 'closing',
    REVERSAL: 'reversal'
};
export var JournalEntryStatus = {
    DRAFT: 'draft',
    PENDING: 'pending',
    APPROVED: 'approved',
    POSTED: 'posted',
    CANCELLED: 'cancelled'
};
// Nuevo enum para origen de transacción
export var TransactionOrigin = {
    SALE: 'sale',
    PURCHASE: 'purchase',
    ADJUSTMENT: 'adjustment',
    TRANSFER: 'transfer',
    PAYMENT: 'payment',
    COLLECTION: 'collection',
    OPENING: 'opening',
    CLOSING: 'closing',
    OTHER: 'other'
};
// Schemas de validación con Zod
export var journalEntryLineCreateSchema = z.object({
    account_id: z.string().uuid('ID de cuenta inválido'),
    debit_amount: z.union([
        z.string().refine(function (val) { return /^\d+(\.\d{1,2})?$/.test(val); }, 'Monto débito debe ser un número válido'),
        z.number().min(0, 'Monto débito debe ser positivo')
    ]),
    credit_amount: z.union([
        z.string().refine(function (val) { return /^\d+(\.\d{1,2})?$/.test(val); }, 'Monto crédito debe ser un número válido'),
        z.number().min(0, 'Monto crédito debe ser positivo')
    ]), description: z.string().optional(),
    reference: z.string().optional(),
    third_party_id: z.string().refine(function (val) { return !val || val === '' || z.string().uuid().safeParse(val).success; }, 'ID de tercero inválido').optional(),
    cost_center_id: z.string().refine(function (val) { return !val || val === '' || z.string().uuid().safeParse(val).success; }, 'ID de centro de costo inválido').optional(), // Campos para payment terms - OPCIONAL y solo valida UUID si tiene valor
    payment_terms_id: z.string().refine(function (val) { return !val || val === '' || z.string().uuid().safeParse(val).success; }, 'ID de términos de pago inválido').optional(),
    invoice_date: z.string().refine(function (val) { return !val || !isNaN(Date.parse(val)); }, 'Fecha de factura inválida').optional(),
    due_date: z.string().refine(function (val) { return !val || !isNaN(Date.parse(val)); }, 'Fecha de vencimiento inválida').optional(), // Nuevos campos para productos
    product_id: z.string().refine(function (val) { return !val || val === '' || z.string().uuid().safeParse(val).success; }, 'ID de producto inválido').optional(),
    quantity: z.string().refine(function (val) { return !val || (/^\d+(\.\d{1,4})?$/.test(val) && parseFloat(val) > 0); }, 'La cantidad debe ser un número positivo').optional(), unit_price: z.string().refine(function (val) {
        if (!val || val === '' || val === '0' || val === '0.00')
            return true;
        var num = parseFloat(val);
        return !isNaN(num) && num >= 0 && isFinite(num);
    }, 'El precio unitario debe ser un número válido').optional(),
    discount_percentage: z.string().refine(function (val) { return !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 100); }, 'El porcentaje de descuento debe estar entre 0 y 100').optional(),
    discount_amount: z.string().refine(function (val) { return !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0); }, 'El monto de descuento debe ser un número positivo').optional(),
    tax_percentage: z.string().refine(function (val) { return !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0); }, 'El porcentaje de impuesto debe ser un número positivo').optional(),
    tax_amount: z.string().refine(function (val) { return !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0); }, 'El monto de impuesto debe ser un número positivo').optional()
}).refine(function (data) {
    var debit = typeof data.debit_amount === 'string'
        ? parseFloat(data.debit_amount)
        : data.debit_amount;
    var credit = typeof data.credit_amount === 'string'
        ? parseFloat(data.credit_amount)
        : data.credit_amount;
    return (debit > 0 && credit === 0) || (credit > 0 && debit === 0);
}, {
    message: 'Una línea debe tener monto en débito O crédito, no ambos ni ninguno',
    path: ['debit_amount']
}).refine(function (data) {
    // Validar que si hay payment_terms_id también hay invoice_date
    if (data.payment_terms_id && !data.invoice_date) {
        return false;
    }
    return true;
}, {
    message: 'Si especifica condiciones de pago, debe incluir fecha de factura',
    path: ['invoice_date']
}).refine(function (data) {
    // Validar que la fecha de vencimiento no sea anterior a la fecha de factura
    if (data.invoice_date && data.due_date) {
        var invoiceDate = new Date(data.invoice_date);
        var dueDate = new Date(data.due_date);
        return dueDate >= invoiceDate;
    }
    return true;
}, {
    message: 'La fecha de vencimiento no puede ser anterior a la fecha de factura',
    path: ['due_date']
}).refine(function (data) {
    // Si hay producto, debe haber cantidad para productos físicos
    if (data.product_id && !data.quantity) {
        return false; // Será validado en el backend según el tipo de producto
    }
    return true;
}, {
    message: 'Si especifica un producto, debe incluir la cantidad',
    path: ['quantity']
}).refine(function (data) {
    // No permitir ambos tipos de descuento al mismo tiempo
    if (data.discount_percentage && data.discount_amount) {
        return false;
    }
    return true;
}, {
    message: 'No se puede especificar porcentaje y monto de descuento al mismo tiempo',
    path: ['discount_amount']
}).refine(function (data) {
    // No permitir ambos tipos de impuesto al mismo tiempo
    if (data.tax_percentage && data.tax_amount) {
        return false;
    }
    return true;
}, {
    message: 'No se puede especificar porcentaje y monto de impuesto al mismo tiempo',
    path: ['tax_amount']
});
export var journalEntryCreateSchema = z.object({
    reference: z.string().optional(),
    description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
    entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']),
    transaction_origin: z.enum(['sale', 'purchase', 'adjustment', 'transfer', 'payment', 'collection', 'opening', 'closing', 'other']).optional(),
    entry_date: z.string().refine(function (val) { return !isNaN(Date.parse(val)); }, 'Fecha inválida'),
    notes: z.string().optional(),
    external_reference: z.string().optional(),
    lines: z.array(journalEntryLineCreateSchema).min(2, 'Un asiento debe tener al menos 2 líneas')
}).refine(function (data) {
    var totalDebit = data.lines.reduce(function (sum, line) {
        var amount = typeof line.debit_amount === 'string'
            ? parseFloat(line.debit_amount)
            : line.debit_amount;
        return sum + amount;
    }, 0);
    var totalCredit = data.lines.reduce(function (sum, line) {
        var amount = typeof line.credit_amount === 'string'
            ? parseFloat(line.credit_amount)
            : line.credit_amount;
        return sum + amount;
    }, 0);
    return Math.abs(totalDebit - totalCredit) < 0.01; // Tolerancia para redondeo
}, {
    message: 'El total de débitos debe ser igual al total de créditos (partida doble)',
    path: ['lines']
});
export var journalEntryUpdateSchema = z.object({
    id: z.string().uuid(),
    reference: z.string().optional(),
    description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres').optional(),
    entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']).optional(),
    entry_date: z.string().refine(function (val) { return !isNaN(Date.parse(val)); }, 'Fecha inválida').optional(),
    notes: z.string().optional(),
    external_reference: z.string().optional(),
    lines: z.array(journalEntryLineCreateSchema).min(2, 'Un asiento debe tener al menos 2 líneas').optional()
});
export var journalEntryFiltersSchema = z.object({
    skip: z.number().min(0).optional(),
    limit: z.number().min(1).max(1000).optional(),
    entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']).optional(),
    status: z.enum(['draft', 'pending', 'approved', 'posted', 'cancelled']).optional(),
    transaction_origin: z.array(z.enum(['sale', 'purchase', 'adjustment', 'transfer', 'payment', 'collection', 'opening', 'closing', 'other'])).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    search: z.string().optional(),
    account_id: z.string().uuid().optional(),
    created_by_id: z.string().uuid().optional(),
    reference: z.string().optional()
});
// Constantes y etiquetas
export var JOURNAL_ENTRY_TYPE_LABELS = (_a = {},
    _a[JournalEntryType.MANUAL] = 'Manual',
    _a[JournalEntryType.AUTOMATIC] = 'Automático',
    _a[JournalEntryType.ADJUSTMENT] = 'Ajuste',
    _a[JournalEntryType.OPENING] = 'Apertura',
    _a[JournalEntryType.CLOSING] = 'Cierre',
    _a[JournalEntryType.REVERSAL] = 'Reversión',
    _a);
export var JOURNAL_ENTRY_STATUS_LABELS = (_b = {},
    _b[JournalEntryStatus.DRAFT] = 'Borrador',
    _b[JournalEntryStatus.PENDING] = 'Pendiente',
    _b[JournalEntryStatus.APPROVED] = 'Aprobado',
    _b[JournalEntryStatus.POSTED] = 'Contabilizado',
    _b[JournalEntryStatus.CANCELLED] = 'Cancelado',
    _b);
export var JOURNAL_ENTRY_TYPE_DESCRIPTIONS = (_c = {},
    _c[JournalEntryType.MANUAL] = 'Asiento creado manualmente por el usuario',
    _c[JournalEntryType.AUTOMATIC] = 'Asiento generado automáticamente por el sistema',
    _c[JournalEntryType.ADJUSTMENT] = 'Asiento de ajuste contable',
    _c[JournalEntryType.OPENING] = 'Asiento de apertura de periodo',
    _c[JournalEntryType.CLOSING] = 'Asiento de cierre de periodo',
    _c[JournalEntryType.REVERSAL] = 'Asiento de reversión',
    _c);
// Labels para mostrar en UI
export var TransactionOriginLabels = (_d = {},
    _d[TransactionOrigin.SALE] = 'Venta',
    _d[TransactionOrigin.PURCHASE] = 'Compra',
    _d[TransactionOrigin.ADJUSTMENT] = 'Ajuste',
    _d[TransactionOrigin.TRANSFER] = 'Transferencia',
    _d[TransactionOrigin.PAYMENT] = 'Pago',
    _d[TransactionOrigin.COLLECTION] = 'Cobro',
    _d[TransactionOrigin.OPENING] = 'Apertura',
    _d[TransactionOrigin.CLOSING] = 'Cierre',
    _d[TransactionOrigin.OTHER] = 'Otro',
    _d);
// Helpers para validación de productos en journal entries
export var getTransactionOriginColor = function (origin) {
    if (!origin)
        return 'bg-gray-100 text-gray-800';
    switch (origin) {
        case TransactionOrigin.SALE:
        case TransactionOrigin.COLLECTION:
            return 'bg-green-100 text-green-800';
        case TransactionOrigin.PURCHASE:
        case TransactionOrigin.PAYMENT:
            return 'bg-blue-100 text-blue-800';
        case TransactionOrigin.ADJUSTMENT:
            return 'bg-yellow-100 text-yellow-800';
        case TransactionOrigin.TRANSFER:
            return 'bg-purple-100 text-purple-800';
        case TransactionOrigin.OPENING:
            return 'bg-indigo-100 text-indigo-800';
        case TransactionOrigin.CLOSING:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
// Helper para determinar si una transacción requiere productos
export var isProductTransaction = function (origin) {
    return origin === TransactionOrigin.SALE || origin === TransactionOrigin.PURCHASE;
};
// Helper para validar coherencia de origen con líneas
export var validateTransactionOriginCoherence = function (origin, lines) {
    if (!origin || !lines || lines.length === 0) {
        return { valid: true };
    }
    var salesOrigins = [TransactionOrigin.SALE, TransactionOrigin.COLLECTION];
    var purchaseOrigins = [TransactionOrigin.PURCHASE, TransactionOrigin.PAYMENT];
    if (salesOrigins.includes(origin)) {
        var hasRevenueLines = lines.some(function (line) { return parseFloat(line.credit_amount) > 0; });
        if (!hasRevenueLines) {
            return {
                valid: false,
                message: 'Los asientos de ventas/cobros deben incluir al menos una línea de crédito (ingreso)'
            };
        }
    }
    if (purchaseOrigins.includes(origin)) {
        var hasExpenseLines = lines.some(function (line) { return parseFloat(line.debit_amount) > 0; });
        if (!hasExpenseLines) {
            return {
                valid: false,
                message: 'Los asientos de compras/pagos deben incluir al menos una línea de débito (gasto o activo)'
            };
        }
    }
    return { valid: true };
};
