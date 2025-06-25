/**
 * Componente de barra de acciones para operaciones bulk en terceros
 * Similar al de facturas pero adaptado a terceros
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BulkDeleteModal } from './BulkDeleteModal';
import { useThirdParties } from '../hooks/useThirdParties';
import { useToast } from '@/shared/contexts/ToastContext';
import { 
  TrashIcon,
  DocumentDuplicateIcon,
  XMarkIcon
} from '@/shared/components/icons';

interface ThirdPartyBulkActionsBarProps {
  selectedCount: number;
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onOperationComplete: () => void;
}

export function ThirdPartyBulkActionsBar({
  selectedCount,
  selectedIds,
  onClearSelection,
  onOperationComplete
}: ThirdPartyBulkActionsBarProps) {
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { thirdParties } = useThirdParties();
  const { showToast } = useToast();
  
  // Solo mostrar si hay elementos seleccionados
  if (selectedCount === 0) {
    return null;
  }

  // Obtener terceros seleccionados
  const selectedThirdParties = (thirdParties || []).filter(tp => 
    selectedIds.has(tp.id)
  );

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const handleBulkDeleteSuccess = (result: any) => {
    setShowBulkDeleteModal(false);
    onClearSelection();
    
    // Mostrar mensaje de éxito
    const deletedCount = result?.deleted_count || selectedCount;
    showToast(
      `${deletedCount} tercero${deletedCount !== 1 ? 's' : ''} eliminado${deletedCount !== 1 ? 's' : ''} exitosamente`,
      'success'
    );
    
    // Refrescar datos
    onOperationComplete();
  };

  const handleBulkExport = async () => {
    // TODO: Implementar exportación masiva
    console.log('Bulk export:', Array.from(selectedIds));
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} tercero{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-blue-700 hover:text-blue-900"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpiar selección
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="text-gray-600 hover:text-blue-600"
            >
              <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de eliminación masiva */}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          selectedThirdParties={selectedThirdParties}
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
    </>
  );
}
