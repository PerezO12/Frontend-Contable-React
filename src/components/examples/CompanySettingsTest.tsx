import React, { useState, useEffect } from 'react';
import { CompanySettingsService } from '@/shared/services/companySettingsService';
import type { CompanySettingsResponse, DefaultAccountsInfo } from '@/shared/services/companySettingsService';

interface CompanySettingsTestProps {
  className?: string;
}

export const CompanySettingsTest: React.FC<CompanySettingsTestProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<CompanySettingsResponse | null>(null);
  const [accountsInfo, setAccountsInfo] = useState<DefaultAccountsInfo | null>(null);
  const [validation, setValidation] = useState<{ is_valid: boolean; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load settings
      const settingsData = await CompanySettingsService.getCompanySettings();
      setSettings(settingsData);
      
      // Load accounts info
      const accountsData = await CompanySettingsService.getDefaultAccountsInfo();
      setAccountsInfo(accountsData);
      
      // Validate configuration
      const validationData = await CompanySettingsService.validateConfiguration();
      setValidation(validationData);
      
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error loading company settings');
      console.error('Error loading company settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompanyName = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedSettings = await CompanySettingsService.updateCompanySettings({
        company_name: 'Mi Empresa Actualizada'
      });
      
      setSettings(updatedSettings);
      
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Error updating company name');
      console.error('Error updating company name:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Configuración de Empresa</h2>
        <button
          onClick={loadCompanySettings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Current Settings */}
      {settings && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Configuración Actual</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
              <p className="mt-1 text-sm text-gray-900">{settings.company_name || 'No configurado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <p className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  settings.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleUpdateCompanyName}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar Nombre'}
            </button>
          </div>
        </div>
      )}

      {/* Accounts Information */}
      {accountsInfo && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Información de Cuentas</h3>
          
          {Object.keys(accountsInfo.configured_accounts).length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Cuentas Configuradas</h4>
              <div className="space-y-2">
                {Object.entries(accountsInfo.configured_accounts).map(([key, account]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">{key.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-sm text-gray-600">{account.code} - {account.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {accountsInfo.missing_accounts.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Cuentas Faltantes</h4>
              <div className="space-y-1">
                {accountsInfo.missing_accounts.map((account, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded text-sm">
                    {account.replace('_', ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {accountsInfo.validation_errors.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Errores de Validación</h4>
              <div className="space-y-1">
                {accountsInfo.validation_errors.map((error, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded text-sm text-red-700">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Results */}
      {validation && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Validación de Configuración</h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              validation.is_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {validation.is_valid ? 'Válida' : 'Inválida'}
            </span>
          </div>
          
          {validation.errors.length > 0 && (
            <div className="mt-3">
              <h4 className="text-md font-medium text-gray-900 mb-2">Errores</h4>
              <div className="space-y-1">
                {validation.errors.map((error, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded text-sm text-red-700">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Info */}
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Información de Prueba</h3>
        <p className="text-sm text-blue-800">
          Este componente prueba los endpoints de configuración de empresa implementados. 
          Los datos se cargan automáticamente al montar el componente y se pueden recargar 
          usando el botón correspondiente.
        </p>
        <div className="mt-2 text-xs text-blue-700">
          <strong>Endpoints probados:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>GET /api/v1/company-settings/ - Obtener configuración</li>
            <li>PUT /api/v1/company-settings/ - Actualizar configuración</li>
            <li>GET /api/v1/company-settings/default-accounts - Info de cuentas</li>
            <li>GET /api/v1/company-settings/validate - Validar configuración</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
