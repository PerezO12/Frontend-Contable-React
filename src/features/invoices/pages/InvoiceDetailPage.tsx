/**
 * Página de detalle de factura - Estilo Odoo
 * Muestra información completa con tabs: Información, Líneas, Contabilidad, Auditoría
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { InvoiceStatus, InvoiceType } from '../types';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import { InvoiceJournalEntryInfo } from '../components';
import { 
  PencilIcon,
  CheckCircleIcon,
  BanknotesIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon
} from '@/shared/components/icons';

type TabType = 'info' | 'lines' | 'accounting' | 'audit';

type IconProps = { className?: string; [key: string]: any };

interface WorkflowAction {
  action: string;
  label: string;
  color: string;
  icon: (props: IconProps) => React.ReactElement;
}

// Configuración de workflow
const workflowActions: Record<InvoiceStatus, WorkflowAction[]> = {
  [InvoiceStatus.DRAFT]: [
    { action: 'confirm', label: 'Confirmar', color: 'blue', icon: CheckCircleIcon },
    { action: 'post', label: 'Emitir (Contabilizar)', color: 'green', icon: CheckCircleIcon }
  ],
  [InvoiceStatus.PENDING]: [
    { action: 'post', label: 'Emitir (Contabilizar)', color: 'green', icon: CheckCircleIcon }
  ],
  [InvoiceStatus.APPROVED]: [
    { action: 'post', label: 'Emitir (Contabilizar)', color: 'green', icon: CheckCircleIcon }
  ],
  [InvoiceStatus.POSTED]: [
    { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon }
  ],
  [InvoiceStatus.PAID]: [],
  [InvoiceStatus.PARTIALLY_PAID]: [
    { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon }
  ],
  [InvoiceStatus.OVERDUE]: [
    { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon }
  ],
  [InvoiceStatus.CANCELLED]: []
};

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [actionNotes, setActionNotes] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const {
    currentInvoice,
    loading,
    saving,
    error,
    fetchInvoice,
    confirmInvoice,
    postInvoice,
    markAsPaid,
    cancelInvoice,
    duplicateInvoice
  } = useInvoiceStore();

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id, fetchInvoice]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentInvoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar la factura
        </h3>
        <p className="text-gray-500 mb-4">
          {error || 'Factura no encontrada'}
        </p>
        <Button onClick={() => navigate('/invoices')}>
          Volver al listado
        </Button>
      </div>
    );
  }

  const invoice = currentInvoice;
  const availableActions = workflowActions[invoice.status] || [];

  const handleWorkflowAction = async (action: string) => {
    try {
      switch (action) {
        case 'confirm':
          await confirmInvoice(invoice.id!, actionNotes);
          showToast('Factura confirmada exitosamente', 'success');
          break;
        case 'post':
          await postInvoice(invoice.id!, actionNotes);
          showToast('Factura emitida y contabilizada exitosamente', 'success');
          break;
        case 'mark_paid':
          await markAsPaid(invoice.id!, actionNotes);
          showToast('Factura marcada como pagada', 'success');
          break;
        case 'cancel':
          await cancelInvoice(invoice.id!, actionNotes);
          showToast('Factura cancelada', 'success');
          break;
      }
      setActionNotes('');
    } catch (error) {
      showToast('Error al ejecutar la acción', 'error');
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateInvoice(invoice.id!);
      showToast('Factura duplicada exitosamente', 'success');
      navigate(`/invoices/${duplicated.id}/edit`);
    } catch (error) {
      showToast('Error al duplicar la factura', 'error');
    }
  };

  const getStatusConfig = (status: InvoiceStatus) => {
    const configs = {
      [InvoiceStatus.DRAFT]: { label: 'Borrador', color: 'gray' as const },
      [InvoiceStatus.PENDING]: { label: 'Pendiente', color: 'yellow' as const },
      [InvoiceStatus.APPROVED]: { label: 'Aprobada', color: 'blue' as const },
      [InvoiceStatus.POSTED]: { label: 'Emitida', color: 'green' as const },
      [InvoiceStatus.PAID]: { label: 'Pagada', color: 'emerald' as const },
      [InvoiceStatus.PARTIALLY_PAID]: { label: 'Pago Parcial', color: 'orange' as const },
      [InvoiceStatus.OVERDUE]: { label: 'Vencida', color: 'red' as const },
      [InvoiceStatus.CANCELLED]: { label: 'Cancelada', color: 'red' as const }
    };
    return configs[status] || { label: status, color: 'gray' as const };
  };

  const getTypeConfig = (type: InvoiceType) => {
    const configs = {
      [InvoiceType.CUSTOMER_INVOICE]: { label: 'Factura de Venta', color: 'green' as const },
      [InvoiceType.SUPPLIER_INVOICE]: { label: 'Factura de Compra', color: 'blue' as const },
      [InvoiceType.CREDIT_NOTE]: { label: 'Nota de Crédito', color: 'orange' as const },
      [InvoiceType.DEBIT_NOTE]: { label: 'Nota de Débito', color: 'purple' as const }
    };
    return configs[type] || { label: type, color: 'gray' as const };
  };
  const statusConfig = getStatusConfig(invoice.status);
  const typeConfig = getTypeConfig(invoice.invoice_type);

  // Funciones de renderizado de tabs
  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Cliente/Proveedor</label>
            <p className="text-gray-900 font-medium">{invoice.third_party_name}</p>
            {invoice.third_party_code && (
              <p className="text-sm text-gray-500">{invoice.third_party_code}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Emisión</label>
            <p className="text-gray-900">{formatDate(invoice.invoice_date)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
            <p className="text-gray-900">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {invoice.payment_terms_name && (
            <div>
              <label className="text-sm font-medium text-gray-500">Términos de Pago</label>
              <p className="text-gray-900">{invoice.payment_terms_name}</p>
              {invoice.payment_terms_code && (
                <p className="text-sm text-gray-500">Código: {invoice.payment_terms_code}</p>
              )}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-500">Moneda</label>
            <p className="text-gray-900">{invoice.currency_code}</p>
            {invoice.exchange_rate !== 1 && (
              <p className="text-sm text-gray-500">Tasa: {invoice.exchange_rate}</p>
            )}
          </div>

          {(invoice.internal_reference || invoice.external_reference) && (
            <div>
              <label className="text-sm font-medium text-gray-500">Referencias</label>
              {invoice.internal_reference && (
                <p className="text-sm text-gray-900">Interna: {invoice.internal_reference}</p>
              )}
              {invoice.external_reference && (
                <p className="text-sm text-gray-900">Externa: {invoice.external_reference}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {invoice.description && (
        <div>
          <label className="text-sm font-medium text-gray-500">Descripción</label>
          <p className="text-gray-900 mt-1">{invoice.description}</p>
        </div>
      )}

      {invoice.notes && (
        <div>
          <label className="text-sm font-medium text-gray-500">Notas</label>
          <p className="text-gray-900 mt-1">{invoice.notes}</p>
        </div>
      )}

      {/* Totales */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Totales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Subtotal</label>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">IVA</label>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(invoice.tax_amount)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Total</label>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Pendiente</label>
            <p className={`text-lg font-semibold ${
              invoice.remaining_amount > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(invoice.remaining_amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinesTab = () => (
    <div className="space-y-4">
      {/* Resumen de líneas */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Líneas</p>
          <p className="text-lg font-semibold text-gray-900">{invoice.lines.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-lg font-semibold text-blue-700">{formatCurrency(invoice.subtotal)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total con IVA</p>
          <p className="text-lg font-semibold text-green-700">{formatCurrency(invoice.total_amount)}</p>
        </div>
      </div>

      {/* Tabla de líneas */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-900 w-12">#</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-[200px]">Producto/Servicio</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 min-w-[150px]">Descripción</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 w-20">Cant.</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 w-24">Precio Unit.</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 w-16">IVA %</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 w-24">Subtotal</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 w-24">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.lines.map((line, index) => (
              <tr key={line.id || index}>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{line.line_number || index + 1}</span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    {line.product_name && (
                      <p className="text-sm font-medium text-gray-900">{line.product_name}</p>
                    )}
                    {line.product_code && (
                      <p className="text-xs text-gray-500">{line.product_code}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900">{line.description}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono text-gray-900">{line.quantity}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono text-gray-900">{formatCurrency(line.unit_price)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-900">{line.tax_rate}%</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono text-gray-900">
                    {formatCurrency(line.quantity * line.unit_price)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {formatCurrency(line.line_total)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  const renderAccountingTab = () => (
    <div className="space-y-6">
      {invoice.journal_entry_id ? (
        <InvoiceJournalEntryInfo
          journalEntryId={invoice.journal_entry_id}
          invoiceAmount={invoice.total_amount}
          invoiceType={invoice.invoice_type}
          thirdPartyName={invoice.third_party_name || ''}
        />
      ) : (
        <div className="text-center py-8">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Factura no Contabilizada
            </h3>
            <p className="text-gray-500 mb-4">
              Esta factura aún no ha sido contabilizada. Para generar el asiento contable, 
              debe emitir la factura usando el botón "Emitir (Contabilizar)".
            </p>
            {availableActions.some(action => action.action === 'post') && (
              <Button
                onClick={() => handleWorkflowAction('post')}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                {saving ? 'Procesando...' : 'Emitir (Contabilizar)'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      {/* Información de creación */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Auditoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Creado el</label>
            <p className="text-gray-900">{formatDate(invoice.created_at || '')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Última modificación</label>
            <p className="text-gray-900">{formatDate(invoice.updated_at || invoice.created_at || '')}</p>
          </div>
        </div>
      </div>

      {/* Historial de workflow */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flujo de Trabajo (Odoo)</h3>
        <div className="space-y-4">
          {/* Paso 1: Cliente registrado */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Cliente registrado</p>
              <p className="text-xs text-gray-500">Cliente dado de alta en el sistema</p>
            </div>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>

          {/* Paso 2: Factura creada */}          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${
              invoice.status !== 'draft' ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Factura creada (borrador)</p>
              <p className="text-xs text-gray-500">
                Estado actual: {statusConfig.label}
              </p>
            </div>{invoice.status === 'draft' ? (
              <div className="h-4 w-4 border-2 border-blue-500 rounded-full animate-pulse"></div>
            ) : (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            )}
          </div>

          {/* Paso 3: Factura emitida */}
          <div className="flex items-center gap-3">            <div className={`h-3 w-3 rounded-full ${
              ['posted', 'paid', 'partially_paid'].includes(invoice.status)
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Factura emitida (contabilizada)</p>
              <p className="text-xs text-gray-500">Genera asiento contable automáticamente</p>
            </div>
            {['posted', 'paid', 'partially_paid'].includes(invoice.status) ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>

          {/* Paso 4: Pago recibido */}
          <div className="flex items-center gap-3">            <div className={`h-3 w-3 rounded-full ${
              invoice.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pago recibido</p>
              <p className="text-xs text-gray-500">
                {invoice.paid_amount > 0 
                  ? `Pagado: ${formatCurrency(invoice.paid_amount)} de ${formatCurrency(invoice.total_amount)}`
                  : 'Pendiente de pago'
                }
              </p>
            </div>
            {invoice.status === 'paid' ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : invoice.paid_amount > 0 ? (
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            ) : (
              <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Factura {invoice.number}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge color={statusConfig.color} variant="subtle">
                {statusConfig.label}
              </Badge>
              <Badge color={typeConfig.color} variant="subtle">
                {typeConfig.label}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {invoice.status === 'draft' && (
            <Button
              variant="outline"
              onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
              className="flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="flex items-center gap-2"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            Duplicar
          </Button>
          
          {availableActions.map(({ action, label, color, icon: Icon }) => (
            <Button
              key={action}
              onClick={() => handleWorkflowAction(action)}
              disabled={saving}
              className={`flex items-center gap-2 bg-${color}-600 hover:bg-${color}-700`}
            >
              <Icon className="h-4 w-4" />
              {saving ? 'Procesando...' : label}
            </Button>
          ))}
          
          {invoice.status !== 'cancelled' && (
            <Button
              variant="outline"
              onClick={() => handleWorkflowAction('cancel')}
              disabled={saving}
              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              <XCircleIcon className="h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Card>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('lines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Líneas ({invoice.lines.length})
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accounting'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contabilidad
              {invoice.journal_entry_id && (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Auditoría
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'lines' && renderLinesTab()}
          {activeTab === 'accounting' && renderAccountingTab()}
          {activeTab === 'audit' && renderAuditTab()}
        </div>
      </Card>
    </div>
  );
}
