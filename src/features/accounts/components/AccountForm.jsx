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
import React, { useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useAccounts } from '../hooks';
import { accountCreateSchema, accountUpdateSchema, AccountType, AccountCategory, ACCOUNT_TYPE_LABELS, ACCOUNT_CATEGORY_LABELS, CASH_FLOW_CATEGORY_LABELS, CASH_FLOW_CATEGORY_DESCRIPTIONS, getRecommendedCashFlowCategories, getDefaultCashFlowCategory } from '../types';
export var AccountForm = function (_a) {
    var _b, _c, _d, _e;
    var onSuccess = _a.onSuccess, onCancel = _a.onCancel, parentAccount = _a.parentAccount, initialData = _a.initialData, _f = _a.isEditMode, isEditMode = _f === void 0 ? false : _f, accountId = _a.accountId;
    console.log('🔍 AccountForm renderizado con:', {
        isEditMode: isEditMode,
        accountId: accountId,
        hasInitialData: !!initialData,
        initialDataKeys: initialData ? Object.keys(initialData) : []
    });
    var _g = useAccounts(), createAccount = _g.createAccount, updateAccount = _g.updateAccount, loading = _g.loading;
    var _h = useForm({ initialData: {
            code: (initialData === null || initialData === void 0 ? void 0 : initialData.code) || '',
            name: (initialData === null || initialData === void 0 ? void 0 : initialData.name) || '',
            description: (initialData === null || initialData === void 0 ? void 0 : initialData.description) || '',
            account_type: (initialData === null || initialData === void 0 ? void 0 : initialData.account_type) || AccountType.ACTIVO,
            category: (initialData === null || initialData === void 0 ? void 0 : initialData.category) || AccountCategory.ACTIVO_CORRIENTE,
            cash_flow_category: initialData === null || initialData === void 0 ? void 0 : initialData.cash_flow_category,
            parent_id: (parentAccount === null || parentAccount === void 0 ? void 0 : parentAccount.id) || (initialData === null || initialData === void 0 ? void 0 : initialData.parent_id),
            is_active: (_b = initialData === null || initialData === void 0 ? void 0 : initialData.is_active) !== null && _b !== void 0 ? _b : true,
            allows_movements: (_c = initialData === null || initialData === void 0 ? void 0 : initialData.allows_movements) !== null && _c !== void 0 ? _c : true,
            requires_third_party: (_d = initialData === null || initialData === void 0 ? void 0 : initialData.requires_third_party) !== null && _d !== void 0 ? _d : false,
            requires_cost_center: (_e = initialData === null || initialData === void 0 ? void 0 : initialData.requires_cost_center) !== null && _e !== void 0 ? _e : false,
            notes: (initialData === null || initialData === void 0 ? void 0 : initialData.notes) || ''
        }, validate: function (data) {
            // Usar diferente schema según el modo
            var schema = isEditMode ? accountUpdateSchema : accountCreateSchema;
            var result = schema.safeParse(data);
            if (!result.success) {
                return result.error.errors.map(function (err) { return ({
                    field: err.path.join('.'),
                    message: err.message
                }); });
            }
            return [];
        }, onSubmit: function (formData) { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, result, cleanedData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🚀 onSubmit ejecutado con:', {
                            isEditMode: isEditMode,
                            accountId: accountId,
                            formData: formData
                        });
                        if (!(isEditMode && accountId)) return [3 /*break*/, 2];
                        updateData = {
                            name: formData.name,
                            description: formData.description,
                            category: formData.category,
                            cash_flow_category: formData.cash_flow_category === '' ? undefined : formData.cash_flow_category,
                            is_active: formData.is_active,
                            allows_movements: formData.allows_movements,
                            requires_third_party: formData.requires_third_party,
                            requires_cost_center: formData.requires_cost_center,
                            notes: formData.notes
                        };
                        console.log('Datos de actualización filtrados:', updateData);
                        return [4 /*yield*/, updateAccount(accountId, updateData)];
                    case 1:
                        result = _a.sent();
                        if (result && onSuccess) {
                            onSuccess(result);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        cleanedData = __assign(__assign({}, formData), { cash_flow_category: formData.cash_flow_category === '' ? undefined : formData.cash_flow_category });
                        return [4 /*yield*/, createAccount(cleanedData)];
                    case 3:
                        result = _a.sent();
                        if (result && onSuccess) {
                            onSuccess(result);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    }), values = _h.data, updateField = _h.updateField, handleSubmit = _h.handleSubmit, getFieldError = _h.getFieldError;
    var handleInputChange = function (field) {
        return function (e) {
            var value = e.target.value;
            // Handle optional fields: convert empty string to undefined for cash_flow_category
            if (field === 'cash_flow_category' && value === '') {
                updateField(field, undefined);
            }
            else {
                updateField(field, value);
            }
        };
    };
    var handleCheckboxChange = function (field) {
        return function (e) {
            updateField(field, e.target.checked);
        };
    }; // Quitamos la verificación automática en tiempo real para evitar solicitudes innecesarias
    // Ahora se verificará solo al enviar el formulario
    // Get available categories based on account type
    var getAvailableCategories = function (accountType) {
        var _a;
        var categoryMapping = (_a = {},
            _a[AccountType.ACTIVO] = [
                AccountCategory.ACTIVO_CORRIENTE,
                AccountCategory.ACTIVO_NO_CORRIENTE
            ],
            _a[AccountType.PASIVO] = [
                AccountCategory.PASIVO_CORRIENTE,
                AccountCategory.PASIVO_NO_CORRIENTE
            ],
            _a[AccountType.PATRIMONIO] = [
                AccountCategory.CAPITAL,
                AccountCategory.RESERVAS,
                AccountCategory.RESULTADOS
            ],
            _a[AccountType.INGRESO] = [
                AccountCategory.INGRESOS_OPERACIONALES,
                AccountCategory.INGRESOS_NO_OPERACIONALES
            ],
            _a[AccountType.GASTO] = [
                AccountCategory.GASTOS_OPERACIONALES,
                AccountCategory.GASTOS_NO_OPERACIONALES
            ],
            _a[AccountType.COSTOS] = [
                AccountCategory.COSTO_VENTAS,
                AccountCategory.COSTOS_PRODUCCION
            ],
            _a);
        return categoryMapping[accountType] || [];
    };
    var availableCategories = getAvailableCategories(values.account_type); // Update category when account type changes
    useEffect(function () {
        if (availableCategories.length > 0) {
            var currentCategory_1 = values.category;
            var categoryInList = availableCategories.find(function (cat) { return cat === currentCategory_1; });
            if (!categoryInList) {
                updateField('category', availableCategories[0]);
            }
        }
    }, [values.account_type, availableCategories, values.category, updateField]);
    // Suggest cash flow category when account type or category changes
    useEffect(function () {
        // Only auto-suggest during initial load if no cash flow category is set
        // and only if this is not edit mode (to avoid overwriting existing data)
        if (!isEditMode && !values.cash_flow_category && !(initialData === null || initialData === void 0 ? void 0 : initialData.cash_flow_category)) {
            var suggestedCategory = getDefaultCashFlowCategory(values.account_type, values.category);
            if (suggestedCategory) {
                updateField('cash_flow_category', suggestedCategory);
            }
        }
    }, [values.account_type, values.category, isEditMode, initialData === null || initialData === void 0 ? void 0 : initialData.cash_flow_category, updateField]);
    return (<Card>      <div className="card-header">
        <h3 className="card-title">
          {isEditMode
            ? "Editar Cuenta".concat(parentAccount ? " Hija de ".concat(parentAccount.name) : '')
            : parentAccount ? "Nueva Cuenta Hija de ".concat(parentAccount.name) : 'Nueva Cuenta'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="card-body space-y-6">
        {/* Información de la cuenta padre */}
        {parentAccount && (<div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Cuenta Padre</h4>
            <p className="text-sm text-gray-600">
              <span className="font-mono">{parentAccount.code}</span> - {parentAccount.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tipo: {ACCOUNT_TYPE_LABELS[parentAccount.account_type]} | 
              Nivel: {parentAccount.level + 1}
            </p>
          </div>)}

        {/* Código de la cuenta */}
        <div>
          <label htmlFor="code" className="form-label">
            Código de Cuenta *
          </label>
          <div className="relative">            <Input id="code" name="code" value={values.code} onChange={handleInputChange('code')} placeholder="Ej: 1.1.02.01" className="font-mono" error={getFieldError('code')}/>
          </div>
          {getFieldError('code') && (<ValidationMessage type="error" message={getFieldError('code')}/>)}
          <p className="text-sm text-gray-500 mt-1">
            Use un formato alfanumérico con puntos como separadores (ej: 1.1.02.01)
          </p>
        </div>

        {/* Nombre de la cuenta */}
        <div>
          <label htmlFor="name" className="form-label">
            Nombre de la Cuenta *
          </label>
          <Input id="name" name="name" value={values.name} onChange={handleInputChange('name')} placeholder="Ej: Bancos - Cuenta Corriente" error={getFieldError('name')}/>
          {getFieldError('name') && (<ValidationMessage type="error" message={getFieldError('name')}/>)}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea id="description" name="description" value={values.description || ''} onChange={handleInputChange('description')} rows={3} className="form-textarea" placeholder="Descripción detallada de la cuenta..."/>
          {getFieldError('description') && (<ValidationMessage type="error" message={getFieldError('description')}/>)}
        </div>        {/* Tipo y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="account_type" className="form-label">
              Tipo de Cuenta *
            </label>
            <select id="account_type" name="account_type" value={values.account_type} onChange={handleInputChange('account_type')} className="form-select">
              {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                  {label}
                </option>);
        })}
            </select>
            {getFieldError('account_type') && (<ValidationMessage type="error" message={getFieldError('account_type')}/>)}
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Categoría *
            </label>
            <select id="category" name="category" value={values.category} onChange={handleInputChange('category')} className="form-select">
              {availableCategories.map(function (category) { return (<option key={category} value={category}>
                  {ACCOUNT_CATEGORY_LABELS[category]}
                </option>); })}
            </select>
            {getFieldError('category') && (<ValidationMessage type="error" message={getFieldError('category')}/>)}
          </div>        </div>

        {/* Configuración de la cuenta */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Configuración</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={values.is_active} onChange={handleCheckboxChange('is_active')} className="form-checkbox"/>
              <span className="text-sm text-gray-700">Cuenta activa</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={values.allows_movements} onChange={handleCheckboxChange('allows_movements')} className="form-checkbox"/>
              <span className="text-sm text-gray-700">Permite movimientos</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={values.requires_third_party} onChange={handleCheckboxChange('requires_third_party')} className="form-checkbox"/>
              <span className="text-sm text-gray-700">Requiere tercero</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={values.requires_cost_center} onChange={handleCheckboxChange('requires_cost_center')} className="form-checkbox"/>
              <span className="text-sm text-gray-700">Requiere centro de costo</span>
            </label>          </div>
        </div>

        {/* Categoría de Flujo de Efectivo */}
        <div>
          <label htmlFor="cash_flow_category" className="form-label">
            💧 Categoría de Flujo de Efectivo
          </label>
          <select id="cash_flow_category" name="cash_flow_category" value={values.cash_flow_category || ''} onChange={handleInputChange('cash_flow_category')} className="form-select">
            <option value="">Seleccionar categoría (opcional)</option>
            {getRecommendedCashFlowCategories(values.account_type).map(function (category) { return (<option key={category} value={category}>
                {CASH_FLOW_CATEGORY_LABELS[category]}
              </option>); })}
          </select>
          {getFieldError('cash_flow_category') && (<ValidationMessage type="error" message={getFieldError('cash_flow_category')}/>)}
          <p className="text-sm text-gray-500 mt-1">
            {values.cash_flow_category && CASH_FLOW_CATEGORY_DESCRIPTIONS[values.cash_flow_category]}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 Esta categorización ayuda en la generación automática del Estado de Flujo de Efectivo
          </p>
        </div>

        {/* Notas */}
        <div>
          <label htmlFor="notes" className="form-label">
            Notas
          </label>
          <textarea id="notes" name="notes" value={values.notes || ''} onChange={handleInputChange('notes')} rows={3} className="form-textarea" placeholder="Notas adicionales sobre la cuenta..."/>
          {getFieldError('notes') && (<ValidationMessage type="error" message={getFieldError('notes')}/>)}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (<Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>)}          <Button type="submit" disabled={loading || (!isEditMode && getFieldError('code') !== undefined)} onClick={function () { return console.log('🔘 Click en botón submit - isEditMode:', isEditMode, 'loading:', loading); }}>
            {loading ? <Spinner size="sm"/> : isEditMode ? 'Actualizar Cuenta' : 'Crear Cuenta'}
          </Button>
        </div>
      </form>
    </Card>);
};
