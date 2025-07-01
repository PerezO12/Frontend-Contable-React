import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { useInvoicesExport } from '../../../hooks/useExport';
import { useToast } from '../../../shared/contexts/ToastContext';
import { InvoiceBulkActionsBar } from '../../../features/invoices/components/InvoiceBulkActionsBar';
import { InvoiceService } from '../../../features/invoices/services';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { Invoice, InvoiceFilters } from '../../../features/invoices/types/legacy';
import { convertInvoiceListResponseToLegacy } from '../../../features/invoices/types';
import { 
  InvoiceTypeEnum,
  InvoiceStatusEnum
} from '../../../features/invoices/types';

// Iconos
import { 
  PlusIcon, 
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '../../../shared/components/icons';

export interface InvoiceListViewProps {
  onInvoiceSelect?: (invoice: Invoice) => void;
  onCreateInvoice?: () => void;
  initialFilters?: InvoiceFilters;
  showActions?: boolean;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = ({
  onInvoiceSelect,
  onCreateInvoice,
  initialFilters,
  showActions = true,
}) => {
  // Estado para selección (manejado por ListView)
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Invoice[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Estado para procesamiento bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  
  // Estado para forzar refresh de datos
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Hook de exportación
  const exportHook = useInvoicesExport();
  
  // Hook de toasts para feedback al usuario
  const { showSuccess, showError, showInfo } = useToast();

  // Función para forzar refresh de los datos
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handlers para operaciones bulk de estado
  const handleBulkPost = useCallback(async (options: { notes?: string; force_post?: boolean }) => {
    const invoiceIds = selectedInvoices.map(inv => inv.id);
    const invoiceCount = invoiceIds.length;
    
    try {
      setIsProcessingBulk(true);
      
      // Mostrar toast informativo sobre el inicio del procesamiento
      showInfo(
        `Iniciando contabilización de ${invoiceCount} factura${invoiceCount !== 1 ? 's' : ''}. Este proceso puede tomar un tiempo...`,
        8000
      );
      
      const result = await InvoiceService.bulkPostInvoices({
        invoice_ids: invoiceIds,
        notes: options.notes,
        force_post: options.force_post,
        stop_on_error: false
      });
      
      // Procesar resultados y mostrar feedback detallado
      if (result.successful > 0) {
        showSuccess(
          `✅ ${result.successful} de ${result.total_requested} facturas contabilizadas exitosamente${result.failed > 0 ? `. ${result.failed} fallaron.` : '.'}`,
          5000
        );
      }
      
      if (result.failed > 0) {
        const errorDetails = result.failed_items.slice(0, 3).map(item => 
          `• ${item.invoice_number || item.id}: ${item.error}`
        ).join('\n');
        
        showError(
          `❌ ${result.failed} facturas no pudieron contabilizarse:\n${errorDetails}${result.failed_items.length > 3 ? '\n... y más' : ''}`,
          10000
        );
      }
      
      // Limpiar selección y refrescar datos
      setSelectedInvoices([]);
      refreshData();
      
    } catch (error) {
      console.error('Error al contabilizar facturas:', error);
      showError(
        `❌ Error al contabilizar facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        8000
      );
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedInvoices, showSuccess, showError, showInfo, refreshData]);

  const handleBulkCancel = useCallback(async (options: { reason?: string }) => {
    const invoiceIds = selectedInvoices.map(inv => inv.id);
    const invoiceCount = invoiceIds.length;
    
    try {
      setIsProcessingBulk(true);
      
      // Mostrar toast informativo sobre el inicio del procesamiento
      showInfo(
        `Iniciando cancelación de ${invoiceCount} factura${invoiceCount !== 1 ? 's' : ''}. Este proceso puede tomar un tiempo...`,
        8000
      );
      
      const result = await InvoiceService.bulkCancelInvoices({
        invoice_ids: invoiceIds,
        reason: options.reason,
        stop_on_error: false
      });
      
      // Procesar resultados y mostrar feedback detallado
      if (result.successful > 0) {
        showSuccess(
          `✅ ${result.successful} de ${result.total_requested} facturas canceladas exitosamente${result.failed > 0 ? `. ${result.failed} fallaron.` : '.'}`,
          5000
        );
      }
      
      if (result.failed > 0) {
        const errorDetails = result.failed_items.slice(0, 3).map(item => 
          `• ${item.invoice_number || item.id}: ${item.error}`
        ).join('\n');
        
        showError(
          `❌ ${result.failed} facturas no pudieron cancelarse:\n${errorDetails}${result.failed_items.length > 3 ? '\n... y más' : ''}`,
          10000
        );
      }
      
      // Limpiar selección y refrescar datos
      setSelectedInvoices([]);
      refreshData();
      
    } catch (error) {
      console.error('Error al cancelar facturas:', error);
      showError(
        `❌ Error al cancelar facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        8000
      );
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedInvoices, showSuccess, showError, showInfo, refreshData]);

  const handleBulkResetToDraft = useCallback(async (options: { reason?: string; force_reset?: boolean }) => {
    const invoiceIds = selectedInvoices.map(inv => inv.id);
    const invoiceCount = invoiceIds.length;
    
    try {
      setIsProcessingBulk(true);
      
      // Mostrar toast informativo sobre el inicio del procesamiento
      showInfo(
        `Iniciando restablecimiento a borrador de ${invoiceCount} factura${invoiceCount !== 1 ? 's' : ''}. Este proceso puede tomar un tiempo...`,
        8000
      );
      
      const result = await InvoiceService.bulkResetToDraftInvoices({
        invoice_ids: invoiceIds,
        reason: options.reason,
        force_reset: options.force_reset,
        stop_on_error: false
      });
      
      // Procesar resultados y mostrar feedback detallado
      if (result.successful > 0) {
        showSuccess(
          `✅ ${result.successful} de ${result.total_requested} facturas restablecidas a borrador exitosamente${result.failed > 0 ? `. ${result.failed} fallaron.` : '.'}`,
          5000
        );
      }
      
      if (result.failed > 0) {
        const errorDetails = result.failed_items.slice(0, 3).map(item => 
          `• ${item.invoice_number || item.id}: ${item.error}`
        ).join('\n');
        
        showError(
          `❌ ${result.failed} facturas no pudieron restablecerse:\n${errorDetails}${result.failed_items.length > 3 ? '\n... y más' : ''}`,
          10000
        );
      }
      
      // Limpiar selección y refrescar datos
      setSelectedInvoices([]);
      refreshData();
      
    } catch (error) {
      console.error('Error al restablecer facturas a borrador:', error);
      showError(
        `❌ Error al restablecer facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        8000
      );
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedInvoices, showSuccess, showError, showInfo, refreshData]);

  // Configuración de etiquetas de estado
  const getStatusBadge = useCallback((status: string) => {
    const statusConfig: Record<string, { label: string; color: 'yellow' | 'green' | 'red' | 'gray'; icon: any }> = {
      [InvoiceStatusEnum.DRAFT]: { label: 'Borrador', color: 'yellow', icon: DocumentTextIcon },
      [InvoiceStatusEnum.POSTED]: { label: 'Contabilizada', color: 'green', icon: CheckCircleIcon },
      [InvoiceStatusEnum.CANCELLED]: { label: 'Cancelada', color: 'red', icon: XCircleIcon },
    };

    const config = statusConfig[status] || { label: status, color: 'gray' as const, icon: DocumentTextIcon };
    const Icon = config.icon;

    return (
      <Badge color={config.color} variant="subtle" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }, []);

  // Configuración de etiquetas de tipo
  const getTypeBadge = useCallback((type: string) => {
    const typeConfig: Record<string, { label: string; color: 'blue' | 'purple' | 'orange' | 'red' | 'gray' }> = {
      [InvoiceTypeEnum.CUSTOMER_INVOICE]: { label: 'Factura Cliente', color: 'blue' },
      [InvoiceTypeEnum.SUPPLIER_INVOICE]: { label: 'Factura Proveedor', color: 'purple' },
      [InvoiceTypeEnum.CREDIT_NOTE]: { label: 'Nota Crédito', color: 'orange' },
      [InvoiceTypeEnum.DEBIT_NOTE]: { label: 'Nota Débito', color: 'red' },
    };

    const config = typeConfig[type] || { label: type, color: 'gray' as const };

    return (
      <Badge color={config.color} variant="subtle">
        {config.label}
      </Badge>
    );
  }, []);

  // Configuración de columnas
  const columns: ListViewColumn<Invoice>[] = [
    {
      key: 'number',
      header: 'Número',
      render: (invoice: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{invoice.number}</div>
          {invoice.internal_reference && (
            <div className="text-sm text-gray-500">Ref: {invoice.internal_reference}</div>
          )}
        </div>
      ),
      width: '120px'
    },
    {
      key: 'invoice_type',
      header: 'Tipo',
      render: (invoice: Invoice) => getTypeBadge(invoice.invoice_type),
      width: '140px'
    },
    {
      key: 'third_party_name',
      header: 'Cliente/Proveedor',
      render: (invoice: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{invoice.third_party_name}</div>
          {invoice.third_party_code && (
            <div className="text-sm text-gray-500">{invoice.third_party_code}</div>
          )}
        </div>
      ),
      width: '200px'
    },
    {
      key: 'dates',
      header: 'Fechas',
      render: (invoice: Invoice) => (
        <div className="text-sm">
          <div>Emisión: {formatDate(invoice.invoice_date)}</div>
          <div className="text-gray-500">
            Venc: {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
          </div>
        </div>
      ),
      width: '140px'
    },
    {
      key: 'total_amount',
      header: 'Importe',
      render: (invoice: Invoice) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {formatCurrency(invoice.total_amount)}
          </div>
          {invoice.remaining_amount > 0 && (
            <div className="text-sm text-red-600">
              Pendiente: {formatCurrency(invoice.remaining_amount)}
            </div>
          )}
        </div>
      ),
      width: '140px'
    },
    {
      key: 'status',
      header: 'Estado',
      render: (invoice: Invoice) => getStatusBadge(invoice.status),
      width: '120px'
    }
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Número, cliente, descripción...'
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: InvoiceStatusEnum.DRAFT, label: 'Borrador' },
        { value: InvoiceStatusEnum.POSTED, label: 'Contabilizada' },
        { value: InvoiceStatusEnum.CANCELLED, label: 'Cancelada' }
      ]
    },
    {
      key: 'invoice_type',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '', label: 'Todos los tipos' },
        { value: InvoiceTypeEnum.CUSTOMER_INVOICE, label: 'Factura Cliente' },
        { value: InvoiceTypeEnum.SUPPLIER_INVOICE, label: 'Factura Proveedor' },
        { value: InvoiceTypeEnum.CREDIT_NOTE, label: 'Nota Crédito' },
        { value: InvoiceTypeEnum.DEBIT_NOTE, label: 'Nota Débito' }
      ]
    },
    {
      key: 'invoice_date_from',
      label: 'Fecha desde',
      type: 'date'
    },
    {
      key: 'invoice_date_to',
      label: 'Fecha hasta',
      type: 'date'
    },
    {
      key: 'third_party_name',
      label: 'Cliente/Proveedor',
      type: 'text',
      placeholder: 'Nombre del cliente/proveedor'
    }
  ];

  // Configuración de acciones principales
  const actions: ListViewAction<Invoice>[] = showActions ? [
    {
      key: 'create',
      label: 'Nueva Factura',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary',
      onClick: () => onCreateInvoice?.(),
      requiresSelection: false
    }
  ] : [];

  // Función para cargar datos (usando dataFetcher como en JournalEntryListView)
  const dataFetcher = useCallback(async (params: any) => {
    try {
      // Mapear parámetros del ListView a la estructura esperada por el backend de facturas
      const filters: any = {
        page: params.page,
        size: params.perPage,
        ...params.filters,
      };

      // Mapear ordenamiento si está presente
      if (params.sortBy) {
        filters.sort_by = params.sortBy;
        filters.sort_order = params.sortOrder || 'asc';
      }

      const response = await InvoiceService.getInvoices(filters);
      
      // Convertir la respuesta al formato legacy que usa Invoice[]
      const converted = convertInvoiceListResponseToLegacy(response);
      setTotalItems(converted.total || 0);

      return {
        items: converted.items || [],
        total: converted.total || 0,
        page: params.page,
        pages: response.total_pages || Math.ceil((converted.total || 0) / params.perPage),
        perPage: params.perPage,
      };
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      throw new Error('No se pudieron cargar las facturas. Por favor, intenta de nuevo.');
    }
  }, [refreshTrigger]);

  // Manejadores de selección
  const handleSelectionChange = useCallback((items: Invoice[]) => {
    setSelectedInvoices(items);
  }, []);

  // Manejadores de eliminación
  const handleDeleteClick = useCallback((invoices: Invoice[]) => {
    setSelectedForDeletion(invoices);
    setDeleteModalOpen(true);
  }, []);

  // Manejadores de exportación
  const handleExportClick = useCallback(() => {
    // No necesitamos parámetros, usamos directamente selectedInvoices
    setExportModalOpen(true);
  }, []);

  // Funciones para el modal de eliminación
  const getInvoiceDisplayName = (invoice: Invoice): string => {
    return `${invoice.number} - ${invoice.description || 'Sin descripción'}`;
  };

  const handleDeleteSuccess = (deletedInvoices: Invoice[]) => {
    const count = deletedInvoices.length;
    showSuccess(`✅ ${count} factura${count !== 1 ? 's' : ''} eliminada${count !== 1 ? 's' : ''} exitosamente`);
    setSelectedForDeletion([]);
    setSelectedInvoices([]);
    refreshData();
  };

  const handleDeleteError = (error: string) => {
    console.error('Error al eliminar facturas:', error);
    showError(`❌ Error al eliminar facturas: ${error}`);
  };

  // Función para exportación
  const handleExport = useCallback(async (format: string, options?: any) => {
    // Usar selectedInvoices (selección actual) en lugar de selectedForExport
    const itemsToExport = options?.scope === 'selected' ? selectedInvoices : [];
    
    await exportHook.exportData(format, {
      scope: options?.scope || 'selected',
      selectedItems: itemsToExport,
      filters: options?.filters
    });
  }, [exportHook, selectedInvoices]);

  // Configuración de breadcrumbs
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Contabilidad', href: '/accounting' },
    { label: 'Facturas', href: '/invoices' }
  ];

  return (
    <>
      <ListView<Invoice>
        title="Facturas"
        description="Gestión completa del flujo de facturación tipo Odoo"
        breadcrumbs={breadcrumbs}
        columns={columns}
        filters={filters}
        actions={actions}
        dataFetcher={dataFetcher}
        onRowClick={onInvoiceSelect}
        onSelectionChange={handleSelectionChange}
        selectionMode="multiple"
        initialFilters={initialFilters}
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
        ariaLabel="Lista de facturas"
        ariaDescription="Tabla con información de todas las facturas del sistema"
      />

      {/* Barra flotante de acciones bulk */}
      <InvoiceBulkActionsBar
        selectedCount={selectedInvoices.length}
        selectedInvoices={selectedInvoices}
        isProcessing={isProcessingBulk}
        onExport={() => handleExportClick()}
        onDelete={() => handleDeleteClick(selectedInvoices)}
        onBulkPost={handleBulkPost}
        onBulkCancel={handleBulkCancel}
        onBulkResetToDraft={handleBulkResetToDraft}
        onClearSelection={() => {
          setSelectedInvoices([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={{
          checkDeletable: async (invoices: Invoice[]) => {
            // Solo se pueden eliminar facturas en estado DRAFT
            const canDelete = invoices.filter(invoice => 
              invoice.status === 'DRAFT'
            );
            const cannotDelete = invoices.filter(invoice => 
              invoice.status !== 'DRAFT'
            );
            
            const reasons: Record<string, string> = {};
            cannotDelete.forEach(invoice => {
              reasons[invoice.id] = 'Solo se pueden eliminar facturas en estado borrador';
            });
            
            return {
              canDelete,
              cannotDelete,
              reasons
            };
          },
          deleteItems: async (invoices: Invoice[]) => {
            for (const invoice of invoices) {
              await InvoiceService.deleteInvoice(invoice.id);
            }
          }
        }}
        itemDisplayName={getInvoiceDisplayName}
        itemTypeName="factura"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Facturas"
        description="Selecciona el formato y alcance de las facturas que deseas exportar."
        onExport={handleExport}
        loading={exportHook.isExporting}
        entityName="facturas"
        totalItems={totalItems}
        selectedItems={selectedInvoices.length}
      />
    </>
  );
};
