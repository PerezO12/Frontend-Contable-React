/**
 * Componente de búsqueda y selección de cuentas contables con autocomplete
 * Estilo similar a CustomerSearch y ProductSearch
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, CheckIcon } from '@/shared/components/icons';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
export function AccountSearch(_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, onChange = _a.onChange, _c = _a.placeholder, placeholder = _c === void 0 ? 'Buscar cuenta contable...' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.className, className = _e === void 0 ? '' : _e, allowedTypes = _a.allowedTypes;
    var _f = useAccounts(), accounts = _f.accounts, loading = _f.loading;
    var _g = useState(false), isOpen = _g[0], setIsOpen = _g[1];
    var _h = useState(''), searchTerm = _h[0], setSearchTerm = _h[1];
    var _j = useState([]), filteredAccounts = _j[0], setFilteredAccounts = _j[1];
    var _k = useState(null), selectedAccount = _k[0], setSelectedAccount = _k[1];
    var _l = useState(false), isUserTyping = _l[0], setIsUserTyping = _l[1];
    var dropdownRef = useRef(null);
    var inputRef = useRef(null); // Transformar accounts a formato AccountOption (memoizado)
    var accountOptions = useMemo(function () {
        return accounts.map(function (account) { return ({
            id: account.id,
            code: account.code,
            name: account.name,
            type: account.account_type || 'other',
            level: account.level || 1
        }); });
    }, [accounts]);
    // Encontrar cuenta seleccionada cuando cambie el value (solo si no está escribiendo)
    useEffect(function () {
        if (isUserTyping)
            return;
        if (value && accountOptions.length > 0) {
            var account = accountOptions.find(function (acc) { return acc.id === value; });
            setSelectedAccount(account || null);
            if (account) {
                setSearchTerm("".concat(account.code, " - ").concat(account.name));
            }
        }
        else {
            setSelectedAccount(null);
            setSearchTerm('');
        }
    }, [value, accountOptions, isUserTyping]); // Filtrar cuentas según el término de búsqueda
    useEffect(function () {
        if (!searchTerm.trim()) {
            var filtered_1 = accountOptions;
            if (allowedTypes && allowedTypes.length > 0) {
                filtered_1 = filtered_1.filter(function (account) { return allowedTypes.includes(account.type); });
            }
            setFilteredAccounts(filtered_1.slice(0, 10)); // Mostrar primeras 10 sugerencias iniciales
            return;
        }
        var term = searchTerm.toLowerCase();
        var filtered = accountOptions.filter(function (account) {
            return account.code.toLowerCase().includes(term) ||
                account.name.toLowerCase().includes(term);
        });
        if (allowedTypes && allowedTypes.length > 0) {
            filtered = filtered.filter(function (account) { return allowedTypes.includes(account.type); });
        }
        filtered.sort(function (a, b) {
            var aCodeMatch = a.code.toLowerCase().startsWith(term);
            var bCodeMatch = b.code.toLowerCase().startsWith(term);
            var aNameMatch = a.name.toLowerCase().startsWith(term);
            var bNameMatch = b.name.toLowerCase().startsWith(term);
            if (aCodeMatch && !bCodeMatch)
                return -1;
            if (!aCodeMatch && bCodeMatch)
                return 1;
            if (aNameMatch && !bNameMatch)
                return -1;
            if (!aNameMatch && bNameMatch)
                return 1;
            return a.code.localeCompare(b.code);
        });
        setFilteredAccounts(filtered.slice(0, 50));
    }, [searchTerm, accountOptions, allowedTypes]);
    // Manejar clic fuera del componente
    useEffect(function () {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsUserTyping(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var handleInputChange = function (e) {
        var newValue = e.target.value;
        setIsUserTyping(true);
        setSearchTerm(newValue);
        setIsOpen(true);
        if (!newValue.trim()) {
            setSelectedAccount(null);
            onChange('', { id: '', code: '', name: '', type: '', level: 0 });
        }
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter' && filteredAccounts.length > 0 && !selectedAccount) {
            e.preventDefault();
            handleAccountSelect(filteredAccounts[0]);
        }
        else if (e.key === 'Escape') {
            setIsOpen(false);
            setIsUserTyping(false);
        }
    };
    var handleAccountSelect = useCallback(function (account) {
        setSelectedAccount(account);
        setSearchTerm("".concat(account.code, " - ").concat(account.name));
        setIsOpen(false);
        setIsUserTyping(false);
        onChange(account.id, account);
    }, [onChange]);
    var handleInputFocus = function () {
        if (!disabled) {
            setIsOpen(true);
            // Si no hay término de búsqueda, mostrar sugerencias iniciales
            if (!searchTerm.trim() && !isUserTyping) {
                setIsUserTyping(true);
            }
        }
    };
    var handleClear = function () {
        var _a;
        setSelectedAccount(null);
        setSearchTerm('');
        setIsOpen(false);
        setIsUserTyping(false);
        onChange('', { id: '', code: '', name: '', type: '', level: 0 });
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var getAccountTypeColor = function (type) {
        var colors = {
            'asset': 'text-green-600',
            'liability': 'text-red-600',
            'equity': 'text-blue-600',
            'income': 'text-purple-600',
            'expense': 'text-orange-600',
            'other': 'text-gray-600'
        };
        return colors[type] || colors.other;
    };
    var formatAccountLevel = function (level) {
        return '  '.repeat(Math.max(0, level - 1));
    };
    return (<div ref={dropdownRef} className={"relative ".concat(className)}>
      <div className="relative">
        <Input ref={inputRef} type="text" value={searchTerm} onChange={handleInputChange} onFocus={handleInputFocus} onKeyDown={handleKeyDown} placeholder={loading ? 'Cargando cuentas...' : placeholder} disabled={disabled || loading} className="pr-20"/>
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {selectedAccount && (<Button type="button" variant="ghost" size="sm" onClick={handleClear} className="h-8 w-8 p-0 hover:bg-gray-100 mr-1" disabled={disabled}>
              ×
            </Button>)}
          
          <Button type="button" variant="ghost" size="sm" onClick={function () { return setIsOpen(!isOpen); }} className="h-8 w-8 p-0 hover:bg-gray-100 mr-1" disabled={disabled || loading}>
            {loading ? (<div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"/>) : (<ChevronDownIcon className={"h-4 w-4 transition-transform ".concat(isOpen ? 'rotate-180' : '')}/>)}
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (<div className="p-3 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"/>
              Cargando cuentas...
            </div>) : filteredAccounts.length === 0 ? (<div className="p-3 text-center text-gray-500">
              {searchTerm ? 'No se encontraron cuentas' : 'No hay cuentas disponibles'}
            </div>) : (<div className="py-1">
              {filteredAccounts.map(function (account) { return (<button key={account.id} type="button" onClick={function () { return handleAccountSelect(account); }} className={"w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ".concat((selectedAccount === null || selectedAccount === void 0 ? void 0 : selectedAccount.id) === account.id ? 'bg-blue-50' : '')}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">
                          {formatAccountLevel(account.level)}
                        </span>
                        <span className="font-medium text-gray-900 mr-2">
                          {account.code}
                        </span>
                        <span className={"text-xs px-1.5 py-0.5 rounded-full font-medium ".concat(getAccountTypeColor(account.type))}>
                          {account.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 truncate mt-0.5">
                        {formatAccountLevel(account.level)}{account.name}
                      </div>
                    </div>
                    {(selectedAccount === null || selectedAccount === void 0 ? void 0 : selectedAccount.id) === account.id && (<CheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0"/>)}
                  </div>
                </button>); })}
            </div>)}
        </div>)}
    </div>);
}
