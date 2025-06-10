import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/forms/PasswordField';
import { ValidationMessage } from '@/components/forms/ValidationMessage';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { validateEmail, validateRequired } from '@/shared/utils/validation';
import { useToast } from '@/shared/hooks/useToast';

interface LocationState {
  from?: string;
}

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { success, error: showError } = useToast();
  const location = useLocation();
  
  const from = (location.state as LocationState)?.from || '/dashboard';

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validar email
    const emailError = validateRequired(credentials.email, 'Email');
    if (emailError) {
      errors.email = emailError;
    } else if (!validateEmail(credentials.email)) {
      errors.email = 'Formato de email inválido';
    }

    // Validar contraseña
    const passwordError = validateRequired(credentials.password, 'Contraseña');
    if (passwordError) {
      errors.password = passwordError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      showError('Error de validación', 'Por favor, corrige los errores en el formulario');
      return;
    }
    
    try {
      await login(credentials);
      success('¡Bienvenido!', 'Has iniciado sesión exitosamente');
    } catch (error) {
      // Error ya manejado en el context, pero podemos mostrar toast adicional
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al escribir
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };

  return (
    <AuthLayout 
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder al sistema"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <ValidationMessage
            type="error"
            message={error}
          />
        )}

        <div>
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            error={validationErrors.email}
            placeholder="usuario@empresa.com"
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        <div>
          <PasswordField
            label="Contraseña"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            error={validationErrors.password}
            placeholder="Ingresa tu contraseña"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            disabled={!credentials.email || !credentials.password}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Información del sistema</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Sistema Contable Empresarial v1.0</p>
            <p>Para soporte técnico, contacta al administrador</p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};
