import type { Account } from '../types';
interface AccountListEnhancedProps {
    onAccountSelect?: (account: Account) => void;
}
export declare function AccountListEnhanced({ onAccountSelect }: AccountListEnhancedProps): import("react").JSX.Element;
export {};
