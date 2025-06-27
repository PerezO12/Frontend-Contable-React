// ==========================================
// Componente para comparar reportes
// ==========================================
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { useReportHistory } from '../hooks/useReports';
import { comparisonUtils } from '../utils/reportUtils';
export var ReportComparison = function (_a) {
    var currentReport = _a.currentReport, _b = _a.className, className = _b === void 0 ? '' : _b;
    var getReportsByType = useReportHistory().getReportsByType;
    var _c = useState(null), selectedComparisonReport = _c[0], setSelectedComparisonReport = _c[1];
    // ==========================================
    // Get available reports for comparison
    // ==========================================
    var availableReports = useMemo(function () {
        return getReportsByType(currentReport.report_type)
            .filter(function (report) { return report.generated_at !== currentReport.generated_at; })
            .sort(function (a, b) { return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime(); })
            .slice(0, 5); // Latest 5 reports
    }, [getReportsByType, currentReport]);
    // ==========================================
    // Calculate comparison data
    // ==========================================
    var comparisonData = useMemo(function () {
        if (!selectedComparisonReport)
            return null;
        return comparisonUtils.compareReports(currentReport, selectedComparisonReport);
    }, [currentReport, selectedComparisonReport]);
    // ==========================================
    // Helper functions
    // ==========================================
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var formatVariation = function (variation) {
        var isPositive = variation > 0;
        var color = isPositive ? 'text-green-600' : variation < 0 ? 'text-red-600' : 'text-gray-600';
        var icon = isPositive ? '↗️' : variation < 0 ? '↘️' : '➡️';
        return (<span className={"flex items-center ".concat(color)}>
        <span className="mr-1">{icon}</span>
        {Math.abs(variation).toFixed(1)}%
      </span>);
    };
    var getVariationColor = function (variation) {
        if (variation > 0)
            return 'bg-green-50 border-green-200';
        if (variation < 0)
            return 'bg-red-50 border-red-200';
        return 'bg-gray-50 border-gray-200';
    };
    // ==========================================
    // Render
    // ==========================================
    if (availableReports.length === 0) {
        return (<Card className={"p-6 ".concat(className)}>
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Comparación No Disponible
          </h3>
          <p className="text-gray-600">
            Necesitas al menos dos reportes del mismo tipo para hacer comparaciones.
          </p>
        </div>
      </Card>);
    }
    return (<div className={"space-y-6 ".concat(className)}>
      {/* Report Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Comparación de Reportes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Current Report */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Reporte Actual</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Actual
              </span>
            </div>
            <div className="text-sm text-blue-900">
              <div className="font-medium">{currentReport.project_context}</div>
              <div className="text-xs text-blue-700 mt-1">
                {formatDate(currentReport.generated_at)}
              </div>
            </div>
          </div>

          {/* Comparison Report Selection */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Comparar con</span>
            </div>
            <select value={(selectedComparisonReport === null || selectedComparisonReport === void 0 ? void 0 : selectedComparisonReport.generated_at) || ''} onChange={function (e) {
            var report = availableReports.find(function (r) { return r.generated_at === e.target.value; });
            setSelectedComparisonReport(report || null);
        }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar reporte...</option>
              {availableReports.map(function (report) { return (<option key={report.generated_at} value={report.generated_at}>
                  {formatDate(report.generated_at)} - {report.project_context}
                </option>); })}
            </select>
          </div>
        </div>

        {selectedComparisonReport && (<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-sm text-yellow-800">
              <span className="mr-2">💡</span>
              Comparando períodos: 
              <span className="ml-1 font-medium">
                {formatDate(selectedComparisonReport.period.from_date)} - {formatDate(selectedComparisonReport.period.to_date)}
              </span>
              <span className="mx-2">vs</span>
              <span className="font-medium">
                {formatDate(currentReport.period.from_date)} - {formatDate(currentReport.period.to_date)}
              </span>
            </div>
          </div>)}
      </Card>

      {/* Comparison Results */}
      {comparisonData && (<>
          {/* Total Variations */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Variaciones en Totales
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(comparisonData.totalVariations).map(function (_a) {
                var key = _a[0], variation = _a[1];
                return (<div key={key} className={"p-4 border rounded-lg ".concat(getVariationColor(variation))}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatVariation(variation)}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {variation > 10 ? '📈' : variation < -10 ? '📉' : '📊'}
                    </div>
                  </div>
                </div>);
            })}
            </div>
          </Card>

          {/* Section Variations */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Variaciones por Sección
            </h4>
            
            <div className="space-y-4">
              {comparisonData.sectionVariations.map(function (section, index) { return (<div key={index} className="border border-gray-200 rounded-lg">
                  {/* Section Header */}
                  <div className={"p-4 border-b border-gray-200 ".concat(getVariationColor(section.variation))}>
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">
                        {section.section}
                      </h5>
                      <div className="flex items-center space-x-2">
                        {formatVariation(section.variation)}
                      </div>
                    </div>
                  </div>

                  {/* Account Items */}
                  {section.items.length > 0 && (<div className="p-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Cuentas con mayor variación:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {section.items
                        .filter(function (item) { return Math.abs(item.variation) > 5; }) // Only show significant variations
                        .slice(0, 6) // Limit to 6 items
                        .map(function (item, itemIndex) { return (<div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <span className="text-gray-700 truncate mr-2">
                                {item.account}
                              </span>
                              {formatVariation(item.variation)}
                            </div>); })}
                      </div>
                    </div>)}
                </div>); })}
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Insights de la Comparación
            </h4>
            
            <div className="space-y-3">
              {/* Significant increases */}
              {Object.entries(comparisonData.totalVariations)
                .filter(function (_a) {
                var _ = _a[0], variation = _a[1];
                return variation > 20;
            })
                .map(function (_a) {
                var key = _a[0], variation = _a[1];
                return (<div key={key} className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-500 mr-2 mt-0.5">📈</span>
                    <span className="text-green-800">
                      <strong>{key.replace(/_/g, ' ')}</strong> tuvo un crecimiento significativo del {variation.toFixed(1)}%
                    </span>
                  </div>);
            })}

              {/* Significant decreases */}
              {Object.entries(comparisonData.totalVariations)
                .filter(function (_a) {
                var _ = _a[0], variation = _a[1];
                return variation < -20;
            })
                .map(function (_a) {
                var key = _a[0], variation = _a[1];
                return (<div key={key} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-500 mr-2 mt-0.5">📉</span>
                    <span className="text-red-800">
                      <strong>{key.replace(/_/g, ' ')}</strong> disminuyó significativamente en {Math.abs(variation).toFixed(1)}%
                    </span>
                  </div>);
            })}

              {/* Stable items */}
              {Object.entries(comparisonData.totalVariations)
                .filter(function (_a) {
                var _ = _a[0], variation = _a[1];
                return Math.abs(variation) < 5;
            })
                .map(function (_a) {
                var key = _a[0], _ = _a[1];
                return (<div key={key} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-500 mr-2 mt-0.5">📊</span>
                    <span className="text-blue-800">
                      <strong>{key.replace(/_/g, ' ')}</strong> se mantuvo estable
                    </span>
                  </div>);
            })}
            </div>
          </Card>
        </>)}
    </div>);
};
