export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const optionsMap = {
    short: { 
      year: 'numeric' as const, 
      month: '2-digit' as const, 
      day: '2-digit' as const 
    },
    long: { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const
    },
    time: { 
      hour: '2-digit' as const, 
      minute: '2-digit' as const 
    }
  } as const;

  const options: Intl.DateTimeFormatOptions = optionsMap[format];

  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha de string "YYYY-MM-DD" sin problemas de zona horaria
 * Esta función evita el problema donde new Date("2025-08-29") puede mostrar un día anterior
 * debido a la conversión de UTC a zona horaria local
 */
export const formatDateSafe = (dateString: string): string => {
  if (!dateString) return '';
  
  // Si ya es una fecha formateada, devolverla tal como está
  if (dateString.includes('/')) return dateString;
  
  // Para fechas en formato ISO "YYYY-MM-DD", parsear manualmente
  const parts = dateString.split('T')[0].split('-'); // Tomar solo la parte de fecha, ignorar tiempo
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
    const day = parseInt(parts[2]);
    
    // Crear fecha en zona horaria local
    const date = new Date(year, month, day);
    return date.toLocaleDateString('es-ES');
  }
  
  // Fallback al método original
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
