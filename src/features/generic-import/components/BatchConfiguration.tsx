import React, { useState, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
import type { ImportConfig } from '../types';

interface BatchConfigurationProps {
  totalRows: number;
  onBatchSizeChange: (batchSize: number) => void;
  defaultBatchSize?: number;
  disabled?: boolean;
}

export const BatchConfiguration: React.FC<BatchConfigurationProps> = ({
  totalRows,
  onBatchSizeChange,
  defaultBatchSize = 2000,
  disabled = false
}) => {
  const [batchSize, setBatchSize] = useState(defaultBatchSize);
  const [config, setConfig] = useState<ImportConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimation, setEstimation] = useState<{
    estimatedMinutes: number;
    estimatedBatches: number;
    recommendedBatchSize: number;
  } | null>(null);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } | null>(null);

  // Cargar configuración al montar el componente
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const importConfig = await GenericImportService.getImportConfig();
        setConfig(importConfig);
        
        // Si no hay un tamaño de lote específico, usar el predeterminado de la configuración
        if (defaultBatchSize === 2000) {
          setBatchSize(importConfig.batch_size.default);
          onBatchSizeChange(importConfig.batch_size.default);
        }
      } catch (error) {
        console.error('Error loading import config:', error);
        // Usar valores predeterminados si falla la carga
        setConfig({
          batch_size: { default: 2000, min: 1, max: 10000, description: 'Number of rows to process per batch' },
          preview_rows: { default: 10, min: 5, max: 50, description: 'Number of rows to show in preview' },
          supported_formats: ['csv', 'xlsx', 'xls'],
          max_file_size_mb: 100,
          session_timeout_hours: 2
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []); // Only run once on mount

  // Update batch size when defaultBatchSize prop changes
  useEffect(() => {
    if (defaultBatchSize && defaultBatchSize !== batchSize) {
      setBatchSize(defaultBatchSize);
      onBatchSizeChange(defaultBatchSize);
    }
  }, [defaultBatchSize]); // Only depend on defaultBatchSize

  // Actualizar estimaciones cuando cambie el tamaño de lote o filas totales
  useEffect(() => {
    if (totalRows > 0) {
      const newEstimation = GenericImportService.estimateProcessingTime(totalRows, batchSize);
      setEstimation(newEstimation);
      
      if (config) {
        const newValidation = GenericImportService.validateBatchConfig(batchSize, totalRows, config);
        setValidation(newValidation);
      }
    }
  }, [batchSize, totalRows, config]);

  const handleBatchSizeChange = (newBatchSize: number) => {
    setBatchSize(newBatchSize);
    onBatchSizeChange(newBatchSize);
  };

  const useRecommendedSize = () => {
    if (estimation) {
      handleBatchSizeChange(estimation.recommendedBatchSize);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div>
        <label htmlFor="batch-size" className="block text-sm font-medium text-gray-700 mb-2">
          Tamaño de Lote (Batch Size)
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="batch-size"
            type="number"
            min={config?.batch_size.min || 1}
            max={config?.batch_size.max || 10000}
            value={batchSize}
            onChange={(e) => handleBatchSizeChange(parseInt(e.target.value) || config?.batch_size.default || 2000)}
            disabled={disabled}
            className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
          />
          <div className="text-sm text-gray-600">
            filas por lote
            {config && (
              <div className="text-xs text-gray-500">
                (rango: {config.batch_size.min} - {config.batch_size.max})
              </div>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {config?.batch_size.description || 'Número de filas a procesar en cada lote'}
        </p>
      </div>

      {/* Información del archivo */}
      <div className="bg-white p-3 rounded border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Archivo</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total de filas:</span>
            <span className="ml-2 font-medium">{totalRows.toLocaleString()}</span>
          </div>
          {estimation && (
            <>
              <div>
                <span className="text-gray-500">Lotes estimados:</span>
                <span className="ml-2 font-medium">{estimation.estimatedBatches}</span>
              </div>
              <div>
                <span className="text-gray-500">Tiempo estimado:</span>
                <span className="ml-2 font-medium">{estimation.estimatedMinutes} minutos</span>
              </div>
              <div>
                <span className="text-gray-500">Tamaño recomendado:</span>
                <span className="ml-2 font-medium">{estimation.recommendedBatchSize}</span>
                {estimation.recommendedBatchSize !== batchSize && (
                  <button
                    onClick={useRecommendedSize}
                    disabled={disabled}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline disabled:text-gray-400 disabled:no-underline"
                  >
                    Usar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Validaciones y advertencias */}
      {validation && (
        <div className="space-y-2">
          {validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h5 className="text-sm font-medium text-yellow-800 mb-1">Advertencias</h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h5 className="text-sm font-medium text-blue-800 mb-1">Recomendaciones</h5>
              <ul className="text-xs text-blue-700 space-y-1">
                {validation.recommendations.map((recommendation, index) => (
                  <li key={index}>• {recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Explicación del procesamiento por lotes */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">¿Qué es el procesamiento por lotes?</h4>
        <p className="text-xs text-blue-700">
          El archivo se procesa en fragmentos (lotes) para optimizar el rendimiento y evitar problemas de memoria. 
          Un lote más grande procesará más rápido pero usará más memoria, mientras que un lote más pequeño será más lento pero más seguro.
        </p>
      </div>
    </div>
  );
};

export default BatchConfiguration;
