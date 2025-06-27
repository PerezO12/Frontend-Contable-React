var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/features/auth/types';
export var Header = function (_a) {
    var onToggleSidebar = _a.onToggleSidebar, isSidebarOpen = _a.isSidebarOpen;
    var _b = useAuth(), user = _b.user, logout = _b.logout;
    var navigate = useNavigate();
    var _c = useState(false), isProfileDropdownOpen = _c[0], setIsProfileDropdownOpen = _c[1];
    var getRoleDisplayName = function (role) {
        var _a;
        var roleNames = (_a = {},
            _a[UserRole.ADMIN] = 'Administrador',
            _a[UserRole.CONTADOR] = 'Contador',
            _a[UserRole.SOLO_LECTURA] = 'Solo Lectura',
            _a);
        return roleNames[role] || role;
    };
    var getRoleColor = function (role) {
        var _a;
        var roleColors = (_a = {},
            _a[UserRole.ADMIN] = 'bg-red-100 text-red-800',
            _a[UserRole.CONTADOR] = 'bg-blue-100 text-blue-800',
            _a[UserRole.SOLO_LECTURA] = 'bg-gray-100 text-gray-800',
            _a);
        return roleColors[role] || 'bg-gray-100 text-gray-800';
    };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error during logout:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getInitials = function (name) {
        return name
            .split(' ')
            .map(function (word) { return word.charAt(0); })
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    if (!user)
        return null;
    return (<header className="bg-white shadow-sm border-b border-gray-200 fixed-header">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Menu toggle button for mobile */}
            <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Toggle sidebar">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>)}
              </svg>
            </button>

            {/* Logo and company name */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">ContableERP</h1>
                <p className="text-xs text-gray-500">Sistema de Gestión Contable</p>
              </div>
            </div>          </div>          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* User profile dropdown */}
            <div className="relative">
              <button onClick={function () { return setIsProfileDropdownOpen(!isProfileDropdownOpen); }} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getInitials(user.full_name)}
                    </span>
                  </div>                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getRoleColor(user.role))}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <svg className="hidden md:block h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              {/* Dropdown menu */}
              {isProfileDropdownOpen && (<div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    
                    <button onClick={function () {
                setIsProfileDropdownOpen(false);
                navigate('/profile');
            }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span>Mi Perfil</span>
                      </div>
                    </button>
                    
                    <button onClick={function () {
                setIsProfileDropdownOpen(false);
                navigate('/settings');
            }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>Configuración</span>
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button onClick={function () {
                setIsProfileDropdownOpen(false);
                handleLogout();
            }} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                        <div className="flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                          <span>Cerrar Sesión</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (<div className="fixed inset-0 z-40" onClick={function () { return setIsProfileDropdownOpen(false); }}/>)}
    </header>);
};
