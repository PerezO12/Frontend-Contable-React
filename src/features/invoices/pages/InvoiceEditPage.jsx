var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
 * Página de edición de facturas
 * Permite editar facturas en estado borrador
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useThirdPartiesForInvoices } from '../hooks/useThirdPartiesForInvoices';
import { InvoiceTypeConst, InvoiceStatusConst } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import { PlusIcon, TrashIcon } from '@/shared/components/icons';
export function InvoiceEditPage() {
    var _this = this;
    var id = useParams().id;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useInvoiceStore(), currentInvoice = _a.currentInvoice, loading = _a.loading, saving = _a.saving, fetchInvoice = _a.fetchInvoice, updateInvoice = _a.updateInvoice;
    var _b = useThirdPartiesForInvoices(), thirdPartyOptions = _b.options, loadingThirdParties = _b.loading;
    var _c = useState(null), formData = _c[0], setFormData = _c[1];
    var _d = useState({
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 21,
        line_total: 0
    }), newLine = _d[0], setNewLine = _d[1];
    // Cargar factura al montar el componente
    useEffect(function () {
        if (id) {
            fetchInvoice(id);
        }
    }, [id, fetchInvoice]);
    // Inicializar formulario con datos de la factura
    useEffect(function () {
        if (currentInvoice) {
            // Solo permitir edición de facturas en borrador
            if (currentInvoice.status !== InvoiceStatusConst.DRAFT) {
                showToast('Solo se pueden editar facturas en estado borrador', 'error');
                navigate("/invoices/".concat(id));
                return;
            }
            setFormData({
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
    useEffect(function () {
        if (formData === null || formData === void 0 ? void 0 : formData.lines) {
            var subtotal_1 = formData.lines.reduce(function (sum, line) { return sum + (line.line_total || 0); }, 0);
            var tax_amount_1 = formData.lines.reduce(function (sum, line) {
                return sum + ((line.line_total || 0) * ((line.tax_rate || 0) / 100));
            }, 0);
            setFormData(function (prev) { return prev ? (__assign(__assign({}, prev), { subtotal: subtotal_1, tax_amount: tax_amount_1, total_amount: subtotal_1 + tax_amount_1 })) : null; });
        }
    }, [formData === null || formData === void 0 ? void 0 : formData.lines]);
    // Calcular total de línea automáticamente
    useEffect(function () {
        var lineTotal = newLine.quantity * newLine.unit_price;
        setNewLine(function (prev) { return (__assign(__assign({}, prev), { line_total: lineTotal })); });
    }, [newLine.quantity, newLine.unit_price]);
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return prev ? (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a))) : null;
        });
    };
    var handleLineChange = function (field, value) {
        setNewLine(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var addLine = function () {
        if (!newLine.description.trim()) {
            showToast('La descripción de la línea es requerida', 'error');
            return;
        }
        setFormData(function (prev) { return prev ? (__assign(__assign({}, prev), { lines: __spreadArray(__spreadArray([], (prev.lines || []), true), [__assign({}, newLine)], false) })) : null; });
        // Reset new line
        setNewLine({
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 21,
            line_total: 0
        });
    };
    var removeLine = function (index) {
        setFormData(function (prev) {
            var _a;
            return prev ? (__assign(__assign({}, prev), { lines: ((_a = prev.lines) === null || _a === void 0 ? void 0 : _a.filter(function (_, i) { return i !== index; })) || [] })) : null;
        });
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData)
                        return [2 /*return*/];
                    if (!formData.third_party_id) {
                        showToast('Debe seleccionar un cliente/proveedor', 'error');
                        return [2 /*return*/];
                    }
                    if (!formData.lines || formData.lines.length === 0) {
                        showToast('Debe agregar al menos una línea a la factura', 'error');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateInvoice(formData)];
                case 2:
                    _a.sent();
                    showToast('Factura actualizada exitosamente', 'success');
                    navigate("/invoices/".concat(id));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    showToast('Error al actualizar la factura', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    if (!formData) {
        return (<div className="text-center py-12">
        <p className="text-gray-500">Factura no encontrada</p>
        <Button variant="outline" onClick={function () { return navigate('/invoices'); }} className="mt-4">
          Volver al Listado
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Factura {(currentInvoice === null || currentInvoice === void 0 ? void 0 : currentInvoice.number) || ''}
          </h1>
          <p className="text-gray-600 mt-1">
            Modificar factura en estado borrador
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={function () { return navigate("/invoices/".concat(id)); }}>
            Cancelar
          </Button>
          
          <Button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <Select placeholder="Tipo de factura" value={formData.invoice_type || ''} onChange={function (value) { return handleInputChange('invoice_type', value); }} options={[{ value: InvoiceTypeConst.CUSTOMER_INVOICE, label: 'Factura de Venta' },
            { value: InvoiceTypeConst.SUPPLIER_INVOICE, label: 'Factura de Compra' },
            { value: InvoiceTypeConst.CREDIT_NOTE, label: 'Nota de Crédito' },
            { value: InvoiceTypeConst.DEBIT_NOTE, label: 'Nota de Débito' }
        ]}/>            <Select placeholder="Seleccionar cliente/proveedor" value={formData.third_party_id || ''} onChange={function (value) { return handleInputChange('third_party_id', value); }} options={thirdPartyOptions} disabled={loadingThirdParties}/>

            <Input label="Fecha de factura" type="date" value={formData.invoice_date} onChange={function (e) { return handleInputChange('invoice_date', e.target.value); }} required/>

            <Input label="Fecha de vencimiento" type="date" value={formData.due_date || ''} onChange={function (e) { return handleInputChange('due_date', e.target.value); }}/>

            <div className="md:col-span-2">
              <Textarea label="Descripción" value={formData.description || ''} onChange={function (e) { return handleInputChange('description', e.target.value); }} placeholder="Descripción de la factura..." rows={3}/>
            </div>
          </div>
        </Card>

        {/* Líneas de factura */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Líneas de Factura
          </h2>

          {/* Líneas existentes */}
          {formData.lines && formData.lines.length > 0 && (<div className="mb-6 overflow-x-auto">
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
                  {formData.lines.map(function (line, index) { return (<tr key={index}>
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
                        ${(line.line_total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button variant="outline" size="sm" onClick={function () { return removeLine(index); }} className="text-red-600 hover:text-red-700">
                          <TrashIcon className="h-4 w-4"/>
                        </Button>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}

          {/* Nueva línea */}
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Agregar Nueva Línea
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <Input placeholder="Descripción del producto/servicio" value={newLine.description} onChange={function (e) { return handleLineChange('description', e.target.value); }}/>
              </div>
              
              <Input type="number" placeholder="Cantidad" min="0" step="0.01" value={newLine.quantity} onChange={function (e) { return handleLineChange('quantity', parseFloat(e.target.value) || 0); }}/>
              
              <Input type="number" placeholder="Precio unitario" min="0" step="0.01" value={newLine.unit_price} onChange={function (e) { return handleLineChange('unit_price', parseFloat(e.target.value) || 0); }}/>
              
              <Input type="number" placeholder="IVA %" min="0" max="100" step="0.01" value={newLine.tax_rate} onChange={function (e) { return handleLineChange('tax_rate', parseFloat(e.target.value) || 0); }}/>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Total línea: <span className="font-medium">${(newLine.line_total || 0).toFixed(2)}</span>
              </div>
              
              <Button type="button" onClick={addLine} variant="outline" className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4"/>
                Agregar Línea
              </Button>
            </div>
          </div>
        </Card>

        {/* Totales */}
        {formData.lines && formData.lines.length > 0 && (<Card className="p-6">
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
          </Card>)}

        {/* Notas adicionales */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notas Adicionales
          </h2>
          
          <Textarea value={formData.notes || ''} onChange={function (e) { return handleInputChange('notes', e.target.value); }} placeholder="Notas internas, términos y condiciones..." rows={4}/>
        </Card>
      </form>
    </div>);
}
