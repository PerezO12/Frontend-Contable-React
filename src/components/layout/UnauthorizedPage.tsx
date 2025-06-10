import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="text-center">
            {/* Icono de acceso denegado */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Acceso Denegado
            </h1>
            
            <p className="mt-2 text-sm text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>

            {user && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">
                  Usuario actual: <span className="font-medium">{user.full_name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Rol: <span className="font-medium">{user.role}</span>
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleGoHome}
                variant="primary"
                className="w-full"
              >
                Ir al Dashboard
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="secondary"
                className="w-full"
              >
                Volver Atrás
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700"
              >
                Cerrar Sesión
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
