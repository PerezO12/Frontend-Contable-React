import { useCallback } from 'react';
import type { AutocompleteOption } from '../components/ui/Autocomplete';

// Mock API para cuentas contables - esto debería conectarse a tu API real
export interface Account {
  id: string; // UUID en el backend
  code: string;
  name: string;
  account_type: string;
  parent_id?: string;
  is_active: boolean;
  balance?: number;
  currency_code: string;
  description?: string;
}

export interface AccountSearchFilters {
  query?: string;
  limit?: number;
  is_active?: boolean;
  account_type?: string;
  currency_code?: string;
}

// Mock de la función de búsqueda - reemplazar con llamada real a la API
const searchAccountsAPI = async (filters: AccountSearchFilters): Promise<Account[]> => {
  // Simulación de datos para desarrollo - cuentas típicas para diarios bancarios
  const mockAccounts: Account[] = [
    // Cuentas bancarias
    { 
      id: '1', 
      code: '1110001', 
      name: 'Banco Davivienda - Cuenta Corriente 123456789', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuenta corriente principal en pesos colombianos'
    },
    { 
      id: '2', 
      code: '1110002', 
      name: 'Banco Bancolombia - Ahorros 987654321', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuenta de ahorros empresarial'
    },
    { 
      id: '3', 
      code: '1110003', 
      name: 'Banco BBVA - USD 555666777', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'USD',
      description: 'Cuenta en dólares americanos'
    },
    
    // Cuentas transitorias
    { 
      id: '4', 
      code: '1115001', 
      name: 'Pagos en Tránsito', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuenta transitoria para pagos en proceso'
    },
    { 
      id: '5', 
      code: '1115002', 
      name: 'Transferencias Pendientes', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuenta transitoria para transferencias pendientes'
    },
    
    // Cuentas de ganancias
    { 
      id: '6', 
      code: '4295001', 
      name: 'Diferencias en Cambio - Ganancia', 
      account_type: 'income', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Ganancias por diferencias de cambio'
    },
    { 
      id: '7', 
      code: '4295002', 
      name: 'Intereses Bancarios Ganados', 
      account_type: 'income', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Intereses ganados en cuentas bancarias'
    },
    
    // Cuentas de pérdidas
    { 
      id: '8', 
      code: '5295001', 
      name: 'Diferencias en Cambio - Pérdida', 
      account_type: 'expense', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Pérdidas por diferencias de cambio'
    },
    { 
      id: '9', 
      code: '5295002', 
      name: 'Comisiones Bancarias', 
      account_type: 'expense', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Comisiones y gastos bancarios'
    },
    
    // Cuentas de recibo
    { 
      id: '10', 
      code: '1305001', 
      name: 'Clientes Nacionales', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuentas por cobrar a clientes nacionales'
    },
    { 
      id: '11', 
      code: '1305002', 
      name: 'Clientes del Exterior', 
      account_type: 'asset', 
      is_active: true, 
      currency_code: 'USD',
      description: 'Cuentas por cobrar a clientes extranjeros'
    },
    
    // Cuentas de pago pendiente
    { 
      id: '12', 
      code: '2205001', 
      name: 'Proveedores Nacionales', 
      account_type: 'liability', 
      is_active: true, 
      currency_code: 'COP',
      description: 'Cuentas por pagar a proveedores nacionales'
    },
    { 
      id: '13', 
      code: '2205002', 
      name: 'Proveedores del Exterior', 
      account_type: 'liability', 
      is_active: true, 
      currency_code: 'USD',
      description: 'Cuentas por pagar a proveedores extranjeros'
    },
  ];

  // Filtrar por query si existe
  let filteredAccounts = mockAccounts;
  
  if (filters.query && filters.query.length > 0) {
    const queryLower = filters.query.toLowerCase();
    filteredAccounts = mockAccounts.filter(account => 
      account.name.toLowerCase().includes(queryLower) ||
      account.code.toLowerCase().includes(queryLower) ||
      account.description?.toLowerCase().includes(queryLower)
    );
  }

  // Filtrar por estado activo
  if (filters.is_active !== undefined) {
    filteredAccounts = filteredAccounts.filter(account => account.is_active === filters.is_active);
  }

  // Filtrar por tipo de cuenta
  if (filters.account_type) {
    filteredAccounts = filteredAccounts.filter(account => account.account_type === filters.account_type);
  }

  // Filtrar por moneda
  if (filters.currency_code) {
    filteredAccounts = filteredAccounts.filter(account => account.currency_code === filters.currency_code);
  }

  // Aplicar límite
  if (filters.limit) {
    filteredAccounts = filteredAccounts.slice(0, filters.limit);
  }

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  return filteredAccounts;
};

export const useAccountSearch = () => {
  const searchAccounts = useCallback(async (query: string): Promise<AutocompleteOption[]> => {
    try {
      const accounts = await searchAccountsAPI({
        query,
        limit: 15,
        is_active: true
      });

      return accounts.map(account => ({
        id: account.id,
        label: `${account.code} - ${account.name}`,
        description: `${account.account_type.toUpperCase()} - ${account.currency_code}${account.description ? ` - ${account.description}` : ''}`
      }));
    } catch (error) {
      console.error('Error buscando cuentas:', error);
      return [];
    }
  }, []);

  const searchAccountsByType = useCallback(async (query: string, accountType: string): Promise<AutocompleteOption[]> => {
    try {
      const accounts = await searchAccountsAPI({
        query,
        limit: 15,
        is_active: true,
        account_type: accountType
      });

      return accounts.map(account => ({
        id: account.id,
        label: `${account.code} - ${account.name}`,
        description: `${account.currency_code}${account.description ? ` - ${account.description}` : ''}`
      }));
    } catch (error) {
      console.error('Error buscando cuentas por tipo:', error);
      return [];
    }
  }, []);

  const getAccountById = useCallback(async (id: string): Promise<Account | null> => {
    try {
      const accounts = await searchAccountsAPI({ limit: 1000 });
      return accounts.find(a => a.id === id) || null;
    } catch (error) {
      console.error('Error obteniendo cuenta:', error);
      return null;
    }
  }, []);

  return {
    searchAccounts,
    searchAccountsByType,
    getAccountById
  };
};
