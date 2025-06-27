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
import { FileUpload, DataPreview, ImportConfigurationPanel, TemplateDownload } from '../components';
import { useDataImport } from '../hooks';
export function DataImportPage(_a) {
    var _this = this;
    var _b, _c;
    var dataType = _a.dataType;
    var _d = useState('upload'), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = useDataImport(), previewData = _e.previewData, configuration = _e.configuration, importResult = _e.importResult, isLoading = _e.isLoading, resetState = _e.resetState, updateConfiguration = _e.updateConfiguration, importFromFile = _e.importFromFile, canImport = _e.canImport;
    var getDataTypeLabel = function (type) {
        return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
    };
    var handleContinueToConfiguration = function () {
        setCurrentStep('configure');
    };
    var handleImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!configuration)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, importFromFile(new File([], 'dummy'), configuration)];
                case 2:
                    _a.sent();
                    setCurrentStep('result');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Import failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleStartOver = function () {
        resetState();
        setCurrentStep('upload');
    };
    var steps = [
        { id: 'upload', title: 'Cargar Archivo', description: 'Selecciona el archivo a importar' },
        { id: 'preview', title: 'Vista Previa', description: 'Revisa los datos detectados' },
        { id: 'configure', title: 'Configurar', description: 'Ajusta las opciones de importación' },
        { id: 'result', title: 'Resultado', description: 'Revisa el resultado de la importación' }
    ];
    var currentStepIndex = steps.findIndex(function (step) { return step.id === currentStep; });
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Importar {getDataTypeLabel(dataType)}
        </h1>
        <p className="text-gray-600 mt-2">
          Importa datos de forma masiva desde archivos CSV, Excel o JSON
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map(function (step, stepIdx) { return (<li key={step.id} className={"relative ".concat(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '')}>
                <div className="flex items-center">
                  <div className={"\n                    relative flex h-8 w-8 items-center justify-center rounded-full border-2\n                    ".concat(stepIdx <= currentStepIndex
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-500', "\n                  ")}>
                    {stepIdx < currentStepIndex ? (<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>) : (<span className="text-sm font-medium">{stepIdx + 1}</span>)}
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className={"text-sm font-medium ".concat(stepIdx <= currentStepIndex ? 'text-blue-600' : 'text-gray-500')}>
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
                {stepIdx !== steps.length - 1 && (<div className="absolute top-4 right-0 hidden h-0.5 w-full bg-gray-200 sm:block" aria-hidden="true">
                    <div className={"h-0.5 ".concat(stepIdx < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200')} style={{ width: stepIdx < currentStepIndex ? '100%' : '0%' }}/>
                  </div>)}
              </li>); })}
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Template Download - Always visible */}
        <TemplateDownload dataType={dataType}/>

        {/* Step Content */}        {currentStep === 'upload' && (<FileUpload dataType={dataType} onFileUploaded={function (_previewData) {
                setCurrentStep('preview');
            }}/>)}

        {currentStep === 'preview' && previewData && (<div className="space-y-6">
            <DataPreview previewData={previewData}/>
            
            <div className="flex justify-between">
              <button onClick={handleStartOver} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cambiar Archivo
              </button>
              
              <button onClick={handleContinueToConfiguration} disabled={!canImport} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Continuar a Configuración
              </button>
            </div>
          </div>)}

        {currentStep === 'configure' && configuration && (<div className="space-y-6">
            <ImportConfigurationPanel configuration={configuration} onConfigurationChange={updateConfiguration} onImport={handleImport} canImport={canImport || false} isLoading={isLoading}/>
            
            <div className="flex justify-between">
              <button onClick={function () { return setCurrentStep('preview'); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Volver a Vista Previa
              </button>
            </div>
          </div>)}

        {currentStep === 'result' && importResult && (<div className="space-y-6">
            {/* Result Summary */}
            <div className={"p-6 rounded-lg border ".concat(importResult.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : importResult.status === 'partial'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200')}>
              <div className="flex items-center">
                <div className={"rounded-full p-2 mr-4 ".concat(importResult.status === 'completed'
                ? 'bg-green-100'
                : importResult.status === 'partial'
                    ? 'bg-yellow-100'
                    : 'bg-red-100')}>
                  {importResult.status === 'completed' ? (<svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>) : importResult.status === 'partial' ? (<svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>) : (<svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>)}
                </div>
                <div>
                  <h3 className={"text-lg font-semibold ".concat(importResult.status === 'completed'
                ? 'text-green-800'
                : importResult.status === 'partial'
                    ? 'text-yellow-800'
                    : 'text-red-800')}>
                    {importResult.status === 'completed'
                ? 'Importación Completada'
                : importResult.status === 'partial'
                    ? 'Importación Parcial'
                    : 'Importación Fallida'}
                  </h3>
                  <p className={"text-sm ".concat(importResult.status === 'completed'
                ? 'text-green-600'
                : importResult.status === 'partial'
                    ? 'text-yellow-600'
                    : 'text-red-600')}>
                    {importResult.summary.successful_rows} de {importResult.summary.total_rows} filas procesadas exitosamente
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Total Procesadas</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {importResult.summary.total_rows.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800">Exitosas</p>
                <p className="text-2xl font-semibold text-green-900">
                  {importResult.summary.successful_rows.toLocaleString()}
                </p>
              </div>
                <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-red-800">Fallidas</p>
                <p className="text-2xl font-semibold text-red-900">
                  {((_b = importResult.summary.error_rows) !== null && _b !== void 0 ? _b : 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Advertencias</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {((_c = importResult.summary.warning_rows) !== null && _c !== void 0 ? _c : 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button onClick={handleStartOver} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Nueva Importación
              </button>
              
              <button onClick={function () {
                // Navegar al listado correspondiente
                if (dataType === 'accounts') {
                    window.location.href = '/accounts';
                }
                else {
                    window.location.href = '/journal-entries';
                }
            }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Ver {getDataTypeLabel(dataType)} Importadas
              </button>
            </div>
          </div>)}
      </div>
    </div>);
}
