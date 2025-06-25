import { useState, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';

interface ExampleDownloadButtonProps {
  modelName: string;
  className?: string;
}

interface ExampleInfo {
  type: string;
  name: string;
  description: string;
  filename: string;
  includes: string[];
}

interface ExamplesData {
  model: string;
  available_examples: ExampleInfo[];
}

export function ExampleDownloadButton({ 
  modelName, 
  className = ''
}: ExampleDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [examplesInfo, setExamplesInfo] = useState<ExamplesData | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Cargar información de ejemplos al montar el componente
  useEffect(() => {
    const loadExamplesInfo = async () => {
      try {
        setInfoLoading(true);
        setError(null);
        const info = await GenericImportService.getExamplesInfo(modelName);
        setExamplesInfo(info);
      } catch (err) {
        console.warn(`Ejemplos no disponibles para modelo ${modelName}:`, err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setInfoLoading(false);
      }
    };

    if (modelName === 'invoice') {
      loadExamplesInfo();
    }
  }, [modelName]);

  const handleDownloadExample = async (exampleType: string) => {
    try {
      setLoading(true);
      await GenericImportService.downloadExamples(modelName, exampleType);
      setShowDropdown(false); // Cerrar dropdown después de descargar
    } catch (err) {
      console.error('Error descargando ejemplo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Si no hay ejemplos disponibles para este modelo, no mostrar nada
  if (modelName !== 'invoice' || error) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={infoLoading || !examplesInfo}
        className="inline-flex items-center px-4 py-2 border border-green-500 text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {infoLoading ? 'Cargando...' : 'Ver Ejemplos'}
        <svg className={`ml-2 h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && examplesInfo && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              📋 Ejemplos de Facturas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Descarga ejemplos prácticos para entender el formato de importación
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {examplesInfo.available_examples.map((example, index) => (
              <div key={example.type} className={`p-4 ${index < examplesInfo.available_examples.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {example.type === 'complete' && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      )}
                      {example.type === 'payment_terms' && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M20,18H4V12H20V18M20,6V10H4V6H20Z" />
                        </svg>
                      )}
                      {example.type === 'multi_line' && (
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4" />
                        </svg>
                      )}
                      <span className="font-medium text-gray-900">{example.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadExample(example.type)}
                    disabled={loading}
                    className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {loading ? 'Descargando...' : 'Descargar'}
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Incluye:</p>
                  <ul className="text-xs text-gray-600 ml-3">
                    {example.includes.map((include: string, idx: number) => (
                      <li key={idx} className="list-disc">{include}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 border-t border-gray-200">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-blue-800">💡 Tip</p>
                <p className="text-xs text-blue-700 mt-1">
                  Estos ejemplos muestran casos reales de uso. Puedes modificarlos según tus necesidades antes de importar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown al hacer click fuera */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
