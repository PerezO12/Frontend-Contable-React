var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/features/auth/types';
export var Sidebar = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onToggle = _a.onToggle, _b = _a.isCollapsed, isCollapsed = _b === void 0 ? false : _b;
    var user = useAuth().user;
    var navigate = useNavigate();
    var location = useLocation();
    var _c = useState(['contabilidad']), expandedItems = _c[0], setExpandedItems = _c[1];
    // Verificar si el usuario tiene acceso a un item
    var hasAccess = function (roles) {
        if (!roles || !user)
            return true;
        return roles.includes(user.role);
    };
    // Iconos personalizados
    var icons = {
        dashboard: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v6h8V5"/>
      </svg>),
        journalEntries: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>),
        accounts: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>),
        reports: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>),
        balanceSheet: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>),
        profitLoss: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>),
        trialBalance: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>),
        settings: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>),
        upload: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>),
        users: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
      </svg>), help: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>), paymentTerms: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>), products: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>), invoices: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>),
        journals: (<svg className={"".concat(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>),
        chevronDown: (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
      </svg>),
        chevronRight: (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
      </svg>),
    };
    // Configuración del menú
    var menuSections = [
        {
            title: 'Principal',
            items: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: icons.dashboard,
                    path: '/dashboard',
                },
            ],
        }, {
            title: 'Contabilidad',
            items: [
                {
                    id: 'contabilidad',
                    label: 'Contabilidad',
                    icon: icons.journalEntries,
                    children: [
                        {
                            id: 'journal-entries',
                            label: 'Asientos Contables',
                            icon: icons.journalEntries,
                            path: '/journal-entries',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                            badge: '12',
                        }, {
                            id: 'accounts',
                            label: 'Plan de Cuentas',
                            icon: icons.accounts,
                            path: '/accounts',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        }, {
                            id: 'cost-centers',
                            label: 'Centros de Costo',
                            icon: icons.accounts,
                            path: '/cost-centers',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        }, {
                            id: 'third-parties',
                            label: 'Terceros',
                            icon: icons.users,
                            path: '/third-parties',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        }, {
                            id: 'payment-terms',
                            label: 'Términos de Pago',
                            icon: icons.paymentTerms,
                            path: '/payment-terms',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        }, {
                            id: 'products',
                            label: 'Productos',
                            icon: icons.products,
                            path: '/products',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        }, {
                            id: 'journals',
                            label: 'Diarios',
                            icon: icons.journals,
                            path: '/journals',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        },
                        {
                            id: 'invoices',
                            label: 'Facturas',
                            icon: icons.invoices,
                            path: '/invoices',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        },
                    ],
                },
            ],
        }, {
            title: 'Reportes',
            items: [
                {
                    id: 'reports',
                    label: 'Reportes',
                    icon: icons.reports,
                    path: '/reports',
                },
            ],
        }, {
            title: 'Procesos',
            items: [{
                    id: 'import-export',
                    label: 'Importar',
                    icon: icons.upload,
                    path: '/import-export',
                    roles: [UserRole.ADMIN, UserRole.CONTADOR],
                    badge: 'Nuevo',
                },
            ],
        }, {
            title: 'Administración',
            items: [
                {
                    id: 'admin',
                    label: 'Administración',
                    icon: icons.settings,
                    children: [
                        {
                            id: 'users',
                            label: 'Gestión de Usuarios',
                            icon: icons.users,
                            path: '/admin/users',
                            roles: [UserRole.ADMIN],
                        },
                        {
                            id: 'roles',
                            label: 'Roles y Permisos',
                            icon: icons.settings,
                            path: '/admin/roles',
                            roles: [UserRole.ADMIN],
                        }, {
                            id: 'company',
                            label: 'Datos de la Empresa',
                            icon: icons.settings,
                            path: '/admin/company',
                            roles: [UserRole.ADMIN],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Configuración',
            items: [
                {
                    id: 'config',
                    label: 'Configuración',
                    icon: icons.settings,
                    children: [
                        {
                            id: 'general',
                            label: 'Configuración General',
                            icon: icons.settings,
                            path: '/config/general',
                            roles: [UserRole.ADMIN],
                        },
                        {
                            id: 'accounting',
                            label: 'Configuración Contable',
                            icon: icons.settings,
                            path: '/config/accounting',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        },
                        {
                            id: 'taxes',
                            label: 'Configuración de Impuestos',
                            icon: icons.settings,
                            path: '/config/taxes',
                            roles: [UserRole.ADMIN, UserRole.CONTADOR],
                        },
                        {
                            id: 'currencies',
                            label: 'Monedas',
                            icon: icons.settings,
                            path: '/config/currencies',
                            roles: [UserRole.ADMIN],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Soporte',
            items: [
                {
                    id: 'help',
                    label: 'Ayuda',
                    icon: icons.help,
                    path: '/help',
                },
            ],
        },
    ];
    var toggleExpanded = function (itemId) {
        setExpandedItems(function (prev) {
            return prev.includes(itemId)
                ? prev.filter(function (id) { return id !== itemId; })
                : __spreadArray(__spreadArray([], prev, true), [itemId], false);
        });
    };
    var handleNavigation = function (path) {
        navigate(path);
        if (onClose)
            onClose(); // Cerrar sidebar en mobile
    };
    var isActive = function (path) {
        if (!path)
            return false;
        return location.pathname === path || location.pathname.startsWith("".concat(path, "/"));
    };
    // Función para renderizar iconos en modo colapsado
    var renderCollapsedIcons = function () {
        var allItems = [];
        menuSections.forEach(function (section) {
            section.items.forEach(function (item) {
                if (item.children) {
                    item.children.forEach(function (child) {
                        if (hasAccess(child.roles)) {
                            allItems.push(child);
                        }
                    });
                }
                else if (hasAccess(item.roles)) {
                    allItems.push(item);
                }
            });
        });
        return (<div className="space-y-3">        {allItems.map(function (item) { return (<button key={item.id} onClick={function () { return item.path && handleNavigation(item.path); }} className={"w-full p-4 rounded-lg flex items-center justify-center transition-all duration-200 relative hover:scale-105 transform ".concat(location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 shadow-md border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm')} title={item.label}>            <div className="h-6 w-6 flex items-center justify-center">
              {item.icon}
            </div>
            {item.badge && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {item.badge}
              </span>)}
          </button>); })}
      </div>);
    };
    var renderMenuItem = function (item, level) {
        if (level === void 0) { level = 0; }
        if (!hasAccess(item.roles))
            return null;
        var isExpanded = expandedItems.includes(item.id);
        var hasChildren = item.children && item.children.length > 0;
        var active = isActive(item.path);
        var disabled = item.disabled || false;
        var baseClasses = "\n      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150\n      ".concat(level > 0 ? 'ml-6' : '', "\n      ").concat(disabled ? 'nav-item-disabled' : '', "\n    ");
        var activeClasses = active && !disabled
            ? 'bg-blue-100 border-r-4 border-blue-500 text-blue-700'
            : disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
        if (hasChildren) {
            return (<div key={item.id}>
          <button onClick={function () { return !disabled && toggleExpanded(item.id); }} className={"".concat(baseClasses, " ").concat(activeClasses, " w-full")} disabled={disabled}>
            <span className={"mr-3 ".concat(disabled ? 'nav-icon' : '')}>{item.icon}</span>
            <span className={"flex-1 text-left ".concat(disabled ? 'nav-text' : '')}>{item.label}</span>
            {disabled && (<span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Próximamente
              </span>)}
            {!disabled && (<span className="ml-auto">
                {isExpanded ? icons.chevronDown : icons.chevronRight}
              </span>)}
          </button>
          {isExpanded && !disabled && (<div className="mt-1 space-y-1">
              {item.children.map(function (child) { return renderMenuItem(child, level + 1); })}
            </div>)}
        </div>);
        }
        return (<button key={item.id} onClick={function () { return !disabled && item.path && handleNavigation(item.path); }} className={"".concat(baseClasses, " ").concat(activeClasses, " w-full")} disabled={disabled}>
        <span className={"mr-3 ".concat(disabled ? 'nav-icon' : '')}>{item.icon}</span>
        <span className={"flex-1 text-left ".concat(disabled ? 'nav-text' : '')}>{item.label}</span>
        {disabled && (<span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Próximamente
          </span>)}
        {!disabled && item.badge && (<span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {item.badge}
          </span>)}
      </button>);
    };
    var renderMenuSection = function (section) { return (<div key={section.title} className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map(function (item) { return renderMenuItem(item); })}
      </div>
    </div>); };
    return (<>
      {/* Mobile backdrop */}
      {isOpen && (<div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-20" onClick={onClose}/>)}      {/* Sidebar */}
      <div className={"\n          fixed-sidebar bg-white shadow-lg transform transition-all duration-300 ease-in-out flex flex-col\n          lg:translate-x-0 lg:static lg:inset-0\n          ".concat(isOpen ? 'translate-x-0' : '-translate-x-full', "\n          ").concat(isCollapsed ? 'sidebar-component-collapsed' : 'w-64', "\n          lg:z-auto z-30\n        ")}>
      {/* Sidebar header - Solo botón de colapsar */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Botón para colapsar/expandir sidebar - visible en desktop */}
          <button onClick={onToggle} className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}>
            <svg className={"h-5 w-5 transform transition-transform duration-200 ".concat(isCollapsed ? 'rotate-180' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
          </button>
        </div>
        
        {/* Close button for mobile */}
        <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>      {/* Navigation con scroll independiente que llega hasta abajo */}
      <nav className={"flex-1 overflow-y-auto scrollbar-thin min-h-0 ".concat(isCollapsed ? 'px-2 py-4' : 'px-4 py-6 space-y-8')}>
        {isCollapsed ? renderCollapsedIcons() : menuSections.map(renderMenuSection)}
      </nav>
    </div>
    </>);
};
