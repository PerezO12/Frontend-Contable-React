import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataImportWizard } from '../components';

export function DataImportMainPage() {
  const navigate = useNavigate();
  const [selectedDataType, setSelectedDataType] = React.useState<'accounts' | 'journal_entries' | null>(null);
  const handleImportComplete = (result: any) => {
    console.log('Import completed:', result);
    // Aquí puedes agregar lógica adicional como navegación o notificaciones
  };

  const handleBackToSelection = () => {
    setSelectedDataType(null);
  };
  if (!selectedDataType) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header con navegación */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">            <div className="flex items-center justify-between h-16">
              {/* Navegación izquierda */}
              <div className="flex items-center space-x-4">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Dashboard</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Importación de Datos</span>
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
        </div>

        {/* Contenido principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Importación de Datos
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Importa datos contables de forma masiva y eficiente
            </p>
            
            {/* Acceso rápido al asistente genérico */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-lg font-medium">¿Necesitas importar cualquier tipo de datos?</span>
              </div>
              <button
                onClick={() => navigate('/import-export/generic')}
                className="mt-3 bg-white text-purple-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Usar Asistente Genérico
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Importar Cuentas */}
          <div 
            onClick={() => setSelectedDataType('accounts')}
            className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Cuentas Contables
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Carga tu plan de cuentas completo desde archivos CSV, Excel o JSON
            </p>
            
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Estructura jerárquica</li>
              <li>• Validación de códigos únicos</li>
              <li>• Tipos y categorías</li>
            </ul>
            
            <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
              Comenzar →
            </div>
          </div>

          {/* Importar Asientos */}
          <div 
            onClick={() => setSelectedDataType('journal_entries')}
            className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Asientos Contables
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Importa asientos contables completos con múltiples líneas
            </p>
            
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Múltiples líneas</li>
              <li>• Validación de balance</li>
              <li>• Terceros y centros de costo</li>
            </ul>
            
            <div className="mt-4 inline-flex items-center text-green-600 font-medium">
              Comenzar →
            </div>
          </div>

          {/* Importar NFe (NUEVO) */}
          <div 
            onClick={() => navigate('/import-export/nfe')}
            className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-lg p-3 mr-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                NFe Brasileñas
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Importa Notas Fiscais Eletrônicas (NFe) en formato XML masivamente
            </p>
            
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Hasta 1000 archivos XML</li>
              <li>• Archivos ZIP soportados</li>
              <li>• Facturas y productos automáticos</li>
            </ul>
            
            <div className="mt-4 inline-flex items-center text-orange-600 font-medium">
              Comenzar →
            </div>
          </div>

          {/* Importación Genérica */}
          <div 
            onClick={() => navigate('/import-export/generic')}
            className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Asistente Genérico
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Importación flexible para cualquier tipo de datos del sistema
            </p>
            
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Cualquier modelo de datos</li>
              <li>• Mapeo inteligente de campos</li>
              <li>• Vista previa antes de importar</li>
              <li>• Políticas de importación flexibles</li>
            </ul>
            
            <div className="mt-4 inline-flex items-center text-purple-600 font-medium">
              Abrir asistente →
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Características del Sistema de Importación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Validación Inteligente</h4>
              <p className="text-sm text-gray-600">
                Validación automática de datos con múltiples niveles de rigurosidad
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Procesamiento Rápido</h4>
              <p className="text-sm text-gray-600">
                Importación por lotes con seguimiento en tiempo real del progreso
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Plantillas Incluidas</h4>
              <p className="text-sm text-gray-600">
                Plantillas de ejemplo en múltiples formatos para facilitar la preparación
              </p>            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="flex items-center justify-between h-16">
            {/* Navegación izquierda */}
            <div className="flex items-center space-x-4">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <button 
                  onClick={handleBackToSelection}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Importación de Datos
                </button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {selectedDataType === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables'}
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
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wizard */}
        <DataImportWizard
          dataType={selectedDataType}
          onComplete={handleImportComplete}
        />
      </div>
    </div>
  );
}
