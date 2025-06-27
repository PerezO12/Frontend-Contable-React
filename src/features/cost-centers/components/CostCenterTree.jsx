import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterTree } from '../hooks';
var TreeNode = function (_a) {
    var costCenter = _a.costCenter, level = _a.level, onCostCenterSelect = _a.onCostCenterSelect, onCreateChild = _a.onCreateChild, expanded = _a.expanded, onToggleExpand = _a.onToggleExpand;
    var hasChildren = costCenter.children && costCenter.children.length > 0;
    var isExpanded = expanded.has(costCenter.id);
    var indentLevel = level * 20;
    var getLevelColor = function (level) {
        var colors = [
            'text-blue-600', // Nivel 0
            'text-green-600', // Nivel 1
            'text-purple-600', // Nivel 2
            'text-orange-600', // Nivel 3
            'text-pink-600', // Nivel 4
        ];
        return colors[level] || 'text-gray-600';
    };
    return (<div>
      <div className={"\n          flex items-center py-2 px-3 hover:bg-gray-50 border-l-2 transition-colors\n          ".concat(onCostCenterSelect ? 'cursor-pointer' : '', "\n          ").concat(getLevelColor(costCenter.level), " border-current\n        ")} style={{ paddingLeft: "".concat(indentLevel + 12, "px") }} onClick={function () { return onCostCenterSelect === null || onCostCenterSelect === void 0 ? void 0 : onCostCenterSelect(costCenter); }}>
        {/* Expand/Collapse button */}
        <div className="w-6 flex justify-center">
          {hasChildren ? (<button onClick={function (e) {
                e.stopPropagation();
                onToggleExpand(costCenter.id);
            }} className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700">
              {isExpanded ? (<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>) : (<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>)}
            </button>) : (<div className="w-4 h-4 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>)}
        </div>

        {/* Cost Center info */}
        <div className="flex-1 flex items-center justify-between min-w-0 ml-2">
          <div className="flex items-center space-x-3 min-w-0">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
              {costCenter.code}
            </code>
            <span className="font-medium text-gray-900 truncate">
              {costCenter.name}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Nivel {costCenter.level}
            </span>
            {!costCenter.is_active && (<span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                Inactivo
              </span>)}
            {!costCenter.allows_direct_assignment && (<span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                No permite asignación
              </span>)}
            {costCenter.is_leaf && (<span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Hoja
              </span>)}
            {costCenter.manager_name && (<span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                👤 {costCenter.manager_name}
              </span>)}
          </div>

          <div className="flex items-center space-x-3">
            {onCreateChild && costCenter.allows_direct_assignment && (<Button size="sm" variant="secondary" onClick={function (e) {
                e.stopPropagation();
                onCreateChild(costCenter);
            }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                + Hijo
              </Button>)}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (<div>
          {costCenter.children.map(function (child) { return (<TreeNode key={child.id} costCenter={child} level={level + 1} onCostCenterSelect={onCostCenterSelect} onCreateChild={onCreateChild} expanded={expanded} onToggleExpand={onToggleExpand}/>); })}
        </div>)}
    </div>);
};
export var CostCenterTreeComponent = function (_a) {
    var onCostCenterSelect = _a.onCostCenterSelect, onCreateChild = _a.onCreateChild, _b = _a.activeOnly, activeOnly = _b === void 0 ? true : _b;
    var _c = useState(new Set()), expanded = _c[0], setExpanded = _c[1];
    var _d = useCostCenterTree(activeOnly), costCenterTree = _d.costCenterTree, loading = _d.loading, error = _d.error, refetch = _d.refetch;
    var handleToggleExpand = function (costCenterId) {
        setExpanded(function (prev) {
            var newExpanded = new Set(prev);
            if (newExpanded.has(costCenterId)) {
                newExpanded.delete(costCenterId);
            }
            else {
                newExpanded.add(costCenterId);
            }
            return newExpanded;
        });
    };
    var expandAll = function () {
        var getAllCostCenterIds = function (costCenters) {
            return costCenters.reduce(function (ids, costCenter) {
                ids.push(costCenter.id);
                if (costCenter.children) {
                    ids.push.apply(ids, getAllCostCenterIds(costCenter.children));
                }
                return ids;
            }, []);
        };
        setExpanded(new Set(getAllCostCenterIds(costCenterTree)));
    };
    var collapseAll = function () {
        setExpanded(new Set());
    };
    if (error) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar el árbol de centros de costo: {error}</p>
          <Button onClick={function () { return refetch(); }}>
            Reintentar
          </Button>
        </div>
      </Card>);
    }
    return (<Card>
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="card-title">🏢 Centros de Costo - Vista Jerárquica</h3>
            <p className="text-sm text-gray-600 mt-1">
              Estructura organizacional de centros de costo
              {activeOnly ? ' (solo activos)' : ' (todos)'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" onClick={expandAll} disabled={loading}>
              Expandir Todo
            </Button>
            <Button size="sm" variant="secondary" onClick={collapseAll} disabled={loading}>
              Contraer Todo
            </Button>
            <Button size="sm" variant="secondary" onClick={function () { return refetch(); }} disabled={loading}>
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {loading ? (<div className="text-center py-8">
            <Spinner size="lg"/>
            <p className="text-gray-600 mt-2">Cargando árbol de centros de costo...</p>
          </div>) : costCenterTree.length === 0 ? (<div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron centros de costo
              {activeOnly ? ' activos' : ''}
            </p>
          </div>) : (<div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Centro de Costo</span>
                <span>Información</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {costCenterTree.map(function (costCenter) { return (<div key={costCenter.id} className="group">
                  <TreeNode costCenter={costCenter} level={0} onCostCenterSelect={onCostCenterSelect} onCreateChild={onCreateChild} expanded={expanded} onToggleExpand={handleToggleExpand}/>
                </div>); })}
            </div>
          </div>)}

        {/* Leyenda */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Leyenda de Niveles</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-600"></div>
              <span className="text-gray-600">Nivel 0 (Raíz)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-green-600"></div>
              <span className="text-gray-600">Nivel 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-600"></div>
              <span className="text-gray-600">Nivel 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-orange-600"></div>
              <span className="text-gray-600">Nivel 3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-pink-600"></div>
              <span className="text-gray-600">Nivel 4+</span>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded">Inactivo</span>
              <span className="text-gray-600">Centro deshabilitado</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded">Hoja</span>
              <span className="text-gray-600">Sin hijos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">No permite asignación</span>
              <span className="text-gray-600">Solo agrupación</span>
            </div>
          </div>
        </div>
      </div>
    </Card>);
};
