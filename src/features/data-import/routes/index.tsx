import { Routes, Route } from 'react-router-dom';
import {
  DataImportMainPage,
  AccountsImportPage,
  JournalEntriesImportPage,
  ImportHistoryPage,
  GenericImportPage
} from '../pages';

export function DataImportRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DataImportMainPage />} />
      <Route path="/accounts" element={<AccountsImportPage />} />
      <Route path="/journal-entries" element={<JournalEntriesImportPage />} />
      <Route path="/history" element={<ImportHistoryPage />} />
      <Route path="/generic" element={<GenericImportPage />} />
      {/* Redirigir rutas alternativas */}
      <Route path="/import" element={<DataImportMainPage />} />
      <Route path="/export" element={<DataImportMainPage />} />
    </Routes>
  );
}
