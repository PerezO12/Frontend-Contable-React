import { z } from 'zod';
export interface PaymentSchedule {
    id: string;
    payment_terms_id: string;
    sequence: number;
    days: number;
    percentage: number;
    description?: string;
    created_at: string;
    updated_at: string;
}
export interface PaymentTerms {
    id: string;
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
    notes?: string;
    total_percentage: number;
    max_days: number;
    is_valid: boolean;
    created_at: string;
    updated_at: string;
    payment_schedules: PaymentSchedule[];
    payment_schedules_count?: number;
}
export declare const paymentScheduleCreateSchema: z.ZodObject<{
    sequence: z.ZodNumber;
    days: z.ZodNumber;
    percentage: z.ZodEffects<z.ZodNumber, number, number>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    sequence?: number;
    days?: number;
    percentage?: number;
}, {
    description?: string;
    sequence?: number;
    days?: number;
    percentage?: number;
}>;
export declare const paymentTermsCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    payment_schedules: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        sequence: z.ZodNumber;
        days: z.ZodNumber;
        percentage: z.ZodEffects<z.ZodNumber, number, number>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }>, "many">, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>;
}, "strip", z.ZodTypeAny, {
    code?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    notes?: string;
    payment_schedules?: {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[];
}, {
    code?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    notes?: string;
    payment_schedules?: {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[];
}>;
export declare const paymentTermsUpdateSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    payment_schedules: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodObject<{
        sequence: z.ZodNumber;
        days: z.ZodNumber;
        percentage: z.ZodEffects<z.ZodNumber, number, number>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }>, "many">, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>, {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[], {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[]>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    notes?: string;
    payment_schedules?: {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[];
}, {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    notes?: string;
    payment_schedules?: {
        description?: string;
        sequence?: number;
        days?: number;
        percentage?: number;
    }[];
}>;
export declare const paymentTermsFiltersSchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    search: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodOptional<z.ZodEnum<["code", "name", "created_at", "updated_at", "max_days"]>>;
    sort_order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
    sort_by?: "code" | "name" | "created_at" | "updated_at" | "max_days";
    sort_order?: "desc" | "asc";
}, {
    search?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
    sort_by?: "code" | "name" | "created_at" | "updated_at" | "max_days";
    sort_order?: "desc" | "asc";
}>;
export type PaymentScheduleCreate = z.infer<typeof paymentScheduleCreateSchema>;
export type PaymentTermsCreate = z.infer<typeof paymentTermsCreateSchema>;
export type PaymentTermsUpdate = z.infer<typeof paymentTermsUpdateSchema>;
export type PaymentTermsFilters = z.infer<typeof paymentTermsFiltersSchema>;
export interface PaymentTermsFormData {
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
    notes?: string;
    payment_schedules: PaymentScheduleFormData[];
}
export interface PaymentScheduleFormData {
    sequence: number;
    days: number;
    percentage: number;
    description?: string;
}
export interface PaymentCalculationRequest {
    payment_terms_id: string;
    invoice_date: string;
    amount: number;
}
export interface PaymentCalculationItem {
    sequence: number;
    days: number;
    percentage: number;
    amount: number;
    payment_date: string;
    description: string;
}
export interface PaymentCalculationResult {
    payment_terms: {
        id: string;
        code: string;
        name: string;
    };
    invoice_date: string;
    total_amount: number;
    schedule: PaymentCalculationItem[];
    final_due_date: string;
}
export interface PaymentTermsValidationResult {
    is_valid: boolean;
    total_percentage: number;
    schedules_count: number;
    max_days: number;
    validation_errors: string[];
}
export interface PaymentTermsListResponse {
    items: PaymentTerms[];
    total: number;
    skip: number;
    limit: number;
}
export interface PaymentTermsActiveResponse extends Array<{
    id: string;
    code: string;
    name: string;
    max_days: number;
}> {
}
export declare const PAYMENT_TERMS_SORT_OPTIONS: readonly [{
    readonly value: "code";
    readonly label: "Código";
}, {
    readonly value: "name";
    readonly label: "Nombre";
}, {
    readonly value: "created_at";
    readonly label: "Fecha de creación";
}, {
    readonly value: "updated_at";
    readonly label: "Última actualización";
}, {
    readonly value: "max_days";
    readonly label: "Días máximos";
}];
export declare const PAYMENT_TERMS_COMMON_TEMPLATES: readonly [{
    readonly code: "CONTADO";
    readonly name: "Contado";
    readonly description: "Pago inmediato al contado";
    readonly payment_schedules: readonly [{
        readonly sequence: 1;
        readonly days: 0;
        readonly percentage: 100;
        readonly description: "Pago inmediato";
    }];
}, {
    readonly code: "30D";
    readonly name: "30 días";
    readonly description: "Pago a 30 días fecha factura";
    readonly payment_schedules: readonly [{
        readonly sequence: 1;
        readonly days: 30;
        readonly percentage: 100;
        readonly description: "Pago único a 30 días";
    }];
}, {
    readonly code: "60D";
    readonly name: "60 días";
    readonly description: "Pago a 60 días fecha factura";
    readonly payment_schedules: readonly [{
        readonly sequence: 1;
        readonly days: 60;
        readonly percentage: 100;
        readonly description: "Pago único a 60 días";
    }];
}, {
    readonly code: "30-60";
    readonly name: "30-60 días";
    readonly description: "Pago fraccionado: 50% a 30 días, 50% a 60 días";
    readonly payment_schedules: readonly [{
        readonly sequence: 1;
        readonly days: 30;
        readonly percentage: 50;
        readonly description: "Primer pago - 50%";
    }, {
        readonly sequence: 2;
        readonly days: 60;
        readonly percentage: 50;
        readonly description: "Segundo pago - 50%";
    }];
}, {
    readonly code: "30-60-90";
    readonly name: "30-60-90 días";
    readonly description: "Pago en tres cuotas iguales";
    readonly payment_schedules: readonly [{
        readonly sequence: 1;
        readonly days: 30;
        readonly percentage: 33.33;
        readonly description: "Primera cuota - 33.33%";
    }, {
        readonly sequence: 2;
        readonly days: 60;
        readonly percentage: 33.33;
        readonly description: "Segunda cuota - 33.33%";
    }, {
        readonly sequence: 3;
        readonly days: 90;
        readonly percentage: 33.34;
        readonly description: "Tercera cuota - 33.34%";
    }];
}];
export interface JournalEntryLinePaymentInfo {
    payment_terms_id?: string;
    payment_terms_code?: string;
    payment_terms_name?: string;
    invoice_date?: string;
    due_date?: string;
    effective_invoice_date?: string;
    effective_due_date?: string;
    payment_schedule?: PaymentCalculationItem[];
}
export interface PaymentTermsStatistics {
    total_active: number;
    total_inactive: number;
    most_used: PaymentTerms[];
    average_days: number;
    total_terms: number;
}
export interface PaymentTermsUsageInfo {
    payment_terms_id: string;
    usage_count: number;
    last_used: string;
    most_used_by: string[];
}
