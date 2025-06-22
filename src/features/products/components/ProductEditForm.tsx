import React, { useState, useEffect } from 'react';
import { Spinner } from '../../../components/ui/Spinner';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ProductService } from '../services';
import { ProductForm } from './ProductForm';
import { 
  type Product,
  type ProductCreate,
  type ProductDetailResponse 
} from '../types';

interface ProductEditFormProps {
  productId: string;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  productId,
  onSuccess,
  onCancel
}) => {
  const [productData, setProductData] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ProductService.getProductDetailById(productId);
      setProductData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar producto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: ProductCreate): Promise<Product> => {
    try {
      const updatedProduct = await ProductService.updateProduct(productId, updatedData);
      if (onSuccess) {
        onSuccess(updatedProduct);
      }
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };

  // Convertir los datos del producto a formato ProductCreate para el formulario
  const getInitialFormData = (): Partial<ProductCreate> => {
    if (!productData?.product) return {};

    const product = productData.product;
    
    return {
      code: product.code,
      name: product.name,
      description: product.description || '',
      product_type: product.product_type,
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      status: product.status,
      measurement_unit: product.measurement_unit,
      weight: product.weight ? Number(product.weight) : 0,
      dimensions: product.dimensions || '',
      purchase_price: product.purchase_price ? Number(product.purchase_price) : 0,
      sale_price: product.sale_price ? Number(product.sale_price) : 0,
      min_sale_price: product.min_sale_price ? Number(product.min_sale_price) : 0,
      suggested_price: product.suggested_price ? Number(product.suggested_price) : 0,
      tax_category: product.tax_category,
      tax_rate: product.tax_rate ? Number(product.tax_rate) : 0,
      sales_account_id: product.sales_account_id,
      purchase_account_id: product.purchase_account_id,
      inventory_account_id: product.inventory_account_id,
      cogs_account_id: product.cogs_account_id,
      manage_inventory: product.manage_inventory,
      current_stock: product.current_stock ? Number(product.current_stock) : 0,
      min_stock: product.min_stock ? Number(product.min_stock) : 0,
      max_stock: product.max_stock ? Number(product.max_stock) : 0,
      reorder_point: product.reorder_point ? Number(product.reorder_point) : 0,
      barcode: product.barcode || '',
      sku: product.sku || '',
      internal_reference: product.internal_reference || '',
      supplier_reference: product.supplier_reference || '',
      external_reference: product.external_reference || '',
      notes: product.notes || '',
      launch_date: product.launch_date || '',
      discontinuation_date: product.discontinuation_date || ''
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Spinner className="w-8 h-8" />
          <span className="ml-3">Cargando datos del producto...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button onClick={loadProductData} variant="outline">
              Reintentar
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (!productData?.product) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No se pudo cargar la información del producto</p>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Volver
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Editar Producto
          </h2>
          <p className="text-gray-600">
            {productData.product.code} - {productData.product.name}
          </p>
        </div>
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            Cancelar
          </Button>
        )}
      </div>

      <ProductForm
        initialData={getInitialFormData()}
        isEditMode={true}
        onSuccess={onSuccess}
        onCancel={onCancel}
        customSubmitHandler={handleUpdate}
      />
    </div>
  );
};
