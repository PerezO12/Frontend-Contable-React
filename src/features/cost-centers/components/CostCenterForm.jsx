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
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenters, useCostCenter } from '../hooks';
export var CostCenterForm = function (_a) {
    var onSuccess = _a.onSuccess, onCancel = _a.onCancel, initialData = _a.initialData, _b = _a.isEditMode, isEditMode = _b === void 0 ? false : _b, costCenterId = _a.costCenterId;
    var _c = useCostCenters(), createCostCenter = _c.createCostCenter, updateCostCenter = _c.updateCostCenter, loading = _c.loading;
    var costCenters = useCostCenters({ is_active: true }).costCenters;
    var existingCostCenter = useCostCenter(costCenterId).costCenter;
    // Estado del formulario
    var _d = useState({
        code: '',
        name: '',
        description: '',
        parent_id: '',
        is_active: true
    }), values = _d[0], setValues = _d[1];
    var _e = useState({}), errors = _e[0], setErrors = _e[1];
    // Inicializar valores
    useEffect(function () {
        var _a;
        if (isEditMode && existingCostCenter) {
            setValues({
                code: existingCostCenter.code,
                name: existingCostCenter.name,
                description: existingCostCenter.description || '',
                parent_id: existingCostCenter.parent_id || '',
                is_active: existingCostCenter.is_active
            });
        }
        else if (initialData) {
            setValues({
                code: initialData.code || '',
                name: initialData.name || '',
                description: initialData.description || '',
                parent_id: initialData.parent_id || '',
                is_active: (_a = initialData.is_active) !== null && _a !== void 0 ? _a : true
            });
        }
    }, [isEditMode, existingCostCenter, initialData]);
    var handleInputChange = function (field) { return function (e) {
        var value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setValues(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    }; };
    var validateForm = function () {
        var newErrors = {};
        if (!values.code && !isEditMode) {
            newErrors.code = 'El código es requerido';
        }
        if (!values.name) {
            newErrors.name = 'El nombre es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = useCallback(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, result, createData, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    if (!(isEditMode && costCenterId)) return [3 /*break*/, 2];
                    updateData = {
                        name: values.name,
                        description: values.description || undefined,
                        parent_id: values.parent_id || undefined,
                        is_active: values.is_active
                    };
                    return [4 /*yield*/, updateCostCenter(costCenterId, updateData)];
                case 1:
                    result = _a.sent();
                    if (result && onSuccess) {
                        onSuccess(result);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    createData = {
                        code: values.code,
                        name: values.name,
                        description: values.description || undefined,
                        parent_id: values.parent_id || undefined,
                        is_active: values.is_active
                    };
                    return [4 /*yield*/, createCostCenter(createData)];
                case 3:
                    result = _a.sent();
                    if (result && onSuccess) {
                        onSuccess(result);
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [values, isEditMode, costCenterId, updateCostCenter, createCostCenter, onSuccess]);
    // Filtrar centros de costo para el select de padre
    var getFilteredParentCostCenters = function () {
        return costCenters.filter(function (cc) {
            // No puede ser padre de sí mismo
            if (isEditMode && existingCostCenter && cc.id === existingCostCenter.id)
                return false;
            // No puede ser padre uno de sus descendientes
            if (isEditMode && existingCostCenter && cc.full_code.startsWith(existingCostCenter.full_code + '.'))
                return false;
            return cc.is_active;
        });
    };
    if (isEditMode && costCenterId && !existingCostCenter && loading) {
        return (<Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg"/>
          <p className="text-gray-600 mt-2">Cargando información del centro de costo...</p>
        </div>
      </Card>);
    }
    return (<Card>
      <div className="card-header">
        <h3 className="card-title">
          {isEditMode ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Código */}
          {!isEditMode && (<div>
              <label htmlFor="code" className="form-label">
                Código *
              </label>
              <Input id="code" value={values.code} onChange={handleInputChange('code')} placeholder="Ej: ADM001, VEN001, PROD001..." className={errors.code ? 'border-red-500' : ''} disabled={loading}/>
              {errors.code && (<p className="text-red-500 text-sm mt-1">{errors.code}</p>)}
            </div>)}

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="form-label">
              Nombre *
            </label>
            <Input id="name" value={values.name} onChange={handleInputChange('name')} placeholder="Nombre descriptivo del centro de costo" className={errors.name ? 'border-red-500' : ''} disabled={loading}/>
            {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name}</p>)}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea id="description" value={values.description} onChange={handleInputChange('description')} rows={3} className="form-textarea" placeholder="Descripción detallada del propósito del centro de costo..." disabled={loading}/>
          </div>

          {/* Centro de Costo Padre */}
          <div>
            <label htmlFor="parent_id" className="form-label">
              Centro de Costo Padre
            </label>
            <select id="parent_id" value={values.parent_id} onChange={handleInputChange('parent_id')} className="form-select" disabled={loading}>
              <option value="">Sin padre (Centro de nivel raíz)</option>
              {getFilteredParentCostCenters().map(function (cc) { return (<option key={cc.id} value={cc.id}>
                  {cc.code} - {cc.name}
                </option>); })}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona un centro padre para crear una estructura jerárquica
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center">
              <input type="checkbox" checked={values.is_active} onChange={handleInputChange('is_active')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled={loading}/>
              <span className="ml-2 text-sm text-gray-700">
                Centro de costo activo
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Solo los centros activos pueden recibir asignaciones de movimientos contables
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            {onCancel && (<Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>)}
            <Button type="submit" disabled={loading} className="flex items-center space-x-2">
              {loading && <Spinner size="sm"/>}
              <span>{isEditMode ? 'Actualizar' : 'Crear'} Centro de Costo</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>);
};
