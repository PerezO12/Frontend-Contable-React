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
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useThirdParties } from '../hooks';
import { SimpleExportControls } from './SimpleExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { formatCurrency } from '../../../shared/utils';
import { ThirdPartyType, THIRD_PARTY_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../types';
export var ThirdPartyList = function (_a) {
    var _b;
    var onThirdPartySelect = _a.onThirdPartySelect, onCreateThirdParty = _a.onCreateThirdParty, initialFilters = _a.initialFilters, _c = _a.showActions, showActions = _c === void 0 ? true : _c;
    var _d = useState(initialFilters || {}), filters = _d[0], setFilters = _d[1];
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = useState(''), debouncedSearchTerm = _f[0], setDebouncedSearchTerm = _f[1];
    var _g = useState(new Set()), selectedThirdParties = _g[0], setSelectedThirdParties = _g[1];
    var _h = useState(false), selectAll = _h[0], setSelectAll = _h[1];
    var _j = useState(false), showBulkDeleteModal = _j[0], setShowBulkDeleteModal = _j[1];
    // Debounce del término de búsqueda
    useEffect(function () {
        var timer = setTimeout(function () {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms de delay
        return function () { return clearTimeout(timer); };
    }, [searchTerm]);
    // Combinar filtros con término de búsqueda para enviar al backend
    var combinedFilters = useMemo(function () {
        var result = __assign(__assign({}, filters), { search: debouncedSearchTerm.trim() || undefined // Usar debouncedSearchTerm
         });
        console.log('🔍 [ThirdPartyList] combinedFilters updated:', result);
        return result;
    }, [filters, debouncedSearchTerm]);
    var _k = useThirdParties(combinedFilters), thirdParties = _k.thirdParties, loading = _k.loading, error = _k.error, refetch = _k.refetch;
    // Ya no necesitamos filtrado local porque el backend maneja la búsqueda
    var filteredThirdParties = thirdParties || [];
    var handleFilterChange = function (key, value) {
        var _a;
        console.log("\uD83D\uDD27 [ThirdPartyList] Filter change: ".concat(key, " = ").concat(value, " (type: ").concat(typeof value, ")"));
        var newFilters = __assign(__assign({}, filters), (_a = {}, _a[key] = value, _a));
        console.log('🔧 [ThirdPartyList] New filters object:', newFilters);
        setFilters(newFilters);
        // No necesitamos refetch manual porque useThirdParties reacciona a combinedFilters
    };
    var handleSearchChange = function (e) {
        setSearchTerm(e.target.value);
        // El search se actualizará automáticamente vía combinedFilters
    };
    // Manejar selección individual de terceros
    var handleThirdPartySelect = function (thirdPartyId, checked) {
        var newSelected = new Set(selectedThirdParties);
        if (checked) {
            newSelected.add(thirdPartyId);
        }
        else {
            newSelected.delete(thirdPartyId);
        }
        setSelectedThirdParties(newSelected);
        // Actualizar estado de "seleccionar todo"
        setSelectAll(newSelected.size === filteredThirdParties.length && filteredThirdParties.length > 0);
    };
    // Manejar selección de todos los terceros
    var handleSelectAll = function (checked) {
        if (checked) {
            var allIds = new Set(filteredThirdParties.map(function (thirdParty) { return thirdParty.id; }));
            setSelectedThirdParties(allIds);
        }
        else {
            setSelectedThirdParties(new Set());
        }
        setSelectAll(checked);
    };
    // Limpiar selección
    var handleClearSelection = function () {
        setSelectedThirdParties(new Set());
        setSelectAll(false);
    };
    // Manejar eliminación masiva
    var handleBulkDelete = function () {
        if (selectedThirdParties.size === 0) {
            return;
        }
        setShowBulkDeleteModal(true);
    };
    // Manejar éxito de eliminación masiva
    var handleBulkDeleteSuccess = function (_result) {
        setShowBulkDeleteModal(false);
        setSelectedThirdParties(new Set());
        setSelectAll(false);
        refetch(); // Recargar la lista de terceros
    };
    // Obtener terceros seleccionados como objetos
    var getSelectedThirdPartiesObjects = function () {
        return thirdParties.filter(function (thirdParty) { return selectedThirdParties.has(thirdParty.id); });
    };
    var getThirdPartyTypeColor = function (type) {
        var _a;
        var colors = (_a = {},
            _a[ThirdPartyType.CUSTOMER] = 'bg-green-100 text-green-800',
            _a[ThirdPartyType.SUPPLIER] = 'bg-blue-100 text-blue-800',
            _a[ThirdPartyType.EMPLOYEE] = 'bg-purple-100 text-purple-800',
            _a[ThirdPartyType.SHAREHOLDER] = 'bg-yellow-100 text-yellow-800',
            _a[ThirdPartyType.BANK] = 'bg-indigo-100 text-indigo-800',
            _a[ThirdPartyType.GOVERNMENT] = 'bg-red-100 text-red-800',
            _a[ThirdPartyType.OTHER] = 'bg-gray-100 text-gray-800',
            _a);
        return colors[type] || 'bg-gray-100 text-gray-800';
    };
    var getStatusColor = function (isActive) {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };
    if (error) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los terceros: {error}</p>
          <Button onClick={function () { return refetch(); }}>
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
              <h2 className="card-title">Terceros</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredThirdParties.length} tercero{filteredThirdParties.length !== 1 ? 's' : ''} encontrado{filteredThirdParties.length !== 1 ? 's' : ''}
              </p>
            </div>
            {showActions && onCreateThirdParty && (<Button onClick={onCreateThirdParty} className="bg-blue-600 hover:bg-blue-700">
                + Nuevo Tercero
              </Button>)}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input type="text" placeholder="Buscar por documento, nombre, email..." value={searchTerm} onChange={handleSearchChange} className="w-full"/>
            </div>
            <div className="flex gap-2">
              <select value={filters.third_party_type || ''} onChange={function (e) { return handleFilterChange('third_party_type', e.target.value || undefined); }} className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
                <option value="">Todos los tipos</option>
                {Object.entries(THIRD_PARTY_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>{label}</option>);
        })}
              </select>
              <select value={((_b = filters.is_active) === null || _b === void 0 ? void 0 : _b.toString()) || ''} onChange={function (e) {
            var value = e.target.value;
            handleFilterChange('is_active', value === '' ? undefined : value === 'true');
        }} className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Acciones masivas */}
          {selectedThirdParties.size > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedThirdParties.size} tercero{selectedThirdParties.size !== 1 ? 's' : ''} seleccionado{selectedThirdParties.size !== 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-blue-700 hover:text-blue-900">
                    Limpiar selección
                  </Button>
                </div>

                {/* Controles de exportación y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleExportControls selectedThirdPartyIds={Array.from(selectedThirdParties)} thirdPartyCount={selectedThirdParties.size}/>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="border-red-300 text-red-700 hover:bg-red-100">
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Tabla de terceros */}
      <Card>
        <div className="card-body p-0">
          {loading ? (<div className="flex justify-center items-center py-8">
              <Spinner size="lg"/>
            </div>) : (<div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" checked={selectAll} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    {showActions && (<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredThirdParties.map(function (thirdParty) { return (<tr key={thirdParty.id} className={"hover:bg-gray-50 ".concat(onThirdPartySelect ? 'cursor-pointer' : '')} onClick={function () { return onThirdPartySelect === null || onThirdPartySelect === void 0 ? void 0 : onThirdPartySelect(thirdParty); }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedThirdParties.has(thirdParty.id)} onChange={function (e) {
                    e.stopPropagation();
                    handleThirdPartySelect(thirdParty.id, e.target.checked);
                }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{thirdParty.document_number}</div>
                          <div className="text-gray-500 text-xs">
                            {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {thirdParty.commercial_name || thirdParty.name}
                          </div>
                          {thirdParty.commercial_name && (<div className="text-gray-500 text-xs">{thirdParty.name}</div>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getThirdPartyTypeColor(thirdParty.third_party_type))}>
                          {THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {thirdParty.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {thirdParty.current_balance !== undefined ?
                    formatCurrency(thirdParty.current_balance) :
                    '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(thirdParty.is_active))}>
                          {thirdParty.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {showActions && (<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={function (e) {
                        e.stopPropagation();
                        onThirdPartySelect === null || onThirdPartySelect === void 0 ? void 0 : onThirdPartySelect(thirdParty);
                    }} className="text-blue-600 hover:text-blue-900">
                            Ver
                          </Button>
                        </td>)}
                    </tr>); })}
                </tbody>
              </table>
              
              {filteredThirdParties.length === 0 && (<div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron terceros</p>
                </div>)}
            </div>)}
        </div>
      </Card>

      {/* Modales */}
      {showBulkDeleteModal && (<BulkDeleteModal onClose={function () { return setShowBulkDeleteModal(false); }} onSuccess={handleBulkDeleteSuccess} selectedThirdParties={getSelectedThirdPartiesObjects()}/>)}
    </div>);
};
