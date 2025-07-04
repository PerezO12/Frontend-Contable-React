import React from 'react';
import { CompanySettingsTest } from '@/components/examples/CompanySettingsTest';

export const CompanySettingsTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prueba de Configuración de Empresa</h1>
          <p className="mt-2 text-gray-600">
            Panel de pruebas para validar la funcionalidad de configuración de empresa y cuentas por defecto.
          </p>
        </div>
        
        <CompanySettingsTest />
      </div>
    </div>
  );
};
