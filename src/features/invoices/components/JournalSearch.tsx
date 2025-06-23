/**
 * Componente de búsqueda y selección de diarios para facturas
 * Filtra los diarios según el tipo de factura
 */
import { useState, useEffect, useCallback } from 'react';
import { JournalAPI } from '@/features/journals/api/journalAPI';
import type { JournalType } from '@/features/journals/types';
import { JournalTypeConst } from '@/features/journals/types';
import type { InvoiceType } from '../types';
import { InvoiceTypeConst } from '../types';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckIcon, ChevronDownIcon } from '@/shared/components/icons';

interface JournalOption {
  id: string;
  name: string;
  code: string;
  type: JournalType;
  default_account_id?: string;
  default_account?: {
    id: string;
    code: string;
    name: string;
  };
}

interface JournalSearchProps {
  value?: string;
  onSelect: (journal: JournalOption | null) => void;
  invoiceType: InvoiceType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Mapeo entre tipos de factura y tipos de diario
const INVOICE_TYPE_TO_JOURNAL_TYPE: Record<InvoiceType, JournalType[]> = {
  [InvoiceTypeConst.CUSTOMER_INVOICE]: [JournalTypeConst.SALE],
  [InvoiceTypeConst.SUPPLIER_INVOICE]: [JournalTypeConst.PURCHASE],
  [InvoiceTypeConst.CREDIT_NOTE]: [JournalTypeConst.SALE], // Las notas crédito van al diario de ventas
  [InvoiceTypeConst.DEBIT_NOTE]: [JournalTypeConst.PURCHASE], // Las notas débito van al diario de compras
};

const getJournalTypeLabel = (type: JournalType): string => {
  switch (type) {
    case 'sale': return 'Ventas';
    case 'purchase': return 'Compras';
    case 'cash': return 'Efectivo';
    case 'bank': return 'Banco';
    case 'miscellaneous': return 'Misceláneos';
    default: return type;
  }
};

export function JournalSearch({
  value,
  onSelect,
  invoiceType,
  placeholder = "Seleccionar diario...",
  required = false,
  disabled = false,
  className = ""
}: JournalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [journals, setJournals] = useState<JournalOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalOption | null>(null);

  // Obtener tipos de diario permitidos para este tipo de factura
  const allowedJournalTypes = INVOICE_TYPE_TO_JOURNAL_TYPE[invoiceType] || [];

  const fetchJournals = useCallback(async () => {
    if (allowedJournalTypes.length === 0) return;

    try {
      setLoading(true);
      
      // Buscar diarios para cada tipo permitido
      const allJournals: JournalOption[] = [];
      
      for (const journalType of allowedJournalTypes) {        const response = await JournalAPI.getJournals(
          { 
            type: journalType,
            is_active: true,
            search: searchTerm || undefined
          },
          { skip: 0, limit: 100 }
        );

        const journalsForType = response.items.map(journal => ({
          id: journal.id,
          name: journal.name,
          code: journal.code,
          type: journal.type,
          default_account_id: journal.default_account?.id,
          default_account: journal.default_account
        }));

        allJournals.push(...journalsForType);
      }

      setJournals(allJournals);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setJournals([]);
    } finally {
      setLoading(false);
    }
  }, [allowedJournalTypes, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      fetchJournals();
    }
  }, [fetchJournals, isOpen]);

  // Buscar el diario seleccionado cuando cambia el value
  useEffect(() => {
    if (value && journals.length > 0) {
      const journal = journals.find(j => j.id === value);
      setSelectedJournal(journal || null);
    } else if (!value) {
      setSelectedJournal(null);
    }
  }, [value, journals]);

  const handleSelect = (journal: JournalOption) => {
    setSelectedJournal(journal);
    setIsOpen(false);
    setSearchTerm('');
    onSelect(journal);
  };

  const handleClear = () => {
    setSelectedJournal(null);
    onSelect(null);
  };

  const displayValue = selectedJournal 
    ? `${selectedJournal.code} - ${selectedJournal.name}`
    : '';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Input
          value={displayValue}
          placeholder={placeholder}
          readOnly
          required={required}
          disabled={disabled}
          className={`
            pr-10 cursor-pointer
            ${selectedJournal ? 'text-gray-900' : 'text-gray-500'}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
        
        {selectedJournal && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute inset-y-0 right-8 flex items-center pr-1 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <Card className="absolute z-50 mt-1 w-full max-h-60 overflow-auto shadow-lg border">
          <div className="p-3 border-b">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar diario..."
              className="text-sm"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : journals.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'No se encontraron diarios' : 'No hay diarios disponibles'}
              </div>
            ) : (
              <div className="py-1">
                {journals.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => handleSelect(journal)}
                    className={`
                      px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between
                      ${selectedJournal?.id === journal.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                  >
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
                      {journal.default_account && (
                        <div className="text-xs text-gray-500 truncate">
                          Cuenta por defecto: {journal.default_account.code} - {journal.default_account.name}
                        </div>
                      )}
                    </div>
                    
                    {selectedJournal?.id === journal.id && (
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
