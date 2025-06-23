import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/features/auth/types';
import { Card } from '@/components/ui/Card';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const hasAccess = (roles: UserRole[]): boolean => {
    return roles.includes(user.role);
  };
  const dashboardStats = [
    {
      title: 'Facturas Pendientes',
      value: '8',
      change: '+1.2%',
      trend: 'up' as const,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Asientos Pendientes',
      value: '12',
      change: '+2.5%',
      trend: 'up' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Asientos Contabilizados',
      value: '248',
      change: '+12.1%',
      trend: 'up' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Balance Total',
      value: '$1,234,567',
      change: '+5.2%',
      trend: 'up' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      title: 'Cuentas Activas',
      value: '156',
      change: '+1.8%',
      trend: 'up' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];
  const quickActions = [
    {
      title: 'Nueva Factura',
      description: 'Crear una nueva factura',
      path: '/invoices/new',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR],
    },
    {
      title: 'Ver Facturas',
      description: 'Gestionar facturas del sistema',
      path: '/invoices',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-emerald-500 hover:bg-emerald-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR, UserRole.SOLO_LECTURA],
    },
    {
      title: 'Nuevo Asiento',
      description: 'Crear un nuevo asiento contable',
      path: '/journal-entries/new',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR],
    },
    {
      title: 'Ver Asientos',
      description: 'Gestionar asientos contables',
      path: '/journal-entries',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR, UserRole.SOLO_LECTURA],
    },
    {
      title: 'Plan de Cuentas',
      description: 'Administrar cuentas contables',
      path: '/accounts',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),      color: 'bg-purple-500 hover:bg-purple-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR],
    },
    {
      title: 'Centros de Costo',
      description: 'Gestionar centros de costo',
      path: '/cost-centers',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),      color: 'bg-indigo-500 hover:bg-indigo-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR],
    },
    {
      title: 'Terceros',
      description: 'Gestionar terceros (clientes, proveedores)',
      path: '/third-parties',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-teal-500 hover:bg-teal-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR],
    },
    {
      title: 'Reportes',
      description: 'Ver reportes financieros',
      path: '/reports',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-orange-500 hover:bg-orange-600',
      roles: [UserRole.ADMIN, UserRole.CONTADOR, UserRole.SOLO_LECTURA],
    },
  ];
  return (
    <>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Sistema de Gestión Contable - Panel de Control
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions
            .filter(action => hasAccess(action.roles))
            .map((action, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.path)}>
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-lg text-white ${action.color} mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo asiento creado</p>
                <p className="text-sm text-gray-500">Asiento #A001234 - Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Asiento aprobado</p>
                <p className="text-sm text-gray-500">Asiento #A001233 - Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                <p className="text-sm text-gray-500">Juan Pérez - Contador - Ayer</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estado del Sistema</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Operativo
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Última sincronización</span>
              <span className="text-sm text-gray-900">Hace 5 minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Backup automático</span>
              <span className="text-sm text-gray-900">Diario a las 02:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Usuarios conectados</span>
              <span className="text-sm text-gray-900">3 activos</span>
            </div>
          </div>        </Card>
      </div>
    </>
  );
};
