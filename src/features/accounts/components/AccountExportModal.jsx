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
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
import { ACCOUNT_TYPE_LABELS } from '../types';
export var AccountExportModal = function (_a) {
    var accounts = _a.accounts, isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.title, title = _b === void 0 ? 'Exportar Cuentas' : _b;
    var _c = useState(new Set()), selectedAccounts = _c[0], setSelectedAccounts = _c[1];
    var _d = useState(false), selectAll = _d[0], setSelectAll = _d[1];
    var _e = useState('csv'), exportFormat = _e[0], setExportFormat = _e[1];
    var _f = useState(false), isExporting = _f[0], setIsExporting = _f[1];
    var _g = useState(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = useState('all'), activeFilter = _h[0], setActiveFilter = _h[1];
    var _j = useState(''), typeFilter = _j[0], setTypeFilter = _j[1];
    var _k = useToast(), success = _k.success, showError = _k.error;
    // Filtrar cuentas por término de búsqueda y filtros
    var filteredAccounts = useMemo(function () {
        return accounts.filter(function (account) {
            var _a;
            var matchesSearch = searchTerm === '' ||
                account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ((_a = account.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase()));
            var matchesActiveFilter = activeFilter === 'all' ||
                (activeFilter === 'active' && account.is_active) ||
                (activeFilter === 'inactive' && !account.is_active);
            var matchesTypeFilter = typeFilter === '' || account.account_type === typeFilter;
            return matchesSearch && matchesActiveFilter && matchesTypeFilter;
        });
    }, [accounts, searchTerm, activeFilter, typeFilter]);
    // Estadísticas de cuentas seleccionadas
    var selectedStats = useMemo(function () {
        var selected = accounts.filter(function (account) { return selectedAccounts.has(account.id); });
        var byType = selected.reduce(function (acc, account) {
            acc[account.account_type] = (acc[account.account_type] || 0) + 1;
            return acc;
        }, {});
        return {
            total: selected.length,
            active: selected.filter(function (a) { return a.is_active; }).length,
            inactive: selected.filter(function (a) { return !a.is_active; }).length,
            byType: byType
        };
    }, [accounts, selectedAccounts]);
    // Manejar selección individual
    var handleAccountSelect = useCallback(function (accountId, checked) {
        var newSelected = new Set(selectedAccounts);
        if (checked) {
            newSelected.add(accountId);
        }
        else {
            newSelected.delete(accountId);
        }
        setSelectedAccounts(newSelected);
        // Actualizar estado de "seleccionar todo"
        setSelectAll(newSelected.size === filteredAccounts.length && filteredAccounts.length > 0);
    }, [selectedAccounts, filteredAccounts.length]);
    // Manejar selección de todas las cuentas filtradas
    var handleSelectAll = useCallback(function (checked) {
        if (checked) {
            var allFilteredIds = new Set(__spreadArray(__spreadArray([], selectedAccounts, true), filteredAccounts.map(function (account) { return account.id; }), true));
            setSelectedAccounts(allFilteredIds);
        }
        else {
            var filteredIds_1 = new Set(filteredAccounts.map(function (account) { return account.id; }));
            var newSelected = new Set(__spreadArray([], selectedAccounts, true).filter(function (id) { return !filteredIds_1.has(id); }));
            setSelectedAccounts(newSelected);
        }
        setSelectAll(checked);
    }, [filteredAccounts, selectedAccounts]);
    // Seleccionar solo cuentas activas
    var handleSelectActiveOnly = useCallback(function () {
        var activeIds = new Set(accounts.filter(function (account) { return account.is_active; }).map(function (account) { return account.id; }));
        setSelectedAccounts(activeIds);
        setSelectAll(false);
        success("\u2705 Seleccionadas ".concat(activeIds.size, " cuentas activas"));
    }, [accounts, success]);
    // Seleccionar por tipo de cuenta
    var handleSelectByType = useCallback(function (accountType) {
        var typeIds = new Set(accounts.filter(function (account) { return account.account_type === accountType; }).map(function (account) { return account.id; }));
        setSelectedAccounts(typeIds);
        setSelectAll(false);
        success("\u2705 Seleccionadas ".concat(typeIds.size, " cuentas de tipo ").concat(ACCOUNT_TYPE_LABELS[accountType]));
    }, [accounts, success]);
    // Exportar cuentas seleccionadas
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var selectedIds, blob, timestamp, fileName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedAccounts.size === 0) {
                        showError('Debe seleccionar al menos una cuenta para exportar');
                        return [2 /*return*/];
                    }
                    setIsExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    selectedIds = Array.from(selectedAccounts);
                    return [4 /*yield*/, AccountService.exportAccounts(selectedIds, exportFormat)];
                case 2:
                    blob = _a.sent();
                    timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                    fileName = "cuentas_".concat(selectedAccounts.size, "_registros_").concat(timestamp, ".").concat(exportFormat);
                    // Descargar archivo
                    ExportService.downloadBlob(blob, fileName);
                    success("\u2705 Se exportaron ".concat(selectedAccounts.size, " cuenta").concat(selectedAccounts.size === 1 ? '' : 's', " exitosamente en formato ").concat(exportFormat.toUpperCase()));
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al exportar cuentas:', error_1);
                    showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Obtener descripción del formato
    var getFormatInfo = function (format) {
        var formats = {
            csv: {
                icon: '📊',
                name: 'CSV',
                description: 'Compatible con Excel',
                detail: 'Archivo separado por comas, ideal para análisis'
            },
            json: {
                icon: '🔧',
                name: 'JSON',
                description: 'Para APIs y sistemas',
                detail: 'Formato estructurado para integraciones'
            },
            xlsx: {
                icon: '📗',
                name: 'Excel',
                description: 'Archivo nativo de Excel',
                detail: 'Mantiene formato y fórmulas'
            }
        };
        return formats[format];
    };
    // Limpiar selección
    var handleClearSelection = useCallback(function () {
        setSelectedAccounts(new Set());
        setSelectAll(false);
        success('🧹 Selección limpiada');
    }, [success]);
    // Limpiar filtros y selección al cerrar
    var handleClose = function () {
        setSelectedAccounts(new Set());
        setSelectAll(false);
        setSearchTerm('');
        setActiveFilter('all');
        setTypeFilter('');
        onClose();
    };
    if (!isOpen)
        return null;
    return (
    // Portal de máximo z-index
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop oscuro con blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}/>
      
      {/* Contenedor del modal centrado */}
      <div className="relative z-[999999] h-full flex items-center justify-center p-6">
        {/* Modal principal */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={function (e) { return e.stopPropagation(); }}>
          {/* Header fijo */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">📊</span>
                {title}
              </h2>
              <p className="text-blue-100 mt-1">
                Selecciona las cuentas que deseas exportar y el formato preferido
              </p>
            </div>
            <button onClick={handleClose} disabled={isExporting} className="text-blue-100 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Contenido principal con scroll */}
          <div className="flex-1 min-h-0 flex flex-col">
            
            {/* Configuración - Fija */}
            <div className="p-6 border-b bg-gray-50 flex-shrink-0">
              {/* Selección de formato */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Formato de Exportación</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['csv', 'json', 'xlsx'].map(function (format) {
            var formatInfo = getFormatInfo(format);
            return (<label key={format} className={"flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ".concat(exportFormat === format
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                        <input type="radio" name="format" value={format} checked={exportFormat === format} onChange={function (e) { return setExportFormat(e.target.value); }} disabled={isExporting} className="sr-only"/>
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-2xl">{formatInfo.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{formatInfo.name}</div>
                            <div className="text-sm text-gray-600">{formatInfo.description}</div>
                          </div>
                        </div>
                      </label>);
        })}
                </div>
              </div>

              {/* Filtros */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input type="text" placeholder="Buscar por código, nombre o descripción..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} disabled={isExporting} className="w-full"/>
                  </div>
                  <div>
                    <select value={activeFilter} onChange={function (e) { return setActiveFilter(e.target.value); }} disabled={isExporting} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">Todas las cuentas</option>
                      <option value="active">Solo activas</option>
                      <option value="inactive">Solo inactivas</option>
                    </select>
                  </div>
                  <div>
                    <select value={typeFilter} onChange={function (e) { return setTypeFilter(e.target.value); }} disabled={isExporting} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Todos los tipos</option>
                      {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                          {label}
                        </option>);
        })}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            {selectedAccounts.size > 0 && (<div className="px-6 py-3 bg-blue-50 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedStats.total} cuenta{selectedStats.total === 1 ? '' : 's'} seleccionada{selectedStats.total === 1 ? '' : 's'}
                  </span>
                  <div className="flex gap-4 text-xs text-blue-700">
                    <span>{selectedStats.active} activas</span>
                    <span>{selectedStats.inactive} inactivas</span>
                  </div>
                </div>
              </div>)}

            {/* Controles de selección */}
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cuentas ({filteredAccounts.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={handleSelectActiveOnly} disabled={isExporting}>
                    Seleccionar Activas
                  </Button>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={selectAll && filteredAccounts.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} disabled={isExporting || filteredAccounts.length === 0} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>                    
                    <span className="text-sm font-medium">
                      {selectAll && filteredAccounts.length > 0 ? "".concat(selectedAccounts.size, " seleccionadas") : "Seleccionar todas"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Selección rápida por tipo */}
              <div className="mt-4">
                <span className="text-sm text-gray-600 mr-3">Selección rápida:</span>
                <div className="inline-flex gap-2 flex-wrap">
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var type = _a[0], label = _a[1];
            var count = accounts.filter(function (acc) { return acc.account_type === type; }).length;
            if (count === 0)
                return null;
            return (<Button key={type} variant="ghost" size="sm" onClick={function () { return handleSelectByType(type); }} disabled={isExporting} className="text-xs">
                        {label} ({count})
                      </Button>);
        })}
                </div>
              </div>
            </div>

            {/* Lista de cuentas - Con scroll independiente */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {filteredAccounts.length === 0 ? (<div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron cuentas</p>
                    <p className="text-gray-400">Ajusta los filtros para ver más resultados</p>
                  </div>) : (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAccounts.map(function (account) { return (<label key={account.id} className={"flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ".concat(selectedAccounts.has(account.id)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                        <input type="checkbox" checked={selectedAccounts.has(account.id)} onChange={function (e) { return handleAccountSelect(account.id, e.target.checked); }} disabled={isExporting} className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 font-semibold">
                              {account.code}
                            </code>
                            <span className={"text-xs px-2 py-1 rounded-full font-medium ".concat(account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                              {account.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900 mb-1">
                            {account.name}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {ACCOUNT_TYPE_LABELS[account.account_type]}
                            </span>
                            <span>Nivel {account.level}</span>
                            {account.allows_movements && <span>Permite movimientos</span>}
                          </div>
                          {account.description && (<p className="text-sm text-gray-500 mt-1 truncate">
                              {account.description}
                            </p>)}
                        </div>
                      </label>); })}
                  </div>)}
              </div>
            </div>
          </div>

          {/* Footer fijo */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedAccounts.size > 0 ? (<span className="font-medium text-blue-600">
                    {selectedAccounts.size} cuenta{selectedAccounts.size === 1 ? '' : 's'} seleccionada{selectedAccounts.size === 1 ? '' : 's'}
                  </span>) : ('Selecciona al menos una cuenta para continuar')}
              </span>
              {selectedAccounts.size > 0 && (<Button variant="ghost" size="sm" onClick={handleClearSelection} disabled={isExporting}>
                  Limpiar selección
                </Button>)}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleClose} disabled={isExporting}>
                Cancelar
              </Button>
              <Button onClick={handleExport} disabled={selectedAccounts.size === 0 || isExporting} className="min-w-[120px]">
                {isExporting ? (<div className="flex items-center gap-2">
                    <Spinner size="sm"/>
                    <span>Exportando...</span>
                  </div>) : (<div className="flex items-center gap-2">
                    <span>{getFormatInfo(exportFormat).icon}</span>
                    <span>Exportar {exportFormat.toUpperCase()}</span>
                  </div>)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
