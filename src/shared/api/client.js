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
import axios from 'axios';
import { TokenManager } from '@/features/auth/utils/tokenManager';
import { APP_CONFIG } from '@/shared/constants';
// Configuración base
export var apiClient = axios.create({
    baseURL: APP_CONFIG.API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Flag para evitar bucles infinitos en refresh
var isRefreshing = false;
var failedQueue = [];
var processQueue = function (error, token) {
    if (token === void 0) { token = null; }
    failedQueue.forEach(function (_a) {
        var resolve = _a.resolve, reject = _a.reject;
        if (error) {
            reject(error);
        }
        else {
            resolve(token);
        }
    });
    failedQueue = [];
};
// Interceptor de request: agregar token y logging
apiClient.interceptors.request.use(function (config) {
    var _a, _b, _c, _d;
    var token = TokenManager.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    // Logging detallado para requests de importación
    if ((_a = config.url) === null || _a === void 0 ? void 0 : _a.includes('/import/')) {
        console.log('🌐 === INTERCEPTOR REQUEST ===');
        console.log('📍 URL:', config.url);
        console.log('🔧 Method:', (_b = config.method) === null || _b === void 0 ? void 0 : _b.toUpperCase());
        console.log('📋 Headers:', config.headers);
        if (config.data instanceof FormData) {
            console.log('📦 FormData detected:');
            for (var _i = 0, _e = config.data.entries(); _i < _e.length; _i++) {
                var _f = _e[_i], key = _f[0], value = _f[1];
                if (value instanceof File) {
                    console.log("  ".concat(key, ": File(").concat(value.name, ", ").concat(value.size, " bytes, ").concat(value.type, ")"));
                }
                else {
                    console.log("  ".concat(key, ": ").concat(value));
                }
            }
        }
        else {
            console.log('📄 Data:', config.data);
        }
        console.log('⏱️ Timeout:', config.timeout);
    }
    // Logging detallado para requests de centros de costo
    if ((_c = config.url) === null || _c === void 0 ? void 0 : _c.includes('/cost-centers')) {
        console.log('🏢 === COST CENTER REQUEST ===');
        console.log('📍 URL:', config.url);
        console.log('🔧 Method:', (_d = config.method) === null || _d === void 0 ? void 0 : _d.toUpperCase());
        console.log('📋 Headers:', config.headers);
        console.log('📄 Data:', config.data);
        console.log('⏱️ Timeout:', config.timeout);
    }
    return config;
}, function (error) {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
});
// Interceptor de response: manejar token expirado y logging
apiClient.interceptors.response.use(function (response) {
    var _a, _b;
    // Logging detallado para responses de importación
    if ((_a = response.config.url) === null || _a === void 0 ? void 0 : _a.includes('/import/')) {
        console.log('📥 === INTERCEPTOR RESPONSE ===');
        console.log('📍 URL:', response.config.url);
        console.log('✅ Status:', response.status);
        console.log('📋 Headers:', response.headers);
        console.log('📄 Data:', response.data);
    }
    // Logging detallado para responses de centros de costo
    if ((_b = response.config.url) === null || _b === void 0 ? void 0 : _b.includes('/cost-centers')) {
        console.log('🏢 === COST CENTER RESPONSE ===');
        console.log('📍 URL:', response.config.url);
        console.log('✅ Status:', response.status);
        console.log('📋 Headers:', response.headers);
        console.log('📄 Data:', response.data);
    }
    return response;
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalRequest, refreshToken, refreshResponse, newTokens, refreshError_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if ((_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.includes('/import/')) {
                    console.log('❌ === INTERCEPTOR ERROR ===');
                    console.log('📍 URL:', error.config.url);
                    console.log('🔥 Error:', error.message);
                    if (error.response) {
                        console.log('📊 Status:', error.response.status);
                        console.log('📋 Headers:', error.response.headers);
                        console.log('📄 Data:', error.response.data);
                    }
                }
                // Logging de errores para centros de costo
                if ((_d = (_c = error.config) === null || _c === void 0 ? void 0 : _c.url) === null || _d === void 0 ? void 0 : _d.includes('/cost-centers')) {
                    console.log('🏢❌ === COST CENTER ERROR ===');
                    console.log('📍 URL:', error.config.url);
                    console.log('🔥 Error:', error.message);
                    if (error.response) {
                        console.log('📊 Status:', error.response.status);
                        console.log('📋 Headers:', error.response.headers);
                        console.log('📄 Data:', error.response.data);
                        console.log('📝 Detail:', JSON.stringify(error.response.data, null, 2));
                    }
                }
                originalRequest = error.config;
                if (!(((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 401 && !originalRequest._retry)) return [3 /*break*/, 6];
                if (isRefreshing) {
                    // Si ya se está refrescando, poner en cola
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            failedQueue.push({ resolve: resolve, reject: reject });
                        }).then(function (token) {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = "Bearer ".concat(token);
                            }
                            return apiClient(originalRequest);
                        }).catch(function (err) {
                            return Promise.reject(err);
                        })];
                }
                originalRequest._retry = true;
                isRefreshing = true;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 4, 5, 6]);
                refreshToken = TokenManager.getRefreshToken();
                if (!refreshToken) return [3 /*break*/, 3];
                return [4 /*yield*/, axios.post("".concat(APP_CONFIG.API_URL, "/api/v1/auth/refresh"), { refresh_token: refreshToken }, { timeout: 10000 })];
            case 2:
                refreshResponse = _f.sent();
                newTokens = refreshResponse.data;
                TokenManager.setTokens(newTokens);
                processQueue(null, newTokens.access_token);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = "Bearer ".concat(newTokens.access_token);
                }
                return [2 /*return*/, apiClient(originalRequest)];
            case 3: return [3 /*break*/, 6];
            case 4:
                refreshError_1 = _f.sent();
                processQueue(refreshError_1, null);
                TokenManager.clearTokens();
                // Redirigir al login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return [3 /*break*/, 6];
            case 5:
                isRefreshing = false;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
// Utilidades para manejo de errores
export var handleApiError = function (error) {
    var _a;
    if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
        var data = error.response.data;
        return data.detail || data.message || 'Error en el servidor';
    }
    if (error.request) {
        return 'Error de conexión. Verifique su conexión a internet.';
    }
    return error.message || 'Error desconocido';
};
export var isNetworkError = function (error) {
    return !error.response && !!error.request;
};
export default apiClient;
