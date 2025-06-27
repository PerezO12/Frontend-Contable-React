import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon, XCircleIcon } from '@/shared/components/icons';
export function InvoiceWorkflowStatus(_a) {
    var status = _a.status, onPost = _a.onPost, onCancel = _a.onCancel, onResetToDraft = _a.onResetToDraft, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var getStatusConfig = function (status) {
        switch (status) {
            case 'DRAFT': return {
                label: 'Borrador',
                icon: '📝',
                color: 'subtle',
                description: 'Factura editable, sin asientos contables',
                actions: [
                    { key: 'post', label: 'Contabilizar', action: onPost, variant: 'primary' }
                ]
            };
            case 'POSTED':
                return {
                    label: 'Contabilizada',
                    icon: '✅',
                    color: 'solid',
                    description: 'Asiento contable creado, no editable',
                    actions: [
                        { key: 'cancel', label: 'Cancelar', action: onCancel, variant: 'danger' }
                    ]
                };
            case 'CANCELLED':
                return {
                    label: 'Cancelada',
                    icon: '❌',
                    color: 'subtle',
                    description: 'Factura cancelada, asiento revertido',
                    actions: [
                        { key: 'reset', label: 'Restaurar a Borrador', action: onResetToDraft, variant: 'outline' }
                    ]
                };
            default: return {
                label: status,
                icon: '❓',
                color: 'subtle',
                description: 'Estado desconocido',
                actions: []
            };
        }
    };
    var config = getStatusConfig(status);
    var workflowSteps = [
        { status: 'DRAFT', label: 'Borrador', description: 'Editable' },
        { status: 'POSTED', label: 'Contabilizada', description: 'Con asiento' },
        { status: 'CANCELLED', label: 'Cancelada', description: 'Revertida' }
    ];
    return (<div className={"space-y-4 ".concat(className)}>
      {/* Estado actual */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant={config.color} size="lg">
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {config.description}
            </p>
          </div>
        </div>

        {/* Acciones disponibles */}
        <div className="flex space-x-2">
          {config.actions.map(function (action) { return (<Button key={action.key} variant={action.variant} size="sm" onClick={action.action} disabled={isLoading || !action.action}>
              {action.label}
            </Button>); })}
        </div>
      </div>

      {/* Indicador de progreso del workflow */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Flujo del Documento
        </h4>
        <div className="flex items-center space-x-4">
          {workflowSteps.map(function (step, index) {
            var isActive = step.status === status;
            var isPassed = workflowSteps.findIndex(function (s) { return s.status === status; }) > index;
            var isCancelled = status === 'CANCELLED' && step.status === 'CANCELLED';
            return (<div key={step.status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={"\n                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium\n                    ".concat(isActive ? 'bg-blue-600 text-white' :
                    isPassed ? 'bg-green-600 text-white' :
                        isCancelled ? 'bg-red-600 text-white' :
                            'bg-gray-300 text-gray-600', "\n                  ")}>
                    {isActive ? (<span className="text-xs">●</span>) : isPassed || isCancelled ? (<CheckCircleIcon className="h-4 w-4"/>) : (<span className="text-xs">{index + 1}</span>)}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={"text-xs font-medium ".concat(isActive ? 'text-blue-600' :
                    isPassed ? 'text-green-600' :
                        isCancelled ? 'text-red-600' :
                            'text-gray-500')}>
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < workflowSteps.length - 1 && (<div className={"\n                    flex-1 h-0.5 mx-4 min-w-[2rem]\n                    ".concat(isPassed ? 'bg-green-600' : 'bg-gray-300', "\n                  ")}/>)}
              </div>);
        })}
        </div>
      </div>

      {/* Información adicional según el estado */}
      {status === 'POSTED' && (<div className="bg-green-50 border border-green-200 p-3 rounded-lg">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5"/>
            <div className="ml-2 text-sm">
              <p className="font-medium text-green-800">
                Asiento Contable Generado
              </p>
              <p className="text-green-700">
                La factura está contabilizada y no puede editarse. 
                Se han creado las líneas de vencimiento según las condiciones de pago.
              </p>
            </div>
          </div>
        </div>)}

      {status === 'CANCELLED' && (<div className="bg-red-50 border border-red-200 p-3 rounded-lg">
          <div className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5"/>
            <div className="ml-2 text-sm">
              <p className="font-medium text-red-800">
                Factura Cancelada
              </p>
              <p className="text-red-700">
                El asiento contable ha sido revertido. 
                Puedes restaurar la factura a borrador si necesitas editarla.
              </p>
            </div>
          </div>
        </div>)}
    </div>);
}
