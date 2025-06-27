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
/**
 * Página de detalle de factura mejorada con flujo Odoo
 * Incluye workflow status, payment schedule preview y journal entry info
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceAPI } from '../api/invoiceAPI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/shared/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
// Componentes específicos del flujo Odoo
import { InvoiceWorkflowStatus } from '../components/InvoiceWorkflowStatus';
import { PaymentSchedulePreview } from '../components/PaymentSchedulePreview';
export function InvoiceDetailOdooPage() {
    var _this = this;
    var id = useParams().id;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState(null), invoice = _a[0], setInvoice = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(false), actionLoading = _c[0], setActionLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    useEffect(function () {
        if (id) {
            loadInvoice();
        }
    }, [id]);
    var loadInvoice = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, InvoiceAPI.getInvoiceWithLines(id)];
                case 2:
                    data = _a.sent();
                    setInvoice(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error al cargar la factura');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleWorkflowAction = function (action) { return __awaiter(_this, void 0, void 0, function () {
        var updatedInvoice, _a, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!invoice)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    setActionLoading(true);
                    updatedInvoice = void 0;
                    _a = action;
                    switch (_a) {
                        case 'post': return [3 /*break*/, 2];
                        case 'cancel': return [3 /*break*/, 4];
                        case 'reset_to_draft': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, InvoiceAPI.postInvoice(invoice.id)];
                case 3:
                    updatedInvoice = _b.sent();
                    showToast('Factura contabilizada exitosamente', 'success');
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, InvoiceAPI.cancelInvoice(invoice.id, {
                        reason: 'Cancelación manual desde interfaz'
                    })];
                case 5:
                    updatedInvoice = _b.sent();
                    showToast('Factura cancelada exitosamente', 'success');
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, InvoiceAPI.resetToDraft(invoice.id)];
                case 7:
                    updatedInvoice = _b.sent();
                    showToast('Factura restablecida a borrador', 'success');
                    return [3 /*break*/, 8];
                case 8:
                    setInvoice(__assign(__assign({}, invoice), updatedInvoice));
                    return [3 /*break*/, 11];
                case 9:
                    err_2 = _b.sent();
                    showToast(err_2.message || 'Error al ejecutar la acción', 'error');
                    return [3 /*break*/, 11];
                case 10:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function () {
        if (invoice && invoice.status === 'DRAFT') {
            navigate("/invoices/".concat(invoice.id, "/edit"));
        }
    };
    var handleDuplicate = function () { return __awaiter(_this, void 0, void 0, function () {
        var duplicated, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!invoice)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.duplicateInvoice(invoice.id)];
                case 2:
                    duplicated = _a.sent();
                    showToast('Factura duplicada exitosamente', 'success');
                    navigate("/invoices/".concat(duplicated.id, "/edit"));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    showToast(err_3.message || 'Error al duplicar la factura', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    if (error || !invoice) {
        return (<div className="text-center py-12">
        <div className="text-red-600 mb-4">
          ⚠️ Error al cargar la factura
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={function () { return navigate('/invoices'); }} variant="outline">
          Volver al listado
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
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
          <Button variant="outline" onClick={function () { return navigate('/invoices'); }}>
            Volver
          </Button>
          
          {invoice.status === 'DRAFT' && (<Button variant="secondary" onClick={handleEdit}>
              Editar
            </Button>)}
          
          <Button variant="outline" onClick={handleDuplicate}>
            Duplicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Status */}
          <Card className="p-6">
            <InvoiceWorkflowStatus status={invoice.status} onPost={function () { return handleWorkflowAction('post'); }} onCancel={function () { return handleWorkflowAction('cancel'); }} onResetToDraft={function () { return handleWorkflowAction('reset_to_draft'); }} isLoading={actionLoading}/>
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
            
            {invoice.description && (<div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <p className="text-gray-900">{invoice.description}</p>
              </div>)}
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
                  {invoice.lines.map(function (line) { return (<tr key={line.id}>
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
                        {line.discount_percentage ? "".concat(line.discount_percentage, "%") : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(line.total_amount)}
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Información del asiento contable */}
          {invoice.status === 'POSTED' && invoice.journal_entry && (<Card className="p-6">
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
            </Card>)}
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
              
              {invoice.discount_amount > 0 && (<div className="flex justify-between">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(invoice.discount_amount)}
                  </span>
                </div>)}
              
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
          {invoice.payment_terms_id && (<PaymentSchedulePreview invoiceId={invoice.id} invoiceAmount={invoice.total_amount} paymentTermsId={invoice.payment_terms_id} invoiceDate={invoice.invoice_date}/>)}

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
    </div>);
}
