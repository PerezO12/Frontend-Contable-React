/**
 * Account Determination Component
 * Muestra sugerencias de cuentas contables y permite su edición
 */
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface AccountSuggestion {
  account_id: string;
  account_code: string;
  account_name: string;
  source: string;
  editable: boolean;
}

interface JournalEntryLine {
  account_id: string;
  account_code: string;
  account_name: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  source: string;
  third_party_id?: string;
  product_id?: string;
}

interface AccountDeterminationProps {
  entityType: 'payment' | 'invoice';
  entityId: string;
  journalId?: string;
  onAccountsConfirmed?: (accounts: any) => void;
  onCancel?: () => void;
}

export const AccountDetermination: React.FC<AccountDeterminationProps> = ({
  entityType,
  entityId,
  journalId,
  onAccountsConfirmed,
  onCancel
}) => {
  const [suggestions, setSuggestions] = useState<any>(null);
  const [journalEntryPreview, setJournalEntryPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountModifications] = useState<any>({});

  useEffect(() => {
    loadAccountSuggestions();
  }, [entityType, entityId, journalId]);

  const loadAccountSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = entityType === 'payment' 
        ? `/api/v1/account-determination/payments/${entityId}/account-suggestions`
        : `/api/v1/account-determination/invoices/${entityId}/account-suggestions`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journal_id: journalId,
          preview_only: true
        })
      });

      if (!response.ok) {
        throw new Error('Error cargando sugerencias de cuentas');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setJournalEntryPreview(data.journal_entry_preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    if (source.includes('journal')) return 'bg-blue-100 text-blue-800';
    if (source.includes('company_settings')) return 'bg-green-100 text-green-800';
    if (source.includes('default')) return 'bg-gray-100 text-gray-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getSourceLabel = (source: string) => {
    if (source.includes('journal')) return 'Journal';
    if (source.includes('company_settings')) return 'Empresa';
    if (source.includes('default')) return 'Por defecto';
    return 'Otro';
  };

  const handleConfirmAccounts = () => {
    const finalAccounts = {
      modifications: accountModifications,
      suggestions: suggestions,
      journal_entry_preview: journalEntryPreview
    };
    
    onAccountsConfirmed?.(finalAccounts);
  };

  const renderAccountSuggestion = (account: AccountSuggestion, accountType: string, label: string) => {
    return (
      <div key={`${accountType}-${account.account_id}`} className="p-4 border rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{label}</label>
          <span className={`px-2 py-1 text-xs rounded ${getSourceBadgeColor(account.source)}`}>
            {getSourceLabel(account.source)}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="font-mono text-sm">{account.account_code}</div>
          <div className="text-sm text-gray-600">{account.account_name}</div>
        </div>
      </div>
    );
  };

  const renderJournalEntryPreview = () => {
    if (!journalEntryPreview) return null;

    return (
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Preview del Asiento Contable</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Número:</strong> {journalEntryPreview.payment_number || journalEntryPreview.invoice_number}
              </div>
              <div>
                <strong>Total:</strong> ${journalEntryPreview.total_debit.toFixed(2)}
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cuenta</th>
                    <th className="text-left p-2">Descripción</th>
                    <th className="text-right p-2">Débito</th>
                    <th className="text-right p-2">Crédito</th>
                    <th className="text-left p-2">Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntryPreview.lines.map((line: JournalEntryLine, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <div className="font-mono">{line.account_code}</div>
                        <div className="text-xs text-gray-600">{line.account_name}</div>
                      </td>
                      <td className="p-2">{line.description}</td>
                      <td className="text-right p-2">
                        {line.debit_amount > 0 ? `$${line.debit_amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="text-right p-2">
                        {line.credit_amount > 0 ? `$${line.credit_amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded ${getSourceBadgeColor(line.source)}`}>
                          {getSourceLabel(line.source)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Cargando sugerencias de cuentas...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <Alert variant="error">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span>{error}</span>
            </div>
          </Alert>
        </div>
      </Card>
    );
  }

  if (!suggestions) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>📊</span>
            Sugerencias de Cuentas Contables
          </h2>
          
          <div className="space-y-4">
            {/* Cuentas para pagos */}
            {entityType === 'payment' && suggestions.bank_cash_account && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span>🏦</span>
                  <h3 className="font-medium">Cuenta de Banco/Efectivo</h3>
                </div>
                {renderAccountSuggestion(suggestions.bank_cash_account, 'bank_cash', 'Cuenta de banco/efectivo')}
              </>
            )}

            {suggestions.third_party_account && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span>👥</span>
                  <h3 className="font-medium">Cuenta de Tercero</h3>
                </div>
                {renderAccountSuggestion(suggestions.third_party_account, 'third_party', 'Cliente/Proveedor')}
              </>
            )}

            {/* Cuentas para facturas */}
            {entityType === 'invoice' && suggestions.line_accounts && suggestions.line_accounts.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span>💰</span>
                  <h3 className="font-medium">Cuentas de Líneas</h3>
                </div>
                {suggestions.line_accounts.map((lineAccount: any, index: number) => (
                  <div key={index} className="ml-4">
                    {renderAccountSuggestion(
                      lineAccount.account_suggestion, 
                      `line_${lineAccount.line_id}`, 
                      `Línea ${lineAccount.line_sequence}: ${lineAccount.line_description}`
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Cuentas de impuestos */}
            {suggestions.tax_accounts && suggestions.tax_accounts.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span>🧮</span>
                  <h3 className="font-medium">Cuentas de Impuestos</h3>
                </div>
                {suggestions.tax_accounts.map((taxAccount: any, index: number) => (
                  <div key={index} className="ml-4">
                    {renderAccountSuggestion(
                      taxAccount.account_suggestion, 
                      `tax_${index}`, 
                      `Impuesto: $${taxAccount.tax_amount.toFixed(2)}`
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Impuestos brasileños */}
            {suggestions.brazilian_tax_accounts && suggestions.brazilian_tax_accounts.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span>🇧🇷</span>
                  <h3 className="font-medium">Impuestos Brasileños</h3>
                </div>
                {suggestions.brazilian_tax_accounts.map((brazilianTax: any, index: number) => (
                  <div key={index} className="ml-4">
                    {renderAccountSuggestion(
                      brazilianTax.account_suggestion, 
                      `brazilian_tax_${index}`, 
                      `${brazilianTax.tax_name}: $${brazilianTax.tax_amount.toFixed(2)}`
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Card>

      {renderJournalEntryPreview()}

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleConfirmAccounts}>
          <span className="mr-2">✅</span>
          Confirmar Cuentas
        </Button>
      </div>
    </div>
  );
};

export default AccountDetermination;
