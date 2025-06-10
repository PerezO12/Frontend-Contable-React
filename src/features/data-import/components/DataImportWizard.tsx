import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { 
  FileUpload, 
  DataPreview, 
  ImportConfigurationPanel, 
  TemplateDownload,
  ImportProgress,
  ImportResultDetails
} from '../components';
import { useDataImport } from '../hooks';
import type { ImportPreviewData, ImportConfiguration } from '../types';

interface DataImportWizardProps {
  dataType: 'accounts' | 'journal_entries';
  onComplete?: (result: any) => void;
  className?: string;
}

type WizardStep = 'templates' | 'upload' | 'preview' | 'configure' | 'importing' | 'result';

export function DataImportWizard({
  dataType, 
  onComplete,
  className = '' 
}: DataImportWizardProps) {  const [currentStep, setCurrentStep] = useState<WizardStep>('templates');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [localPreviewData, setLocalPreviewData] = useState<ImportPreviewData | null>(null);
  const [localConfiguration, setLocalConfiguration] = useState<ImportConfiguration | null>(null);  const {
    previewData,
    configuration,
    importResult,
    isLoading,
    errors,
    resetState,
    updateConfiguration,
    importFromFile,
    hasErrors,
    hasWarnings
  } = useDataImport();

  const getDataTypeLabel = (type: string) => {
    return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
  };  const handleFileUploaded = (file: File, previewDataFromUpload: ImportPreviewData) => {
    console.log('DataImportWizard - handleFileUploaded called with file:', file.name);
    console.log('DataImportWizard - handleFileUploaded called with preview data:', previewDataFromUpload);
    console.log('DataImportWizard - current previewData from hook:', previewData);
    console.log('DataImportWizard - current step before change:', currentStep);
    
    // Guardar el archivo y los datos de previsualización
    setUploadedFile(file);
    setLocalPreviewData(previewDataFromUpload);
    
    // Crear configuración local predeterminada completa
    const defaultConfig: ImportConfiguration = {
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
  const handleContinueToConfiguration = () => {
    setCurrentStep('configure');
  };

  const handleConfigurationChange = (config: Partial<ImportConfiguration>) => {
    if (localConfiguration) {
      setLocalConfiguration({ ...localConfiguration, ...config });
    } else if (configuration) {
      updateConfiguration(config);
    }
  };  const handleStartImport = async () => {
    console.log('🎯 === INICIANDO IMPORTACIÓN DESDE WIZARD ===');
    console.log('📁 Archivo subido:', uploadedFile);
    console.log('⚙️ Configuración para importar:', displayConfiguration);
    
    if (!uploadedFile || !displayConfiguration) {
      console.log('❌ Faltan datos para importar:');
      console.log('  - uploadedFile:', !!uploadedFile);
      console.log('  - displayConfiguration:', !!displayConfiguration);
      return;
    }

    console.log('📊 Configuración completa a enviar:', JSON.stringify(displayConfiguration, null, 2));
    console.log('📁 Archivo a enviar:', {
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type
    });

    setCurrentStep('importing');

    try {
      console.log('🚀 Llamando a importFromFile...');
      const result = await importFromFile(uploadedFile, displayConfiguration);
      console.log('✅ Resultado de importación recibido:', result);
      
      setImportId(result.import_id);
      
      // Si la importación es inmediata (no en background), ir directamente al resultado
      if (result.status === 'completed' || result.status === 'failed' || result.status === 'partial') {
        console.log('✅ Importación completada inmediatamente, cambiando a resultado');
        setCurrentStep('result');
        onComplete?.(result);
      } else {
        console.log('⏳ Importación en progreso, status:', result.status);
      }
    } catch (error) {
      console.error('❌ Error durante importación:', error);
      console.log('🔙 Regresando al paso de configuración');
      setCurrentStep('configure');
    }
  };

  const handleImportComplete = (result: any) => {
    setCurrentStep('result');
    onComplete?.(result);
  };  const handleStartOver = () => {
    resetState();
    setCurrentStep('templates');
    setUploadedFile(null);
    setImportId(null);
    setLocalPreviewData(null);
    setLocalConfiguration(null);
  };  const handleSkipTemplates = () => {
    setCurrentStep('upload');
  };

  // Use localPreviewData if available, fallback to hook previewData
  const displayPreviewData = localPreviewData || previewData;
    // Use local configuration if available, otherwise use hook configuration or generate default
  const displayConfiguration = localConfiguration || configuration || (localPreviewData ? {
    data_type: dataType,
    validation_level: 'strict' as const,
    batch_size: 100,
    format: (localPreviewData.detected_format || 'csv') as 'csv' | 'xlsx' | 'json',
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
  const localValidationErrors = localPreviewData?.validation_errors || errors;
  const localHasErrors = localValidationErrors.some((e: any) => e.severity === 'error');
  const localCanImport = displayPreviewData && !localHasErrors;

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

  const steps = [
    { id: 'templates', title: 'Plantillas', icon: '📋' },
    { id: 'upload', title: 'Cargar', icon: '📁' },
    { id: 'preview', title: 'Previsualizar', icon: '👀' },
    { id: 'configure', title: 'Configurar', icon: '⚙️' },
    { id: 'importing', title: 'Importando', icon: '⏳' },
    { id: 'result', title: 'Resultado', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={`space-y-6 ${className}`}>
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
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                ${index <= currentStepIndex 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index < currentStepIndex ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${
                  index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      {currentStep === 'templates' && (
        <div className="space-y-6">
          <TemplateDownload dataType={dataType} />
          
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
        </div>
      )}

      {currentStep === 'upload' && (
        <div className="space-y-6">
          <FileUpload
            dataType={dataType}
            onFileUploaded={handleFileUploaded}
          />
          
          <div className="flex justify-start">
            <Button 
              onClick={() => setCurrentStep('templates')} 
              variant="secondary"
            >
              ← Volver a Plantillas
            </Button>
          </div>
        </div>
      )}      {currentStep === 'preview' && (
        <div className="space-y-6">
          {displayPreviewData ? (
            <>
              <DataPreview previewData={displayPreviewData} />
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Resumen de Validación
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      {hasErrors && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Errores encontrados
                        </span>
                      )}
                      {hasWarnings && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Advertencias encontradas
                        </span>
                      )}
                      {!hasErrors && !hasWarnings && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Validación exitosa
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => setCurrentStep('upload')} 
                      variant="secondary"
                    >
                      ← Cambiar Archivo
                    </Button>
                    
                    <Button
                      onClick={handleContinueToConfiguration}
                      disabled={hasErrors}
                      variant="primary"
                    >
                      {hasErrors ? 'Corrija los errores primero' : 'Continuar →'}
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Procesando vista previa...</p>
              </div>
            </Card>
          )}
        </div>
      )}      {currentStep === 'configure' && displayConfiguration && (
        <div className="space-y-6">          <ImportConfigurationPanel
            configuration={displayConfiguration}
            onConfigurationChange={handleConfigurationChange}
            onImport={handleStartImport}
            canImport={localCanImport || false}
            isLoading={isLoading}
          />
          
          <div className="flex justify-start">
            <Button 
              onClick={() => setCurrentStep('preview')} 
              variant="secondary"
            >
              ← Volver a Vista Previa
            </Button>
          </div>
        </div>
      )}

      {currentStep === 'importing' && importId && (
        <ImportProgress
          importId={importId}
          onComplete={handleImportComplete}
          onCancel={handleStartOver}
        />
      )}

      {currentStep === 'result' && importResult && (
        <div className="space-y-6">
          {/* Result Summary */}
          <Card className={`p-6 ${
            importResult.status === 'completed' 
              ? 'bg-green-50 border-green-200' 
              : importResult.status === 'partial'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`rounded-full p-3 mr-4 ${
                importResult.status === 'completed'
                  ? 'bg-green-100'
                  : importResult.status === 'partial'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}>
                {importResult.status === 'completed' ? (
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : importResult.status === 'partial' ? (
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${
                  importResult.status === 'completed'
                    ? 'text-green-800'
                    : importResult.status === 'partial'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {importResult.status === 'completed' 
                    ? '¡Importación Completada!'
                    : importResult.status === 'partial'
                    ? 'Importación Parcialmente Exitosa'
                    : 'Importación Fallida'
                  }
                </h3>                <p className={`text-lg ${
                  importResult.status === 'completed'
                    ? 'text-green-600'
                    : importResult.status === 'partial'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {importResult.summary.successful_rows} de {importResult.summary.total_rows} registros procesados exitosamente
                </p>
              </div>            </div>
          </Card>

          {/* Mensaje informativo sobre filas omitidas */}
          {(importResult.summary?.skipped_rows || 0) > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
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
            </Card>
          )}

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-blue-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {(importResult.summary?.total_rows || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-blue-800">Total Procesadas</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-green-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {(importResult.summary?.successful_rows || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-green-800">Exitosas</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-red-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {(importResult.summary?.error_rows || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-red-800">Con Errores</p>
              </div>
            </Card>
              <Card className="p-4 bg-yellow-50">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {(importResult.summary?.warning_rows || 0).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-yellow-800">Con Advertencias</p>
              </div>
            </Card>

            {/* Mostrar filas omitidas si las hay */}
            {(importResult.summary?.skipped_rows || 0) > 0 && (
              <Card className="p-4 bg-blue-50">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {(importResult.summary?.skipped_rows || 0).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-blue-800">Omitidas</p>
                </div>
              </Card>
            )}
          </div>

          {/* Estadísticas adicionales si hay entidades creadas */}
          {(importResult.summary.accounts_created > 0 || importResult.summary.accounts_updated > 0 || importResult.summary.journal_entries_created > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {importResult.summary.accounts_created > 0 && (
                <Card className="p-4 bg-emerald-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {importResult.summary.accounts_created.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-emerald-800">Cuentas Creadas</p>
                  </div>
                </Card>
              )}
              
              {importResult.summary.accounts_updated > 0 && (
                <Card className="p-4 bg-indigo-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {importResult.summary.accounts_updated.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-indigo-800">Cuentas Actualizadas</p>
                  </div>
                </Card>
              )}
              
              {importResult.summary.journal_entries_created > 0 && (
                <Card className="p-4 bg-purple-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {importResult.summary.journal_entries_created.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-purple-800">Asientos Creados</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Información de tiempo de procesamiento */}
          <Card className="p-4 bg-gray-50">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Tiempo de Procesamiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {importResult.summary.processing_time_seconds.toFixed(3)}s
              </p>
              <p className="text-sm text-gray-600">
                {importResult.summary.total_rows > 0 && 
                  `${(importResult.summary.processing_time_seconds / importResult.summary.total_rows * 1000).toFixed(1)}ms por fila`
                }
              </p>
            </div>
          </Card>

          {/* Detalles de errores y warnings */}
          <ImportResultDetails importResult={importResult} />

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
                <Button 
                  onClick={handleStartOver}
                  variant="secondary"
                >
                  Nueva Importación
                </Button>
                
                <Button
                  onClick={() => {
                    if (dataType === 'accounts') {
                      window.location.href = '/accounts';
                    } else {
                      window.location.href = '/journal-entries';
                    }
                  }}
                  variant="primary"
                >
                  Ver {getDataTypeLabel(dataType)}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
