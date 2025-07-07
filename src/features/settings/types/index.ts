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
  
  // Default accounts for sales and purchases
  default_sales_income_account_id?: string;
  default_purchase_expense_account_id?: string;
  
  // Tax accounts
  default_sales_tax_payable_account_id?: string;
  default_purchase_tax_deductible_account_id?: string;
  default_tax_account_id?: string;
  
  // Basic treasury accounts
  default_cash_account_id?: string;
  default_bank_account_id?: string;
  
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
  
  // Brazilian tax accounts (IDs)
  default_icms_payable_account_id?: string;
  default_icms_deductible_account_id?: string;
  default_pis_payable_account_id?: string;
  default_pis_deductible_account_id?: string;
  default_cofins_payable_account_id?: string;
  default_cofins_deductible_account_id?: string;
  default_ipi_payable_account_id?: string;
  default_ipi_deductible_account_id?: string;
  default_iss_payable_account_id?: string;
  default_csll_payable_account_id?: string;
  default_irpj_payable_account_id?: string;
  
  // Account relationships with names
  default_customer_receivable_account_name?: string;
  default_supplier_payable_account_name?: string;
  default_sales_income_account_name?: string;
  default_purchase_expense_account_name?: string;
  default_sales_tax_payable_account_name?: string;
  default_purchase_tax_deductible_account_name?: string;
  default_tax_account_name?: string;
  
  // Brazilian tax accounts names
  default_icms_payable_account_name?: string;
  default_icms_deductible_account_name?: string;
  default_pis_payable_account_name?: string;
  default_pis_deductible_account_name?: string;
  default_cofins_payable_account_name?: string;
  default_cofins_deductible_account_name?: string;
  default_ipi_payable_account_name?: string;
  default_ipi_deductible_account_name?: string;
  default_iss_payable_account_name?: string;
  default_csll_payable_account_name?: string;
  default_irpj_payable_account_name?: string;
  
  // Other account names
  bank_suspense_account_name?: string;
  internal_transfer_account_name?: string;
  deferred_expense_account_name?: string;
  deferred_revenue_account_name?: string;
  early_payment_discount_gain_account_name?: string;
  early_payment_discount_loss_account_name?: string;
  
  // Configuration flags
  has_customer_receivable_configured: boolean;
  has_supplier_payable_configured: boolean;
  has_deferred_accounts_configured: boolean;
  has_tax_accounts_configured: boolean;
  has_brazilian_tax_accounts_configured: boolean;
  
  // Account relationships (full objects)
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
  
  // Default accounts for partners
  default_customer_receivable_account_id?: string;
  default_supplier_payable_account_id?: string;
  
  // Default accounts for sales and purchases
  default_sales_income_account_id?: string;
  default_purchase_expense_account_id?: string;
  
  // Tax accounts
  default_sales_tax_payable_account_id?: string;
  default_purchase_tax_deductible_account_id?: string;
  default_tax_account_id?: string;
  
  // Basic treasury accounts
  default_cash_account_id?: string;
  default_bank_account_id?: string;
  
  // Banking and payments
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
  is_active?: boolean;
  notes?: string;
}

export interface CompanySettingsUpdate extends Partial<CompanySettingsCreate> {}

export interface DefaultAccountsInfo {
  // Información de cuentas disponibles
  available_receivable_accounts: Account[];
  available_payable_accounts: Account[];
  available_bank_accounts: Account[];
  available_expense_accounts: Account[];
  available_revenue_accounts: Account[];
  
  // Configuración actual
  current_settings?: CompanySettings;
  
  // Información de estado
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

export interface TaxAccountsResponse {
  default_sales_tax_payable_account_id?: string;
  default_sales_tax_payable_account_name?: string;
  default_purchase_tax_deductible_account_id?: string;
  default_purchase_tax_deductible_account_name?: string;
  default_tax_account_id?: string;
  default_tax_account_name?: string;
  
  // Brazilian tax accounts
  default_icms_payable_account_id?: string;
  default_icms_payable_account_name?: string;
  default_icms_deductible_account_id?: string;
  default_icms_deductible_account_name?: string;
  default_pis_payable_account_id?: string;
  default_pis_payable_account_name?: string;
  default_pis_deductible_account_id?: string;
  default_pis_deductible_account_name?: string;
  default_cofins_payable_account_id?: string;
  default_cofins_payable_account_name?: string;
  default_cofins_deductible_account_id?: string;
  default_cofins_deductible_account_name?: string;
  default_ipi_payable_account_id?: string;
  default_ipi_payable_account_name?: string;
  default_ipi_deductible_account_id?: string;
  default_ipi_deductible_account_name?: string;
  default_iss_payable_account_id?: string;
  default_iss_payable_account_name?: string;
  default_csll_payable_account_id?: string;
  default_csll_payable_account_name?: string;
  default_irpj_payable_account_id?: string;
  default_irpj_payable_account_name?: string;
  
  is_configured: boolean;
}

export interface TaxAccountsUpdate {
  default_sales_tax_payable_account_id?: string;
  default_purchase_tax_deductible_account_id?: string;
  default_tax_account_id?: string;
  
  // Brazilian tax accounts
  default_icms_payable_account_id?: string;
  default_icms_deductible_account_id?: string;
  default_pis_payable_account_id?: string;
  default_pis_deductible_account_id?: string;
  default_cofins_payable_account_id?: string;
  default_cofins_deductible_account_id?: string;
  default_ipi_payable_account_id?: string;
  default_ipi_deductible_account_id?: string;
  default_iss_payable_account_id?: string;
  default_csll_payable_account_id?: string;
  default_irpj_payable_account_id?: string;
}

export interface TaxAccountSuggestion {
  id: string;
  code: string;
  name: string;
  description: string;
  account_type: string;
}
