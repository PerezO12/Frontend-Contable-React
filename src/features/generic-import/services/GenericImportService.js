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
import { apiClient } from '@/shared/api/client';
var BASE_URL = '/api/v1/generic-import';
var GenericImportService = /** @class */ (function () {
    function GenericImportService() {
    }
    // === Gestión de Modelos ===
    /**
   * Obtiene la lista de modelos disponibles para importación
   */
    GenericImportService.getAvailableModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 [GenericImportService] Obteniendo modelos disponibles...');
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/models"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta getAvailableModels:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtiene los metadatos de un modelo específico
     */
    GenericImportService.getModelMetadata = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Obteniendo metadatos para modelo: ".concat(modelName));
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/models/").concat(modelName, "/metadata"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta getModelMetadata:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Gestión de Sesiones de Importación ===
    /**
     * Crea una nueva sesión de importación subiendo un archivo
     */
    GenericImportService.createImportSession = function (modelName, file) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Creando sesi\u00F3n de importaci\u00F3n para modelo: ".concat(modelName, ", archivo: ").concat(file.name));
                        formData = new FormData();
                        formData.append('model_name', modelName);
                        formData.append('file', file);
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions"), formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta createImportSession:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtiene los detalles de una sesión de importación existente
     */
    GenericImportService.getImportSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/sessions/").concat(sessionId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Elimina una sesión de importación
     */
    GenericImportService.deleteImportSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.delete("".concat(BASE_URL, "/sessions/").concat(sessionId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // === Mapeo de Campos ===
    /**
     * Obtiene sugerencias automáticas de mapeo
     */
    GenericImportService.getMappingSuggestions = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Obteniendo sugerencias de mapeo para sesi\u00F3n: ".concat(sessionId));
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/sessions/").concat(sessionId, "/mapping-suggestions"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta getMappingSuggestions:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Establece el mapeo de campos para una sesión
     */
    GenericImportService.setFieldMapping = function (sessionId, mappings) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/mapping"), mappings)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Vista Previa ===
    /**
     * Genera vista previa de la importación con los mapeos actuales
     */
    GenericImportService.generatePreview = function (sessionId, previewRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Generando vista previa para sesi\u00F3n: ".concat(sessionId));
                        console.log('📋 [GenericImportService] Preview request:', JSON.stringify(previewRequest, null, 2));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/preview"), previewRequest)];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta generatePreview:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Genera vista previa de un lote específico
     */
    GenericImportService.generateBatchPreview = function (sessionId, previewRequest, batchNumber, batchSize) {
        return __awaiter(this, void 0, void 0, function () {
            var batchPreviewRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Generando vista previa del lote ".concat(batchNumber, " para sesi\u00F3n: ").concat(sessionId));
                        batchPreviewRequest = __assign(__assign({}, previewRequest), { batch_number: batchNumber, batch_size: batchSize });
                        console.log('📋 [GenericImportService] Batch preview request:', JSON.stringify(batchPreviewRequest, null, 2));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/preview"), batchPreviewRequest)];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta generateBatchPreview:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtiene información de lotes para una sesión
     */
    GenericImportService.getBatchInfo = function (sessionId, batchSize) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Obteniendo informaci\u00F3n de lotes para sesi\u00F3n: ".concat(sessionId));
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/sessions/").concat(sessionId, "/batch-info?batch_size=").concat(batchSize))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta getBatchInfo:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Valida todo el archivo completo para mostrar estadísticas completas
     */
    GenericImportService.validateFullFile = function (sessionId, previewRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Validando archivo completo para sesi\u00F3n: ".concat(sessionId));
                        console.log('📋 [GenericImportService] Validation request:', JSON.stringify(previewRequest, null, 2));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/validate-full"), previewRequest)];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Respuesta validateFullFile:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Ejecución de Importación ===
    /**
     * Ejecuta la importación con los parámetros especificados (con soporte para batch processing)
     */
    GenericImportService.executeImport = function (sessionId_1, mappings_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, mappings, importPolicy, skipErrors, batchSize) {
            var response, backendResult, frontendStatus, summary, performanceMetrics, error_summary, transformedResult;
            if (importPolicy === void 0) { importPolicy = 'create_only'; }
            if (skipErrors === void 0) { skipErrors = false; }
            if (batchSize === void 0) { batchSize = 2000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('📤 [GenericImportService] EJECUTANDO IMPORTACIÓN:');
                        console.log('  🆔 Session ID:', sessionId);
                        console.log('  📋 Mappings:', JSON.stringify(mappings, null, 2));
                        console.log('  ⚙️ Import Policy:', importPolicy);
                        console.log('  🚫 Skip Errors:', skipErrors);
                        console.log('  📦 Batch Size:', batchSize);
                        console.log('  🌐 URL:', "".concat(BASE_URL, "/sessions/").concat(sessionId, "/execute?import_policy=").concat(importPolicy, "&skip_errors=").concat(skipErrors, "&batch_size=").concat(batchSize));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/execute?import_policy=").concat(importPolicy, "&skip_errors=").concat(skipErrors, "&batch_size=").concat(batchSize), mappings // Enviar mappings directamente como array en el body
                            )];
                    case 1:
                        response = _a.sent();
                        console.log('📥 [GenericImportService] RESPUESTA DEL EXECUTE:');
                        console.log('  📊 Status:', response.status);
                        console.log('  📄 Data:', JSON.stringify(response.data, null, 2));
                        console.log('  📋 Headers:', response.headers);
                        backendResult = response.data;
                        console.log('🔍 [GenericImportService] Estructura de respuesta del backend:');
                        console.log('  📊 Summary:', JSON.stringify(backendResult.summary, null, 2));
                        console.log('  ⚡ Performance:', JSON.stringify(backendResult.performance_metrics, null, 2));
                        console.log('  📋 Quality Report:', JSON.stringify(backendResult.quality_report, null, 2));
                        frontendStatus = 'completed';
                        if (backendResult.status === 'completed' || backendResult.status === 'completed_with_errors') {
                            frontendStatus = 'completed';
                        }
                        else if (backendResult.status === 'failed') {
                            frontendStatus = 'failed';
                        }
                        summary = backendResult.summary || {};
                        performanceMetrics = backendResult.performance_metrics || {};
                        error_summary = {};
                        // Procesar errores por tipo desde summary.errors_by_type
                        if (summary.errors_by_type) {
                            Object.entries(summary.errors_by_type).forEach(function (_a) {
                                var errorType = _a[0], count = _a[1];
                                error_summary[errorType] = count;
                            });
                        }
                        // Procesar failed_records si existen
                        if (backendResult.failed_records && Array.isArray(backendResult.failed_records)) {
                            backendResult.failed_records.forEach(function (failedRecord) {
                                if (failedRecord.error && failedRecord.error.message) {
                                    var errorMessage = failedRecord.error.message;
                                    var errorType = 'Error general';
                                    if (errorMessage.includes('already exists')) {
                                        errorType = 'Registro duplicado';
                                    }
                                    else if (errorMessage.includes('Missing required')) {
                                        errorType = 'Campo requerido faltante';
                                    }
                                    else if (errorMessage.includes('Invalid')) {
                                        errorType = 'Valor inválido';
                                    }
                                    error_summary[errorType] = (error_summary[errorType] || 0) + 1;
                                }
                            });
                        }
                        transformedResult = {
                            import_id: backendResult.import_session_token || sessionId,
                            import_session_token: backendResult.import_session_token || sessionId,
                            model: backendResult.model || 'unknown',
                            status: frontendStatus,
                            total_rows: summary.total_processed || 0,
                            processed_rows: summary.total_processed || 0,
                            created_rows: summary.successful || 0,
                            updated_rows: summary.updated || 0,
                            failed_rows: summary.failed || 0,
                            skipped_rows: summary.skipped || 0,
                            skip_errors: skipErrors,
                            skipped_details: [], // No disponible en la nueva estructura
                            processing_time_seconds: performanceMetrics.total_execution_time_seconds || undefined,
                            error_summary: Object.keys(error_summary).length > 0 ? error_summary : undefined,
                            detailed_errors: undefined, // No implementado en el backend actual
                            created_entities: undefined,
                            updated_entities: undefined,
                            started_at: new Date().toISOString(), // Aproximación ya que el backend no lo devuelve
                            completed_at: new Date().toISOString()
                        };
                        console.log('🔄 [GenericImportService] RESULTADO TRANSFORMADO:', JSON.stringify(transformedResult, null, 2));
                        return [2 /*return*/, transformedResult];
                }
            });
        });
    };
    /**
     * Obtiene el estado de una importación en progreso
     */
    GenericImportService.getImportStatus = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/sessions/").concat(sessionId))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, {
                                import_id: sessionId,
                                import_session_token: sessionId,
                                model: 'unknown',
                                status: 'completed',
                                total_rows: 0,
                                processed_rows: 0,
                                created_rows: 0,
                                updated_rows: 0,
                                failed_rows: 0,
                                skipped_rows: 0,
                                skip_errors: false,
                                processing_time_seconds: 0,
                                error_summary: {},
                                detailed_errors: [],
                                created_entities: [],
                                updated_entities: [],
                                started_at: new Date().toISOString(),
                                completed_at: new Date().toISOString()
                            }];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, {
                                import_id: sessionId,
                                import_session_token: sessionId,
                                model: 'unknown',
                                status: 'failed',
                                total_rows: 0,
                                processed_rows: 0,
                                created_rows: 0,
                                updated_rows: 0,
                                failed_rows: 0,
                                skipped_rows: 0,
                                skip_errors: false,
                                processing_time_seconds: 0,
                                error_summary: {},
                                detailed_errors: [],
                                created_entities: [],
                                updated_entities: [], started_at: new Date().toISOString(),
                                completed_at: new Date().toISOString()
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancela una importación en progreso
     */
    GenericImportService.cancelImport = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // El backend simple no soporta cancelación
                    return [4 /*yield*/, apiClient.delete("".concat(BASE_URL, "/sessions/").concat(sessionId))];
                    case 1:
                        // El backend simple no soporta cancelación
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // === Gestión de Plantillas ===
    /**
     * Obtiene las plantillas disponibles para un modelo
     */
    GenericImportService.getTemplates = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/templates"), {
                            params: modelName ? { model_name: modelName } : {}
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Guarda una nueva plantilla de importación
     */
    GenericImportService.saveTemplate = function (templateRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/templates"), templateRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Actualiza una plantilla existente
     */
    GenericImportService.updateTemplate = function (templateId, templateRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(BASE_URL, "/templates/").concat(templateId), templateRequest)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Elimina una plantilla
     */
    GenericImportService.deleteTemplate = function (templateId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.delete("".concat(BASE_URL, "/templates/").concat(templateId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Aplica una plantilla a una sesión de importación
     */
    GenericImportService.applyTemplate = function (sessionId, templateId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/apply-template/").concat(templateId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Descarga la plantilla CSV para un modelo específico
     */
    GenericImportService.downloadTemplate = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, blob, url, link, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Descargando plantilla para modelo: ".concat(modelName));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("/api/v1/import/models/".concat(modelName, "/template"), {
                                responseType: 'blob',
                            })];
                    case 2:
                        response = _a.sent();
                        blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
                        url = window.URL.createObjectURL(blob);
                        link = document.createElement('a');
                        link.href = url;
                        link.download = "".concat(modelName, "_plantilla_importacion.csv");
                        // Ejecutar descarga
                        document.body.appendChild(link);
                        link.click();
                        // Limpiar
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        console.log("\u2705 [GenericImportService] Plantilla descargada exitosamente: ".concat(modelName, "_plantilla_importacion.csv"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("\u274C [GenericImportService] Error descargando plantilla para ".concat(modelName, ":"), error_1);
                        throw new Error("Error al descargar la plantilla: ".concat(error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica si una plantilla está disponible para un modelo
     */
    GenericImportService.isTemplateAvailable = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.head("/api/v1/import/models/".concat(modelName, "/template"))];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.status === 200];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Descarga ejemplos prácticos para un modelo específico
     */
    GenericImportService.downloadExamples = function (modelName_1) {
        return __awaiter(this, arguments, void 0, function (modelName, exampleType) {
            var response, blob, url, link, error_2;
            if (exampleType === void 0) { exampleType = 'complete'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Descargando ejemplos para modelo: ".concat(modelName, ", tipo: ").concat(exampleType));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("/api/v1/import/models/".concat(modelName, "/examples"), {
                                params: { example_type: exampleType },
                                responseType: 'blob',
                            })];
                    case 2:
                        response = _a.sent();
                        blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
                        url = window.URL.createObjectURL(blob);
                        link = document.createElement('a');
                        link.href = url;
                        link.download = "".concat(modelName, "_ejemplos_").concat(exampleType, ".csv");
                        // Ejecutar descarga
                        document.body.appendChild(link);
                        link.click();
                        // Limpiar
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        console.log("\u2705 [GenericImportService] Ejemplos descargados exitosamente: ".concat(modelName, "_ejemplos_").concat(exampleType, ".csv"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("\u274C [GenericImportService] Error descargando ejemplos para ".concat(modelName, ":"), error_2);
                        throw new Error("Error al descargar ejemplos: ".concat(error_2 instanceof Error ? error_2.message : 'Error desconocido'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene información sobre los ejemplos disponibles para un modelo
     */
    GenericImportService.getExamplesInfo = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Obteniendo informaci\u00F3n de ejemplos para modelo: ".concat(modelName));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("/api/v1/import/models/".concat(modelName, "/examples/info"))];
                    case 2:
                        response = _a.sent();
                        console.log("\u2705 [GenericImportService] Informaci\u00F3n de ejemplos obtenida para: ".concat(modelName));
                        return [2 /*return*/, response.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error("\u274C [GenericImportService] Error obteniendo informaci\u00F3n de ejemplos para ".concat(modelName, ":"), error_3);
                        throw new Error("Error al obtener informaci\u00F3n de ejemplos: ".concat(error_3 instanceof Error ? error_3.message : 'Error desconocido'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica si hay ejemplos disponibles para un modelo específico
     */
    GenericImportService.areExamplesAvailable = function (modelName_1) {
        return __awaiter(this, arguments, void 0, function (modelName, exampleType) {
            var response, _a;
            if (exampleType === void 0) { exampleType = 'complete'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.head("/api/v1/import/models/".concat(modelName, "/examples"), {
                                params: { example_type: exampleType }
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.status === 200];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === Utilidades ===
    /**
     * Valida un archivo antes de subirlo
     */
    GenericImportService.validateFile = function (file) {
        var errors = [];
        var maxSize = 10 * 1024 * 1024; // 10MB
        var allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/json',
        ];
        if (!file) {
            errors.push('Debe seleccionar un archivo');
            return { isValid: false, errors: errors };
        }
        if (file.size > maxSize) {
            errors.push('El archivo no puede superar los 10MB');
        }
        if (!allowedTypes.includes(file.type) && !this.isValidFileExtension(file.name)) {
            errors.push('Formato de archivo no soportado. Use CSV, XLSX o JSON');
        }
        return { isValid: errors.length === 0, errors: errors };
    };
    GenericImportService.isValidFileExtension = function (filename) {
        var validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
        var extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return validExtensions.includes(extension);
    };
    /**
     * Formatea el tamaño de archivo para mostrar
     */
    GenericImportService.formatFileSize = function (bytes) {
        if (bytes === 0)
            return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    /**
     * Detecta el tipo de archivo por extensión
     */
    GenericImportService.detectFileFormat = function (filename) {
        var extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        switch (extension) {
            case '.csv':
                return 'csv';
            case '.xlsx':
            case '.xls':
                return 'xlsx';
            case '.json':
                return 'json';
            default:
                return 'unknown';
        }
    };
    // === Configuración de Batch Processing ===
    /**
     * Obtiene la configuración predeterminada para importaciones
     */
    GenericImportService.getImportConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 [GenericImportService] Obteniendo configuración de importación...');
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/config"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Configuración obtenida:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Ejecución con Batch Processing ===
    /**
     * Ejecuta importación con parámetros individuales usando la nueva API de batch processing
     */
    GenericImportService.executeImportWithBatchProcessing = function (sessionId, request) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D [GenericImportService] Ejecutando importaci\u00F3n por lotes para sesi\u00F3n: ".concat(sessionId));
                        console.log('📋 [GenericImportService] Configuración de ejecución:', JSON.stringify(request, null, 2));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/execute"), null, {
                                params: {
                                    import_policy: request.import_policy,
                                    skip_errors: request.skip_errors,
                                    batch_size: request.batch_size
                                },
                                data: request.mappings
                            })];
                    case 1:
                        response = _a.sent();
                        console.log('✅ [GenericImportService] Resultado de importación:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Utilidades para Batch Processing ===
    /**
     * Calcula el número estimado de lotes basado en filas totales y tamaño de lote
     */
    GenericImportService.calculateEstimatedBatches = function (totalRows, batchSize) {
        return Math.ceil(totalRows / batchSize);
    };
    /**
     * Estima el tiempo de procesamiento basado en filas y un factor de rendimiento
     */
    GenericImportService.estimateProcessingTime = function (totalRows, batchSize) {
        var estimatedBatches = this.calculateEstimatedBatches(totalRows, batchSize);
        // Estimación conservadora: 50-100 filas por segundo
        var rowsPerSecond = 75;
        var estimatedSeconds = totalRows / rowsPerSecond;
        var estimatedMinutes = Math.ceil(estimatedSeconds / 60);
        // Recomendar tamaño de lote basado en el tamaño del archivo
        var recommendedBatchSize = batchSize;
        if (totalRows < 1000) {
            recommendedBatchSize = Math.min(1000, totalRows);
        }
        else if (totalRows < 10000) {
            recommendedBatchSize = 2000;
        }
        else if (totalRows < 50000) {
            recommendedBatchSize = 5000;
        }
        else {
            recommendedBatchSize = 10000;
        }
        return {
            estimatedMinutes: estimatedMinutes,
            estimatedBatches: estimatedBatches,
            recommendedBatchSize: recommendedBatchSize
        };
    };
    /**
     * Valida la configuración de batch processing
     */
    GenericImportService.validateBatchConfig = function (batchSize, totalRows, config) {
        var warnings = [];
        var recommendations = [];
        // Validar límites
        var isValid = batchSize >= config.batch_size.min && batchSize <= config.batch_size.max;
        if (batchSize < config.batch_size.min) {
            warnings.push("El tama\u00F1o de lote ".concat(batchSize, " es menor al m\u00EDnimo recomendado (").concat(config.batch_size.min, ")"));
        }
        if (batchSize > config.batch_size.max) {
            warnings.push("El tama\u00F1o de lote ".concat(batchSize, " excede el m\u00E1ximo permitido (").concat(config.batch_size.max, ")"));
        }
        // Recomendaciones basadas en el tamaño del archivo
        if (totalRows > 0) {
            var estimation = this.estimateProcessingTime(totalRows, batchSize);
            if (batchSize !== estimation.recommendedBatchSize) {
                recommendations.push("Para ".concat(totalRows, " filas, se recomienda un tama\u00F1o de lote de ").concat(estimation.recommendedBatchSize, " ") +
                    "(estimado: ".concat(estimation.estimatedMinutes, " minutos en ").concat(estimation.estimatedBatches, " lotes)"));
            }
            if (estimation.estimatedMinutes > 30) {
                recommendations.push('Procesamiento largo estimado. Considere procesar el archivo en modo background o dividirlo en archivos más pequeños.');
            }
        }
        return {
            isValid: isValid,
            warnings: warnings,
            recommendations: recommendations
        };
    };
    return GenericImportService;
}());
export { GenericImportService };
