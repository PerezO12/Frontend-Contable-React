// ==========================================
// Componente para análisis financiero y resumen
// ==========================================

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import type { ReportResponse } from '../types';

interface FinancialHealth {
  score: number;
  level: string;
  ratios: {
    debtToEquityRatio: number;
    equityRatio: number;
    debtRatio: number;
  };
  alerts: string[];
}

interface FinancialSummaryProps {
  health: FinancialHealth;
  currentReport: ReportResponse | null;
  className?: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  health,
  currentReport,
  className = ''
}) => {
  // ==========================================
  // Calculate additional metrics
  // ==========================================

  const additionalMetrics = useMemo(() => {
    if (!currentReport || currentReport.report_type !== 'balance_general') {
      return null;
    }

    const { table } = currentReport;
    const assets = table.sections.find(s => s.section_name === 'ACTIVOS');
    const liabilities = table.sections.find(s => s.section_name === 'PASIVOS');

    if (!assets || !liabilities) return null;

    // Calculate current assets and current liabilities (simplified)
    const currentAssets = assets.items
      .filter(item => item.account_name.toLowerCase().includes('corriente') || 
                     item.account_name.toLowerCase().includes('caja') ||
                     item.account_name.toLowerCase().includes('banco'))
      .reduce((sum, item) => sum + parseFloat(item.closing_balance.replace(/,/g, '')), 0);

    const currentLiabilities = liabilities.items
      .filter(item => item.account_name.toLowerCase().includes('corriente') ||
                     item.account_name.toLowerCase().includes('proveedor'))
      .reduce((sum, item) => sum + parseFloat(item.closing_balance.replace(/,/g, '')), 0);

    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const workingCapital = currentAssets - currentLiabilities;

    return {
      currentRatio,
      workingCapital,
      currentAssets,
      currentLiabilities
    };
  }, [currentReport]);

  // ==========================================
  // Helper functions
  // ==========================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (ratio: number) => {
    return `${(ratio * 100).toFixed(1)}%`;
  };

  const getRatioInterpretation = (value: number, type: 'debt_equity' | 'current' | 'equity') => {
    switch (type) {
      case 'debt_equity':
        if (value < 0.5) return { color: 'green', text: 'Excelente' };
        if (value < 1) return { color: 'yellow', text: 'Bueno' };
        return { color: 'red', text: 'Alto riesgo' };
      
      case 'current':
        if (value >= 2) return { color: 'green', text: 'Excelente' };
        if (value >= 1.2) return { color: 'yellow', text: 'Aceptable' };
        return { color: 'red', text: 'Preocupante' };
      
      case 'equity':
        if (value >= 0.5) return { color: 'green', text: 'Sólido' };
        if (value >= 0.3) return { color: 'yellow', text: 'Moderado' };
        return { color: 'red', text: 'Débil' };
      
      default:
        return { color: 'gray', text: 'N/A' };
    }
  };

  const getHealthLevelColor = (level: string) => {
    const colors = {
      'Bueno': 'bg-green-100 text-green-800',
      'Regular': 'bg-yellow-100 text-yellow-800',
      'Preocupante': 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Health Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            📊 Análisis Financiero
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthLevelColor(health.level)}`}>
            {health.level}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Score Visualization */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={health.score >= 70 ? '#10b981' : health.score >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(health.score / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {health.score}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Puntuación de Salud Financiera</p>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Ratio Deuda/Patrimonio</span>
                <span className="text-sm font-medium">
                  {formatPercentage(health.ratios.debtToEquityRatio)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.ratios.debtToEquityRatio < 0.5 ? 'bg-green-500' :
                    health.ratios.debtToEquityRatio < 1 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(health.ratios.debtToEquityRatio * 50, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Ratio de Patrimonio</span>
                <span className="text-sm font-medium">
                  {formatPercentage(health.ratios.equityRatio)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.ratios.equityRatio > 0.5 ? 'bg-green-500' :
                    health.ratios.equityRatio > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${health.ratios.equityRatio * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Ratio de Deuda</span>
                <span className="text-sm font-medium">
                  {formatPercentage(health.ratios.debtRatio)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.ratios.debtRatio < 0.3 ? 'bg-green-500' :
                    health.ratios.debtRatio < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${health.ratios.debtRatio * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Liquidity Metrics */}
      {additionalMetrics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💧 Análisis de Liquidez
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Ratio Corriente</div>
              <div className="text-xl font-bold text-blue-900">
                {additionalMetrics.currentRatio.toFixed(2)}
              </div>
              <div className={`text-xs mt-1 ${
                getRatioInterpretation(additionalMetrics.currentRatio, 'current').color === 'green' 
                  ? 'text-green-600' 
                  : getRatioInterpretation(additionalMetrics.currentRatio, 'current').color === 'yellow'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {getRatioInterpretation(additionalMetrics.currentRatio, 'current').text}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Capital de Trabajo</div>
              <div className="text-lg font-bold text-green-900">
                {formatCurrency(additionalMetrics.workingCapital)}
              </div>
              <div className={`text-xs mt-1 ${
                additionalMetrics.workingCapital > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {additionalMetrics.workingCapital > 0 ? 'Positivo' : 'Negativo'}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 mb-1">Activos Corrientes</div>
              <div className="text-lg font-bold text-yellow-900">
                {formatCurrency(additionalMetrics.currentAssets)}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 mb-1">Pasivos Corrientes</div>
              <div className="text-lg font-bold text-red-900">
                {formatCurrency(additionalMetrics.currentLiabilities)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts and Recommendations */}
      {health.alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚠️ Alertas y Recomendaciones
          </h3>
          
          <div className="space-y-3">
            {health.alerts.map((alert, index) => (
              <div key={index} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-500 mr-2 mt-0.5">⚠️</span>
                <span className="text-yellow-800">{alert}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Narrative from Current Report */}
      {currentReport?.narrative && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Resumen del Último Reporte
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {currentReport.narrative.executive_summary}
              </p>
            </div>

            {currentReport.narrative.key_insights.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">💡 Insights Principales:</h4>
                <ul className="space-y-1">
                  {currentReport.narrative.key_insights.slice(0, 3).map((insight, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
