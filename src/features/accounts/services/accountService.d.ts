import type { Account, AccountTree, AccountCreate, AccountUpdate, AccountFilters, AccountListResponse, BulkAccountDelete, AccountDeleteValidation, BulkAccountDeleteResult } from '../types';
export declare class AccountService {
    private static readonly BASE_URL;
    /**
     * Crear una nueva cuenta contable
     */
    static createAccount(accountData: AccountCreate): Promise<Account>;
    /**
     * Obtener lista de cuentas con filtros y paginación
     */
    static getAccounts(filters?: AccountFilters): Promise<AccountListResponse | Account[]>;
    /**
     * Obtener una cuenta por ID
     */
    static getAccountById(id: string): Promise<Account>;
    /**
     * Obtener una cuenta por código
     */
    static getAccountByCode(code: string): Promise<Account>;
    /**
     * Actualizar una cuenta existente
     */ static updateAccount(id: string, updateData: AccountUpdate): Promise<Account>;
    /**
     * Eliminar una cuenta permanentemente
     */
    static deleteAccount(id: string): Promise<void>;
    /**
     * Obtener la estructura jerárquica de cuentas como árbol
     */
    static getAccountTree(accountType?: string, activeOnly?: boolean): Promise<AccountTree[]>;
    /**
     * Obtener cuentas hijas de una cuenta padre
     */
    static getChildAccounts(parentId: string): Promise<Account[]>;
    /**
     * Obtener el camino jerárquico de una cuenta
     */
    static getAccountPath(id: string): Promise<Account[]>;
    /**
     * Verificar si un código de cuenta está disponible
     */
    static checkCodeAvailability(code: string, excludeId?: string): Promise<boolean>;
    /**
     * Obtener estadísticas de cuentas por tipo
     */
    static getAccountStats(): Promise<Record<string, number>>;
    /**
     * Exportar plan de cuentas
     */
    static exportChartOfAccounts(format: 'excel' | 'csv' | 'pdf'): Promise<Blob>;
    /**
     * Importar plan de cuentas desde archivo
     */
    static importChartOfAccounts(file: File): Promise<{
        success: number;
        errors: string[];
    }>;
    /**
     * Activar o desactivar una cuenta
     */
    static toggleAccountStatus(id: string, isActive: boolean): Promise<Account>;
    /**
     * Obtener saldo actual de una cuenta
     */
    static getAccountBalance(id: string, asOfDate?: string): Promise<{
        balance: string;
        debit_balance: string;
        credit_balance: string;
        as_of_date: string;
    }>;
    /**
     * Obtener movimientos de una cuenta
     */
    static getAccountMovements(id: string, filters?: {
        start_date?: string;
        end_date?: string;
        skip?: number;
        limit?: number;
    }): Promise<{
        movements: Array<{
            id: string;
            date: string;
            description: string;
            debit_amount: string;
            credit_amount: string;
            balance: string;
            transaction_id: string;
        }>;
        total_count: number;
    }>;
    /**
     * Validar si múltiples cuentas pueden ser eliminadas
     */
    static validateDeletion(accountIds: string[]): Promise<AccountDeleteValidation[]>;
    /**
     * Eliminar múltiples cuentas con validaciones
     */
    static bulkDeleteAccounts(deleteData: BulkAccountDelete): Promise<BulkAccountDeleteResult>;
    /**
     * Exportar cuentas seleccionadas usando el sistema de exportación genérico
     */
    static exportAccounts(accountIds: string[], format: 'csv' | 'json' | 'xlsx'): Promise<Blob>;
    /**
     * Exportar cuentas con filtros avanzados - MÉTODO OBSOLETO
     * Use getAccounts() para obtener IDs y luego exportAccounts()
     */
    static exportAccountsAdvanced(_format: 'csv' | 'json' | 'xlsx', _filters?: {
        account_type?: string;
        category?: string;
        is_active?: boolean;
        parent_id?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    }, _selectedColumns?: string[]): Promise<Blob>;
    /**
     * Obtener información de esquema para exportación
     */
    static getExportSchema(): Promise<{
        table_name: string;
        display_name: string;
        columns: Array<{
            name: string;
            data_type: string;
            nullable: boolean;
            description?: string;
        }>;
        total_records: number;
    }>;
}
