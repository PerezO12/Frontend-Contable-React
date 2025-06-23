/**
 * Página de creación de facturas
 * Implementa el PASO 2 del flujo Odoo: Crear factura borrador
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useThirdPartiesForInvoices } from '../hooks/useThirdPartiesForInvoices';
import { InvoiceType, type InvoiceCreateData, type InvoiceLine } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/shared/contexts/ToastContext';
import { PlusIcon, TrashIcon } from '@/shared/components/icons';

export function InvoiceCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createInvoice, saving } = useInvoiceStore();
  const { options: thirdPartyOptions, loading: loadingThirdParties } = useThirdPartiesForInvoices();

  const [formData, setFormData] = useState<InvoiceCreateData>({
    invoice_type: InvoiceType.CUSTOMER_INVOICE,
    third_party_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
    lines: []
  });

  const [newLine, setNewLine] = useState<Omit<InvoiceLine, 'id' | 'line_number'>>({
    description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 21,
    line_total: 0
  });

  // Calcular totales automáticamente
  useEffect(() => {
    const subtotal = formData.lines.reduce((sum, line) => sum + line.line_total, 0);
    const tax_amount = formData.lines.reduce((sum, line) => 
      sum + (line.line_total * (line.tax_rate / 100)), 0
    );
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount,
      total_amount: subtotal + tax_amount
    }));
  }, [formData.lines]);

  // Calcular total de línea automáticamente
  useEffect(() => {
    const lineTotal = newLine.quantity * newLine.unit_price;
    setNewLine(prev => ({ ...prev, line_total: lineTotal }));
  }, [newLine.quantity, newLine.unit_price]);

  const handleInputChange = (field: keyof InvoiceCreateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { ...newLine }]
    }));

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
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.third_party_id) {
      showToast('Debe seleccionar un cliente/proveedor', 'error');
      return;
    }

    if (formData.lines.length === 0) {
      showToast('Debe agregar al menos una línea a la factura', 'error');
      return;
    }

    try {
      const invoice = await createInvoice(formData);
      showToast('Factura creada exitosamente', 'success');
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      showToast('Error al crear la factura', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
          <p className="text-gray-600 mt-1">
            Paso 2 del flujo Odoo: Crear factura en estado borrador
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? 'Guardando...' : 'Crear Factura'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información general */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información General
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              placeholder="Tipo de factura"
              value={formData.invoice_type}
              onChange={(value) => handleInputChange('invoice_type', value)}
              options={[
                { value: InvoiceType.CUSTOMER_INVOICE, label: 'Factura de Venta' },
                { value: InvoiceType.SUPPLIER_INVOICE, label: 'Factura de Compra' },
                { value: InvoiceType.CREDIT_NOTE, label: 'Nota de Crédito' },
                { value: InvoiceType.DEBIT_NOTE, label: 'Nota de Débito' }
              ]}
            />            <Select
              placeholder="Seleccionar cliente/proveedor"
              value={formData.third_party_id}
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
          {formData.lines.length > 0 && (
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
        {formData.lines.length > 0 && (
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
