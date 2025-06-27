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
/**
 * API Client para Journals (Diarios)
 * Implementa todos los endpoints del backend para journals
 */
import { apiClient } from '@/shared/api/client';
/**
 * Cliente API para operaciones con journals
 */
var JournalAPI = /** @class */ (function () {
    function JournalAPI() {
    }
    /**
     * Crear un nuevo journal
     */
    JournalAPI.createJournal = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post(this.BASE_URL, data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener lista de journals con filtros y paginación
     */
    JournalAPI.getJournals = function (filters, pagination) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        // Agregar filtros
                        if (filters === null || filters === void 0 ? void 0 : filters.type) {
                            params.append('type', filters.type);
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.is_active) !== undefined) {
                            params.append('is_active', filters.is_active.toString());
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            params.append('search', filters.search);
                        }
                        // Agregar paginación
                        if (pagination) {
                            if (pagination.skip !== undefined) {
                                params.append('skip', pagination.skip.toString());
                            }
                            if (pagination.limit !== undefined) {
                                params.append('limit', pagination.limit.toString());
                            }
                            if (pagination.order_by) {
                                params.append('order_by', pagination.order_by);
                            }
                            if (pagination.order_dir) {
                                params.append('order_dir', pagination.order_dir);
                            }
                        }
                        url = params.toString()
                            ? "".concat(this.BASE_URL, "?").concat(params.toString())
                            : this.BASE_URL;
                        return [4 /*yield*/, apiClient.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener un journal por ID
     */
    JournalAPI.getJournal = function (id) {
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
     * Actualizar un journal
     */
    JournalAPI.updateJournal = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Eliminar un journal
     */
    JournalAPI.deleteJournal = function (id) {
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
     * Obtener estadísticas de un journal
     */
    JournalAPI.getJournalStats = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/stats"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener información de secuencia de un journal
     */
    JournalAPI.getJournalSequenceInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/sequence"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Resetear secuencia de un journal
     */
    JournalAPI.resetJournalSequence = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/sequence/reset"), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener journals por tipo
     */
    JournalAPI.getJournalsByType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/by-type/").concat(type))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener journal por defecto para un tipo
     */
    JournalAPI.getDefaultJournalForType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/default/").concat(type))];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _b.sent();
                        if (((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                            return [2 /*return*/, null];
                        }
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener todos los journals activos (para selects)
     */
    JournalAPI.getActiveJournals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJournals({ is_active: true }, { skip: 0, limit: 1000, order_by: 'name', order_dir: 'asc' })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.items];
                }
            });
        });
    };
    /**
     * Buscar journals (para componentes de búsqueda)
     */
    JournalAPI.searchJournals = function (query_1) {
        return __awaiter(this, arguments, void 0, function (query, limit) {
            var response;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJournals({ search: query, is_active: true }, { skip: 0, limit: limit, order_by: 'name', order_dir: 'asc' })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.items];
                }
            });
        });
    };
    JournalAPI.BASE_URL = '/api/v1/journals';
    return JournalAPI;
}());
export { JournalAPI };
export default JournalAPI;
