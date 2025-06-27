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
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccountExport } from '../hooks';
import { useToast } from '../../../shared/hooks';
import { AccountType, AccountCategory, ACCOUNT_TYPE_LABELS, ACCOUNT_CATEGORY_LABELS } from '../types';
export var AccountAdvancedExportModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = useState('csv'), exportFormat = _b[0], setExportFormat = _b[1];
    var _c = useState({
        account_type: '',
        category: '',
        is_active: '',
        search: '',
        date_from: '',
        date_to: ''
    }), filters = _c[0], setFilters = _c[1];
    var _d = useState([
        'code', 'name', 'account_type', 'category', 'balance', 'is_active'
    ]), selectedColumns = _d[0], setSelectedColumns = _d[1];
    var _e = useState([]), availableColumns = _e[0], setAvailableColumns = _e[1];
    var _f = useAccountExport({
        onSuccess: function (_, format) {
            success("Exportaci\u00F3n completada en formato ".concat(format.toUpperCase()));
            onClose();
        },
        onError: function (error) {
            showError(error);
        }
    }), isExporting = _f.isExporting, exportProgress = _f.exportProgress, exportAccountsAdvanced = _f.exportAccountsAdvanced, getExportSchema = _f.getExportSchema;
    var _g = useToast(), success = _g.success, showError = _g.error;
    var loadExportSchema = function () { return __awaiter(void 0, void 0, void 0, function () {
        var schema, columnsWithInclude, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getExportSchema()];
                case 1:
                    schema = _a.sent();
                    if (schema) {
                        columnsWithInclude = schema.columns.map(function (col) { return ({
                            name: col.name,
                            data_type: col.data_type,
                            include: true
                        }); });
                        setAvailableColumns(columnsWithInclude);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error al cargar esquema:', error_1);
                    // Usar columnas por defecto
                    setAvailableColumns([
                        { name: 'code', data_type: 'string', include: true },
                        { name: 'name', data_type: 'string', include: true },
                        { name: 'description', data_type: 'string', include: false },
                        { name: 'account_type', data_type: 'string', include: true },
                        { name: 'category', data_type: 'string', include: true },
                        { name: 'parent_id', data_type: 'string', include: false },
                        { name: 'level', data_type: 'number', include: false },
                        { name: 'is_active', data_type: 'boolean', include: true },
                        { name: 'allows_movements', data_type: 'boolean', include: false },
                        { name: 'requires_third_party', data_type: 'boolean', include: false },
                        { name: 'requires_cost_center', data_type: 'boolean', include: false },
                        { name: 'balance', data_type: 'string', include: true },
                        { name: 'debit_balance', data_type: 'string', include: false },
                        { name: 'credit_balance', data_type: 'string', include: false },
                        { name: 'notes', data_type: 'string', include: false },
                        { name: 'created_at', data_type: 'string', include: false },
                        { name: 'updated_at', data_type: 'string', include: false }
                    ]);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Cargar esquema de exportación al abrir el modal
    useEffect(function () {
        if (isOpen) {
            loadExportSchema();
        }
    }, [isOpen, loadExportSchema]);
    var handleColumnToggle = function (columnName, checked) {
        if (checked) {
            setSelectedColumns(__spreadArray(__spreadArray([], selectedColumns, true), [columnName], false));
        }
        else {
            setSelectedColumns(selectedColumns.filter(function (col) { return col !== columnName; }));
        }
    };
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var exportFilters, cleanFilters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exportFilters = __assign(__assign({}, filters), { account_type: filters.account_type || undefined, category: filters.category || undefined, is_active: filters.is_active ? filters.is_active === 'true' : undefined, search: filters.search || undefined, date_from: filters.date_from || undefined, date_to: filters.date_to || undefined });
                    cleanFilters = Object.fromEntries(Object.entries(exportFilters).filter(function (_a) {
                        var _ = _a[0], value = _a[1];
                        return value !== undefined;
                    }));
                    return [4 /*yield*/, exportAccountsAdvanced(exportFormat, cleanFilters, selectedColumns.length > 0 ? selectedColumns : undefined)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getCategoryOptions = function () {
        var _a;
        if (!filters.account_type)
            return [];
        var categoryMapping = (_a = {},
            _a[AccountType.ACTIVO] = [
                AccountCategory.ACTIVO_CORRIENTE,
                AccountCategory.ACTIVO_NO_CORRIENTE
            ],
            _a[AccountType.PASIVO] = [
                AccountCategory.PASIVO_CORRIENTE,
                AccountCategory.PASIVO_NO_CORRIENTE
            ],
            _a[AccountType.PATRIMONIO] = [
                AccountCategory.CAPITAL,
                AccountCategory.RESERVAS,
                AccountCategory.RESULTADOS
            ],
            _a[AccountType.INGRESO] = [
                AccountCategory.INGRESOS_OPERACIONALES,
                AccountCategory.INGRESOS_NO_OPERACIONALES
            ],
            _a[AccountType.GASTO] = [
                AccountCategory.GASTOS_OPERACIONALES,
                AccountCategory.GASTOS_NO_OPERACIONALES
            ],
            _a[AccountType.COSTOS] = [
                AccountCategory.COSTO_VENTAS,
                AccountCategory.COSTOS_PRODUCCION
            ],
            _a);
        return categoryMapping[filters.account_type] || [];
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Exportación Avanzada de Cuentas</h2>
          <button onClick={onClose} disabled={isExporting} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto space-y-6">
          {/* Formato */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Formato de Exportación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['csv', 'json', 'xlsx'].map(function (format) { return (<label key={format} className={"relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ".concat(exportFormat === format
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-300')}>
                    <input type="radio" name="format" value={format} checked={exportFormat === format} onChange={function (e) { return setExportFormat(e.target.value); }} className="sr-only" disabled={isExporting}/>
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 uppercase">
                        {format}
                      </span>
                      <span className="block text-sm text-gray-500 mt-1">
                        {format === 'csv' && 'Compatible con Excel'}
                        {format === 'json' && 'Para APIs y sistemas'}
                        {format === 'xlsx' && 'Excel nativo'}
                      </span>
                    </div>
                  </label>); })}
              </div>
            </div>
          </Card>

          {/* Filtros */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Tipo de cuenta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cuenta
                  </label>
                  <select value={filters.account_type} onChange={function (e) {
            setFilters(__assign(__assign({}, filters), { account_type: e.target.value, category: '' }));
        }} disabled={isExporting} className="form-select w-full">
                    <option value="">Todos los tipos</option>
                    {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                        {label}
                      </option>);
        })}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select value={filters.category} onChange={function (e) { return setFilters(__assign(__assign({}, filters), { category: e.target.value })); }} disabled={isExporting || !filters.account_type} className="form-select w-full">
                    <option value="">Todas las categorías</option>
                    {getCategoryOptions().map(function (category) { return (<option key={category} value={category}>
                        {ACCOUNT_CATEGORY_LABELS[category]}
                      </option>); })}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select value={filters.is_active} onChange={function (e) { return setFilters(__assign(__assign({}, filters), { is_active: e.target.value })); }} disabled={isExporting} className="form-select w-full">
                    <option value="">Todos los estados</option>
                    <option value="true">Solo activas</option>
                    <option value="false">Solo inactivas</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <Input type="text" placeholder="Buscar por código, nombre o descripción..." value={filters.search} onChange={function (e) { return setFilters(__assign(__assign({}, filters), { search: e.target.value })); }} disabled={isExporting}/>
                </div>

                {/* Rango de fechas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha desde
                  </label>
                  <Input type="date" value={filters.date_from} onChange={function (e) { return setFilters(__assign(__assign({}, filters), { date_from: e.target.value })); }} disabled={isExporting}/>
                </div>
              </div>
            </div>
          </Card>

          {/* Columnas */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Columnas a Exportar ({selectedColumns.length} seleccionadas)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableColumns.map(function (column) { return (<label key={column.name} className="flex items-center space-x-2">
                    <input type="checkbox" checked={selectedColumns.includes(column.name)} onChange={function (e) { return handleColumnToggle(column.name, e.target.checked); }} disabled={isExporting} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="text-sm text-gray-700 capitalize">
                      {column.name.replace(/_/g, ' ')}
                    </span>
                  </label>); })}
              </div>
              {selectedColumns.length === 0 && (<p className="text-sm text-amber-600 mt-2">
                  ⚠️ Si no selecciona columnas, se exportarán todas las disponibles
                </p>)}
            </div>
          </Card>

          {/* Progreso */}
          {exportProgress && (<Card>
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <Spinner size="sm"/>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {exportProgress.message}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
                width: "".concat((exportProgress.current / exportProgress.total) * 100, "%")
            }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t bg-gray-50 space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="min-w-[140px]">
            {isExporting ? (<div className="flex items-center space-x-2">
                <Spinner size="sm"/>
                <span>Exportando...</span>
              </div>) : ("Exportar ".concat(exportFormat.toUpperCase()))}
          </Button>
        </div>
      </div>
    </div>);
};
