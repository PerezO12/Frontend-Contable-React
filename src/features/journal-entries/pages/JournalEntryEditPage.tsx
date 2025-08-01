import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntryEditForm } from '../components/JournalEntryEditFormSimple';
import { useJournalEntry } from '../hooks';
import { Spinner } from '../../../components/ui/Spinner';
import { Card } from '../../../components/ui/Card';
import type { JournalEntry } from '../types';

export const JournalEntryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { entry, loading, error } = useJournalEntry(id);

  const handleSuccess = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}`);
  };

  const handleCancel = () => {
    if (entry) {
      navigate(`/journal-entries/${entry.id}`);
    } else {
      navigate('/journal-entries');
    }
  };  if (loading) {
    return (
      <>
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando asiento contable...</p>
        </div>
      </>
    );
  }
  if (error || !entry) {
    return (
      <>
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar el asiento contable'}
            </p>
          </div>
        </Card>
      </>
    );
  }

  // Check if entry can be edited
  if (entry.status !== 'draft') {
    return (
      <>
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-orange-600 mb-4">
              Este asiento contable no puede ser editado porque su estado es: {entry.status}
            </p>
            <button
              onClick={() => navigate(`/journal-entries/${entry.id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              Ver detalles del asiento
            </button>
          </div>
        </Card>
      </>
    );
  }

  return (
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
          <li>
            <button
              onClick={() => navigate(`/journal-entries/${entry.id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              {entry.number}
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Editar</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Asiento Contable</h1>
        <p className="text-gray-600 mt-2">
          Modificar el asiento contable: {entry.number} - {entry.description}
        </p>
      </div>      <JournalEntryEditForm
        entryId={entry.id}
        onSuccess={handleSuccess}        
        onCancel={handleCancel}
      />
    </>
  );
};
