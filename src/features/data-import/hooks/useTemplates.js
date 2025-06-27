var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { DataImportService } from '../services';
import { useToast } from '@/shared/hooks';
import { downloadBlob, generateUniqueFilename, getMimeTypeForFormat } from '../utils';
var initialState = {
    isLoading: false,
    availableTemplates: null,
    isDownloading: false,
};
export function useTemplates() {
    var _this = this;
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    var _b = useToast(), success = _b.success, error = _b.error;
    /**
     * Obtiene las plantillas disponibles
     */
    var getAvailableTemplates = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var templates_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, DataImportService.getAvailableTemplates()];
                case 2:
                    templates_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false, availableTemplates: templates_1 })); });
                    return [2 /*return*/, templates_1];
                case 3:
                    err_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                    error('Error', 'Error al cargar las plantillas disponibles');
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [error]);
    /**
     * Descarga una plantilla
     */
    var downloadTemplate = useCallback(function (templateData) { return __awaiter(_this, void 0, void 0, function () {
        var blob, fileExtension, filename, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isDownloading: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, DataImportService.downloadTemplate()];
                case 2:
                    blob = _a.sent();
                    fileExtension = templateData.format === 'xlsx' ? 'xlsx' : templateData.format;
                    filename = generateUniqueFilename("plantilla_".concat(templateData.data_type, ".").concat(fileExtension), 'ejemplo');
                    // Descargar archivo
                    downloadBlob(blob, filename);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isDownloading: false })); });
                    success('Plantilla descargada', "Plantilla ".concat(templateData.format.toUpperCase(), " descargada correctamente"));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isDownloading: false })); });
                    error('Error de descarga', 'Error al descargar la plantilla - Funcionalidad no disponible en sistema genérico');
                    throw err_2;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [success, error]);
    /**
     * Obtiene información de una plantilla específica
     */
    var getTemplateInfo = useCallback(function (dataType, format) { return __awaiter(_this, void 0, void 0, function () {
        var info, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, DataImportService.getTemplateInfo(dataType, format)];
                case 1:
                    info = _a.sent();
                    return [2 /*return*/, info];
                case 2:
                    err_3 = _a.sent();
                    error('Error', 'Error al obtener información de la plantilla');
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [error]);
    /**
     * Descarga todas las plantillas para un tipo de datos
     */
    var downloadAllTemplatesForType = useCallback(function (dataType) { return __awaiter(_this, void 0, void 0, function () {
        var formats, _i, formats_1, format, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formats = ['csv', 'xlsx', 'json'];
                    setState(function (prev) { return (__assign(__assign({}, prev), { isDownloading: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    _i = 0, formats_1 = formats;
                    _a.label = 2;
                case 2:
                    if (!(_i < formats_1.length)) return [3 /*break*/, 6];
                    format = formats_1[_i];
                    return [4 /*yield*/, downloadTemplate({ data_type: dataType, format: format })];
                case 3:
                    _a.sent();
                    // Pequeña pausa entre descargas
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 4:
                    // Pequeña pausa entre descargas
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    success('Descarga completa', "Todas las plantillas para ".concat(dataType, " han sido descargadas"));
                    return [3 /*break*/, 9];
                case 7:
                    err_4 = _a.sent();
                    error('Error', 'Error al descargar algunas plantillas');
                    return [3 /*break*/, 9];
                case 8:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isDownloading: false })); });
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [downloadTemplate, success, error]);
    /**
     * Genera una plantilla personalizada con datos de ejemplo
     */
    var generateCustomTemplate = useCallback(function (dataType, format, sampleData) {
        try {
            var content = void 0;
            var filename = void 0;
            var mimeType = void 0;
            if (format === 'csv') {
                // Generar CSV con datos de ejemplo
                var headers = getTemplateHeaders(dataType);
                var data = sampleData || getDefaultSampleData(dataType);
                content = convertToCSV(data, headers);
                filename = "plantilla_".concat(dataType, "_personalizada.csv");
                mimeType = getMimeTypeForFormat('csv');
            }
            else {
                // Generar JSON con estructura completa
                var templateStructure = {
                    template_info: {
                        data_type: dataType,
                        format: 'json',
                        description: "Plantilla personalizada para ".concat(dataType),
                        created_at: new Date().toISOString(),
                    },
                    data: sampleData || getDefaultSampleData(dataType)
                };
                content = JSON.stringify(templateStructure, null, 2);
                filename = "plantilla_".concat(dataType, "_personalizada.json");
                mimeType = getMimeTypeForFormat('json');
            }
            // Crear y descargar archivo
            var blob = new Blob([content], { type: mimeType });
            downloadBlob(blob, filename);
            success('Plantilla generada', 'Plantilla personalizada generada correctamente');
        }
        catch (err) {
            error('Error', 'Error al generar plantilla personalizada');
        }
    }, [success, error]);
    return __assign(__assign({}, state), { 
        // Acciones
        getAvailableTemplates: getAvailableTemplates, downloadTemplate: downloadTemplate, getTemplateInfo: getTemplateInfo, downloadAllTemplatesForType: downloadAllTemplatesForType, generateCustomTemplate: generateCustomTemplate });
}
// Funciones auxiliares
function getTemplateHeaders(dataType) {
    if (dataType === 'accounts') {
        return [
            'code', 'name', 'account_type', 'category', 'parent_code',
            'description', 'is_active', 'allows_movements', 'requires_third_party',
            'requires_cost_center', 'notes'
        ];
    }
    else {
        return [
            'entry_number', 'entry_date', 'description', 'reference', 'entry_type',
            'account_code', 'line_description', 'debit_amount', 'credit_amount',
            'third_party', 'cost_center', 'line_reference'
        ];
    }
}
function getDefaultSampleData(dataType) {
    if (dataType === 'accounts') {
        return [
            {
                code: '1105',
                name: 'Caja General',
                account_type: 'ACTIVO',
                category: 'ACTIVO_CORRIENTE',
                parent_code: '1100',
                description: 'Dinero en efectivo en caja principal',
                is_active: true,
                allows_movements: true,
                requires_third_party: false,
                requires_cost_center: false,
                notes: 'Cuenta para manejo de efectivo'
            }
        ];
    }
    else {
        return [
            {
                entry_number: 'AST-2024-001',
                entry_date: '2024-01-15',
                description: 'Compra de material de oficina',
                reference: 'FAC-001234',
                entry_type: 'MANUAL',
                account_code: '5105',
                line_description: 'Material de oficina - papelería',
                debit_amount: 150000,
                credit_amount: '',
                third_party: 'PAPELERIA ABC LTDA',
                cost_center: 'ADMIN',
                line_reference: 'FAC-001234'
            }
        ];
    }
}
function convertToCSV(data, headers) {
    var csvContent = __spreadArray([
        headers.join(',')
    ], data.map(function (row) {
        return headers.map(function (header) {
            var value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return "\"".concat(value.replace(/"/g, '""'), "\"");
            }
            return value || '';
        }).join(',');
    }), true).join('\n');
    return csvContent;
}
