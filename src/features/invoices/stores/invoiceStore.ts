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
  InvoiceFiltersLegacy as InvoiceFilters,
  InvoiceWorkflowAction,
  InvoiceSummary,
  InvoiceType,
  InvoiceCreateWithLines,
  InvoiceLineCreate
} from '../types';
import {
  InvoiceStatus,
  convertInvoiceResponseToLegacy,
  convertInvoiceListResponseToLegacy,
  convertInvoiceWithLinesToLegacy,
  convertInvoiceResponseToLegacyWithLines
} from '../types';
import { InvoiceAPI } from '../api/invoiceAPI';

/**
 * Transforma datos del formato legacy del frontend al formato del backend
 */
function transformLegacyToBackendFormat(data: InvoiceCreateData): InvoiceCreateWithLines {
  // El tipo ya viene correcto del frontend, solo lo pasamos tal como está
  return {
    invoice_date: data.invoice_date,
    due_date: data.due_date,
    invoice_type: data.invoice_type, // Ya es del tipo correcto
    currency_code: data.currency_code || "USD",
    exchange_rate: data.exchange_rate || 1,
    description: data.description || "",
    notes: data.notes || "",
    invoice_number: "", // Se genera automáticamente en el backend
    third_party_id: data.third_party_id,
    journal_id: undefined, // Opcional, se puede configurar después
    payment_terms_id: data.payment_terms_id,    third_party_account_id: undefined, // Opcional, se puede configurar después
    lines: data.lines.map((line, index) => ({
      sequence: index,
      product_id: line.product_id,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unit_price,
      discount_percentage: line.discount_percentage || 0,
      account_id: line.account_id,
      cost_center_id: line.cost_center_id,
      // Convertir tax_rate a tax_ids si existe, sino usar tax_ids directamente
      tax_ids: (line as any).tax_rate ? [] : (line.tax_ids || [])
    }))
  };
}

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
        
        // Asegurar que response existe y tiene la estructura esperada
        if (!response) {
          throw new Error('Respuesta vacía del servidor');
        }
        
        const converted = convertInvoiceListResponseToLegacy(response);
        
        set((state) => {
          state.invoices = converted.items || [];
          state.pagination = {
            page: converted.page || 1,
            page_size: converted.page_size || 20,
            total: converted.total || 0,
            total_pages: converted.total_pages || 0
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
        const response = await InvoiceAPI.getInvoiceWithLines(id);
        const invoice = convertInvoiceWithLinesToLegacy(response);
        
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
      });      try {
        // Transformar datos del formato legacy al formato del backend
        const backendData = transformLegacyToBackendFormat(data);
        const response = await InvoiceAPI.createInvoiceWithLines(backendData);
        const invoice = convertInvoiceWithLinesToLegacy(response);
        
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
    },    updateInvoice: async (data) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        // InvoiceUpdateData debe incluir el id
        const id = (data as any).id;
        if (!id) throw new Error('ID de factura requerido para actualizar');
        
        const response = await InvoiceAPI.updateInvoice(id, data);
        // Las respuestas de update no incluyen líneas, así que usamos convertInvoiceResponseToLegacy
        // pero agregamos líneas vacías para compatibilidad
        const invoice: Invoice = {
          ...convertInvoiceResponseToLegacy({ ...response, lines: [] } as any),
          lines: [] // Se puede cargar por separado si es necesario
        };
        
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
    },    duplicateInvoice: async (id) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const response = await InvoiceAPI.duplicateInvoice(id);
        const invoice = convertInvoiceResponseToLegacyWithLines(response);
        
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
    },    // Acciones de workflow (Flujo Odoo)
    confirmInvoice: async (id, notes) => {
      set((state) => {
        state.saving = true;
        state.error = null;
      });

      try {
        const response = await InvoiceAPI.confirmInvoice(id, { notes });
        const invoice = convertInvoiceResponseToLegacyWithLines(response);
        
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
        const response = await InvoiceAPI.postInvoice(id, { notes });
        const invoice = convertInvoiceResponseToLegacyWithLines(response);
        
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
        const response = await InvoiceAPI.markAsPaid(id, { notes });
        const invoice = convertInvoiceResponseToLegacyWithLines(response);
        
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
        const response = await InvoiceAPI.cancelInvoice(id, { reason });
        const invoice = convertInvoiceResponseToLegacyWithLines(response);
        
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
      const response = await InvoiceAPI.executeWorkflowAction(id, action);
      return convertInvoiceResponseToLegacyWithLines(response);
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
    },    validateInvoiceData: async (data) => {
      try {
        // Asegurar que data tenga el formato correcto para la validación
        const validationData = {
          ...data,
          lines: data.lines || []
        };
        
        const result = await InvoiceAPI.validateInvoiceData(validationData as any);
        
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
    },    getOverdueInvoices: () => {
      // Facturas vencidas: POSTED con fecha vencimiento pasada
      const today = new Date();
      return get().invoices.filter(invoice => 
        invoice.status === 'POSTED' && 
        invoice.due_date && 
        new Date(invoice.due_date) < today
      );
    }
  }))
);
