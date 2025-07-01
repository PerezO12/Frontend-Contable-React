import type { DeletionService, DeletionCheckResult } from '../../../components/atomic/types';
import type { Product } from '../types';
import { ProductService } from './productService';

// Implementación del servicio de eliminación para productos
export class ProductDeletionService implements DeletionService<Product> {
  
  async checkDeletable(products: Product[]): Promise<DeletionCheckResult<Product>> {
    try {
      // Llamada al endpoint que verifica si los productos se pueden eliminar
      const productIds = products.map(p => p.id);
      const validationResults = await ProductService.validateDeletion(productIds);
      
      // Separar productos en eliminables y no eliminables
      const canDelete: Product[] = [];
      const cannotDelete: Product[] = [];
      const reasons: Record<string | number, string> = {};

      products.forEach(product => {
        const validation = validationResults.find((v: any) => v.product_id === product.id);
        if (validation?.can_delete) {
          canDelete.push(product);
        } else {
          cannotDelete.push(product);
          if (validation?.blocking_reasons && validation.blocking_reasons.length > 0) {
            reasons[product.id] = validation.blocking_reasons.join(', ');
          } else {
            reasons[product.id] = 'No se puede eliminar este producto';
          }
        }
      });

      return {
        canDelete,
        cannotDelete,
        reasons,
      };
    } catch (error) {
      console.error('Error al verificar productos eliminables:', error);
      throw new Error('No se pudo verificar qué productos se pueden eliminar');
    }
  }

  async deleteItems(products: Product[]): Promise<void> {
    try {
      const productIds = products.map(p => p.id);
      await ProductService.bulkDeleteProducts(productIds);
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      throw new Error('No se pudieron eliminar los productos seleccionados');
    }
  }
}

// Instancia singleton para reutilizar
export const productDeletionService = new ProductDeletionService();
