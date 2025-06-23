/**
 * Página de creación de facturas siguiendo IMPLEMENTAR.md
 * Implementa el PASO 2 del flujo Odoo: Crear factura completa con líneas
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { InvoiceAPI } from '../api/invoiceAPI';
import { 
  type InvoiceCreateWithLines, 
  InvoiceTypeEnum, 
  type InvoiceFormData
} from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/shared/contexts/ToastContext';
import { PlusIcon, TrashIcon, SaveIcon, CalculatorIcon } from '@/shared/components/icons';

// Importar componentes de búsqueda existentes
import { CustomerSearch } from '../components/CustomerSearch';
import { ProductSearch } from '../components/ProductSearch';
import { PaymentTermsSearch } from '../components/PaymentTermsSearch';

interface InvoiceCreateFormData extends InvoiceFormData {}

export function InvoiceCreateOdooPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const form = useForm<InvoiceCreateFormData>({
    defaultValues: {
      invoice_type: InvoiceTypeEnum.CUSTOMER_INVOICE,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: '',
      currency_code: 'USD',
      exchange_rate: 1,
      third_party_id: '',
      payment_terms_id: '',
      description: '',
      notes: '',
      lines: [
        {
          sequence: 1,
          description: '',
          quantity: 1,
          unit_price: 0,
          discount_percentage: 0,
          tax_ids: []
        }
      ],
      calculated_subtotal: 0,
      calculated_tax_amount: 0,
      calculated_total: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines'
  });

  const watchedLines = form.watch('lines');
  const watchedInvoiceType = form.watch('invoice_type');

  // Calcular totales automáticamente cuando cambien las líneas
  useEffect(() => {
    calculateTotals();
  }, [watchedLines]);

  const calculateTotals = async () => {
    try {
      setCalculating(true);
      
      // Calcular localmente por ahora (en el futuro usar API)
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      watchedLines.forEach((line) => {
        const lineSubtotal = (line.quantity || 0) * (line.unit_price || 0);
        const lineDiscount = lineSubtotal * ((line.discount_percentage || 0) / 100);
        const lineNet = lineSubtotal - lineDiscount;
        
        // Por ahora asumimos 21% de IVA si hay tax_ids
        const lineTax = line.tax_ids && line.tax_ids.length > 0 ? lineNet * 0.21 : 0;

        subtotal += lineSubtotal;
        discountAmount += lineDiscount;
        taxAmount += lineTax;
      });

      const total = subtotal - discountAmount + taxAmount;

      form.setValue('calculated_subtotal', subtotal);
      form.setValue('calculated_tax_amount', taxAmount);
      form.setValue('calculated_total', total);

    } catch (error) {
      console.error('Error calculating totals:', error);
    } finally {
      setCalculating(false);
    }
  };
  const addLine = () => {
    const newSequence = Math.max(...watchedLines.map((l: any) => l.sequence || 0), 0) + 1;
    append({
      sequence: newSequence,
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      tax_ids: []
    });
  };

  const removeLine = (index: number) => {
    if (watchedLines.length > 1) {
      remove(index);
    }
  };
  const onProductSelect = (index: number, product: any) => {
    form.setValue(`lines.${index}.product_id`, product.id);
    form.setValue(`lines.${index}.description`, product.name);
    form.setValue(`lines.${index}.unit_price`, 
      watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? product.sale_price : product.purchase_price
    );
    
    // Establecer cuenta contable por defecto del producto
    if (product.income_account_id && watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE) {
      form.setValue(`lines.${index}.account_id`, product.income_account_id);
    } else if (product.expense_account_id && watchedInvoiceType === InvoiceTypeEnum.SUPPLIER_INVOICE) {
      form.setValue(`lines.${index}.account_id`, product.expense_account_id);
    }

    // Establecer impuestos por defecto del producto
    if (product.tax_ids) {
      form.setValue(`lines.${index}.tax_ids`, product.tax_ids);
    }

    calculateTotals();
  };
  const onThirdPartySelect = (thirdParty: { id: string; name: string; code?: string; document_number?: string; third_party_type?: string; default_account_id?: string }) => {
    form.setValue('third_party_id', thirdParty.id);
    form.setValue('third_party_name', thirdParty.name);
    
    // Establecer cuenta por defecto del tercero si existe
    if (thirdParty.default_account_id) {
      form.setValue('third_party_account_id', thirdParty.default_account_id);
    }
  };

  const onPaymentTermsSelect = (paymentTerms: { id: string; name: string; code?: string; days: number }) => {
    form.setValue('payment_terms_id', paymentTerms.id);
    form.setValue('payment_terms_name', paymentTerms.name);
    
    // Calcular fecha de vencimiento automáticamente
    const invoiceDate = new Date(form.getValues('invoice_date'));
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms.days);
    form.setValue('due_date', dueDate.toISOString().split('T')[0]);
  };

  const onSubmit = async (data: InvoiceCreateFormData) => {
    try {
      setSaving(true);

      // Preparar datos según esquema IMPLEMENTAR.md
      const invoiceData: InvoiceCreateWithLines = {
        invoice_type: data.invoice_type,
        invoice_date: data.invoice_date,
        due_date: data.due_date || undefined,
        currency_code: data.currency_code || 'USD',
        exchange_rate: data.exchange_rate || 1,
        description: data.description || undefined,
        notes: data.notes || undefined,
        third_party_id: data.third_party_id,
        payment_terms_id: data.payment_terms_id || undefined,
        third_party_account_id: data.third_party_account_id || undefined,
        invoice_number: data.invoice_number || undefined,
        journal_id: data.journal_id || undefined,
        lines: data.lines.map(line => ({
          sequence: line.sequence,
          product_id: line.product_id || undefined,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percentage: line.discount_percentage || 0,
          account_id: line.account_id || undefined,
          cost_center_id: line.cost_center_id || undefined,
          tax_ids: line.tax_ids || []
        }))
      };

      const result = await InvoiceAPI.createInvoiceWithLines(invoiceData);
      
      showToast('Factura creada exitosamente en estado DRAFT', 'success');
      navigate(`/invoices/${result.id}`);

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      showToast(
        error.response?.data?.message || 'Error al crear la factura',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nueva Factura - Patrón Odoo
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Crear factura completa con líneas (estado DRAFT)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving || !form.formState.isValid}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4" />
                Crear Factura
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">            {/* Tipo de Factura */}
            <div>
              <Label htmlFor="invoice_type">Tipo de Factura *</Label>
              <select
                {...form.register('invoice_type', { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >                <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Factura de Venta</option>
                <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Factura de Compra</option>
              </select>
            </div>

            {/* Fecha de Factura */}
            <div>
              <Label htmlFor="invoice_date">Fecha de Factura *</Label>
              <Input
                type="date"
                {...form.register('invoice_date', { required: true })}
              />
            </div>

            {/* Fecha de Vencimiento */}
            <div>
              <Label htmlFor="due_date">Fecha de Vencimiento</Label>
              <Input
                type="date"
                {...form.register('due_date')}
              />
            </div>

            {/* Número de Factura */}
            <div>
              <Label htmlFor="invoice_number">Número de Factura</Label>
              <Input
                {...form.register('invoice_number')}
                placeholder="Auto-generado si se deja vacío"
              />
            </div>            {/* Moneda */}
            <div>
              <Label htmlFor="currency_code">Moneda</Label>
              <select
                {...form.register('currency_code')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="ARS">ARS - Peso Argentino</option>
              </select>
            </div>

            {/* Tasa de Cambio */}
            <div>
              <Label htmlFor="exchange_rate">Tasa de Cambio</Label>
              <Input
                type="number"
                step="0.0001"
                {...form.register('exchange_rate', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Tercero */}
          <div className="mt-4">
            <Label>
              {watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'Cliente' : 'Proveedor'} *
            </Label>
            <CustomerSearch
              onSelect={onThirdPartySelect}              placeholder={`Buscar ${watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'cliente' : 'proveedor'}...`}
              filterByType={watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'customer' : 'supplier'}
            />
            {form.formState.errors.third_party_id && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
            )}
          </div>

          {/* Términos de Pago */}
          <div className="mt-4">
            <Label>Términos de Pago</Label>
            <PaymentTermsSearch
              onSelect={onPaymentTermsSelect}
              placeholder="Buscar términos de pago..."
            />
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <Label htmlFor="description">Descripción</Label>
            <Input
              {...form.register('description')}
              placeholder="Descripción de la factura"
            />
          </div>

          {/* Notas */}
          <div className="mt-4">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              {...form.register('notes')}
              placeholder="Notas adicionales"
              rows={3}
            />
          </div>
        </Card>

        {/* Lines */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Líneas de Factura</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLine}
              className="flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Agregar Línea
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Línea {index + 1}</h3>
                  {fields.length > 1 && (                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeLine(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Producto */}
                  <div className="lg:col-span-2">
                    <Label>Producto</Label>                    <ProductSearch
                      onSelect={(product: any) => onProductSelect(index, product)}
                      placeholder="Buscar producto..."
                    />
                  </div>

                  {/* Cantidad */}
                  <div>
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.quantity`, { 
                        required: true, 
                        valueAsNumber: true,
                        min: 0.01
                      })}
                    />
                  </div>

                  {/* Precio Unitario */}
                  <div>
                    <Label>Precio Unitario *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.unit_price`, { 
                        required: true, 
                        valueAsNumber: true,
                        min: 0
                      })}
                    />
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-2">
                    <Label>Descripción *</Label>
                    <Input
                      {...form.register(`lines.${index}.description`, { required: true })}
                      placeholder="Descripción de la línea"
                    />
                  </div>

                  {/* Descuento */}
                  <div>
                    <Label>Descuento (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...form.register(`lines.${index}.discount_percentage`, { 
                        valueAsNumber: true 
                      })}
                    />
                  </div>

                  {/* Subtotal calculado */}
                  <div>
                    <Label>Subtotal</Label>
                    <div className="text-lg font-semibold text-gray-900 py-2">
                      ${(
                        ((form.watch(`lines.${index}.quantity`) || 0) * 
                         (form.watch(`lines.${index}.unit_price`) || 0)) *
                        (1 - ((form.watch(`lines.${index}.discount_percentage`) || 0) / 100))
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Totals */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5" />
            Totales
            {calculating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-xl font-semibold">
                ${form.watch('calculated_subtotal')?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Impuestos</div>
              <div className="text-xl font-semibold">
                ${form.watch('calculated_tax_amount')?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-blue-600">
                ${form.watch('calculated_total')?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
