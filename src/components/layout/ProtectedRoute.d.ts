import React from 'react';
import { UserRole } from '@/features/auth/types';
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}
export declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export {};
