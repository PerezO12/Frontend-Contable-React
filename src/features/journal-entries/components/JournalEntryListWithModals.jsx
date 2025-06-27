import React from 'react';
import { JournalEntryList } from './JournalEntryList';
export var JournalEntryListWithModals = function (_a) {
    var onEntrySelect = _a.onEntrySelect, onCreateEntry = _a.onCreateEntry, initialFilters = _a.initialFilters;
    return (<JournalEntryList onEntrySelect={onEntrySelect} onCreateEntry={onCreateEntry} initialFilters={initialFilters}/>);
};
