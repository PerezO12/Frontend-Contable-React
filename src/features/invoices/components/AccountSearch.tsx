/**
 * Componente de búsqueda y selección de cuentas contables con autocomplete
 * Estilo similar a CustomerSearch y ProductSearch
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, CheckIcon } from '@/shared/components/icons';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';

interface AccountOption {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
}

interface AccountSearchProps {
  value?: string;
  onChange: (accountId: string, accountInfo: AccountOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowedTypes?: string[]; // Filtrar por tipos de cuenta
}

export function AccountSearch({
  value = '',
  onChange,
  placeholder = 'Buscar cuenta contable...',
  disabled = false,
  className = '',
  allowedTypes
}: AccountSearchProps) {
  const { accounts, loading } = useAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState<AccountOption[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountOption | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);  // Transformar accounts a formato AccountOption (memoizado)
  const accountOptions: AccountOption[] = useMemo(() => {
    return accounts.map(account => ({
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.account_type || 'other',
      level: account.level || 1
    }));
  }, [accounts]);

  // Encontrar cuenta seleccionada cuando cambie el value (solo si no está escribiendo)
  useEffect(() => {
    if (isUserTyping) return;
    
    if (value && accountOptions.length > 0) {
      const account = accountOptions.find(acc => acc.id === value);
      setSelectedAccount(account || null);
      if (account) {
        setSearchTerm(`${account.code} - ${account.name}`);
      }
    } else {
      setSelectedAccount(null);
      setSearchTerm('');
    }
  }, [value, accountOptions, isUserTyping]);  // Filtrar cuentas según el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      let filtered = accountOptions;
      
      if (allowedTypes && allowedTypes.length > 0) {
        filtered = filtered.filter(account => allowedTypes.includes(account.type));
      }
      
      setFilteredAccounts(filtered.slice(0, 10)); // Mostrar primeras 10 sugerencias iniciales
      return;
    }

    const term = searchTerm.toLowerCase();
    let filtered = accountOptions.filter(account =>
      account.code.toLowerCase().includes(term) ||
      account.name.toLowerCase().includes(term)
    );

    if (allowedTypes && allowedTypes.length > 0) {
      filtered = filtered.filter(account => allowedTypes.includes(account.type));
    }

    filtered.sort((a, b) => {
      const aCodeMatch = a.code.toLowerCase().startsWith(term);
      const bCodeMatch = b.code.toLowerCase().startsWith(term);
      const aNameMatch = a.name.toLowerCase().startsWith(term);
      const bNameMatch = b.name.toLowerCase().startsWith(term);

      if (aCodeMatch && !bCodeMatch) return -1;
      if (!aCodeMatch && bCodeMatch) return 1;
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return a.code.localeCompare(b.code);
    });

    setFilteredAccounts(filtered.slice(0, 50));
  }, [searchTerm, accountOptions, allowedTypes]);

  // Manejar clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsUserTyping(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setIsUserTyping(true);
    setSearchTerm(newValue);
    setIsOpen(true);
    
    if (!newValue.trim()) {
      setSelectedAccount(null);
      onChange('', { id: '', code: '', name: '', type: '', level: 0 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredAccounts.length > 0 && !selectedAccount) {
      e.preventDefault();
      handleAccountSelect(filteredAccounts[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsUserTyping(false);
    }
  };

  const handleAccountSelect = useCallback((account: AccountOption) => {
    setSelectedAccount(account);
    setSearchTerm(`${account.code} - ${account.name}`);
    setIsOpen(false);
    setIsUserTyping(false);
    onChange(account.id, account);
  }, [onChange]);
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      // Si no hay término de búsqueda, mostrar sugerencias iniciales
      if (!searchTerm.trim() && !isUserTyping) {
        setIsUserTyping(true);
      }
    }
  };

  const handleClear = () => {
    setSelectedAccount(null);
    setSearchTerm('');
    setIsOpen(false);
    setIsUserTyping(false);
    onChange('', { id: '', code: '', name: '', type: '', level: 0 });
    inputRef.current?.focus();
  };

  const getAccountTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'asset': 'text-green-600',
      'liability': 'text-red-600',
      'equity': 'text-blue-600',
      'income': 'text-purple-600',
      'expense': 'text-orange-600',
      'other': 'text-gray-600'
    };
    return colors[type] || colors.other;
  };

  const formatAccountLevel = (level: number) => {
    return '  '.repeat(Math.max(0, level - 1));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Cargando cuentas...' : placeholder}
          disabled={disabled || loading}
          className="pr-20"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {selectedAccount && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100 mr-1"
              disabled={disabled}
            >
              ×
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0 hover:bg-gray-100 mr-1"
            disabled={disabled || loading}
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            ) : (
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2" />
              Cargando cuentas...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              {searchTerm ? 'No se encontraron cuentas' : 'No hay cuentas disponibles'}
            </div>
          ) : (
            <div className="py-1">
              {filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleAccountSelect(account)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    selectedAccount?.id === account.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">
                          {formatAccountLevel(account.level)}
                        </span>
                        <span className="font-medium text-gray-900 mr-2">
                          {account.code}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getAccountTypeColor(account.type)}`}>
                          {account.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 truncate mt-0.5">
                        {formatAccountLevel(account.level)}{account.name}
                      </div>
                    </div>
                    {selectedAccount?.id === account.id && (
                      <CheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
