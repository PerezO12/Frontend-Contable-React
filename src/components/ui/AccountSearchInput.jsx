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
 * Componente de búsqueda de cuentas contables con autocompletado
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './Input';
import { LoadingSpinner } from './LoadingSpinner';
import { MagnifyingGlassIcon, XMarkIcon } from '@/shared/components/icons';
import { AccountService } from '@/features/accounts/services';
export function AccountSearchInput(_a) {
    var _this = this;
    var value = _a.value, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? "Buscar cuenta contable..." : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, error = _a.error, _d = _a.className, className = _d === void 0 ? "" : _d, _e = _a.limit, limit = _e === void 0 ? 10 : _e;
    var _f = useState(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = useState([]), accounts = _g[0], setAccounts = _g[1];
    var _h = useState(false), loading = _h[0], setLoading = _h[1];
    var _j = useState(false), showDropdown = _j[0], setShowDropdown = _j[1];
    var _k = useState(null), selectedAccount = _k[0], setSelectedAccount = _k[1];
    var _l = useState(-1), highlightedIndex = _l[0], setHighlightedIndex = _l[1];
    var inputRef = useRef(null);
    var dropdownRef = useRef(null);
    var timeoutRef = useRef(null);
    // Función para buscar cuentas
    var searchAccounts = useCallback(function (search) { return __awaiter(_this, void 0, void 0, function () {
        var filters, results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!search.trim() || search.length < 2) {
                        setAccounts([]);
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    filters = {
                        search: search.trim(),
                        limit: limit,
                        is_active: true
                    };
                    return [4 /*yield*/, AccountService.getAccounts(filters)];
                case 2:
                    results = _a.sent();
                    setAccounts(results);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al buscar cuentas:', error_1);
                    setAccounts([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [limit]);
    // Debounced search
    useEffect(function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(function () {
            searchAccounts(searchTerm);
        }, 300);
        return function () {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, searchAccounts]);
    // Cargar cuenta seleccionada si viene un valor inicial
    useEffect(function () {
        if (value && !selectedAccount) {
            // Buscar la cuenta por ID para mostrar su información
            AccountService.getAccountById(value)
                .then(function (account) {
                setSelectedAccount(account);
                setSearchTerm("".concat(account.code, " - ").concat(account.name));
            })
                .catch(function (error) {
                console.error('Error al cargar cuenta inicial:', error);
                // Si no se encuentra la cuenta, limpiar el valor
                setSelectedAccount(null);
                setSearchTerm('');
            });
        }
        else if (!value && selectedAccount) {
            // Si se limpia el valor externamente, limpiar el estado interno
            setSelectedAccount(null);
            setSearchTerm('');
        }
    }, [value, selectedAccount]);
    // Handle input change
    var handleInputChange = function (inputValue) {
        setSearchTerm(inputValue);
        setShowDropdown(true);
        setHighlightedIndex(-1);
        if (!inputValue.trim()) {
            setSelectedAccount(null);
            onChange(undefined);
        }
    };
    // Handle account selection
    var handleAccountSelect = function (account) {
        setSelectedAccount(account);
        setSearchTerm("".concat(account.code, " - ").concat(account.name));
        setShowDropdown(false);
        setHighlightedIndex(-1);
        onChange(account.id, account);
    };
    // Handle clear selection
    var handleClear = function () {
        var _a;
        setSelectedAccount(null);
        setSearchTerm('');
        setShowDropdown(false);
        setHighlightedIndex(-1);
        onChange(undefined);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    // Handle input focus for better UX
    var handleInputFocus = function () {
        if (searchTerm.length >= 2) {
            setShowDropdown(true);
        }
        // Si hay una cuenta seleccionada, limpiar el texto para permitir nueva búsqueda
        if (selectedAccount) {
            setSearchTerm('');
            setSelectedAccount(null);
            onChange(undefined);
        }
    };
    // Handle keyboard navigation
    var handleKeyDown = function (e) {
        if (!showDropdown || accounts.length === 0)
            return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(function (prev) {
                    return prev < accounts.length - 1 ? prev + 1 : 0;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(function (prev) {
                    return prev > 0 ? prev - 1 : accounts.length - 1;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < accounts.length) {
                    handleAccountSelect(accounts[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setHighlightedIndex(-1);
                break;
        }
    };
    // Close dropdown when clicking outside
    useEffect(function () {
        var handleClickOutside = function (event) {
            var _a;
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    return (<div className={"relative ".concat(className)}>
      <div className="relative">
        {/* Icono de lupa solo cuando no hay texto o cuando no está enfocado */}
        {!searchTerm && (<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>)}
          <Input ref={inputRef} value={searchTerm} onChange={function (e) { return handleInputChange(e.target.value); }} onKeyDown={handleKeyDown} onFocus={handleInputFocus} placeholder={selectedAccount ? "".concat(selectedAccount.code, " - ").concat(selectedAccount.name) : placeholder} disabled={disabled} error={error} className={"".concat(searchTerm ? 'pl-3' : 'pl-10', " ").concat(selectedAccount || loading ? 'pr-10' : 'pr-3', " transition-all duration-200 ").concat(selectedAccount ? 'bg-green-50 border-green-200' : '')}/>

        {/* Botón de limpiar cuando hay una cuenta seleccionada */}
        {selectedAccount && !loading && (<button type="button" onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" disabled={disabled} title="Limpiar selección">
            <XMarkIcon className="h-4 w-4"/>
          </button>)}

        {/* Spinner de carga */}
        {loading && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm"/>
          </div>)}
      </div>      {/* Dropdown */}
      {showDropdown && searchTerm.length >= 2 && accounts.length > 0 && (<div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {accounts.map(function (account, index) { return (<button key={account.id} type="button" onClick={function () { return handleAccountSelect(account); }} className={"w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-none transition-colors ".concat(index === highlightedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : '')}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {account.code} - {account.name}
                  </div>
                  {account.description && (<div className="text-sm text-gray-500 truncate mt-1">
                      {account.description}
                    </div>)}
                </div>
                <div className="ml-3 flex-shrink-0">
                  <div className="text-xs text-gray-400 text-right">
                    <div>Nivel {account.level}</div>
                    {account.account_type && (<div className="capitalize">{account.account_type}</div>)}
                  </div>
                </div>
              </div>
            </button>); })}
        </div>)}

      {/* No results message */}
      {showDropdown && !loading && searchTerm.length >= 2 && accounts.length === 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
          <div className="flex flex-col items-center space-y-2">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-300"/>
            <div>No se encontraron cuentas</div>
            <div className="text-sm">que coincidan con "{searchTerm}"</div>
          </div>
        </div>)}
    </div>);
}
