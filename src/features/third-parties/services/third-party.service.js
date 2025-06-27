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
import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
var ThirdPartyService = /** @class */ (function () {
    function ThirdPartyService() {
    }
    ThirdPartyService.getThirdParties = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "?").concat(params) : this.BASE_URL;
                        console.log('🔍 [ThirdPartyService] Final URL:', url);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ [ThirdPartyService] Error en getThirdParties:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.getThirdParty = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 [ThirdPartyService] Getting third party with ID:', id);
                        console.log('🔍 [ThirdPartyService] Full URL:', "".concat(this.BASE_URL, "/").concat(id));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id))];
                    case 2:
                        response = _a.sent();
                        console.log('✅ [ThirdPartyService] Success response:', response.status);
                        console.log('✅ [ThirdPartyService] Response data:', response.data);
                        // El backend retorna directamente el objeto, no envuelto en data
                        return [2 /*return*/, response.data];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ [ThirdPartyService] Error en getThirdParty:', error_2);
                        console.error('❌ [ThirdPartyService] Error details:', {
                            id: id,
                            url: "".concat(this.BASE_URL, "/").concat(id),
                            error: error_2 instanceof Error ? error_2.message : error_2
                        });
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.createThirdParty = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanData, response, error_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cleanData = Object.fromEntries(Object.entries(data).filter(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value !== '' && value !== null && value !== undefined;
                        }));
                        console.log('🚀 [ThirdPartyService] Creando tercero con datos:', cleanData);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post(this.BASE_URL, cleanData)];
                    case 2:
                        response = _c.sent();
                        console.log('✅ [ThirdPartyService] Tercero creado exitosamente:', response.data.id);
                        // El backend retorna directamente el objeto creado
                        return [2 /*return*/, response.data];
                    case 3:
                        error_3 = _c.sent();
                        console.error('❌ [ThirdPartyService] Error al crear tercero:');
                        console.error('📥 Status:', (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('📥 Error data:', (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.updateThirdParty = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), data)];
                    case 1:
                        response = _a.sent();
                        // El backend retorna directamente el objeto actualizado
                        return [2 /*return*/, response.data];
                    case 2:
                        error_4 = _a.sent();
                        console.error('❌ [ThirdPartyService] Error al actualizar tercero:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.deleteThirdParty = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.delete("".concat(this.BASE_URL, "/").concat(id))];
                    case 1:
                        _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _d.sent();
                        console.error('❌ [ThirdPartyService] Error al eliminar tercero:', error_5);
                        if ((_c = (_b = (_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) === null || _c === void 0 ? void 0 : _c.includes('existing journal entries')) {
                            throw new Error('No se puede eliminar el tercero porque tiene asientos contables asociados');
                        }
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Search
    ThirdPartyService.searchThirdParties = function (query, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({ q: query });
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/search?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // Statements
    ThirdPartyService.getThirdPartyStatement = function (id_1, startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function (id, startDate, endDate, includeAging) {
            var params, url, response;
            if (includeAging === void 0) { includeAging = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (startDate)
                            params.append('start_date', startDate);
                        if (endDate)
                            params.append('end_date', endDate);
                        if (includeAging)
                            params.append('include_aging', 'true');
                        url = "".concat(this.BASE_URL, "/").concat(id, "/statement?").concat(params);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    // Balance
    ThirdPartyService.getThirdPartyBalance = function (id_1, asOfDate_1) {
        return __awaiter(this, arguments, void 0, function (id, asOfDate, includeAging) {
            var params, url, response;
            if (includeAging === void 0) { includeAging = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (asOfDate)
                            params.append('as_of_date', asOfDate);
                        if (includeAging)
                            params.append('include_aging', 'true');
                        url = "".concat(this.BASE_URL, "/").concat(id, "/balance?").concat(params);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    // Analytics
    ThirdPartyService.getAnalytics = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "/analytics/summary?").concat(params) : "".concat(this.BASE_URL, "/analytics/summary");
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    };
    ThirdPartyService.getAgingReport = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "/analytics/aging-report?").concat(params) : "".concat(this.BASE_URL, "/analytics/aging-report");
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                }
            });
        });
    }; // Export avanzado - IMPLEMENTADO
    ThirdPartyService.exportThirdPartiesAdvanced = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/export/advanced"), request)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error en exportación avanzada:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.getExportStatus = function (exportId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/export/").concat(exportId, "/status"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error al obtener status de exportación:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.getDownloadUrl = function (exportId) {
        return "".concat(this.BASE_URL, "/export/").concat(exportId, "/download");
    };
    /**
     * Exportar terceros seleccionados usando el sistema de exportación genérico
     */
    ThirdPartyService.exportThirdParties = function (thirdPartyIds, format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ExportService.exportByIds({
                        table: 'third_parties',
                        format: format,
                        ids: thirdPartyIds
                    })];
            });
        });
    }; // Import - IMPLEMENTADO
    ThirdPartyService.importThirdParties = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        formData = new FormData();
                        formData.append('file', request.file);
                        formData.append('format', request.format);
                        if (request.dry_run !== undefined) {
                            formData.append('dry_run', request.dry_run.toString());
                        }
                        if (request.update_existing !== undefined) {
                            formData.append('update_existing', request.update_existing.toString());
                        }
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/import"), {
                                total_records: 0,
                                dry_run: request.dry_run,
                                update_existing: request.update_existing
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error en importación:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.getImportStatus = function (importId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/import/").concat(importId, "/status"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error al obtener status de importación:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }; // Bulk Operations - IMPLEMENTADO
    ThirdPartyService.bulkOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-operations"), operation)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error en operación bulk:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThirdPartyService.getBulkOperationStatus = function (operationId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/bulk-operations/").concat(operationId, "/status"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_11 = _a.sent();
                        console.error('Error al obtener status de operación bulk:', error_11);
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Validación para eliminación
    ThirdPartyService.validateDeletion = function (thirdPartyIds) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/validate-deletion"), thirdPartyIds)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_12 = _a.sent();
                        console.error('❌ [ThirdPartyService] Error en validación de eliminación:', error_12);
                        throw error_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Nueva eliminación masiva real
    ThirdPartyService.bulkDeleteReal = function (thirdPartyIds_1) {
        return __awaiter(this, arguments, void 0, function (thirdPartyIds, forceDelete, deleteReason) {
            var request, response, error_13;
            if (forceDelete === void 0) { forceDelete = false; }
            if (deleteReason === void 0) { deleteReason = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        request = {
                            third_party_ids: thirdPartyIds,
                            force_delete: forceDelete,
                            delete_reason: deleteReason
                        };
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-delete"), request)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_13 = _a.sent();
                        console.error('❌ [ThirdPartyService] Error en eliminación masiva real:', error_13);
                        throw error_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Bulk Delete (soft delete - desactivación) - Mantener para compatibilidad
    ThirdPartyService.bulkDelete = function (thirdPartyIds) {
        return __awaiter(this, void 0, void 0, function () {
            var operation;
            return __generator(this, function (_a) {
                try {
                    operation = {
                        operation: 'delete',
                        third_party_ids: thirdPartyIds
                    };
                    return [2 /*return*/, this.bulkOperation(operation)];
                }
                catch (error) {
                    console.error('❌ [ThirdPartyService] Error en bulk delete:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    // Bulk Update
    ThirdPartyService.bulkUpdate = function (thirdPartyIds, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var operation;
            return __generator(this, function (_a) {
                operation = {
                    operation: 'update',
                    third_party_ids: thirdPartyIds,
                    updates: updates
                };
                return [2 /*return*/, this.bulkOperation(operation)];
            });
        });
    };
    // Bulk Activate/Deactivate
    ThirdPartyService.bulkActivate = function (thirdPartyIds) {
        return __awaiter(this, void 0, void 0, function () {
            var operation;
            return __generator(this, function (_a) {
                operation = {
                    operation: 'activate',
                    third_party_ids: thirdPartyIds
                };
                return [2 /*return*/, this.bulkOperation(operation)];
            });
        });
    };
    ThirdPartyService.bulkDeactivate = function (thirdPartyIds) {
        return __awaiter(this, void 0, void 0, function () {
            var operation;
            return __generator(this, function (_a) {
                operation = {
                    operation: 'deactivate',
                    third_party_ids: thirdPartyIds
                };
                return [2 /*return*/, this.bulkOperation(operation)];
            });
        });
    };
    // Utilities
    ThirdPartyService.formatDisplayName = function (thirdParty) {
        if (thirdParty.commercial_name) {
            return thirdParty.commercial_name;
        }
        return thirdParty.name;
    };
    ThirdPartyService.formatDocumentNumber = function (thirdParty) {
        return "".concat(thirdParty.document_type, ": ").concat(thirdParty.document_number);
    };
    ThirdPartyService.BASE_URL = '/api/v1/third-parties'; // CRUD Operations
    return ThirdPartyService;
}());
export { ThirdPartyService };
