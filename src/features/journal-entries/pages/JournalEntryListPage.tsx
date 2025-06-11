import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntryList } from '../components';
import type { JournalEntry } from '../types';

export const JournalEntryListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEntrySelect = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}`);
  };

  const handleCreateEntry = () => {
    navigate('/journal-entries/new');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}/edit`);
  };  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Asientos Contables</h1>
        <p className="text-gray-600 mt-2">
          Gestión completa de asientos contables y partida doble
        </p>
      </div>

      <JournalEntryList
        onEntrySelect={handleEntrySelect}
        onCreateEntry={handleCreateEntry}
        onEditEntry={handleEditEntry}
      />
    </>
  );
};
