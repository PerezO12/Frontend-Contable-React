/**
 * Página de listado de pagos mejorada
 * Incluye filtros, paginación, y acciones masivas
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';
import { 
  type Payment, 
  type PaymentFilters,
  PaymentStatus,
  PaymentType,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS
} from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/shared/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { 
  PlusIcon, 
  FunnelIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon
} from '@/shared/components/icons';

export function PaymentListEnhancedPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 1000,
    total: 0,
    total_pages: 0
  });
  
  const [filters, setFilters] = useState<PaymentFilters & { size?: number; search?: string }>({
    page: 1,
    per_page: 1000,
    size: 1000
  });
  const [customPageSize, setCustomPageSize] = useState('1000');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [filters]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await PaymentFlowAPI.getPayments(filters);
      
      // Adaptamos la respuesta a nuestro formato esperado
      const adaptedResponse = {
        items: Array.isArray(response) ? response : response.data || [],
        page: Array.isArray(response) ? (filters.page || 1) : response.page || 1,
        size: filters.size || 1000,
        total: Array.isArray(response) ? response.length : response.total || 0,
        total_pages: Array.isArray(response) ? 1 : response.pages || 1
      };
      
      setPayments(adaptedResponse.items);
      setPagination({
        page: adaptedResponse.page,
        size: adaptedResponse.size,
        total: adaptedResponse.total,
        total_pages: adaptedResponse.total_pages
      });
    } catch (error: any) {
      showToast(error.message || 'Error al cargar los pagos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
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

  const handleSelectPayment = (paymentId: string, selected: boolean) => {
    if (selected) {
      setSelectedPayments(prev => [...prev, paymentId]);
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedPayments(payments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleBulkAction = async (action: 'confirm' | 'cancel' | 'reset' | 'post') => {
    if (selectedPayments.length === 0) {
      showToast('Selecciona al menos un pago', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const paymentId of selectedPayments) {
        try {
          if (action === 'confirm') {
            await PaymentFlowAPI.confirmPayment(paymentId);
          } else if (action === 'cancel') {
            await PaymentFlowAPI.cancelPayment(paymentId);
          } else if (action === 'reset') {
            await PaymentFlowAPI.resetPayment(paymentId);
          } else if (action === 'post') {
            await PaymentFlowAPI.confirmPayment(paymentId);
          }
          successful++;
        } catch (error: any) {
          failed++;
          errors.push(error.message || 'Error desconocido');
        }
      }

      if (successful > 0) {
        const actionTexts = {
          confirm: 'confirmados',
          cancel: 'cancelados',
          reset: 'restablecidos a borrador',
          post: 'posteados'
        };
        showToast(`${successful} pagos ${actionTexts[action]}`, 'success');
      }

      if (failed > 0) {
        showToast(`${failed} pagos fallaron: ${errors.join(', ')}`, 'warning');
      }

      setSelectedPayments([]);
      loadPayments();
    } catch (error: any) {
      showToast(error.message || 'Error en la operación masiva', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPayments.length === 0) {
      showToast('Selecciona al menos un pago', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const paymentId of selectedPayments) {
        try {
          await PaymentFlowAPI.cancelPayment(paymentId); // Por ahora cancelamos
          successful++;
        } catch (error: any) {
          failed++;
          errors.push(error.message || 'Error desconocido');
        }
      }

      if (successful > 0) {
        showToast(`${successful} pagos eliminados`, 'success');
      }

      if (failed > 0) {
        showToast(`${failed} pagos fallaron: ${errors.join(', ')}`, 'warning');
      }

      setSelectedPayments([]);
      setShowDeleteConfirm(false);
      loadPayments();
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar pagos', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [PaymentStatus.DRAFT]: { 
        color: 'yellow' as const, 
        icon: ExclamationCircleIcon, 
        label: PAYMENT_STATUS_LABELS.DRAFT 
      },
      [PaymentStatus.POSTED]: { 
        color: 'green' as const, 
        icon: CheckCircleIcon, 
        label: PAYMENT_STATUS_LABELS.POSTED 
      },
      [PaymentStatus.CANCELLED]: { 
        color: 'red' as const, 
        icon: XCircleIcon, 
        label: PAYMENT_STATUS_LABELS.CANCELLED 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'gray' as const,
      icon: ExclamationCircleIcon,
      label: 'Estado desconocido'
    };

    const Icon = config.icon;

    return (
      <Badge color={config.color} variant="subtle">
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleViewPayment = (payment: Payment) => {
    navigate(`/payments/${payment.id}`);
  };

  const pageSizeOptions = [10, 25, 50, 100, 250, 500, 1000];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pagos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de pagos del sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => navigate('/payments/new')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Búsqueda
                </label>
                <Input
                  placeholder="Buscar por referencia, tercero..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                >
                  <option value="">Todos los estados</option>
                  <option value={PaymentStatus.DRAFT}>{PAYMENT_STATUS_LABELS.DRAFT}</option>
                  <option value={PaymentStatus.POSTED}>{PAYMENT_STATUS_LABELS.POSTED}</option>
                  <option value={PaymentStatus.CANCELLED}>{PAYMENT_STATUS_LABELS.CANCELLED}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Pago
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.payment_type || ''}
                  onChange={(e) => handleFilterChange('payment_type', e.target.value || undefined)}
                >
                  <option value="">Todos los tipos</option>
                  <option value={PaymentType.SUPPLIER_PAYMENT}>Pago a Proveedores</option>
                  <option value={PaymentType.CUSTOMER_PAYMENT}>Pago de Clientes</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Acciones masivas */}
      {selectedPayments.length > 0 && (
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedPayments.length} pago{selectedPayments.length > 1 ? 's' : ''} seleccionado{selectedPayments.length > 1 ? 's' : ''}
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('confirm')}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('reset')}
                  disabled={actionLoading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Restablecer a Borrador
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('cancel')}
                  disabled={actionLoading}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={actionLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla */}
      <Card>
        <div className="p-6">
          {/* Controles de paginación superior */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Mostrando {Math.min((pagination.page - 1) * pagination.size + 1, pagination.total)} - {Math.min(pagination.page * pagination.size, pagination.total)} de {pagination.total} pagos
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mostrar:</span>
                <select
                  value={customPageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPayments}
              disabled={loading}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron pagos</p>
              <Button onClick={() => navigate('/payments/new')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear primer pago
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPayments.length === payments.length && payments.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tercero
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(payment.id)}
                            onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewPayment(payment)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {payment.reference || 'Sin referencia'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.partner_name || 'No especificado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.payment_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {PAYMENT_TYPE_LABELS[payment.payment_type as keyof typeof PAYMENT_TYPE_LABELS] || 'Tipo no especificado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu
                            trigger={
                              <Button variant="ghost" size="sm">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </Button>
                            }
                          >
                            <DropdownItem
                              onClick={() => handleViewPayment(payment)}
                              icon={<EyeIcon className="h-4 w-4" />}
                            >
                              Ver Detalles
                            </DropdownItem>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Página {pagination.page} de {pagination.total_pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.total_pages}
                    >
                      Siguiente
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar ${selectedPayments.length} pago${selectedPayments.length > 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={actionLoading}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
