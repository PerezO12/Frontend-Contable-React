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
var DataImportService = /** @class */ (function () {
    function DataImportService() {
    }
    // === Gestión de Modelos ===
    /**
   * Obtiene la lista de modelos disponibles para importación
   */
    DataImportService.getAvailableModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 Obteniendo modelos disponibles...');
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/models"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ Respuesta getAvailableModels:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtiene los metadatos de un modelo específico
     */
    DataImportService.getModelMetadata = function (modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/models/").concat(modelName, "/metadata"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Gestión de Sesiones de Importación ===
    /**
     * Crea una nueva sesión de importación subiendo un archivo
     */
    DataImportService.createImportSession = function (modelName, file) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Creando sesi\u00F3n de importaci\u00F3n para modelo: ".concat(modelName, ", archivo: ").concat(file.name));
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
                        console.log('✅ Respuesta createImportSession:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtiene los detalles de una sesión de importación existente
     */
    DataImportService.getImportSession = function (sessionId) {
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
    DataImportService.deleteImportSession = function (sessionId) {
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
    DataImportService.getMappingSuggestions = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Obteniendo sugerencias de mapeo para sesi\u00F3n: ".concat(sessionId));
                        return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/sessions/").concat(sessionId, "/mapping-suggestions"))];
                    case 1:
                        response = _a.sent();
                        console.log('✅ Respuesta getMappingSuggestions:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Establece el mapeo de campos para una sesión
     */
    DataImportService.setFieldMapping = function (sessionId, mappings) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Estableciendo mapeo de campos para sesi\u00F3n: ".concat(sessionId));
                        console.log('📋 Mappings enviados:', JSON.stringify(mappings, null, 2));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/mapping"), mappings)];
                    case 1:
                        response = _a.sent();
                        console.log('✅ Respuesta setFieldMapping:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Vista Previa ===
    /**
     * Genera vista previa de la importación con los mapeos actuales
     */
    DataImportService.generatePreview = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD0D Generando vista previa para sesi\u00F3n: ".concat(sessionId));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/preview"), {})];
                    case 1:
                        response = _a.sent();
                        console.log('✅ Respuesta generatePreview:', JSON.stringify(response.data, null, 2));
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Ejecución de Importación ===
    /**
   * Ejecuta la importación con los parámetros especificados
   */
    DataImportService.executeImport = function (sessionId_1, mappings_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, mappings, importPolicy) {
            var response;
            if (importPolicy === void 0) { importPolicy = 'create_only'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('📤 EJECUTANDO IMPORTACIÓN:');
                        console.log('  🆔 Session ID:', sessionId);
                        console.log('  📋 Mappings:', mappings);
                        console.log('  ⚙️ Import Policy:', importPolicy);
                        console.log('  🌐 URL:', "".concat(BASE_URL, "/sessions/").concat(sessionId, "/execute?import_policy=").concat(importPolicy));
                        return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/sessions/").concat(sessionId, "/execute?import_policy=").concat(importPolicy), mappings)];
                    case 1:
                        response = _a.sent();
                        console.log('📥 RESPUESTA DEL EXECUTE:');
                        console.log('  📊 Status:', response.status);
                        console.log('  📄 Data:', response.data);
                        console.log('  📋 Headers:', response.headers);
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // === Métodos de Compatibilidad (adaptadores para el sistema anterior) ===
    /**
     * Cargar archivo y obtener previsualización (adaptador)
     * Convierte el flujo anterior al nuevo sistema genérico
     */
    DataImportService.uploadAndPreview = function (uploadData) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, session, mappingSuggestions, preview, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🚀 === UPLOAD AND PREVIEW CON SISTEMA GENÉRICO ===');
                        console.log('📁 Archivo:', uploadData.file.name);
                        console.log('📊 Data type:', uploadData.data_type);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        modelName = this.mapDataTypeToModel(uploadData.data_type);
                        console.log('🔄 Modelo mapeado:', modelName);
                        return [4 /*yield*/, this.createImportSession(modelName, uploadData.file)];
                    case 2:
                        session = _a.sent();
                        console.log('✅ Sesión creada:', session.import_session_token);
                        return [4 /*yield*/, this.getMappingSuggestions(session.import_session_token)];
                    case 3:
                        mappingSuggestions = _a.sent();
                        console.log('🎯 Sugerencias de mapeo obtenidas');
                        return [4 /*yield*/, this.generatePreview(session.import_session_token)];
                    case 4:
                        preview = _a.sent();
                        console.log('👀 Vista previa generada');
                        // Convertir respuesta del sistema genérico al formato anterior
                        return [2 /*return*/, this.convertToLegacyPreviewFormat(preview, session, mappingSuggestions)];
                    case 5:
                        error_1 = _a.sent();
                        console.log('❌ Error en uploadAndPreview:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Importar desde archivo cargado (adaptador)
     */
    DataImportService.importFromFile = function (file, configuration) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, session, mappingSuggestions, mappings, importPolicy, result, convertedResult, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('🚀 === IMPORTACIÓN CON SISTEMA GENÉRICO ===');
                        console.log('📁 Archivo:', file.name);
                        console.log('⚙️ Configuración:', configuration.data_type);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        modelName = this.mapDataTypeToModel(configuration.data_type);
                        console.log('🔄 Modelo mapeado:', modelName);
                        return [4 /*yield*/, this.createImportSession(modelName, file)];
                    case 2:
                        session = _c.sent();
                        console.log('✅ Sesión creada:', session.import_session_token);
                        console.log('📄 Datos de sesión completos:', JSON.stringify(session, null, 2));
                        return [4 /*yield*/, this.getMappingSuggestions(session.import_session_token)];
                    case 3:
                        mappingSuggestions = _c.sent();
                        console.log('🎯 Sugerencias de mapeo obtenidas');
                        console.log('📄 Sugerencias completas:', JSON.stringify(mappingSuggestions, null, 2));
                        mappings = this.convertConfigurationToMappings(mappingSuggestions);
                        console.log('🔧 Mappings convertidos:', mappings.length, 'mapeos');
                        console.log('📄 Mappings detallados:', JSON.stringify(mappings, null, 2));
                        importPolicy = configuration.update_existing ? 'upsert' : 'create_only';
                        console.log('🚀 Ejecutando importación con política:', importPolicy);
                        return [4 /*yield*/, this.executeImport(session.import_session_token, mappings, importPolicy)];
                    case 4:
                        result = _c.sent();
                        console.log('✅ Importación ejecutada - Resultado RAW del backend:');
                        console.log('📄 Resultado completo:', JSON.stringify(result, null, 2));
                        convertedResult = this.convertToLegacyImportResult(result, configuration);
                        console.log('🔄 Resultado convertido para frontend:');
                        console.log('📄 Resultado final:', JSON.stringify(convertedResult, null, 2));
                        return [2 /*return*/, convertedResult];
                    case 5:
                        error_2 = _c.sent();
                        console.log('❌ Error en importFromFile:', error_2);
                        console.log('📄 Error response:', (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                        console.log('📄 Error status:', (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.status);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // === Métodos de Mapeo y Conversión ===
    /**
     * Mapea data_type del sistema anterior a model_name del sistema genérico
     */
    DataImportService.mapDataTypeToModel = function (dataType) {
        var mapping = {
            'accounts': 'account',
            'journal_entries': 'journal_entry'
        };
        return mapping[dataType] || dataType;
    };
    /**
     * Convierte configuración del sistema anterior a mappings del sistema genérico
     */
    DataImportService.convertConfigurationToMappings = function (mappingSuggestions) {
        // Usar las sugerencias automáticas como base
        var suggestions = mappingSuggestions.suggested_mappings || [];
        // Convertir sugerencias a mappings válidos
        return suggestions
            .filter(function (suggestion) { return suggestion.suggested_field && suggestion.suggested_field.trim() !== ''; })
            .map(function (suggestion) { return ({
            column_name: suggestion.column_name,
            field_name: suggestion.suggested_field,
            default_value: undefined
        }); });
    };
    /**
     * Convierte respuesta del sistema genérico al formato anterior para compatibilidad
     */
    DataImportService.convertToLegacyPreviewFormat = function (preview, session, mappingSuggestions) {
        var _a, _b;
        console.log('🔄 === CONVERTIR A FORMATO LEGACY ===');
        console.log('  📊 Preview recibido:', JSON.stringify(preview, null, 2));
        console.log('  🔗 Session recibida:', JSON.stringify(session, null, 2));
        console.log('  🎯 Mapping suggestions:', JSON.stringify(mappingSuggestions, null, 2));
        var convertedData = {
            detected_format: 'csv',
            detected_data_type: 'accounts', // Por simplicidad
            total_rows: ((_a = preview.validation_summary) === null || _a === void 0 ? void 0 : _a.total_rows) || ((_b = session.sample_rows) === null || _b === void 0 ? void 0 : _b.length) || 0,
            preview_data: session.sample_rows || [],
            column_mapping: this.createColumnMapping(mappingSuggestions),
            validation_errors: [],
            recommendations: []
        };
        console.log('  ✅ Resultado convertido:', JSON.stringify(convertedData, null, 2));
        return convertedData;
    };
    /**
     * Convierte resultado del sistema genérico al formato anterior
     */ DataImportService.convertToLegacyImportResult = function (result, configuration) {
        console.log('🔄 === CONVIRTIENDO RESULTADO BACKEND A LEGACY ===');
        console.log('� Resultado RAW del backend:', JSON.stringify(result, null, 2));
        var now = new Date().toISOString();
        // Extraer valores del resultado del backend genérico
        var totalRows = (result === null || result === void 0 ? void 0 : result.total_rows) || 0;
        var successfulRows = (result === null || result === void 0 ? void 0 : result.successful_rows) || 0;
        var errorRows = (result === null || result === void 0 ? void 0 : result.error_rows) || 0;
        var processingTime = (result === null || result === void 0 ? void 0 : result.processing_time_seconds) || 0;
        var errors = (result === null || result === void 0 ? void 0 : result.errors) || [];
        var status = (result === null || result === void 0 ? void 0 : result.status) || (errorRows > 0 ? 'completed_with_errors' : 'completed');
        // Para el sistema legacy, asumimos que todos los successful_rows son accounts_created
        // (ya que no tenemos distinción entre created/updated en el backend genérico)
        var accountsCreated = successfulRows;
        var accountsUpdated = 0; // El backend no distingue entre creados/actualizados
        var convertedResult = {
            import_id: (result === null || result === void 0 ? void 0 : result.session_id) || 'unknown',
            configuration: configuration,
            summary: {
                total_rows: totalRows,
                processed_rows: totalRows,
                successful_rows: successfulRows,
                error_rows: errorRows,
                warning_rows: 0,
                skipped_rows: 0,
                processing_time_seconds: processingTime,
                accounts_created: accountsCreated,
                accounts_updated: accountsUpdated,
                journal_entries_created: 0,
                most_common_errors: {},
                failed_rows: errorRows,
                errors: errorRows,
                warnings: 0
            },
            row_results: [],
            global_errors: errors,
            started_at: now,
            completed_at: now,
            status: (status === 'completed_with_errors' ? 'completed' : 'completed'),
            errors: errors,
            warnings: [],
            processing_time: processingTime,
            created_at: now
        };
        console.log('📤 Resultado convertido para frontend legacy:', JSON.stringify(convertedResult, null, 2));
        return convertedResult;
    };
    /**
     * Crea mapeo de columnas a partir de sugerencias
     */
    DataImportService.createColumnMapping = function (mappingSuggestions) {
        console.log('🔗 === CREAR COLUMN MAPPING ===');
        console.log('  📥 Mapping suggestions:', JSON.stringify(mappingSuggestions, null, 2));
        var mapping = {};
        if (mappingSuggestions.suggested_mappings) {
            mappingSuggestions.suggested_mappings.forEach(function (suggestion) {
                if (suggestion.suggested_field) {
                    mapping[suggestion.column_name] = suggestion.suggested_field;
                    console.log("  \u2705 Mapped: ".concat(suggestion.column_name, " -> ").concat(suggestion.suggested_field));
                }
            });
        }
        console.log('  📄 Final mapping:', JSON.stringify(mapping, null, 2));
        return mapping;
    };
    // === Métodos heredados del sistema anterior (simplificados o deprecados) ===
    /**
     * @deprecated Usar uploadAndPreview en su lugar
     */
    DataImportService.previewImport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Método deprecado. Usar uploadAndPreview con File en lugar de base64.');
            });
        });
    };
    /**
     * @deprecated Usar importFromFile en su lugar
     */
    DataImportService.importData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Método deprecado. Usar importFromFile con File en lugar de base64.');
            });
        });
    };
    /**
     * @deprecated Usar importFromFile en su lugar
     */
    DataImportService.importFromFileBase64 = function (file, configuration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.importFromFile(file, configuration)];
            });
        });
    };
    /**
     * Obtener estado de importación
     */
    DataImportService.getImportStatus = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var now, defaultConfig;
            return __generator(this, function (_a) {
                now = new Date().toISOString();
                defaultConfig = this.getDefaultConfiguration('accounts');
                return [2 /*return*/, {
                        import_id: sessionId,
                        configuration: defaultConfig,
                        summary: {
                            total_rows: 0,
                            processed_rows: 0,
                            successful_rows: 0,
                            error_rows: 0,
                            warning_rows: 0,
                            skipped_rows: 0,
                            processing_time_seconds: 0,
                            accounts_created: 0,
                            accounts_updated: 0,
                            journal_entries_created: 0,
                            most_common_errors: {},
                            failed_rows: 0,
                            errors: 0,
                            warnings: 0
                        },
                        row_results: [],
                        global_errors: [],
                        started_at: now,
                        completed_at: now,
                        status: 'completed',
                        errors: [],
                        warnings: [],
                        processing_time: 0,
                        created_at: now
                    }];
            });
        });
    };
    /**
     * Cancela una importación en progreso
     */
    DataImportService.cancelImport = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteImportSession(sessionId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener resultado de importación
     */
    DataImportService.getImportResult = function (importId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getImportStatus(importId)];
            });
        });
    };
    /**
     * Obtener historial de importaciones
     * @deprecated El sistema genérico no mantiene historial persistente
     */
    DataImportService.getImportHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        imports: [],
                        total: 0,
                        page: 1,
                        limit: 20,
                        total_pages: 0
                    }];
            });
        });
    };
    /**
     * Obtener plantillas disponibles
     */
    DataImportService.getAvailableTemplates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var models, templates, _i, models_1, model, metadata, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAvailableModels()];
                    case 1:
                        models = _a.sent();
                        templates = {};
                        _i = 0, models_1 = models;
                        _a.label = 2;
                    case 2:
                        if (!(_i < models_1.length)) return [3 /*break*/, 7];
                        model = models_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.getModelMetadata(model)];
                    case 4:
                        metadata = _a.sent();
                        templates[model] = {
                            description: metadata.description || "Import ".concat(metadata.display_name),
                            formats: ['csv', 'xlsx'],
                            endpoints: {
                                upload: "".concat(BASE_URL, "/sessions"),
                                preview: "".concat(BASE_URL, "/sessions/{session_id}/preview"),
                                execute: "".concat(BASE_URL, "/sessions/{session_id}/execute")
                            },
                            required_fields: metadata.fields.filter(function (f) { return f.is_required; }).map(function (f) { return f.internal_name; }),
                            optional_fields: metadata.fields.filter(function (f) { return !f.is_required; }).map(function (f) { return f.internal_name; }),
                            example_data: {}
                        };
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.warn("Error obteniendo metadata para modelo ".concat(model, ":"), error_3);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, { available_templates: templates }];
                }
            });
        });
    };
    /**
     * @deprecated El sistema genérico no maneja plantillas de descarga
     */
    DataImportService.downloadTemplate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Las plantillas de descarga no están disponibles en el sistema genérico. Use getModelMetadata para obtener la estructura de campos.');
            });
        });
    };
    /**
     * Obtener información de plantilla
     */
    DataImportService.getTemplateInfo = function (dataType, format) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modelName = this.mapDataTypeToModel(dataType);
                        return [4 /*yield*/, this.getModelMetadata(modelName)];
                    case 1:
                        metadata = _a.sent();
                        return [2 /*return*/, {
                                data_type: dataType,
                                format: format,
                                description: metadata.description || '',
                                required_fields: metadata.fields.filter(function (f) { return f.is_required; }).map(function (f) { return f.internal_name; }),
                                optional_fields: metadata.fields.filter(function (f) { return !f.is_required; }).map(function (f) { return f.internal_name; }),
                                field_descriptions: metadata.fields.reduce(function (acc, field) {
                                    acc[field.internal_name] = field.description || field.display_label;
                                    return acc;
                                }, {})
                            }];
                }
            });
        });
    };
    /**
     * Validar archivo antes de importar
     */
    DataImportService.validateFile = function (file, dataType) {
        return __awaiter(this, void 0, void 0, function () {
            var modelName, session, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        modelName = this.mapDataTypeToModel(dataType);
                        return [4 /*yield*/, this.createImportSession(modelName, file)];
                    case 1:
                        session = _b.sent();
                        // La creación exitosa de la sesión implica validación básica
                        // Limpiar la sesión temporal
                        return [4 /*yield*/, this.deleteImportSession(session.import_session_token)];
                    case 2:
                        // La creación exitosa de la sesión implica validación básica
                        // Limpiar la sesión temporal
                        _b.sent();
                        return [2 /*return*/, {
                                is_valid: true,
                                errors: [],
                                warnings: [],
                                detected_format: 'csv',
                                total_rows: ((_a = session.sample_rows) === null || _a === void 0 ? void 0 : _a.length) || 0
                            }];
                    case 3:
                        error_4 = _b.sent();
                        return [2 /*return*/, {
                                is_valid: false,
                                errors: [error_4.message || 'Error validando archivo'],
                                warnings: [],
                                detected_format: 'unknown',
                                total_rows: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // === Utilidades ===
    /**
     * Generar configuración por defecto
     */
    DataImportService.getDefaultConfiguration = function (dataType) {
        return {
            data_type: dataType,
            format: 'csv',
            validation_level: 'strict',
            batch_size: 100,
            skip_duplicates: true,
            update_existing: false,
            continue_on_error: false,
            csv_delimiter: ',',
            csv_encoding: 'utf-8',
            xlsx_sheet_name: null,
            xlsx_header_row: 1,
        };
    };
    /**
     * Validar un archivo antes de subirlo
     */
    DataImportService.validateFileInput = function (file) {
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
    DataImportService.isValidFileExtension = function (filename) {
        var validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
        var extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return validExtensions.includes(extension);
    };
    /**
     * Formatea el tamaño de archivo para mostrar
     */
    DataImportService.formatFileSize = function (bytes) {
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
    DataImportService.detectFileFormat = function (filename) {
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
    return DataImportService;
}());
export { DataImportService };
