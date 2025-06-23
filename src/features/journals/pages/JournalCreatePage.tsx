/**
 * Página de creación de journals
 * Formulario para crear nuevos journals
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { JournalAPI } from '../api/journalAPI';
import type { JournalCreate, JournalFormData, JournalType } from '../types';
import { JournalTypeConst, JournalTypeLabels } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AccountSearchInput } from '@/components/ui/AccountSearchInput';
import { useToast } from '@/shared/contexts/ToastContext';
import { ArrowLeftIcon, SaveIcon } from '@/shared/components/icons';

export function JournalCreatePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  // Watch para auto-generar código y prefijo
  const watchedName = watch('name');
  const watchedType = watch('type');

  // Auto-generar código basado en el nombre
  const generateCode = (name: string) => {
    if (!name) return '';
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10);
  };

  // Auto-generar prefijo basado en tipo y nombre
  const generatePrefix = (type: JournalType, name: string) => {
    const typeMap = {
      sale: 'VEN',
      purchase: 'COM', 
      cash: 'CAJ',
      bank: 'BCO',
      miscellaneous: 'MIS',
    };
    
    const basePrefix = typeMap[type] || 'GEN';
    if (!name) return basePrefix;
    
    const namePrefix = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
    
    return `${basePrefix}${namePrefix}`.substring(0, 10);
  };

  // Handlers
  const handleNameChange = (value: string) => {
    setValue('name', value);
    if (value) {
      setValue('code', generateCode(value));
      setValue('sequence_prefix', generatePrefix(watchedType, value));
    }
  };

  const handleTypeChange = (value: JournalType) => {
    setValue('type', value);
    if (watchedName) {
      setValue('sequence_prefix', generatePrefix(value, watchedName));
    }
  };

  const onSubmit = async (data: JournalFormData) => {
    setIsSubmitting(true);
    
    try {
      // Preparar datos para envío
      const journalData: JournalCreate = {
        ...data,
        default_account_id: data.default_account_id || undefined,
      };

      // Crear journal
      const newJournal = await JournalAPI.createJournal(journalData);
      
      showSuccess('Journal creado exitosamente');
      navigate(`/journals/${newJournal.id}`);
    } catch (error: any) {
      console.error('Error al crear journal:', error);
      showError(
        error.response?.data?.detail || 
        'Error al crear el journal. Por favor, intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/journals');
  };

  // Opciones para selects
  const typeOptions = [    { value: JournalTypeConst.SALE, label: JournalTypeLabels.sale },
    { value: JournalTypeConst.PURCHASE, label: JournalTypeLabels.purchase },
    { value: JournalTypeConst.CASH, label: JournalTypeLabels.cash },
    { value: JournalTypeConst.BANK, label: JournalTypeLabels.bank },
    { value: JournalTypeConst.MISCELLANEOUS, label: JournalTypeLabels.miscellaneous },
  ];

  const paddingOptions = [
    { value: '3', label: '3 dígitos (001)' },
    { value: '4', label: '4 dígitos (0001)' },
    { value: '5', label: '5 dígitos (00001)' },
    { value: '6', label: '6 dígitos (000001)' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Journal</h1>
              <p className="text-gray-600">Crear un nuevo diario contable</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div>
                <Label htmlFor="name">
                  Nombre del Journal *
                </Label>
                <Input
                  id="name"
                  {...register('name', { 
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  })}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Ventas General"
                  error={errors.name?.message}
                />
              </div>              <div>
                <Label htmlFor="type">
                  Tipo de Journal *
                </Label>
                <Select
                  value={watch('type')}
                  onChange={(value) => handleTypeChange(value as JournalType)}
                  options={typeOptions}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>              <div>
                <Label htmlFor="code">
                  Código *
                </Label>
                <Input
                  id="code"
                  {...register('code', { 
                    required: 'El código es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9]+$/,
                      message: 'Solo letras mayúsculas y números',
                    },
                  })}
                  placeholder="Ej: VENGEN"
                  maxLength={10}
                  error={errors.code?.message}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Código único del journal (solo letras mayúsculas y números)
                </p>
              </div>              <div>
                <Label htmlFor="sequence_prefix">
                  Prefijo de Secuencia *
                </Label>
                <Input
                  id="sequence_prefix"
                  {...register('sequence_prefix', { 
                    required: 'El prefijo es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9]+$/,
                      message: 'Solo letras mayúsculas y números',
                    },
                  })}
                  placeholder="Ej: VEN"
                  maxLength={10}
                  error={errors.sequence_prefix?.message}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Prefijo para los números de secuencia (ej: VEN/2025/0001)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description">
                Descripción
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descripción opcional del propósito del journal"
                rows={3}
              />
            </div>
          </Card>

          {/* Configuración de secuencia */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración de Secuencia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="sequence_padding">
                  Relleno de Secuencia
                </Label>
                <Select
                  value={watch('sequence_padding')?.toString() || '4'}
                  onChange={(value) => setValue('sequence_padding', Number(value))}
                  options={paddingOptions}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Número de dígitos para el contador
                </p>
              </div>

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
          </Card>

          {/* Configuración avanzada */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración Avanzada
            </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="default_account_id">
                  Cuenta Contable por Defecto
                </Label>                <AccountSearchInput
                  value={watch('default_account_id')}
                  onChange={(accountId) => {
                    setValue('default_account_id', accountId);
                  }}
                  placeholder="Buscar cuenta contable..."
                  limit={15}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cuenta contable que se usará por defecto en los asientos
                </p>
              </div>

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
          </Card>

          {/* Acciones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Crear Journal
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JournalCreatePage;
