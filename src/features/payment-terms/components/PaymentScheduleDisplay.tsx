import React from 'react';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils';
import type { PaymentCalculationItem } from '../types';

interface PaymentScheduleDisplayProps {
  schedule: PaymentCalculationItem[];
  invoiceAmount: number;
  invoiceDate: string;
  className?: string;
}

export const PaymentScheduleDisplay: React.FC<PaymentScheduleDisplayProps> = ({
  schedule,
  invoiceAmount,
  invoiceDate: _invoiceDate, // Renamed to avoid unused variable warning
  className = ""
}) => {
  if (!schedule || schedule.length === 0) {
    return null;
  }
  const totalPercentage = schedule.reduce((sum, item) => sum + Number(item.percentage), 0);
  const totalAmount = schedule.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Card className={`${className}`}>
      <div className="card-header">
        <h4 className="card-title text-sm">Cronograma de Pagos</h4>
      </div>
      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-1 px-2 font-medium text-gray-700">#</th>
                <th className="text-left py-1 px-2 font-medium text-gray-700">Días</th>
                <th className="text-left py-1 px-2 font-medium text-gray-700">Fecha Pago</th>
                <th className="text-right py-1 px-2 font-medium text-gray-700">%</th>
                <th className="text-right py-1 px-2 font-medium text-gray-700">Monto</th>
                <th className="text-left py-1 px-2 font-medium text-gray-700">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-1 px-2 text-gray-600">{item.sequence}</td>
                  <td className="py-1 px-2 text-gray-600">{item.days}</td>
                  <td className="py-1 px-2 text-gray-600">
                    {new Date(item.payment_date).toLocaleDateString('es-ES')}
                  </td>                  <td className="py-1 px-2 text-right text-gray-600">
                    {Number(item.percentage).toFixed(2)}%
                  </td>                  <td className="py-1 px-2 text-right font-medium text-gray-900">
                    {formatCurrency(Number(item.amount))}
                  </td>
                  <td className="py-1 px-2 text-gray-600 text-xs">
                    {item.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto factura:</span>
                <span className="font-medium">{formatCurrency(invoiceAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total cronograma:</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">% Total:</span>
                <span className={`font-medium ${
                  Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diferencia:</span>
                <span className={`font-medium ${
                  Math.abs(totalAmount - invoiceAmount) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(totalAmount - invoiceAmount))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
