import DOMPurify from 'dompurify';
import { VALIDATION_RULES } from '@/shared/constants';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= VALIDATION_RULES.EMAIL.MAX_LENGTH;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.PASSWORD;
  
  if (password.length < rules.MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${rules.MIN_LENGTH} caracteres`);
  }
  
  if (rules.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }
  
  if (rules.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula');
  }
  
  if (rules.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  if (rules.REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};
