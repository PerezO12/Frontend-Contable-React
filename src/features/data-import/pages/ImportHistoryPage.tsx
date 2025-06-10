import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useImportHistory } from '../hooks';
import type { ImportResult } from '../types';
import { formatDuration } from '../utils';

export function ImportHistoryPage() {  const {
    imports,
    total,
    page,
    totalPages,
    isLoading,
    getImportHistory,
    changePage
  } = useImportHistory();

  const [selectedDataType, setSelectedDataType] = useState<'accounts' | 'journal_entries' | 'all'>('all');
  const [selectedImport, setSelectedImport] = useState<ImportResult | null>(null);

  useEffect(() => {
    const dataType = selectedDataType === 'all' ? undefined : selectedDataType;
    getImportHistory(1, 20, dataType);
  }, [selectedDataType, getImportHistory]);

  const getDataTypeLabel = (type: string) => {
    return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' },
      partial: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Parcial' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Fallido' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.failed;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Historial de Importaciones
        </h1>
        <p className="text-gray-600 mt-2">
          Revisa el historial completo de todas las importaciones realizadas
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por tipo:
            </label>
            <select
              value={selectedDataType}
              onChange={(e) => setSelectedDataType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="accounts">Cuentas Contables</option>
              <option value="journal_entries">Asientos Contables</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {total > 0 ? (
              <>Mostrando {imports.length} de {total.toLocaleString()} importaciones</>
            ) : (
              'No hay importaciones'
            )}
          </div>
        </div>
      </Card>

      {/* History List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </Card>
      ) : imports.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay importaciones
          </h3>
          <p className="text-gray-600 mb-4">
            Aún no se han realizado importaciones de datos
          </p>
          <Button variant="primary">
            Realizar Primera Importación
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {imports.map((importItem) => (
            <Card key={importItem.import_id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDataTypeLabel(importItem.configuration.data_type)}
                    </h3>
                    {getStatusBadge(importItem.status)}
                    <span className="text-sm text-gray-500">
                      ID: {importItem.import_id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(importItem.started_at || importItem.created_at || '')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Filas</p>
                      <p className="text-sm text-gray-600">
                        {importItem.summary.total_rows.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Exitosas</p>
                      <p className="text-sm text-green-600 font-medium">
                        {importItem.summary.successful_rows.toLocaleString()}
                      </p>
                    </div>
                      <div>
                      <p className="text-sm font-medium text-gray-700">Tiempo</p>
                      <p className="text-sm text-gray-600">
                        {formatDuration(importItem.summary.processing_time_seconds || importItem.processing_time || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>
                        {Math.round((importItem.summary.successful_rows / importItem.summary.total_rows) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          importItem.status === 'completed' ? 'bg-green-500' :
                          importItem.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(importItem.summary.successful_rows / importItem.summary.total_rows) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>                  {/* Error/Warning summary */}
                  {((importItem.summary.error_rows || importItem.summary.errors || 0) > 0 || (importItem.summary.warning_rows || importItem.summary.warnings || 0) > 0) && (
                    <div className="flex space-x-4 text-sm">
                      {(importItem.summary.error_rows || importItem.summary.errors || 0) > 0 && (
                        <span className="text-red-600">
                          {(importItem.summary.error_rows || importItem.summary.errors || 0)} errores
                        </span>
                      )}
                      {(importItem.summary.warning_rows || importItem.summary.warnings || 0) > 0 && (
                        <span className="text-yellow-600">
                          {(importItem.summary.warning_rows || importItem.summary.warnings || 0)} advertencias
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedImport(importItem)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex justify-between flex-1 sm:hidden">
                <Button
                  variant="secondary"
                  onClick={() => changePage(page - 1)}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => changePage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
              
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Página <span className="font-medium">{page}</span> de{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <Button
                      variant="secondary"
                      onClick={() => changePage(page - 1)}
                      disabled={page <= 1}
                      className="rounded-l-md"
                    >
                      Anterior
                    </Button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + Math.max(1, page - 2);
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "primary" : "secondary"}
                          onClick={() => changePage(pageNum)}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="secondary"
                      onClick={() => changePage(page + 1)}
                      disabled={page >= totalPages}
                      className="rounded-r-md"
                    >
                      Siguiente
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedImport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de Importación - {selectedImport.import_id}
              </h3>
              <button
                onClick={() => setSelectedImport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Resumen</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Total</p>
                    <p className="text-xl font-semibold text-blue-900">
                      {selectedImport.summary.total_rows}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Exitosas</p>
                    <p className="text-xl font-semibold text-green-900">
                      {selectedImport.summary.successful_rows}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Fallidas</p>
                    <p className="text-xl font-semibold text-red-900">
                      {selectedImport.summary.failed_rows}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Advertencias</p>
                    <p className="text-xl font-semibold text-yellow-900">
                      {selectedImport.summary.warnings}
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Configuración</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tipo de datos:</span>{' '}
                      {getDataTypeLabel(selectedImport.configuration.data_type)}
                    </div>
                    <div>
                      <span className="font-medium">Formato:</span>{' '}
                      {selectedImport.configuration.format.toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium">Validación:</span>{' '}
                      {selectedImport.configuration.validation_level}
                    </div>
                    <div>
                      <span className="font-medium">Tamaño de lote:</span>{' '}
                      {selectedImport.configuration.batch_size}
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {selectedImport.errors && selectedImport.errors.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Errores ({selectedImport.errors.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedImport.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <p className="text-sm font-medium text-red-800">
                          Fila {error.row_number} - {error.field_name}
                        </p>
                        <p className="text-sm text-red-600">
                          {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedImport(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
