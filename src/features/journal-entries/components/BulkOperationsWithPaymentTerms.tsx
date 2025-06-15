import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useBulkJournalEntryOperations } from '../hooks/useBulkJournalEntryOperations';
import { formatCurrency } from '../../../shared/utils';
import type { JournalEntry, JournalEntryStatus } from '../types';

interface BulkOperationsWithPaymentTermsProps {
  selectedEntries: JournalEntry[];
  onSuccess?: () => void;
  onSelectionClear?: () => void;
  className?: string;
}

export const BulkOperationsWithPaymentTerms: React.FC<BulkOperationsWithPaymentTermsProps> = ({
  selectedEntries,
  onSuccess,
  onSelectionClear,
  className = ""
}) => {
  const {
    bulkApprove,
    bulkPost,
    bulkCancel,
    bulkReverse,
    bulkResetToDraft,
    loading,
    error,
    clearError
  } = useBulkJournalEntryOperations();

  const [reason, setReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);

  // Calculate totals
  const totalEntries = selectedEntries.length;
  const totalDebit = selectedEntries.reduce((sum, entry) => sum + parseFloat(entry.total_debit), 0);
  const totalCredit = selectedEntries.reduce((sum, entry) => sum + parseFloat(entry.total_credit), 0);

  // Count entries by status
  const statusCounts = selectedEntries.reduce((counts, entry) => {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
    return counts;
  }, {} as Record<JournalEntryStatus, number>);

  // Count entries with payment terms
  const entriesWithPaymentTerms = selectedEntries.filter(entry => 
    entry.lines.some(line => line.payment_terms_id)
  ).length;

  const handleBulkOperation = async (operation: string, requiresReason = false) => {
    if (requiresReason && !reason.trim()) {
      setShowReasonModal(true);
      setPendingOperation(operation);
      return;
    }

    try {
      clearError();
      const entryIds = selectedEntries.map(entry => entry.id);
      const operationReason = requiresReason ? reason : undefined;      switch (operation) {
        case 'approve':
          await bulkApprove(entryIds, operationReason || '', false);
          break;
        case 'post':
          await bulkPost(entryIds, operationReason || '', false);
          break;
        case 'cancel':
          await bulkCancel(entryIds, operationReason || '', false);
          break;        case 'reverse':
          await bulkReverse(entryIds, operationReason || '', new Date().toISOString().split('T')[0], false);
          break;
        case 'reset-to-draft':
          await bulkResetToDraft(entryIds, operationReason || '', false);
          break;
      }

      setReason('');
      setShowReasonModal(false);
      setPendingOperation(null);
      onSuccess?.();
      onSelectionClear?.();
    } catch (error) {
      console.error(`Error in bulk ${operation}:`, error);
    }
  };

  const executeWithReason = () => {
    if (pendingOperation) {
      handleBulkOperation(pendingOperation, true);
    }
  };

  const canApprove = selectedEntries.some(entry => entry.status === 'draft');
  const canPost = selectedEntries.some(entry => ['draft', 'approved'].includes(entry.status));
  const canCancel = selectedEntries.some(entry => ['draft', 'approved', 'posted'].includes(entry.status));
  const canReverse = selectedEntries.some(entry => entry.status === 'posted');
  const canResetToDraft = selectedEntries.some(entry => ['approved', 'cancelled'].includes(entry.status));

  if (totalEntries === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selection Summary */}
      <Card>
        <div className="card-header">
          <h3 className="card-title text-sm">Operaciones Masivas</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{totalEntries}</div>
              <div className="text-gray-600">Asientos seleccionados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{formatCurrency(totalDebit)}</div>
              <div className="text-gray-600">Total Débito</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{formatCurrency(totalCredit)}</div>
              <div className="text-gray-600">Total Crédito</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{entriesWithPaymentTerms}</div>
              <div className="text-gray-600">Con condiciones de pago</div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span
                key={status}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  status === 'posted' ? 'bg-green-100 text-green-800' :
                  status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                {count} {status}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button
              onClick={() => handleBulkOperation('approve')}
              disabled={!canApprove || loading}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              {loading ? <Spinner size="sm" /> : 'Aprobar'}
            </Button>

            <Button
              onClick={() => handleBulkOperation('post')}
              disabled={!canPost || loading}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              {loading ? <Spinner size="sm" /> : 'Contabilizar'}
            </Button>

            <Button
              onClick={() => handleBulkOperation('cancel', true)}
              disabled={!canCancel || loading}
              variant="danger"
              size="sm"
              className="text-xs"
            >
              {loading ? <Spinner size="sm" /> : 'Cancelar'}
            </Button>

            <Button
              onClick={() => handleBulkOperation('reverse', true)}
              disabled={!canReverse || loading}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              {loading ? <Spinner size="sm" /> : 'Reversar'}
            </Button>

            <Button
              onClick={() => handleBulkOperation('reset-to-draft', true)}
              disabled={!canResetToDraft || loading}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              {loading ? <Spinner size="sm" /> : 'A Borrador'}
            </Button>
          </div>

          {entriesWithPaymentTerms > 0 && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
              <div className="font-medium">⚠ Atención:</div>
              <div>
                {entriesWithPaymentTerms} asiento{entriesWithPaymentTerms !== 1 ? 's' : ''} 
                {' '}contiene{entriesWithPaymentTerms === 1 ? '' : 'n'} condiciones de pago que se procesarán automáticamente.
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3">
              <ValidationMessage type="error" message={error} />
            </div>
          )}
        </div>
      </Card>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Motivo de la operación
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingrese el motivo de esta operación..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReasonModal(false);
                  setPendingOperation(null);
                  setReason('');
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={executeWithReason}
                disabled={!reason.trim() || loading}
              >
                {loading ? <Spinner size="sm" /> : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
