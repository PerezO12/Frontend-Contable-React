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
import React, { useState, useMemo } from 'react';
import { useCostCenters } from '../hooks';
export var CostCenterSelector = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? 'Seleccionar centro de costo...' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.required, required = _d === void 0 ? false : _d, _e = _a.showActiveOnly, showActiveOnly = _e === void 0 ? true : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var _g = useCostCenters({
        is_active: showActiveOnly ? true : undefined
    }), costCenters = _g.costCenters, loading = _g.loading, error = _g.error;
    // Filtrar y organizar centros de costo jerárquicamente
    var organizedCostCenters = useMemo(function () {
        if (!costCenters)
            return [];
        var buildHierarchy = function (parentId, level) {
            if (parentId === void 0) { parentId = null; }
            if (level === void 0) { level = 0; }
            var children = costCenters.filter(function (cc) { return cc.parent_id === parentId; });
            return children.reduce(function (acc, costCenter) {
                acc.push(__assign(__assign({}, costCenter), { level: level, displayName: "".concat('  '.repeat(level)).concat(costCenter.code, " - ").concat(costCenter.name) }));
                // Añadir hijos recursivamente
                acc.push.apply(acc, buildHierarchy(costCenter.id, level + 1));
                return acc;
            }, []);
        };
        return buildHierarchy();
    }, [costCenters]);
    var handleChange = function (event) {
        var selectedId = event.target.value;
        if (!selectedId) {
            onChange(null);
            return;
        }
        var selectedCostCenter = costCenters === null || costCenters === void 0 ? void 0 : costCenters.find(function (cc) { return cc.id === selectedId; });
        onChange(selectedId, selectedCostCenter);
    };
    var selectedCostCenter = costCenters === null || costCenters === void 0 ? void 0 : costCenters.find(function (cc) { return cc.id === value; });
    return (<div className={className}>
      <select value={value || ''} onChange={handleChange} disabled={disabled || loading} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500">
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        
        {organizedCostCenters.map(function (costCenter) { return (<option key={costCenter.id} value={costCenter.id} disabled={!costCenter.is_active}>
            {costCenter.displayName}
            {!costCenter.is_active && ' (Inactivo)'}
          </option>); })}
      </select>

      {error && (<p className="mt-1 text-sm text-red-600">
          Error al cargar centros de costo: {error}
        </p>)}

      {selectedCostCenter && (<div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="text-sm">
            <span className="font-medium">Seleccionado:</span> {selectedCostCenter.code} - {selectedCostCenter.name}
          </div>          {selectedCostCenter.description && (<div className="text-xs text-gray-600 mt-1">
              {selectedCostCenter.description}
            </div>)}
        </div>)}
    </div>);
};
export var SimpleCostCenterSelector = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? 'Centro de costo...' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.required, required = _d === void 0 ? false : _d, _e = _a.className, className = _e === void 0 ? '' : _e;
    var _f = useCostCenters({ is_active: true }), costCenters = _f.costCenters, loading = _f.loading;
    return (<select value={value || ''} onChange={function (e) { return onChange(e.target.value); }} disabled={disabled || loading} required={required} className={"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 ".concat(className)}>
      <option value="">{loading ? 'Cargando...' : placeholder}</option>
      {costCenters === null || costCenters === void 0 ? void 0 : costCenters.map(function (costCenter) { return (<option key={costCenter.id} value={costCenter.id}>
          {costCenter.code} - {costCenter.name}
        </option>); })}
    </select>);
};
// Hook para filtrar centros de costo
export var useCostCenterFilter = function () {
    var _a = useState(null), selectedCostCenter = _a[0], setSelectedCostCenter = _a[1];
    var costCenters = useCostCenters({ is_active: true }).costCenters;
    var clearFilter = function () { return setSelectedCostCenter(null); };
    var selectedCostCenterData = costCenters === null || costCenters === void 0 ? void 0 : costCenters.find(function (cc) { return cc.id === selectedCostCenter; });
    return {
        selectedCostCenter: selectedCostCenter,
        setSelectedCostCenter: setSelectedCostCenter,
        selectedCostCenterData: selectedCostCenterData,
        clearFilter: clearFilter,
        costCenters: costCenters || []
    };
};
