import { useState, useEffect } from 'react';
import type {
  ImportSessionResponse,
  ModelMetadata,
  ColumnMapping,
  ImportPolicy,
  MappingSuggestion,
  FieldInfo,
} from '../../types';

interface FieldMappingStepProps {
  importSession: ImportSessionResponse;
  modelMetadata: ModelMetadata;
  columnMappings: ColumnMapping[];
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onSettingsChange: (settings: {
    importPolicy?: ImportPolicy;
    skipValidationErrors?: boolean;
    defaultValues?: Record<string, any>;
  }) => void;
  onNext: () => Promise<void>;
  onValidateFullFile: () => Promise<void>;
  onBack: () => void;
  getMappingSuggestions: () => Promise<MappingSuggestion[]>;
  isLoading: boolean;
  importPolicy: ImportPolicy;
  skipValidationErrors: boolean;
  defaultValues: Record<string, any>;
}

export function FieldMappingStep({
  importSession,
  modelMetadata,
  columnMappings,
  onMappingsChange,
  onSettingsChange,
  onNext,
  onValidateFullFile,
  onBack,
  getMappingSuggestions,
  isLoading,
  importPolicy,
  skipValidationErrors,
}: FieldMappingStepProps) {
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Cargar sugerencias al montar el componente
  useEffect(() => {
    const loadSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const autoSuggestions = await getMappingSuggestions();
        setSuggestions(Array.isArray(autoSuggestions) ? autoSuggestions : []);
      } catch (error) {
        console.error('Error cargando sugerencias:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [getMappingSuggestions]);

  const availableFields: FieldInfo[] = modelMetadata.fields.map(field => ({
    internal_name: field.internal_name,
    display_label: field.display_label,
    field_type: field.field_type,
    is_required: field.is_required,
    is_unique: field.is_unique,
    max_length: field.max_length,
    related_model: field.related_model,
    search_field: field.search_field,
    description: field.description,
  }));

  const handleMappingChange = (columnName: string, fieldName: string | undefined) => {
    const updatedMappings = columnMappings.map(mapping => 
      mapping.column_name === columnName
        ? { ...mapping, field_name: fieldName }
        : mapping
    );
    onMappingsChange(updatedMappings);
  };

  const applySuggestions = () => {
    if (!suggestions || suggestions.length === 0) return;
    
    const updatedMappings = columnMappings.map(mapping => {
      const suggestion = suggestions.find(s => s.column_name === mapping.column_name);
      if (suggestion && suggestion.confidence > 0.5) {
        return { ...mapping, field_name: suggestion.suggested_field };
      }
      return mapping;
    });
    onMappingsChange(updatedMappings);
    setShowSuggestions(false);
  };

  const mappedFields = columnMappings.filter(m => m.field_name).map(m => m.field_name);
  const requiredFields = availableFields.filter(f => f.is_required);
  const unmappedRequiredFields = requiredFields.filter(f => !mappedFields.includes(f.internal_name));
  const isNextDisabled = unmappedRequiredFields.length > 0 || isLoading;

  return (
    <div className="space-y-6" style={{ lineHeight: '1.5' }}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ lineHeight: '1.25' }}>
          Mapeo de Campos
        </h3>
        <p className="text-sm text-gray-600" style={{ lineHeight: '1.4' }}>
          Configure cómo se relacionan las columnas de su archivo con los campos del modelo {modelMetadata.display_name}.
        </p>
      </div>

      {/* Información del archivo */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Archivo</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Archivo:</span>
            <span className="text-gray-700 ml-1">{importSession.file_info.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Total de filas:</span>
            <span className="text-gray-700 ml-1">{importSession.file_info.total_rows}</span>
          </div>
        </div>
      </div>

      {/* Sugerencias automáticas */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-900">
              Sugerencias de Mapeo Automático
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applySuggestions}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                disabled={loadingSuggestions}
              >
                Aplicar Sugerencias
              </button>
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs text-blue-700 hover:text-blue-800"
              >
                {showSuggestions ? 'Ocultar' : 'Ver detalles'}
              </button>
            </div>
          </div>
          
          {showSuggestions && (
            <div className="mt-3 space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs bg-white p-2 rounded border">
                  <div className="flex justify-between">
                    <span className="font-medium">{suggestion.column_name}</span>
                    <span className="text-blue-600">→ {suggestion.suggested_field}</span>
                  </div>
                  <div className="text-gray-500 mt-1">
                    Confianza: {(suggestion.confidence * 100).toFixed(0)}% - {suggestion.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabla de mapeo */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Mapeo de Columnas</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Columna del Archivo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campo del Modelo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Muestra de Datos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importSession.detected_columns.map((column, index) => {
                const mapping = columnMappings.find(m => m.column_name === column.name);
                const suggestion = suggestions?.find(s => s.column_name === column.name);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{column.name}</div>
                      {suggestion && (
                        <div className="text-xs text-blue-600">
                          Sugerido: {suggestion.suggested_field} ({(suggestion.confidence * 100).toFixed(0)}%)
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <select
                        value={mapping?.field_name || ''}
                        onChange={(e) => handleMappingChange(column.name, e.target.value || undefined)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Ignorar columna --</option>
                        {availableFields.map(field => (
                          <option key={field.internal_name} value={field.internal_name}>
                            {field.display_label} {field.is_required ? '*' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="max-w-xs truncate">
                        {column.sample_values?.slice(0, 3).join(', ') || 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuración de importación */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Configuración de Importación</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Política de Importación
            </label>
            <select
              value={importPolicy}
              onChange={(e) => onSettingsChange({ importPolicy: e.target.value as ImportPolicy })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="create_only">Solo crear registros nuevos</option>
              <option value="update_only">Solo actualizar existentes</option>
              <option value="upsert">Crear o actualizar (upsert)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="skipValidationErrors"
              checked={skipValidationErrors}
              onChange={(e) => onSettingsChange({ skipValidationErrors: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="skipValidationErrors" className="ml-2 text-sm text-gray-700">
              Omitir registros con errores de validación
            </label>
          </div>
        </div>
      </div>

      {/* Campos requeridos no mapeados */}
      {unmappedRequiredFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Campos Requeridos Sin Mapear
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Los siguientes campos son obligatorios y necesitan ser mapeados:</p>
                <ul className="list-disc list-inside mt-1">
                  {unmappedRequiredFields.map(field => (
                    <li key={field.internal_name}>{field.display_label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          ← Anterior
        </button>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
            }`}
          >
            {isLoading ? 'Generando...' : '👁️ Vista previa (muestra)'}
          </button>
          
          <button
            type="button"
            onClick={onValidateFullFile}
            disabled={isNextDisabled}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Validando...' : '🔍 Validar archivo completo'}
          </button>
        </div>
      </div>
    </div>
  );
}
