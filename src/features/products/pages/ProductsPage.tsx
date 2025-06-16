import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ProductSelector } from '../components';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../shared/utils';
import { 
  ProductTypeLabels, 
  ProductStatusLabels,
  ProductType,
  ProductStatus,
  type Product,
  type ProductFilters
} from '../types';

export function ProductsPage() {
  const navigate = useNavigate();
  const [filters] = useState<ProductFilters>({
    limit: 50,
    sort_by: 'name',
    sort_order: 'asc'
  });

  const { 
    products, 
    loading, 
    error, 
    pagination,
    updateFilters,
    refreshProducts 
  } = useProducts(filters);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    updateFilters(newFilters);
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {ProductStatusLabels[status as keyof typeof ProductStatusLabels] || status}
      </span>
    );
  };

  const getStockBadge = (product: Product) => {
    if (!product.current_stock) return null;
    
    const stock = parseFloat(product.current_stock);
    let colorClass = 'bg-green-100 text-green-800';
    let text = 'Normal';
    
    if (stock <= 0) {
      colorClass = 'bg-red-100 text-red-800';
      text = 'Sin Stock';
    } else if (product.min_stock && stock <= parseFloat(product.min_stock)) {
      colorClass = 'bg-yellow-100 text-yellow-800';
      text = 'Stock Bajo';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {text}
      </span>
    );
  };

  if (loading && products.length === 0) {
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
          <p className="text-gray-600">Gestiona el catálogo de productos y servicios</p>
        </div>        <Button
          onClick={() => navigate('/products/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>            <ProductSelector
              onSelect={() => {}} // Placeholder para búsqueda visual
              placeholder="Buscar por código o nombre..."
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filters.product_type || ''}
              onChange={(e) => handleFilterChange({ product_type: (e.target.value as ProductType) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="product">Producto</option>
              <option value="service">Servicio</option>
              <option value="both">Producto/Servicio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: (e.target.value as ProductStatus) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="discontinued">Descontinuado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <select
              value={filters.low_stock ? 'low' : ''}
              onChange={(e) => handleFilterChange({ low_stock: e.target.value === 'low' || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="low">Stock Bajo</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📦</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Productos</p>
              <p className="text-lg font-semibold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Activos</p>
              <p className="text-lg font-semibold text-gray-900">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">⚠️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
              <p className="text-lg font-semibold text-gray-900">
                {products.filter(p => p.stock_status === 'low').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">🚫</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sin Stock</p>
              <p className="text-lg font-semibold text-gray-900">
                {products.filter(p => p.stock_status === 'out_of_stock').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de productos */}
      <Card>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Productos
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                onClick={refreshProducts}
                variant="secondary"
                size="sm"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : '🔄'} Actualizar
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.code}
                          </div>
                        </div>
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                      <Button
                        onClick={() => alert('Ver detalle de producto estará disponible próximamente')}
                        variant="secondary"
                        size="sm"
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-4 0h-6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primer producto.
                </p>
                <div className="mt-6">                  <Button
                    onClick={() => alert('Crear producto estará disponible próximamente')}
                  >
                    + Crear Producto
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  onClick={() => handleFilterChange({ skip: Math.max(0, (pagination.page - 2) * pagination.per_page) })}
                  disabled={pagination.page <= 1}
                  variant="secondary"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => handleFilterChange({ skip: pagination.page * pagination.per_page })}
                  disabled={pagination.page >= pagination.pages}
                  variant="secondary"
                >
                  Siguiente
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">{(pagination.page - 1) * pagination.per_page + 1}</span>{' '}
                    a{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.per_page, pagination.total)}</span>{' '}
                    de{' '}
                    <span className="font-medium">{pagination.total}</span>{' '}
                    resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button
                      onClick={() => handleFilterChange({ skip: Math.max(0, (pagination.page - 2) * pagination.per_page) })}
                      disabled={pagination.page <= 1}
                      variant="secondary"
                      className="rounded-l-md"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={() => handleFilterChange({ skip: pagination.page * pagination.per_page })}
                      disabled={pagination.page >= pagination.pages}
                      variant="secondary"
                      className="rounded-r-md"
                    >
                      Siguiente
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
