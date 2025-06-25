import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AccountService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type { 
  Account, 
  AccountTree, 
  AccountCreate, 
  AccountUpdate, 
  AccountFilters,
  AccountType,
  AccountDeleteValidation,
  BulkAccountDelete,
  BulkAccountDeleteResult
} from '../types';

export const useAccounts = (filters?: AccountFilters) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  // Estabilizar filters para evitar bucles infinitos
  const stableFilters = useMemo(() => filters, [
    filters?.search,
    filters?.account_type,
    filters?.category,
    filters?.cash_flow_category,
    filters?.is_active,
    filters?.skip,
    filters?.limit
  ]);

  // Ref para evitar fetch duplicado
  const lastFetchFilters = useRef<string>('');

  const fetchAccounts = useCallback(async (filters?: AccountFilters) => {
    const filtersKey = JSON.stringify(filters || {});
    
    // Evitar petición duplicada si los filtros son los mismos
    if (lastFetchFilters.current === filtersKey) {
      return;
    }
    
    lastFetchFilters.current = filtersKey;
    
    console.log('🔍 [useAccounts] fetchAccounts called with filters:', filters);
    setLoading(true);
    setError(null);
    
    try {
      const response = await AccountService.getAccounts(filters);
      console.log('🔍 [useAccounts] Response from service:', response);
      
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        // Backend returned plain array
        console.log('🔍 [useAccounts] Response is plain array, converting to paginated format');
        setAccounts(response);
        setTotal(response.length);
        console.log('🔍 [useAccounts] Set accounts from array:', response.length, 'total:', response.length);
      } else {
        // Backend returned paginated response
        console.log('🔍 [useAccounts] Response is paginated object');
        setAccounts(response.items);
        setTotal(response.total);
        console.log('🔍 [useAccounts] Set accounts from object:', response.items.length, 'total:', response.total);
      }
    } catch (err) {
      console.error('❌ [useAccounts] Error fetching accounts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las cuentas';
      setError(errorMessage);
      showError(errorMessage);
      setAccounts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const refetch = useCallback(() => {
    fetchAccounts(stableFilters);
  }, [fetchAccounts, stableFilters]);

  const refetchWithFilters = useCallback((newFilters: AccountFilters) => {
    fetchAccounts(newFilters);
  }, [fetchAccounts]);

  // Función para forzar refetch ignorando cache
  const forceRefetch = useCallback((newFilters?: AccountFilters) => {
    // Limpiar cache para forzar nueva petición
    lastFetchFilters.current = '';
    fetchAccounts(newFilters || stableFilters);
  }, [fetchAccounts, stableFilters]);

  useEffect(() => {
    fetchAccounts(stableFilters);
  }, [fetchAccounts, stableFilters]);

  const createAccount = useCallback(async (accountData: AccountCreate): Promise<Account | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newAccount = await AccountService.createAccount(accountData);
      setAccounts(prev => [...prev, newAccount]);
      success('Cuenta creada exitosamente');
      return newAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const updateAccount = useCallback(async (id: string, updateData: AccountUpdate): Promise<Account | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAccount = await AccountService.updateAccount(id, updateData);
      setAccounts(prev => prev.map(account => 
        account.id === id ? updatedAccount : account
      ));
      success('Cuenta actualizada exitosamente');
      return updatedAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la cuenta';
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await AccountService.deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
      success('Cuenta eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la cuenta';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const toggleAccountStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAccount = await AccountService.toggleAccountStatus(id, isActive);
      setAccounts(prev => prev.map(account => 
        account.id === id ? updatedAccount : account
      ));
      success(`Cuenta ${isActive ? 'activada' : 'desactivada'} exitosamente`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el estado de la cuenta';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  // Método para obtener cuentas potenciales padre por tipo
  const getParentAccountsByType = useCallback(async (accountType: AccountType): Promise<Account[]> => {
    try {
      // Filtramos por tipo de cuenta y solo cuentas activas
      const filters: AccountFilters = {
        account_type: accountType,
        is_active: true
      };
      const response = await AccountService.getAccounts(filters);
      
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        console.log('Posibles cuentas padre encontradas:', response.length);
        return response;
      } else {
        console.log('Posibles cuentas padre encontradas:', response.items.length);
        return response.items;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las cuentas padre potenciales';
      showError(errorMessage);
      return [];
    }
  }, [showError]);

  // Validar eliminación masiva
  const validateBulkDeletion = useCallback(async (accountIds: string[]): Promise<AccountDeleteValidation[]> => {
    try {
      return await AccountService.validateDeletion(accountIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar la eliminación';
      showError(errorMessage);
      throw err;
    }
  }, [showError]);

  // Eliminar cuentas masivamente
  const bulkDeleteAccounts = useCallback(async (deleteData: BulkAccountDelete): Promise<BulkAccountDeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AccountService.bulkDeleteAccounts(deleteData);
      
      // Actualizar la lista removiendo las cuentas eliminadas exitosamente
      if (result.successfully_deleted.length > 0) {
        setAccounts(prev => prev.filter(account => 
          !result.successfully_deleted.includes(account.id)
        ));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la eliminación masiva';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);
  return {
    accounts,
    total,
    loading,
    error,
    refetch,
    refetchWithFilters,
    forceRefetch,
    createAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    getParentAccountsByType,
    validateBulkDeletion,
    bulkDeleteAccounts
  };
};

export const useAccountTree = (accountType?: string, activeOnly: boolean = true) => {
  const [accountTree, setAccountTree] = useState<AccountTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();  const fetchAccountTree = useCallback(async (type?: string, active?: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AccountService.getAccountTree(type, active);
      setAccountTree(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el árbol de cuentas';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]); // Solo showError como dependencia

  useEffect(() => {
    fetchAccountTree(accountType, activeOnly);
  }, []); // Array vacío para ejecutar solo una vez

  return {
    accountTree,
    loading,
    error,
    refetch: fetchAccountTree
  };
};

export const useAccount = (id?: string) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchAccount = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AccountService.getAccountById(accountId);
      setAccount(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la cuenta';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchAccountByCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AccountService.getAccountByCode(code);
      setAccount(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la cuenta';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);
  useEffect(() => {
    if (id) {
      fetchAccount(id);
    }
  }, [id]); // Solo depende del id

  return {
    account,
    loading,
    error,
    fetchAccount,
    fetchAccountByCode,
    setAccount
  };
};

export const useAccountValidation = () => {
  const [checking, setChecking] = useState(false);

  const checkCodeAvailability = useCallback(async (code: string, excludeId?: string): Promise<boolean> => {
    setChecking(true);
    
    try {
      const isAvailable = await AccountService.checkCodeAvailability(code, excludeId);
      return isAvailable;
    } catch (err) {
      console.error('Error checking code availability:', err);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    checking,
    checkCodeAvailability
  };
};

export const useAccountBalance = (accountId?: string) => {
  const [balance, setBalance] = useState<{
    balance: string;
    debit_balance: string;
    credit_balance: string;
    as_of_date: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchBalance = useCallback(async (id: string, asOfDate?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AccountService.getAccountBalance(id, asOfDate);
      setBalance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el saldo de la cuenta';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);
  useEffect(() => {
    if (accountId) {
      fetchBalance(accountId);
    }
  }, [accountId]); // Solo depende del accountId

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance
  };
};

export const useAccountMovements = (accountId?: string) => {
  const [movements, setMovements] = useState<Array<{
    id: string;
    date: string;
    description: string;
    debit_amount: string;
    credit_amount: string;
    balance: string;
    transaction_id: string;
  }>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchMovements = useCallback(async (
    id: string, 
    filters?: {
      start_date?: string;
      end_date?: string;
      skip?: number;
      limit?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AccountService.getAccountMovements(id, filters);
      setMovements(data.movements);
      setTotalCount(data.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los movimientos de la cuenta';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);
  useEffect(() => {
    if (accountId) {
      fetchMovements(accountId);
    }
  }, [accountId]); // Solo depende del accountId

  return {
    movements,
    totalCount,
    loading,
    error,
    refetch: fetchMovements
  };
};
