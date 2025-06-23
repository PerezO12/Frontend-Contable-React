/**
 * Página de edición de facturas
 * Permite editar facturas en estado borrador
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useThirdPartiesForInvoices } from '../hooks/useThirdPartiesForInvoices';
import { InvoiceType, InvoiceStatus, type InvoiceUpdateData, type InvoiceLine } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import { PlusIcon, TrashIcon } from '@/shared/components/icons';

export function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    currentInvoice, 
    loading, 
    saving, 
    fetchInvoice, 
    updateInvoice 
  } = useInvoiceStore();
  const { options: thirdPartyOptions, loading: loadingThirdParties } = useThirdPartiesForInvoices();

  const [formData, setFormData] = useState<InvoiceUpdateData | null>(null);
  const [newLine, setNewLine] = useState<Omit<InvoiceLine, 'id' | 'line_number'>>({
    description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 21,
    line_total: 0
  });

  // Cargar factura al montar el componente
  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id, fetchInvoice]);

  // Inicializar formulario con datos de la factura
  useEffect(() => {
    if (currentInvoice) {
      // Solo permitir edición de facturas en borrador
      if (currentInvoice.status !== InvoiceStatus.DRAFT) {
        showToast('Solo se pueden editar facturas en estado borrador', 'error');
        navigate(`/invoices/${id}`);
        return;
      }

      setFormData({
        id: currentInvoice.id!,
        invoice_type: currentInvoice.invoice_type,
        third_party_id: currentInvoice.third_party_id,
        invoice_date: currentInvoice.invoice_date,
        due_date: currentInvoice.due_date,
        payment_terms_id: currentInvoice.payment_terms_id,
        description: currentInvoice.description,
        notes: currentInvoice.notes,
        lines: currentInvoice.lines
      });
    }
  }, [currentInvoice, id, navigate, showToast]);

  // Calcular totales automáticamente
  useEffect(() => {
    if (formData?.lines) {
      const subtotal = formData.lines.reduce((sum, line) => sum + line.line_total, 0);
      const tax_amount = formData.lines.reduce((sum, line) => 
        sum + (line.line_total * (line.tax_rate / 100)), 0
      );
      
      setFormData(prev => prev ? ({
        ...prev,
        subtotal,
        tax_amount,
        total_amount: subtotal + tax_amount
      }) : null);
    }
  }, [formData?.lines]);

  // Calcular total de línea automáticamente
  useEffect(() => {
    const lineTotal = newLine.quantity * newLine.unit_price;
    setNewLine(prev => ({ ...prev, line_total: lineTotal }));
  }, [newLine.quantity, newLine.unit_price]);

  const handleInputChange = (field: keyof InvoiceUpdateData, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleLineChange = (field: keyof typeof newLine, value: any) => {
    setNewLine(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLine = () => {
    if (!newLine.description.trim()) {
      showToast('La descripción de la línea es requerida', 'error');
      return;
    }

    setFormData(prev => prev ? ({
      ...prev,
      lines: [...(prev.lines || []), { ...newLine }]
    }) : null);

    // Reset new line
    setNewLine({
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 21,
      line_total: 0
    });
  };

  const removeLine = (index: number) => {
    setFormData(prev => prev ? ({
      ...prev,
      lines: prev.lines?.filter((_, i) => i !== index) || []
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    if (!formData.third_party_id) {
      showToast('Debe seleccionar un cliente/proveedor', 'error');
      return;
    }

    if (!formData.lines || formData.lines.length === 0) {
      showToast('Debe agregar al menos una línea a la factura', 'error');
      return;
    }

    try {
      await updateInvoice(formData);
      showToast('Factura actualizada exitosamente', 'success');
      navigate(`/invoices/${id}`);
    } catch (error) {
      showToast('Error al actualizar la factura', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Factura no encontrada</p>
        <Button
          variant="outline"
          onClick={() => navigate('/invoices')}
          className="mt-4"
        >
          Volver al Listado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Factura {currentInvoice?.number || ''}
          </h1>
          <p className="text-gray-600 mt-1">
            Modificar factura en estado borrador
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}`)}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información general */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información General
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <Select
              placeholder="Tipo de factura"
              value={formData.invoice_type || ''}
              onChange={(value) => handleInputChange('invoice_type', value)}
              options={[
                { value: InvoiceType.CUSTOMER_INVOICE, label: 'Factura de Venta' },
                { value: InvoiceType.SUPPLIER_INVOICE, label: 'Factura de Compra' },
                { value: InvoiceType.CREDIT_NOTE, label: 'Nota de Crédito' },
                { value: InvoiceType.DEBIT_NOTE, label: 'Nota de Débito' }
              ]}
            />            <Select
              placeholder="Seleccionar cliente/proveedor"
              value={formData.third_party_id || ''}
              onChange={(value) => handleInputChange('third_party_id', value)}
              options={thirdPartyOptions}
              disabled={loadingThirdParties}
            />

            <Input
              label="Fecha de factura"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => handleInputChange('invoice_date', e.target.value)}
              required
            />

            <Input
              label="Fecha de vencimiento"
              type="date"
              value={formData.due_date || ''}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción de la factura..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Líneas de factura */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Líneas de Factura
          </h2>

          {/* Líneas existentes */}
          {formData.lines && formData.lines.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      IVA %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.lines.map((line, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {line.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {line.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        ${line.unit_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {line.tax_rate}%
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        ${line.line_total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLine(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Nueva línea */}
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Agregar Nueva Línea
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Descripción del producto/servicio"
                  value={newLine.description}
                  onChange={(e) => handleLineChange('description', e.target.value)}
                />
              </div>
              
              <Input
                type="number"
                placeholder="Cantidad"
                min="0"
                step="0.01"
                value={newLine.quantity}
                onChange={(e) => handleLineChange('quantity', parseFloat(e.target.value) || 0)}
              />
              
              <Input
                type="number"
                placeholder="Precio unitario"
                min="0"
                step="0.01"
                value={newLine.unit_price}
                onChange={(e) => handleLineChange('unit_price', parseFloat(e.target.value) || 0)}
              />
              
              <Input
                type="number"
                placeholder="IVA %"
                min="0"
                max="100"
                step="0.01"
                value={newLine.tax_rate}
                onChange={(e) => handleLineChange('tax_rate', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Total línea: <span className="font-medium">${newLine.line_total.toFixed(2)}</span>
              </div>
              
              <Button
                type="button"
                onClick={addLine}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Agregar Línea
              </Button>
            </div>
          </div>
        </Card>

        {/* Totales */}
        {formData.lines && formData.lines.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Totales
            </h2>
            
            <div className="space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${(formData.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA:</span>
                <span className="font-medium">${(formData.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${(formData.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Notas adicionales */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notas Adicionales
          </h2>
          
          <Textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Notas internas, términos y condiciones..."
            rows={4}
          />
        </Card>
      </form>
    </div>
  );
}
