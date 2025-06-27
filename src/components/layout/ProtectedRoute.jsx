import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoadingPage } from './LoadingPage';
export var ProtectedRoute = function (_a) {
    var children = _a.children, allowedRoles = _a.allowedRoles, _b = _a.requireAuth, requireAuth = _b === void 0 ? true : _b;
    var _c = useAuth(), isAuthenticated = _c.isAuthenticated, user = _c.user, isLoading = _c.isLoading;
    var location = useLocation();
    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return <LoadingPage message="Verificando autenticación..."/>;
    }
    // Verificar autenticación
    if (requireAuth && !isAuthenticated) {
        return (<Navigate to="/login" state={{ from: location.pathname }} replace/>);
    }
    // Verificar roles permitidos
    if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>;
    }
    // Verificar cambio de contraseña forzado
    if (isAuthenticated && (user === null || user === void 0 ? void 0 : user.force_password_change) && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace/>;
    }
    return <>{children}</>;
};
