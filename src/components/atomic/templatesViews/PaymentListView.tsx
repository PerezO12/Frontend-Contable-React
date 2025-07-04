import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { usePaymentsExport } from '../../../hooks/useExport';
import { usePaymentStore } from '../../../features/payments/stores/paymentStore';
import { paymentDeletionService } from '../../../features/payments/services';
import { PaymentBulkActionsBar } from '../../../features/payments/components/PaymentBulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { Payment, PaymentFilters, PaymentListResponse, PaymentStatus, PaymentType } from '../../../features/payments/types';
import { 
  PAYMENT_STATUS_LABELS, 
  PAYMENT_TYPE_LABELS,
  PaymentStatus as PS,
  PaymentType as PT
} from '../../../features/payments/types';
import { PaymentFlowAPI } from '../../../features/payments/api/paymentFlowAPI';

// Iconos (usando los existentes del proyecto)
import { 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '../../../shared/components/icons';

export interface PaymentListViewProps {
  onPaymentSelect?: (payment: Payment) => void;
  onCreatePayment?: () => void;
  initialFilters?: PaymentFilters;
  showActions?: boolean;
}

export const PaymentListView: React.FC<PaymentListViewProps> = ({
  onPaymentSelect,
  onCreatePayment,
  initialFilters,
  showActions = true,
}) => {
  console.log('🔥 PaymentListView renderizando con patrón atómico');
  
  // Store para manejo de selecciones
  const { setSelectedPayments, fetchPayments } = usePaymentStore();
  
  // Función para manejar cambios en la selección
  const handleSelectionChange = useCallback((selectedPayments: Payment[]) => {
    const selectedIds = selectedPayments.map(payment => payment.id);
    setSelectedPayments(selectedIds);
  }, [setSelectedPayments]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Payment[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<Payment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<PaymentFilters>({});

  // Hook para exportación
  const {
    exportData: exportPayments,
    isLoading: isExporting
  } = usePaymentsExport();

  // Función para renderizar el badge de estado
  const renderStatusBadge = (status: PaymentStatus) => {
    const config = {
      [PS.DRAFT]: { color: 'yellow' as const, icon: ExclamationCircleIcon },
      [PS.POSTED]: { color: 'green' as const, icon: CheckCircleIcon },
      [PS.CANCELLED]: { color: 'red' as const, icon: XCircleIcon }
    };

    const statusConfig = config[status];
    
    // Fallback for unknown statuses
    if (!statusConfig) {
      return (
        <Badge color="gray" variant="subtle">
          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
          Estado desconocido
        </Badge>
      );
    }

    const { color, icon: Icon } = statusConfig;
    
    return (
      <Badge color={color} variant="subtle">
        <Icon className="h-3 w-3 mr-1" />
        {PAYMENT_STATUS_LABELS[status] || 'Estado desconocido'}
      </Badge>
    );
  };

  // Función para renderizar el badge de tipo
  const renderTypeBadge = (type: PaymentType) => {
    const config = {
      [PT.CUSTOMER_PAYMENT]: { color: 'blue' as const, icon: ChevronDownIcon },
      [PT.SUPPLIER_PAYMENT]: { color: 'purple' as const, icon: ChevronUpIcon }
    };

    const typeConfig = config[type];
    
    // Fallback for unknown payment types
    if (!typeConfig) {
      return (
        <Badge color="gray" variant="subtle">
          <ChevronDownIcon className="h-3 w-3 mr-1" />
          Tipo desconocido
        </Badge>
      );
    }

    const { color, icon: Icon } = typeConfig;
    
    return (
      <Badge color={color} variant="subtle">
        <Icon className="h-3 w-3 mr-1" />
        {PAYMENT_TYPE_LABELS[type] || 'Tipo desconocido'}
      </Badge>
    );
  };

  // Configuración de columnas
  const columns: ListViewColumn<Payment>[] = [
    {
      key: 'reference',
      header: 'Referencia',
      width: '120px',
      render: (payment) => (
        <div className="font-medium text-secondary-900">
          {payment.reference || '-'}
        </div>
      ),
    },
    {
      key: 'payment_date',
      header: 'Fecha de Pago',
      width: '120px',
      render: (payment) => (
        <div className="text-sm text-secondary-900">
          {formatDate(payment.payment_date)}
        </div>
      ),
    },
    {
      key: 'partner_name',
      header: 'Tercero',
      render: (payment) => (
        <div>
          <div className="text-sm font-medium text-secondary-900">
            {payment.partner_name || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Importe',
      width: '130px',
      render: (payment) => (
        <div className="text-right">
          <div className="text-sm font-medium text-secondary-900">
            {formatCurrency(payment.amount, payment.currency_code)}
          </div>
        </div>
      ),
    },
    {
      key: 'payment_type',
      header: 'Tipo',
      width: '120px',
      render: (payment) => renderTypeBadge(payment.payment_type),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (payment) => renderStatusBadge(payment.status),
    },
    {
      key: 'journal_name',
      header: 'Diario',
      width: '120px',
      render: (payment) => (
        <div className="text-sm text-secondary-600">
          {payment.journal_name || '-'}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (payment) => (
        <div className="text-sm text-secondary-600 truncate max-w-xs">
          {payment.description || '-'}
        </div>
      ),
    },
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: PS.DRAFT, label: PAYMENT_STATUS_LABELS[PS.DRAFT] },
        { value: PS.POSTED, label: PAYMENT_STATUS_LABELS[PS.POSTED] },
        { value: PS.CANCELLED, label: PAYMENT_STATUS_LABELS[PS.CANCELLED] },
      ],
    },
    {
      key: 'payment_type',
      label: 'Tipo de Pago',
      type: 'select',
      options: [
        { value: '', label: 'Todos los tipos' },
        { value: PT.CUSTOMER_PAYMENT, label: PAYMENT_TYPE_LABELS[PT.CUSTOMER_PAYMENT] },
        { value: PT.SUPPLIER_PAYMENT, label: PAYMENT_TYPE_LABELS[PT.SUPPLIER_PAYMENT] },
      ],
    },
    {
      key: 'date_from',
      label: 'Fecha Desde',
      type: 'date',
    },
    {
      key: 'date_to',
      label: 'Fecha Hasta', 
      type: 'date',
    },
    {
      key: 'amount_min',
      label: 'Importe Mínimo',
      type: 'number',
    },
    {
      key: 'amount_max',
      label: 'Importe Máximo',
      type: 'number',
    },
    {
      key: 'reference',
      label: 'Referencia',
      type: 'text',
      placeholder: 'Buscar por referencia...',
    },
    {
      key: 'partner_id',
      label: 'Tercero',
      type: 'text',
      placeholder: 'Buscar por tercero...',
    },
    {
      key: 'currency_code',
      label: 'Moneda',
      type: 'select',
      options: [
        { value: '', label: 'Todas las monedas' },
        { value: 'COP', label: 'COP - Peso Colombiano' },
        { value: 'USD', label: 'USD - Dólar Americano' },
        { value: 'EUR', label: 'EUR - Euro' },
      ],
    },
  ];

  // Configuración de acciones generales (botón Nuevo, etc.)
  const actions: ListViewAction<Payment>[] = showActions ? [
    {
      key: 'create',
      label: 'Nuevo Pago',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary',
      onClick: () => onCreatePayment?.(),
      requiresSelection: false,
    },
  ] : [];

  // Data fetcher que se adapta al formato esperado por ListView
  const dataFetcher = useCallback(async (params: {
    page?: number;
    perPage?: number;
    filters?: Record<string, any>;
  }) => {
    console.log('📊 Cargando pagos con filtros:', params.filters);
    
    try {
      const paymentFilters: PaymentFilters = {
        ...params.filters,
        page: params.page,
        per_page: params.perPage,
      };

      setCurrentFilters(paymentFilters);
      
      const response: PaymentListResponse = await PaymentFlowAPI.getPayments(paymentFilters);
      
      console.log('✅ Pagos cargados:', response);
      console.log('🔍 Primeros 3 pagos para debug:', response.data?.slice(0, 3).map(p => ({
        id: p.id,
        reference: p.reference,
        status: p.status,
        payment_type: p.payment_type
      })));
      console.log('🔍 Estados únicos en los datos:', [...new Set(response.data?.map(p => p.status))]);
      console.log('🔍 Tipos únicos en los datos:', [...new Set(response.data?.map(p => p.payment_type))]);
      
      setTotalItems(response.total || 0);
      
      // Sincronizar datos con el store para que las operaciones bulk funcionen correctamente
      await fetchPayments(paymentFilters);
      
      return {
        items: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pages: response.pages || 1,
        perPage: response.per_page || 25,
      };
    } catch (error) {
      console.error('❌ Error al cargar pagos:', error);
      throw error;
    }
  }, [fetchPayments]);

  // Confirmación de exportación
  const confirmExport = async (format: string, options?: any) => {
    try {
      const dataToExport = options?.includeFilters 
        ? { filters: currentFilters, total: totalItems }
        : { payments: selectedForExport };
        
      await exportPayments(dataToExport, format as 'csv' | 'excel');
      
      setExportModalOpen(false);
      setSelectedForExport([]);
    } catch (error) {
      console.error('Error en exportación:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista principal */}
      <ListView<Payment>
        title="Lista de Pagos"
        columns={columns}
        filters={filters}
        actions={actions}
        dataFetcher={dataFetcher}
        initialFilters={initialFilters}
        selectionMode="multiple"
        onRowClick={onPaymentSelect}
        onSelectionChange={handleSelectionChange}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000],
          defaultPageSize: 25,
          showPageSizeSelector: true,
          showTotal: true,
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={paymentDeletionService}
        itemDisplayName={(payment: Payment) => payment.reference || `Pago ${payment.id}`}
        itemTypeName="pago"
        onSuccess={(deletedPayments: Payment[]) => {
          console.log(`Se eliminaron ${deletedPayments.length} pago(s)`);
          setSelectedForDeletion([]);
        }}
        onError={(error: string) => {
          console.error('Error al eliminar pagos:', error);
        }}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={confirmExport}
        title="Exportar Pagos"
        selectedItems={selectedForExport.length}
        totalItems={totalItems}
        loading={isExporting}
      />

      {/* Barra de acciones bulk flotante */}
      <PaymentBulkActionsBar />
    </div>
  );
};
