import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntryListView } from '../../../components/atomic/templatesViews';
import type { JournalEntry } from '../types';

export const JournalEntryListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEntrySelect = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}`);
  };

  const handleCreateEntry = () => {
    navigate('/journal-entries/new');
  };

  return (
    <JournalEntryListView
      onJournalEntrySelect={handleEntrySelect}
      onCreateJournalEntry={handleCreateEntry}
      showActions={true}
    />
  );
};
