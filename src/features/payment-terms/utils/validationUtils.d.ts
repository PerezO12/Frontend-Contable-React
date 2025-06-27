/**
 * Utilidades para validación y cálculo de condiciones de pago
 * con soporte para hasta 6 decimales de precisión
 */
export interface PaymentTermsValidationUtils {
    /**
     * Valida que los porcentajes sumen exactamente 100% con precisión de 6 decimales
     */
    validatePercentageTotal(percentages: number[]): {
        isValid: boolean;
        total: number;
        difference: number;
    };
    /**
     * Ajusta automáticamente los porcentajes para que sumen exactamente 100%
     * distribuyendo el error entre todas las cuotas
     */
    adjustPercentagesToTotal(percentages: number[]): number[];
    /**
     * Calcula porcentajes equivalentes para N cuotas iguales
     */
    calculateEqualPercentages(numberOfInstallments: number): number[];
    /**
     * Valida el número de decimales en un porcentaje
     */
    validateDecimalPlaces(percentage: number, maxDecimals: number): boolean;
    /**
     * Redondea un porcentaje a un número específico de decimales
     */
    roundToDecimals(value: number, decimals: number): number;
}
export declare const paymentTermsValidationUtils: PaymentTermsValidationUtils;
/**
 * Hook para facilitar el uso de las utilidades de validación
 */
export declare function usePaymentTermsValidation(): {
    validateAndFixPercentages: (percentages: number[]) => {
        isValid: boolean;
        original: number[];
        adjusted: number[];
        difference: number;
        suggestion: string;
    };
    createEqualInstallments: (count: number) => number[];
    utils: PaymentTermsValidationUtils;
};
/**
 * Ejemplos de uso comunes
 */
export declare const commonPaymentTermsExamples: {
    immediate: {
        percentage: number;
        days: number;
    }[];
    thirtyDays: {
        percentage: number;
        days: number;
    }[];
    fiftyFifty: {
        percentage: number;
        days: number;
    }[];
    threeEqual: {
        percentage: number;
        days: number;
    }[];
    tenTwentyThirty: {
        percentage: number;
        days: number;
    }[];
};
