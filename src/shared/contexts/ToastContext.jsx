var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';
var ToastContext = createContext(undefined);
export var useToast = function () {
    var context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
export var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = useState([]), toasts = _b[0], setToasts = _b[1];
    var showToast = useCallback(function (message, type, duration) {
        if (duration === void 0) { duration = 5000; }
        var id = Date.now().toString();
        // Ensure message is always a string
        var messageStr = typeof message === 'string' ? message :
            typeof message === 'object' ? JSON.stringify(message) :
                String(message);
        var newToast = { id: id, message: messageStr, type: type, duration: duration };
        setToasts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newToast], false); });
    }, []);
    var showSuccess = useCallback(function (message, duration) {
        showToast(message, 'success', duration);
    }, [showToast]);
    var showError = useCallback(function (message, duration) {
        showToast(message, 'error', duration);
    }, [showToast]);
    var showWarning = useCallback(function (message, duration) {
        showToast(message, 'warning', duration);
    }, [showToast]);
    var showInfo = useCallback(function (message, duration) {
        showToast(message, 'info', duration);
    }, [showToast]);
    var removeToast = useCallback(function (id) {
        setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== id; }); });
    }, []);
    var value = {
        showToast: showToast,
        showSuccess: showSuccess,
        showError: showError,
        showWarning: showWarning,
        showInfo: showInfo
    };
    return (<ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(function (toast) { return (<Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={function () { return removeToast(toast.id); }}/>); })}
      </div>
    </ToastContext.Provider>);
};
