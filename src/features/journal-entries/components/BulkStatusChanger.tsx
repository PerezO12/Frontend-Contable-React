import React, { useState, useRef } from 'react';
import { BulkStatusDropdown } from './BulkStatusDropdown';
import { ReasonPromptModal } from './ReasonPromptModal';
import { JournalEntryStatus } from '../types';

interface BulkStatusChangerProps {
  selectedEntryIds: string[];
  onStatusChange: (entryIds: string[], newStatus: JournalEntryStatus, reason?: string) => Promise<any>;
  onSuccess?: () => void;
}

export const BulkStatusChanger: React.FC<BulkStatusChangerProps> = ({
  selectedEntryIds,
  onStatusChange,
  onSuccess
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    status: JournalEntryStatus;
    title: string;
    placeholder: string;
  } | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    if (!isLoading) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleStatusSelect = async (status: JournalEntryStatus, requiresReason: boolean) => {
    if (requiresReason) {
      // Si requiere razón, mostrar modal
      const titles: Record<string, string> = {
        [JournalEntryStatus.DRAFT]: 'Restaurar a Borrador',
        [JournalEntryStatus.POSTED]: 'Contabilizar Asientos',
        [JournalEntryStatus.CANCELLED]: 'Cancelar Asientos'
      };
      
      const placeholders: Record<string, string> = {
        [JournalEntryStatus.DRAFT]: 'Ingrese la razón para restaurar a borrador...',
        [JournalEntryStatus.POSTED]: 'Ingrese la razón para contabilizar...',
        [JournalEntryStatus.CANCELLED]: 'Ingrese la razón para cancelar...'
      };
      
      setPendingStatusChange({
        status,
        title: titles[status] || 'Cambiar Estado',
        placeholder: placeholders[status] || 'Ingrese la razón...'
      });
      setShowReasonModal(true);
    } else {
      // Si no requiere razón, ejecutar directamente
      await executeStatusChange(status);
    }
  };

  const executeStatusChange = async (status: JournalEntryStatus, reason?: string) => {
    setIsLoading(true);
    try {
      const result = await onStatusChange(selectedEntryIds, status, reason);
      
      // Mostrar mensaje de resultado si hay fallos
      if (result?.total_failed > 0) {
        const message = `${result.total_updated} asientos actualizados correctamente, ${result.total_failed} fallaron.`;
        alert(message);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      
      // Mostrar mensaje de error específico
      const errorMessage = error.message || 'Error desconocido al cambiar el estado';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonConfirm = async (reason: string) => {
    if (pendingStatusChange) {
      await executeStatusChange(pendingStatusChange.status, reason);
      setPendingStatusChange(null);
    }
  };

  const handleCloseReasonModal = () => {
    setShowReasonModal(false);
    setPendingStatusChange(null);
  };

  return (    <div className="relative">      
    <button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isLoading || selectedEntryIds.length === 0}
        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
          isLoading || selectedEntryIds.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>
        ) : (
          <>🔄 Cambiar Estado ({selectedEntryIds.length})</>
        )}
      </button>
      
      <BulkStatusDropdown
        isOpen={showDropdown}
        onClose={() => setShowDropdown(false)}
        onStatusSelect={handleStatusSelect}
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
      />
      
      {pendingStatusChange && (
        <ReasonPromptModal
          isOpen={showReasonModal}
          onClose={handleCloseReasonModal}
          onConfirm={handleReasonConfirm}
          title={pendingStatusChange.title}
          placeholder={pendingStatusChange.placeholder}
        />
      )}
    </div>
  );
};
