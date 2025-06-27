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
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { useAccounts } from '../../accounts/hooks';
import { usePaymentTermsList } from '../../payment-terms/hooks/usePaymentTerms';
import { formatCurrency } from '../../../shared/utils';
import { JournalEntryType } from '../types';
export var JournalEntryEditForm = function (_a) {
    var entryId = _a.entryId, onSuccess = _a.onSuccess, onCancel = _a.onCancel;
    var _b = useJournalEntry(entryId), existingEntry = _b.entry, loadingEntry = _b.loading;
    // Cargar datos dependientes
    var _c = usePaymentTermsList({ autoLoad: true }).paymentTerms, paymentTerms = _c === void 0 ? [] : _c;
    var _d = useAccounts({ is_active: true }).accounts, accounts = _d === void 0 ? [] : _d;
    // Hook para operaciones CRUD
    var updateEntry = useJournalEntries().updateEntry;
    // Preparar datos iniciales del formulario cuando se cargan los datos del backend
    var initialFormData = useMemo(function () {
        var _a, _b, _c;
        if (!existingEntry || loadingEntry) {
            return {
                reference: '',
                description: '',
                entry_type: JournalEntryType.MANUAL,
                entry_date: new Date().toISOString().split('T')[0],
                notes: '',
                external_reference: '',
                third_party_id: '',
                cost_center_id: '',
                payment_terms_id: '',
                invoice_date: '',
                due_date: '',
                lines: []
            };
        }
        console.log('📥 [EDIT] Cargando datos del entry existente:', existingEntry);
        console.log('📥 [EDIT] Líneas originales del backend:', existingEntry.lines);
        console.log('📥 [EDIT] Cantidad de líneas:', (_a = existingEntry.lines) === null || _a === void 0 ? void 0 : _a.length);
        // Obtener valores efectivos de la primera línea para campos de payment terms
        var firstLine = (_b = existingEntry.lines) === null || _b === void 0 ? void 0 : _b[0];
        var effectiveInvoiceDate = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.effective_invoice_date) || (firstLine === null || firstLine === void 0 ? void 0 : firstLine.invoice_date) || '';
        var effectiveDueDate = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.effective_due_date) || (firstLine === null || firstLine === void 0 ? void 0 : firstLine.due_date) || '';
        // Buscar payment_terms_id por código si no está presente
        var paymentTermsId = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.payment_terms_id) || '';
        if (!paymentTermsId && (firstLine === null || firstLine === void 0 ? void 0 : firstLine.payment_terms_code) && paymentTerms.length > 0) {
            var foundPaymentTerm = paymentTerms.find(function (pt) { return pt.code === firstLine.payment_terms_code; });
            if (foundPaymentTerm) {
                paymentTermsId = foundPaymentTerm.id;
            }
        }
        // Mapear todas las líneas con datos enriquecidos
        var mappedLines = ((_c = existingEntry.lines) === null || _c === void 0 ? void 0 : _c.map(function (line, index) {
            var _a;
            console.log("\uD83D\uDCE5 [EDIT] Mapeando l\u00EDnea ".concat(index + 1, ":"), {
                account_id: line.account_id,
                account_name: line.account_name,
                product_id: line.product_id,
                product_name: line.product_name,
                payment_schedule: ((_a = line.payment_schedule) === null || _a === void 0 ? void 0 : _a.length) || 0
            });
            // Usar valores efectivos para fechas
            var lineEffectiveInvoiceDate = line.effective_invoice_date || line.invoice_date || '';
            var lineEffectiveDueDate = line.effective_due_date || line.due_date || '';
            // Buscar payment_terms_id por código si no está presente
            var linePaymentTermsId = line.payment_terms_id || '';
            if (!linePaymentTermsId && line.payment_terms_code && paymentTerms.length > 0) {
                var foundPaymentTerm = paymentTerms.find(function (pt) { return pt.code === line.payment_terms_code; });
                if (foundPaymentTerm) {
                    linePaymentTermsId = foundPaymentTerm.id;
                }
            }
            return {
                // Campos básicos requeridos
                account_id: line.account_id || '',
                debit_amount: String(line.debit_amount) || '0.00',
                credit_amount: String(line.credit_amount) || '0.00',
                description: line.description || '',
                // Campos básicos opcionales
                reference: line.reference || '',
                // Campos enriquecidos - Cuenta
                account_code: line.account_code || '',
                account_name: line.account_name || '',
                // Campos enriquecidos - Tercero
                third_party_id: line.third_party_id || '',
                third_party_code: line.third_party_code || '',
                third_party_name: line.third_party_name || '',
                third_party_document_type: line.third_party_document_type || '',
                third_party_document_number: line.third_party_document_number || '',
                third_party_tax_id: line.third_party_tax_id || '',
                third_party_email: line.third_party_email || '',
                third_party_phone: line.third_party_phone || '',
                third_party_address: line.third_party_address || '',
                third_party_city: line.third_party_city || '',
                third_party_type: line.third_party_type || '',
                // Campos enriquecidos - Centro de costo
                cost_center_id: line.cost_center_id || '',
                cost_center_code: line.cost_center_code || '',
                cost_center_name: line.cost_center_name || '',
                // Campos enriquecidos - Términos de pago
                payment_terms_id: linePaymentTermsId,
                payment_terms_code: line.payment_terms_code || '',
                payment_terms_name: line.payment_terms_name || '',
                payment_terms_description: line.payment_terms_description || '',
                invoice_date: lineEffectiveInvoiceDate,
                due_date: lineEffectiveDueDate,
                effective_invoice_date: line.effective_invoice_date || '',
                effective_due_date: line.effective_due_date || '',
                payment_schedule: line.payment_schedule || [],
                // Campos enriquecidos - Productos
                product_id: line.product_id || '',
                product_code: line.product_code || '',
                product_name: line.product_name || '',
                product_type: line.product_type || '',
                product_measurement_unit: line.product_measurement_unit || '',
                quantity: line.quantity || '',
                unit_price: line.unit_price || '',
                discount_percentage: line.discount_percentage || '',
                discount_amount: line.discount_amount || '',
                tax_percentage: line.tax_percentage || '',
                tax_amount: line.tax_amount || '',
                // Campos calculados
                subtotal_before_discount: line.subtotal_before_discount || '',
                effective_unit_price: line.effective_unit_price || '',
                total_discount: line.total_discount || '',
                subtotal_after_discount: line.subtotal_after_discount || '',
                net_amount: line.net_amount || '',
                gross_amount: line.gross_amount || '',
                amount: line.amount || '',
                movement_type: line.movement_type || ''
            };
        })) || [];
        console.log('📥 [EDIT] Líneas mapeadas:', mappedLines.length);
        console.log('📥 [EDIT] Primera línea mapeada:', mappedLines[0]);
        var formData = {
            reference: existingEntry.reference || '',
            description: existingEntry.description || '',
            entry_type: existingEntry.entry_type || JournalEntryType.MANUAL,
            entry_date: existingEntry.entry_date || new Date().toISOString().split('T')[0],
            notes: existingEntry.notes || '',
            external_reference: existingEntry.external_reference || '',
            // Campos de payment terms a nivel de asiento
            third_party_id: (firstLine === null || firstLine === void 0 ? void 0 : firstLine.third_party_id) || '',
            cost_center_id: (firstLine === null || firstLine === void 0 ? void 0 : firstLine.cost_center_id) || '',
            payment_terms_id: paymentTermsId,
            invoice_date: effectiveInvoiceDate,
            due_date: effectiveDueDate,
            lines: mappedLines
        };
        console.log('📥 [EDIT] Datos finales del formulario:', {
            linesCount: formData.lines.length,
            hasPaymentTerms: !!formData.payment_terms_id,
            hasInvoiceDate: !!formData.invoice_date
        });
        return formData;
    }, [existingEntry, loadingEntry, paymentTerms]);
    // Validación simple para edición
    var formValidate = useCallback(function (data) {
        console.log('🔍 [EDIT] Validando datos:', data);
        var errors = [];
        // Validaciones básicas
        if (!data.description || data.description.trim().length < 3) {
            errors.push({
                field: 'description',
                message: 'La descripción debe tener al menos 3 caracteres'
            });
        }
        if (!data.entry_date || isNaN(Date.parse(data.entry_date))) {
            errors.push({
                field: 'entry_date',
                message: 'Fecha inválida'
            });
        }
        if (!data.lines || data.lines.length < 2) {
            errors.push({
                field: 'lines',
                message: 'Un asiento debe tener al menos 2 líneas'
            });
        }
        console.log('🔍 [EDIT] Errores de validación:', errors);
        return errors;
    }, []);
    // Función de envío
    var formOnSubmit = useCallback(function (formData) { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, updatedEntry, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('🚀 [EDIT] Enviando actualización:', formData);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    updateData = {
                        id: entryId,
                        reference: ((_a = formData.reference) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                        description: ((_b = formData.description) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                        entry_type: formData.entry_type || JournalEntryType.MANUAL,
                        entry_date: formData.entry_date,
                        notes: ((_c = formData.notes) === null || _c === void 0 ? void 0 : _c.trim()) || '',
                        external_reference: ((_d = formData.external_reference) === null || _d === void 0 ? void 0 : _d.trim()) || '', lines: formData.lines
                            .filter(function (line) { return line.account_id &&
                            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0); })
                            .map(function (line) {
                            var _a, _b, _c;
                            return ({
                                account_id: line.account_id,
                                description: ((_a = line.description) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = formData.description) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                                debit_amount: parseFloat(line.debit_amount),
                                credit_amount: parseFloat(line.credit_amount),
                                third_party_id: line.third_party_id || undefined,
                                cost_center_id: line.cost_center_id || undefined,
                                reference: ((_c = line.reference) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                // Campos de productos e facturación
                                product_id: line.product_id || undefined,
                                quantity: line.quantity ? String(line.quantity) : undefined,
                                unit_price: line.unit_price || undefined,
                                discount_percentage: line.discount_percentage || undefined,
                                discount_amount: line.discount_amount || undefined,
                                tax_percentage: line.tax_percentage || undefined,
                                tax_amount: line.tax_amount || undefined,
                                // Campos de términos de pago
                                payment_terms_id: line.payment_terms_id || formData.payment_terms_id || undefined,
                                invoice_date: line.invoice_date || formData.invoice_date || undefined,
                                due_date: line.due_date || formData.due_date || undefined,
                            });
                        })
                    };
                    console.log('🚀 [EDIT] Datos preparados para backend:', updateData);
                    return [4 /*yield*/, updateEntry(entryId, updateData)];
                case 2:
                    updatedEntry = _e.sent();
                    console.log('✅ [EDIT] Asiento actualizado exitosamente:', updatedEntry);
                    if (onSuccess && updatedEntry) {
                        onSuccess(updatedEntry);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _e.sent();
                    console.error('❌ [EDIT] Error al actualizar asiento:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [entryId, updateEntry, onSuccess]);
    // Hook del formulario
    var _e = useForm({
        initialData: initialFormData,
        validate: formValidate,
        onSubmit: formOnSubmit
    }), values = _e.data, updateField = _e.updateField, handleSubmit = _e.handleSubmit, getFieldError = _e.getFieldError, isSubmitting = _e.isSubmitting;
    // Log para depurar el estado del formulario
    useEffect(function () {
        var _a, _b;
        console.log('🔄 [EDIT] Estado del formulario actualizado:', {
            entryId: entryId,
            hasEntry: !!existingEntry,
            linesCount: ((_a = values.lines) === null || _a === void 0 ? void 0 : _a.length) || 0,
            firstLine: ((_b = values.lines) === null || _b === void 0 ? void 0 : _b[0]) ? {
                account_id: values.lines[0].account_id,
                account_name: values.lines[0].account_name,
                product_name: values.lines[0].product_name
            } : null
        });
    }, [entryId, existingEntry, values.lines]);
    // Funciones auxiliares para manejo de líneas
    var addLine = useCallback(function () {
        var newLines = __spreadArray(__spreadArray([], values.lines, true), [{
                account_id: '',
                debit_amount: '0.00',
                credit_amount: '0.00',
                description: ''
            }], false);
        updateField('lines', newLines);
    }, [values.lines, updateField]);
    var removeLine = useCallback(function (index) {
        if (values.lines.length > 2) {
            var newLines = values.lines.filter(function (_, i) { return i !== index; });
            updateField('lines', newLines);
        }
    }, [values.lines, updateField]);
    var updateLine = useCallback(function (index, field, value) {
        var _a;
        var newLines = __spreadArray([], values.lines, true);
        newLines[index] = __assign(__assign({}, newLines[index]), (_a = {}, _a[field] = value, _a));
        updateField('lines', newLines);
    }, [values.lines, updateField]);
    // Hook para cálculos de balance
    var balanceData = useJournalEntryBalance(values.lines);
    var balance = {
        totalDebit: balanceData.total_debit,
        totalCredit: balanceData.total_credit,
        difference: balanceData.difference,
        isBalanced: balanceData.is_balanced
    };
    if (loadingEntry) {
        return (<div className="flex justify-center items-center p-8">
        <Spinner size="lg"/>
      </div>);
    }
    if (!existingEntry) {
        return (<div className="p-4">
        <div className="text-center text-gray-500">
          No se encontró el asiento contable
        </div>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Editar Asiento Contable #{existingEntry.number}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>)}
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || balance.isBalanced === false} className="min-w-[120px]">
            {isSubmitting ? <Spinner size="sm"/> : 'Actualizar'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información Básica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <Input type="text" value={values.reference} onChange={function (e) { return updateField('reference', e.target.value); }} placeholder="Referencia del asiento"/>
              {getFieldError('reference') && (<ValidationMessage message={getFieldError('reference')} type="error"/>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Asiento *
              </label>
              <Input type="date" value={values.entry_date} onChange={function (e) { return updateField('entry_date', e.target.value); }} required/>
              {getFieldError('entry_date') && (<ValidationMessage message={getFieldError('entry_date')} type="error"/>)}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <Input type="text" value={values.description} onChange={function (e) { return updateField('description', e.target.value); }} placeholder="Descripción del asiento contable" required/>
              {getFieldError('description') && (<ValidationMessage message={getFieldError('description')} type="error"/>)}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea value={values.notes} onChange={function (e) { return updateField('notes', e.target.value); }} placeholder="Notas adicionales" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
        </Card>

        {/* Resumen de líneas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Líneas del Asiento ({values.lines.length})
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              Agregar Línea
            </Button>
          </div>

          <div className="space-y-4">
            {values.lines.map(function (line, index) {
            var _a;
            return (<div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Línea {index + 1}
                    {line.account_name && " - ".concat(line.account_name)}
                    {line.product_name && " (".concat(line.product_name, ")")}
                  </span>
                  {values.lines.length > 2 && (<Button type="button" variant="outline" size="sm" onClick={function () { return removeLine(index); }} className="text-red-600 hover:text-red-700">
                      Eliminar
                    </Button>)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cuenta
                    </label>
                    <select value={line.account_id} onChange={function (e) { return updateLine(index, 'account_id', e.target.value); }} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="">Seleccionar cuenta</option>
                      {accounts.map(function (account) { return (<option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>); })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción
                    </label>                    <Input type="text" value={line.description} onChange={function (e) { return updateLine(index, 'description', e.target.value); }} placeholder="Descripción de la línea"/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Débito
                    </label>                    <Input type="number" step="0.01" value={line.debit_amount} onChange={function (e) { return updateLine(index, 'debit_amount', e.target.value); }} placeholder="0.00"/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Crédito
                    </label>                    <Input type="number" step="0.01" value={line.credit_amount} onChange={function (e) { return updateLine(index, 'credit_amount', e.target.value); }} placeholder="0.00"/>
                  </div>
                </div>                {/* Mostrar información enriquecida si existe */}
                {(line.product_name || line.third_party_name || (line.payment_schedule && line.payment_schedule.length > 0)) && (<div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600 space-y-1">
                      {line.product_name && (<div>
                          <strong>Producto:</strong> {line.product_name}
                          {line.quantity && line.unit_price && (<span> ({line.quantity} x {formatCurrency(parseFloat(line.unit_price))})</span>)}
                        </div>)}
                      {line.third_party_name && (<div><strong>Tercero:</strong> {line.third_party_name}</div>)}
                      {line.payment_schedule && line.payment_schedule.length > 0 && (<div>
                          <strong>Cronograma:</strong> {line.payment_schedule.length} cuotas
                          <span className="ml-2">
                            Vence: {(_a = line.payment_schedule[line.payment_schedule.length - 1]) === null || _a === void 0 ? void 0 : _a.payment_date}
                          </span>
                        </div>)}
                    </div>
                  </div>)}
              </div>);
        })}
          </div>

          {/* Balance */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <div className="space-x-4">
                <span>Total Débito: <strong>{formatCurrency(balance.totalDebit)}</strong></span>
                <span>Total Crédito: <strong>{formatCurrency(balance.totalCredit)}</strong></span>
                <span>Diferencia: <strong className={balance.difference === 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(balance.difference))}
                </strong></span>
              </div>
              <div className={"px-2 py-1 rounded text-xs font-medium ".concat(balance.isBalanced
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800')}>
                {balance.isBalanced ? 'Balanceado' : 'Desbalanceado'}
              </div>
            </div>
          </div>

          {getFieldError('lines') && (<ValidationMessage message={getFieldError('lines')} type="error"/>)}
        </Card>
      </form>
    </div>);
};
