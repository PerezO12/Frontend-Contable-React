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
import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { FileUpload, DataPreview, ImportConfigurationPanel, TemplateDownload, ImportProgress, ImportResultDetails } from '../components';
import { useDataImport } from '../hooks';
export function DataImportWizard(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h;
    var dataType = _a.dataType, onComplete = _a.onComplete, _j = _a.className, className = _j === void 0 ? '' : _j;
    var _k = useState('templates'), currentStep = _k[0], setCurrentStep = _k[1];
    var _l = useState(null), uploadedFile = _l[0], setUploadedFile = _l[1];
    var _m = useState(null), importId = _m[0], setImportId = _m[1];
    var _o = useState(null), localPreviewData = _o[0], setLocalPreviewData = _o[1];
    var _p = useState(null), localConfiguration = _p[0], setLocalConfiguration = _p[1];
    var _q = useDataImport(), previewData = _q.previewData, configuration = _q.configuration, importResult = _q.importResult, isLoading = _q.isLoading, errors = _q.errors, resetState = _q.resetState, updateConfiguration = _q.updateConfiguration, importFromFile = _q.importFromFile, hasErrors = _q.hasErrors, hasWarnings = _q.hasWarnings;
    var getDataTypeLabel = function (type) {
        return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
    };
    var handleFileUploaded = function (file, previewDataFromUpload) {
        console.log('DataImportWizard - handleFileUploaded called with file:', file.name);
        console.log('DataImportWizard - handleFileUploaded called with preview data:', previewDataFromUpload);
        console.log('DataImportWizard - current previewData from hook:', previewData);
        console.log('DataImportWizard - current step before change:', currentStep);
        // Guardar el archivo y los datos de previsualización
        setUploadedFile(file);
        setLocalPreviewData(previewDataFromUpload);
        // Crear configuración local predeterminada completa
        var defaultConfig = {
            data_type: dataType,
            validation_level: 'strict',
            batch_size: 100,
            format: previewDataFromUpload.detected_format || 'csv',
            skip_duplicates: true,
            update_existing: false,
            continue_on_error: false,
            csv_delimiter: ',',
            csv_encoding: 'utf-8',
            xlsx_sheet_name: null,
            xlsx_header_row: 1
        };
        setLocalConfiguration(defaultConfig);
        setCurrentStep('preview');
        console.log('DataImportWizard - file set and step changed to preview');
    };
    var handleContinueToConfiguration = function () {
        setCurrentStep('configure');
    };
    var handleConfigurationChange = function (config) {
        if (localConfiguration) {
            setLocalConfiguration(__assign(__assign({}, localConfiguration), config));
        }
        else if (configuration) {
            updateConfiguration(config);
        }
    };
    var handleStartImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎯 === INICIANDO IMPORTACIÓN DESDE WIZARD ===');
                    console.log('📁 Archivo subido:', uploadedFile);
                    console.log('⚙️ Configuración para importar:', displayConfiguration);
                    if (!uploadedFile || !displayConfiguration) {
                        console.log('❌ Faltan datos para importar:');
                        console.log('  - uploadedFile:', !!uploadedFile);
                        console.log('  - displayConfiguration:', !!displayConfiguration);
                        return [2 /*return*/];
                    }
                    console.log('📊 Configuración completa a enviar:', JSON.stringify(displayConfiguration, null, 2));
                    console.log('📁 Archivo a enviar:', {
                        name: uploadedFile.name,
                        size: uploadedFile.size,
                        type: uploadedFile.type
                    });
                    setCurrentStep('importing');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('🚀 Llamando a importFromFile...');
                    return [4 /*yield*/, importFromFile(uploadedFile, displayConfiguration)];
                case 2:
                    result = _a.sent();
                    console.log('✅ Resultado de importación recibido:', result);
                    setImportId(result.import_id);
                    // Si la importación es inmediata (no en background), ir directamente al resultado
                    if (result.status === 'completed' || result.status === 'failed' || result.status === 'partial') {
                        console.log('✅ Importación completada inmediatamente, cambiando a resultado');
                        setCurrentStep('result');
                        onComplete === null || onComplete === void 0 ? void 0 : onComplete(result);
                    }
                    else {
                        console.log('⏳ Importación en progreso, status:', result.status);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Error durante importación:', error_1);
                    console.log('🔙 Regresando al paso de configuración');
                    setCurrentStep('configure');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleImportComplete = function (result) {
        setCurrentStep('result');
        onComplete === null || onComplete === void 0 ? void 0 : onComplete(result);
    };
    var handleStartOver = function () {
        resetState();
        setCurrentStep('templates');
        setUploadedFile(null);
        setImportId(null);
        setLocalPreviewData(null);
        setLocalConfiguration(null);
    };
    var handleSkipTemplates = function () {
        setCurrentStep('upload');
    };
    // Use localPreviewData if available, fallback to hook previewData
    var displayPreviewData = localPreviewData || previewData;
    // Use local configuration if available, otherwise use hook configuration or generate default
    var displayConfiguration = localConfiguration || configuration || (localPreviewData ? {
        data_type: dataType,
        validation_level: 'strict',
        batch_size: 100,
        format: (localPreviewData.detected_format || 'csv'),
        skip_duplicates: true,
        update_existing: false,
        continue_on_error: false,
        csv_delimiter: ',',
        csv_encoding: 'utf-8',
        xlsx_sheet_name: null,
        xlsx_header_row: 1
    } : null);
    // Calculate local canImport based on available data
    // Check for errors from localPreviewData or hook errors
    var localValidationErrors = (localPreviewData === null || localPreviewData === void 0 ? void 0 : localPreviewData.validation_errors) || errors;
    var localHasErrors = localValidationErrors.some(function (e) { return e.severity === 'error'; });
    var localCanImport = displayPreviewData && !localHasErrors;
    // Debug logging
    console.log('DataImportWizard render - currentStep:', currentStep);
    console.log('DataImportWizard render - previewData from hook:', previewData);
    console.log('DataImportWizard render - localPreviewData:', localPreviewData);
    console.log('DataImportWizard render - configuration from hook:', configuration);
    console.log('DataImportWizard render - localConfiguration:', localConfiguration);
    console.log('DataImportWizard render - errors from hook:', errors);
    console.log('DataImportWizard render - localValidationErrors:', localValidationErrors);
    console.log('DataImportWizard render - localHasErrors:', localHasErrors);
    console.log('DataImportWizard render - hasErrors:', hasErrors);
    console.log('DataImportWizard render - localCanImport:', localCanImport);
    console.log('DataImportWizard render - isLoading:', isLoading);
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Asistente de Importación - {getDataTypeLabel(dataType)}
          </h2>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Paso {Math.min(currentStepIndex + 1, steps.length - 1)} de {steps.length - 1}</span>
          </div>
        </div>

        {/* Progress Steps */}
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
          <TemplateDownload dataType={dataType}/>
          
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Ya tienes tu archivo listo?
              </h3>
              <p className="text-gray-600 mb-4">
                Si ya descargaste y completaste una plantilla, continúa con la carga del archivo
              </p>
              <Button onClick={handleSkipTemplates} variant="primary">
                Continuar a Carga de Archivo
              </Button>
            </div>
          </Card>
        </div>)}

      {currentStep === 'upload' && (<div className="space-y-6">
          <FileUpload dataType={dataType} onFileUploaded={handleFileUploaded}/>
          
          <div className="flex justify-start">
            <Button onClick={function () { return setCurrentStep('templates'); }} variant="secondary">
              ← Volver a Plantillas
            </Button>
          </div>
        </div>)}      {currentStep === 'preview' && (<div className="space-y-6">
          {displayPreviewData ? (<>
              <DataPreview previewData={displayPreviewData}/>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Resumen de Validación
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      {hasErrors && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Errores encontrados
                        </span>)}
                      {hasWarnings && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Advertencias encontradas
                        </span>)}
                      {!hasErrors && !hasWarnings && (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Validación exitosa
                        </span>)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button onClick={function () { return setCurrentStep('upload'); }} variant="secondary">
                      ← Cambiar Archivo
                    </Button>
                    
                    <Button onClick={handleContinueToConfiguration} disabled={hasErrors} variant="primary">
                      {hasErrors ? 'Corrija los errores primero' : 'Continuar →'}
                    </Button>
                  </div>
                </div>
              </Card>
            </>) : (<Card className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Procesando vista previa...</p>
              </div>
            </Card>)}
        </div>)}      {currentStep === 'configure' && displayConfiguration && (<div className="space-y-6">          <ImportConfigurationPanel configuration={displayConfiguration} onConfigurationChange={handleConfigurationChange} onImport={handleStartImport} canImport={localCanImport || false} isLoading={isLoading}/>
          
          <div className="flex justify-start">
            <Button onClick={function () { return setCurrentStep('preview'); }} variant="secondary">
              ← Volver a Vista Previa
            </Button>
          </div>
        </div>)}

      {currentStep === 'importing' && importId && (<ImportProgress importId={importId} onComplete={handleImportComplete} onCancel={handleStartOver}/>)}

      {currentStep === 'result' && importResult && (<div className="space-y-6">
          {/* Result Summary */}
          <Card className={"p-6 ".concat(importResult.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : importResult.status === 'partial'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200')}>
            <div className="flex items-center">
              <div className={"rounded-full p-3 mr-4 ".concat(importResult.status === 'completed'
                ? 'bg-green-100'
                : importResult.status === 'partial'
                    ? 'bg-yellow-100'
                    : 'bg-red-100')}>
                {importResult.status === 'completed' ? (<svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>) : importResult.status === 'partial' ? (<svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>) : (<svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>)}
              </div>
              <div>
                <h3 className={"text-2xl font-bold ".concat(importResult.status === 'completed'
                ? 'text-green-800'
                : importResult.status === 'partial'
                    ? 'text-yellow-800'
                    : 'text-red-800')}>
                  {importResult.status === 'completed'
                ? '¡Importación Completada!'
                : importResult.status === 'partial'
                    ? 'Importación Parcialmente Exitosa'
                    : 'Importación Fallida'}
                </h3>                <p className={"text-lg ".concat(importResult.status === 'completed'
                ? 'text-green-600'
                : importResult.status === 'partial'
                    ? 'text-yellow-600'
                    : 'text-red-600')}>
                  {importResult.summary.successful_rows} de {importResult.summary.total_rows} registros procesados exitosamente
                </p>
              </div>            </div>
          </Card>

          {/* Mensaje informativo sobre filas omitidas */}
          {(((_b = importResult.summary) === null || _b === void 0 ? void 0 : _b.skipped_rows) || 0) > 0 && (<Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Filas Omitidas Detectadas
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {importResult.summary.skipped_rows} fila{importResult.summary.skipped_rows !== 1 ? 's fueron omitidas' : ' fue omitida'} porque ya exist{importResult.summary.skipped_rows !== 1 ? 'ían registros' : 'ía un registro'} con el mismo código y la configuración está establecida para omitir duplicados.
                  </p>
                </div>
              </div>
            </Card>)}

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-blue-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {(((_c = importResult.summary) === null || _c === void 0 ? void 0 : _c.total_rows) || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-blue-800">Total Procesadas</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-green-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {(((_d = importResult.summary) === null || _d === void 0 ? void 0 : _d.successful_rows) || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-green-800">Exitosas</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-red-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {(((_e = importResult.summary) === null || _e === void 0 ? void 0 : _e.error_rows) || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-red-800">Con Errores</p>
              </div>
            </Card>
              <Card className="p-4 bg-yellow-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {(((_f = importResult.summary) === null || _f === void 0 ? void 0 : _f.warning_rows) || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-yellow-800">Con Advertencias</p>
              </div>
            </Card>

            {/* Mostrar filas omitidas si las hay */}
            {(((_g = importResult.summary) === null || _g === void 0 ? void 0 : _g.skipped_rows) || 0) > 0 && (<Card className="p-4 bg-blue-50">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {(((_h = importResult.summary) === null || _h === void 0 ? void 0 : _h.skipped_rows) || 0).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-blue-800">Omitidas</p>
                </div>
              </Card>)}
          </div>

          {/* Estadísticas adicionales si hay entidades creadas */}
          {(importResult.summary.accounts_created > 0 || importResult.summary.accounts_updated > 0 || importResult.summary.journal_entries_created > 0) && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {importResult.summary.accounts_created > 0 && (<Card className="p-4 bg-emerald-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {importResult.summary.accounts_created.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-emerald-800">Cuentas Creadas</p>
                  </div>
                </Card>)}
              
              {importResult.summary.accounts_updated > 0 && (<Card className="p-4 bg-indigo-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {importResult.summary.accounts_updated.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-indigo-800">Cuentas Actualizadas</p>
                  </div>
                </Card>)}
              
              {importResult.summary.journal_entries_created > 0 && (<Card className="p-4 bg-purple-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {importResult.summary.journal_entries_created.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-purple-800">Asientos Creados</p>
                  </div>
                </Card>)}
            </div>)}

          {/* Información de tiempo de procesamiento */}
          <Card className="p-4 bg-gray-50">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Tiempo de Procesamiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {importResult.summary.processing_time_seconds.toFixed(3)}s
              </p>
              <p className="text-sm text-gray-600">
                {importResult.summary.total_rows > 0 &&
                "".concat((importResult.summary.processing_time_seconds / importResult.summary.total_rows * 1000).toFixed(1), "ms por fila")}
              </p>
            </div>
          </Card>

          {/* Detalles de errores y warnings */}
          <ImportResultDetails importResult={importResult}/>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">¿Qué hacer ahora?</h4>
                <p className="text-gray-600">
                  Puedes realizar otra importación o revisar los datos importados
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleStartOver} variant="secondary">
                  Nueva Importación
                </Button>
                
                <Button onClick={function () {
                if (dataType === 'accounts') {
                    window.location.href = '/accounts';
                }
                else {
                    window.location.href = '/journal-entries';
                }
            }} variant="primary">
                  Ver {getDataTypeLabel(dataType)}
                </Button>
              </div>
            </div>
          </Card>
        </div>)}
    </div>);
}
