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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { usePaymentTermsList } from '../../payment-terms/hooks/usePaymentTerms';
import { useThirdParties } from '../../third-parties/hooks';
import { useCostCenters } from '../../cost-centers/hooks';
import { useAccounts } from '../../accounts/hooks';
import { formatCurrency } from '../../../shared/utils';
import { JournalEntryType } from '../types';
export var JournalEntryEditForm = function (_a) {
    var entryId = _a.entryId, onSuccess = _a.onSuccess, onCancel = _a.onCancel;
    var _b = useJournalEntry(entryId), existingEntry = _b.entry, loadingEntry = _b.loading;
    // Cargar datos dependientes
    var _c = usePaymentTermsList({ autoLoad: true }).paymentTerms, paymentTerms = _c === void 0 ? [] : _c;
    var _d = useThirdParties({ is_active: true }).thirdParties, thirdParties = _d === void 0 ? [] : _d;
    var _e = useCostCenters({ is_active: true }).costCenters, costCenters = _e === void 0 ? [] : _e;
    var _f = useAccounts({ is_active: true }).accounts, accounts = _f === void 0 ? [] : _f;
    // Hook para operaciones CRUD
    var updateEntry = useJournalEntries().updateEntry; // Estados para búsqueda de cuentas
    var _g = useState({}), accountSearchTerms = _g[0], setAccountSearchTerms = _g[1];
    var _h = useState(null), focusedAccountInput = _h[0], setFocusedAccountInput = _h[1];
    // Estados para búsqueda de terceros
    var _j = useState(''), thirdPartySearchTerm = _j[0], setThirdPartySearchTerm = _j[1];
    var _k = useState(false), thirdPartyDropdownOpen = _k[0], setThirdPartyDropdownOpen = _k[1];
    // Preparar datos iniciales del formulario cuando se cargan los datos del backend
    var initialFormData = useMemo(function () {
        var _a, _b, _c, _d, _e;
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
        // Extraer datos generales de la primera línea si existen
        var firstLine = (_b = existingEntry.lines) === null || _b === void 0 ? void 0 : _b[0];
        var generalThirdPartyId = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.third_party_id) || '';
        var generalCostCenterId = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.cost_center_id) || '';
        var generalPaymentTermsId = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.payment_terms_id) || '';
        var generalInvoiceDate = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.invoice_date) || '';
        var generalDueDate = (firstLine === null || firstLine === void 0 ? void 0 : firstLine.due_date) || '';
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
            return {
                // Campos básicos requeridos
                account_id: line.account_id || '',
                debit_amount: String(line.debit_amount) || '0.00',
                credit_amount: String(line.credit_amount) || '0.00',
                description: line.description || '',
                reference: line.reference || '',
                third_party_id: line.third_party_id || '',
                cost_center_id: line.cost_center_id || '',
                payment_terms_id: line.payment_terms_id || '',
                invoice_date: line.invoice_date || '',
                due_date: line.due_date || '',
                product_id: line.product_id || '',
                quantity: line.quantity || '',
                unit_price: line.unit_price || '',
                discount_percentage: line.discount_percentage || '',
                discount_amount: line.discount_amount || '',
                tax_percentage: line.tax_percentage || '',
                tax_amount: line.tax_amount || '',
                // Campos enriquecidos adicionales
                account_code: line.account_code || '',
                account_name: line.account_name || '',
                third_party_name: line.third_party_name || '',
                product_name: line.product_name || '',
                payment_schedule: line.payment_schedule || [],
                payment_terms_name: line.payment_terms_name || ''
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
            transaction_origin: existingEntry.transaction_origin || undefined,
            third_party_id: generalThirdPartyId,
            cost_center_id: generalCostCenterId,
            payment_terms_id: generalPaymentTermsId,
            invoice_date: generalInvoiceDate,
            due_date: generalDueDate,
            lines: mappedLines
        };
        console.log('📥 [EDIT] Datos finales del formulario:', {
            linesCount: formData.lines.length,
            firstLineName: (_d = formData.lines[0]) === null || _d === void 0 ? void 0 : _d.account_name,
            firstLineProduct: (_e = formData.lines[0]) === null || _e === void 0 ? void 0 : _e.product_name
        });
        return formData;
    }, [existingEntry, loadingEntry, paymentTerms]);
    // Validación simple para edición
    var formValidate = useCallback(function (data) {
        console.log('🔍 [EDIT] Validando datos:', data);
        var errors = [];
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
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🚀 [EDIT] Enviando actualización:', formData);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    updateData = {
                        id: entryId,
                        entry_date: formData.entry_date,
                        reference: ((_a = formData.reference) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                        description: ((_b = formData.description) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                        entry_type: formData.entry_type || JournalEntryType.MANUAL,
                        transaction_origin: formData.transaction_origin || undefined,
                        notes: ((_c = formData.notes) === null || _c === void 0 ? void 0 : _c.trim()) || '', lines: formData.lines
                            .filter(function (line) { return line.account_id &&
                            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0); })
                            .map(function (line) {
                            var _a, _b, _c;
                            return ({
                                account_id: line.account_id, description: ((_a = line.description) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = formData.description) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                                debit_amount: parseFloat(line.debit_amount),
                                credit_amount: parseFloat(line.credit_amount),
                                third_party_id: line.third_party_id || formData.third_party_id || undefined,
                                cost_center_id: line.cost_center_id || formData.cost_center_id || undefined,
                                reference: ((_c = line.reference) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                product_id: line.product_id || undefined, quantity: line.quantity || undefined,
                                unit_price: line.unit_price || undefined,
                                discount_percentage: line.discount_percentage || undefined,
                                discount_amount: line.discount_amount || undefined,
                                tax_percentage: line.tax_percentage || undefined,
                                tax_amount: line.tax_amount || undefined,
                                // Campos de payment terms con lógica condicional para evitar conflictos
                                invoice_date: (formData.payment_terms_id && formData.invoice_date) ? formData.invoice_date : undefined,
                                due_date: (!formData.payment_terms_id && formData.due_date) ? formData.due_date : undefined,
                                payment_terms_id: formData.payment_terms_id || undefined
                            });
                        })
                            // Filtrar campos undefined/null/empty para evitar enviarlos al backend
                            .map(function (line) {
                            var cleanLine = __assign({}, line);
                            Object.keys(cleanLine).forEach(function (key) {
                                if (cleanLine[key] === undefined ||
                                    cleanLine[key] === '' ||
                                    cleanLine[key] === null) {
                                    delete cleanLine[key];
                                }
                            });
                            console.log('🧼 [EDIT] Línea limpia:', cleanLine);
                            return cleanLine;
                        })
                    };
                    console.log('🚀 [EDIT] Datos preparados para backend:', updateData);
                    return [4 /*yield*/, updateEntry(entryId, updateData)];
                case 2:
                    updatedEntry = _d.sent();
                    console.log('✅ [EDIT] Asiento actualizado exitosamente:', updatedEntry);
                    if (onSuccess && updatedEntry) {
                        onSuccess(updatedEntry);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    console.error('❌ [EDIT] Error al actualizar asiento:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [entryId, updateEntry, onSuccess]);
    // Hook del formulario
    var _l = useForm({
        initialData: initialFormData,
        validate: formValidate,
        onSubmit: formOnSubmit
    }), values = _l.data, updateField = _l.updateField, handleSubmit = _l.handleSubmit, isSubmitting = _l.isSubmitting; // Funciones para manejar las líneas
    var addLine = useCallback(function () {
        var newLine = {
            account_id: '',
            account_code: '',
            account_name: '',
            debit_amount: '0.00',
            credit_amount: '0.00',
            description: '',
            reference: '',
            third_party_id: values.third_party_id || '',
            cost_center_id: values.cost_center_id || '',
            payment_terms_id: values.payment_terms_id || '',
            invoice_date: values.invoice_date || '',
            due_date: values.due_date || '',
            product_id: '',
            quantity: '',
            unit_price: '',
            discount_percentage: '',
            discount_amount: '',
            tax_percentage: '',
            tax_amount: ''
        };
        updateField('lines', __spreadArray(__spreadArray([], values.lines, true), [newLine], false));
    }, [values.lines, values.third_party_id, values.cost_center_id, values.payment_terms_id, values.invoice_date, values.due_date, updateField]);
    var removeLine = useCallback(function (index) {
        if (values.lines.length > 2) { // Mantener al menos 2 líneas
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
    // Función para filtrar cuentas
    var getFilteredAccounts = useCallback(function (searchTerm) {
        if (!searchTerm || searchTerm.length < 1)
            return accounts.slice(0, 10);
        var lowerSearchTerm = searchTerm.toLowerCase();
        return accounts
            .filter(function (account) {
            return account.name.toLowerCase().includes(lowerSearchTerm) ||
                account.code.toLowerCase().includes(lowerSearchTerm);
        })
            .slice(0, 10);
    }, [accounts]);
    // Función para filtrar terceros
    var getFilteredThirdParties = useCallback(function (searchTerm) {
        if (!searchTerm || searchTerm.length < 2)
            return []; // Solo buscar con al menos 2 caracteres
        var term = searchTerm.toLowerCase();
        return thirdParties
            .filter(function (thirdParty) {
            return (thirdParty.code && thirdParty.code.toLowerCase().includes(term)) ||
                thirdParty.name.toLowerCase().includes(term) ||
                (thirdParty.document_number && thirdParty.document_number.toLowerCase().includes(term));
        })
            .slice(0, 20);
    }, [thirdParties]);
    // Función para manejar selección de cuenta
    var handleAccountSelect = useCallback(function (lineIndex, account) {
        updateLine(lineIndex, 'account_id', account.id);
        updateLine(lineIndex, 'account_code', account.code);
        updateLine(lineIndex, 'account_name', account.name);
        // Limpiar término de búsqueda y cerrar dropdown
        setAccountSearchTerms(function (prev) {
            var newTerms = __assign({}, prev);
            delete newTerms[lineIndex];
            return newTerms;
        });
        setFocusedAccountInput(null);
    }, [updateLine]);
    // Función para propagar cambios generales a las líneas
    var propagateGeneralFieldsToLines = useCallback(function (updatedValues) {
        var updatedLines = updatedValues.lines.map(function (line) { return (__assign(__assign({}, line), { third_party_id: line.third_party_id || updatedValues.third_party_id || '', cost_center_id: line.cost_center_id || updatedValues.cost_center_id || '', 
            // Manejo especial para payment terms con limpieza de conflictos
            payment_terms_id: updatedValues.payment_terms_id ? updatedValues.payment_terms_id : undefined, invoice_date: updatedValues.payment_terms_id && updatedValues.invoice_date ? updatedValues.invoice_date : undefined, due_date: !updatedValues.payment_terms_id && updatedValues.due_date ? updatedValues.due_date : undefined })); });
        return __assign(__assign({}, updatedValues), { lines: updatedLines });
    }, []); // Wrapper para updateField que propaga campos generales
    var updateFieldWithPropagation = useCallback(function (field, value) {
        var _a;
        var updatedValues = __assign(__assign({}, values), (_a = {}, _a[field] = value, _a)); // Lógica de limpieza automática para términos de pago
        if (field === 'payment_terms_id' && value) {
            // Al seleccionar términos de pago, limpiar fecha de vencimiento manual
            updatedValues.due_date = '';
        }
        else if (field === 'due_date' && value) {
            // Al establecer fecha de vencimiento manual, limpiar términos de pago e invoice_date
            updatedValues.payment_terms_id = '';
            updatedValues.invoice_date = '';
        }
        // Si es un campo general que afecta las líneas, propagar
        if (['third_party_id', 'cost_center_id', 'payment_terms_id', 'invoice_date', 'due_date'].includes(field)) {
            var finalValues = propagateGeneralFieldsToLines(updatedValues);
            updateField('lines', finalValues.lines); // Si se limpiaron campos por la lógica automática, actualizar también esos campos
            if (field === 'payment_terms_id' && value) {
                updateField('due_date', '');
            }
            else if (field === 'due_date' && value) {
                updateField('payment_terms_id', '');
                updateField('invoice_date', '');
            }
        }
        updateField(field, value);
    }, [values, updateField, propagateGeneralFieldsToLines]);
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
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !balance.isBalanced} className="min-w-[120px]">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Asiento *
              </label>
              <Input type="date" value={values.entry_date} onChange={function (e) { return updateField('entry_date', e.target.value); }} required/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <Input type="text" value={values.description} onChange={function (e) { return updateField('description', e.target.value); }} placeholder="Descripción del asiento contable" required/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea value={values.notes} onChange={function (e) { return updateField('notes', e.target.value); }} placeholder="Notas adicionales" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>        </Card>

        {/* Datos Generales - Términos de Pago */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Datos Generales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tercero
              </label>              <div className="relative">
                <Input value={thirdPartySearchTerm || (function () {
            var selectedThirdParty = thirdParties.find(function (tp) { return tp.id === values.third_party_id; });
            return selectedThirdParty
                ? (selectedThirdParty.code
                    ? "".concat(selectedThirdParty.code, " - ").concat(selectedThirdParty.name)
                    : "".concat(selectedThirdParty.document_number, " - ").concat(selectedThirdParty.name))
                : '';
        })()} onChange={function (e) {
            var searchTerm = e.target.value;
            setThirdPartySearchTerm(searchTerm);
            setThirdPartyDropdownOpen(searchTerm.length >= 2);
            // Si borra el texto completamente, limpiar la selección
            if (searchTerm === '') {
                updateFieldWithPropagation('third_party_id', '');
            }
        }} onFocus={function () {
            setThirdPartyDropdownOpen(thirdPartySearchTerm.length >= 2);
        }} onBlur={function () {
            setTimeout(function () {
                setThirdPartyDropdownOpen(false);
                // Si no hay selección, limpiar el término
                if (!values.third_party_id) {
                    setThirdPartySearchTerm('');
                }
            }, 200);
        }} placeholder="Buscar por código, nombre o documento..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                
                {thirdPartyDropdownOpen && getFilteredThirdParties(thirdPartySearchTerm).length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {getFilteredThirdParties(thirdPartySearchTerm).map(function (thirdParty) { return (<div key={thirdParty.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () {
                    updateFieldWithPropagation('third_party_id', thirdParty.id);
                    setThirdPartySearchTerm('');
                    setThirdPartyDropdownOpen(false);
                }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-sm text-blue-600">
                              {thirdParty.code || thirdParty.document_number}
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {thirdParty.name}
                            </span>
                          </div>
                          <span className={"px-2 py-1 text-xs rounded-full ".concat(thirdParty.third_party_type === 'customer'
                    ? 'bg-blue-100 text-blue-800'
                    : thirdParty.third_party_type === 'supplier'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800')}>
                            {thirdParty.third_party_type === 'customer' ? 'Cliente' :
                    thirdParty.third_party_type === 'supplier' ? 'Proveedor' :
                        thirdParty.third_party_type}
                          </span>
                        </div>
                        {thirdParty.document_number && thirdParty.code && (<div className="text-xs text-gray-500 mt-1">
                            Doc: {thirdParty.document_number}
                          </div>)}
                      </div>); })}
                  </div>)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se aplicará a todas las líneas del asiento. Escriba al menos 2 caracteres para buscar.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro de Costo
              </label>              <select value={values.cost_center_id || ''} onChange={function (e) { return updateFieldWithPropagation('cost_center_id', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar centro de costo...</option>
                {costCenters.map(function (costCenter) { return (<option key={costCenter.id} value={costCenter.id}>
                    {costCenter.code} - {costCenter.name}
                  </option>); })}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Se aplicará a todas las líneas del asiento
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condiciones de Pago
              </label>              <select value={values.payment_terms_id || ''} onChange={function (e) { return updateFieldWithPropagation('payment_terms_id', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar condiciones...</option>
                {paymentTerms.map(function (paymentTerm) { return (<option key={paymentTerm.id} value={paymentTerm.id}>
                    {paymentTerm.code} - {paymentTerm.name}
                  </option>); })}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                📋 Se calcularán fechas de vencimiento automáticamente
              </p>
            </div>
              <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">🔄 Limpieza automática</span>
              </div>              <div className="text-xs text-gray-600 space-y-1">
                <p>• Seleccionar condiciones de pago limpia la fecha de vencimiento manual</p>
                <p>• Establecer fecha de vencimiento manual limpia las condiciones de pago y fecha de factura</p>
                <p>• Dejar las descripciones de líneas vacías usa la descripción general</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Factura
                {values.payment_terms_id && <span className="text-red-500 ml-1">*</span>}
              </label>                <Input type="date" value={values.invoice_date || ''} onChange={function (e) { return updateFieldWithPropagation('invoice_date', e.target.value); }}/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
                {!values.payment_terms_id && values.due_date && <span className="text-blue-500 ml-1">(Manual)</span>}
              </label>                <Input type="date" value={values.due_date || ''} onChange={function (e) { return updateFieldWithPropagation('due_date', e.target.value); }} disabled={!!values.payment_terms_id} className={values.payment_terms_id ? 'bg-gray-100' : ''}/>
              {values.payment_terms_id && (<p className="text-xs text-blue-600 mt-1">
                  🔒 Deshabilitado - Se calculará automáticamente según las condiciones de pago
                </p>)}
              {!values.payment_terms_id && (<p className="text-xs text-gray-500 mt-1">
                  ⚠️ Al establecer una fecha manual se limpiarán las condiciones de pago
                </p>)}
            </div>
          </div>
        </Card>

        {/* Resumen de líneas */}
        <Card className="p-6">          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Líneas del Asiento ({values.lines.length})
            </h3>
            <div className="space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={function () { return addLine(); }}>
                + Agregar Línea
              </Button>
            </div>
          </div>          <div className="space-y-4">
            {values.lines.map(function (line, index) {
            var _a, _b;
            return (<div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Línea {index + 1}
                  </span>
                  {values.lines.length > 2 && (<Button type="button" variant="outline" size="sm" onClick={function () { return removeLine(index); }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      × Eliminar
                    </Button>)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cuenta *
                    </label>
                    <div className="relative">
                      <Input type="text" value={(_a = accountSearchTerms[index]) !== null && _a !== void 0 ? _a : (line.account_name || line.account_code || '')} onChange={function (e) {
                    var searchTerm = e.target.value;
                    setAccountSearchTerms(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = searchTerm, _a)));
                    });
                    // Si borra el texto completamente, limpiar la selección
                    if (searchTerm === '') {
                        updateLine(index, 'account_id', '');
                        updateLine(index, 'account_code', '');
                        updateLine(index, 'account_name', '');
                    }
                }} onFocus={function () { return setFocusedAccountInput(index); }} onBlur={function () {
                    setTimeout(function () {
                        setFocusedAccountInput(null);
                        // Si no hay selección, limpiar el término
                        if (!line.account_id) {
                            setAccountSearchTerms(function (prev) {
                                var newTerms = __assign({}, prev);
                                delete newTerms[index];
                                return newTerms;
                            });
                        }
                    }, 200);
                }} placeholder={line.account_id ? "Cuenta seleccionada" : "Buscar cuenta por nombre o código..."} className="text-sm"/>
                      
                      {/* Dropdown de cuentas */}
                      {(accountSearchTerms[index] || focusedAccountInput === index) && (<div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                          {getFilteredAccounts(accountSearchTerms[index] || '').map(function (account) { return (<div key={account.id} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () { return handleAccountSelect(index, account); }}>
                              <div className="text-sm font-medium text-gray-900">
                                {account.code} - {account.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Tipo: {account.account_type || 'No especificado'}
                              </div>
                            </div>); })}
                          {getFilteredAccounts(accountSearchTerms[index] || '').length === 0 && (<div className="px-3 py-2 text-sm text-gray-500">
                              No se encontraron cuentas
                            </div>)}
                        </div>)}
                      
                      {/* Mostrar cuenta seleccionada como indicador */}
                      {line.account_id && !accountSearchTerms[index] && focusedAccountInput !== index && (<div className="absolute inset-0 pointer-events-none">
                          <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium">
                            📊 {line.account_code} - {line.account_name}
                          </div>
                        </div>)}
                    </div>
                    {line.account_name && (<div className="text-xs text-gray-500 mt-1">
                        {line.account_code} - {line.account_name}
                      </div>)}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción
                    </label>
                    <Input type="text" value={line.description} onChange={function (e) { return updateLine(index, 'description', e.target.value); }} placeholder="Descripción de la línea" className="text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Débito
                    </label>
                    <Input type="number" step="0.01" min="0" value={line.debit_amount} onChange={function (e) { return updateLine(index, 'debit_amount', e.target.value); }} placeholder="0.00" className="text-sm text-right"/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Crédito
                    </label>
                    <Input type="number" step="0.01" min="0" value={line.credit_amount} onChange={function (e) { return updateLine(index, 'credit_amount', e.target.value); }} placeholder="0.00" className="text-sm text-right"/>
                  </div>
                </div>

                {/* Campos adicionales opcionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Referencia
                    </label>
                    <Input type="text" value={line.reference || ''} onChange={function (e) { return updateLine(index, 'reference', e.target.value); }} placeholder="Referencia de línea" className="text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tercero
                    </label>
                    <select value={line.third_party_id || ''} onChange={function (e) { return updateLine(index, 'third_party_id', e.target.value); }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Usar tercero general</option>
                      {thirdParties.map(function (thirdParty) { return (<option key={thirdParty.id} value={thirdParty.id}>
                          {thirdParty.code} - {thirdParty.name}
                        </option>); })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Centro de Costo
                    </label>
                    <select value={line.cost_center_id || ''} onChange={function (e) { return updateLine(index, 'cost_center_id', e.target.value); }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Usar centro general</option>
                      {costCenters.map(function (costCenter) { return (<option key={costCenter.id} value={costCenter.id}>
                          {costCenter.code} - {costCenter.name}
                        </option>); })}
                    </select>
                  </div>
                </div>

                {/* Mostrar información enriquecida si existe (solo lectura) */}
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
                            Vence: {(_b = line.payment_schedule[line.payment_schedule.length - 1]) === null || _b === void 0 ? void 0 : _b.payment_date}
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
        </Card>
      </form>
    </div>);
};
