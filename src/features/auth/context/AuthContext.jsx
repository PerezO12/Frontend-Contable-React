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
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { TokenManager } from '../utils/tokenManager';
// Reducer para manejar el estado de autenticación
var authReducer = function (state, action) {
    switch (action.type) {
        case 'LOGIN_START':
            return __assign(__assign({}, state), { isLoading: true, error: null });
        case 'LOGIN_SUCCESS':
            return __assign(__assign({}, state), { user: action.payload.user, tokens: action.payload.tokens, isAuthenticated: true, isLoading: false, error: null });
        case 'LOGIN_ERROR':
            return __assign(__assign({}, state), { user: null, tokens: null, isAuthenticated: false, isLoading: false, error: action.payload });
        case 'LOGOUT':
            return __assign(__assign({}, state), { user: null, tokens: null, isAuthenticated: false, isLoading: false, error: null });
        case 'SET_USER':
            return __assign(__assign({}, state), { user: action.payload, isAuthenticated: true });
        case 'SET_TOKENS':
            return __assign(__assign({}, state), { tokens: action.payload });
        case 'CLEAR_ERROR':
            return __assign(__assign({}, state), { error: null });
        case 'SET_LOADING':
            return __assign(__assign({}, state), { isLoading: action.payload });
        default:
            return state;
    }
};
// Estado inicial
var initialState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};
// Crear el contexto
var AuthContext = createContext(undefined);
// Provider del contexto
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useReducer(authReducer, initialState), state = _b[0], dispatch = _b[1];
    // Inicialización: verificar tokens existentes al cargar la aplicación
    useEffect(function () {
        var initAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokens, user, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch({ type: 'SET_LOADING', payload: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 10]);
                        tokens = TokenManager.getTokens();
                        if (!(tokens && !TokenManager.isTokenExpired(tokens.access_token))) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, AuthService.getCurrentUser()];
                    case 3:
                        user = _a.sent();
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user: user, tokens: tokens }
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        // Si falla la obtención del usuario, limpiar tokens
                        TokenManager.clearTokens();
                        dispatch({ type: 'LOGOUT' });
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        // Tokens expirados o no existentes
                        TokenManager.clearTokens();
                        dispatch({ type: 'LOGOUT' });
                        _a.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        error_2 = _a.sent();
                        console.error('Error during auth initialization:', error_2);
                        TokenManager.clearTokens();
                        dispatch({ type: 'LOGOUT' });
                        return [3 /*break*/, 10];
                    case 9:
                        dispatch({ type: 'SET_LOADING', payload: false });
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        initAuth();
    }, []);
    // Función de login
    var login = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var tokens, user, error_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: 'LOGIN_START' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, AuthService.login(credentials)];
                case 2:
                    tokens = _a.sent();
                    // Guardar tokens
                    TokenManager.setTokens(tokens);
                    return [4 /*yield*/, AuthService.getCurrentUser()];
                case 3:
                    user = _a.sent();
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { user: user, tokens: tokens }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    errorMessage = error_3 instanceof Error ? error_3.message : 'Error de login';
                    dispatch({
                        type: 'LOGIN_ERROR',
                        payload: errorMessage
                    });
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Función de logout
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: 'SET_LOADING', payload: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AuthService.logout()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error('Logout error:', error_4);
                    return [3 /*break*/, 5];
                case 4:
                    TokenManager.clearTokens();
                    dispatch({ type: 'LOGOUT' });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Función para renovar token
    var refreshToken = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokens, newTokens, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokens = TokenManager.getTokens();
                    if (!(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token)) {
                        dispatch({ type: 'LOGOUT' });
                        TokenManager.clearTokens();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, AuthService.refreshToken(tokens.refresh_token)];
                case 2:
                    newTokens = _a.sent();
                    TokenManager.setTokens(newTokens);
                    dispatch({ type: 'SET_TOKENS', payload: newTokens });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Token refresh failed:', error_5);
                    dispatch({ type: 'LOGOUT' });
                    TokenManager.clearTokens();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []); // No dependencies - this function should be stable
    // Función para limpiar errores
    var clearError = useCallback(function () {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []); // Configurar renovación automática de tokens
    useEffect(function () {
        if (!state.isAuthenticated)
            return;
        var interval = setInterval(function () {
            if (TokenManager.shouldRefreshToken()) {
                refreshToken();
            }
        }, 60000); // Verificar cada minuto
        return function () { return clearInterval(interval); };
    }, [state.isAuthenticated, refreshToken]);
    var value = __assign(__assign({}, state), { login: login, logout: logout, refreshToken: refreshToken, clearError: clearError });
    return (<AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>);
};
// Hook para usar el contexto
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
