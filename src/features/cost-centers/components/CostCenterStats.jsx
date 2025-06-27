import React, { useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenters } from '../hooks';
export var CostCenterStats = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useCostCenters(), costCenters = _c.costCenters, loading = _c.loading, error = _c.error;
    var stats = useMemo(function () {
        if (!costCenters)
            return null;
        var totalCostCenters = costCenters.length;
        var activeCostCenters = costCenters.filter(function (cc) { return cc.is_active; }).length;
        var rootCostCenters = costCenters.filter(function (cc) { return !cc.parent_id; }).length;
        // Calcular niveles jerárquicos
        var getLevel = function (costCenter, level) {
            if (level === void 0) { level = 0; }
            if (!costCenter.parent_id)
                return level;
            var parent = costCenters.find(function (cc) { return cc.id === costCenter.parent_id; });
            return parent ? getLevel(parent, level + 1) : level;
        };
        var maxLevel = costCenters.reduce(function (max, cc) { return Math.max(max, getLevel(cc)); }, 0);
        return {
            totalCostCenters: totalCostCenters,
            activeCostCenters: activeCostCenters,
            inactiveCostCenters: totalCostCenters - activeCostCenters,
            rootCostCenters: rootCostCenters,
            maxLevel: maxLevel + 1 // +1 porque los niveles empiezan en 0
        };
    }, [costCenters]);
    if (loading) {
        return (<Card className={className}>
        <div className="card-body text-center py-8">
          <Spinner size="lg"/>
          <p className="text-gray-600 mt-2">Cargando estadísticas...</p>
        </div>
      </Card>);
    }
    if (error || !stats) {
        return (<Card className={className}>
        <div className="card-body text-center py-8">
          <p className="text-red-600">Error al cargar estadísticas</p>
        </div>
      </Card>);
    }
    var statCards = [
        {
            title: 'Total Centros',
            value: stats.totalCostCenters.toString(),
            icon: '🏢',
            color: 'bg-blue-500',
            textColor: 'text-blue-700'
        },
        {
            title: 'Activos',
            value: stats.activeCostCenters.toString(),
            icon: '✅',
            color: 'bg-green-500',
            textColor: 'text-green-700'
        },
        {
            title: 'Inactivos',
            value: stats.inactiveCostCenters.toString(),
            icon: '❌',
            color: 'bg-red-500',
            textColor: 'text-red-700'
        },
        {
            title: 'Centros Raíz',
            value: stats.rootCostCenters.toString(),
            icon: '🌳',
            color: 'bg-orange-500',
            textColor: 'text-orange-700'
        },
        {
            title: 'Niveles Máximos',
            value: stats.maxLevel.toString(),
            icon: '📊',
            color: 'bg-indigo-500',
            textColor: 'text-indigo-700'
        }
    ];
    return (<div className={className}>
      {/* Título */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">📊 Estadísticas de Centros de Costo</h2>
        <p className="text-gray-600 mt-1">Resumen general del estado de los centros de costo</p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map(function (stat, index) { return (<Card key={index}>
            <div className="card-body p-4">
              <div className="flex items-center">
                <div className={"p-3 rounded-full ".concat(stat.color, " bg-opacity-10")}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={"text-2xl font-bold ".concat(stat.textColor)}>{stat.value}</p>
                </div>
              </div>
            </div>
          </Card>); })}
      </div>

      {/* Información adicional */}
      {stats.inactiveCostCenters > 0 && (<Card>
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100">
                <span className="text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Tienes {stats.inactiveCostCenters} centro{stats.inactiveCostCenters === 1 ? '' : 's'} de costo inactivo{stats.inactiveCostCenters === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-yellow-600">
                  Considera revisar si estos centros pueden ser reactivados o eliminados
                </p>
              </div>
            </div>
          </div>
        </Card>)}
    </div>);
};
// Componente compacto para dashboard principal
export var CostCenterQuickStats = function () {
    var _a = useCostCenters(), costCenters = _a.costCenters, loading = _a.loading;
    var quickStats = useMemo(function () {
        if (!costCenters)
            return null;
        return {
            total: costCenters.length,
            active: costCenters.filter(function (cc) { return cc.is_active; }).length
        };
    }, [costCenters]);
    if (loading || !quickStats) {
        return (<div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>);
    }
    return (<div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total:</span>
        <span className="font-medium">{quickStats.total}</span>
      </div>      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Activos:</span>
        <span className="font-medium text-green-600">{quickStats.active}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Inactivos:</span>
        <span className="font-medium text-red-600">{quickStats.total - quickStats.active}</span>
      </div>
    </div>);
};
