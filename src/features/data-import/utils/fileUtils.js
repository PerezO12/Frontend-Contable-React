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
/**
 * Formatea el tamaño de archivo en una cadena legible
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Genera un nombre de archivo único con timestamp
 */
export function generateUniqueFilename(originalName, suffix) {
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    var nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    var extension = originalName.split('.').pop();
    var suffixPart = suffix ? "_".concat(suffix) : '';
    return "".concat(nameWithoutExt, "_").concat(timestamp).concat(suffixPart, ".").concat(extension);
}
/**
 * Convierte un archivo a texto plano para visualización
 */
export function fileToText(file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function (e) { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
                    reader.onerror = function (e) { return reject(e); };
                    reader.readAsText(file);
                })];
        });
    });
}
/**
 * Descarga un blob como archivo
 */
export function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
/**
 * Convierte datos a CSV
 */
export function convertToCSV(data, headers) {
    var csvContent = __spreadArray([
        headers.join(',')
    ], data.map(function (row) {
        return headers.map(function (header) {
            var value = row[header];
            // Escapar comillas y envolver en comillas si contiene comas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return "\"".concat(value.replace(/"/g, '""'), "\"");
            }
            return value || '';
        }).join(',');
    }), true).join('\n');
    return csvContent;
}
/**
 * Parsea CSV a objetos
 */
export function parseCSV(csvText, delimiter) {
    if (delimiter === void 0) { delimiter = ','; }
    var lines = csvText.split('\n').filter(function (line) { return line.trim(); });
    if (lines.length === 0)
        return [];
    var headers = lines[0].split(delimiter).map(function (h) { return h.trim().replace(/"/g, ''); });
    var data = [];
    var _loop_1 = function (i) {
        var values = lines[i].split(delimiter);
        var row = {};
        headers.forEach(function (header, index) {
            var _a;
            var value = ((_a = values[index]) === null || _a === void 0 ? void 0 : _a.trim().replace(/"/g, '')) || '';
            // Intentar convertir a número si es posible
            if (value && !isNaN(Number(value))) {
                value = Number(value);
            }
            // Convertir strings de boolean
            if (value === 'true')
                value = true;
            if (value === 'false')
                value = false;
            row[header] = value;
        });
        data.push(row);
    };
    for (var i = 1; i < lines.length; i++) {
        _loop_1(i);
    }
    return data;
}
/**
 * Valida el formato MIME del archivo
 */
export function validateMimeType(file, allowedTypes) {
    return allowedTypes.includes(file.type) ||
        allowedTypes.some(function (type) {
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.slice(0, -1));
            }
            return false;
        });
}
/**
 * Detecta el formato de archivo basado en la extensión
 */
export function detectFileFormat(filename) {
    var _a;
    var extension = (_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (extension) {
        case 'csv':
            return 'csv';
        case 'xlsx':
        case 'xls':
            return 'xlsx';
        case 'json':
            return 'json';
        default:
            return 'unknown';
    }
}
/**
 * Obtiene el tipo MIME apropiado para un formato
 */
export function getMimeTypeForFormat(format) {
    switch (format) {
        case 'csv':
            return 'text/csv';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'json':
            return 'application/json';
        default:
            return 'application/octet-stream';
    }
}
/**
 * Crea un objeto File desde contenido de texto
 */
export function createFileFromText(content, filename, type) {
    var blob = new Blob([content], { type: type });
    return new File([blob], filename, { type: type });
}
/**
 * Formatea tiempo en una cadena legible
 */
export function formatDuration(seconds) {
    if (seconds < 60) {
        return "".concat(Math.round(seconds), "s");
    }
    else if (seconds < 3600) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.round(seconds % 60);
        return "".concat(minutes, "m ").concat(remainingSeconds, "s");
    }
    else {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        return "".concat(hours, "h ").concat(minutes, "m");
    }
}
/**
 * Debounce función para evitar llamadas excesivas
 */
export function debounce(func, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(void 0, args); }, wait);
    };
}
