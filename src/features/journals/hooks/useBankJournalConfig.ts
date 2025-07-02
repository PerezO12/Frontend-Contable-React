/**
 * Hook para gestión de configuración bancaria de journals
 */
import { useState, useCallback } from 'react';
import { useToast } from '@/shared/contexts/ToastContext';
import { JournalAPI } from '../api/journalAPI';
import type {
  BankJournalConfigCreate,
  BankJournalConfigUpdate,
  BankJournalConfigRead,
  BankJournalConfigValidation,
  JournalWithBankConfig,
} from '../types';

export interface UseBankJournalConfigReturn {
  bankConfig: BankJournalConfigRead | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  validation: BankJournalConfigValidation | null;
  
  // Operaciones
  fetchBankConfig: (journalId: string) => Promise<void>;
  createBankConfig: (journalId: string, data: BankJournalConfigCreate) => Promise<JournalWithBankConfig>;
  updateBankConfig: (journalId: string, data: BankJournalConfigUpdate) => Promise<BankJournalConfigRead>;
  deleteBankConfig: (journalId: string) => Promise<void>;
  validateBankConfig: (journalId: string) => Promise<BankJournalConfigValidation>;
  
  // Utilidades
  clearError: () => void;
  reset: () => void;
}

export function useBankJournalConfig(): UseBankJournalConfigReturn {
  const [bankConfig, setBankConfig] = useState<BankJournalConfigRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<BankJournalConfigValidation | null>(null);
  
  const { showToast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setBankConfig(null);
    setLoading(false);
    setSaving(false);
    setError(null);
    setValidation(null);
  }, []);

  const fetchBankConfig = useCallback(async (journalId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = await JournalAPI.getBankConfig(journalId);
      setBankConfig(config);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al obtener configuración bancaria';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createBankConfig = useCallback(async (
    journalId: string, 
    data: BankJournalConfigCreate
  ): Promise<JournalWithBankConfig> => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await JournalAPI.createBankConfig(journalId, data);
      
      // Actualizar el estado local con la nueva configuración
      if (result.bank_config) {
        setBankConfig(result.bank_config);
      }
      
      showToast('Configuración bancaria creada exitosamente', 'success');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al crear configuración bancaria';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  const updateBankConfig = useCallback(async (
    journalId: string, 
    data: BankJournalConfigUpdate
  ): Promise<BankJournalConfigRead> => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await JournalAPI.updateBankConfig(journalId, data);
      setBankConfig(result);
      
      showToast('Configuración bancaria actualizada exitosamente', 'success');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al actualizar configuración bancaria';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  const deleteBankConfig = useCallback(async (journalId: string): Promise<void> => {
    try {
      setSaving(true);
      setError(null);
      
      await JournalAPI.deleteBankConfig(journalId);
      setBankConfig(null);
      setValidation(null);
      
      showToast('Configuración bancaria eliminada exitosamente', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al eliminar configuración bancaria';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  const validateBankConfig = useCallback(async (journalId: string): Promise<BankJournalConfigValidation> => {
    try {
      setLoading(true);
      setError(null);
      
      const validationResult = await JournalAPI.validateBankConfig(journalId);
      setValidation(validationResult);
      
      if (!validationResult.is_valid) {
        showToast(`Configuración inválida: ${validationResult.errors.join(', ')}`, 'warning');
      } else if (validationResult.warnings.length > 0) {
        showToast(`Advertencias: ${validationResult.warnings.join(', ')}`, 'warning');
      } else {
        showToast('Configuración bancaria válida', 'success');
      }
      
      return validationResult;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al validar configuración bancaria';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    // Estado
    bankConfig,
    loading,
    saving,
    error,
    validation,
    
    // Operaciones
    fetchBankConfig,
    createBankConfig,
    updateBankConfig,
    deleteBankConfig,
    validateBankConfig,
    
    // Utilidades
    clearError,
    reset,
  };
}
