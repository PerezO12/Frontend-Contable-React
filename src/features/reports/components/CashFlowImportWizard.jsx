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
import { Card, Button } from '@/components/ui';
import { FileUpload, ImportProgress, ImportResultDetails } from '@/features/data-import/components';
import { CashFlowTemplateDownload } from './CashFlowTemplateDownload';
import { useCashFlowImport } from '../hooks/useCashFlowImport';
export var CashFlowImportWizard = function (_a) {
    var onComplete = _a.onComplete, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState('templates'), currentStep = _c[0], setCurrentStep = _c[1];
    var _d = useState(null), localPreviewData = _d[0], setLocalPreviewData = _d[1];
    var _e = useState(null), localConfiguration = _e[0], setLocalConfiguration = _e[1];
    var _f = useState(null), importResult = _f[0], setImportResult = _f[1];
    var _g = useState(null), importId = _g[0], setImportId = _g[1];
    // Hooks
    var cashFlowImport = useCashFlowImport();
    var handleFileUploaded = function (_file, previewData) { return __awaiter(void 0, void 0, void 0, function () {
        var formattedPreviewData, validatedData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    formattedPreviewData = {
                        detected_format: previewData.detected_format || 'csv',
                        detected_data_type: 'journal_entries',
                        total_rows: previewData.total_rows || 0,
                        preview_data: previewData.preview_data || [],
                        validation_errors: previewData.validation_errors || [],
                        column_mapping: previewData.column_mapping || {},
                        recommendations: previewData.recommendations || []
                    };
                    return [4 /*yield*/, cashFlowImport.validateCashFlowData(formattedPreviewData)];
                case 1:
                    validatedData = _a.sent();
                    setLocalPreviewData(validatedData);
                    setCurrentStep('preview');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error validating cash flow data:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleStartImport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!localConfiguration)
                        return [2 /*return*/];
                    setCurrentStep('importing');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cashFlowImport.importCashFlowData(localConfiguration)];
                case 2:
                    result = _a.sent();
                    setImportResult(result);
                    setImportId(result.import_id || 'temp-id');
                    setCurrentStep('result');
                    if (onComplete) {
                        onComplete(result);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error importing cash flow data:', error_2);
                    setCurrentStep('configure');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleImportComplete = function (result) {
        setImportResult(result);
        setCurrentStep('result');
        if (onComplete) {
            onComplete(result);
        }
    };
    var handleStartOver = function () {
        setCurrentStep('templates');
        setLocalPreviewData(null);
        setLocalConfiguration(null);
        setImportResult(null);
        setImportId(null);
        cashFlowImport.resetValidation();
    };
    var handleSkipTemplates = function () {
        setCurrentStep('upload');
    };
    var steps = [
        { id: 'templates', title: 'Plantillas', icon: '📋' },
        { id: 'upload', title: 'Cargar', icon: '📁' },
        { id: 'preview', title: 'Previsualizar', icon: '👀' },
        { id: 'configure', title: 'Configurar', icon: '⚙️' },
        { id: 'importing', title: 'Importando', icon: '⏳' },
        { id: 'result', title: 'Resultado', icon: '✅' }
    ];
    var currentStepIndex = steps.findIndex(function (step) { return step.id === currentStep; });
    return (<div className={"space-y-6 ".concat(className)}>
      {/* Progress Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {steps.map(function (step, index) { return (<div key={step.id} className="flex items-center">
              <div className={"\n                flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium\n                ".concat(index <= currentStepIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600', "\n              ")}>
                {index < currentStepIndex ? (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>) : (<span>{step.icon}</span>)}
              </div>
              
              <div className="ml-3 min-w-0">
                <p className={"text-sm font-medium ".concat(index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500')}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (<div className={"\n                  flex-1 h-0.5 mx-4\n                  ".concat(index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200', "\n                ")}/>)}
            </div>); })}
        </div>
      </Card>

      {/* Step Content */}
      {currentStep === 'templates' && (<div className="space-y-6">
          <CashFlowTemplateDownload />
          
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Ya tienes tu archivo listo?
              </h3>
              <p className="text-gray-600 mb-4">
                Si ya descargaste y completaste una plantilla de flujo de efectivo, continúa con la carga del archivo
              </p>
              <Button onClick={handleSkipTemplates} variant="primary">
                Continuar a Carga de Archivo
              </Button>
            </div>
          </Card>
        </div>)}

      {currentStep === 'upload' && (<div className="space-y-6">
          <FileUpload dataType="journal_entries" onFileUploaded={handleFileUploaded}/>
          
          <div className="flex justify-start">
            <Button onClick={function () { return setCurrentStep('templates'); }} variant="secondary">
              ← Volver a Plantillas
            </Button>
          </div>
        </div>)}      {currentStep === 'preview' && localPreviewData && (<div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Vista Previa de Datos
            </h3>
            <p className="text-gray-600 mb-4">
              Se encontraron {localPreviewData.total_rows} filas para importar
            </p>
            <div className="flex space-x-3">
              <Button onClick={function () { return setCurrentStep('configure'); }} variant="primary">
                Continuar →
              </Button>
              <Button onClick={function () { return setCurrentStep('upload'); }} variant="secondary">
                ← Volver
              </Button>
            </div>
          </Card>
          
          {/* Cash Flow Validation Metrics */}
          {cashFlowImport.validationMetrics && (<Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💧 Validación de Flujo de Efectivo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Cuentas de Efectivo</div>
                  <div className="text-xl font-bold text-blue-900">
                    {cashFlowImport.validationMetrics.cashAccountsPercentage}%
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Clasificación de Actividades</div>
                  <div className="text-xl font-bold text-green-900">
                    {cashFlowImport.validationMetrics.activityClassificationPercentage}%
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">Montos Válidos</div>
                  <div className="text-xl font-bold text-purple-900">
                    {cashFlowImport.validationMetrics.validAmountsPercentage}%
                  </div>
                </div>
              </div>
              
              {cashFlowImport.importRecommendations.length > 0 && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">💡 Recomendaciones:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {cashFlowImport.importRecommendations.map(function (recommendation, index) { return (<li key={index}>• {recommendation}</li>); })}
                  </ul>
                </div>)}
            </Card>)}
        </div>)}

      {currentStep === 'configure' && localPreviewData && (<div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ⚙️ Configuración de Importación
            </h3>
            <p className="text-gray-600 mb-4">
              Configura los parámetros para la importación de flujo de efectivo
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Validación
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue="strict">
                  <option value="strict">Estricto (Recomendado para flujo de efectivo)</option>
                  <option value="tolerant">Tolerante</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="skipDuplicates" defaultChecked className="mr-2"/>
                <label htmlFor="skipDuplicates" className="text-sm text-gray-700">
                  Omitir duplicados
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleStartImport} variant="primary">
                Iniciar Importación
              </Button>
              <Button onClick={function () { return setCurrentStep('preview'); }} variant="secondary">
                ← Volver
              </Button>
            </div>
          </Card>
        </div>)}      {currentStep === 'importing' && importId && (<ImportProgress importId={importId} onComplete={handleImportComplete} onCancel={handleStartOver}/>)}

      {currentStep === 'result' && importResult && (<div className="space-y-6">
          <ImportResultDetails importResult={importResult}/>
        </div>)}
    </div>);
};
