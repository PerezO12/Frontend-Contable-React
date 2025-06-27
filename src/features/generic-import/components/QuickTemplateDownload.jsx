import { TemplateDownloadButton } from './TemplateDownloadButton';
var MODEL_DISPLAY_NAMES = {
    third_party: 'Terceros',
    product: 'Productos',
    account: 'Cuentas Contables',
    invoice: 'Facturas',
};
export function QuickTemplateDownload(_a) {
    var modelName = _a.modelName, modelDisplayName = _a.modelDisplayName, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.showIcon, showIcon = _c === void 0 ? true : _c;
    var displayName = modelDisplayName || MODEL_DISPLAY_NAMES[modelName] || modelName;
    return (<div className={"flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg ".concat(className)}>
      <div className="flex items-center">
        {showIcon && (<div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>)}
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            Plantilla de {displayName}
          </h4>
          <p className="text-xs text-gray-500">
            CSV con datos de ejemplo listos para importar
          </p>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <TemplateDownloadButton modelName={modelName} variant="outline" size="sm"/>
      </div>
    </div>);
}
