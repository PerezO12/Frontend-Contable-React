import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const useAuthGuard = ({
  requireAuth = true,
  allowedRoles,
  redirectTo = '/login'
}: UseAuthGuardOptions = {}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

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
    if (isAuthenticated && user?.force_password_change && location.pathname !== '/change-password') {
      navigate('/change-password', { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location, requireAuth, allowedRoles, redirectTo]);

  return {
    isAuthorized: isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role))),
    user,
    isLoading,
    hasRequiredRole: !allowedRoles || (user && allowedRoles.includes(user.role))
  };
};
