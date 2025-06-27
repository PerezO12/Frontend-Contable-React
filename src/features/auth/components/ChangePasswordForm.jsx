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
import { AuthService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/Button';
import { PasswordField } from '@/components/forms/PasswordField';
import { useToast } from '@/shared/hooks/useToast';
import { validateRequired, validatePassword } from '@/shared/utils/validation';
export var ChangePasswordForm = function (_a) {
    var onSuccess = _a.onSuccess, onCancel = _a.onCancel;
    var _b = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useToast(), success = _e.success, showError = _e.error;
    var validateForm = function () {
        var newErrors = {};
        // Validar contraseña actual
        var currentPasswordError = validateRequired(formData.current_password, 'Contraseña actual');
        if (currentPasswordError) {
            newErrors.current_password = currentPasswordError;
        } // Validar nueva contraseña
        var newPasswordError = validateRequired(formData.new_password, 'Nueva contraseña');
        if (newPasswordError) {
            newErrors.new_password = newPasswordError;
        }
        else {
            var passwordValidation = validatePassword(formData.new_password);
            if (!passwordValidation.isValid) {
                newErrors.new_password = passwordValidation.errors.join(', ');
            }
        }
        // Validar confirmación de contraseña
        var confirmPasswordError = validateRequired(formData.confirm_password, 'Confirmar contraseña');
        if (confirmPasswordError) {
            newErrors.confirm_password = confirmPasswordError;
        }
        else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = 'Las contraseñas no coinciden';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        showError('Error de validación', 'Por favor, corrige los errores en el formulario');
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AuthService.changePassword(formData)];
                case 2:
                    _a.sent();
                    success('¡Contraseña cambiada!', 'Tu contraseña ha sido actualizada exitosamente');
                    // Limpiar formulario
                    setFormData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                    });
                    if (onSuccess) {
                        onSuccess();
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Error al cambiar contraseña';
                    showError('Error', errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        // Limpiar errores al escribir
        if (errors[name]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = undefined, _a)));
            });
        }
    };
    return (<div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <PasswordField label="Contraseña Actual" name="current_password" value={formData.current_password} onChange={handleInputChange} error={errors.current_password} placeholder="Ingresa tu contraseña actual" required autoComplete="current-password"/>
          </div>

          <div>
            <PasswordField label="Nueva Contraseña" name="new_password" value={formData.new_password} onChange={handleInputChange} error={errors.new_password} placeholder="Ingresa tu nueva contraseña" required autoComplete="new-password"/>
            <div className="mt-2 text-sm text-gray-600">
              <p>La contraseña debe contener:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un carácter especial</li>
              </ul>
            </div>
          </div>

          <div>
            <PasswordField label="Confirmar Nueva Contraseña" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} error={errors.confirm_password} placeholder="Confirma tu nueva contraseña" required autoComplete="new-password"/>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} disabled={!formData.current_password || !formData.new_password || !formData.confirm_password} className="flex-1">
              {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
            
            {onCancel && (<Button type="button" variant="secondary" size="lg" onClick={onCancel} disabled={isLoading} className="flex-1">
                Cancelar
              </Button>)}
          </div>
        </form>
      </div>
    </div>);
};
