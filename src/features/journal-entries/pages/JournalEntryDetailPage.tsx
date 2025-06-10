import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntryDetail } from '../components';
import { useJournalEntries } from '../hooks';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { JournalEntry } from '../types';

export const JournalEntryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { 
    approveEntry, 
    postEntry, 
    cancelEntry, 
    reverseEntry 
  } = useJournalEntries();

  const handleEdit = (entry: JournalEntry) => {
    navigate(`/journal-entries/${entry.id}/edit`);
  };

  const handleClose = () => {
    navigate('/journal-entries');
  };

  const handleApprove = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea aprobar el asiento contable ${entry.number}?`
    );

    if (confirmed) {
      const success = await approveEntry(entry.id);
      if (success) {
        // Refresh the page to show updated status
        window.location.reload();
      }
    }
  };

  const handlePost = async (entry: JournalEntry) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea contabilizar el asiento ${entry.number}?\n\nEsta acción afectará los saldos de las cuentas contables.`
    );

    if (confirmed) {
      const success = await postEntry(entry.id);
      if (success) {
        // Refresh the page to show updated status
        window.location.reload();
      }
    }
  };

  const handleCancel = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para cancelar el asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      const success = await cancelEntry(entry.id, reason.trim());
      if (success) {
        // Refresh the page to show updated status
        window.location.reload();
      }
    }
  };

  const handleReverse = async (entry: JournalEntry) => {
    const reason = window.prompt(
      `Ingrese la razón para crear una reversión del asiento ${entry.number}:`
    );

    if (reason !== null && reason.trim()) {
      const success = await reverseEntry(entry.id, reason.trim());
      if (success) {
        // Navigate back to list to see the new reversal entry
        navigate('/journal-entries');
      }
    }
  };

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">ID de asiento contable no válido</p>
            <button
              onClick={() => navigate('/journal-entries')}
              className="text-blue-600 hover:text-blue-800"
            >
              Volver al listado
            </button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to List Button */}
      <div className="mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/journal-entries')}
          className="flex items-center space-x-2"
        >
          <span>←</span>
          <span>Volver al Listado</span>
        </Button>
      </div>

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
          <li className="text-gray-700">Detalle</li>
        </ol>
      </nav>

      <JournalEntryDetail
        entryId={id}
        onEdit={handleEdit}
        onClose={handleClose}
        onApprove={handleApprove}
        onPost={handlePost}
        onCancel={handleCancel}
        onReverse={handleReverse}
      />
    </div>
  );
};
