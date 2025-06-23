/**
 * Store Zustand para gestión de estado de Journals
 * Maneja el estado global del módulo de journals
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { JournalAPI } from '../api/journalAPI';
import type {
  JournalDetail,
  JournalListItem,
  JournalCreate,
  JournalUpdate,
  JournalFilter,
  JournalPagination,
  JournalStats,
  JournalSequenceInfo,
  JournalResetSequence,
} from '../types';

interface JournalStore {
  // Estado de datos
  journals: JournalListItem[];
  currentJournal: JournalDetail | null;
  currentStats: JournalStats | null;
  currentSequenceInfo: JournalSequenceInfo | null;
  
  // Estado de UI
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Paginación
  total: number;
  skip: number;
  limit: number;
  
  // Filtros actuales
  currentFilters: JournalFilter;
  currentPagination: JournalPagination;

  // Acciones de datos
  fetchJournals: (filters?: JournalFilter, pagination?: JournalPagination) => Promise<void>;
  fetchJournal: (id: string) => Promise<void>;
  createJournal: (data: JournalCreate) => Promise<JournalDetail>;
  updateJournal: (id: string, data: JournalUpdate) => Promise<JournalDetail>;
  deleteJournal: (id: string) => Promise<void>;
  fetchJournalStats: (id: string) => Promise<void>;
  fetchJournalSequenceInfo: (id: string) => Promise<void>;
  resetJournalSequence: (id: string, data: JournalResetSequence) => Promise<JournalDetail>;
  
  // Acciones de UI
  setCurrentJournal: (journal: JournalDetail | null) => void;
  clearError: () => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  
  // Utilidades
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useJournalStore = create<JournalStore>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      journals: [],
      currentJournal: null,
      currentStats: null,
      currentSequenceInfo: null,
      loading: false,
      saving: false,
      error: null,
      total: 0,
      skip: 0,
      limit: 50,
      currentFilters: {},
      currentPagination: { skip: 0, limit: 50, order_by: 'name', order_dir: 'asc' },

      // Acciones de datos
      fetchJournals: async (filters, pagination) => {
        set({ loading: true, error: null });
        
        try {
          const finalFilters = filters || get().currentFilters;
          const finalPagination = pagination || get().currentPagination;
          
          const response = await JournalAPI.getJournals(finalFilters, finalPagination);
          
          set({
            journals: response.items,
            total: response.total,
            skip: response.skip,
            limit: response.limit,
            currentFilters: finalFilters,
            currentPagination: finalPagination,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al cargar journals',
            loading: false,
          });
        }
      },

      fetchJournal: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const journal = await JournalAPI.getJournal(id);
          set({
            currentJournal: journal,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al cargar journal',
            loading: false,
          });
        }
      },

      createJournal: async (data) => {
        set({ saving: true, error: null });
        
        try {
          const journal = await JournalAPI.createJournal(data);
          
          // Actualizar la lista de journals
          const currentJournals = get().journals;
          const updatedJournals = [journal, ...currentJournals];
          
          set({
            journals: updatedJournals,
            currentJournal: journal,
            total: get().total + 1,
            saving: false,
          });
          
          return journal;
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al crear journal',
            saving: false,
          });
          throw error;
        }
      },

      updateJournal: async (id, data) => {
        set({ saving: true, error: null });
        
        try {
          const journal = await JournalAPI.updateJournal(id, data);
          
          // Actualizar en la lista
          const currentJournals = get().journals;
          const updatedJournals = currentJournals.map(j => 
            j.id === id ? { ...j, ...journal } : j
          );
          
          set({
            journals: updatedJournals,
            currentJournal: journal,
            saving: false,
          });
          
          return journal;
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al actualizar journal',
            saving: false,
          });
          throw error;
        }
      },

      deleteJournal: async (id) => {
        set({ saving: true, error: null });
        
        try {
          await JournalAPI.deleteJournal(id);
          
          // Remover de la lista
          const currentJournals = get().journals;
          const updatedJournals = currentJournals.filter(j => j.id !== id);
          
          set({
            journals: updatedJournals,
            currentJournal: get().currentJournal?.id === id ? null : get().currentJournal,
            total: get().total - 1,
            saving: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al eliminar journal',
            saving: false,
          });
          throw error;
        }
      },

      fetchJournalStats: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const stats = await JournalAPI.getJournalStats(id);
          set({
            currentStats: stats,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al cargar estadísticas',
            loading: false,
          });
        }
      },

      fetchJournalSequenceInfo: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const sequenceInfo = await JournalAPI.getJournalSequenceInfo(id);
          set({
            currentSequenceInfo: sequenceInfo,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al cargar información de secuencia',
            loading: false,
          });
        }
      },

      resetJournalSequence: async (id, data) => {
        set({ saving: true, error: null });
        
        try {
          const journal = await JournalAPI.resetJournalSequence(id, data);
          
          set({
            currentJournal: journal,
            saving: false,
          });
          
          // Refrescar información de secuencia
          await get().fetchJournalSequenceInfo(id);
          
          return journal;
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Error al resetear secuencia',
            saving: false,
          });
          throw error;
        }
      },

      // Acciones de UI
      setCurrentJournal: (journal) => {
        set({ currentJournal: journal });
      },

      clearError: () => {
        set({ error: null });
      },

      setError: (error) => {
        set({ error });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setSaving: (saving) => {
        set({ saving });
      },

      // Utilidades
      refresh: async () => {
        const { currentFilters, currentPagination } = get();
        await get().fetchJournals(currentFilters, currentPagination);
      },

      reset: () => {
        set({
          journals: [],
          currentJournal: null,
          currentStats: null,
          currentSequenceInfo: null,
          loading: false,
          saving: false,
          error: null,
          total: 0,
          skip: 0,
          limit: 50,
          currentFilters: {},
          currentPagination: { skip: 0, limit: 50, order_by: 'name', order_dir: 'asc' },
        });
      },
    }),
    {
      name: 'journal-store',
    }
  )
);

export default useJournalStore;
