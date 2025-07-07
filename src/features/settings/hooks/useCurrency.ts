/**
 * Custom hooks for currency management
 */
import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';
import type { 
  Currency, 
  ExchangeRate, 
  CurrencyCreate, 
  CurrencyUpdate,
  ExchangeRateCreate,
  ExchangeRateUpdate,
  CurrencyFilter,
  ExchangeRateFilter
} from '../services/currencyService';
import { useToast } from '@/shared/contexts/ToastContext';

// Hook for currency management
export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    pages: 0
  });
  const { showToast } = useToast();

  const fetchCurrencies = useCallback(async (
    filters?: CurrencyFilter,
    page = 1,
    pageSize = 10,
    includeInactive = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await currencyService.getCurrencies(filters, page, pageSize, includeInactive);
      
      setCurrencies(response.currencies || []);
      setPagination({
        page: response.page,
        pageSize: response.size,
        total: response.total,
        pages: response.pages
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar monedas';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createCurrency = useCallback(async (currencyData: CurrencyCreate): Promise<Currency | null> => {
    try {
      setLoading(true);
      const newCurrency = await currencyService.createCurrency(currencyData);
      showToast(`Moneda ${newCurrency.code} creada exitosamente`, 'success');
      await fetchCurrencies(); // Refresh list
      return newCurrency;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al crear moneda';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCurrencies, showToast]);

  const updateCurrency = useCallback(async (id: string, currencyData: CurrencyUpdate): Promise<Currency | null> => {
    try {
      setLoading(true);
      const updatedCurrency = await currencyService.updateCurrency(id, currencyData);
      showToast(`Moneda ${updatedCurrency.code} actualizada exitosamente`, 'success');
      await fetchCurrencies(); // Refresh list
      return updatedCurrency;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al actualizar moneda';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCurrencies, showToast]);

  const deleteCurrency = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await currencyService.deleteCurrency(id);
      showToast('Moneda eliminada exitosamente', 'success');
      await fetchCurrencies(); // Refresh list
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al eliminar moneda';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCurrencies, showToast]);

  return {
    currencies,
    loading,
    error,
    pagination,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    refresh: fetchCurrencies
  };
};

// Hook for exchange rates management
export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    pages: 0
  });
  const { showToast } = useToast();

  const fetchExchangeRates = useCallback(async (
    filters?: ExchangeRateFilter,
    page = 1,
    pageSize = 10
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await currencyService.getExchangeRates(filters, page, pageSize);
      
      setExchangeRates(response.exchange_rates || []);
      setPagination({
        page: response.page,
        pageSize: response.size,
        total: response.total,
        pages: response.pages
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar tipos de cambio';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createExchangeRate = useCallback(async (exchangeRateData: ExchangeRateCreate): Promise<ExchangeRate | null> => {
    try {
      setLoading(true);
      const newExchangeRate = await currencyService.createExchangeRate(exchangeRateData);
      showToast('Tipo de cambio creado exitosamente', 'success');
      await fetchExchangeRates(); // Refresh list
      return newExchangeRate;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al crear tipo de cambio';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchExchangeRates, showToast]);

  const updateExchangeRate = useCallback(async (id: string, exchangeRateData: ExchangeRateUpdate): Promise<ExchangeRate | null> => {
    try {
      setLoading(true);
      const updatedExchangeRate = await currencyService.updateExchangeRate(id, exchangeRateData);
      showToast('Tipo de cambio actualizado exitosamente', 'success');
      await fetchExchangeRates(); // Refresh list
      return updatedExchangeRate;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al actualizar tipo de cambio';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchExchangeRates, showToast]);

  const deleteExchangeRate = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await currencyService.deleteExchangeRate(id);
      showToast('Tipo de cambio eliminado exitosamente', 'success');
      await fetchExchangeRates(); // Refresh list
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al eliminar tipo de cambio';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchExchangeRates, showToast]);

  return {
    exchangeRates,
    loading,
    error,
    pagination,
    fetchExchangeRates,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
    refresh: fetchExchangeRates
  };
};

// Hook for base currency management
export const useBaseCurrency = () => {
  const [baseCurrency, setBaseCurrencyState] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchBaseCurrency = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currency = await currencyService.getBaseCurrency();
      setBaseCurrencyState(currency);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar moneda base';
      setError(errorMessage);
      console.error('Error fetching base currency:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBaseCurrency = useCallback(async (currencyCode: string): Promise<boolean> => {
    try {
      setLoading(true);
      const currency = await currencyService.setBaseCurrency(currencyCode);
      setBaseCurrencyState(currency);
      showToast(`Moneda base establecida: ${currency.code}`, 'success');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al establecer moneda base';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBaseCurrency();
  }, [fetchBaseCurrency]);

  return {
    baseCurrency,
    loading,
    error,
    fetchBaseCurrency,
    setBaseCurrency: updateBaseCurrency
  };
};

// Hook for available currencies (active only)
export const useAvailableCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const availableCurrencies = await currencyService.getAvailableCurrencies();
      setCurrencies(availableCurrencies);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar monedas disponibles';
      setError(errorMessage);
      console.error('Error fetching available currencies:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableCurrencies();
  }, [fetchAvailableCurrencies]);

  return {
    currencies,
    loading,
    error,
    refresh: fetchAvailableCurrencies
  };
};
