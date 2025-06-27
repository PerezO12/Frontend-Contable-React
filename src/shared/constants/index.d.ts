export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/api/v1/auth/login";
        readonly LOGIN_FORM: "/api/v1/auth/login/form";
        readonly LOGOUT: "/api/v1/auth/logout";
        readonly REFRESH: "/api/v1/auth/refresh";
        readonly CHANGE_PASSWORD: "/api/v1/users/change-password";
    };
    readonly USERS: {
        readonly ME: "/api/v1/users/me";
        readonly UPDATE_PROFILE: "/api/v1/users/me";
        readonly CHANGE_PASSWORD: "/api/v1/users/change-password";
        readonly SESSIONS: "/api/v1/users/me/sessions";
    };
};
export declare const APP_CONFIG: {
    readonly APP_NAME: any;
    readonly API_URL: any;
    readonly APP_ENV: any;
};
export declare const STORAGE_KEYS: {
    readonly ACCESS_TOKEN: "access_token";
    readonly REFRESH_TOKEN: "refresh_token";
    readonly TOKEN_EXPIRY: "token_expiry";
    readonly USER_PREFERENCES: "user_preferences";
};
export declare const ROUTES: {
    readonly LOGIN: "/login";
    readonly DASHBOARD: "/dashboard";
    readonly UNAUTHORIZED: "/unauthorized";
    readonly CHANGE_PASSWORD: "/change-password";
    readonly PROFILE: "/profile";
};
export declare const VALIDATION_RULES: {
    readonly PASSWORD: {
        readonly MIN_LENGTH: 8;
        readonly REQUIRE_UPPERCASE: true;
        readonly REQUIRE_LOWERCASE: true;
        readonly REQUIRE_NUMBER: true;
        readonly REQUIRE_SPECIAL_CHAR: true;
    };
    readonly EMAIL: {
        readonly MAX_LENGTH: 254;
    };
};
