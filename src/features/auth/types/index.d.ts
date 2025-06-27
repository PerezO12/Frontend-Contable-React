export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    is_active: boolean;
    last_login?: string;
    force_password_change: boolean;
    created_at: string;
}
export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly CONTADOR: "CONTADOR";
    readonly SOLO_LECTURA: "SOLO_LECTURA";
};
export type UserRole = typeof UserRole[keyof typeof UserRole];
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}
export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    clearError: () => void;
}
export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
export interface ApiError {
    detail: string;
    code?: string;
    field?: string;
}
export interface ApiResponse<T = any> {
    data?: T;
    error?: ApiError;
    success: boolean;
}
export interface UserSession {
    id: string;
    device_info: string;
    ip_address: string;
    created_at: string;
    last_activity: string;
    is_current: boolean;
}
