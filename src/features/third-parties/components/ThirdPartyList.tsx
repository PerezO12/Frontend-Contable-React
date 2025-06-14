import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useThirdParties } from '../hooks';
import { SimpleExportControls } from './SimpleExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { formatCurrency } from '../../../shared/utils';
import { 
  ThirdPartyType, 
  THIRD_PARTY_TYPE_LABELS, 
  DOCUMENT_TYPE_LABELS,
  type ThirdParty,
  type ThirdPartyFilters,
  type BulkDeleteResult
} from '../types';

interface ThirdPartyListProps {
  onThirdPartySelect?: (thirdParty: ThirdParty) => void;
  onCreateThirdParty?: () => void;
  initialFilters?: ThirdPartyFilters;
  showActions?: boolean;
}

export const ThirdPartyList: React.FC<ThirdPartyListProps> = ({
  onThirdPartySelect,
  onCreateThirdParty,
  initialFilters,
  showActions = true
}) => {
  const [filters, setFilters] = useState<ThirdPartyFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThirdParties, setSelectedThirdParties] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { thirdParties, loading, error, refetch, refetchWithFilters } = useThirdParties(filters);

  // Filter third parties based on search term
  const filteredThirdParties = useMemo(() => {
    if (!thirdParties || !Array.isArray(thirdParties)) return [];
    if (!searchTerm) return thirdParties;
    
    const term = searchTerm.toLowerCase();
    return thirdParties.filter(thirdParty =>
      thirdParty.document_number.toLowerCase().includes(term) ||
      thirdParty.name.toLowerCase().includes(term) ||
      thirdParty.commercial_name?.toLowerCase().includes(term) ||
      thirdParty.email?.toLowerCase().includes(term)
    );
  }, [thirdParties, searchTerm]);

  const handleFilterChange = (key: keyof ThirdPartyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  // Manejar selección individual de terceros
  const handleThirdPartySelect = (thirdPartyId: string, checked: boolean) => {
    const newSelected = new Set(selectedThirdParties);
    if (checked) {
      newSelected.add(thirdPartyId);
    } else {
      newSelected.delete(thirdPartyId);
    }
    setSelectedThirdParties(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredThirdParties.length && filteredThirdParties.length > 0);
  };

  // Manejar selección de todos los terceros
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredThirdParties.map(thirdParty => thirdParty.id));
      setSelectedThirdParties(allIds);
    } else {
      setSelectedThirdParties(new Set());
    }
    setSelectAll(checked);
  };

  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedThirdParties(new Set());
    setSelectAll(false);
  };

  // Manejar eliminación masiva
  const handleBulkDelete = () => {
    if (selectedThirdParties.size === 0) {
      return;
    }
    setShowBulkDeleteModal(true);
  };

  // Manejar éxito de eliminación masiva
  const handleBulkDeleteSuccess = (_result: BulkDeleteResult) => {
    setShowBulkDeleteModal(false);
    setSelectedThirdParties(new Set());
    setSelectAll(false);
    refetch(); // Recargar la lista de terceros
  };

  // Obtener terceros seleccionados como objetos
  const getSelectedThirdPartiesObjects = (): ThirdParty[] => {
    return thirdParties.filter(thirdParty => selectedThirdParties.has(thirdParty.id));
  };

  const getThirdPartyTypeColor = (type: ThirdPartyType) => {
    const colors = {
      [ThirdPartyType.CUSTOMER]: 'bg-green-100 text-green-800',
      [ThirdPartyType.SUPPLIER]: 'bg-blue-100 text-blue-800',
      [ThirdPartyType.EMPLOYEE]: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (error) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los terceros: {error}</p>
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
              <h2 className="card-title">Terceros</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredThirdParties.length} tercero{filteredThirdParties.length !== 1 ? 's' : ''} encontrado{filteredThirdParties.length !== 1 ? 's' : ''}
              </p>
            </div>
            {showActions && onCreateThirdParty && (
              <Button 
                onClick={onCreateThirdParty}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Nuevo Tercero
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar por documento, nombre, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.third_party_type || ''}
                onChange={(e) => handleFilterChange('third_party_type', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(THIRD_PARTY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={filters.is_active?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('is_active', value === '' ? undefined : value === 'true');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Acciones masivas */}
          {selectedThirdParties.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedThirdParties.size} tercero{selectedThirdParties.size !== 1 ? 's' : ''} seleccionado{selectedThirdParties.size !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    Limpiar selección
                  </Button>
                </div>

                {/* Controles de exportación y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleExportControls
                    selectedThirdPartyIds={Array.from(selectedThirdParties)}
                    thirdPartyCount={selectedThirdParties.size}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de terceros */}
      <Card>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    {showActions && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredThirdParties.map((thirdParty) => (
                    <tr 
                      key={thirdParty.id}
                      className={`hover:bg-gray-50 ${onThirdPartySelect ? 'cursor-pointer' : ''}`}
                      onClick={() => onThirdPartySelect?.(thirdParty)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedThirdParties.has(thirdParty.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleThirdPartySelect(thirdParty.id, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{thirdParty.document_number}</div>
                          <div className="text-gray-500 text-xs">
                            {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {thirdParty.commercial_name || thirdParty.name}
                          </div>
                          {thirdParty.commercial_name && (
                            <div className="text-gray-500 text-xs">{thirdParty.name}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThirdPartyTypeColor(thirdParty.third_party_type)}`}>
                          {THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {thirdParty.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {thirdParty.current_balance !== undefined ? 
                          formatCurrency(thirdParty.current_balance) : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(thirdParty.is_active)}`}>
                          {thirdParty.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onThirdPartySelect?.(thirdParty);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredThirdParties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron terceros</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Modales */}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={handleBulkDeleteSuccess}
          selectedThirdParties={getSelectedThirdPartiesObjects()}
        />
      )}
    </div>
  );
};
