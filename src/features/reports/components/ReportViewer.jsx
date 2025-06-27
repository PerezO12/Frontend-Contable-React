// ==========================================
// Componente para mostrar reportes generados
// ==========================================
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useClientExport } from '../hooks/useClientExport';
import { CashFlowViewer } from './CashFlowViewer';
export var ReportViewer = function (_a) {
    var report = _a.report, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useClientExport(), exportToPDF = _c.exportToPDF, exportToExcel = _c.exportToExcel, exportToCSV = _c.exportToCSV, isExporting = _c.isExporting;
    var _d = useState(true), includeNarrative = _d[0], setIncludeNarrative = _d[1];
    // ==========================================
    // Helpers para formateo
    // ==========================================
    var formatCurrency = function (amount) {
        var numAmount = parseFloat(amount.replace(/,/g, ''));
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    var getReportTitle = function (reportType) {
        var titles = {
            'balance_general': 'Balance General',
            'p_g': 'Estado de Pérdidas y Ganancias',
            'flujo_efectivo': 'Estado de Flujo de Efectivo'
        };
        return titles[reportType] || 'Reporte Financiero';
    };
    // ==========================================
    // Componentes de sección
    // ==========================================
    var AccountItem = function (_a) {
        var item = _a.item, _b = _a.level, level = _b === void 0 ? 0 : _b;
        return (<tr className={"".concat(level > 0 ? 'bg-gray-50' : '', " hover:bg-gray-100")}>
      <td className={"px-4 py-2 text-sm ".concat(level > 0 ? 'pl-8' : '')}>
        <div className="flex items-center">
          <span className="font-mono text-xs text-gray-500 mr-2">
            {item.account_code}
          </span>
          <span className={level === 0 ? 'font-medium' : ''}>
            {item.account_name}
          </span>
        </div>
      </td>
      <td className="px-4 py-2 text-sm text-right font-mono">
        {formatCurrency(item.opening_balance)}
      </td>
      <td className="px-4 py-2 text-sm text-right font-mono">
        {formatCurrency(item.movements)}
      </td>
      <td className="px-4 py-2 text-sm text-right font-mono font-medium">
        {formatCurrency(item.closing_balance)}
      </td>
    </tr>);
    };
    var ReportSectionComponent = function (_a) {
        var section = _a.section;
        // Defensive checks for section data
        if (!section || !section.section_name) {
            return null;
        }
        return (<div className="mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-300">
          <h4 className="font-bold text-lg text-gray-800">
            {section.section_name}
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuenta
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Inicial
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimientos
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {section.items && section.items.map(function (item, index) {
                var _a;
                return (<React.Fragment key={"".concat(item.account_code, "-").concat(index)}>
                  <AccountItem item={item} level={item.level || 0}/>
                  {(_a = item.children) === null || _a === void 0 ? void 0 : _a.map(function (child, childIndex) { return (<AccountItem key={"".concat(child.account_code, "-").concat(childIndex)} item={child} level={child.level || 0}/>); })}
                </React.Fragment>);
            })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  Total {section.section_name}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 font-mono">
                  {section.total ? formatCurrency(section.total) : '-'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>);
    };
    // ==========================================
    // Render
    // ==========================================
    // Si es un reporte de flujo de efectivo, usar el componente especializado
    if (report.report_type === 'flujo_efectivo') {
        return (<CashFlowViewer report={report} className={className}/>);
    }
    return (<div className={"space-y-6 ".concat(className)}>
      {/* Header del Reporte */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getReportTitle(report.report_type)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {report.project_context}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Toggle para incluir narrativa */}
            {report.narrative && (<label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={includeNarrative} onChange={function (e) { return setIncludeNarrative(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <span>Incluir análisis</span>
              </label>)}
            
            {/* Botones de exportación */}
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={function () { return exportToPDF(report, { includeNarrative: includeNarrative }); }} disabled={isExporting}>
                📄 PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={function () { return exportToExcel(report, { includeNarrative: includeNarrative }); }} disabled={isExporting}>
                📊 Excel
              </Button>
              <Button variant="secondary" size="sm" onClick={function () { return exportToCSV(report, { includeNarrative: includeNarrative }); }} disabled={isExporting}>
                📋 CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Información del período */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-500">Período:</span>
            <p className="font-medium">
              {formatDate(report.period.from_date)} - {formatDate(report.period.to_date)}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Generado:</span>
            <p className="font-medium">
              {formatDate(report.generated_at)}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Tipo:</span>
            <p className="font-medium capitalize">
              {report.report_type.replace('_', ' ')}
            </p>
          </div>
        </div>
      </Card>

      {/* Contenido del Reporte */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Secciones del reporte */}
          {report.table && report.table.sections && report.table.sections.map(function (section, index) { return (<ReportSectionComponent key={index} section={section}/>); })}

          {/* Totales Generales */}
          {report.table && report.table.totals && Object.keys(report.table.totals).length > 0 && (<div className="border-t-2 border-gray-300 pt-4">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Resumen General
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(report.table.totals).map(function (_a) {
                var key = _a[0], value = _a[1];
                return (<div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {formatCurrency(value)}
                    </span>
                  </div>);
            })}
              </div>
            </div>)}
        </div>
      </Card>

      {/* Narrativa del Reporte */}
      {report.narrative && (<Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📊 Análisis del Reporte
          </h3>
          
          <div className="space-y-6">
            {/* Resumen Ejecutivo */}
            {report.narrative.executive_summary && (<div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Resumen Ejecutivo
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {report.narrative.executive_summary}
                </p>
              </div>)}

            {/* Insights Clave */}
            {report.narrative.key_insights && report.narrative.key_insights.length > 0 && (<div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  💡 Insights Clave
                </h4>
                <ul className="space-y-2">
                  {report.narrative.key_insights.map(function (insight, index) { return (<li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>); })}
                </ul>
              </div>)}

            {/* Recomendaciones */}
            {report.narrative.recommendations && report.narrative.recommendations.length > 0 && (<div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  🎯 Recomendaciones
                </h4>
                <ul className="space-y-2">
                  {report.narrative.recommendations.map(function (recommendation, index) { return (<li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">→</span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>); })}
                </ul>
              </div>)}

            {/* Highlights Financieros */}
            {report.narrative.financial_highlights && Object.keys(report.narrative.financial_highlights).length > 0 && (<div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  📈 Indicadores Destacados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(report.narrative.financial_highlights).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (<div key={key} className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="font-bold text-blue-900">
                        {typeof value === 'number' && key.includes('ratio')
                            ? "".concat((value * 100).toFixed(1), "%")
                            : typeof value === 'string' && value.match(/^\d+\.?\d*$/)
                                ? formatCurrency(value)
                                : value}
                      </div>
                    </div>);
                })}
                </div>
              </div>)}
          </div>
        </Card>)}
    </div>);
};
