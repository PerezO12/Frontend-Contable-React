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
  AccountSuggestion
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
    const response = await apiClient.post<CompanySettings>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Update existing company settings
   */
  static async updateCompanySettings(data: CompanySettingsUpdate): Promise<CompanySettings> {
    const response = await apiClient.put<CompanySettings>(this.BASE_URL, data);
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
}
