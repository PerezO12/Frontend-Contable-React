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

export const paymentTermsValidationUtils: PaymentTermsValidationUtils = {
  validatePercentageTotal(percentages: number[]) {
    const total = percentages.reduce((sum, p) => sum + p, 0);
    const difference = Math.abs(total - 100);
    const isValid = difference < 0.000001; // Precisión de 6 decimales

    return {
      isValid,
      total: parseFloat(total.toFixed(6)),
      difference: parseFloat(difference.toFixed(6))
    };
  },

  adjustPercentagesToTotal(percentages: number[]): number[] {
    if (percentages.length === 0) return [];

    const total = percentages.reduce((sum, p) => sum + p, 0);
    const difference = 100 - total;
    
    // Si ya está correcto, no hacer nada
    if (Math.abs(difference) < 0.000001) {
      return percentages.map(p => parseFloat(p.toFixed(6)));
    }

    // Distribuir la diferencia proporcionalmente
    const adjustedPercentages = percentages.map(p => {
      const proportion = p / total;
      const adjustment = difference * proportion;
      return parseFloat((p + adjustment).toFixed(6));
    });

    // Verificar y ajustar cualquier diferencia residual en la última cuota
    const newTotal = adjustedPercentages.reduce((sum, p) => sum + p, 0);
    const residualDifference = 100 - newTotal;
    
    if (Math.abs(residualDifference) >= 0.000001 && adjustedPercentages.length > 0) {
      const lastIndex = adjustedPercentages.length - 1;
      adjustedPercentages[lastIndex] = parseFloat(
        (adjustedPercentages[lastIndex] + residualDifference).toFixed(6)
      );
    }

    return adjustedPercentages;
  },

  calculateEqualPercentages(numberOfInstallments: number): number[] {
    if (numberOfInstallments <= 0) return [];

    // Calcular porcentaje base
    const basePercentage = 100 / numberOfInstallments;
    
    // Crear array con porcentajes redondeados a 6 decimales
    const percentages = Array(numberOfInstallments).fill(
      parseFloat(basePercentage.toFixed(6))
    );

    // Calcular diferencia residual
    const total = percentages.reduce((sum, p) => sum + p, 0);
    const difference = 100 - total;

    // Ajustar la diferencia en la última cuota si es necesario
    if (Math.abs(difference) >= 0.000001) {
      percentages[percentages.length - 1] = parseFloat(
        (percentages[percentages.length - 1] + difference).toFixed(6)
      );
    }

    return percentages;
  },

  validateDecimalPlaces(percentage: number, maxDecimals: number = 6): boolean {
    const str = percentage.toString();
    const decimalIndex = str.indexOf('.');
    
    if (decimalIndex === -1) return true; // Entero
    
    const decimalPlaces = str.slice(decimalIndex + 1).length;
    return decimalPlaces <= maxDecimals;
  },

  roundToDecimals(value: number, decimals: number = 6): number {
    return parseFloat(value.toFixed(decimals));
  }
};

/**
 * Hook para facilitar el uso de las utilidades de validación
 */
export function usePaymentTermsValidation() {
  const validateAndFixPercentages = (percentages: number[]) => {
    const validation = paymentTermsValidationUtils.validatePercentageTotal(percentages);
    
    if (!validation.isValid) {
      const adjustedPercentages = paymentTermsValidationUtils.adjustPercentagesToTotal(percentages);
      return {
        isValid: false,
        original: percentages,
        adjusted: adjustedPercentages,
        difference: validation.difference,
        suggestion: `Los porcentajes suman ${validation.total}%. Se sugiere ajustar para que sumen exactamente 100.000000%.`
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

  const createEqualInstallments = (count: number) => {
    return paymentTermsValidationUtils.calculateEqualPercentages(count);
  };

  return {
    validateAndFixPercentages,
    createEqualInstallments,
    utils: paymentTermsValidationUtils
  };
}

/**
 * Ejemplos de uso comunes
 */
export const commonPaymentTermsExamples = {
  immediate: [{ percentage: 100.000000, days: 0 }],
  thirtyDays: [{ percentage: 100.000000, days: 30 }],
  fiftyFifty: [
    { percentage: 50.000000, days: 0 },
    { percentage: 50.000000, days: 30 }
  ],
  threeEqual: paymentTermsValidationUtils.calculateEqualPercentages(3).map((p, i) => ({
    percentage: p,
    days: i * 30
  })),
  tenTwentyThirty: [
    { percentage: 10.000000, days: 10 },
    { percentage: 20.000000, days: 20 },
    { percentage: 30.000000, days: 30 },
    { percentage: 40.000000, days: 40 }
  ]
};
