// Test file to verify ReportViewer handles undefined data gracefully
import React from 'react';
import { ReportViewer } from './components/ReportViewer';
import type { ReportResponse } from './types';

// Test data with potentially undefined properties to simulate the runtime error
const testReportWithMissingData: ReportResponse = {
  success: true,
  report_type: 'flujo_efectivo',
  generated_at: '2025-06-10T10:00:00Z',
  period: {
    from_date: '2025-01-01',
    to_date: '2025-06-10'
  },
  project_context: 'Test Report with Missing Data',
  table: {
    sections: [
      {
        section_name: 'Flujo de Efectivo Operativo',
        items: [
          {
            account_group: 'INGRESOS',
            account_code: '4.1.01',
            account_name: 'Ventas',
            opening_balance: '0.00',
            movements: '100000.00',
            closing_balance: '100000.00',
            level: 1
          }
        ],
        total: '100000.00'
      },
      // Section with undefined items to test defensive programming
      {
        section_name: 'Flujo de Efectivo de Inversión',
        items: undefined as any, // This will test our defensive checks
        total: '0.00'
      }
    ],
    totals: {
      flujo_neto: '100000.00'
    },
    summary: {}
  },
  narrative: {
    executive_summary: 'Este es un reporte de prueba.',
    key_insights: undefined as any, // This will test our defensive checks
    recommendations: ['Mantener el flujo positivo'],
    financial_highlights: undefined as any // This will test our defensive checks
  }
};

const testReportWithCompleteData: ReportResponse = {
  success: true,
  report_type: 'flujo_efectivo',
  generated_at: '2025-06-10T10:00:00Z',
  period: {
    from_date: '2025-01-01',
    to_date: '2025-06-10'
  },
  project_context: 'Test Report with Complete Data',
  table: {
    sections: [
      {
        section_name: 'Flujo de Efectivo Operativo',
        items: [
          {
            account_group: 'INGRESOS',
            account_code: '4.1.01',
            account_name: 'Ventas',
            opening_balance: '0.00',
            movements: '100000.00',
            closing_balance: '100000.00',
            level: 1
          }
        ],
        total: '100000.00'
      }
    ],
    totals: {
      flujo_neto: '100000.00'
    },
    summary: {}
  },
  narrative: {
    executive_summary: 'Este es un reporte completo de prueba.',
    key_insights: ['El flujo operativo es positivo', 'Las ventas han aumentado'],
    recommendations: ['Mantener el flujo positivo', 'Invertir en nuevas oportunidades'],
    financial_highlights: {
      flujo_operativo: '100000.00',
      ratio_liquidez: '1.5'
    }
  }
};

export const TestReportViewer: React.FC = () => {
  const [testCase, setTestCase] = React.useState<'missing' | 'complete'>('missing');

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTestCase('missing')}
          className={`px-4 py-2 rounded ${
            testCase === 'missing' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Test Missing Data (Should Not Crash)
        </button>
        <button
          onClick={() => setTestCase('complete')}
          className={`px-4 py-2 rounded ${
            testCase === 'complete' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Test Complete Data
        </button>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">
          Testing ReportViewer with {testCase === 'missing' ? 'Missing' : 'Complete'} Data
        </h2>
        
        {testCase === 'missing' ? (
          <ReportViewer report={testReportWithMissingData} />
        ) : (
          <ReportViewer report={testReportWithCompleteData} />
        )}
      </div>
    </div>
  );
};
