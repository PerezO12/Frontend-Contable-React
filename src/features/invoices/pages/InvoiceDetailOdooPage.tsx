/**
 * Página de detalle de factura mejorada con flujo Odoo
 * Incluye workflow status, payment schedule preview y journal entry info
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceAPI } from '../api/invoiceAPI';
import { type InvoiceWithLines } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/shared/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

// Componentes específicos del flujo Odoo
import { InvoiceWorkflowStatus } from '../components/InvoiceWorkflowStatus';
import { PaymentSchedulePreview } from '../components/PaymentSchedulePreview';

export function InvoiceDetailOdooPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [invoice, setInvoice] = useState<InvoiceWithLines | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await InvoiceAPI.getInvoiceWithLines(id);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la factura');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowAction = async (action: 'post' | 'cancel' | 'reset_to_draft') => {
    if (!invoice) return;
    
    try {
      setActionLoading(true);
      let updatedInvoice;
      
      switch (action) {
        case 'post':
          updatedInvoice = await InvoiceAPI.postInvoice(invoice.id);
          showToast('Factura contabilizada exitosamente', 'success');
          break;
        case 'cancel':
          updatedInvoice = await InvoiceAPI.cancelInvoice(invoice.id, {
            reason: 'Cancelación manual desde interfaz'
          });
          showToast('Factura cancelada exitosamente', 'success');
          break;
        case 'reset_to_draft':
          updatedInvoice = await InvoiceAPI.resetToDraft(invoice.id);
          showToast('Factura restablecida a borrador', 'success');
          break;
      }
      
      setInvoice({ ...invoice, ...updatedInvoice });
    } catch (err: any) {
      showToast(err.message || 'Error al ejecutar la acción', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    if (invoice && invoice.status === 'DRAFT') {
      navigate(`/invoices/${invoice.id}/edit`);
    }
  };

  const handleDuplicate = async () => {
    if (!invoice) return;
    
    try {
      const duplicated = await InvoiceAPI.duplicateInvoice(invoice.id);
      showToast('Factura duplicada exitosamente', 'success');
      navigate(`/invoices/${duplicated.id}/edit`);
    } catch (err: any) {
      showToast(err.message || 'Error al duplicar la factura', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          ⚠️ Error al cargar la factura
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate('/invoices')} variant="outline">
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Factura {invoice.invoice_number}
          </h1>
          <p className="text-gray-600">
            {formatDate(invoice.invoice_date)} • {formatCurrency(invoice.total_amount)}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
          >
            Volver
          </Button>
          
          {invoice.status === 'DRAFT' && (
            <Button
              variant="secondary"
              onClick={handleEdit}
            >
              Editar
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleDuplicate}
          >
            Duplicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Status */}
          <Card className="p-6">
            <InvoiceWorkflowStatus
              status={invoice.status}
              onPost={() => handleWorkflowAction('post')}
              onCancel={() => handleWorkflowAction('cancel')}
              onResetToDraft={() => handleWorkflowAction('reset_to_draft')}
              isLoading={actionLoading}
            />
          </Card>

          {/* Información básica */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Información General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Factura
                </label>
                <p className="text-gray-900">{invoice.invoice_type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Factura
                </label>
                <p className="text-gray-900">{formatDate(invoice.invoice_date)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento
                </label>
                <p className="text-gray-900">
                  {invoice.due_date ? formatDate(invoice.due_date) : 'No definida'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <p className="text-gray-900">{invoice.currency_code || 'USD'}</p>
              </div>
            </div>
            
            {invoice.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <p className="text-gray-900">{invoice.description}</p>
              </div>
            )}
          </Card>

          {/* Líneas de factura */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Líneas de Factura</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descuento
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {line.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right">
                        {line.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right">
                        {formatCurrency(line.unit_price)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right">
                        {line.discount_percentage ? `${line.discount_percentage}%` : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(line.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Información del asiento contable */}
          {invoice.status === 'POSTED' && invoice.journal_entry && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Asiento Contable</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Asiento
                    </label>
                    <p className="text-gray-900 font-mono">{invoice.journal_entry.number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <p className="text-gray-900">{formatDate(invoice.journal_entry.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Líneas
                    </label>
                    <p className="text-gray-900">{invoice.journal_entry.lines_count} líneas</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <p className="text-gray-900">{invoice.journal_entry.state}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Columna derecha - Información adicional */}
        <div className="space-y-6">
          {/* Totales */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Totales</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(invoice.discount_amount)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Vista previa de vencimientos */}
          {invoice.payment_terms_id && (
            <PaymentSchedulePreview
              invoiceId={invoice.id}
              invoiceAmount={invoice.total_amount}
              paymentTermsId={invoice.payment_terms_id}
              invoiceDate={invoice.invoice_date}
            />
          )}

          {/* Estado de pagos */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Estado de Pagos</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pagado:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(invoice.paid_amount)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Pendiente:</span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(invoice.outstanding_amount)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
