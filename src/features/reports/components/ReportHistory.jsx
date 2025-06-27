// ==========================================
// Componente para mostrar historial de reportes
// ==========================================
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
export var ReportHistory = function (_a) {
    var reports = _a.reports, onSelectReport = _a.onSelectReport, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = useState('all'), filterType = _d[0], setFilterType = _d[1];
    var _e = useState('date'), sortBy = _e[0], setSortBy = _e[1];
    // ==========================================
    // Filtering and sorting logic
    // ==========================================
    var filteredAndSortedReports = useMemo(function () {
        var filtered = reports;
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(function (report) {
                return report.project_context.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    report.report_type.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(function (report) { return report.report_type === filterType; });
        }
        // Sort
        filtered.sort(function (a, b) {
            if (sortBy === 'date') {
                return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime();
            }
            else {
                return a.report_type.localeCompare(b.report_type);
            }
        });
        return filtered;
    }, [reports, searchTerm, filterType, sortBy]);
    // ==========================================
    // Helper functions
    // ==========================================
    var getReportTypeName = function (type) {
        var names = {
            'balance_general': 'Balance General',
            'p_g': 'Pérdidas y Ganancias',
            'flujo_efectivo': 'Flujo de Efectivo',
            'balance_comprobacion': 'Balance de Comprobación'
        };
        return names[type] || type;
    };
    var getReportTypeColor = function (type) {
        var colors = {
            'balance_general': 'bg-blue-100 text-blue-800',
            'p_g': 'bg-green-100 text-green-800',
            'flujo_efectivo': 'bg-yellow-100 text-yellow-800',
            'balance_comprobacion': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var formatPeriod = function (fromDate, toDate) {
        var from = new Date(fromDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
        var to = new Date(toDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
        return "".concat(from, " - ").concat(to);
    };
    // ==========================================
    // Render
    // ==========================================
    if (reports.length === 0) {
        return (<Card className={"p-12 text-center ".concat(className)}>
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin Historial de Reportes
        </h3>
        <p className="text-gray-600">
          Los reportes que generes aparecerán aquí para fácil acceso.
        </p>
      </Card>);
    }
    return (<div className={"space-y-6 ".concat(className)}>
      {/* Header and Controls */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Historial de Reportes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedReports.length} de {reports.length} reportes
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Buscar por proyecto o tipo..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full sm:w-64"/>
            
            <select value={filterType} onChange={function (e) { return setFilterType(e.target.value); }} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos los tipos</option>
              <option value="balance_general">Balance General</option>
              <option value="p_g">Pérdidas y Ganancias</option>
              <option value="flujo_efectivo">Flujo de Efectivo</option>
            </select>

            <select value={sortBy} onChange={function (e) { return setSortBy(e.target.value); }} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="date">Por fecha</option>
              <option value="type">Por tipo</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedReports.map(function (report, index) {
            var _a;
            return (<Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={"px-2 py-1 text-xs font-medium rounded-full ".concat(getReportTypeColor(report.report_type))}>
                    {getReportTypeName(report.report_type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(report.generated_at)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">
                  {report.project_context}
                </h3>
                
                <p className="text-sm text-gray-600">
                  Período: {formatPeriod(report.period.from_date, report.period.to_date)}
                </p>
              </div>

              {onSelectReport && (<Button size="sm" variant="secondary" onClick={function () { return onSelectReport(report); }}>
                  Ver
                </Button>)}
            </div>

            {/* Summary Info */}
            <div className="space-y-2">
              {/* Executive Summary Preview */}
              {((_a = report.narrative) === null || _a === void 0 ? void 0 : _a.executive_summary) && (<div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {report.narrative.executive_summary}
                  </p>
                </div>)}

              {/* Key Metrics */}
              {report.table.totals && Object.keys(report.table.totals).length > 0 && (<div className="flex flex-wrap gap-2">
                  {Object.entries(report.table.totals).slice(0, 2).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return (<div key={key} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="font-medium">
                        {key.replace(/_/g, ' ')}: 
                      </span>
                      <span className="ml-1">
                        {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(parseFloat(value.replace(/,/g, '')))}
                      </span>
                    </div>);
                    })}
                </div>)}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <span>📊</span>
                <span className="ml-1">
                  {report.table.sections.length} sección{report.table.sections.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  📄 PDF
                </button>
                <button className="text-xs text-green-600 hover:text-green-800">
                  📊 Excel
                </button>
              </div>
            </div>
          </Card>);
        })}
      </div>

      {filteredAndSortedReports.length === 0 && (<Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron reportes
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </Card>)}
    </div>);
};
