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
var CostCenterService = /** @class */ (function () {
    function CostCenterService() {
    }
    /**
     * Crear un nuevo centro de costo
     */
    CostCenterService.createCostCenter = function (costCenterData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post(this.BASE_URL, costCenterData)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener lista de centros de costo con filtros
     */
    CostCenterService.getCostCenters = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            if (filters.skip !== undefined)
                                params.append('skip', filters.skip.toString());
                            if (filters.limit !== undefined)
                                params.append('limit', filters.limit.toString());
                            if (filters.code)
                                params.append('code', filters.code);
                            if (filters.name)
                                params.append('name', filters.name);
                            if (filters.parent_id)
                                params.append('parent_id', filters.parent_id);
                            if (filters.is_active !== undefined)
                                params.append('is_active', filters.is_active.toString());
                            if (filters.level !== undefined)
                                params.append('level', filters.level.toString());
                            if (filters.has_children !== undefined)
                                params.append('has_children', filters.has_children.toString());
                            if (filters.created_after)
                                params.append('created_after', filters.created_after);
                            if (filters.created_before)
                                params.append('created_before', filters.created_before);
                            if (filters.order_by)
                                params.append('order_by', filters.order_by);
                            if (filters.order_desc !== undefined)
                                params.append('order_desc', filters.order_desc.toString());
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "?").concat(params) : this.BASE_URL;
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        // Logging para debug - verificar estructura de respuesta
                        console.log('🏢🔍 Respuesta del servidor getCostCenters:', response.data);
                        console.log('🏢📋 Estructura esperada vs recibida:');
                        console.log('  - Esperado: {data, total, skip, limit}');
                        console.log('  - Recibido:', Object.keys(response.data));
                        // Manejar diferentes estructuras de respuesta del servidor
                        if (response.data.items) {
                            // Si el servidor devuelve "items" en lugar de "data"
                            console.log('🏢⚠️ Servidor devuelve "items", adaptando respuesta...');
                            return [2 /*return*/, {
                                    data: response.data.items,
                                    total: response.data.total,
                                    skip: response.data.skip,
                                    limit: response.data.limit
                                }];
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener un centro de costo por ID
     */
    CostCenterService.getCostCenterById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener un centro de costo por código
     */
    CostCenterService.getCostCenterByCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/code/").concat(code))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Actualizar un centro de costo existente
     */
    CostCenterService.updateCostCenter = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), updateData)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Eliminar un centro de costo permanentemente
     */
    CostCenterService.deleteCostCenter = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.delete("".concat(this.BASE_URL, "/").concat(id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener estructura jerárquica de centros de costo como árbol
     */
    CostCenterService.getCostCenterTree = function () {
        return __awaiter(this, arguments, void 0, function (activeOnly) {
            var params, url, response;
            if (activeOnly === void 0) { activeOnly = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('active_only', activeOnly.toString());
                        url = "".concat(this.BASE_URL, "/tree?").concat(params);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Validar disponibilidad de código
     */
    CostCenterService.checkCodeAvailability = function (code, excludeId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('code', code);
                        if (excludeId)
                            params.append('exclude_id', excludeId);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/validate-code?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.available];
                }
            });
        });
    };
    /**
     * Activar o desactivar un centro de costo
     */
    CostCenterService.toggleCostCenterStatus = function (id, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.patch("".concat(this.BASE_URL, "/").concat(id, "/status"), {
                            is_active: isActive
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener movimientos asociados a un centro de costo
     */
    CostCenterService.getCostCenterMovements = function (id, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            if (filters.start_date)
                                params.append('start_date', filters.start_date);
                            if (filters.end_date)
                                params.append('end_date', filters.end_date);
                            if (filters.skip !== undefined)
                                params.append('skip', filters.skip.toString());
                            if (filters.limit !== undefined)
                                params.append('limit', filters.limit.toString());
                        }
                        url = params.toString()
                            ? "".concat(this.BASE_URL, "/").concat(id, "/movements?").concat(params)
                            : "".concat(this.BASE_URL, "/").concat(id, "/movements");
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener análisis de rentabilidad de un centro de costo
     */
    CostCenterService.getCostCenterAnalysis = function (id, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('start_date', startDate);
                        params.append('end_date', endDate);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/analysis?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Validar si múltiples centros de costo pueden ser eliminados
     */
    CostCenterService.validateDeletion = function (costCenterIds) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando eliminación de centros de costo:', costCenterIds);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/validate-deletion"), costCenterIds)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error al validar eliminación:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar múltiples centros de costo con validaciones
     */
    CostCenterService.bulkDeleteCostCenters = function (deleteData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminación masiva de centros de costo:', deleteData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-delete"), deleteData)];
                    case 2:
                        response = _a.sent();
                        console.log('Eliminación masiva completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error en eliminación masiva:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exportar centros de costo seleccionados
     */
    CostCenterService.exportCostCenters = function (costCenterIds, format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ExportService.exportByIds({
                        table: 'cost_centers',
                        format: format,
                        ids: costCenterIds
                    })];
            });
        });
    }; /**
     * Exportar centros de costo con filtros avanzados - MÉTODO OBSOLETO
     * Use getCostCenters() para obtener IDs filtrados y luego exportCostCenters()
     */
    CostCenterService.exportCostCentersAdvanced = function (_format, _filters, _selectedColumns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Método obsoleto. Use getCostCenters() para obtener IDs filtrados y luego exportCostCenters().');
            });
        });
    }; /**
     * Obtener esquema de exportación para centros de costo
     */
    CostCenterService.getExportSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ExportService.getTableSchema('cost_centers')];
            });
        });
    };
    /**
     * Obtener estadísticas generales de centros de costo
     */
    CostCenterService.getCostCenterStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/stats"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    CostCenterService.BASE_URL = '/api/v1/cost-centers';
    return CostCenterService;
}());
export { CostCenterService };
