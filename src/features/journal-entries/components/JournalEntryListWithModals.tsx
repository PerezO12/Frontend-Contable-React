import React from 'react';
import { JournalEntryList } from './JournalEntryList';
import { ReasonModal } from './ReasonModal';
import { useJournalEntryOperationsWithModal } from '../hooks';
import type { JournalEntry, JournalEntryFilters } from '../types';

interface JournalEntryListWithModalsProps {
  onEntrySelect?: (entry: JournalEntry) => void;
  onCreateEntry?: () => void;
  onEditEntry?: (entry: JournalEntry) => void;
  initialFilters?: JournalEntryFilters;
  showActions?: boolean;
}

export const JournalEntryListWithModals: React.FC<JournalEntryListWithModalsProps> = ({
  onEntrySelect,
  onCreateEntry,
  onEditEntry,
  initialFilters,
  showActions = true
}) => {
  const {
    modalState,
    modalConfig,
    handleApprove,
    handlePost,
    handleCancel,
    handleReverse,
    handleModalConfirm,
    handleModalClose
  } = useJournalEntryOperationsWithModal();

  // Crear handlers que usan el sistema de modales
  const handleApproveEntry = async (entry: JournalEntry) => {
    await handleApprove(entry);
  };

  const handlePostEntry = (entry: JournalEntry) => {
    handlePost(entry);
  };

  const handleCancelEntry = (entry: JournalEntry) => {
    handleCancel(entry);
  };

  const handleReverseEntry = (entry: JournalEntry) => {
    handleReverse(entry);
  };

  return (
    <>
      <JournalEntryList
        onEntrySelect={onEntrySelect}
        onCreateEntry={onCreateEntry}
        onEditEntry={onEditEntry}
        initialFilters={initialFilters}
        showActions={showActions}
        // Pasamos los handlers que usan modales
        onApproveEntry={handleApproveEntry}
        onPostEntry={handlePostEntry}
        onCancelEntry={handleCancelEntry}
        onReverseEntry={handleReverseEntry}
      />

      {/* Modal para operaciones que requieren razón */}
      {modalState && modalConfig && (
        <ReasonModal
          isOpen={true}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          title={modalConfig.title}
          description={modalConfig.description}
          reasonLabel={modalConfig.reasonLabel}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
          isRequired={modalConfig.isRequired}
        />
      )}
    </>
  );
};
