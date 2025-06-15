import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { PaymentTermsSelector } from '../../payment-terms/components/PaymentTermsSelector';
import { PaymentScheduleDisplay } from '../../payment-terms/components/PaymentScheduleDisplay';
import { useJournalEntryPaymentTerms } from '../hooks/useJournalEntryPaymentTerms';
import { useThirdParties } from '../../third-parties/hooks';
import { formatCurrency } from '../../../shared/utils';
import type { PaymentTerms } from '../../payment-terms/types';
import type { JournalEntryLineFormData, PaymentScheduleItem } from '../types';

interface JournalEntryLinePaymentTermsProps {
  lineIndex: number;
  line: JournalEntryLineFormData;
  onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
  onPaymentScheduleChange?: (lineIndex: number, schedule: PaymentScheduleItem[]) => void;
  className?: string;
}

export const JournalEntryLinePaymentTerms: React.FC<JournalEntryLinePaymentTermsProps> = ({
  lineIndex,
  line,
  onLineChange,
  onPaymentScheduleChange,
  className = ""
}) => {
  const {
    calculatePaymentSchedule,
    calculating,
    error: _error,
    clearError
  } = useJournalEntryPaymentTerms();

  const { thirdParties } = useThirdParties({ is_active: true });

  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<PaymentTerms | null>(null);
  const [calculatedSchedule, setCalculatedSchedule] = useState<PaymentScheduleItem[]>([]);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showSchedule, setShowSchedule] = useState(false);

  // Calculate line amount (debit or credit)
  const lineAmount = Math.max(
    parseFloat(line.debit_amount || '0'),
    parseFloat(line.credit_amount || '0')
  );

  // Effect to recalculate schedule when payment terms, amount, or invoice date changes
  useEffect(() => {
    const calculateSchedule = async () => {
      if (selectedPaymentTerms && line.invoice_date && lineAmount > 0) {
        try {
          clearError();
          setValidationMessage('');
          const result = await calculatePaymentSchedule({
            payment_terms_id: selectedPaymentTerms.id,
            invoice_date: line.invoice_date,
            amount: lineAmount
          });

          // Transform PaymentCalculationItem[] to PaymentScheduleItem[]
          const scheduleItems: PaymentScheduleItem[] = result.schedule.map(item => ({
            sequence: item.sequence,
            days: item.days,
            percentage: item.percentage,
            amount: item.amount,
            payment_date: item.payment_date,
            description: item.description || ''
          }));

          setCalculatedSchedule(scheduleItems);
          onPaymentScheduleChange?.(lineIndex, scheduleItems);
        } catch (error) {
          console.error('Error calculating payment schedule:', error);
          setValidationMessage('Error al calcular el cronograma de pagos');
          setCalculatedSchedule([]);
        }
      } else {
        setCalculatedSchedule([]);
        onPaymentScheduleChange?.(lineIndex, []);
      }
    };

    calculateSchedule();
  }, [selectedPaymentTerms, line.invoice_date, lineAmount, calculatePaymentSchedule, lineIndex, onPaymentScheduleChange, clearError]);

  // Simple validation for payment terms fields
  useEffect(() => {
    if (line.payment_terms_id && !line.invoice_date) {
      setValidationMessage('Se requiere fecha de factura para las condiciones de pago');
    } else if (line.invoice_date && line.due_date) {
      const invoiceDate = new Date(line.invoice_date);
      const dueDate = new Date(line.due_date);
      if (dueDate < invoiceDate) {
        setValidationMessage('La fecha de vencimiento no puede ser anterior a la fecha de factura');
      } else {
        setValidationMessage('');
      }
    } else {
      setValidationMessage('');
    }
  }, [line.payment_terms_id, line.invoice_date, line.due_date]);

  const handlePaymentTermsChange = (paymentTermsId: string | undefined) => {
    onLineChange(lineIndex, 'payment_terms_id', paymentTermsId || '');
    
    // Clear due date when payment terms change
    if (line.due_date) {
      onLineChange(lineIndex, 'due_date', '');
    }
  };

  const handlePaymentTermsSelect = (paymentTerms: PaymentTerms | null) => {
    setSelectedPaymentTerms(paymentTerms);
  };

  const handleInvoiceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInvoiceDate = e.target.value;
    onLineChange(lineIndex, 'invoice_date', newInvoiceDate);
    
    // Clear due date when invoice date changes
    if (line.due_date) {
      onLineChange(lineIndex, 'due_date', '');
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLineChange(lineIndex, 'due_date', e.target.value);
  };

  const toggleScheduleDisplay = () => {
    setShowSchedule(!showSchedule);
  };

  // Don't show payment terms for lines with zero amount
  if (lineAmount === 0) {
    return null;
  }
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Third Party and Payment Terms Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="form-label text-xs">
            Tercero
          </label>
          <select
            value={line.third_party_id || ''}
            onChange={(e) => onLineChange(lineIndex, 'third_party_id', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar tercero...</option>
            {thirdParties.map(thirdParty => (
              <option key={thirdParty.id} value={thirdParty.id}>
                {thirdParty.code ? `${thirdParty.code} - ${thirdParty.name}` : `${thirdParty.document_number} - ${thirdParty.name}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label text-xs">
            Condiciones de Pago
          </label>
          <PaymentTermsSelector
            value={line.payment_terms_id}
            onChange={handlePaymentTermsChange}
            onPaymentTermsSelect={handlePaymentTermsSelect}
            placeholder="Seleccionar..."
            className="text-xs"
          />
        </div>

        <div>
          <label className="form-label text-xs">
            Fecha Factura
            {line.payment_terms_id && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="date"
            value={line.invoice_date || ''}
            onChange={handleInvoiceDateChange}
            className="text-xs"
          />
        </div>

        <div>
          <label className="form-label text-xs">
            Fecha Vencimiento
          </label>
          <Input
            type="date"
            value={line.due_date || ''}
            onChange={handleDueDateChange}
            className="text-xs"
          />
        </div>
      </div>

      {/* Payment Schedule Summary */}
      {selectedPaymentTerms && calculatedSchedule.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs text-blue-800">
              <span className="font-medium">{selectedPaymentTerms.name}</span>
              <span className="ml-2 text-blue-600">
                {calculatedSchedule.length} cuota{calculatedSchedule.length !== 1 ? 's' : ''} • 
                Monto: {formatCurrency(lineAmount)}
              </span>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={toggleScheduleDisplay}
              className="text-xs"
            >
              {showSchedule ? 'Ocultar' : 'Ver'} Cronograma
            </Button>
          </div>
            {calculating && (
            <div className="flex items-center justify-center mt-2">
              <Spinner size="sm" />
              <span className="ml-2 text-xs text-blue-600">Calculando cronograma...</span>
            </div>
          )}
        </div>
      )}

      {/* Validation Messages */}
      {validationMessage && (
        <ValidationMessage type="error" message={validationMessage} />
      )}

      {/* Payment Schedule Display */}
      {showSchedule && calculatedSchedule.length > 0 && (
        <PaymentScheduleDisplay
          schedule={calculatedSchedule}
          invoiceAmount={lineAmount}
          invoiceDate={line.invoice_date || ''}
          className="mt-3"
        />
      )}
    </div>
  );
};
