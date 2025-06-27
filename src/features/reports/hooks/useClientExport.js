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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { exportReport } from '../utils/clientExportUtils';
export var useClientExport = function () {
    var _a = useState(false), isExporting = _a[0], setIsExporting = _a[1];
    var _b = useState(null), exportError = _b[0], setExportError = _b[1];
    var _c = useState(null), lastExportMethod = _c[0], setLastExportMethod = _c[1];
    var _d = useToast(), success = _d.success, showError = _d.error;
    var handleExport = useCallback(function (report_1, format_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([report_1, format_1], args_1, true), void 0, function (report, format, options) {
            var error, error_1, message;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!report) {
                            error = 'No hay reporte disponible para exportar';
                            setExportError(error);
                            showError(error);
                            return [2 /*return*/];
                        }
                        setIsExporting(true);
                        setExportError(null);
                        setLastExportMethod(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, exportReport(report, format, options)];
                    case 2:
                        _a.sent();
                        setLastExportMethod(format === 'pdf' ? 'PDF (sistema de fallback automático)' : format.toUpperCase());
                        success("Reporte exportado a ".concat(format.toUpperCase(), " exitosamente"));
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        message = error_1 instanceof Error ? error_1.message : "Error al exportar a ".concat(format.toUpperCase());
                        setExportError(message);
                        showError(message);
                        throw error_1;
                    case 4:
                        setIsExporting(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    var exportToPDF = useCallback(function (report_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handleExport(report, 'pdf', options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }, [handleExport]);
    var exportToExcel = useCallback(function (report_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handleExport(report, 'excel', options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }, [handleExport]);
    var exportToCSV = useCallback(function (report_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handleExport(report, 'csv', options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }, [handleExport]);
    return {
        exportToPDF: exportToPDF,
        exportToExcel: exportToExcel,
        exportToCSV: exportToCSV,
        isExporting: isExporting,
        exportError: exportError,
        lastExportMethod: lastExportMethod
    };
};
