import type { LoginCredentials, AuthTokens, User, ChangePasswordData } from '../types';
export declare class AuthService {
    private static readonly BASE_URL;
    private static readonly USERS_URL;
    static login(credentials: LoginCredentials): Promise<AuthTokens>;
    static loginForm(credentials: LoginCredentials): Promise<AuthTokens>;
    static refreshToken(refresh_token: string): Promise<AuthTokens>;
    static logout(): Promise<void>;
    static getCurrentUser(): Promise<User>;
    static updateProfile(userData: Partial<User>): Promise<User>;
    static changePassword(passwordData: ChangePasswordData): Promise<void>;
    static getUserSessions(): Promise<any[]>;
    static terminateSession(sessionId: string): Promise<void>;
}
