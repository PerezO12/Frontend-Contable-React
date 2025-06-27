import DOMPurify from 'dompurify';
import { VALIDATION_RULES } from '@/shared/constants';
export var validateEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= VALIDATION_RULES.EMAIL.MAX_LENGTH;
};
export var validatePassword = function (password) {
    var errors = [];
    var rules = VALIDATION_RULES.PASSWORD;
    if (password.length < rules.MIN_LENGTH) {
        errors.push("La contrase\u00F1a debe tener al menos ".concat(rules.MIN_LENGTH, " caracteres"));
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
        errors: errors
    };
};
export var sanitizeHtml = function (dirty) {
    return DOMPurify.sanitize(dirty);
};
export var sanitizeInput = function (input) {
    return input.trim().replace(/[<>]/g, '');
};
export var validateRequired = function (value, fieldName) {
    if (!value || value.trim().length === 0) {
        return "".concat(fieldName, " es requerido");
    }
    return null;
};
export var validateMinLength = function (value, minLength, fieldName) {
    if (value.length < minLength) {
        return "".concat(fieldName, " debe tener al menos ").concat(minLength, " caracteres");
    }
    return null;
};
export var validateMaxLength = function (value, maxLength, fieldName) {
    if (value.length > maxLength) {
        return "".concat(fieldName, " no puede tener m\u00E1s de ").concat(maxLength, " caracteres");
    }
    return null;
};
export var validatePasswordMatch = function (password, confirmPassword) {
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }
    return null;
};
