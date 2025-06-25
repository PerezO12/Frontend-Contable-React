import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericImportWizard } from '@/features/generic-import/components/GenericImportWizard';

export const GenericImportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToImports = () => {
    navigate('/import-export');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navegación izquierda */}
            <div className="flex items-center space-x-4">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <button 
                  onClick={handleBackToImports}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Importación de Datos
                </button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">
                  Asistente Genérico
                </span>
              </nav>
            </div>
            
            {/* Información de ayuda */}
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ayuda
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ lineHeight: '1.5' }}>
        <GenericImportWizard />
      </div>
    </div>
  );
};
