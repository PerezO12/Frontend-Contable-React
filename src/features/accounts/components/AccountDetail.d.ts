import React from 'react';
import { type Account } from '../types';
interface AccountDetailProps {
    accountId: string;
    onEdit?: (account: Account) => void;
    onCreateChild?: (account: Account) => void;
    onClose?: () => void;
}
export declare const AccountDetail: React.FC<AccountDetailProps>;
export {};
