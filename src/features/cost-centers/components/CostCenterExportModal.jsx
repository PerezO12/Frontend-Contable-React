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
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterExport } from '../hooks';
import { useToast } from '../../../shared/hooks/useToast';
export var CostCenterExportModal = function (_a) {
    var costCenters = _a.costCenters, isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.title, title = _b === void 0 ? 'Exportar Centros de Costo' : _b;
    var _c = useState(new Set()), selectedCostCenters = _c[0], setSelectedCostCenters = _c[1];
    var _d = useState(false), selectAll = _d[0], setSelectAll = _d[1];
    var _e = useState('xlsx'), exportFormat = _e[0], setExportFormat = _e[1];
    var _f = useState({}), filters = _f[0], setFilters = _f[1];
    var _g = useState(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = useCostCenterExport(), exportCostCenters = _h.exportCostCenters, isExporting = _h.isExporting;
    var _j = useToast(), success = _j.success, error = _j.error;
    // Filtrar centros de costo
    var filteredCostCenters = useMemo(function () {
        return costCenters.filter(function (costCenter) {
            var matchesSearch = !searchTerm ||
                costCenter.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                costCenter.name.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesActive = filters.is_active === undefined ||
                costCenter.is_active === filters.is_active;
            var matchesParent = !filters.parent_id ||
                costCenter.parent_id === filters.parent_id;
            return matchesSearch && matchesActive && matchesParent;
        });
    }, [costCenters, searchTerm, filters]);
    // Actualizar estado de "seleccionar todo" cuando cambia la selección
    useEffect(function () {
        setSelectAll(selectedCostCenters.size === filteredCostCenters.length && filteredCostCenters.length > 0);
    }, [selectedCostCenters, filteredCostCenters.length]);
    // Manejar selección de todos los centros de costo filtrados
    var handleSelectAll = useCallback(function (checked) {
        if (checked) {
            var allFilteredIds = new Set(__spreadArray(__spreadArray([], selectedCostCenters, true), filteredCostCenters.map(function (cc) { return cc.id; }), true));
            setSelectedCostCenters(allFilteredIds);
        }
        else {
            var filteredIds_1 = new Set(filteredCostCenters.map(function (cc) { return cc.id; }));
            var newSelected = new Set(__spreadArray([], selectedCostCenters, true).filter(function (id) { return !filteredIds_1.has(id); }));
            setSelectedCostCenters(newSelected);
        }
        setSelectAll(checked);
    }, [filteredCostCenters, selectedCostCenters]);
    // Seleccionar solo centros de costo activos
    var handleSelectActiveOnly = useCallback(function () {
        var activeIds = new Set(costCenters.filter(function (cc) { return cc.is_active; }).map(function (cc) { return cc.id; }));
        setSelectedCostCenters(activeIds);
        setSelectAll(false);
        success("\u2705 Seleccionados ".concat(activeIds.size, " centros de costo activos"));
    }, [costCenters, success]);
    // Manejar exportación
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedCostCenters.size === 0) {
                        error('Debes seleccionar al menos un centro de costo para exportar');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exportCostCenters(Array.from(selectedCostCenters), exportFormat)];
                case 2:
                    _a.sent();
                    success("\u2705 Exportaci\u00F3n iniciada - ".concat(selectedCostCenters.size, " centros de costo en formato ").concat(exportFormat.toUpperCase()));
                    onClose();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    error("\u274C Error en la exportaci\u00F3n: ".concat(err_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleClose = function () {
        if (isExporting)
            return;
        onClose();
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-[999999] overflow-y-auto">
      {/* Backdrop oscuro con blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}/>
      
      {/* Contenedor del modal centrado */}
      <div className="relative z-[999999] h-full flex items-center justify-center p-6">
        {/* Modal principal */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={function (e) { return e.stopPropagation(); }}>
          {/* Header fijo */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                {title}
              </h2>
              <p className="text-indigo-100 mt-1">
                Selecciona los centros de costo que deseas exportar y el formato preferido
              </p>
            </div>
            <button onClick={handleClose} disabled={isExporting} className="text-white hover:text-indigo-200 transition-colors disabled:opacity-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Filtros y búsqueda */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">Filtros y Búsqueda</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar por código o nombre
                    </label>
                    <input type="text" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} placeholder="Buscar..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select value={filters.is_active === undefined ? '' : String(filters.is_active)} onChange={function (e) { return setFilters(function (prev) { return (__assign(__assign({}, prev), { is_active: e.target.value === '' ? undefined : e.target.value === 'true' })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Todos</option>
                      <option value="true">Activos</option>
                      <option value="false">Inactivos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de exportación
                    </label>
                    <select value={exportFormat} onChange={function (e) { return setExportFormat(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="pdf">PDF (.pdf)</option>
                    </select>
                  </div>
                </div>

                {/* Acciones rápidas de selección */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button size="sm" variant="secondary" onClick={handleSelectActiveOnly} disabled={isExporting}>
                    Seleccionar solo activos
                  </Button>
                  <Button size="sm" variant="secondary" onClick={function () { return setSelectedCostCenters(new Set()); }} disabled={isExporting}>
                    Limpiar selección
                  </Button>
                </div>
              </div>
            </Card>

            {/* Lista de centros de costo */}
            <Card>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">
                    Centros de Costo Disponibles
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredCostCenters.length} de {costCenters.length})
                    </span>
                  </h3>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={selectAll && filteredCostCenters.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} disabled={isExporting || filteredCostCenters.length === 0} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                    <span className="text-sm font-medium text-gray-700">
                      Seleccionar todos los filtrados
                    </span>
                  </label>
                </div>
              </div>
              <div className="card-body">
                {filteredCostCenters.length === 0 ? (<div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron centros de costo con los filtros aplicados</p>
                  </div>) : (<div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredCostCenters.map(function (costCenter) { return (<div key={costCenter.id} className={"p-3 rounded-lg border transition-colors ".concat(selectedCostCenters.has(costCenter.id)
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100')}>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={selectedCostCenters.has(costCenter.id)} onChange={function (e) {
                    var newSelected = new Set(selectedCostCenters);
                    if (e.target.checked) {
                        newSelected.add(costCenter.id);
                    }
                    else {
                        newSelected.delete(costCenter.id);
                    }
                    setSelectedCostCenters(newSelected);
                }} disabled={isExporting} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                    {costCenter.code}
                                  </code>
                                  <span className="font-medium text-gray-900">
                                    {costCenter.name}
                                  </span>
                                  {!costCenter.is_active && (<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                      Inactivo
                                    </span>)}
                                </div>
                                <div className="text-sm text-gray-500 text-right">
                                  <div>Descripción: {costCenter.description || 'N/A'}</div>
                                  {costCenter.parent_id && (<div className="text-xs">Centro hijo</div>)}
                                </div>
                              </div>
                              {costCenter.description && (<p className="text-sm text-gray-600 mt-1">{costCenter.description}</p>)}
                            </div>
                          </label>
                        </div>); })}
                    </div>
                  </div>)}
              </div>
            </Card>

            {/* Información de la selección */}
            {selectedCostCenters.size > 0 && (<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-900 mb-2">
                  📋 Resumen de la exportación
                </h4>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• {selectedCostCenters.size} centro{selectedCostCenters.size === 1 ? '' : 's'} de costo seleccionado{selectedCostCenters.size === 1 ? '' : 's'}</li>
                  <li>• Formato: {exportFormat.toUpperCase()}</li>
                  <li>• Incluye: código, nombre, descripción, presupuesto, estado y jerarquía</li>
                </ul>
              </div>)}
          </div>

          {/* Footer fijo */}
          <div className="border-t p-6 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedCostCenters.size > 0 ? (<span className="font-medium text-indigo-600">
                    {selectedCostCenters.size} centro{selectedCostCenters.size === 1 ? '' : 's'} seleccionado{selectedCostCenters.size === 1 ? '' : 's'}
                  </span>) : (<span>Selecciona centros de costo para exportar</span>)}
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={handleClose} disabled={isExporting}>
                  Cancelar
                </Button>
                <Button onClick={handleExport} disabled={isExporting || selectedCostCenters.size === 0} className="flex items-center space-x-2">
                  {isExporting ? (<>
                      <Spinner size="sm"/>
                      <span>Exportando...</span>
                    </>) : (<>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                      </svg>
                      <span>Exportar {exportFormat.toUpperCase()}</span>
                    </>)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
