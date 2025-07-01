// Types for the Third Parties module
import { z } from 'zod';

// Third Party Types (matching backend enum values EXACTLY)
export const ThirdPartyType = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier', 
  EMPLOYEE: 'employee',
  SHAREHOLDER: 'shareholder',
  BANK: 'bank',
  GOVERNMENT: 'government',
  OTHER: 'other'
} as const;

export type ThirdPartyType = typeof ThirdPartyType[keyof typeof ThirdPartyType];

// Document Types (matching backend enum values EXACTLY)
export const DocumentType = {
  RUT: 'rut',
  NIT: 'nit',
  CUIT: 'cuit',
  RFC: 'rfc',
  PASSPORT: 'passport',
  DNI: 'dni',
  OTHER: 'other'
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

// Base Third Party interface
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
  
  // Calculated fields from backend
  display_name?: string;
  full_address?: string;
  recent_movements?: any;
  current_balance?: number;
  overdue_balance?: number;
  last_transaction_date?: string;
}

// DTOs for API operations
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
  is_tax_withholding_agent?: boolean;  notes?: string;
  internal_code?: string;
}

// Filters for API queries - Debe coincidir exactamente con los query params del backend
export interface ThirdPartyFilters {
  // Parámetros que acepta el backend endpoint GET /api/v1/third-parties
  search?: string; // Búsqueda en código, nombre, número de documento
  third_party_type?: ThirdPartyType; // Tipo de tercero (customer, supplier, employee, etc.)
  document_type?: DocumentType; // Tipo de documento
  is_active?: boolean; // Estado activo/inactivo
  city?: string; // Ciudad
  country?: string; // País
  skip?: number; // Registros a omitir (paginación)
  limit?: number; // Límite de registros (paginación)
  
  // Campos para el ListView genérico
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  
  // Los siguientes campos están en la interfaz original pero NO los usa el backend:
  // document_number?: string;
  // name?: string;
  // commercial_name?: string;
  // email?: string;
  // has_balance?: boolean;
  // created_after?: string;
  // created_before?: string;
  // credit_limit_min?: number;
  // credit_limit_max?: number;
  // order_by?: 'document_number' | 'business_name' | 'created_at' | 'credit_limit';
  // order_desc?: boolean;
}

// Statement interfaces
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

// Balance interfaces
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
  current: number;      // 0-30 días
  days_30: number;      // 31-60 días
  days_60: number;      // 61-90 días
  days_90: number;      // 91-120 días
  over_120: number;     // Más de 120 días
}

// Analytics interfaces
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

// Export and import interfaces
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

// Validación para eliminación
export interface ThirdPartyDeleteValidation {
  third_party_id: string;
  can_delete: boolean;
  blocking_reasons: string[];
  warnings: string[];
  dependencies: Record<string, any>;
}

// Solicitud para eliminación masiva
export interface BulkDeleteRequest {
  third_party_ids: string[];
  force_delete: boolean;
  delete_reason: string;
}

// Nueva estructura de respuesta para eliminación masiva
export interface BulkDeleteResult {
  total_requested: number;
  successfully_deleted: string[];
  failed_to_delete: Array<Record<string, any>>;
  validation_errors: Array<Record<string, any>>;
  warnings: string[];
}

// Bulk operations
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

// Labels for UI display
export const THIRD_PARTY_TYPE_LABELS: Record<ThirdPartyType, string> = {
  [ThirdPartyType.CUSTOMER]: 'Cliente',
  [ThirdPartyType.SUPPLIER]: 'Proveedor',
  [ThirdPartyType.EMPLOYEE]: 'Empleado',
  [ThirdPartyType.SHAREHOLDER]: 'Accionista',
  [ThirdPartyType.BANK]: 'Banco',
  [ThirdPartyType.GOVERNMENT]: 'Entidad Gubernamental',
  [ThirdPartyType.OTHER]: 'Otro'
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.RUT]: 'RUT (Chile)',
  [DocumentType.NIT]: 'NIT (Colombia)',
  [DocumentType.DNI]: 'DNI/Cédula',
  [DocumentType.PASSPORT]: 'Pasaporte',
  [DocumentType.RFC]: 'RFC (México)',
  [DocumentType.CUIT]: 'CUIT (Argentina)',
  [DocumentType.OTHER]: 'Otro'
};

// Validation schemas
export const ThirdPartyCreateSchema = z.object({
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

export const ThirdPartyUpdateSchema = ThirdPartyCreateSchema.partial();

// API Response types
export interface ThirdPartyListResponse {
  items: ThirdParty[];
  total: number;
  skip: number;
  limit: number;
  // Campos adicionales para compatibilidad con ListView
  page?: number;
  pages?: number;
  per_page?: number;
}

export interface ThirdPartyResponse {
  data: ThirdParty;
}

// For individual third party (direct response)
export type ThirdPartyDetailResponse = ThirdParty;

// Search response
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
