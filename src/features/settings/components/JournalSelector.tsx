/**
 * Journal Selector Component
 * Simple dropdown component for selecting journals
 */
import React, { useState } from 'react';

export interface Journal {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

interface JournalSelectorProps {
  value?: string;
  onChange: (journalId: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Mock journals - replace with real API call when available
const mockJournals: Journal[] = [
  { id: '69259851-939b-4576-8bf7-97ae4477fdff', code: 'VEN', name: 'Diario de Ventas', is_active: true },
  { id: '8c568ff7-e5e1-4705-81f2-22714986358b', code: 'COM', name: 'Diario de Compras', is_active: true },
  { id: '4dbe39d4-620b-44d7-86c9-f047c9c18a4f', code: 'CAJ', name: 'Diario de Caja', is_active: true },
  { id: 'facce42b-690a-486b-9840-5468a2202382', code: 'BAN', name: 'Diario de Bancos', is_active: true },
  { id: '60e17844-5824-4596-a0c4-9741f1a80628', code: 'GEN', name: 'Diario General', is_active: true },
];

export const JournalSelector: React.FC<JournalSelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar diario",
  error,
  disabled = false,
  className = ""
}) => {
  const [journals] = useState<Journal[]>(mockJournals);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const journalId = e.target.value;
    onChange(journalId);
  };

  return (
    <div className={className}>
      <select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      >
        <option value="">{placeholder}</option>
        {journals
          .filter(journal => journal.is_active)
          .map(journal => (
            <option key={journal.id} value={journal.id}>
              {journal.code} - {journal.name}
            </option>
          ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
