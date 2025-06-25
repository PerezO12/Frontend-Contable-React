import { Card } from '@/components/ui';

interface ValidationError {
  row_number?: number | null;
  field_name?: string | null;
  error_type?: string;
  error_code?: string;
  message?: string;
  error_message?: string;
  severity?: string;
  current_value?: string | null;
}

interface ValidationErrorsDisplayProps {
  errors: ValidationError[];
  title?: string;
  showRowNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

export function ValidationErrorsDisplay({ 
  errors, 
  title = "Errores de Validación",
  showRowNumbers = true,
  maxHeight = "max-h-96",
  className = ""
}: ValidationErrorsDisplayProps) {
  
  if (!errors || errors.length === 0) {
    return null;
  }
  // Agrupar errores por fila
  const errorsByRow = errors.reduce((acc, error) => {
    const rowNumber = error.row_number || 0;
    if (!acc[rowNumber]) {
      acc[rowNumber] = [];
    }
    acc[rowNumber].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  // Contadores por tipo
  const errorCounts = errors.reduce((acc, error) => {
    const severity = error.severity || 'error';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-red-800 flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {title}
        </h4>
        
        {/* Resumen rápido */}
        <div className="flex items-center space-x-3 text-sm">
          {errorCounts.error && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {errorCounts.error} errores
            </span>
          )}
          {errorCounts.warning && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {errorCounts.warning} advertencias
            </span>
          )}
        </div>
      </div>
      
      <div className={`space-y-3 ${maxHeight} overflow-y-auto`}>
        {showRowNumbers ? (
          // Agrupar por fila
          Object.entries(errorsByRow)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([rowNumber, rowErrors]) => (
              <div key={`row-${rowNumber}`} className="border border-red-200 rounded-lg bg-red-50 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                      {Number(rowNumber) > 0 ? `Fila ${rowNumber}` : 'General'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="space-y-2">
                      {rowErrors.map((error, errorIndex) => (
                        <div key={`error-${rowNumber}-${errorIndex}`} className="bg-white border border-red-200 rounded p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {error.field_name && (
                                <div className="text-sm font-medium text-red-700 mb-1">
                                  Campo: <span className="font-semibold">{error.field_name}</span>
                                </div>
                              )}
                              <div className="text-sm text-red-600">
                                {error.message || error.error_message || 'Error sin descripción'}
                              </div>
                              {error.current_value && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Valor actual: <code className="bg-gray-100 px-1 rounded">{error.current_value}</code>
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {(error.error_type || error.error_code) && (
                                <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded">
                                  {error.error_type || error.error_code}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          // Lista simple sin agrupar
          errors.map((error, index) => (
            <div key={`error-${index}`} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {error.row_number && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        Fila {error.row_number}
                      </span>
                    )}
                    {error.field_name && (
                      <span className="text-sm font-medium text-red-700">
                        Campo: {error.field_name}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-red-600">
                    {error.message || error.error_message || 'Error sin descripción'}
                  </div>
                  {error.current_value && (
                    <div className="text-xs text-gray-600 mt-1">
                      Valor: <code className="bg-gray-100 px-1 rounded">{error.current_value}</code>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {(error.error_type || error.error_code) && (
                    <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded">
                      {error.error_type || error.error_code}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instrucciones de ayuda */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700">
            <strong>¿Cómo corregir estos errores?</strong>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Revise cada error específico arriba para entender qué está mal</li>
              <li>Corrija los datos en su archivo original según los errores mostrados</li>
              <li>Asegúrese de que los campos obligatorios no estén vacíos</li>
              <li>Verifique el formato de fechas, números y otros tipos de datos</li>
              <li>Vuelva a cargar el archivo corregido desde el paso anterior</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resumen de tipos de errores más comunes */}
      {Object.keys(errorCounts).length > 1 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Resumen de problemas:</h5>
          <div className="flex flex-wrap gap-2 text-sm">
            {Object.entries(errorCounts).map(([type, count]) => (
              <span 
                key={type}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  type === 'error' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {type === 'error' ? '❌' : '⚠️'} {count} {type === 'error' ? 'errores' : 'advertencias'}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
