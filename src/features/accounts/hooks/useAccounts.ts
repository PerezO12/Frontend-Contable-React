import { useState, useEffect, useCallback } from 'react';
import { AccountService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type { 
  Account, 
  AccountTree, 
  AccountCreate, 
  AccountUpdate, 
  AccountFilters,
  AccountType
} from '../types';

export const useAccounts = (initialFilters?: AccountFilters) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentFilters, setCurrentFilters] = useState<AccountFilters | undefined>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchAccounts = useCallback(async (filters?: AccountFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = filters || currentFilters;
      const data = await AccountService.getAccounts(filtersToUse);
      setAccounts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las cuentas';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, showError]);

  const refetchWithFilters = useCallback(async (newFilters: AccountFilters) => {
    setCurrentFilters(newFilters);
    await fetchAccounts(newFilters);
  }, [fetchAccounts]);

  const refetch = useCallback(async () => {
    await fetchAccounts(currentFilters);
  }, [fetchAccounts, currentFilters]);

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
  useEffect(() => {
    // Ejecutar solo una vez al montar con los filtros iniciales
    if (initialFilters) {
      fetchAccounts(initialFilters);
    } else {
      fetchAccounts();
    }
  }, []); // Array vacío para ejecutar solo una vez// Método para obtener cuentas potenciales padre por tipo
  const getParentAccountsByType = useCallback(async (accountType: AccountType): Promise<Account[]> => {
    try {
      // Filtramos por tipo de cuenta y solo cuentas activas
      const filters: AccountFilters = {
        account_type: accountType,
        is_active: true
      };
      const possibleParents = await AccountService.getAccounts(filters);
      console.log('Posibles cuentas padre encontradas:', possibleParents);
      return possibleParents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las cuentas padre potenciales';
      showError(errorMessage);
      return [];
    }
  }, [showError]);
  return {
    accounts,
    loading,
    error,
    refetch,
    refetchWithFilters,
    createAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    getParentAccountsByType
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
