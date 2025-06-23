/**
 * Componente principal de listado de journals
 * Similar al diseño de facturas pero adaptado para journals
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournals } from '../hooks/useJournals';
import type { JournalFilter, JournalPagination, JournalListItem } from '../types';
import { JournalTypeLabels, JournalTypeColors, JournalTypeConst } from '../types';
import { formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from '@/shared/components/icons';

interface JournalListProps {
  onJournalSelect?: (journal: JournalListItem) => void;
  showActions?: boolean;
}

export function JournalList({ onJournalSelect, showActions = true }: JournalListProps) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  // Estados locales
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Memoizar filtros para evitar recreación en cada render
  const filters = useMemo<JournalFilter>(() => ({
    ...(searchTerm && { search: searchTerm }),
    ...(typeFilter && { type: typeFilter as any }),
    ...(activeFilter && { is_active: activeFilter === 'true' }),
  }), [searchTerm, typeFilter, activeFilter]);

  // Memoizar paginación para evitar recreación en cada render
  const pagination = useMemo<JournalPagination>(() => ({
    skip: currentPage * pageSize,
    limit: pageSize,
    order_by: 'name',
    order_dir: 'asc',
  }), [currentPage, pageSize]);

  // Hook para journals con autoFetch deshabilitado para control manual
  const {
    journals,
    loading,
    error,
    total,
    fetchJournals,
    clearError,
    refresh,
  } = useJournals(undefined, undefined, false);

  // Función memoizada para fetch de journals
  const performFetch = useCallback((newFilters: JournalFilter, newPagination: JournalPagination) => {
    fetchJournals(newFilters, newPagination);
  }, [fetchJournals]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    performFetch(filters, pagination);
  }, []); // Solo ejecutar una vez al montar

  // Manejar cambios en filtros con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0); // Reset a primera página cuando cambian filtros
      const resetPagination = { ...pagination, skip: 0 };
      performFetch(filters, resetPagination);
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter, activeFilter, pageSize]); // Solo dependencias de filtros

  // Manejar cambio de página
  useEffect(() => {
    if (currentPage > 0) { // Solo fetch si no es página inicial
      performFetch(filters, pagination);
    }
  }, [currentPage]); // Solo dependencia de página

  // Limpiar errores solo al montar
  useEffect(() => {
    clearError();
  }, []); // Solo ejecutar una vez

  // Handlers
  const handleJournalClick = (journal: JournalListItem) => {
    if (onJournalSelect) {
      onJournalSelect(journal);
    } else {
      navigate(`/journals/${journal.id}`);
    }
  };
  const handleCreateJournal = () => {
    navigate('/journals/new');
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      showSuccess('Lista de journals actualizada');
    } catch (error) {
      showError('Error al actualizar la lista');
    }
  };

  // Calcular paginación
  const totalPages = Math.ceil(total / pageSize);
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, total);

  // Opciones para filtros
  const typeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: JournalTypeConst.SALE, label: JournalTypeLabels.sale },
    { value: JournalTypeConst.PURCHASE, label: JournalTypeLabels.purchase },
    { value: JournalTypeConst.CASH, label: JournalTypeLabels.cash },
    { value: JournalTypeConst.BANK, label: JournalTypeLabels.bank },
    { value: JournalTypeConst.MISCELLANEOUS, label: JournalTypeLabels.miscellaneous },
  ];

  const activeOptions = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Inactivos' },
  ];

  const pageSizeOptions = [
    { value: '25', label: '25 por página' },
    { value: '50', label: '50 por página' },
    { value: '100', label: '100 por página' },
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con título y acciones */}
      <div className="flex justify-between items-center">        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journals</h1>
            <p className="text-gray-600">
              Gestión de diarios contables
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              onClick={handleCreateJournal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Journal
            </Button>
          </div>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar journals por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <DocumentTextIcon className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Journal
                </label>                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={typeOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>                <Select
                  value={activeFilter}
                  onChange={setActiveFilter}
                  options={activeOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resultados por página
                </label>                <Select
                  value={pageSize.toString()}
                  onChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(0);
                  }}
                  options={pageSizeOptions}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Información de resultados */}
      {!loading && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Mostrando {startItem} a {endItem} de {total} resultados
          </div>
          <div>
            Página {currentPage + 1} de {totalPages}
          </div>
        </div>
      )}

      {/* Lista de journals */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : journals.length === 0 ? (        <EmptyState
          title="No hay journals"
          description="No se encontraron journals que coincidan con los criterios de búsqueda."
          action={
            showActions ? (
              <Button onClick={handleCreateJournal}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear primer journal
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Lista de journals */}
          <div className="space-y-3">
            {journals.map((journal) => (
              <Card
                key={journal.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleJournalClick(journal)}
              >                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Columna 1: Información básica */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {journal.name}
                          </h3>
                          <Badge className={JournalTypeColors[journal.type]}>
                            {JournalTypeLabels[journal.type]}
                          </Badge>
                          {!journal.is_active && (
                            <Badge className="bg-red-100 text-red-800">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>Código: {journal.code}</div>
                          <div>Prefijo: {journal.sequence_prefix}</div>
                        </div>
                      </div>
                      
                      {/* Columna 2: Cuenta por defecto */}
                      <div className="lg:col-span-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Cuenta por Defecto</span>
                        </div>
                        {journal.default_account ? (
                          <div className="text-sm">
                            <div className="font-medium text-blue-600">
                              {journal.default_account.code}
                            </div>
                            <div className="text-gray-900 truncate">
                              {journal.default_account.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {journal.default_account.account_type}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Sin cuenta por defecto
                          </div>
                        )}
                      </div>
                      
                      {/* Columna 3: Estadísticas */}
                      <div className="lg:col-span-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Estadísticas</span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>Secuencia: {journal.current_sequence_number}</div>
                          <div>{journal.total_journal_entries} asientos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Creado: {formatDate(journal.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                variant="outline"
              >
                Anterior
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage < 3 ? i : currentPage - 2 + i;
                  if (page >= totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={page === currentPage ? "primary" : "outline"}
                      size="sm"
                    >
                      {page + 1}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JournalList;
