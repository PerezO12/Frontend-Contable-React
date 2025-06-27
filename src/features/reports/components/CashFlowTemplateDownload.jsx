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
import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { useTemplates } from '@/features/data-import/hooks';
import { useToast } from '@/shared/hooks';
export var CashFlowTemplateDownload = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState('basic'), selectedTemplate = _c[0], setSelectedTemplate = _c[1];
    var _d = useTemplates(), downloadTemplate = _d.downloadTemplate, generateCustomTemplate = _d.generateCustomTemplate, isDownloading = _d.isDownloading;
    var _e = useToast(), success = _e.success, error = _e.error;
    var handleDownload = function (format) { return __awaiter(void 0, void 0, void 0, function () {
        var sampleData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    sampleData = getCashFlowSampleData(selectedTemplate);
                    if (!(format === 'csv' || format === 'json')) return [3 /*break*/, 1];
                    generateCustomTemplate('journal_entries', format, sampleData);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, downloadTemplate({
                        data_type: 'journal_entries',
                        format: format
                    })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    success('Plantilla descargada', "Plantilla de flujo de efectivo ".concat(selectedTemplate, " descargada en formato ").concat(format.toUpperCase()));
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    error('Error de descarga', 'No se pudo descargar la plantilla de flujo de efectivo');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var templates = [
        {
            format: 'csv',
            title: 'CSV',
            description: 'Formato simple compatible con Excel',
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
            description: 'Formato Excel con validaciones incluidas',
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
            description: 'Formato estructurado para sistemas',
            icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>),
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    ];
    var templateTypes = [
        {
            id: 'basic',
            title: 'Básico',
            description: 'Transacciones básicas de flujo de efectivo',
            icon: '📊'
        },
        {
            id: 'detailed',
            title: 'Detallado',
            description: 'Análisis completo con clasificación por actividades',
            icon: '📋'
        },
        {
            id: 'projection',
            title: 'Proyecciones',
            description: 'Plantilla para proyecciones de flujo futuro',
            icon: '🔮'
        }
    ];
    return (<Card className={"p-6 ".concat(className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          💧 Plantillas de Flujo de Efectivo
        </h3>
        <p className="text-sm text-gray-600">
          Descarga plantillas especializadas para importar datos de flujo de efectivo
        </p>
      </div>

      {/* Template Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Plantilla:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templateTypes.map(function (type) { return (<button key={type.id} onClick={function () { return setSelectedTemplate(type.id); }} className={"p-3 rounded-lg border text-left transition-all ".concat(selectedTemplate === type.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300')}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{type.icon}</span>
                <span className="font-medium text-gray-900">{type.title}</span>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>); })}
        </div>
      </div>

      {/* Format Download Options */}
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

      {/* Additional Information */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-amber-600 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-800 mb-2">
              ⚠️ Importante para el flujo de efectivo:
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Las transacciones deben afectar cuentas de efectivo y equivalentes</li>
              <li>• Clasifica las actividades según NIC 7 (Operativas, Inversión, Financiamiento)</li>
              <li>• Los movimientos de efectivo deben ser netos (entrada menos salida)</li>
              <li>• Incluye la conciliación con el saldo inicial y final de efectivo</li>
              <li>• Las proyecciones deben basarse en datos históricos y planes de negocio</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>);
};
// Helper function to generate sample data based on template type
function getCashFlowSampleData(type) {
    var baseDate = new Date().toISOString().split('T')[0];
    var commonData = [
        {
            entry_number: 'CF-2024-001',
            entry_date: baseDate,
            description: 'Cobranza a clientes - Actividad operativa',
            reference: 'COB-001',
            entry_type: 'MANUAL',
            account_code: '1105', // Caja
            line_description: 'Ingreso de efectivo por ventas',
            debit_amount: 1500000,
            credit_amount: '',
            third_party: 'Cliente ABC S.A.S.',
            cost_center: 'VENTAS',
            line_reference: 'COB-001'
        },
        {
            entry_number: 'CF-2024-001',
            entry_date: baseDate,
            description: 'Cobranza a clientes - Actividad operativa',
            reference: 'COB-001',
            entry_type: 'MANUAL',
            account_code: '1305', // Clientes
            line_description: 'Disminución de cartera',
            debit_amount: '',
            credit_amount: 1500000,
            third_party: 'Cliente ABC S.A.S.',
            cost_center: 'VENTAS',
            line_reference: 'COB-001'
        }
    ];
    switch (type) {
        case 'detailed':
            return __spreadArray(__spreadArray([], commonData, true), [
                // Actividad de inversión
                {
                    entry_number: 'CF-2024-002',
                    entry_date: baseDate,
                    description: 'Compra de maquinaria - Actividad de inversión',
                    reference: 'INV-001',
                    entry_type: 'MANUAL',
                    account_code: '1540', // Maquinaria
                    line_description: 'Adquisición de maquinaria industrial',
                    debit_amount: 2500000,
                    credit_amount: '',
                    third_party: 'Proveedor Maquinaria XYZ',
                    cost_center: 'PRODUCCION',
                    line_reference: 'INV-001'
                },
                {
                    entry_number: 'CF-2024-002',
                    entry_date: baseDate,
                    description: 'Compra de maquinaria - Actividad de inversión',
                    reference: 'INV-001',
                    entry_type: 'MANUAL',
                    account_code: '1105', // Caja
                    line_description: 'Salida de efectivo por inversión',
                    debit_amount: '',
                    credit_amount: 2500000,
                    third_party: 'Proveedor Maquinaria XYZ',
                    cost_center: 'PRODUCCION',
                    line_reference: 'INV-001'
                },
                // Actividad de financiamiento
                {
                    entry_number: 'CF-2024-003',
                    entry_date: baseDate,
                    description: 'Préstamo bancario - Actividad de financiamiento',
                    reference: 'FIN-001',
                    entry_type: 'MANUAL',
                    account_code: '1105', // Caja
                    line_description: 'Ingreso por préstamo',
                    debit_amount: 5000000,
                    credit_amount: '',
                    third_party: 'Banco Nacional',
                    cost_center: 'FINANCIERO',
                    line_reference: 'FIN-001'
                },
                {
                    entry_number: 'CF-2024-003',
                    entry_date: baseDate,
                    description: 'Préstamo bancario - Actividad de financiamiento',
                    reference: 'FIN-001',
                    entry_type: 'MANUAL',
                    account_code: '2120', // Préstamos por pagar
                    line_description: 'Obligación financiera',
                    debit_amount: '',
                    credit_amount: 5000000,
                    third_party: 'Banco Nacional',
                    cost_center: 'FINANCIERO',
                    line_reference: 'FIN-001'
                }
            ], false);
        case 'projection':
            var futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 1);
            var projectionDate = futureDate.toISOString().split('T')[0];
            return [
                {
                    entry_number: 'CF-PROJ-001',
                    entry_date: projectionDate,
                    description: 'PROYECCIÓN: Cobranzas esperadas',
                    reference: 'PROJ-COB-001',
                    entry_type: 'PROYECCION',
                    account_code: '1105', // Caja
                    line_description: 'Ingresos proyectados por ventas',
                    debit_amount: 3000000,
                    credit_amount: '',
                    third_party: 'Clientes Varios',
                    cost_center: 'VENTAS',
                    line_reference: 'PROJ-COB-001'
                },
                {
                    entry_number: 'CF-PROJ-001',
                    entry_date: projectionDate,
                    description: 'PROYECCIÓN: Cobranzas esperadas',
                    reference: 'PROJ-COB-001',
                    entry_type: 'PROYECCION',
                    account_code: '4105', // Ingresos proyectados
                    line_description: 'Ventas proyectadas',
                    debit_amount: '',
                    credit_amount: 3000000,
                    third_party: 'Clientes Varios',
                    cost_center: 'VENTAS',
                    line_reference: 'PROJ-COB-001'
                },
                {
                    entry_number: 'CF-PROJ-002',
                    entry_date: projectionDate,
                    description: 'PROYECCIÓN: Pagos operativos esperados',
                    reference: 'PROJ-PAG-001',
                    entry_type: 'PROYECCION',
                    account_code: '5105', // Gastos proyectados
                    line_description: 'Gastos operativos proyectados',
                    debit_amount: 1800000,
                    credit_amount: '',
                    third_party: 'Proveedores Varios',
                    cost_center: 'OPERACIONES',
                    line_reference: 'PROJ-PAG-001'
                },
                {
                    entry_number: 'CF-PROJ-002',
                    entry_date: projectionDate,
                    description: 'PROYECCIÓN: Pagos operativos esperados',
                    reference: 'PROJ-PAG-001',
                    entry_type: 'PROYECCION',
                    account_code: '1105', // Caja
                    line_description: 'Salidas proyectadas operativas',
                    debit_amount: '',
                    credit_amount: 1800000,
                    third_party: 'Proveedores Varios',
                    cost_center: 'OPERACIONES',
                    line_reference: 'PROJ-PAG-001'
                }
            ];
        default: // basic
            return commonData;
    }
}
