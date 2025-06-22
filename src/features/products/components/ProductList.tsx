import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useProducts } from '../hooks';
import { SimpleExportControls } from '../components/SimpleExportControls';
import { BulkDeleteModal } from '../components/BulkDeleteModal';
import { formatCurrency } from '../../../shared/utils';
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
}) => {const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
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
      handleFilterChange('q', searchTerm.trim());
    } else {
      const newFilters = { ...filters };
      delete newFilters.q;
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
    const colors = {
      [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [ProductStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [ProductStatus.DISCONTINUED]: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {ProductStatusLabels[status]}
      </span>
    );
  };

  const getStockBadge = (product: Product) => {
    if (!product.current_stock) return null;
    
    const stock = parseFloat(product.current_stock);
    const minStock = parseFloat(product.min_stock || '0');
    const maxStock = parseFloat(product.max_stock || '0');
    
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Sin stock
        </span>
      );
    }
    
    if (minStock > 0 && stock <= minStock) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Stock bajo
        </span>
      );
    }
    
    if (maxStock > 0 && stock >= maxStock) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Stock alto
        </span>
      );
    }
    
    return null;
  };  const clearFilters = () => {
    setSearchTerm('');
    const newFilters = {};
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">
            Gestión de productos y servicios
          </p>
        </div>
        {showActions && onCreateProduct && (
          <Button onClick={onCreateProduct} variant="primary">
            Nuevo Producto
          </Button>
        )}
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
                value={filters.product_type?.[0] || ''}
                onChange={(e) => handleFilterChange('product_type', e.target.value ? [e.target.value as ProductType] : undefined)}
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
                value={filters.status?.[0] || ''}
                onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value as ProductStatus] : undefined)}
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
                disabled={!searchTerm && !filters.product_type && !filters.status && !filters.low_stock}
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ProductTypeLabels[product.product_type]}
                    </span>
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
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.product_type || filters.status || filters.low_stock
                ? 'No se encontraron productos que coincidan con los filtros aplicados.'
                : 'Comienza creando tu primer producto.'
              }
            </p>
            {showActions && onCreateProduct && (
              <div className="mt-6">
                <Button onClick={onCreateProduct} variant="primary">
                  Crear Producto
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">            <div className="flex-1 flex justify-between sm:hidden">              <Button
                onClick={() => handleFilterChange('skip', Math.max(0, (filters.skip || 0) - (filters.limit || 50)))}
                disabled={!filters.skip || filters.skip <= 0}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => handleFilterChange('skip', (filters.skip || 0) + (filters.limit || 50))}
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
                    onClick={() => handleFilterChange('skip', Math.max(0, (filters.skip || 0) - (filters.limit || 50)))}
                    disabled={!filters.skip || filters.skip <= 0}
                    variant="outline"
                    className="rounded-l-md"
                  >
                    Anterior
                  </Button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Página {pagination.page || 1} de {pagination.pages}
                  </span>
                  <Button
                    onClick={() => handleFilterChange('skip', (filters.skip || 0) + (filters.limit || 50))}
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
