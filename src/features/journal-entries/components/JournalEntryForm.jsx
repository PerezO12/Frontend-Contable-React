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
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { useAccounts } from '../../accounts/hooks';
import { useThirdParties } from '../../third-parties/hooks';
import { useCostCenters } from '../../cost-centers/hooks';
import { useProducts } from '../../products/hooks';
import { usePaymentTermsList, usePaymentTermById } from '../../payment-terms/hooks/usePaymentTerms';
import { useJournalEntryPaymentTerms } from '../hooks/useJournalEntryPaymentTerms';
import { formatCurrency } from '../../../shared/utils';
import { journalEntryCreateSchema, JournalEntryType, JOURNAL_ENTRY_TYPE_LABELS, TransactionOrigin, TransactionOriginLabels, getTransactionOriginColor } from '../types';
export var JournalEntryForm = function (_a) {
    var _b, _c, _d;
    var onSuccess = _a.onSuccess, onCancel = _a.onCancel, initialData = _a.initialData, _e = _a.isEditMode, isEditMode = _e === void 0 ? false : _e, entryId = _a.entryId;
    // Estabilizar filtros para evitar bucles infinitos
    var accountFilters = useMemo(function () { return ({ is_active: true }); }, []);
    var thirdPartyFilters = useMemo(function () { return ({ is_active: true }); }, []);
    var costCenterFilters = useMemo(function () { return ({ is_active: true }); }, []);
    var paymentTermsOptions = useMemo(function () { return ({
        autoLoad: true,
        initialFilters: { is_active: true }
    }); }, []);
    var _f = useJournalEntries(), createEntry = _f.createEntry, updateEntry = _f.updateEntry, loading = _f.loading;
    var accounts = useAccounts(accountFilters).accounts;
    var thirdParties = useThirdParties(thirdPartyFilters).thirdParties;
    var costCenters = useCostCenters(costCenterFilters).costCenters;
    var products = useProducts({ is_active: true }).products;
    var paymentTerms = usePaymentTermsList(paymentTermsOptions).paymentTerms;
    var getPaymentTermById = usePaymentTermById().getPaymentTermById;
    var _g = useJournalEntryPaymentTerms(), calculatingSchedule = _g.calculating, scheduleError = _g.error, clearScheduleError = _g.clearError;
    var _h = useState({}), accountSearchTerms = _h[0], setAccountSearchTerms = _h[1];
    var _j = useState({}), productSearchTerms = _j[0], setProductSearchTerms = _j[1];
    var _k = useState(''), thirdPartySearchTerm = _k[0], setThirdPartySearchTerm = _k[1];
    var _l = useState(null), focusedInput = _l[0], setFocusedInput = _l[1];
    var _m = useState(null), focusedInvoiceInput = _m[0], setFocusedInvoiceInput = _m[1];
    var _o = useState(null), focusedProductInput = _o[0], setFocusedProductInput = _o[1];
    var _p = useState({}), productDropdownOpen = _p[0], setProductDropdownOpen = _p[1];
    var _q = useState(false), thirdPartyDropdownOpen = _q[0], setThirdPartyDropdownOpen = _q[1];
    // Estados separados para cada sección
    var hasOpenInvoiceDropdowns = Object.values(productDropdownOpen).some(function (isOpen) { return isOpen; }) || focusedInvoiceInput !== null;
    var hasOpenAccountDropdowns = focusedInput !== null;
    var draftKey = useState("journal-entry-draft-".concat(Date.now()))[0]; // Clave única para esta sesión
    var _r = useState([]), entryPaymentSchedule = _r[0], setEntryPaymentSchedule = _r[1];
    var _s = useState(false), showPaymentSchedule = _s[0], setShowPaymentSchedule = _s[1];
    // 🆕 Estado separado para líneas de factura (productos)
    var _t = useState([{
            product_id: '',
            product_name: '',
            product_code: '',
            account_id: '',
            account_code: '',
            account_name: '',
            quantity: '1',
            unit_price: '0.00',
            total: 0
        }]), invoiceLines = _t[0], setInvoiceLines = _t[1];
    // Función para limpiar borradores del localStorage
    var clearDrafts = useCallback(function () {
        var keys = Object.keys(localStorage);
        keys.forEach(function (key) {
            if (key.startsWith('journal-entry-draft-')) {
                localStorage.removeItem(key);
            }
        });
    }, []);
    // Función para limpiar el borrador actual específicamente
    var clearCurrentDraft = useCallback(function () {
        localStorage.removeItem(draftKey);
    }, [draftKey]); // Memoizar configuraciones para evitar recreaciones
    var initialFormData = useMemo(function () { return ({
        reference: (initialData === null || initialData === void 0 ? void 0 : initialData.reference) || '',
        description: (initialData === null || initialData === void 0 ? void 0 : initialData.description) || '',
        entry_type: (initialData === null || initialData === void 0 ? void 0 : initialData.entry_type) || JournalEntryType.MANUAL,
        transaction_origin: initialData === null || initialData === void 0 ? void 0 : initialData.transaction_origin,
        entry_date: (initialData === null || initialData === void 0 ? void 0 : initialData.entry_date) || new Date().toISOString().split('T')[0],
        notes: (initialData === null || initialData === void 0 ? void 0 : initialData.notes) || '',
        external_reference: (initialData === null || initialData === void 0 ? void 0 : initialData.external_reference) || '',
        // Nuevos campos de payment terms a nivel de asiento
        third_party_id: (initialData === null || initialData === void 0 ? void 0 : initialData.third_party_id) || '',
        cost_center_id: (initialData === null || initialData === void 0 ? void 0 : initialData.cost_center_id) || '',
        payment_terms_id: (initialData === null || initialData === void 0 ? void 0 : initialData.payment_terms_id) || '',
        invoice_date: (initialData === null || initialData === void 0 ? void 0 : initialData.invoice_date) || '',
        due_date: (initialData === null || initialData === void 0 ? void 0 : initialData.due_date) || '',
        lines: (initialData === null || initialData === void 0 ? void 0 : initialData.lines) || [
            { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' },
            { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' }
        ]
    }); }, [initialData]); // Cargar datos del entry existente cuando se está editando
    var _u = entryId
        ? useJournalEntry(entryId)
        : { entry: null, loading: false }, existingEntry = _u.entry, loadingEntry = _u.loading; // Actualizar initialFormData cuando se cargan los datos del entry existente
    var finalInitialData = useMemo(function () {
        var _a, _b;
        // Dar prioridad a los datos existentes del backend en modo edición
        if (isEditMode && existingEntry) {
            console.log('📥 Cargando datos del entry existente desde backend:', existingEntry);
            console.log('📋 Payment terms disponibles:', paymentTerms);
            // Obtener los valores efectivos de la primera línea para los campos de payment terms
            var firstLine_1 = (_a = existingEntry.lines) === null || _a === void 0 ? void 0 : _a[0];
            var effectiveInvoiceDate = (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.effective_invoice_date) || (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.invoice_date) || '';
            var effectiveDueDate = (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.effective_due_date) || (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.due_date) || '';
            // Si hay payment_terms_code, intentar encontrar el payment_terms_id correspondiente
            var paymentTermsId = (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.payment_terms_id) || '';
            if (!paymentTermsId && (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.payment_terms_code) && paymentTerms.length > 0) {
                var foundPaymentTerm = paymentTerms.find(function (pt) { return pt.code === firstLine_1.payment_terms_code; });
                if (foundPaymentTerm) {
                    paymentTermsId = foundPaymentTerm.id;
                }
            }
            return {
                reference: existingEntry.reference || '',
                description: existingEntry.description || '',
                entry_type: existingEntry.entry_type || JournalEntryType.MANUAL,
                entry_date: existingEntry.entry_date || new Date().toISOString().split('T')[0],
                notes: existingEntry.notes || '',
                external_reference: existingEntry.external_reference || '',
                // Campos de payment terms a nivel de asiento (usar valores efectivos)
                third_party_id: (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.third_party_id) || '',
                cost_center_id: (firstLine_1 === null || firstLine_1 === void 0 ? void 0 : firstLine_1.cost_center_id) || '',
                payment_terms_id: paymentTermsId,
                invoice_date: effectiveInvoiceDate,
                due_date: effectiveDueDate,
                lines: ((_b = existingEntry.lines) === null || _b === void 0 ? void 0 : _b.map(function (line) {
                    // Para cada línea, usar también los valores efectivos
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
                        account_id: line.account_id || '',
                        account_code: line.account_code || '',
                        account_name: line.account_name || '',
                        debit_amount: String(line.debit_amount) || '0.00',
                        credit_amount: String(line.credit_amount) || '0.00',
                        description: line.description || '',
                        reference: line.reference || '',
                        third_party_id: line.third_party_id || '',
                        cost_center_id: line.cost_center_id || '',
                        payment_terms_id: linePaymentTermsId,
                        invoice_date: lineEffectiveInvoiceDate,
                        due_date: lineEffectiveDueDate
                    };
                })) || [
                    { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' },
                    { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' }
                ]
            };
        }
        // Fallback a initialData si está disponible, o datos por defecto
        return initialFormData;
    }, [isEditMode, existingEntry, initialFormData, paymentTerms]);
    var formValidate = useCallback(function (data) {
        console.log('🔍 Validando datos en modo:', isEditMode ? 'edición' : 'creación');
        console.log('🔍 Datos a validar:', data);
        // Primero, propagar campos globales a las líneas para validación
        var dataWithPropagatedFields = __assign(__assign({}, data), { lines: data.lines.map(function (line) { return (__assign(__assign({}, line), { 
                // Propagar payment_terms_id e invoice_date si no están especificados en la línea
                payment_terms_id: line.payment_terms_id || data.payment_terms_id || '', invoice_date: line.invoice_date || data.invoice_date || '', due_date: line.due_date || data.due_date || '' })); }) });
        if (isEditMode) {
            // Para modo edición, hacer validaciones básicas sin schema estricto
            var errors = [];
            // Validar descripción si está presente
            if (dataWithPropagatedFields.description && dataWithPropagatedFields.description.length < 3) {
                errors.push({
                    field: 'description',
                    message: 'La descripción debe tener al menos 3 caracteres'
                });
            }
            // Validar fecha si está presente
            if (dataWithPropagatedFields.entry_date && isNaN(Date.parse(dataWithPropagatedFields.entry_date))) {
                errors.push({
                    field: 'entry_date',
                    message: 'Fecha inválida'
                });
            }
            // Validar líneas básicamente
            if (dataWithPropagatedFields.lines && dataWithPropagatedFields.lines.length < 2) {
                errors.push({
                    field: 'lines',
                    message: 'Un asiento debe tener al menos 2 líneas'
                });
            }
            console.log('🔍 Errores de validación manual:', errors);
            return errors;
        }
        else {
            // Para modo creación, usar schema de creación con datos propagados
            var result = journalEntryCreateSchema.safeParse(dataWithPropagatedFields);
            if (!result.success) {
                var errors = result.error.errors.map(function (err) { return ({
                    field: err.path.join('.'),
                    message: err.message
                }); });
                console.log('🔍 Errores de validación schema:', errors);
                return errors;
            }
        }
        return [];
    }, [isEditMode]);
    var formOnSubmit = useCallback(function (formData) { return __awaiter(void 0, void 0, void 0, function () {
        var dataWithPropagatedFields, enhancedLines, submitData, updateData, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 JournalEntry onSubmit ejecutado con:', {
                        isEditMode: isEditMode,
                        entryId: entryId,
                        formData: formData
                    }); // IMPORTANTE: Propagar campos globales a las líneas ANTES de procesar
                    dataWithPropagatedFields = __assign(__assign({}, formData), { lines: formData.lines.map(function (line) { return (__assign(__assign({}, line), { 
                            // REGLA: Si hay due_date manual, NO enviar invoice_date ni payment_terms_id
                            payment_terms_id: (line.due_date || formData.due_date) ? undefined :
                                (line.payment_terms_id && line.payment_terms_id !== '')
                                    ? line.payment_terms_id
                                    : (formData.payment_terms_id && formData.payment_terms_id !== '')
                                        ? formData.payment_terms_id
                                        : undefined, invoice_date: (line.due_date || formData.due_date) ? undefined :
                                (line.invoice_date && line.invoice_date !== '')
                                    ? line.invoice_date
                                    : (formData.invoice_date && formData.invoice_date !== '')
                                        ? formData.invoice_date
                                        : undefined, due_date: (line.due_date && line.due_date !== '')
                                ? line.due_date
                                : (formData.due_date && formData.due_date !== '')
                                    ? formData.due_date
                                    : undefined, third_party_id: (line.third_party_id && line.third_party_id !== '')
                                ? line.third_party_id
                                : (formData.third_party_id && formData.third_party_id !== '')
                                    ? formData.third_party_id
                                    : undefined, cost_center_id: (line.cost_center_id && line.cost_center_id !== '')
                                ? line.cost_center_id
                                : (formData.cost_center_id && formData.cost_center_id !== '')
                                    ? formData.cost_center_id
                                    : undefined, product_id: (line.product_id && line.product_id !== '')
                                ? line.product_id
                                : undefined })); }) });
                    console.log('📋 Datos con campos propagados:', dataWithPropagatedFields);
                    enhancedLines = dataWithPropagatedFields.lines
                        .filter(function (line) { return line.account_id &&
                        (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0); })
                        .map(function (line) {
                        var _a;
                        return ({
                            account_id: line.account_id,
                            // Si la línea no tiene descripción, usar la descripción general del asiento
                            description: ((_a = line.description) === null || _a === void 0 ? void 0 : _a.trim()) || formData.description,
                            // Convertir amounts a números como espera el backend
                            debit_amount: parseFloat(line.debit_amount) || 0,
                            credit_amount: parseFloat(line.credit_amount) || 0, // Propagar third_party_id y cost_center_id del asiento a todas las líneas si no están especificados
                            third_party_id: (line.third_party_id && line.third_party_id !== '')
                                ? line.third_party_id
                                : (formData.third_party_id && formData.third_party_id !== '')
                                    ? formData.third_party_id
                                    : undefined,
                            cost_center_id: (line.cost_center_id && line.cost_center_id !== '')
                                ? line.cost_center_id
                                : (formData.cost_center_id && formData.cost_center_id !== '')
                                    ? formData.cost_center_id
                                    : undefined,
                            reference: line.reference || undefined,
                            // Campos de productos - convertir a números
                            product_id: line.product_id || undefined,
                            quantity: line.quantity ? parseFloat(line.quantity) : undefined,
                            unit_price: line.unit_price ? parseFloat(line.unit_price) : undefined,
                            discount_percentage: line.discount_percentage ? parseFloat(line.discount_percentage) : undefined,
                            discount_amount: line.discount_amount ? parseFloat(line.discount_amount) : undefined,
                            tax_percentage: line.tax_percentage ? parseFloat(line.tax_percentage) : undefined,
                            tax_amount: line.tax_amount ? parseFloat(line.tax_amount) : undefined,
                            // Campos de payment terms - usar los ya propagados correctamente
                            payment_terms_id: line.payment_terms_id,
                            invoice_date: line.invoice_date,
                            due_date: line.due_date
                        });
                    }) // Filtrar campos undefined para evitar enviarlos al backend
                        .map(function (line) {
                        var cleanLine = __assign({}, line);
                        Object.keys(cleanLine).forEach(function (key) {
                            if (cleanLine[key] === undefined ||
                                cleanLine[key] === '' ||
                                cleanLine[key] === null) {
                                delete cleanLine[key];
                            }
                        });
                        console.log('🧼 Línea limpia:', cleanLine);
                        return cleanLine;
                    });
                    submitData = {
                        entry_date: dataWithPropagatedFields.entry_date,
                        reference: dataWithPropagatedFields.reference || undefined,
                        description: dataWithPropagatedFields.description,
                        entry_type: dataWithPropagatedFields.entry_type,
                        transaction_origin: dataWithPropagatedFields.transaction_origin || undefined,
                        notes: dataWithPropagatedFields.notes || undefined,
                        lines: enhancedLines
                    };
                    console.log('📤 Datos que se enviarán al backend (formato correcto):', submitData);
                    if (!(isEditMode && entryId)) return [3 /*break*/, 2];
                    updateData = __assign(__assign({ id: entryId }, dataWithPropagatedFields), { lines: dataWithPropagatedFields.lines
                            .filter(function (line) { return line.account_id &&
                            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0); })
                            .map(function (line) { return (__assign(__assign({}, line), { third_party_id: line.third_party_id || dataWithPropagatedFields.third_party_id || undefined, cost_center_id: line.cost_center_id || dataWithPropagatedFields.cost_center_id || undefined })); }) });
                    return [4 /*yield*/, updateEntry(entryId, updateData)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        console.log('✅ Asiento actualizado exitosamente:', result);
                        // Limpiar borrador actual y todos los borradores antiguos al actualizar exitosamente
                        clearCurrentDraft();
                        clearDrafts();
                        if (onSuccess) {
                            onSuccess(result);
                        }
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, createEntry(submitData)];
                case 3:
                    result = _a.sent();
                    if (result) {
                        console.log('✅ Asiento creado exitosamente:', result);
                        // Limpiar borrador actual y todos los borradores antiguos al crear exitosamente
                        clearCurrentDraft();
                        clearDrafts();
                        if (onSuccess) {
                            onSuccess(result);
                        }
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isEditMode, entryId, updateEntry, createEntry, clearCurrentDraft, clearDrafts, onSuccess]);
    var _v = useForm({
        initialData: finalInitialData,
        validate: formValidate,
        onSubmit: formOnSubmit
    }), values = _v.data, updateField = _v.updateField, handleSubmit = _v.handleSubmit, getFieldError = _v.getFieldError, clearErrors = _v.clearErrors;
    // Log para depurar datos del formulario
    useEffect(function () {
        console.log('🔄 useForm inicializado/actualizado con:', {
            isEditMode: isEditMode,
            entryId: entryId,
            hasExistingEntry: !!existingEntry,
            hasInitialData: !!initialData,
            finalInitialData: finalInitialData,
            currentValues: values
        });
    }, [isEditMode, entryId, existingEntry, initialData, finalInitialData, values]); // Balance validation hook
    var balance = useJournalEntryBalance(values.lines); // Memoize calculation function to avoid re-creating it on every render
    var calculateEntryPaymentSchedule = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var invoiceTotal, selectedPaymentTerm, schedules, totalPercentage, invoiceDate_1, schedule, calculatedTotal, difference, lastIndex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invoiceTotal = invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0);
                    console.log('🔍 Calculando cronograma de pagos localmente:', {
                        payment_terms_id: values.payment_terms_id,
                        invoice_date: values.invoice_date,
                        invoiceTotal: invoiceTotal,
                        invoiceLines: invoiceLines.length,
                        hasConditions: values.payment_terms_id && values.invoice_date && invoiceTotal > 0
                    });
                    if (!(values.payment_terms_id && values.invoice_date && invoiceTotal > 0)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    clearScheduleError();
                    // Obtener el payment term completo por ID
                    console.log('📞 Obteniendo payment term por ID:', values.payment_terms_id);
                    return [4 /*yield*/, getPaymentTermById(values.payment_terms_id)];
                case 2:
                    selectedPaymentTerm = _a.sent();
                    console.log('📋 Payment term obtenido por ID:', selectedPaymentTerm);
                    console.log('📋 Payment term payment_schedules:', selectedPaymentTerm.payment_schedules);
                    schedules = selectedPaymentTerm.payment_schedules || [];
                    if (schedules.length === 0) {
                        console.log('⚠️ Payment term no tiene cronogramas definidos - es de fecha simple');
                        setEntryPaymentSchedule([]);
                        setShowPaymentSchedule(false);
                        return [2 /*return*/];
                    }
                    totalPercentage = schedules.reduce(function (sum, ps) { return sum + ps.percentage; }, 0);
                    if (Math.abs(totalPercentage - 100) > 0.01) {
                        console.warn("\u26A0\uFE0F Los porcentajes no suman 100% (suma actual: ".concat(totalPercentage, "%)"));
                    }
                    invoiceDate_1 = new Date(values.invoice_date);
                    schedule = schedules.map(function (ps) {
                        var paymentDate = new Date(invoiceDate_1);
                        paymentDate.setDate(paymentDate.getDate() + ps.days);
                        // Calcular monto exacto considerando redondeo
                        var scheduleAmount = Math.round((invoiceTotal * ps.percentage / 100) * 100) / 100;
                        return {
                            sequence: ps.sequence,
                            days: ps.days,
                            percentage: ps.percentage,
                            amount: scheduleAmount,
                            payment_date: paymentDate.toISOString().split('T')[0],
                            description: ps.description || "Cuota ".concat(ps.sequence)
                        };
                    });
                    calculatedTotal = schedule.reduce(function (sum, item) { return sum + item.amount; }, 0);
                    difference = invoiceTotal - calculatedTotal;
                    if (Math.abs(difference) > 0.01) {
                        lastIndex = schedule.length - 1;
                        schedule[lastIndex].amount = Math.round((schedule[lastIndex].amount + difference) * 100) / 100;
                        console.info("\u2705 Ajuste de redondeo aplicado: ".concat(difference.toFixed(2), " en la \u00FAltima cuota"));
                    }
                    console.log('� Cronograma calculado localmente:', {
                        paymentTermsName: selectedPaymentTerm.name,
                        invoiceDate: values.invoice_date,
                        totalAmount: invoiceTotal,
                        schedulesCount: schedule.length,
                        calculatedTotal: schedule.reduce(function (sum, item) { return sum + item.amount; }, 0),
                        schedule: schedule
                    });
                    setEntryPaymentSchedule(schedule);
                    setShowPaymentSchedule(true);
                    console.log('✅ Estado actualizado - showPaymentSchedule: true, items:', schedule.length);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Error calculating entry payment schedule:', error_1);
                    setEntryPaymentSchedule([]);
                    setShowPaymentSchedule(false);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.log('⚠️ No se cumplieron las condiciones para calcular cronograma');
                    setEntryPaymentSchedule([]);
                    setShowPaymentSchedule(false);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); }, [values.payment_terms_id, values.invoice_date, invoiceLines, getPaymentTermById, clearScheduleError]);
    // Calculate payment schedule when payment terms, invoice date, or total amount changes
    useEffect(function () {
        calculateEntryPaymentSchedule();
    }, [calculateEntryPaymentSchedule]);
    // Filter accounts for autocomplete
    var getFilteredAccounts = useCallback(function (searchTerm) {
        if (!searchTerm)
            return accounts.slice(0, 20);
        var term = searchTerm.toLowerCase();
        return accounts
            .filter(function (account) {
            return account.code.toLowerCase().includes(term) ||
                account.name.toLowerCase().includes(term);
        })
            .slice(0, 20);
    }, [accounts]);
    // Filter third parties for autocomplete
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
    // Función para filtrar productos por nombre
    var getFilteredProducts = useCallback(function (searchTerm) {
        if (!searchTerm)
            return products.slice(0, 20);
        var term = searchTerm.toLowerCase();
        return products
            .filter(function (product) {
            return product.name.toLowerCase().includes(term) ||
                (product.code && product.code.toLowerCase().includes(term));
        })
            .slice(0, 20);
    }, [products]); // Memoize event handlers to avoid recreating them on every render
    var handleInputChange = useCallback(function (field) {
        return function (e) {
            var value = e.target.value;
            // Lógica de limpieza para evitar conflictos entre payment terms y due_date manual
            if (field === 'payment_terms_id') {
                if (value) {
                    // Si se selecciona payment terms, limpiar due_date manual
                    updateField('due_date', '');
                    console.log('🧹 Limpiando due_date porque se seleccionó payment_terms_id');
                }
                else {
                    // Si se deselecciona payment terms, limpiar invoice_date también
                    updateField('invoice_date', '');
                    console.log('🧹 Limpiando invoice_date porque se deseleccionó payment_terms_id');
                }
            } // Si se establece due_date manual, limpiar payment_terms_id e invoice_date
            if (field === 'due_date' && value) {
                updateField('payment_terms_id', '');
                updateField('invoice_date', '');
                console.log('🧹 Limpiando payment_terms_id e invoice_date porque se estableció due_date manual');
            }
            // Si se establece invoice_date sin payment_terms_id, es inconsistente
            if (field === 'invoice_date' && value && !values.payment_terms_id) {
                console.log('⚠️ Se estableció invoice_date sin payment_terms_id, esto puede causar inconsistencias');
            }
            updateField(field, value);
            clearErrors();
        };
    }, [updateField, clearErrors, values.payment_terms_id]);
    // Función para actualizar automáticamente los montos de líneas basado en productos
    var updateLineAmountsFromProducts = useCallback(function () {
        if (!values.transaction_origin)
            return;
        var updatedLines = values.lines.map(function (line, index) {
            var _a;
            // Solo procesar líneas que tienen producto y cantidad, pero montos en cero
            if (!line.product_id || !line.quantity || !line.unit_price) {
                return line;
            }
            var currentDebit = parseFloat(line.debit_amount || '0');
            var currentCredit = parseFloat(line.credit_amount || '0');
            // Solo actualizar si ambos montos están en cero
            if (currentDebit !== 0 || currentCredit !== 0) {
                return line;
            }
            try {
                // Calcular el monto total del producto
                var quantity = parseFloat(line.quantity);
                var unitPrice = parseFloat(line.unit_price);
                var totalAmount = quantity * unitPrice;
                // Aplicar descuentos si existen
                if (line.discount_amount) {
                    totalAmount -= parseFloat(line.discount_amount);
                }
                else if (line.discount_percentage) {
                    var discountAmount = (totalAmount * parseFloat(line.discount_percentage)) / 100;
                    totalAmount -= discountAmount;
                }
                // Asegurar que el monto no sea negativo
                totalAmount = Math.max(0, totalAmount);
                var formattedAmount = totalAmount.toFixed(2);
                // Lógica mejorada para determinar débito vs crédito
                var isDebit = false;
                // Primero, intentar determinar por el tipo de cuenta si está disponible
                var accountCode = ((_a = line.account_code) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                if (accountCode) {
                    // Lógica basada en el primer dígito del código de cuenta (plan contable colombiano)
                    var firstDigit = accountCode.charAt(0);
                    switch (firstDigit) {
                        case '1': // Activos
                        case '5': // Gastos
                        case '6': // Costos
                            isDebit = true;
                            break;
                        case '2': // Pasivos
                        case '3': // Patrimonio
                        case '4': // Ingresos
                            isDebit = false;
                            break;
                        default:
                            // Si no se puede determinar por cuenta, usar origen de transacción
                            break;
                    }
                }
                // Si no se pudo determinar por cuenta, usar origen de transacción
                if (accountCode === '' || !['1', '2', '3', '4', '5', '6'].includes(accountCode.charAt(0))) {
                    switch (values.transaction_origin) {
                        case TransactionOrigin.SALE:
                            // En ventas, los productos generalmente van a cuentas de ingreso (crédito)
                            // A menos que sea inventario o costo de ventas
                            isDebit = accountCode.startsWith('1') || accountCode.startsWith('6'); // Inventario o costos
                            break;
                        case TransactionOrigin.PURCHASE:
                            // En compras, los productos van a inventario (débito) o gastos (débito)
                            isDebit = true;
                            break;
                        case TransactionOrigin.ADJUSTMENT:
                            // En ajustes, depende del contexto, por defecto débito para aumentos
                            isDebit = true;
                            break;
                        case TransactionOrigin.TRANSFER:
                            // En transferencias, depende del contexto
                            isDebit = true;
                            break;
                        default:
                            // Por defecto, usar débito
                            isDebit = true;
                            break;
                    }
                }
                console.log("\uD83D\uDD04 Auto-actualizando l\u00EDnea ".concat(index + 1, ":"), {
                    product_id: line.product_id,
                    account_code: accountCode,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    totalAmount: totalAmount,
                    isDebit: isDebit,
                    transaction_origin: values.transaction_origin,
                    reasoning: accountCode ? "Basado en cuenta ".concat(accountCode) : "Basado en origen ".concat(values.transaction_origin)
                });
                return __assign(__assign({}, line), { debit_amount: isDebit ? formattedAmount : '0.00', credit_amount: isDebit ? '0.00' : formattedAmount });
            }
            catch (error) {
                console.error("Error calculando monto para l\u00EDnea ".concat(index + 1, ":"), error);
                return line;
            }
        });
        // Solo actualizar si hay cambios reales
        var hasChanges = updatedLines.some(function (line, index) {
            var originalLine = values.lines[index];
            return line.debit_amount !== originalLine.debit_amount ||
                line.credit_amount !== originalLine.credit_amount;
        });
        if (hasChanges) {
            console.log('💰 Aplicando actualización automática de montos basada en productos');
            updateField('lines', updatedLines);
        }
    }, [values.lines, values.transaction_origin, updateField]);
    // Función para auto-balancear el asiento agregando una línea de ajuste
    var autoBalanceEntry = useCallback(function () {
        if (balance.is_balanced || Math.abs(balance.difference) < 0.01) {
            return; // Ya está balanceado
        }
        var difference = balance.difference;
        var isDebitAdjustment = difference < 0; // Si créditos > débitos, necesitamos débito
        // Descripción sugerida según el contexto
        var adjustmentDescription = '';
        switch (values.transaction_origin) {
            case TransactionOrigin.SALE:
                adjustmentDescription = isDebitAdjustment
                    ? 'Ajuste ventas - débito'
                    : 'Ajuste ventas - crédito';
                break;
            case TransactionOrigin.PURCHASE:
                adjustmentDescription = isDebitAdjustment
                    ? 'Ajuste compras - débito'
                    : 'Ajuste compras - crédito';
                break;
            default:
                adjustmentDescription = isDebitAdjustment
                    ? 'Ajuste contable - débito'
                    : 'Ajuste contable - crédito';
                break;
        }
        // Crear nueva línea de ajuste sin cuenta predefinida
        var adjustmentLine = {
            account_id: '',
            account_code: '',
            account_name: '',
            debit_amount: isDebitAdjustment ? Math.abs(difference).toFixed(2) : '0.00',
            credit_amount: isDebitAdjustment ? '0.00' : Math.abs(difference).toFixed(2),
            description: adjustmentDescription
        };
        // Agregar la línea al final
        var newLines = __spreadArray(__spreadArray([], values.lines, true), [adjustmentLine], false);
        updateField('lines', newLines);
        console.log('⚖️ Línea de auto-balance agregada:', {
            difference: difference,
            isDebitAdjustment: isDebitAdjustment,
            amount: Math.abs(difference).toFixed(2),
            description: adjustmentDescription
        });
    }, [balance, values.lines, values.transaction_origin, updateField]);
    var handleLineChange = useCallback(function (index, field, value) {
        var _a;
        var newLines = __spreadArray([], values.lines, true);
        newLines[index] = __assign(__assign({}, newLines[index]), (_a = {}, _a[field] = value, _a));
        // Auto-clear the opposite amount field
        if (field === 'debit_amount' && parseFloat(value) > 0) {
            newLines[index].credit_amount = '0.00';
        }
        else if (field === 'credit_amount' && parseFloat(value) > 0) {
            newLines[index].debit_amount = '0.00';
        }
        updateField('lines', newLines);
        clearErrors();
        // Solo activar actualización automática para product_id, no para quantity o unit_price
        // porque esos se manejan mejor desde el componente ProductLine
        if (field === 'product_id') {
            // Ejecutar actualización automática después de un breve delay
            setTimeout(function () {
                updateLineAmountsFromProducts();
            }, 200);
        }
    }, [values.lines, updateField, clearErrors, updateLineAmountsFromProducts]);
    // 🆕 Funciones para manejar líneas de factura (productos)
    var addInvoiceLine = useCallback(function () {
        var newLine = {
            product_id: '',
            product_name: '',
            product_code: '',
            account_id: '',
            account_code: '',
            account_name: '',
            quantity: '1',
            unit_price: '0.00',
            discount_percentage: '0',
            tax_percentage: '0',
            total: 0
        };
        setInvoiceLines(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newLine], false); });
    }, []);
    var updateInvoiceLine = useCallback(function (index, field, value) {
        setInvoiceLines(function (prev) {
            var _a;
            var newLines = __spreadArray([], prev, true);
            newLines[index] = __assign(__assign({}, newLines[index]), (_a = {}, _a[field] = value, _a));
            // Recalcular total si cambia cantidad o precio
            if (field === 'quantity' || field === 'unit_price') {
                var quantity = parseFloat(newLines[index].quantity || '0');
                var unitPrice = parseFloat(newLines[index].unit_price || '0');
                newLines[index].total = quantity * unitPrice;
            }
            return newLines;
        });
    }, []);
    var removeInvoiceLine = useCallback(function (index) {
        setInvoiceLines(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    }, []);
    var handleInvoiceProductSelect = useCallback(function (index, product) {
        setInvoiceLines(function (prev) {
            var _a;
            var newLines = __spreadArray([], prev, true);
            var currentLine = newLines[index];
            newLines[index] = __assign(__assign({}, currentLine), { product_id: product.id, product_name: product.name, product_code: product.code || '', unit_price: ((_a = product.sale_price) === null || _a === void 0 ? void 0 : _a.toString()) || '0.00', account_id: product.income_account_id || currentLine.account_id, account_code: product.income_account_code || currentLine.account_code, account_name: product.income_account_name || currentLine.account_name, total: parseFloat(currentLine.quantity || '1') * parseFloat(product.sale_price || '0') });
            return newLines;
        });
        // Actualizar el término de búsqueda con el nombre del producto seleccionado
        setProductSearchTerms(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = product.name, _a)));
        });
        setFocusedProductInput(null);
        setProductDropdownOpen(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = false, _a)));
        });
    }, []);
    var handleInvoiceAccountSelect = useCallback(function (index, account) {
        setInvoiceLines(function (prev) {
            var newLines = __spreadArray([], prev, true);
            newLines[index] = __assign(__assign({}, newLines[index]), { account_id: account.id, account_code: account.code, account_name: account.name });
            return newLines;
        });
        // Clear search term and close dropdown
        setAccountSearchTerms(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = '', _a)));
        });
        setFocusedInput(null);
    }, []);
    // Función para manejar selección de cuentas en apuntes contables
    var handleAccountSelect = useCallback(function (index, account) {
        var newLines = __spreadArray([], values.lines, true);
        newLines[index] = __assign(__assign({}, newLines[index]), { account_id: account.id, account_code: account.code, account_name: account.name });
        updateField('lines', newLines);
        // Clear search term and close dropdown
        setAccountSearchTerms(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = '', _a)));
        });
        setFocusedInput(null);
    }, [values.lines, updateField]);
    // 🆕 Función para generar apuntes contables automáticamente desde líneas de factura
    var generateJournalEntriesFromInvoiceLines = useCallback(function () {
        if (invoiceLines.length === 0) {
            updateField('lines', []);
            return;
        }
        var journalLines = [];
        // 1. Generar líneas de débito para cada producto (cuenta de ingresos)
        invoiceLines.forEach(function (line) {
            if (line.account_id && line.total > 0) {
                journalLines.push({
                    account_id: line.account_id,
                    account_code: line.account_code,
                    account_name: line.account_name,
                    description: "".concat(line.product_name, " (").concat(line.quantity, " x ").concat(line.unit_price, ")"),
                    debit_amount: line.total.toString(),
                    credit_amount: '0.00',
                    product_id: line.product_id,
                    quantity: line.quantity,
                    unit_price: line.unit_price
                });
            }
        });
        // 2. Calcular total de la factura
        var totalInvoice = invoiceLines.reduce(function (sum, line) { return sum + line.total; }, 0);
        // 3. Generar líneas de crédito según términos de pago
        if (values.payment_terms_id && entryPaymentSchedule.length > 0) { // Con términos de pago: generar múltiples líneas según el cronograma
            entryPaymentSchedule.forEach(function (schedule) {
                journalLines.push({
                    account_id: '', // Usuario debe seleccionar cuenta (ej: cuentas por cobrar)
                    account_code: '',
                    account_name: '',
                    description: "Cobro ".concat(schedule.percentage, "% - Vence: ").concat(schedule.payment_date),
                    debit_amount: '0.00',
                    credit_amount: schedule.amount.toString(),
                    due_date: schedule.payment_date,
                    payment_terms_id: values.payment_terms_id
                });
            });
        }
        else {
            // Sin términos de pago: una sola línea de crédito
            journalLines.push({
                account_id: '', // Usuario debe seleccionar cuenta
                account_code: '',
                account_name: '',
                description: 'Total de factura',
                debit_amount: '0.00',
                credit_amount: totalInvoice.toString()
            });
        }
        updateField('lines', journalLines);
    }, [invoiceLines, values.payment_terms_id, entryPaymentSchedule, updateField]);
    // Auto-save draft functionality with debounced value check
    var draftableData = useMemo(function () {
        // Only include data that should trigger auto-save
        return {
            description: values.description,
            hasLines: values.lines.some(function (line) { return line.account_id; })
        };
    }, [values.description, values.lines]);
    useEffect(function () {
        if (!isEditMode && draftableData.description && draftableData.hasLines) {
            var saveTimer_1 = setTimeout(function () {
                // Usar la clave específica de esta sesión en lugar de generar una nueva cada vez
                localStorage.setItem(draftKey, JSON.stringify(values));
                console.log('Borrador guardado automáticamente:', draftKey);
            }, 5000); // Auto-save every 5 seconds
            return function () { return clearTimeout(saveTimer_1); };
        }
    }, [draftableData, values, isEditMode, draftKey]);
    // Limpiar borrador al desmontar el componente o cancelar
    useEffect(function () {
        return function () {
            // Limpiar solo el borrador actual al desmontar, no todos
            if (!isEditMode) {
                clearCurrentDraft();
            }
        };
    }, [clearCurrentDraft, isEditMode]);
    // Función para manejar cancelación
    var handleCancel = useCallback(function () {
        if (!isEditMode) {
            clearCurrentDraft(); // Limpiar borrador al cancelar
        }
        if (onCancel) {
            onCancel();
        }
    }, [clearCurrentDraft, isEditMode, onCancel]);
    // Limpiar borradores antiguos al inicializar (solo una vez)
    useEffect(function () {
        if (!isEditMode) {
            // Limpiar borradores que tengan más de 1 hora
            var oneHourAgo_1 = Date.now() - (60 * 60 * 1000);
            var keys = Object.keys(localStorage);
            keys.forEach(function (key) {
                if (key.startsWith('journal-entry-draft-')) {
                    var timestamp = parseInt(key.replace('journal-entry-draft-', ''));
                    if (timestamp < oneHourAgo_1) {
                        localStorage.removeItem(key);
                        console.log('Borrador antiguo eliminado:', key);
                    }
                }
            });
        }
    }, []); // Solo ejecutar una vez al montar  // Propagar automáticamente third_party_id, cost_center_id, payment_terms_id, invoice_date y due_date 
    // desde el nivel del asiento a todas las líneas cuando cambien
    useEffect(function () {
        var updatedLines = values.lines.map(function (line) { return (__assign(__assign({}, line), { 
            // Lógica de limpieza y propagación
            third_party_id: values.third_party_id || (line.third_party_id !== values.third_party_id ? undefined : line.third_party_id), cost_center_id: values.cost_center_id || (line.cost_center_id !== values.cost_center_id ? undefined : line.cost_center_id), 
            // Manejo especial para payment terms con limpieza de conflictos
            payment_terms_id: values.payment_terms_id ? values.payment_terms_id : undefined, invoice_date: values.payment_terms_id && values.invoice_date ? values.invoice_date : undefined, due_date: !values.payment_terms_id && values.due_date ? values.due_date : undefined })); });
        // Solo actualizar si hay cambios reales
        var hasChanges = updatedLines.some(function (line, index) {
            var originalLine = values.lines[index];
            return line.third_party_id !== originalLine.third_party_id ||
                line.cost_center_id !== originalLine.cost_center_id ||
                line.payment_terms_id !== originalLine.payment_terms_id ||
                line.invoice_date !== originalLine.invoice_date ||
                line.due_date !== originalLine.due_date;
        });
        if (hasChanges) {
            console.log('🔄 Propagando cambios a las líneas:', {
                third_party_id: values.third_party_id,
                cost_center_id: values.cost_center_id,
                payment_terms_id: values.payment_terms_id,
                invoice_date: values.invoice_date,
                due_date: values.due_date
            });
            updateField('lines', updatedLines);
        }
    }, [values.third_party_id, values.cost_center_id, values.payment_terms_id,
        values.invoice_date, values.due_date, updateField]);
    // 🆕 Efecto para generar automáticamente apuntes contables desde líneas de factura
    useEffect(function () {
        generateJournalEntriesFromInvoiceLines();
    }, [invoiceLines, values.payment_terms_id, entryPaymentSchedule, generateJournalEntriesFromInvoiceLines]);
    // Efecto para ejecutar la actualización automática cuando cambien productos o origen
    useEffect(function () {
        // Solo ejecutar si hay un origen de transacción definido
        if (values.transaction_origin) {
            // Ejecutar con un delay mayor para dar tiempo al usuario a escribir
            var timer_1 = setTimeout(function () {
                updateLineAmountsFromProducts();
            }, 1000); // Aumentado a 1 segundo para evitar interferir con la escritura
            return function () { return clearTimeout(timer_1); };
        }
    }, [values.transaction_origin]); // Removido updateLineAmountsFromProducts de las dependencias para evitar loops
    // Si estamos en modo edición y aún estamos cargando los datos, mostrar spinner
    if (isEditMode && (loadingEntry || (entryId && !existingEntry))) {
        return (<div className="flex justify-center items-center py-12">
        <Spinner size="lg"/>
        <span className="ml-3 text-gray-600">Cargando datos del asiento...</span>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Form Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="card-title">
              {isEditMode ? 'Editar Asiento Contable' : 'Nuevo Asiento Contable'}
            </h3>            <div className="flex items-center space-x-4">
              {/* Balance indicator - más prominente */}
              <div className={"px-4 py-2 rounded-lg text-sm font-semibold border-2 ".concat(balance.is_balanced
            ? 'bg-green-50 text-green-800 border-green-200'
            : 'bg-red-50 text-red-800 border-red-200 animate-pulse')}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {balance.is_balanced ? '✅' : '⚠️'}
                  </span>
                  <span>
                    {balance.is_balanced ? 'Balanceado' : 'Desbalanceado'}
                  </span>
                </div>
              </div>
              {!balance.is_balanced && Math.abs(balance.difference) > 0.01 && (<div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                  <span className="font-semibold">Diferencia:</span> {formatCurrency(Math.abs(balance.difference))}
                  <br />
                  <span className="text-xs">
                    {balance.difference > 0 ? 'Exceso en débitos' : 'Exceso en créditos'}
                  </span>
                </div>)}
            </div>
          </div>
        </div>        <form onSubmit={handleSubmit} className="card-body space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="entry_date" className="form-label">
                Fecha del Asiento *
              </label>
              <Input id="entry_date" type="date" value={values.entry_date} onChange={handleInputChange('entry_date')} error={getFieldError('entry_date')}/>
              {getFieldError('entry_date') && (<ValidationMessage type="error" message={getFieldError('entry_date')}/>)}
            </div>

            <div>
              <label htmlFor="entry_type" className="form-label">
                Tipo de Asiento *
              </label>
              <select id="entry_type" value={values.entry_type} onChange={handleInputChange('entry_type')} className="form-select">
                {Object.entries(JOURNAL_ENTRY_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                    {label}
                  </option>);
        })}
              </select>
              {getFieldError('entry_type') && (<ValidationMessage type="error" message={getFieldError('entry_type')}/>)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reference" className="form-label">
                Referencia
              </label>
              <Input id="reference" value={values.reference || ''} onChange={handleInputChange('reference')} placeholder="Ej: FAC-001, CHQ-123" error={getFieldError('reference')}/>
              {getFieldError('reference') && (<ValidationMessage type="error" message={getFieldError('reference')}/>)}
            </div>

            <div>
              <label htmlFor="external_reference" className="form-label">
                Referencia Externa
              </label>
              <Input id="external_reference" value={values.external_reference || ''} onChange={handleInputChange('external_reference')} placeholder="Referencia del sistema externo" error={getFieldError('external_reference')}/>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Descripción *
            </label>
            <Input id="description" value={values.description} onChange={handleInputChange('description')} placeholder="Descripción del asiento contable" error={getFieldError('description')}/>            {getFieldError('description') && (<ValidationMessage type="error" message={getFieldError('description')}/>)}
          </div>          {/* Payment Terms and Due Date Section */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Información de Facturación y Costos</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              <div>
                <label htmlFor="third_party_id" className="form-label">
                  Tercero (Cliente/Proveedor)
                </label>
                <div className="relative">
                  <Input id="third_party_id" value={thirdPartySearchTerm || (function () {
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
                updateField('third_party_id', '');
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
        }} placeholder="Buscar por código, nombre o documento..." className="form-input"/>
                  
                  {thirdPartyDropdownOpen && getFilteredThirdParties(thirdPartySearchTerm).length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {getFilteredThirdParties(thirdPartySearchTerm).map(function (thirdParty) { return (<div key={thirdParty.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () {
                    updateField('third_party_id', thirdParty.id);
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
                            </div>                            <span className={"px-2 py-1 text-xs rounded-full ".concat(thirdParty.third_party_type === 'customer'
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
                <label htmlFor="cost_center_id" className="form-label">
                  Centro de Costo
                </label>
                <select id="cost_center_id" value={values.cost_center_id || ''} onChange={handleInputChange('cost_center_id')} className="form-select">
                  <option value="">Seleccionar centro de costo...</option>
                  {costCenters.map(function (costCenter) { return (<option key={costCenter.id} value={costCenter.id}>
                      {costCenter.code} - {costCenter.name}
                    </option>); })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Se aplicará a todas las líneas del asiento
                </p>
              </div>
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="payment_terms_id" className="form-label">
                  Condiciones de Pago
                </label>
                <select id="payment_terms_id" value={values.payment_terms_id || ''} onChange={handleInputChange('payment_terms_id')} className="form-select">
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
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Seleccionar condiciones de pago limpia la fecha de vencimiento manual</p>
                  <p>• Establecer fecha de vencimiento manual limpia las condiciones de pago</p>
                  <p>• Dejar las descripciones de líneas vacías usa la descripción general</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="invoice_date" className="form-label">
                  Fecha de Factura
                  {values.payment_terms_id && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Input id="invoice_date" type="date" value={values.invoice_date || ''} onChange={handleInputChange('invoice_date')} error={getFieldError('invoice_date')}/>
                {getFieldError('invoice_date') && (<ValidationMessage type="error" message={getFieldError('invoice_date')}/>)}
              </div>

              <div>
                <label htmlFor="due_date" className="form-label">
                  Fecha de Vencimiento
                  {!values.payment_terms_id && values.due_date && <span className="text-blue-500 ml-1">(Manual)</span>}
                </label>                <Input id="due_date" type="date" value={values.due_date || ''} onChange={handleInputChange('due_date')} disabled={!!values.payment_terms_id} error={getFieldError('due_date')} className={values.payment_terms_id ? 'bg-gray-100' : ''}/>
                {getFieldError('due_date') && (<ValidationMessage type="error" message={getFieldError('due_date')}/>)}
                {values.payment_terms_id && (<p className="text-xs text-blue-600 mt-1">
                    🔒 Deshabilitado - Se calculará automáticamente según las condiciones de pago
                  </p>)}
                {!values.payment_terms_id && (<p className="text-xs text-gray-500 mt-1">
                    ⚠️ Al establecer una fecha manual se limpiarán las condiciones de pago
                  </p>)}
              </div>            </div>          </div>
        </form>
      </Card>

      {/* Origen de Transacción */}
      <Card>
        <div className="card-header">
          <h4 className="card-title">Origen de Transacción</h4>
        </div>
        <div className="card-body">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-blue-900">
                Tipo de Transacción
              </label>
              {values.transaction_origin && (<span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ".concat(getTransactionOriginColor(values.transaction_origin))}>
                  {TransactionOriginLabels[values.transaction_origin]}
                </span>)}
            </div>
            
            <select value={values.transaction_origin || ''} onChange={function (e) {
            updateField('transaction_origin', e.target.value || undefined);
        }} disabled={loading} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
              <option value="">Seleccionar origen...</option>
              {Object.entries(TransactionOriginLabels).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                  {label}
                </option>);
        })}
            </select>
            
            {values.transaction_origin && ['sale', 'purchase'].includes(values.transaction_origin) && (<p className="text-xs text-blue-700 mt-2">
                💡 Este tipo de transacción comúnmente incluye productos. Las secciones de productos se han expandido automáticamente.
              </p>)}
          </div>
        </div>
      </Card>          {/* Diseño estilo Odoo - Líneas de factura y Apuntes contables */}
      <Card>
        <div className="card-body">
          <div className="space-y-6">            {/* Líneas de Factura */}            <div className={"bg-white border border-gray-200 rounded-lg relative transition-all duration-200 ".concat(hasOpenInvoiceDropdowns ? 'overflow-visible pb-64' : 'overflow-hidden')}>
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-semibold text-blue-900 flex items-center">
                    <span className="mr-2">📋</span>
                    Líneas de factura
                  </h5>
                  <div className="flex space-x-2">
                    <Button type="button" variant="secondary" onClick={addInvoiceLine} size="sm" className="text-xs">
                      + Agregar línea
                    </Button>                  </div>
                </div>
              </div>                <div className={"overflow-x-auto transition-all duration-200 ".concat(hasOpenInvoiceDropdowns ? 'overflow-y-visible' : 'overflow-y-visible')}>
                <table className="min-w-full table-fixed relative">
                  <thead className="bg-gray-50">
                    <tr>                      <th className="w-1/4 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="w-1/5 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="w-1/12 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="w-1/12 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidad
                      </th>
                      <th className="w-1/8 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="w-1/8 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="w-1/12 px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceLines.map(function (line, index) {
            var _a;
            var quantity = parseFloat(line.quantity || '0');
            var unitPrice = parseFloat(line.unit_price || '0');
            var total = quantity * unitPrice;
            return (<tr key={index} className={"hover:bg-gray-50 transition-all duration-200 ".concat((productDropdownOpen[index] || focusedInvoiceInput === index) ? 'h-auto min-h-20' : 'h-20')}>
                          <td className="w-1/4 px-4 py-4 align-top">
                            <div className={"relative transition-all duration-200 ".concat((productDropdownOpen[index] || focusedInvoiceInput === index) ? 'h-auto min-h-12 pb-64' : 'h-12')}>
                              {/* Autocomplete para buscar productos por nombre */}
                              <div className="relative"><Input value={(_a = productSearchTerms[index]) !== null && _a !== void 0 ? _a : (line.product_name || '')} onChange={function (e) {
                    var searchTerm = e.target.value;
                    setProductSearchTerms(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = searchTerm, _a)));
                    });
                    setProductDropdownOpen(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = searchTerm.length > 0, _a)));
                    });
                    // Si borra el texto completamente, limpiar la selección
                    if (searchTerm === '') {
                        updateInvoiceLine(index, 'product_id', '');
                        updateInvoiceLine(index, 'product_name', '');
                        updateInvoiceLine(index, 'product_code', '');
                    }
                }} onFocus={function () {
                    setFocusedProductInput(index);
                    setProductDropdownOpen(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = true, _a)));
                    });
                }} onBlur={function () {
                    setTimeout(function () {
                        setFocusedProductInput(null);
                        setProductDropdownOpen(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[index] = false, _a)));
                        });
                        // Si no hay selección, limpiar el término
                        if (!line.product_id) {
                            setProductSearchTerms(function (prev) {
                                var newTerms = __assign({}, prev);
                                delete newTerms[index];
                                return newTerms;
                            });
                        }
                    }, 200);
                }} placeholder={line.product_id ? "Producto seleccionado" : "Buscar producto por nombre..."} className="text-sm w-full h-10"/>                                {/* Dropdown de productos */}
                                {productDropdownOpen[index] && (<div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[300px] max-w-[400px]">
                                    {getFilteredProducts(productSearchTerms[index] || '').map(function (product) { return (<div key={product.id} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () { return handleInvoiceProductSelect(index, product); }}>
                                        <div className="text-sm font-medium text-gray-900">
                                          {product.code} - {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Precio: ${product.sale_price || 0}
                                        </div>
                                      </div>); })}
                                    {getFilteredProducts(productSearchTerms[index] || '').length === 0 && (<div className="px-3 py-2 text-sm text-gray-500">
                                        No se encontraron productos
                                      </div>)}
                                  </div>)}                                {/* Mostrar producto seleccionado como placeholder en el input */}
                                {line.product_id && !productSearchTerms[index] && focusedProductInput !== index && (<div className="absolute inset-0 pointer-events-none">
                                    <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium">
                                      📦 {line.product_name || line.product_id}
                                    </div>
                                  </div>)}
                              </div>                            </div>                          </td>                          <td className="w-1/5 px-4 py-4 align-top">
                            <div className={"relative transition-all duration-200 ".concat(focusedInvoiceInput === index ? 'h-auto min-h-12 pb-64' : 'h-12')}>
                              <Input value={accountSearchTerms[index] || line.account_code || ''} onChange={function (e) {
                    var searchTerm = e.target.value;
                    setAccountSearchTerms(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = searchTerm, _a)));
                    });
                    if (searchTerm === '' && line.account_id) {
                        updateInvoiceLine(index, 'account_id', '');
                        updateInvoiceLine(index, 'account_code', '');
                        updateInvoiceLine(index, 'account_name', '');
                    }
                }} onFocus={function () { return setFocusedInvoiceInput(index); }} onBlur={function () { return setTimeout(function () { return setFocusedInvoiceInput(null); }, 200); }} placeholder="Buscar cuenta..." className="text-sm w-full h-10"/>                              {(accountSearchTerms[index] || focusedInvoiceInput === index) && (<div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                                  {getFilteredAccounts(accountSearchTerms[index] || '').map(function (account) { return (<div key={account.id} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () { return handleInvoiceAccountSelect(index, account); }}>
                                      <div className="text-sm">
                                        <span className="font-medium text-blue-600">{account.code}</span>
                                        <span className="text-gray-600 ml-2">{account.name}</span>
                                      </div>
                                    </div>); })}
                                  {getFilteredAccounts(accountSearchTerms[index] || '').length === 0 && (<div className="px-3 py-2 text-sm text-gray-500">
                                      No se encontraron cuentas
                                    </div>)}
                                </div>)}                                {/* Mostrar cuenta seleccionada como placeholder en el input */}
                              {line.account_id && !accountSearchTerms[index] && focusedInvoiceInput !== index && (<div className="absolute inset-0 pointer-events-none">
                                  <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded border border-green-200 font-medium">
                                    🏦 {line.account_code} - {line.account_name}
                                  </div>
                                </div>)}
                            </div>
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <Input type="number" step="0.01" min="0" value={line.quantity || ''} onChange={function (e) { return updateInvoiceLine(index, 'quantity', e.target.value); }} placeholder="0" className="text-sm text-right w-full h-10"/>
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <div className="text-sm text-gray-600 text-center h-10 flex items-center justify-center">
                              und
                            </div>
                          </td>                          <td className="w-1/8 px-4 py-4 align-top">
                            <Input type="number" step="0.01" min="0" value={line.unit_price || ''} onChange={function (e) { return updateInvoiceLine(index, 'unit_price', e.target.value); }} placeholder="0.00" className="text-sm text-right w-full h-10"/>
                          </td>
                          <td className="w-1/8 px-4 py-4 text-right align-top">
                            <span className="text-sm font-medium text-gray-900 h-10 flex items-center justify-end">
                              {formatCurrency(total || 0)}
                            </span>
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <div className="flex justify-center space-x-1">
                              {invoiceLines.length > 0 && (<Button type="button" size="sm" variant="danger" onClick={function () { return removeInvoiceLine(index); }} className="text-xs p-1" title="Eliminar línea">
                                  🗑️
                                </Button>)}
                            </div>
                          </td>
                        </tr>);
        })}                    {invoiceLines.length === 0 && (<tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="text-3xl mb-3">📋</div>
                            <p className="text-base font-medium">No hay líneas de factura</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Haz clic en "Agregar línea" para añadir productos
                            </p>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>            {/* Apuntes Contables */}            <div className={"bg-white border border-gray-200 rounded-lg relative transition-all duration-200 ".concat(hasOpenAccountDropdowns ? 'overflow-visible pb-64' : 'overflow-hidden')}>
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-semibold text-green-900 flex items-center">
                    <span className="mr-2">⚖️</span>
                    Apuntes contables
                  </h5>
                  <div className="flex items-center space-x-4">
                    <div className={"text-xs px-3 py-1 rounded-full ".concat(balance.is_balanced
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800')}>
                      {balance.is_balanced ? '✅ Balanceado' : '⚠️ Desbalanceado'}
                    </div>
                    {!balance.is_balanced && Math.abs(balance.difference) > 0.01 && (<Button type="button" onClick={function () { return autoBalanceEntry(); }} variant="primary" size="sm" disabled={loading} className="text-xs">
                        ⚖️ Auto-Balancear
                      </Button>)}
                  </div>
                </div>              </div>                <div className={"overflow-x-auto transition-all duration-200 ".concat(hasOpenAccountDropdowns ? 'overflow-y-visible' : 'overflow-y-visible')}>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Venc.
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Débito
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédito
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {values.lines.map(function (line, index) {
            var hasAmount = parseFloat(line.debit_amount || '0') > 0 || parseFloat(line.credit_amount || '0') > 0;
            return (<tr key={index} className={"".concat(hasAmount ? 'bg-white' : 'bg-gray-50', " hover:bg-blue-50 transition-all duration-200 ").concat(focusedInput === index ? 'h-auto min-h-16' : 'h-auto')}>                          <td className="px-3 py-2">
                            <div className={"relative transition-all duration-200 ".concat(focusedInput === index ? 'h-auto pb-64' : 'h-auto')}>
                              <Input value={accountSearchTerms[index] || line.account_code || ''} onChange={function (e) {
                    var searchTerm = e.target.value;
                    setAccountSearchTerms(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[index] = searchTerm, _a)));
                    });
                    if (searchTerm === '' && line.account_id) {
                        var newLines = __spreadArray([], values.lines, true);
                        newLines[index] = __assign(__assign({}, newLines[index]), { account_id: '', account_code: '', account_name: '' });
                        updateField('lines', newLines);
                    }
                }} onFocus={function () { return setFocusedInput(index); }} onBlur={function () { return setTimeout(function () { return setFocusedInput(null); }, 200); }} placeholder="Buscar cuenta..." className="text-sm w-full"/>                              {(accountSearchTerms[index] || focusedInput === index) && (<div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                                  {getFilteredAccounts(accountSearchTerms[index] || '').map(function (account) { return (<div key={account.id} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={function () { return handleAccountSelect(index, account); }}>
                                      <div className="text-sm">
                                        <span className="font-medium text-blue-600">{account.code}</span>
                                        <span className="text-gray-600 ml-2">{account.name}</span>
                                      </div>
                                    </div>); })}
                                  {getFilteredAccounts(accountSearchTerms[index] || '').length === 0 && (<div className="px-3 py-2 text-sm text-gray-500">
                                      No se encontraron cuentas
                                    </div>)}
                                </div>)}
                              
                              {line.account_id && !accountSearchTerms[index] && focusedInput !== index && (<div className="text-xs text-gray-500 mt-1">
                                  {line.account_code} - {line.account_name}
                                </div>)}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm text-gray-900">
                              {line.description || values.description || '-'}
                            </div>
                            {line.product_id && (<div className="text-xs text-blue-600 mt-1">
                                📦 Producto: {line.product_id}
                                {line.quantity && line.unit_price && (<span className="ml-2">
                                    ({parseFloat(line.quantity).toFixed(2)} × {formatCurrency(parseFloat(line.unit_price))})
                                  </span>)}
                              </div>)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="text-sm">
                              {line.due_date ? (<span className="text-gray-900">
                                  {new Date(line.due_date).toLocaleDateString('es-ES')}
                                </span>) : values.due_date ? (<span className="text-gray-600">
                                  {new Date(values.due_date).toLocaleDateString('es-ES')}
                                </span>) : (<span className="text-gray-400">-</span>)}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="space-y-1">
                              <Input type="number" step="0.01" min="0" value={line.debit_amount} onChange={function (e) { return handleLineChange(index, 'debit_amount', e.target.value); }} className="text-sm text-right w-24" placeholder="0.00"/>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="space-y-1">
                              <Input type="number" step="0.01" min="0" value={line.credit_amount} onChange={function (e) { return handleLineChange(index, 'credit_amount', e.target.value); }} className="text-sm text-right w-24" placeholder="0.00"/>
                            </div>
                          </td>
                        </tr>);
        })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                        Totales:
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-bold text-green-700">
                        {formatCurrency(balance.total_debit)}
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-bold text-blue-700">
                        {formatCurrency(balance.total_credit)}
                      </td>
                    </tr>
                    {!balance.is_balanced && (<tr>
                        <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-red-900">
                          Diferencia:
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-right text-sm font-bold text-red-700">
                          {formatCurrency(Math.abs(balance.difference))}
                          <span className="text-xs ml-1">
                            ({balance.difference > 0 ? 'Exceso débitos' : 'Exceso créditos'})
                          </span>
                        </td>
                      </tr>)}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cronograma de Pagos - Sección movida al final */}
      <Card>
        <div className="card-body">
          {/* Estado del cronograma de pagos */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-medium text-gray-700 flex items-center">
                📊 Calcular Cronograma de Pagos
              </h6>
              <div className="flex items-center space-x-2">
                {values.payment_terms_id && values.invoice_date && invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0) > 0 && (<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Listo para calcular
                  </span>)}
                <button type="button" onClick={function () {
            console.log('🔄 Forzando recálculo del cronograma...');
            calculateEntryPaymentSchedule();
        }} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                   🔄 Recalcular
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className={"mr-3 text-lg ".concat(values.payment_terms_id ? 'text-green-600' : 'text-gray-400')}>
                  {values.payment_terms_id ? '✓' : '○'}
                </span>
                <span className="flex-1">Condiciones de pago seleccionadas</span>
                {values.payment_terms_id && (<span className="text-blue-600 font-medium text-xs">
                    {(_b = paymentTerms.find(function (pt) { return pt.id === values.payment_terms_id; })) === null || _b === void 0 ? void 0 : _b.code} - {(_c = paymentTerms.find(function (pt) { return pt.id === values.payment_terms_id; })) === null || _c === void 0 ? void 0 : _c.name}
                  </span>)}
              </div>
              
              <div className="flex items-center">
                <span className={"mr-3 text-lg ".concat(invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0) > 0 ? 'text-green-600' : 'text-gray-400')}>
                  {invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0) > 0 ? '✓' : '○'}
                </span>
                <span className="flex-1">Monto válido (mayor a 0)</span>
                <span className="text-blue-600 font-medium text-xs">
                  {formatCurrency(invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0))}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className={"mr-3 text-lg ".concat(values.invoice_date ? 'text-green-600' : 'text-gray-400')}>
                  {values.invoice_date ? '✓' : '○'}
                </span>
                <span className="flex-1">Fecha de factura seleccionada</span>
                {values.invoice_date && (<span className="text-blue-600 font-medium text-xs">
                    {new Date(values.invoice_date).toLocaleDateString('es-ES')}
                  </span>)}
              </div>
              
              <div className="flex items-center">
                <span className={"mr-3 text-lg ".concat(entryPaymentSchedule.length > 0 ? 'text-green-600' : 'text-gray-400')}>
                  {entryPaymentSchedule.length > 0 ? '✓' : '○'}
                </span>
                <span className="flex-1">Cronograma calculado</span>
                <span className="text-blue-600 font-medium text-xs">
                  {entryPaymentSchedule.length > 0 ? "".concat(entryPaymentSchedule.length, " cronograma(s) definido(s)") : 'Sin cronograma'}
                </span>
              </div>

              {calculatingSchedule && (<div className="mt-3 flex items-center text-blue-600">
                  <span className="mr-2">⏳</span>
                  <span>Calculando cronograma...</span>
                </div>)}
              {scheduleError && (<div className="mt-3 flex items-center text-red-600">
                  <span className="mr-2">❌</span>
                  <span>Error: {scheduleError}</span>
                </div>)}
            </div>
          </div>

          {/* Payment Schedule Display */}
          {showPaymentSchedule && entryPaymentSchedule.length > 0 && (<div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-blue-900 flex items-center">
                  📅 Cronograma de Pagos
                </h5>
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {entryPaymentSchedule.length} cuota{entryPaymentSchedule.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Resumen del Cálculo */}
              <div className="mb-6 p-4 bg-white border border-blue-100 rounded-lg">
                <h6 className="font-medium text-gray-900 mb-3">Resumen del Cálculo</h6>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Condiciones</span>
                    <div className="font-medium text-gray-900">
                      {((_d = paymentTerms.find(function (pt) { return pt.id === values.payment_terms_id; })) === null || _d === void 0 ? void 0 : _d.name) || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Monto Total</span>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Número de Cuotas</span>
                    <div className="font-medium text-gray-900">
                      {entryPaymentSchedule.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Plazo Máximo</span>
                    <div className="font-medium text-gray-900">
                      {Math.max.apply(Math, entryPaymentSchedule.map(function (p) { return p.days; }))} días
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Cálculo realizado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
                </div>
              </div>

              {/* Tabla del Cronograma */}
              <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
                <div className="bg-blue-100 px-4 py-2">
                  <h6 className="font-medium text-blue-900">Cronograma de Pagos</h6>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entryPaymentSchedule.map(function (payment, index) { return (<tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                              {payment.sequence}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {payment.days}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {(Number(payment.percentage) || 0).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {payment.description || "Cuota ".concat(payment.sequence)}
                          </td>
                        </tr>); })}
                    </tbody>
                  </table>
                </div>
                
                {/* Totales */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Monto factura:</span>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total cronograma:</span>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(entryPaymentSchedule.reduce(function (sum, p) { return sum + p.amount; }, 0))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">% Total:</span>
                      <div className="font-medium text-gray-900">
                        {entryPaymentSchedule.reduce(function (sum, p) { return sum + (Number(p.percentage) || 0); }, 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Diferencia si existe */}
                  {Math.abs(entryPaymentSchedule.reduce(function (sum, p) { return sum + p.amount; }, 0) -
                invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0)) > 0.01 && (<div className="mt-2 text-sm">
                      <span className="text-red-600">Diferencia:</span>
                      <span className="font-medium text-red-600 ml-1">
                        {formatCurrency(Math.abs(entryPaymentSchedule.reduce(function (sum, p) { return sum + p.amount; }, 0) -
                    invoiceLines.reduce(function (sum, line) { return sum + (line.total || 0); }, 0)))}
                      </span>
                    </div>)}
                </div>
              </div>

              {calculatingSchedule && (<div className="text-center py-2 mt-4">
                  <span className="text-sm text-blue-600">⏳ Calculando cronograma...</span>
                </div>)}

              {scheduleError && (<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ❌ Error al calcular cronograma: {scheduleError}
                </div>)}
            </div>)}

          {/* Mensaje informativo cuando hay términos de pago pero no cronograma */}
          {values.payment_terms_id && !showPaymentSchedule && entryPaymentSchedule.length === 0 && (<div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">ℹ️</span>
                <span>
                  El término de pago seleccionado utiliza fecha de vencimiento simple.
                  {values.due_date && (<span className="ml-1 font-medium">
                      Vence: {new Date(values.due_date).toLocaleDateString('es-ES')}
                    </span>)}
                </span>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Form Actions */}
      <Card>
        <div className="card-body">
          <div className="flex justify-end space-x-3">            {onCancel && (<Button type="button" variant="secondary" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>)}            <Button type="button" disabled={loading || !balance.is_balanced} onClick={function () {
            console.log('🔘 Click en botón submit JournalEntry - isEditMode:', isEditMode, 'loading:', loading, 'balanced:', balance.is_balanced);
            handleSubmit();
        }} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (<Spinner size="sm"/>) : (isEditMode ? 'Actualizar Asiento' : 'Crear Asiento')}            </Button>
          </div>
        </div>
      </Card>
    </div>);
};
