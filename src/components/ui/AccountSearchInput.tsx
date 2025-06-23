/**
 * Componente de búsqueda de cuentas contables con autocompletado
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './Input';
import { LoadingSpinner } from './LoadingSpinner';
import { MagnifyingGlassIcon, XMarkIcon } from '@/shared/components/icons';
import { AccountService } from '@/features/accounts/services';
import type { Account, AccountFilters } from '@/features/accounts/types';

interface AccountSearchInputProps {
  value?: string;
  onChange: (accountId: string | undefined, account?: Account) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  limit?: number;
}

export function AccountSearchInput({
  value,
  onChange,
  placeholder = "Buscar cuenta contable...",
  disabled = false,
  error,
  className = "",
  limit = 10
}: AccountSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para buscar cuentas
  const searchAccounts = useCallback(async (search: string) => {
    if (!search.trim() || search.length < 2) {
      setAccounts([]);
      return;
    }

    setLoading(true);
    try {
      const filters: AccountFilters = {
        search: search.trim(),
        limit,
        is_active: true
      };
      
      const results = await AccountService.getAccounts(filters);
      setAccounts(results);
    } catch (error) {
      console.error('Error al buscar cuentas:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAccounts(searchTerm);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, searchAccounts]);
  // Cargar cuenta seleccionada si viene un valor inicial
  useEffect(() => {
    if (value && !selectedAccount) {
      // Buscar la cuenta por ID para mostrar su información
      AccountService.getAccountById(value)
        .then(account => {
          setSelectedAccount(account);
          setSearchTerm(`${account.code} - ${account.name}`);
        })
        .catch(error => {
          console.error('Error al cargar cuenta inicial:', error);
          // Si no se encuentra la cuenta, limpiar el valor
          setSelectedAccount(null);
          setSearchTerm('');
        });
    } else if (!value && selectedAccount) {
      // Si se limpia el valor externamente, limpiar el estado interno
      setSelectedAccount(null);
      setSearchTerm('');
    }
  }, [value, selectedAccount]);

  // Handle input change
  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);
    
    if (!inputValue.trim()) {
      setSelectedAccount(null);
      onChange(undefined);
    }
  };
  // Handle account selection
  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account);
    setSearchTerm(`${account.code} - ${account.name}`);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onChange(account.id, account);
  };

  // Handle clear selection
  const handleClear = () => {
    setSelectedAccount(null);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onChange(undefined);
    inputRef.current?.focus();
  };

  // Handle input focus for better UX
  const handleInputFocus = () => {
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || accounts.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < accounts.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : accounts.length - 1
        );
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Icono de lupa solo cuando no hay texto o cuando no está enfocado */}
        {!searchTerm && (
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
          <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={selectedAccount ? `${selectedAccount.code} - ${selectedAccount.name}` : placeholder}
          disabled={disabled}
          error={error}
          className={`${searchTerm ? 'pl-3' : 'pl-10'} ${selectedAccount || loading ? 'pr-10' : 'pr-3'} transition-all duration-200 ${
            selectedAccount ? 'bg-green-50 border-green-200' : ''
          }`}
        />

        {/* Botón de limpiar cuando hay una cuenta seleccionada */}
        {selectedAccount && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
            title="Limpiar selección"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        {/* Spinner de carga */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>      {/* Dropdown */}
      {showDropdown && searchTerm.length >= 2 && accounts.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {accounts.map((account, index) => (
            <button
              key={account.id}
              type="button"
              onClick={() => handleAccountSelect(account)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-none transition-colors ${
                index === highlightedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {account.code} - {account.name}
                  </div>
                  {account.description && (
                    <div className="text-sm text-gray-500 truncate mt-1">
                      {account.description}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-shrink-0">
                  <div className="text-xs text-gray-400 text-right">
                    <div>Nivel {account.level}</div>
                    {account.account_type && (
                      <div className="capitalize">{account.account_type}</div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && !loading && searchTerm.length >= 2 && accounts.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
          <div className="flex flex-col items-center space-y-2">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-300" />
            <div>No se encontraron cuentas</div>
            <div className="text-sm">que coincidan con "{searchTerm}"</div>
          </div>
        </div>
      )}
    </div>
  );
}
