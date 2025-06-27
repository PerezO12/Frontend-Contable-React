export var API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        LOGIN_FORM: '/api/v1/auth/login/form',
        LOGOUT: '/api/v1/auth/logout',
        REFRESH: '/api/v1/auth/refresh',
        CHANGE_PASSWORD: '/api/v1/users/change-password', // Corregido: está en users, no en auth
    },
    USERS: {
        ME: '/api/v1/users/me',
        UPDATE_PROFILE: '/api/v1/users/me',
        CHANGE_PASSWORD: '/api/v1/users/change-password', // Corregido
        SESSIONS: '/api/v1/users/me/sessions', // NO EXISTE EN BACKEND
    },
};
export var APP_CONFIG = {
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema Contable',
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
};
export var STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRY: 'token_expiry',
    USER_PREFERENCES: 'user_preferences',
};
export var ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    UNAUTHORIZED: '/unauthorized',
    CHANGE_PASSWORD: '/change-password',
    PROFILE: '/profile',
};
export var VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL_CHAR: true,
    },
    EMAIL: {
        MAX_LENGTH: 254,
    },
};
