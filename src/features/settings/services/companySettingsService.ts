/**
 * API Service for Company Settings
 */
import { apiClient } from '../../../shared/api/client';
import type { 
  CompanySettings, 
  CompanySettingsCreate, 
  CompanySettingsUpdate,
  DefaultAccountsInfo,
  ValidationResult,
  AccountSuggestion,
  TaxAccountsResponse,
  TaxAccountsUpdate,
  TaxAccountSuggestion
} from '../types';

export class CompanySettingsService {
  private static readonly BASE_URL = '/api/v1/company-settings';

  /**
   * Get current company settings
   */
  static async getCompanySettings(): Promise<CompanySettings | null> {
    try {
      const response = await apiClient.get<CompanySettings>(this.BASE_URL);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create new company settings
   */
  static async createCompanySettings(data: CompanySettingsCreate): Promise<CompanySettings> {
    console.log('CompanySettingsService.createCompanySettings called with:', data);
    console.log('Data being sent to API:', JSON.stringify(data, null, 2));
    
    const response = await apiClient.post<CompanySettings>(this.BASE_URL, data);
    
    console.log('API Response:', response.data);
    return response.data;
  }

  /**
   * Update existing company settings
   */
  static async updateCompanySettings(data: CompanySettingsUpdate): Promise<CompanySettings> {
    console.log('CompanySettingsService.updateCompanySettings called with:', data);
    console.log('Data being sent to API:', JSON.stringify(data, null, 2));
    
    const response = await apiClient.put<CompanySettings>(this.BASE_URL, data);
    
    console.log('API Response:', response.data);
    return response.data;
  }

  /**
   * Get default accounts information
   */
  static async getDefaultAccountsInfo(): Promise<DefaultAccountsInfo> {
    const response = await apiClient.get<DefaultAccountsInfo>(`${this.BASE_URL}/default-accounts`);
    return response.data;
  }

  /**
   * Validate company settings
   */
  static async validateSettings(): Promise<ValidationResult> {
    const response = await apiClient.get<ValidationResult>(`${this.BASE_URL}/validate`);
    return response.data;
  }

  /**
   * Get account suggestions for configuration
   */
  static async getAccountSuggestions(accountType?: string): Promise<AccountSuggestion[]> {
    const params = accountType ? { account_type: accountType } : {};
    const response = await apiClient.get<AccountSuggestion[]>(`${this.BASE_URL}/account-suggestions`, { params });
    return response.data;
  }

  /**
   * Initialize default company settings
   */
  static async initializeSettings(): Promise<{ message: string; settings_id: string }> {
    const response = await apiClient.post<{ message: string; settings_id: string }>(`${this.BASE_URL}/initialize`);
    return response.data;
  }

  /**
   * Get tax accounts configuration
   */
  static async getTaxAccountsConfiguration(): Promise<TaxAccountsResponse> {
    const response = await apiClient.get<TaxAccountsResponse>(`${this.BASE_URL}/tax-accounts`);
    return response.data;
  }

  /**
   * Update tax accounts configuration
   */
  static async updateTaxAccountsConfiguration(data: TaxAccountsUpdate): Promise<TaxAccountsResponse> {
    console.log('CompanySettingsService.updateTaxAccountsConfiguration called with:', data);
    console.log('Data being sent to API:', JSON.stringify(data, null, 2));
    
    const response = await apiClient.put<TaxAccountsResponse>(`${this.BASE_URL}/tax-accounts`, data);
    
    console.log('API Response:', response.data);
    return response.data;
  }

  /**
   * Get tax account suggestions
   */
  static async getTaxAccountSuggestions(accountType?: string): Promise<TaxAccountSuggestion[]> {
    const params = accountType ? { account_type: accountType } : {};
    const response = await apiClient.get<TaxAccountSuggestion[]>(`${this.BASE_URL}/tax-accounts/suggestions`, { params });
    return response.data;
  }

  /**
   * Auto-configure tax accounts
   */
  static async autoConfigureTaxAccounts(): Promise<{ success: boolean; message: string; configured_accounts: Record<string, string> }> {
    const response = await apiClient.post<{ success: boolean; message: string; configured_accounts: Record<string, string> }>(`${this.BASE_URL}/tax-accounts/auto-configure`);
    return response.data;
  }
}
