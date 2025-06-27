import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';

interface NFeBulkImportConfig {
  batch_size: number;
  skip_duplicates: boolean;
  auto_create_third_parties: boolean;
  auto_create_products: boolean;
  create_invoices: boolean;
  create_journal_entries: boolean;
  default_revenue_account: string;
  default_customer_account: string;
  default_supplier_account: string;
  default_sales_journal: string;
  default_purchase_journal: string;
  currency_code: string;
  time_zone: string;
}

interface ImportResult {
  summary: {
    total_files: number;
    processed_successfully: number;
    processed_with_errors: number;
    skipped: number;
    success_rate: number;
    processing_time_seconds: number;
  };
  created_entities: {
    invoices: number;
    third_parties: number;
    products: number;
  };
  errors: Array<{
    file_name: string;
    error_message: string;
  }>;
  warnings: Array<{
    file_name: string;
    warning_message: string;
  }>;
}

export function NFeImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const [config, setConfig] = useState<NFeBulkImportConfig>({
    batch_size: 20,
    skip_duplicates: true,
    auto_create_third_parties: true,
    auto_create_products: true,
    create_invoices: true,
    create_journal_entries: false,
    default_revenue_account: "410001",
    default_customer_account: "130001",
    default_supplier_account: "210001",
    default_sales_journal: "VEN",
    default_purchase_journal: "COM",
    currency_code: "BRL",
    time_zone: "America/Sao_Paulo"
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Validar tipos de archivo
      const validFiles = Array.from(files).filter(file => 
        file.name.toLowerCase().endsWith('.xml') || 
        file.name.toLowerCase().endsWith('.zip')
      );
      
      if (validFiles.length !== files.length) {
        alert('Solo se permiten archivos XML y ZIP');
        return;
      }
      
      if (files.length > 1000) {
        alert('Máximo 1000 archivos permitidos');
        return;
      }
      
      setSelectedFiles(files);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Por favor selecciona archivos para importar');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Agregar archivos
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file);
      });
      
      // Agregar configuración
      formData.append('config', JSON.stringify(config));

      // Obtener token de autenticación
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:8000/api/v1/nfe/bulk-import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }

      const result: ImportResult = await response.json();
      setImportResult(result);
      
    } catch (error) {
      console.error('Error en la importación:', error);
      alert(`Error en la importación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetImport = () => {
    setSelectedFiles(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button 
                onClick={() => navigate('/import-export')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Importación de Datos
              </button>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">Importación de NFe</span>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                ⚙️ Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Importación Masiva de NFe Brasileñas
          </h1>
          <p className="text-lg text-gray-600">
            Importa hasta 1000 Notas Fiscais Eletrônicas (NFe) de una sola vez
          </p>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configuración de Importación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de lote
                  </label>
                  <input
                    type="number"
                    value={config.batch_size}
                    onChange={(e) => setConfig({...config, batch_size: parseInt(e.target.value) || 20})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuenta de ingresos por defecto
                  </label>
                  <input
                    type="text"
                    value={config.default_revenue_account}
                    onChange={(e) => setConfig({...config, default_revenue_account: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diario de ventas por defecto
                  </label>
                  <input
                    type="text"
                    value={config.default_sales_journal}
                    onChange={(e) => setConfig({...config, default_sales_journal: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <input
                    type="text"
                    value={config.currency_code}
                    onChange={(e) => setConfig({...config, currency_code: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.skip_duplicates}
                    onChange={(e) => setConfig({...config, skip_duplicates: e.target.checked})}
                    className="mr-2"
                  />
                  Omitir duplicados
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.auto_create_third_parties}
                    onChange={(e) => setConfig({...config, auto_create_third_parties: e.target.checked})}
                    className="mr-2"
                  />
                  Crear terceros automáticamente
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.auto_create_products}
                    onChange={(e) => setConfig({...config, auto_create_products: e.target.checked})}
                    className="mr-2"
                  />
                  Crear productos automáticamente
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.create_invoices}
                    onChange={(e) => setConfig({...config, create_invoices: e.target.checked})}
                    className="mr-2"
                  />
                  Crear facturas automáticamente
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Upload Section */}
        {!importResult && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Seleccionar Archivos</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </h3>
                
                <p className="text-sm text-gray-500 mb-4">
                  Archivos XML individuales o ZIP con múltiples XMLs de NFe
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xml,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Seleccionar Archivos
                </Button>
                
                <p className="text-xs text-gray-400 mt-2">
                  Máximo 1000 archivos | Formatos: XML, ZIP
                </p>
              </div>
              
              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedFiles.length} archivo(s) seleccionado(s)
                  </p>
                  
                  <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                    {Array.from(selectedFiles).slice(0, 10).map((file, index) => (
                      <div key={index} className="text-sm text-gray-700 py-1">
                        📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                    {selectedFiles.length > 10 && (
                      <div className="text-sm text-gray-500 py-1">
                        ... y {selectedFiles.length - 10} archivos más
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={resetImport}
                      disabled={isUploading}
                    >
                      Limpiar
                    </Button>
                    
                    <Button
                      onClick={handleImport}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Procesando...' : 'Iniciar Importación'}
                    </Button>
                  </div>
                </div>
              )}
              
              {isUploading && (
                <div className="mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-sm text-blue-700">
                        Procesando archivos NFe... Esto puede tomar varios minutos.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Results Section */}
        {importResult && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Resultado de la Importación</h3>
                <Button
                  variant="outline"
                  onClick={resetImport}
                >
                  Nueva Importación
                </Button>
              </div>
              
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.summary.total_files}
                  </div>
                  <div className="text-sm text-blue-700">Total Archivos</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.summary.processed_successfully}
                  </div>
                  <div className="text-sm text-green-700">Procesados</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.summary.processed_with_errors}
                  </div>
                  <div className="text-sm text-red-700">Con Errores</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {importResult.summary.success_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-700">Éxito</div>
                </div>
              </div>
              
              {/* Created Entities */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Entidades Creadas</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.invoices}
                    </div>
                    <div className="text-sm text-gray-600">Facturas</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.third_parties}
                    </div>
                    <div className="text-sm text-gray-600">Terceros</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.products}
                    </div>
                    <div className="text-sm text-gray-600">Productos</div>
                  </div>
                </div>
              </div>
              
              {/* Errors */}
              {importResult.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    Errores ({importResult.errors.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {importResult.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-sm font-medium text-red-900">
                          {error.file_name}
                        </div>
                        <div className="text-sm text-red-700">
                          {error.error_message}
                        </div>
                      </div>
                    ))}
                    {importResult.errors.length > 10 && (
                      <div className="text-sm text-gray-500 text-center">
                        ... y {importResult.errors.length - 10} errores más
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {importResult.summary.processed_successfully > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Importación completada con éxito
                      </h3>
                      <div className="text-sm text-green-700 mt-1">
                        Se procesaron {importResult.summary.processed_successfully} archivos NFe 
                        en {importResult.summary.processing_time_seconds.toFixed(2)} segundos.
                        Las facturas, terceros y productos han sido creados automáticamente.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
