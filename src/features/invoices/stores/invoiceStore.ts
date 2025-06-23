/**
 * Store para el manejo de estado de facturas usando Zustand
 * Implementa el flujo completo de Odoo para facturas
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  Invoice, 
  InvoiceCreateData, 
  InvoiceUpdateData, 
  InvoiceFilters,
  InvoiceWorkflowAction,
  InvoiceSummary,
  InvoiceStatus,
  InvoiceType
} from '../types';
import { InvoiceAPI } from '../api/invoiceAPI';

interface InvoiceState {
  // Estado de datos
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  summary: InvoiceSummary | null;
  
  // Estado de UI
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  
  // Paginación
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  
  // Filtros activos
  filters: InvoiceFilters;
  
  // Errores
  error: string | null;
  validationErrors: string[];

  // Acciones de datos
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>;
  fetchInvoice: (id: string) => Promise<void>;
  createInvoice: (data: InvoiceCreateData) => Promise<Invoice>;
  updateInvoice: (data: InvoiceUpdateData) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  duplicateInvoice: (id: string) => Promise<Invoice>;
  
  // Acciones de workflow (Flujo Odoo)
  confirmInvoice: (id: string, notes?: string) => Promise<Invoice>;
  postInvoice: (id: string, notes?: string) => Promise<Invoice>;
  markAsPaid: (id: string, notes?: string) => Promise<Invoice>;
  cancelInvoice: (id: string, reason?: string) => Promise<Invoice>;
  executeWorkflowAction: (id: string, action: InvoiceWorkflowAction) => Promise<Invoice>;
  
  // Acciones de UI
  setFilters: (filters: Partial<InvoiceFilters>) => void;
  clearFilters: () => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  clearError: () => void;
  
  // Acciones de utilidad
  fetchSummary: (filters?: Partial<InvoiceFilters>) => Promise<void>;
  validateInvoiceData: (data: InvoiceCreateData | InvoiceUpdateData) => Promise<boolean>;
  
  // Getters computados
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  getInvoicesByType: (type: InvoiceType) => Invoice[];
  getOverdueInvoices: () => Invoice[];
}

const DEFAULT_FILTERS: InvoiceFilters = {
  page: 1,
  page_size: 20
};

export const useInvoiceStore = create<InvoiceState>()(
  immer((set, get) => ({
    // Estado inicial
    invoices: [],
    currentInvoice: null,
    summary: null,
    loading: false,
    saving: false,
    deleting: false,
    pagination: {
      page: 1,
      page_size: 20,
      total: 0,
      total_pages: 0
    },
    filters: DEFAULT_FILTERS,
    error: null,
    validationErrors: [],

    // Implementación de acciones
    fetchInvoices: async (filters) => {
      set((state) => {
        state.loading = true;
        state.error = null;
        if (filters) {
          state.filters = { ...state.filters, ...filters };
        }
      });      try {
        const response = await InvoiceAPI.getInvoices(get().filters);
        
        set((state) => {
          state.invoices = response.items || [];
          state.pagination = {
            page: response.page || 1,
            page_size: response.page_size || 20,
            total: response.total || 0,
            total_pages: response.total_pages || 0
          };
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.loading = false;
          state.error = error instanceof Error ? error.message : 'Error al cargar facturas';
          // Mantener invoices como array vacío en caso de error
          if (!state.invoices) {
            state.invoices = [];
          }
        });
        throw error;
      }
    },    fetchInvoice: async (id) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        // Usar el endpoint con líneas para obtener información completa
        const invoice = await InvoiceAPI.getInvoiceWithLines(id);
        
        set((state) => {
          state.currentInvoice = invoice;
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.loading = false;
          state.error = error instanceof Error ? error.message : 'Error al cargar factura';
        });
        throw error;
      }
    },

    createInvoice: async (data) => {
      set((state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = [];
      });

      try {
        const invoice = await InvoiceAPI.createInvoice(data);
        
        set((state) => {
          state.invoices.unshift(invoice);
          state.currentInvoice = invoice;
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al crear factura';
        });
        throw error;
      }
    },

    updateInvoice: async (data) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.updateInvoice(data);
        
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === invoice.id);
          if (index !== -1) {
            state.invoices[index] = invoice;
          }
          if (state.currentInvoice?.id === invoice.id) {
            state.currentInvoice = invoice;
          }
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al actualizar factura';
        });
        throw error;
      }
    },

    deleteInvoice: async (id) => {
      set((state) => {
        state.deleting = true;
        state.error = null;
      });

      try {
        await InvoiceAPI.deleteInvoice(id);
        
        set((state) => {
          state.invoices = state.invoices.filter(i => i.id !== id);
          if (state.currentInvoice?.id === id) {
            state.currentInvoice = null;
          }
          state.deleting = false;
        });
      } catch (error) {
        set((state) => {
          state.deleting = false;
          state.error = error instanceof Error ? error.message : 'Error al eliminar factura';
        });
        throw error;
      }
    },

    duplicateInvoice: async (id) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.duplicateInvoice(id);
        
        set((state) => {
          state.invoices.unshift(invoice);
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al duplicar factura';
        });
        throw error;
      }
    },

    // Acciones de workflow (Flujo Odoo)
    confirmInvoice: async (id, notes) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.confirmInvoice(id, { notes });
        
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === id);
          if (index !== -1) {
            state.invoices[index] = invoice;
          }
          if (state.currentInvoice?.id === id) {
            state.currentInvoice = invoice;
          }
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al confirmar factura';
        });
        throw error;
      }
    },

    postInvoice: async (id, notes) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.postInvoice(id, { notes });
        
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === id);
          if (index !== -1) {
            state.invoices[index] = invoice;
          }
          if (state.currentInvoice?.id === id) {
            state.currentInvoice = invoice;
          }
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al emitir factura';
        });
        throw error;
      }
    },

    markAsPaid: async (id, notes) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.markAsPaid(id, { notes });
        
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === id);
          if (index !== -1) {
            state.invoices[index] = invoice;
          }
          if (state.currentInvoice?.id === id) {
            state.currentInvoice = invoice;
          }
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al marcar como pagada';
        });
        throw error;
      }
    },

    cancelInvoice: async (id, reason) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const invoice = await InvoiceAPI.cancelInvoice(id, { reason });
        
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === id);
          if (index !== -1) {
            state.invoices[index] = invoice;
          }
          if (state.currentInvoice?.id === id) {
            state.currentInvoice = invoice;
          }
          state.saving = false;
        });

        return invoice;
      } catch (error) {
        set((state) => {
          state.saving = false;
          state.error = error instanceof Error ? error.message : 'Error al cancelar factura';
        });
        throw error;
      }
    },

    executeWorkflowAction: async (id, action) => {
      return InvoiceAPI.executeWorkflowAction(id, action);
    },

    // Acciones de UI
    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
      });
    },

    clearFilters: () => {
      set((state) => {
        state.filters = DEFAULT_FILTERS;
      });
    },

    setCurrentInvoice: (invoice) => {
      set((state) => {
        state.currentInvoice = invoice;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
        state.validationErrors = [];
      });
    },

    // Acciones de utilidad
    fetchSummary: async (filters) => {
      try {
        const summary = await InvoiceAPI.getInvoiceSummary(filters);
        set((state) => {
          state.summary = summary;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Error al cargar resumen';
        });
        throw error;
      }
    },

    validateInvoiceData: async (data) => {
      try {
        const result = await InvoiceAPI.validateInvoiceData(data);
        
        set((state) => {
          state.validationErrors = result.errors;
        });

        return result.is_valid;
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Error al validar datos';
        });
        return false;
      }
    },

    // Getters computados
    getInvoicesByStatus: (status) => {
      return get().invoices.filter(invoice => invoice.status === status);
    },

    getInvoicesByType: (type) => {
      return get().invoices.filter(invoice => invoice.invoice_type === type);
    },

    getOverdueInvoices: () => {
      return get().invoices.filter(invoice => invoice.status === 'overdue');
    }
  }))
);
