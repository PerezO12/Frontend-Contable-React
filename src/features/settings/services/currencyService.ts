/**
 * Currency Service - API calls for currency and exchange rate management
 */
import { apiClient } from '@/shared/api/client';

// Types for Currency
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_active: boolean;
  country_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyCreate {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_active?: boolean;
  country_code?: string;
  notes?: string;
}

export interface CurrencyUpdate {
  name?: string;
  symbol?: string;
  decimal_places?: number;
  is_active?: boolean;
  country_code?: string;
  notes?: string;
}

export interface CurrencyFilter {
  code?: string;
  name?: string;
  is_active?: boolean;
  country_code?: string;
}

// Types for Exchange Rate
export interface ExchangeRate {
  id: string;
  currency_id: string;
  rate: number;
  rate_date: string;
  source?: string;
  provider?: string;
  is_manual: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  currency: Currency;
}

export interface ExchangeRateCreate {
  currency_id: string;
  rate: number;
  rate_date: string;
  source?: string;
  provider?: string;
  is_manual?: boolean;
  notes?: string;
}

export interface ExchangeRateUpdate {
  rate?: number;
  rate_date?: string;
  source?: string;
  provider?: string;
  is_manual?: boolean;
  notes?: string;
}

export interface ExchangeRateFilter {
  currency_code?: string;
  date_from?: string;
  date_to?: string;
  source?: string;
  provider?: string;
}

// Types for Currency Conversion
export interface CurrencyConversionRequest {
  amount: number;
  from_currency_code: string;
  to_currency_code: string;
  conversion_date?: string;
}

export interface CurrencyConversionResponse {
  original_amount: number;
  converted_amount: number;
  from_currency_code: string;
  to_currency_code: string;
  exchange_rate: number;
  conversion_date: string;
  rate_source: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  currencies?: T[];
  exchange_rates?: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export class CurrencyService {
  private baseUrl = '/api/v1/currencies';

  // Currency management methods
  async getCurrencies(
    filters?: CurrencyFilter,
    page = 1,
    pageSize = 10,
    includeInactive = false
  ): Promise<PaginatedResponse<Currency>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      include_inactive: includeInactive.toString(),
    });

    if (filters?.code) params.append('code', filters.code);
    if (filters?.name) params.append('name', filters.name);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.country_code) params.append('country_code', filters.country_code);

    const response = await apiClient.get(`${this.baseUrl}?${params}`);
    return response.data;
  }

  async getCurrency(id: string): Promise<Currency> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getCurrencyByCode(code: string): Promise<Currency> {
    const response = await apiClient.get(`${this.baseUrl}/code/${code}`);
    return response.data;
  }

  async createCurrency(currency: CurrencyCreate): Promise<Currency> {
    const response = await apiClient.post(this.baseUrl, currency);
    return response.data;
  }

  async updateCurrency(id: string, currency: CurrencyUpdate): Promise<Currency> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, currency);
    return response.data;
  }

  async deleteCurrency(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getBaseCurrency(): Promise<Currency | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/base`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async setBaseCurrency(currencyCode: string): Promise<Currency> {
    const response = await apiClient.post(`${this.baseUrl}/base/${currencyCode}`);
    return response.data;
  }

  // Exchange rate management methods
  async getExchangeRates(
    filters?: ExchangeRateFilter,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<ExchangeRate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
    });

    if (filters?.currency_code) params.append('currency_code', filters.currency_code);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.source) params.append('source', filters.source);
    if (filters?.provider) params.append('provider', filters.provider);

    const response = await apiClient.get(`${this.baseUrl}/exchange-rates?${params}`);
    return response.data;
  }

  async getExchangeRate(id: string): Promise<ExchangeRate> {
    const response = await apiClient.get(`${this.baseUrl}/exchange-rates/${id}`);
    return response.data;
  }

  async getLatestExchangeRate(currencyCode: string, referenceDate?: string): Promise<ExchangeRate | null> {
    try {
      const params = new URLSearchParams();
      if (referenceDate) params.append('reference_date', referenceDate);

      const response = await apiClient.get(
        `${this.baseUrl}/exchange-rates/latest/${currencyCode}?${params}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createExchangeRate(exchangeRate: ExchangeRateCreate): Promise<ExchangeRate> {
    const response = await apiClient.post(`${this.baseUrl}/exchange-rates`, exchangeRate);
    return response.data;
  }

  async updateExchangeRate(id: string, exchangeRate: ExchangeRateUpdate): Promise<ExchangeRate> {
    const response = await apiClient.put(`${this.baseUrl}/exchange-rates/${id}`, exchangeRate);
    return response.data;
  }

  async deleteExchangeRate(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/exchange-rates/${id}`);
  }

  // Currency conversion methods
  async convertCurrency(request: CurrencyConversionRequest): Promise<CurrencyConversionResponse> {
    const response = await apiClient.post(`${this.baseUrl}/convert`, request);
    return response.data;
  }

  // Utility methods
  async getAvailableCurrencies(): Promise<Currency[]> {
    const response = await this.getCurrencies({ is_active: true }, 1, 100);
    return response.currencies || [];
  }

  async getCommonCurrencies(): Promise<Currency[]> {
    // Get most common currencies first
    const commonCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'BRL', 'MXN'];
    const allCurrencies = await this.getAvailableCurrencies();
    
    const common = allCurrencies.filter(c => commonCodes.includes(c.code));
    const others = allCurrencies.filter(c => !commonCodes.includes(c.code));
    
    return [...common, ...others];
  }
}

export const currencyService = new CurrencyService();
