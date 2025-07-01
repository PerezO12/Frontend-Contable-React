import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  TrashIcon, 
  XMarkIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@/shared/components/icons';
import type { Account } from '../types';

type BulkOperation = 'activate' | 'deactivate' | 'delete' | 'export';

interface OperationConfig {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
  requiresReason?: boolean;
}

const operationConfigs: Record<BulkOperation, OperationConfig> = {
  activate: {
    label: 'Activar',
    color: 'green',
    icon: CheckCircleIcon,
    description: 'Activar cuentas seleccionadas',
    confirmMessage: 'Esta acción activará las cuentas seleccionadas haciéndolas disponibles para uso.'
  },
  deactivate: {
    label: 'Desactivar',
    color: 'yellow',
    icon: XCircleIcon,
    description: 'Desactivar cuentas seleccionadas',
    confirmMessage: 'Esta acción desactivará las cuentas seleccionadas y ya no estarán disponibles para nuevos movimientos.'
  },
  delete: {
    label: 'Eliminar',
    color: 'red',
    icon: TrashIcon,
    description: 'Eliminar cuentas seleccionadas',
    confirmMessage: 'Esta acción eliminará permanentemente las cuentas seleccionadas. Esta operación no se puede deshacer.',
    requiresReason: true
  },
  export: {
    label: 'Exportar',
    color: 'blue',
    icon: ArrowDownTrayIcon,
    description: 'Exportar cuentas seleccionadas',
    confirmMessage: 'Se exportarán todas las cuentas seleccionadas.'
  }
};

export function AccountBulkActionsBar({
  selectedCount,
  selectedAccounts,
  isProcessing,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkExport,
  onClearSelection
}: {
  selectedCount: number;
  selectedAccounts: Account[];
  isProcessing: boolean;
  onBulkActivate: (options: { reason?: string }) => Promise<void>;
  onBulkDeactivate: (options: { reason?: string }) => Promise<void>;
  onBulkDelete: (options: { reason: string }) => Promise<void>;
  onBulkExport: (accounts: Account[]) => void;
  onClearSelection: () => void;
}) {
  if (selectedCount === 0) return null;

  const handleOperation = (operation: BulkOperation) => {
    switch (operation) {
      case 'activate':
        onBulkActivate({});
        break;
      case 'deactivate':
        onBulkDeactivate({});
        break;
      case 'delete':
        onBulkDelete({ reason: 'Eliminación masiva desde interfaz de usuario' });
        break;
      case 'export':
        onBulkExport(selectedAccounts);
        break;
    }
  };

  const getButtonStyles = (color: string) => {
    const baseStyles = "flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200";
    
    switch (color) {
      case 'green':
        return `${baseStyles} text-green-700 hover:text-green-800 hover:bg-green-50 border border-green-200`;
      case 'yellow':
        return `${baseStyles} text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50 border border-yellow-200`;
      case 'red':
        return `${baseStyles} text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200`;
      case 'blue':
        return `${baseStyles} text-blue-700 hover:text-blue-800 hover:bg-blue-50 border border-blue-200`;
      default:
        return `${baseStyles} text-gray-700 hover:text-gray-800 hover:bg-gray-50 border border-gray-200`;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} cuenta{selectedCount !== 1 ? 's' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
        </span>
        
        <div className="flex space-x-2">
          {(Object.keys(operationConfigs) as BulkOperation[]).map((operation) => {
            const config = operationConfigs[operation];
            const IconComponent = config.icon;
            
            return (
              <Button
                key={operation}
                variant="ghost"
                size="sm"
                onClick={() => handleOperation(operation)}
                disabled={isProcessing}
                className={getButtonStyles(config.color)}
                title={config.description}
              >
                <IconComponent className="h-4 w-4" />
                <span>{config.label}</span>
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          <XMarkIcon className="h-4 w-4" />
          <span>Cancelar</span>
        </Button>
      </div>
    </div>
  );
}
