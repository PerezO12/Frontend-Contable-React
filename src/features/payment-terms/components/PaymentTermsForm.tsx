import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { PaymentTermsService } from '../services/paymentTermsService';
import type { PaymentTermsCreate, PaymentTermsUpdate, PaymentScheduleCreate, PaymentTerms } from '../types';

interface PaymentTermsFormProps {
  onSuccess?: (paymentTerms: any) => void;
  onError?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  initialData?: Partial<PaymentTermsCreate>;
  editingPaymentTerms?: PaymentTerms | null;
  submitTrigger?: number;
}

interface PaymentScheduleFormData extends Omit<PaymentScheduleCreate, 'sequence'> {
  id?: string; // Para identificar schedules temporales
}

export const PaymentTermsForm: React.FC<PaymentTermsFormProps> = ({
  onSuccess,
  onError,
  onLoadingChange,
  initialData,
  editingPaymentTerms,
  submitTrigger = 0
}) => {
  const isEditing = !!editingPaymentTerms;

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
    notes: initialData?.notes || ''
  });

  const [paymentSchedules, setPaymentSchedules] = useState<PaymentScheduleFormData[]>(
    initialData?.payment_schedules?.map((ps, index) => ({
      ...ps,
      id: `temp-${index}`
    })) || [
      {
        id: 'temp-1',
        days: 0,
        percentage: 100,
        description: 'Pago único'
      }
    ]
  );  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  // Handle external submit trigger
  useEffect(() => {
    if (submitTrigger > 0) {
      submitForm();
    }
  }, [submitTrigger]);  const submitForm = async () => {
    if (!validateForm()) {
      onError?.();
      return;
    }

    onLoadingChange?.(true);
    try {
      const dataToSubmit: PaymentTermsCreate = {
        ...formData,
        payment_schedules: paymentSchedules.map((ps, index) => ({
          sequence: index + 1,
          days: ps.days,
          percentage: ps.percentage,
          description: ps.description || `Cuota ${index + 1}`
        }))
      };      let result;
      if (isEditing && editingPaymentTerms) {
        // Para actualización, usar PaymentTermsUpdate con id
        const updateData: PaymentTermsUpdate = {
          id: editingPaymentTerms.id,
          ...dataToSubmit
        };
        result = await PaymentTermsService.updatePaymentTerms(editingPaymentTerms.id, updateData);
        console.log('Payment terms actualizado exitosamente:', result);
      } else {
        // Crear nuevo payment terms
        result = await PaymentTermsService.createPaymentTerms(dataToSubmit);
        console.log('Payment terms creado exitosamente:', result);
      }
      
      onSuccess?.(result);
    } catch (error: any) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} payment terms:`, error);
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          setValidationErrors([error.response.data.detail]);
        } else if (Array.isArray(error.response.data.detail)) {
          setValidationErrors(error.response.data.detail.map((err: any) => err.msg || err.message || 'Error de validación'));
        }
      } else {
        setValidationErrors([error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} las condiciones de pago`]);
      }
      onError?.();
    } finally {
      onLoadingChange?.(false);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const newValidationErrors: string[] = [];

    // Validar campos básicos
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Validar payment schedules
    if (paymentSchedules.length === 0) {
      newValidationErrors.push('Debe incluir al menos un cronograma de pago');
    } else {
      const totalPercentage = paymentSchedules.reduce((sum, ps) => sum + ps.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        newValidationErrors.push(`Los porcentajes deben sumar 100%. Suma actual: ${totalPercentage}%`);
      }

      paymentSchedules.forEach((schedule, index) => {
        if (schedule.days < 0) {
          newValidationErrors.push(`Cronograma ${index + 1}: Los días deben ser mayor o igual a 0`);
        }
        if (schedule.percentage <= 0 || schedule.percentage > 100) {
          newValidationErrors.push(`Cronograma ${index + 1}: El porcentaje debe estar entre 0.01 y 100`);
        }
      });

      // Validar que los días estén en orden ascendente
      for (let i = 1; i < paymentSchedules.length; i++) {
        if (paymentSchedules[i].days < paymentSchedules[i - 1].days) {
          newValidationErrors.push('Los días deben estar en orden ascendente');
          break;
        }
      }
    }

    setErrors(newErrors);
    setValidationErrors(newValidationErrors);

    return Object.keys(newErrors).length === 0 && newValidationErrors.length === 0;
  }, [formData, paymentSchedules]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error específico
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addPaymentSchedule = () => {
    const newSchedule: PaymentScheduleFormData = {
      id: `temp-${Date.now()}`,
      days: paymentSchedules.length > 0 ? Math.max(...paymentSchedules.map(ps => ps.days)) + 30 : 30,
      percentage: 0,
      description: `Cuota ${paymentSchedules.length + 1}`
    };
    setPaymentSchedules(prev => [...prev, newSchedule]);
  };

  const removePaymentSchedule = (id: string) => {
    if (paymentSchedules.length > 1) {
      setPaymentSchedules(prev => prev.filter(ps => ps.id !== id));
    }
  };

  const updatePaymentSchedule = (id: string, field: keyof PaymentScheduleFormData, value: any) => {
    setPaymentSchedules(prev => prev.map(ps => 
      ps.id === id ? { ...ps, [field]: value } : ps
    ));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Código"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            error={errors.code}
            placeholder="ej: 30D, 30-60, CONTADO"
            required
          />
        </div>
        <div>
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="ej: 30 días, Contado"
            required
          />
        </div>
      </div>

      <div>
        <Input
          label="Descripción"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descripción detallada de las condiciones de pago"
        />
      </div>

      <div>
        <Input
          label="Notas"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Notas adicionales (opcional)"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => handleInputChange('is_active', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Activo
        </label>
      </div>

      {/* Cronograma de pagos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Cronograma de Pagos</h3>
          <Button
            type="button"
            onClick={addPaymentSchedule}
            variant="secondary"
            size="sm"
          >
            ➕ Agregar Cuota
          </Button>
        </div>

        <div className="space-y-3">
          {paymentSchedules.map((schedule, index) => (
            <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Cuota {index + 1}</h4>
                {paymentSchedules.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePaymentSchedule(schedule.id!)}
                    variant="secondary"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Input
                    label="Días"
                    type="number"
                    value={schedule.days}
                    onChange={(e) => updatePaymentSchedule(schedule.id!, 'days', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Input
                    label="Porcentaje (%)"
                    type="number"
                    value={schedule.percentage}
                    onChange={(e) => updatePaymentSchedule(schedule.id!, 'percentage', parseFloat(e.target.value) || 0)}
                    min="0.01"
                    max="100"
                    step="0.01"
                    placeholder="100"
                  />
                </div>
                <div>
                  <Input
                    label="Descripción"
                    value={schedule.description || ''}
                    onChange={(e) => updatePaymentSchedule(schedule.id!, 'description', e.target.value)}
                    placeholder={`Cuota ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>        {/* Resumen del cronograma */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Resumen:</strong> {paymentSchedules.length} cuota(s) • 
            Total: {paymentSchedules.reduce((sum, ps) => sum + (Number(ps.percentage) || 0), 0).toFixed(2)}% • 
            Plazo máximo: {paymentSchedules.length > 0 ? Math.max(...paymentSchedules.map(ps => Number(ps.days) || 0)) : 0} días
          </div>
        </div>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (        <div className="space-y-1">
          {validationErrors.map((error, index) => (
            <ValidationMessage key={index} type="error" message={error} />
          ))}
        </div>
      )}
    </form>
  );
};
