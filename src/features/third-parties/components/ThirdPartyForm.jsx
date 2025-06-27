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
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { ThirdPartyType, DocumentType, THIRD_PARTY_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../types';
export var ThirdPartyForm = function (_a) {
    var thirdParty = _a.thirdParty, onSubmit = _a.onSubmit, onCancel = _a.onCancel, _b = _a.loading, loading = _b === void 0 ? false : _b, mode = _a.mode;
    var _c = useState({
        third_party_type: ThirdPartyType.CUSTOMER,
        document_type: DocumentType.RUT,
        document_number: '',
        name: '',
        commercial_name: '',
        email: '',
        phone: '',
        mobile: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        credit_limit: '',
        payment_terms: '',
        discount_percentage: '',
        bank_name: '',
        bank_account: '',
        is_active: true,
        is_tax_withholding_agent: false,
        tax_id: '',
        notes: '',
        internal_code: '',
        code: ''
    }), formData = _c[0], setFormData = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    useEffect(function () {
        if (thirdParty && mode === 'edit') {
            setFormData({
                third_party_type: thirdParty.third_party_type,
                document_type: thirdParty.document_type,
                document_number: thirdParty.document_number,
                name: thirdParty.name,
                commercial_name: thirdParty.commercial_name || '',
                email: thirdParty.email || '',
                phone: thirdParty.phone || '',
                mobile: thirdParty.mobile || '',
                website: thirdParty.website || '',
                address: thirdParty.address || '',
                city: thirdParty.city || '',
                state: thirdParty.state || '',
                country: thirdParty.country || '',
                postal_code: thirdParty.postal_code || '',
                credit_limit: thirdParty.credit_limit || '',
                payment_terms: thirdParty.payment_terms || '',
                discount_percentage: thirdParty.discount_percentage || '',
                bank_name: thirdParty.bank_name || '',
                bank_account: thirdParty.bank_account || '',
                is_active: thirdParty.is_active,
                is_tax_withholding_agent: thirdParty.is_tax_withholding_agent || false,
                tax_id: thirdParty.tax_id || '',
                notes: thirdParty.notes || '',
                internal_code: thirdParty.internal_code || '',
                code: thirdParty.code || ''
            });
        }
    }, [thirdParty, mode]);
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var validateForm = function () {
        var _a;
        var newErrors = {};
        if (!((_a = formData.code) === null || _a === void 0 ? void 0 : _a.trim())) {
            newErrors.code = 'Código es requerido';
        }
        if (!formData.document_number.trim()) {
            newErrors.document_number = 'Número de documento es requerido';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Nombre/Razón social es requerido';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email no válido';
        }
        if (formData.payment_terms && isNaN(Number(formData.payment_terms))) {
            newErrors.payment_terms = 'Términos de pago debe ser un número';
        }
        if (formData.credit_limit && isNaN(Number(formData.credit_limit))) {
            newErrors.credit_limit = 'Límite de crédito debe ser un número';
        }
        if (formData.discount_percentage && (isNaN(Number(formData.discount_percentage)) || Number(formData.discount_percentage) < 0 || Number(formData.discount_percentage) > 100)) {
            newErrors.discount_percentage = 'Porcentaje de descuento debe ser entre 0 y 100';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    console.log('📋 [ThirdPartyForm] Datos del formulario antes de validación:');
                    console.log('📝 formData:', JSON.stringify(formData, null, 2));
                    if (!validateForm()) {
                        console.log('❌ [ThirdPartyForm] Validación fallida');
                        return [2 /*return*/];
                    }
                    console.log('✅ [ThirdPartyForm] Validación exitosa, enviando datos...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, onSubmit(formData)];
                case 2:
                    _a.sent();
                    console.log('✅ [ThirdPartyForm] Formulario enviado exitosamente');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ [ThirdPartyForm] Error submitting form:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <Input type="text" value={formData.code || ''} onChange={function (e) { return handleInputChange('code', e.target.value); }} error={errors.code} placeholder="Código interno"/>
          </div>

          {/* Tipo de Tercero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Tercero *
            </label>
            <select value={formData.third_party_type} onChange={function (e) { return handleInputChange('third_party_type', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {Object.entries(THIRD_PARTY_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                  {label}
                </option>);
        })}
            </select>
          </div>

          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento *
            </label>
            <select value={formData.document_type} onChange={function (e) { return handleInputChange('document_type', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {Object.entries(DOCUMENT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                  {label}
                </option>);
        })}
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento *
            </label>
            <Input type="text" value={formData.document_number} onChange={function (e) { return handleInputChange('document_number', e.target.value); }} error={errors.document_number} placeholder="Ej: 12345678-9"/>
          </div>

          {/* Nombre/Razón Social */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre/Razón Social *
            </label>
            <Input type="text" value={formData.name} onChange={function (e) { return handleInputChange('name', e.target.value); }} error={errors.name} placeholder="Nombre completo o razón social"/>
          </div>

          {/* Nombre Comercial */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Comercial
            </label>
            <Input type="text" value={formData.commercial_name || ''} onChange={function (e) { return handleInputChange('commercial_name', e.target.value); }} placeholder="Nombre comercial (opcional)"/>
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Tributario
            </label>
            <Input type="text" value={formData.tax_id || ''} onChange={function (e) { return handleInputChange('tax_id', e.target.value); }} placeholder="Identificación tributaria"/>
          </div>

          {/* Agente de Retención */}
          <div className="flex items-center">
            <input type="checkbox" checked={formData.is_tax_withholding_agent || false} onChange={function (e) { return handleInputChange('is_tax_withholding_agent', e.target.checked); }} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
            <label className="text-sm font-medium text-gray-700">
              Agente de Retención
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input type="email" value={formData.email || ''} onChange={function (e) { return handleInputChange('email', e.target.value); }} error={errors.email} placeholder="correo@ejemplo.com"/>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <Input type="text" value={formData.phone || ''} onChange={function (e) { return handleInputChange('phone', e.target.value); }} placeholder="+56 2 1234 5678"/>
          </div>

          {/* Móvil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Móvil
            </label>
            <Input type="text" value={formData.mobile || ''} onChange={function (e) { return handleInputChange('mobile', e.target.value); }} placeholder="+56 9 1234 5678"/>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio Web
            </label>
            <Input type="url" value={formData.website || ''} onChange={function (e) { return handleInputChange('website', e.target.value); }} placeholder="https://www.ejemplo.com"/>
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <Input type="text" value={formData.address || ''} onChange={function (e) { return handleInputChange('address', e.target.value); }} placeholder="Dirección completa"/>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <Input type="text" value={formData.city || ''} onChange={function (e) { return handleInputChange('city', e.target.value); }} placeholder="Ciudad"/>
          </div>

          {/* Estado/Región */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado/Región
            </label>
            <Input type="text" value={formData.state || ''} onChange={function (e) { return handleInputChange('state', e.target.value); }} placeholder="Estado o región"/>
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <Input type="text" value={formData.country || ''} onChange={function (e) { return handleInputChange('country', e.target.value); }} placeholder="País"/>
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal
            </label>
            <Input type="text" value={formData.postal_code || ''} onChange={function (e) { return handleInputChange('postal_code', e.target.value); }} placeholder="Código postal"/>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Financiera</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Límite de Crédito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Crédito
            </label>
            <Input type="text" value={formData.credit_limit || ''} onChange={function (e) { return handleInputChange('credit_limit', e.target.value); }} error={errors.credit_limit} placeholder="0.00"/>
          </div>

          {/* Términos de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Términos de Pago (días)
            </label>
            <Input type="text" value={formData.payment_terms || ''} onChange={function (e) { return handleInputChange('payment_terms', e.target.value); }} error={errors.payment_terms} placeholder="30"/>
          </div>

          {/* Porcentaje de Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de Descuento (%)
            </label>
            <Input type="text" value={formData.discount_percentage || ''} onChange={function (e) { return handleInputChange('discount_percentage', e.target.value); }} error={errors.discount_percentage} placeholder="0.00"/>
          </div>

          {/* Banco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banco
            </label>
            <Input type="text" value={formData.bank_name || ''} onChange={function (e) { return handleInputChange('bank_name', e.target.value); }} placeholder="Nombre del banco"/>
          </div>

          {/* Cuenta Bancaria */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuenta Bancaria
            </label>
            <Input type="text" value={formData.bank_account || ''} onChange={function (e) { return handleInputChange('bank_account', e.target.value); }} placeholder="Número de cuenta bancaria"/>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
        
        <div className="space-y-4">
          {/* Código Interno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Interno
            </label>
            <Input type="text" value={formData.internal_code || ''} onChange={function (e) { return handleInputChange('internal_code', e.target.value); }} placeholder="Código interno de referencia"/>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea value={formData.notes || ''} onChange={function (e) { return handleInputChange('notes', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Notas adicionales..."/>
          </div>

          {/* Estado Activo */}
          <div className="flex items-center">
            <input type="checkbox" checked={formData.is_active} onChange={function (e) { return handleInputChange('is_active', e.target.checked); }} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
            <label className="text-sm font-medium text-gray-700">
              Activo
            </label>
          </div>
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear Tercero' : 'Actualizar Tercero'}
        </Button>
      </div>
    </form>);
};
