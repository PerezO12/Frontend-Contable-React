import React, { useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useAccounts } from '../hooks';
import { 
  accountCreateSchema, 
  AccountType, 
  AccountCategory,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_CATEGORY_LABELS
} from '../types';
import type { AccountCreateForm } from '../types';
import type { Account } from '../types';

interface AccountFormProps {
  onSuccess?: (account: Account) => void;
  onCancel?: () => void;
  parentAccount?: Account;
  initialData?: Partial<AccountCreateForm>;
  isEditMode?: boolean;  // Indica si el formulario está en modo edición
  accountId?: string;    // ID de la cuenta que se está editando
}

export const AccountForm: React.FC<AccountFormProps> = ({
  onSuccess,
  onCancel,
  parentAccount,
  initialData,
  isEditMode = false,
  accountId
}) => {
  const { createAccount, updateAccount, loading } = useAccounts();
  const {
    data: values,
    updateField,
    handleSubmit,
    getFieldError
  } = useForm<AccountCreateForm>({
    initialData: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      account_type: initialData?.account_type || AccountType.ACTIVO,
      category: initialData?.category || AccountCategory.ACTIVO_CORRIENTE,
      parent_id: parentAccount?.id || initialData?.parent_id,
      is_active: initialData?.is_active ?? true,
      allows_movements: initialData?.allows_movements ?? true,
      requires_third_party: initialData?.requires_third_party ?? false,
      requires_cost_center: initialData?.requires_cost_center ?? false,
      notes: initialData?.notes || ''
    },
    validate: (data) => {
      const result = accountCreateSchema.safeParse(data);
      if (!result.success) {
        return result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
      }
      return [];
    },    onSubmit: async (formData) => {
      console.log('Enviando datos al backend:', formData);
      
      if (isEditMode && accountId) {
        // Modo edición
        const result = await updateAccount(accountId, formData);
        if (result && onSuccess) {
          onSuccess(result);
        }
      } else {
        // Modo creación
        const result = await createAccount(formData);
        if (result && onSuccess) {
          onSuccess(result);
        }
      }
    }
  });

  const handleInputChange = (field: keyof AccountCreateForm) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      updateField(field, e.target.value);
    };

  const handleCheckboxChange = (field: keyof AccountCreateForm) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField(field, e.target.checked);
    };  // Quitamos la verificación automática en tiempo real para evitar solicitudes innecesarias
  // Ahora se verificará solo al enviar el formulario

  // Get available categories based on account type
  const getAvailableCategories = (accountType: AccountType) => {
    const categoryMapping = {
      [AccountType.ACTIVO]: [
        AccountCategory.ACTIVO_CORRIENTE,
        AccountCategory.ACTIVO_NO_CORRIENTE
      ],
      [AccountType.PASIVO]: [
        AccountCategory.PASIVO_CORRIENTE,
        AccountCategory.PASIVO_NO_CORRIENTE
      ],
      [AccountType.PATRIMONIO]: [
        AccountCategory.CAPITAL,
        AccountCategory.RESERVAS,
        AccountCategory.RESULTADOS
      ],
      [AccountType.INGRESO]: [
        AccountCategory.INGRESOS_OPERACIONALES,
        AccountCategory.INGRESOS_NO_OPERACIONALES
      ],
      [AccountType.GASTO]: [
        AccountCategory.GASTOS_OPERACIONALES,
        AccountCategory.GASTOS_NO_OPERACIONALES
      ],
      [AccountType.COSTOS]: [
        AccountCategory.COSTO_VENTAS,
        AccountCategory.COSTOS_PRODUCCION
      ]
    };

    return categoryMapping[accountType] || [];
  };

  const availableCategories = getAvailableCategories(values.account_type);  // Update category when account type changes
  useEffect(() => {
    if (availableCategories.length > 0) {
      const currentCategory = values.category;
      const categoryInList = availableCategories.find(cat => cat === currentCategory);
      if (!categoryInList) {
        updateField('category', availableCategories[0]);
      }
    }
  }, [values.account_type, availableCategories, values.category, updateField]);

  return (
    <Card>      <div className="card-header">
        <h3 className="card-title">
          {isEditMode 
            ? `Editar Cuenta${parentAccount ? ` Hija de ${parentAccount.name}` : ''}` 
            : parentAccount ? `Nueva Cuenta Hija de ${parentAccount.name}` : 'Nueva Cuenta'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="card-body space-y-6">
        {/* Información de la cuenta padre */}
        {parentAccount && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Cuenta Padre</h4>
            <p className="text-sm text-gray-600">
              <span className="font-mono">{parentAccount.code}</span> - {parentAccount.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tipo: {ACCOUNT_TYPE_LABELS[parentAccount.account_type]} | 
              Nivel: {parentAccount.level + 1}
            </p>
          </div>
        )}

        {/* Código de la cuenta */}
        <div>
          <label htmlFor="code" className="form-label">
            Código de Cuenta *
          </label>
          <div className="relative">            <Input
              id="code"
              name="code"
              value={values.code}
              onChange={handleInputChange('code')}
              placeholder="Ej: 1.1.02.01"
              className="font-mono"
              error={getFieldError('code')}
            />
          </div>
          {getFieldError('code') && (
            <ValidationMessage type="error" message={getFieldError('code')!} />
          )}
          <p className="text-sm text-gray-500 mt-1">
            Use un formato alfanumérico con puntos como separadores (ej: 1.1.02.01)
          </p>
        </div>

        {/* Nombre de la cuenta */}
        <div>
          <label htmlFor="name" className="form-label">
            Nombre de la Cuenta *
          </label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleInputChange('name')}
            placeholder="Ej: Bancos - Cuenta Corriente"
            error={getFieldError('name')}
          />
          {getFieldError('name') && (
            <ValidationMessage type="error" message={getFieldError('name')!} />
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description || ''}
            onChange={handleInputChange('description')}
            rows={3}
            className="form-textarea"
            placeholder="Descripción detallada de la cuenta..."
          />
          {getFieldError('description') && (
            <ValidationMessage type="error" message={getFieldError('description')!} />
          )}
        </div>        {/* Tipo y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="account_type" className="form-label">
              Tipo de Cuenta *
            </label>
            <select
              id="account_type"
              name="account_type"
              value={values.account_type}
              onChange={handleInputChange('account_type')}
              className="form-select"
            >
              {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {getFieldError('account_type') && (
              <ValidationMessage type="error" message={getFieldError('account_type')!} />
            )}
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Categoría *
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleInputChange('category')}
              className="form-select"
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {ACCOUNT_CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
            {getFieldError('category') && (
              <ValidationMessage type="error" message={getFieldError('category')!} />
            )}
          </div>        </div>

        {/* Configuración de la cuenta */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Configuración</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={handleCheckboxChange('is_active')}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-700">Cuenta activa</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.allows_movements}
                onChange={handleCheckboxChange('allows_movements')}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-700">Permite movimientos</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.requires_third_party}
                onChange={handleCheckboxChange('requires_third_party')}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-700">Requiere tercero</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.requires_cost_center}
                onChange={handleCheckboxChange('requires_cost_center')}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-700">Requiere centro de costo</span>
            </label>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label htmlFor="notes" className="form-label">
            Notas
          </label>
          <textarea
            id="notes"
            name="notes"
            value={values.notes || ''}
            onChange={handleInputChange('notes')}
            rows={3}
            className="form-textarea"
            placeholder="Notas adicionales sobre la cuenta..."
          />
          {getFieldError('notes') && (
            <ValidationMessage type="error" message={getFieldError('notes')!} />
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}          <Button
            type="submit"
            disabled={loading || (!isEditMode && getFieldError('code') !== undefined)}
          >
            {loading ? <Spinner size="sm" /> : isEditMode ? 'Actualizar Cuenta' : 'Crear Cuenta'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
