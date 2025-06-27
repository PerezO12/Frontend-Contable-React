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
import { useState, useCallback, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
var initialState = {
    currentStep: 'upload',
    columnMappings: [],
    importPolicy: 'create_only',
    skipValidationErrors: false,
    skipErrors: false,
    defaultValues: {},
    isLoading: false,
    batchSize: 2000, // Default batch size
};
export function useGenericImportWizard() {
    var _this = this;
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    var _b = useState([]), availableModels = _b[0], setAvailableModels = _b[1];
    var _c = useState(), modelMetadata = _c[0], setModelMetadata = _c[1];
    // === Carga inicial ===
    var loadAvailableModels = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var models, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    return [4 /*yield*/, GenericImportService.getAvailableModels()];
                case 1:
                    models = _a.sent();
                    setAvailableModels(models);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_1 instanceof Error ? error_1.message : 'Error cargando modelos disponibles' })); });
                    return [3 /*break*/, 4];
                case 3:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    // === Carga de configuración de importación ===
    var loadImportConfig = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var config_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    return [4 /*yield*/, GenericImportService.getImportConfig()];
                case 1:
                    config_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { importConfig: config_1, batchSize: config_1.batch_size.default, isLoading: false })); });
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_2 instanceof Error ? error_2.message : 'Error cargando configuración de importación' })); });
                    return [3 /*break*/, 4];
                case 3:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    // === Selección de modelo ===
    var selectModel = useCallback(function (modelName) { return __awaiter(_this, void 0, void 0, function () {
        var metadata, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    return [4 /*yield*/, GenericImportService.getModelMetadata(modelName)];
                case 1:
                    metadata = _a.sent();
                    setModelMetadata(metadata);
                    setState(function (prev) { return (__assign(__assign({}, prev), { selectedModel: modelName, isLoading: false })); });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_3 instanceof Error ? error_3.message : 'Error cargando metadatos del modelo' })); });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    // === Upload de archivo ===
    var uploadFile = useCallback(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var validation_1, importSession_1, initialMappings_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.selectedModel) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'Debe seleccionar un modelo primero' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    validation_1 = GenericImportService.validateFile(file);
                    if (!validation_1.isValid) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: validation_1.errors.join(', ') })); });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GenericImportService.createImportSession(state.selectedModel, file)];
                case 2:
                    importSession_1 = _a.sent();
                    initialMappings_1 = importSession_1.detected_columns.map(function (column) { return ({
                        column_name: column.name,
                        field_name: undefined,
                        default_value: undefined,
                    }); });
                    setState(function (prev) { return (__assign(__assign({}, prev), { importSession: importSession_1, columnMappings: initialMappings_1, currentStep: 'mapping', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_4 instanceof Error ? error_4.message : 'Error subiendo archivo' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.selectedModel]); // === Obtener sugerencias de mapeo ===
    var getMappingSuggestions = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        return [2 /*return*/, []];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, GenericImportService.getMappingSuggestions(state.importSession.import_session_token)];
                case 2:
                    response = _a.sent();
                    // El backend simple retorna un objeto con `suggestions` en lugar de `suggested_mappings`
                    return [2 /*return*/, response.suggestions || response.suggested_mappings || []];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error obteniendo sugerencias de mapeo:', error_5);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [state.importSession]);
    // === Actualizar mapeos ===
    var updateColumnMappings = useCallback(function (mappings) {
        setState(function (prev) { return (__assign(__assign({}, prev), { columnMappings: mappings })); });
    }, []);
    // === Actualizar configuraciones ===
    var updateImportSettings = useCallback(function (settings) {
        setState(function (prev) {
            var _a, _b, _c, _d;
            return (__assign(__assign({}, prev), { importPolicy: (_a = settings.importPolicy) !== null && _a !== void 0 ? _a : prev.importPolicy, skipValidationErrors: (_b = settings.skipValidationErrors) !== null && _b !== void 0 ? _b : prev.skipValidationErrors, skipErrors: (_c = settings.skipErrors) !== null && _c !== void 0 ? _c : prev.skipErrors, defaultValues: __assign(__assign({}, prev.defaultValues), settings.defaultValues), batchSize: (_d = settings.batchSize) !== null && _d !== void 0 ? _d : prev.batchSize }));
        });
    }, []);
    // === Generar vista previa ===
    var generatePreview = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var previewRequest, previewData_1, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'No hay sesión de importación activa' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    previewRequest = {
                        import_session_token: state.importSession.import_session_token,
                        column_mappings: state.columnMappings,
                        import_policy: state.importPolicy,
                        skip_validation_errors: state.skipValidationErrors,
                        default_values: state.defaultValues,
                    };
                    return [4 /*yield*/, GenericImportService.generatePreview(state.importSession.import_session_token, previewRequest)];
                case 2:
                    previewData_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { previewData: previewData_1, currentStep: 'preview', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_6 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_6 instanceof Error ? error_6.message : 'Error generando vista previa' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues]);
    // === Generar vista previa de lote específico ===
    var generateBatchPreview = useCallback(function (batchNumber) { return __awaiter(_this, void 0, void 0, function () {
        var previewRequest, previewData_2, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'No hay sesión de importación activa' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    previewRequest = {
                        import_session_token: state.importSession.import_session_token,
                        column_mappings: state.columnMappings,
                        import_policy: state.importPolicy,
                        skip_validation_errors: state.skipValidationErrors,
                        default_values: state.defaultValues,
                    };
                    return [4 /*yield*/, GenericImportService.generateBatchPreview(state.importSession.import_session_token, previewRequest, batchNumber, state.batchSize)];
                case 2:
                    previewData_2 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { previewData: previewData_2, isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_7 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_7 instanceof Error ? error_7.message : 'Error generando vista previa del lote' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues, state.batchSize]);
    // === Validar archivo completo ===
    var validateFullFile = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var previewRequest, validationData_1, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'No hay sesión de importación activa' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined })); });
                    previewRequest = {
                        import_session_token: state.importSession.import_session_token,
                        column_mappings: state.columnMappings,
                        import_policy: state.importPolicy,
                        skip_validation_errors: state.skipValidationErrors,
                        default_values: state.defaultValues,
                    };
                    return [4 /*yield*/, GenericImportService.validateFullFile(state.importSession.import_session_token, previewRequest)];
                case 2:
                    validationData_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { previewData: validationData_1, currentStep: 'preview', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_8 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_8 instanceof Error ? error_8.message : 'Error validando archivo completo' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues]);
    // === Ejecutar importación ===
    var executeImport = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var importResult_1, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'No hay sesión de importación activa' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined, currentStep: 'execute' })); });
                    // Debug: Log mappings before sending
                    console.log('Hook executeImport - columnMappings:', state.columnMappings);
                    return [4 /*yield*/, GenericImportService.executeImport(state.importSession.import_session_token, state.columnMappings, state.importPolicy, state.skipErrors, state.batchSize)];
                case 2:
                    importResult_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { importResult: importResult_1, currentStep: 'result', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_9 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_9 instanceof Error ? error_9.message : 'Error ejecutando importación', currentStep: 'result' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.skipErrors, state.defaultValues, state.batchSize]);
    // === Ejecutar importación omitiendo errores ===
    var executeImportWithSkipErrors = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var importResult_2, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.importSession) {
                        setState(function (prev) { return (__assign(__assign({}, prev), { error: 'No hay sesión de importación activa' })); });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: undefined, currentStep: 'execute' })); });
                    // Debug: Log mappings before sending
                    console.log('Hook executeImportWithSkipErrors - columnMappings:', state.columnMappings);
                    return [4 /*yield*/, GenericImportService.executeImport(state.importSession.import_session_token, state.columnMappings, state.importPolicy, true, // Force skip errors to true
                        state.batchSize)];
                case 2:
                    importResult_2 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { importResult: importResult_2, currentStep: 'result', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 3:
                    error_10 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: error_10 instanceof Error ? error_10.message : 'Error ejecutando importación con omisión de errores', currentStep: 'result' })); });
                    return [3 /*break*/, 5];
                case 4:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues, state.batchSize]);
    // === Navegación y utilidades ===
    var resetWizard = useCallback(function () {
        setState(initialState);
        setModelMetadata(undefined);
    }, []);
    var goToStep = useCallback(function (step) {
        setState(function (prev) { return (__assign(__assign({}, prev), { currentStep: step })); });
    }, []);
    var isStepValid = useCallback(function (step) {
        switch (step) {
            case 'upload':
                return !!state.selectedModel;
            case 'mapping':
                return !!state.importSession && state.columnMappings.some(function (m) { return m.field_name; });
            case 'preview':
                return !!state.previewData;
            case 'execute':
                return !!state.previewData && !state.previewData.validation_summary.rows_with_errors;
            case 'result':
                return !!state.importResult;
            default:
                return false;
        }
    }, [state]);
    var getStepIndex = useCallback(function (step) {
        var steps = ['upload', 'mapping', 'preview', 'execute', 'result'];
        return steps.indexOf(step);
    }, []);
    // === Efectos ===
    useEffect(function () {
        loadAvailableModels();
    }, [loadAvailableModels]);
    useEffect(function () {
        loadImportConfig();
    }, []); // Load config only once on mount
    return {
        state: state,
        availableModels: availableModels,
        modelMetadata: modelMetadata,
        // Actions
        loadAvailableModels: loadAvailableModels,
        loadImportConfig: loadImportConfig,
        selectModel: selectModel,
        uploadFile: uploadFile,
        updateColumnMappings: updateColumnMappings,
        updateImportSettings: updateImportSettings,
        generatePreview: generatePreview,
        generateBatchPreview: generateBatchPreview,
        validateFullFile: validateFullFile,
        executeImport: executeImport,
        executeImportWithSkipErrors: executeImportWithSkipErrors,
        resetWizard: resetWizard,
        goToStep: goToStep,
        // Utilities
        getMappingSuggestions: getMappingSuggestions,
        isStepValid: isStepValid,
        getStepIndex: getStepIndex,
    };
}
