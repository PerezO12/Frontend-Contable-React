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
import { Card, Button } from '@/components/ui';
import { useTemplates } from '../hooks';
export function TemplateDownload(_a) {
    var _this = this;
    var dataType = _a.dataType, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useTemplates(), downloadTemplate = _c.downloadTemplate, downloadAllTemplatesForType = _c.downloadAllTemplatesForType, isDownloading = _c.isDownloading;
    var getDataTypeLabel = function (type) {
        return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
    };
    var handleDownload = function (format) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, downloadTemplate({ data_type: dataType, format: format })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error downloading template:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDownloadAll = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, downloadAllTemplatesForType(dataType)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error downloading all templates:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var templates = [
        {
            format: 'csv',
            title: 'CSV',
            description: 'Formato simple compatible con Excel y herramientas de texto',
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>),
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            format: 'xlsx',
            title: 'Excel',
            description: 'Formato Excel con validaciones y documentación incluida',
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>),
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            format: 'json',
            title: 'JSON',
            description: 'Formato estructurado ideal para datos jerárquicos',
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>),
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    ];
    return (<Card className={"p-6 ".concat(className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Plantillas de Ejemplo - {getDataTypeLabel(dataType)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Descarga plantillas con ejemplos para facilitar la preparación de tus datos
          </p>
        </div>
        
        <Button onClick={handleDownloadAll} disabled={isDownloading} variant="secondary" className="shrink-0">
          {isDownloading ? (<div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Descargando...
            </div>) : ('Descargar Todas')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(function (template) { return (<div key={template.format} className={"relative border rounded-lg p-4 ".concat(template.borderColor, " ").concat(template.bgColor, " hover:shadow-md transition-shadow")}>
            <div className="flex items-start">
              <div className={"".concat(template.color, " mr-3 mt-1")}>
                {template.icon}
              </div>
              <div className="flex-1">
                <h4 className={"font-medium ".concat(template.color)}>
                  {template.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
                
                <Button onClick={function () { return handleDownload(template.format); }} disabled={isDownloading} variant="secondary" size="sm" className="mt-3 w-full">
                  {isDownloading ? (<div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Descargando...
                    </div>) : ("Descargar ".concat(template.title))}
                </Button>
              </div>
            </div>
          </div>); })}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              💡 Consejos para usar las plantillas:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Las plantillas incluyen ejemplos de datos reales</li>
              <li>• Mantén la estructura de columnas tal como aparece</li>
              <li>• Los campos obligatorios están claramente marcados</li>
              <li>• Puedes eliminar las filas de ejemplo y agregar tus datos</li>
              {dataType === 'journal_entries' && (<li>• Los asientos deben estar balanceados (débitos = créditos)</li>)}
              {dataType === 'accounts' && (<li>• Los códigos de cuenta deben ser únicos</li>)}
            </ul>
          </div>
        </div>
      </div>
    </Card>);
}
