import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useCostCenters } from '../hooks';
import type { 
  CostCenter, 
  CostCenterCreate, 
  CostCenterUpdate
} from '../types';

interface CostCenterFormProps {
  costCenter?: CostCenter; // Si se pasa, es modo edición
  onSubmit: (data: CostCenterCreate | CostCenterUpdate) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const CostCenterForm: React.FC<CostCenterFormProps> = ({
  costCenter,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const isEditing = !!costCenter;
  
  // Separate state for create and update forms
  const [values, setValues] = useState(() => {
    if (isEditing) {
      return {
        name: costCenter?.name || '',
        description: costCenter?.description || '',
        parent_id: costCenter?.parent_id || '',
        is_active: costCenter?.is_active ?? true
      };
    } else {
      return {
        code: '',
        name: '',
        description: '',
        parent_id: '',
        is_active: true
      };
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading2, setLoading2] = useState(false);
  const { costCenters } = useCostCenters({ is_active: true });

  // Función para validar los datos del formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validación de nombre (siempre requerido)
    if (!values.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    // Validación de código (solo para crear)
    if (!isEditing) {
      const code = (values as any).code;
      if (!code?.trim()) {
        newErrors.code = 'El código es requerido';
      } else if (!/^[A-Z0-9_-]+$/.test(code.toUpperCase())) {
        newErrors.code = 'El código solo puede contener letras, números, guiones y guiones bajos';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading2(true);
      try {
        if (isEditing) {
          // For editing, only include updatable fields
          const updateData: CostCenterUpdate = {
            name: values.name,
            description: values.description,
            parent_id: values.parent_id,
            is_active: values.is_active
          };
          await onSubmit(updateData);        } else {
          // For creating, check for duplicate codes first
          const code = (values as any).code?.toUpperCase();
          
          // Simple client-side check (you may want to add a server-side check later)
          if (costCenters?.some(cc => cc.code === code)) {
            setErrors({ code: 'Este código ya está en uso' });
            setLoading2(false);
            return;
          }
          
          const createData: CostCenterCreate = {
            code,
            name: values.name,
            description: values.description,
            parent_id: values.parent_id,
            is_active: values.is_active
          };
          await onSubmit(createData);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading2(false);
      }
    }
  };

  // Obtener centros de costo potenciales padre (excluyendo el actual y sus descendientes)
  const getParentCostCenterOptions = () => {
    if (!costCenters) return [];
    
    return costCenters.filter(cc => {
      // Excluir el centro de costo actual (en modo edición)
      if (isEditing && cc.id === costCenter?.id) return false;
      
      // Excluir descendientes del centro de costo actual (en modo edición)
      if (isEditing && costCenter && cc.full_code.startsWith(costCenter.full_code + '.')) return false;
      
      return true;
    }).sort((a, b) => a.full_code.localeCompare(b.full_code));
  };

  return (
    <Card>
      <div className="card-header">
        <h3 className="card-title">
          {isEditing ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
        </h3>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Código */}
          {!isEditing && (
            <div>
              <label htmlFor="code" className="form-label required">
                Código
              </label>
              <Input
                id="code"
                name="code"
                value={(values as any).code || ''}
                onChange={handleInputChange('code')}
                error={errors.code}
                placeholder="CC001"
                disabled={loading || loading2}
                required
                helperText="Solo letras, números, guiones y guiones bajos. Se convertirá a mayúsculas."
              />
              {errors.code && (
                <ValidationMessage type="error" message={errors.code} />
              )}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="form-label required">
              Nombre
            </label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              placeholder="Ventas Nacional"
              disabled={loading || loading2}
              required
            />
            {errors.name && (
              <ValidationMessage type="error" message={errors.name} />
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
              placeholder="Descripción detallada del centro de costo..."
              disabled={loading || loading2}
            />
            {errors.description && (
              <ValidationMessage type="error" message={errors.description} />
            )}
          </div>

          {/* Centro de Costo Padre */}
          <div>
            <label htmlFor="parent_id" className="form-label">
              Centro de Costo Padre
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={values.parent_id || ''}
              onChange={handleInputChange('parent_id')}
              className="form-select"
              disabled={loading || loading2}
            >
              <option value="">Sin padre (Centro raíz)</option>
              {getParentCostCenterOptions().map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.full_code} - {cc.name}
                </option>
              ))}
            </select>
            {errors.parent_id && (
              <ValidationMessage type="error" message={errors.parent_id} />
            )}
          </div>

          {/* Estado activo */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={handleInputChange('is_active')}
                disabled={loading || loading2}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-700">Centro de costo activo</span>
            </label>
          </div>

          {/* Información adicional para modo edición */}
          {isEditing && costCenter && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Centro de Costo</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Código:</span>
                  <span className="ml-2 font-mono">{costCenter.code}</span>
                </div>
                <div>
                  <span className="text-gray-600">Código Completo:</span>
                  <span className="ml-2 font-mono">{costCenter.full_code}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nivel:</span>
                  <span className="ml-2">{costCenter.level}</span>
                </div>
                <div>
                  <span className="text-gray-600">Movimientos:</span>
                  <span className="ml-2">{costCenter.movements_count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Centros Hijos:</span>
                  <span className="ml-2">{costCenter.children_count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Es Hoja:</span>
                  <span className="ml-2">{costCenter.is_leaf ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading || loading2}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || loading2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading || loading2 ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Centro de Costo
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
