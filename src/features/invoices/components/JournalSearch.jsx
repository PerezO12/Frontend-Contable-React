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
var _a;
/**
 * Componente de búsqueda y selección de diarios para facturas
 * Filtra los diarios según el tipo de factura
 */
import { useState, useEffect, useCallback } from 'react';
import { JournalAPI } from '@/features/journals/api/journalAPI';
import { JournalTypeConst } from '@/features/journals/types';
import { InvoiceTypeConst } from '../types';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckIcon, ChevronDownIcon } from '@/shared/components/icons';
// Mapeo entre tipos de factura y tipos de diario
var INVOICE_TYPE_TO_JOURNAL_TYPE = (_a = {},
    _a[InvoiceTypeConst.CUSTOMER_INVOICE] = [JournalTypeConst.SALE],
    _a[InvoiceTypeConst.SUPPLIER_INVOICE] = [JournalTypeConst.PURCHASE],
    _a[InvoiceTypeConst.CREDIT_NOTE] = [JournalTypeConst.SALE],
    _a[InvoiceTypeConst.DEBIT_NOTE] = [JournalTypeConst.PURCHASE],
    _a);
var getJournalTypeLabel = function (type) {
    switch (type) {
        case 'sale': return 'Ventas';
        case 'purchase': return 'Compras';
        case 'cash': return 'Efectivo';
        case 'bank': return 'Banco';
        case 'miscellaneous': return 'Misceláneos';
        default: return type;
    }
};
export function JournalSearch(_a) {
    var _this = this;
    var value = _a.value, onSelect = _a.onSelect, invoiceType = _a.invoiceType, _b = _a.placeholder, placeholder = _b === void 0 ? "Seleccionar diario..." : _b, _c = _a.required, required = _c === void 0 ? false : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.className, className = _e === void 0 ? "" : _e;
    var _f = useState(false), isOpen = _f[0], setIsOpen = _f[1];
    var _g = useState(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = useState([]), journals = _h[0], setJournals = _h[1];
    var _j = useState(false), loading = _j[0], setLoading = _j[1];
    var _k = useState(null), selectedJournal = _k[0], setSelectedJournal = _k[1];
    // Obtener tipos de diario permitidos para este tipo de factura
    var allowedJournalTypes = INVOICE_TYPE_TO_JOURNAL_TYPE[invoiceType] || [];
    var fetchJournals = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var allJournals, _i, allowedJournalTypes_1, journalType, response, journalsForType, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (allowedJournalTypes.length === 0)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    allJournals = [];
                    _i = 0, allowedJournalTypes_1 = allowedJournalTypes;
                    _a.label = 2;
                case 2:
                    if (!(_i < allowedJournalTypes_1.length)) return [3 /*break*/, 5];
                    journalType = allowedJournalTypes_1[_i];
                    return [4 /*yield*/, JournalAPI.getJournals({
                            type: journalType,
                            is_active: true,
                            search: searchTerm || undefined
                        }, { skip: 0, limit: 100 })];
                case 3:
                    response = _a.sent();
                    journalsForType = response.items.map(function (journal) {
                        var _a;
                        return ({
                            id: journal.id,
                            name: journal.name,
                            code: journal.code,
                            type: journal.type,
                            default_account_id: (_a = journal.default_account) === null || _a === void 0 ? void 0 : _a.id,
                            default_account: journal.default_account
                        });
                    });
                    allJournals.push.apply(allJournals, journalsForType);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    setJournals(allJournals);
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error fetching journals:', error_1);
                    setJournals([]);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [allowedJournalTypes, searchTerm]);
    useEffect(function () {
        if (isOpen) {
            fetchJournals();
        }
    }, [fetchJournals, isOpen]);
    // Buscar el diario seleccionado cuando cambia el value
    useEffect(function () {
        if (value && journals.length > 0) {
            var journal = journals.find(function (j) { return j.id === value; });
            setSelectedJournal(journal || null);
        }
        else if (!value) {
            setSelectedJournal(null);
        }
    }, [value, journals]);
    var handleSelect = function (journal) {
        setSelectedJournal(journal);
        setIsOpen(false);
        setSearchTerm('');
        onSelect(journal);
    };
    var handleClear = function () {
        setSelectedJournal(null);
        onSelect(null);
    };
    var displayValue = selectedJournal
        ? "".concat(selectedJournal.code, " - ").concat(selectedJournal.name)
        : '';
    return (<div className={"relative ".concat(className)}>
      <div className={"\n          relative cursor-pointer\n          ".concat(disabled ? 'opacity-50 cursor-not-allowed' : '', "\n        ")} onClick={function () { return !disabled && setIsOpen(!isOpen); }}>
        <Input value={displayValue} placeholder={placeholder} readOnly required={required} disabled={disabled} className={"\n            pr-10 cursor-pointer\n            ".concat(selectedJournal ? 'text-gray-900' : 'text-gray-500', "\n          ")}/>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon className={"h-4 w-4 text-gray-400 transition-transform ".concat(isOpen ? 'rotate-180' : '')}/>
        </div>
        
        {selectedJournal && !disabled && (<button type="button" onClick={function (e) {
                e.stopPropagation();
                handleClear();
            }} className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-600">
            ×
          </button>)}
      </div>

      {isOpen && !disabled && (<Card className="absolute z-50 mt-1 w-full max-h-60 overflow-auto shadow-lg border">
          <div className="p-3 border-b">
            <Input value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} placeholder="Buscar diario..." className="text-sm" autoFocus/>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {loading ? (<div className="flex justify-center py-4">
                <LoadingSpinner size="sm"/>
              </div>) : journals.length === 0 ? (<div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'No se encontraron diarios' : 'No hay diarios disponibles'}
              </div>) : (<div className="py-1">
                {journals.map(function (journal) { return (<div key={journal.id} onClick={function () { return handleSelect(journal); }} className={"\n                      px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between\n                      ".concat((selectedJournal === null || selectedJournal === void 0 ? void 0 : selectedJournal.id) === journal.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900', "\n                    ")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {journal.code}
                        </span>
                        <Badge variant="subtle" className="text-xs">
                          {getJournalTypeLabel(journal.type)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {journal.name}
                      </div>
                      {journal.default_account && (<div className="text-xs text-gray-500 truncate">
                          Cuenta por defecto: {journal.default_account.code} - {journal.default_account.name}
                        </div>)}
                    </div>
                    
                    {(selectedJournal === null || selectedJournal === void 0 ? void 0 : selectedJournal.id) === journal.id && (<CheckIcon className="h-4 w-4 text-blue-600"/>)}
                  </div>); })}
              </div>)}
          </div>
        </Card>)}
    </div>);
}
