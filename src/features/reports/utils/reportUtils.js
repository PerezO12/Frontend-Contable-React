// ==========================================
// Utilidades para el módulo de reportes
// ==========================================
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
// ==========================================
// Date utilities
// ==========================================
export var dateUtils = {
    /**
     * Obtiene el primer día del mes actual
     */
    getStartOfMonth: function () {
        var date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    },
    /**
     * Obtiene el último día del mes actual
     */
    getEndOfMonth: function () {
        var date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    },
    /**
     * Obtiene el primer día del año actual
     */
    getStartOfYear: function () {
        var date = new Date();
        return new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
    },
    /**
     * Obtiene la fecha actual
     */
    getToday: function () {
        return new Date().toISOString().split('T')[0];
    },
    /**
     * Obtiene fechas para períodos predefinidos
     */
    getPeriodDates: function (period) {
        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth();
        switch (period) {
            case 'thisMonth':
                return {
                    from_date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
                    to_date: today.toISOString().split('T')[0]
                };
            case 'lastMonth':
                return {
                    from_date: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
                    to_date: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
                };
            case 'thisYear':
                return {
                    from_date: new Date(currentYear, 0, 1).toISOString().split('T')[0],
                    to_date: today.toISOString().split('T')[0]
                };
            case 'lastYear':
                return {
                    from_date: new Date(currentYear - 1, 0, 1).toISOString().split('T')[0],
                    to_date: new Date(currentYear - 1, 11, 31).toISOString().split('T')[0]
                };
            case 'thisQuarter':
                var quarterStartMonth = Math.floor(currentMonth / 3) * 3;
                return {
                    from_date: new Date(currentYear, quarterStartMonth, 1).toISOString().split('T')[0],
                    to_date: today.toISOString().split('T')[0]
                };
            case 'lastQuarter':
                var lastQuarterStartMonth = Math.floor(currentMonth / 3) * 3 - 3;
                var lastQuarterYear = lastQuarterStartMonth < 0 ? currentYear - 1 : currentYear;
                var adjustedStartMonth = lastQuarterStartMonth < 0 ? 9 : lastQuarterStartMonth;
                return {
                    from_date: new Date(lastQuarterYear, adjustedStartMonth, 1).toISOString().split('T')[0],
                    to_date: new Date(lastQuarterYear, adjustedStartMonth + 3, 0).toISOString().split('T')[0]
                };
            default:
                return {
                    from_date: this.getStartOfMonth(),
                    to_date: this.getToday()
                };
        }
    },
    /**
     * Valida que una fecha esté en formato correcto
     */
    isValidDate: function (dateString) {
        var date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    },
    /**
     * Formatea una fecha para mostrar en UI
     */
    formatDisplayDate: function (dateString, locale) {
        if (locale === void 0) { locale = 'es-CO'; }
        var date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};
// ==========================================
// Currency utilities
// ==========================================
export var currencyUtils = {
    /**
     * Formatea un valor monetario
     */
    format: function (amount, currency) {
        if (currency === void 0) { currency = 'COP'; }
        var numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
        if (isNaN(numAmount))
            return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    },
    /**
     * Convierte string de moneda a número
     */
    toNumber: function (currencyString) {
        return parseFloat(currencyString.replace(/[$,]/g, '')) || 0;
    },
    /**
     * Calcula la variación porcentual entre dos valores
     */
    calculateVariation: function (current, previous) {
        var currentNum = typeof current === 'string' ? this.toNumber(current) : current;
        var previousNum = typeof previous === 'string' ? this.toNumber(previous) : previous;
        if (previousNum === 0)
            return currentNum > 0 ? 100 : 0;
        return ((currentNum - previousNum) / previousNum) * 100;
    }
};
// ==========================================
// Report validation utilities
// ==========================================
export var validationUtils = {
    /**
     * Valida filtros de reporte
     */
    validateReportFilters: function (filters) {
        var errors = [];
        // Validar fechas requeridas
        if (!filters.from_date) {
            errors.push('La fecha de inicio es requerida');
        }
        if (!filters.to_date) {
            errors.push('La fecha de fin es requerida');
        }
        // Validar formato de fechas
        if (filters.from_date && !dateUtils.isValidDate(filters.from_date)) {
            errors.push('Fecha de inicio inválida');
        }
        if (filters.to_date && !dateUtils.isValidDate(filters.to_date)) {
            errors.push('Fecha de fin inválida');
        }
        // Validar rango de fechas
        if (filters.from_date && filters.to_date) {
            if (new Date(filters.from_date) > new Date(filters.to_date)) {
                errors.push('La fecha de inicio no puede ser mayor que la fecha de fin');
            }
            // Validar período máximo para reportes detallados
            if (filters.detail_level === 'alto') {
                var diffTime = Math.abs(new Date(filters.to_date).getTime() - new Date(filters.from_date).getTime());
                var diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
                if (diffYears > 2) {
                    errors.push('El período no puede ser mayor a 2 años para reportes detallados');
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    /**
     * Valida que un reporte tenga la estructura correcta
     */
    validateReportStructure: function (report) {
        var _a;
        var errors = [];
        if (!report.success) {
            errors.push('El reporte indica que no fue exitoso');
        }
        if (!report.table || !report.table.sections) {
            errors.push('El reporte no contiene secciones de datos');
        }
        if ((_a = report.table) === null || _a === void 0 ? void 0 : _a.sections) {
            report.table.sections.forEach(function (section, index) {
                if (!section.section_name) {
                    errors.push("Secci\u00F3n ".concat(index + 1, " no tiene nombre"));
                }
                if (!section.items || !Array.isArray(section.items)) {
                    errors.push("Secci\u00F3n ".concat(section.section_name, " no contiene items v\u00E1lidos"));
                }
            });
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};
// ==========================================
// Data transformation utilities
// ==========================================
export var transformUtils = {
    /**
     * Convierte reporte a formato CSV
     */
    reportToCSV: function (report) {
        var lines = [];
        // Header
        lines.push("\"".concat(report.project_context, "\""));
        lines.push("\"".concat(dateUtils.formatDisplayDate(report.period.from_date), " - ").concat(dateUtils.formatDisplayDate(report.period.to_date), "\""));
        lines.push('');
        // Sections
        report.table.sections.forEach(function (section) {
            lines.push("\"".concat(section.section_name, "\""));
            lines.push('"Código","Cuenta","Saldo Inicial","Movimientos","Saldo Final"');
            section.items.forEach(function (item) {
                lines.push("\"".concat(item.account_code, "\",\"").concat(item.account_name, "\",\"").concat(item.opening_balance, "\",\"").concat(item.movements, "\",\"").concat(item.closing_balance, "\""));
            });
            lines.push("\"TOTAL\",\"".concat(section.section_name, "\",\"\",\"\",\"").concat(section.total, "\""));
            lines.push('');
        });
        return lines.join('\n');
    },
    /**
     * Aplana la estructura jerárquica de cuentas
     */
    flattenAccountItems: function (items) {
        var flattened = [];
        var addItemsRecursively = function (itemList, level) {
            if (level === void 0) { level = 0; }
            itemList.forEach(function (item) {
                flattened.push(__assign(__assign({}, item), { level: level }));
                if (item.children && item.children.length > 0) {
                    addItemsRecursively(item.children, level + 1);
                }
            });
        };
        addItemsRecursively(items);
        return flattened;
    },
    /**
     * Agrupa items por tipo de cuenta
     */
    groupItemsByAccountType: function (items) {
        return items.reduce(function (groups, item) {
            var group = item.account_group || 'OTHER';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(item);
            return groups;
        }, {});
    }
};
// ==========================================
// Storage utilities
// ==========================================
export var storageUtils = {
    /**
     * Guarda filtros en localStorage
     */
    saveFilters: function (filters) {
        try {
            localStorage.setItem('reportFilters', JSON.stringify(filters));
        }
        catch (error) {
            console.warn('No se pudieron guardar los filtros:', error);
        }
    },
    /**
     * Carga filtros desde localStorage
     */
    loadFilters: function () {
        try {
            var saved = localStorage.getItem('reportFilters');
            return saved ? JSON.parse(saved) : null;
        }
        catch (error) {
            console.warn('No se pudieron cargar los filtros:', error);
            return null;
        }
    },
    /**
     * Guarda configuración de usuario
     */
    saveUserPreferences: function (preferences) {
        try {
            localStorage.setItem('reportPreferences', JSON.stringify(preferences));
        }
        catch (error) {
            console.warn('No se pudieron guardar las preferencias:', error);
        }
    },
    /**
     * Carga configuración de usuario
     */
    loadUserPreferences: function () {
        try {
            var saved = localStorage.getItem('reportPreferences');
            return saved ? JSON.parse(saved) : {};
        }
        catch (error) {
            console.warn('No se pudieron cargar las preferencias:', error);
            return {};
        }
    }
};
// ==========================================
// Export utilities
// ==========================================
export var exportUtils = {
    /**
     * Descarga un archivo blob
     */
    downloadBlob: function (blob, filename) {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
    /**
     * Genera nombre de archivo para exportación
     */
    generateFilename: function (reportType, format, date) {
        var dateStr = date || new Date().toISOString().split('T')[0];
        var typeNames = {
            'balance_general': 'balance-general',
            'p_g': 'perdidas-ganancias',
            'flujo_efectivo': 'flujo-efectivo',
            'balance_comprobacion': 'balance-comprobacion'
        };
        var typeName = typeNames[reportType] || reportType;
        return "".concat(typeName, "-").concat(dateStr, ".").concat(format);
    }
};
// ==========================================
// Report comparison utilities
// ==========================================
export var comparisonUtils = {
    /**
     * Compara dos reportes del mismo tipo
     */
    compareReports: function (current, previous) {
        var totalVariations = {};
        var sectionVariations = [];
        // Compare totals
        Object.keys(current.table.totals).forEach(function (key) {
            if (previous.table.totals[key]) {
                var currentValue = currencyUtils.toNumber(current.table.totals[key]);
                var previousValue = currencyUtils.toNumber(previous.table.totals[key]);
                totalVariations[key] = currencyUtils.calculateVariation(currentValue, previousValue);
            }
        });
        // Compare sections
        current.table.sections.forEach(function (currentSection) {
            var previousSection = previous.table.sections.find(function (s) { return s.section_name === currentSection.section_name; });
            if (previousSection) {
                var currentTotal = currencyUtils.toNumber(currentSection.total);
                var previousTotal = currencyUtils.toNumber(previousSection.total);
                var sectionVariation = currencyUtils.calculateVariation(currentTotal, previousTotal);
                var itemVariations_1 = [];
                currentSection.items.forEach(function (currentItem) {
                    var previousItem = previousSection.items.find(function (i) { return i.account_code === currentItem.account_code; });
                    if (previousItem) {
                        var currentAmount = currencyUtils.toNumber(currentItem.closing_balance);
                        var previousAmount = currencyUtils.toNumber(previousItem.closing_balance);
                        var variation = currencyUtils.calculateVariation(currentAmount, previousAmount);
                        itemVariations_1.push({
                            account: currentItem.account_name,
                            variation: variation
                        });
                    }
                });
                sectionVariations.push({
                    section: currentSection.section_name,
                    variation: sectionVariation,
                    items: itemVariations_1
                });
            }
        });
        return {
            totalVariations: totalVariations,
            sectionVariations: sectionVariations
        };
    }
};
