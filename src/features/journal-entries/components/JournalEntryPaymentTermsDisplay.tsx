import React from 'react';
import { Card } from '../../../components/ui/Card';
import { formatCurrency, formatDateSafe } from '../../../shared/utils';
import { JournalEntryService } from '../services';
import type { JournalEntry, JournalEntryLine } from '../types';

interface JournalEntryPaymentTermsDisplayProps {
  entry: JournalEntry;
  className?: string;
}

export const JournalEntryPaymentTermsDisplay: React.FC<JournalEntryPaymentTermsDisplayProps> = ({
  entry,
  className = ""
}) => {
  // Filter lines that have payment terms
  const linesWithPaymentTerms = entry.lines.filter(line => line.payment_terms_id);

  if (linesWithPaymentTerms.length === 0) {
    return null;
  }

  // Group lines by payment terms
  const groupedByPaymentTerms = linesWithPaymentTerms.reduce((groups, line) => {
    const key = `${line.payment_terms_id}-${line.payment_terms_code}`;
    if (!groups[key]) {
      groups[key] = {
        payment_terms_id: line.payment_terms_id!,
        payment_terms_code: line.payment_terms_code!,
        payment_terms_name: line.payment_terms_name!,
        lines: []
      };
    }
    groups[key].lines.push(line);
    return groups;
  }, {} as Record<string, {
    payment_terms_id: string;
    payment_terms_code: string;
    payment_terms_name: string;
    lines: JournalEntryLine[];
  }>);

  return (
    <Card className={`${className}`}>
      <div className="card-header">
        <h3 className="card-title">Condiciones de Pago</h3>
      </div>
      <div className="card-body space-y-4">
        {Object.values(groupedByPaymentTerms).map(group => {
          const totalAmount = group.lines.reduce((sum, line) => {
            return sum + Math.max(parseFloat(line.debit_amount), parseFloat(line.credit_amount));
          }, 0);

          return (
            <div key={group.payment_terms_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {group.payment_terms_code}
                  </span>
                  <span className="ml-2 font-medium">{group.payment_terms_name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Monto Total</div>
                  <div className="font-bold text-lg">{formatCurrency(totalAmount)}</div>
                </div>
              </div>

              {/* Lines with these payment terms */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Líneas Afectadas:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 px-2 font-medium text-gray-700">Cuenta</th>
                        <th className="text-left py-1 px-2 font-medium text-gray-700">Descripción</th>
                        <th className="text-right py-1 px-2 font-medium text-gray-700">Monto</th>
                        <th className="text-left py-1 px-2 font-medium text-gray-700">F. Factura</th>
                        <th className="text-left py-1 px-2 font-medium text-gray-700">F. Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody>                      {group.lines.map((line, index) => {
                        const lineAmount = Math.max(parseFloat(line.debit_amount), parseFloat(line.credit_amount));                        // Calcular fechas correctas usando cronograma de pagos
                        const { finalDueDate, isCalculated } = JournalEntryService.calculateCorrectDueDatesForLine(line);
                        console.log('📊 PaymentTermsDisplay - line:', line.account_code, 'finalDueDate:', finalDueDate, 'isCalculated:', isCalculated);
                        
                        return (
                          <tr key={index} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-1 px-2">
                              <div className="font-mono text-xs text-blue-600">{line.account_code}</div>
                              <div className="text-xs text-gray-600 truncate max-w-24">{line.account_name}</div>
                            </td>
                            <td className="py-1 px-2 text-gray-700">
                              {line.description || '-'}
                            </td>
                            <td className="py-1 px-2 text-right font-medium">
                              {formatCurrency(lineAmount)}
                            </td>                            <td className="py-1 px-2 text-gray-600">
                              {line.invoice_date 
                                ? formatDateSafe(line.invoice_date)
                                : '-'
                              }
                            </td>                            <td className="py-1 px-2 text-gray-600">
                              <div className="flex items-center gap-1">
                                {finalDueDate 
                                  ? formatDateSafe(finalDueDate)
                                  : '-'
                                }
                                {isCalculated && (
                                  <span 
                                    title="Fecha calculada según cronograma de pagos" 
                                    className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                                  ></span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment schedule if available */}
              {group.lines.some(line => line.payment_schedule && line.payment_schedule.length > 0) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cronograma de Pagos:</h4>
                  {group.lines.map((line, lineIndex) => {
                    if (!line.payment_schedule || line.payment_schedule.length === 0) return null;
                    
                    return (
                      <div key={lineIndex} className="mb-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Línea {lineIndex + 1}: {line.account_code} ({formatCurrency(Math.max(parseFloat(line.debit_amount), parseFloat(line.credit_amount)))})
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs bg-gray-50 rounded">
                            <thead>
                              <tr>
                                <th className="text-left py-1 px-2 text-gray-600">#</th>
                                <th className="text-left py-1 px-2 text-gray-600">Días</th>
                                <th className="text-left py-1 px-2 text-gray-600">Fecha</th>
                                <th className="text-right py-1 px-2 text-gray-600">%</th>
                                <th className="text-right py-1 px-2 text-gray-600">Monto</th>
                              </tr>
                            </thead>
                            <tbody>
                              {line.payment_schedule.map((item, itemIndex) => (
                                <tr key={itemIndex}>
                                  <td className="py-1 px-2">{item.sequence}</td>
                                  <td className="py-1 px-2">{item.days}</td>                                  <td className="py-1 px-2">
                                    {formatDateSafe(item.payment_date)}
                                  </td>
                                  <td className="py-1 px-2 text-right">
                                    {typeof item.percentage === 'number' 
                                      ? item.percentage.toFixed(2) 
                                      : parseFloat(item.percentage).toFixed(2)
                                    }%
                                  </td>
                                  <td className="py-1 px-2 text-right font-medium">
                                    {formatCurrency(item.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
