import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export var useAuthGuard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.requireAuth, requireAuth = _c === void 0 ? true : _c, allowedRoles = _b.allowedRoles, _d = _b.redirectTo, redirectTo = _d === void 0 ? '/login' : _d;
    var _e = useAuth(), user = _e.user, isAuthenticated = _e.isAuthenticated, isLoading = _e.isLoading;
    var navigate = useNavigate();
    var location = useLocation();
    useEffect(function () {
        if (isLoading)
            return;
        // Verificar autenticación
        if (requireAuth && !isAuthenticated) {
            navigate(redirectTo, {
                state: { from: location.pathname },
                replace: true
            });
            return;
        }
        // Verificar roles
        if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
            navigate('/unauthorized', { replace: true });
            return;
        }
        // Verificar cambio de contraseña forzado
        if (isAuthenticated && (user === null || user === void 0 ? void 0 : user.force_password_change) && location.pathname !== '/change-password') {
            navigate('/change-password', { replace: true });
            return;
        }
    }, [isAuthenticated, user, isLoading, navigate, location, requireAuth, allowedRoles, redirectTo]);
    return {
        isAuthorized: isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role))),
        user: user,
        isLoading: isLoading,
        hasRequiredRole: !allowedRoles || (user && allowedRoles.includes(user.role))
    };
};
