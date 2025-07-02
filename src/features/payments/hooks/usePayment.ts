import { useState, useEffect, useCallback } from 'react';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';
import type { Payment } from '../types';

// Hook para un pago específico
export const usePayment = (id?: string) => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayment = useCallback(async (paymentId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [usePayment] Fetching payment with ID:', paymentId);
      const data = await PaymentFlowAPI.getPayment(paymentId);
      console.log('✅ [usePayment] Successfully fetched payment:', data.id);
      setPayment(data);
    } catch (err) {
      console.error('❌ [usePayment] Error fetching payment:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar pago');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (id) {
      fetchPayment(id);
    }
  }, [fetchPayment, id]);

  useEffect(() => {
    if (id) {
      fetchPayment(id);
    }
  }, [fetchPayment, id]);

  return {
    payment,
    loading,
    error,
    refetch
  };
};

// Hook para eliminar pago
export const useDeletePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePayment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🗑️ [useDeletePayment] Deleting payment with ID:', id);
      // Por ahora usamos cancelar en lugar de eliminar hasta que esté disponible en la API
      await PaymentFlowAPI.cancelPayment(id);
      console.log('✅ [useDeletePayment] Payment deleted successfully');
      return true;
    } catch (err) {
      console.error('❌ [useDeletePayment] Error deleting payment:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar pago');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deletePayment,
    loading,
    error
  };
};
