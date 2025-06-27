export type { User, UserRole, AuthTokens, LoginCredentials, AuthState, AuthContextType, ChangePasswordData, ApiError, ApiResponse, UserSession } from '@/features/auth/types';
export type { ExportRequest } from '@/shared/services/exportService';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}
export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface FormState<T> {
    data: T;
    errors: ValidationError[];
    isSubmitting: boolean;
    isDirty: boolean;
}
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}
export type ThemeMode = 'light' | 'dark' | 'system';
export interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}
