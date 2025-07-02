import React from 'react';
import { ProductListView } from '../templatesViews/ProductListView';
import type { Product } from '../../../features/products/types';

export const ProductsPageExample: React.FC = () => {
  const handleProductSelect = (product: Product) => {
    // Navegar al detalle del producto
    window.location.href = `/products/${product.id}`;
  };

  const handleCreateProduct = () => {
    // Navegar al formulario de creación
    window.location.href = '/products/new';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ProductListView
          onProductSelect={handleProductSelect}
          onCreateProduct={handleCreateProduct}
          showActions={true}
          initialFilters={{
            // Filtros iniciales opcionales
            status: 'active',
          }}
        />
      </div>
    </div>
  );
};
