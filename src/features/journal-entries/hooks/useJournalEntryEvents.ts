// Hook para manejar eventos de actualización en tiempo real de asientos contables
import { useEffect, useCallback } from 'react';
import type { JournalEntry } from '../types';

// Tipos para los eventos
export type JournalEntryEventType = 'approved' | 'posted' | 'cancelled' | 'reversed' | 'updated' | 'deleted';

export interface JournalEntryEvent {
  type: JournalEntryEventType;
  entryId: string;
  entry?: JournalEntry;
  timestamp: number;
}

// Event emitter simple para comunicación entre componentes
class JournalEntryEventEmitter {
  private listeners: Map<JournalEntryEventType, Set<(event: JournalEntryEvent) => void>> = new Map();

  emit(event: JournalEntryEvent) {
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event));
    }

    // También emitir un evento general para cualquier cambio
    const allListeners = this.listeners.get('updated' as JournalEntryEventType);
    if (allListeners && event.type !== 'updated') {
      allListeners.forEach(listener => listener(event));
    }
  }

  on(type: JournalEntryEventType, listener: (event: JournalEntryEvent) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Retornar función de cleanup
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(listener);
      }
    };
  }

  off(type: JournalEntryEventType, listener: (event: JournalEntryEvent) => void) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);
    }
  }

  clear() {
    this.listeners.clear();
  }
}

// Instancia global del event emitter
export const journalEntryEventEmitter = new JournalEntryEventEmitter();

/**
 * Hook para emitir eventos de asientos contables
 */
export const useJournalEntryEventEmitter = () => {
  const emitApproved = useCallback((entryId: string, entry?: JournalEntry) => {
    journalEntryEventEmitter.emit({
      type: 'approved',
      entryId,
      entry,
      timestamp: Date.now()
    });
  }, []);

  const emitPosted = useCallback((entryId: string, entry?: JournalEntry) => {
    journalEntryEventEmitter.emit({
      type: 'posted',
      entryId,
      entry,
      timestamp: Date.now()
    });
  }, []);

  const emitCancelled = useCallback((entryId: string, entry?: JournalEntry) => {
    journalEntryEventEmitter.emit({
      type: 'cancelled',
      entryId,
      entry,
      timestamp: Date.now()
    });
  }, []);

  const emitReversed = useCallback((entryId: string, entry?: JournalEntry) => {
    journalEntryEventEmitter.emit({
      type: 'reversed',
      entryId,
      entry,
      timestamp: Date.now()
    });
  }, []);

  const emitUpdated = useCallback((entryId: string, entry?: JournalEntry) => {
    journalEntryEventEmitter.emit({
      type: 'updated',
      entryId,
      entry,
      timestamp: Date.now()
    });
  }, []);

  const emitDeleted = useCallback((entryId: string) => {
    journalEntryEventEmitter.emit({
      type: 'deleted',
      entryId,
      timestamp: Date.now()
    });
  }, []);

  return {
    emitApproved,
    emitPosted,
    emitCancelled,
    emitReversed,
    emitUpdated,
    emitDeleted
  };
};

/**
 * Hook para escuchar eventos de asientos contables
 */
export const useJournalEntryEventListener = (
  eventTypes: JournalEntryEventType[],
  onEvent: (event: JournalEntryEvent) => void,
  dependencies: any[] = []
) => {
  const handleEvent = useCallback(onEvent, dependencies);

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    eventTypes.forEach(eventType => {
      const cleanup = journalEntryEventEmitter.on(eventType, handleEvent);
      cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [eventTypes, handleEvent]);
};

/**
 * Hook para escuchar cambios específicos de un asiento contable
 */
export const useJournalEntryStatusListener = (
  entryId: string | undefined,
  onStatusChange: (event: JournalEntryEvent) => void
) => {
  useJournalEntryEventListener(
    ['approved', 'posted', 'cancelled', 'reversed'],
    useCallback((event: JournalEntryEvent) => {
      if (entryId && event.entryId === entryId) {
        onStatusChange(event);
      }
    }, [entryId, onStatusChange])
  );
};

/**
 * Hook para escuchar todos los cambios en asientos contables (para listas)
 */
export const useJournalEntryListListener = (
  onEntryChange: (event: JournalEntryEvent) => void
) => {
  useJournalEntryEventListener(
    ['approved', 'posted', 'cancelled', 'reversed', 'updated', 'deleted'],
    onEntryChange
  );
};
