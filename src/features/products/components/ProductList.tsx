import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useProducts } from '../hooks';
import { SimpleExportControls } from '../components/SimpleExportControls';
import { BulkDeleteModal } from '../components/BulkDeleteModal';
import { formatCurrency } from '../../../shared/utils';
import { 
  PlusIcon, 
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '../../../shared/components/icons';
import { 
  ProductTypeLabels, 
  ProductStatusLabels,
  ProductType,
  ProductStatus,
  type Product,
  type ProductFilters
} from '../types';

interface ProductListProps {
  onProductSelect?: (product: Product) => void;
  onCreateProduct?: () => void;
  initialFilters?: ProductFilters;
  showActions?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  onProductSelect,
  onCreateProduct,
  initialFilters,
  showActions = true
}) => {const [filters, setFilters] = useState<ProductFilters>(initialFilters || { page: 1, size: 50 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { 
    products, 
    pagination, 
    loading, 
    error,    
    refetchWithFilters,
    refreshProducts
  } = useProducts(initialFilters);
  // Función para manejar cambios de filtros (igual que journal entries)
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  // Función para manejar búsqueda
  const handleSearch = () => {
    if (searchTerm.trim()) {
      handleFilterChange('search', searchTerm.trim());
    } else {
      const newFilters = { ...filters };
      delete newFilters.search;
      setFilters(newFilters);
      refetchWithFilters(newFilters);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
    setSelectAll(!selectAll);
  };  const handleBulkDelete = async () => {
    // Esta función se ejecuta después de que el modal BulkDeleteModal 
    // realiza la eliminación exitosamente
    setSelectedProducts(new Set());
    setSelectAll(false);
    
    // Refrescar la lista
    refreshProducts();
  };

  const formatPrice = (price?: string) => {
    if (!price) return '-';
    return formatCurrency(parseFloat(price));
  };

  const getStatusBadge = (status: ProductStatus) => {
    const statusConfig = {
      [ProductStatus.ACTIVE]: {
        label: ProductStatusLabels[status],
        color: 'green' as const,
        icon: CheckCircleIcon
      },
      [ProductStatus.INACTIVE]: {
        label: ProductStatusLabels[status], 
        color: 'gray' as const,
        icon: XCircleIcon
      },
      [ProductStatus.DISCONTINUED]: {
        label: ProductStatusLabels[status],
        color: 'red' as const,
        icon: XCircleIcon
      }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge color={config.color} variant="subtle">
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: ProductType) => {
    const typeConfig = {
      [ProductType.PRODUCT]: {
        label: ProductTypeLabels[type],
        color: 'blue' as const
      },
      [ProductType.SERVICE]: {
        label: ProductTypeLabels[type],
        color: 'purple' as const
      },
      [ProductType.BOTH]: {
        label: ProductTypeLabels[type],
        color: 'green' as const
      }
    };
    
    const config = typeConfig[type];
    
    return (
      <Badge color={config.color} variant="subtle">
        {config.label}
      </Badge>
    );
  };

  const getStockBadge = (product: Product) => {
    if (!product.current_stock) return null;
    
    const stock = parseFloat(product.current_stock);
    const minStock = parseFloat(product.min_stock || '0');
    const maxStock = parseFloat(product.max_stock || '0');
    
    if (stock <= 0) {
      return (
        <Badge color="red" variant="subtle">
          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
          Sin stock
        </Badge>
      );
    }
    
    if (minStock > 0 && stock <= minStock) {
      return (
        <Badge color="yellow" variant="subtle">
          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
          Stock bajo
        </Badge>
      );
    }
    
    if (maxStock > 0 && stock >= maxStock) {
      return (
        <Badge color="blue" variant="subtle">
          Stock alto
        </Badge>
      );
    }
    
    return null;
  };  const clearFilters = () => {
    setSearchTerm('');
    const newFilters = {
      page: 1,
      size: 50
    };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de productos y servicios
            {pagination && pagination.total > 0 && (
              <span className="ml-2 text-sm font-medium">
                • {pagination.total} productos encontrados
                {pagination.pages > 1 && (
                  <span className="text-gray-500">
                    {' '}(página {pagination.page} de {pagination.pages})
                  </span>
                )}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Control de elementos por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mostrar:</span>
            <select
              value={filters.size || 50}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                const newFilters = { 
                  ...filters, 
                  size: newSize, 
                  page: 1 // Reset to first page
                };
                setFilters(newFilters);
                refetchWithFilters(newFilters);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span className="text-sm text-gray-700">por página</span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtros
          </Button>
          
          {showActions && onCreateProduct && (
            <Button onClick={onCreateProduct} variant="primary" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar productos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Filters and Search */}
      {showFilters && (
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Código, nombre, descripción..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    variant="secondary"
                    disabled={loading}
                  >
                    Buscar
                  </Button>
                </div>
              </div>

              {/* Product Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Producto
                </label>
                <select
                  value={filters.product_type || ''}
                  onChange={(e) => handleFilterChange('product_type', e.target.value || undefined)}
                  className="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Todos los tipos</option>
                  {Object.entries(ProductTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.product_status || ''}
                  onChange={(e) => handleFilterChange('product_status', e.target.value || undefined)}
                  className="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Todos los estados</option>
                  {Object.entries(ProductStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Low Stock Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.low_stock || false}
                    onChange={(e) => handleFilterChange('low_stock', e.target.checked || undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Solo productos con stock bajo</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  disabled={!searchTerm && !filters.product_type && !filters.product_status && !filters.low_stock}
                >
                  Limpiar filtros
                </Button>
              </div>

              {/* Export Controls */}
              <div>
                <SimpleExportControls 
                  selectedProductIds={Array.from(selectedProducts)}
                  productCount={selectedProducts.size}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && showActions && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedProducts.size} producto(s) seleccionado(s)
            </span>            
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowBulkDeleteModal(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                🗑️ Eliminar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">            <thead className="bg-gray-50">
              <tr>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  onClick={() => onProductSelect?.(product)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {showActions && (
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()} // Evitar que el clic en checkbox active la fila
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(product.product_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.sale_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {product.current_stock ? (
                        <>
                          <span className="text-sm text-gray-900">
                            {parseFloat(product.current_stock).toLocaleString('es-ES')}
                          </span>
                          {getStockBadge(product)}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="py-12">
            <EmptyState
              title="No hay productos"
              description={
                searchTerm || filters.product_type || filters.product_status || filters.low_stock
                  ? 'No se encontraron productos que coincidan con los filtros aplicados.'
                  : 'Comienza creando tu primer producto.'
              }
              action={showActions && onCreateProduct ? (
                <Button onClick={onCreateProduct} variant="primary">
                  Crear Producto
                </Button>
              ) : undefined}
            />
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">            <div className="flex-1 flex justify-between sm:hidden">                <Button
                  onClick={() => handleFilterChange('page', Math.max(1, (pagination.page || 1) - 1))}
                  disabled={!pagination.page || pagination.page <= 1}
                  variant="outline"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => handleFilterChange('page', (pagination.page || 1) + 1)}
                  disabled={pagination.page >= pagination.pages}
                  variant="outline"
                >
                  Siguiente
                </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">
                    {((pagination.page || 1) - 1) * (pagination.per_page || 50) + 1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium">
                    {Math.min((pagination.page || 1) * (pagination.per_page || 50), pagination.total || 0)}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium">{pagination.total || 0}</span> resultados
                </p>
              </div>
              <div>                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">                  <Button
                    onClick={() => handleFilterChange('page', Math.max(1, (pagination.page || 1) - 1))}
                    disabled={!pagination.page || pagination.page <= 1}
                    variant="outline"
                    className="rounded-l-md"
                  >
                    Anterior
                  </Button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Página {pagination.page || 1} de {pagination.pages}
                  </span>
                  <Button
                    onClick={() => handleFilterChange('page', (pagination.page || 1) + 1)}
                    disabled={pagination.page >= pagination.pages}
                    variant="outline"
                    className="rounded-r-md"
                  >
                    Siguiente
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          isOpen={showBulkDeleteModal}
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={handleBulkDelete}
          productIds={Array.from(selectedProducts)}
        />
      )}
    </div>
  );
};
