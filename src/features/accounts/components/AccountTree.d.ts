import React from 'react';
import { AccountType, type Account, type AccountTree as AccountTreeType } from '../types';
interface AccountTreeProps {
    onAccountSelect?: (account: AccountTreeType | Account) => void;
    onCreateChild?: (parent: AccountTreeType | Account) => void;
    selectedAccountType?: AccountType;
    activeOnly?: boolean;
}
export declare const AccountTree: React.FC<AccountTreeProps>;
export {};
