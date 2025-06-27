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
export var formatDate = function (date, format) {
    if (format === void 0) { format = 'short'; }
    var dateObj = typeof date === 'string' ? new Date(date) : date;
    var optionsMap = {
        short: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        },
        long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit'
        }
    };
    var options = optionsMap[format];
    return dateObj.toLocaleDateString('es-ES', options);
};
/**
 * Formatea una fecha de string "YYYY-MM-DD" sin problemas de zona horaria
 * Esta función evita el problema donde new Date("2025-08-29") puede mostrar un día anterior
 * debido a la conversión de UTC a zona horaria local
 */
export var formatDateSafe = function (dateString) {
    if (!dateString)
        return '';
    // Si ya es una fecha formateada, devolverla tal como está
    if (dateString.includes('/'))
        return dateString;
    // Para fechas en formato ISO "YYYY-MM-DD", parsear manualmente
    var parts = dateString.split('T')[0].split('-'); // Tomar solo la parte de fecha, ignorar tiempo
    if (parts.length === 3) {
        var year = parseInt(parts[0]);
        var month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
        var day = parseInt(parts[2]);
        // Crear fecha en zona horaria local
        var date = new Date(year, month, day);
        return date.toLocaleDateString('es-ES');
    }
    // Fallback al método original
    return new Date(dateString).toLocaleDateString('es-ES');
};
export var formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
export var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export var truncateText = function (text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
export var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
export var debounce = function (func, delay) {
    var timeoutId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () { return func.apply(void 0, args); }, delay);
    };
};
export var generateId = function () {
    return Math.random().toString(36).substr(2, 9);
};
export var copyToClipboard = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1, textArea;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, navigator.clipboard.writeText(text)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
