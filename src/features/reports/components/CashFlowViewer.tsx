// ==========================================
// Componente especializado para reportes de flujo de efectivo
// ==========================================

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { SimpleCashFlowExportControls } from './SimpleCashFlowExportControls';
import { CashFlowTemplateDownload } from './CashFlowTemplateDownload';
import type { CashFlowResponse } from '../types';

interface CashFlowViewerProps {
  report: CashFlowResponse;
  className?: string;
}

export const CashFlowViewer: React.FC<CashFlowViewerProps> = ({
  report,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'import_export'>('main');

  // ==========================================
  // Helper functions
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

  const getFlowIcon = (flowValue: string) => {
    const value = parseFloat(flowValue.replace(/,/g, ''));
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➖';
  };
  const getFlowColor = (flowValue: string) => {
    const value = parseFloat(flowValue.replace(/,/g, ''));
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // ==========================================
  // Memoized calculations
  // ==========================================

  const cashFlowMetrics = useMemo(() => {
    const { totals } = report.table;
    const operatingFlow = parseFloat(totals.flujo_operativo.replace(/,/g, ''));
    const investingFlow = parseFloat(totals.flujo_inversion.replace(/,/g, ''));
    const financingFlow = parseFloat(totals.flujo_financiamiento.replace(/,/g, ''));
    const netFlow = parseFloat(totals.flujo_neto.replace(/,/g, ''));

    return {
      operatingFlow,
      investingFlow,
      financingFlow,
      netFlow,
      totalAbsolute: Math.abs(operatingFlow) + Math.abs(investingFlow) + Math.abs(financingFlow),
      operatingPercentage: netFlow !== 0 ? (operatingFlow / netFlow) * 100 : 0,
      investingPercentage: netFlow !== 0 ? (investingFlow / netFlow) * 100 : 0,
      financingPercentage: netFlow !== 0 ? (financingFlow / netFlow) * 100 : 0
    };
  }, [report.table.totals]);

  // ==========================================
  // Render functions
  // ==========================================

  const renderCashFlowSummary = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            💧 Estado de Flujo de Efectivo
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(report.table.summary.start_date)} - {formatDate(report.table.summary.end_date)}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              report.table.summary.method === 'direct' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              Método {report.table.summary.method === 'direct' ? 'Directo' : 'Indirecto'}
            </span>
            {report.table.summary.is_reconciled && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                ✅ Reconciliado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flujos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Flujo Operativo</p>
              <p className={`text-xl font-bold ${getFlowColor(report.table.totals.flujo_operativo)}`}>
                {formatCurrency(report.table.totals.flujo_operativo)}
              </p>
            </div>
            <span className="text-2xl">{getFlowIcon(report.table.totals.flujo_operativo)}</span>
          </div>
          <div className="mt-2">
            <div className="text-xs text-blue-600">
              {cashFlowMetrics.operatingPercentage.toFixed(1)}% del flujo neto
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Flujo de Inversión</p>
              <p className={`text-xl font-bold ${getFlowColor(report.table.totals.flujo_inversion)}`}>
                {formatCurrency(report.table.totals.flujo_inversion)}
              </p>
            </div>
            <span className="text-2xl">{getFlowIcon(report.table.totals.flujo_inversion)}</span>
          </div>
          <div className="mt-2">
            <div className="text-xs text-orange-600">
              {Math.abs(cashFlowMetrics.investingPercentage).toFixed(1)}% del flujo neto
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Flujo de Financiamiento</p>
              <p className={`text-xl font-bold ${getFlowColor(report.table.totals.flujo_financiamiento)}`}>
                {formatCurrency(report.table.totals.flujo_financiamiento)}
              </p>
            </div>
            <span className="text-2xl">{getFlowIcon(report.table.totals.flujo_financiamiento)}</span>
          </div>
          <div className="mt-2">
            <div className="text-xs text-purple-600">
              {Math.abs(cashFlowMetrics.financingPercentage).toFixed(1)}% del flujo neto
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Flujo Neto</p>
              <p className={`text-xl font-bold ${getFlowColor(report.table.totals.flujo_neto)}`}>
                {formatCurrency(report.table.totals.flujo_neto)}
              </p>
            </div>
            <span className="text-2xl">{getFlowIcon(report.table.totals.flujo_neto)}</span>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-600">
              Cambio neto en efectivo
            </div>
          </div>
        </div>
      </div>

      {/* Efectivo inicial y final */}
      {report.table.summary.beginning_cash_balance && report.table.summary.ending_cash_balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Efectivo Inicial</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(report.table.summary.beginning_cash_balance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Cambio Neto</p>
            <p className={`text-lg font-bold ${getFlowColor(report.table.totals.flujo_neto)}`}>
              {formatCurrency(report.table.summary.net_increase_decrease || report.table.totals.flujo_neto)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Efectivo Final</p>
            <p className="text-lg font-bold text-blue-900">
              {formatCurrency(report.table.summary.ending_cash_balance)}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
  const renderDetailedTable = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📋 Detalle por Actividades
      </h3>

      <div className="space-y-6">
        {report.table.sections.map((section, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-800">
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
                  {section.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className={`${item.level > 1 ? 'bg-gray-50' : ''}`}>
                      <td className={`px-4 py-2 text-sm ${item.level > 1 ? 'pl-8' : ''}`}>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.account_name}
                          </div>
                          {item.account_code && (
                            <div className="text-xs text-gray-500">
                              {item.account_code}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-mono">
                        {formatCurrency(item.opening_balance)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right font-mono font-medium ${
                        getFlowColor(item.movements)
                      }`}>
                        {formatCurrency(item.movements)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-mono font-medium">
                        {formatCurrency(item.closing_balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                      Total {section.section_name}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 font-mono">
                      {formatCurrency(section.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  // ==========================================
  // Main render
  // ==========================================

  return (
    <div className={`space-y-6 ${className}`}>      {/* Navigation tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection('main')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'main'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💧 Flujo de Efectivo
        </button>
        <button
          onClick={() => setActiveSection('import_export')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'import_export'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📥 Importar
        </button>
      </div>      {/* Content sections */}
      {activeSection === 'main' && (
        <>
          {renderCashFlowSummary()}
          {renderDetailedTable()}
          
          {/* Export controls integrated in main view */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📤 Exportar Reporte
            </h3>
            <SimpleCashFlowExportControls report={report} />
          </Card>
        </>
      )}

      {activeSection === 'import_export' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📤 Exportar Datos
            </h3>
            <SimpleCashFlowExportControls report={report} />
          </Card>
          
          <CashFlowTemplateDownload />
        </div>
      )}
    </div>
  );
};
