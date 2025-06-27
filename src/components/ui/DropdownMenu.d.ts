/**
 * Dropdown menu component for bulk actions
 */
import React from 'react';
interface DropdownMenuProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
}
export declare function DropdownMenu({ trigger, children, align }: DropdownMenuProps): React.JSX.Element;
interface DropdownItemProps {
    onClick: () => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
    variant?: 'default' | 'danger';
    disabled?: boolean;
    onClose?: () => void;
}
export declare function DropdownItem({ onClick, icon, children, variant, disabled, onClose }: DropdownItemProps): React.JSX.Element;
export {};
