/**
 * Utilidades para validación y cálculo de condiciones de pago
 * con soporte para hasta 6 decimales de precisión
 */
export var paymentTermsValidationUtils = {
    validatePercentageTotal: function (percentages) {
        var total = percentages.reduce(function (sum, p) { return sum + p; }, 0);
        var difference = Math.abs(total - 100);
        var isValid = difference < 0.000001; // Precisión de 6 decimales
        return {
            isValid: isValid,
            total: parseFloat(total.toFixed(6)),
            difference: parseFloat(difference.toFixed(6))
        };
    },
    adjustPercentagesToTotal: function (percentages) {
        if (percentages.length === 0)
            return [];
        var total = percentages.reduce(function (sum, p) { return sum + p; }, 0);
        var difference = 100 - total;
        // Si ya está correcto, no hacer nada
        if (Math.abs(difference) < 0.000001) {
            return percentages.map(function (p) { return parseFloat(p.toFixed(6)); });
        }
        // Distribuir la diferencia proporcionalmente
        var adjustedPercentages = percentages.map(function (p) {
            var proportion = p / total;
            var adjustment = difference * proportion;
            return parseFloat((p + adjustment).toFixed(6));
        });
        // Verificar y ajustar cualquier diferencia residual en la última cuota
        var newTotal = adjustedPercentages.reduce(function (sum, p) { return sum + p; }, 0);
        var residualDifference = 100 - newTotal;
        if (Math.abs(residualDifference) >= 0.000001 && adjustedPercentages.length > 0) {
            var lastIndex = adjustedPercentages.length - 1;
            adjustedPercentages[lastIndex] = parseFloat((adjustedPercentages[lastIndex] + residualDifference).toFixed(6));
        }
        return adjustedPercentages;
    },
    calculateEqualPercentages: function (numberOfInstallments) {
        if (numberOfInstallments <= 0)
            return [];
        // Calcular porcentaje base
        var basePercentage = 100 / numberOfInstallments;
        // Crear array con porcentajes redondeados a 6 decimales
        var percentages = Array(numberOfInstallments).fill(parseFloat(basePercentage.toFixed(6)));
        // Calcular diferencia residual
        var total = percentages.reduce(function (sum, p) { return sum + p; }, 0);
        var difference = 100 - total;
        // Ajustar la diferencia en la última cuota si es necesario
        if (Math.abs(difference) >= 0.000001) {
            percentages[percentages.length - 1] = parseFloat((percentages[percentages.length - 1] + difference).toFixed(6));
        }
        return percentages;
    },
    validateDecimalPlaces: function (percentage, maxDecimals) {
        if (maxDecimals === void 0) { maxDecimals = 6; }
        var str = percentage.toString();
        var decimalIndex = str.indexOf('.');
        if (decimalIndex === -1)
            return true; // Entero
        var decimalPlaces = str.slice(decimalIndex + 1).length;
        return decimalPlaces <= maxDecimals;
    },
    roundToDecimals: function (value, decimals) {
        if (decimals === void 0) { decimals = 6; }
        return parseFloat(value.toFixed(decimals));
    }
};
/**
 * Hook para facilitar el uso de las utilidades de validación
 */
export function usePaymentTermsValidation() {
    var validateAndFixPercentages = function (percentages) {
        var validation = paymentTermsValidationUtils.validatePercentageTotal(percentages);
        if (!validation.isValid) {
            var adjustedPercentages = paymentTermsValidationUtils.adjustPercentagesToTotal(percentages);
            return {
                isValid: false,
                original: percentages,
                adjusted: adjustedPercentages,
                difference: validation.difference,
                suggestion: "Los porcentajes suman ".concat(validation.total, "%. Se sugiere ajustar para que sumen exactamente 100.000000%.")
            };
        }
        return {
            isValid: true,
            original: percentages,
            adjusted: percentages,
            difference: 0,
            suggestion: '✓ Los porcentajes suman exactamente 100.000000%'
        };
    };
    var createEqualInstallments = function (count) {
        return paymentTermsValidationUtils.calculateEqualPercentages(count);
    };
    return {
        validateAndFixPercentages: validateAndFixPercentages,
        createEqualInstallments: createEqualInstallments,
        utils: paymentTermsValidationUtils
    };
}
/**
 * Ejemplos de uso comunes
 */
export var commonPaymentTermsExamples = {
    immediate: [{ percentage: 100.000000, days: 0 }],
    thirtyDays: [{ percentage: 100.000000, days: 30 }],
    fiftyFifty: [
        { percentage: 50.000000, days: 0 },
        { percentage: 50.000000, days: 30 }
    ],
    threeEqual: paymentTermsValidationUtils.calculateEqualPercentages(3).map(function (p, i) { return ({
        percentage: p,
        days: i * 30
    }); }),
    tenTwentyThirty: [
        { percentage: 10.000000, days: 10 },
        { percentage: 20.000000, days: 20 },
        { percentage: 30.000000, days: 30 },
        { percentage: 40.000000, days: 40 }
    ]
};
