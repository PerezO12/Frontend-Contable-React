/**
 * Componente principal de listado de facturas
 * Implementa el flujo completo de Odoo con UI elegante y moderna
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { InvoiceStatus } from '../types/legacy';
import type { Invoice } from '../types/legacy';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/shared/contexts/ToastContext';
import { 
  PlusIcon, 
  FunnelIcon, 
  DocumentTextIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@/shared/components/icons';

type BadgeColor = "gray" | "yellow" | "blue" | "green" | "emerald" | "orange" | "red" | "purple" | "indigo" | "pink";

const statusConfig: Record<string, { label: string; color: BadgeColor; icon: any }> = {
  'DRAFT': {
    label: 'Borrador',
    color: 'gray',
    icon: DocumentTextIcon
  },
  'PENDING': {
    label: 'Pendiente',
    color: 'yellow',
    icon: ExclamationCircleIcon
  },
  'APPROVED': {
    label: 'Aprobada',
    color: 'blue',
    icon: CheckCircleIcon
  },
  'POSTED': {
    label: 'Emitida',
    color: 'green',
    icon: CheckCircleIcon
  },
  'PAID': {
    label: 'Pagada',
    color: 'emerald',
    icon: BanknotesIcon
  },
  'PARTIALLY_PAID': {
    label: 'Pago Parcial',
    color: 'orange',
    icon: BanknotesIcon
  },
  'OVERDUE': {
    label: 'Vencida',
    color: 'red',
    icon: ExclamationCircleIcon
  },
  'CANCELLED': {
    label: 'Cancelada',
    color: 'red',
    icon: XCircleIcon
  }
};

const typeConfig: Record<string, { label: string; color: BadgeColor }> = {
  'CUSTOMER_INVOICE': {
    label: 'Factura Venta',
    color: 'green'
  },
  'SUPPLIER_INVOICE': {
    label: 'Factura Compra',
    color: 'blue'
  },
  'CREDIT_NOTE': {    label: 'Nota Crédito',
    color: 'orange'
  },
  'DEBIT_NOTE': {
    label: 'Nota Débito',
    color: 'purple'
  }
};

export function InvoiceList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const {
    invoices,
    loading,
    deleting,
    pagination,
    filters,
    error,
    fetchInvoices,
    deleteInvoice,
    setFilters,
    clearFilters,
    duplicateInvoice
  } = useInvoiceStore();

  // Cargar facturas al montar el componente
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Manejar cambios en filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1 // Reset pagination
    });
  };

  // Aplicar filtros
  const applyFilters = () => {
    fetchInvoices(filters);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    fetchInvoices();
  };

  // Manejar eliminación
  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete.id!);
      showToast('Factura eliminada exitosamente', 'success');
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    } catch (error) {
      showToast('Error al eliminar la factura', 'error');
    }
  };

  // Manejar duplicación
  const handleDuplicate = async (invoice: Invoice) => {
    try {
      const duplicated = await duplicateInvoice(invoice.id!);
      showToast('Factura duplicada exitosamente', 'success');
      navigate(`/invoices/${duplicated.id}/edit`);
    } catch (error) {
      showToast('Error al duplicar la factura', 'error');
    }
  };

  // Renderizar acciones de fila
  const renderRowActions = (invoice: Invoice) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/invoices/${invoice.id}`)}
        className="text-gray-600 hover:text-blue-600"
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
      
      {invoice.status === InvoiceStatus.DRAFT && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
          className="text-gray-600 hover:text-green-600"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDuplicate(invoice)}
        className="text-gray-600 hover:text-purple-600"
      >
        <DocumentDuplicateIcon className="h-4 w-4" />
      </Button>

      {invoice.status === InvoiceStatus.DRAFT && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteClick(invoice)}
          className="text-gray-600 hover:text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  // Configurar columnas de la tabla
  const columns = [
    {
      key: 'number',
      label: 'Número',
      render: (invoice: Invoice) => (
        <div className="font-medium text-gray-900">
          {invoice.number}
          {invoice.internal_reference && (
            <div className="text-sm text-gray-500">
              Ref: {invoice.internal_reference}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',      render: (invoice: Invoice) => {
        const config = typeConfig[invoice.invoice_type] || {
          label: invoice.invoice_type,
          color: 'gray' as BadgeColor
        };
        return (
          <Badge color={config.color} variant="subtle">
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'third_party',
      label: 'Cliente/Proveedor',
      render: (invoice: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">
            {invoice.third_party_name}
          </div>
          {invoice.third_party_code && (
            <div className="text-sm text-gray-500">
              {invoice.third_party_code}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'dates',
      label: 'Fechas',
      render: (invoice: Invoice) => (        <div className="text-sm">
          <div>Emisión: {formatDate(invoice.invoice_date)}</div>
          <div className="text-gray-500">
            Venc: {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Importe',
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
      )
    },
    {
      key: 'status',
      label: 'Estado',      render: (invoice: Invoice) => {
        const config = statusConfig[invoice.status] || {
          label: invoice.status,
          color: 'gray' as BadgeColor,
          icon: DocumentTextIcon
        };
        const Icon = config.icon;
        return (
          <Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: renderRowActions
    }
  ];
  if (loading && (!invoices || invoices.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa del flujo de facturación tipo Odoo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtros
          </Button>
          
          <Button
            onClick={() => navigate('/invoices/new')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <SearchInput
              placeholder="Buscar facturas..."
              value={filters.search || ''}
              onChange={(value: string) => handleFilterChange('search', value)}
            />
            
            <Select
              placeholder="Estado"
              value={filters.status || ''}
              onChange={(value: string) => handleFilterChange('status', value)}
              options={Object.entries(statusConfig).map(([key, config]) => ({
                value: key,
                label: config.label
              }))}
            />
            
            <Select
              placeholder="Tipo"
              value={filters.invoice_type || ''}
              onChange={(value: string) => handleFilterChange('invoice_type', value)}
              options={Object.entries(typeConfig).map(([key, config]) => ({
                value: key,
                label: config.label
              }))}
            />
            
            <input
              type="date"
              placeholder="Desde"
              value={filters.from_date || ''}
              onChange={(e) => handleFilterChange('from_date', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <input
              type="date"
              placeholder="Hasta"
              value={filters.to_date || ''}
              onChange={(e) => handleFilterChange('to_date', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Button onClick={applyFilters} size="sm">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters} size="sm">
              Limpiar
            </Button>
          </div>
        </Card>
      )}

      {/* Tabla de facturas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}      {(!invoices || invoices.length === 0) && !loading ? (
        <EmptyState
          title="No hay facturas"
          description="Comienza creando tu primera factura"
          action={
            <Button onClick={() => navigate('/invoices/new')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          }
        />
      ) : (
        <Card>
          <Table
            columns={columns}
            data={invoices || []}
            loading={loading}
          />
          
          {/* Paginación */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.page_size) + 1} a{' '}
                {Math.min(pagination.page * pagination.page_size, pagination.total)} de{' '}
                {pagination.total} facturas
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                >
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.total_pages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.total_pages || loading}
                  onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Factura"
        description={`¿Estás seguro de que quieres eliminar la factura ${invoiceToDelete?.number}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        loading={deleting}
      />
    </div>
  );
}
