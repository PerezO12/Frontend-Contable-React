import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
  ProductListResponse,
  ProductSearchResponse,
  ProductStatistics,
  ProductSummary,
  ProductMovement,
  ProductDetailedStats,
  ProductDetailResponse,
  LowStockProduct,
  ReorderProduct,
  StockAdjustment,
  StockAdjustmentResult,
  BulkProductOperation,
  BulkProductOperationResult,
  BulkProductDeleteResult,
  ProductDeletionValidation
} from '../types';

/**
 * Servicio para operaciones relacionadas con productos
 * Maneja todas las interacciones con el API backend de productos
 */
export class ProductService {
  private static readonly BASE_URL = '/api/v1/products';

  /**
   * Obtener lista de productos con filtros
   */
  static async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    console.log('Obteniendo productos con filtros:', filters);
    
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }    const url = params.toString() ? `${this.BASE_URL}?${params}` : this.BASE_URL;
    
    try {
      const response = await apiClient.get(url);
      console.log('Respuesta del servidor - productos:', response.data);
        // La respuesta real tiene estructura: {success: true, data: {products: [...], total: ..., etc}}
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Respuesta del servidor inválida');
      }
      
      // Adaptar a la estructura esperada por el hook
      const data = apiResponse.data;
      return {
        items: data.products || data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        per_page: data.size || data.per_page || 50,
        pages: data.pages || 1
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Buscar productos por texto
   */  static async searchProducts(query: string, limit: number = 20): Promise<ProductSearchResponse> {
    console.log('Buscando productos:', { query, limit });
    
    const params = new URLSearchParams({
      q: query,
      limit: String(limit)
    });

    try {
      const response = await apiClient.get(`${this.BASE_URL}/search?${params}`);
      console.log('Resultados de búsqueda de productos:', response.data);
      
      // La respuesta tiene estructura: {success: true, data: {results: [...], total_found: ..., etc}}
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        return {
          results: [],
          total_found: 0,
          search_term: query
        };
      }
      
      return {
        results: apiResponse.data.results || [],
        total_found: apiResponse.data.total_found || 0,
        search_term: query
      };
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }
  /**
   * Obtener un producto por ID
   */  static async getProductById(id: string): Promise<Product> {
    console.log('Obteniendo producto por ID:', id);
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/${id}`);
      console.log('Producto obtenido:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Producto no encontrado');
      }
      
      // El backend devuelve la estructura extendida, extraemos solo el producto
      const responseData = apiResponse.data;
      return responseData.product || responseData;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }
  /**
   * Obtener un producto por código
   */
  static async getProductByCode(code: string): Promise<Product> {
    console.log('Obteniendo producto por código:', code);
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/code/${encodeURIComponent(code)}`);
      console.log('Producto obtenido por código:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.product) {
        throw new Error('Producto no encontrado');
      }
      
      return apiResponse.product;
    } catch (error) {
      console.error('Error al obtener producto por código:', error);
      throw error;
    }
  }
  /**
   * Obtener información detallada de un producto por ID (incluyendo movimientos, stock y contabilidad)
   */  static async getProductDetailById(id: string): Promise<ProductDetailResponse> {
    console.log('Obteniendo información detallada del producto por ID:', id);
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/${id}`);
      console.log('Información detallada del producto obtenida:', response.data);
      
      const data = response.data;
      
      // Verificar que la respuesta tenga la estructura esperada
      if (!data || !data.product) {
        throw new Error('Información del producto no encontrada');
      }
      
      // El backend devuelve directamente la estructura completa
      return data;
    } catch (error) {
      console.error('Error al obtener información detallada del producto:', error);
      throw error;
    }
  }
  /**
   * Crear un nuevo producto
   */  
  static async createProduct(productData: ProductCreate): Promise<Product> {
    console.log('=== SERVICIO: CREANDO PRODUCTO ===');
    console.log('URL:', this.BASE_URL);
    console.log('Datos a enviar:', JSON.stringify(productData, null, 2));
    
    try {
      const response = await apiClient.post(this.BASE_URL, productData);
        console.log('=== RESPUESTA DEL SERVIDOR ===');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data completa:', JSON.stringify(response.data, null, 2));
      
      // Manejar diferentes estructuras de respuesta
      const apiResponse = response.data;
      
      // Caso 1: Respuesta con estructura {success: true, data: Product}
      if (apiResponse && apiResponse.success === true && apiResponse.data) {
        console.log('=== PRODUCTO CREADO CORRECTAMENTE (Estructura con data) ===');
        console.log('Producto devuelto:', JSON.stringify(apiResponse.data, null, 2));
        return apiResponse.data;
      }
      
      // Caso 2: Respuesta directa del producto (sin wrapper)
      if (apiResponse && typeof apiResponse === 'object' && apiResponse.id) {
        console.log('=== PRODUCTO CREADO CORRECTAMENTE (Respuesta directa) ===');
        console.log('Producto devuelto:', JSON.stringify(apiResponse, null, 2));
        return apiResponse;
      }
      
      // Caso 3: Success true pero data undefined - puede ser que el producto esté en otro campo
      if (apiResponse && apiResponse.success === true) {
        console.log('=== ANALIZANDO RESPUESTA CON SUCCESS TRUE ===');
        console.log('Campos disponibles:', Object.keys(apiResponse));
        
        // Buscar el producto en diferentes campos posibles
        const possibleProductFields = ['product', 'item', 'result', 'response'];
        for (const field of possibleProductFields) {
          if (apiResponse[field] && typeof apiResponse[field] === 'object') {
            console.log(`=== PRODUCTO ENCONTRADO EN CAMPO '${field}' ===`);
            console.log('Producto devuelto:', JSON.stringify(apiResponse[field], null, 2));
            return apiResponse[field];
          }
        }
      }
      
      // Si llegamos aquí, la respuesta no tiene la estructura esperada
      console.error('=== ERROR: RESPUESTA INESPERADA ===');
      console.error('ApiResponse.success:', apiResponse?.success);
      console.error('ApiResponse.data:', apiResponse?.data);
      console.error('Tipo de apiResponse:', typeof apiResponse);
      console.error('Campos disponibles en apiResponse:', apiResponse ? Object.keys(apiResponse) : 'N/A');
      
      throw new Error(`Error al crear el producto - respuesta inesperada del servidor. Status: ${response.status}`);
      
    } catch (error) {
      console.log('=== ERROR EN SERVICIO ===');
      console.error('Error completo:', error);
      
      // Si es error de Axios, mostrar más detalles
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('=== DETALLES DEL ERROR DE AXIOS ===');
        console.error('Status:', axiosError.response?.status);
        console.error('StatusText:', axiosError.response?.statusText);
        console.error('Data:', JSON.stringify(axiosError.response?.data, null, 2));
        console.error('Headers:', axiosError.response?.headers);
        console.error('Config URL:', axiosError.config?.url);
        console.error('Config Method:', axiosError.config?.method);
        console.error('Config Data:', axiosError.config?.data);
      }
      
      throw error;
    }
  }
  /**
   * Actualizar un producto existente
   */
  static async updateProduct(id: string, productData: ProductUpdate): Promise<Product> {
    console.log('Actualizando producto:', { id, productData });
    
    try {
      const response = await apiClient.put(`${this.BASE_URL}/${id}`, productData);
      console.log('Respuesta del servidor - producto actualizado:', response.data);
      
      // La respuesta tiene estructura: {success: true, data: Product}
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Error al actualizar el producto');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }  /**
   * Eliminar un producto - IMPLEMENTADO
   */
  static async deleteProduct(id: string): Promise<void> {
    console.log('Eliminando producto:', id);
    
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  /**
   * Obtener productos activos
   */
  static async getActiveProducts(): Promise<Product[]> {
    console.log('Obteniendo productos activos');
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/active`);
      console.log('Productos activos obtenidos:', response.data);
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos activos:', error);
      throw error;
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getLowStockProducts(): Promise<LowStockProduct[]> {
    console.log('Obteniendo productos con stock bajo');
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/low-stock`);
      console.log('Productos con stock bajo:', response.data);
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Obtener productos que necesitan reorden
   */
  static async getProductsNeedingReorder(): Promise<ReorderProduct[]> {
    console.log('Obteniendo productos que necesitan reorden');
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/need-reorder`);
      console.log('Productos que necesitan reorden:', response.data);
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos que necesitan reorden:', error);
      throw error;
    }
  }

  /**
   * Activar producto
   */
  static async activateProduct(id: string): Promise<Product> {
    console.log('Activando producto:', id);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/activate`);
      console.log('Producto activado:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Error al activar producto');
      }
      
      return apiResponse.product;
    } catch (error) {
      console.error('Error al activar producto:', error);
      throw error;
    }
  }

  /**
   * Desactivar producto
   */
  static async deactivateProduct(id: string): Promise<Product> {
    console.log('Desactivando producto:', id);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/deactivate`);
      console.log('Producto desactivado:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Error al desactivar producto');
      }
      
      return apiResponse.product;
    } catch (error) {
      console.error('Error al desactivar producto:', error);
      throw error;
    }
  }

  /**
   * Descontinuar producto
   */
  static async discontinueProduct(id: string): Promise<Product> {
    console.log('Descontinuando producto:', id);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/discontinue`);
      console.log('Producto descontinuado:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Error al descontinuar producto');
      }
      
      return apiResponse.product;
    } catch (error) {
      console.error('Error al descontinuar producto:', error);
      throw error;
    }
  }

  /**
   * Agregar stock a producto
   */
  static async addStock(id: string, data: {
    quantity: number;
    unit_cost?: number;
    reason: string;
    reference?: string;
  }): Promise<StockAdjustmentResult> {
    console.log('Agregando stock al producto:', { id, data });
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/stock/add`, data);
      console.log('Stock agregado:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Error al agregar stock');
      }
      
      return {
        message: apiResponse.message,
        product_id: apiResponse.product.id,
        previous_stock: apiResponse.product.previous_stock,
        new_stock: apiResponse.product.new_stock,
        adjustment_quantity: apiResponse.product.added_quantity,
        movement_id: apiResponse.product.movement_id
      };
    } catch (error) {
      console.error('Error al agregar stock:', error);
      throw error;
    }
  }

  /**
   * Reducir stock de producto
   */
  static async subtractStock(id: string, data: {
    quantity: number;
    reason: string;
    reference?: string;
  }): Promise<StockAdjustmentResult> {
    console.log('Reduciendo stock del producto:', { id, data });
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/stock/subtract`, data);
      console.log('Stock reducido:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Error al reducir stock');
      }
      
      return {
        message: apiResponse.message,
        product_id: apiResponse.product.id,
        previous_stock: apiResponse.product.previous_stock,
        new_stock: apiResponse.product.new_stock,
        adjustment_quantity: apiResponse.product.subtracted_quantity,
        movement_id: apiResponse.product.movement_id
      };
    } catch (error) {
      console.error('Error al reducir stock:', error);
      throw error;
    }
  }  /**
   * Ajustar stock de producto - NO DISPONIBLE COMO ENDPOINT ÚNICO
   * El backend tiene endpoints separados para add y subtract
   * Usar addStock o subtractStock según el tipo de ajuste
   */
  static async adjustStock(id: string, adjustment: StockAdjustment): Promise<StockAdjustmentResult> {
    console.log('Ajustando stock del producto:', { id, adjustment });
    
    try {
      // Determinar si es suma o resta basado en la cantidad
      if (adjustment.quantity >= 0) {
        return await this.addStock(id, {
          quantity: adjustment.quantity,
          reason: adjustment.reason,
          reference: adjustment.reference_document
        });
      } else {
        return await this.subtractStock(id, {
          quantity: Math.abs(adjustment.quantity),
          reason: adjustment.reason,
          reference: adjustment.reference_document
        });
      }
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      throw error;
    }
  }

  /**
   * Obtener movimientos de producto
   */
  static async getProductMovements(
    id: string, 
    filters?: {
      skip?: number;
      limit?: number;
      start_date?: string;
      end_date?: string;
      movement_type?: string;
    }
  ): Promise<{
    movements: ProductMovement[];
    total: number;
    current_stock: string;
  }> {
    console.log('Obteniendo movimientos del producto:', { id, filters });
    
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const url = params.toString() 
      ? `${this.BASE_URL}/${id}/movements?${params}`
      : `${this.BASE_URL}/${id}/movements`;
    
    try {
      const response = await apiClient.get(url);
      console.log('Movimientos obtenidos:', response.data);
      
      return {
        movements: response.data.movements || [],
        total: response.data.total || 0,
        current_stock: response.data.current_stock || '0'
      };
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas detalladas de producto
   */
  static async getProductDetailedStats(
    id: string,
    params?: {
      period?: 'month' | 'quarter' | 'year';
      start_date?: string;
      end_date?: string;
    }
  ): Promise<ProductDetailedStats> {
    console.log('Obteniendo estadísticas detalladas del producto:', { id, params });
    
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const url = searchParams.toString() 
      ? `${this.BASE_URL}/${id}/stats?${searchParams}`
      : `${this.BASE_URL}/${id}/stats`;
    
    try {
      const response = await apiClient.get(url);
      console.log('Estadísticas detalladas obtenidas:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas detalladas:', error);
      throw error;
    }
  }
  /**
   * Operaciones masivas
   */
  static async bulkOperation(operation: BulkProductOperation): Promise<BulkProductOperationResult> {
    console.log('Ejecutando operación masiva:', operation);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/bulk-operation`, operation);
      console.log('Resultado de operación masiva:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error en operación masiva:', error);
      throw error;
    }
  }

  /**
   * Validar eliminación de productos
   */
  static async validateDeletion(productIds: string[]): Promise<ProductDeletionValidation[]> {
    console.log('Validando eliminación de productos:', productIds);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/validate-deletion`, productIds);
      console.log('Resultado de validación:', response.data);
      
      return response.data || [];
    } catch (error) {
      console.error('Error al validar eliminación:', error);
      throw error;
    }
  }

  /**
   * Eliminación masiva de productos
   */
  static async bulkDeleteProducts(productIds: string[]): Promise<BulkProductDeleteResult> {
    console.log('Eliminación masiva de productos:', productIds);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/bulk-delete`, productIds);
      console.log('Resultado de eliminación masiva:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error en eliminación masiva de productos:', error);
      throw error;
    }
  }

  /**
   * Desactivación masiva de productos
   */
  static async bulkDeactivateProducts(productIds: string[]): Promise<BulkProductOperationResult> {
    console.log('Desactivación masiva de productos:', productIds);
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/bulk-deactivate`, productIds);
      console.log('Resultado de desactivación masiva:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error en desactivación masiva de productos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de productos
   */
  static async getProductStatistics(): Promise<ProductStatistics> {
    console.log('Obteniendo estadísticas de productos');
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}/statistics`);
      console.log('Estadísticas de productos:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error('Error al obtener estadísticas');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de productos:', error);
      throw error;
    }
  }

  /**
   * Obtener productos activos resumidos para selectors
   */  
  static async getProductsForSelector(limit: number = 100): Promise<ProductSummary[]> {
    console.log('Obteniendo productos para selector');
    
    try {
      const response = await apiClient.get(`${this.BASE_URL}?is_active=true&limit=${limit}&sort_by=name&sort_order=asc`);
        console.log('Respuesta completa para selector:', response.data);
      
      // La respuesta real tiene estructura: {success: true, data: {products: [...], total: ..., etc}}
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        console.error('Estructura de respuesta inesperada:', apiResponse);
        return [];
      }
      
      // Verificar si tenemos productos en la estructura real
      const products = apiResponse.data.products || apiResponse.data.items || [];
      
      if (!Array.isArray(products)) {
        console.error('Productos no es un array:', products);
        return [];
      }
      
      // Mapear a ProductSummary
      const mappedProducts: ProductSummary[] = products.map((product: any) => ({
        id: product.id,
        code: product.code,
        name: product.name,
        sale_price: product.sale_price,
        current_stock: product.current_stock,
        status: product.status,
        product_type: product.product_type,
        measurement_unit: product.measurement_unit,
        tax_rate: product.tax_rate
      }));
      
      console.log('Productos mapeados para selector:', mappedProducts);
      return mappedProducts;
    } catch (error) {
      console.error('Error al obtener productos para selector:', error);
      throw error;
    }
  }

  /**
   * Validar disponibilidad de stock
   */
  static async validateStockAvailability(productId: string, requiredQuantity: number): Promise<{
    available: boolean;
    currentStock: number;
    message?: string;
  }> {
    console.log('Validando disponibilidad de stock:', { productId, requiredQuantity });
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${productId}/validate-stock`, {
        required_quantity: requiredQuantity
      });
      
      console.log('Resultado de validación de stock:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error('Error al validar stock');
      }
      
      return {
        available: apiResponse.data.available,
        currentStock: apiResponse.data.current_stock,
        message: apiResponse.data.message
      };
    } catch (error) {
      console.error('Error al validar disponibilidad de stock:', error);
      throw error;
    }
  }

  /**
   * Activar/Desactivar producto (método legacy para compatibilidad)
   */
  static async toggleProductStatus(id: string, isActive: boolean): Promise<Product> {
    console.log('Cambiando estado del producto:', { id, isActive });
    
    try {
      // Usar los nuevos métodos según el estado deseado
      if (isActive) {
        return await this.activateProduct(id);
      } else {
        return await this.deactivateProduct(id);
      }
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
      throw error;
    }
  }

  /**
   * Duplicar producto (crear copia)
   */
  static async duplicateProduct(id: string, newCode: string): Promise<Product> {
    console.log('Duplicando producto:', { id, newCode });
    
    try {
      const response = await apiClient.post(`${this.BASE_URL}/${id}/duplicate`, {
        new_code: newCode
      });
      
      console.log('Producto duplicado:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error('Error al duplicar producto');
      }
      
      return apiResponse.data;
    } catch (error) {      
      console.error('Error al duplicar producto:', error);
      throw error;
    }
  }

  // ==========================================
  // Exportación usando sistema genérico
  // ==========================================

  /**
   * Exportar productos seleccionados usando el sistema genérico de exportación
   */
  static async exportProducts(
    productIds: string[],
    format: 'csv' | 'json' | 'xlsx' = 'xlsx'
  ): Promise<Blob> {
    console.log('Exportando productos con sistema genérico:', { productIds, format });
    
    try {
      const blob = await ExportService.exportByIds({
        table: 'products',
        format,
        ids: productIds,
        file_name: ExportService.generateFileName('products', format)
      });
      
      console.log('Productos exportados exitosamente usando sistema genérico');
      return blob;
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw error;
    }
  }
}
