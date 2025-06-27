// ==========================================
// Demo de las nuevas funcionalidades de flujo de efectivo
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
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CashFlowViewer } from './CashFlowViewer';
// Datos de ejemplo que simulan la nueva respuesta del backend
var mockCashFlowResponse = {
    success: true,
    report_type: 'flujo_efectivo',
    generated_at: new Date().toISOString(),
    period: {
        from_date: '2025-01-01',
        to_date: '2025-06-10'
    },
    project_context: 'Demo de Flujo de Efectivo Avanzado',
    table: {
        sections: [
            {
                section_name: 'Actividades Operativas',
                items: [
                    {
                        account_group: 'OPERATIVO',
                        account_code: '4001',
                        account_name: 'Utilidad neta del período',
                        opening_balance: '0.00',
                        movements: '25000.00',
                        closing_balance: '25000.00',
                        level: 1
                    },
                    {
                        account_group: 'OPERATIVO',
                        account_code: '',
                        account_name: 'Ajustes para conciliar utilidad neta:',
                        opening_balance: '0.00',
                        movements: '0.00',
                        closing_balance: '0.00',
                        level: 1
                    },
                    {
                        account_group: 'OPERATIVO',
                        account_code: '5010',
                        account_name: '  Depreciación',
                        opening_balance: '0.00',
                        movements: '3000.00',
                        closing_balance: '3000.00',
                        level: 2
                    },
                    {
                        account_group: 'OPERATIVO',
                        account_code: '1301',
                        account_name: '  Cambios en cuentas por cobrar',
                        opening_balance: '5000.00',
                        movements: '-8000.00',
                        closing_balance: '-3000.00',
                        level: 2
                    },
                    {
                        account_group: 'OPERATIVO',
                        account_code: '2001',
                        account_name: '  Cambios en cuentas por pagar',
                        opening_balance: '2000.00',
                        movements: '7000.00',
                        closing_balance: '9000.00',
                        level: 2
                    }
                ],
                total: '27000.00'
            },
            {
                section_name: 'Actividades de Inversión',
                items: [
                    {
                        account_group: 'INVERSION',
                        account_code: '1201',
                        account_name: 'Compra de equipos de oficina',
                        opening_balance: '0.00',
                        movements: '-15000.00',
                        closing_balance: '-15000.00',
                        level: 1
                    },
                    {
                        account_group: 'INVERSION',
                        account_code: '1202',
                        account_name: 'Inversión en software',
                        opening_balance: '0.00',
                        movements: '-8000.00',
                        closing_balance: '-8000.00',
                        level: 1
                    }
                ],
                total: '-23000.00'
            },
            {
                section_name: 'Actividades de Financiamiento',
                items: [
                    {
                        account_group: 'FINANCIAMIENTO',
                        account_code: '3001',
                        account_name: 'Aporte de capital',
                        opening_balance: '0.00',
                        movements: '75000.00',
                        closing_balance: '75000.00',
                        level: 1
                    },
                    {
                        account_group: 'FINANCIAMIENTO',
                        account_code: '2501',
                        account_name: 'Préstamo bancario obtenido',
                        opening_balance: '0.00',
                        movements: '30000.00',
                        closing_balance: '30000.00',
                        level: 1
                    },
                    {
                        account_group: 'FINANCIAMIENTO',
                        account_code: '3002',
                        account_name: 'Dividendos pagados',
                        opening_balance: '0.00',
                        movements: '-5000.00',
                        closing_balance: '-5000.00',
                        level: 1
                    }
                ],
                total: '100000.00'
            },
            {
                section_name: 'Resumen de Efectivo',
                items: [
                    {
                        account_group: 'RESUMEN',
                        account_code: '',
                        account_name: 'Aumento neto en efectivo',
                        opening_balance: '0.00',
                        movements: '104000.00',
                        closing_balance: '104000.00',
                        level: 1
                    },
                    {
                        account_group: 'RESUMEN',
                        account_code: '',
                        account_name: 'Efectivo al inicio del período',
                        opening_balance: '0.00',
                        movements: '0.00',
                        closing_balance: '15000.00',
                        level: 1
                    },
                    {
                        account_group: 'RESUMEN',
                        account_code: '',
                        account_name: 'Efectivo al final del período',
                        opening_balance: '0.00',
                        movements: '104000.00',
                        closing_balance: '119000.00',
                        level: 1
                    }
                ],
                total: '104000.00'
            }
        ],
        totals: {
            flujo_operativo: '27000.00',
            flujo_inversion: '-23000.00',
            flujo_financiamiento: '100000.00',
            flujo_neto: '104000.00'
        },
        summary: {
            start_date: '2025-01-01',
            end_date: '2025-06-10',
            company_name: 'Empresa Demo S.A.',
            method: 'indirect',
            is_reconciled: true,
            beginning_cash_balance: '15000.00',
            ending_cash_balance: '119000.00',
            net_increase_decrease: '104000.00'
        }
    },
    narrative: {
        executive_summary: 'La empresa ha demostrado una excelente gestión de flujo de efectivo durante el período, con un incremento neto de $104,000. Los flujos operativos positivos de $27,000 indican operaciones saludables, mientras que las inversiones estratégicas de $23,000 en equipos y software posicionan bien a la empresa para el crecimiento futuro. El financiamiento de $100,000 proporciona una base sólida de capital.',
        key_insights: [
            'Flujo operativo positivo de $27,000 demuestra operaciones rentables y sostenibles',
            'Inversiones estratégicas de $23,000 en infraestructura tecnológica y equipos',
            'Financiamiento robusto de $100,000 con aporte de capital y préstamo bancario',
            'Posición de efectivo muy sólida con $119,000 al final del período',
            'Reconciliación exitosa confirma la precisión de los cálculos de flujo'
        ],
        recommendations: [
            'Mantener el momentum de generación operativa de efectivo mediante optimización de procesos',
            'Evaluar el retorno de las inversiones realizadas en equipos y software',
            'Considerar establecer una reserva de efectivo para oportunidades estratégicas',
            'Planificar el uso eficiente del capital recién aportado',
            'Monitorear los términos del préstamo bancario y planificar pagos futuros'
        ],
        financial_highlights: {
            operating_cash_flow: '27000.00',
            investing_cash_flow: '-23000.00',
            financing_cash_flow: '100000.00',
            net_cash_flow: '104000.00',
            cash_position_strength: 'Muy fuerte',
            liquidity_trend: 'Mejorando significativamente',
            method_used: 'Método Indirecto'
        },
        liquidity_analysis: {
            current_ratio: '2.85',
            quick_ratio: '2.40',
            cash_runway_days: 365,
            burn_rate: '326.00',
            liquidity_health: 'Excelente'
        },
        projections: {
            next_30_days: {
                projected_operating: 4500,
                projected_investing: -2000,
                projected_financing: 0,
                projected_net: 2500
            },
            confidence_level: 'Alto'
        }
    }
};
// Versión simplificada sin funcionalidades avanzadas
var mockBasicCashFlowResponse = __assign(__assign({}, mockCashFlowResponse), { narrative: __assign(__assign({}, mockCashFlowResponse.narrative), { liquidity_analysis: undefined, projections: undefined }) });
export var CashFlowDemo = function () {
    var _a = useState('advanced'), demoMode = _a[0], setDemoMode = _a[1];
    var _b = useState(false), showComparison = _b[0], setShowComparison = _b[1];
    var currentReport = demoMode === 'advanced' ? mockCashFlowResponse : mockBasicCashFlowResponse;
    return (<div className="space-y-6">
      {/* Header y controles del demo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              💧 Demo: Nuevas Funcionalidades de Flujo de Efectivo
            </h2>
            <p className="text-gray-600 mt-1">
              Explora las mejoras implementadas basadas en la documentación del backend
            </p>
          </div>
        </div>

        {/* Controles del demo */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <Button variant={demoMode === 'basic' ? 'primary' : 'secondary'} onClick={function () { return setDemoMode('basic'); }} size="sm">
              📊 Versión Básica
            </Button>
            <Button variant={demoMode === 'advanced' ? 'primary' : 'secondary'} onClick={function () { return setDemoMode('advanced'); }} size="sm">
              ⚡ Versión Avanzada
            </Button>
          </div>
          
          <Button variant={showComparison ? 'primary' : 'secondary'} onClick={function () { return setShowComparison(!showComparison); }} size="sm">
            🔄 {showComparison ? 'Ocultar' : 'Mostrar'} Comparación
          </Button>
        </div>

        {/* Información sobre las funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">✨ Nuevas Funcionalidades</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Métodos directo e indirecto</li>
              <li>• Reconciliación automática</li>
              <li>• Análisis de liquidez avanzado</li>
              <li>• Proyecciones de 30 días</li>
              <li>• Narrativa mejorada con IA</li>
              <li>• Categorización automática de cuentas</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">📈 Métricas Incluidas</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Ratio corriente y ratio rápido</li>
              <li>• Días de autonomía de efectivo</li>
              <li>• Tasa de consumo diaria</li>
              <li>• Salud de liquidez</li>
              <li>• Fortaleza de posición de efectivo</li>
              <li>• Tendencias de liquidez</li>
            </ul>
          </div>
        </div>

        {demoMode === 'advanced' && (<div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-2">
              <span className="text-purple-600 mr-2">🔮</span>
              <h4 className="font-semibold text-purple-900">Funcionalidades Avanzadas Activas</h4>
            </div>
            <p className="text-sm text-purple-800">
              Este modo incluye análisis de liquidez completo, proyecciones de flujo de efectivo 
              y recomendaciones inteligentes basadas en IA.
            </p>
          </div>)}
      </Card>

      {/* Comparación lado a lado */}
      {showComparison && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Versión Básica</h3>
            <CashFlowViewer report={mockBasicCashFlowResponse}/>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Versión Avanzada</h3>
            <CashFlowViewer report={mockCashFlowResponse}/>
          </div>
        </div>)}

      {/* Vista principal */}
      {!showComparison && (<CashFlowViewer report={currentReport}/>)}

      {/* Información técnica */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔧 Detalles de Implementación
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Backend Changes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nuevos endpoints con parámetros avanzados</li>
              <li>• Categorización automática de cuentas</li>
              <li>• Validación de reconciliación</li>
              <li>• Algoritmos de proyección</li>
              <li>• Análisis de liquidez integrado</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Frontend Updates</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nuevos tipos TypeScript para cash flow</li>
              <li>• Componente CashFlowViewer especializado</li>
              <li>• Filtros avanzados en ReportFilters</li>
              <li>• Integración con API actualizada</li>
              <li>• Soporte para múltiples métodos de flujo</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">📋 Parámetros de API Disponibles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>method:</strong> 'direct' | 'indirect'
            </div>
            <div>
              <strong>enable_reconciliation:</strong> boolean
            </div>
            <div>
              <strong>include_projections:</strong> boolean
            </div>
          </div>
        </div>
      </Card>
    </div>);
};
