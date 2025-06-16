import { apiClient } from '../../../shared/api/client';
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
  ProductListResponse,
  ProductSearchResponse,
  ProductStatistics,
  ProductSummary
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
      
      return apiResponse.data;
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
      const response = await apiClient.get(`${this.BASE_URL}/by-code/${encodeURIComponent(code)}`);
      console.log('Producto obtenido por código:', response.data);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Producto no encontrado');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error al obtener producto por código:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   */  static async createProduct(productData: ProductCreate): Promise<Product> {
    console.log('Creando producto:', productData);
    
    try {
      const response = await apiClient.post(this.BASE_URL, productData);
      console.log('Respuesta del servidor - producto creado:', response.data);
      
      // La respuesta tiene estructura: {success: true, data: Product}
      const apiResponse = response.data;
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Error al crear el producto');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
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
  }

  /**
   * Eliminar un producto
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
   * Obtener estadísticas de productos
   */
  static async getProductStatistics(): Promise<ProductStatistics> {
    console.log('Obteniendo estadísticas de productos');
    
    try {
      const response = await apiClient.get<ProductStatistics>(`${this.BASE_URL}/statistics`);
      console.log('Estadísticas de productos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de productos:', error);
      throw error;
    }
  }

  /**
   * Activar/Desactivar producto
   */
  static async toggleProductStatus(id: string, isActive: boolean): Promise<Product> {
    console.log('Cambiando estado del producto:', { id, isActive });
    
    try {
      const response = await apiClient.patch<Product>(`${this.BASE_URL}/${id}/status`, {
        is_active: isActive
      });
      console.log('Estado del producto actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
      throw error;
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getLowStockProducts(): Promise<Product[]> {
    console.log('Obteniendo productos con stock bajo');
    
    try {
      const response = await apiClient.get<ProductListResponse>(`${this.BASE_URL}?low_stock=true`);
      console.log('Productos con stock bajo:', response.data.items);
      return response.data.items;
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Obtener productos activos resumidos para selectors
   */  static async getProductsForSelector(limit: number = 100): Promise<ProductSummary[]> {
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
      const response = await apiClient.post<{
        available: boolean;
        current_stock: number;
        message?: string;
      }>(`${this.BASE_URL}/${productId}/validate-stock`, {
        required_quantity: requiredQuantity
      });
      
      console.log('Resultado de validación de stock:', response.data);
      return {
        available: response.data.available,
        currentStock: response.data.current_stock,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error al validar disponibilidad de stock:', error);
      throw error;
    }
  }

  /**
   * Duplicar producto (crear copia)
   */
  static async duplicateProduct(id: string, newCode: string): Promise<Product> {
    console.log('Duplicando producto:', { id, newCode });
    
    try {
      const response = await apiClient.post<Product>(`${this.BASE_URL}/${id}/duplicate`, {
        new_code: newCode
      });
      console.log('Producto duplicado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al duplicar producto:', error);
      throw error;
    }
  }

  /**
   * Exportar productos (similar a otros features)
   */
  static async exportProducts(filters?: ProductFilters, format: 'xlsx' | 'csv' = 'xlsx'): Promise<Blob> {
    console.log('Exportando productos:', { filters, format });
    
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    try {
      const response = await apiClient.get(`${this.BASE_URL}/export?${params}`, {
        responseType: 'blob'
      });
      
      console.log('Productos exportados exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw error;
    }
  }
}
