import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '../../shared/components/icons';

export interface AutocompleteOption {
  id: string | number;
  label: string;
  description?: string;
}

export interface AutocompleteProps {
  value?: AutocompleteOption | null;
  onChange: (option: AutocompleteOption | null) => void;
  onSearch: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  minQueryLength?: number;
  maxResults?: number;
  noResultsText?: string;
  className?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  disabled = false,
  error,
  loading = false,
  minQueryLength = 1,
  maxResults = 10,
  noResultsText = 'No se encontraron resultados',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setOptions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await onSearch(searchQuery);
        setOptions(results.slice(0, maxResults));
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setOptions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch, minQueryLength, maxResults]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, debouncedSearch]);

  // Inicializar con algunas opciones al abrir
  useEffect(() => {
    if (isOpen && options.length === 0 && query.length === 0) {
      debouncedSearch(''); // Buscar opciones iniciales
    }
  }, [isOpen, options.length, query.length, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (options.length === 0 && query.length === 0) {
      debouncedSearch(''); // Cargar opciones iniciales
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir click en opciones
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    onChange(option);
    setQuery(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleOptionClick(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Sync query with value
  useEffect(() => {
    if (value) {
      setQuery(value.label);
    } else {
      setQuery('');
    }
  }, [value]);

  const showOptions = isOpen && (options.length > 0 || isSearching || (query.length >= minQueryLength && !isSearching));

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`
            w-full px-3 py-2 pr-10 border rounded-md shadow-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
            }
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {(loading || isSearching) && (
            <svg 
              className="animate-spin h-4 w-4 text-gray-400 mr-1" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 mr-1"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown de opciones */}
      {showOptions && (
        <div 
          ref={optionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isSearching ? (
            <div className="px-3 py-2 text-center text-gray-500">
              <MagnifyingGlassIcon className="h-4 w-4 inline mr-2" />
              Buscando...
            </div>
          ) : options.length > 0 ? (
            options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`
                  w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                  ${index === highlightedIndex ? 'bg-blue-50' : ''}
                  ${value?.id === option.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                `}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </button>
            ))
          ) : query.length >= minQueryLength ? (
            <div className="px-3 py-2 text-center text-gray-500">
              {noResultsText}
            </div>
          ) : (
            <div className="px-3 py-2 text-center text-gray-500">
              Escriba para buscar...
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
