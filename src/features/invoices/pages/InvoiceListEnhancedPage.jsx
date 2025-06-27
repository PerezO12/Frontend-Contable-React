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
 * Página de listado de facturas mejorada con flujo Odoo
 * Incluye filtros por estado del workflow y acciones batch
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceAPI } from '../api/invoiceAPI';
import { InvoiceStatusEnum, InvoiceTypeEnum } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu, DropdownItem } from '@/components/ui/DropdownMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExportFormatModal } from '@/components/ui/ExportFormatModal';
import { useToast } from '@/shared/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { PlusIcon, FunnelIcon, CheckCircleIcon, XCircleIcon, EllipsisVerticalIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon, TrashIcon, ArrowDownTrayIcon } from '@/shared/components/icons';
import { ExportService } from '@/shared/services/exportService';
export function InvoiceListEnhancedPage() {
    var _this = this;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState([]), invoices = _a[0], setInvoices = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(false), actionLoading = _c[0], setActionLoading = _c[1];
    var _d = useState([]), selectedInvoices = _d[0], setSelectedInvoices = _d[1];
    var _e = useState({
        page: 1,
        size: 100,
        total: 0,
        total_pages: 0
    }), pagination = _e[0], setPagination = _e[1];
    var _f = useState({
        page: 1,
        size: 100
    }), filters = _f[0], setFilters = _f[1];
    var _g = useState('100'), customPageSize = _g[0], setCustomPageSize = _g[1];
    var _h = useState(false), showDeleteConfirm = _h[0], setShowDeleteConfirm = _h[1];
    var _j = useState(false), showExportModal = _j[0], setShowExportModal = _j[1];
    useEffect(function () {
        loadInvoices();
    }, [filters]);
    var loadInvoices = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, InvoiceAPI.getInvoices(filters)];
                case 1:
                    response = _a.sent();
                    setInvoices(response.items);
                    setPagination({
                        page: response.page,
                        size: response.size,
                        total: response.total,
                        total_pages: response.total_pages
                    });
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    showToast(error_1.message || 'Error al cargar las facturas', 'error');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFilterChange = function (key, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a.page = 1 // Reset to first page when filtering
            , _a)));
        });
    };
    var handlePageChange = function (page) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { page: page })); });
    };
    var handlePageSizeChange = function (newSize) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { size: newSize, page: 1 // Reset to first page when changing page size
         })); });
        setCustomPageSize(String(newSize));
    };
    var handleSelectInvoice = function (invoiceId, selected) {
        if (selected) {
            setSelectedInvoices(function (prev) { return __spreadArray(__spreadArray([], prev, true), [invoiceId], false); });
        }
        else {
            setSelectedInvoices(function (prev) { return prev.filter(function (id) { return id !== invoiceId; }); });
        }
    };
    var handleSelectAll = function (selected) {
        if (selected) {
            setSelectedInvoices(invoices.map(function (inv) { return inv.id; }));
        }
        else {
            setSelectedInvoices([]);
        }
    };
    var handleBulkAction = function (action) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedInvoices.length === 0) {
                        showToast('Selecciona al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setActionLoading(true);
                    result = void 0;
                    if (!(action === 'post')) return [3 /*break*/, 3];
                    return [4 /*yield*/, InvoiceAPI.bulkPostInvoices({
                            invoice_ids: selectedInvoices
                        })];
                case 2:
                    result = _a.sent();
                    showToast("".concat(result.successful, " facturas contabilizadas"), 'success');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, InvoiceAPI.bulkCancelInvoices({
                        invoice_ids: selectedInvoices
                    })];
                case 4:
                    result = _a.sent();
                    showToast("".concat(result.successful, " facturas canceladas"), 'success');
                    _a.label = 5;
                case 5:
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " facturas fallaron: ").concat(result.failed_items.map(function (f) { return f.error; }).join(', ')), 'warning');
                    }
                    setSelectedInvoices([]);
                    loadInvoices();
                    return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    showToast(error_2.message || 'Error en la operación masiva', 'error');
                    return [3 /*break*/, 8];
                case 7:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleBulkReset = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedInvoices.length === 0) {
                        showToast('Selecciona al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.bulkResetToDraftInvoices({
                            invoice_ids: selectedInvoices
                        })];
                case 2:
                    result = _a.sent();
                    if (result.successful > 0) {
                        showToast("".concat(result.successful, " factura").concat(result.successful !== 1 ? 's' : '', " restablecida").concat(result.successful !== 1 ? 's' : '', " a borrador"), 'success');
                    }
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " factura").concat(result.failed !== 1 ? 's' : '', " no se pudieron restablecer: ").concat(result.failed_items.map(function (f) { return f.error; }).join(', ')), 'warning');
                    }
                    setSelectedInvoices([]);
                    loadInvoices();
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    showToast(error_3.message || 'Error al restablecer facturas a borrador', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleBulkDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (selectedInvoices.length === 0) {
                showToast('Selecciona al menos una factura', 'warning');
                return [2 /*return*/];
            }
            // Mostrar modal de confirmación
            setShowDeleteConfirm(true);
            return [2 /*return*/];
        });
    }); };
    var confirmBulkDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    setShowDeleteConfirm(false);
                    return [4 /*yield*/, InvoiceAPI.bulkDeleteInvoices({
                            invoice_ids: selectedInvoices,
                            confirmation: 'CONFIRM_DELETE',
                            reason: 'Eliminación bulk desde listado de facturas'
                        })];
                case 1:
                    result = _c.sent();
                    console.log('✅ Respuesta exitosa del backend:', result);
                    if (result.successful > 0) {
                        showToast("".concat(result.successful, " factura").concat(result.successful !== 1 ? 's' : '', " eliminada").concat(result.successful !== 1 ? 's' : ''), 'success');
                    }
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " factura").concat(result.failed !== 1 ? 's' : '', " no se pudieron eliminar: ").concat(result.failed_items.map(function (f) { return f.error; }).join(', ')), 'warning');
                    }
                    if (result.skipped > 0) {
                        showToast("".concat(result.skipped, " factura").concat(result.skipped !== 1 ? 's' : '', " omitida").concat(result.skipped !== 1 ? 's' : '', " (no est\u00E1n en estado DRAFT)"), 'info');
                    }
                    setSelectedInvoices([]);
                    loadInvoices();
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _c.sent();
                    console.log('❌ Error del backend:', error_4);
                    console.log('❌ Error response:', error_4.response);
                    console.log('❌ Error data:', (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data);
                    console.log('❌ Error status:', (_b = error_4.response) === null || _b === void 0 ? void 0 : _b.status);
                    showToast(error_4.message || 'Error al eliminar facturas', 'error');
                    return [3 /*break*/, 4];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBulkExport = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (format) {
            var fileName, blob, error_5;
            if (format === void 0) { format = 'xlsx'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (selectedInvoices.length === 0) {
                            showToast('Selecciona al menos una factura para exportar', 'warning');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        setActionLoading(true);
                        fileName = ExportService.generateFileName('facturas', format);
                        return [4 /*yield*/, ExportService.exportByIds({
                                table: 'invoices',
                                format: format,
                                ids: selectedInvoices,
                                file_name: fileName
                            })];
                    case 2:
                        blob = _a.sent();
                        ExportService.downloadBlob(blob, fileName);
                        showToast("".concat(selectedInvoices.length, " factura").concat(selectedInvoices.length !== 1 ? 's' : '', " exportada").concat(selectedInvoices.length !== 1 ? 's' : '', " correctamente"), 'success');
                        return [3 /*break*/, 5];
                    case 3:
                        error_5 = _a.sent();
                        showToast(error_5.message || 'Error al exportar facturas', 'error');
                        return [3 /*break*/, 5];
                    case 4:
                        setActionLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    var handleShowExportModal = function () {
        if (selectedInvoices.length === 0) {
            showToast('Selecciona al menos una factura para exportar', 'warning');
            return;
        }
        setShowExportModal(true);
    };
    var getStatusBadge = function (status) {
        switch (status) {
            case 'DRAFT':
                return <Badge variant="subtle">📝 Borrador</Badge>;
            case 'POSTED':
                return <Badge variant="subtle" color="green">✅ Contabilizada</Badge>;
            case 'CANCELLED':
                return <Badge variant="subtle">❌ Cancelada</Badge>;
            default:
                return <Badge variant="subtle">{status}</Badge>;
        }
    };
    var getTypeBadge = function (type) {
        switch (type) {
            case 'CUSTOMER_INVOICE':
                return <Badge variant="subtle">📄 Venta</Badge>;
            case 'SUPPLIER_INVOICE':
                return <Badge variant="subtle">📋 Compra</Badge>;
            case 'CREDIT_NOTE':
                return <Badge variant="subtle">💳 N. Crédito</Badge>;
            case 'DEBIT_NOTE':
                return <Badge variant="subtle">📊 N. Débito</Badge>;
            default:
                return <Badge variant="subtle">{type}</Badge>;
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Facturas
          </h1>
          <p className="text-gray-600">
            Gestión de facturas con flujo Odoo
          </p>
        </div>
          <div className="flex space-x-2">
          <Button variant="primary" onClick={function () { return navigate('/invoices/new'); }}>
            <PlusIcon className="h-4 w-4 mr-2"/>
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400"/>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Buscar facturas..." value={filters.search || ''} onChange={function (e) { return handleFilterChange('search', e.target.value); }}/>
            
            <select value={filters.status || ''} onChange={function (e) { return handleFilterChange('status', e.target.value || undefined); }} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos los estados</option>
              <option value={InvoiceStatusEnum.DRAFT}>Borrador</option>
              <option value={InvoiceStatusEnum.POSTED}>Contabilizada</option>
              <option value={InvoiceStatusEnum.CANCELLED}>Cancelada</option>
            </select>
            
            <select value={filters.invoice_type || ''} onChange={function (e) { return handleFilterChange('invoice_type', e.target.value || undefined); }} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos los tipos</option>
              <option value={InvoiceTypeEnum.CUSTOMER_INVOICE}>Venta</option>
              <option value={InvoiceTypeEnum.SUPPLIER_INVOICE}>Compra</option>
              <option value={InvoiceTypeEnum.CREDIT_NOTE}>N. Crédito</option>
              <option value={InvoiceTypeEnum.DEBIT_NOTE}>N. Débito</option>
            </select>
            
            <Input type="date" placeholder="Fecha desde" value={filters.date_from || ''} onChange={function (e) { return handleFilterChange('date_from', e.target.value || undefined); }}/>
            
            <Input type="date" placeholder="Fecha hasta" value={filters.date_to || ''} onChange={function (e) { return handleFilterChange('date_to', e.target.value || undefined); }}/>
          </div>        </div>      </Card>      {/* Acciones masivas - Fijo al hacer scroll */}
      {selectedInvoices.length > 0 && (<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1100]">
          <Card className="px-6 py-4 shadow-2xl border-2 border-blue-300 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between space-x-6">
              <span className="text-sm font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                {selectedInvoices.length} factura{selectedInvoices.length !== 1 ? 's' : ''} seleccionada{selectedInvoices.length !== 1 ? 's' : ''}
              </span>
              
              <div className="flex items-center space-x-3">
                <DropdownMenu trigger={<Button variant="primary" size="sm" disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2">
                      <EllipsisVerticalIcon className="h-4 w-4 mr-2"/>
                      Acciones
                    </Button>}>
                  <DropdownItem onClick={function () { return handleBulkAction('post'); }} icon={<CheckCircleIcon className="h-4 w-4"/>} disabled={actionLoading}>
                    Contabilizar
                  </DropdownItem>
                  <DropdownItem onClick={function () { return handleBulkAction('cancel'); }} icon={<XCircleIcon className="h-4 w-4"/>} variant="danger" disabled={actionLoading}>
                    Cancelar
                  </DropdownItem>                  <DropdownItem onClick={handleBulkReset} icon={<ArrowPathIcon className="h-4 w-4"/>} disabled={actionLoading}>
                    Restablecer a Borrador
                  </DropdownItem>                  <DropdownItem onClick={handleShowExportModal} icon={<ArrowDownTrayIcon className="h-4 w-4"/>} disabled={actionLoading}>
                    Exportar
                  </DropdownItem>
                  <DropdownItem onClick={handleBulkDelete} icon={<TrashIcon className="h-4 w-4"/>} variant="danger" disabled={actionLoading}>
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
                
                <Button variant="outline" size="sm" onClick={function () { return setSelectedInvoices([]); }} className="bg-white hover:bg-gray-50 border-gray-300">
                  Limpiar
                </Button>
              </div>
            </div>
          </Card>
        </div>)}

      {/* Lista de facturas */}
      <Card>
        {loading ? (<div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg"/>
          </div>) : invoices.length === 0 ? (<div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              📄 No hay facturas
            </div>
            <p className="text-gray-600 mb-4">
              No se encontraron facturas con los filtros seleccionados
            </p>            <Button onClick={function () { return navigate('/invoices/new'); }} variant="primary">
              Crear primera factura
            </Button>
          </div>) : (<div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selectedInvoices.length === invoices.length} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300"/>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map(function (invoice) { return (<tr key={invoice.id} className={"hover:bg-gray-50 cursor-pointer transition-colors ".concat(selectedInvoices.includes(invoice.id) ? 'bg-blue-50' : '')} onClick={function () { return navigate("/invoices/".concat(invoice.id)); }}>
                    <td className="px-4 py-4" onClick={function (e) { return e.stopPropagation(); }}>
                      <input type="checkbox" checked={selectedInvoices.includes(invoice.id)} onChange={function (e) { return handleSelectInvoice(invoice.id, e.target.checked); }} className="rounded border-gray-300"/>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(invoice.invoice_type)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(invoice.invoice_date)}
                    </td>                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                  </tr>); })}
              </tbody>
            </table>
          </div>)}          {/* Paginación mejorada */}
        {invoices.length > 0 && (<div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.size) + 1} a{' '}
                  {Math.min(pagination.page * pagination.size, pagination.total)} de{' '}
                  {pagination.total} resultados
                </span>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Por página:</label>
                  <select value={customPageSize} onChange={function (e) { return handlePageSizeChange(Number(e.target.value)); }} className="rounded border-gray-300 text-sm">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                </div>
              </div>
                {pagination.total_pages > 1 && (<div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={function () { return handlePageChange(1); }} title="Primera página">
                    <ChevronLeftIcon className="h-4 w-4"/>
                    <ChevronLeftIcon className="h-4 w-4 -ml-2"/>
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={function () { return handlePageChange(pagination.page - 1); }} title="Página anterior">
                    <ChevronLeftIcon className="h-4 w-4"/>
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded">
                    {pagination.page} de {pagination.total_pages}
                  </span>
                  
                  <Button variant="outline" size="sm" disabled={pagination.page >= pagination.total_pages} onClick={function () { return handlePageChange(pagination.page + 1); }} title="Página siguiente">
                    <ChevronRightIcon className="h-4 w-4"/>
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled={pagination.page >= pagination.total_pages} onClick={function () { return handlePageChange(pagination.total_pages); }} title="Última página">
                    <ChevronRightIcon className="h-4 w-4"/>
                    <ChevronRightIcon className="h-4 w-4 -ml-2"/>
                  </Button>
                </div>)}
              
              {pagination.total_pages === 1 && (<span className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded">
                  Página 1 de 1
                </span>)}
            </div>
          </div>)}
      </Card>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog open={showDeleteConfirm} onClose={function () { return setShowDeleteConfirm(false); }} onConfirm={confirmBulkDelete} title="Eliminar Facturas" description={"\u00BFEst\u00E1s seguro de que quieres eliminar ".concat(selectedInvoices.length, " factura").concat(selectedInvoices.length !== 1 ? 's' : '', "? Esta acci\u00F3n no se puede deshacer.")} confirmText="Eliminar" cancelText="Cancelar" confirmButtonClass="bg-red-600 hover:bg-red-700" loading={actionLoading}/>

      {/* Modal de selección de formato de exportación */}
      <ExportFormatModal open={showExportModal} onClose={function () { return setShowExportModal(false); }} onExport={handleBulkExport} title="Exportar Facturas" description={"Selecciona el formato para exportar ".concat(selectedInvoices.length, " factura").concat(selectedInvoices.length !== 1 ? 's' : '', " seleccionada").concat(selectedInvoices.length !== 1 ? 's' : '', ".")} loading={actionLoading}/>
    </div>);
}
