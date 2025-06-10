export interface ImportConfiguration {
  data_type: 'accounts' | 'journal_entries';
  format: 'csv' | 'xlsx' | 'json';
  validation_level: 'strict' | 'tolerant' | 'preview';
  batch_size: number;
  skip_duplicates: boolean;
  update_existing: boolean;
  continue_on_error: boolean;
  csv_delimiter?: string;
  csv_encoding?: string;
  xlsx_sheet_name?: string | null;
  xlsx_header_row?: number;
}

export interface ImportPreviewData {
  detected_format: 'csv' | 'xlsx' | 'json';
  detected_data_type: 'accounts' | 'journal_entries';
  total_rows: number;
  preview_data: any[];
  column_mapping: Record<string, string>;
  validation_errors: ValidationError[];
  recommendations: string[];
}

export interface ValidationError {
  row_number?: number | null;
  field_name?: string | null;
  error_code?: string;
  error_message: string;
  message?: string; // Alias para compatibilidad
  error_type: 'required' | 'invalid_format' | 'invalid_value' | 'business_rule' | 'validation';
  severity: 'error' | 'warning';
}

export interface RowResult {
  row_number: number;
  status: 'success' | 'error' | 'warning' | 'skipped';
  entity_id?: string | null;
  entity_code?: string | null;
  entity_type?: string | null;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ImportResult {
  import_id: string;
  configuration: ImportConfiguration;
  summary: {
    total_rows: number;
    processed_rows: number;
    successful_rows: number;
    error_rows: number;
    warning_rows: number;
    skipped_rows: number;
    processing_time_seconds: number;
    accounts_created: number;
    accounts_updated: number;
    journal_entries_created: number;
    most_common_errors: Record<string, number>;
    // Propiedades de compatibilidad
    failed_rows?: number;
    errors?: number;
    warnings?: number;
  };
  row_results: RowResult[];
  global_errors: ValidationError[];
  started_at: string;
  completed_at: string;
  status: 'completed' | 'failed' | 'partial' | 'processing';
  // Propiedades de compatibilidad
  errors?: ValidationError[];
  warnings?: ValidationError[];
  processing_time?: number;
  created_at?: string;
}

export interface ImportStatus {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  current_batch: number;
  total_batches: number;
  processed_rows: number;
  total_rows: number;
  errors: number;
  warnings: number;
  estimated_remaining_time?: number;
  started_at: string;
  updated_at: string;
}

export interface TemplateInfo {
  data_type: string;
  format: string;
  description: string;
  required_fields: string[];
  optional_fields: string[];
  conditional_fields?: string[];
  valid_values?: Record<string, string[]>;
  field_descriptions: Record<string, string>;
}

export interface AccountImportData {
  code: string;
  name: string;
  account_type: 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'GASTO' | 'COSTOS';
  category?: string;
  parent_code?: string;
  description?: string;
  is_active?: boolean;
  allows_movements?: boolean;
  requires_third_party?: boolean;
  requires_cost_center?: boolean;
  notes?: string;
}

export interface JournalEntryImportData {
  entry_number: string;
  entry_date: string;
  description: string;
  reference?: string;
  entry_type?: 'MANUAL' | 'AUTOMATIC' | 'ADJUSTMENT' | 'OPENING' | 'CLOSING' | 'REVERSAL';
  account_code: string;
  line_description: string;
  debit_amount?: number;
  credit_amount?: number;
  third_party?: string;
  cost_center?: string;
  line_reference?: string;
}

export interface ImportFileUpload {
  file: File;
  data_type: 'accounts' | 'journal_entries';
  validation_level: 'strict' | 'tolerant' | 'preview';
  batch_size?: number;
  preview_rows?: number;
}

export interface TemplateDownload {
  data_type: 'accounts' | 'journal_entries';
  format: 'csv' | 'xlsx' | 'json';
}

export type DataType = 'accounts' | 'journal_entries';
