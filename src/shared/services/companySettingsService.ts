import { apiClient } from '@/shared/api/client';

// Types for Company Settings
export interface Account {
  id: string;
  code: string;
  name: string;
  account_type: string;
}

export interface CompanySettingsResponse {
  id: string;
  company_name?: string;
  default_receivable_account_id?: string;
  default_payable_account_id?: string;
  default_bank_suspense_account_id?: string;
  default_internal_transfer_account_id?: string;
  default_deferred_expense_account_id?: string;
  default_deferred_revenue_account_id?: string;
  default_discount_account_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  default_receivable_account?: Account;
  default_payable_account?: Account;
  default_bank_suspense_account?: Account;
  default_internal_transfer_account?: Account;
  default_deferred_expense_account?: Account;
  default_deferred_revenue_account?: Account;
  default_discount_account?: Account;
}

export interface CompanySettingsCreate {
  company_name?: string;
  default_receivable_account_id?: string;
  default_payable_account_id?: string;
  default_bank_suspense_account_id?: string;
  default_internal_transfer_account_id?: string;
  default_deferred_expense_account_id?: string;
  default_deferred_revenue_account_id?: string;
  default_discount_account_id?: string;
}

export interface CompanySettingsUpdate {
  company_name?: string;
  default_receivable_account_id?: string;
  default_payable_account_id?: string;
  default_bank_suspense_account_id?: string;
  default_internal_transfer_account_id?: string;
  default_deferred_expense_account_id?: string;
  default_deferred_revenue_account_id?: string;
  default_discount_account_id?: string;
}

export interface DefaultAccountsInfo {
  configured_accounts: Record<string, Account>;
  missing_accounts: string[];
  validation_errors: string[];
}

export interface AccountSuggestion {
  account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  score: number;
  reason: string;
}

export class CompanySettingsService {
  private static readonly BASE_PATH = '/api/v1/company-settings';

  /**
   * Get current company settings
   */
  static async getCompanySettings(): Promise<CompanySettingsResponse> {
    const response = await apiClient.get<CompanySettingsResponse>(this.BASE_PATH + '/');
    return response.data;
  }

  /**
   * Create company settings
   */
  static async createCompanySettings(data: CompanySettingsCreate): Promise<CompanySettingsResponse> {
    const response = await apiClient.post<CompanySettingsResponse>(this.BASE_PATH + '/', data);
    return response.data;
  }

  /**
   * Update company settings
   */
  static async updateCompanySettings(data: CompanySettingsUpdate): Promise<CompanySettingsResponse> {
    const response = await apiClient.put<CompanySettingsResponse>(this.BASE_PATH + '/', data);
    return response.data;
  }

  /**
   * Get default accounts information
   */
  static async getDefaultAccountsInfo(): Promise<DefaultAccountsInfo> {
    const response = await apiClient.get<DefaultAccountsInfo>(this.BASE_PATH + '/default-accounts');
    return response.data;
  }

  /**
   * Validate company settings configuration
   */
  static async validateConfiguration(): Promise<{ is_valid: boolean; errors: string[] }> {
    const response = await apiClient.get<{ is_valid: boolean; errors: string[] }>(this.BASE_PATH + '/validate');
    return response.data;
  }

  /**
   * Get account suggestions for a specific account type
   */
  static async getAccountSuggestions(accountType: string): Promise<AccountSuggestion[]> {
    const response = await apiClient.get<AccountSuggestion[]>(
      this.BASE_PATH + `/account-suggestions?account_type=${encodeURIComponent(accountType)}`
    );
    return response.data;
  }
}
