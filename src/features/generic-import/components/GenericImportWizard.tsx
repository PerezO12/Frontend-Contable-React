import { Card } from '../../../components/ui/Card';
import { useGenericImportWizard } from '../hooks/useGenericImportWizard';
import { ImportStepper } from '@/features/generic-import/components/ImportStepper';
import { ModelSelectionStep } from '@/features/generic-import/components/steps/ModelSelectionStep';
import { FileUploadStep } from '@/features/generic-import/components/steps/FileUploadStep';
import { FieldMappingStep } from '@/features/generic-import/components/steps/FieldMappingStep';
import { PreviewStep } from '@/features/generic-import/components/steps/PreviewStep';
import { ExecutionStep } from '@/features/generic-import/components/steps/ExecutionStep';
import { ResultStep } from '@/features/generic-import/components/steps/ResultStep';
import './GenericImportWizard.css';

interface GenericImportWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function GenericImportWizard({ onComplete, onCancel }: GenericImportWizardProps) {
  const {
    state,
    availableModels,
    modelMetadata,
    selectModel,
    uploadFile,
    updateColumnMappings,
    updateImportSettings,
    generatePreview,
    generateBatchPreview,
    validateFullFile,
    executeImport,
    executeImportWithSkipErrors,
    resetWizard,
    goToStep,
    getMappingSuggestions,
    isStepValid,
    getStepIndex,
  } = useGenericImportWizard();

  const handleComplete = () => {
    onComplete?.();
    resetWizard();
  };

  const handleCancel = () => {
    onCancel?.();
    resetWizard();
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'upload':
        return (
          <>
            <ModelSelectionStep
              selectedModel={state.selectedModel}
              availableModels={availableModels}
              modelMetadata={modelMetadata}
              onModelSelect={selectModel}
              isLoading={state.isLoading}
            />
            
            {state.selectedModel && (
              <FileUploadStep
                onFileUpload={uploadFile}
                isLoading={state.isLoading}
                selectedModel={state.selectedModel}
              />
            )}
          </>
        );

      case 'mapping':
        return (
          <FieldMappingStep
            importSession={state.importSession!}
            modelMetadata={modelMetadata!}
            columnMappings={state.columnMappings}
            onMappingsChange={updateColumnMappings}
            onSettingsChange={updateImportSettings}
            onNext={generatePreview}
            onValidateFullFile={validateFullFile}
            onBack={() => goToStep('upload')}
            getMappingSuggestions={getMappingSuggestions}
            isLoading={state.isLoading}
            importPolicy={state.importPolicy}
            skipValidationErrors={state.skipValidationErrors}
            defaultValues={state.defaultValues}
          />
        );

      case 'preview':
        return (
          <PreviewStep
            previewData={state.previewData!}
            onNext={executeImport}
            onNextWithSkipErrors={executeImportWithSkipErrors}
            onBack={() => goToStep('mapping')}
            isLoading={state.isLoading}
            batchSize={state.batchSize}
            onBatchSizeChange={(batchSize) => updateImportSettings({ batchSize })}
            onBatchChange={generateBatchPreview}
          />
        );

      case 'execute':
        return (
          <ExecutionStep
            isLoading={state.isLoading}
            importSession={state.importSession!}
            batchSize={state.batchSize}
          />
        );

      case 'result':
        return (
          <ResultStep
            importResult={state.importResult}
            error={state.error}
            onComplete={handleComplete}
            onRetry={() => goToStep('mapping')}
            onStartNew={resetWizard}
          />
        );

      default:
        return null;
    }
  };  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 generic-import-wizard" style={{ lineHeight: '1.5' }}>
      <Card className="shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2" style={{ lineHeight: '1.25' }}>
            {state.isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
            Asistente de Importación Genérico
          </h2>
          <p className="mt-1 text-sm text-gray-600" style={{ lineHeight: '1.4' }}>
            Importe datos desde archivos CSV, XLSX o JSON a cualquier entidad del sistema
          </p>
        </div>

        <div className="p-6 space-y-6" style={{ lineHeight: '1.5' }}>
          {/* Stepper */}
          <ImportStepper
            currentStep={state.currentStep}
            isStepValid={isStepValid}
            getStepIndex={getStepIndex}
            onStepClick={goToStep}
            isLoading={state.isLoading}
          />

          {/* Error global */}
          {state.error && (
            <div className="border border-red-200 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-800">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contenido del paso actual */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Acciones globales */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {state.currentStep !== 'upload' && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={state.isLoading}
                >
                  Cancelar
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              {state.currentStep === 'result' && !state.error && (
                <button
                  type="button"
                  onClick={resetWizard}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={state.isLoading}
                >
                  Nueva Importación
                </button>
              )}
              
              {state.currentStep === 'result' && (
                <button
                  type="button"
                  onClick={handleComplete}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={state.isLoading}
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
