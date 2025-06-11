import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { 
  FileUpload, 
  ImportProgress,
  ImportResultDetails
} from '@/features/data-import/components';
import { CashFlowTemplateDownload } from './CashFlowTemplateDownload';
import { useCashFlowImport } from '../hooks/useCashFlowImport';
import type { ImportPreviewData, ImportConfiguration } from '@/features/data-import/types';

interface CashFlowImportWizardProps {
  onComplete?: (result: any) => void;
  className?: string;
}

type WizardStep = 'templates' | 'upload' | 'preview' | 'configure' | 'importing' | 'result';

export const CashFlowImportWizard: React.FC<CashFlowImportWizardProps> = ({
  onComplete,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('templates');  const [localPreviewData, setLocalPreviewData] = useState<ImportPreviewData | null>(null);
  const [localConfiguration, setLocalConfiguration] = useState<ImportConfiguration | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importId, setImportId] = useState<string | null>(null);

  // Hooks
  const cashFlowImport = useCashFlowImport();
  const handleFileUploaded = async (_file: File, previewData: any) => {
    try {
      // Convert the preview data to the expected format
      const formattedPreviewData: ImportPreviewData = {
        detected_format: previewData.detected_format || 'csv',
        detected_data_type: 'journal_entries',
        total_rows: previewData.total_rows || 0,
        preview_data: previewData.preview_data || [],
        validation_errors: previewData.validation_errors || [],
        column_mapping: previewData.column_mapping || {},
        recommendations: previewData.recommendations || []
      };

      // Validar datos específicos de flujo de efectivo
      const validatedData = await cashFlowImport.validateCashFlowData(formattedPreviewData);
      setLocalPreviewData(validatedData);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error validating cash flow data:', error);    }
  };

  const handleStartImport = async () => {
    if (!localConfiguration) return;

    setCurrentStep('importing');
    
    try {
      const result = await cashFlowImport.importCashFlowData(localConfiguration);
      setImportResult(result);
      setImportId(result.import_id || 'temp-id');
      setCurrentStep('result');
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error importing cash flow data:', error);
      setCurrentStep('configure');
    }
  };

  const handleImportComplete = (result: any) => {
    setImportResult(result);
    setCurrentStep('result');
    if (onComplete) {
      onComplete(result);
    }
  };  const handleStartOver = () => {
    setCurrentStep('templates');
    setLocalPreviewData(null);
    setLocalConfiguration(null);
    setImportResult(null);
    setImportId(null);
    cashFlowImport.resetValidation();
  };

  const handleSkipTemplates = () => {
    setCurrentStep('upload');
  };

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
      <Card className="p-4">
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
        </div>
      )}

      {currentStep === 'upload' && (
        <div className="space-y-6">
          <FileUpload
            dataType="journal_entries"
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
      )}      {currentStep === 'preview' && localPreviewData && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Vista Previa de Datos
            </h3>
            <p className="text-gray-600 mb-4">
              Se encontraron {localPreviewData.total_rows} filas para importar
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setCurrentStep('configure')}
                variant="primary"
              >
                Continuar →
              </Button>
              <Button 
                onClick={() => setCurrentStep('upload')}
                variant="secondary"
              >
                ← Volver
              </Button>
            </div>
          </Card>
          
          {/* Cash Flow Validation Metrics */}
          {cashFlowImport.validationMetrics && (
            <Card className="p-6">
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
              
              {cashFlowImport.importRecommendations.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">💡 Recomendaciones:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {cashFlowImport.importRecommendations.map((recommendation, index) => (
                      <li key={index}>• {recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {currentStep === 'configure' && localPreviewData && (
        <div className="space-y-6">
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
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="strict"
                >
                  <option value="strict">Estricto (Recomendado para flujo de efectivo)</option>
                  <option value="tolerant">Tolerante</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="skipDuplicates" 
                  defaultChecked 
                  className="mr-2"
                />
                <label htmlFor="skipDuplicates" className="text-sm text-gray-700">
                  Omitir duplicados
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleStartImport}
                variant="primary"
              >
                Iniciar Importación
              </Button>
              <Button 
                onClick={() => setCurrentStep('preview')}
                variant="secondary"
              >
                ← Volver
              </Button>
            </div>
          </Card>
        </div>
      )}      {currentStep === 'importing' && importId && (
        <ImportProgress
          importId={importId}
          onComplete={handleImportComplete}
          onCancel={handleStartOver}
        />
      )}

      {currentStep === 'result' && importResult && (
        <div className="space-y-6">
          <ImportResultDetails importResult={importResult} />
        </div>
      )}
    </div>
  );
};
