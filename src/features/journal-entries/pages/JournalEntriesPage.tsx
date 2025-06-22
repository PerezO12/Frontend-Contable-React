import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { JournalEntryList, JournalEntryForm, JournalEntryDetail } from '../components';
import { useJournalEntries } from '../hooks';
import { useJournalEntryListListener } from '../hooks/useJournalEntryEvents';
import type { JournalEntry } from '../types';

type PageMode = 'view' | 'create' | 'edit' | 'detail';

export const JournalEntriesPage: React.FC = () => {
  const [pageMode, setPageMode] = useState<PageMode>('view');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  const { 
    approveEntry, 
    postEntry, 
    cancelEntry, 
    reverseEntry 
  } = useJournalEntries();

  // Escuchar eventos para actualizar el selectedEntry si es necesario
  useJournalEntryListListener((event) => {
    if (selectedEntry && event.entryId === selectedEntry.id && event.entry) {
      // Actualizar el asiento seleccionado con los nuevos datos
      setSelectedEntry(event.entry);
    }
  });

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setPageMode('create');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setPageMode('edit');
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setPageMode('detail');
  };

  const handleFormSuccess = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setPageMode('detail');
  };

  const handleCancel = () => {
    setPageMode('view');
    setSelectedEntry(null);
  };

  const handleApproveEntry = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea aprobar el asiento contable ${entry.number}?`
    );

    if (confirmed) {
      await approveEntry(entry.id);
      // El evento se encargará de actualizar el estado automáticamente
    }
  };
  const handlePostEntry = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea contabilizar el asiento ${entry.number}?\n\nEsta acción afectará los saldos de las cuentas contables.`
    );

    if (confirmed) {
      const reason = window.prompt(
        `Ingrese una razón para la contabilización (opcional):`
      );
      await postEntry(entry.id, reason || undefined);
      // El evento se encargará de actualizar el estado automáticamente
    }
  };

  const handleCancelEntry = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para cancelar el asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      await cancelEntry(entry.id, reason.trim());
      // El evento se encargará de actualizar el estado automáticamente
    }
  };

  const handleReverseEntry = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para crear una reversión del asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      const success = await reverseEntry(entry.id, reason.trim());
      if (success) {
        // Go back to view mode to see the new reversal entry
        setPageMode('view');
        setSelectedEntry(null);
      }
    }
  };

  const renderHeader = () => (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asientos Contables</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa de asientos contables y partida doble
          </p>
        </div>

        {pageMode === 'view' && (
          <Button
            onClick={handleCreateEntry}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Nuevo Asiento
          </Button>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800"
            >
              Asientos Contables
            </button>
          </li>
          {pageMode === 'create' && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Nuevo Asiento</li>
            </>
          )}
          {pageMode === 'edit' && selectedEntry && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedEntry.number}</li>
            </>
          )}
          {pageMode === 'detail' && selectedEntry && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Asiento {selectedEntry.number}</li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (pageMode) {
      case 'create':
        return (
          <JournalEntryForm
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
        case 'edit':
        if (!selectedEntry) return null;
        return (
          <JournalEntryForm
            isEditMode={true}
            entryId={selectedEntry.id}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'detail':
        if (!selectedEntry) return null;
        return (
          <JournalEntryDetail
            entryId={selectedEntry.id}
            onEdit={handleEditEntry}
            onClose={handleCancel}
            onApprove={handleApproveEntry}
            onPost={handlePostEntry}
            onCancel={handleCancelEntry}
            onReverse={handleReverseEntry}
          />
        );
        default:
        return (
          <JournalEntryList
            onEntrySelect={handleViewEntry}
            onCreateEntry={handleCreateEntry}
          />
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};