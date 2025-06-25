import type { ImportResult } from '../../types';

interface ResultStepProps {
  importResult?: ImportResult;
  error?: string;
  onComplete: () => void;
  onRetry: () => void;
  onStartNew: () => void;
}

export function ResultStep({
  importResult,
  error,
  onComplete,
  onRetry,
  onStartNew,
}: ResultStepProps) {
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error en la Importación
          </h3>
          <p className="text-sm text-gray-600">
            La importación no pudo completarse debido a un error.
          </p>
        </div>

        <div className="border border-red-200 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error de importación
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reintentar Importación
          </button>
          <button
            type="button"
            onClick={onStartNew}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nueva Importación
          </button>
        </div>
      </div>
    );
  }

  if (!importResult) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay resultados disponibles</p>
      </div>
    );
  }
  const isSuccess = importResult.status === 'completed';
  const hasPartialErrors = importResult.failed_rows > 0;
  const hasSkippedRows = (importResult.skipped_rows || 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Resultados de la Importación
        </h3>
        <p className="text-sm text-gray-600">
          La importación ha finalizado. Revise los resultados a continuación.
        </p>
      </div>      {/* Estado general */}
      {isSuccess && !hasPartialErrors && !hasSkippedRows && (
        <div className="border border-green-200 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                ¡Importación completada exitosamente!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Todos los datos se importaron correctamente sin errores.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (hasPartialErrors || hasSkippedRows) && (
        <div className="border border-yellow-200 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Importación completada con {hasPartialErrors ? 'errores' : 'filas omitidas'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {hasPartialErrors && hasSkippedRows
                    ? `Se procesaron algunos registros exitosamente, pero ${importResult.failed_rows} fallaron y ${importResult.skipped_rows} fueron omitidas.`
                    : hasPartialErrors
                    ? `Se procesaron algunos registros exitosamente, pero ${importResult.failed_rows} tuvieron errores.`
                    : `Se procesaron ${importResult.created_rows} registros exitosamente, pero ${importResult.skipped_rows} fueron omitidas.`
                  }
                  {hasSkippedRows && (
                    <span> Revise los detalles de las filas omitidas abajo.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {importResult.status === 'failed' && (
        <div className="border border-red-200 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                La importación falló
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  No se pudieron procesar los datos debido a errores críticos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-blue-900">
            {importResult.total_rows}
          </div>
          <div className="text-sm text-blue-600">Total procesadas</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-green-900">
            {importResult.created_rows}
          </div>
          <div className="text-sm text-green-600">Creadas</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-yellow-900">
            {importResult.updated_rows}
          </div>
          <div className="text-sm text-yellow-600">Actualizadas</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-red-900">
            {importResult.failed_rows}
          </div>
          <div className="text-sm text-red-600">Con errores</div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {importResult.skipped_rows}
          </div>
          <div className="text-sm text-gray-600">Omitidas</div>
        </div>
      </div>

      {/* Tiempo de procesamiento */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Información del Proceso
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">          <div>
            <span className="text-gray-600">Tiempo de procesamiento:</span>
            <span className="text-gray-900 ml-1 font-medium">
              {importResult.processing_time_seconds != null 
                ? `${importResult.processing_time_seconds.toFixed(2)} segundos`
                : 'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">Filas por segundo:</span>
            <span className="text-gray-900 ml-1 font-medium">
              {(importResult.processing_time_seconds != null && importResult.processing_time_seconds > 0)
                ? (importResult.processed_rows / importResult.processing_time_seconds).toFixed(1)
                : 'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">Iniciado:</span>
            <span className="text-gray-900 ml-1 font-medium">
              {new Date(importResult.started_at).toLocaleString()}
            </span>
          </div>
          {importResult.completed_at && (
            <div>
              <span className="text-gray-600">Completado:</span>
              <span className="text-gray-900 ml-1 font-medium">
                {new Date(importResult.completed_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>      
      {/* Errores más comunes */}
      {importResult.error_summary && Object.keys(importResult.error_summary).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-900 mb-3">
            Resumen de Errores
          </h4>          <div className="space-y-2">
            {Object.entries(importResult.error_summary || {}).map(([error, count]) => (
              <div key={error} className="flex justify-between text-sm">
                <span className="text-red-700">{error}</span>
                <span className="text-red-600 font-medium">{count} ocurrencias</span>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Registros creados/actualizados destacados */}
      {((importResult.created_entities?.length || 0) > 0 || (importResult.updated_entities?.length || 0) > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-3">
            Primeros Registros Procesados Exitosamente
          </h4>
          <div className="max-h-40 overflow-y-auto">
            <div className="space-y-2 text-sm">
              {(importResult.created_entities || []).slice(0, 5).map((entity) => (
                <div key={entity.entity_id} className="flex justify-between text-green-700">
                  <span>Fila {entity.row_number}: Creado</span>
                  <span className="font-mono text-xs">{entity.entity_id}</span>
                </div>
              ))}
              {(importResult.updated_entities || []).slice(0, 5).map((entity) => (
                <div key={entity.entity_id} className="flex justify-between text-green-700">
                  <span>Fila {entity.row_number}: Actualizado</span>
                  <span className="font-mono text-xs">{entity.entity_id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}      {/* Errores detallados */}
      {(importResult.detailed_errors?.length || 0) > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">
              Errores Detallados (primeros 10)
            </h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {(importResult.detailed_errors || []).slice(0, 10).map((errorRow) => (
                <div key={errorRow.row_number} className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Fila {errorRow.row_number}
                  </div>
                  <div className="space-y-1">
                    {(errorRow.errors || []).map((error, index) => (
                      <div key={index} className="text-xs text-red-600">
                        <span className="font-medium">{error.field_name}:</span> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filas omitidas (skipped) */}
      {(importResult.skipped_details?.length || 0) > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
            <h4 className="text-sm font-medium text-yellow-900">
              Filas Omitidas ({importResult.skipped_rows} total)
            </h4>
            <p className="text-xs text-yellow-700 mt-1">
              Estas filas fueron omitidas durante la importación debido a los siguientes motivos:
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {(importResult.skipped_details || []).map((detail, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}      {/* Botones de acción */}
      <div className="flex justify-center space-x-4">
        {(hasPartialErrors || hasSkippedRows) && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {hasPartialErrors ? 'Corregir y Reintentar' : 'Revisar y Reintentar'}
          </button>
        )}
        
        <button
          type="button"
          onClick={onStartNew}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nueva Importación
        </button>
        
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
