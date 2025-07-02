import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductListView } from '../../../components/atomic/templatesViews/ProductListView';
import { ProductDetail, LowStockAlerts } from '../components';
import { ProductService } from '../services';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ExclamationCircleIcon } from '../../../shared/components/icons';
import type { Product } from '../types';

export function ProductsMainPageMigrated() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showLowStockAlerts, setShowLowStockAlerts] = useState(false);

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

  // Si estamos mostrando el detalle, renderizar el componente de detalle
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Low Stock Alerts */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge color="yellow" variant="subtle">
              <ExclamationCircleIcon className="h-3 w-3 mr-1" />
              Alertas de Stock Bajo
            </Badge>
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
      
      {/* Nueva implementación con ListView */}
      <ProductListView
        onProductSelect={handleProductSelect}
        onCreateProduct={handleCreateProduct}
        showActions={true}
      />
    </div>
  );
}
