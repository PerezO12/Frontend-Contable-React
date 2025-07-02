import { useCallback } from 'react';
import type { AutocompleteOption } from '../../../components/ui/Autocomplete';
import { apiClient } from '../../../shared/api/client';

// Tipos reales para terceros
export interface Partner {
  id: number;
  name: string;
  document_type?: string;
  document_number?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
}

export interface PartnerSearchFilters {
  query?: string;
  limit?: number;
  is_active?: boolean;
}

// Función real de búsqueda de terceros usando la API
const searchPartnersAPI = async (filters: PartnerSearchFilters): Promise<Partner[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('search', filters.query);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

    const response = await apiClient.get(`/api/v1/third-parties?${params}`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error en searchPartnersAPI:', error);
    return [];
  }
};

export const usePartnerSearch = () => {
  const searchPartners = useCallback(async (query: string): Promise<AutocompleteOption[]> => {
    try {
      const partners = await searchPartnersAPI({
        query,
        limit: 10,
        is_active: true
      });

      return partners.map(partner => ({
        id: partner.id,
        label: partner.name,
        description: `${partner.document_type || ''} ${partner.document_number || ''}`.trim() || undefined
      }));
    } catch (error) {
      console.error('Error buscando terceros:', error);
      return [];
    }
  }, []);

  const getPartnerById = useCallback(async (id: number): Promise<Partner | null> => {
    try {
      const partners = await searchPartnersAPI({ limit: 1000 });
      return partners.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error obteniendo tercero:', error);
      return null;
    }
  }, []);

  return {
    searchPartners,
    getPartnerById
  };
};
