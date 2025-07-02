/**
 * Página de detalle de journal
 * Muestra información completa de un journal específico incluyendo configuración bancaria
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournal, useJournalStats, useJournalSequence } from '../hooks/useJournals';
import { useBankJournalConfig } from '../hooks/useBankJournalConfig';
import { JournalTypeLabels, JournalTypeColors } from '../types';
import { formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BankJournalConfigForm } from '../components/BankJournalConfigForm';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@/shared/components/icons';

export function JournalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  // Estados locales
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetReason, setResetReason] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'sequence' | 'bank-config'>('info');

  // Hooks
  const {
    journal,
    loading,
    error,
    delete: deleteJournal,
    resetSequence,
    clearError,
  } = useJournal(id);

  const {
    stats,
    loading: statsLoading,
    refresh: refreshStats,
  } = useJournalStats(id || '', !!id);

  const {
    sequenceInfo,
    loading: sequenceLoading,
    refresh: refreshSequence,
  } = useJournalSequence(id || '', !!id);

  const {
    loading: bankConfigLoading,
    saving: bankConfigSaving,
    error: bankConfigError,
    validation,
    updateBankConfig,
    deleteBankConfig,
    validateBankConfig,
  } = useBankJournalConfig();

  useEffect(() => {
    clearError();
  }, [clearError]);

  // Obtener configuración bancaria desde el journal (ya incluida en la respuesta)
  const bankConfig = journal?.bank_config;
  
  // Debug: verificar el estado de bank_config
  console.log('🔍 Journal:', journal);
  console.log('🔍 Bank Config:', bankConfig);
  console.log('🔍 Journal Type:', journal?.type);
  console.log('🔍 Is Bank Type:', journal?.type === 'bank');
  console.log('🔍 Has Bank Config:', !!bankConfig);

  // Handlers para configuración bancaria
  const handleUpdateBankConfig = async (data: any) => {
    if (!journal?.id) return;
    await updateBankConfig(journal.id, data);
  };

  const handleDeleteBankConfig = async () => {
    if (!journal?.id) return;
    if (confirm('¿Estás seguro de que deseas eliminar la configuración bancaria?')) {
      await deleteBankConfig(journal.id);
    }
  };

  const handleValidateBankConfig = async () => {
    if (!journal?.id) return;
    await validateBankConfig(journal.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => navigate('/journals')} variant="outline">
          Volver a Journals
        </Button>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Journal no encontrado</div>
        <Button onClick={() => navigate('/journals')} variant="outline">
          Volver a Journals
        </Button>
      </div>
    );
  }

  // Handlers
  const handleEdit = () => {
    navigate(`/journals/${journal.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteJournal();
      showSuccess('Journal eliminado exitosamente');
      navigate('/journals');
    } catch (error: any) {
      showError(error.message || 'Error al eliminar journal');
    }
    setShowDeleteDialog(false);
  };

  const handleResetSequence = async () => {
    if (!resetReason.trim()) {
      showError('Debe proporcionar una razón para resetear la secuencia');
      return;
    }

    try {
      await resetSequence({
        confirm: true,
        reason: resetReason,
      });
      showSuccess('Secuencia reseteada exitosamente');
      setShowResetDialog(false);
      setResetReason('');
      refreshSequence();
    } catch (error: any) {
      showError(error.message || 'Error al resetear secuencia');
    }
  };

  const handleGoToJournalEntries = () => {
    navigate(`/journal-entries?journal_id=${journal.id}`);
  };

  // Renderizar pestañas
  const renderTabButton = (tabId: 'info' | 'stats' | 'sequence' | 'bank-config', label: string) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        activeTab === tabId
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/journals')}
              variant="outline"
              size="sm"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{journal.name}</h1>
                <Badge className={JournalTypeColors[journal.type]}>
                  {JournalTypeLabels[journal.type]}
                </Badge>
                {!journal.is_active && (
                  <Badge className="bg-red-100 text-red-800">
                    Inactivo
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                Código: {journal.code} • Prefijo: {journal.sequence_prefix}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleGoToJournalEntries}
              variant="outline"
              size="sm"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Ver Asientos
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="danger"
              size="sm"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          {renderTabButton('info', 'Información')}
          {renderTabButton('stats', 'Estadísticas')}
          {renderTabButton('sequence', 'Secuencia')}
          {journal.type === 'bank' && renderTabButton('bank-config', 'Config. Bancaria')}
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información básica */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Básica
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-sm text-gray-900">{journal.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código</label>
                  <p className="text-sm text-gray-900">{journal.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-sm text-gray-900">{JournalTypeLabels[journal.type]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-sm text-gray-900">{journal.description || 'Sin descripción'}</p>
                </div>
              </div>
            </Card>

            {/* Configuración */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración
              </h2>              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prefijo de Secuencia</label>
                  <p className="text-sm text-gray-900">{journal.sequence_prefix}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relleno de Secuencia</label>
                  <p className="text-sm text-gray-900">{journal.sequence_padding} dígitos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cuenta por Defecto</label>
                  <p className="text-sm text-gray-900">
                    {journal.default_account 
                      ? `${journal.default_account.code} - ${journal.default_account.name}`
                      : 'Sin cuenta por defecto'
                    }
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Incluir Año</label>
                    <p className="text-sm text-gray-900">
                      {journal.include_year_in_sequence ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reset Anual</label>
                    <p className="text-sm text-gray-900">
                      {journal.reset_sequence_yearly ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requiere Validación</label>
                    <p className="text-sm text-gray-900">
                      {journal.requires_validation ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Asientos Manuales</label>
                    <p className="text-sm text-gray-900">
                      {journal.allow_manual_entries ? 'Permitidos' : 'No permitidos'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Auditoría */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Auditoría
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p className="text-sm text-gray-900">{formatDate(journal.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                  <p className="text-sm text-gray-900">{formatDate(journal.updated_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creado Por</label>
                  <p className="text-sm text-gray-900">{journal.created_by?.name || 'Sistema'}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Estadísticas</h2>
              <Button
                onClick={refreshStats}
                variant="outline"
                size="sm"
                disabled={statsLoading}
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
            
            {statsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_entries}</div>
                  <div className="text-sm text-gray-600">Total de Asientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.total_entries_current_year}</div>
                  <div className="text-sm text-gray-600">Este Año</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.total_entries_current_month}</div>
                  <div className="text-sm text-gray-600">Este Mes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.avg_entries_per_month.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Promedio Mensual</div>
                </div>
                {stats.last_entry_date && (
                  <div className="text-center md:col-span-2 lg:col-span-4">
                    <div className="text-sm text-gray-600">
                      Último asiento: {formatDate(stats.last_entry_date)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay estadísticas disponibles
              </div>
            )}
          </Card>
        )}

        {activeTab === 'sequence' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Información de Secuencia</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={refreshSequence}
                  variant="outline"
                  size="sm"
                  disabled={sequenceLoading}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
                <Button
                  onClick={() => setShowResetDialog(true)}
                  variant="danger"
                  size="sm"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Resetear Secuencia
                </Button>
              </div>
            </div>
            
            {sequenceLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : sequenceInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número Actual</label>
                  <p className="text-lg font-semibold text-gray-900">{sequenceInfo.current_sequence_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Próximo Número</label>
                  <p className="text-lg font-semibold text-blue-600">{sequenceInfo.next_sequence_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Último Reset</label>
                  <p className="text-sm text-gray-900">
                    {sequenceInfo.last_sequence_reset_year || 'Nunca'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Configuración</label>
                  <div className="text-sm text-gray-900">
                    <p>Incluir año: {sequenceInfo.include_year_in_sequence ? 'Sí' : 'No'}</p>
                    <p>Reset anual: {sequenceInfo.reset_sequence_yearly ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay información de secuencia disponible
              </div>
            )}
          </Card>
        )}

        {activeTab === 'bank-config' && journal.type === 'bank' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Configuración Bancaria</h2>
                <p className="text-sm text-gray-600">
                  Configuración avanzada para operaciones bancarias
                </p>
              </div>
              
              {/* Botones de acción para configuración bancaria */}
              <div className="flex space-x-2">
                {bankConfig && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleValidateBankConfig}
                      disabled={bankConfigLoading}
                      size="sm"
                    >
                      Validar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDeleteBankConfig}
                      disabled={bankConfigSaving}
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {bankConfigLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600">Cargando configuración bancaria...</span>
              </div>
            ) : bankConfig ? (
              <div>
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        Configuración Activa
                      </h4>
                      <p className="mt-1 text-sm text-green-700">
                        Este journal tiene configuración bancaria activa. Puedes editarla usando el botón "Editar Journal".
                      </p>
                    </div>
                  </div>
                </div>

                <BankJournalConfigForm
                  journalId={journal.id}
                  initialData={bankConfig}
                  onSubmit={handleUpdateBankConfig}
                  isSubmitting={bankConfigSaving}
                  errors={validation?.errors || []}
                  warnings={validation?.warnings || []}
                />
              </div>
            ) : (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">
                        Sin Configuración Bancaria
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Este journal no tiene configuración bancaria. Puedes crear una usando el botón "Editar Journal".
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <Button
                    onClick={() => navigate(`/journals/${journal.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Editar Journal para Configurar
                  </Button>
                </div>
              </div>
            )}

            {bankConfigError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error</h4>
                    <p className="mt-1 text-sm text-red-700">{bankConfigError}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Diálogo de confirmación para eliminar */}
        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Eliminar Journal"
          description={`¿Está seguro que desea eliminar el journal "${journal?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />

        {/* Diálogo para resetear secuencia */}
        <ConfirmDialog
          open={showResetDialog}
          onClose={() => {
            setShowResetDialog(false);
            setResetReason('');
          }}
          onConfirm={handleResetSequence}
          title="Resetear Secuencia"
          description="¿Está seguro que desea resetear la secuencia? Esto reiniciará el contador a 0."
          confirmText="Resetear"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      </div>
    </div>
  );
}

export default JournalDetailPage;
