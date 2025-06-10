import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntries } from '../hooks';
import { useJournalEntryListListener } from '../hooks/useJournalEntryEvents';
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
}

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  onEntrySelect,
  onCreateEntry,
  onEditEntry,
  initialFilters,
  showActions = true
}) => {
  const [filters, setFilters] = useState<JournalEntryFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    entries, 
    pagination, 
    loading, 
    error, 
    refetch, 
    deleteEntry,
    approveEntry,
    postEntry,
    cancelEntry,    reverseEntry,
    searchEntries 
  } = useJournalEntries(filters);
  // Escuchar eventos de cambios en asientos contables para actualización en tiempo real
  useJournalEntryListListener(() => {
    // Refrescar la lista cuando hay cambios
    refetch(filters);
  });

  // Filter entries based on search term
  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    
    const term = searchTerm.toLowerCase();
    return entries.filter(entry =>
      entry.number.toLowerCase().includes(term) ||
      entry.description.toLowerCase().includes(term) ||
      entry.reference?.toLowerCase().includes(term) ||
      entry.created_by_name?.toLowerCase().includes(term)
    );
  }, [entries, searchTerm]);

  const handleFilterChange = (key: keyof JournalEntryFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetch(newFilters);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchEntries(searchTerm, filters);
    } else {
      refetch(filters);
    }
  };

  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (entry.status !== JournalEntryStatus.DRAFT) {
      return;
    }

    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar el asiento contable ${entry.number}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      await deleteEntry(entry.id);
    }
  };

  const handleApproveEntry = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea aprobar el asiento contable ${entry.number}?`
    );

    if (confirmed) {
      await approveEntry(entry.id);
    }
  };

  const handlePostEntry = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea contabilizar el asiento ${entry.number}?\n\nEsta acción afectará los saldos de las cuentas contables.`
    );

    if (confirmed) {
      await postEntry(entry.id);
    }
  };

  const handleCancelEntry = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para cancelar el asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      await cancelEntry(entry.id, reason.trim());
    }
  };

  const handleReverseEntry = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para crear una reversión del asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      await reverseEntry(entry.id, reason.trim());
    }
  };

  const getStatusColor = (status: JournalEntryStatus) => {
    const colors = {
      [JournalEntryStatus.DRAFT]: 'bg-gray-100 text-gray-800',
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

  const canEdit = (entry: JournalEntry) => entry.status === JournalEntryStatus.DRAFT;
  const canDelete = (entry: JournalEntry) => entry.status === JournalEntryStatus.DRAFT;
  const canApprove = (entry: JournalEntry) => entry.status === JournalEntryStatus.DRAFT;
  const canPost = (entry: JournalEntry) => entry.status === JournalEntryStatus.APPROVED;
  const canCancel = (entry: JournalEntry) => 
    entry.status === JournalEntryStatus.DRAFT || entry.status === JournalEntryStatus.APPROVED;
  const canReverse = (entry: JournalEntry) => 
    entry.status === JournalEntryStatus.POSTED && entry.entry_type !== JournalEntryType.REVERSAL;

  if (error) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los asientos contables: {error}</p>
          <Button onClick={() => refetch(filters)}>
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
                {pagination.total} asiento{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            {showActions && onCreateEntry && (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Contabilizados</p>
              <p className="text-lg font-semibold text-green-700">
                {entries.filter(e => e.status === JournalEntryStatus.POSTED).length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-lg font-semibold text-orange-700">
                {entries.filter(e => e.status === JournalEntryStatus.APPROVED).length}
              </p>
            </div>
          </div>
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
                    refetch(filters);
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Creado por</th>
                    {showActions && <th className="text-center py-3 px-4 font-medium text-gray-900">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 ${onEntrySelect ? 'cursor-pointer' : ''}`}
                      onClick={() => onEntrySelect?.(entry)}
                    >
                      <td className="py-3 px-4">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {entry.number}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          {entry.reference && (
                            <p className="text-sm text-gray-500">Ref: {entry.reference}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(entry.entry_type)}`}>
                          {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono text-sm text-gray-900">
                          {formatCurrency(parseFloat(entry.total_debit))}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                          {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {entry.created_by_name || 'Usuario'}
                        </span>
                      </td>
                      {showActions && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-1">
                            {canEdit(entry) && onEditEntry && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditEntry(entry);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Editar
                              </Button>
                            )}
                            {canApprove(entry) && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveEntry(entry);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                Aprobar
                              </Button>
                            )}
                            {canPost(entry) && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePostEntry(entry);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Contabilizar
                              </Button>
                            )}
                            {canReverse(entry) && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReverseEntry(entry);
                                }}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                Revertir
                              </Button>
                            )}
                            {canCancel(entry) && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelEntry(entry);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                Cancelar
                              </Button>
                            )}
                            {canDelete(entry) && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEntry(entry);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                Eliminar
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
    </div>
  );
};
