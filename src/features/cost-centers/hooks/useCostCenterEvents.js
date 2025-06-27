import { useEffect } from 'react';
// Event emitter simple para comunicación entre componentes
var CostCenterEventEmitter = /** @class */ (function () {
    function CostCenterEventEmitter() {
        this.listeners = new Map();
    }
    CostCenterEventEmitter.prototype.emit = function (event) {
        var typeListeners = this.listeners.get(event.type);
        if (typeListeners) {
            typeListeners.forEach(function (listener) { return listener(event); });
        }
    };
    CostCenterEventEmitter.prototype.on = function (type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    };
    CostCenterEventEmitter.prototype.off = function (type, listener) {
        var typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(listener);
        }
    };
    CostCenterEventEmitter.prototype.clear = function () {
        this.listeners.clear();
    };
    return CostCenterEventEmitter;
}());
export var costCenterEventEmitter = new CostCenterEventEmitter();
// Hooks para gestión de eventos
export var useCostCenterEventEmitter = function () {
    var emitCreated = function (costCenterId, costCenter) {
        costCenterEventEmitter.emit({
            type: 'created',
            costCenterId: costCenterId,
            costCenter: costCenter,
            timestamp: Date.now()
        });
    };
    var emitUpdated = function (costCenterId, costCenter) {
        costCenterEventEmitter.emit({
            type: 'updated',
            costCenterId: costCenterId,
            costCenter: costCenter,
            timestamp: Date.now()
        });
    };
    var emitDeleted = function (costCenterId) {
        costCenterEventEmitter.emit({
            type: 'deleted',
            costCenterId: costCenterId,
            timestamp: Date.now()
        });
    };
    var emitStatusChanged = function (costCenterId, costCenter) {
        costCenterEventEmitter.emit({
            type: 'status_changed',
            costCenterId: costCenterId,
            costCenter: costCenter,
            timestamp: Date.now()
        });
    };
    return {
        emitCreated: emitCreated,
        emitUpdated: emitUpdated,
        emitDeleted: emitDeleted,
        emitStatusChanged: emitStatusChanged
    };
};
export var useCostCenterEventListener = function (type, callback) {
    useEffect(function () {
        costCenterEventEmitter.on(type, callback);
        return function () {
            costCenterEventEmitter.off(type, callback);
        };
    }, [type, callback]);
};
export var useCostCenterStatusListener = function (costCenterId, callback) {
    useEffect(function () {
        var handler = function (event) {
            if (event.costCenterId === costCenterId) {
                callback(event);
            }
        };
        costCenterEventEmitter.on('status_changed', handler);
        costCenterEventEmitter.on('updated', handler);
        return function () {
            costCenterEventEmitter.off('status_changed', handler);
            costCenterEventEmitter.off('updated', handler);
        };
    }, [costCenterId, callback]);
};
export var useCostCenterListListener = function (callback) {
    useEffect(function () {
        var types = ['created', 'updated', 'deleted', 'status_changed'];
        types.forEach(function (type) {
            costCenterEventEmitter.on(type, callback);
        });
        return function () {
            types.forEach(function (type) {
                costCenterEventEmitter.off(type, callback);
            });
        };
    }, [callback]);
};
