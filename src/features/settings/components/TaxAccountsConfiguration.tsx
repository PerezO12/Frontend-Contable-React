import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { AccountSelector } from './AccountSelector';
import { CompanySettingsService } from '../services/companySettingsService';
import type { TaxAccountsResponse, TaxAccountsUpdate, TaxAccountSuggestion } from '../types';

interface TaxAccountsConfigurationProps {
  onConfigurationChange?: (isConfigured: boolean) => void;
}

export const TaxAccountsConfiguration: React.FC<TaxAccountsConfigurationProps> = ({ 
  onConfigurationChange 
}) => {
  const [taxAccounts, setTaxAccounts] = useState<TaxAccountsResponse | null>(null);
  const [suggestions, setSuggestions] = useState<TaxAccountSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoConfiguring, setIsAutoConfiguring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load tax accounts configuration
  useEffect(() => {
    loadTaxAccountsConfiguration();
  }, []);

  const loadTaxAccountsConfiguration = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const config = await CompanySettingsService.getTaxAccountsConfiguration();
      setTaxAccounts(config);
      onConfigurationChange?.(config.is_configured);
    } catch (err: any) {
      console.error('Error loading tax accounts configuration:', err);
      setError('Error al cargar la configuración de cuentas de impuestos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async (accountType?: string) => {
    try {
      const suggestedAccounts = await CompanySettingsService.getTaxAccountSuggestions(accountType);
      setSuggestions(suggestedAccounts);
    } catch (err: any) {
      console.error('Error loading suggestions:', err);
    }
  };

  const handleAccountChange = async (fieldName: keyof TaxAccountsUpdate, accountId: string | null) => {
    if (!taxAccounts) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: TaxAccountsUpdate = {
        default_sales_tax_payable_account_id: taxAccounts.default_sales_tax_payable_account_id,
        default_purchase_tax_deductible_account_id: taxAccounts.default_purchase_tax_deductible_account_id,
        default_tax_account_id: taxAccounts.default_tax_account_id,
        // Brazilian tax accounts
        default_icms_payable_account_id: taxAccounts.default_icms_payable_account_id,
        default_icms_deductible_account_id: taxAccounts.default_icms_deductible_account_id,
        default_pis_payable_account_id: taxAccounts.default_pis_payable_account_id,
        default_pis_deductible_account_id: taxAccounts.default_pis_deductible_account_id,
        default_cofins_payable_account_id: taxAccounts.default_cofins_payable_account_id,
        default_cofins_deductible_account_id: taxAccounts.default_cofins_deductible_account_id,
        default_ipi_payable_account_id: taxAccounts.default_ipi_payable_account_id,
        default_ipi_deductible_account_id: taxAccounts.default_ipi_deductible_account_id,
        default_iss_payable_account_id: taxAccounts.default_iss_payable_account_id,
        default_csll_payable_account_id: taxAccounts.default_csll_payable_account_id,
        default_irpj_payable_account_id: taxAccounts.default_irpj_payable_account_id,
        [fieldName]: accountId
      };

      const updatedConfig = await CompanySettingsService.updateTaxAccountsConfiguration(updateData);
      setTaxAccounts(updatedConfig);
      onConfigurationChange?.(updatedConfig.is_configured);
      setSuccess('Cuenta de impuestos actualizada correctamente');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating tax account:', err);
      setError(err.response?.data?.detail || 'Error al actualizar la cuenta de impuestos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoConfiguration = async () => {
    try {
      setIsAutoConfiguring(true);
      setError(null);
      setSuccess(null);

      const result = await CompanySettingsService.autoConfigureTaxAccounts();
      
      if (result.success) {
        setSuccess(result.message);
        await loadTaxAccountsConfiguration(); // Reload to show updated configuration
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError('No se pudo configurar automáticamente las cuentas de impuestos');
      }
    } catch (err: any) {
      console.error('Error auto-configuring tax accounts:', err);
      setError(err.response?.data?.detail || 'Error al configurar automáticamente las cuentas de impuestos');
    } finally {
      setIsAutoConfiguring(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Configuración de Cuentas de Impuestos</h2>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-gray-600">Cargando configuración...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Configuración de Cuentas de Impuestos
              {taxAccounts?.is_configured && (
                <Badge variant="solid" className="ml-2 bg-green-100 text-green-800">
                  ✓ Configurado
                </Badge>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              Configurar las cuentas contables para el manejo de impuestos en facturas y pagos
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="error" className="mb-4">
            <p>{error}</p>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            <p>{success}</p>
          </Alert>
        )}

        {/* Auto-configuration */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Configuración Automática</h3>
              <p className="text-sm text-blue-700">
                Configurar automáticamente las cuentas de impuestos basándose en el plan contable
              </p>
            </div>
            <Button 
              onClick={handleAutoConfiguration}
              disabled={isAutoConfiguring}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              {isAutoConfiguring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Configurando...
                </>
              ) : (
                <>
                  ⚡ Auto-configurar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Account Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Tax Payable Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cuenta de Impuestos por Pagar (Ventas)
            </label>
            <p className="text-xs text-gray-500">
              Cuenta para registrar los impuestos que se deben pagar sobre las ventas
            </p>
            <AccountSelector
              value={taxAccounts?.default_sales_tax_payable_account_id || ''}
              onChange={(accountId) => handleAccountChange('default_sales_tax_payable_account_id', accountId)}
              placeholder="Seleccionar cuenta para impuestos por pagar"
              accountType="LIABILITY"
              disabled={isSaving}
            />
            {taxAccounts?.default_sales_tax_payable_account_name && (
              <p className="text-xs text-gray-600">
                Cuenta actual: {taxAccounts.default_sales_tax_payable_account_name}
              </p>
            )}
          </div>

          {/* Purchase Tax Deductible Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cuenta de Impuestos Deducibles (Compras)
            </label>
            <p className="text-xs text-gray-500">
              Cuenta para registrar los impuestos deducibles sobre las compras
            </p>
            <AccountSelector
              value={taxAccounts?.default_purchase_tax_deductible_account_id || ''}
              onChange={(accountId) => handleAccountChange('default_purchase_tax_deductible_account_id', accountId)}
              placeholder="Seleccionar cuenta para impuestos deducibles"
              accountType="ASSET"
              disabled={isSaving}
            />
            {taxAccounts?.default_purchase_tax_deductible_account_name && (
              <p className="text-xs text-gray-600">
                Cuenta actual: {taxAccounts.default_purchase_tax_deductible_account_name}
              </p>
            )}
          </div>

          {/* Generic Tax Account */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Cuenta Genérica de Impuestos
            </label>
            <p className="text-xs text-gray-500">
              Cuenta genérica para impuestos cuando no se especifica una cuenta específica
            </p>
            <AccountSelector
              value={taxAccounts?.default_tax_account_id || ''}
              onChange={(accountId) => handleAccountChange('default_tax_account_id', accountId)}
              placeholder="Seleccionar cuenta genérica para impuestos"
              disabled={isSaving}
            />
            {taxAccounts?.default_tax_account_name && (
              <p className="text-xs text-gray-600">
                Cuenta actual: {taxAccounts.default_tax_account_name}
              </p>
            )}
          </div>
        </div>

        {/* Brazilian Tax Accounts */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Impuestos Brasileños Específicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ICMS Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ICMS por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Impuesto sobre Circulación de Mercaderías y Servicios a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_icms_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_icms_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para ICMS por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_icms_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_icms_payable_account_name}
                </p>
              )}
            </div>

            {/* ICMS Deductible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ICMS Deducible
              </label>
              <p className="text-xs text-gray-500">
                Impuesto sobre Circulación de Mercaderías y Servicios deducible
              </p>
              <AccountSelector
                value={taxAccounts?.default_icms_deductible_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_icms_deductible_account_id', accountId)}
                placeholder="Seleccionar cuenta para ICMS deducible"
                accountType="ASSET"
                disabled={isSaving}
              />
              {taxAccounts?.default_icms_deductible_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_icms_deductible_account_name}
                </p>
              )}
            </div>

            {/* PIS Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                PIS por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Programa de Integración Social a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_pis_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_pis_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para PIS por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_pis_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_pis_payable_account_name}
                </p>
              )}
            </div>

            {/* PIS Deductible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                PIS Deducible
              </label>
              <p className="text-xs text-gray-500">
                Programa de Integración Social deducible
              </p>
              <AccountSelector
                value={taxAccounts?.default_pis_deductible_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_pis_deductible_account_id', accountId)}
                placeholder="Seleccionar cuenta para PIS deducible"
                accountType="ASSET"
                disabled={isSaving}
              />
              {taxAccounts?.default_pis_deductible_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_pis_deductible_account_name}
                </p>
              )}
            </div>

            {/* COFINS Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                COFINS por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Contribución para el Financiamiento de la Seguridad Social a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_cofins_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_cofins_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para COFINS por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_cofins_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_cofins_payable_account_name}
                </p>
              )}
            </div>

            {/* COFINS Deductible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                COFINS Deducible
              </label>
              <p className="text-xs text-gray-500">
                Contribución para el Financiamiento de la Seguridad Social deducible
              </p>
              <AccountSelector
                value={taxAccounts?.default_cofins_deductible_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_cofins_deductible_account_id', accountId)}
                placeholder="Seleccionar cuenta para COFINS deducible"
                accountType="ASSET"
                disabled={isSaving}
              />
              {taxAccounts?.default_cofins_deductible_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_cofins_deductible_account_name}
                </p>
              )}
            </div>

            {/* IPI Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                IPI por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Impuesto sobre Productos Industrializados a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_ipi_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_ipi_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para IPI por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_ipi_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_ipi_payable_account_name}
                </p>
              )}
            </div>

            {/* IPI Deductible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                IPI Deducible
              </label>
              <p className="text-xs text-gray-500">
                Impuesto sobre Productos Industrializados deducible
              </p>
              <AccountSelector
                value={taxAccounts?.default_ipi_deductible_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_ipi_deductible_account_id', accountId)}
                placeholder="Seleccionar cuenta para IPI deducible"
                accountType="ASSET"
                disabled={isSaving}
              />
              {taxAccounts?.default_ipi_deductible_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_ipi_deductible_account_name}
                </p>
              )}
            </div>

            {/* ISS Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ISS por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Impuesto sobre Servicios a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_iss_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_iss_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para ISS por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_iss_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_iss_payable_account_name}
                </p>
              )}
            </div>

            {/* CSLL Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                CSLL por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Contribución Social sobre el Lucro Líquido a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_csll_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_csll_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para CSLL por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_csll_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_csll_payable_account_name}
                </p>
              )}
            </div>

            {/* IRPJ Payable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                IRPJ por Pagar
              </label>
              <p className="text-xs text-gray-500">
                Impuesto de Renta Persona Jurídica a pagar
              </p>
              <AccountSelector
                value={taxAccounts?.default_irpj_payable_account_id || ''}
                onChange={(accountId) => handleAccountChange('default_irpj_payable_account_id', accountId)}
                placeholder="Seleccionar cuenta para IRPJ por pagar"
                accountType="LIABILITY"
                disabled={isSaving}
              />
              {taxAccounts?.default_irpj_payable_account_name && (
                <p className="text-xs text-gray-600">
                  Cuenta actual: {taxAccounts.default_irpj_payable_account_name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Status */}
        {taxAccounts && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Estado de Configuración</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {taxAccounts.default_sales_tax_payable_account_id ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-amber-600">⚠</span>
                )}
                <span className={taxAccounts.default_sales_tax_payable_account_id ? 'text-green-700' : 'text-amber-700'}>
                  Impuestos por Pagar
                </span>
              </div>
              <div className="flex items-center gap-2">
                {taxAccounts.default_purchase_tax_deductible_account_id ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-amber-600">⚠</span>
                )}
                <span className={taxAccounts.default_purchase_tax_deductible_account_id ? 'text-green-700' : 'text-amber-700'}>
                  Impuestos Deducibles
                </span>
              </div>
              <div className="flex items-center gap-2">
                {taxAccounts.default_tax_account_id ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-amber-600">⚠</span>
                )}
                <span className={taxAccounts.default_tax_account_id ? 'text-green-700' : 'text-amber-700'}>
                  Cuenta Genérica
                </span>
              </div>
            </div>
            
            {/* Brazilian Tax Accounts Status */}
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Impuestos Brasileños</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {taxAccounts.default_icms_payable_account_id || taxAccounts.default_icms_deductible_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={(taxAccounts.default_icms_payable_account_id || taxAccounts.default_icms_deductible_account_id) ? 'text-green-700' : 'text-gray-500'}>
                    ICMS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_pis_payable_account_id || taxAccounts.default_pis_deductible_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={(taxAccounts.default_pis_payable_account_id || taxAccounts.default_pis_deductible_account_id) ? 'text-green-700' : 'text-gray-500'}>
                    PIS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_cofins_payable_account_id || taxAccounts.default_cofins_deductible_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={(taxAccounts.default_cofins_payable_account_id || taxAccounts.default_cofins_deductible_account_id) ? 'text-green-700' : 'text-gray-500'}>
                    COFINS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_ipi_payable_account_id || taxAccounts.default_ipi_deductible_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={(taxAccounts.default_ipi_payable_account_id || taxAccounts.default_ipi_deductible_account_id) ? 'text-green-700' : 'text-gray-500'}>
                    IPI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_iss_payable_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={taxAccounts.default_iss_payable_account_id ? 'text-green-700' : 'text-gray-500'}>
                    ISS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_csll_payable_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={taxAccounts.default_csll_payable_account_id ? 'text-green-700' : 'text-gray-500'}>
                    CSLL
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {taxAccounts.default_irpj_payable_account_id ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                  <span className={taxAccounts.default_irpj_payable_account_id ? 'text-green-700' : 'text-gray-500'}>
                    IRPJ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Sugerencias de Cuentas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{suggestion.code} - {suggestion.name}</p>
                      <p className="text-xs text-gray-500">{suggestion.description}</p>
                      <Badge variant="subtle" className="mt-1 text-xs">
                        {suggestion.account_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
