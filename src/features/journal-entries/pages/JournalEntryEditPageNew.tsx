import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntryEditForm } from '../components/JournalEntryEditFormSimple';
import type { JournalEntry } from '../types';

export const JournalEntryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSuccess = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}`);
  };

  const handleCancel = () => {
    navigate('/journal-entries');
  };

  if (!id) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          ID de asiento no válido
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li><a href="/journal-entries" className="text-blue-600 hover:text-blue-800">Asientos Contables</a></li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Editar</li>
        </ol>
      </nav>

      <JournalEntryEditForm
        entryId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
};
