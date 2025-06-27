// ==========================================
// Componente principal para filtros de reportes
// ==========================================
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
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useReportFilters } from '../hooks/useReports';
var REPORT_TYPES = [
    {
        value: 'balance_general',
        label: 'Balance General',
        description: 'Estado de situación financiera'
    },
    {
        value: 'p_g',
        label: 'Pérdidas y Ganancias',
        description: 'Estado de resultados'
    },
    {
        value: 'flujo_efectivo',
        label: 'Flujo de Efectivo',
        description: 'Movimientos de efectivo'
    }
];
var DETAIL_LEVELS = [
    {
        value: 'bajo',
        label: 'Básico',
        description: 'Solo totales principales'
    },
    {
        value: 'medio',
        label: 'Intermedio',
        description: 'Cuentas principales'
    },
    {
        value: 'alto',
        label: 'Detallado',
        description: 'Todas las cuentas'
    }
];
// Nuevas opciones para flujo de efectivo
var CASH_FLOW_METHODS = [
    {
        value: 'indirect',
        label: 'Método Indirecto',
        description: 'Ajustes a la utilidad neta'
    },
    {
        value: 'direct',
        label: 'Método Directo',
        description: 'Entradas y salidas brutas'
    }
];
export var ReportFilters = function (_a) {
    var onGenerate = _a.onGenerate, isGenerating = _a.isGenerating, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useReportFilters(), filters = _c.filters, reportType = _c.reportType, setReportType = _c.setReportType, setDetailLevel = _c.setDetailLevel, setDateRange = _c.setDateRange, setFilters = _c.setFilters, resetFilters = _c.resetFilters, validateFilters = _c.validateFilters;
    var _d = useState({}), localErrors = _d[0], setLocalErrors = _d[1];
    // ==========================================
    // Handlers
    // ==========================================
    var handleReportTypeChange = useCallback(function (newType) {
        setReportType(newType);
        setLocalErrors({});
    }, [setReportType]);
    var handleDetailLevelChange = useCallback(function (level) {
        setDetailLevel(level);
    }, [setDetailLevel]);
    var handleDateChange = useCallback(function (field, value) {
        if (field === 'from_date') {
            setDateRange(value, filters.to_date);
        }
        else {
            setDateRange(filters.from_date, value);
        }
        // Limpiar errores de fecha
        setLocalErrors(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a.dateRange = '', _a)));
        });
    }, [filters.from_date, filters.to_date, setDateRange]);
    var handleProjectContextChange = useCallback(function (value) {
        setFilters({ project_context: value || undefined });
    }, [setFilters]);
    var handleCheckboxChange = useCallback(function (field, checked) {
        var _a;
        setFilters((_a = {}, _a[field] = checked, _a));
    }, [setFilters]);
    // Nuevo handler para método de flujo de efectivo
    var handleCashFlowMethodChange = useCallback(function (method) {
        setFilters({ cash_flow_method: method });
    }, [setFilters]);
    var handleGenerate = useCallback(function () {
        // Validar antes de generar
        var validation = validateFilters();
        if (!validation.isValid) {
            var errors_1 = {};
            validation.errors.forEach(function (error) {
                if (error.includes('fecha de inicio'))
                    errors_1.from_date = error;
                else if (error.includes('fecha de fin'))
                    errors_1.to_date = error;
                else if (error.includes('mayor'))
                    errors_1.dateRange = error;
                else if (error.includes('período'))
                    errors_1.dateRange = error;
            });
            setLocalErrors(errors_1);
            return;
        }
        setLocalErrors({});
        onGenerate();
    }, [validateFilters, onGenerate]);
    var handleReset = useCallback(function () {
        resetFilters();
        setLocalErrors({});
    }, [resetFilters]);
    // ==========================================
    // Quick date presets
    // ==========================================
    var setQuickDate = useCallback(function (preset) {
        var today = new Date();
        var fromDate;
        var toDate;
        switch (preset) {
            case 'thisMonth':
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case 'lastMonth':
                fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
                toDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
                break;
            case 'thisYear':
                fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case 'lastYear':
                fromDate = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
                toDate = new Date(today.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
                break;
        }
        setDateRange(fromDate, toDate);
        setLocalErrors(function (prev) { return (__assign(__assign({}, prev), { from_date: '', to_date: '', dateRange: '' })); });
    }, [setDateRange]);
    return (<Card className={"p-6 ".concat(className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Configuración del Reporte
          </h3>
          <Button variant="secondary" size="sm" onClick={handleReset} disabled={isGenerating}>
            Restablecer
          </Button>
        </div>

        {/* Tipo de Reporte */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Reporte
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {REPORT_TYPES.map(function (type) { return (<button key={type.value} onClick={function () { return handleReportTypeChange(type.value); }} disabled={isGenerating} className={"p-3 text-left border rounded-lg transition-colors ".concat(reportType === type.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', " ").concat(isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>); })}
          </div>
        </div>

        {/* Período */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Período del Reporte
          </label>
          
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={function () { return setQuickDate('thisMonth'); }} disabled={isGenerating}>
              Este Mes
            </Button>
            <Button variant="secondary" size="sm" onClick={function () { return setQuickDate('lastMonth'); }} disabled={isGenerating}>
              Mes Anterior
            </Button>
            <Button variant="secondary" size="sm" onClick={function () { return setQuickDate('thisYear'); }} disabled={isGenerating}>
              Este Año
            </Button>
            <Button variant="secondary" size="sm" onClick={function () { return setQuickDate('lastYear'); }} disabled={isGenerating}>
              Año Anterior
            </Button>
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label="Fecha Inicio" type="date" value={filters.from_date} onChange={function (e) { return handleDateChange('from_date', e.target.value); }} disabled={isGenerating} error={localErrors.from_date} required/>
            </div>
            <div>
              <Input label="Fecha Fin" type="date" value={filters.to_date} onChange={function (e) { return handleDateChange('to_date', e.target.value); }} disabled={isGenerating} error={localErrors.to_date} required/>
            </div>
          </div>
          
          {localErrors.dateRange && (<p className="text-sm text-red-600">{localErrors.dateRange}</p>)}
        </div>

        {/* Contexto del Proyecto */}
        <div>
          <Input label="Contexto del Proyecto" placeholder="Nombre de la empresa o proyecto" value={filters.project_context || ''} onChange={function (e) { return handleProjectContextChange(e.target.value); }} disabled={isGenerating} helperText="Opcional: Se usará para personalizar el reporte"/>
        </div>

        {/* Nivel de Detalle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nivel de Detalle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DETAIL_LEVELS.map(function (level) { return (<button key={level.value} onClick={function () { return handleDetailLevelChange(level.value); }} disabled={isGenerating} className={"p-2 text-center border rounded-md text-sm transition-colors ".concat(filters.detail_level === level.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', " ").concat(isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
                <div className="font-medium">{level.label}</div>
                <div className="text-xs text-gray-500 mt-1">{level.description}</div>
              </button>); })}
          </div>
        </div>

        {/* Opciones Adicionales */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Opciones Adicionales
          </label>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" checked={filters.include_subaccounts || false} onChange={function (e) { return handleCheckboxChange('include_subaccounts', e.target.checked); }} disabled={isGenerating} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="ml-2 text-sm text-gray-700">
                Incluir subcuentas en el detalle
              </span>
            </label>

            <label className="flex items-center">
              <input type="checkbox" checked={filters.include_zero_balances || false} onChange={function (e) { return handleCheckboxChange('include_zero_balances', e.target.checked); }} disabled={isGenerating} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="ml-2 text-sm text-gray-700">
                Incluir cuentas con saldo cero
              </span>
            </label>
          </div>
        </div>

        {/* Opciones Específicas para Flujo de Efectivo */}
        {reportType === 'flujo_efectivo' && (<>
            {/* Método de Flujo de Efectivo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                💧 Método de Flujo de Efectivo
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CASH_FLOW_METHODS.map(function (method) { return (<button key={method.value} onClick={function () { return handleCashFlowMethodChange(method.value); }} disabled={isGenerating} className={"p-3 text-left border rounded-lg transition-colors ".concat(filters.cash_flow_method === method.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', " ").concat(isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
                    <div className="font-medium text-sm">{method.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                  </button>); })}
              </div>
            </div>

            {/* Opciones Avanzadas de Flujo de Efectivo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                ⚙️ Opciones Avanzadas de Flujo de Efectivo
              </label>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" checked={filters.enable_reconciliation || false} onChange={function (e) { return handleCheckboxChange('enable_reconciliation', e.target.checked); }} disabled={isGenerating} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="ml-2 text-sm text-gray-700">
                    ✅ Habilitar reconciliación automática
                  </span>
                  <span className="ml-1 text-xs text-gray-500">
                    (Valida que los flujos coincidan con cambios en efectivo)
                  </span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" checked={filters.include_projections || false} onChange={function (e) { return handleCheckboxChange('include_projections', e.target.checked); }} disabled={isGenerating} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="ml-2 text-sm text-gray-700">
                    🔮 Incluir proyecciones de flujo de efectivo
                  </span>
                  <span className="ml-1 text-xs text-gray-500">
                    (Análisis predictivo de 30 días)
                  </span>
                </label>
              </div>
            </div>
          </>)}

        {/* Botón Generar */}
        <div className="pt-4 border-t">
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </div>
    </Card>);
};
