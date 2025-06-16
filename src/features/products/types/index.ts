import { z } from 'zod';

// Tipos como constantes para evitar enum issues
export const ProductType = {
  PRODUCT: 'product',
  SERVICE: 'service',
  BOTH: 'both'
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

export const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued'
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export const MeasurementUnit = {
  UNIT: 'unit',
  KG: 'kg',
  GRAM: 'gram',
  LITER: 'liter',
  METER: 'meter',
  CM: 'cm',
  M2: 'm2',
  M3: 'm3',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  DOZEN: 'dozen',
  PACK: 'pack',
  BOX: 'box'
} as const;

export type MeasurementUnit = typeof MeasurementUnit[keyof typeof MeasurementUnit];

export const TaxCategory = {
  STANDARD_RATE: 'standard_rate',
  REDUCED_RATE: 'reduced_rate',
  ZERO_RATE: 'zero_rate',
  EXEMPT: 'exempt'
} as const;

export type TaxCategory = typeof TaxCategory[keyof typeof TaxCategory];

export const StockStatus = {
  NORMAL: 'normal',
  LOW: 'low',
  OUT_OF_STOCK: 'out_of_stock',
  OVERSTOCK: 'overstock'
} as const;

export type StockStatus = typeof StockStatus[keyof typeof StockStatus];

// Interface base del producto
export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  product_type: ProductType;
  status: ProductStatus;
  measurement_unit: MeasurementUnit;
  
  // Precios y costos
  cost_price?: string;
  sale_price?: string;
  min_sale_price?: string;
  profit_margin?: string;
  
  // Inventario
  manage_inventory: boolean;
  current_stock?: string;
  min_stock?: string;
  max_stock?: string;
  reorder_point?: string;
  stock_status?: StockStatus;
  
  // Información fiscal
  tax_rate?: string;
  tax_category?: TaxCategory;
  
  // Cuentas contables asociadas
  revenue_account_id?: string;
  revenue_account?: {
    id: string;
    code: string;
    name: string;
  };
  expense_account_id?: string;
  expense_account?: {
    id: string;
    code: string;
    name: string;
  };
  inventory_account_id?: string;
  inventory_account?: {
    id: string;
    code: string;
    name: string;
  };
  
  // Categorización
  category?: string;
  brand?: string;
  model?: string;
  
  // Control
  is_active: boolean;
  
  // Auditoría
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Schema de validación para crear producto (según backend)
export const ProductCreateSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  product_type: z.enum([ProductType.PRODUCT, ProductType.SERVICE, ProductType.BOTH]).default(ProductType.PRODUCT),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  status: z.enum([ProductStatus.ACTIVE, ProductStatus.INACTIVE, ProductStatus.DISCONTINUED]).default(ProductStatus.ACTIVE),
  measurement_unit: z.enum([
    MeasurementUnit.UNIT, MeasurementUnit.KG, MeasurementUnit.GRAM, 
    MeasurementUnit.LITER, MeasurementUnit.METER, MeasurementUnit.CM,
    MeasurementUnit.M2, MeasurementUnit.M3, MeasurementUnit.HOUR,
    MeasurementUnit.DAY, MeasurementUnit.MONTH, MeasurementUnit.YEAR,
    MeasurementUnit.DOZEN, MeasurementUnit.PACK, MeasurementUnit.BOX
  ]).default(MeasurementUnit.UNIT),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  
  // Precios y costos
  purchase_price: z.number().min(0).optional(),
  sale_price: z.number().min(0).optional(),
  min_sale_price: z.number().min(0).optional(),
  suggested_price: z.number().min(0).optional(),
  
  // Información fiscal
  tax_category: z.enum([TaxCategory.STANDARD_RATE, TaxCategory.REDUCED_RATE, TaxCategory.ZERO_RATE, TaxCategory.EXEMPT]).default(TaxCategory.STANDARD_RATE),
  tax_rate: z.number().min(0).max(100).default(19),
  
  // Cuentas contables
  sales_account_id: z.string().uuid().optional(),
  purchase_account_id: z.string().uuid().optional(),
  inventory_account_id: z.string().uuid().optional(),
  cogs_account_id: z.string().uuid().optional(),
  
  // Inventario
  manage_inventory: z.boolean().default(false),
  current_stock: z.number().min(0).optional(),
  min_stock: z.number().min(0).optional(),
  max_stock: z.number().min(0).optional(),
  reorder_point: z.number().min(0).optional(),
  
  // Códigos y referencias
  barcode: z.string().optional(),
  sku: z.string().optional(),
  internal_reference: z.string().optional(),
  supplier_reference: z.string().optional(),
  external_reference: z.string().optional(),
  
  // Notas y fechas
  notes: z.string().optional(),
  launch_date: z.string().datetime().optional(),
  discontinuation_date: z.string().datetime().optional()
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;

// Schema de validación para actualizar producto
export const ProductUpdateSchema = ProductCreateSchema.partial();
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

// Filtros para productos
export interface ProductFilters {
  skip?: number;
  limit?: number;
  product_type?: ProductType;
  status?: ProductStatus;
  is_active?: boolean;
  low_stock?: boolean;
  category?: string;
  min_price?: string;
  max_price?: string;
  sort_by?: 'name' | 'code' | 'sale_price' | 'current_stock' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Respuesta de lista de productos
export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Respuesta de búsqueda de productos
export interface ProductSearchResponse {
  results: Product[];
  total_found: number;
  search_term: string;
}

// Estadísticas de productos
export interface ProductStatistics {
  total_products: number;
  active_products: number;
  inactive_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_stock_value: string;
  products_by_type: {
    product: number;
    service: number;
    both: number;
  };
  products_by_category: Record<string, number>;
}

// Producto resumido para selectors
export interface ProductSummary {
  id: string;
  code: string;
  name: string;
  sale_price?: string;
  current_stock?: string;
  status: ProductStatus;
  product_type: ProductType;
  measurement_unit: MeasurementUnit;
  tax_rate?: string;
}

// Producto con información de línea de asiento contable
export interface ProductLineInfo {
  product: ProductSummary;
  quantity?: string;
  unit_price?: string;
  discount_percentage?: string;
  discount_amount?: string;
  tax_percentage?: string;
  tax_amount?: string;
  line_total?: string;
}

// Labels para mostrar en UI
export const ProductTypeLabels: Record<ProductType, string> = {
  [ProductType.PRODUCT]: 'Producto',
  [ProductType.SERVICE]: 'Servicio',
  [ProductType.BOTH]: 'Producto/Servicio'
};

export const ProductStatusLabels: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: 'Activo',
  [ProductStatus.INACTIVE]: 'Inactivo',
  [ProductStatus.DISCONTINUED]: 'Descontinuado'
};

export const MeasurementUnitLabels: Record<MeasurementUnit, string> = {
  [MeasurementUnit.UNIT]: 'Unidad',
  [MeasurementUnit.KG]: 'Kilogramo',
  [MeasurementUnit.GRAM]: 'Gramo',
  [MeasurementUnit.LITER]: 'Litro',
  [MeasurementUnit.METER]: 'Metro',
  [MeasurementUnit.CM]: 'Centímetro',
  [MeasurementUnit.M2]: 'Metro²',
  [MeasurementUnit.M3]: 'Metro³',
  [MeasurementUnit.HOUR]: 'Hora',
  [MeasurementUnit.DAY]: 'Día',
  [MeasurementUnit.MONTH]: 'Mes',
  [MeasurementUnit.YEAR]: 'Año',
  [MeasurementUnit.DOZEN]: 'Docena',
  [MeasurementUnit.PACK]: 'Paquete',
  [MeasurementUnit.BOX]: 'Caja'
};

export const TaxCategoryLabels: Record<TaxCategory, string> = {
  [TaxCategory.STANDARD_RATE]: 'Tarifa Estándar',
  [TaxCategory.REDUCED_RATE]: 'Tarifa Reducida',
  [TaxCategory.ZERO_RATE]: 'Tarifa Cero',
  [TaxCategory.EXEMPT]: 'Exento'
};

export const StockStatusLabels: Record<StockStatus, string> = {
  [StockStatus.NORMAL]: 'Normal',
  [StockStatus.LOW]: 'Stock Bajo',
  [StockStatus.OUT_OF_STOCK]: 'Sin Stock',
  [StockStatus.OVERSTOCK]: 'Exceso de Stock'
};

// Constantes para validaciones
export const PRODUCT_VALIDATION = {
  CODE_MAX_LENGTH: 50,
  NAME_MAX_LENGTH: 200,
  MIN_POSITIVE_VALUE: 0.0001,
  MAX_PERCENTAGE: 100,
  MIN_PERCENTAGE: 0
} as const;
