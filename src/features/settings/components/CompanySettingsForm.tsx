/**
 * Company Settings Form Component
 * Professional configuration interface for company-wide default accounts
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../shared/contexts/ToastContext';
import { CompanySettingsService } from '../services/companySettingsService';
import { AccountSelector } from './AccountSelector';
import type { CompanySettings, CompanySettingsUpdate } from '../types';

// Simple SVG Icons
const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckCircle = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

interface CompanySettingsFormProps {
  onSettingsUpdated?: (settings: CompanySettings) => void;
}

export const CompanySettingsForm: React.FC<CompanySettingsFormProps> = ({ 
  onSettingsUpdated 
}) => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [formData, setFormData] = useState<CompanySettingsUpdate>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationResult, setValidationResult] = useState<any>(null);
  
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await CompanySettingsService.getCompanySettings();
      
      if (data) {
        setSettings(data);
        setFormData({
          company_name: data.company_name,
          tax_id: data.tax_id || '',
          currency_code: data.currency_code,
          default_customer_receivable_account_id: data.default_customer_receivable_account_id,
          default_supplier_payable_account_id: data.default_supplier_payable_account_id,
          bank_suspense_account_id: data.bank_suspense_account_id,
          internal_transfer_account_id: data.internal_transfer_account_id,
          deferred_expense_account_id: data.deferred_expense_account_id,
          deferred_revenue_account_id: data.deferred_revenue_account_id,
          early_payment_discount_gain_account_id: data.early_payment_discount_gain_account_id,
          early_payment_discount_loss_account_id: data.early_payment_discount_loss_account_id,
          invoice_line_discount_same_account: data.invoice_line_discount_same_account,
          validate_invoice_on_posting: data.validate_invoice_on_posting,
          deferred_generation_method: data.deferred_generation_method,
          notes: data.notes || ''
        });
      } else {
        // Initialize with default values if no settings exist
        setFormData({
          company_name: '',
          currency_code: 'USD',
          invoice_line_discount_same_account: true,
          validate_invoice_on_posting: true,
          deferred_generation_method: 'on_invoice_validation'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanySettingsUpdate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'El nombre de la empresa es requerido';
    }

    if (!formData.currency_code?.trim()) {
      newErrors.currency_code = 'El código de moneda es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      let updatedSettings: CompanySettings;
      
      if (settings) {
        // Update existing settings
        updatedSettings = await CompanySettingsService.updateCompanySettings(formData);
        showSuccess('Configuración actualizada exitosamente');
      } else {
        // Create new settings
        updatedSettings = await CompanySettingsService.createCompanySettings(formData as any);
        showSuccess('Configuración creada exitosamente');
      }

      setSettings(updatedSettings);
      onSettingsUpdated?.(updatedSettings);
      
    } catch (error: any) {
      console.error('Error saving settings:', error);
      const errorMessage = error.response?.data?.detail || 'Error al guardar la configuración';
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      const result = await CompanySettingsService.validateSettings();
      setValidationResult(result);
      
      if (result.is_valid) {
        showSuccess('Configuración válida');
      } else {
        showWarning(`Se encontraron ${result.issues.length} problema(s)`);
      }
    } catch (error) {
      console.error('Error validating settings:', error);
      showError('Error al validar la configuración');
    } finally {
      setValidating(false);
    }
  };

  const handleInitialize = async () => {
    try {
      setSaving(true);
      await CompanySettingsService.initializeSettings();
      showSuccess('Configuración inicializada exitosamente');
      await loadSettings();
    } catch (error: any) {
      console.error('Error initializing settings:', error);
      const errorMessage = error.response?.data?.detail || 'Error al inicializar la configuración';
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderIcon />
        <span className="ml-2">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BuildingIcon />
          <h2 className="text-2xl font-bold text-gray-900">
            Configuración de Empresa
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleValidate}
            disabled={validating}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {validating ? (
              <LoaderIcon />
            ) : (
              <SettingsIcon />
            )}
            Validar
          </button>
          
          {!settings && (
            <button
              type="button"
              onClick={handleInitialize}
              disabled={saving}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <LoaderIcon />
              ) : (
                <CheckIcon />
              )}
              Inicializar
            </button>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className={`p-4 rounded-md ${
          validationResult.is_valid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            {validationResult.is_valid ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            )}
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                validationResult.is_valid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {validationResult.is_valid 
                  ? 'Configuración válida' 
                  : 'Configuración incompleta'
                }
              </h3>
              {!validationResult.is_valid && (
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Problemas encontrados:</p>
                  <ul className="list-disc list-inside mt-1">
                    {validationResult.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                  {validationResult.recommendations.length > 0 && (
                    <div className="mt-2">
                      <p>Recomendaciones:</p>
                      <ul className="list-disc list-inside mt-1">
                        {validationResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Company Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información Básica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={formData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.company_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingrese el nombre de la empresa"
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIT / RUC
              </label>
              <input
                type="text"
                value={formData.tax_id || ''}
                onChange={(e) => handleInputChange('tax_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de identificación tributaria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Moneda *
              </label>
              <select
                value={formData.currency_code || ''}
                onChange={(e) => handleInputChange('currency_code', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currency_code ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar moneda</option>
                <option value="USD">USD - Dólar Americano</option>
                <option value="EUR">EUR - Euro</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="PEN">PEN - Sol Peruano</option>
              </select>
              {errors.currency_code && (
                <p className="mt-1 text-sm text-red-600">{errors.currency_code}</p>
              )}
            </div>
          </div>
        </div>

        {/* Default Accounts Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Cuentas por Defecto para Terceros
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Estas cuentas se utilizarán cuando un cliente o proveedor no tenga cuentas específicas asignadas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta por Cobrar (Clientes)
              </label>
              <AccountSelector
                value={formData.default_customer_receivable_account_id || ''}
                onChange={(accountId) => handleInputChange('default_customer_receivable_account_id', accountId)}
                placeholder="Seleccionar cuenta por cobrar"
                accountType="receivable"
                error={errors.default_customer_receivable_account_id}
              />
              {settings?.default_customer_receivable_account && (
                <p className="mt-1 text-xs text-gray-500">
                  Actual: {settings.default_customer_receivable_account.code} - {settings.default_customer_receivable_account.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta por Pagar (Proveedores)
              </label>
              <AccountSelector
                value={formData.default_supplier_payable_account_id || ''}
                onChange={(accountId) => handleInputChange('default_supplier_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta por pagar"
                accountType="payable"
                error={errors.default_supplier_payable_account_id}
              />
              {settings?.default_supplier_payable_account && (
                <p className="mt-1 text-xs text-gray-500">
                  Actual: {settings.default_supplier_payable_account.code} - {settings.default_supplier_payable_account.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Banking Configuration */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Configuración Bancaria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta de Suspensión Bancaria
              </label>
              <AccountSelector
                value={formData.bank_suspense_account_id || ''}
                onChange={(accountId) => handleInputChange('bank_suspense_account_id', accountId)}
                placeholder="Seleccionar cuenta transitoria"
                error={errors.bank_suspense_account_id}
              />
              {settings?.bank_suspense_account && (
                <p className="mt-1 text-xs text-gray-500">
                  Actual: {settings.bank_suspense_account.code} - {settings.bank_suspense_account.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta de Transferencia Interna
              </label>
              <AccountSelector
                value={formData.internal_transfer_account_id || ''}
                onChange={(accountId) => handleInputChange('internal_transfer_account_id', accountId)}
                placeholder="Seleccionar cuenta de transferencia"
                error={errors.internal_transfer_account_id}
              />
              {settings?.internal_transfer_account && (
                <p className="mt-1 text-xs text-gray-500">
                  Actual: {settings.internal_transfer_account.code} - {settings.internal_transfer_account.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Configuration */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Configuración Adicional
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="invoice_line_discount"
                checked={formData.invoice_line_discount_same_account || false}
                onChange={(e) => handleInputChange('invoice_line_discount_same_account', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="invoice_line_discount" className="ml-2 block text-sm text-gray-900">
                Usar la misma cuenta del producto para descuentos por línea de factura
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="validate_invoice_posting"
                checked={formData.validate_invoice_on_posting || false}
                onChange={(e) => handleInputChange('validate_invoice_on_posting', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="validate_invoice_posting" className="ml-2 block text-sm text-gray-900">
                Validar facturas automáticamente al contabilizar
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notas adicionales sobre la configuración..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <LoaderIcon />
                Guardando...
              </>
            ) : (
              <>
                <CheckIcon />
                {settings ? 'Actualizar Configuración' : 'Crear Configuración'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
