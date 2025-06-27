export function ModelSelectionStep(_a) {
    var selectedModel = _a.selectedModel, availableModels = _a.availableModels, modelMetadata = _a.modelMetadata, onModelSelect = _a.onModelSelect, isLoading = _a.isLoading;
    return (<div className="space-y-6" style={{ lineHeight: '1.5' }}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ lineHeight: '1.25' }}>
          Seleccione el Modelo de Datos
        </h3>
        <p className="text-sm text-gray-600" style={{ lineHeight: '1.4' }}>
          Elija el tipo de entidad que desea importar. Cada modelo tiene campos y validaciones específicas.
        </p>
      </div>

      {/* Lista de modelos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableModels.map(function (modelName) { return (<button key={modelName} type="button" onClick={function () { return onModelSelect(modelName); }} disabled={isLoading} className={"relative rounded-lg border p-4 flex flex-col items-start text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ".concat(selectedModel === modelName
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white', " ").concat(isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')} style={{ lineHeight: '1.5', minHeight: '80px' }}>            <div className="flex items-center w-full">
              <div className="text-sm font-medium text-gray-900" style={{ lineHeight: '1.25' }}>
                {modelName.charAt(0).toUpperCase() + modelName.slice(1)}
              </div>
              {selectedModel === modelName && (<div className="ml-auto">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>)}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Haga clic para seleccionar este modelo
            </div>
          </button>); })}
      </div>

      {/* Información del modelo seleccionado */}
      {selectedModel && modelMetadata && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            {modelMetadata.display_name}
          </h4>
          {modelMetadata.description && (<p className="text-sm text-blue-700 mb-3">
              {modelMetadata.description}
            </p>)}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900">Campos disponibles:</span>
              <span className="text-blue-700 ml-1">{modelMetadata.fields.length}</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Campos requeridos:</span>
              <span className="text-blue-700 ml-1">
                {modelMetadata.fields.filter(function (f) { return f.is_required; }).length}
              </span>
            </div>
          </div>

          {modelMetadata.business_key_fields.length > 0 && (<div className="mt-2 text-sm">
              <span className="font-medium text-blue-900">Campos clave:</span>
              <span className="text-blue-700 ml-1">
                {modelMetadata.business_key_fields.join(', ')}
              </span>
            </div>)}
        </div>)}

      {/* Estado de carga */}
      {isLoading && (<div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Cargando información del modelo...</span>
        </div>)}
    </div>);
}
