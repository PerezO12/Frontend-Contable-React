import React from 'react';
import { Spinner } from '../ui/Spinner';
export var LoadingPage = function (_a) {
    var _b = _a.message, message = _b === void 0 ? 'Cargando...' : _b;
    return (<div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
        
        {/* Spinner */}
        <Spinner size="lg" className="mx-auto mb-4"/>
        
        {/* Mensaje */}
        <p className="text-lg font-medium text-gray-900 mb-2">Sistema Contable</p>
        <p className="text-sm text-gray-600">{message}</p>
        
        {/* Dots animados */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>);
};
