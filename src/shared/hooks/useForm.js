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
import { useState, useCallback, useEffect } from 'react';
export var useForm = function (_a) {
    var initialData = _a.initialData, validate = _a.validate, onSubmit = _a.onSubmit;
    var _b = useState({
        data: initialData,
        errors: [],
        isSubmitting: false,
        isDirty: false
    }), formState = _b[0], setFormState = _b[1];
    var updateField = useCallback(function (field, value) {
        setFormState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { data: __assign(__assign({}, prev.data), (_a = {}, _a[field] = value, _a)), isDirty: true, errors: prev.errors.filter(function (error) { return error.field !== field; }) }));
        });
    }, []);
    var setErrors = useCallback(function (errors) {
        setFormState(function (prev) { return (__assign(__assign({}, prev), { errors: errors })); });
    }, []);
    var clearErrors = useCallback(function () {
        setFormState(function (prev) { return (__assign(__assign({}, prev), { errors: [] })); });
    }, []);
    var reset = useCallback(function () {
        setFormState({
            data: initialData,
            errors: [],
            isSubmitting: false,
            isDirty: false
        });
    }, [initialData]);
    // Reset form when initialData changes
    useEffect(function () {
        setFormState({
            data: initialData,
            errors: [],
            isSubmitting: false,
            isDirty: false
        });
    }, [initialData]);
    var handleSubmit = useCallback(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var validationErrors, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔥 handleSubmit ejecutado - evento:', e);
                    if (e) {
                        e.preventDefault();
                    }
                    validationErrors = validate ? validate(formState.data) : [];
                    console.log('🔥 Datos del formulario:', formState.data);
                    console.log('🔥 Errores de validación:', validationErrors);
                    if (validationErrors.length > 0) {
                        console.log('❌ Formulario no enviado debido a errores de validación:', validationErrors);
                        setErrors(validationErrors);
                        return [2 /*return*/];
                    }
                    if (!onSubmit) {
                        console.log('🔥 No hay función onSubmit');
                        return [2 /*return*/];
                    }
                    console.log('🔥 Ejecutando onSubmit con datos:', formState.data);
                    setFormState(function (prev) { return (__assign(__assign({}, prev), { isSubmitting: true, errors: [] })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onSubmit(formState.data)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.log('🔥 Error en onSubmit:', error_1);
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Error en el formulario';
                    setErrors([{ field: 'general', message: errorMessage }]);
                    return [3 /*break*/, 5];
                case 4:
                    setFormState(function (prev) { return (__assign(__assign({}, prev), { isSubmitting: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [formState.data, validate, onSubmit]);
    var getFieldError = useCallback(function (field) {
        var _a;
        return (_a = formState.errors.find(function (error) { return error.field === field; })) === null || _a === void 0 ? void 0 : _a.message;
    }, [formState.errors]);
    var hasErrors = formState.errors.length > 0;
    var canSubmit = !formState.isSubmitting && formState.isDirty && !hasErrors;
    return {
        data: formState.data,
        errors: formState.errors,
        isSubmitting: formState.isSubmitting,
        isDirty: formState.isDirty,
        hasErrors: hasErrors,
        canSubmit: canSubmit,
        updateField: updateField,
        setErrors: setErrors,
        clearErrors: clearErrors,
        reset: reset,
        handleSubmit: handleSubmit,
        getFieldError: getFieldError
    };
};
