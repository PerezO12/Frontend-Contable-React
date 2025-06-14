import { useEffect } from 'react';
import type { CostCenter } from '../types';

// Types for cost center events
export type CostCenterEventType = 'created' | 'updated' | 'deleted' | 'status_changed';

export interface CostCenterEvent {
  type: CostCenterEventType;
  costCenterId: string;
  costCenter?: CostCenter;
  timestamp: number;
}

// Event emitter simple para comunicación entre componentes
class CostCenterEventEmitter {
  private listeners: Map<CostCenterEventType, Set<(event: CostCenterEvent) => void>> = new Map();

  emit(event: CostCenterEvent) {
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event));
    }
  }

  on(type: CostCenterEventType, listener: (event: CostCenterEvent) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  off(type: CostCenterEventType, listener: (event: CostCenterEvent) => void) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const costCenterEventEmitter = new CostCenterEventEmitter();

// Hooks para gestión de eventos
export const useCostCenterEventEmitter = () => {
  const emitCreated = (costCenterId: string, costCenter?: CostCenter) => {
    costCenterEventEmitter.emit({
      type: 'created',
      costCenterId,
      costCenter,
      timestamp: Date.now()
    });
  };

  const emitUpdated = (costCenterId: string, costCenter?: CostCenter) => {
    costCenterEventEmitter.emit({
      type: 'updated',
      costCenterId,
      costCenter,
      timestamp: Date.now()
    });
  };

  const emitDeleted = (costCenterId: string) => {
    costCenterEventEmitter.emit({
      type: 'deleted',
      costCenterId,
      timestamp: Date.now()
    });
  };

  const emitStatusChanged = (costCenterId: string, costCenter?: CostCenter) => {
    costCenterEventEmitter.emit({
      type: 'status_changed',
      costCenterId,
      costCenter,
      timestamp: Date.now()
    });
  };

  return {
    emitCreated,
    emitUpdated,
    emitDeleted,
    emitStatusChanged
  };
};

export const useCostCenterEventListener = (
  type: CostCenterEventType,
  callback: (event: CostCenterEvent) => void
) => {
  useEffect(() => {
    costCenterEventEmitter.on(type, callback);
    return () => {
      costCenterEventEmitter.off(type, callback);
    };
  }, [type, callback]);
};

export const useCostCenterStatusListener = (
  costCenterId: string,
  callback: (event: CostCenterEvent) => void
) => {
  useEffect(() => {
    const handler = (event: CostCenterEvent) => {
      if (event.costCenterId === costCenterId) {
        callback(event);
      }
    };

    costCenterEventEmitter.on('status_changed', handler);
    costCenterEventEmitter.on('updated', handler);
    
    return () => {
      costCenterEventEmitter.off('status_changed', handler);
      costCenterEventEmitter.off('updated', handler);
    };
  }, [costCenterId, callback]);
};

export const useCostCenterListListener = (callback: (event: CostCenterEvent) => void) => {
  useEffect(() => {
    const types: CostCenterEventType[] = ['created', 'updated', 'deleted', 'status_changed'];
    
    types.forEach(type => {
      costCenterEventEmitter.on(type, callback);
    });

    return () => {
      types.forEach(type => {
        costCenterEventEmitter.off(type, callback);
      });
    };
  }, [callback]);
};
