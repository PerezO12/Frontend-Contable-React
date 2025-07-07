import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';
import { SaveIcon, CheckCircleIcon, Loader2Icon, RefreshCwIcon, AlertCircleIcon } from '@/shared/components/icons';
import { CompanySettingsService } from '@/shared/services/companySettingsService';
import { AccountService } from '@/features/accounts/services/accountService';
import type { CompanySettingsResponse, CompanySettingsUpdate } from '@/shared/services/companySettingsService';
import type { Account } from '@/features/accounts/types';

// Componente de selector de cuenta
interface AccountSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (accountId: string | undefined) => void;
  accountType?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  label,
  value,
  onChange,
  accountType,
  placeholder = "Seleccione una cuenta...",
  required = false,
  description
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    loadAccounts();
  }, [accountType]);

  useEffect(() => {
    if (value && accounts.length > 0) {
      const account = accounts.find(acc => acc.id === value);
      setSelectedAccount(account || null);
    }
  }, [value, accounts]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getAccounts({
        account_type: accountType as any,
        is_active: true,
        limit: 100
      });
      
      // Handle both array and paginated response
      const accountsList = Array.isArray(response) ? response : response.items || [];
      setAccounts(accountsList);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = e.target.value || undefined;
    onChange(accountId);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <select
        value={value || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      >
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.code} - {account.name}
          </option>
        ))}
      </select>
      
      {selectedAccount && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Seleccionado:</strong> {selectedAccount.code} - {selectedAccount.name}
          <br />
          <strong>Tipo:</strong> {selectedAccount.account_type}
        </div>
      )}
    </div>
  );
};

// Componente principal
export const CompanyAccountSettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettingsResponse | null>(null);
  const [formData, setFormData] = useState<CompanySettingsUpdate>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await CompanySettingsService.getCompanySettings();
      setSettings(data);
      
      // Initialize form data
      setFormData({
        company_name: data.company_name,
        default_receivable_account_id: data.default_receivable_account_id,
        default_payable_account_id: data.default_payable_account_id,
        default_sales_income_account_id: data.default_sales_income_account_id,
        default_purchase_expense_account_id: data.default_purchase_expense_account_id,
        default_bank_suspense_account_id: data.default_bank_suspense_account_id,
        default_internal_transfer_account_id: data.default_internal_transfer_account_id,
        default_deferred_expense_account_id: data.default_deferred_expense_account_id,
        default_deferred_revenue_account_id: data.default_deferred_revenue_account_id
      });
      
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const updatedSettings = await CompanySettingsService.updateCompanySettings(formData);
      setSettings(updatedSettings);
      setSuccess('Configuración guardada exitosamente');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof CompanySettingsUpdate, value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2Icon className="h-8 w-8" />
          <span className="ml-2">Cargando configuración...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Cuentas por Defecto</h1>
          <p className="text-gray-600">
            Configure las cuentas contables que se usarán por defecto en las operaciones del sistema.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={loading}
          >
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2Icon className="h-4 w-4 mr-2" />
            ) : (
              <SaveIcon className="h-4 w-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error">
          <AlertCircleIcon className="h-4 w-4" />
          <div>{error}</div>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <CheckCircleIcon className="h-4 w-4" />
          <div>{success}</div>
        </Alert>
      )}

      {/* Company Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Información de la Empresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_name">Nombre de la Empresa</Label>
            <Input
              id="company_name"
              value={formData.company_name || ''}
              onChange={(e) => handleFieldChange('company_name', e.target.value)}
              placeholder="Ingrese el nombre de la empresa"
            />
          </div>
        </div>
      </Card>

      {/* Core Account Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Cuentas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <AccountSelector
            label="Cuenta de Ingresos por Ventas"
            value={formData.default_sales_income_account_id}
            onChange={(value) => handleFieldChange('default_sales_income_account_id', value)}
            accountType="income"
            description="Cuenta que se usará por defecto para registrar ingresos por ventas"
            required
          />

          <AccountSelector
            label="Cuenta de Gastos por Compras"
            value={formData.default_purchase_expense_account_id}
            onChange={(value) => handleFieldChange('default_purchase_expense_account_id', value)}
            accountType="expense"
            description="Cuenta que se usará por defecto para registrar gastos por compras"
            required
          />

          <AccountSelector
            label="Cuenta por Cobrar (Clientes)"
            value={formData.default_receivable_account_id}
            onChange={(value) => handleFieldChange('default_receivable_account_id', value)}
            accountType="asset"
            description="Cuenta por defecto para clientes por cobrar"
          />

          <AccountSelector
            label="Cuenta por Pagar (Proveedores)"
            value={formData.default_payable_account_id}
            onChange={(value) => handleFieldChange('default_payable_account_id', value)}
            accountType="liability"
            description="Cuenta por defecto para proveedores por pagar"
          />

        </div>
      </Card>

      {/* Banking and Transfer Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Cuentas Bancarias y Transferencias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <AccountSelector
            label="Cuenta de Suspensión Bancaria"
            value={formData.default_bank_suspense_account_id}
            onChange={(value) => handleFieldChange('default_bank_suspense_account_id', value)}
            accountType="asset"
            description="Cuenta transitoria para conciliaciones bancarias"
          />

          <AccountSelector
            label="Cuenta de Transferencias Internas"
            value={formData.default_internal_transfer_account_id}
            onChange={(value) => handleFieldChange('default_internal_transfer_account_id', value)}
            accountType="asset"
            description="Cuenta para transferencias entre cuentas del sistema"
          />

        </div>
      </Card>

      {/* Deferred Accounts Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Cuentas de Diferidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <AccountSelector
            label="Cuenta de Gastos Diferidos"
            value={formData.default_deferred_expense_account_id}
            onChange={(value) => handleFieldChange('default_deferred_expense_account_id', value)}
            accountType="asset"
            description="Cuenta para gastos pagados por anticipado"
          />

          <AccountSelector
            label="Cuenta de Ingresos Diferidos"
            value={formData.default_deferred_revenue_account_id}
            onChange={(value) => handleFieldChange('default_deferred_revenue_account_id', value)}
            accountType="liability"
            description="Cuenta para ingresos recibidos por anticipado"
          />

        </div>
      </Card>

      {/* Configuration Status */}
      {settings && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Estado de la Configuración</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="flex items-center space-x-2">
              {formData.default_sales_income_account_id ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">Ingresos por Ventas</span>
            </div>

            <div className="flex items-center space-x-2">
              {formData.default_purchase_expense_account_id ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">Gastos por Compras</span>
            </div>

            <div className="flex items-center space-x-2">
              {formData.default_receivable_account_id ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">Clientes por Cobrar</span>
            </div>

            <div className="flex items-center space-x-2">
              {formData.default_payable_account_id ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">Proveedores por Pagar</span>
            </div>

          </div>
        </Card>
      )}

    </div>
  );
};
