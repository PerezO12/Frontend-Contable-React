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
import { useState, useCallback } from 'react';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
export var useAccountExport = function (options) {
    if (options === void 0) { options = {}; }
    var _a = useState(false), isExporting = _a[0], setIsExporting = _a[1];
    var _b = useState(null), exportProgress = _b[0], setExportProgress = _b[1];
    var _c = useToast(), success = _c.success, showError = _c.error;
    var exportAccounts = useCallback(function (accountIds, format, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var errorMsg, blob, finalFileName, successMsg, error_1, errorMsg;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (accountIds.length === 0) {
                        errorMsg = 'Debe seleccionar al menos una cuenta para exportar';
                        showError(errorMsg);
                        (_a = options.onError) === null || _a === void 0 ? void 0 : _a.call(options, errorMsg);
                        return [2 /*return*/];
                    }
                    setIsExporting(true);
                    setExportProgress({
                        current: 0,
                        total: accountIds.length,
                        message: 'Preparando exportación...'
                    });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    // Simular progreso (en una implementación real, esto vendría del backend)
                    setExportProgress({
                        current: accountIds.length / 2,
                        total: accountIds.length,
                        message: 'Procesando cuentas...'
                    });
                    return [4 /*yield*/, AccountService.exportAccounts(accountIds, format)];
                case 2:
                    blob = _d.sent();
                    setExportProgress({
                        current: accountIds.length,
                        total: accountIds.length,
                        message: 'Generando archivo...'
                    });
                    finalFileName = fileName || ExportService.generateFileName('cuentas', format);
                    // Descargar archivo
                    ExportService.downloadBlob(blob, finalFileName);
                    successMsg = "Se exportaron ".concat(accountIds.length, " cuenta").concat(accountIds.length === 1 ? '' : 's', " exitosamente");
                    success(successMsg);
                    (_b = options.onSuccess) === null || _b === void 0 ? void 0 : _b.call(options, accountIds.length, format);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _d.sent();
                    console.error('Error al exportar cuentas:', error_1);
                    errorMsg = error_1 instanceof Error
                        ? "Error al exportar: ".concat(error_1.message)
                        : 'Error al exportar las cuentas. Inténtelo nuevamente.';
                    showError(errorMsg);
                    (_c = options.onError) === null || _c === void 0 ? void 0 : _c.call(options, errorMsg);
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    setExportProgress(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, options]);
    var exportAccountsAdvanced = useCallback(function (format, filters, selectedColumns, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var blob, finalFileName, successMsg, error_2, errorMsg;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsExporting(true);
                    setExportProgress({
                        current: 0,
                        total: 100,
                        message: 'Aplicando filtros...'
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    setExportProgress({
                        current: 30,
                        total: 100,
                        message: 'Consultando datos...'
                    });
                    return [4 /*yield*/, AccountService.exportAccountsAdvanced(format, filters, selectedColumns)];
                case 2:
                    blob = _c.sent();
                    setExportProgress({
                        current: 80,
                        total: 100,
                        message: 'Generando archivo...'
                    });
                    finalFileName = fileName || ExportService.generateFileName('cuentas_filtradas', format);
                    // Descargar archivo
                    ExportService.downloadBlob(blob, finalFileName);
                    setExportProgress({
                        current: 100,
                        total: 100,
                        message: 'Exportación completada'
                    });
                    successMsg = "Exportaci\u00F3n avanzada completada exitosamente";
                    success(successMsg);
                    (_a = options.onSuccess) === null || _a === void 0 ? void 0 : _a.call(options, 0, format); // No sabemos el count exacto en filtros avanzados
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _c.sent();
                    console.error('Error al exportar cuentas con filtros:', error_2);
                    errorMsg = error_2 instanceof Error
                        ? "Error al exportar: ".concat(error_2.message)
                        : 'Error al exportar las cuentas. Inténtelo nuevamente.';
                    showError(errorMsg);
                    (_b = options.onError) === null || _b === void 0 ? void 0 : _b.call(options, errorMsg);
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    setExportProgress(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, options]);
    var getExportSchema = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, AccountService.getExportSchema()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error al obtener esquema de exportación:', error_3);
                    showError('Error al cargar información de exportación');
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    return {
        isExporting: isExporting,
        exportProgress: exportProgress,
        exportAccounts: exportAccounts,
        exportAccountsAdvanced: exportAccountsAdvanced,
        getExportSchema: getExportSchema
    };
};
