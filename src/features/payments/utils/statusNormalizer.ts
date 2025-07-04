/**
 * Utilidades para normalizar estados y tipos de pagos desde el backend
 */
import { PaymentStatus, PaymentType } from '../types';

/**
 * Normaliza el estado de pago que viene del backend al enum correcto
 * Maneja diferentes formatos: DRAFT, draft, Draft, etc.
 */
export function normalizePaymentStatus(status: string | undefined): PaymentStatus {
  if (!status) {
    return PaymentStatus.DRAFT; // Default fallback
  }

  const originalStatus = status;
  const normalized = status.toUpperCase();

  // Solo log en desarrollo para casos no esperados
  if (process.env.NODE_ENV === 'development' && originalStatus !== normalized && originalStatus !== normalized.toLowerCase()) {
    console.log(`🔄 Normalizando estado: "${originalStatus}" → "${normalized}"`);
  }

  switch (normalized) {
    case 'DRAFT':
    case 'BORRADOR':
      return PaymentStatus.DRAFT;
    
    case 'POSTED':
    case 'CONTABILIZADO':
    case 'CONFIRMED':
    case 'CONFIRMADO':
      return PaymentStatus.POSTED;
    
    case 'CANCELLED':
    case 'CANCELED':
    case 'CANCELADO':
      return PaymentStatus.CANCELLED;
    
    default:
      console.warn(`❌ Estado de pago desconocido: "${status}", usando DRAFT por defecto`);
      return PaymentStatus.DRAFT;
  }
}

/**
 * Verifica si un estado es válido según nuestros enums
 */
export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
}

/**
 * Normaliza el tipo de pago que viene del backend al enum correcto
 * Maneja diferentes formatos: customer_payment, CUSTOMER_PAYMENT, etc.
 */
export function normalizePaymentType(type: string | undefined): PaymentType {
  if (!type) {
    return PaymentType.CUSTOMER_PAYMENT; // Default fallback
  }

  const originalType = type;
  const normalized = type.toUpperCase();

  // Solo log en desarrollo para casos no esperados
  if (process.env.NODE_ENV === 'development' && originalType !== normalized && originalType !== normalized.toLowerCase()) {
    console.log(`🔄 Normalizando tipo: "${originalType}" → "${normalized}"`);
  }

  switch (normalized) {
    case 'CUSTOMER_PAYMENT':
    case 'CUSTOMER':
    case 'CLIENTE':
    case 'PAGO_CLIENTE':
      return PaymentType.CUSTOMER_PAYMENT;
    
    case 'SUPPLIER_PAYMENT':
    case 'SUPPLIER':
    case 'VENDOR_PAYMENT':
    case 'VENDOR':
    case 'PROVEEDOR':
    case 'PAGO_PROVEEDOR':
      return PaymentType.SUPPLIER_PAYMENT;
    
    default:
      console.warn(`❌ Tipo de pago desconocido: "${type}", usando CUSTOMER_PAYMENT por defecto`);
      return PaymentType.CUSTOMER_PAYMENT;
  }
}

/**
 * Verifica si un tipo es válido según nuestros enums
 */
export function isValidPaymentType(type: string): type is PaymentType {
  return Object.values(PaymentType).includes(type as PaymentType);
}

/**
 * Normaliza una lista de pagos aplicando normalización a todos los estados y tipos
 */
export function normalizePaymentsList(payments: any[]): any[] {
  if (!payments || !Array.isArray(payments)) {
    console.warn('⚠️ normalizePaymentsList recibió datos inválidos:', payments);
    return [];
  }

  // Solo log en desarrollo y para listas grandes
  if (process.env.NODE_ENV === 'development' && payments.length > 10) {
    console.log(`🔄 Normalizando estados y tipos de ${payments.length} pagos...`);
  }
  
  return payments.map((payment, index) => {
    const originalStatus = payment.status;
    const originalType = payment.payment_type;
    const normalizedStatus = normalizePaymentStatus(payment.status);
    const normalizedType = normalizePaymentType(payment.payment_type);
    
    // Solo log en desarrollo para cambios inesperados
    if (process.env.NODE_ENV === 'development') {
      if (originalStatus !== normalizedStatus && originalStatus !== normalizedStatus.toLowerCase()) {
        console.log(`📄 Pago ${index + 1} - Estado: "${originalStatus}" → "${normalizedStatus}"`);
      }
      
      if (originalType !== normalizedType && originalType !== normalizedType.toLowerCase()) {
        console.log(`📄 Pago ${index + 1} - Tipo: "${originalType}" → "${normalizedType}"`);
      }
    }
    
    return {
      ...payment,
      status: normalizedStatus,
      payment_type: normalizedType
    };
  });
}
