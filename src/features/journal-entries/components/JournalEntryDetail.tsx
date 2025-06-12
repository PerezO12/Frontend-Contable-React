import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntry } from '../hooks';
import { useJournalEntryStatusListener } from '../hooks/useJournalEntryEvents';
import { formatCurrency } from '../../../shared/utils';
import { 
  JournalEntryStatus,
  JournalEntryType,
  JOURNAL_ENTRY_TYPE_LABELS,
  JOURNAL_ENTRY_STATUS_LABELS,
  type JournalEntry 
} from '../types';

interface JournalEntryDetailProps {
  entryId: string;
  onEdit?: (entry: JournalEntry) => void;
  onClose?: () => void;
  onApprove?: (entry: JournalEntry) => void;
  onPost?: (entry: JournalEntry) => void;
  onCancel?: (entry: JournalEntry) => void;
  onReverse?: (entry: JournalEntry) => void;
}

type TabType = 'info' | 'lines' | 'audit';

export const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({
  entryId,
  onEdit,
  onClose,
  onApprove,
  onPost,
  onCancel,
  onReverse
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const { entry, loading, error, updateLocalEntry } = useJournalEntry(entryId);

  // Escuchar cambios de estado del asiento contable específico
  useJournalEntryStatusListener(entryId, (event) => {
    if (event.entry) {
      // Actualizar el asiento local con los nuevos datos
      updateLocalEntry(event.entry);
    }
  });

  if (loading) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando asiento contable...</p>
        </div>
      </Card>
    );
  }

  if (error || !entry) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">
            {error || 'No se pudo cargar el asiento contable'}
          </p>
          {onClose && (
            <Button onClick={onClose} variant="secondary">
              Volver
            </Button>
          )}
        </div>
      </Card>
    );
  }
  const getStatusColor = (status: JournalEntryStatus) => {
    const colors = {
      [JournalEntryStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [JournalEntryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [JournalEntryStatus.APPROVED]: 'bg-blue-100 text-blue-800',
      [JournalEntryStatus.POSTED]: 'bg-green-100 text-green-800',
      [JournalEntryStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getTypeColor = (type: JournalEntryType) => {
    const colors = {
      [JournalEntryType.MANUAL]: 'bg-blue-100 text-blue-800',
      [JournalEntryType.AUTOMATIC]: 'bg-purple-100 text-purple-800',
      [JournalEntryType.ADJUSTMENT]: 'bg-orange-100 text-orange-800',
      [JournalEntryType.OPENING]: 'bg-green-100 text-green-800',
      [JournalEntryType.CLOSING]: 'bg-red-100 text-red-800',
      [JournalEntryType.REVERSAL]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type];
  };
  const canEdit = entry.status === JournalEntryStatus.DRAFT;
  const canApprove = entry.status === JournalEntryStatus.DRAFT || entry.status === JournalEntryStatus.PENDING;
  const canPost = entry.status === JournalEntryStatus.APPROVED;
  const canCancel = 
    entry.status === JournalEntryStatus.DRAFT || 
    entry.status === JournalEntryStatus.PENDING || 
    entry.status === JournalEntryStatus.APPROVED;
  const canReverse = 
    entry.status === JournalEntryStatus.POSTED && 
    entry.entry_type !== JournalEntryType.REVERSAL;

  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Número:</dt>
              <dd className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {entry.number}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Fecha:</dt>
              <dd className="text-sm text-gray-900">
                {new Date(entry.entry_date).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Tipo:</dt>
              <dd>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(entry.entry_type)}`}>
                  {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Estado:</dt>
              <dd>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                  {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                </span>
              </dd>
            </div>
            {entry.reference && (
              <div>
                <dt className="text-sm text-gray-600">Referencia:</dt>
                <dd className="text-sm text-gray-900">{entry.reference}</dd>
              </div>
            )}
            {entry.external_reference && (
              <div>
                <dt className="text-sm text-gray-600">Referencia Externa:</dt>
                <dd className="text-sm text-gray-900">{entry.external_reference}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Totales</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Total Débito:</dt>
              <dd className="text-sm font-mono text-green-700">
                {formatCurrency(parseFloat(entry.total_debit))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Total Crédito:</dt>
              <dd className="text-sm font-mono text-blue-700">
                {formatCurrency(parseFloat(entry.total_credit))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Balance:</dt>
              <dd className="text-sm font-mono text-green-700">
                {parseFloat(entry.total_debit) === parseFloat(entry.total_credit) 
                  ? '✓ Balanceado' 
                  : '⚠ Desbalanceado'
                }
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Description and Notes */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Descripción</h4>
        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
          {entry.description}
        </p>
      </div>

      {entry.notes && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Notas</h4>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
            {entry.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderLinesTab = () => (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Líneas</p>
          <p className="text-lg font-semibold text-gray-900">
            {entry.lines.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Débito</p>
          <p className="text-lg font-semibold text-green-700">
            {formatCurrency(parseFloat(entry.total_debit))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Crédito</p>
          <p className="text-lg font-semibold text-blue-700">
            {formatCurrency(parseFloat(entry.total_credit))}
          </p>
        </div>
      </div>

      {/* Lines Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Cuenta</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">Débito</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">Crédito</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Referencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entry.lines
              .sort((a, b) => a.line_number - b.line_number)
              .map((line) => (
                <tr key={line.id}>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{line.line_number}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-mono text-gray-900">
                        {line.account_code}
                      </p>
                      <p className="text-sm text-gray-600">
                        {line.account_name}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">
                      {line.description || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-mono ${
                      parseFloat(line.debit_amount) > 0 
                        ? 'text-green-700 font-semibold' 
                        : 'text-gray-400'
                    }`}>
                      {parseFloat(line.debit_amount) > 0 
                        ? formatCurrency(parseFloat(line.debit_amount))
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-mono ${
                      parseFloat(line.credit_amount) > 0 
                        ? 'text-blue-700 font-semibold' 
                        : 'text-gray-400'
                    }`}>
                      {parseFloat(line.credit_amount) > 0 
                        ? formatCurrency(parseFloat(line.credit_amount))
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {line.reference || '-'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Información de Creación</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Creado por:</dt>
              <dd className="text-sm text-gray-900">
                {entry.created_by_name || 'Usuario'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Fecha de creación:</dt>
              <dd className="text-sm text-gray-900">
                {new Date(entry.created_at).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Última actualización:</dt>
              <dd className="text-sm text-gray-900">
                {new Date(entry.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Historial de Estados</h4>
          <dl className="space-y-2">
            {entry.approved_by_id && (
              <div>
                <dt className="text-sm text-gray-600">Aprobado por:</dt>
                <dd className="text-sm text-gray-900">
                  {entry.approved_by_name || 'Usuario'}
                  {entry.approved_at && (
                    <span className="text-gray-500 ml-2">
                      ({new Date(entry.approved_at).toLocaleString()})
                    </span>
                  )}
                </dd>
              </div>
            )}
            {entry.posted_by_id && (
              <div>
                <dt className="text-sm text-gray-600">Contabilizado por:</dt>
                <dd className="text-sm text-gray-900">
                  {entry.posted_by_name || 'Usuario'}
                  {entry.posted_at && (
                    <span className="text-gray-500 ml-2">
                      ({new Date(entry.posted_at).toLocaleString()})
                    </span>
                  )}
                </dd>
              </div>
            )}
            {entry.cancelled_by_id && (
              <div>
                <dt className="text-sm text-gray-600">Cancelado por:</dt>
                <dd className="text-sm text-gray-900">
                  {entry.cancelled_by_name || 'Usuario'}
                  {entry.cancelled_at && (
                    <span className="text-gray-500 ml-2">
                      ({new Date(entry.cancelled_at).toLocaleString()})
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      {onClose && (
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>Volver al Listado</span>
          </Button>
          <div className="h-4 border-l border-gray-300"></div>
          <span className="text-sm text-gray-500">
            Navegación rápida hacia el listado de asientos contables
          </span>
        </div>
      )}

      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(entry.entry_type)}`}>
                  {JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(entry.status)}`}>
                  {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Asiento #{entry.number}
              </h1>
              <p className="text-gray-600 mt-1">{entry.description}</p>
            </div>

            <div className="flex space-x-2">
              {canEdit && onEdit && (
                <Button
                  variant="secondary"
                  onClick={() => onEdit(entry)}
                >
                  Editar
                </Button>
              )}
              {canApprove && onApprove && (
                <Button
                  variant="success"
                  onClick={() => onApprove(entry)}
                >
                  Aprobar
                </Button>
              )}
              {canPost && onPost && (
                <Button
                  variant="primary"
                  onClick={() => onPost(entry)}
                >
                  Contabilizar
                </Button>
              )}
              {canReverse && onReverse && (
                <Button
                  variant="warning"
                  onClick={() => onReverse(entry)}
                >
                  Revertir
                </Button>
              )}
              {canCancel && onCancel && (
                <Button
                  variant="danger"
                  onClick={() => onCancel(entry)}
                >
                  Cancelar
                </Button>
              )}
              {onClose && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Información' },
              { id: 'lines', label: 'Líneas' },
              { id: 'audit', label: 'Auditoría' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="card-body">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'lines' && renderLinesTab()}
          {activeTab === 'audit' && renderAuditTab()}
        </div>
      </Card>
    </div>
  );
};
