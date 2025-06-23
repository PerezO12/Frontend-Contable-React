/**
 * Componente para mostrar información del asiento contable relacionado con una factura
 * Similar al que se usa en journal entries pero adaptado para facturas
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircleIcon } from '@/shared/components/icons';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { apiClient } from '@/shared/api/client';

interface JournalEntryLine {
  id: string;
  line_number: number;
  account_code: string;
  account_name: string;
  description: string;
  debit_amount: string;
  credit_amount: string;
  third_party_name?: string;
  third_party_code?: string;
}

interface JournalEntry {
  id: string;
  number: string;
  entry_date: string;
  description: string;
  status: string;
  entry_type: string;
  total_debit: string;
  total_credit: string;
  lines: JournalEntryLine[];
}

interface InvoiceJournalEntryInfoProps {
  journalEntryId: string;
  invoiceAmount: number;
  invoiceType: string;
  thirdPartyName: string;
}

export const InvoiceJournalEntryInfo: React.FC<InvoiceJournalEntryInfoProps> = ({
  journalEntryId,
  invoiceAmount: _invoiceAmount,
  invoiceType,
  thirdPartyName: _thirdPartyName
}) => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJournalEntry = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get(`/api/v1/journal-entries/${journalEntryId}`);
        setJournalEntry(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar asiento contable');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntry();
  }, [journalEntryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
        <span className="ml-2 text-gray-600">Cargando asiento contable...</span>
      </div>
    );
  }

  if (error || !journalEntry) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          {error || 'No se pudo cargar el asiento contable'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado del asiento */}
      <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-900">Factura Contabilizada</p>
          <p className="text-xs text-green-700">
            Asiento #{journalEntry.number} generado automáticamente
          </p>
        </div>
      </div>

      {/* Información del asiento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Asiento Contable</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Número</label>
            <p className="text-gray-900 font-mono">{journalEntry.number}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha</label>
            <p className="text-gray-900">{formatDate(journalEntry.entry_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="text-gray-900">{journalEntry.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo</label>
            <p className="text-gray-900">{journalEntry.entry_type}</p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-500">Descripción</label>
          <p className="text-gray-900">{journalEntry.description}</p>
        </div>
      </div>

      {/* Resumen contable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Impacto Contable</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Débito:</span>
              <span className="font-mono text-green-700">
                {formatCurrency(parseFloat(journalEntry.total_debit))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Crédito:</span>
              <span className="font-mono text-blue-700">
                {formatCurrency(parseFloat(journalEntry.total_credit))}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t pt-2">
              <span>Balance:</span>
              <span className="font-mono text-gray-900">
                {formatCurrency(parseFloat(journalEntry.total_debit) - parseFloat(journalEntry.total_credit))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Cuentas Afectadas</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Cuenta por {invoiceType === 'customer_invoice' ? 'Cobrar' : 'Pagar'}</p>
            <p>• Cuenta de {invoiceType === 'customer_invoice' ? 'Ventas' : 'Compras'}</p>
            <p>• Cuentas de Impuestos</p>
            <p className="text-xs text-gray-500 mt-2">
              {journalEntry.lines.length} línea(s) contable(s)
            </p>
          </div>
        </div>
      </div>

      {/* Líneas del asiento (resumen) */}
      <Card className="p-0">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">Líneas del Asiento Contable</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cuenta</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Débito</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Crédito</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tercero</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {journalEntry.lines
                .sort((a, b) => a.line_number - b.line_number)
                .map((line) => (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{line.line_number}</td>
                  <td className="px-4 py-2">
                    <div>
                      <p className="text-sm font-mono text-gray-900">{line.account_code}</p>
                      <p className="text-xs text-gray-600">{line.account_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{line.description}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`text-sm font-mono ${
                      parseFloat(line.debit_amount) > 0 ? 'text-green-700 font-semibold' : 'text-gray-400'
                    }`}>
                      {parseFloat(line.debit_amount) > 0 
                        ? formatCurrency(parseFloat(line.debit_amount))
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`text-sm font-mono ${
                      parseFloat(line.credit_amount) > 0 ? 'text-blue-700 font-semibold' : 'text-gray-400'
                    }`}>
                      {parseFloat(line.credit_amount) > 0 
                        ? formatCurrency(parseFloat(line.credit_amount))
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {line.third_party_name && (
                      <div>
                        <p className="text-sm text-gray-900">{line.third_party_code}</p>
                        <p className="text-xs text-gray-600">{line.third_party_name}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Botón para ver asiento completo */}
      <div className="flex justify-center">        <Button
          onClick={() => navigate(`/journal-entries/${journalEntryId}`)}
          className="flex items-center gap-2"
        >
          Ver Asiento Contable Completo
        </Button>
      </div>
    </div>
  );
};
