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
import { useCostCenters } from '../hooks';
import { useCostCenterListListener } from '../hooks/useCostCenterEvents';
import { SimpleExportControls } from './SimpleExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { formatDate } from '../../../shared/utils';
export var CostCenterList = function (_a) {
    var _b, _c, _d;
    var onCostCenterSelect = _a.onCostCenterSelect, onCreateCostCenter = _a.onCreateCostCenter, initialFilters = _a.initialFilters, _e = _a.showActions, showActions = _e === void 0 ? true : _e;
    var _f = useState(initialFilters || {}), filters = _f[0], setFilters = _f[1];
    var _g = useState(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = useState(new Set()), selectedCostCenters = _h[0], setSelectedCostCenters = _h[1];
    var _j = useState(false), selectAll = _j[0], setSelectAll = _j[1];
    var _k = useState(false), showBulkDeleteModal = _k[0], setShowBulkDeleteModal = _k[1];
    var _l = useCostCenters(filters), _m = _l.costCenters, costCenters = _m === void 0 ? [] : _m, _o = _l.total, total = _o === void 0 ? 0 : _o, loading = _l.loading, error = _l.error, refetch = _l.refetch, refetchWithFilters = _l.refetchWithFilters;
    // Escuchar eventos de otros componentes para refrescar la lista automáticamente
    useCostCenterListListener(function (event) {
        console.log('🏢📡 CostCenterList - Evento recibido:', event);
        // Recargar la lista cuando se crea, actualiza o elimina un centro de costo
        if (['created', 'updated', 'deleted', 'status_changed'].includes(event.type)) {
            console.log('🏢🔄 CostCenterList - Refrescando lista debido al evento:', event.type);
            refetch();
        }
    });
    // Refrescar la lista cuando el componente se monte para asegurar datos actualizados
    useEffect(function () {
        console.log('🏢⚡ CostCenterList - Componente montado, refrescando datos');
        refetch();
    }, [refetch]);
    // Logging para debug - ver qué datos está recibiendo el componente
    console.log('🏢🖥️ CostCenterList - Datos recibidos del hook:');
    console.log('  - costCenters:', costCenters);
    console.log('  - costCenters.length:', costCenters === null || costCenters === void 0 ? void 0 : costCenters.length);
    console.log('  - total:', total);
    console.log('  - loading:', loading);
    console.log('  - error:', error);
    // Filter cost centers based on search term
    var filteredCostCenters = useMemo(function () {
        console.log('🏢🔍 Filtrando centros de costo:');
        console.log('  - costCenters input:', costCenters);
        console.log('  - searchTerm:', searchTerm);
        if (!costCenters) {
            console.log('  - No hay costCenters, retornando array vacío');
            return [];
        }
        if (!searchTerm) {
            console.log('  - No hay searchTerm, retornando todos:', costCenters.length);
            return costCenters;
        }
        var term = searchTerm.toLowerCase();
        var filtered = costCenters.filter(function (costCenter) {
            var _a;
            return costCenter.code.toLowerCase().includes(term) ||
                costCenter.name.toLowerCase().includes(term) ||
                ((_a = costCenter.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term));
        });
        console.log('  - Resultado filtrado:', filtered.length);
        return filtered;
    }, [costCenters, searchTerm]);
    var handleFilterChange = function (key, value) {
        var _a;
        var newFilters = __assign(__assign({}, filters), (_a = {}, _a[key] = value, _a));
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    // Manejar selección individual de centros de costo
    var handleCostCenterSelect = function (costCenterId, checked) {
        var newSelected = new Set(selectedCostCenters);
        if (checked) {
            newSelected.add(costCenterId);
        }
        else {
            newSelected.delete(costCenterId);
        }
        setSelectedCostCenters(newSelected);
        // Actualizar estado de "seleccionar todo"
        setSelectAll(newSelected.size === filteredCostCenters.length && filteredCostCenters.length > 0);
    };
    // Manejar selección de todos los centros de costo
    var handleSelectAll = function (checked) {
        if (checked) {
            var allIds = new Set(filteredCostCenters.map(function (costCenter) { return costCenter.id; }));
            setSelectedCostCenters(allIds);
        }
        else {
            setSelectedCostCenters(new Set());
        }
        setSelectAll(checked);
    };
    // Limpiar selección
    var handleClearSelection = function () {
        setSelectedCostCenters(new Set());
        setSelectAll(false);
    };
    // Manejar eliminación masiva
    var handleBulkDelete = function () {
        if (selectedCostCenters.size === 0) {
            return;
        }
        setShowBulkDeleteModal(true);
    };
    // Manejar éxito de eliminación masiva
    var handleBulkDeleteSuccess = function (_result) {
        setShowBulkDeleteModal(false);
        setSelectedCostCenters(new Set());
        setSelectAll(false);
        refetch(); // Recargar la lista de centros de costo
    };
    // Obtener centros de costo seleccionados como objetos
    var getSelectedCostCentersObjects = function () {
        return costCenters.filter(function (costCenter) { return selectedCostCenters.has(costCenter.id); });
    };
    var getLevelColor = function (level) {
        var colors = [
            'bg-blue-100 text-blue-800', // Nivel 0
            'bg-green-100 text-green-800', // Nivel 1
            'bg-yellow-100 text-yellow-800', // Nivel 2
            'bg-purple-100 text-purple-800', // Nivel 3
            'bg-pink-100 text-pink-800', // Nivel 4
            'bg-gray-100 text-gray-800' // Nivel 5+
        ];
        return colors[level] || colors[colors.length - 1];
    };
    if (error) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar los centros de costo: {error}</p>
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
              <h2 className="card-title">Centros de Costo</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredCostCenters.length} centro{filteredCostCenters.length !== 1 ? 's' : ''} de costo encontrado{filteredCostCenters.length !== 1 ? 's' : ''}
                {total > 0 && " de ".concat(total, " total")}
              </p>
            </div>
            
            {showActions && onCreateCostCenter && (<Button onClick={onCreateCostCenter} className="bg-blue-600 hover:bg-blue-700">
                + Nuevo Centro de Costo
              </Button>)}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros optimizados */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input placeholder="Código, nombre o descripción..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
            </div>

            {/* Filtro por nivel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel
              </label>
              <select value={((_b = filters.level) === null || _b === void 0 ? void 0 : _b.toString()) || ''} onChange={function (e) { return handleFilterChange('level', e.target.value ? parseInt(e.target.value) : undefined); }} className="form-select">
                <option value="">Todos los niveles</option>
                <option value="0">Nivel 0 (Raíz)</option>
                <option value="1">Nivel 1</option>
                <option value="2">Nivel 2</option>
                <option value="3">Nivel 3</option>
                <option value="4">Nivel 4</option>
                <option value="5">Nivel 5+</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select value={((_c = filters.is_active) === null || _c === void 0 ? void 0 : _c.toString()) || ''} onChange={function (e) { return handleFilterChange('is_active', e.target.value ? e.target.value === 'true' : undefined); }} className="form-select">
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {/* Filtro por estructura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estructura
              </label>
              <select value={((_d = filters.has_children) === null || _d === void 0 ? void 0 : _d.toString()) || ''} onChange={function (e) { return handleFilterChange('has_children', e.target.value ? e.target.value === 'true' : undefined); }} className="form-select">
                <option value="">Todos</option>
                <option value="true">Con hijos</option>
                <option value="false">Sin hijos (Hoja)</option>
              </select>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Centros</p>
              <p className="text-lg font-semibold text-gray-900">{total}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-lg font-semibold text-green-700">
                {costCenters.filter(function (cc) { return cc.is_active; }).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Con Movimientos</p>
              <p className="text-lg font-semibold text-blue-700">
                {costCenters.filter(function (cc) { return cc.movements_count > 0; }).length}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Niveles Únicos</p>
              <p className="text-lg font-semibold text-purple-700">
                {new Set(costCenters.map(function (cc) { return cc.level; })).size}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de centros de costo */}
      <Card>
        <div className="card-body">          {/* Acciones masivas */}
          {selectedCostCenters.size > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedCostCenters.size} centro{selectedCostCenters.size !== 1 ? 's' : ''} seleccionado{selectedCostCenters.size !== 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-blue-700 hover:text-blue-900">
                    Limpiar selección
                  </Button>
                </div>

                {/* Controles de exportación y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleExportControls selectedCostCenterIds={Array.from(selectedCostCenters)} costCenterCount={selectedCostCenters.size}/>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="border-red-300 text-red-700 hover:bg-red-100">
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>)}

          {/* Controles de selección para cuando no hay elementos seleccionados */}
          {filteredCostCenters.length > 0 && selectedCostCenters.size === 0 && (<div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <input type="checkbox" checked={selectAll && filteredCostCenters.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <label className="ml-2 text-sm text-gray-700">
                  Seleccionar todos ({filteredCostCenters.length})
                </label>
              </div>
            </div>)}

          {loading ? (<div className="text-center py-8">
              <Spinner size="lg"/>
              <p className="text-gray-600 mt-2">Cargando centros de costo...</p>
            </div>) : filteredCostCenters.length === 0 ? (<div className="text-center py-8">
              <p className="text-gray-500">No se encontraron centros de costo</p>
              {searchTerm && (<Button variant="secondary" onClick={function () { return setSearchTerm(''); }} className="mt-2">
                  Limpiar búsqueda
                </Button>)}
            </div>) : (<div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-4 font-medium text-gray-900 w-12">
                      <input type="checkbox" checked={selectAll && filteredCostCenters.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </th>                    <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Nivel</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Hijos</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCostCenters.map(function (costCenter) { return (<tr key={costCenter.id} className={"hover:bg-gray-50 ".concat(selectedCostCenters.has(costCenter.id) ? 'bg-blue-50' : '')}>
                      <td className="py-3 px-4 text-center">
                        <input type="checkbox" checked={selectedCostCenters.has(costCenter.id)} onChange={function (e) {
                    e.stopPropagation();
                    handleCostCenterSelect(costCenter.id, e.target.checked);
                }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      </td>                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {costCenter.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <div>
                          <p className="font-medium text-gray-900">{costCenter.name}</p>
                          {costCenter.description && (<p className="text-sm text-gray-500">{costCenter.description}</p>)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getLevelColor(costCenter.level))}>
                          Nivel {costCenter.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(costCenter.children_count > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800')}>
                          {costCenter.children_count}
                        </span>
                      </td>                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(costCenter.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800')}>
                          {costCenter.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
                        <span className="text-sm text-gray-900">
                          {costCenter.created_at ? formatDate(costCenter.created_at) : '-'}
                        </span>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}        </div>
      </Card>

      {/* Modal de eliminación masiva */}
      {showBulkDeleteModal && (<BulkDeleteModal selectedCostCenters={getSelectedCostCentersObjects()} onClose={function () { return setShowBulkDeleteModal(false); }} onSuccess={handleBulkDeleteSuccess}/>)}
    </div>);
};
