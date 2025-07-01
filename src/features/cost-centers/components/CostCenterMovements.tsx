import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterMovements } from '../hooks';
import { formatCurrency } from '../../../shared/utils';
import type { CostCenter } from '../types';

interface CostCenterMovementsProps {
  costCenter: CostCenter;
  onClose?: () => void;
}

export const CostCenterMovements: React.FC<CostCenterMovementsProps> = ({
  costCenter,
  onClose
}) => {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const { movements, totalCount, loading, error, refetch } = useCostCenterMovements(costCenter.id);

  const handleDateRangeChange = (field: 'start_date' | 'end_date') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDateRange = { ...dateRange, [field]: e.target.value };
    setDateRange(newDateRange);
  };

  const handleApplyFilters = () => {
    const filters = {
      ...dateRange,
      skip: 0,
      limit: pageSize
    };
    refetch(filters);
    setCurrentPage(0);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    const filters = {
      ...dateRange,
      skip: newPage * pageSize,
      limit: pageSize
    };
    refetch(filters);
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Movimientos del Centro de Costo</h2>
              <p className="text-sm text-gray-600 mt-1">
                {costCenter.code} - {costCenter.name}
              </p>
            </div>
            {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <Input
                type="date"
                value={dateRange.start_date}
                onChange={handleDateRangeChange('start_date')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <Input
                type="date"
                value={dateRange.end_date}
                onChange={handleDateRangeChange('end_date')}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="w-full"
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Movimientos</p>
              <p className="text-lg font-semibold text-blue-900">{totalCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Débitos</p>
              <p className="text-lg font-semibold text-green-900">
                {formatCurrency(
                  movements.reduce((sum, mov) => sum + parseFloat(mov.debit_amount || '0'), 0)
                )}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Créditos</p>
              <p className="text-lg font-semibold text-red-900">
                {formatCurrency(
                  movements.reduce((sum, mov) => sum + parseFloat(mov.credit_amount || '0'), 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de movimientos */}
      <Card>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-2">Cargando movimientos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error al cargar movimientos: {error}</p>
              <Button onClick={() => refetch(costCenter.id)}>
                Reintentar
              </Button>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron movimientos para este centro de costo</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Asiento</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Cuenta</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Débito</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Crédito</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Referencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {movements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(movement.date).toLocaleDateString('es-CO')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {movement.journal_entry_number}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <code className="text-xs font-mono text-gray-600">
                              {movement.account_code}
                            </code>
                            <p className="text-sm text-gray-900">{movement.account_name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {movement.description}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-mono">
                          {movement.debit_amount && parseFloat(movement.debit_amount) > 0 ? (
                            <span className="text-green-600">
                              {formatCurrency(parseFloat(movement.debit_amount))}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-mono">
                          {movement.credit_amount && parseFloat(movement.credit_amount) > 0 ? (
                            <span className="text-red-600">
                              {formatCurrency(parseFloat(movement.credit_amount))}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {movement.reference || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Mostrando {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalCount)} de {totalCount} movimientos
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePageChange('prev')}
                      disabled={currentPage === 0 || loading}
                    >
                      Anterior
                    </Button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                      Página {currentPage + 1} de {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePageChange('next')}
                      disabled={currentPage >= totalPages - 1 || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
