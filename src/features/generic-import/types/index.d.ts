export type FieldType = 'string' | 'integer' | 'decimal' | 'date' | 'datetime' | 'boolean' | 'email' | 'phone' | 'many_to_one';
export type ImportPolicy = 'create_only' | 'update_only' | 'upsert';
export interface ValidationRule {
    rule_type: string;
    parameters: Record<string, any>;
    error_message: string;
}
export interface FieldMetadata {
    internal_name: string;
    display_label: string;
    field_type: FieldType;
    is_required: boolean;
    is_unique: boolean;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    related_model?: string;
    search_field?: string;
    validation_rules: ValidationRule[];
    description?: string;
    default_value?: string;
}
export interface ModelMetadata {
    model_name: string;
    display_name: string;
    description?: string;
    fields: FieldMetadata[];
    import_permissions: string[];
    business_key_fields: string[];
    table_name?: string;
}
export interface FieldMetadata {
    internal_name: string;
    display_label: string;
    field_type: FieldType;
    is_required: boolean;
    is_unique: boolean;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    related_model?: string;
    search_field?: string;
    validation_rules: ValidationRule[];
    description?: string;
    default_value?: string;
}
export interface ModelMetadata {
    model_name: string;
    display_name: string;
    description?: string;
    fields: FieldMetadata[];
    import_permissions: string[];
    business_key_fields: string[];
    table_name?: string;
}
export interface FileInfo {
    name: string;
    size: number;
    encoding: string;
    delimiter?: string;
    total_rows: number;
}
export interface DetectedColumn {
    name: string;
    sample_values: string[];
    data_type_hint?: string;
}
export interface ImportSessionResponse {
    import_session_token: string;
    model: string;
    model_display_name: string;
    file_info: FileInfo;
    detected_columns: DetectedColumn[];
    sample_rows: Record<string, any>[];
}
export interface MappingSuggestion {
    column_name: string;
    suggested_field: string;
    confidence: number;
    reason: string;
}
export interface FieldInfo {
    internal_name: string;
    display_label: string;
    field_type: string;
    is_required: boolean;
    is_unique: boolean;
    max_length?: number;
    related_model?: string;
    search_field?: string;
    description?: string;
}
export interface ModelMappingResponse {
    model: string;
    model_display_name: string;
    available_fields: FieldInfo[];
    suggested_mappings: MappingSuggestion[];
    available_templates: Record<string, any>[];
}
export interface ColumnMapping {
    column_name: string;
    field_name?: string;
    default_value?: string;
}
export interface ValidationError {
    field_name: string;
    error_type: string;
    message: string;
    current_value?: string;
}
export interface PreviewRowData {
    row_number: number;
    original_data: Record<string, any>;
    transformed_data: Record<string, any>;
    validation_status: 'valid' | 'error' | 'warning';
    errors: ValidationError[];
    warnings: ValidationError[];
}
export interface BatchInfo {
    current_batch: number;
    total_batches: number;
    batch_size: number;
    total_rows: number;
    current_batch_rows: number;
}
export interface BatchPreviewRequest {
    session_id: string;
    batch_number: number;
    batch_size: number;
    mappings: ColumnMapping[];
}
export interface ValidationSummary {
    total_rows?: number;
    total_rows_analyzed?: number;
    valid_rows: number;
    rows_with_errors: number;
    rows_with_warnings: number;
    most_common_errors?: Record<string, number>;
    error_breakdown?: Record<string, number>;
}
export interface ImportPreviewRequest {
    import_session_token: string;
    column_mappings: ColumnMapping[];
    import_policy: ImportPolicy;
    skip_validation_errors: boolean;
    default_values: Record<string, any>;
    batch_size?: number;
    batch_number?: number;
}
export interface ImportPreviewResponse {
    import_session_token: string;
    model: string;
    total_rows: number;
    preview_data: PreviewRowData[];
    validation_summary: ValidationSummary;
    can_proceed: boolean;
    blocking_issues: string[];
    can_skip_errors: boolean;
    skip_errors_available: boolean;
    batch_info?: BatchInfo;
}
export interface ImportExecuteRequest {
    import_session_token: string;
    column_mappings: ColumnMapping[];
    import_policy: ImportPolicy;
    skip_validation_errors: boolean;
    skip_errors: boolean;
    dry_run: boolean;
    default_values: Record<string, any>;
}
export interface ImportResult {
    import_id: string;
    import_session_token: string;
    model: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    total_rows: number;
    processed_rows: number;
    created_rows: number;
    updated_rows: number;
    failed_rows: number;
    skipped_rows: number;
    skip_errors: boolean;
    skipped_details?: string[];
    processing_time_seconds?: number;
    error_summary?: Record<string, number>;
    detailed_errors?: PreviewRowData[];
    created_entities?: Array<{
        row_number: number;
        entity_id: string;
        entity_data: Record<string, any>;
    }>;
    updated_entities?: Array<{
        row_number: number;
        entity_id: string;
        entity_data: Record<string, any>;
    }>;
    started_at: string;
    completed_at?: string;
}
export interface ImportTemplate {
    template_name: string;
    model: string;
    description: string;
    column_mappings: ColumnMapping[];
    default_values: Record<string, any>;
    import_policy: ImportPolicy;
    created_by: string;
    created_at: string;
    is_public: boolean;
}
export interface SaveTemplateRequest {
    template_name: string;
    description: string;
    column_mappings: ColumnMapping[];
    default_values: Record<string, any>;
    import_policy: ImportPolicy;
    is_public: boolean;
}
export interface WizardState {
    currentStep: 'upload' | 'mapping' | 'preview' | 'execute' | 'result';
    selectedModel?: string;
    importSession?: ImportSessionResponse;
    columnMappings: ColumnMapping[];
    importPolicy: ImportPolicy;
    skipValidationErrors: boolean;
    skipErrors: boolean;
    defaultValues: Record<string, any>;
    previewData?: ImportPreviewResponse;
    importResult?: ImportResult;
    error?: string;
    isLoading: boolean;
    batchSize: number;
    importConfig?: ImportConfig;
}
export interface StepperStep {
    id: string;
    label: string;
    description: string;
    status: 'pending' | 'current' | 'completed' | 'error';
    isOptional?: boolean;
}
export interface FieldMappingRowProps {
    column: DetectedColumn;
    mapping: ColumnMapping;
    availableFields: FieldInfo[];
    onMappingChange: (columnName: string, mapping: Partial<ColumnMapping>) => void;
    suggestions?: MappingSuggestion[];
}
export interface ImportStats {
    totalFiles: number;
    totalRows: number;
    successfulImports: number;
    failedImports: number;
    lastImportDate?: string;
}
export interface ImportConfig {
    batch_size: {
        default: number;
        min: number;
        max: number;
        description: string;
    };
    preview_rows: {
        default: number;
        min: number;
        max: number;
        description: string;
    };
    supported_formats: string[];
    max_file_size_mb: number;
    session_timeout_hours: number;
}
export interface ExecuteImportRequest {
    mappings: ColumnMapping[];
    import_policy: ImportPolicy;
    skip_errors: boolean;
    batch_size: number;
}
export interface BatchProcessingResult {
    session_id: string;
    model: string;
    import_policy: ImportPolicy;
    skip_errors: boolean;
    batch_size: number;
    total_batches: number;
    status: 'completed' | 'completed_with_errors' | 'failed';
    total_rows: number;
    successful_rows: number;
    error_rows: number;
    skipped_rows: number;
    errors: string[];
    skipped_details: string[];
    message: string;
}
