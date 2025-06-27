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
import React, { useState, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
export var BatchConfiguration = function (_a) {
    var totalRows = _a.totalRows, onBatchSizeChange = _a.onBatchSizeChange, _b = _a.defaultBatchSize, defaultBatchSize = _b === void 0 ? 2000 : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    var _d = useState(defaultBatchSize), batchSize = _d[0], setBatchSize = _d[1];
    var _e = useState(null), config = _e[0], setConfig = _e[1];
    var _f = useState(true), isLoading = _f[0], setIsLoading = _f[1];
    var _g = useState(null), estimation = _g[0], setEstimation = _g[1];
    var _h = useState(null), validation = _h[0], setValidation = _h[1];
    // Cargar configuración al montar el componente
    useEffect(function () {
        var loadConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
            var importConfig, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        return [4 /*yield*/, GenericImportService.getImportConfig()];
                    case 1:
                        importConfig = _a.sent();
                        setConfig(importConfig);
                        // Si no hay un tamaño de lote específico, usar el predeterminado de la configuración
                        if (defaultBatchSize === 2000) {
                            setBatchSize(importConfig.batch_size.default);
                            onBatchSizeChange(importConfig.batch_size.default);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error loading import config:', error_1);
                        // Usar valores predeterminados si falla la carga
                        setConfig({
                            batch_size: { default: 2000, min: 1, max: 10000, description: 'Number of rows to process per batch' },
                            preview_rows: { default: 10, min: 5, max: 50, description: 'Number of rows to show in preview' },
                            supported_formats: ['csv', 'xlsx', 'xls'],
                            max_file_size_mb: 100,
                            session_timeout_hours: 2
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadConfig();
    }, []); // Only run once on mount
    // Update batch size when defaultBatchSize prop changes
    useEffect(function () {
        if (defaultBatchSize && defaultBatchSize !== batchSize) {
            setBatchSize(defaultBatchSize);
            onBatchSizeChange(defaultBatchSize);
        }
    }, [defaultBatchSize]); // Only depend on defaultBatchSize
    // Actualizar estimaciones cuando cambie el tamaño de lote o filas totales
    useEffect(function () {
        if (totalRows > 0) {
            var newEstimation = GenericImportService.estimateProcessingTime(totalRows, batchSize);
            setEstimation(newEstimation);
            if (config) {
                var newValidation = GenericImportService.validateBatchConfig(batchSize, totalRows, config);
                setValidation(newValidation);
            }
        }
    }, [batchSize, totalRows, config]);
    var handleBatchSizeChange = function (newBatchSize) {
        setBatchSize(newBatchSize);
        onBatchSizeChange(newBatchSize);
    };
    var useRecommendedSize = function () {
        if (estimation) {
            handleBatchSizeChange(estimation.recommendedBatchSize);
        }
    };
    if (isLoading) {
        return (<div className="bg-gray-50 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>);
    }
    return (<div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div>
        <label htmlFor="batch-size" className="block text-sm font-medium text-gray-700 mb-2">
          Tamaño de Lote (Batch Size)
        </label>
        <div className="flex items-center space-x-4">
          <input id="batch-size" type="number" min={(config === null || config === void 0 ? void 0 : config.batch_size.min) || 1} max={(config === null || config === void 0 ? void 0 : config.batch_size.max) || 10000} value={batchSize} onChange={function (e) { return handleBatchSizeChange(parseInt(e.target.value) || (config === null || config === void 0 ? void 0 : config.batch_size.default) || 2000); }} disabled={disabled} className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"/>
          <div className="text-sm text-gray-600">
            filas por lote
            {config && (<div className="text-xs text-gray-500">
                (rango: {config.batch_size.min} - {config.batch_size.max})
              </div>)}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {(config === null || config === void 0 ? void 0 : config.batch_size.description) || 'Número de filas a procesar en cada lote'}
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
          {estimation && (<>
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
                {estimation.recommendedBatchSize !== batchSize && (<button onClick={useRecommendedSize} disabled={disabled} className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline disabled:text-gray-400 disabled:no-underline">
                    Usar
                  </button>)}
              </div>
            </>)}
        </div>
      </div>

      {/* Validaciones y advertencias */}
      {validation && (<div className="space-y-2">
          {validation.warnings.length > 0 && (<div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h5 className="text-sm font-medium text-yellow-800 mb-1">Advertencias</h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                {validation.warnings.map(function (warning, index) { return (<li key={index}>• {warning}</li>); })}
              </ul>
            </div>)}
          
          {validation.recommendations.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h5 className="text-sm font-medium text-blue-800 mb-1">Recomendaciones</h5>
              <ul className="text-xs text-blue-700 space-y-1">
                {validation.recommendations.map(function (recommendation, index) { return (<li key={index}>• {recommendation}</li>); })}
              </ul>
            </div>)}
        </div>)}

      {/* Explicación del procesamiento por lotes */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">¿Qué es el procesamiento por lotes?</h4>
        <p className="text-xs text-blue-700">
          El archivo se procesa en fragmentos (lotes) para optimizar el rendimiento y evitar problemas de memoria. 
          Un lote más grande procesará más rápido pero usará más memoria, mientras que un lote más pequeño será más lento pero más seguro.
        </p>
      </div>
    </div>);
};
export default BatchConfiguration;
