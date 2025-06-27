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
import { useState, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
import { TemplateDownloadButton } from './TemplateDownloadButton';
var MODEL_INFO = {
    third_party: {
        title: 'Terceros',
        description: 'Clientes, proveedores, empleados y otros terceros',
        fields: ['Código', 'Nombre Completo', 'Documento', 'Email', 'Teléfono', 'Dirección'],
        examples: 'Empresas, personas naturales, bancos, empleados',
        icon: '👥',
    },
    product: {
        title: 'Productos',
        description: 'Inventario de productos y servicios',
        fields: ['Código', 'Nombre', 'Descripción', 'Precios', 'Stock', 'Categorías'],
        examples: 'Productos físicos, servicios, productos mixtos',
        icon: '📦',
    },
    account: {
        title: 'Cuentas Contables',
        description: 'Plan de cuentas contables',
        fields: ['Código', 'Nombre', 'Tipo de Cuenta', 'Nivel', 'Configuración'],
        examples: 'Activos, pasivos, ingresos, gastos, patrimonio',
        icon: '💰',
    },
    invoice: {
        title: 'Facturas',
        description: 'Facturas de venta y compra con líneas de detalle',
        fields: ['Número', 'Tipo', 'Tercero', 'Fecha', 'Líneas de Producto'],
        examples: 'Facturas de venta, compra, notas de crédito/débito',
        icon: '🧾',
    },
};
export function TemplateInfoCard(_a) {
    var _this = this;
    var modelName = _a.modelName, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState(null), isTemplateAvailable = _c[0], setIsTemplateAvailable = _c[1];
    var _d = useState(true), isCheckingAvailability = _d[0], setIsCheckingAvailability = _d[1];
    var modelInfo = MODEL_INFO[modelName];
    useEffect(function () {
        var checkTemplateAvailability = function () { return __awaiter(_this, void 0, void 0, function () {
            var available, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsCheckingAvailability(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, GenericImportService.isTemplateAvailable(modelName)];
                    case 2:
                        available = _b.sent();
                        setIsTemplateAvailable(available);
                        return [3 /*break*/, 5];
                    case 3:
                        _a = _b.sent();
                        setIsTemplateAvailable(false);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsCheckingAvailability(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        checkTemplateAvailability();
    }, [modelName]);
    if (!modelInfo) {
        return null;
    }
    return (<div className={"bg-blue-50 border border-blue-200 rounded-lg p-4 ".concat(className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-2xl">{modelInfo.icon}</div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            💡 ¿No sabes cómo estructurar tu archivo?
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Descarga nuestra <strong>plantilla de ejemplo</strong> con datos válidos que puedes importar directamente.
          </p>
          
          <div className="space-y-2 mb-4">
            <div>
              <span className="text-xs font-medium text-blue-800">Incluye campos:</span>
              <p className="text-xs text-blue-600">
                {modelInfo.fields.join(' • ')}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-blue-800">Ejemplos incluidos:</span>
              <p className="text-xs text-blue-600">
                {modelInfo.examples}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isCheckingAvailability ? (<div className="flex items-center text-xs text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent mr-2"></div>
                Verificando disponibilidad...
              </div>) : isTemplateAvailable ? (<TemplateDownloadButton modelName={modelName} variant="primary" size="sm"/>) : (<div className="text-xs text-gray-500">
                Plantilla no disponible
              </div>)}
            
            <div className="text-xs text-blue-600">
              <span className="font-medium">✅ Garantía:</span> Los datos de ejemplo se importan sin errores
            </div>
          </div>
        </div>
      </div>
    </div>);
}
