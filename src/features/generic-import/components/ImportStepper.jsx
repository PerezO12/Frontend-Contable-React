var steps = [
    {
        id: 'upload',
        label: 'Selección y Carga',
        description: 'Seleccione el modelo y suba el archivo',
        status: 'pending',
    },
    {
        id: 'mapping',
        label: 'Mapeo de Campos',
        description: 'Configure el mapeo de columnas a campos',
        status: 'pending',
    },
    {
        id: 'preview',
        label: 'Vista Previa',
        description: 'Revise los datos antes de importar',
        status: 'pending',
    },
    {
        id: 'execute',
        label: 'Ejecución',
        description: 'Importación en progreso',
        status: 'pending',
    },
    {
        id: 'result',
        label: 'Resultado',
        description: 'Resultados de la importación',
        status: 'pending',
    },
];
export function ImportStepper(_a) {
    var currentStep = _a.currentStep, isStepValid = _a.isStepValid, getStepIndex = _a.getStepIndex, onStepClick = _a.onStepClick, isLoading = _a.isLoading;
    var currentIndex = getStepIndex(currentStep);
    var getStepStatus = function (step, index) {
        if (index < currentIndex) {
            return isStepValid(step.id) ? 'completed' : 'error';
        }
        if (index === currentIndex) {
            return 'current';
        }
        return 'pending';
    };
    var canClickStep = function (step, index) {
        if (isLoading)
            return false;
        if (index === currentIndex)
            return false;
        if (index > currentIndex)
            return false;
        return isStepValid(step.id);
    };
    return (<div className="w-full py-6" style={{ lineHeight: '1.5' }}>
      <nav aria-label="Progress">
        <ol className="flex items-start justify-between space-x-2">
          {steps.map(function (step, index) {
            var status = getStepStatus(step, index);
            var isClickable = canClickStep(step, index);
            return (<li key={step.id} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {index !== steps.length - 1 && (<div className="absolute top-4 left-1/2 w-full h-0.5 transform translate-x-1/2 z-0" aria-hidden="true">
                    <div className={"h-full w-full ".concat(status === 'completed' || index < currentIndex
                        ? 'bg-blue-600'
                        : 'bg-gray-200')}/>
                  </div>)}

                {/* Step button */}
                <button type="button" onClick={function () { return isClickable && onStepClick(step.id); }} disabled={!isClickable} className={"relative z-10 flex h-8 w-8 items-center justify-center rounded-full mb-3 ".concat(status === 'current'
                    ? 'bg-blue-600 text-white'
                    : status === 'completed'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : status === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-500', " ").concat(isClickable
                    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    : 'cursor-not-allowed')} aria-current={status === 'current' ? 'step' : undefined}>
                  {status === 'completed' ? (<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>) : status === 'error' ? (<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>) : status === 'current' && isLoading ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>) : (<span className="text-sm font-medium">{index + 1}</span>)}
              </button>

              {/* Step label */}
              <div className="text-center" style={{ maxWidth: '120px' }}>
                <p className={"text-sm font-medium mb-1 ".concat(status === 'current'
                    ? 'text-blue-600'
                    : status === 'completed'
                        ? 'text-blue-600'
                        : status === 'error'
                            ? 'text-red-600'
                            : 'text-gray-500')} style={{ lineHeight: '1.25' }}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500" style={{ lineHeight: '1.3', wordWrap: 'break-word' }}>
                  {step.description}
                </p>
              </div>
            </li>);
        })}
      </ol>
    </nav>
    </div>);
}
