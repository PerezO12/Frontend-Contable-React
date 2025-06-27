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
import { useCallback } from 'react';
import { ValidationErrorsDisplay } from '../ValidationErrorsDisplay';
import { BatchConfiguration } from '../BatchConfiguration';
import { BatchNavigation } from '../BatchNavigation';
export function PreviewStep(_a) {
    var _this = this;
    var _b;
    var previewData = _a.previewData, onNext = _a.onNext, onNextWithSkipErrors = _a.onNextWithSkipErrors, onBack = _a.onBack, isLoading = _a.isLoading, batchSize = _a.batchSize, onBatchSizeChange = _a.onBatchSizeChange, onBatchChange = _a.onBatchChange;
    // DEBUG: Agregar logging para entender qué datos estamos recibiendo
    console.log('🔍 === PREVIEW STEP DEBUG ===');
    console.log('📊 previewData completo:', JSON.stringify(previewData, null, 2));
    console.log('📋 validation_summary:', previewData === null || previewData === void 0 ? void 0 : previewData.validation_summary);
    console.log('📄 preview_data:', previewData === null || previewData === void 0 ? void 0 : previewData.preview_data);
    console.log('📏 preview_data length:', (_b = previewData === null || previewData === void 0 ? void 0 : previewData.preview_data) === null || _b === void 0 ? void 0 : _b.length);
    console.log('📦 batch_info:', previewData === null || previewData === void 0 ? void 0 : previewData.batch_info);
    var _c = previewData || {}, validation_summary = _c.validation_summary, _d = _c.preview_data, preview_data = _d === void 0 ? [] : _d, can_skip_errors = _c.can_skip_errors, skip_errors_available = _c.skip_errors_available, batch_info = _c.batch_info;
    // Manejador para cambio de lote
    var handleBatchChange = useCallback(function (batchNumber) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onBatchChange) return [3 /*break*/, 2];
                    return [4 /*yield*/, onBatchChange(batchNumber)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [onBatchChange]);
    // Validaciones defensivas
    if (!previewData || !validation_summary) {
        return (<div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-500">
            No hay datos de vista previa disponibles.
          </div>
        </div>
      </div>);
    }
    // Compatibilidad con el backend que envía total_rows_analyzed en lugar de total_rows
    var totalRows = validation_summary.total_rows || validation_summary.total_rows_analyzed || 0;
    var mostCommonErrors = validation_summary.most_common_errors || validation_summary.error_breakdown || {};
    var hasErrors = ((validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.rows_with_errors) || 0) > 0;
    var hasWarnings = ((validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.rows_with_warnings) || 0) > 0;
    var canSkipErrors = can_skip_errors && skip_errors_available && hasErrors;
    // const errorRows = preview_data.filter(row => row.validation_status === 'error');
    // const warningRows = preview_data.filter(row => row.validation_status === 'warning');
    // const validRows = preview_data.filter(row => row.validation_status === 'valid');
    return (<div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Vista Previa de Importación
        </h3>
        <p className="text-sm text-gray-600">
          {totalRows > 10 && (validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.total_rows_analyzed) === totalRows
            ? "\u2705 Archivo completo validado (".concat(totalRows, " filas). Revise los datos transformados y las validaciones antes de ejecutar la importaci\u00F3n.")
            : "\uD83D\uDCDD Vista previa con muestra de ".concat(Math.min(totalRows, 10), " filas. Revise los datos transformados y las validaciones antes de ejecutar la importaci\u00F3n.")}
        </p>
        {totalRows > 10 && (validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.total_rows_analyzed) !== totalRows && (<div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              💡 <strong>Recomendación:</strong> Para ver estadísticas completas de todo el archivo, use el botón "🔍 Validar archivo completo" en el paso anterior.
            </p>
          </div>)}
      </div>      {/* Resumen de validación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {totalRows}
          </div>
          <div className="text-sm text-gray-600">Total de filas</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-green-900">
            {(validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.valid_rows) || 0}
          </div>
          <div className="text-sm text-green-600">Filas válidas</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-yellow-900">
            {(validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.rows_with_warnings) || 0}
          </div>
          <div className="text-sm text-yellow-600">Con advertencias</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-red-900">
            {(validation_summary === null || validation_summary === void 0 ? void 0 : validation_summary.rows_with_errors) || 0}
          </div>
          <div className="text-sm text-red-600">Con errores</div>
        </div>
      </div>

      {/* Navegación de lotes */}
      {batch_info && (<BatchNavigation batchInfo={batch_info} onBatchChange={handleBatchChange} disabled={isLoading}/>)}

      {/* Configuración de lotes - Temporalmente deshabilitado para debug */}
      <BatchConfiguration totalRows={totalRows} onBatchSizeChange={onBatchSizeChange} defaultBatchSize={batchSize} disabled={isLoading}/>
      
      {/* Alertas de estado */}      {hasErrors && (<div className="border border-red-200 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Se encontraron errores de validación
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {validation_summary.rows_with_errors} filas tienen errores{canSkipErrors ? ' que pueden omitirse' : ' que deben corregirse antes de continuar'}.
                </p>
                <p className="mt-1 font-medium">
                  📋 Revise los errores específicos en la tabla de abajo para conocer qué necesita {canSkipErrors ? 'revisar' : 'corregir'} en cada fila.
                </p>
                {canSkipErrors && (<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-800">
                      💡 Opción disponible: Omitir errores
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Puede proceder con la importación omitiendo las filas con errores. 
                      Solo se importarán las filas válidas.
                    </p>
                  </div>)}
              </div>
            </div>
          </div>
        </div>)}

      {hasWarnings && !hasErrors && (<div className="border border-yellow-200 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Se encontraron advertencias
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {validation_summary.rows_with_warnings} filas tienen advertencias. 
                  Puede continuar con la importación, pero revise las advertencias abajo.
                </p>
              </div>
            </div>
          </div>
        </div>)}

      {!hasErrors && !hasWarnings && (<div className="border border-green-200 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Todos los datos son válidos
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Todas las filas han pasado las validaciones. Puede proceder con la importación.
                </p>
              </div>
            </div>
          </div>
        </div>)}      {/* Errores más comunes */}
      {mostCommonErrors && Object.keys(mostCommonErrors).length > 0 && (<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Errores más comunes
          </h4>
          <div className="space-y-2">
            {Object.entries(mostCommonErrors).map(function (_a) {
                var error = _a[0], count = _a[1];
                return (<div key={error} className="flex justify-between text-sm">
                <span className="text-gray-700">{error}</span>
                <span className="text-gray-500">{count} ocurrencias</span>
              </div>);
            })}
          </div>
        </div>)}      {/* Listado detallado de errores */}
      {hasErrors && (<>          {/* Si tenemos preview_data detallados, mostrar errores específicos */}
          {preview_data && preview_data.length > 0 ? (<>
              <ValidationErrorsDisplay errors={preview_data
                    .filter(function (row) { return row.validation_status === 'error' && row.errors.length > 0; })
                    .flatMap(function (row) { return row.errors.map(function (error) { return (__assign(__assign({}, error), { row_number: row.row_number })); }); })} title="Errores Específicos por Fila" showRowNumbers={true} maxHeight="max-h-80"/>
              
              {/* Sección original simplificada para contexto adicional */}
              <div className="border border-red-200 rounded-lg bg-red-50 p-4">
                <h4 className="text-lg font-medium text-red-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  Datos de Contexto para Filas con Error
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {preview_data
                    .filter(function (row) { return row.validation_status === 'error' && row.errors.length > 0; })
                    .slice(0, 5) // Mostrar solo las primeras 5 para no saturar
                    .map(function (row, index) { return (<div key={"context-".concat(row.row_number, "-").concat(index)} className="bg-white border border-red-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Fila {row.row_number}
                            </span>
                          </div>
                          <div className="ml-3 flex-1">
                            {/* Mostrar datos de la fila para contexto */}
                            <details className="mt-2">
                              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                                Ver datos originales y transformados
                              </summary>
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">Datos originales:</div>
                                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap text-gray-700">
                                    {JSON.stringify(row.original_data, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">Datos transformados:</div>
                                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap text-gray-700">
                                    {JSON.stringify(row.transformed_data, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>); })}
                </div>
              </div>
            </>) : (
            /* Si NO tenemos preview_data detallados, mostrar información basada en validation_summary */
            <div className="border border-red-200 rounded-lg bg-red-50 p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <h4 className="text-lg font-semibold text-red-800">
                  Errores de Validación Detectados
                </h4>
              </div>
              
              <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-red-700">Resumen de errores:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {validation_summary.rows_with_errors} filas con errores
                  </span>
                </div>
                
                {mostCommonErrors && Object.keys(mostCommonErrors).length > 0 && (<div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Tipos de errores encontrados:</div>
                    <div className="space-y-2">
                      {Object.entries(mostCommonErrors).map(function (_a) {
                        var errorType = _a[0], count = _a[1];
                        return (<div key={errorType} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded">
                          <span className="text-sm text-red-700 font-medium">{errorType}</span>
                          <span className="text-sm text-red-600">{count} ocurrencias</span>
                        </div>);
                    })}
                    </div>
                  </div>)}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm text-amber-700">
                    <strong>No se pueden mostrar errores específicos por fila</strong>
                    <p className="mt-1">
                      Los datos detallados de vista previa no están disponibles. 
                      Esto puede indicar un problema en el procesamiento del archivo o en el mapeo de campos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm text-blue-700">
                    <strong>Pasos para resolver:</strong>
                    <ol className="mt-2 ml-4 list-decimal space-y-1">
                      <li>Vuelva al paso anterior (Mapeo de Campos)</li>
                      <li>Revise que todos los campos obligatorios estén mapeados correctamente</li>
                      <li>Verifique que el formato de los datos en su archivo sea correcto</li>
                      <li>Si el problema persiste, intente con un archivo más pequeño para pruebas</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>)}
        </>)}

      {/* Vista previa de datos */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">          <h4 className="text-sm font-medium text-gray-900">
            Vista Previa de Datos (primeras {(preview_data === null || preview_data === void 0 ? void 0 : preview_data.length) || 0} filas)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fila
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datos Transformados
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Errores/Advertencias
                </th>              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(preview_data === null || preview_data === void 0 ? void 0 : preview_data.length) > 0 ? preview_data.slice(0, 10).map(function (row) { return (<tr key={row.row_number} className={"\n                  ".concat(row.validation_status === 'error' ? 'bg-red-50' :
                row.validation_status === 'warning' ? 'bg-yellow-50' : 'bg-white', "\n                ")}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {row.row_number}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {row.validation_status === 'valid' && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Válido
                      </span>)}
                    {row.validation_status === 'warning' && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠ Advertencia
                      </span>)}
                    {row.validation_status === 'error' && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✗ Error
                      </span>)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="max-w-xs overflow-hidden">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(row.transformed_data, null, 1)}
                      </pre>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.errors.length > 0 && (<div className="space-y-1">
                        {row.errors.map(function (error, index) { return (<div key={index} className="text-xs bg-red-100 text-red-800 p-2 rounded border border-red-200">
                            <div className="font-medium">{error.field_name}:</div>
                            <div>{error.message}</div>
                            {error.error_type && (<div className="text-red-600 mt-1">Tipo: {error.error_type}</div>)}
                          </div>); })}
                      </div>)}
                    {row.warnings.length > 0 && (<div className="space-y-1">
                        {row.warnings.map(function (warning, index) { return (<div key={index} className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded border border-yellow-200">
                            <div className="font-medium">{warning.field_name}:</div>
                            <div>{warning.message}</div>
                          </div>); })}
                      </div>)}
                    {row.errors.length === 0 && row.warnings.length === 0 && (<span className="text-xs text-gray-400">Sin problemas</span>)}
                  </td>
                </tr>); }) : (<tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hay datos de vista previa disponibles
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={isLoading}>
          Anterior
        </button>
        
        <div className="flex space-x-3">
          {canSkipErrors && (<button type="button" onClick={onNextWithSkipErrors} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-300 rounded-md hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2 inline-block"></div>
                  Omitiendo errores...
                </>) : ('Importar Omitiendo Errores')}
            </button>)}
          
          <button type="button" onClick={onNext} disabled={(hasErrors && !canSkipErrors) || isLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (<>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                Ejecutando importación...
              </>) : ('Ejecutar Importación')}
          </button>
        </div>
      </div>
    </div>);
}
