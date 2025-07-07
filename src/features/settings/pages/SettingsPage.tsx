/**
 * Settings Page - Main Configuration Interface
 * Professional extensible configuration page for company settings
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySettingsForm } from '../components/CompanySettingsForm';
import { TaxAccountsConfiguration } from '../components/TaxAccountsConfiguration';
import { UnifiedCurrencyManagementPage } from '../components/UnifiedCurrencyManagementPage';

// Configuration sections that can be extended in the future
interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  badge?: string;
  disabled?: boolean;
}

// Icons for different settings sections
const BuildingIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserGroupIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CogIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SecurityIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BellIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-5-3v3l-5-5h5zm0 0V9a7.029 7.029 0 00-.673-3.067l.673.067z" />
  </svg>
);

const TaxIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CurrencyIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Placeholder components for future features
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <CogIcon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">Esta sección estará disponible próximamente.</p>
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Próximamente
      </div>
    </div>
  </div>
);

// Configuration sections - easily extensible
const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'company',
    name: 'Configuración de Empresa',
    description: 'Cuentas por defecto y configuraciones generales de la empresa',
    icon: BuildingIcon,
    component: CompanySettingsForm,
  },
  {
    id: 'tax-accounts',
    name: 'Cuentas de Impuestos',
    description: 'Configuración de cuentas contables para el manejo de impuestos',
    icon: TaxIcon,
    component: TaxAccountsConfiguration,
  },
  {
    id: 'currencies',
    name: 'Monedas',
    description: 'Gestión de monedas, tipos de cambio y configuración monetaria',
    icon: CurrencyIcon,
    component: UnifiedCurrencyManagementPage,
  },
  {
    id: 'users',
    name: 'Usuarios y Permisos',
    description: 'Gestión de usuarios, roles y permisos del sistema',
    icon: UserGroupIcon,
    component: () => <PlaceholderComponent title="Gestión de Usuarios" />,
    badge: 'Próximamente',
    disabled: true,
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Configuraciones de seguridad, autenticación y respaldos',
    icon: SecurityIcon,
    component: () => <PlaceholderComponent title="Configuración de Seguridad" />,
    badge: 'Próximamente',
    disabled: true,
  },
  {
    id: 'notifications',
    name: 'Notificaciones',
    description: 'Configuración de alertas, recordatorios y notificaciones',
    icon: BellIcon,
    component: () => <PlaceholderComponent title="Configuración de Notificaciones" />,
    badge: 'Próximamente',
    disabled: true,
  },
  {
    id: 'system',
    name: 'Sistema',
    description: 'Configuraciones avanzadas del sistema y personalización',
    icon: CogIcon,
    component: () => <PlaceholderComponent title="Configuración del Sistema" />,
    badge: 'Próximamente',
    disabled: true,
  },
];

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('company');
  const navigate = useNavigate();

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'currencies') {
      navigate('/settings/currencies');
    } else {
      setActiveSection(sectionId);
    }
  };

  const currentSection = SETTINGS_SECTIONS.find(section => section.id === activeSection);
  const CurrentComponent = currentSection?.component || (() => null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <CogIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600">Gestiona la configuración del sistema contable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Secciones</h2>
              </div>
              <nav className="p-2">
                {SETTINGS_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isDisabled = section.disabled;

                  return (
                    <button
                      key={section.id}
                      onClick={() => !isDisabled && handleSectionClick(section.id)}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center px-3 py-3 text-sm font-medium rounded-md mb-1 transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : isDisabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${isDisabled ? 'opacity-60' : ''}
                      `}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-500' : isDisabled ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span>{section.name}</span>
                          {section.badge && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-left">
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">¿Necesitas ayuda?</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Consulta la documentación o contacta al soporte técnico para más información sobre la configuración.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="mt-8 lg:mt-0 lg:col-span-9">
            {currentSection && (
              <div>
                {/* Section Header */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <currentSection.icon className="h-6 w-6 text-gray-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">{currentSection.name}</h2>
                    {currentSection.badge && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentSection.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-600">{currentSection.description}</p>
                </div>

                {/* Section Content */}
                <CurrentComponent />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
