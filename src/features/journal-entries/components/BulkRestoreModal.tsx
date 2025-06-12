import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';
import { Alert } from '../../../components/ui/Alert';
import { Textarea } from '../../../components/ui/Textarea';
import type { JournalEntry } from '../types';

interface BulkRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntryIds: string[];
  onBulkRestore: (entryIds: string[], reason: string) => Promise<{
    total_requested: number;
    total_restored: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }>;
  onSuccess?: (result: any) => void;
}

export const BulkRestoreModal: React.FC<BulkRestoreModalProps> = ({
  isOpen,
  onClose,
  selectedEntryIds,
  onBulkRestore,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [restoreResult, setRestoreResult] = useState<any>(null);

  // Manejar la restauración masiva
  const handleRestore = async () => {
    if (!restoreReason.trim()) {
      setError('La razón de restauración es requerida');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await onBulkRestore(
        selectedEntryIds,
        restoreReason.trim()
      );
      
      setRestoreResult(result);
      setShowResults(true);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restaurar asientos');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar contenido del modal según el estado actual
  const renderContent = () => {
    if (loading) {      return (
        <div className="flex flex-col items-center justify-center p-6">
          <Spinner size="md" />
          <p className="mt-4 text-gray-600">Restaurando asientos contables...</p>
        </div>
      );
    }

    if (showResults) {
      return renderResults();
    }

    return renderForm();
  };

  // Renderizar formulario de restauración
  const renderForm = () => {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Restaurar {selectedEntryIds.length} asiento(s) a borrador</h2>
        
        <p className="mb-4 text-gray-600">
          Esta acción restaurará el estado de los asientos seleccionados a "Borrador", 
          permitiendo su edición y modificación. Los asientos volverán a requerir aprobación.
        </p>
        
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="mb-4">
          <label htmlFor="restore-reason" className="block mb-2 font-medium text-gray-700">
            Razón de la restauración <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="restore-reason"
            value={restoreReason}
            onChange={(e) => setRestoreReason(e.target.value)}
            placeholder="Ingrese la razón para restaurar estos asientos a borrador..."
            className="w-full"
            rows={3}
          />
          <p className="mt-1 text-sm text-gray-500">
            Esta información quedará registrada en el historial de cambios.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRestore} 
            disabled={!restoreReason.trim() || loading}
          >
            Restaurar a borrador
          </Button>
        </div>
      </div>
    );
  };

  // Renderizar resultados de la restauración
  const renderResults = () => {    if (!restoreResult) return null;
    
    const { total_requested, total_restored, total_failed, failed_entries } = restoreResult;
    
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resultados de la restauración</h2>
        
        <div className="p-4 rounded-md bg-gray-50 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500">Solicitados</p>
              <p className="text-xl font-semibold">{total_requested}</p>
            </div>
            <div>
              <p className="text-green-500">Restaurados</p>
              <p className="text-xl font-semibold text-green-600">{total_restored}</p>
            </div>
            <div>
              <p className="text-red-500">Fallidos</p>
              <p className="text-xl font-semibold text-red-600">{total_failed}</p>
            </div>
          </div>
        </div>
        
        {failed_entries.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Asientos que no pudieron restaurarse:</h3>            <ul className="list-disc pl-5 space-y-1">
              {failed_entries.map((entry: { id: string; error: string }) => (
                <li key={entry.id} className="text-red-600">
                  {entry.id}: {entry.error}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {renderContent()}
    </Modal>
  );
};
