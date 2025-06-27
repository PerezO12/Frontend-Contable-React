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
import { useState } from 'react';
import { GenericImportService } from '../services/GenericImportService';
export function TemplateDownloadButton(_a) {
    var _this = this;
    var modelName = _a.modelName, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.variant, variant = _c === void 0 ? 'outline' : _c, _d = _a.size, size = _d === void 0 ? 'md' : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e;
    var _f = useState(false), isDownloading = _f[0], setIsDownloading = _f[1];
    var _g = useState(null), error = _g[0], setError = _g[1];
    var handleDownload = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isDownloading || disabled)
                        return [2 /*return*/];
                    setIsDownloading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, GenericImportService.downloadTemplate(modelName)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Error al descargar la plantilla');
                    console.error('Error downloading template:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsDownloading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Definir estilos basados en la variante
    var getVariantStyles = function () {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
            case 'secondary':
                return 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600';
            case 'outline':
            default:
                return 'bg-white text-blue-600 hover:bg-blue-50 border-blue-600';
        }
    };
    // Definir estilos basados en el tamaño
    var getSizeStyles = function () {
        switch (size) {
            case 'sm':
                return 'px-3 py-2 text-sm';
            case 'lg':
                return 'px-6 py-3 text-lg';
            case 'md':
            default:
                return 'px-4 py-2 text-sm';
        }
    };
    var baseStyles = 'inline-flex items-center justify-center border font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
    var variantStyles = getVariantStyles();
    var sizeStyles = getSizeStyles();
    var finalClassName = "".concat(baseStyles, " ").concat(variantStyles, " ").concat(sizeStyles, " ").concat(className);
    return (<div>
      <button type="button" onClick={handleDownload} disabled={isDownloading || disabled} className={finalClassName} title={"Descargar plantilla CSV para ".concat(modelName)}>
        {isDownloading ? (<>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
            Descargando...
          </>) : (<>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar Plantilla
          </>)}
      </button>

      {/* Mostrar error si ocurre */}
      {error && (<div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        </div>)}
    </div>);
}
