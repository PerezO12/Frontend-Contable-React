import { useState, useEffect, useCallback, useMemo } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type { JournalEntry } from '../types';

/**
 * Hook para manejar un asiento contable individual con datos enriquecidos
 * Proporciona utilidades para trabajar con productos, terceros, términos de pago, etc.
 */
export const useJournalEntryDetails = (entryId: string | null) => {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [enrichedPaymentTerms, setEnrichedPaymentTerms] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { error: showError } = useToast();

  // Obtener el asiento contable por ID
  const fetchEntry = useCallback(async () => {
    if (!entryId) {
      setEntry(null);
      setEnrichedPaymentTerms(new Map());
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const journalEntry = await JournalEntryService.getJournalEntryById(entryId);
      setEntry(journalEntry);

      // Obtener información enriquecida de payment terms si existen
      if (journalEntry.lines?.some(line => line.payment_terms_id)) {
        try {
          const enrichedTerms = await JournalEntryService.getEnrichedPaymentTermsForEntry(journalEntry);
          setEnrichedPaymentTerms(enrichedTerms);
        } catch (paymentTermsError) {
          console.warn('No se pudieron obtener los detalles completos de payment terms:', paymentTermsError);
          // Continuar con la información básica
          setEnrichedPaymentTerms(new Map());
        }
      } else {
        setEnrichedPaymentTerms(new Map());
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el asiento contable';
      setError(errorMessage);
      showError(errorMessage);
      setEntry(null);
      setEnrichedPaymentTerms(new Map());
    } finally {
      setLoading(false);
    }
  }, [entryId, showError]);

  // Refrescar el asiento contable
  const refresh = useCallback(() => {
    fetchEntry();
  }, [fetchEntry]);
  // Datos derivados usando los métodos utilitarios del servicio
  const derivedData = useMemo(() => {
    if (!entry) return null;

    return {
      products: JournalEntryService.extractProductInfo(entry),
      thirdParties: JournalEntryService.extractThirdPartyInfo(entry),
      // Usar payment terms básicos si no hay enriquecidos
      paymentTerms: enrichedPaymentTerms.size > 0 
        ? Array.from(enrichedPaymentTerms.values())
        : JournalEntryService.extractPaymentTermsInfo(entry),
      calculationSummary: JournalEntryService.getCalculationSummary(entry),
      validation: JournalEntryService.validateJournalEntryCompleteness(entry)
    };
  }, [entry, enrichedPaymentTerms]);

  // Información agregada útil para la UI
  const aggregatedInfo = useMemo(() => {
    if (!entry || !derivedData) return null;

    const { products, thirdParties, paymentTerms, calculationSummary } = derivedData;

    return {
      // Resumen de productos
      productSummary: {
        count: products.length,
        totalQuantity: products.reduce((sum, p) => sum + (parseFloat(p.quantity || '0')), 0),
        hasProducts: products.length > 0
      },
      
      // Resumen de terceros
      thirdPartySummary: {
        count: thirdParties.length,
        customers: thirdParties.filter(tp => tp.type === 'customer').length,
        suppliers: thirdParties.filter(tp => tp.type === 'supplier').length,
        hasThirdParties: thirdParties.length > 0
      },
      
      // Resumen de términos de pago
      paymentTermsSummary: {
        count: paymentTerms.length,
        uniqueTerms: new Set(paymentTerms.map(pt => pt.code)).size,
        hasPaymentTerms: paymentTerms.length > 0
      },
      
      // Estado del asiento
      statusInfo: {
        canEdit: entry.can_be_edited,
        canPost: entry.can_be_posted,
        isBalanced: entry.is_balanced,
        status: entry.status,
        hasDiscounts: parseFloat(calculationSummary.total_discount) > 0,
        hasTaxes: parseFloat(calculationSummary.total_taxes) > 0
      }
    };
  }, [entry, derivedData]);

  // Efecto para cargar datos cuando cambia el ID
  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);
  return {
    // Datos principales
    entry,
    loading,
    error,
    
    // Acciones
    refresh,
    
    // Datos derivados
    products: derivedData?.products || [],
    thirdParties: derivedData?.thirdParties || [],
    paymentTerms: derivedData?.paymentTerms || [],
    enrichedPaymentTerms, // Datos completos de payment terms con cronogramas
    calculationSummary: derivedData?.calculationSummary || {
      total_discount: '0.00',
      total_taxes: '0.00',
      total_net: '0.00',
      total_gross: '0.00',
      lines_with_products: 0,
      total_lines: 0
    },
    validation: derivedData?.validation || {
      is_valid: false,
      issues: [],
      can_be_posted: false,
      can_be_edited: false
    },
    
    // Información agregada
    aggregatedInfo,
    
    // Indicadores de datos enriquecidos
    hasEnrichedPaymentTerms: enrichedPaymentTerms.size > 0
  };
};

/**
 * Hook simplificado para obtener solo los datos básicos de un asiento contable
 */
export const useJournalEntryBasic = (entryId: string | null) => {
  const { entry, loading, error, refresh } = useJournalEntryDetails(entryId);
  
  return {
    entry,
    loading,
    error,
    refresh,
    // Información básica derivada
    isBalanced: entry?.is_balanced || false,
    canEdit: entry?.can_be_edited || false,
    canPost: entry?.can_be_posted || false,
    linesCount: entry?.lines?.length || 0,
    hasProducts: entry?.lines?.some(line => line.product_id) || false,
    hasThirdParties: entry?.lines?.some(line => line.third_party_id) || false
  };
};
