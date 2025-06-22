import React from 'react';
import { JournalEntryList } from './JournalEntryList';
import type { JournalEntry, JournalEntryFilters } from '../types';

interface JournalEntryListWithModalsProps {
  onEntrySelect?: (entry: JournalEntry) => void;
  onCreateEntry?: () => void;
  initialFilters?: JournalEntryFilters;
}

export const JournalEntryListWithModals: React.FC<JournalEntryListWithModalsProps> = ({
  onEntrySelect,
  onCreateEntry,
  initialFilters
}) => {
  return (
    <JournalEntryList
      onEntrySelect={onEntrySelect}
      onCreateEntry={onCreateEntry}
      initialFilters={initialFilters}
    />
  );
};
