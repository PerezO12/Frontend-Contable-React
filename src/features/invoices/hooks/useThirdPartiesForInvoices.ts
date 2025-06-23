/**
 * Hook para obtener terceros (clientes/proveedores) para facturas
 */
import { useState, useEffect } from 'react';
import { ThirdPartyService } from '@/features/third-parties/services/third-party.service';
import type { ThirdParty, ThirdPartyType } from '@/features/third-parties/types';

interface UseThirdPartiesForInvoicesProps {
  type?: ThirdPartyType | 'all';
}

interface ThirdPartyOption {
  value: string;
  label: string;
  code?: string;
  type: ThirdPartyType;
}

export function useThirdPartiesForInvoices({ type = 'all' }: UseThirdPartiesForInvoicesProps = {}) {
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThirdParties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = type !== 'all' ? { third_party_type: type } : undefined;
        const response = await ThirdPartyService.getThirdParties(filters);
        setThirdParties(response.items || []);
      } catch (err) {
        setError('Error al cargar terceros');
        console.error('Error fetching third parties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThirdParties();
  }, [type]);

  // Convertir a opciones para el Select
  const options: ThirdPartyOption[] = thirdParties.map(thirdParty => ({
    value: thirdParty.id,
    label: `${thirdParty.code ? thirdParty.code + ' - ' : ''}${thirdParty.name}`,
    code: thirdParty.code,
    type: thirdParty.third_party_type
  }));

  // Filtrar solo clientes
  const customerOptions = options.filter(option => option.type === 'customer');
  
  // Filtrar solo proveedores
  const supplierOptions = options.filter(option => option.type === 'supplier');

  return {
    thirdParties,
    options,
    customerOptions,
    supplierOptions,
    loading,
    error,
    refetch: () => {
      const fetchThirdParties = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const filters = type !== 'all' ? { third_party_type: type } : undefined;
          const response = await ThirdPartyService.getThirdParties(filters);
          setThirdParties(response.items || []);
        } catch (err) {
          setError('Error al cargar terceros');
          console.error('Error fetching third parties:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchThirdParties();
    }
  };
}
