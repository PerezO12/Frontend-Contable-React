import type { ImportSessionResponse } from '../../types';

interface ExecutionStepProps {
  isLoading: boolean;
  importSession: ImportSessionResponse;
  batchSize?: number;
}

export function ExecutionStep({
  // isLoading, // Unused
  importSession,
  batchSize,
}: ExecutionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ejecutando Importación
        </h3>
        <p className="text-sm text-gray-600">
          Su importación está siendo procesada. Este proceso puede tomar algunos minutos dependiendo del tamaño del archivo.
        </p>
      </div>

      {/* Información del proceso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        <div className="text-center">
          <h4 className="text-lg font-medium text-blue-900 mb-2">
            Procesando datos...
          </h4>
          <p className="text-sm text-blue-700 mb-4">
            Importando {importSession.file_info.total_rows} filas al modelo {importSession.model_display_name}
          </p>
          
          <div className="bg-white rounded-lg p-4 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Archivo:</span>
                <span className="font-medium text-gray-900">{importSession.file_info.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modelo:</span>
                <span className="font-medium text-gray-900">{importSession.model_display_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de filas:</span>
                <span className="font-medium text-gray-900">{importSession.file_info.total_rows}</span>
              </div>
              {batchSize && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamaño de lote:</span>
                    <span className="font-medium text-gray-900">{batchSize.toLocaleString()} filas/lote</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de lotes:</span>
                    <span className="font-medium text-gray-900">{Math.ceil(importSession.file_info.total_rows / batchSize)} lotes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Procesamiento:</span>
                    <span className="font-medium text-blue-600">En lotes de {batchSize.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Formato:</span>
                <span className="font-medium text-gray-900">
                  {importSession.file_info.delimiter ? 'CSV' : 'XLSX'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso estimado */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Proceso en curso
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center mr-3">
              <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span className="text-gray-700">Archivo procesado y validado</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-400 flex items-center justify-center mr-3">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
            </div>
            <span className="text-gray-700">Creando/actualizando registros...</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
            </div>
            <span className="text-gray-500">Generando reporte de resultados</span>
          </div>
        </div>
      </div>

      {/* Consejos mientras espera */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">
          💡 Mientras espera
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• No cierre esta ventana hasta que termine el proceso</li>
          <li>• Los datos se están validando e insertando en lotes para optimizar el rendimiento</li>
          <li>• Si hay errores, aparecerán en el reporte final con detalles específicos</li>
          <li>• Puede cancelar el proceso si es necesario, pero los datos ya procesados no se revertirán</li>
        </ul>
      </div>

      {/* Advertencia sobre no cerrar */}
      <div className="border border-orange-200 rounded-md bg-orange-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">
              Importante
            </h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                No cierre esta página ni navegue a otra sección mientras la importación está en progreso. 
                El proceso podría interrumpirse y dejar datos parcialmente importados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
