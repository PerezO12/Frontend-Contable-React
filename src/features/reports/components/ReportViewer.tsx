// ==========================================
// Componente para mostrar reportes generados
// ==========================================

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useReportExport } from '../hooks/useReports';
import type { ReportResponse, AccountReportItem, ReportSection } from '../types';

interface ReportViewerProps {
  report: ReportResponse;
  className?: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  className = ''
}) => {
  const { exportToPDF, exportToExcel, exportToCSV, isExporting } = useReportExport();

  // ==========================================
  // Helpers para formateo
  // ==========================================

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReportTitle = (reportType: string) => {
    const titles = {
      'balance_general': 'Balance General',
      'p_g': 'Estado de Pérdidas y Ganancias',
      'flujo_efectivo': 'Estado de Flujo de Efectivo'
    };
    return titles[reportType as keyof typeof titles] || 'Reporte Financiero';
  };

  // ==========================================
  // Componentes de sección
  // ==========================================

  const AccountItem: React.FC<{ item: AccountReportItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => (
    <tr className={`${level > 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
      <td className={`px-4 py-2 text-sm ${level > 0 ? 'pl-8' : ''}`}>
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
    </tr>
  );
  const ReportSectionComponent: React.FC<{ section: ReportSection }> = ({ section }) => {
    // Defensive checks for section data
    if (!section || !section.section_name) {
      return null;
    }

    return (
    <div className="mb-6">
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
          </thead>          <tbody className="bg-white divide-y divide-gray-200">
            {section.items && section.items.map((item, index) => (
              <React.Fragment key={`${item.account_code}-${index}`}>
                <AccountItem item={item} level={item.level || 0} />
                {item.children?.map((child, childIndex) => (
                  <AccountItem 
                    key={`${child.account_code}-${childIndex}`} 
                    item={child} 
                    level={child.level || 0} 
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                Total {section.section_name}
              </td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 font-mono">
                {section.total ? formatCurrency(section.total) : '-'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className={`space-y-6 ${className}`}>
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
            {/* Botones de exportación */}
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToPDF(true)}
              disabled={isExporting}
            >
              📄 PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToExcel()}
              disabled={isExporting}
            >
              📊 Excel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToCSV()}
              disabled={isExporting}
            >
              📋 CSV
            </Button>
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
      <Card className="p-6">        <div className="space-y-6">
          {/* Secciones del reporte */}
          {report.table && report.table.sections && report.table.sections.map((section, index) => (
            <ReportSectionComponent key={index} section={section} />
          ))}

          {/* Totales Generales */}
          {report.table && report.table.totals && Object.keys(report.table.totals).length > 0 && (
            <div className="border-t-2 border-gray-300 pt-4">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Resumen General
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(report.table.totals).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {formatCurrency(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Narrativa del Reporte */}
      {report.narrative && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📊 Análisis del Reporte
          </h3>
          
          <div className="space-y-6">            {/* Resumen Ejecutivo */}
            {report.narrative.executive_summary && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Resumen Ejecutivo
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {report.narrative.executive_summary}
                </p>
              </div>
            )}{/* Insights Clave */}
            {report.narrative.key_insights && report.narrative.key_insights.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  💡 Insights Clave
                </h4>
                <ul className="space-y-2">
                  {report.narrative.key_insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendaciones */}
            {report.narrative.recommendations && report.narrative.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  🎯 Recomendaciones
                </h4>
                <ul className="space-y-2">
                  {report.narrative.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">→</span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}            {/* Highlights Financieros */}
            {report.narrative.financial_highlights && Object.keys(report.narrative.financial_highlights).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  📈 Indicadores Destacados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(report.narrative.financial_highlights).map(([key, value]) => (
                    <div key={key} className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="font-bold text-blue-900">
                        {typeof value === 'number' && key.includes('ratio') 
                          ? `${(value * 100).toFixed(1)}%`
                          : typeof value === 'string' && value.match(/^\d+\.?\d*$/)
                          ? formatCurrency(value)
                          : value
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
