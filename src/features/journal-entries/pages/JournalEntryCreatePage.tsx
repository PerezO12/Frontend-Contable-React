import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntryForm } from '../components';
import type { JournalEntry } from '../types';

export const JournalEntryCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}`);
  };

  const handleCancel = () => {
    navigate('/journal-entries');
  };  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => navigate('/journal-entries')}
              className="text-blue-600 hover:text-blue-800"
            >
              Asientos Contables
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Nuevo Asiento</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Asiento Contable</h1>
        <p className="text-gray-600 mt-2">
          Crear un nuevo asiento contable con partida doble
        </p>
      </div>

      <JournalEntryForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEditMode={false}
      />
    </>
  );
};
