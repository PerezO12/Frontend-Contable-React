import { z } from 'zod';
export declare const ThirdPartyType: {
    readonly CUSTOMER: "customer";
    readonly SUPPLIER: "supplier";
    readonly EMPLOYEE: "employee";
    readonly SHAREHOLDER: "shareholder";
    readonly BANK: "bank";
    readonly GOVERNMENT: "government";
    readonly OTHER: "other";
};
export type ThirdPartyType = typeof ThirdPartyType[keyof typeof ThirdPartyType];
export declare const DocumentType: {
    readonly RUT: "rut";
    readonly NIT: "nit";
    readonly CUIT: "cuit";
    readonly RFC: "rfc";
    readonly PASSPORT: "passport";
    readonly DNI: "dni";
    readonly OTHER: "other";
};
export type DocumentType = typeof DocumentType[keyof typeof DocumentType];
export interface ThirdParty {
    id: string;
    code?: string;
    name: string;
    commercial_name?: string;
    third_party_type: ThirdPartyType;
    document_type: DocumentType;
    document_number: string;
    tax_id?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    credit_limit?: string;
    payment_terms?: string;
    discount_percentage?: string;
    bank_name?: string;
    bank_account?: string;
    is_active: boolean;
    status?: string;
    is_tax_withholding_agent?: boolean;
    notes?: string;
    internal_code?: string;
    created_at?: string;
    updated_at?: string;
    display_name?: string;
    full_address?: string;
    recent_movements?: any;
    current_balance?: number;
    overdue_balance?: number;
    last_transaction_date?: string;
}
export interface ThirdPartyCreate {
    code?: string;
    name: string;
    commercial_name?: string;
    third_party_type: ThirdPartyType;
    document_type: DocumentType;
    document_number: string;
    tax_id?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    credit_limit?: string;
    payment_terms?: string;
    discount_percentage?: string;
    bank_name?: string;
    bank_account?: string;
    is_active?: boolean;
    is_tax_withholding_agent?: boolean;
    notes?: string;
    internal_code?: string;
}
export interface ThirdPartyUpdate {
    code?: string;
    name?: string;
    commercial_name?: string;
    third_party_type?: ThirdPartyType;
    document_type?: DocumentType;
    document_number?: string;
    tax_id?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    credit_limit?: string;
    payment_terms?: string;
    discount_percentage?: string;
    bank_name?: string;
    bank_account?: string;
    is_active?: boolean;
    is_tax_withholding_agent?: boolean;
    notes?: string;
    internal_code?: string;
}
export interface ThirdPartyFilters {
    search?: string;
    third_party_type?: ThirdPartyType;
    document_type?: DocumentType;
    is_active?: boolean;
    city?: string;
    country?: string;
    skip?: number;
    limit?: number;
}
export interface ThirdPartyStatement {
    third_party: {
        id: string;
        document_number: string;
        business_name: string;
        commercial_name?: string;
        type: ThirdPartyType;
    };
    statement_date: string;
    period: {
        start_date: string;
        end_date: string;
    };
    opening_balance: number;
    movements: ThirdPartyMovement[];
    closing_balance: number;
    summary: {
        total_debits: number;
        total_credits: number;
        net_movement: number;
        transaction_count: number;
    };
    aging_analysis: AgingBuckets;
    generated_at: string;
}
export interface ThirdPartyMovement {
    date: string;
    journal_entry_id: string;
    reference: string;
    description: string;
    document_type: string;
    debit_amount: number;
    credit_amount: number;
    running_balance: number;
    due_date?: string;
    days_overdue: number;
}
export interface ThirdPartyBalance {
    third_party: {
        id: string;
        document_number: string;
        business_name: string;
        type: ThirdPartyType;
    };
    as_of_date: string;
    current_balance: number;
    credit_limit?: number;
    available_credit?: number;
    credit_utilization?: number;
    overdue_balance: number;
    overdue_percentage: number;
    aging_buckets: AgingBuckets;
    oldest_transaction?: {
        date: string;
        amount: number;
        days_old: number;
        reference: string;
    };
    payment_behavior?: {
        average_payment_days: number;
        payment_score: number;
        last_payment_date?: string;
    };
}
export interface AgingBuckets {
    current: number;
    days_30: number;
    days_60: number;
    days_90: number;
    over_120: number;
}
export interface ThirdPartyAnalytics {
    summary: {
        total_third_parties: number;
        active_third_parties: number;
        by_type: Record<ThirdPartyType, number>;
        by_country: Record<string, number>;
    };
    financial_summary: {
        total_receivables: number;
        total_payables: number;
        overdue_receivables: number;
        overdue_payables: number;
        average_credit_limit: number;
        credit_utilization: number;
    };
    top_customers: Array<{
        id: string;
        business_name: string;
        current_balance: number;
        credit_limit: number;
    }>;
    aging_summary: AgingBuckets;
}
export interface ThirdPartyExportRequest {
    format: 'xlsx' | 'csv' | 'pdf';
    filters?: ThirdPartyFilters;
    include_balances?: boolean;
    include_aging?: boolean;
    template?: string;
}
export interface ThirdPartyExportResponse {
    export_id: string;
    status: 'processing' | 'ready' | 'failed';
    download_url?: string;
    file_size?: string;
    record_count?: number;
    expires_at?: string;
    error_message?: string;
}
export interface ThirdPartyImportRequest {
    file: File;
    format: 'csv' | 'xlsx';
    dry_run?: boolean;
    update_existing?: boolean;
}
export interface ThirdPartyImportResponse {
    import_id: string;
    status: 'processing' | 'completed' | 'failed';
    processed_count: number;
    success_count: number;
    error_count: number;
    errors?: Array<{
        row: number;
        field?: string;
        message: string;
    }>;
}
export interface ThirdPartyDeleteValidation {
    third_party_id: string;
    can_delete: boolean;
    blocking_reasons: string[];
    warnings: string[];
    dependencies: Record<string, any>;
}
export interface BulkDeleteRequest {
    third_party_ids: string[];
    force_delete: boolean;
    delete_reason: string;
}
export interface BulkDeleteResult {
    total_requested: number;
    successfully_deleted: string[];
    failed_to_delete: Array<Record<string, any>>;
    validation_errors: Array<Record<string, any>>;
    warnings: string[];
}
export interface BulkThirdPartyOperation {
    operation: 'update' | 'delete' | 'activate' | 'deactivate';
    filters?: ThirdPartyFilters;
    third_party_ids?: string[];
    updates?: Partial<ThirdPartyUpdate>;
}
export interface BulkThirdPartyResult {
    operation_id: string;
    status: 'processing' | 'completed' | 'failed';
    total_count: number;
    success_count: number;
    error_count: number;
    errors?: Array<{
        third_party_id: string;
        business_name: string;
        error: string;
    }>;
    warnings?: Array<{
        third_party_id: string;
        business_name: string;
        warning: string;
    }>;
}
export declare const THIRD_PARTY_TYPE_LABELS: Record<ThirdPartyType, string>;
export declare const DOCUMENT_TYPE_LABELS: Record<DocumentType, string>;
export declare const ThirdPartyCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    third_party_type: z.ZodNativeEnum<{
        readonly CUSTOMER: "customer";
        readonly SUPPLIER: "supplier";
        readonly EMPLOYEE: "employee";
        readonly SHAREHOLDER: "shareholder";
        readonly BANK: "bank";
        readonly GOVERNMENT: "government";
        readonly OTHER: "other";
    }>;
    document_type: z.ZodNativeEnum<{
        readonly RUT: "rut";
        readonly NIT: "nit";
        readonly CUIT: "cuit";
        readonly RFC: "rfc";
        readonly PASSPORT: "passport";
        readonly DNI: "dni";
        readonly OTHER: "other";
    }>;
    document_number: z.ZodString;
    commercial_name: z.ZodOptional<z.ZodString>;
    tax_id: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    mobile: z.ZodOptional<z.ZodString>;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    credit_limit: z.ZodOptional<z.ZodString>;
    payment_terms: z.ZodOptional<z.ZodString>;
    discount_percentage: z.ZodOptional<z.ZodString>;
    bank_name: z.ZodOptional<z.ZodString>;
    bank_account: z.ZodOptional<z.ZodString>;
    is_active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    is_tax_withholding_agent: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    internal_code: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    address?: string;
    code?: string;
    name?: string;
    email?: string;
    state?: string;
    mobile?: string;
    country?: string;
    is_active?: boolean;
    notes?: string;
    phone?: string;
    payment_terms?: string;
    discount_percentage?: string;
    third_party_type?: "other" | "customer" | "supplier" | "employee" | "shareholder" | "bank" | "government";
    document_type?: "other" | "rut" | "nit" | "cuit" | "rfc" | "passport" | "dni";
    document_number?: string;
    commercial_name?: string;
    tax_id?: string;
    website?: string;
    city?: string;
    postal_code?: string;
    credit_limit?: string;
    bank_name?: string;
    bank_account?: string;
    is_tax_withholding_agent?: boolean;
    internal_code?: string;
}, {
    address?: string;
    code?: string;
    name?: string;
    email?: string;
    state?: string;
    mobile?: string;
    country?: string;
    is_active?: boolean;
    notes?: string;
    phone?: string;
    payment_terms?: string;
    discount_percentage?: string;
    third_party_type?: "other" | "customer" | "supplier" | "employee" | "shareholder" | "bank" | "government";
    document_type?: "other" | "rut" | "nit" | "cuit" | "rfc" | "passport" | "dni";
    document_number?: string;
    commercial_name?: string;
    tax_id?: string;
    website?: string;
    city?: string;
    postal_code?: string;
    credit_limit?: string;
    bank_name?: string;
    bank_account?: string;
    is_tax_withholding_agent?: boolean;
    internal_code?: string;
}>;
export declare const ThirdPartyUpdateSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    third_party_type: z.ZodOptional<z.ZodNativeEnum<{
        readonly CUSTOMER: "customer";
        readonly SUPPLIER: "supplier";
        readonly EMPLOYEE: "employee";
        readonly SHAREHOLDER: "shareholder";
        readonly BANK: "bank";
        readonly GOVERNMENT: "government";
        readonly OTHER: "other";
    }>>;
    document_type: z.ZodOptional<z.ZodNativeEnum<{
        readonly RUT: "rut";
        readonly NIT: "nit";
        readonly CUIT: "cuit";
        readonly RFC: "rfc";
        readonly PASSPORT: "passport";
        readonly DNI: "dni";
        readonly OTHER: "other";
    }>>;
    document_number: z.ZodOptional<z.ZodString>;
    commercial_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tax_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    mobile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    state: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    country: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    postal_code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    credit_limit: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    payment_terms: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    discount_percentage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bank_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bank_account: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    is_tax_withholding_agent: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    internal_code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    address?: string;
    code?: string;
    name?: string;
    email?: string;
    state?: string;
    mobile?: string;
    country?: string;
    is_active?: boolean;
    notes?: string;
    phone?: string;
    payment_terms?: string;
    discount_percentage?: string;
    third_party_type?: "other" | "customer" | "supplier" | "employee" | "shareholder" | "bank" | "government";
    document_type?: "other" | "rut" | "nit" | "cuit" | "rfc" | "passport" | "dni";
    document_number?: string;
    commercial_name?: string;
    tax_id?: string;
    website?: string;
    city?: string;
    postal_code?: string;
    credit_limit?: string;
    bank_name?: string;
    bank_account?: string;
    is_tax_withholding_agent?: boolean;
    internal_code?: string;
}, {
    address?: string;
    code?: string;
    name?: string;
    email?: string;
    state?: string;
    mobile?: string;
    country?: string;
    is_active?: boolean;
    notes?: string;
    phone?: string;
    payment_terms?: string;
    discount_percentage?: string;
    third_party_type?: "other" | "customer" | "supplier" | "employee" | "shareholder" | "bank" | "government";
    document_type?: "other" | "rut" | "nit" | "cuit" | "rfc" | "passport" | "dni";
    document_number?: string;
    commercial_name?: string;
    tax_id?: string;
    website?: string;
    city?: string;
    postal_code?: string;
    credit_limit?: string;
    bank_name?: string;
    bank_account?: string;
    is_tax_withholding_agent?: boolean;
    internal_code?: string;
}>;
export interface ThirdPartyListResponse {
    items: ThirdParty[];
    total: number;
    skip: number;
    limit: number;
}
export interface ThirdPartyResponse {
    data: ThirdParty;
}
export type ThirdPartyDetailResponse = ThirdParty;
export interface ThirdPartySearchResponse {
    data: Array<{
        id: string;
        document_number: string;
        business_name: string;
        commercial_name?: string;
        type: ThirdPartyType;
        is_active: boolean;
        current_balance?: number;
    }>;
    total: number;
}
