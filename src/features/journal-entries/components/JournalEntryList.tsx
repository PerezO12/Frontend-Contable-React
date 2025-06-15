import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntries } from '../hooks';
import { useJournalEntryListListener } from '../hooks/useJournalEntryEvents';
import { JournalEntryService } from '../services';
import { SimpleJournalEntryExportControls } from './SimpleJournalEntryExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { BulkStatusChanger } from './BulkStatusChanger';
import { formatCurrency } from '../../../shared/utils';
import { 
  JournalEntryType,
  JournalEntryStatus, 
  JOURNAL_ENTRY_TYPE_LABELS,
  JOURNAL_ENTRY_STATUS_LABELS,
  type JournalEntry,
  type JournalEntryFilters 
} from '../types';

interface JournalEntryListProps {
  onEntrySelect?: (entry: JournalEntry) => void;
  onCreateEntry?: () => void;
  onEditEntry?: (entry: JournalEntry) => void;
  initialFilters?: JournalEntryFilters;
  showActions?: boolean;
  onApproveEntry?: (entry: JournalEntry) => void;
  onPostEntry?: (entry: JournalEntry) => void;
  onCancelEntry?: (entry: JournalEntry) => void;
  onReverseEntry?: (entry: JournalEntry) => void;
}

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  onEntrySelect,
  onCreateEntry,
  onEditEntry,
  initialFilters,
  showActions = false,
  onApproveEntry,
  onPostEntry,
  onCancelEntry,
  onReverseEntry
}) => {
  const [filters, setFilters] = useState<JournalEntryFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);  // Obtener funcionalidad del hook
  const { 
    entries, 
    pagination, 
    loading, 
    error,    
    refetch,
    refetchWithFilters,
    searchEntries,
    validateDeletion,
    bulkDeleteEntries
  } = useJournalEntries(initialFilters);
  
  // Escuchar eventos de cambios en asientos contables para actualización en tiempo real
  useJournalEntryListListener((event) => {
    // Solo refrescamos para eventos específicos que realmente requieren actualización de la lista
    // Excluimos 'deleted' porque ya actualizamos el estado local en bulkDeleteEntries
    if (['approved', 'posted', 'cancelled', 'reversed'].includes(event.type)) {
      refetch(); // Sin pasar filtros para usar el estado interno del hook
    }
  });

  // Filtrar entradas basadas en el término de búsqueda
  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    
    const term = searchTerm.toLowerCase();
    return entries.filter((entry: JournalEntry) =>
      entry.number.toLowerCase().includes(term) ||
      entry.description.toLowerCase().includes(term) ||
      entry.reference?.toLowerCase().includes(term) ||
      entry.created_by_name?.toLowerCase().includes(term)
    );
  }, [entries, searchTerm]);

  const handleFilterChange = (key: keyof JournalEntryFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchEntries(searchTerm, filters);
    } else {
      refetchWithFilters(filters);
    }
  };

  // Manejar selección individual de asientos
  const handleEntrySelect = (entryId: string, checked: boolean) => {
    const newSelected = new Set(selectedEntries);
    if (checked) {
      newSelected.add(entryId);
    } else {
      newSelected.delete(entryId);
    }
    setSelectedEntries(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredEntries.length && filteredEntries.length > 0);
  };

  // Manejar selección de todos los asientos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredEntries.map((entry: JournalEntry) => entry.id));
      setSelectedEntries(allIds);
    } else {
      setSelectedEntries(new Set());
    }
    setSelectAll(checked);
  };

  // Limpiar selección  
  const handleClearSelection = () => {
    setSelectedEntries(new Set());
    setSelectAll(false);
  };
  
  // Abrir modal de eliminación masiva
  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };
  
  const handleBulkDeleteSuccess = () => {
    setShowBulkDeleteModal(false);
    handleClearSelection();  };  // Función para cambio de estado masivo
  const handleBulkStatusChange = async (entryIds: string[], newStatus: JournalEntryStatus | 'REVERSE', reason?: string, forceOperation?: boolean) => {
    try {
      console.log(`Cambiando ${entryIds.length} asientos al estado/operación ${newStatus}`, reason ? `con razón: ${reason}` : '', forceOperation ? `(force_operation: ${forceOperation})` : '');
      
      let result;
        if (newStatus === 'REVERSE') {
        // Operación especial de reversión
        const reverseData = {
          journal_entry_ids: entryIds,
          reason: reason || 'Reversión masiva desde interfaz',
          reversal_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          force_reverse: forceOperation || false
        };
        const reverseResult = await JournalEntryService.bulkReverseEntries(reverseData);
        // Transform result to match expected format
        result = {
          total_requested: reverseResult.total_requested,
          total_updated: reverseResult.total_reversed,
          total_failed: reverseResult.total_failed,
          successful_entries: [], // Simplificado para evitar errores de tipo
          failed_entries: reverseResult.failed_entries?.map((item: any) => ({
            id: item.journal_entry_id || 'unknown',
            error: item.errors?.join(', ') || 'Error desconocido'
          })) || []
        };
      } else {
        // Cambio de estado normal - pasar forceOperation para todas las operaciones
        result = await JournalEntryService.bulkChangeStatus(entryIds, newStatus, reason, forceOperation);
      }
      
      console.log('Resultado del cambio de estado/operación:', result);
      
      // Refrescar la lista después del cambio exitoso
      refetch();
      
      return result;
    } catch (error: any) {
      console.error('Error al cambiar estado masivo:', error);
      
      // Re-lanzar el error para que lo maneje el componente BulkStatusChanger
      throw error;    }
  };

  const getStatusColor = (status: JournalEntryStatus) => {
    const colors = {
      [JournalEntryStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [JournalEntryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [JournalEntryStatus.APPROVED]: 'bg-blue-100 text-blue-800',
      [JournalEntryStatus.POSTED]: 'bg-green-100 text-green-800',
      [JournalEntryStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getTypeColor = (type: JournalEntryType) => {
    const colors = {
      [JournalEntryType.MANUAL]: 'bg-blue-100 text-blue-800',
      [JournalEntryType.AUTOMATIC]: 'bg-purple-100 text-purple-800',
      [JournalEntryType.ADJUSTMENT]: 'bg-orange-100 text-orange-800',
      [JournalEntryType.OPENING]: 'bg-green-100 text-green-800',
      [JournalEntryType.CLOSING]: 'bg-red-100 text-red-800',
      [JournalEntryType.REVERSAL]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type];
  };
  if (error) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los asientos contables: {error}</p>
          <Button onClick={() => refetchWithFilters(filters)}>
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
              <h2 className="card-title">Asientos Contables</h2>
              <p className="text-sm text-gray-600 mt-1">
                {pagination.total} asiento{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}              </p>
            </div>
            {onCreateEntry && (
              <Button 
                onClick={onCreateEntry}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Nuevo Asiento
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Número, descripción, referencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.entry_type || ''}
                onChange={(e) => handleFilterChange('entry_type', e.target.value || undefined)}
                className="form-select"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(JOURNAL_ENTRY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="form-select"
              >
                <option value="">Todos los estados</option>
                {Object.entries(JOURNAL_ENTRY_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <Input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <Input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
              />
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900">{pagination.total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Borradores</p>
              <p className="text-lg font-semibold text-blue-700">
                {entries.filter(e => e.status === JournalEntryStatus.DRAFT).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-lg font-semibold text-yellow-700">
                {entries.filter(e => e.status === JournalEntryStatus.PENDING).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Contabilizados</p>
              <p className="text-lg font-semibold text-green-700">
                {entries.filter(e => e.status === JournalEntryStatus.POSTED).length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-lg font-semibold text-orange-700">
                {entries.filter(e => e.status === JournalEntryStatus.APPROVED).length}
              </p>
            </div>
          </div>          {/* Acciones masivas */}
          {selectedEntries.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedEntries.size} asiento{selectedEntries.size !== 1 ? 's' : ''} seleccionado{selectedEntries.size !== 1 ? 's' : ''}
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

                {/* Controles de exportación, estado y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleJournalEntryExportControls
                    selectedEntryIds={Array.from(selectedEntries)}
                    entryCount={selectedEntries.size}
                    onExportEnd={handleClearSelection}
                  />
                  <BulkStatusChanger
                    selectedEntryIds={Array.from(selectedEntries)}
                    onStatusChange={handleBulkStatusChange}
                    onSuccess={handleClearSelection}
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

          {/* Controles de selección para cuando no hay elementos seleccionados */}
          {filteredEntries.length > 0 && selectedEntries.size === 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Seleccionar todos ({filteredEntries.length})
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de asientos */}
      <Card>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-2">Cargando asientos contables...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron asientos contables</p>
              {searchTerm && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchTerm('');
                    refetchWithFilters(filters);
                  }}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>                    <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Creado por</th>                    {(onEditEntry || showActions) && (
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 ${onEntrySelect ? 'cursor-pointer' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEntries.has(entry.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleEntrySelect(entry.id, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td 
                        className="py-3 px-4"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {entry.number}
                        </code>
                      </td>
                      <td 
                        className="py-3 px-4"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <span className="text-sm text-gray-900">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          {entry.reference && (
                            <p className="text-sm text-gray-500">Ref: {entry.reference}</p>
                          )}
                        </div>
                      </td>
                      <td 
                        className="py-3 px-4"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(entry.entry_type)}`}>
                          {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-right"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <span className="font-mono text-sm text-gray-900">
                          {formatCurrency(parseFloat(entry.total_debit))}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-center"
                        onClick={() => onEntrySelect?.(entry)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                          {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                        </span>
                      </td>                      <td 
                        className="py-3 px-4"
                        onClick={() => onEntrySelect?.(entry)}
                      >                        <span className="text-sm text-gray-600">
                          {entry.created_by_name || 'Usuario'}
                        </span>
                      </td>                      {(onEditEntry || showActions) && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {onEditEntry && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditEntry(entry);
                                }}
                                className="text-xs"
                              >
                                ✏️ Editar
                              </Button>
                            )}                            {showActions && onApproveEntry && entry.status === JournalEntryStatus.DRAFT && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApproveEntry(entry);
                                }}
                                className="text-xs"
                              >
                                ✓ Aprobar
                              </Button>
                            )}
                            {showActions && onPostEntry && entry.status === JournalEntryStatus.APPROVED && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPostEntry(entry);
                                }}
                                className="text-xs"
                              >
                                📝 Contabilizar
                              </Button>
                            )}
                            {showActions && onCancelEntry && (entry.status === JournalEntryStatus.DRAFT || entry.status === JournalEntryStatus.APPROVED) && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancelEntry(entry);
                                }}
                                className="text-xs"
                              >
                                ❌ Cancelar
                              </Button>
                            )}
                            {showActions && onReverseEntry && entry.status === JournalEntryStatus.POSTED && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReverseEntry(entry);
                                }}
                                className="text-xs"
                              >
                                ↩️ Reversar
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.pages} ({pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  disabled={!pagination.has_prev || loading}
                  onClick={() => handleFilterChange('skip', Math.max(0, (pagination.page - 2) * 20))}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  disabled={!pagination.has_next || loading}
                  onClick={() => handleFilterChange('skip', pagination.page * 20)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Modal de eliminación masiva */}
      <BulkDeleteModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        selectedEntryIds={Array.from(selectedEntries)}
        onValidate={validateDeletion}
        onBulkDelete={bulkDeleteEntries}
        onSuccess={handleBulkDeleteSuccess}      />
    </div>
  );
};
