/**
 * Formatea el tamaño de archivo en una cadena legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Genera un nombre de archivo único con timestamp
 */
export function generateUniqueFilename(originalName: string, suffix?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = originalName.split('.').pop();
  
  const suffixPart = suffix ? `_${suffix}` : '';
  return `${nameWithoutExt}_${timestamp}${suffixPart}.${extension}`;
}

/**
 * Convierte un archivo a texto plano para visualización
 */
export async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Descarga un blob como archivo
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convierte datos a CSV
 */
export function convertToCSV(data: any[], headers: string[]): string {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

/**
 * Parsea CSV a objetos
 */
export function parseCSV(csvText: string, delimiter: string = ','): any[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter);
    const row: any = {};
      headers.forEach((header, index) => {
      let value: any = values[index]?.trim().replace(/"/g, '') || '';
      
      // Intentar convertir a número si es posible
      if (value && !isNaN(Number(value))) {
        value = Number(value);
      }
      
      // Convertir strings de boolean
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      row[header] = value;
    });
    
    data.push(row);
  }

  return data;
}

/**
 * Valida el formato MIME del archivo
 */
export function validateMimeType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type) || 
         allowedTypes.some(type => {
           if (type.endsWith('/*')) {
             return file.type.startsWith(type.slice(0, -1));
           }
           return false;
         });
}

/**
 * Detecta el formato de archivo basado en la extensión
 */
export function detectFileFormat(filename: string): 'csv' | 'xlsx' | 'json' | 'unknown' {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return 'csv';
    case 'xlsx':
    case 'xls':
      return 'xlsx';
    case 'json':
      return 'json';
    default:
      return 'unknown';
  }
}

/**
 * Obtiene el tipo MIME apropiado para un formato
 */
export function getMimeTypeForFormat(format: 'csv' | 'xlsx' | 'json'): string {
  switch (format) {
    case 'csv':
      return 'text/csv';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Crea un objeto File desde contenido de texto
 */
export function createFileFromText(content: string, filename: string, type: string): File {
  const blob = new Blob([content], { type });
  return new File([blob], filename, { type });
}

/**
 * Formatea tiempo en una cadena legible
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Debounce función para evitar llamadas excesivas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
