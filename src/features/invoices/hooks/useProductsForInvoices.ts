/**
 * Hook para obtener productos para facturas
 */
import { useState, useEffect } from 'react';
import { ProductService } from '@/features/products/services/productService';
import type { Product, ProductType } from '@/features/products/types';

interface UseProductsForInvoicesProps {
  type?: ProductType | 'all';
}

interface ProductOption {
  value: string;
  label: string;
  code?: string;
  price?: number;
  tax_rate?: number;
  type: ProductType;
}

export function useProductsForInvoices({ type = 'all' }: UseProductsForInvoicesProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = type !== 'all' ? { product_type: type } : undefined;
        const response = await ProductService.getProducts(filters);
        setProducts(response.items || []);
      } catch (err) {
        setError('Error al cargar productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);
  // Convertir a opciones para el Select
  const options: ProductOption[] = products.map(product => ({
    value: product.id,
    label: `${product.code ? product.code + ' - ' : ''}${product.name}`,
    code: product.code,
    price: product.sale_price ? parseFloat(product.sale_price) : undefined,
    tax_rate: product.tax_rate ? parseFloat(product.tax_rate) : undefined,
    type: product.product_type
  }));

  // Filtrar solo productos
  const productOptions = options.filter(option => option.type === 'product');
  
  // Filtrar solo servicios
  const serviceOptions = options.filter(option => option.type === 'service');

  return {
    products,
    options,
    productOptions,
    serviceOptions,
    loading,
    error,
    refetch: () => {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const filters = type !== 'all' ? { product_type: type } : undefined;
          const response = await ProductService.getProducts(filters);
          setProducts(response.items || []);
        } catch (err) {
          setError('Error al cargar productos');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  };
}
