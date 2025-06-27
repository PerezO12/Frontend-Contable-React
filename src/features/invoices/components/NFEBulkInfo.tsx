/**
 * Componente para mostrar información específica sobre facturas NFE en operaciones bulk
 */
import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { ExclamationCircleIcon } from '@/shared/components/icons';

interface NFEBulkInfoProps {
  selectedInvoices: Array<{ 
    id: string; 
    invoice_number: string; 
    description?: string; 
    notes?: string; 
  }>;
  operation: 'delete' | 'post' | 'cancel' | 'reset';
}

export const NFEBulkInfo: React.FC<NFEBulkInfoProps> = ({ 
  selectedInvoices, 
  operation 
}) => {
  // Detectar facturas NFE
  const nfeInvoices = selectedInvoices.filter(inv => 
    inv.invoice_number?.includes('NFe') || 
    inv.description?.toLowerCase().includes('nfe') ||
    inv.notes?.toLowerCase().includes('nfe')
  );

  if (nfeInvoices.length === 0) return null;

  const getOperationMessage = () => {
    switch (operation) {
      case 'delete':
        return `${nfeInvoices.length} facturas de NFE serán eliminadas y automáticamente desvinculadas de sus registros NFE originales.`;
      case 'post':
        return `${nfeInvoices.length} facturas de NFE serán contabilizadas. Los registros NFE permanecerán vinculados.`;
      case 'cancel':
        return `${nfeInvoices.length} facturas de NFE serán canceladas. Los registros NFE permanecerán vinculados.`;
      case 'reset':
        return `${nfeInvoices.length} facturas de NFE serán devueltas a borrador. Los registros NFE permanecerán vinculados.`;
      default:
        return `${nfeInvoices.length} facturas de NFE serán procesadas.`;
    }
  };

  return (
    <Alert 
      variant="info" 
      className="mb-4"
    >
      <div className="flex items-start">
        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium mb-1">Facturas NFE detectadas</h4>
          <p className="text-sm">{getOperationMessage()}</p>
          {operation === 'delete' && (
            <p className="text-sm mt-1 text-blue-600">
              Los registros NFE cambiarán a estado "UNLINKED" y podrán ser re-procesados si es necesario.
            </p>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default NFEBulkInfo;
