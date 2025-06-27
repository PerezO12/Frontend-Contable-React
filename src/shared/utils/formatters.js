/**
 * Utilidades de formateo para la aplicación
 */
export var formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
export var formatDate = function (date) {
    var dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(dateObj);
};
export var formatDateTime = function (date) {
    var dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);
};
export var formatNumber = function (value, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};
export var formatPercentage = function (value, decimals) {
    if (decimals === void 0) { decimals = 1; }
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
};
