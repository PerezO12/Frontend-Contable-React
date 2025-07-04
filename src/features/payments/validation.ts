/**
 * Exportaciones de componentes y hooks de validación de pagos
 */

// Hooks
export { usePaymentValidation } from './hooks/usePaymentValidation';
export { usePaymentPosting } from './hooks/usePaymentPosting';

// Componentes
export { PaymentValidationDetails } from './components/PaymentValidationDetails';
export { PaymentValidationModal } from './components/PaymentValidationModal';
export { PostPaymentsButton } from './components/PostPaymentsButton';

// Tipos (re-exportación desde types/index.ts)
export type { 
  BulkPaymentValidationResponse, 
  PaymentValidationResult 
} from './types';
