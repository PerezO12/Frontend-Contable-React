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
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/forms/PasswordField';
import { ValidationMessage } from '@/components/forms/ValidationMessage';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { validateEmail, validateRequired } from '@/shared/utils/validation';
import { useToast } from '@/shared/hooks/useToast';
export var LoginForm = function () {
    var _a;
    var _b = useState({
        email: '',
        password: ''
    }), credentials = _b[0], setCredentials = _b[1];
    var _c = useState({}), validationErrors = _c[0], setValidationErrors = _c[1];
    var _d = useAuth(), login = _d.login, isLoading = _d.isLoading, error = _d.error, isAuthenticated = _d.isAuthenticated, clearError = _d.clearError;
    var _e = useToast(), success = _e.success, showError = _e.error;
    var location = useLocation();
    var from = ((_a = location.state) === null || _a === void 0 ? void 0 : _a.from) || '/dashboard';
    // Redirigir si ya está autenticado
    if (isAuthenticated) {
        return <Navigate to={from} replace/>;
    }
    var validateForm = function () {
        var errors = {};
        // Validar email
        var emailError = validateRequired(credentials.email, 'Email');
        if (emailError) {
            errors.email = emailError;
        }
        else if (!validateEmail(credentials.email)) {
            errors.email = 'Formato de email inválido';
        }
        // Validar contraseña
        var passwordError = validateRequired(credentials.password, 'Contraseña');
        if (passwordError) {
            errors.password = passwordError;
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    clearError();
                    if (!validateForm()) {
                        showError('Error de validación', 'Por favor, corrige los errores en el formulario');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, login(credentials)];
                case 2:
                    _a.sent();
                    success('¡Bienvenido!', 'Has iniciado sesión exitosamente');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // Error ya manejado en el context, pero podemos mostrar toast adicional
                    console.error('Login failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setCredentials(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        // Limpiar errores al escribir
        if (validationErrors[name]) {
            setValidationErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = undefined, _a)));
            });
        }
        if (error)
            clearError();
    };
    return (<AuthLayout title="Iniciar Sesión" subtitle="Ingresa tus credenciales para acceder al sistema">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (<ValidationMessage type="error" message={error}/>)}

        <div>
          <Input label="Correo Electrónico" type="email" name="email" value={credentials.email} onChange={handleInputChange} error={validationErrors.email} placeholder="usuario@empresa.com" required autoComplete="email" autoFocus/>
        </div>

        <div>
          <PasswordField label="Contraseña" name="password" value={credentials.password} onChange={handleInputChange} error={validationErrors.password} placeholder="Ingresa tu contraseña" required autoComplete="current-password"/>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"/>
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full" disabled={!credentials.email || !credentials.password}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"/>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Información del sistema</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Sistema Contable Empresarial v1.0</p>
            <p>Para soporte técnico, contacta al administrador</p>
          </div>
        </div>
      </form>
    </AuthLayout>);
};
