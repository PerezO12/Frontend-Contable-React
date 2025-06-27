import React from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types';
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
