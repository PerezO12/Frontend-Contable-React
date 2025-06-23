/**
 * Página de listado de facturas mejorada con flujo Odoo
 * Incluye filtros por estado del workflow y acciones batch
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceAPI } from '../api/invoiceAPI';
import { 
  type InvoiceResponse, 
  type InvoiceFilters,
  InvoiceStatusEnum,
  InvoiceTypeEnum
} from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExportFormatModal } from '@/components/ui/ExportFormatModal';
import { useToast } from '@/shared/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { 
  PlusIcon, 
  FunnelIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@/shared/components/icons';
import { ExportService } from '@/shared/services/exportService';

export function InvoiceListEnhancedPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 100,
    total: 0,
    total_pages: 0
  });
  
  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    size: 100
  });
  const [customPageSize, setCustomPageSize] = useState('100');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [filters]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await InvoiceAPI.getInvoices(filters);
      setInvoices(response.items);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        total_pages: response.total_pages
      });
    } catch (error: any) {
      showToast(error.message || 'Error al cargar las facturas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilters(prev => ({
      ...prev,
      size: newSize,
      page: 1 // Reset to first page when changing page size
    }));
    setCustomPageSize(String(newSize));
  };

  const handleSelectInvoice = (invoiceId: string, selected: boolean) => {
    if (selected) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedInvoices(invoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };
  const handleBulkAction = async (action: 'post' | 'cancel') => {
    if (selectedInvoices.length === 0) {
      showToast('Selecciona al menos una factura', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      let result;
      if (action === 'post') {
        result = await InvoiceAPI.bulkPostInvoices({
          invoice_ids: selectedInvoices
        });
        showToast(`${result.successful} facturas contabilizadas`, 'success');
      } else {
        result = await InvoiceAPI.bulkCancelInvoices({
          invoice_ids: selectedInvoices
        });
        showToast(`${result.successful} facturas canceladas`, 'success');
      }

      if (result.failed > 0) {
        showToast(
          `${result.failed} facturas fallaron: ${result.failed_items.map(f => f.error).join(', ')}`,
          'warning'
        );
      }

      setSelectedInvoices([]);
      loadInvoices();
    } catch (error: any) {
      showToast(error.message || 'Error en la operación masiva', 'error');
    } finally {
      setActionLoading(false);
    }
  };  const handleBulkReset = async () => {
    if (selectedInvoices.length === 0) {
      showToast('Selecciona al menos una factura', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      // Usar la API correcta para restablecer a borrador
      const result = await InvoiceAPI.bulkResetToDraftInvoices({
        invoice_ids: selectedInvoices
      });
      
      if (result.successful > 0) {
        showToast(`${result.successful} factura${result.successful !== 1 ? 's' : ''} restablecida${result.successful !== 1 ? 's' : ''} a borrador`, 'success');
      }
      
      if (result.failed > 0) {
        showToast(
          `${result.failed} factura${result.failed !== 1 ? 's' : ''} no se pudieron restablecer: ${result.failed_items.map(f => f.error).join(', ')}`,
          'warning'
        );
      }

      setSelectedInvoices([]);
      loadInvoices();
    } catch (error: any) {
      showToast(error.message || 'Error al restablecer facturas a borrador', 'error');
    } finally {
      setActionLoading(false);
    }
  };  const handleBulkDelete = async () => {
    if (selectedInvoices.length === 0) {
      showToast('Selecciona al menos una factura', 'warning');
      return;
    }

    // Mostrar modal de confirmación
    setShowDeleteConfirm(true);
  };
  const confirmBulkDelete = async () => {
    try {
      setActionLoading(true);
      setShowDeleteConfirm(false);
      
      // Usar la API bulk delete
      const result = await InvoiceAPI.bulkDeleteInvoices({
        invoice_ids: selectedInvoices,
        confirmation: 'CONFIRM_DELETE'
      });
      
      if (result.successful > 0) {
        showToast(`${result.successful} factura${result.successful !== 1 ? 's' : ''} eliminada${result.successful !== 1 ? 's' : ''}`, 'success');
      }
      
      if (result.failed > 0) {
        showToast(
          `${result.failed} factura${result.failed !== 1 ? 's' : ''} no se pudieron eliminar: ${result.failed_items.map(f => f.error).join(', ')}`,
          'warning'
        );
      }

      if (result.skipped > 0) {
        showToast(
          `${result.skipped} factura${result.skipped !== 1 ? 's' : ''} omitida${result.skipped !== 1 ? 's' : ''} (no están en estado DRAFT)`,
          'info'
        );
      }      setSelectedInvoices([]);
      loadInvoices();
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar facturas', 'error');
    } finally {
      setActionLoading(false);
    }
  };
  const handleBulkExport = async (format: 'csv' | 'xlsx' | 'json' = 'xlsx') => {
    if (selectedInvoices.length === 0) {
      showToast('Selecciona al menos una factura para exportar', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      const fileName = ExportService.generateFileName('facturas', format);
      
      const blob = await ExportService.exportByIds({
        table: 'invoices',
        format,
        ids: selectedInvoices,
        file_name: fileName
      });
      
      ExportService.downloadBlob(blob, fileName);
      
      showToast(`${selectedInvoices.length} factura${selectedInvoices.length !== 1 ? 's' : ''} exportada${selectedInvoices.length !== 1 ? 's' : ''} correctamente`, 'success');
      
    } catch (error: any) {
      showToast(error.message || 'Error al exportar facturas', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowExportModal = () => {
    if (selectedInvoices.length === 0) {
      showToast('Selecciona al menos una factura para exportar', 'warning');
      return;
    }
    setShowExportModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="subtle">📝 Borrador</Badge>;
      case 'POSTED':
        return <Badge variant="solid">✅ Contabilizada</Badge>;
      case 'CANCELLED':
        return <Badge variant="subtle">❌ Cancelada</Badge>;
      default:
        return <Badge variant="subtle">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CUSTOMER_INVOICE':
        return <Badge variant="subtle">📄 Venta</Badge>;
      case 'SUPPLIER_INVOICE':
        return <Badge variant="subtle">📋 Compra</Badge>;
      case 'CREDIT_NOTE':
        return <Badge variant="subtle">💳 N. Crédito</Badge>;
      case 'DEBIT_NOTE':
        return <Badge variant="subtle">📊 N. Débito</Badge>;
      default:
        return <Badge variant="subtle">{type}</Badge>;
    }
  };  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Facturas
          </h1>
          <p className="text-gray-600">
            Gestión de facturas con flujo Odoo
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="primary"
            onClick={() => navigate('/invoices/create-enhanced')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar facturas..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value={InvoiceStatusEnum.DRAFT}>Borrador</option>
              <option value={InvoiceStatusEnum.POSTED}>Contabilizada</option>
              <option value={InvoiceStatusEnum.CANCELLED}>Cancelada</option>
            </select>
            
            <select
              value={filters.invoice_type || ''}
              onChange={(e) => handleFilterChange('invoice_type', e.target.value || undefined)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Venta</option>
              <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Compra</option>
              <option value={InvoiceTypeEnum.CREDIT_NOTE}>N. Crédito</option>
              <option value={InvoiceTypeEnum.DEBIT_NOTE}>N. Débito</option>
            </select>
            
            <Input
              type="date"
              placeholder="Fecha desde"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
            />
            
            <Input
              type="date"
              placeholder="Fecha hasta"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
            />
          </div>        </div>      </Card>      {/* Acciones masivas - Fijo al hacer scroll */}
      {selectedInvoices.length > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1100]">
          <Card className="px-6 py-4 shadow-2xl border-2 border-blue-300 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between space-x-6">
              <span className="text-sm font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                {selectedInvoices.length} factura{selectedInvoices.length !== 1 ? 's' : ''} seleccionada{selectedInvoices.length !== 1 ? 's' : ''}
              </span>
              
              <div className="flex items-center space-x-3">
                <DropdownMenu
                  trigger={
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4 mr-2" />
                      Acciones
                    </Button>
                  }
                >
                  <DropdownItem
                    onClick={() => handleBulkAction('post')}
                    icon={<CheckCircleIcon className="h-4 w-4" />}
                    disabled={actionLoading}
                  >
                    Contabilizar
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleBulkAction('cancel')}
                    icon={<XCircleIcon className="h-4 w-4" />}
                    variant="danger"
                    disabled={actionLoading}
                  >
                    Cancelar
                  </DropdownItem>                  <DropdownItem
                    onClick={handleBulkReset}
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                    disabled={actionLoading}
                  >
                    Restablecer a Borrador
                  </DropdownItem>                  <DropdownItem
                    onClick={handleShowExportModal}
                    icon={<ArrowDownTrayIcon className="h-4 w-4" />}
                    disabled={actionLoading}
                  >
                    Exportar
                  </DropdownItem>
                  <DropdownItem
                    onClick={handleBulkDelete}
                    icon={<TrashIcon className="h-4 w-4" />}
                    variant="danger"
                    disabled={actionLoading}
                  >
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoices([])}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lista de facturas */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              📄 No hay facturas
            </div>
            <p className="text-gray-600 mb-4">
              No se encontraron facturas con los filtros seleccionados
            </p>
            <Button
              onClick={() => navigate('/invoices/create-enhanced')}
              variant="primary"
            >
              Crear primera factura
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === invoices.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {invoices.map((invoice) => (
                  <tr 
                    key={invoice.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedInvoices.includes(invoice.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <td 
                      className="px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(invoice.invoice_type)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(invoice.invoice_date)}
                    </td>                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}          {/* Paginación mejorada */}
        {invoices.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.size) + 1} a{' '}
                  {Math.min(pagination.page * pagination.size, pagination.total)} de{' '}
                  {pagination.total} resultados
                </span>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Por página:</label>
                  <select
                    value={customPageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="rounded border-gray-300 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </div>
              </div>
                {pagination.total_pages > 1 && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(1)}
                    title="Primera página"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <ChevronLeftIcon className="h-4 w-4 -ml-2" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    title="Página anterior"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded">
                    {pagination.page} de {pagination.total_pages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.total_pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    title="Página siguiente"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.total_pages}
                    onClick={() => handlePageChange(pagination.total_pages)}
                    title="Última página"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                    <ChevronRightIcon className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              )}
              
              {pagination.total_pages === 1 && (
                <span className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded">
                  Página 1 de 1
                </span>
              )}
            </div>
          </div>)}
      </Card>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title="Eliminar Facturas"
        description={`¿Estás seguro de que quieres eliminar ${selectedInvoices.length} factura${selectedInvoices.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"        loading={actionLoading}
      />

      {/* Modal de selección de formato de exportación */}
      <ExportFormatModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleBulkExport}
        title="Exportar Facturas"
        description={`Selecciona el formato para exportar ${selectedInvoices.length} factura${selectedInvoices.length !== 1 ? 's' : ''} seleccionada${selectedInvoices.length !== 1 ? 's' : ''}.`}
        loading={actionLoading}
      />
    </div>
  );
}
