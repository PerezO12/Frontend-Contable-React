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
 * Página de creación de facturas mejorada con flujo Odoo
 * Incluye vista previa de payment schedule y validación de payment terms
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
import { formatCurrency } from '@/shared/utils/formatters';
// Importar componentes de búsqueda existentes
import { CustomerSearch } from '../components/CustomerSearch';
import { ProductSearch } from '../components/ProductSearch';
import { PaymentTermsSearch } from '../components/PaymentTermsSearch';
// Nuevos componentes del flujo Odoo
import { PaymentSchedulePreview } from '../components/PaymentSchedulePreview';
export function InvoiceCreateEnhancedPage() {
    var _this = this;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState(false), saving = _a[0], setSaving = _a[1];
    var _b = useState(false), calculating = _b[0], setCalculating = _b[1];
    var _c = useState(true), paymentTermsValid = _c[0], setPaymentTermsValid = _c[1];
    var _d = useState(false), showPaymentPreview = _d[0], setShowPaymentPreview = _d[1];
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
    var _e = useFieldArray({
        control: form.control,
        name: 'lines'
    }), fields = _e.fields, append = _e.append, remove = _e.remove;
    var watchedLines = form.watch('lines');
    var watchedInvoiceType = form.watch('invoice_type');
    var watchedPaymentTermsId = form.watch('payment_terms_id');
    var watchedTotal = form.watch('calculated_total');
    // Calcular totales automáticamente cuando cambien las líneas
    useEffect(function () {
        calculateTotals();
    }, [watchedLines]);
    // Validar payment terms cuando cambie
    useEffect(function () {
        if (watchedPaymentTermsId) {
            validatePaymentTerms();
        }
    }, [watchedPaymentTermsId]);
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
    var validatePaymentTerms = function () { return __awaiter(_this, void 0, void 0, function () {
        var validation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!watchedPaymentTermsId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.validatePaymentTerms(watchedPaymentTermsId)];
                case 2:
                    validation = _a.sent();
                    setPaymentTermsValid(validation.is_valid);
                    if (!validation.is_valid) {
                        showToast("T\u00E9rminos de pago inv\u00E1lidos: ".concat(validation.errors.join(', ')), 'warning');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error validating payment terms:', error_1);
                    setPaymentTermsValid(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
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
        // Establecer cuenta por defecto del tercero si está disponible
        if (thirdParty.default_account_id) {
            form.setValue('third_party_account_id', thirdParty.default_account_id);
        }
    };
    var onPaymentTermsSelect = function (paymentTerms) {
        form.setValue('payment_terms_id', paymentTerms.id);
        form.setValue('payment_terms_name', paymentTerms.name);
        setShowPaymentPreview(true);
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var invoiceData, createdInvoice, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setSaving(true);
                    // Validar que payment terms sea válido
                    if (data.payment_terms_id && !paymentTermsValid) {
                        showToast('Los términos de pago seleccionados no son válidos', 'error');
                        return [2 /*return*/];
                    }
                    invoiceData = {
                        invoice_type: data.invoice_type,
                        invoice_date: data.invoice_date,
                        due_date: data.due_date,
                        currency_code: data.currency_code,
                        exchange_rate: data.exchange_rate,
                        third_party_id: data.third_party_id,
                        payment_terms_id: data.payment_terms_id,
                        description: data.description,
                        notes: data.notes,
                        lines: data.lines.map(function (line, index) { return ({
                            sequence: index + 1,
                            product_id: line.product_id,
                            description: line.description,
                            quantity: line.quantity,
                            unit_price: line.unit_price,
                            discount_percentage: line.discount_percentage,
                            account_id: line.account_id,
                            cost_center_id: line.cost_center_id,
                            tax_ids: line.tax_ids
                        }); })
                    };
                    return [4 /*yield*/, InvoiceAPI.createInvoiceWithLines(invoiceData)];
                case 1:
                    createdInvoice = _a.sent();
                    showToast('Factura creada exitosamente', 'success');
                    navigate("/invoices/".concat(createdInvoice.id));
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    showToast(error_2.message || 'Error al crear la factura', 'error');
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var onSaveDraft = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simplemente enviar sin validaciones estrictas para guardar como borrador
                return [4 /*yield*/, onSubmit(form.getValues())];
                case 1:
                    // Simplemente enviar sin validaciones estrictas para guardar como borrador
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6">
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
          <Button variant="outline" onClick={function () { return navigate('/invoices'); }}>
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
                  <select {...form.register('invoice_type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Factura de Cliente</option>
                    <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Factura de Proveedor</option>
                    <option value={InvoiceTypeEnum.CREDIT_NOTE}>Nota de Crédito</option>
                    <option value={InvoiceTypeEnum.DEBIT_NOTE}>Nota de Débito</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="invoice_date">Fecha de Factura</Label>
                  <Input type="date" {...form.register('invoice_date')} className="mt-1"/>
                </div>
                
                <div>
                  <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                  <Input type="date" {...form.register('due_date')} className="mt-1"/>
                </div>
                
                <div>
                  <Label htmlFor="currency_code">Moneda</Label>
                  <select {...form.register('currency_code')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
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
                  </Label>                  <CustomerSearch onSelect={onThirdPartySelect} filterByType={watchedInvoiceType === InvoiceTypeEnum.CUSTOMER_INVOICE ? 'customer' : 'supplier'}/>
                </div>
                
                <div>
                  <Label htmlFor="payment_terms_id">Términos de Pago</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <PaymentTermsSearch onSelect={onPaymentTermsSelect}/>
                    </div>
                    {watchedPaymentTermsId && !paymentTermsValid && (<span className="text-red-600 text-sm">⚠️ Inválido</span>)}
                    {watchedPaymentTermsId && paymentTermsValid && (<span className="text-green-600 text-sm">✅ Válido</span>)}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea {...form.register('description')} placeholder="Descripción general de la factura..." className="mt-1"/>
                </div>
              </div>
            </Card>

            {/* Líneas de factura */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Líneas de Factura</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <PlusIcon className="h-4 w-4 mr-2"/>
                  Agregar Línea
                </Button>
              </div>
              
              <div className="space-y-4">
                {fields.map(function (field, index) { return (<div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Línea {index + 1}</h4>
                      {fields.length > 1 && (<Button type="button" variant="outline" size="sm" onClick={function () { return removeLine(index); }}>
                          <TrashIcon className="h-4 w-4"/>
                        </Button>)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Producto</Label>
                        <ProductSearch onSelect={function (product) { return onProductSelect(index, product); }}/>
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor={"lines.".concat(index, ".description")}>Descripción</Label>
                        <Textarea {...form.register("lines.".concat(index, ".description"))} placeholder="Descripción del producto o servicio..." className="mt-1"/>
                      </div>
                      
                      <div>
                        <Label htmlFor={"lines.".concat(index, ".quantity")}>Cantidad</Label>
                        <Input type="number" step="0.01" {...form.register("lines.".concat(index, ".quantity"), {
            valueAsNumber: true
        })} className="mt-1"/>
                      </div>
                      
                      <div>
                        <Label htmlFor={"lines.".concat(index, ".unit_price")}>Precio Unitario</Label>
                        <Input type="number" step="0.01" {...form.register("lines.".concat(index, ".unit_price"), {
            valueAsNumber: true
        })} className="mt-1"/>
                      </div>
                      
                      <div>
                        <Label htmlFor={"lines.".concat(index, ".discount_percentage")}>Descuento (%)</Label>
                        <Input type="number" step="0.01" {...form.register("lines.".concat(index, ".discount_percentage"), {
            valueAsNumber: true
        })} className="mt-1"/>
                      </div>
                    </div>
                  </div>); })}
              </div>
            </Card>
          </div>

          {/* Columna derecha - Totales y vista previa */}
          <div className="space-y-6">
            {/* Totales */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Totales</h3>
                <Button type="button" variant="outline" size="sm" onClick={calculateTotals} disabled={calculating}>
                  <CalculatorIcon className="h-4 w-4"/>
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
            {showPaymentPreview && watchedPaymentTermsId && (<PaymentSchedulePreview invoiceAmount={watchedTotal} paymentTermsId={watchedPaymentTermsId} invoiceDate={form.watch('invoice_date')}/>)}

            {/* Acciones */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={saving}>
                  <SaveIcon className="h-4 w-4 mr-2"/>
                  {saving ? 'Guardando...' : 'Crear Factura'}
                </Button>
                
                <Button type="button" variant="outline" className="w-full" onClick={onSaveDraft} disabled={saving}>
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
    </div>);
}
