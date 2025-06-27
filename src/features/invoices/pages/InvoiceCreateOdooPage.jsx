var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Página de creación de facturas siguiendo IMPLEMENTAR.md
 * Implementa el PASO 2 del flujo Odoo: Crear factura completa con líneas
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { InvoiceAPI } from '../api/invoiceAPI';
import { InvoiceTypeEnum } from '../types';
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
export function InvoiceCreateOdooPage() {
    var _this = this;
    var _a, _b, _c;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _d = useState(false), saving = _d[0], setSaving = _d[1];
    var _e = useState(false), calculating = _e[0], setCalculating = _e[1];
    var form = useForm({
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
    var _f = useFieldArray({
        control: form.control,
        name: 'lines'
    }), fields = _f.fields, append = _f.append, remove = _f.remove;
    var watchedLines = form.watch('lines');
    var watchedInvoiceType = form.watch('invoice_type');
    // Calcular totales automáticamente cuando cambien las líneas
    useEffect(function () {
        calculateTotals();
    }, [watchedLines]);
    var calculateTotals = function () { return __awaiter(_this, void 0, void 0, function () {
        var subtotal_1, taxAmount_1, discountAmount_1, total;
        return __generator(this, function (_a) {
            try {
                setCalculating(true);
                subtotal_1 = 0;
                taxAmount_1 = 0;
                discountAmount_1 = 0;
                watchedLines.forEach(function (line) {
                    var lineSubtotal = (line.quantity || 0) * (line.unit_price || 0);
                    var lineDiscount = lineSubtotal * ((line.discount_percentage || 0) / 100);
                    var lineNet = lineSubtotal - lineDiscount;
                    // Por ahora asumimos 21% de IVA si hay tax_ids
                    var lineTax = line.tax_ids && line.tax_ids.length > 0 ? lineNet * 0.21 : 0;
                    subtotal_1 += lineSubtotal;
                    discountAmount_1 += lineDiscount;
                    taxAmount_1 += lineTax;
                });
                total = subtotal_1 - discountAmount_1 + taxAmount_1;
                form.setValue('calculated_subtotal', subtotal_1);
                form.setValue('calculated_tax_amount', taxAmount_1);
                form.setValue('calculated_total', total);
            }
            catch (error) {
                console.error('Error calculating totals:', error);
            }
            finally {
                setCalculating(false);
            }
            return [2 /*return*/];
        });
    }); };
    var addLine = function () {
        var newSequence = Math.max.apply(Math, __spreadArray(__spreadArray([], watchedLines.map(function (l) { return l.sequence || 0; }), false), [0], false)) + 1;
        append({
            sequence: newSequence,
            description: '',
            quantity: 1,
            unit_price: 0,
            discount_percentage: 0,
            tax_ids: []
        });
    };
    var removeLine = function (index) {
        if (watchedLines.length > 1) {
            remove(index);
        }
    };
    var onProductSelect = function (index, product) {
        form.setValue("lines.".concat(index, ".product_id"), product.id);
        form.setValue("lines.".concat(index, ".description"), product.name);
        form.setValue("lines.".concat(index, ".unit_price"), watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? product.sale_price : product.purchase_price);
        // Establecer cuenta contable por defecto del producto
        if (product.income_account_id && watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE) {
            form.setValue("lines.".concat(index, ".account_id"), product.income_account_id);
        }
        else if (product.expense_account_id && watchedInvoiceType === InvoiceTypeEnum.SUPPLIER_INVOICE) {
            form.setValue("lines.".concat(index, ".account_id"), product.expense_account_id);
        }
        // Establecer impuestos por defecto del producto
        if (product.tax_ids) {
            form.setValue("lines.".concat(index, ".tax_ids"), product.tax_ids);
        }
        calculateTotals();
    };
    var onThirdPartySelect = function (thirdParty) {
        form.setValue('third_party_id', thirdParty.id);
        form.setValue('third_party_name', thirdParty.name);
        // Establecer cuenta por defecto del tercero si existe
        if (thirdParty.default_account_id) {
            form.setValue('third_party_account_id', thirdParty.default_account_id);
        }
    };
    var onPaymentTermsSelect = function (paymentTerms) {
        form.setValue('payment_terms_id', paymentTerms.id);
        form.setValue('payment_terms_name', paymentTerms.name);
        // Calcular fecha de vencimiento automáticamente
        var invoiceDate = new Date(form.getValues('invoice_date'));
        var dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + paymentTerms.days);
        form.setValue('due_date', dueDate.toISOString().split('T')[0]);
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var invoiceData, result, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    setSaving(true);
                    invoiceData = {
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
                        lines: data.lines.map(function (line) { return ({
                            sequence: line.sequence,
                            product_id: line.product_id || undefined,
                            description: line.description,
                            quantity: line.quantity,
                            unit_price: line.unit_price,
                            discount_percentage: line.discount_percentage || 0,
                            account_id: line.account_id || undefined,
                            cost_center_id: line.cost_center_id || undefined,
                            tax_ids: line.tax_ids || []
                        }); })
                    };
                    return [4 /*yield*/, InvoiceAPI.createInvoiceWithLines(invoiceData)];
                case 1:
                    result = _c.sent();
                    showToast('Factura creada exitosamente en estado DRAFT', 'success');
                    navigate("/invoices/".concat(result.id));
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _c.sent();
                    console.error('Error creating invoice:', error_1);
                    showToast(((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error al crear la factura', 'error');
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6">
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
          <Button variant="outline" onClick={function () { return navigate('/invoices'); }} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={saving || !form.formState.isValid} className="flex items-center gap-2">
            {saving ? (<>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>) : (<>
                <SaveIcon className="w-4 h-4"/>
                Crear Factura
              </>)}
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
              <select {...form.register('invoice_type', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">                <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Factura de Venta</option>
                <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Factura de Compra</option>
              </select>
            </div>

            {/* Fecha de Factura */}
            <div>
              <Label htmlFor="invoice_date">Fecha de Factura *</Label>
              <Input type="date" {...form.register('invoice_date', { required: true })}/>
            </div>

            {/* Fecha de Vencimiento */}
            <div>
              <Label htmlFor="due_date">Fecha de Vencimiento</Label>
              <Input type="date" {...form.register('due_date')}/>
            </div>

            {/* Número de Factura */}
            <div>
              <Label htmlFor="invoice_number">Número de Factura</Label>
              <Input {...form.register('invoice_number')} placeholder="Auto-generado si se deja vacío"/>
            </div>            {/* Moneda */}
            <div>
              <Label htmlFor="currency_code">Moneda</Label>
              <select {...form.register('currency_code')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="ARS">ARS - Peso Argentino</option>
              </select>
            </div>

            {/* Tasa de Cambio */}
            <div>
              <Label htmlFor="exchange_rate">Tasa de Cambio</Label>
              <Input type="number" step="0.0001" {...form.register('exchange_rate', { valueAsNumber: true })}/>
            </div>
          </div>

          {/* Tercero */}
          <div className="mt-4">
            <Label>
              {watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'Cliente' : 'Proveedor'} *
            </Label>
            <CustomerSearch onSelect={onThirdPartySelect} placeholder={"Buscar ".concat(watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'cliente' : 'proveedor', "...")} filterByType={watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'customer' : 'supplier'}/>
            {form.formState.errors.third_party_id && (<p className="text-red-500 text-sm mt-1">Este campo es requerido</p>)}
          </div>

          {/* Términos de Pago */}
          <div className="mt-4">
            <Label>Términos de Pago</Label>
            <PaymentTermsSearch onSelect={onPaymentTermsSelect} placeholder="Buscar términos de pago..."/>
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <Label htmlFor="description">Descripción</Label>
            <Input {...form.register('description')} placeholder="Descripción de la factura"/>
          </div>

          {/* Notas */}
          <div className="mt-4">
            <Label htmlFor="notes">Notas</Label>
            <Textarea {...form.register('notes')} placeholder="Notas adicionales" rows={3}/>
          </div>
        </Card>

        {/* Lines */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Líneas de Factura</h2>
            <Button type="button" variant="outline" size="sm" onClick={addLine} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4"/>
              Agregar Línea
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map(function (field, index) { return (<div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Línea {index + 1}</h3>
                  {fields.length > 1 && (<Button type="button" variant="danger" size="sm" onClick={function () { return removeLine(index); }}>
                      <TrashIcon className="w-4 h-4"/>
                    </Button>)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Producto */}
                  <div className="lg:col-span-2">
                    <Label>Producto</Label>                    <ProductSearch onSelect={function (product) { return onProductSelect(index, product); }} placeholder="Buscar producto..."/>
                  </div>

                  {/* Cantidad */}
                  <div>
                    <Label>Cantidad *</Label>
                    <Input type="number" step="0.01" {...form.register("lines.".concat(index, ".quantity"), {
            required: true,
            valueAsNumber: true,
            min: 0.01
        })}/>
                  </div>

                  {/* Precio Unitario */}
                  <div>
                    <Label>Precio Unitario *</Label>
                    <Input type="number" step="0.01" {...form.register("lines.".concat(index, ".unit_price"), {
            required: true,
            valueAsNumber: true,
            min: 0
        })}/>
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-2">
                    <Label>Descripción *</Label>
                    <Input {...form.register("lines.".concat(index, ".description"), { required: true })} placeholder="Descripción de la línea"/>
                  </div>

                  {/* Descuento */}
                  <div>
                    <Label>Descuento (%)</Label>
                    <Input type="number" step="0.01" min="0" max="100" {...form.register("lines.".concat(index, ".discount_percentage"), {
            valueAsNumber: true
        })}/>
                  </div>

                  {/* Subtotal calculado */}
                  <div>
                    <Label>Subtotal</Label>
                    <div className="text-lg font-semibold text-gray-900 py-2">
                      ${(((form.watch("lines.".concat(index, ".quantity")) || 0) *
                (form.watch("lines.".concat(index, ".unit_price")) || 0)) *
                (1 - ((form.watch("lines.".concat(index, ".discount_percentage")) || 0) / 100))).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>); })}
          </div>
        </Card>

        {/* Totals */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5"/>
            Totales
            {calculating && (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-xl font-semibold">
                ${((_a = form.watch('calculated_subtotal')) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '0.00'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Impuestos</div>
              <div className="text-xl font-semibold">
                ${((_b = form.watch('calculated_tax_amount')) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '0.00'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-blue-600">
                ${((_c = form.watch('calculated_total')) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || '0.00'}
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>);
}
