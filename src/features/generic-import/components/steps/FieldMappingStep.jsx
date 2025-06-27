var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect } from 'react';
export function FieldMappingStep(_a) {
    var _this = this;
    var importSession = _a.importSession, modelMetadata = _a.modelMetadata, columnMappings = _a.columnMappings, onMappingsChange = _a.onMappingsChange, onSettingsChange = _a.onSettingsChange, onNext = _a.onNext, onValidateFullFile = _a.onValidateFullFile, onBack = _a.onBack, getMappingSuggestions = _a.getMappingSuggestions, isLoading = _a.isLoading, importPolicy = _a.importPolicy, skipValidationErrors = _a.skipValidationErrors;
    var _b = useState([]), suggestions = _b[0], setSuggestions = _b[1];
    var _c = useState(false), showSuggestions = _c[0], setShowSuggestions = _c[1];
    var _d = useState(false), loadingSuggestions = _d[0], setLoadingSuggestions = _d[1];
    // Cargar sugerencias al montar el componente
    useEffect(function () {
        var loadSuggestions = function () { return __awaiter(_this, void 0, void 0, function () {
            var autoSuggestions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoadingSuggestions(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, getMappingSuggestions()];
                    case 2:
                        autoSuggestions = _a.sent();
                        setSuggestions(Array.isArray(autoSuggestions) ? autoSuggestions : []);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error cargando sugerencias:', error_1);
                        setSuggestions([]);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoadingSuggestions(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadSuggestions();
    }, [getMappingSuggestions]);
    var availableFields = modelMetadata.fields.map(function (field) { return ({
        internal_name: field.internal_name,
        display_label: field.display_label,
        field_type: field.field_type,
        is_required: field.is_required,
        is_unique: field.is_unique,
        max_length: field.max_length,
        related_model: field.related_model,
        search_field: field.search_field,
        description: field.description,
    }); });
    var handleMappingChange = function (columnName, fieldName) {
        var updatedMappings = columnMappings.map(function (mapping) {
            return mapping.column_name === columnName
                ? __assign(__assign({}, mapping), { field_name: fieldName }) : mapping;
        });
        onMappingsChange(updatedMappings);
    };
    var applySuggestions = function () {
        if (!suggestions || suggestions.length === 0)
            return;
        var updatedMappings = columnMappings.map(function (mapping) {
            var suggestion = suggestions.find(function (s) { return s.column_name === mapping.column_name; });
            if (suggestion && suggestion.confidence > 0.5) {
                return __assign(__assign({}, mapping), { field_name: suggestion.suggested_field });
            }
            return mapping;
        });
        onMappingsChange(updatedMappings);
        setShowSuggestions(false);
    };
    var mappedFields = columnMappings.filter(function (m) { return m.field_name; }).map(function (m) { return m.field_name; });
    var requiredFields = availableFields.filter(function (f) { return f.is_required; });
    var unmappedRequiredFields = requiredFields.filter(function (f) { return !mappedFields.includes(f.internal_name); });
    var isNextDisabled = unmappedRequiredFields.length > 0 || isLoading;
    return (<div className="space-y-6" style={{ lineHeight: '1.5' }}>
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
      {suggestions && suggestions.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-900">
              Sugerencias de Mapeo Automático
            </h4>
            <div className="flex gap-2">
              <button type="button" onClick={applySuggestions} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" disabled={loadingSuggestions}>
                Aplicar Sugerencias
              </button>
              <button type="button" onClick={function () { return setShowSuggestions(!showSuggestions); }} className="text-xs text-blue-700 hover:text-blue-800">
                {showSuggestions ? 'Ocultar' : 'Ver detalles'}
              </button>
            </div>
          </div>
          
          {showSuggestions && (<div className="mt-3 space-y-2">
              {suggestions.map(function (suggestion, index) { return (<div key={index} className="text-xs bg-white p-2 rounded border">
                  <div className="flex justify-between">
                    <span className="font-medium">{suggestion.column_name}</span>
                    <span className="text-blue-600">→ {suggestion.suggested_field}</span>
                  </div>
                  <div className="text-gray-500 mt-1">
                    Confianza: {(suggestion.confidence * 100).toFixed(0)}% - {suggestion.reason}
                  </div>
                </div>); })}
            </div>)}
        </div>)}

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
              {importSession.detected_columns.map(function (column, index) {
            var _a;
            var mapping = columnMappings.find(function (m) { return m.column_name === column.name; });
            var suggestion = suggestions === null || suggestions === void 0 ? void 0 : suggestions.find(function (s) { return s.column_name === column.name; });
            return (<tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{column.name}</div>
                      {suggestion && (<div className="text-xs text-blue-600">
                          Sugerido: {suggestion.suggested_field} ({(suggestion.confidence * 100).toFixed(0)}%)
                        </div>)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <select value={(mapping === null || mapping === void 0 ? void 0 : mapping.field_name) || ''} onChange={function (e) { return handleMappingChange(column.name, e.target.value || undefined); }} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">-- Ignorar columna --</option>
                        {availableFields.map(function (field) { return (<option key={field.internal_name} value={field.internal_name}>
                            {field.display_label} {field.is_required ? '*' : ''}
                          </option>); })}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="max-w-xs truncate">
                        {((_a = column.sample_values) === null || _a === void 0 ? void 0 : _a.slice(0, 3).join(', ')) || 'N/A'}
                      </div>
                    </td>
                  </tr>);
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
            <select value={importPolicy} onChange={function (e) { return onSettingsChange({ importPolicy: e.target.value }); }} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="create_only">Solo crear registros nuevos</option>
              <option value="update_only">Solo actualizar existentes</option>
              <option value="upsert">Crear o actualizar (upsert)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="skipValidationErrors" checked={skipValidationErrors} onChange={function (e) { return onSettingsChange({ skipValidationErrors: e.target.checked }); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
            <label htmlFor="skipValidationErrors" className="ml-2 text-sm text-gray-700">
              Omitir registros con errores de validación
            </label>
          </div>
        </div>
      </div>

      {/* Campos requeridos no mapeados */}
      {unmappedRequiredFields.length > 0 && (<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Campos Requeridos Sin Mapear
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Los siguientes campos son obligatorios y necesitan ser mapeados:</p>
                <ul className="list-disc list-inside mt-1">
                  {unmappedRequiredFields.map(function (field) { return (<li key={field.internal_name}>{field.display_label}</li>); })}
                </ul>
              </div>
            </div>
          </div>
        </div>)}

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={isLoading}>
          ← Anterior
        </button>
        
        <div className="flex gap-3">
          <button type="button" onClick={onNext} disabled={isNextDisabled} className={"px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ".concat(isNextDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200')}>
            {isLoading ? 'Generando...' : '👁️ Vista previa (muestra)'}
          </button>
          
          <button type="button" onClick={onValidateFullFile} disabled={isNextDisabled} className={"px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ".concat(isNextDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700')}>
            {isLoading ? 'Validando...' : '🔍 Validar archivo completo'}
          </button>
        </div>
      </div>
    </div>);
}
