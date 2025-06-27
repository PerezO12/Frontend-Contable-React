import { STORAGE_KEYS } from '@/shared/constants';
var TokenManager = /** @class */ (function () {
    function TokenManager() {
    }
    TokenManager.setTokens = function (tokens) {
        try {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access_token);
            localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
            var expiryTime = Date.now() + (tokens.expires_in * 1000);
            localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
        catch (error) {
            console.error('Error storing tokens:', error);
        }
    };
    TokenManager.getTokens = function () {
        try {
            var access_token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
            var refresh_token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
            var expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
            if (!access_token || !refresh_token || !expiry) {
                return null;
            }
            return {
                access_token: access_token,
                refresh_token: refresh_token,
                token_type: 'bearer',
                expires_in: Math.max(0, Math.floor((parseInt(expiry) - Date.now()) / 1000))
            };
        }
        catch (error) {
            console.error('Error retrieving tokens:', error);
            return null;
        }
    };
    TokenManager.getAccessToken = function () {
        try {
            return localStorage.getItem(this.ACCESS_TOKEN_KEY);
        }
        catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
    };
    TokenManager.getRefreshToken = function () {
        try {
            return localStorage.getItem(this.REFRESH_TOKEN_KEY);
        }
        catch (error) {
            console.error('Error retrieving refresh token:', error);
            return null;
        }
    };
    TokenManager.clearTokens = function () {
        try {
            localStorage.removeItem(this.ACCESS_TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
            localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
        }
        catch (error) {
            console.error('Error clearing tokens:', error);
        }
    };
    TokenManager.isTokenExpired = function (token) {
        try {
            var payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        }
        catch (error) {
            console.error('Error checking token expiry:', error);
            return true;
        }
    };
    TokenManager.shouldRefreshToken = function () {
        try {
            var expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
            if (!expiry)
                return false;
            // Renovar si expira en menos de 5 minutos
            var expiryTime = parseInt(expiry);
            var fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
            return expiryTime <= fiveMinutesFromNow;
        }
        catch (error) {
            console.error('Error checking if token should refresh:', error);
            return false;
        }
    };
    TokenManager.getTokenExpirationTime = function () {
        try {
            var expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
            return expiry ? new Date(parseInt(expiry)) : null;
        }
        catch (error) {
            console.error('Error getting token expiration time:', error);
            return null;
        }
    };
    TokenManager.ACCESS_TOKEN_KEY = STORAGE_KEYS.ACCESS_TOKEN;
    TokenManager.REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN;
    TokenManager.TOKEN_EXPIRY_KEY = STORAGE_KEYS.TOKEN_EXPIRY;
    return TokenManager;
}());
export { TokenManager };
