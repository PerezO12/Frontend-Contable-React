/**
 * Store para el manejo de estado del flujo de pagos usando Zustand
 * Implementa el flujo completo ERP para pagos
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  Payment,
  BankExtract,
  PaymentFilters,
  BankExtractFilters,
  PaymentFlowImportRequest,
  PaymentFlowImportResult,
  PaymentFlowStatus,
  PaymentBatchConfirmation,
  PaymentReconciliationSummary,
  FileImportRequest,
  PaymentFlowState,
  BulkPaymentValidationResponse,
  BulkPaymentOperationResponse
} from '../types';
import { PaymentStatus } from '../types';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';

interface PaymentStoreState extends PaymentFlowState {
  // Estado de paginación
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
  
  extractPagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };

  // Estado del flujo actual
  currentFlow: {
    extractId?: string;
    status?: PaymentFlowStatus;
    importResult?: PaymentFlowImportResult;
  };

  // Resumen de conciliación
  reconciliationSummary?: PaymentReconciliationSummary;

  // Errores de validación
  validationErrors: string[];

  // === ACCIONES DE DATOS ===

  // Obtener lista de pagos
  fetchPayments: (filters?: PaymentFilters) => Promise<void>;
  
  // Obtener pagos en borrador
  fetchDraftPayments: (filters?: PaymentFilters) => Promise<void>;
  
  // Obtener pago individual
  fetchPayment: (paymentId: string) => Promise<Payment | null>;
  
  // Obtener extractos bancarios
  fetchBankExtracts: (filters?: BankExtractFilters) => Promise<void>;
  
  // Obtener extracto individual
  fetchBankExtract: (extractId: string) => Promise<BankExtract | null>;

  // === ACCIONES DEL FLUJO DE PAGOS ===

  // PASO 2: Importar extracto bancario con auto-matching
  importBankStatement: (data: PaymentFlowImportRequest) => Promise<PaymentFlowImportResult>;
  
  // Importar desde archivo
  importFromFile: (data: FileImportRequest) => Promise<PaymentFlowImportResult>;
  
  // PASO 3: Confirmar pago individual
  confirmPayment: (paymentId: string) => Promise<Payment>;
  
  // Confirmar múltiples pagos en lote
  batchConfirmPayments: (paymentIds: string[]) => Promise<PaymentBatchConfirmation>;
  
  // Validar confirmación masiva antes de proceder
  validateBulkConfirmation: (paymentIds: string[]) => Promise<BulkPaymentValidationResponse>;
  
  // Confirmar múltiples pagos con validación y opciones avanzadas
  bulkConfirmPaymentsWithValidation: (
    paymentIds: string[], 
    confirmationNotes?: string, 
    force?: boolean
  ) => Promise<BulkPaymentOperationResponse>;
  
  // Obtener estado del flujo
  getPaymentFlowStatus: (extractId: string) => Promise<PaymentFlowStatus>;
  
  // Obtener resumen de conciliación
  fetchReconciliationSummary: () => Promise<void>;

  // === ACCIONES DE MODIFICACIÓN ===

  // Cancelar pago
  cancelPayment: (paymentId: string) => Promise<void>;
  
  // Resetear pago (POSTED/CANCELLED → DRAFT)
  resetPayment: (paymentId: string) => Promise<void>;
  
  // Eliminar pago (solo DRAFT)
  deletePayment: (paymentId: string) => Promise<void>;
  
  // Operaciones bulk
  bulkDeletePayments: (paymentIds: string[]) => Promise<{ deleted: number; errors: string[] }>;
  bulkCancelPayments: (paymentIds: string[]) => Promise<{ cancelled: number; errors: string[] }>;
  bulkPostPayments: (paymentIds: string[], postingNotes?: string) => Promise<BulkPaymentOperationResponse>;
  bulkResetPayments: (paymentIds: string[], resetReason?: string) => Promise<BulkPaymentOperationResponse>;
  bulkDraftPayments: (paymentIds: string[], draftReason?: string) => Promise<BulkPaymentOperationResponse>;

  // Operaciones de información
  getBulkOperationsStatus: () => Promise<{
    total_payments: number;
    by_status: Record<string, number>;
    available_operations: string[];
    bulk_limits: {
      max_batch_size: number;
      recommended_batch_size: number;
    };
  }>;
  getOperationsSummary: (paymentIds?: string[]) => Promise<{
    payment_count: number;
    by_status: Record<string, number>;
    available_operations: string[];
    warnings: string[];
    estimated_processing_time: number;
  }>;

  // === ACCIONES DE UI ===

  // Manejo de filtros
  setFilters: (filters: Partial<PaymentFilters>) => void;
  setExtractFilters: (filters: Partial<BankExtractFilters>) => void;
  clearFilters: () => void;
  
  // Manejo de selección
  setSelectedPayments: (paymentIds: string[]) => void;
  togglePaymentSelection: (paymentId: string) => void;
  selectAllPayments: () => void;
  clearPaymentSelection: () => void;
  
  setSelectedExtracts: (extractIds: string[]) => void;
  toggleExtractSelection: (extractId: string) => void;
  clearExtractSelection: () => void;
  
  // Manejo de progreso de importación
  setImportProgress: (progress: PaymentFlowState['importProgress']) => void;
  clearImportProgress: () => void;
  
  // Limpiar errores
  clearError: () => void;
  clearValidationErrors: () => void;
  
  // Reset del store
  reset: () => void;
}

const initialState: Omit<PaymentStoreState, 'fetchPayments' | 'fetchDraftPayments' | 'fetchPayment' | 'fetchBankExtracts' | 'fetchBankExtract' | 'importBankStatement' | 'importFromFile' | 'confirmPayment' | 'batchConfirmPayments' | 'validateBulkConfirmation' | 'bulkConfirmPaymentsWithValidation' | 'getPaymentFlowStatus' | 'fetchReconciliationSummary' | 'cancelPayment' | 'resetPayment' | 'deletePayment' | 'bulkDeletePayments' | 'bulkCancelPayments' | 'bulkPostPayments' | 'bulkResetPayments' | 'bulkDraftPayments' | 'getBulkOperationsStatus' | 'getOperationsSummary' | 'setFilters' | 'setExtractFilters' | 'clearFilters' | 'setSelectedPayments' | 'togglePaymentSelection' | 'selectAllPayments' | 'clearPaymentSelection' | 'setSelectedExtracts' | 'toggleExtractSelection' | 'clearExtractSelection' | 'setImportProgress' | 'clearImportProgress' | 'clearError' | 'clearValidationErrors' | 'reset'> = {
  // Datos
  payments: [],
  extracts: [],
  selectedPayments: [],
  selectedExtracts: [],
  
  // Estado
  loading: false,
  error: null,
  validationErrors: [],
  
  // Filtros
  filters: {
    page: 1,
    per_page: 20
  },
  extractFilters: {
    page: 1,
    per_page: 20
  },
  
  // Paginación
  pagination: {
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  },
  
  extractPagination: {
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0
  },
  
  // Flujo actual
  currentFlow: {},
  
  // Progreso de importación
  importProgress: undefined,
  
  // Resumen de conciliación
  reconciliationSummary: undefined
};

export const usePaymentStore = create<PaymentStoreState>()(
  immer((set, get) => ({
    ...initialState,

    // === IMPLEMENTACIÓN DE ACCIONES DE DATOS ===

    fetchPayments: async (filters?: PaymentFilters) => {
      set((state) => {
        state.loading = true;
        state.error = null;
        if (filters) {
          state.filters = { ...state.filters, ...filters };
        }
      });

      try {
        const response = await PaymentFlowAPI.getPayments(get().filters);
        set((state) => {
          state.payments = response.data;
          state.pagination = {
            page: response.page,
            per_page: response.per_page,
            total: response.total,
            pages: response.pages
          };
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar pagos';
          state.loading = false;
        });
      }
    },

    fetchDraftPayments: async (filters?: PaymentFilters) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const response = await PaymentFlowAPI.getDraftPayments(filters);
        set((state) => {
          state.payments = response.data;
          state.pagination = {
            page: response.page,
            per_page: response.per_page,
            total: response.total,
            pages: response.pages
          };
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar pagos en borrador';
          state.loading = false;
        });
      }
    },

    fetchPayment: async (paymentId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const payment = await PaymentFlowAPI.getPayment(paymentId);
        set((state) => {
          state.loading = false;
        });
        return payment;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar pago';
          state.loading = false;
        });
        return null;
      }
    },

    fetchBankExtracts: async (filters?: BankExtractFilters) => {
      set((state) => {
        state.loading = true;
        state.error = null;
        if (filters) {
          state.extractFilters = { ...state.extractFilters, ...filters };
        }
      });

      try {
        const response = await PaymentFlowAPI.getBankExtracts(get().extractFilters);
        set((state) => {
          state.extracts = response.data;
          state.extractPagination = {
            page: response.page,
            per_page: response.per_page,
            total: response.total,
            pages: response.pages
          };
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar extractos bancarios';
          state.loading = false;
        });
      }
    },

    fetchBankExtract: async (extractId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const extract = await PaymentFlowAPI.getBankExtract(extractId);
        set((state) => {
          state.loading = false;
        });
        return extract;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar extracto bancario';
          state.loading = false;
        });
        return null;
      }
    },

    // === IMPLEMENTACIÓN DE ACCIONES DEL FLUJO ===

    importBankStatement: async (data: PaymentFlowImportRequest) => {
      set((state) => {
        state.loading = true;
        state.error = null;
        state.importProgress = {
          step: 'processing',
          progress: 50,
          message: 'Procesando extracto bancario...'
        };
      });

      try {
        const result = await PaymentFlowAPI.importBankStatement(data);
        set((state) => {
          state.currentFlow.importResult = result;
          state.importProgress = {
            step: 'completed',
            progress: 100,
            message: `Importación completada: ${result.payments_created} pagos creados`
          };
          state.loading = false;
        });
        
        // Recargar pagos en borrador
        await get().fetchDraftPayments();
        
        return result;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al importar extracto bancario';
          state.loading = false;
          state.importProgress = undefined;
        });
        throw error;
      }
    },

    importFromFile: async (data: FileImportRequest) => {
      set((state) => {
        state.loading = true;
        state.error = null;
        state.importProgress = {
          step: 'uploading',
          progress: 25,
          message: 'Subiendo archivo...'
        };
      });

      try {
        set((state) => {
          state.importProgress = {
            step: 'processing',
            progress: 75,
            message: 'Procesando archivo...'
          };
        });

        const result = await PaymentFlowAPI.importFromFile(data);
        set((state) => {
          state.currentFlow.importResult = result;
          state.importProgress = {
            step: 'completed',
            progress: 100,
            message: `Archivo importado: ${result.payments_created} pagos creados`
          };
          state.loading = false;
        });
        
        // Recargar datos
        await get().fetchDraftPayments();
        await get().fetchBankExtracts();
        
        return result;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al importar archivo';
          state.loading = false;
          state.importProgress = undefined;
        });
        throw error;
      }
    },

    confirmPayment: async (paymentId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.confirmPayment(paymentId);
        
        // Actualizar el pago en la lista LOCAL inmediatamente
        set((state) => {
          const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            state.payments[paymentIndex].status = PaymentStatus.POSTED;
            state.payments[paymentIndex].confirmed_at = new Date().toISOString();
            state.payments[paymentIndex].posted_at = new Date().toISOString();
          }
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        console.log('🏪 STORE - Refrescando datos después de confirmación individual exitosa...');
        get().fetchPayments().catch(console.error);
        
        return result;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al confirmar pago';
          state.loading = false;
        });
        throw error;
      }
    },

    batchConfirmPayments: async (paymentIds: string[]) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.bulkConfirmPayments(paymentIds);
        
        // Convertir BulkPaymentOperationResponse a PaymentBatchConfirmation
        const batchConfirmation: PaymentBatchConfirmation = {
          total_payments: result.total_payments,
          successful_confirmations: result.successful,
          failed_confirmations: result.failed,
          results: Object.entries(result.results).map(([paymentId, r]) => ({
            payment_id: paymentId,
            payment_number: r.payment_number || '',
            success: r.success,
            message: r.message,
            entry_id: undefined, // Not provided in bulk response
            move_lines: [],
            reconciled_invoices: []
          }))
        };
        
        // Actualizar pagos confirmados en la lista LOCAL inmediatamente
        set((state) => {
          Object.entries(result.results).forEach(([paymentId, confirmation]) => {
            if (confirmation.success) {
              const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
              if (paymentIndex !== -1) {
                state.payments[paymentIndex].status = PaymentStatus.POSTED;
                // Actualizar también timestamp de confirmación
                state.payments[paymentIndex].confirmed_at = new Date().toISOString();
                state.payments[paymentIndex].posted_at = new Date().toISOString();
              }
            }
          });
          state.selectedPayments = []; // Limpiar selección
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de confirmación exitosa...');
          get().fetchPayments().catch(console.error);
        }
        
        return batchConfirmation;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al confirmar pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    validateBulkConfirmation: async (paymentIds: string[]) => {
      try {
        const validation = await PaymentFlowAPI.validatePaymentConfirmation(paymentIds);
        return validation;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al validar confirmación masiva';
        });
        throw error;
      }
    },

    bulkConfirmPaymentsWithValidation: async (
      paymentIds: string[], 
      confirmationNotes?: string, 
      force?: boolean
    ) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.bulkConfirmPayments(paymentIds, confirmationNotes, force);
        
        // Actualizar pagos confirmados en la lista LOCAL inmediatamente
        set((state) => {
          Object.entries(result.results).forEach(([paymentId, confirmation]) => {
            if (confirmation.success) {
              const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
              if (paymentIndex !== -1) {
                state.payments[paymentIndex].status = PaymentStatus.POSTED;
                // Actualizar también timestamp de confirmación
                state.payments[paymentIndex].confirmed_at = new Date().toISOString();
                state.payments[paymentIndex].posted_at = new Date().toISOString();
              }
            }
          });
          state.selectedPayments = []; // Limpiar selección
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de confirmación con validación exitosa...');
          get().fetchPayments().catch(console.error);
        }
        
        return result;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al confirmar pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    getPaymentFlowStatus: async (extractId: string) => {
      try {
        const status = await PaymentFlowAPI.getPaymentFlowStatus(extractId);
        set((state) => {
          state.currentFlow.extractId = extractId;
          state.currentFlow.status = status;
        });
        return status;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al obtener estado del flujo';
        });
        throw error;
      }
    },

    fetchReconciliationSummary: async () => {
      try {
        const summary = await PaymentFlowAPI.getPendingReconciliation();
        set((state) => {
          state.reconciliationSummary = summary;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cargar resumen de conciliación';
        });
      }
    },

    // === IMPLEMENTACIÓN DE ACCIONES DE MODIFICACIÓN ===

    cancelPayment: async (paymentId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        await PaymentFlowAPI.cancelPayment(paymentId);
        
        // Actualizar el pago en la lista LOCAL inmediatamente
        set((state) => {
          const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            state.payments[paymentIndex].status = PaymentStatus.CANCELLED;
            state.payments[paymentIndex].cancelled_at = new Date().toISOString();
          }
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        console.log('🏪 STORE - Refrescando datos después de cancelación individual exitosa...');
        get().fetchPayments().catch(console.error);
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cancelar pago';
          state.loading = false;
        });
        throw error;
      }
    },

    deletePayment: async (paymentId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        await PaymentFlowAPI.deletePayment(paymentId);
        
        // Remover el pago de la lista LOCAL inmediatamente
        set((state) => {
          state.payments = state.payments.filter(p => p.id !== paymentId);
          state.selectedPayments = state.selectedPayments.filter(id => id !== paymentId);
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        console.log('🏪 STORE - Refrescando datos después de eliminación individual exitosa...');
        get().fetchPayments().catch(console.error);
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al eliminar pago';
          state.loading = false;
        });
        throw error;
      }
    },

    bulkDeletePayments: async (paymentIds: string[]) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.bulkDeletePayments(paymentIds);
        
        // Remover pagos eliminados de la lista LOCAL inmediatamente
        const successfulIds = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => resultData.success)
          .map(([paymentId, _]) => paymentId);
        
        set((state) => {
          // Eliminar de la lista local inmediatamente
          state.payments = state.payments.filter(p => !successfulIds.includes(p.id));
          state.selectedPayments = [];
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de eliminación exitosa...');
          get().fetchPayments().catch(console.error);
        }
        
        // Convertir a formato esperado
        const failedResults = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => !resultData.success)
          .map(([_, resultData]: [string, any]) => resultData.error || resultData.message);
        
        return {
          deleted: result.successful,
          errors: failedResults
        };
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al eliminar pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    bulkCancelPayments: async (paymentIds: string[]) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.bulkCancelPayments(paymentIds);
        
        // Actualizar pagos cancelados en la lista LOCAL inmediatamente
        const successfulIds = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => resultData.success)
          .map(([paymentId, _]) => paymentId);
        
        set((state) => {
          successfulIds.forEach((paymentId: string) => {
            const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
            if (paymentIndex !== -1) {
              state.payments[paymentIndex].status = PaymentStatus.CANCELLED;
              // Actualizar también timestamp de cancelación
              state.payments[paymentIndex].cancelled_at = new Date().toISOString();
            }
          });
          state.selectedPayments = [];
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de cancelación exitosa...');
          get().fetchPayments().catch(console.error);
        }
        
        // Convertir a formato esperado
        const failedResults = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => !resultData.success)
          .map(([_, resultData]: [string, any]) => resultData.error || resultData.message);
        
        return {
          cancelled: result.successful,
          errors: failedResults
        };
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cancelar pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    resetPayment: async (paymentId: string) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.resetPayment(paymentId);
        
        // Actualizar el pago en la lista LOCAL inmediatamente
        set((state) => {
          const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            state.payments[paymentIndex] = result;
          }
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        console.log('🏪 STORE - Refrescando datos después de reset individual exitoso...');
        get().fetchPayments().catch(console.error);
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al resetear pago';
          state.loading = false;
        });
        throw error;
      }
    },

    bulkPostPayments: async (paymentIds: string[], postingNotes?: string) => {
      console.log('🏪 STORE - bulkPostPayments iniciado');
      console.log('🏪 STORE - paymentIds:', paymentIds);
      console.log('🏪 STORE - postingNotes:', postingNotes);
      
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const result = await PaymentFlowAPI.bulkPostPayments(paymentIds, postingNotes);
        
        console.log('🏪 STORE - Resultado de contabilización:', result);
        console.log('🏪 STORE - Exitosos:', result.successful);
        console.log('🏪 STORE - Fallidos:', result.failed);
        console.log('🏪 STORE - Detalles de resultados:', result.results);
        
        // Mostrar detalles de errores si los hay
        if (result.failed > 0) {
          const failedResults = Object.entries(result.results || {})
            .filter(([_, resultData]: [string, any]) => !resultData.success);
          
          console.error('🏪 STORE - Pagos que fallaron:', failedResults);
          failedResults.forEach(([paymentId, resultData]: [string, any]) => {
            console.error(`🏪 STORE - Error en pago ${paymentId}:`, resultData.error || resultData.message);
          });
        }
        
        // Actualizar pagos posteados en la lista LOCAL inmediatamente
        const successfulIds = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => resultData.success)
          .map(([paymentId, _]) => paymentId);
          
        set((state) => {
          successfulIds.forEach(paymentId => {
            const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
            if (paymentIndex !== -1) {
              state.payments[paymentIndex].status = PaymentStatus.POSTED;
              // Actualizar también timestamp de contabilización
              state.payments[paymentIndex].posted_at = new Date().toISOString();
            }
          });
          state.selectedPayments = [];
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de contabilización exitosa...');
          get().fetchPayments().catch(console.error);
        }
        
        return result;
      } catch (error: any) {
        console.error('🏪 STORE - Error en bulkPostPayments:', error);
        console.error('🏪 STORE - Stack trace:', error.stack);
        set((state) => {
          state.error = error.message || 'Error al postear pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    bulkResetPayments: async (paymentIds: string[], resetReason?: string) => {
      console.log('🏪 STORE - bulkResetPayments iniciado');
      console.log('🏪 STORE - paymentIds:', paymentIds);
      console.log('🏪 STORE - resetReason:', resetReason);
      
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        console.log('🏪 STORE - Llamando a PaymentFlowAPI.bulkResetPayments...');
        const result = await PaymentFlowAPI.bulkResetPayments(paymentIds, resetReason);
        console.log('🏪 STORE - Resultado de API:', result);
        
        // Actualizar pagos reseteados en la lista LOCAL inmediatamente
        const successfulIds = Object.entries(result.results || {})
          .filter(([_, resultData]: [string, any]) => resultData.success)
          .map(([paymentId, _]) => paymentId);
        
        set((state) => {
          successfulIds.forEach(paymentId => {
            const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
            if (paymentIndex !== -1) {
              state.payments[paymentIndex].status = PaymentStatus.DRAFT;
              // Actualizar también otros campos que podrían cambiar
              state.payments[paymentIndex].posted_at = undefined;
              state.payments[paymentIndex].posted_by_id = undefined;
            }
          });
          state.selectedPayments = [];
          state.loading = false;
        });
        
        // Refrescar datos desde el servidor para asegurar sincronización
        if (result.successful > 0) {
          console.log('🏪 STORE - Refrescando datos después de operación exitosa...');
          // No await para que no bloquee la respuesta, pero actualiza en background
          get().fetchPayments().catch(console.error);
        }
        
        return result;
      } catch (error: any) {
        console.error('🏪 STORE - Error en bulkResetPayments:', error);
        set((state) => {
          state.error = error.message || 'Error al resetear pagos';
          state.loading = false;
        });
        throw error;
      }
    },

    bulkDraftPayments: async (paymentIds: string[], draftReason?: string) => {
      // Esta función es un alias de bulkResetPayments para compatibilidad
      return get().bulkResetPayments(paymentIds, draftReason);
    },

    getBulkOperationsStatus: async () => {
      try {
        // TODO: Implementar cuando esté disponible en la API
        return {
          total_payments: 0,
          by_status: {},
          available_operations: ['reset-to-draft', 'confirm', 'post', 'cancel', 'delete'],
          bulk_limits: {
            max_batch_size: 1000,
            recommended_batch_size: 100
          }
        };
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al obtener estado de operaciones en lote';
        });
        throw error;
      }
    },

    getOperationsSummary: async (paymentIds?: string[]) => {
      try {
        // TODO: Implementar cuando esté disponible en la API
        return {
          payment_count: paymentIds?.length || 0,
          by_status: {},
          available_operations: ['reset-to-draft', 'confirm', 'post', 'cancel', 'delete'],
          warnings: [],
          estimated_processing_time: 0
        };
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al obtener resumen de operaciones';
        });
        throw error;
      }
    },

    // === IMPLEMENTACIÓN DE ACCIONES DE UI ===

    setFilters: (filters: Partial<PaymentFilters>) => {
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      });
    },

    setExtractFilters: (filters: Partial<BankExtractFilters>) => {
      set((state) => {
        state.extractFilters = { ...state.extractFilters, ...filters };
      });
    },

    clearFilters: () => {
      set((state) => {
        state.filters = {
          page: 1,
          per_page: 20
        };
        state.extractFilters = {
          page: 1,
          per_page: 20
        };
      });
    },

    setSelectedPayments: (paymentIds: string[]) => {
      set((state) => {
        state.selectedPayments = paymentIds;
      });
    },

    togglePaymentSelection: (paymentId: string) => {
      set((state) => {
        if (state.selectedPayments.includes(paymentId)) {
          state.selectedPayments = state.selectedPayments.filter(id => id !== paymentId);
        } else {
          state.selectedPayments.push(paymentId);
        }
      });
    },

    selectAllPayments: () => {
      set((state) => {
        state.selectedPayments = state.payments.map(p => p.id);
      });
    },

    clearPaymentSelection: () => {
      set((state) => {
        state.selectedPayments = [];
      });
    },

    setSelectedExtracts: (extractIds: string[]) => {
      set((state) => {
        state.selectedExtracts = extractIds;
      });
    },

    toggleExtractSelection: (extractId: string) => {
      set((state) => {
        if (state.selectedExtracts.includes(extractId)) {
          state.selectedExtracts = state.selectedExtracts.filter(id => id !== extractId);
        } else {
          state.selectedExtracts.push(extractId);
        }
      });
    },

    clearExtractSelection: () => {
      set((state) => {
        state.selectedExtracts = [];
      });
    },

    setImportProgress: (progress: PaymentFlowState['importProgress']) => {
      set((state) => {
        state.importProgress = progress;
      });
    },

    clearImportProgress: () => {
      set((state) => {
        state.importProgress = undefined;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    clearValidationErrors: () => {
      set((state) => {
        state.validationErrors = [];
      });
    },

    reset: () => {
      set(() => ({
        ...initialState
      }));
    }
  }))
);
