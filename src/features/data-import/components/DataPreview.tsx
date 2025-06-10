import { Card } from '@/components/ui';
import type { ImportPreviewData } from '../types';

interface DataPreviewProps {
  previewData: ImportPreviewData;
  className?: string;
}

export function DataPreview({ previewData, className = '' }: DataPreviewProps) {
  const {
    detected_format,
    detected_data_type,
    total_rows,
    preview_data,
    validation_errors,
    recommendations
  } = previewData;

  const errorsByType = validation_errors?.reduce((acc, error) => {
    acc[error.severity] = (acc[error.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const getDataTypeLabel = (type: string) => {
    return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      csv: 'CSV',
      xlsx: 'Excel',
      json: 'JSON'
    };
    return labels[format] || format.toUpperCase();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Información general */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vista Previa de Datos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Tipo de Datos</p>
            <p className="text-lg font-semibold text-blue-900">
              {getDataTypeLabel(detected_data_type)}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800">Formato</p>
            <p className="text-lg font-semibold text-green-900">
              {getFormatLabel(detected_format)}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-800">Total de Filas</p>
            <p className="text-lg font-semibold text-purple-900">
              {total_rows.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Estado de validación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            errorsByType.error > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center">
              <div className={`rounded-full p-1 mr-3 ${
                errorsByType.error > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {errorsByType.error > 0 ? (
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-medium ${
                  errorsByType.error > 0 ? 'text-red-800' : 'text-green-800'
                }`}>
                  Estado de Validación
                </p>
                <p className={`text-sm ${
                  errorsByType.error > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {errorsByType.error > 0 
                    ? `${errorsByType.error} errores encontrados`
                    : 'Validación exitosa'
                  }
                </p>
              </div>
            </div>
          </div>

          {errorsByType.warning > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-1 mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Advertencias</p>
                  <p className="text-sm text-yellow-600">
                    {errorsByType.warning} advertencias encontradas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Vista previa de datos */}
      {preview_data && preview_data.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Primeras {preview_data.length} Filas
          </h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview_data[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview_data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value !== null && value !== undefined ? String(value) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {total_rows > preview_data.length && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Mostrando {preview_data.length} de {total_rows.toLocaleString()} filas totales
            </p>
          )}
        </Card>
      )}

      {/* Errores de validación */}
      {validation_errors && validation_errors.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Errores de Validación
          </h4>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {validation_errors.map((error, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  error.severity === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-1 mr-3 mt-0.5 ${
                    error.severity === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {error.severity === 'error' ? (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      error.severity === 'error' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      Fila {error.row_number} - Campo: {error.field_name}
                    </p>
                    <p className={`text-sm ${
                      error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {error.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recomendaciones */}
      {recommendations && recommendations.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recomendaciones
          </h4>
          
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="rounded-full bg-blue-100 p-1 mr-3 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
