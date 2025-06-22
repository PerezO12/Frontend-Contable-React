import React, { useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { ProductService } from '../services';
import type { LowStockProduct } from '../types';

interface LowStockAlertsProps {
  onProductClick?: (productId: string) => void;
  onRefresh?: () => void;
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  onProductClick,
  onRefresh
}) => {
  const [products, setProducts] = React.useState<LowStockProduct[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLowStockProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductService.getLowStockProducts();
      setProducts(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos con stock bajo';
      setError(errorMessage);
      console.error('Error al cargar productos con stock bajo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  const handleRefresh = () => {
    fetchLowStockProducts();
    onRefresh?.();
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🔵';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Spinner size="sm" />
          <span className="ml-2 text-sm text-gray-600">Cargando productos con stock bajo...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={handleRefresh}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-green-500 text-2xl mb-2">✅</div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Todo en orden</h3>
          <p className="text-sm text-gray-500 mb-4">No hay productos con stock bajo</p>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Actualizar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Productos con Stock Bajo
        </h3>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Actualizar
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getUrgencyColor(product.urgency_level)}`}
            onClick={() => onProductClick?.(product.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs">{getUrgencyIcon(product.urgency_level)}</span>
                  <span className="font-medium text-sm">{product.code}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {product.urgency_level.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">{product.name}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span>
                    Stock actual: <span className="font-medium">{product.current_stock}</span>
                  </span>
                  <span>
                    Stock mínimo: <span className="font-medium">{product.min_stock}</span>
                  </span>
                  <span>
                    Diferencia: <span className="font-medium">{product.stock_difference}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Acción requerida
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Mostrando {Math.min(5, products.length)} de {products.length} productos
          </p>
        </div>
      )}
    </Card>
  );
};
