import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ProductService } from '../services';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { ProductMovements } from './ProductMovements';
import { useProductStatusOperations, useProductDetailedStats } from '../hooks';
import { 
  ProductTypeLabels, 
  ProductStatusLabels,
  MeasurementUnitLabels,
  TaxCategoryLabels,
  type Product
} from '../types';

interface ProductDetailProps {
  productId: string;
  onEdit?: (product: Product) => void;
  onClose?: () => void;
  onDelete?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onEdit,
  onClose,
  onDelete
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'movements' | 'stats'>('details');

  const { activateProduct, deactivateProduct } = useProductStatusOperations();
  const { stats, loading: statsLoading } = useProductDetailedStats(productId);

  useEffect(() => {
    loadProduct();
  }, [productId]);  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const productDetail = await ProductService.getProductDetailById(productId);
      setProduct(productDetail.product);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar producto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!product) return;
    
    try {
      if (product.status === 'active') {
        await deactivateProduct(product.id);
      } else {
        await activateProduct(product.id);
      }
      await loadProduct(); // Refresh product data
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
    }
  };

  const handleStockAdjustmentSuccess = () => {
    loadProduct(); // Refresh product data
    setShowStockAdjustment(false);
  };

  const formatPrice = (price?: string) => {
    if (!price) return '-';
    return formatCurrency(parseFloat(price));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {ProductStatusLabels[status as keyof typeof ProductStatusLabels]}
      </span>
    );
  };

  const getStockStatus = () => {
    if (!product?.current_stock) return { text: '-', color: 'text-gray-500' };
    
    const stock = parseFloat(product.current_stock);
    const minStock = parseFloat(product.min_stock || '0');
    const maxStock = parseFloat(product.max_stock || '0');
    
    if (stock <= 0) {
      return { text: 'Sin stock', color: 'text-red-600' };
    }
    
    if (minStock > 0 && stock <= minStock) {
      return { text: 'Stock bajo', color: 'text-yellow-600' };
    }
    
    if (maxStock > 0 && stock >= maxStock) {
      return { text: 'Stock alto', color: 'text-blue-600' };
    }
    
    return { text: 'Normal', color: 'text-green-600' };
  };

  const calculateProfitMargin = () => {
    if (!product?.sale_price || !product?.cost_price) return null;
    
    const salePrice = parseFloat(product.sale_price);
    const costPrice = parseFloat(product.cost_price || '0');
    
    if (salePrice <= 0 || costPrice <= 0) return null;
    
    const margin = ((salePrice - costPrice) / salePrice) * 100;
    return margin.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Producto no encontrado</h3>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const profitMargin = calculateProfitMargin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{product.code}</h1>
            {getStatusBadge(product.status)}
          </div>
          <h2 className="text-xl text-gray-700">{product.name}</h2>
          {product.description && (
            <p className="text-gray-600 mt-2">{product.description}</p>
          )}
        </div>
          <div className="flex space-x-3">
          {product?.status === 'active' && (
            <Button 
              onClick={() => setShowStockAdjustment(true)} 
              variant="outline"
              size="sm"
            >
              Ajustar Stock
            </Button>
          )}
          <Button
            onClick={handleStatusToggle}
            variant="outline"
            size="sm"
            className={product?.status === 'active' ? 'text-orange-600 border-orange-300' : 'text-green-600 border-green-300'}
          >
            {product?.status === 'active' ? 'Desactivar' : 'Activar'}
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(product)} variant="outline">
              Editar
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(product)} 
              variant="outline"
              className="text-red-600 hover:text-red-700 border-red-300"
            >
              Eliminar
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          )}        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Detalles del Producto
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'movements'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Movimientos de Stock
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Código:</span>
              <span className="text-sm text-gray-900">{product.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Nombre:</span>
              <span className="text-sm text-gray-900">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Tipo:</span>
              <span className="text-sm text-gray-900">
                {ProductTypeLabels[product.product_type]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Estado:</span>
              {getStatusBadge(product.status)}
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Unidad de Medida:</span>
              <span className="text-sm text-gray-900">
                {MeasurementUnitLabels[product.measurement_unit]}
              </span>
            </div>
            {product.category && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Categoría:</span>
                <span className="text-sm text-gray-900">{product.category}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Marca:</span>
                <span className="text-sm text-gray-900">{product.brand}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Precios y Costos */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Precios y Costos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Precio de Compra:</span>
              <span className="text-sm text-gray-900">{formatPrice(product.purchase_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Precio de Venta:</span>
              <span className="text-sm text-gray-900 font-medium">{formatPrice(product.sale_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Precio Mínimo:</span>
              <span className="text-sm text-gray-900">{formatPrice(product.min_sale_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Precio Sugerido:</span>
              <span className="text-sm text-gray-900">{formatPrice(product.suggested_price)}</span>
            </div>
            {profitMargin && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Margen de Ganancia:</span>
                <span className="text-sm text-green-600 font-medium">{profitMargin}%</span>
              </div>
            )}
          </div>
        </Card>

        {/* Inventario */}
        {product.manage_inventory && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inventario</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Stock Actual:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900 font-medium">
                    {product.current_stock ? parseFloat(product.current_stock).toLocaleString('es-ES') : '0'}
                  </span>
                  <span className={`text-xs ${stockStatus.color}`}>
                    ({stockStatus.text})
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Stock Mínimo:</span>
                <span className="text-sm text-gray-900">
                  {product.min_stock ? parseFloat(product.min_stock).toLocaleString('es-ES') : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Stock Máximo:</span>
                <span className="text-sm text-gray-900">
                  {product.max_stock ? parseFloat(product.max_stock).toLocaleString('es-ES') : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Punto de Reorden:</span>
                <span className="text-sm text-gray-900">
                  {product.reorder_point ? parseFloat(product.reorder_point).toLocaleString('es-ES') : '0'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Información Fiscal */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Fiscal</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Categoría Fiscal:</span>
              <span className="text-sm text-gray-900">
                {product.tax_category ? TaxCategoryLabels[product.tax_category] : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Tasa de Impuesto:</span>
              <span className="text-sm text-gray-900">
                {product.tax_rate ? `${product.tax_rate}%` : '-'}
              </span>
            </div>
          </div>
        </Card>

        {/* Códigos y Referencias */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Códigos y Referencias</h3>
          <div className="space-y-3">
            {product.barcode && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Código de Barras:</span>
                <span className="text-sm text-gray-900 font-mono">{product.barcode}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">SKU:</span>
                <span className="text-sm text-gray-900 font-mono">{product.sku}</span>
              </div>
            )}
            {product.internal_reference && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Referencia Interna:</span>
                <span className="text-sm text-gray-900">{product.internal_reference}</span>
              </div>
            )}
            {product.supplier_reference && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Referencia Proveedor:</span>
                <span className="text-sm text-gray-900">{product.supplier_reference}</span>
              </div>
            )}
            {product.external_reference && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Referencia Externa:</span>
                <span className="text-sm text-gray-900">{product.external_reference}</span>
              </div>
            )}
          </div>
        </Card>        {/* Cuentas Contables */}
        {(product.sales_account_id || product.purchase_account_id || product.inventory_account_id) && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cuentas Contables</h3>
            <div className="space-y-3">
              {product.revenue_account && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Cuenta de Ingresos:</span>
                  <span className="text-sm text-gray-900">
                    {product.revenue_account.code} - {product.revenue_account.name}
                  </span>
                </div>
              )}
              {product.expense_account && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Cuenta de Gastos:</span>
                  <span className="text-sm text-gray-900">
                    {product.expense_account.code} - {product.expense_account.name}
                  </span>
                </div>
              )}
              {product.inventory_account && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Cuenta de Inventario:</span>                  <span className="text-sm text-gray-900">
                    {product.inventory_account.code} - {product.inventory_account.name}
                  </span>
                </div>
              )}
            </div>
          </Card>        
        )}
      </div>
      )}

      {/* Información de Auditoría */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Auditoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Creado:</span>
              <span className="text-sm text-gray-900">{formatDate(product.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Actualizado:</span>
              <span className="text-sm text-gray-900">{formatDate(product.updated_at)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Estado:</span>
              <span className="text-sm text-gray-900">
                {product.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>          </div>
        </div>
      </Card>      {/* Notas */}
      {product.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notas</h3>          <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.notes}</p>
        </Card>
      )}
      )

      {/* Movements Tab */}
      {activeTab === 'movements' && (
        <ProductMovements
          productId={product.id}
          productName={product.name}
        />
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Ventas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Cantidad vendida:</span>
                    <span className="text-sm text-gray-900">{stats.sales.total_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Total de ventas:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(parseFloat(stats.sales.total_amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Precio promedio:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(parseFloat(stats.sales.average_price))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Transacciones:</span>
                    <span className="text-sm text-gray-900">{stats.sales.transactions_count}</span>
                  </div>
                </div>
              </Card>
                <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Inventario</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Stock actual:</span>
                    <span className="text-sm text-gray-900">{stats.inventory.current_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Valor del stock:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(parseFloat(stats.inventory.stock_value))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Rotación:</span>
                    <span className="text-sm text-gray-900">{parseFloat(stats.inventory.turnover_ratio).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Días de inventario:</span>
                    <span className="text-sm text-gray-900">{stats.inventory.days_of_inventory}</span>
                  </div>
                </div>
              </Card>
                <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rentabilidad</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Ganancia bruta:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(parseFloat(stats.profitability.gross_profit))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Margen de ganancia:</span>
                    <span className="text-sm text-gray-900">{parseFloat(stats.profitability.profit_margin).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">ROI:</span>
                    <span className="text-sm text-gray-900">{parseFloat(stats.profitability.roi).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Período:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(stats.period.start_date)} - {formatDate(stats.period.end_date)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No hay estadísticas disponibles
            </div>
          )}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockAdjustment && product && (
        <StockAdjustmentModal
          isOpen={showStockAdjustment}
          onClose={() => setShowStockAdjustment(false)}
          product={product}
          onSuccess={handleStockAdjustmentSuccess}
        />
      )}
    </div>
  );
};
