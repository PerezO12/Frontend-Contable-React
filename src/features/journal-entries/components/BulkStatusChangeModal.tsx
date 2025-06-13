import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { JournalEntryStatus, JOURNAL_ENTRY_STATUS_LABELS } from '../types';

interface BulkStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntryIds: string[];
  onChangeStatus: (entryIds: string[], newStatus: JournalEntryStatus, reason?: string) => Promise<any>;
  onSuccess?: (result: any) => void;
}

interface StatusOption {
  value: JournalEntryStatus;
  label: string;
  description: string;
  requiresReason: boolean;
  icon: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: JournalEntryStatus.DRAFT,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.DRAFT],
    description: 'Restaurar los asientos a estado borrador para edición',
    requiresReason: true,
    icon: '📝'
  },
  {
    value: JournalEntryStatus.PENDING,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.PENDING],
    description: 'Marcar como pendientes de revisión',
    requiresReason: false,
    icon: '⏳'
  },
  {
    value: JournalEntryStatus.APPROVED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.APPROVED],
    description: 'Aprobar los asientos seleccionados',
    requiresReason: false,
    icon: '✅'
  },
  {
    value: JournalEntryStatus.POSTED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.POSTED],
    description: 'Contabilizar los asientos (afectará saldos)',
    requiresReason: true,
    icon: '📊'
  },
  {
    value: JournalEntryStatus.CANCELLED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.CANCELLED],
    description: 'Cancelar los asientos seleccionados',
    requiresReason: true,
    icon: '❌'
  }
];

export const BulkStatusChangeModal: React.FC<BulkStatusChangeModalProps> = ({
  isOpen,
  onClose,
  selectedEntryIds,
  onChangeStatus,
  onSuccess
}) => {
  const [selectedStatus, setSelectedStatus] = useState<JournalEntryStatus | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOption = STATUS_OPTIONS.find(option => option.value === selectedStatus);
  const requiresReason = selectedOption?.requiresReason || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setError('Debe seleccionar un estado');
      return;
    }

    if (requiresReason && !reason.trim()) {
      setError('Debe proporcionar una razón para esta operación');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onChangeStatus(
        selectedEntryIds, 
        selectedStatus, 
        requiresReason ? reason.trim() : undefined
      );
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      setError(error.message || 'Error al cambiar el estado de los asientos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setReason('');
    setError(null);
    onClose();
  };

  const handleStatusSelect = (status: JournalEntryStatus) => {
    setSelectedStatus(status);
    setError(null);
    // Limpiar razón si el nuevo estado no la requiere
    if (!STATUS_OPTIONS.find(opt => opt.value === status)?.requiresReason) {
      setReason('');
    }
  };

  if (!isOpen) return null;  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-full max-w-2xl transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Cambiar Estado de Asientos
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Se cambiarán <strong>{selectedEntryIds.length}</strong> asiento{selectedEntryIds.length !== 1 ? 's' : ''} contable{selectedEntryIds.length !== 1 ? 's' : ''} al estado seleccionado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar nuevo estado
              </label>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${selectedStatus === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                    `}
                    onClick={() => handleStatusSelect(option.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{option.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="status"
                            value={option.value}
                            checked={selectedStatus === option.value}
                            onChange={() => handleStatusSelect(option.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                          {option.requiresReason && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Requiere razón
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campo de Razón */}
            {requiresReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Ingrese la razón para ${selectedOption?.label.toLowerCase()} los asientos...`}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!selectedStatus || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Procesando...' : 'Cambiar Estado'}
              </Button>            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};
