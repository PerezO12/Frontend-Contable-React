import type { ReactNode } from 'react';

// Tipos base para el sistema de listados
export interface ListViewColumn<T = any> {
  key: string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  render?: (item: T, value: any) => ReactNode;
  className?: string;
}

export interface ListViewFilter {
  key: string;
  type: 'text' | 'select' | 'date' | 'range' | 'boolean' | 'number';
  label: string;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: any;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export interface ListViewAction<T = any> {
  key: string;
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick: (selectedItems: T[]) => void;
  disabled?: boolean;
  requiresSelection?: boolean;
  confirmMessage?: string;
}

export interface PaginationConfig {
  pageSizeOptions: number[];
  defaultPageSize: number;
  showPageSizeSelector?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  perPage: number;
}

export interface DataFetchParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface DataFetchResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  perPage: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ListViewProps<T = any, F = Record<string, any>> {
  // Identificación y metadatos
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  
  // Configuración de columnas y datos
  columns: ListViewColumn<T>[];
  dataFetcher: (params: DataFetchParams) => Promise<DataFetchResponse<T>>;
  
  // Filtros
  filters?: ListViewFilter[];
  initialFilters?: F;
  
  // Acciones
  actions?: ListViewAction<T>[];
  bulkActions?: ListViewAction<T>[];
  
  // Configuración de paginación
  pagination?: PaginationConfig;
  
  // Comportamiento
  selectionMode?: 'none' | 'single' | 'multiple';
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  
  // Personalización visual
  loadingIndicator?: ReactNode;
  emptyState?: ReactNode;
  variant?: 'table' | 'cards' | 'list';
  
  // Configuración adicional
  refreshInterval?: number;
  enableSearch?: boolean;
  enableExport?: boolean;
  exportFormats?: Array<'csv' | 'json' | 'xlsx'>;
  
  // Accesibilidad
  ariaLabel?: string;
  ariaDescription?: string;
}

// Estados del componente
export interface ListViewState<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  selectedItems: Set<string>;
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters: Record<string, any>;
  pagination?: PaginationInfo;
}

// Eventos del componente
export interface ListViewEvents<T = any> {
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (column: string, order: 'asc' | 'desc') => void;
  onFilter: (filters: Record<string, any>) => void;
  onSelect: (itemId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onBulkAction: (action: string, items: T[]) => void;
}

// Configuración del tema
export interface ListViewTheme {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: string;
    base: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
  };
}

// Tipos para el modal de eliminación genérico
export interface DeletableItem {
  id: string | number;
  [key: string]: any;
}

export interface DeletionCheckResult<T extends DeletableItem> {
  canDelete: T[];
  cannotDelete: T[];
  reasons?: Record<string | number, string>;
}

export interface DeletionService<T extends DeletableItem> {
  checkDeletable: (items: T[]) => Promise<DeletionCheckResult<T>>;
  deleteItems: (items: T[]) => Promise<void>;
}

export interface DeleteModalProps<T extends DeletableItem> {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: T[];
  deletionService: DeletionService<T>;
  itemDisplayName: (item: T) => string;
  itemTypeName: string; // ej: "producto", "tercero", "cuenta"
  onSuccess?: (deletedItems: T[]) => void;
  onError?: (error: string) => void;
}
