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
 * Página de edición de journal
 * Permite editar un journal existente
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useJournal } from '../hooks/useJournals';
import { JournalTypeLabels } from '../types';
import { JournalAPI } from '../api/journalAPI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AccountSearchInput } from '@/components/ui/AccountSearchInput';
import { useToast } from '@/shared/contexts/ToastContext';
import { ArrowLeftIcon, SaveIcon } from '@/shared/components/icons';
export function JournalEditPage() {
    var _this = this;
    var _a, _b;
    var id = useParams().id;
    var navigate = useNavigate();
    var _c = useToast(), showSuccess = _c.showSuccess, showError = _c.showError;
    // Estados
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    // Hooks
    var _e = useJournal(id), journal = _e.journal, fetchLoading = _e.loading, error = _e.error;
    // Form setup
    var _f = useForm({
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
    }), register = _f.register, handleSubmit = _f.handleSubmit, reset = _f.reset, watch = _f.watch, setValue = _f.setValue, _g = _f.formState, errors = _g.errors, isDirty = _g.isDirty;
    // Efectos
    useEffect(function () {
        if (journal) {
            reset({
                name: journal.name,
                code: journal.code,
                type: journal.type,
                sequence_prefix: journal.sequence_prefix,
                default_account_id: journal.default_account_id || undefined,
                sequence_padding: journal.sequence_padding,
                include_year_in_sequence: journal.include_year_in_sequence,
                reset_sequence_yearly: journal.reset_sequence_yearly,
                requires_validation: journal.requires_validation,
                allow_manual_entries: journal.allow_manual_entries,
                is_active: journal.is_active,
                description: journal.description || '',
            });
        }
    }, [journal, reset]);
    // Handlers
    var handleGoBack = function () {
        if (isDirty) {
            var confirmLeave = window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.');
            if (!confirmLeave)
                return;
        }
        navigate("/journals/".concat(id));
    };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var updateData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsSubmitting(true);
                    updateData = {
                        name: data.name,
                        default_account_id: data.default_account_id || undefined,
                        sequence_padding: data.sequence_padding,
                        include_year_in_sequence: data.include_year_in_sequence,
                        reset_sequence_yearly: data.reset_sequence_yearly,
                        requires_validation: data.requires_validation,
                        allow_manual_entries: data.allow_manual_entries,
                        is_active: data.is_active,
                        description: data.description,
                    };
                    return [4 /*yield*/, JournalAPI.updateJournal(id, updateData)];
                case 2:
                    _a.sent();
                    showSuccess('Journal actualizado exitosamente');
                    navigate("/journals/".concat(id));
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al actualizar journal:', error_1);
                    showError('Error al actualizar el journal');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Loading
    if (fetchLoading) {
        return (<div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>);
    }
    // Error
    if (error) {
        return (<div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el journal</p>
          <Button variant="secondary" onClick={function () { return navigate('/journals'); }}>
            <ArrowLeftIcon className="w-4 h-4 mr-2"/>
            Volver al listado
          </Button>
        </div>
      </div>);
    }
    if (!journal) {
        return (<div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Journal no encontrado</p>
          <Button variant="secondary" onClick={function () { return navigate('/journals'); }}>
            <ArrowLeftIcon className="w-4 h-4 mr-2"/>
            Volver al listado
          </Button>
        </div>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeftIcon className="w-4 h-4 mr-2"/>
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Journal
            </h1>
            <p className="text-gray-600">
              {journal.name} ({journal.code})
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" {...register('name', { required: 'El nombre es obligatorio' })} error={(_a = errors.name) === null || _a === void 0 ? void 0 : _a.message}/>
              </div>

              <div>
                <Label htmlFor="code">Código</Label>
                <Input id="code" {...register('code')} disabled helperText="El código no se puede modificar"/>
              </div>              <div>
                <Label htmlFor="type">Tipo</Label>
                <select id="type" {...register('type')} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                  {Object.entries(JournalTypeLabels).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                      {label}
                    </option>);
        })}
                </select>
                <p className="mt-1 text-sm text-gray-500">El tipo no se puede modificar</p>
              </div>              <div>
                <Label htmlFor="sequence_prefix">Prefijo de Secuencia</Label>
                <Input id="sequence_prefix" {...register('sequence_prefix')} disabled helperText="El prefijo no se puede modificar"/>
              </div>
            </div>

            {/* Cuenta por defecto */}
            <div className="mt-6">
              <Label htmlFor="default_account_id">
                Cuenta Contable por Defecto
              </Label>
              <AccountSearchInput value={watch('default_account_id')} onChange={function (accountId) {
            setValue('default_account_id', accountId);
        }} placeholder="Buscar cuenta contable..." limit={15}/>
              <p className="mt-1 text-xs text-gray-500">
                Cuenta contable que se usará por defecto en los asientos
              </p>
            </div>
          </div>

          {/* Configuración de secuencia */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuración de Secuencia
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sequence_padding">Relleno de Secuencia</Label>
                <Input id="sequence_padding" type="number" min="1" max="10" {...register('sequence_padding', {
        valueAsNumber: true,
        min: { value: 1, message: 'Mínimo 1' },
        max: { value: 10, message: 'Máximo 10' }
    })} error={(_b = errors.sequence_padding) === null || _b === void 0 ? void 0 : _b.message} helperText="Número de dígitos en la secuencia (ej: 4 = 0001)"/>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input id="include_year_in_sequence" type="checkbox" {...register('include_year_in_sequence')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                  <Label htmlFor="include_year_in_sequence" className="ml-2">
                    Incluir año en secuencia
                  </Label>
                </div>

                <div className="flex items-center">
                  <input id="reset_sequence_yearly" type="checkbox" {...register('reset_sequence_yearly')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                  <Label htmlFor="reset_sequence_yearly" className="ml-2">
                    Resetear secuencia anualmente
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de validación */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuración de Validación
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input id="requires_validation" type="checkbox" {...register('requires_validation')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                <Label htmlFor="requires_validation" className="ml-2">
                  Requiere validación para asientos
                </Label>
              </div>

              <div className="flex items-center">
                <input id="allow_manual_entries" type="checkbox" {...register('allow_manual_entries')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                <Label htmlFor="allow_manual_entries" className="ml-2">
                  Permitir asientos manuales
                </Label>
              </div>

              <div className="flex items-center">
                <input id="is_active" type="checkbox" {...register('is_active')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                <Label htmlFor="is_active" className="ml-2">
                  Activo
                </Label>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} rows={3} placeholder="Descripción opcional del journal..."/>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleGoBack} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty} isLoading={isSubmitting}>
              <SaveIcon className="w-4 h-4 mr-2"/>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </Card>
      </form>
    </div>);
}
export default JournalEditPage;
