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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { PaymentTermsService } from '../services/paymentTermsService';
export var PaymentTermsForm = function (_a) {
    var _b, _c;
    var onSuccess = _a.onSuccess, onError = _a.onError, onLoadingChange = _a.onLoadingChange, initialData = _a.initialData, editingPaymentTerms = _a.editingPaymentTerms, _d = _a.submitTrigger, submitTrigger = _d === void 0 ? 0 : _d;
    var isEditing = !!editingPaymentTerms;
    var _e = useState({
        code: (initialData === null || initialData === void 0 ? void 0 : initialData.code) || '',
        name: (initialData === null || initialData === void 0 ? void 0 : initialData.name) || '',
        description: (initialData === null || initialData === void 0 ? void 0 : initialData.description) || '',
        is_active: (_b = initialData === null || initialData === void 0 ? void 0 : initialData.is_active) !== null && _b !== void 0 ? _b : true,
        notes: (initialData === null || initialData === void 0 ? void 0 : initialData.notes) || ''
    }), formData = _e[0], setFormData = _e[1];
    var _f = useState(((_c = initialData === null || initialData === void 0 ? void 0 : initialData.payment_schedules) === null || _c === void 0 ? void 0 : _c.map(function (ps, index) { return (__assign(__assign({}, ps), { id: "temp-".concat(index) })); })) || [
        {
            id: 'temp-1',
            days: 0,
            percentage: 100,
            description: 'Pago único'
        }
    ]), paymentSchedules = _f[0], setPaymentSchedules = _f[1];
    var _g = useState({}), errors = _g[0], setErrors = _g[1];
    var _h = useState([]), validationErrors = _h[0], setValidationErrors = _h[1];
    // Handle external submit trigger
    useEffect(function () {
        if (submitTrigger > 0) {
            submitForm();
        }
    }, [submitTrigger]);
    var submitForm = function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataToSubmit, result, updateData, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!validateForm()) {
                        onError === null || onError === void 0 ? void 0 : onError();
                        return [2 /*return*/];
                    }
                    onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    dataToSubmit = __assign(__assign({}, formData), { payment_schedules: paymentSchedules.map(function (ps, index) { return ({
                            sequence: index + 1,
                            days: ps.days,
                            percentage: ps.percentage,
                            description: ps.description || "Cuota ".concat(index + 1)
                        }); }) });
                    result = void 0;
                    if (!(isEditing && editingPaymentTerms)) return [3 /*break*/, 3];
                    updateData = __assign({ id: editingPaymentTerms.id }, dataToSubmit);
                    return [4 /*yield*/, PaymentTermsService.updatePaymentTerms(editingPaymentTerms.id, updateData)];
                case 2:
                    result = _c.sent();
                    console.log('Payment terms actualizado exitosamente:', result);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, PaymentTermsService.createPaymentTerms(dataToSubmit)];
                case 4:
                    // Crear nuevo payment terms
                    result = _c.sent();
                    console.log('Payment terms creado exitosamente:', result);
                    _c.label = 5;
                case 5:
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(result);
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _c.sent();
                    console.error("Error al ".concat(isEditing ? 'actualizar' : 'crear', " payment terms:"), error_1);
                    if ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) {
                        if (typeof error_1.response.data.detail === 'string') {
                            setValidationErrors([error_1.response.data.detail]);
                        }
                        else if (Array.isArray(error_1.response.data.detail)) {
                            setValidationErrors(error_1.response.data.detail.map(function (err) { return err.msg || err.message || 'Error de validación'; }));
                        }
                    }
                    else {
                        setValidationErrors([error_1.message || "Error al ".concat(isEditing ? 'actualizar' : 'crear', " las condiciones de pago")]);
                    }
                    onError === null || onError === void 0 ? void 0 : onError();
                    return [3 /*break*/, 8];
                case 7:
                    onLoadingChange === null || onLoadingChange === void 0 ? void 0 : onLoadingChange(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var validateForm = useCallback(function () {
        var newErrors = {};
        var newValidationErrors = [];
        // Validar campos básicos
        if (!formData.code.trim()) {
            newErrors.code = 'El código es requerido';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        // Validar payment schedules
        if (paymentSchedules.length === 0) {
            newValidationErrors.push('Debe incluir al menos un cronograma de pago');
        }
        else {
            var totalPercentage = paymentSchedules.reduce(function (sum, ps) { return sum + ps.percentage; }, 0);
            if (Math.abs(totalPercentage - 100) >= 0.000001) {
                newValidationErrors.push("Los porcentajes deben sumar exactamente 100.000000%. Suma actual: ".concat(totalPercentage.toFixed(6), "%"));
            }
            paymentSchedules.forEach(function (schedule, index) {
                if (schedule.days < 0) {
                    newValidationErrors.push("Cronograma ".concat(index + 1, ": Los d\u00EDas deben ser mayor o igual a 0"));
                }
                if (schedule.percentage <= 0 || schedule.percentage > 100) {
                    newValidationErrors.push("Cronograma ".concat(index + 1, ": El porcentaje debe estar entre 0.000001 y 100"));
                }
                // Validar que tenga máximo 6 decimales
                var percentageStr = schedule.percentage.toString();
                var decimalIndex = percentageStr.indexOf('.');
                if (decimalIndex !== -1 && percentageStr.slice(decimalIndex + 1).length > 6) {
                    newValidationErrors.push("Cronograma ".concat(index + 1, ": El porcentaje puede tener m\u00E1ximo 6 decimales"));
                }
            });
            // Validar que los días estén en orden ascendente
            for (var i = 1; i < paymentSchedules.length; i++) {
                if (paymentSchedules[i].days < paymentSchedules[i - 1].days) {
                    newValidationErrors.push('Los días deben estar en orden ascendente');
                    break;
                }
            }
        }
        setErrors(newErrors);
        setValidationErrors(newValidationErrors);
        return Object.keys(newErrors).length === 0 && newValidationErrors.length === 0;
    }, [formData, paymentSchedules]);
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Limpiar error específico
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var addPaymentSchedule = function () {
        var newSchedule = {
            id: "temp-".concat(Date.now()),
            days: paymentSchedules.length > 0 ? Math.max.apply(Math, paymentSchedules.map(function (ps) { return ps.days; })) + 30 : 30,
            percentage: 0,
            description: "Cuota ".concat(paymentSchedules.length + 1)
        };
        setPaymentSchedules(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newSchedule], false); });
    };
    var removePaymentSchedule = function (id) {
        if (paymentSchedules.length > 1) {
            setPaymentSchedules(function (prev) { return prev.filter(function (ps) { return ps.id !== id; }); });
        }
    };
    var updatePaymentSchedule = function (id, field, value) {
        setPaymentSchedules(function (prev) { return prev.map(function (ps) {
            var _a;
            return ps.id === id ? __assign(__assign({}, ps), (_a = {}, _a[field] = value, _a)) : ps;
        }); });
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    return [4 /*yield*/, submitForm()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input label="Código" value={formData.code} onChange={function (e) { return handleInputChange('code', e.target.value); }} error={errors.code} placeholder="ej: 30D, 30-60, CONTADO" required/>
        </div>
        <div>
          <Input label="Nombre" value={formData.name} onChange={function (e) { return handleInputChange('name', e.target.value); }} error={errors.name} placeholder="ej: 30 días, Contado" required/>
        </div>
      </div>

      <div>
        <Input label="Descripción" value={formData.description} onChange={function (e) { return handleInputChange('description', e.target.value); }} placeholder="Descripción detallada de las condiciones de pago"/>
      </div>

      <div>
        <Input label="Notas" value={formData.notes} onChange={function (e) { return handleInputChange('notes', e.target.value); }} placeholder="Notas adicionales (opcional)"/>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={function (e) { return handleInputChange('is_active', e.target.checked); }} className="mr-2"/>
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Activo
        </label>
      </div>

      {/* Cronograma de pagos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Cronograma de Pagos</h3>
          <Button type="button" onClick={addPaymentSchedule} variant="secondary" size="sm">
            ➕ Agregar Cuota
          </Button>
        </div>

        <div className="space-y-3">
          {paymentSchedules.map(function (schedule, index) { return (<div key={schedule.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Cuota {index + 1}</h4>
                {paymentSchedules.length > 1 && (<Button type="button" onClick={function () { return removePaymentSchedule(schedule.id); }} variant="secondary" size="sm" className="text-red-600 hover:text-red-800">
                    ✕
                  </Button>)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Input label="Días" type="number" value={schedule.days} onChange={function (e) { return updatePaymentSchedule(schedule.id, 'days', parseInt(e.target.value) || 0); }} min="0" placeholder="0"/>
                </div>
                <div>
                  <Input label="Porcentaje (%)" type="number" value={schedule.percentage} onChange={function (e) { return updatePaymentSchedule(schedule.id, 'percentage', parseFloat(e.target.value) || 0); }} min="0.01" max="100" step="0.01" placeholder="100"/>
                </div>
                <div>
                  <Input label="Descripción" value={schedule.description || ''} onChange={function (e) { return updatePaymentSchedule(schedule.id, 'description', e.target.value); }} placeholder={"Cuota ".concat(index + 1)}/>
                </div>
              </div>
            </div>); })}
        </div>        {/* Resumen del cronograma */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Resumen:</strong> {paymentSchedules.length} cuota(s) •            Total: {paymentSchedules.reduce(function (sum, ps) { return sum + (Number(ps.percentage) || 0); }, 0).toFixed(6)}% • 
            Plazo máximo: {paymentSchedules.length > 0 ? Math.max.apply(Math, paymentSchedules.map(function (ps) { return Number(ps.days) || 0; })) : 0} días
          </div>
        </div>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (<div className="space-y-1">
          {validationErrors.map(function (error, index) { return (<ValidationMessage key={index} type="error" message={error}/>); })}
        </div>)}
    </form>);
};
