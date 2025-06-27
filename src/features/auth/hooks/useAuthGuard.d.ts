import { UserRole } from '../types';
interface UseAuthGuardOptions {
    requireAuth?: boolean;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}
export declare const useAuthGuard: ({ requireAuth, allowedRoles, redirectTo }?: UseAuthGuardOptions) => {
    isAuthorized: boolean;
    user: import("..").User;
    isLoading: boolean;
    hasRequiredRole: boolean;
};
export {};
