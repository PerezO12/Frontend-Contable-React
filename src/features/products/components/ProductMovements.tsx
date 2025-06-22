import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useProductMovements } from '../hooks';

interface ProductMovementsProps {
  productId: string;
  productName: string;
}

export const ProductMovements: React.FC<ProductMovementsProps> = ({
  productId,
  productName
}) => {
  const [filters, setFilters] = useState({
    limit: 50,
    start_date: '',
    end_date: '',
    movement_type: ''
  });
  
  const { movements, total, currentStock, loading, error, fetchMovements } = useProductMovements(productId);

  useEffect(() => {
    fetchMovements(filters);
  }, [fetchMovements, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'sale': 'Venta',
      'purchase': 'Compra',
      'adjustment': 'Ajuste',
      'transfer': 'Transferencia'
    };
    return labels[type] || type;
  };

  const getMovementTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'sale': 'text-red-600 bg-red-50',
      'purchase': 'text-green-600 bg-green-50',
      'adjustment': 'text-blue-600 bg-blue-50',
      'transfer': 'text-purple-600 bg-purple-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Historial de Movimientos
        </h3>
        <p className="text-sm text-gray-500">
          <strong>{productName}</strong> - Stock actual: <span className="font-medium">{currentStock}</span>
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <Input
            type="date"
            id="start_date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <Input
            type="date"
            id="end_date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="movement_type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="movement_type"
            value={filters.movement_type}
            onChange={(e) => handleFilterChange('movement_type', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            <option value="sale">Ventas</option>
            <option value="purchase">Compras</option>
            <option value="adjustment">Ajustes</option>
            <option value="transfer">Transferencias</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Límite
          </label>
          <select
            id="limit"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" />
          <span className="ml-2 text-sm text-gray-600">Cargando movimientos...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && movements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No se encontraron movimientos</p>
        </div>
      )}

      {!loading && !error && movements.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Mostrando {movements.length} de {total} movimientos
          </div>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(movement.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.movement_type)}`}>
                        {getMovementTypeLabel(movement.movement_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-gray-500">{movement.previous_stock}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium">{movement.new_stock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.unit_price ? `$${movement.unit_price}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.total_amount ? `$${movement.total_amount}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
};
