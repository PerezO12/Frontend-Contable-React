import type { AuthTokens } from '../types';
export declare class TokenManager {
    private static readonly ACCESS_TOKEN_KEY;
    private static readonly REFRESH_TOKEN_KEY;
    private static readonly TOKEN_EXPIRY_KEY;
    static setTokens(tokens: AuthTokens): void;
    static getTokens(): AuthTokens | null;
    static getAccessToken(): string | null;
    static getRefreshToken(): string | null;
    static clearTokens(): void;
    static isTokenExpired(token: string): boolean;
    static shouldRefreshToken(): boolean;
    static getTokenExpirationTime(): Date | null;
}
