/**
 * Accounts API Service for Settings Feature
 * Service to fetch accounts for the AccountSelector component
 */
import { apiClient } from '../../../shared/api/client';

export interface Account {
  id: string;
  code: string;
  name: string;
  account_type: string;
  parent_id?: string;
  is_active: boolean;
}

export class AccountsSettingsService {
  private static readonly BASE_URL = '/api/v1/accounts';

  /**
   * Get all accounts with optional filtering
   */
  static async getAccounts(params?: {
    account_type?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<Account[]> {
    try {
      const response = await apiClient.get<Account[]>(this.BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  /**
   * Get accounts by type (for specific account type filtering)
   */
  static async getAccountsByType(accountType: string, activeOnly: boolean = true): Promise<{
    account_type: string;
    accounts: Account[];
    total_count: number;
  }> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/type/${accountType}`, {
        params: { active_only: activeOnly }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching accounts by type ${accountType}:`, error);
      throw error;
    }
  }

  /**
   * Get accounts suitable for receivables (customer accounts)
   * These are typically ACTIVO accounts
   */
  static async getReceivableAccounts(): Promise<Account[]> {
    try {
      const result = await this.getAccountsByType('ACTIVO', true);
      return result.accounts;
    } catch (error) {
      console.error('Error fetching receivable accounts:', error);
      // Fallback to general search
      return this.getAccounts({ is_active: true });
    }
  }

  /**
   * Get accounts suitable for payables (supplier accounts)
   * These are typically PASIVO accounts
   */
  static async getPayableAccounts(): Promise<Account[]> {
    try {
      const result = await this.getAccountsByType('PASIVO', true);
      return result.accounts;
    } catch (error) {
      console.error('Error fetching payable accounts:', error);
      // Fallback to general search
      return this.getAccounts({ is_active: true });
    }
  }

  /**
   * Search accounts by code or name
   */
  static async searchAccounts(searchTerm: string): Promise<Account[]> {
    try {
      const response = await apiClient.get<Account[]>(this.BASE_URL, {
        params: { search: searchTerm, is_active: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching accounts:', error);
      throw error;
    }
  }
}
