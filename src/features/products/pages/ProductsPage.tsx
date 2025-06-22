import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList, ProductDetail } from '../components';
import type { Product } from '../types';

export function ProductsPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  if (showDetail && selectedProduct) {
    return (
      <ProductDetail
        productId={selectedProduct.id}
        onEdit={handleEditProduct}
        onClose={handleBackToList}
      />
    );
  }
  return (
    <ProductList
      onProductSelect={handleProductSelect}
      onCreateProduct={handleCreateProduct}
      showActions={true}
    />
  );
}
