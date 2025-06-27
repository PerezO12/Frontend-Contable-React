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
var _a;
/**
 * Página de detalle de factura - Estilo Odoo
 * Muestra información completa con tabs: Información, Líneas, Contabilidad, Auditoría
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { InvoiceAPI } from '../api/invoiceAPI';
import { InvoiceStatusConst, InvoiceTypeConst } from '../types';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/shared/contexts/ToastContext';
import { InvoiceJournalEntryInfo } from '../components';
import { PencilIcon, CheckCircleIcon, BanknotesIcon, XCircleIcon, DocumentDuplicateIcon, ArrowLeftIcon, ArrowPathIcon, TrashIcon } from '@/shared/components/icons';
// Configuración de workflow según requerimientos
var workflowActions = (_a = {},
    _a[InvoiceStatusConst.DRAFT] = [
        { action: 'delete', label: 'Eliminar', color: 'red', icon: TrashIcon },
        { action: 'post', label: 'Aprobar/Contabilizar', color: 'green', icon: CheckCircleIcon }
    ],
    _a[InvoiceStatusConst.POSTED] = [
        { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon },
        { action: 'cancel', label: 'Cancelar', color: 'red', icon: XCircleIcon },
        { action: 'reset_to_draft', label: 'Restablecer a Borrador', color: 'gray', icon: ArrowPathIcon }
    ],
    _a[InvoiceStatusConst.CANCELLED] = [
        { action: 'reset_to_draft', label: 'Restablecer a Borrador', color: 'gray', icon: ArrowPathIcon }
    ],
    _a['paid'] = [
        { action: 'reset_to_draft', label: 'Restablecer a Borrador', color: 'gray', icon: ArrowPathIcon }
    ],
    _a['partially_paid'] = [
        { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon },
        { action: 'reset_to_draft', label: 'Restablecer a Borrador', color: 'gray', icon: ArrowPathIcon }
    ],
    _a['overdue'] = [
        { action: 'mark_paid', label: 'Marcar como Pagada', color: 'emerald', icon: BanknotesIcon },
        { action: 'reset_to_draft', label: 'Restablecer a Borrador', color: 'gray', icon: ArrowPathIcon }
    ],
    _a);
export function InvoiceDetailPage() {
    var _this = this;
    var id = useParams().id;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState(''), actionNotes = _a[0], setActionNotes = _a[1];
    var _b = useState('info'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = useInvoiceStore(), currentInvoice = _c.currentInvoice, loading = _c.loading, saving = _c.saving, error = _c.error, fetchInvoice = _c.fetchInvoice, confirmInvoice = _c.confirmInvoice, postInvoice = _c.postInvoice, markAsPaid = _c.markAsPaid, cancelInvoice = _c.cancelInvoice, duplicateInvoice = _c.duplicateInvoice, deleteInvoice = _c.deleteInvoice;
    useEffect(function () {
        if (id) {
            fetchInvoice(id);
        }
    }, [id, fetchInvoice]);
    if (loading) {
        return (<div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    if (error || !currentInvoice) {
        return (<div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar la factura
        </h3>
        <p className="text-gray-500 mb-4">
          {error || 'Factura no encontrada'}
        </p>
        <Button onClick={function () { return navigate('/invoices'); }}>
          Volver al listado
        </Button>
      </div>);
    }
    var invoice = currentInvoice;
    var availableActions = workflowActions[invoice.status] || [];
    var handleWorkflowAction = function (action) { return __awaiter(_this, void 0, void 0, function () {
        var _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 16, , 17]);
                    _a = action;
                    switch (_a) {
                        case 'confirm': return [3 /*break*/, 1];
                        case 'post': return [3 /*break*/, 3];
                        case 'mark_paid': return [3 /*break*/, 5];
                        case 'cancel': return [3 /*break*/, 7];
                        case 'reset_to_draft': return [3 /*break*/, 9];
                        case 'delete': return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 15];
                case 1: return [4 /*yield*/, confirmInvoice(invoice.id, actionNotes)];
                case 2:
                    _b.sent();
                    showToast('Factura confirmada exitosamente', 'success');
                    return [3 /*break*/, 15];
                case 3: return [4 /*yield*/, postInvoice(invoice.id, actionNotes)];
                case 4:
                    _b.sent();
                    showToast('Factura aprobada y contabilizada exitosamente', 'success');
                    return [3 /*break*/, 15];
                case 5: return [4 /*yield*/, markAsPaid(invoice.id, actionNotes)];
                case 6:
                    _b.sent();
                    showToast('Factura marcada como pagada', 'success');
                    return [3 /*break*/, 15];
                case 7: return [4 /*yield*/, cancelInvoice(invoice.id, actionNotes)];
                case 8:
                    _b.sent();
                    showToast('Factura cancelada', 'success');
                    return [3 /*break*/, 15];
                case 9: return [4 /*yield*/, InvoiceAPI.resetToDraft(invoice.id, { reason: actionNotes })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, fetchInvoice(invoice.id)];
                case 11:
                    _b.sent(); // Recargar datos
                    showToast('Factura restablecida a borrador', 'success');
                    return [3 /*break*/, 15];
                case 12:
                    if (!window.confirm('¿Estás seguro de que quieres eliminar esta factura? Esta acción no se puede deshacer.')) return [3 /*break*/, 14];
                    return [4 /*yield*/, deleteInvoice(invoice.id)];
                case 13:
                    _b.sent();
                    showToast('Factura eliminada exitosamente', 'success');
                    navigate('/invoices');
                    _b.label = 14;
                case 14: return [3 /*break*/, 15];
                case 15:
                    setActionNotes('');
                    return [3 /*break*/, 17];
                case 16:
                    error_1 = _b.sent();
                    showToast('Error al ejecutar la acción', 'error');
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    var handleDuplicate = function () { return __awaiter(_this, void 0, void 0, function () {
        var duplicated, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, duplicateInvoice(invoice.id)];
                case 1:
                    duplicated = _a.sent();
                    showToast('Factura duplicada exitosamente', 'success');
                    navigate("/invoices/".concat(duplicated.id, "/edit"));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    showToast('Error al duplicar la factura', 'error');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getStatusConfig = function (status) {
        var _a;
        var configs = (_a = {},
            _a[InvoiceStatusConst.DRAFT] = { label: 'Borrador', color: 'gray' },
            _a[InvoiceStatusConst.POSTED] = { label: 'Contabilizada', color: 'green' },
            _a[InvoiceStatusConst.CANCELLED] = { label: 'Cancelada', color: 'red' },
            _a);
        return configs[status] || { label: status, color: 'gray' };
    };
    var getTypeConfig = function (type) {
        var _a;
        var configs = (_a = {},
            _a[InvoiceTypeConst.CUSTOMER_INVOICE] = { label: 'Factura de Venta', color: 'green' },
            _a[InvoiceTypeConst.SUPPLIER_INVOICE] = { label: 'Factura de Compra', color: 'blue' },
            _a[InvoiceTypeConst.CREDIT_NOTE] = { label: 'Nota de Crédito', color: 'orange' },
            _a[InvoiceTypeConst.DEBIT_NOTE] = { label: 'Nota de Débito', color: 'purple' },
            _a);
        return configs[type] || { label: type, color: 'gray' };
    };
    var statusConfig = getStatusConfig(invoice.status);
    var typeConfig = getTypeConfig(invoice.invoice_type);
    // Funciones de renderizado de tabs
    var renderInfoTab = function () { return (<div className="space-y-6">
      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Cliente/Proveedor</label>
            <p className="text-gray-900 font-medium">{invoice.third_party_name}</p>
            {invoice.third_party_code && (<p className="text-sm text-gray-500">{invoice.third_party_code}</p>)}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Emisión</label>
            <p className="text-gray-900">{formatDate(invoice.invoice_date)}</p>
          </div>
            <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
            <p className="text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'No especificada'}</p>
          </div>
        </div>

        <div className="space-y-4">
          {invoice.payment_terms_name && (<div>
              <label className="text-sm font-medium text-gray-500">Términos de Pago</label>
              <p className="text-gray-900">{invoice.payment_terms_name}</p>
              {invoice.payment_terms_code && (<p className="text-sm text-gray-500">Código: {invoice.payment_terms_code}</p>)}
            </div>)}
          
          <div>
            <label className="text-sm font-medium text-gray-500">Moneda</label>
            <p className="text-gray-900">{invoice.currency_code}</p>
            {invoice.exchange_rate !== 1 && (<p className="text-sm text-gray-500">Tasa: {invoice.exchange_rate}</p>)}
          </div>

          {(invoice.internal_reference || invoice.external_reference) && (<div>
              <label className="text-sm font-medium text-gray-500">Referencias</label>
              {invoice.internal_reference && (<p className="text-sm text-gray-900">Interna: {invoice.internal_reference}</p>)}
              {invoice.external_reference && (<p className="text-sm text-gray-900">Externa: {invoice.external_reference}</p>)}
            </div>)}
        </div>
      </div>

      {invoice.description && (<div>
          <label className="text-sm font-medium text-gray-500">Descripción</label>
          <p className="text-gray-900 mt-1">{invoice.description}</p>
        </div>)}

      {invoice.notes && (<div>
          <label className="text-sm font-medium text-gray-500">Notas</label>
          <p className="text-gray-900 mt-1">{invoice.notes}</p>
        </div>)}

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
            <p className={"text-lg font-semibold ".concat(invoice.remaining_amount > 0 ? 'text-red-600' : 'text-green-600')}>
              {formatCurrency(invoice.remaining_amount)}
            </p>
          </div>
        </div>
      </div>
    </div>); };
    var renderLinesTab = function () { return (<div className="space-y-4">
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
          </thead>          <tbody className="divide-y divide-gray-200">
            {invoice.lines.map(function (line, index) { return (<tr key={line.id || index}>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{line.line_number || index + 1}</span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    {line.product_name ? (<p className="text-sm font-medium text-gray-900">{line.product_name}</p>) : line.product_id ? (<p className="text-sm font-medium text-red-600">ID: {line.product_id} (Sin nombre)</p>) : (<p className="text-sm text-gray-500">Sin producto</p>)}
                    {line.product_code && (<p className="text-xs text-gray-500">{line.product_code}</p>)}
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
                </td>                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {formatCurrency(line.line_total)}
                  </span>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>
    </div>); };
    var renderAccountingTab = function () { return (<div className="space-y-6">
      {invoice.journal_entry_id ? (<InvoiceJournalEntryInfo journalEntryId={invoice.journal_entry_id} invoiceAmount={invoice.total_amount} invoiceType={invoice.invoice_type} thirdPartyName={invoice.third_party_name || ''}/>) : (<div className="text-center py-8">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircleIcon className="h-6 w-6 text-yellow-600"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Factura no Contabilizada
            </h3>
            <p className="text-gray-500 mb-4">
              Esta factura aún no ha sido contabilizada. Para generar el asiento contable, 
              debe emitir la factura usando el botón "Emitir (Contabilizar)".
            </p>
            {availableActions.some(function (action) { return action.action === 'post'; }) && (<Button onClick={function () { return handleWorkflowAction('post'); }} disabled={saving} className="bg-green-600 hover:bg-green-700">
                <CheckCircleIcon className="h-4 w-4 mr-2"/>
                {saving ? 'Procesando...' : 'Emitir (Contabilizar)'}
              </Button>)}
          </div>
        </div>)}
    </div>); };
    var renderAuditTab = function () { return (<div className="space-y-6">
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
            <CheckCircleIcon className="h-4 w-4 text-green-500"/>
          </div>          {/* Paso 2: Factura creada */}          <div className="flex items-center gap-3">
            <div className={"h-3 w-3 rounded-full ".concat(invoice.status !== 'DRAFT' ? 'bg-green-500' : 'bg-blue-500')}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Factura creada (borrador)</p>
              <p className="text-xs text-gray-500">
                Estado actual: {statusConfig.label}
              </p>
            </div>{invoice.status === 'DRAFT' ? (<div className="h-4 w-4 border-2 border-blue-500 rounded-full animate-pulse"></div>) : (<CheckCircleIcon className="h-4 w-4 text-green-500"/>)}
          </div>

          {/* Paso 3: Factura emitida */}
          <div className="flex items-center gap-3">            <div className={"h-3 w-3 rounded-full ".concat(['posted', 'paid', 'partially_paid'].includes(invoice.status)
            ? 'bg-green-500'
            : 'bg-gray-300')}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Factura emitida (contabilizada)</p>
              <p className="text-xs text-gray-500">Genera asiento contable automáticamente</p>
            </div>
            {['posted', 'paid', 'partially_paid'].includes(invoice.status) ? (<CheckCircleIcon className="h-4 w-4 text-green-500"/>) : (<div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>)}
          </div>

          {/* Paso 4: Pago recibido */}
          <div className="flex items-center gap-3">            <div className={"h-3 w-3 rounded-full ".concat(invoice.paid_amount >= invoice.total_amount ? 'bg-green-500' : 'bg-gray-300')}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pago recibido</p>
              <p className="text-xs text-gray-500">
                {invoice.paid_amount > 0
            ? "Pagado: ".concat(formatCurrency(invoice.paid_amount), " de ").concat(formatCurrency(invoice.total_amount))
            : 'Pendiente de pago'}
              </p>
            </div>            {invoice.paid_amount >= invoice.total_amount ? (<CheckCircleIcon className="h-4 w-4 text-green-500"/>) : invoice.paid_amount > 0 ? (<div className="h-4 w-4 bg-yellow-500 rounded-full"></div>) : (<div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>)}
          </div>
        </div>
      </div>
    </div>); };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={function () { return navigate('/invoices'); }} className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4"/>
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
          {invoice.status === InvoiceStatusConst.DRAFT && (<Button variant="outline" onClick={function () { return navigate("/invoices/".concat(invoice.id, "/edit")); }} className="flex items-center gap-2">
              <PencilIcon className="h-4 w-4"/>
              Editar
            </Button>)}
          
          <Button variant="outline" onClick={handleDuplicate} className="flex items-center gap-2">
            <DocumentDuplicateIcon className="h-4 w-4"/>
            Duplicar
          </Button>
          
          {availableActions.map(function (_a) {
            var action = _a.action, label = _a.label, color = _a.color, Icon = _a.icon;
            return (<Button key={action} onClick={function () { return handleWorkflowAction(action); }} disabled={saving} className={"flex items-center gap-2 bg-".concat(color, "-600 hover:bg-").concat(color, "-700")}>
              <Icon className="h-4 w-4"/>
              {saving ? 'Procesando...' : label}
            </Button>);
        })}
            {invoice.status !== InvoiceStatusConst.CANCELLED && (<Button variant="outline" onClick={function () { return handleWorkflowAction('cancel'); }} disabled={saving} className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400">
              <XCircleIcon className="h-4 w-4"/>
              Cancelar
            </Button>)}
        </div>
      </div>

      {/* Tabs */}
      <Card>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button onClick={function () { return setActiveTab('info'); }} className={"py-4 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'info'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Información
            </button>
            <button onClick={function () { return setActiveTab('lines'); }} className={"py-4 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'lines'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Líneas ({invoice.lines.length})
            </button>
            <button onClick={function () { return setActiveTab('accounting'); }} className={"py-4 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'accounting'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Contabilidad
              {invoice.journal_entry_id && (<span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓
                </span>)}
            </button>
            <button onClick={function () { return setActiveTab('audit'); }} className={"py-4 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'audit'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
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
    </div>);
}
