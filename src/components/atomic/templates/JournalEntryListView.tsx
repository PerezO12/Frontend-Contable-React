import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { formatCurrency } from '../../../shared/utils/formatters';
import { useJournalEntriesExport } from '../../../hooks/useExport';
import { JournalEntryBulkActionsBar } from '../../../features/journal-entries/components/JournalEntryBulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { JournalEntry, JournalEntryFilters } from '../../../features/journal-entries/types';
import { JournalEntryService } from '../../../features/journal-entries/services';
import { 
  JOURNAL_ENTRY_TYPE_LABELS, 
  JOURNAL_ENTRY_STATUS_LABELS,
  TransactionOriginLabels,
  JournalEntryType,
  JournalEntryStatus
} from '../../../features/journal-entries/types';

// Iconos
import { 
  PlusIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '../../../shared/components/icons';

export interface JournalEntryListViewProps {
  onJournalEntrySelect?: (entry: JournalEntry) => void;
  onCreateJournalEntry?: () => void;
  initialFilters?: JournalEntryFilters;
  showActions?: boolean;
}

export const JournalEntryListView: React.FC<JournalEntryListViewProps> = ({
  onJournalEntrySelect,
  onCreateJournalEntry,
  initialFilters,
  showActions = true,
}) => {
  // Estado para selección (manejado por ListView)
  const [selectedEntries, setSelectedEntries] = useState<JournalEntry[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<JournalEntry[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<JournalEntry[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<JournalEntryFilters>({});

  // Estado para procesamiento de operaciones bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Hook para exportación
  const { exportData, isExporting } = useJournalEntriesExport();

  // Función para mapear color de origen de transacción al Badge
  const getTransactionOriginBadgeColor = (origin?: string): 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'emerald' => {
    if (!origin) return 'gray';
    
    switch (origin) {
      case 'sale':
      case 'collection':
        return 'green';
      case 'purchase':
      case 'payment':
        return 'blue';
      case 'adjustment':
        return 'yellow';
      case 'transfer':
        return 'purple';
      case 'opening':
        return 'indigo';
      case 'closing':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Función para calcular el estado de vencimiento
  const calculateDueStatus = (entry: JournalEntry) => {
    // Si está contabilizado (posted), consideramos que está pagado
    if (entry.status === JournalEntryStatus.POSTED) {
      return { type: 'paid', message: 'Pagado', className: 'text-green-600' };
    }

    // Buscar fechas de vencimiento disponibles
    const dueDates: Date[] = [];
    
    // Agregar fecha de vencimiento del entry principal si existe
    if (entry.earliest_due_date) {
      dueDates.push(new Date(entry.earliest_due_date));
    }

    // Si hay líneas disponibles, agregar sus fechas de vencimiento
    if (entry.lines && entry.lines.length > 0) {
      const lineDueDates = entry.lines
        .map(line => line.due_date || line.effective_due_date)
        .filter(Boolean)
        .map(date => new Date(date!));
      dueDates.push(...lineDueDates);
    }

    if (dueDates.length === 0) {
      return { type: 'no-date', message: '-', className: 'text-gray-400' };
    }

    const earliestDueDate = new Date(Math.min(...dueDates.map(d => d.getTime())));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    earliestDueDate.setHours(0, 0, 0, 0);

    const diffTime = earliestDueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Atrasado
      const daysOverdue = Math.abs(diffDays);
      return {
        type: 'overdue',
        message: `${daysOverdue} día${daysOverdue !== 1 ? 's' : ''} atrasado${daysOverdue !== 1 ? 's' : ''}`,
        className: 'text-red-600 font-medium'
      };
    } else if (diffDays === 0) {
      return {
        type: 'due-today',
        message: 'Vence hoy',
        className: 'text-orange-600 font-medium'
      };
    } else {
      return {
        type: 'pending',
        message: `${diffDays} día${diffDays !== 1 ? 's' : ''} restante${diffDays !== 1 ? 's' : ''}`,
        className: 'text-blue-600'
      };
    }
  };

  // Crear funciones de bulk operations que usen la selección actual
  const handleBulkActivate = useCallback(async (options: { reason?: string }) => {
    if (selectedEntries.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const result = await JournalEntryService.bulkActivate(
        selectedEntries.map(entry => entry.id),
        options.reason
      );
      
      if (result.successful > 0) {
        console.log(`${result.successful} asientos aprobados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failed > 0) {
        console.log(`${result.failed} asientos fallaron en la aprobación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedEntries([]);
    } catch (error) {
      console.error('Error en aprobación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedEntries]);

  const handleBulkDeactivate = useCallback(async (options: { reason?: string } = {}) => {
    if (selectedEntries.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const result = await JournalEntryService.bulkDeactivate(
        selectedEntries.map(entry => entry.id),
        options.reason
      );
      
      if (result.successful > 0) {
        console.log(`${result.successful} asientos reseteados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failed > 0) {
        console.log(`${result.failed} asientos fallaron en el reseteo`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedEntries([]);
    } catch (error) {
      console.error('Error en reseteo masivo:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedEntries]);

  const handleBulkDelete = useCallback(async (_options: { reason: string }) => {
    if (selectedEntries.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const selectedIds = selectedEntries.map(entry => entry.id);
      const result = await JournalEntryService.bulkDeleteJournalEntries({
        journal_entry_ids: selectedIds,
        reason: _options.reason,
        force_delete: false
      });
      
      if (result.total_processed > 0) {
        console.log(`${result.total_processed} asientos eliminados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.total_failed > 0) {
        console.log(`${result.total_failed} asientos fallaron en la eliminación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedEntries([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedEntries]);

  // Handlers para exportación desde el bulk actions bar
  const handleBulkExport = useCallback((selectedEntries: JournalEntry[]) => {
    setSelectedForExport(selectedEntries);
    setExportModalOpen(true);
  }, []);

  // Función para obtener nombre de display de un asiento
  const getJournalEntryDisplayName = (entry: JournalEntry): string => {
    return `${entry.number} - ${entry.description}`;
  };

  // Manejar éxito de eliminación
  const handleDeleteSuccess = useCallback((deletedEntries: JournalEntry[]) => {
    console.log(`${deletedEntries.length} asientos eliminados exitosamente`);
    setSelectedEntries([]);
    setDeleteModalOpen(false);
    setSelectedForDeletion([]);
    // TODO: Show success toast and refresh data
  }, []);

  // Manejar error de eliminación
  const handleDeleteError = useCallback((error: string) => {
    console.error('Error en eliminación:', error);
    // TODO: Show error toast
  }, []);

  // Manejar exportación
  const handleExport = useCallback(async (format: string, options: any) => {
    try {
      await exportData(format, {
        ...options,
        filters: currentFilters,
        selectedItems: options.scope === 'selected' ? selectedForExport : undefined
      });
    } catch (error) {
      console.error('Error al exportar asientos contables:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  }, [exportData, currentFilters, selectedForExport]);

  // Configuración de columnas
  const columns: ListViewColumn<JournalEntry>[] = [
    {
      key: 'number',
      header: 'Número',
      width: '120px',
      sortable: true,
      render: (entry) => (
        <span className="font-mono text-sm font-medium">{entry.number}</span>
      )
    },
    {
      key: 'entry_date',
      header: 'Fecha',
      width: '110px',
      sortable: true,
      render: (entry) => (
        <span className="text-sm">
          {new Date(entry.entry_date).toLocaleDateString('es-ES')}
        </span>
      )
    },
    {
      key: 'description',
      header: 'Descripción',
      sortable: true,
      render: (entry) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">{entry.description}</div>
          {entry.reference && (
            <div className="truncate text-xs text-gray-500">
              Ref: {entry.reference}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'entry_type',
      header: 'Tipo',
      width: '100px',
      render: (entry) => (
        <Badge
          variant="subtle"
          color={entry.entry_type === 'manual' ? 'blue' : 
                entry.entry_type === 'automatic' ? 'green' :
                entry.entry_type === 'adjustment' ? 'yellow' :
                entry.entry_type === 'opening' ? 'purple' :
                entry.entry_type === 'closing' ? 'indigo' : 'gray'}
          size="sm"
        >
          {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type as JournalEntryType]}
        </Badge>
      )
    },
    {
      key: 'transaction_origin',
      header: 'Origen',
      width: '100px',
      render: (entry) => {
        if (!entry.transaction_origin) return <span className="text-gray-400">-</span>;
        
        return (
          <Badge
            variant="subtle"
            color={getTransactionOriginBadgeColor(entry.transaction_origin)}
            size="sm"
          >
            {TransactionOriginLabels[entry.transaction_origin]}
          </Badge>
        );
      }
    },
    {
      key: 'status',
      header: 'Estado',
      width: '100px',
      sortable: true,
      render: (entry) => (
        <Badge
          variant="solid"
          color={entry.status === 'posted' ? 'green' : 
                entry.status === 'approved' ? 'blue' :
                entry.status === 'pending' ? 'yellow' :
                entry.status === 'cancelled' ? 'red' : 'gray'}
          size="sm"
        >
          {JOURNAL_ENTRY_STATUS_LABELS[entry.status as JournalEntryStatus]}
        </Badge>
      )
    },
    {
      key: 'total_debit',
      header: 'Débito',
      width: '120px',
      sortable: true,
      render: (entry) => (
        <span className="font-mono text-sm text-green-600">
          {formatCurrency(parseFloat(entry.total_debit))}
        </span>
      )
    },
    {
      key: 'total_credit',
      header: 'Crédito',
      width: '120px',
      sortable: true,
      render: (entry) => (
        <span className="font-mono text-sm text-red-600">
          {formatCurrency(parseFloat(entry.total_credit))}
        </span>
      )
    },
    {
      key: 'is_balanced',
      header: 'Balance',
      width: '80px',
      render: (entry) => (
        <div className="flex justify-center">
          {entry.is_balanced ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      )
    },
    {
      key: 'due_status',
      header: 'Vencimiento',
      width: '120px',
      render: (entry) => {
        const dueStatus = calculateDueStatus(entry);
        return (
          <span className={`text-xs ${dueStatus.className}`}>
            {dueStatus.message}
          </span>
        );
      }
    },
    {
      key: 'created_by_name',
      header: 'Creado por',
      width: '120px',
      render: (entry) => (
        <span className="text-sm text-gray-600">
          {entry.created_by_name || 'N/A'}
        </span>
      )
    }
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'status',
      type: 'select',
      label: 'Estado',
      options: Object.entries(JOURNAL_ENTRY_STATUS_LABELS).map(([value, label]) => ({
        value,
        label: label as string
      }))
    },
    {
      key: 'entry_type',
      type: 'select',
      label: 'Tipo',
      options: Object.entries(JOURNAL_ENTRY_TYPE_LABELS).map(([value, label]) => ({
        value,
        label: label as string
      }))
    },
    {
      key: 'transaction_origin',
      type: 'select',
      label: 'Origen',
      options: Object.entries(TransactionOriginLabels).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      key: 'start_date',
      type: 'date',
      label: 'Fecha desde'
    },
    {
      key: 'end_date',
      type: 'date',
      label: 'Fecha hasta'
    },
    {
      key: 'number',
      type: 'text',
      label: 'Número',
      placeholder: 'Buscar por número...'
    },
    {
      key: 'reference',
      type: 'text',
      label: 'Referencia',
      placeholder: 'Buscar por referencia...'
    },
    {
      key: 'description',
      type: 'text',
      label: 'Descripción',
      placeholder: 'Buscar por descripción...'
    }
  ];

  // Data fetcher
  const dataFetcher = useCallback(async (params: any) => {
    try {
      // Capturar filtros actuales para exportación
      setCurrentFilters(params.filters || {});
      
      // Mapear parámetros del ListView a la estructura esperada por el backend
      // El backend usa skip/limit en lugar de page/size
      const skip = (params.page - 1) * params.perPage;
      const limit = params.perPage;
      
      const filters: any = {
        skip,
        limit,
        ...params.filters,
      };

      // Mapear ordenamiento si está presente
      if (params.sortBy) {
        filters.sort_by = params.sortBy;
        filters.sort_order = params.sortOrder || 'asc';
      }

      const response = await JournalEntryService.getJournalEntries(filters);
      
      // Capturar total de elementos para exportación
      setTotalItems(response.total || 0);
      
      // Actualizar la lista de asientos para el hook bulk
      const entryList = response.items || [];

      // Calcular páginas basándose en total y limit
      const pages = Math.ceil((response.total || 0) / limit);

      return {
        items: entryList,
        total: response.total || 0,
        page: params.page,
        pages: pages,
        perPage: limit,
      };
    } catch (error) {
      console.error('Error al cargar asientos contables:', error);
      throw new Error('No se pudieron cargar los asientos contables. Por favor, intenta de nuevo.');
    }
  }, []);

  // Manejar cambios de selección desde ListView
  const handleSelectionChange = useCallback((selectedEntries: JournalEntry[]) => {
    setSelectedEntries(selectedEntries);
  }, []);

  // Acciones principales
  const actions: ListViewAction<JournalEntry>[] = showActions ? [
    {
      key: 'create',
      label: 'Nuevo Asiento',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary',
      onClick: () => onCreateJournalEntry?.(),
      requiresSelection: false
    }
  ] : [];

  return (
    <>
      <ListView<JournalEntry>
        title="Asientos Contables"
        description="Gestión completa de asientos contables y partida doble"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Asientos Contables' },
        ]}
        columns={columns}
        filters={filters}
        initialFilters={initialFilters}
        actions={actions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onJournalEntrySelect}
        onSelectionChange={handleSelectionChange}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000],
          defaultPageSize: 25,
          showPageSizeSelector: true,
          showQuickJumper: true,
          showTotal: true,
        }}
        enableSearch={true}
        enableExport={true}
        exportFormats={['csv', 'xlsx', 'json']}
        ariaLabel="Lista de asientos contables"
        ariaDescription="Tabla con información de todos los asientos contables del sistema"
      />

      {/* Barra flotante de acciones bulk */}
      <JournalEntryBulkActionsBar
        selectedCount={selectedEntries.length}
        selectedEntries={selectedEntries}
        isProcessing={isProcessingBulk}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => {
          // Clear selection in ListView
          setSelectedEntries([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={{
          checkDeletable: async (entries: JournalEntry[]) => {
            // Separar asientos que se pueden eliminar de los que no
            const canDelete = entries.filter(entry => 
              entry.status !== JournalEntryStatus.POSTED && 
              entry.status !== JournalEntryStatus.APPROVED
            );
            const cannotDelete = entries.filter(entry => 
              entry.status === JournalEntryStatus.POSTED || 
              entry.status === JournalEntryStatus.APPROVED
            );
            
            const reasons: Record<string, string> = {};
            cannotDelete.forEach(entry => {
              reasons[entry.id] = 'No se pueden eliminar asientos contabilizados o aprobados';
            });
            
            return {
              canDelete,
              cannotDelete,
              reasons
            };
          },
          deleteItems: async (entries: JournalEntry[]) => {
            const selectedIds = entries.map(entry => entry.id);
            await JournalEntryService.bulkDeleteJournalEntries({
              journal_entry_ids: selectedIds,
              force_delete: false
            });
          }
        }}
        itemDisplayName={getJournalEntryDisplayName}
        itemTypeName="asiento contable"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Asientos Contables"
        description="Selecciona el formato y alcance de los asientos contables que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="asientos contables"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </>
  );
};
