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
/**
 * Página de creación de journals
 * Formulario para crear nuevos journals
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { JournalAPI } from '../api/journalAPI';
import { JournalTypeConst, JournalTypeLabels } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AccountSearchInput } from '@/components/ui/AccountSearchInput';
import { useToast } from '@/shared/contexts/ToastContext';
import { ArrowLeftIcon, SaveIcon } from '@/shared/components/icons';
export function JournalCreatePage() {
    var _this = this;
    var _a, _b, _c, _d;
    var navigate = useNavigate();
    var _e = useToast(), showSuccess = _e.showSuccess, showError = _e.showError;
    var _f = useState(false), isSubmitting = _f[0], setIsSubmitting = _f[1];
    // Form setup
    var _g = useForm({
        defaultValues: {
            name: '',
            code: '',
            type: 'sale',
            sequence_prefix: '',
            sequence_padding: 4,
            include_year_in_sequence: true,
            reset_sequence_yearly: true,
            requires_validation: false,
            allow_manual_entries: true,
            is_active: true,
            description: '',
        },
    }), register = _g.register, handleSubmit = _g.handleSubmit, watch = _g.watch, setValue = _g.setValue, errors = _g.formState.errors;
    // Watch para auto-generar código y prefijo
    var watchedName = watch('name');
    var watchedType = watch('type');
    // Auto-generar código basado en el nombre
    var generateCode = function (name) {
        if (!name)
            return '';
        return name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 10);
    };
    // Auto-generar prefijo basado en tipo y nombre
    var generatePrefix = function (type, name) {
        var typeMap = {
            sale: 'VEN',
            purchase: 'COM',
            cash: 'CAJ',
            bank: 'BCO',
            miscellaneous: 'MIS',
        };
        var basePrefix = typeMap[type] || 'GEN';
        if (!name)
            return basePrefix;
        var namePrefix = name
            .split(' ')
            .map(function (word) { return word.charAt(0); })
            .join('')
            .toUpperCase()
            .substring(0, 3);
        return "".concat(basePrefix).concat(namePrefix).substring(0, 10);
    };
    // Handlers
    var handleNameChange = function (value) {
        setValue('name', value);
        if (value) {
            setValue('code', generateCode(value));
            setValue('sequence_prefix', generatePrefix(watchedType, value));
        }
    };
    var handleTypeChange = function (value) {
        setValue('type', value);
        if (watchedName) {
            setValue('sequence_prefix', generatePrefix(value, watchedName));
        }
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var journalData, newJournal, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsSubmitting(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    journalData = __assign(__assign({}, data), { default_account_id: data.default_account_id || undefined });
                    return [4 /*yield*/, JournalAPI.createJournal(journalData)];
                case 2:
                    newJournal = _c.sent();
                    showSuccess('Journal creado exitosamente');
                    navigate("/journals/".concat(newJournal.id));
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    console.error('Error al crear journal:', error_1);
                    showError(((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) ||
                        'Error al crear el journal. Por favor, intente nuevamente.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () {
        navigate('/journals');
    };
    // Opciones para selects
    var typeOptions = [{ value: JournalTypeConst.SALE, label: JournalTypeLabels.sale },
        { value: JournalTypeConst.PURCHASE, label: JournalTypeLabels.purchase },
        { value: JournalTypeConst.CASH, label: JournalTypeLabels.cash },
        { value: JournalTypeConst.BANK, label: JournalTypeLabels.bank },
        { value: JournalTypeConst.MISCELLANEOUS, label: JournalTypeLabels.miscellaneous },
    ];
    var paddingOptions = [
        { value: '3', label: '3 dígitos (001)' },
        { value: '4', label: '4 dígitos (0001)' },
        { value: '5', label: '5 dígitos (00001)' },
        { value: '6', label: '6 dígitos (000001)' },
    ];
    return (<div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2"/>
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Journal</h1>
              <p className="text-gray-600">Crear un nuevo diario contable</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div>
                <Label htmlFor="name">
                  Nombre del Journal *
                </Label>
                <Input id="name" {...register('name', {
        required: 'El nombre es obligatorio',
        minLength: { value: 2, message: 'Mínimo 2 caracteres' },
    })} onChange={function (e) { return handleNameChange(e.target.value); }} placeholder="Ej: Ventas General" error={(_a = errors.name) === null || _a === void 0 ? void 0 : _a.message}/>
              </div>              <div>
                <Label htmlFor="type">
                  Tipo de Journal *
                </Label>
                <Select value={watch('type')} onChange={function (value) { return handleTypeChange(value); }} options={typeOptions}/>
                {errors.type && (<p className="mt-1 text-sm text-red-600">{errors.type.message}</p>)}
              </div>              <div>
                <Label htmlFor="code">
                  Código *
                </Label>
                <Input id="code" {...register('code', {
        required: 'El código es obligatorio',
        pattern: {
            value: /^[A-Z0-9]+$/,
            message: 'Solo letras mayúsculas y números',
        },
    })} placeholder="Ej: VENGEN" maxLength={10} error={(_b = errors.code) === null || _b === void 0 ? void 0 : _b.message}/>
                <p className="mt-1 text-xs text-gray-500">
                  Código único del journal (solo letras mayúsculas y números)
                </p>
              </div>              <div>
                <Label htmlFor="sequence_prefix">
                  Prefijo de Secuencia *
                </Label>
                <Input id="sequence_prefix" {...register('sequence_prefix', {
        required: 'El prefijo es obligatorio',
        pattern: {
            value: /^[A-Z0-9]+$/,
            message: 'Solo letras mayúsculas y números',
        },
    })} placeholder="Ej: VEN" maxLength={10} error={(_c = errors.sequence_prefix) === null || _c === void 0 ? void 0 : _c.message}/>
                <p className="mt-1 text-xs text-gray-500">
                  Prefijo para los números de secuencia (ej: VEN/2025/0001)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description">
                Descripción
              </Label>
              <Textarea id="description" {...register('description')} placeholder="Descripción opcional del propósito del journal" rows={3}/>
            </div>
          </Card>

          {/* Configuración de secuencia */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración de Secuencia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="sequence_padding">
                  Relleno de Secuencia
                </Label>
                <Select value={((_d = watch('sequence_padding')) === null || _d === void 0 ? void 0 : _d.toString()) || '4'} onChange={function (value) { return setValue('sequence_padding', Number(value)); }} options={paddingOptions}/>
                <p className="mt-1 text-xs text-gray-500">
                  Número de dígitos para el contador
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input type="checkbox" id="include_year_in_sequence" {...register('include_year_in_sequence')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <Label htmlFor="include_year_in_sequence" className="!mb-0">
                  Incluir año en secuencia
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input type="checkbox" id="reset_sequence_yearly" {...register('reset_sequence_yearly')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <Label htmlFor="reset_sequence_yearly" className="!mb-0">
                  Resetear secuencia anualmente
                </Label>
              </div>
            </div>
          </Card>

          {/* Configuración avanzada */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración Avanzada
            </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="default_account_id">
                  Cuenta Contable por Defecto
                </Label>                <AccountSearchInput value={watch('default_account_id')} onChange={function (accountId) {
            setValue('default_account_id', accountId);
        }} placeholder="Buscar cuenta contable..." limit={15}/>
                <p className="mt-1 text-xs text-gray-500">
                  Cuenta contable que se usará por defecto en los asientos
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="requires_validation" {...register('requires_validation')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <Label htmlFor="requires_validation" className="!mb-0">
                    Requiere validación
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="allow_manual_entries" {...register('allow_manual_entries')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <Label htmlFor="allow_manual_entries" className="!mb-0">
                    Permitir asientos manuales
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="is_active" {...register('is_active')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <Label htmlFor="is_active" className="!mb-0">
                    Journal activo
                  </Label>
                </div>
              </div>
            </div>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={handleCancel} variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (<>
                  <LoadingSpinner size="sm" className="mr-2"/>
                  Creando...
                </>) : (<>
                  <SaveIcon className="h-4 w-4 mr-2"/>
                  Crear Journal
                </>)}
            </Button>
          </div>
        </form>
      </div>
    </div>);
}
export default JournalCreatePage;
