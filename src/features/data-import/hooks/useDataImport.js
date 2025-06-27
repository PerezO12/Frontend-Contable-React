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
import { useState, useCallback } from 'react';
import { DataImportService } from '../services';
import { useToast } from '@/shared/hooks';
var initialState = {
    isLoading: false,
    previewData: null,
    importResult: null,
    importStatus: null,
    errors: [],
    configuration: null,
};
export function useDataImport() {
    var _this = this;
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    var _b = useToast(), success = _b.success, error = _b.error, warning = _b.warning;
    /**
     * Resetea el estado del hook
     */
    var resetState = useCallback(function () {
        setState(initialState);
    }, []);
    /**
     * Actualiza la configuración
     */
    var updateConfiguration = useCallback(function (config) {
        setState(function (prev) { return (__assign(__assign({}, prev), { configuration: prev.configuration ? __assign(__assign({}, prev.configuration), config) : null })); });
    }, []);
    /**
     * Carga y previsualiza un archivo
     */ var uploadAndPreview = useCallback(function (uploadData) { return __awaiter(_this, void 0, void 0, function () {
        var previewData_1, defaultConfig_1, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, errors: [] })); });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, DataImportService.uploadAndPreview(uploadData)];
                case 2:
                    previewData_1 = _b.sent();
                    console.log('Hook received preview data:', previewData_1);
                    console.log('Hook preview data validation errors:', previewData_1.validation_errors);
                    console.log('Hook preview data total rows:', previewData_1.total_rows);
                    defaultConfig_1 = DataImportService.getDefaultConfiguration(uploadData.data_type);
                    console.log('Hook default config:', defaultConfig_1);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false, previewData: previewData_1, configuration: __assign(__assign({}, defaultConfig_1), uploadData), errors: previewData_1.validation_errors || [] })); });
                    console.log('Hook state updated with preview data');
                    if (((_a = previewData_1.validation_errors) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        warning('Errores de validación encontrados', "Se encontraron ".concat(previewData_1.validation_errors.length, " errores de validaci\u00F3n"));
                    }
                    else {
                        success('Archivo validado', 'Archivo cargado y validado correctamente');
                    }
                    return [2 /*return*/, previewData_1];
                case 3:
                    err_1 = _b.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    error('Error al cargar archivo', 'No se pudo cargar el archivo');
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [success, error, warning]);
    /**
     * Importa datos desde un archivo
     */
    var importFromFile = useCallback(function (file, configuration) { return __awaiter(_this, void 0, void 0, function () {
        var result_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎣 === HOOK: INICIANDO IMPORTACIÓN ===');
                    console.log('📁 Archivo en hook:', {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                    console.log('⚙️ Configuración en hook:', JSON.stringify(configuration, null, 2));
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, errors: [] })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('🚀 Hook: Llamando a DataImportService.importFromFile...');
                    return [4 /*yield*/, DataImportService.importFromFile(file, configuration)];
                case 2:
                    result_1 = _a.sent();
                    console.log('✅ Hook: Resultado recibido del servicio:', result_1);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false, importResult: result_1, errors: result_1.global_errors || [] })); });
                    if (result_1.status === 'completed') {
                        success('Importación completada', "".concat(result_1.summary.successful_rows, " filas procesadas correctamente"));
                    }
                    else if (result_1.status === 'partial') {
                        warning('Importación parcial', "".concat(result_1.summary.successful_rows, " exitosas, ").concat(result_1.summary.error_rows, " con errores"));
                    }
                    else {
                        error('Importación fallida', 'La importación no pudo completarse');
                    }
                    console.log('✅ Hook: Estado actualizado, retornando resultado');
                    return [2 /*return*/, result_1];
                case 3:
                    err_2 = _a.sent();
                    console.error('❌ Hook: Error durante importación:', err_2);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    error('Error durante importación', 'Error durante la importación');
                    throw err_2;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [success, error, warning]);
    /**
     * Convierte ImportResult a ImportStatus para compatibilidad
     */
    var convertToImportStatus = useCallback(function (result) {
        return {
            import_id: result.import_id,
            status: result.status,
            progress: result.summary.total_rows > 0 ?
                (result.summary.processed_rows / result.summary.total_rows) * 100 : 0,
            current_batch: 1,
            total_batches: 1,
            processed_rows: result.summary.processed_rows,
            total_rows: result.summary.total_rows,
            errors: result.summary.errors || result.summary.error_rows || 0,
            warnings: result.summary.warnings || result.summary.warning_rows || 0,
            started_at: result.started_at,
            updated_at: result.completed_at || result.started_at
        };
    }, []);
    /**
     * Obtiene el estado de una importación en progreso
     */
    var getImportStatus = useCallback(function (importId) { return __awaiter(_this, void 0, void 0, function () {
        var result, status_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataImportService.getImportStatus(importId)];
                case 1:
                    result = _a.sent();
                    status_1 = convertToImportStatus(result);
                    setState(function (prev) { return (__assign(__assign({}, prev), { importStatus: status_1 })); });
                    return [2 /*return*/, status_1];
                case 2:
                    err_3 = _a.sent();
                    error('Error de estado', 'Error al obtener el estado de la importación');
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [error, convertToImportStatus]);
    /**
     * Cancela una importación en progreso
     */
    var cancelImport = useCallback(function (importId) { return __awaiter(_this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataImportService.cancelImport(importId)];
                case 1:
                    _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { importStatus: prev.importStatus ? __assign(__assign({}, prev.importStatus), { status: 'cancelled' }) : null })); });
                    success('Importación cancelada', 'La importación fue cancelada');
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    error('Error al cancelar', 'Error al cancelar la importación');
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [success, error]);
    /**
     * Valida un archivo antes de importar
     */
    var validateFile = useCallback(function (file, dataType) { return __awaiter(_this, void 0, void 0, function () {
        var validation, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, DataImportService.validateFile(file, dataType)];
                case 2:
                    validation = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    if (!validation.is_valid) {
                        error('Archivo inválido', "Archivo inv\u00E1lido: ".concat(validation.errors.join(', ')));
                    }
                    return [2 /*return*/, validation];
                case 3:
                    err_5 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    error('Error de validación', 'Error al validar el archivo');
                    throw err_5;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [error]);
    return __assign(__assign({}, state), { 
        // Acciones
        resetState: resetState, updateConfiguration: updateConfiguration, uploadAndPreview: uploadAndPreview, importFromFile: importFromFile, getImportStatus: getImportStatus, cancelImport: cancelImport, validateFile: validateFile, 
        // Helpers
        hasErrors: state.errors.some(function (e) { return e.severity === 'error'; }), hasWarnings: state.errors.some(function (e) { return e.severity === 'warning'; }), canImport: state.previewData && !state.errors.some(function (e) { return e.severity === 'error'; }) });
}
