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
// Test para probar la funcionalidad de exportación
import { ExportService } from '../../shared/services/exportService';
// Función de prueba para exportar cuentas
export var testAccountExport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testRequest, blob, fileName, error_1, responseError;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                console.log('🧪 Iniciando prueba de exportación...');
                testRequest = {
                    table: 'accounts',
                    format: 'csv',
                    ids: ['1', '2', '3'] // Reemplaza con IDs reales
                };
                console.log('📤 Enviando solicitud:', testRequest);
                return [4 /*yield*/, ExportService.exportByIds(testRequest)];
            case 1:
                blob = _c.sent();
                console.log('✅ Exportación exitosa!');
                console.log('📊 Tamaño del archivo:', blob.size, 'bytes');
                console.log('🎯 Tipo de contenido:', blob.type);
                fileName = ExportService.generateFileName('cuentas_test', 'csv');
                ExportService.downloadBlob(blob, fileName);
                return [2 /*return*/, true];
            case 2:
                error_1 = _c.sent();
                console.error('❌ Error en la exportación:', error_1);
                if (error_1 instanceof Error) {
                    console.error('Mensaje:', error_1.message);
                }
                // Si es un error de respuesta del servidor
                if (error_1 && typeof error_1 === 'object' && 'response' in error_1) {
                    responseError = error_1;
                    console.error('Status:', (_a = responseError.response) === null || _a === void 0 ? void 0 : _a.status);
                    console.error('Data:', (_b = responseError.response) === null || _b === void 0 ? void 0 : _b.data);
                }
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Función para probar el esquema de exportación
export var testExportSchema = function () { return __awaiter(void 0, void 0, void 0, function () {
    var schema, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🧪 Probando esquema de exportación...');
                return [4 /*yield*/, ExportService.getTableSchema('accounts')];
            case 1:
                schema = _a.sent();
                console.log('✅ Esquema obtenido exitosamente!');
                console.log('📋 Tabla:', schema.table_name);
                console.log('📊 Total de registros:', schema.total_records);
                console.log('🏷️ Columnas disponibles:', schema.columns.length);
                console.log('📝 Columnas:', schema.columns.map(function (col) { return col.name; }).join(', '));
                return [2 /*return*/, schema];
            case 2:
                error_2 = _a.sent();
                console.error('❌ Error al obtener esquema:', error_2);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Función para probar tablas disponibles
export var testAvailableTables = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🧪 Probando tablas disponibles...');
                return [4 /*yield*/, ExportService.getAvailableTables()];
            case 1:
                result = _a.sent();
                console.log('✅ Tablas obtenidas exitosamente!');
                console.log('📊 Total de tablas:', result.total_tables);
                console.log('📋 Tablas disponibles:');
                result.tables.forEach(function (table) {
                    console.log("  - ".concat(table.table_name, ": ").concat(table.display_name, " (").concat(table.total_records, " registros)"));
                });
                return [2 /*return*/, result];
            case 2:
                error_3 = _a.sent();
                console.error('❌ Error al obtener tablas:', error_3);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Exportar todas las funciones de prueba
export var exportTests = {
    testAccountExport: testAccountExport,
    testExportSchema: testExportSchema,
    testAvailableTables: testAvailableTables
};
// Para usar en la consola del navegador:
// Importa este archivo en tu componente o página y ejecuta:
// exportTests.testAvailableTables();
// exportTests.testExportSchema();
// exportTests.testAccountExport(); // Solo si tienes IDs de cuentas válidos
