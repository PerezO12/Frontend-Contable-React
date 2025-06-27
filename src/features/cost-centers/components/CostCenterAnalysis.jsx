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
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterAnalysis } from '../hooks';
import { formatCurrency } from '../../../shared/utils';
export var CostCenterAnalysis = function (_a) {
    var costCenter = _a.costCenter, onClose = _a.onClose;
    var _b = useState({
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
    }), dateRange = _b[0], setDateRange = _b[1];
    var _c = useCostCenterAnalysis(), analysis = _c.analysis, loading = _c.loading, error = _c.error, fetchAnalysis = _c.fetchAnalysis;
    var handleDateRangeChange = function (field) { return function (e) {
        setDateRange(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = e.target.value, _a)));
        });
    }; };
    var handleGenerateAnalysis = function () {
        if (dateRange.start_date && dateRange.end_date) {
            fetchAnalysis(costCenter.id, dateRange.start_date, dateRange.end_date);
        }
    };
    var getMarginColor = function (margin) {
        if (margin >= 20)
            return 'text-green-600';
        if (margin >= 10)
            return 'text-yellow-600';
        if (margin >= 0)
            return 'text-orange-600';
        return 'text-red-600';
    };
    var getMarginBgColor = function (margin) {
        if (margin >= 20)
            return 'bg-green-50 border-green-200';
        if (margin >= 10)
            return 'bg-yellow-50 border-yellow-200';
        if (margin >= 0)
            return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };
    return (<div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Análisis de Rentabilidad</h2>
              <p className="text-sm text-gray-600 mt-1">
                {costCenter.code} - {costCenter.name}
              </p>
            </div>
            {onClose && (<Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>)}
          </div>
        </div>

        <div className="card-body">
          {/* Controles de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <Input type="date" value={dateRange.start_date} onChange={handleDateRangeChange('start_date')}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <Input type="date" value={dateRange.end_date} onChange={handleDateRangeChange('end_date')}/>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateAnalysis} disabled={loading || !dateRange.start_date || !dateRange.end_date} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? 'Generando...' : 'Generar Análisis'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Resultados del análisis */}
      {loading && (<Card>
          <div className="card-body text-center py-8">
            <Spinner size="lg"/>
            <p className="text-gray-600 mt-2">Generando análisis de rentabilidad...</p>
          </div>
        </Card>)}

      {error && (<Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">Error al generar el análisis: {error}</p>
            <Button onClick={handleGenerateAnalysis}>
              Reintentar
            </Button>
          </div>
        </Card>)}

      {analysis && !loading && (<>
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="card-body text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(parseFloat(analysis.total_income))}
                </div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
              </div>
            </Card>

            <Card>
              <div className="card-body text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {formatCurrency(parseFloat(analysis.total_expenses))}
                </div>
                <p className="text-sm text-gray-600">Gastos Totales</p>
              </div>
            </Card>

            <Card>
              <div className="card-body text-center">
                <div className={"text-2xl font-bold mb-2 ".concat(parseFloat(analysis.net_result) >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(parseFloat(analysis.net_result))}
                </div>
                <p className="text-sm text-gray-600">Resultado Neto</p>
              </div>
            </Card>

            <Card>
              <div className={"card-body text-center border-2 ".concat(getMarginBgColor(analysis.margin_percentage))}>
                <div className={"text-2xl font-bold mb-2 ".concat(getMarginColor(analysis.margin_percentage))}>
                  {analysis.margin_percentage.toFixed(2)}%
                </div>
                <p className="text-sm text-gray-600">Margen de Rentabilidad</p>
              </div>
            </Card>
          </div>

          {/* Información detallada */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Detalles del Análisis</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Período</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Período analizado:</span>
                      <span className="text-sm font-medium">
                        {new Date(analysis.period_start).toLocaleDateString('es-CO')} - {new Date(analysis.period_end).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Centro de costo:</span>
                      <span className="text-sm font-medium">{analysis.cost_center.full_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <span className={"text-sm font-medium ".concat(analysis.cost_center.is_active ? 'text-green-600' : 'text-gray-600')}>
                        {analysis.cost_center.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Indicadores de Rendimiento</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eficiencia de gastos:</span>
                      <span className="text-sm font-medium">
                        {parseFloat(analysis.total_income) > 0
                ? ((parseFloat(analysis.total_expenses) / parseFloat(analysis.total_income)) * 100).toFixed(2)
                : '0.00'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI (aprox):</span>
                      <span className={"text-sm font-medium ".concat(getMarginColor(analysis.margin_percentage))}>
                        {analysis.margin_percentage > 0 ? '+' : ''}{analysis.margin_percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Balance:</span>
                      <span className={"text-sm font-medium ".concat(parseFloat(analysis.net_result) >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {parseFloat(analysis.net_result) >= 0 ? 'Positivo' : 'Negativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico visual simple */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Distribución de Resultados</h4>
                <div className="space-y-4">
                  {/* Barra de ingresos */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Ingresos</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(parseFloat(analysis.total_income))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{
                width: parseFloat(analysis.total_income) > 0 ? '100%' : '0%'
            }}></div>
                    </div>
                  </div>

                  {/* Barra de gastos */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Gastos</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(parseFloat(analysis.total_expenses))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{
                width: parseFloat(analysis.total_income) > 0
                    ? "".concat(Math.min((parseFloat(analysis.total_expenses) / parseFloat(analysis.total_income)) * 100, 100), "%")
                    : parseFloat(analysis.total_expenses) > 0 ? '100%' : '0%'
            }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones</h4>
                <div className="space-y-2">
                  {analysis.margin_percentage >= 20 && (<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ Excelente rentabilidad. Este centro de costo está generando buenos resultados.
                      </p>
                    </div>)}
                  {analysis.margin_percentage >= 10 && analysis.margin_percentage < 20 && (<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Rentabilidad moderada. Considere optimizar procesos para mejorar márgenes.
                      </p>
                    </div>)}
                  {analysis.margin_percentage >= 0 && analysis.margin_percentage < 10 && (<div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        ⚡ Rentabilidad baja. Revise la estructura de costos y procesos de este centro.
                      </p>
                    </div>)}
                  {analysis.margin_percentage < 0 && (<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        🚨 Centro de costo con pérdidas. Requiere atención inmediata y reestructuración.
                      </p>
                    </div>)}
                </div>
              </div>
            </div>
          </Card>
        </>)}
    </div>);
};
