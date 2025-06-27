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
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { ExportService } from '../../../shared/services/exportService';
import { diagnoseExportEndpoints, testCurrentConfiguration } from '../diagnose-export';
export var ExportTestComponent = function () {
    var _a = useState(''), testResults = _a[0], setTestResults = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState('1,2,3'), testIds = _c[0], setTestIds = _c[1];
    var _d = useState('csv'), selectedFormat = _d[0], setSelectedFormat = _d[1];
    var _e = useToast(), success = _e.success, showError = _e.error;
    var runDiagnostic = function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalLog, logs, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setTestResults('');
                    originalLog = console.log;
                    logs = [];
                    console.log = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        logs.push(args.join(' '));
                        originalLog.apply(void 0, args);
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, diagnoseExportEndpoints()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testCurrentConfiguration()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    logs.push("Error durante diagn\u00F3stico: ".concat(error_1));
                    return [3 /*break*/, 6];
                case 5:
                    console.log = originalLog;
                    setTestResults(logs.join('\n'));
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var testSimpleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var ids, blob, fileName, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    ids = testIds.split(',').map(function (id) { return id.trim(); }).filter(function (id) { return id; });
                    if (ids.length === 0) {
                        showError('Ingresa al menos un ID de cuenta');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ExportService.exportByIds({
                            table: 'accounts',
                            format: selectedFormat,
                            ids: ids
                        })];
                case 2:
                    blob = _a.sent();
                    fileName = ExportService.generateFileName('test_cuentas', selectedFormat);
                    ExportService.downloadBlob(blob, fileName);
                    success("Exportaci\u00F3n exitosa: ".concat(fileName));
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error en exportación de prueba:', error_2);
                    showError("Error en exportaci\u00F3n: ".concat(error_2 instanceof Error ? error_2.message : 'Error desconocido'));
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var testGetTables = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tables, info, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ExportService.getAvailableTables()];
                case 2:
                    tables = _a.sent();
                    info = "Tablas disponibles (".concat(tables.total_tables, "):\n").concat(tables.tables.map(function (t) { return "- ".concat(t.table_name, ": ").concat(t.display_name, " (").concat(t.total_records, " registros)"); }).join('\n'));
                    setTestResults(info);
                    success('Información de tablas cargada exitosamente');
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error al obtener tablas:', error_3);
                    showError("Error: ".concat(error_3 instanceof Error ? error_3.message : 'Error desconocido'));
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var testGetSchema = function () { return __awaiter(void 0, void 0, void 0, function () {
        var schema, info, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ExportService.getTableSchema('accounts')];
                case 2:
                    schema = _a.sent();
                    info = "Esquema de tabla 'accounts':\nNombre: ".concat(schema.display_name, "\nDescripci\u00F3n: ").concat(schema.description || 'No disponible', "\nTotal de registros: ").concat(schema.total_records, "\nColumnas disponibles (").concat(schema.columns.length, "):\n").concat(schema.columns.map(function (col) { return "- ".concat(col.name, " (").concat(col.data_type, ")"); }).join('\n'));
                    setTestResults(info);
                    success('Esquema cargado exitosamente');
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error al obtener esquema:', error_4);
                    showError("Error: ".concat(error_4 instanceof Error ? error_4.message : 'Error desconocido'));
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6 p-6">
      <Card>
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            🧪 Pruebas de Exportación de Cuentas
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Componente de prueba para verificar la funcionalidad de exportación
          </p>
        </div>

        <div className="card-body space-y-6">
          {/* Diagnóstico General */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Diagnóstico General</h3>
            <div className="flex space-x-3">
              <Button onClick={runDiagnostic} disabled={isLoading} variant="secondary">
                {isLoading ? <Spinner size="sm"/> : '🔍'} Ejecutar Diagnóstico
              </Button>
              <Button onClick={testGetTables} disabled={isLoading} variant="secondary">
                📋 Obtener Tablas
              </Button>
              <Button onClick={testGetSchema} disabled={isLoading} variant="secondary">
                📊 Obtener Esquema
              </Button>
            </div>
          </div>

          {/* Prueba de Exportación Simple */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Exportación Simple</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IDs de Cuentas (separados por coma)
                </label>
                <Input type="text" value={testIds} onChange={function (e) { return setTestIds(e.target.value); }} placeholder="1,2,3" disabled={isLoading}/>
                <p className="text-xs text-gray-500 mt-1">
                  Usa IDs reales de cuentas existentes en tu base de datos
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato
                </label>
                <select value={selectedFormat} onChange={function (e) { return setSelectedFormat(e.target.value); }} disabled={isLoading} className="form-select w-full">
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={testSimpleExport} disabled={isLoading} className="w-full">
                  {isLoading ? <Spinner size="sm"/> : '📤'} Exportar
                </Button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {testResults && (<div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Resultados</h3>
              <div className="bg-gray-50 border rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {testResults}
                </pre>
              </div>
            </div>)}

          {/* Información de Estado */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Información</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Este componente es solo para pruebas y diagnóstico</li>
              <li>• Los endpoints se prueban contra: <code className="bg-blue-100 px-1 rounded">http://localhost:8000/api/v1/export</code></li>
              <li>• Asegúrate de que el backend esté ejecutándose</li>
              <li>• Los errores 401 indican problemas de autenticación</li>
              <li>• Los errores 404 indican que el endpoint no existe</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);
};
