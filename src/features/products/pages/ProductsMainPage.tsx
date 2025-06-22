import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList, ProductDetail, LowStockAlerts } from '../components';
import { ProductService } from '../services';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type { Product } from '../types';

export function ProductsMainPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showLowStockAlerts, setShowLowStockAlerts] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCreateProduct = () => {
    navigate('/products/create');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`)) {
      try {
        await ProductService.deleteProduct(product.id);
        setShowDetail(false);
        setSelectedProduct(null);
        // La lista se actualizará automáticamente
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };
  if (showDetail && selectedProduct) {
    return (
      <ProductDetail
        productId={selectedProduct.id}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onClose={handleCloseDetail}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-amber-800">
              Alertas de Stock Bajo
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLowStockAlerts(!showLowStockAlerts)}
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            {showLowStockAlerts ? 'Ocultar' : 'Ver Alertas'}
          </Button>
        </div>
        
        {showLowStockAlerts && (
          <div className="mt-4">
            <LowStockAlerts
              onProductClick={(productId) => {
                const product = { id: productId } as Product; // Simplified for navigation
                setSelectedProduct(product);
                setShowDetail(true);
              }}
              onRefresh={() => {
                // Refresh will be handled by the component itself
              }}
            />
          </div>
        )}
      </Card>      
      <ProductList
        onProductSelect={handleProductSelect}
        onCreateProduct={handleCreateProduct}
        showActions={true}
      />
    </div>
  );
}
