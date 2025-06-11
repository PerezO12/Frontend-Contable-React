// ==========================================
// Dashboard principal para el módulo de reportes
// ==========================================

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ReportFilters } from '../components/ReportFilters';
import { ReportViewer } from '../components/ReportViewer';
import { ReportHistory } from '../components/ReportHistory';
import { FinancialSummary } from '../components/FinancialSummary';
import { useReports, useReportHistory, useFinancialAnalysis } from '../hooks/useReports';
import type { GenerateReportParams } from '../types';

export const ReportsDashboard: React.FC = () => {  const { 
    reportsState, 
    generateReport, 
    clearCurrentReport
  } = useReports();
  
  const { getRecentReports } = useReportHistory();
  const { getFinancialHealth } = useFinancialAnalysis();

  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'analysis'>('generator');

  // ==========================================
  // Handlers
  // ==========================================

  const handleGenerateReport = useCallback(async () => {
    const params: GenerateReportParams = {
      reportType: reportsState.selectedReportType,
      filters: reportsState.currentFilters,
      useClassicFormat: false
    };

    try {
      await generateReport(params);
      setActiveTab('generator'); // Asegurar que estamos en la pestaña correcta para ver el reporte
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  }, [reportsState.selectedReportType, reportsState.currentFilters, generateReport]);

  const handleClearReport = useCallback(() => {
    clearCurrentReport();
  }, [clearCurrentReport]);

  // ==========================================
  // Computed values
  // ==========================================

  const recentReports = getRecentReports(5);
  const financialHealth = getFinancialHealth();
  const hasCurrentReport = !!reportsState.currentReport;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Centro de Reportes Financieros
          </h1>
          <p className="text-gray-600">
            Genera y analiza reportes financieros de manera profesional y detallada
          </p>
        </div>

        {/* Error Display */}
        {reportsState.error && (
          <Card className="mb-6 p-4 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700">{reportsState.error}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {/* Clear error logic handled in store */}}
                className="text-red-600 border-red-300 hover:bg-red-100"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reportes Generados</p>
                <p className="text-xl font-bold text-gray-900">
                  {reportsState.reportHistory.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado Actual</p>
                <p className="text-xl font-bold text-gray-900">
                  {hasCurrentReport ? 'Disponible' : 'Sin Reporte'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <span className="text-yellow-600 text-xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Salud Financiera</p>
                <p className="text-xl font-bold text-gray-900">
                  {financialHealth?.level || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <span className="text-purple-600 text-xl">⚡</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Último Reporte</p>
                <p className="text-xl font-bold text-gray-900">
                  {recentReports[0] ? 
                    new Date(recentReports[0].generated_at).toLocaleDateString('es-CO', { 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'generator'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔧 Generador
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Historial
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Análisis
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Filters */}
            <div className="lg:col-span-1">
              <ReportFilters
                onGenerate={handleGenerateReport}
                isGenerating={reportsState.isGenerating}
              />
            </div>

            {/* Right Column - Report Display */}
            <div className="lg:col-span-2">
              {reportsState.isGenerating ? (
                <Card className="p-12 text-center">
                  <Spinner size="lg" className="mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generando Reporte
                  </h3>
                  <p className="text-gray-600">
                    Por favor espera mientras procesamos tu solicitud...
                  </p>
                </Card>
              ) : hasCurrentReport ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Reporte Generado
                    </h2>
                    <Button
                      variant="secondary"
                      onClick={handleClearReport}
                      size="sm"
                    >
                      Limpiar
                    </Button>
                  </div>
                  <ReportViewer report={reportsState.currentReport!} />
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Listo para Generar Reporte
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configura los filtros en el panel izquierdo y haz clic en "Generar Reporte" para comenzar.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
                    <ul className="text-sm text-blue-800 text-left space-y-1">
                      <li>• Selecciona el tipo de reporte apropiado para tu análisis</li>
                      <li>• Usa los atajos de fecha para períodos comunes</li>
                      <li>• El nivel "Intermedio" es ideal para la mayoría de casos</li>
                      <li>• Puedes exportar en PDF, Excel o CSV después de generar</li>
                    </ul>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <ReportHistory reports={reportsState.reportHistory} />
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {financialHealth ? (
              <FinancialSummary 
                health={financialHealth}
                currentReport={reportsState.currentReport}
              />
            ) : (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Análisis No Disponible
                </h3>
                <p className="text-gray-600 mb-6">
                  Genera un Balance General para ver el análisis financiero detallado.
                </p>
                <Button
                  onClick={() => setActiveTab('generator')}
                  className="mx-auto"
                >
                  Ir al Generador
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
