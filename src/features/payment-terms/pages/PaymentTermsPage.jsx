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
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { usePaymentTermsList } from '../hooks/usePaymentTerms';
import { PaymentTermsService } from '../services/paymentTermsService';
import { PaymentTermsSelector } from '../components/PaymentTermsSelector';
import { PaymentScheduleDisplay } from '../components/PaymentScheduleDisplay';
import { PaymentTermsModal } from '../components/PaymentTermsModal';
export var PaymentTermsPage = function () {
    var _a = usePaymentTermsList({
        initialFilters: { is_active: true },
        autoLoad: true
    }), paymentTerms = _a.paymentTerms, loading = _a.loading, error = _a.error, refreshPaymentTerms = _a.refreshPaymentTerms, filters = _a.filters, setFilters = _a.setFilters, removePaymentTermsLocal = _a.removePaymentTermsLocal, updatePaymentTermsLocal = _a.updatePaymentTermsLocal, addPaymentTermsLocal = _a.addPaymentTermsLocal;
    var _b = useState(null), selectedPaymentTerms = _b[0], setSelectedPaymentTerms = _b[1];
    var _c = useState('1000.00'), testAmount = _c[0], setTestAmount = _c[1];
    var _d = useState(new Date().toISOString().split('T')[0]), testInvoiceDate = _d[0], setTestInvoiceDate = _d[1];
    var _e = useState([]), calculatedSchedule = _e[0], setCalculatedSchedule = _e[1];
    var _f = useState(false), calculating = _f[0], setCalculating = _f[1];
    var _g = useState(false), loadingDetails = _g[0], setLoadingDetails = _g[1];
    var _h = useState(''), searchTerm = _h[0], setSearchTerm = _h[1];
    var _j = useState(false), showCreateModal = _j[0], setShowCreateModal = _j[1];
    var _k = useState(false), showEditModal = _k[0], setShowEditModal = _k[1];
    var _l = useState(null), calculationError = _l[0], setCalculationError = _l[1];
    // Estados para modales de confirmación
    var _m = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: function () { },
        confirmText: 'Confirmar',
        isLoading: false
    }), confirmationModal = _m[0], setConfirmationModal = _m[1];
    // Función utilitaria para formatear montos
    var formatCurrency = function (amount) {
        return amount.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    // Función utilitaria para validar datos de entrada
    var validateCalculationInputs = function () {
        var errors = [];
        if (!selectedPaymentTerms) {
            errors.push('Debe seleccionar condiciones de pago');
        }
        if (!testAmount || testAmount.trim() === '') {
            errors.push('Debe ingresar un monto');
        }
        else {
            var amount = parseFloat(testAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('El monto debe ser un número mayor a 0');
            }
        }
        if (!testInvoiceDate) {
            errors.push('Debe seleccionar una fecha de factura');
        }
        if (selectedPaymentTerms && (!selectedPaymentTerms.payment_schedules || selectedPaymentTerms.payment_schedules.length === 0)) {
            errors.push('Las condiciones de pago seleccionadas no tienen cronogramas definidos');
        }
        return errors;
    };
    // Filter payment terms based on search
    var filteredPaymentTerms = (paymentTerms || []).filter(function (pt) {
        var _a;
        return pt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (((_a = pt.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    });
    var handlePaymentTermsSelect = function (paymentTerms) { return __awaiter(void 0, void 0, void 0, function () {
        var fullPaymentTerms, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!paymentTerms) {
                        setSelectedPaymentTerms(null);
                        setCalculatedSchedule([]);
                        setCalculationError(null);
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    setLoadingDetails(true);
                    setCalculationError(null);
                    // Obtener los datos completos por ID
                    console.log('📋 Payment Terms - Datos del listado:', {
                        id: paymentTerms.id,
                        code: paymentTerms.code,
                        name: paymentTerms.name,
                        schedulesCount: ((_a = paymentTerms.payment_schedules) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        schedules: paymentTerms.payment_schedules
                    });
                    return [4 /*yield*/, PaymentTermsService.getPaymentTermsById(paymentTerms.id)];
                case 2:
                    fullPaymentTerms = _c.sent();
                    console.log('🔍 Payment Terms - Datos completos obtenidos:', {
                        id: fullPaymentTerms.id,
                        code: fullPaymentTerms.code,
                        name: fullPaymentTerms.name,
                        schedulesCount: ((_b = fullPaymentTerms.payment_schedules) === null || _b === void 0 ? void 0 : _b.length) || 0,
                        schedules: fullPaymentTerms.payment_schedules
                    });
                    setSelectedPaymentTerms(fullPaymentTerms);
                    setCalculatedSchedule([]);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    console.error('Error al obtener detalles de payment terms:', error_1);
                    setCalculationError("Error al cargar detalles: ".concat(error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                    // Usar los datos del listado como fallback
                    setSelectedPaymentTerms(paymentTerms);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingDetails(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var calculateSchedule = function () { return __awaiter(void 0, void 0, void 0, function () {
        var validationErrors, amount_1, invoiceDate_1, schedules, totalPercentage, schedule, calculatedTotal, difference, lastIndex;
        return __generator(this, function (_a) {
            // Limpiar errores previos
            setCalculationError(null);
            validationErrors = validateCalculationInputs();
            if (validationErrors.length > 0) {
                setCalculationError(validationErrors.join('. '));
                return [2 /*return*/];
            }
            setCalculating(true);
            try {
                amount_1 = parseFloat(testAmount);
                invoiceDate_1 = new Date(testInvoiceDate);
                schedules = selectedPaymentTerms.payment_schedules || [];
                totalPercentage = schedules.reduce(function (sum, ps) { return sum + ps.percentage; }, 0);
                if (Math.abs(totalPercentage - 100) >= 0.000001) {
                    console.warn("Los porcentajes no suman exactamente 100.000000% (suma actual: ".concat(totalPercentage.toFixed(6), "%)"));
                }
                schedule = schedules.map(function (ps) {
                    var paymentDate = new Date(invoiceDate_1);
                    paymentDate.setDate(paymentDate.getDate() + ps.days);
                    // Calcular monto exacto considerando redondeo
                    var scheduleAmount = Math.round((amount_1 * ps.percentage / 100) * 100) / 100;
                    return {
                        sequence: ps.sequence,
                        days: ps.days,
                        percentage: ps.percentage,
                        amount: scheduleAmount,
                        payment_date: paymentDate.toISOString().split('T')[0],
                        description: ps.description || "Cuota ".concat(ps.sequence, " - ").concat(ps.percentage, "%")
                    };
                });
                calculatedTotal = schedule.reduce(function (sum, item) { return sum + item.amount; }, 0);
                difference = amount_1 - calculatedTotal;
                if (Math.abs(difference) > 0.01) {
                    lastIndex = schedule.length - 1;
                    schedule[lastIndex].amount = Math.round((schedule[lastIndex].amount + difference) * 100) / 100;
                    console.info("Ajuste de redondeo aplicado: ".concat(difference.toFixed(2), " en la \u00FAltima cuota"));
                }
                setCalculatedSchedule(schedule);
                console.log('Cronograma calculado:', {
                    paymentTerms: selectedPaymentTerms.name,
                    invoiceDate: testInvoiceDate,
                    totalAmount: amount_1,
                    schedulesCount: schedule.length,
                    calculatedTotal: schedule.reduce(function (sum, item) { return sum + item.amount; }, 0),
                    schedule: schedule
                });
            }
            catch (error) {
                console.error('Error calculating schedule:', error);
                setCalculationError("Error inesperado: ".concat(error instanceof Error ? error.message : 'Error desconocido'));
            }
            finally {
                setCalculating(false);
            }
            return [2 /*return*/];
        });
    }); };
    var toggleActiveFilter = function () {
        setFilters(__assign(__assign({}, filters), { is_active: !filters.is_active }));
    };
    var handleCreateSuccess = function (newPaymentTerms) {
        console.log('Condiciones de pago creadas exitosamente:', newPaymentTerms);
        // Verificar si el nuevo término cumple con los filtros actuales
        var shouldShowInCurrentView = (filters.is_active === undefined || filters.is_active === newPaymentTerms.is_active);
        if (shouldShowInCurrentView) {
            // Agregar inmediatamente a la vista local
            addPaymentTermsLocal(newPaymentTerms);
        }
        else {
            // Si no cumple con los filtros, mostrar mensaje informativo
            console.log('El nuevo término de pago no cumple con los filtros actuales, no se mostrará hasta cambiar filtros');
        }
        // Seleccionar las nuevas condiciones de pago creadas
        setSelectedPaymentTerms(newPaymentTerms);
        setShowCreateModal(false);
    };
    var handleEditSuccess = function (updatedPaymentTerms) {
        console.log('Condiciones de pago editadas exitosamente:', updatedPaymentTerms);
        // Actualizar inmediatamente en la vista local
        updatePaymentTermsLocal(updatedPaymentTerms);
        // Actualizar las condiciones seleccionadas
        setSelectedPaymentTerms(updatedPaymentTerms);
        setShowEditModal(false);
    };
    var handleDeletePaymentTerms = function (paymentTerms, event) { return __awaiter(void 0, void 0, void 0, function () {
        var checkResult, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.stopPropagation(); // Evitar que se seleccione el item
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, PaymentTermsService.checkCanDeletePaymentTerms(paymentTerms.id)];
                case 2:
                    checkResult = _a.sent();
                    if (checkResult.can_delete) {
                        // Si se puede eliminar, mostrar confirmación
                        setConfirmationModal({
                            isOpen: true,
                            title: 'Eliminar Condiciones de Pago',
                            message: "\u00BFEst\u00E1 seguro que desea eliminar las condiciones de pago \"".concat(paymentTerms.code, " - ").concat(paymentTerms.name, "\"?\n\nEsta acci\u00F3n no se puede deshacer."),
                            type: 'danger',
                            confirmText: 'Eliminar',
                            isLoading: false,
                            onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                                var error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, PaymentTermsService.deletePaymentTerms(paymentTerms.id)];
                                        case 2:
                                            _a.sent();
                                            // Remover inmediatamente de la vista local
                                            removePaymentTermsLocal(paymentTerms.id);
                                            // Si las condiciones eliminadas estaban seleccionadas, limpiar selección
                                            if ((selectedPaymentTerms === null || selectedPaymentTerms === void 0 ? void 0 : selectedPaymentTerms.id) === paymentTerms.id) {
                                                setSelectedPaymentTerms(null);
                                                setCalculatedSchedule([]);
                                            }
                                            setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_3 = _a.sent();
                                            console.error('Error al eliminar:', error_3);
                                            alert('Error al eliminar las condiciones de pago. Por favor, intente de nuevo.');
                                            setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                    }
                    else {
                        // Si no se puede eliminar, mostrar opción de desactivar
                        setConfirmationModal({
                            isOpen: true,
                            title: 'No se puede eliminar',
                            message: "".concat(checkResult.message, "\n\n\u00BFDesea desactivar las condiciones de pago en su lugar?"),
                            type: 'warning',
                            confirmText: 'Desactivar',
                            isLoading: false,
                            onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); });
                                    handleToggleActiveStatus(paymentTerms, event);
                                    return [2 /*return*/];
                                });
                            }); }
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error al verificar eliminación:', error_2);
                    alert('Error al verificar las condiciones de pago. Por favor, intente de nuevo.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleActiveStatus = function (paymentTerms, event) { return __awaiter(void 0, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            event.stopPropagation(); // Evitar que se seleccione el item
            action = paymentTerms.is_active ? 'desactivar' : 'activar';
            setConfirmationModal({
                isOpen: true,
                title: "".concat(action.charAt(0).toUpperCase() + action.slice(1), " Condiciones de Pago"),
                message: "\u00BFEst\u00E1 seguro que desea ".concat(action, " las condiciones de pago \"").concat(paymentTerms.code, " - ").concat(paymentTerms.name, "\"?"),
                type: paymentTerms.is_active ? 'warning' : 'info',
                confirmText: action.charAt(0).toUpperCase() + action.slice(1),
                isLoading: false,
                onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updatedPaymentTerms, error_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, PaymentTermsService.toggleActiveStatus(paymentTerms.id)];
                            case 2:
                                updatedPaymentTerms = _a.sent();
                                // Actualizar inmediatamente en la vista local
                                updatePaymentTermsLocal(updatedPaymentTerms);
                                // Si las condiciones modificadas estaban seleccionadas, mantener selección con datos actualizados
                                if ((selectedPaymentTerms === null || selectedPaymentTerms === void 0 ? void 0 : selectedPaymentTerms.id) === paymentTerms.id) {
                                    setSelectedPaymentTerms(updatedPaymentTerms);
                                }
                                setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); });
                                return [3 /*break*/, 4];
                            case 3:
                                error_4 = _a.sent();
                                console.error('Error al cambiar estado:', error_4);
                                alert('Error al cambiar el estado. Por favor, intente de nuevo.');
                                setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }
            });
            return [2 /*return*/];
        });
    }); };
    // ...existing code...
    var handleEdit = function () {
        if (selectedPaymentTerms) {
            setShowEditModal(true);
        }
    };
    return (<div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Condiciones de Pago</h1>
          <p className="text-gray-600">Gestión y prueba de condiciones de pago</p>
        </div>        <div className="flex space-x-2">
          <Button onClick={function () { return setShowCreateModal(true); }} variant="primary">
            ➕ Crear Nuevo
          </Button>
          <Button onClick={refreshPaymentTerms} disabled={loading} variant="secondary">
            {loading ? <Spinner size="sm"/> : '🔄'}
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Buscar condiciones</label>
              <Input value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} placeholder="Código, nombre o descripción..."/>
            </div>
            <div>
              <label className="form-label">Estado</label>
              <Button onClick={toggleActiveFilter} variant={filters.is_active ? "primary" : "secondary"} className="w-full">
                {filters.is_active ? 'Activas' : 'Todas'}
              </Button>
            </div>
            <div className="flex items-end">              <div className="text-sm text-gray-600">
                Mostrando {filteredPaymentTerms.length} de {(paymentTerms || []).length} condiciones
              </div>
            </div>
          </div>
        </div>
      </Card>

      {error && (<ValidationMessage type="error" message={error}/>)}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Terms List */}
        <Card>
          <div className="card-header">
            <h2 className="card-title">Lista de Condiciones</h2>
          </div>
          <div className="card-body">
            {loading ? (<div className="flex items-center justify-center py-8">
                <Spinner />
                <span className="ml-2">Cargando condiciones de pago...</span>
              </div>) : filteredPaymentTerms.length === 0 ? (<div className="text-center py-8 text-gray-500">
                No se encontraron condiciones de pago
              </div>) : (<div className="space-y-2 max-h-96 overflow-y-auto">                {filteredPaymentTerms.map(function (pt) {
                var _a, _b;
                return (<div key={pt.id} className={"p-3 border rounded-lg transition-colors ".concat((selectedPaymentTerms === null || selectedPaymentTerms === void 0 ? void 0 : selectedPaymentTerms.id) === pt.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')}>
                    <div className="cursor-pointer" onClick={function () { return handlePaymentTermsSelect(pt); }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {pt.code}
                          </span>
                          <span className="ml-2 font-medium">{pt.name}</span>
                        </div>                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">
                            {(((_a = pt.payment_schedules) === null || _a === void 0 ? void 0 : _a.length) || 0)} cuota{(((_b = pt.payment_schedules) === null || _b === void 0 ? void 0 : _b.length) || 0) !== 1 ? 's' : ''}
                          </div>
                          
                          {/* Botones de acción */}
                          <div className="flex space-x-1">
                            <button onClick={function (e) { return handleToggleActiveStatus(pt, e); }} className={"p-1.5 rounded transition-colors ".concat(pt.is_active
                        ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50')} title={pt.is_active ? 'Desactivar' : 'Activar'}>
                              {pt.is_active ? (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>) : (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>)}
                            </button>
                            
                            <button onClick={function (e) { return handleDeletePaymentTerms(pt, e); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      {pt.description && (<div className="text-sm text-gray-600 mt-1">{pt.description}</div>)}
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{pt.max_days} días máximo</span>
                        <span className={"px-2 py-1 rounded ".concat(pt.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                          {pt.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                  </div>);
            })}
              </div>)}
          </div>
        </Card>

        {/* Payment Terms Details and Calculator */}
        <div className="space-y-4">          {selectedPaymentTerms && (<Card>              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    Detalles de Condición
                    {loadingDetails && <Spinner size="sm" className="ml-2"/>}
                  </h2>
                  <Button onClick={handleEdit} variant="outline" size="sm" disabled={loadingDetails}>
                    ✏️ Editar
                  </Button>
                </div>
              </div>
              <div className="card-body">
                {loadingDetails ? (<div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Spinner size="md"/>
                      <div className="mt-2 text-sm text-gray-500">Cargando detalles...</div>
                    </div>
                  </div>) : (<div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Código</div>
                    <div className="font-mono font-semibold">{selectedPaymentTerms.code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Nombre</div>
                    <div className="font-medium">{selectedPaymentTerms.name}</div>
                  </div>
                  {selectedPaymentTerms.description && (<div>
                      <div className="text-sm text-gray-600">Descripción</div>
                      <div className="text-sm">{selectedPaymentTerms.description}</div>
                    </div>)}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Días Máximo</div>
                      <div className="font-medium">{selectedPaymentTerms.max_days}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Porcentaje Total</div>
                      <div className="font-medium">{selectedPaymentTerms.total_percentage}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Cronograma</div>                    <div className="space-y-1">
                      {(selectedPaymentTerms.payment_schedules || []).map(function (schedule, index) { return (<div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span>Cuota {schedule.sequence}</span>
                          <span>{schedule.days} días</span>
                          <span>{schedule.percentage}%</span>
                        </div>); })}                    </div>
                  </div>
                </div>)}
              </div>
            </Card>)}

          {/* Calculator */}
          <Card>
            <div className="card-header">
              <h2 className="card-title">Calculadora de Cronograma</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Condiciones de Pago</label>
                  <PaymentTermsSelector value={selectedPaymentTerms === null || selectedPaymentTerms === void 0 ? void 0 : selectedPaymentTerms.id} onChange={function (id) {
            var pt = paymentTerms.find(function (p) { return p.id === id; });
            handlePaymentTermsSelect(pt || null);
        }} onPaymentTermsSelect={handlePaymentTermsSelect}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Monto de Factura</label>                    <Input type="number" step="0.01" value={testAmount} onChange={function (e) {
            setTestAmount(e.target.value);
            setCalculationError(null); // Limpiar errores al cambiar
        }} placeholder="1000.00"/>
                  </div>
                  <div>
                    <label className="form-label">Fecha de Factura</label>                    <Input type="date" value={testInvoiceDate} onChange={function (e) {
            setTestInvoiceDate(e.target.value);
            setCalculationError(null); // Limpiar errores al cambiar
        }}/>
                  </div>
                </div>                <div className="space-y-3">
                  <Button onClick={calculateSchedule} disabled={!selectedPaymentTerms || !testAmount || !testInvoiceDate || calculating} className="w-full" size="lg">
                    {calculating ? (<div className="flex items-center space-x-2">
                        <Spinner size="sm"/>
                        <span>Calculando cronograma...</span>
                      </div>) : (<div className="flex items-center space-x-2">
                        <span>📊</span>
                        <span>Calcular Cronograma de Pagos</span>
                      </div>)}
                  </Button>
                  
                  {/* Validaciones visuales */}
                  <div className="space-y-1">
                    <div className={"text-xs flex items-center space-x-2 ".concat(selectedPaymentTerms ? 'text-green-600' : 'text-red-500')}>
                      <span>{selectedPaymentTerms ? '✓' : '✗'}</span>
                      <span>Condiciones de pago seleccionadas</span>
                    </div>
                    <div className={"text-xs flex items-center space-x-2 ".concat(testAmount && parseFloat(testAmount) > 0 ? 'text-green-600' : 'text-red-500')}>
                      <span>{testAmount && parseFloat(testAmount) > 0 ? '✓' : '✗'}</span>
                      <span>Monto válido (mayor a 0)</span>
                    </div>
                    <div className={"text-xs flex items-center space-x-2 ".concat(testInvoiceDate ? 'text-green-600' : 'text-red-500')}>
                      <span>{testInvoiceDate ? '✓' : '✗'}</span>
                      <span>Fecha de factura seleccionada</span>
                    </div>
                    {selectedPaymentTerms && (<div className={"text-xs flex items-center space-x-2 ".concat(selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0
                ? 'text-green-600'
                : 'text-yellow-600')}>
                        <span>{selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0 ? '✓' : '⚠'}</span>
                        <span>
                          {selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0
                ? "".concat(selectedPaymentTerms.payment_schedules.length, " cronograma(s) definido(s)")
                : 'Sin cronogramas definidos'}
                        </span>                      </div>)}
                  </div>
                  
                  {/* Mostrar errores de cálculo */}
                  {calculationError && (<ValidationMessage type="error" message={calculationError}/>)}
                </div>
              </div>
            </div>
          </Card>{/* Calculated Schedule */}
          {calculatedSchedule.length > 0 && (<>
              {/* Resumen del cálculo */}
              <Card>
                <div className="card-header">
                  <h3 className="card-title">Resumen del Cálculo</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Condiciones</div>
                      <div className="text-sm font-bold text-blue-800">{selectedPaymentTerms === null || selectedPaymentTerms === void 0 ? void 0 : selectedPaymentTerms.name}</div>
                    </div>                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Monto Total</div>
                      <div className="text-sm font-bold text-green-800">
                        ${formatCurrency(parseFloat(testAmount))}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xs text-purple-600 font-medium">Número de Cuotas</div>
                      <div className="text-sm font-bold text-purple-800">{calculatedSchedule.length}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-orange-600 font-medium">Plazo Máximo</div>
                      <div className="text-sm font-bold text-orange-800">
                        {Math.max.apply(Math, calculatedSchedule.map(function (s) { return s.days; }))} días
                      </div>
                    </div>
                  </div>                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Cálculo realizado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
                  </div>
                  <div className="mt-3 text-center">
                    <Button variant="outline" size="sm" onClick={function () { return setCalculatedSchedule([]); }} className="text-gray-600 hover:text-gray-800">
                      🗑️ Limpiar Cálculo
                    </Button>
                  </div>
                </div>
              </Card>
              
              <PaymentScheduleDisplay schedule={calculatedSchedule} invoiceAmount={parseFloat(testAmount)} invoiceDate={testInvoiceDate}/>
            </>)}
        </div>
      </div>      {/* Modal para crear condiciones de pago */}
      <PaymentTermsModal isOpen={showCreateModal} onClose={function () { return setShowCreateModal(false); }} onSuccess={handleCreateSuccess} title="Crear Nuevas Condiciones de Pago"/>      {/* Modal para editar condiciones de pago */}
      <PaymentTermsModal isOpen={showEditModal} onClose={function () { return setShowEditModal(false); }} onSuccess={handleEditSuccess} editingPaymentTerms={selectedPaymentTerms} title="Editar Condiciones de Pago"/>

      {/* Modal de confirmación */}
      <ConfirmationModal isOpen={confirmationModal.isOpen} onClose={function () { return setConfirmationModal(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); }); }} onConfirm={confirmationModal.onConfirm} title={confirmationModal.title} message={confirmationModal.message} type={confirmationModal.type} confirmText={confirmationModal.confirmText} isLoading={confirmationModal.isLoading}/>
    </div>);
};
