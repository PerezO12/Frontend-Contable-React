import React from 'react';
interface AlertProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    className?: string;
}
export declare const Alert: React.FC<AlertProps>;
export {};
