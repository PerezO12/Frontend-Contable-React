import React, { useState } from 'react';
import { AuthService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/Button';
import { PasswordField } from '@/components/forms/PasswordField';
import { useToast } from '@/shared/hooks/useToast';
import { validateRequired, validatePassword } from '@/shared/utils/validation';
import type { ChangePasswordData } from '@/features/auth/types';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<ChangePasswordData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { success, error: showError } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordData> = {};

    // Validar contraseña actual
    const currentPasswordError = validateRequired(formData.current_password, 'Contraseña actual');
    if (currentPasswordError) {
      newErrors.current_password = currentPasswordError;
    }    // Validar nueva contraseña
    const newPasswordError = validateRequired(formData.new_password, 'Nueva contraseña');
    if (newPasswordError) {
      newErrors.new_password = newPasswordError;
    } else {
      const passwordValidation = validatePassword(formData.new_password);
      if (!passwordValidation.isValid) {
        newErrors.new_password = passwordValidation.errors.join(', ');
      }
    }

    // Validar confirmación de contraseña
    const confirmPasswordError = validateRequired(formData.confirm_password, 'Confirmar contraseña');
    if (confirmPasswordError) {
      newErrors.confirm_password = confirmPasswordError;
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Error de validación', 'Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    
    try {
      await AuthService.changePassword(formData);
      success('¡Contraseña cambiada!', 'Tu contraseña ha sido actualizada exitosamente');
      
      // Limpiar formulario
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
      showError('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al escribir
    if (errors[name as keyof ChangePasswordData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <PasswordField
              label="Contraseña Actual"
              name="current_password"
              value={formData.current_password}
              onChange={handleInputChange}
              error={errors.current_password}
              placeholder="Ingresa tu contraseña actual"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <PasswordField
              label="Nueva Contraseña"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              error={errors.new_password}
              placeholder="Ingresa tu nueva contraseña"
              required
              autoComplete="new-password"
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>La contraseña debe contener:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un carácter especial</li>
              </ul>
            </div>
          </div>

          <div>
            <PasswordField
              label="Confirmar Nueva Contraseña"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              error={errors.confirm_password}
              placeholder="Confirma tu nueva contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!formData.current_password || !formData.new_password || !formData.confirm_password}
              className="flex-1"
            >
              {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
