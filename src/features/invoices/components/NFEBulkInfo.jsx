/**
 * Componente para mostrar información específica sobre facturas NFE en operaciones bulk
 */
import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { ExclamationCircleIcon } from '@/shared/components/icons';
export var NFEBulkInfo = function (_a) {
    var selectedInvoices = _a.selectedInvoices, operation = _a.operation;
    // Detectar facturas NFE
    var nfeInvoices = selectedInvoices.filter(function (inv) {
        var _a, _b, _c;
        return ((_a = inv.invoice_number) === null || _a === void 0 ? void 0 : _a.includes('NFe')) ||
            ((_b = inv.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('nfe')) ||
            ((_c = inv.notes) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes('nfe'));
    });
    if (nfeInvoices.length === 0)
        return null;
    var getOperationMessage = function () {
        switch (operation) {
            case 'delete':
                return "".concat(nfeInvoices.length, " facturas de NFE ser\u00E1n eliminadas y autom\u00E1ticamente desvinculadas de sus registros NFE originales.");
            case 'post':
                return "".concat(nfeInvoices.length, " facturas de NFE ser\u00E1n contabilizadas. Los registros NFE permanecer\u00E1n vinculados.");
            case 'cancel':
                return "".concat(nfeInvoices.length, " facturas de NFE ser\u00E1n canceladas. Los registros NFE permanecer\u00E1n vinculados.");
            case 'reset':
                return "".concat(nfeInvoices.length, " facturas de NFE ser\u00E1n devueltas a borrador. Los registros NFE permanecer\u00E1n vinculados.");
            default:
                return "".concat(nfeInvoices.length, " facturas de NFE ser\u00E1n procesadas.");
        }
    };
    return (<Alert variant="info" className="mb-4">
      <div className="flex items-start">
        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"/>
        <div>
          <h4 className="font-medium mb-1">Facturas NFE detectadas</h4>
          <p className="text-sm">{getOperationMessage()}</p>
          {operation === 'delete' && (<p className="text-sm mt-1 text-blue-600">
              Los registros NFE cambiarán a estado "UNLINKED" y podrán ser re-procesados si es necesario.
            </p>)}
        </div>
      </div>
    </Alert>);
};
export default NFEBulkInfo;
