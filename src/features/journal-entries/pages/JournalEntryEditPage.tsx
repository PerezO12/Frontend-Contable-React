import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntryForm } from '../components';
import { useJournalEntry } from '../hooks';
import { Spinner } from '../../../components/ui/Spinner';
import { Card } from '../../../components/ui/Card';
import { MainLayout } from '../../../components/layout/MainLayout';
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
  };
  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando asiento contable...</p>
        </div>
      </MainLayout>
    );
  }
  if (error || !entry) {
    return (
      <MainLayout>
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar el asiento contable'}
            </p>
            <button
              onClick={() => navigate('/journal-entries')}
              className="text-blue-600 hover:text-blue-800"
            >
              Volver al listado
            </button>
          </div>
        </Card>
      </MainLayout>
    );
  }
  // Check if entry can be edited
  if (entry.status !== 'draft') {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }
  return (
    <MainLayout>
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
      </div>

      <JournalEntryForm
        initialData={{
          reference: entry.reference,
          description: entry.description,
          entry_type: entry.entry_type,
          entry_date: entry.entry_date,
          notes: entry.notes,
          external_reference: entry.external_reference,
          lines: entry.lines.map((line: any) => ({
            account_id: line.account_id,
            account_code: line.account_code,
            account_name: line.account_name,
            debit_amount: line.debit_amount,
            credit_amount: line.credit_amount,
            description: line.description,
            reference: line.reference,
            third_party_id: line.third_party_id,
            cost_center_id: line.cost_center_id
          }))
        }}
        onSuccess={handleSuccess}        
        onCancel={handleCancel}
        isEditMode={true}
        entryId={entry.id}
      />    
    </MainLayout>
  );
};
