import React from 'react';
import type { AccountCreateForm } from '../types';
import type { Account } from '../types';
interface AccountFormProps {
    onSuccess?: (account: Account) => void;
    onCancel?: () => void;
    parentAccount?: Account;
    initialData?: Partial<AccountCreateForm>;
    isEditMode?: boolean;
    accountId?: string;
}
export declare const AccountForm: React.FC<AccountFormProps>;
export {};
