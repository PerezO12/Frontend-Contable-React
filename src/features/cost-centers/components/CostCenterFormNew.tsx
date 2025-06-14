import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenters, useCostCenter } from '../hooks';
import { 
  type CostCenterCreateForm,
  type CostCenter 
} from '../types';

interface CostCenterFormProps {
  onSuccess?: (costCenter: CostCenter) => void;
  onCancel?: () => void;
  initialData?: Partial<CostCenterCreateForm>;
  isEditMode?: boolean;
  costCenterId?: string;
}

export const CostCenterForm: React.FC<CostCenterFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false,
  costCenterId
}) => {
  const { createCostCenter, updateCostCenter, loading } = useCostCenters();
  const { costCenters } = useCostCenters({ is_active: true });
  const { costCenter: existingCostCenter } = useCostCenter(costCenterId);
  
  // Estado del formulario
  const [values, setValues] = useState({
    code: '',
    name: '',
    description: '',
    parent_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar valores
  useEffect(() => {
    if (isEditMode && existingCostCenter) {
      setValues({
        code: existingCostCenter.code,
        name: existingCostCenter.name,
        description: existingCostCenter.description || '',
        parent_id: existingCostCenter.parent_id || '',
        is_active: existingCostCenter.is_active
      });
    } else if (initialData) {
      setValues({
        code: initialData.code || '',
        name: initialData.name || '',
        description: initialData.description || '',
        parent_id: initialData.parent_id || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [isEditMode, existingCostCenter, initialData]);

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!values.code && !isEditMode) {
      newErrors.code = 'El código es requerido';
    }
    if (!values.name) {
      newErrors.name = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditMode && costCenterId) {
      const updateData = {
        name: values.name,
        description: values.description || undefined,
        parent_id: values.parent_id || undefined,
        is_active: values.is_active
      };
      
      const result = await updateCostCenter(costCenterId, updateData);
      if (result && onSuccess) {
        onSuccess(result);
      }
    } else {
      const createData = {
        code: values.code,
        name: values.name,
        description: values.description || undefined,
        parent_id: values.parent_id || undefined,
        is_active: values.is_active
      };
      
      const result = await createCostCenter(createData);
      if (result && onSuccess) {
        onSuccess(result);
      }
    }
  }, [values, isEditMode, costCenterId, updateCostCenter, createCostCenter, onSuccess]);

  // Filtrar centros de costo para el select de padre
  const getFilteredParentCostCenters = () => {
    return costCenters.filter(cc => {
      // No puede ser padre de sí mismo
      if (isEditMode && existingCostCenter && cc.id === existingCostCenter.id) return false;
      
      // No puede ser padre uno de sus descendientes
      if (isEditMode && existingCostCenter && cc.full_code.startsWith(existingCostCenter.full_code + '.')) return false;
      
      return cc.is_active;
    });
  };

  if (isEditMode && costCenterId && !existingCostCenter && loading) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando información del centro de costo...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="card-header">
        <h3 className="card-title">
          {isEditMode ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Código */}
          {!isEditMode && (
            <div>
              <label htmlFor="code" className="form-label">
                Código *
              </label>
              <Input
                id="code"
                value={values.code}
                onChange={handleInputChange('code')}
                placeholder="Ej: ADM001, VEN001, PROD001..."
                className={errors.code ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="form-label">
              Nombre *
            </label>
            <Input
              id="name"
              value={values.name}
              onChange={handleInputChange('name')}
              placeholder="Nombre descriptivo del centro de costo"
              className={errors.name ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={handleInputChange('description')}
              rows={3}
              className="form-textarea"
              placeholder="Descripción detallada del propósito del centro de costo..."
              disabled={loading}
            />
          </div>

          {/* Centro de Costo Padre */}
          <div>
            <label htmlFor="parent_id" className="form-label">
              Centro de Costo Padre
            </label>
            <select
              id="parent_id"
              value={values.parent_id}
              onChange={handleInputChange('parent_id')}
              className="form-select"
              disabled={loading}
            >
              <option value="">Sin padre (Centro de nivel raíz)</option>
              {getFilteredParentCostCenters().map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.code} - {cc.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona un centro padre para crear una estructura jerárquica
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={handleInputChange('is_active')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">
                Centro de costo activo
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Solo los centros activos pueden recibir asignaciones de movimientos contables
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading && <Spinner size="sm" />}
              <span>{isEditMode ? 'Actualizar' : 'Crear'} Centro de Costo</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
