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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
export var UnauthorizedPage = function () {
    var navigate = useNavigate();
    var _a = useAuth(), user = _a.user, logout = _a.logout;
    var handleGoBack = function () {
        navigate(-1);
    };
    var handleGoHome = function () {
        navigate('/dashboard');
    };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="text-center">
            {/* Icono de acceso denegado */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
              </svg>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Acceso Denegado
            </h1>
            
            <p className="mt-2 text-sm text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>

            {user && (<div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">
                  Usuario actual: <span className="font-medium">{user.full_name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Rol: <span className="font-medium">{user.role}</span>
                </p>
              </div>)}

            <div className="mt-6 space-y-3">
              <Button onClick={handleGoHome} variant="primary" className="w-full">
                Ir al Dashboard
              </Button>
              
              <Button onClick={handleGoBack} variant="secondary" className="w-full">
                Volver Atrás
              </Button>
              
              <Button onClick={handleLogout} variant="ghost" className="w-full text-red-600 hover:text-red-700">
                Cerrar Sesión
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>);
};
