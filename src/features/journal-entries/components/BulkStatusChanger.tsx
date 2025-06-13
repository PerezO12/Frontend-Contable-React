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
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    status: JournalEntryStatus;
    title: string;
    placeholder: string;
  } | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
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
    try {
      await onStatusChange(selectedEntryIds, status, reason);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
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

  return (
    <div className="relative">      
    <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        🔄 Cambiar Estado
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
