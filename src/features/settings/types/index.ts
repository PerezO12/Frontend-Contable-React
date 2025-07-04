/**
 * Types for Company Settings feature
 */

export interface Account {
  id: string;
  code: string;
  name: string;
  description?: string;
  account_type: string;
  account_category: string;
  is_active: boolean;
}

export interface CompanySettings {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  tax_id?: string;
  currency_code: string;
  
  // Default accounts for partners
  default_customer_receivable_account_id?: string;
  default_supplier_payable_account_id?: string;
  
  // Banking and payments
  bank_suspense_account_id?: string;
  internal_transfer_account_id?: string;
  
  // Deferred expenses
  deferred_expense_account_id?: string;
  deferred_expense_journal_id?: string;
  deferred_expense_months?: number;
  
  // Deferred revenues
  deferred_revenue_account_id?: string;
  deferred_revenue_journal_id?: string;
  deferred_revenue_months?: number;
  
  // Early payment discounts
  early_payment_discount_gain_account_id?: string;
  early_payment_discount_loss_account_id?: string;
  
  // Invoice line discounts
  invoice_line_discount_same_account: boolean;
  
  // Additional configuration
  validate_invoice_on_posting: boolean;
  deferred_generation_method: string;
  is_active: boolean;
  notes?: string;
  
  // Account relationships
  default_customer_receivable_account?: Account;
  default_supplier_payable_account?: Account;
  bank_suspense_account?: Account;
  internal_transfer_account?: Account;
  deferred_expense_account?: Account;
  deferred_revenue_account?: Account;
  early_payment_discount_gain_account?: Account;
  early_payment_discount_loss_account?: Account;
}

export interface CompanySettingsCreate {
  company_name: string;
  tax_id?: string;
  currency_code: string;
  default_customer_receivable_account_id?: string;
  default_supplier_payable_account_id?: string;
  bank_suspense_account_id?: string;
  internal_transfer_account_id?: string;
  deferred_expense_account_id?: string;
  deferred_expense_journal_id?: string;
  deferred_expense_months?: number;
  deferred_revenue_account_id?: string;
  deferred_revenue_journal_id?: string;
  deferred_revenue_months?: number;
  early_payment_discount_gain_account_id?: string;
  early_payment_discount_loss_account_id?: string;
  invoice_line_discount_same_account?: boolean;
  validate_invoice_on_posting?: boolean;
  deferred_generation_method?: string;
  notes?: string;
}

export interface CompanySettingsUpdate extends Partial<CompanySettingsCreate> {}

export interface DefaultAccountsInfo {
  has_receivable_account: boolean;
  has_payable_account: boolean;
  has_bank_suspense_account: boolean;
  has_internal_transfer_account: boolean;
  has_deferred_expense_account: boolean;
  has_deferred_revenue_account: boolean;
  has_early_payment_accounts: boolean;
  missing_accounts: string[];
  recommendations: string[];
}

export interface ValidationResult {
  is_valid: boolean;
  issues: string[];
  recommendations: string[];
  settings?: CompanySettings;
}

export interface AccountSuggestion {
  id: string;
  code: string;
  name: string;
  account_type: string;
  account_category: string;
  score: number;
  reason: string;
}
