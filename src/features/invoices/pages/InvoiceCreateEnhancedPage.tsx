/**
 * Página de creación de facturas mejorada con flujo Odoo
 * Incluye vista previa de payment schedule y validación de payment terms
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
import { formatCurrency } from '@/shared/utils/formatters';

// Importar componentes de búsqueda existentes
import { CustomerSearch } from '../components/CustomerSearch';
import { ProductSearch } from '../components/ProductSearch';
import { PaymentTermsSearch } from '../components/PaymentTermsSearch';

// Nuevos componentes del flujo Odoo
import { PaymentSchedulePreview } from '../components/PaymentSchedulePreview';

interface InvoiceCreateFormData extends InvoiceFormData {}

export function InvoiceCreateEnhancedPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [paymentTermsValid, setPaymentTermsValid] = useState(true);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

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
  const watchedPaymentTermsId = form.watch('payment_terms_id');
  const watchedTotal = form.watch('calculated_total');

  // Calcular totales automáticamente cuando cambien las líneas
  useEffect(() => {
    calculateTotals();
  }, [watchedLines]);

  // Validar payment terms cuando cambie
  useEffect(() => {
    if (watchedPaymentTermsId) {
      validatePaymentTerms();
    }
  }, [watchedPaymentTermsId]);

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

  const validatePaymentTerms = async () => {
    if (!watchedPaymentTermsId) return;
    
    try {
      const validation = await InvoiceAPI.validatePaymentTerms(watchedPaymentTermsId);
      setPaymentTermsValid(validation.is_valid);
      
      if (!validation.is_valid) {
        showToast(
          `Términos de pago inválidos: ${validation.errors.join(', ')}`, 
          'warning'
        );
      }
    } catch (error) {
      console.error('Error validating payment terms:', error);
      setPaymentTermsValid(false);
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

  const onThirdPartySelect = (thirdParty: any) => {
    form.setValue('third_party_id', thirdParty.id);
    form.setValue('third_party_name', thirdParty.name);
    
    // Establecer cuenta por defecto del tercero si está disponible
    if (thirdParty.default_account_id) {
      form.setValue('third_party_account_id', thirdParty.default_account_id);
    }
  };

  const onPaymentTermsSelect = (paymentTerms: any) => {
    form.setValue('payment_terms_id', paymentTerms.id);
    form.setValue('payment_terms_name', paymentTerms.name);
    setShowPaymentPreview(true);
  };

  const onSubmit = async (data: InvoiceCreateFormData) => {
    try {
      setSaving(true);

      // Validar que payment terms sea válido
      if (data.payment_terms_id && !paymentTermsValid) {
        showToast('Los términos de pago seleccionados no son válidos', 'error');
        return;
      }

      // Preparar datos para envío
      const invoiceData: InvoiceCreateWithLines = {
        invoice_type: data.invoice_type,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        currency_code: data.currency_code,
        exchange_rate: data.exchange_rate,
        third_party_id: data.third_party_id,
        payment_terms_id: data.payment_terms_id,
        description: data.description,
        notes: data.notes,
        lines: data.lines.map((line, index) => ({
          sequence: index + 1,
          product_id: line.product_id,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percentage: line.discount_percentage,
          account_id: line.account_id,
          cost_center_id: line.cost_center_id,
          tax_ids: line.tax_ids
        }))
      };

      const createdInvoice = await InvoiceAPI.createInvoiceWithLines(invoiceData);
      
      showToast('Factura creada exitosamente', 'success');
      navigate(`/invoices/${createdInvoice.id}`);
      
    } catch (error: any) {
      showToast(error.message || 'Error al crear la factura', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onSaveDraft = async () => {
    // Simplemente enviar sin validaciones estrictas para guardar como borrador
    await onSubmit(form.getValues());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nueva Factura
          </h1>
          <p className="text-gray-600">
            Crear factura siguiendo el flujo Odoo
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
          >
            Cancelar
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Información General</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice_type">Tipo de Factura</Label>
                  <select
                    {...form.register('invoice_type')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Factura de Cliente</option>
                    <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Factura de Proveedor</option>
                    <option value={InvoiceTypeEnum.CREDIT_NOTE}>Nota de Crédito</option>
                    <option value={InvoiceTypeEnum.DEBIT_NOTE}>Nota de Débito</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="invoice_date">Fecha de Factura</Label>
                  <Input
                    type="date"
                    {...form.register('invoice_date')}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                  <Input
                    type="date"
                    {...form.register('due_date')}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency_code">Moneda</Label>
                  <select
                    {...form.register('currency_code')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="third_party_id">
                    {watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'Cliente' : 'Proveedor'}
                  </Label>                  <CustomerSearch
                    onSelect={onThirdPartySelect}
                    filterByType={watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'customer' : 'supplier'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment_terms_id">Términos de Pago</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <PaymentTermsSearch
                        onSelect={onPaymentTermsSelect}
                      />
                    </div>
                    {watchedPaymentTermsId && !paymentTermsValid && (
                      <span className="text-red-600 text-sm">⚠️ Inválido</span>
                    )}
                    {watchedPaymentTermsId && paymentTermsValid && (
                      <span className="text-green-600 text-sm">✅ Válido</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    {...form.register('description')}
                    placeholder="Descripción general de la factura..."
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Líneas de factura */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Líneas de Factura</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLine}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Línea
                </Button>
              </div>
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Línea {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLine(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Producto</Label>
                        <ProductSearch
                          onSelect={(product) => onProductSelect(index, product)}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor={`lines.${index}.description`}>Descripción</Label>
                        <Textarea
                          {...form.register(`lines.${index}.description`)}
                          placeholder="Descripción del producto o servicio..."
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`lines.${index}.quantity`}>Cantidad</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register(`lines.${index}.quantity`, { 
                            valueAsNumber: true 
                          })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`lines.${index}.unit_price`}>Precio Unitario</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register(`lines.${index}.unit_price`, { 
                            valueAsNumber: true 
                          })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`lines.${index}.discount_percentage`}>Descuento (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register(`lines.${index}.discount_percentage`, { 
                            valueAsNumber: true 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Columna derecha - Totales y vista previa */}
          <div className="space-y-6">
            {/* Totales */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Totales</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={calculateTotals}
                  disabled={calculating}
                >
                  <CalculatorIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(form.watch('calculated_subtotal') || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-medium">
                    {formatCurrency(form.watch('calculated_tax_amount') || 0)}
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(watchedTotal || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Vista previa de vencimientos */}
            {showPaymentPreview && watchedPaymentTermsId && (
              <PaymentSchedulePreview
                invoiceAmount={watchedTotal}
                paymentTermsId={watchedPaymentTermsId}
                invoiceDate={form.watch('invoice_date')}
              />
            )}

            {/* Acciones */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={saving}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Crear Factura'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onSaveDraft}
                  disabled={saving}
                >
                  Guardar como Borrador
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  💡 La factura se creará en estado DRAFT y podrás editarla antes de contabilizar
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
