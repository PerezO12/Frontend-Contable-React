var _a, _b;
// Types for the Third Parties module
import { z } from 'zod';
// Third Party Types (matching backend enum values EXACTLY)
export var ThirdPartyType = {
    CUSTOMER: 'customer',
    SUPPLIER: 'supplier',
    EMPLOYEE: 'employee',
    SHAREHOLDER: 'shareholder',
    BANK: 'bank',
    GOVERNMENT: 'government',
    OTHER: 'other'
};
// Document Types (matching backend enum values EXACTLY)
export var DocumentType = {
    RUT: 'rut',
    NIT: 'nit',
    CUIT: 'cuit',
    RFC: 'rfc',
    PASSPORT: 'passport',
    DNI: 'dni',
    OTHER: 'other'
};
// Labels for UI display
export var THIRD_PARTY_TYPE_LABELS = (_a = {},
    _a[ThirdPartyType.CUSTOMER] = 'Cliente',
    _a[ThirdPartyType.SUPPLIER] = 'Proveedor',
    _a[ThirdPartyType.EMPLOYEE] = 'Empleado',
    _a[ThirdPartyType.SHAREHOLDER] = 'Accionista',
    _a[ThirdPartyType.BANK] = 'Banco',
    _a[ThirdPartyType.GOVERNMENT] = 'Entidad Gubernamental',
    _a[ThirdPartyType.OTHER] = 'Otro',
    _a);
export var DOCUMENT_TYPE_LABELS = (_b = {},
    _b[DocumentType.RUT] = 'RUT (Chile)',
    _b[DocumentType.NIT] = 'NIT (Colombia)',
    _b[DocumentType.DNI] = 'DNI/Cédula',
    _b[DocumentType.PASSPORT] = 'Pasaporte',
    _b[DocumentType.RFC] = 'RFC (México)',
    _b[DocumentType.CUIT] = 'CUIT (Argentina)',
    _b[DocumentType.OTHER] = 'Otro',
    _b);
// Validation schemas
export var ThirdPartyCreateSchema = z.object({
    code: z.string().min(1, 'Código requerido'),
    name: z.string().min(1, 'Nombre requerido'),
    third_party_type: z.nativeEnum(ThirdPartyType),
    document_type: z.nativeEnum(DocumentType),
    document_number: z.string().min(1, 'Número de documento requerido'),
    commercial_name: z.string().optional(),
    tax_id: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
    credit_limit: z.string().optional(),
    payment_terms: z.string().optional(),
    discount_percentage: z.string().optional(),
    bank_name: z.string().optional(),
    bank_account: z.string().optional(),
    is_active: z.boolean().optional().default(true),
    is_tax_withholding_agent: z.boolean().optional(),
    notes: z.string().optional(),
    internal_code: z.string().optional()
});
export var ThirdPartyUpdateSchema = ThirdPartyCreateSchema.partial();
