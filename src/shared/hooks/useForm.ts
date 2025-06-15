import { useState, useCallback, useEffect } from 'react';
import type { FormState, ValidationError } from '@/shared/types';

interface UseFormOptions<T> {
  initialData: T;
  validate?: (data: T) => ValidationError[];
  onSubmit?: (data: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validate,
  onSubmit
}: UseFormOptions<T>) => {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    errors: [],
    isSubmitting: false,
    isDirty: false
  });

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true,
      errors: prev.errors.filter(error => error.field !== field)
    }));
  }, []);

  const setErrors = useCallback((errors: ValidationError[]) => {
    setFormState(prev => ({ ...prev, errors }));
  }, []);

  const clearErrors = useCallback(() => {
    setFormState(prev => ({ ...prev, errors: [] }));
  }, []);
  const reset = useCallback(() => {
    setFormState({
      data: initialData,
      errors: [],
      isSubmitting: false,
      isDirty: false
    });
  }, [initialData]);

  // Reset form when initialData changes
  useEffect(() => {
    setFormState({
      data: initialData,
      errors: [],
      isSubmitting: false,
      isDirty: false
    });
  }, [initialData]);
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    console.log('🔥 handleSubmit ejecutado - evento:', e);
    if (e) {
      e.preventDefault();
    }    
    // Validar formulario
    const validationErrors = validate ? validate(formState.data) : [];
    console.log('🔥 Datos del formulario:', formState.data);
    console.log('🔥 Errores de validación:', validationErrors);
      if (validationErrors.length > 0) {
      console.log('❌ Formulario no enviado debido a errores de validación:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    if (!onSubmit) {
      console.log('🔥 No hay función onSubmit');
      return;
    }

    console.log('🔥 Ejecutando onSubmit con datos:', formState.data);
    setFormState(prev => ({ ...prev, isSubmitting: true, errors: [] }));

    try {
      await onSubmit(formState.data);
    } catch (error) {
      console.log('🔥 Error en onSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en el formulario';
      setErrors([{ field: 'general', message: errorMessage }]);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.data, validate, onSubmit]);

  const getFieldError = useCallback((field: string): string | undefined => {
    return formState.errors.find(error => error.field === field)?.message;
  }, [formState.errors]);

  const hasErrors = formState.errors.length > 0;
  const canSubmit = !formState.isSubmitting && formState.isDirty && !hasErrors;

  return {
    data: formState.data,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    hasErrors,
    canSubmit,
    updateField,
    setErrors,
    clearErrors,
    reset,
    handleSubmit,
    getFieldError
  };
};
