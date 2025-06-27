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
/**
 * Formulario mejorado de creación de facturas - Estilo Odoo
 * Incluye selección de productos, cuentas contables y preview de asientos
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceTypeConst } from '../types';
import { InvoiceAPI } from '../api/invoiceAPI';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/shared/contexts/ToastContext';
import { formatCurrency } from '@/shared/utils/formatters';
import { PlusIcon, TrashIcon, ArrowLeftIcon, PencilIcon } from '@/shared/components/icons';
import { CustomerSearch, ProductSearch, AccountSearch, PaymentTermsSearch, JournalSearch } from '../components';
export function InvoiceCreatePageEnhanced() {
    var _this = this;
    var navigate = useNavigate();
    var showToast = useToast().showToast;
    var _a = useState('info'), activeTab = _a[0], setActiveTab = _a[1];
    // Estado del formulario principal
    var _b = useState({
        invoice_type: InvoiceTypeConst.CUSTOMER_INVOICE,
        customer_id: '',
        journal_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 días
        payment_term_id: '',
        currency_code: 'COP',
        exchange_rate: 1,
        description: '',
        notes: '',
        lines: []
    }), formData = _b[0], setFormData = _b[1];
    // Estado de la línea actual en edición
    var _c = useState({
        sequence: 1,
        product_id: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        discount_percentage: 0,
        account_id: '',
        subtotal: 0,
        discount_amount: 0,
        line_total: 0
    }), currentLine = _c[0], setCurrentLine = _c[1]; // Estado del preview de asiento contable
    var _d = useState(null), journalEntryPreview = _d[0], setJournalEntryPreview = _d[1];
    var _e = useState(false), isEditingPreview = _e[0], setIsEditingPreview = _e[1];
    var _f = useState(false), saving = _f[0], setSaving = _f[1]; // Estado para información adicional  
    var _g = useState({ name: '' }), selectedPaymentTermInfo = _g[0], setSelectedPaymentTermInfo = _g[1];
    var _h = useState({ name: '', code: '' }), selectedJournalInfo = _h[0], setSelectedJournalInfo = _h[1];
    // Calcular totales de línea automáticamente
    useEffect(function () {
        var subtotal = currentLine.quantity * currentLine.unit_price;
        var discount_amount = subtotal * (currentLine.discount_percentage / 100);
        var line_total = subtotal - discount_amount;
        setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { subtotal: subtotal, discount_amount: discount_amount, line_total: line_total })); });
    }, [currentLine.quantity, currentLine.unit_price, currentLine.discount_percentage]);
    // Generar preview del asiento contable
    var generateJournalEntryPreview = useCallback(function () {
        if (formData.lines.length === 0 || !formData.customer_id) {
            setJournalEntryPreview(null);
            return;
        }
        var debit_lines = [];
        var credit_lines = [];
        var total_amount = formData.lines.reduce(function (sum, line) {
            return sum + (line.line_total || 0);
        }, 0); // Línea de débito: Cuenta por cobrar clientes
        debit_lines.push({
            id: 'debit-receivable',
            account_id: '1305', // ID de ejemplo, debería venir de un select real
            account_code: '1305',
            account_name: 'Cuentas por Cobrar - Clientes',
            description: "Factura de venta",
            debit_amount: total_amount,
            is_editable: true
        });
        // Líneas de crédito: Ventas por línea
        formData.lines.forEach(function (line, index) {
            var line_total = line.line_total || 0;
            credit_lines.push({
                id: "credit-line-".concat(index),
                account_id: line.account_id || '4135', // Usar el account_id de la línea
                account_code: line.account_code || '4135',
                account_name: line.account_name || 'Ventas de Productos/Servicios',
                description: line.description,
                credit_amount: line_total,
                is_editable: true
            });
        });
        var total_debit = debit_lines.reduce(function (sum, line) { return sum + line.debit_amount; }, 0);
        var total_credit = credit_lines.reduce(function (sum, line) { return sum + line.credit_amount; }, 0);
        setJournalEntryPreview({
            debit_lines: debit_lines,
            credit_lines: credit_lines,
            total_debit: total_debit,
            total_credit: total_credit,
            is_balanced: Math.abs(total_debit - total_credit) < 0.01
        });
    }, [formData.lines, formData.customer_id]);
    // Actualizar preview cuando cambien las líneas
    useEffect(function () {
        generateJournalEntryPreview();
    }, [generateJournalEntryPreview]);
    // Funciones para editar el preview del asiento contable
    var handleDebitAmountChange = function (lineId, newAmount) {
        if (!journalEntryPreview)
            return;
        var updatedDebitLines = journalEntryPreview.debit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { debit_amount: newAmount }) : line;
        });
        var total_debit = updatedDebitLines.reduce(function (sum, line) { return sum + line.debit_amount; }, 0);
        var total_credit = journalEntryPreview.total_credit;
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { debit_lines: updatedDebitLines, total_debit: total_debit, is_balanced: Math.abs(total_debit - total_credit) < 0.01 }));
    };
    var handleCreditAmountChange = function (lineId, newAmount) {
        if (!journalEntryPreview)
            return;
        var updatedCreditLines = journalEntryPreview.credit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { credit_amount: newAmount }) : line;
        });
        var total_credit = updatedCreditLines.reduce(function (sum, line) { return sum + line.credit_amount; }, 0);
        var total_debit = journalEntryPreview.total_debit;
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { credit_lines: updatedCreditLines, total_credit: total_credit, is_balanced: Math.abs(total_debit - total_credit) < 0.01 }));
    };
    var togglePreviewEditing = function () {
        setIsEditingPreview(!isEditingPreview);
    };
    // Funciones adicionales para edición completa del preview
    var handleDebitAccountChange = function (lineId, accountId, accountInfo) {
        if (!journalEntryPreview)
            return;
        var updatedDebitLines = journalEntryPreview.debit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { account_id: accountId, account_code: accountInfo.code || '', account_name: accountInfo.name || '' }) : line;
        });
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { debit_lines: updatedDebitLines }));
    };
    var handleCreditAccountChange = function (lineId, accountId, accountInfo) {
        if (!journalEntryPreview)
            return;
        var updatedCreditLines = journalEntryPreview.credit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { account_id: accountId, account_code: accountInfo.code || '', account_name: accountInfo.name || '' }) : line;
        });
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { credit_lines: updatedCreditLines }));
    };
    var handleDebitDescriptionChange = function (lineId, newDescription) {
        if (!journalEntryPreview)
            return;
        var updatedDebitLines = journalEntryPreview.debit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { description: newDescription }) : line;
        });
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { debit_lines: updatedDebitLines }));
    };
    var handleCreditDescriptionChange = function (lineId, newDescription) {
        if (!journalEntryPreview)
            return;
        var updatedCreditLines = journalEntryPreview.credit_lines.map(function (line) {
            return line.id === lineId ? __assign(__assign({}, line), { description: newDescription }) : line;
        });
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { credit_lines: updatedCreditLines }));
    };
    var handleRemoveDebitLine = function (lineId) {
        if (!journalEntryPreview)
            return;
        var updatedDebitLines = journalEntryPreview.debit_lines.filter(function (line) { return line.id !== lineId; });
        var total_debit = updatedDebitLines.reduce(function (sum, line) { return sum + line.debit_amount; }, 0);
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { debit_lines: updatedDebitLines, total_debit: total_debit, is_balanced: Math.abs(total_debit - journalEntryPreview.total_credit) < 0.01 }));
    };
    var handleRemoveCreditLine = function (lineId) {
        if (!journalEntryPreview)
            return;
        var updatedCreditLines = journalEntryPreview.credit_lines.filter(function (line) { return line.id !== lineId; });
        var total_credit = updatedCreditLines.reduce(function (sum, line) { return sum + line.credit_amount; }, 0);
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { credit_lines: updatedCreditLines, total_credit: total_credit, is_balanced: Math.abs(journalEntryPreview.total_debit - total_credit) < 0.01 }));
    };
    // Añadir nueva línea de débito al preview
    var addDebitLine = function () {
        if (!journalEntryPreview)
            return;
        var newLine = {
            id: "debit-manual-".concat(Date.now()),
            account_id: '',
            account_code: '',
            account_name: '',
            description: 'Nueva línea de débito',
            debit_amount: 0,
            is_editable: true
        };
        var updatedDebitLines = __spreadArray(__spreadArray([], journalEntryPreview.debit_lines, true), [newLine], false);
        var total_debit = updatedDebitLines.reduce(function (sum, line) { return sum + line.debit_amount; }, 0);
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { debit_lines: updatedDebitLines, total_debit: total_debit, is_balanced: Math.abs(total_debit - journalEntryPreview.total_credit) < 0.01 }));
    };
    // Añadir nueva línea de crédito al preview
    var addCreditLine = function () {
        if (!journalEntryPreview)
            return;
        var newLine = {
            id: "credit-manual-".concat(Date.now()),
            account_id: '',
            account_code: '',
            account_name: '',
            description: 'Nueva línea de crédito',
            credit_amount: 0,
            is_editable: true
        };
        var updatedCreditLines = __spreadArray(__spreadArray([], journalEntryPreview.credit_lines, true), [newLine], false);
        var total_credit = updatedCreditLines.reduce(function (sum, line) { return sum + line.credit_amount; }, 0);
        setJournalEntryPreview(__assign(__assign({}, journalEntryPreview), { credit_lines: updatedCreditLines, total_credit: total_credit, is_balanced: Math.abs(journalEntryPreview.total_debit - total_credit) < 0.01 }));
    }; // Manejar cambios en inputs del formulario principal
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)), (field === 'invoice_type' && { journal_id: '' })));
        });
        // Limpiar información del diario seleccionado si cambia el tipo
        if (field === 'invoice_type') {
            setSelectedJournalInfo({ name: '', code: '' });
        }
    };
    // Manejar cambio de cliente
    var handleCustomerChange = function (customerId, _customerInfo) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { customer_id: customerId })); });
    };
    // Manejar cambio de plan de pagos
    var handlePaymentTermChange = function (paymentTermId, paymentTermInfo) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { payment_term_id: paymentTermId })); });
        setSelectedPaymentTermInfo(paymentTermInfo);
        // Calcular automáticamente la fecha de vencimiento basada en los días del plan de pago
        if (paymentTermInfo.days && paymentTermInfo.days > 0) {
            var invoiceDate = new Date(formData.invoice_date);
            var dueDate_1 = new Date(invoiceDate.getTime() + (paymentTermInfo.days * 24 * 60 * 60 * 1000));
            setFormData(function (prev) { return (__assign(__assign({}, prev), { payment_term_id: paymentTermId, due_date: dueDate_1.toISOString().split('T')[0] })); });
        }
    };
    // Manejar cambio de diario
    var handleJournalChange = function (journalOption) {
        if (journalOption) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { journal_id: journalOption.id })); });
            setSelectedJournalInfo({
                name: journalOption.name,
                code: journalOption.code,
                default_account: journalOption.default_account
            });
            // Si el diario tiene cuenta por defecto, aplicarla a la línea actual
            if (journalOption.default_account) {
                setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { account_id: journalOption.default_account.id, account_code: journalOption.default_account.code, account_name: journalOption.default_account.name })); });
            }
        }
        else {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { journal_id: '' })); });
            setSelectedJournalInfo({ name: '', code: '' });
            // Limpiar cuenta de la línea actual si se deselecciona el diario
            setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { account_id: '', account_code: '', account_name: '' })); });
        }
    };
    // Añadir línea a la factura
    var handleAddLine = function () {
        if (!currentLine.description || !currentLine.account_id || currentLine.unit_price <= 0) {
            showToast('Por favor complete todos los campos obligatorios de la línea', 'error');
            return;
        }
        var newLine = __assign(__assign({}, currentLine), { sequence: formData.lines.length + 1 });
        setFormData(function (prev) { return (__assign(__assign({}, prev), { lines: __spreadArray(__spreadArray([], prev.lines, true), [newLine], false) })); });
        // Limpiar formulario de línea y aplicar cuenta por defecto del diario si existe
        var defaultAccount = selectedJournalInfo.default_account;
        setCurrentLine({
            sequence: formData.lines.length + 2,
            product_id: '',
            description: '',
            quantity: 1,
            unit_price: 0,
            discount_percentage: 0,
            account_id: defaultAccount ? defaultAccount.id : '',
            account_code: defaultAccount ? defaultAccount.code : '',
            account_name: defaultAccount ? defaultAccount.name : '',
            subtotal: 0,
            discount_amount: 0,
            line_total: 0
        });
    };
    // Eliminar línea
    var handleRemoveLine = function (index) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { lines: prev.lines.filter(function (_, i) { return i !== index; }) })); });
    };
    // Crear factura
    var handleCreateInvoice = function () { return __awaiter(_this, void 0, void 0, function () {
        var invoiceData, invoice, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!formData.customer_id) {
                        showToast('Por favor seleccione un cliente', 'error');
                        return [2 /*return*/];
                    }
                    if (!formData.journal_id) {
                        showToast('Por favor seleccione un diario', 'error');
                        return [2 /*return*/];
                    }
                    if (formData.lines.length === 0) {
                        showToast('Por favor añada al menos una línea a la factura', 'error');
                        return [2 /*return*/];
                    }
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    invoiceData = {
                        invoice_date: formData.invoice_date,
                        due_date: formData.due_date,
                        invoice_type: formData.invoice_type,
                        currency_code: formData.currency_code || "USD",
                        exchange_rate: formData.exchange_rate || 1,
                        description: formData.description || "",
                        notes: formData.notes || "",
                        invoice_number: "", // Se genera automáticamente
                        third_party_id: formData.customer_id, // Ya validamos que no esté vacío
                        journal_id: formData.journal_id || undefined,
                        payment_terms_id: formData.payment_term_id || undefined,
                        third_party_account_id: undefined, lines: formData.lines.map(function (line) { return ({
                            sequence: line.sequence,
                            product_id: line.product_id || undefined,
                            description: line.description,
                            quantity: line.quantity,
                            unit_price: line.unit_price,
                            discount_percentage: line.discount_percentage,
                            account_id: line.account_id || undefined,
                            cost_center_id: undefined,
                            tax_ids: []
                        }); })
                    };
                    // Debug: Log the data being sent
                    console.log('Sending invoice data:', invoiceData);
                    return [4 /*yield*/, InvoiceAPI.createInvoiceWithLines(invoiceData)];
                case 2:
                    invoice = _a.sent();
                    showToast('Factura creada exitosamente', 'success');
                    navigate("/invoices/".concat(invoice.id));
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating invoice:', error_1);
                    showToast(error_1 instanceof Error ? error_1.message : 'Error al crear la factura', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var totalAmount = formData.lines.reduce(function (sum, line) { return sum + (line.line_total || 0); }, 0);
    return (<div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={function () { return navigate('/invoices'); }} className="flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4"/>
              Volver a Facturas
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
              <p className="text-gray-600">Crear factura con líneas de productos/servicios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={function () { return setActiveTab('info'); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'info'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Información General
            </button>
            <button onClick={function () { return setActiveTab('lines'); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'lines'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Líneas de Factura ({formData.lines.length})
            </button>
            <button onClick={function () { return setActiveTab('preview'); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'preview'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              Preview Asiento Contable
            </button>
          </nav>
        </div>
      </div>

      {/* Tab: Información General */}
      {activeTab === 'info' && (<Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información de la Factura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>              <CustomerSearch value={formData.customer_id} onChange={handleCustomerChange} placeholder="Buscar cliente por nombre o código..."/>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Factura
              </label>
              <Select value={formData.invoice_type} onChange={function (value) { return handleInputChange('invoice_type', value); }} options={[{ value: InvoiceTypeConst.CUSTOMER_INVOICE, label: 'Factura de Cliente' },
                { value: InvoiceTypeConst.SUPPLIER_INVOICE, label: 'Factura de Proveedor' }
            ]}/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diario *
              </label>
              <JournalSearch value={formData.journal_id} onSelect={handleJournalChange} invoiceType={formData.invoice_type} placeholder="Seleccionar diario..." required/>
              {selectedJournalInfo.name && (<div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-sm text-blue-800">
                    ✓ Diario seleccionado: <strong>{selectedJournalInfo.code} - {selectedJournalInfo.name}</strong>
                  </div>
                  {selectedJournalInfo.default_account && (<div className="text-xs text-blue-600 mt-1">
                      Cuenta por defecto: {selectedJournalInfo.default_account.code} - {selectedJournalInfo.default_account.name}
                    </div>)}
                </div>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Factura *
              </label>
              <Input type="date" value={formData.invoice_date} onChange={function (e) { return handleInputChange('invoice_date', e.target.value); }} required/>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
                {formData.payment_term_id && (<span className="text-xs text-blue-600 ml-2">
                    (Calculada automáticamente desde el plan de pagos)
                  </span>)}
              </label>
              <Input type="date" value={formData.due_date} onChange={function (e) { return handleInputChange('due_date', e.target.value); }} disabled={!!formData.payment_term_id} // Deshabilitar si hay plan de pagos
         className={formData.payment_term_id ? 'bg-gray-100 cursor-not-allowed' : ''} required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Pagos (opcional)
              </label>              <PaymentTermsSearch value={formData.payment_term_id} onChange={handlePaymentTermChange} placeholder="Seleccionar plan de pagos..."/>
              {selectedPaymentTermInfo.name && (<div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-sm text-blue-800">
                    ✓ Plan seleccionado: <strong>{selectedPaymentTermInfo.name}</strong>
                    {selectedPaymentTermInfo.days && (<span className="ml-2">({selectedPaymentTermInfo.days} días)</span>)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    La fecha de vencimiento se calculó automáticamente
                  </div>
                </div>)}
            </div><div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <Select value={formData.currency_code} onChange={function (value) { return handleInputChange('currency_code', value); }} options={[
                { value: 'COP', label: 'COP - Peso Colombiano' },
                { value: 'USD', label: 'USD - Dólar Americano' },
                { value: 'EUR', label: 'EUR - Euro' }
            ]}/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Input type="text" value={formData.description} onChange={function (e) { return handleInputChange('description', e.target.value); }} placeholder="Descripción general de la factura"/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <Textarea value={formData.notes} onChange={function (e) { return handleInputChange('notes', e.target.value); }} placeholder="Notas adicionales..." rows={3}/>
            </div>
          </div>
        </Card>)}      {/* Tab: Líneas de Factura */}
      {activeTab === 'lines' && (<div className="space-y-6">
          {/* Formulario para agregar nueva línea */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Agregar Línea de Factura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto (opcional)
                </label>
                <ProductSearch value={currentLine.product_id || ''} onChange={function (productId, productInfo) {
                setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { product_id: productId, product_code: productInfo.code || '', product_name: productInfo.name, description: productInfo.description || productInfo.name, unit_price: productInfo.price || 0 })); });
            }} placeholder="Buscar producto por nombre o código..."/>
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta Contable *
                </label>
                <AccountSearch value={currentLine.account_id} onChange={function (accountId, accountInfo) {
                setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { account_id: accountId, account_code: accountInfo.code, account_name: accountInfo.name })); });
            }} placeholder="Buscar cuenta contable..."/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <Input type="text" value={currentLine.description} onChange={function (e) { return setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} placeholder="Descripción del producto/servicio" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad *
                </label>
                <Input type="number" value={currentLine.quantity} onChange={function (e) { return setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { quantity: parseFloat(e.target.value) || 0 })); }); }} min="0.01" step="0.01" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Unitario *
                </label>
                <Input type="number" value={currentLine.unit_price} onChange={function (e) { return setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { unit_price: parseFloat(e.target.value) || 0 })); }); }} min="0" step="0.01" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <Input type="number" value={currentLine.discount_percentage} onChange={function (e) { return setCurrentLine(function (prev) { return (__assign(__assign({}, prev), { discount_percentage: parseFloat(e.target.value) || 0 })); }); }} min="0" max="100" step="0.01"/>
              </div>
            </div>

            {/* Totales de línea */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subtotal:</span>
                  <div className="font-medium">{formatCurrency(currentLine.subtotal || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Descuento:</span>
                  <div className="font-medium text-red-600">-{formatCurrency(currentLine.discount_amount || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total Línea:</span>
                  <div className="font-bold text-green-600">{formatCurrency(currentLine.line_total || 0)}</div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddLine} className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4"/>
                    Agregar Línea
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de líneas existentes */}
          {formData.lines.length > 0 && (<Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Líneas de la Factura</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.lines.map(function (line, index) { return (<tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {line.description}
                            {line.product_code && (<div className="text-xs text-gray-500">{line.product_code}</div>)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {line.account_code} - {line.account_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {line.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(line.unit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                          {line.discount_percentage > 0 && "-".concat(formatCurrency(line.discount_amount || 0))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(line.line_total || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Button variant="outline" size="sm" onClick={function () { return handleRemoveLine(index); }} className="text-red-600 hover:text-red-800">
                            <TrashIcon className="w-4 h-4"/>
                          </Button>
                        </td>
                      </tr>); })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total Factura:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>)}
        </div>)}      {/* Tab: Preview Asiento Contable */}
      {activeTab === 'preview' && (<Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Preview del Asiento Contable</h2>            <Button variant="outline" onClick={togglePreviewEditing} className="flex items-center gap-2">
              <PencilIcon className="w-4 h-4"/>
              {isEditingPreview ? 'Finalizar Edición' : 'Editar Asiento'}
            </Button>
          </div>
          {journalEntryPreview ? (<div className="space-y-6">              {/* Tabla de asientos al estilo journal entries */}
              <div className="overflow-x-auto">
                <table className={"min-w-full divide-y divide-gray-200 ".concat(isEditingPreview ? 'table-fixed' : '')}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ".concat(isEditingPreview ? 'w-80' : '')}>
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Débito
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Crédito
                      </th>
                      {isEditingPreview && (<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          Acciones
                        </th>)}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">                    {/* Líneas de débito */}
                    {journalEntryPreview.debit_lines.map(function (line) { return (<tr key={"debit-".concat(line.id)} className="hover:bg-gray-50">
                        <td className="px-6 py-4 min-w-80 relative">
                          {isEditingPreview && line.is_editable ? (<div className="w-full relative">
                              <AccountSearch value={line.account_id || ''} onChange={function (accountId, accountInfo) { return handleDebitAccountChange(line.id, accountId, accountInfo); }} placeholder="Seleccionar cuenta..." className="text-sm w-full"/>
                            </div>) : (<div>
                              <div className="text-sm font-medium text-gray-900">
                                {line.account_code}
                              </div>
                              <div className="text-sm text-gray-500">
                                {line.account_name}
                              </div>
                            </div>)}
                        </td>
                        <td className="px-6 py-4">
                          {isEditingPreview && line.is_editable ? (<Input type="text" value={line.description} onChange={function (e) { return handleDebitDescriptionChange(line.id, e.target.value); }} placeholder="Descripción..." className="w-48 text-sm"/>) : (<div className="text-sm text-gray-900">
                              {line.description}
                            </div>)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditingPreview && line.is_editable ? (<Input type="number" value={line.debit_amount} onChange={function (e) { return handleDebitAmountChange(line.id, parseFloat(e.target.value) || 0); }} step="0.01" min="0" className="w-32 text-right text-sm"/>) : (<div className="text-sm font-medium text-green-600">
                              {formatCurrency(line.debit_amount)}
                            </div>)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-400">
                            -
                          </div>
                        </td>
                        {isEditingPreview && (<td className="px-6 py-4 text-center">
                            {line.is_editable && (<Button variant="outline" size="sm" onClick={function () { return handleRemoveDebitLine(line.id); }} className="text-red-600 hover:text-red-800 p-1">
                                <TrashIcon className="w-4 h-4"/>
                              </Button>)}
                          </td>)}
                      </tr>); })}                      {/* Líneas de crédito */}
                    {journalEntryPreview.credit_lines.map(function (line) { return (<tr key={"credit-".concat(line.id)} className="hover:bg-gray-50">
                        <td className="px-6 py-4 min-w-80 relative">
                          {isEditingPreview && line.is_editable ? (<div className="w-full relative">
                              <AccountSearch value={line.account_id || ''} onChange={function (accountId, accountInfo) { return handleCreditAccountChange(line.id, accountId, accountInfo); }} placeholder="Seleccionar cuenta..." className="text-sm w-full"/>
                            </div>) : (<div>
                              <div className="text-sm font-medium text-gray-900">
                                {line.account_code}
                              </div>
                              <div className="text-sm text-gray-500">
                                {line.account_name}
                              </div>
                            </div>)}
                        </td>
                        <td className="px-6 py-4">
                          {isEditingPreview && line.is_editable ? (<Input type="text" value={line.description} onChange={function (e) { return handleCreditDescriptionChange(line.id, e.target.value); }} placeholder="Descripción..." className="w-48 text-sm"/>) : (<div className="text-sm text-gray-900">
                              {line.description}
                            </div>)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-400">
                            -
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditingPreview && line.is_editable ? (<Input type="number" value={line.credit_amount} onChange={function (e) { return handleCreditAmountChange(line.id, parseFloat(e.target.value) || 0); }} step="0.01" min="0" className="w-32 text-right text-sm"/>) : (<div className="text-sm font-medium text-blue-600">
                              {formatCurrency(line.credit_amount)}
                            </div>)}
                        </td>
                        {isEditingPreview && (<td className="px-6 py-4 text-center">
                            {line.is_editable && (<Button variant="outline" size="sm" onClick={function () { return handleRemoveCreditLine(line.id); }} className="text-red-600 hover:text-red-800 p-1">
                                <TrashIcon className="w-4 h-4"/>
                              </Button>)}
                          </td>)}
                      </tr>); })}
                  </tbody>
                  
                  {/* Totales */}
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Totales:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-green-700">
                        {formatCurrency(journalEntryPreview.total_debit)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-blue-700">
                        {formatCurrency(journalEntryPreview.total_credit)}
                      </td>
                    </tr>
                    {!journalEntryPreview.is_balanced && (<tr>
                        <td colSpan={2} className="px-6 py-4 text-right text-sm font-medium text-red-900">
                          Diferencia:
                        </td>
                        <td colSpan={2} className="px-6 py-4 text-right text-sm font-bold text-red-700">
                          {formatCurrency(Math.abs(journalEntryPreview.total_debit - journalEntryPreview.total_credit))}
                          <span className="text-xs ml-1">
                            ({journalEntryPreview.total_debit > journalEntryPreview.total_credit ? 'Exceso débitos' : 'Exceso créditos'})
                          </span>
                        </td>
                      </tr>)}
                  </tfoot>
                </table>              </div>

              {/* Botones para agregar líneas en modo edición */}
              {isEditingPreview && (<div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={addDebitLine} className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50">
                    <PlusIcon className="w-4 h-4"/>
                    Agregar Línea Débito
                  </Button>
                  <Button variant="outline" onClick={addCreditLine} className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50">
                    <PlusIcon className="w-4 h-4"/>
                    Agregar Línea Crédito
                  </Button>
                </div>)}

              {/* Estado del balance */}
              <div className="flex justify-end">
                <div className={"px-4 py-2 rounded-full text-sm font-medium ".concat(journalEntryPreview.is_balanced
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300')}>
                  {journalEntryPreview.is_balanced ? '✓ Asiento Balanceado' : '✗ Asiento No Balanceado'}
                </div>
              </div>
            </div>) : (<div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium">Agregue líneas a la factura</p>
              <p className="text-sm">El preview del asiento contable se mostrará aquí</p>
            </div>)}
        </Card>)}

      {/* Acciones */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={function () { return navigate('/invoices'); }}>
          Cancelar
        </Button>        <Button onClick={handleCreateInvoice} disabled={saving || formData.lines.length === 0 || !formData.customer_id || !formData.journal_id} className="bg-blue-600 hover:bg-blue-700">
          {saving ? 'Creando...' : 'Crear Factura'}
        </Button>
      </div>
    </div>);
}
