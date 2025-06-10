import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/features/auth/types';
import { AccountsPage } from '@/features/accounts/pages';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/shared/utils';

type DashboardView = 'home' | 'accounts' | 'journal-entries' | 'profile';

export const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>('home');

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.CONTADOR]: 'Contador',
      [UserRole.SOLO_LECTURA]: 'Solo Lectura'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: UserRole): string => {
    const roleColors = {
      [UserRole.ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.CONTADOR]: 'bg-blue-100 text-blue-800',
      [UserRole.SOLO_LECTURA]: 'bg-gray-100 text-gray-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Sistema Contable</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoading}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'home'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
                {(user.role === UserRole.ADMIN || user.role === UserRole.CONTADOR) && (
                <button
                  onClick={() => setCurrentView('accounts')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentView === 'accounts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Plan de Cuentas
                </button>
              )}
              
              {(user.role === UserRole.ADMIN || user.role === UserRole.CONTADOR) && (
                <button
                  onClick={() => navigate('/journal-entries')}
                  className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Asientos Contables
                </button>
              )}
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Perfil
              </button>
            </div>
          </nav>
        </div>
      </header>      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Bienvenido, {user.full_name}!
              </h2>
              <p className="text-gray-600">
                Has iniciado sesión exitosamente en el sistema contable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Card de información del usuario */}
              <Card>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Perfil de Usuario</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card de estado de cuenta */}
              <Card>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Estado de Cuenta</h3>
                    <p className="text-sm text-gray-500">
                      {user.is_active ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Card de último acceso */}
              <Card>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Último Acceso</h3>
                    <p className="text-sm text-gray-500">
                      {user.last_login ? formatDate(user.last_login, 'long') : 'Primer acceso'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            
            {/* Módulos disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              
                {(user.role === UserRole.ADMIN || user.role === UserRole.CONTADOR) && (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('accounts')}>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Plan de Cuentas</h3>
                        <p className="text-sm text-gray-500">Gestión de cuentas contables</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}              {(user.role === UserRole.ADMIN || user.role === UserRole.CONTADOR) && (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/journal-entries')}>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Asientos Contables</h3>
                        <p className="text-sm text-gray-500">Gestión de partida doble</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="opacity-50">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
                      <p className="text-sm text-gray-500">Próximamente</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Información adicional para debugging */}
            {import.meta.env.DEV && (
              <Card className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Desarrollo</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </Card>
            )}
          </>
        )}

        {currentView === 'accounts' && <AccountsPage />}

        {currentView === 'profile' && (
          <Card>
            <div className="card-header">
              <h3 className="card-title">Perfil de Usuario</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                  <p className="mt-1 text-gray-900">{user.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rol</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)} mt-1`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <p className="mt-1 text-gray-900">{user.is_active ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Último Acceso</label>
                  <p className="mt-1 text-gray-900">
                    {user.last_login ? formatDate(user.last_login, 'long') : 'Primer acceso'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
