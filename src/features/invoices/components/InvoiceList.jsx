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
 * Componente principal de listado de facturas
 * Implementa el flujo completo de Odoo con UI elegante y moderna
 * Incluye operaciones bulk (contabilizar, cancelar, eliminar en lote)
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useBulkInvoiceOperations } from '../hooks/useBulkInvoiceOperations';
import { InvoiceStatusConst } from '../types';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/shared/contexts/ToastContext';
import { BulkActionsBar } from './BulkActionsBar';
import { AdvancedFilters } from './AdvancedFilters';
import { PlusIcon, FunnelIcon, DocumentTextIcon, BanknotesIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, EyeIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon } from '@/shared/components/icons';
var statusConfig = {
    'DRAFT': {
        label: 'Borrador',
        color: 'gray',
        icon: DocumentTextIcon
    },
    'PENDING': {
        label: 'Pendiente',
        color: 'yellow',
        icon: ExclamationCircleIcon
    },
    'APPROVED': {
        label: 'Aprobada',
        color: 'blue',
        icon: CheckCircleIcon
    },
    'POSTED': {
        label: 'Emitida',
        color: 'green',
        icon: CheckCircleIcon
    },
    'PAID': {
        label: 'Pagada',
        color: 'emerald',
        icon: BanknotesIcon
    },
    'PARTIALLY_PAID': {
        label: 'Pago Parcial',
        color: 'orange',
        icon: BanknotesIcon
    },
    'OVERDUE': {
        label: 'Vencida',
        color: 'red',
        icon: ExclamationCircleIcon
    },
    'CANCELLED': {
        label: 'Cancelada',
        color: 'red',
        icon: XCircleIcon
    }
};
var typeConfig = {
    'CUSTOMER_INVOICE': {
        label: 'Factura Venta',
        color: 'green'
    },
    'SUPPLIER_INVOICE': {
        label: 'Factura Compra',
        color: 'blue'
    },
    'CREDIT_NOTE': { label: 'Nota Crédito',
        color: 'orange'
    },
    'DEBIT_NOTE': {
        label: 'Nota Débito',
        color: 'purple'
    }
};
export function InvoiceList() {
    var _this = this;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState(false), showFilters = _a[0], setShowFilters = _a[1];
    var _b = useState(false), deleteDialogOpen = _b[0], setDeleteDialogOpen = _b[1];
    var _c = useState(null), invoiceToDelete = _c[0], setInvoiceToDelete = _c[1];
    var _d = useInvoiceStore(), invoices = _d.invoices, loading = _d.loading, deleting = _d.deleting, pagination = _d.pagination, filters = _d.filters, error = _d.error, fetchInvoices = _d.fetchInvoices, deleteInvoice = _d.deleteInvoice, setFilters = _d.setFilters, clearFilters = _d.clearFilters, duplicateInvoice = _d.duplicateInvoice;
    // Hook para operaciones bulk
    var bulkOperations = useBulkInvoiceOperations({
        invoices: invoices || [],
        onOperationComplete: function () {
            fetchInvoices(); // Refrescar la lista después de operaciones bulk
        }
    });
    // Obtener facturas seleccionadas para información de NFE
    var selectedInvoices = (invoices || []).filter(function (invoice) {
        return bulkOperations.selectedIds.has(invoice.id);
    }).map(function (invoice) { return ({
        id: invoice.id,
        invoice_number: invoice.number,
        description: invoice.description,
        notes: invoice.notes
    }); });
    // Cargar facturas al montar el componente
    useEffect(function () {
        fetchInvoices();
    }, [fetchInvoices]);
    // Manejar cambios en filtros avanzados
    var handleFiltersChange = function (newFilters) {
        setFilters(__assign(__assign({}, newFilters), { page: 1 // Reset pagination
         }));
    };
    // Aplicar filtros
    var applyFilters = function () {
        fetchInvoices(filters);
    };
    // Limpiar filtros
    var handleClearFilters = function () {
        clearFilters();
        fetchInvoices();
    };
    // Manejar eliminación
    var handleDeleteClick = function (invoice) {
        setInvoiceToDelete(invoice);
        setDeleteDialogOpen(true);
    };
    var confirmDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!invoiceToDelete)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteInvoice(invoiceToDelete.id)];
                case 2:
                    _a.sent();
                    showToast('Factura eliminada exitosamente', 'success');
                    setDeleteDialogOpen(false);
                    setInvoiceToDelete(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    showToast('Error al eliminar la factura', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Manejar duplicación
    var handleDuplicate = function (invoice) { return __awaiter(_this, void 0, void 0, function () {
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
    // Renderizar acciones de fila
    var renderRowActions = function (invoice) { return (<div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={function () { return navigate("/invoices/".concat(invoice.id)); }} className="text-gray-600 hover:text-blue-600">
        <EyeIcon className="h-4 w-4"/>      </Button>
      
      {invoice.status === InvoiceStatusConst.DRAFT && (<Button variant="outline" size="sm" onClick={function () { return navigate("/invoices/".concat(invoice.id, "/edit")); }} className="text-gray-600 hover:text-green-600">
          <PencilIcon className="h-4 w-4"/>
        </Button>)}

      <Button variant="outline" size="sm" onClick={function () { return handleDuplicate(invoice); }} className="text-gray-600 hover:text-purple-600">
        <DocumentDuplicateIcon className="h-4 w-4"/>
      </Button>

      {invoice.status === InvoiceStatusConst.DRAFT && (<Button variant="outline" size="sm" onClick={function () { return handleDeleteClick(invoice); }} className="text-gray-600 hover:text-red-600">
          <TrashIcon className="h-4 w-4"/>
        </Button>)}
    </div>); };
    // Configurar columnas de la tabla
    var columns = [
        {
            key: 'select',
            label: 'Sel.',
            render: function (invoice) { return (<div className="flex items-center">
          <input type="checkbox" checked={bulkOperations.selectedIds.has(invoice.id)} onChange={function () { return bulkOperations.toggleSelection(invoice.id); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
        </div>); }
        },
        {
            key: 'number',
            label: 'Número',
            render: function (invoice) { return (<div className="font-medium text-gray-900">
          {invoice.number}
          {invoice.internal_reference && (<div className="text-sm text-gray-500">
              Ref: {invoice.internal_reference}
            </div>)}
        </div>); }
        },
        {
            key: 'type',
            label: 'Tipo',
            render: function (invoice) {
                var config = typeConfig[invoice.invoice_type] || {
                    label: invoice.invoice_type,
                    color: 'gray'
                };
                return (<Badge color={config.color} variant="subtle">
            {config.label}
          </Badge>);
            }
        },
        {
            key: 'third_party',
            label: 'Cliente/Proveedor',
            render: function (invoice) { return (<div>
          <div className="font-medium text-gray-900">
            {invoice.third_party_name}
          </div>
          {invoice.third_party_code && (<div className="text-sm text-gray-500">
              {invoice.third_party_code}
            </div>)}
        </div>); }
        },
        {
            key: 'dates',
            label: 'Fechas',
            render: function (invoice) { return (<div className="text-sm">
          <div>Emisión: {formatDate(invoice.invoice_date)}</div>
          <div className="text-gray-500">
            Venc: {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
          </div>
        </div>); }
        },
        {
            key: 'amount',
            label: 'Importe',
            render: function (invoice) { return (<div className="text-right">
          <div className="font-medium text-gray-900">
            {formatCurrency(invoice.total_amount)}
          </div>
          {invoice.remaining_amount > 0 && (<div className="text-sm text-red-600">
              Pendiente: {formatCurrency(invoice.remaining_amount)}
            </div>)}
        </div>); }
        },
        {
            key: 'status',
            label: 'Estado',
            render: function (invoice) {
                var config = statusConfig[invoice.status] || {
                    label: invoice.status,
                    color: 'gray',
                    icon: DocumentTextIcon
                };
                var Icon = config.icon;
                return (<Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1"/>
            {config.label}
          </Badge>);
            }
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: renderRowActions
        }
    ];
    if (loading && (!invoices || invoices.length === 0)) {
        return (<div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa del flujo de facturación tipo Odoo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4"/>
            Filtros
          </Button>
          
          <Button onClick={function () { return navigate('/invoices/new'); }} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4"/>
            Nueva Factura
          </Button>
        </div>      </div>

      {/* Barra de acciones bulk */}
      <BulkActionsBar selectedCount={bulkOperations.selectedCount} selectedInvoices={selectedInvoices} isProcessing={bulkOperations.isProcessing} validationData={bulkOperations.validationData} onValidateOperation={bulkOperations.validateOperation} onBulkPost={bulkOperations.bulkPostInvoices} onBulkCancel={bulkOperations.bulkCancelInvoices} onBulkResetToDraft={bulkOperations.bulkResetToDraftInvoices} onBulkDelete={bulkOperations.bulkDeleteInvoices} onClearSelection={bulkOperations.clearSelection}/>      {/* Filtros Avanzados */}
      {showFilters && (<AdvancedFilters filters={filters} onFiltersChange={handleFiltersChange} onApplyFilters={applyFilters} onClearFilters={handleClearFilters} loading={loading}/>)}

      {/* Tabla de facturas */}
      {error && (<div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>)}      {(!invoices || invoices.length === 0) && !loading ? (<EmptyState title="No hay facturas" description="Comienza creando tu primera factura" action={<Button onClick={function () { return navigate('/invoices/new'); }}>
              <PlusIcon className="h-4 w-4 mr-2"/>
              Nueva Factura
            </Button>}/>) : (<Card>
          {/* Tabla personalizada con bulk selection */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Header de selección múltiple */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input type="checkbox" checked={bulkOperations.selectionState.isAllSelected} ref={function (input) {
                if (input) {
                    input.indeterminate = bulkOperations.selectionState.isIndeterminate;
                }
            }} onChange={bulkOperations.toggleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </div>
                  </th>
                  {/* Headers de otras columnas */}
                  {columns.slice(1).map(function (column) { return (<th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.label}
                    </th>); })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (<tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2"/>
                        <span className="text-gray-500">Cargando facturas...</span>
                      </div>
                    </td>
                  </tr>) : ((invoices || []).map(function (invoice, index) { return (<tr key={invoice.id || index} className="hover:bg-gray-50">
                      {columns.map(function (column) { return (<td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(invoice) : invoice[column.key]}
                        </td>); })}
                    </tr>); }))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {pagination.total_pages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.page_size) + 1} a{' '}
                {Math.min(pagination.page * pagination.page_size, pagination.total)} de{' '}
                {pagination.total} facturas
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1 || loading} onClick={function () { return setFilters(__assign(__assign({}, filters), { page: pagination.page - 1 })); }}>
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.total_pages}
                </span>
                
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.total_pages || loading} onClick={function () { return setFilters(__assign(__assign({}, filters), { page: pagination.page + 1 })); }}>
                  Siguiente
                </Button>
              </div>
            </div>)}
        </Card>)}

      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog open={deleteDialogOpen} onClose={function () { return setDeleteDialogOpen(false); }} onConfirm={confirmDelete} title="Eliminar Factura" description={"\u00BFEst\u00E1s seguro de que quieres eliminar la factura ".concat(invoiceToDelete === null || invoiceToDelete === void 0 ? void 0 : invoiceToDelete.number, "? Esta acci\u00F3n no se puede deshacer.")} confirmText="Eliminar" confirmButtonClass="bg-red-600 hover:bg-red-700" loading={deleting}/>
    </div>);
}
