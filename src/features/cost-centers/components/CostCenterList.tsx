import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenters } from '../hooks';
import type { CostCenter, CostCenterFilters } from '../types';

interface CostCenterListProps {
  onCostCenterSelect?: (costCenter: CostCenter) => void;
  onCreateCostCenter?: () => void;
  onEditCostCenter?: (costCenter: CostCenter) => void;
  initialFilters?: CostCenterFilters;
  showActions?: boolean;
}

export const CostCenterList: React.FC<CostCenterListProps> = ({
  onCostCenterSelect,
  onCreateCostCenter,
  onEditCostCenter,
  initialFilters,
  showActions = true
}) => {
  const [filters, setFilters] = useState<CostCenterFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCostCenters, setSelectedCostCenters] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const { costCenters = [], total = 0, loading, error, refetch, refetchWithFilters, deleteCostCenter } = useCostCenters(filters);
  // Filter cost centers based on search term
  const filteredCostCenters = useMemo(() => {
    if (!costCenters) return [];
    if (!searchTerm) return costCenters;
    
    const term = searchTerm.toLowerCase();
    return costCenters.filter(costCenter =>
      costCenter.code.toLowerCase().includes(term) ||
      costCenter.name.toLowerCase().includes(term) ||
      costCenter.description?.toLowerCase().includes(term)
    );
  }, [costCenters, searchTerm]);

  const handleFilterChange = (key: keyof CostCenterFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  // Manejar selección individual de centros de costo
  const handleCostCenterSelect = (costCenterId: string, checked: boolean) => {
    const newSelected = new Set(selectedCostCenters);
    if (checked) {
      newSelected.add(costCenterId);
    } else {
      newSelected.delete(costCenterId);
    }
    setSelectedCostCenters(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredCostCenters.length && filteredCostCenters.length > 0);
  };

  // Manejar selección de todos los centros de costo
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredCostCenters.map(costCenter => costCenter.id));
      setSelectedCostCenters(allIds);
    } else {
      setSelectedCostCenters(new Set());
    }
    setSelectAll(checked);
  };

  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedCostCenters(new Set());
    setSelectAll(false);
  };

  const handleDeleteCostCenter = async (costCenter: CostCenter) => {
    const confirmMessage = `⚠️ CONFIRMACIÓN DE ELIMINACIÓN

¿Estás seguro de que deseas eliminar permanentemente el centro de costo?

Código: ${costCenter.code}
Nombre: ${costCenter.name}
Nivel: ${costCenter.level}

⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE
• Se eliminará toda la información del centro de costo
• No se podrán recuperar los datos
• Si el centro de costo tiene movimientos asociados, la eliminación podría fallar

¿Continuar con la eliminación?`;

    if (window.confirm(confirmMessage)) {
      const success = await deleteCostCenter(costCenter.id);
      if (success) {
        refetch();
      }
    }
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',   // Nivel 0
      'bg-green-100 text-green-800', // Nivel 1
      'bg-yellow-100 text-yellow-800', // Nivel 2
      'bg-purple-100 text-purple-800', // Nivel 3
      'bg-pink-100 text-pink-800',   // Nivel 4
      'bg-gray-100 text-gray-800'    // Nivel 5+
    ];
    return colors[level] || colors[colors.length - 1];
  };

  if (error) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los centros de costo: {error}</p>
          <Button onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones principales */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Centros de Costo</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredCostCenters.length} centro{filteredCostCenters.length !== 1 ? 's' : ''} de costo encontrado{filteredCostCenters.length !== 1 ? 's' : ''}
                {total > 0 && ` de ${total} total`}
              </p>
            </div>
            
            {showActions && onCreateCostCenter && (
              <Button 
                onClick={onCreateCostCenter}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Nuevo Centro de Costo
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros optimizados */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Código, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por nivel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel
              </label>
              <select
                value={filters.level?.toString() || ''}
                onChange={(e) => handleFilterChange('level', e.target.value ? parseInt(e.target.value) : undefined)}
                className="form-select"
              >
                <option value="">Todos los niveles</option>
                <option value="0">Nivel 0 (Raíz)</option>
                <option value="1">Nivel 1</option>
                <option value="2">Nivel 2</option>
                <option value="3">Nivel 3</option>
                <option value="4">Nivel 4</option>
                <option value="5">Nivel 5+</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.is_active?.toString() || ''}
                onChange={(e) => handleFilterChange('is_active', e.target.value ? e.target.value === 'true' : undefined)}
                className="form-select"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {/* Filtro por estructura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estructura
              </label>
              <select
                value={filters.has_children?.toString() || ''}
                onChange={(e) => handleFilterChange('has_children', e.target.value ? e.target.value === 'true' : undefined)}
                className="form-select"
              >
                <option value="">Todos</option>
                <option value="true">Con hijos</option>
                <option value="false">Sin hijos (Hoja)</option>
              </select>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Centros</p>
              <p className="text-lg font-semibold text-gray-900">{total}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-lg font-semibold text-green-700">
                {costCenters.filter(cc => cc.is_active).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Con Movimientos</p>
              <p className="text-lg font-semibold text-blue-700">
                {costCenters.filter(cc => cc.movements_count > 0).length}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Niveles Únicos</p>
              <p className="text-lg font-semibold text-purple-700">
                {new Set(costCenters.map(cc => cc.level)).size}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de centros de costo */}
      <Card>
        <div className="card-body">
          {/* Barra de herramientas de selección */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectAll && filteredCostCenters.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Seleccionar todos ({filteredCostCenters.length})
                </span>
              </label>
              {selectedCostCenters.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedCostCenters.size} centro{selectedCostCenters.size === 1 ? '' : 's'} seleccionado{selectedCostCenters.size === 1 ? '' : 's'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-xs"
                  >
                    Limpiar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-2">Cargando centros de costo...</p>
            </div>
          ) : filteredCostCenters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron centros de costo</p>
              {searchTerm && (
                <Button
                  variant="secondary"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-4 font-medium text-gray-900 w-12">
                      <input
                        type="checkbox"
                        checked={selectAll && filteredCostCenters.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Código Completo</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Nivel</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Movimientos</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Hijos</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    {showActions && <th className="text-center py-3 px-4 font-medium text-gray-900">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCostCenters.map((costCenter) => (
                    <tr
                      key={costCenter.id}
                      className={`hover:bg-gray-50 ${selectedCostCenters.has(costCenter.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedCostCenters.has(costCenter.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleCostCenterSelect(costCenter.id, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {costCenter.code}
                        </code>
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{costCenter.name}</p>
                          {costCenter.description && (
                            <p className="text-sm text-gray-500">{costCenter.description}</p>
                          )}
                        </div>
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <code className="text-xs font-mono text-gray-600">
                          {costCenter.full_code}
                        </code>
                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(costCenter.level)}`}>
                          Nivel {costCenter.level}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <span className="text-sm text-gray-600">
                          {costCenter.movements_count}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          costCenter.children_count > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {costCenter.children_count}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onCostCenterSelect?.(costCenter)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          costCenter.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {costCenter.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {showActions && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {onEditCostCenter && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCostCenter(costCenter);
                                }}
                                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                              >
                                Editar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCostCenter(costCenter);
                              }}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
