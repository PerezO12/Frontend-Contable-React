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
// Diagnóstico para probar diferentes endpoints de exportación
import { apiClient } from '../../shared/api/client';
export var diagnoseExportEndpoints = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testData, endpointsToTest, _i, endpointsToTest_1, endpoint, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('🔍 Iniciando diagnóstico de endpoints de exportación...\n');
                testData = {
                    table: 'accounts',
                    format: 'csv',
                    ids: ['test']
                };
                endpointsToTest = [
                    '/api/v1/export',
                    '/api/v1/export/',
                    '/api/v1/export/export',
                    '/export',
                    '/export/',
                    'export',
                    'export/'
                ];
                _i = 0, endpointsToTest_1 = endpointsToTest;
                _a.label = 1;
            case 1:
                if (!(_i < endpointsToTest_1.length)) return [3 /*break*/, 7];
                endpoint = endpointsToTest_1[_i];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                console.log("\uD83D\uDCE1 Probando endpoint: ".concat(endpoint));
                return [4 /*yield*/, apiClient.post(endpoint, testData, {
                        timeout: 5000,
                        validateStatus: function () { return true; } // Aceptar cualquier status para diagnóstico
                    })];
            case 3:
                response = _a.sent();
                console.log("\u2705 ".concat(endpoint, " - Status: ").concat(response.status));
                if (response.data) {
                    console.log("\uD83D\uDCC4 Tipo de respuesta: ".concat(typeof response.data));
                    if (response.headers['content-type']) {
                        console.log("\uD83C\uDFF7\uFE0F Content-Type: ".concat(response.headers['content-type']));
                    }
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                if (error_1.response) {
                    console.log("\u274C ".concat(endpoint, " - Status: ").concat(error_1.response.status, " - ").concat(error_1.response.statusText));
                    if (error_1.response.data && typeof error_1.response.data === 'object') {
                        console.log("\uD83D\uDCDD Error data:", error_1.response.data);
                    }
                }
                else if (error_1.request) {
                    console.log("\uD83D\uDD0C ".concat(endpoint, " - No response (network error)"));
                }
                else {
                    console.log("\u26A0\uFE0F ".concat(endpoint, " - ").concat(error_1.message));
                }
                return [3 /*break*/, 5];
            case 5:
                console.log(''); // Línea en blanco para separar
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                console.log('🏁 Diagnóstico completado');
                return [2 /*return*/];
        }
    });
}); };
export var testCurrentConfiguration = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tablesResponse, error_2, exportResponse, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('🧪 Probando configuración actual...\n');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Probar obtener tablas disponibles primero
                console.log('📋 Probando /api/v1/export/tables...');
                return [4 /*yield*/, apiClient.get('/api/v1/export/tables', {
                        timeout: 5000,
                        validateStatus: function () { return true; }
                    })];
            case 2:
                tablesResponse = _a.sent();
                console.log("Status: ".concat(tablesResponse.status));
                if (tablesResponse.status === 200) {
                    console.log('✅ Endpoint de tablas funciona correctamente');
                    console.log('📊 Respuesta:', JSON.stringify(tablesResponse.data, null, 2));
                }
                else {
                    console.log('❌ Endpoint de tablas falló');
                    console.log('📝 Respuesta:', tablesResponse.data);
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('❌ Error al probar endpoint de tablas:', error_2.message);
                if (error_2.response) {
                    console.log('📝 Status:', error_2.response.status);
                    console.log('📝 Data:', error_2.response.data);
                }
                return [3 /*break*/, 4];
            case 4:
                console.log('\n' + '='.repeat(50) + '\n');
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                // Probar exportación simple
                console.log('📤 Probando /api/v1/export (exportación simple)...');
                return [4 /*yield*/, apiClient.post('/api/v1/export', {
                        table: 'accounts',
                        format: 'csv',
                        ids: []
                    }, {
                        timeout: 5000,
                        validateStatus: function () { return true; }
                    })];
            case 6:
                exportResponse = _a.sent();
                console.log("Status: ".concat(exportResponse.status));
                if (exportResponse.status === 200 || exportResponse.status === 400) {
                    console.log('✅ Endpoint de exportación responde');
                    if (exportResponse.headers['content-type']) {
                        console.log('🏷️ Content-Type:', exportResponse.headers['content-type']);
                    }
                }
                else {
                    console.log('❌ Endpoint de exportación falló');
                }
                if (exportResponse.data && typeof exportResponse.data === 'object') {
                    console.log('📝 Respuesta:', JSON.stringify(exportResponse.data, null, 2));
                }
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                console.error('❌ Error al probar endpoint de exportación:', error_3.message);
                if (error_3.response) {
                    console.log('📝 Status:', error_3.response.status);
                    console.log('📝 Data:', error_3.response.data);
                }
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// Para usar en la consola del navegador:
// import { diagnoseExportEndpoints, testCurrentConfiguration } from './features/accounts/diagnose-export';
// diagnoseExportEndpoints();
// testCurrentConfiguration();
