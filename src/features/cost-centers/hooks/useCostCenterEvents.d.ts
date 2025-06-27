import type { CostCenter } from '../types';
export type CostCenterEventType = 'created' | 'updated' | 'deleted' | 'status_changed';
export interface CostCenterEvent {
    type: CostCenterEventType;
    costCenterId: string;
    costCenter?: CostCenter;
    timestamp: number;
}
declare class CostCenterEventEmitter {
    private listeners;
    emit(event: CostCenterEvent): void;
    on(type: CostCenterEventType, listener: (event: CostCenterEvent) => void): void;
    off(type: CostCenterEventType, listener: (event: CostCenterEvent) => void): void;
    clear(): void;
}
export declare const costCenterEventEmitter: CostCenterEventEmitter;
export declare const useCostCenterEventEmitter: () => {
    emitCreated: (costCenterId: string, costCenter?: CostCenter) => void;
    emitUpdated: (costCenterId: string, costCenter?: CostCenter) => void;
    emitDeleted: (costCenterId: string) => void;
    emitStatusChanged: (costCenterId: string, costCenter?: CostCenter) => void;
};
export declare const useCostCenterEventListener: (type: CostCenterEventType, callback: (event: CostCenterEvent) => void) => void;
export declare const useCostCenterStatusListener: (costCenterId: string, callback: (event: CostCenterEvent) => void) => void;
export declare const useCostCenterListListener: (callback: (event: CostCenterEvent) => void) => void;
export {};
