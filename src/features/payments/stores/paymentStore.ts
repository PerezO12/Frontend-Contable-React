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
  PaymentConfirmation,
  PaymentBatchConfirmation,
  PaymentReconciliationSummary,
  FileImportRequest,
  PaymentFlowState
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
  confirmPayment: (paymentId: string) => Promise<PaymentConfirmation>;
  
  // Confirmar múltiples pagos en lote
  batchConfirmPayments: (paymentIds: string[]) => Promise<PaymentBatchConfirmation>;
  
  // Obtener estado del flujo
  getPaymentFlowStatus: (extractId: string) => Promise<PaymentFlowStatus>;
  
  // Obtener resumen de conciliación
  fetchReconciliationSummary: () => Promise<void>;

  // === ACCIONES DE MODIFICACIÓN ===

  // Cancelar pago
  cancelPayment: (paymentId: string) => Promise<void>;
  
  // Eliminar pago (solo DRAFT)
  deletePayment: (paymentId: string) => Promise<void>;
  
  // Operaciones bulk
  bulkDeletePayments: (paymentIds: string[]) => Promise<{ deleted: number; errors: string[] }>;
  bulkCancelPayments: (paymentIds: string[]) => Promise<{ cancelled: number; errors: string[] }>;

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

const initialState: Omit<PaymentStoreState, 'fetchPayments' | 'fetchDraftPayments' | 'fetchPayment' | 'fetchBankExtracts' | 'fetchBankExtract' | 'importBankStatement' | 'importFromFile' | 'confirmPayment' | 'batchConfirmPayments' | 'getPaymentFlowStatus' | 'fetchReconciliationSummary' | 'cancelPayment' | 'deletePayment' | 'bulkDeletePayments' | 'bulkCancelPayments' | 'setFilters' | 'setExtractFilters' | 'clearFilters' | 'setSelectedPayments' | 'togglePaymentSelection' | 'selectAllPayments' | 'clearPaymentSelection' | 'setSelectedExtracts' | 'toggleExtractSelection' | 'clearExtractSelection' | 'setImportProgress' | 'clearImportProgress' | 'clearError' | 'clearValidationErrors' | 'reset'> = {
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
        
        // Actualizar el pago en la lista
        set((state) => {
          const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            state.payments[paymentIndex].status = PaymentStatus.POSTED;
          }
          state.loading = false;
        });
        
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
        const result = await PaymentFlowAPI.batchConfirmPayments(paymentIds);
        
        // Actualizar pagos confirmados en la lista
        set((state) => {
          result.results.forEach(confirmation => {
            if (confirmation.success) {
              const paymentIndex = state.payments.findIndex(p => p.id === confirmation.payment_id);
              if (paymentIndex !== -1) {
                state.payments[paymentIndex].status = PaymentStatus.POSTED;
              }
            }
          });
          state.selectedPayments = []; // Limpiar selección
          state.loading = false;
        });
        
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
        
        // Actualizar el pago en la lista
        set((state) => {
          const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            state.payments[paymentIndex].status = PaymentStatus.CANCELLED;
          }
          state.loading = false;
        });
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
        
        // Remover el pago de la lista
        set((state) => {
          state.payments = state.payments.filter(p => p.id !== paymentId);
          state.selectedPayments = state.selectedPayments.filter(id => id !== paymentId);
          state.loading = false;
        });
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
        
        // Remover pagos eliminados de la lista
        set((state) => {
          state.payments = state.payments.filter(p => !paymentIds.includes(p.id));
          state.selectedPayments = [];
          state.loading = false;
        });
        
        return result;
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
        
        // Actualizar pagos cancelados en la lista
        set((state) => {
          paymentIds.forEach(paymentId => {
            const paymentIndex = state.payments.findIndex(p => p.id === paymentId);
            if (paymentIndex !== -1) {
              state.payments[paymentIndex].status = PaymentStatus.CANCELLED;
            }
          });
          state.selectedPayments = [];
          state.loading = false;
        });
        
        return result;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || 'Error al cancelar pagos';
          state.loading = false;
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
