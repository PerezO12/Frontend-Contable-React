// ==========================================
// Test component for Cash Flow functionality
// ==========================================

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CashFlowViewer } from './CashFlowViewer';
import type { CashFlowResponse } from '../types';

// Mock data that follows the new cash flow structure
const mockCashFlowData: CashFlowResponse = {
  success: true,
  report_type: 'flujo_efectivo',
  generated_at: new Date().toISOString(),
  period: {
    from_date: '2025-01-01',
    to_date: '2025-06-11'
  },
  project_context: 'Test de Funcionalidades de Cash Flow',
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
            movements: '50000.00',
            closing_balance: '50000.00',
            level: 1
          },
          {
            account_group: 'OPERATIVO',
            account_code: '5010',
            account_name: 'Depreciación',
            opening_balance: '0.00',
            movements: '5000.00',
            closing_balance: '5000.00',
            level: 2
          },
          {
            account_group: 'OPERATIVO',
            account_code: '1301',
            account_name: 'Cambios en cuentas por cobrar',
            opening_balance: '10000.00',
            movements: '-15000.00',
            closing_balance: '-5000.00',
            level: 2
          }
        ],
        total: '40000.00'
      },
      {
        section_name: 'Actividades de Inversión',
        items: [
          {
            account_group: 'INVERSION',
            account_code: '1201',
            account_name: 'Compra de equipos',
            opening_balance: '0.00',
            movements: '-25000.00',
            closing_balance: '-25000.00',
            level: 1
          }
        ],
        total: '-25000.00'
      },
      {
        section_name: 'Actividades de Financiamiento',
        items: [
          {
            account_group: 'FINANCIAMIENTO',
            account_code: '2501',
            account_name: 'Préstamo bancario',
            opening_balance: '0.00',
            movements: '30000.00',
            closing_balance: '30000.00',
            level: 1
          }
        ],
        total: '30000.00'
      }
    ],
    totals: {
      flujo_operativo: '40000.00',
      flujo_inversion: '-25000.00',
      flujo_financiamiento: '30000.00',
      flujo_neto: '45000.00'
    },
    summary: {
      start_date: '2025-01-01',
      end_date: '2025-06-11',
      company_name: 'Empresa de Prueba S.A.',
      method: 'indirect' as const,
      is_reconciled: true,
      beginning_cash_balance: '20000.00',
      ending_cash_balance: '65000.00',
      net_increase_decrease: '45000.00'
    }
  },
  narrative: {
    executive_summary: 'La empresa ha logrado un incremento neto de efectivo de $45,000 durante el período analizado. Los flujos operativos positivos de $40,000 demuestran una operación saludable, mientras que las inversiones estratégicas de $25,000 en equipos posicionan a la empresa para crecimiento futuro.',
    key_insights: [
      'Flujo operativo robusto de $40,000 indica operaciones rentables y sostenibles',
      'Inversión estratégica de $25,000 en infraestructura para crecimiento',
      'Financiamiento de $30,000 proporciona capital adicional para expansión',
      'Posición de efectivo sólida con $65,000 al final del período',
      'Reconciliación exitosa confirma precisión de los cálculos'
    ],
    recommendations: [
      'Mantener el momentum operativo mediante optimización de procesos',
      'Evaluar el retorno esperado de las inversiones en equipos',
      'Considerar establecer una reserva de efectivo para contingencias',
      'Monitorear términos del préstamo bancario y planificar pagos',
      'Implementar reportes de seguimiento mensual de liquidez'
    ],
    financial_highlights: {
      operating_cash_flow: '40000.00',
      investing_cash_flow: '-25000.00',
      financing_cash_flow: '30000.00',
      net_cash_flow: '45000.00',
      cash_position_strength: 'Fuerte',
      liquidity_trend: 'Mejorando',
      method_used: 'Método Indirecto'
    },
    liquidity_analysis: {
      current_ratio: '2.45',
      quick_ratio: '2.10',
      cash_runway_days: 180,
      burn_rate: '361.00',
      liquidity_health: 'Excelente'
    },
    projections: {
      next_30_days: {
        projected_operating: 6500,
        projected_investing: -3000,
        projected_financing: 0,
        projected_net: 3500
      },
      confidence_level: 'Alto'
    }
  }
};

export const CashFlowTest: React.FC = () => {
  const [showTest, setShowTest] = React.useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🧪 Test de Funcionalidades Cash Flow
            </h2>
            <p className="text-gray-600 mt-1">
              Verificación de componentes y tipos para flujo de efectivo
            </p>
          </div>
          <Button
            onClick={() => setShowTest(!showTest)}
            variant={showTest ? 'secondary' : 'primary'}
          >
            {showTest ? 'Ocultar Test' : 'Mostrar Test'}
          </Button>
        </div>

        {/* Test status indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 text-2xl mr-3">✅</span>
              <div>
                <div className="font-medium text-green-900">Tipos TypeScript</div>
                <div className="text-sm text-green-700">CashFlowResponse, interfaces</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-blue-600 text-2xl mr-3">⚡</span>
              <div>
                <div className="font-medium text-blue-900">Componente Especializado</div>
                <div className="text-sm text-blue-700">CashFlowViewer funcional</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-purple-600 text-2xl mr-3">🔮</span>
              <div>
                <div className="font-medium text-purple-900">Funcionalidades Avanzadas</div>
                <div className="text-sm text-purple-700">Análisis y proyecciones</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features checklist */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">✅ Funcionalidades Implementadas:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Métodos directo e indirecto</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Reconciliación automática</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Análisis de liquidez avanzado</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Proyecciones de 30 días</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Narrativa mejorada con IA</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Filtros específicos de cash flow</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Test cash flow viewer */}
      {showTest && (
        <CashFlowViewer report={mockCashFlowData} />
      )}
    </div>
  );
};
