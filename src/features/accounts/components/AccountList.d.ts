import React from 'react';
import { type Account, type AccountFilters } from '../types';
interface AccountListProps {
    onAccountSelect?: (account: Account) => void;
    onCreateAccount?: () => void;
    initialFilters?: AccountFilters;
    showActions?: boolean;
}
export declare const AccountList: React.FC<AccountListProps>;
export {};
