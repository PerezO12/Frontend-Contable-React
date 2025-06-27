import React from 'react';
import { APP_CONFIG } from '@/shared/constants';
export var AuthLayout = function (_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? 'Bienvenido' : _b, _c = _a.subtitle, subtitle = _c === void 0 ? 'Inicia sesión en tu cuenta' : _c;
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        
        {/* Título */}
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {APP_CONFIG.APP_NAME}
        </h1>
        
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-900">
          {title}
        </h2>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2025 {APP_CONFIG.APP_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </div>);
};
