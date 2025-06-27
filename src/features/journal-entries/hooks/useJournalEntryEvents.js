var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Hook para manejar eventos de actualización en tiempo real de asientos contables
import { useEffect, useCallback } from 'react';
// Event emitter simple para comunicación entre componentes
var JournalEntryEventEmitter = /** @class */ (function () {
    function JournalEntryEventEmitter() {
        this.listeners = new Map();
    }
    JournalEntryEventEmitter.prototype.emit = function (event) {
        var typeListeners = this.listeners.get(event.type);
        if (typeListeners) {
            typeListeners.forEach(function (listener) { return listener(event); });
        }
        // También emitir un evento general para cualquier cambio
        var allListeners = this.listeners.get('updated');
        if (allListeners && event.type !== 'updated') {
            allListeners.forEach(function (listener) { return listener(event); });
        }
    };
    JournalEntryEventEmitter.prototype.on = function (type, listener) {
        var _this = this;
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
        // Retornar función de cleanup
        return function () {
            var typeListeners = _this.listeners.get(type);
            if (typeListeners) {
                typeListeners.delete(listener);
            }
        };
    };
    JournalEntryEventEmitter.prototype.off = function (type, listener) {
        var typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(listener);
        }
    };
    JournalEntryEventEmitter.prototype.clear = function () {
        this.listeners.clear();
    };
    return JournalEntryEventEmitter;
}());
// Instancia global del event emitter
export var journalEntryEventEmitter = new JournalEntryEventEmitter();
/**
 * Hook para emitir eventos de asientos contables
 */
export var useJournalEntryEventEmitter = function () {
    var emitApproved = useCallback(function (entryId, entry) {
        journalEntryEventEmitter.emit({
            type: 'approved',
            entryId: entryId,
            entry: entry,
            timestamp: Date.now()
        });
    }, []);
    var emitPosted = useCallback(function (entryId, entry) {
        journalEntryEventEmitter.emit({
            type: 'posted',
            entryId: entryId,
            entry: entry,
            timestamp: Date.now()
        });
    }, []);
    var emitCancelled = useCallback(function (entryId, entry) {
        journalEntryEventEmitter.emit({
            type: 'cancelled',
            entryId: entryId,
            entry: entry,
            timestamp: Date.now()
        });
    }, []);
    var emitReversed = useCallback(function (entryId, entry) {
        journalEntryEventEmitter.emit({
            type: 'reversed',
            entryId: entryId,
            entry: entry,
            timestamp: Date.now()
        });
    }, []);
    var emitUpdated = useCallback(function (entryId, entry) {
        journalEntryEventEmitter.emit({
            type: 'updated',
            entryId: entryId,
            entry: entry,
            timestamp: Date.now()
        });
    }, []);
    var emitDeleted = useCallback(function (entryId) {
        journalEntryEventEmitter.emit({
            type: 'deleted',
            entryId: entryId,
            timestamp: Date.now()
        });
    }, []);
    return {
        emitApproved: emitApproved,
        emitPosted: emitPosted,
        emitCancelled: emitCancelled,
        emitReversed: emitReversed,
        emitUpdated: emitUpdated,
        emitDeleted: emitDeleted
    };
};
/**
 * Hook para escuchar eventos de asientos contables
 */
export var useJournalEntryEventListener = function (eventTypes, onEvent, dependencies) {
    if (dependencies === void 0) { dependencies = []; }
    var handleEvent = useCallback(onEvent, __spreadArray([onEvent], dependencies, true));
    useEffect(function () {
        var cleanupFunctions = [];
        eventTypes.forEach(function (eventType) {
            var cleanup = journalEntryEventEmitter.on(eventType, handleEvent);
            cleanupFunctions.push(cleanup);
        });
        return function () {
            cleanupFunctions.forEach(function (cleanup) { return cleanup(); });
        };
    }, [eventTypes, handleEvent]);
};
/**
 * Hook para escuchar cambios específicos de un asiento contable
 */
export var useJournalEntryStatusListener = function (entryId, onStatusChange) {
    useJournalEntryEventListener(['approved', 'posted', 'cancelled', 'reversed'], useCallback(function (event) {
        if (entryId && event.entryId === entryId) {
            onStatusChange(event);
        }
    }, [entryId, onStatusChange]));
};
/**
 * Hook para escuchar todos los cambios en asientos contables (para listas)
 */
export var useJournalEntryListListener = function (onEntryChange) {
    // Solo escuchamos eventos que realmente necesitan actualizar las listas
    useJournalEntryEventListener(['approved', 'posted', 'cancelled', 'reversed', 'deleted'], onEntryChange);
};
