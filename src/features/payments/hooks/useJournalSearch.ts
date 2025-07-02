import { useCallback } from 'react';
import type { AutocompleteOption } from '../../../components/ui/Autocomplete';
import { apiClient } from '../../../shared/api/client';

// Usar los tipos reales de diarios
export interface Journal {
  id: string;
  name: string;
  code: string;
  type: 'sale' | 'purchase' | 'cash' | 'bank' | 'miscellaneous';
  is_active: boolean;
  currency_code: string;
  default_account?: {
    id: string;
    code: string;
    name: string;
  };
  description?: string;
}

export interface JournalSearchFilters {
  query?: string;
  limit?: number;
  is_active?: boolean;
  type?: string;
}

// Función real de búsqueda de diarios usando la API
const searchJournalsAPI = async (filters: JournalSearchFilters): Promise<Journal[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('search', filters.query);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters.type) params.append('type', filters.type);

    const response = await apiClient.get(`/api/v1/journals?${params}`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error en searchJournalsAPI:', error);
    return [];
  }
}
export const useJournalSearch = () => {
  const searchJournals = useCallback(async (query: string): Promise<AutocompleteOption[]> => {
    try {
      const journals = await searchJournalsAPI({
        query,
        limit: 10,
        is_active: true
      });

      return journals.map(journal => ({
        id: journal.id,
        label: journal.name,
        description: `${journal.code} - ${journal.currency_code}${journal.description ? ` - ${journal.description}` : ''}`
      }));
    } catch (error) {
      console.error('Error buscando diarios:', error);
      return [];
    }
  }, []);

  const getJournalById = useCallback(async (id: string): Promise<Journal | null> => {
    try {
      const journals = await searchJournalsAPI({ limit: 1000 });
      return journals.find(j => j.id === id) || null;
    } catch (error) {
      console.error('Error obteniendo diario:', error);
      return null;
    }
  }, []);

  return {
    searchJournals,
    getJournalById
  };
};
