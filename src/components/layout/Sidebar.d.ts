import React from 'react';
interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
    onToggle?: () => void;
    isCollapsed?: boolean;
}
export declare const Sidebar: React.FC<SidebarProps>;
export {};
