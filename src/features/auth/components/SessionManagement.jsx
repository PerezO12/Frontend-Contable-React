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
import React, { useState, useEffect } from 'react';
import { AuthService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/shared/hooks/useToast';
export var SessionManagement = function () {
    var _a = useState([]), sessions = _a[0], setSessions = _a[1];
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), terminatingSession = _c[0], setTerminatingSession = _c[1];
    var _d = useToast(), success = _d.success, showError = _d.error;
    var loadSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userSessions, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, AuthService.getUserSessions()];
                case 1:
                    userSessions = _a.sent();
                    setSessions(userSessions);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    showError('Error', 'No se pudieron cargar las sesiones activas');
                    console.error('Error loading sessions:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var terminateSession = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (terminatingSession)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setTerminatingSession(sessionId);
                    return [4 /*yield*/, AuthService.terminateSession(sessionId)];
                case 2:
                    _a.sent();
                    success('Sesión terminada', 'La sesión ha sido cerrada exitosamente');
                    // Recargar sesiones
                    return [4 /*yield*/, loadSessions()];
                case 3:
                    // Recargar sesiones
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    showError('Error', 'No se pudo terminar la sesión');
                    console.error('Error terminating session:', error_2);
                    return [3 /*break*/, 6];
                case 5:
                    setTerminatingSession(null);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var getDeviceIcon = function (deviceInfo) {
        var device = deviceInfo.toLowerCase();
        if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
            return '📱';
        }
        else if (device.includes('tablet') || device.includes('ipad')) {
            return '📟';
        }
        else {
            return '💻';
        }
    };
    useEffect(function () {
        loadSessions();
    }, []);
    if (isLoading) {
        return (<div className="flex justify-center items-center py-12">
        <Spinner size="lg"/>
        <span className="ml-3 text-gray-600">Cargando sesiones...</span>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sesiones Activas</h2>
        <Button variant="secondary" onClick={loadSessions} disabled={isLoading}>
          Actualizar
        </Button>
      </div>

      {sessions.length === 0 ? (<Card className="p-6 text-center">
          <p className="text-gray-500">No hay sesiones activas</p>
        </Card>) : (<div className="space-y-4">
          {sessions.map(function (session) { return (<Card key={session.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getDeviceIcon(session.device_info)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {session.device_info}
                      </h3>
                      {session.is_current && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Sesión actual
                        </span>)}
                    </div>
                    
                    <div className="mt-1 space-y-1 text-sm text-gray-500">
                      <p>
                        <span className="font-medium">IP:</span> {session.ip_address}
                      </p>
                      <p>
                        <span className="font-medium">Iniciada:</span> {formatDate(session.created_at)}
                      </p>
                      <p>
                        <span className="font-medium">Última actividad:</span> {formatDate(session.last_activity)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {!session.is_current && (<Button variant="danger" size="sm" onClick={function () { return terminateSession(session.id); }} isLoading={terminatingSession === session.id} disabled={terminatingSession !== null}>
                      {terminatingSession === session.id ? 'Terminando...' : 'Terminar'}
                    </Button>)}
                </div>
              </div>
            </Card>); })}
        </div>)}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900">Información sobre sesiones</h4>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Las sesiones se mantienen activas por 30 minutos de inactividad</p>
              <p>• Puedes tener máximo 5 sesiones activas simultáneamente</p>
              <p>• Cerrar una sesión remota no afecta tu sesión actual</p>
              <p>• La sesión actual se actualiza automáticamente con cada acción</p>
            </div>
          </div>
        </div>
      </Card>
    </div>);
};
