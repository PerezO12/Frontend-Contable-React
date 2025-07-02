/**
 * Página de edición de journal con configuración bancaria
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useJournal } from '../hooks/useJournals';
import { useBankJournalConfig } from '../hooks/useBankJournalConfig';
import type { JournalFormData, JournalType } from '../types';
import { JournalTypeLabels } from '../types';
import { JournalAPI } from '../api/journalAPI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AccountSearchInput } from '@/components/ui/AccountSearchInput';
import { BankJournalConfigForm } from '../components/BankJournalConfigForm';
import { useToast } from '@/shared/contexts/ToastContext';
import { ArrowLeftIcon, SaveIcon } from '@/shared/components/icons';

export function JournalEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  // Estados
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const { journal, loading: fetchLoading, error } = useJournal(id);
  const {
    bankConfig,
    loading: bankConfigLoading,
    saving: bankConfigSaving,
    error: bankConfigError,
    validation,
    fetchBankConfig,
    createBankConfig,
    updateBankConfig,
    deleteBankConfig,
    validateBankConfig,
  } = useBankJournalConfig();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<JournalFormData>({
    defaultValues: {
      name: '',
      code: '',
      type: 'sale' as JournalType,
      sequence_prefix: '',
      sequence_padding: 4,
      include_year_in_sequence: true,
      reset_sequence_yearly: true,
      requires_validation: false,
      allow_manual_entries: true,
      is_active: true,
      description: '',
    },
  });

  // Cargar datos del journal en el formulario
  useEffect(() => {
    if (journal) {
      reset({
        name: journal.name,
        code: journal.code,
        type: journal.type,
        sequence_prefix: journal.sequence_prefix,
        default_account_id: journal.default_account_id || undefined,
        sequence_padding: journal.sequence_padding,
        include_year_in_sequence: journal.include_year_in_sequence,
        reset_sequence_yearly: journal.reset_sequence_yearly,
        requires_validation: journal.requires_validation,
        allow_manual_entries: journal.allow_manual_entries,
        is_active: journal.is_active,
        description: journal.description || '',
      });
    }
  }, [journal, reset]);

  // Cargar configuración bancaria si es journal tipo banco
  useEffect(() => {
    if (journal?.id && journal.type === 'bank') {
      fetchBankConfig(journal.id).catch(() => {
        // Ignorar error si no existe configuración bancaria
      });
    }
  }, [journal?.id, journal?.type, fetchBankConfig]);

  // Handlers
  const handleGoBack = () => {
    navigate('/journals');
  };

  const onSubmit = async (data: JournalFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const updateData = {
        name: data.name,
        default_account_id: data.default_account_id || undefined,
        sequence_padding: data.sequence_padding,
        include_year_in_sequence: data.include_year_in_sequence,
        reset_sequence_yearly: data.reset_sequence_yearly,
        requires_validation: data.requires_validation,
        allow_manual_entries: data.allow_manual_entries,
        is_active: data.is_active,
        description: data.description,
      };

      await JournalAPI.updateJournal(id, updateData);
      showSuccess('Journal actualizado exitosamente');
      navigate(`/journals/${id}`);
    } catch (error) {
      console.error('Error al actualizar journal:', error);
      showError('Error al actualizar el journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers para configuración bancaria
  const handleCreateBankConfig = async (data: any) => {
    if (!journal?.id) return;
    await createBankConfig(journal.id, data);
  };

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

  // Loading
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el journal</p>
          <Button variant="outline" onClick={() => navigate('/journals')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Journal no encontrado</p>
          <Button variant="outline" onClick={() => navigate('/journals')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver al listado
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Journal: {journal.name}
        </h1>
        <p className="text-gray-600">
          Código: {journal.code} | Tipo: {JournalTypeLabels[journal.type]}
        </p>
      </div>

      <div className="space-y-6">
        {/* Formulario principal del journal */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Journal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  error={errors.name?.message}
                />
              </div>

              <div>
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  {...register('code')}
                  disabled
                  className="bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">El código no se puede modificar</p>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  {...register('type')}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {Object.entries(JournalTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">El tipo no se puede modificar</p>
              </div>

              <div>
                <Label htmlFor="sequence_prefix">Prefijo de Secuencia</Label>
                <Input
                  id="sequence_prefix"
                  {...register('sequence_prefix')}
                  disabled
                  className="bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">El prefijo no se puede modificar</p>
              </div>
            </div>

            {/* Cuenta por defecto */}
            <div>
              <Label htmlFor="default_account_id">
                Cuenta Contable por Defecto
              </Label>
              <AccountSearchInput
                value={watch('default_account_id')}
                onChange={(accountId) => setValue('default_account_id', accountId)}
                placeholder="Buscar cuenta contable..."
                limit={15}
              />
              <p className="mt-1 text-xs text-gray-500">
                Cuenta contable que se usará por defecto en los asientos
              </p>
            </div>

            {/* Configuración de secuencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sequence_padding">Relleno de Secuencia</Label>
                <select
                  id="sequence_padding"
                  {...register('sequence_padding', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={3}>3 dígitos (001)</option>
                  <option value={4}>4 dígitos (0001)</option>
                  <option value={5}>5 dígitos (00001)</option>
                  <option value={6}>6 dígitos (000001)</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="include_year_in_sequence"
                    {...register('include_year_in_sequence')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="include_year_in_sequence" className="!mb-0">
                    Incluir año en secuencia
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reset_sequence_yearly"
                    {...register('reset_sequence_yearly')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="reset_sequence_yearly" className="!mb-0">
                    Resetear secuencia anualmente
                  </Label>
                </div>
              </div>
            </div>

            {/* Configuración adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="requires_validation"
                    {...register('requires_validation')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="requires_validation" className="!mb-0">
                    Requiere validación
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allow_manual_entries"
                    {...register('allow_manual_entries')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="allow_manual_entries" className="!mb-0">
                    Permitir asientos manuales
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="is_active" className="!mb-0">
                    Journal activo
                  </Label>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={3}
                placeholder="Descripción opcional del journal..."
              />
            </div>

            {/* Botones del formulario principal */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Configuración bancaria - Solo para journals tipo BANK */}
        {journal.type === 'bank' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Configuración Bancaria
                </h2>
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
              <BankJournalConfigForm
                journalId={journal.id}
                initialData={bankConfig}
                onSubmit={handleUpdateBankConfig}
                isSubmitting={bankConfigSaving}
                errors={validation?.errors || []}
                warnings={validation?.warnings || []}
              />
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
                        Este journal no tiene configuración bancaria. Crear una configuración permitirá 
                        funcionalidades avanzadas como gestión de pagos, conciliación automática y más.
                      </p>
                    </div>
                  </div>
                </div>

                <BankJournalConfigForm
                  journalId={journal.id}
                  onSubmit={handleCreateBankConfig}
                  isSubmitting={bankConfigSaving}
                  errors={validation?.errors || []}
                  warnings={validation?.warnings || []}
                />
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
      </div>
    </div>
  );
}

export default JournalEditPage;
