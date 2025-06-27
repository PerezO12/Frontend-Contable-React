var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useCallback } from 'react';
import { generateId } from '@/shared/utils';
export var useToast = function () {
    var _a = useState([]), toasts = _a[0], setToasts = _a[1];
    var addToast = useCallback(function (toast) {
        var newToast = __assign(__assign({}, toast), { id: generateId() });
        setToasts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newToast], false); });
    }, []);
    var removeToast = useCallback(function (id) {
        setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== id; }); });
    }, []);
    var clearAllToasts = useCallback(function () {
        setToasts([]);
    }, []);
    // Helpers para diferentes tipos de toast
    var success = useCallback(function (title, message, duration) {
        addToast({ type: 'success', title: title, message: message, duration: duration });
    }, [addToast]);
    var error = useCallback(function (title, message, duration) {
        addToast({ type: 'error', title: title, message: message, duration: duration });
    }, [addToast]);
    var warning = useCallback(function (title, message, duration) {
        addToast({ type: 'warning', title: title, message: message, duration: duration });
    }, [addToast]);
    var info = useCallback(function (title, message, duration) {
        addToast({ type: 'info', title: title, message: message, duration: duration });
    }, [addToast]);
    return {
        toasts: toasts,
        addToast: addToast,
        removeToast: removeToast,
        clearAllToasts: clearAllToasts,
        success: success,
        error: error,
        warning: warning,
        info: info
    };
};
