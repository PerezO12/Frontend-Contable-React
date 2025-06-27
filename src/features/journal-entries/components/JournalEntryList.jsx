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
import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntries } from '../hooks';
import { useJournalEntryListListener } from '../hooks/useJournalEntryEvents';
import { JournalEntryService } from '../services';
import { SimpleJournalEntryExportControls } from './SimpleJournalEntryExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { BulkStatusChanger } from './BulkStatusChanger';
import { formatCurrency } from '../../../shared/utils';
import { JournalEntryType, JournalEntryStatus, JOURNAL_ENTRY_TYPE_LABELS, JOURNAL_ENTRY_STATUS_LABELS, TransactionOriginLabels, getTransactionOriginColor } from '../types';
export var JournalEntryList = function (_a) {
    var onEntrySelect = _a.onEntrySelect, onCreateEntry = _a.onCreateEntry, initialFilters = _a.initialFilters;
    var _b = useState(initialFilters || {}), filters = _b[0], setFilters = _b[1];
    var _c = useState(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = useState(new Set()), selectedEntries = _d[0], setSelectedEntries = _d[1];
    var _e = useState(false), selectAll = _e[0], setSelectAll = _e[1];
    var _f = useState(false), showBulkDeleteModal = _f[0], setShowBulkDeleteModal = _f[1];
    // Estado para el filtro de múltiples orígenes de transacción
    var _g = useState(new Set(filters.transaction_origin || [])), selectedTransactionOrigins = _g[0], setSelectedTransactionOrigins = _g[1];
    // Obtener funcionalidad del hook
    var _h = useJournalEntries(initialFilters), entries = _h.entries, pagination = _h.pagination, loading = _h.loading, error = _h.error, refetch = _h.refetch, refetchWithFilters = _h.refetchWithFilters, searchEntries = _h.searchEntries, validateDeletion = _h.validateDeletion, bulkDeleteEntries = _h.bulkDeleteEntries;
    // Escuchar eventos de cambios en asientos contables para actualización en tiempo real
    useJournalEntryListListener(function (event) {
        // Solo refrescamos para eventos específicos que realmente requieren actualización de la lista
        // Excluimos 'deleted' porque ya actualizamos el estado local en bulkDeleteEntries
        if (['approved', 'posted', 'cancelled', 'reversed'].includes(event.type)) {
            refetch(); // Sin pasar filtros para usar el estado interno del hook
        }
    });
    // Función para calcular el estado de vencimiento
    var calculateDueStatus = function (entry) {
        // Si está contabilizado (posted), consideramos que está pagado
        if (entry.status === JournalEntryStatus.POSTED) {
            return { type: 'paid', message: 'Pagado', className: 'text-green-600' };
        } // Buscar fechas de vencimiento disponibles
        var dueDates = [];
        // Agregar fecha de vencimiento del entry principal si existe
        if (entry.earliest_due_date) {
            dueDates.push(new Date(entry.earliest_due_date));
        }
        // Si hay líneas disponibles, agregar sus fechas de vencimiento
        if (entry.lines && entry.lines.length > 0) {
            var lineDueDates = entry.lines
                .map(function (line) { return line.due_date || line.effective_due_date; })
                .filter(Boolean)
                .map(function (date) { return new Date(date); });
            dueDates.push.apply(dueDates, lineDueDates);
        }
        if (dueDates.length === 0) {
            return { type: 'no-date', message: '-', className: 'text-gray-400' };
        }
        var earliestDueDate = new Date(Math.min.apply(Math, dueDates.map(function (d) { return d.getTime(); })));
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        earliestDueDate.setHours(0, 0, 0, 0);
        var diffTime = earliestDueDate.getTime() - today.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            // Atrasado
            var daysOverdue = Math.abs(diffDays);
            return {
                type: 'overdue',
                message: "".concat(daysOverdue, " d\u00EDa").concat(daysOverdue !== 1 ? 's' : '', " atrasado").concat(daysOverdue !== 1 ? 's' : ''),
                className: 'text-red-600 font-medium'
            };
        }
        else if (diffDays === 0) {
            return {
                type: 'due-today',
                message: 'Vence hoy',
                className: 'text-orange-600 font-medium'
            };
        }
        else {
            return {
                type: 'pending',
                message: "".concat(diffDays, " d\u00EDa").concat(diffDays !== 1 ? 's' : '', " restante").concat(diffDays !== 1 ? 's' : ''),
                className: 'text-blue-600'
            };
        }
    };
    // Filtrar entradas basadas en el término de búsqueda
    var filteredEntries = useMemo(function () {
        if (!searchTerm)
            return entries;
        var term = searchTerm.toLowerCase();
        return entries.filter(function (entry) {
            var _a, _b;
            return entry.number.toLowerCase().includes(term) ||
                entry.description.toLowerCase().includes(term) ||
                ((_a = entry.reference) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term)) ||
                ((_b = entry.created_by_name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(term));
        });
    }, [entries, searchTerm]);
    var handleFilterChange = function (key, value) {
        var _a;
        var newFilters = __assign(__assign({}, filters), (_a = {}, _a[key] = value, _a));
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    // Manejar selección de origen de transacción (múltiple selección)
    var handleTransactionOriginToggle = function (origin) {
        var newSelected = new Set(selectedTransactionOrigins);
        if (newSelected.has(origin)) {
            newSelected.delete(origin);
        }
        else {
            newSelected.add(origin);
        }
        setSelectedTransactionOrigins(newSelected);
        var newFilters = __assign(__assign({}, filters), { transaction_origin: newSelected.size > 0 ? Array.from(newSelected) : undefined });
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    // Limpiar filtros de origen de transacción
    var clearTransactionOriginFilter = function () {
        setSelectedTransactionOrigins(new Set());
        var newFilters = __assign(__assign({}, filters), { transaction_origin: undefined });
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    var handleSearch = function () {
        if (searchTerm.trim()) {
            searchEntries(searchTerm, filters);
        }
        else {
            refetchWithFilters(filters);
        }
    };
    // Manejar selección individual de asientos
    var handleEntrySelect = function (entryId, checked) {
        var newSelected = new Set(selectedEntries);
        if (checked) {
            newSelected.add(entryId);
        }
        else {
            newSelected.delete(entryId);
        }
        setSelectedEntries(newSelected);
        // Actualizar estado de "seleccionar todo"
        setSelectAll(newSelected.size === filteredEntries.length && filteredEntries.length > 0);
    };
    // Manejar selección de todos los asientos
    var handleSelectAll = function (checked) {
        if (checked) {
            var allIds = new Set(filteredEntries.map(function (entry) { return entry.id; }));
            setSelectedEntries(allIds);
        }
        else {
            setSelectedEntries(new Set());
        }
        setSelectAll(checked);
    };
    // Limpiar selección  
    var handleClearSelection = function () {
        setSelectedEntries(new Set());
        setSelectAll(false);
    };
    // Abrir modal de eliminación masiva
    var handleBulkDelete = function () {
        setShowBulkDeleteModal(true);
    };
    var handleBulkDeleteSuccess = function () {
        setShowBulkDeleteModal(false);
        handleClearSelection();
    }; // Función para cambio de estado masivo
    var handleBulkStatusChange = function (entryIds, newStatus, reason, forceOperation) { return __awaiter(void 0, void 0, void 0, function () {
        var result, reverseData, reverseResult, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    console.log("Cambiando ".concat(entryIds.length, " asientos al estado/operaci\u00F3n ").concat(newStatus), reason ? "con raz\u00F3n: ".concat(reason) : '', forceOperation ? "(force_operation: ".concat(forceOperation, ")") : '');
                    result = void 0;
                    if (!(newStatus === 'REVERSE')) return [3 /*break*/, 2];
                    reverseData = {
                        journal_entry_ids: entryIds,
                        reason: reason || 'Reversión masiva desde interfaz',
                        reversal_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                        force_reverse: forceOperation || false
                    };
                    return [4 /*yield*/, JournalEntryService.bulkReverseEntries(reverseData)];
                case 1:
                    reverseResult = _b.sent();
                    // Transform result to match expected format
                    result = {
                        total_requested: reverseResult.total_requested,
                        total_updated: reverseResult.total_reversed,
                        total_failed: reverseResult.total_failed,
                        successful_entries: [], // Simplificado para evitar errores de tipo
                        failed_entries: ((_a = reverseResult.failed_entries) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                            var _a;
                            return ({
                                id: item.journal_entry_id || 'unknown',
                                error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                            });
                        })) || []
                    };
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, JournalEntryService.bulkChangeStatus(entryIds, newStatus, reason, forceOperation)];
                case 3:
                    // Cambio de estado normal - pasar forceOperation para todas las operaciones
                    result = _b.sent();
                    _b.label = 4;
                case 4:
                    console.log('Resultado del cambio de estado/operación:', result);
                    // Refrescar la lista después del cambio exitoso
                    refetch();
                    return [2 /*return*/, result];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error al cambiar estado masivo:', error_1);
                    // Re-lanzar el error para que lo maneje el componente BulkStatusChanger
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var getStatusColor = function (status) {
        var _a;
        var colors = (_a = {},
            _a[JournalEntryStatus.DRAFT] = 'bg-gray-100 text-gray-800',
            _a[JournalEntryStatus.PENDING] = 'bg-yellow-100 text-yellow-800',
            _a[JournalEntryStatus.APPROVED] = 'bg-blue-100 text-blue-800',
            _a[JournalEntryStatus.POSTED] = 'bg-green-100 text-green-800',
            _a[JournalEntryStatus.CANCELLED] = 'bg-red-100 text-red-800',
            _a);
        return colors[status];
    };
    var getTypeColor = function (type) {
        var _a;
        var colors = (_a = {},
            _a[JournalEntryType.MANUAL] = 'bg-blue-100 text-blue-800',
            _a[JournalEntryType.AUTOMATIC] = 'bg-purple-100 text-purple-800',
            _a[JournalEntryType.ADJUSTMENT] = 'bg-orange-100 text-orange-800',
            _a[JournalEntryType.OPENING] = 'bg-green-100 text-green-800',
            _a[JournalEntryType.CLOSING] = 'bg-red-100 text-red-800',
            _a[JournalEntryType.REVERSAL] = 'bg-yellow-100 text-yellow-800',
            _a);
        return colors[type];
    };
    if (error) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los asientos contables: {error}</p>
          <Button onClick={function () { return refetchWithFilters(filters); }}>
            Reintentar
          </Button>
        </div>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Header con acciones principales */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Asientos Contables</h2>
              <p className="text-sm text-gray-600 mt-1">
                {pagination.total} asiento{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}              </p>
            </div>
            {onCreateEntry && (<Button onClick={onCreateEntry} className="bg-blue-600 hover:bg-blue-700">
                + Nuevo Asiento
              </Button>)}
          </div>
        </div>

        <div className="card-body">          {/* Filtros y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="flex space-x-2">
                <Input placeholder="Número, descripción, referencia..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} onKeyPress={function (e) { return e.key === 'Enter' && handleSearch(); }}/>
                <Button onClick={handleSearch} variant="secondary" disabled={loading}>
                  Buscar
                </Button>
              </div>
            </div>

            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select value={filters.entry_type || ''} onChange={function (e) { return handleFilterChange('entry_type', e.target.value || undefined); }} className="form-select">
                <option value="">Todos los tipos</option>
                {Object.entries(JOURNAL_ENTRY_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                    {label}
                  </option>);
        })}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select value={filters.status || ''} onChange={function (e) { return handleFilterChange('status', e.target.value || undefined); }} className="form-select">
                <option value="">Todos los estados</option>
                {Object.entries(JOURNAL_ENTRY_STATUS_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                    {label}
                  </option>);
        })}
              </select>
            </div>
          </div>

          {/* Filtro de origen de transacción */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origen de Transacción
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TransactionOriginLabels).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<button key={value} type="button" onClick={function () { return handleTransactionOriginToggle(value); }} className={"px-3 py-1 rounded-full text-sm font-medium transition-colors ".concat(selectedTransactionOrigins.has(value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                  {label}
                </button>);
        })}
              {selectedTransactionOrigins.size > 0 && (<button type="button" onClick={clearTransactionOriginFilter} className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200">
                  Limpiar filtros
                </button>)}
            </div>
            {selectedTransactionOrigins.size > 0 && (<p className="text-xs text-gray-600 mt-1">
                {selectedTransactionOrigins.size} origen{selectedTransactionOrigins.size !== 1 ? 'es' : ''} seleccionado{selectedTransactionOrigins.size !== 1 ? 's' : ''}
              </p>)}
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <Input type="date" value={filters.date_from || ''} onChange={function (e) { return handleFilterChange('date_from', e.target.value || undefined); }}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <Input type="date" value={filters.date_to || ''} onChange={function (e) { return handleFilterChange('date_to', e.target.value || undefined); }}/>
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900">{pagination.total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Borradores</p>
              <p className="text-lg font-semibold text-blue-700">
                {entries.filter(function (e) { return e.status === JournalEntryStatus.DRAFT; }).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-lg font-semibold text-yellow-700">
                {entries.filter(function (e) { return e.status === JournalEntryStatus.PENDING; }).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Contabilizados</p>
              <p className="text-lg font-semibold text-green-700">
                {entries.filter(function (e) { return e.status === JournalEntryStatus.POSTED; }).length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-lg font-semibold text-orange-700">
                {entries.filter(function (e) { return e.status === JournalEntryStatus.APPROVED; }).length}
              </p>
            </div>
          </div>          {/* Acciones masivas */}
          {selectedEntries.size > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedEntries.size} asiento{selectedEntries.size !== 1 ? 's' : ''} seleccionado{selectedEntries.size !== 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-blue-700 hover:text-blue-900">
                    Limpiar selección
                  </Button>
                </div>

                {/* Controles de exportación, estado y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleJournalEntryExportControls selectedEntryIds={Array.from(selectedEntries)} entryCount={selectedEntries.size} onExportEnd={handleClearSelection}/>
                  <BulkStatusChanger selectedEntryIds={Array.from(selectedEntries)} onStatusChange={handleBulkStatusChange} onSuccess={handleClearSelection}/>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="border-red-300 text-red-700 hover:bg-red-100">
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>)}

          {/* Controles de selección para cuando no hay elementos seleccionados */}
          {filteredEntries.length > 0 && selectedEntries.size === 0 && (<div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <input type="checkbox" checked={selectAll} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <label className="ml-2 text-sm text-gray-700">
                  Seleccionar todos ({filteredEntries.length})
                </label>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Lista de asientos */}
      <Card>
        <div className="card-body">
          {loading ? (<div className="text-center py-8">
              <Spinner size="lg"/>
              <p className="text-gray-600 mt-2">Cargando asientos contables...</p>
            </div>) : filteredEntries.length === 0 ? (<div className="text-center py-8">
              <p className="text-gray-500">No se encontraron asientos contables</p>
              {searchTerm && (<Button variant="secondary" onClick={function () {
                    setSearchTerm('');
                    refetchWithFilters(filters);
                }} className="mt-2">
                  Limpiar búsqueda
                </Button>)}
            </div>) : (<div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-12">
                      <input type="checkbox" checked={selectAll} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </th>                    <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Origen</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>                    <th className="text-center py-3 px-4 font-medium text-gray-900">Vencimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map(function (entry) { return (<tr key={entry.id} className={"hover:bg-gray-50 ".concat(onEntrySelect ? 'cursor-pointer' : '')}>
                      <td className="py-3 px-4">
                        <input type="checkbox" checked={selectedEntries.has(entry.id)} onChange={function (e) {
                    e.stopPropagation();
                    handleEntrySelect(entry.id, e.target.checked);
                }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      </td>
                      <td className="py-3 px-4" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {entry.number}
                        </code>
                      </td>
                      <td className="py-3 px-4" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <span className="text-sm text-gray-900">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          {entry.reference && (<p className="text-sm text-gray-500">Ref: {entry.reference}</p>)}
                        </div>
                      </td>                      <td className="py-3 px-4" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getTypeColor(entry.entry_type))}>
                          {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}
                        </span>
                      </td>
                      <td className="py-3 px-4" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        {entry.transaction_origin ? (<span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getTransactionOriginColor(entry.transaction_origin))}>
                            {TransactionOriginLabels[entry.transaction_origin]}
                          </span>) : (<span className="text-xs text-gray-400">-</span>)}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <span className="font-mono text-sm text-gray-900">
                          {formatCurrency(parseFloat(entry.total_debit))}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getStatusColor(entry.status))}>
                          {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                        </span>                      </td>
                      <td className="py-3 px-4 text-center" onClick={function () { return onEntrySelect === null || onEntrySelect === void 0 ? void 0 : onEntrySelect(entry); }}>
                        {(function () {
                    var dueStatus = calculateDueStatus(entry);
                    return (<span className={"text-xs ".concat(dueStatus.className)}>
                              {dueStatus.message}
                            </span>);
                })()}
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}

          {/* Paginación */}
          {pagination.total > 0 && (<div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.pages} ({pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" disabled={!pagination.has_prev || loading} onClick={function () { return handleFilterChange('skip', Math.max(0, (pagination.page - 2) * 20)); }}>
                  Anterior
                </Button>
                <Button variant="secondary" disabled={!pagination.has_next || loading} onClick={function () { return handleFilterChange('skip', pagination.page * 20); }}>
                  Siguiente
                </Button>
              </div>
            </div>)}
        </div>
      </Card>
      
      {/* Modal de eliminación masiva */}
      <BulkDeleteModal isOpen={showBulkDeleteModal} onClose={function () { return setShowBulkDeleteModal(false); }} selectedEntryIds={Array.from(selectedEntries)} onValidate={validateDeletion} onBulkDelete={bulkDeleteEntries} onSuccess={handleBulkDeleteSuccess}/>
    </div>);
};
