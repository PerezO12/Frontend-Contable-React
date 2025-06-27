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
var AccountService = /** @class */ (function () {
    function AccountService() {
    }
    /**
     * Crear una nueva cuenta contable
     */
    AccountService.createAccount = function (accountData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Datos de cuenta a crear:', accountData);
                        console.log('URL de petición:', this.BASE_URL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post(this.BASE_URL, accountData)];
                    case 2:
                        response = _a.sent();
                        console.log('Respuesta del servidor:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error al crear cuenta:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener lista de cuentas con filtros y paginación
     */
    AccountService.getAccounts = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 [AccountService] getAccounts called with filters:', filters);
                        params = new URLSearchParams();
                        if (filters) {
                            if (filters.skip !== undefined)
                                params.append('skip', filters.skip.toString());
                            if (filters.limit !== undefined)
                                params.append('limit', filters.limit.toString());
                            if (filters.account_type)
                                params.append('account_type', filters.account_type);
                            if (filters.category)
                                params.append('category', filters.category);
                            if (filters.is_active !== undefined)
                                params.append('is_active', filters.is_active.toString());
                            if (filters.parent_id)
                                params.append('parent_id', filters.parent_id);
                            if (filters.search)
                                params.append('search', filters.search);
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "?").concat(params) : this.BASE_URL;
                        console.log('🔍 [AccountService] Final URL:', url);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 2:
                        response = _a.sent();
                        console.log('✅ [AccountService] Response received:', response.data);
                        // Check if response is paginated format
                        if (response.data && typeof response.data === 'object' && 'items' in response.data && 'total' in response.data) {
                            console.log('🔍 [AccountService] Response is paginated format');
                            return [2 /*return*/, response.data];
                        }
                        else if (Array.isArray(response.data)) {
                            console.log('🔍 [AccountService] Response is plain array, returning as-is for hook to handle');
                            return [2 /*return*/, response.data];
                        }
                        else {
                            console.warn('⚠️ [AccountService] Unexpected response format, trying to extract accounts');
                            return [2 /*return*/, response.data];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ [AccountService] Error fetching accounts:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener una cuenta por ID
     */
    AccountService.getAccountById = function (id) {
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
     * Obtener una cuenta por código
     */
    AccountService.getAccountByCode = function (code) {
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
     * Actualizar una cuenta existente
     */ AccountService.updateAccount = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔄 AccountService.updateAccount - Iniciando actualización');
                        console.log('📋 ID de cuenta:', id);
                        console.log('📝 Datos de actualización:', updateData);
                        console.log('🌐 URL completa:', "".concat(this.BASE_URL, "/").concat(id));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), updateData)];
                    case 2:
                        response = _a.sent();
                        console.log('✅ Respuesta exitosa del servidor:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error('❌ Error al actualizar cuenta:', error_3);
                        if (error_3 instanceof Error) {
                            console.error('📋 Mensaje de error:', error_3.message);
                            console.error('📊 Stack trace:', error_3.stack);
                        }
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar una cuenta permanentemente
     */
    AccountService.deleteAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminando cuenta:', id);
                        console.log('URL de eliminación:', "".concat(this.BASE_URL, "/").concat(id));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.delete("".concat(this.BASE_URL, "/").concat(id))];
                    case 2:
                        response = _a.sent();
                        console.log('Cuenta eliminada exitosamente:', id);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error al eliminar cuenta:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener la estructura jerárquica de cuentas como árbol
     */
    AccountService.getAccountTree = function (accountType_1) {
        return __awaiter(this, arguments, void 0, function (accountType, activeOnly) {
            var params, url, response;
            if (activeOnly === void 0) { activeOnly = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (accountType)
                            params.append('account_type', accountType);
                        params.append('active_only', activeOnly.toString());
                        url = params.toString() ? "".concat(this.BASE_URL, "/tree?").concat(params) : "".concat(this.BASE_URL, "/tree");
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener cuentas hijas de una cuenta padre
     */
    AccountService.getChildAccounts = function (parentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(parentId, "/children"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener el camino jerárquico de una cuenta
     */
    AccountService.getAccountPath = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/path"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Verificar si un código de cuenta está disponible
     */
    AccountService.checkCodeAvailability = function (code, excludeId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('code', code);
                        if (excludeId)
                            params.append('exclude_id', excludeId);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/check-code?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.available];
                }
            });
        });
    };
    /**
     * Obtener estadísticas de cuentas por tipo
     */
    AccountService.getAccountStats = function () {
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
    /**
     * Exportar plan de cuentas
     */
    AccountService.exportChartOfAccounts = function (format) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/export?format=").concat(format), {
                            responseType: 'blob'
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Importar plan de cuentas desde archivo
     */
    AccountService.importChartOfAccounts = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('file', file);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/import"), formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Activar o desactivar una cuenta
     */
    AccountService.toggleAccountStatus = function (id, isActive) {
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
     * Obtener saldo actual de una cuenta
     */
    AccountService.getAccountBalance = function (id, asOfDate) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (asOfDate)
                            params.append('as_of_date', asOfDate);
                        url = params.toString()
                            ? "".concat(this.BASE_URL, "/").concat(id, "/balance?").concat(params)
                            : "".concat(this.BASE_URL, "/").concat(id, "/balance");
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener movimientos de una cuenta
     */
    AccountService.getAccountMovements = function (id, filters) {
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
     * Validar si múltiples cuentas pueden ser eliminadas
     */
    AccountService.validateDeletion = function (accountIds) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando eliminación de cuentas:', accountIds);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/validate-deletion"), accountIds)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error al validar eliminación:', error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar múltiples cuentas con validaciones
     */
    AccountService.bulkDeleteAccounts = function (deleteData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminación masiva de cuentas:', deleteData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-delete"), deleteData)];
                    case 2:
                        response = _a.sent();
                        console.log('Eliminación masiva completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error en eliminación masiva:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exportar cuentas seleccionadas usando el sistema de exportación genérico
     */
    AccountService.exportAccounts = function (accountIds, format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ExportService.exportByIds({
                        table: 'accounts',
                        format: format,
                        ids: accountIds
                    })];
            });
        });
    };
    /**
     * Exportar cuentas con filtros avanzados - MÉTODO OBSOLETO
     * Use getAccounts() para obtener IDs y luego exportAccounts()
     */
    AccountService.exportAccountsAdvanced = function (_format, _filters, _selectedColumns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Método obsoleto. Use getAccounts() para obtener IDs filtrados y luego exportAccounts().');
            });
        });
    };
    /**
     * Obtener información de esquema para exportación
     */
    AccountService.getExportSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ExportService.getTableSchema('accounts')];
            });
        });
    };
    AccountService.BASE_URL = '/api/v1/accounts';
    return AccountService;
}());
export { AccountService };
