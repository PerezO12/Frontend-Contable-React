import { useState } from 'react';
import { useJournalEntries } from './useJournalEntries';
import type { JournalEntry } from '../types';

interface ModalState {
  isOpen: boolean;
  entry: JournalEntry | null;
  type: 'post' | 'cancel' | 'reverse' | null;
}

export const useJournalEntryOperationsWithModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    entry: null,
    type: null
  });

  const { 
    approveEntry, 
    postEntry, 
    cancelEntry, 
    reverseEntry 
  } = useJournalEntries();

  const handleApprove = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea aprobar el asiento contable ${entry.number}?`
    );

    if (confirmed) {
      return await approveEntry(entry.id);
    }
    return false;
  };

  const handlePost = (entry: JournalEntry) => {
    setModalState({
      isOpen: true,
      entry,
      type: 'post'
    });
  };

  const handleCancel = (entry: JournalEntry) => {
    setModalState({
      isOpen: true,
      entry,
      type: 'cancel'
    });
  };

  const handleReverse = (entry: JournalEntry) => {
    setModalState({
      isOpen: true,
      entry,
      type: 'reverse'
    });
  };

  const handleModalConfirm = async (reason: string) => {
    const { entry, type } = modalState;
    if (!entry || !type) return false;

    try {
      switch (type) {
        case 'post':
          return await postEntry(entry.id, reason || undefined);
        case 'cancel':
          return await cancelEntry(entry.id, reason);
        case 'reverse':
          return await reverseEntry(entry.id, reason);
        default:
          return false;
      }
    } finally {
      setModalState({ isOpen: false, entry: null, type: null });
    }
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, entry: null, type: null });
  };

  const getModalConfig = () => {
    const { entry, type } = modalState;
    if (!entry || !type) return null;

    const configs = {
      post: {
        title: 'Contabilizar Asiento',
        description: `¿Está seguro de que desea contabilizar el asiento ${entry.number}? Esta acción afectará los saldos de las cuentas contables.`,
        reasonLabel: 'Razón (opcional)',
        confirmButtonText: 'Contabilizar',
        confirmButtonVariant: 'primary' as const,
        isRequired: false
      },
      cancel: {
        title: 'Cancelar Asiento',
        description: `¿Está seguro de que desea cancelar el asiento ${entry.number}?`,
        reasonLabel: 'Razón para cancelar',
        confirmButtonText: 'Cancelar Asiento',
        confirmButtonVariant: 'danger' as const,
        isRequired: true
      },
      reverse: {
        title: 'Revertir Asiento',
        description: `¿Está seguro de que desea crear una reversión del asiento ${entry.number}?`,
        reasonLabel: 'Razón para reversión',
        confirmButtonText: 'Crear Reversión',
        confirmButtonVariant: 'warning' as const,
        isRequired: true
      }
    };

    return configs[type];
  };

  return {
    modalState: modalState.isOpen ? modalState : null,
    modalConfig: getModalConfig(),
    handleApprove,
    handlePost,
    handleCancel,
    handleReverse,
    handleModalConfirm,
    handleModalClose
  };
};
