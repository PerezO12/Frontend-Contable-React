import type { ValidationError, AccountImportData, JournalEntryImportData } from '../types';

/**
 * Valida los campos obligatorios para cuentas contables
 */
export function validateAccountData(data: Partial<AccountImportData>, rowNumber: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Campos obligatorios
  if (!data.code?.trim()) {    errors.push({
      row_number: rowNumber,
      field_name: 'code',
      error_type: 'required',
      error_message: 'El código de cuenta es obligatorio',
      severity: 'error'
    });
  }

  if (!data.name?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'name',
      error_type: 'required',
      error_message: 'El nombre de cuenta es obligatorio',
      severity: 'error'
    });
  }

  if (!data.account_type) {
    errors.push({
      row_number: rowNumber,
      field_name: 'account_type',
      error_type: 'required',
      error_message: 'El tipo de cuenta es obligatorio',
      severity: 'error'
    });
  }

  // Validaciones de formato
  if (data.code && data.code.length > 20) {
    errors.push({
      row_number: rowNumber,
      field_name: 'code',
      error_type: 'invalid_format',
      error_message: 'El código no puede tener más de 20 caracteres',
      severity: 'error'
    });
  }

  if (data.name && data.name.length > 200) {
    errors.push({
      row_number: rowNumber,
      field_name: 'name',
      error_type: 'invalid_format',
      error_message: 'El nombre no puede tener más de 200 caracteres',
      severity: 'error'
    });
  }

  // Validaciones de valores válidos
  const validAccountTypes = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTOS'];
  if (data.account_type && !validAccountTypes.includes(data.account_type)) {
    errors.push({
      row_number: rowNumber,
      field_name: 'account_type',
      error_type: 'invalid_value',
      error_message: `Tipo de cuenta inválido. Valores válidos: ${validAccountTypes.join(', ')}`,
      severity: 'error'
    });
  }

  // Validaciones de categorías por tipo de cuenta
  if (data.account_type && data.category) {
    const validCategories = getValidCategoriesForAccountType(data.account_type);
    if (!validCategories.includes(data.category)) {
      errors.push({
        row_number: rowNumber,
        field_name: 'category',
        error_type: 'invalid_value',
        error_message: `Categoría inválida para el tipo ${data.account_type}. Valores válidos: ${validCategories.join(', ')}`,
        severity: 'error'
      });
    }
  }

  return errors;
}

/**
 * Valida los campos obligatorios para asientos contables
 */
export function validateJournalEntryData(data: Partial<JournalEntryImportData>, rowNumber: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Campos obligatorios
  if (!data.entry_number?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'entry_number',
      error_type: 'required',
      error_message: 'El número de asiento es obligatorio',
      severity: 'error'
    });
  }

  if (!data.entry_date?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'entry_date',
      error_type: 'required',
      error_message: 'La fecha del asiento es obligatoria',
      severity: 'error'
    });
  }

  if (!data.description?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'description',
      error_type: 'required',
      error_message: 'La descripción del asiento es obligatoria',
      severity: 'error'
    });
  }

  if (!data.account_code?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'account_code',
      error_type: 'required',
      error_message: 'El código de cuenta es obligatorio',
      severity: 'error'
    });
  }

  if (!data.line_description?.trim()) {
    errors.push({
      row_number: rowNumber,
      field_name: 'line_description',
      error_type: 'required',
      error_message: 'La descripción de la línea es obligatoria',
      severity: 'error'
    });
  }

  // Validación de fecha
  if (data.entry_date && !isValidDate(data.entry_date)) {
    errors.push({
      row_number: rowNumber,
      field_name: 'entry_date',
      error_type: 'invalid_format',
      error_message: 'Formato de fecha inválido. Use YYYY-MM-DD',
      severity: 'error'
    });
  }

  // Validación de montos
  const hasDebit = data.debit_amount !== undefined && data.debit_amount !== null && data.debit_amount > 0;
  const hasCredit = data.credit_amount !== undefined && data.credit_amount !== null && data.credit_amount > 0;

  if (!hasDebit && !hasCredit) {
    errors.push({
      row_number: rowNumber,
      field_name: 'debit_amount',
      error_type: 'business_rule',
      error_message: 'Debe especificar un monto en débito o crédito',
      severity: 'error'
    });
  }

  if (hasDebit && hasCredit) {
    errors.push({
      row_number: rowNumber,
      field_name: 'credit_amount',
      error_type: 'business_rule',
      error_message: 'No puede especificar tanto débito como crédito en la misma línea',
      severity: 'error'
    });
  }

  // Validación de tipo de asiento
  const validEntryTypes = ['MANUAL', 'AUTOMATIC', 'ADJUSTMENT', 'OPENING', 'CLOSING', 'REVERSAL'];
  if (data.entry_type && !validEntryTypes.includes(data.entry_type)) {
    errors.push({
      row_number: rowNumber,
      field_name: 'entry_type',
      error_type: 'invalid_value',
      error_message: `Tipo de asiento inválido. Valores válidos: ${validEntryTypes.join(', ')}`,
      severity: 'error'
    });
  }

  return errors;
}

/**
 * Valida que los asientos contables estén balanceados
 */
export function validateJournalEntriesBalance(entries: JournalEntryImportData[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const entriesByNumber = groupEntriesByNumber(entries);

  Object.entries(entriesByNumber).forEach(([entryNumber, entryLines]) => {
    const totalDebit = entryLines.reduce((sum, line) => sum + (line.debit_amount || 0), 0);
    const totalCredit = entryLines.reduce((sum, line) => sum + (line.credit_amount || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) { // Tolerancia de 1 centavo
      const firstRowNumber = Math.min(...entryLines.map((_, index) => index + 1));
      errors.push({
        row_number: firstRowNumber,
        field_name: 'entry_number',
        error_type: 'business_rule',
        error_message: `El asiento ${entryNumber} no está balanceado. Débitos: ${totalDebit}, Créditos: ${totalCredit}`,
        severity: 'error'
      });
    }

    if (entryLines.length < 2) {
      const firstRowNumber = Math.min(...entryLines.map((_, index) => index + 1));
      errors.push({
        row_number: firstRowNumber,
        field_name: 'entry_number',
        error_type: 'business_rule',
        error_message: `El asiento ${entryNumber} debe tener al menos 2 líneas (principio de doble partida)`,
        severity: 'error'
      });
    }
  });

  return errors;
}

/**
 * Valida el formato de archivo
 */
export function validateFileFormat(file: File, allowedFormats: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const fileExtension = getFileExtension(file.name);

  if (!allowedFormats.includes(fileExtension)) {
    errors.push({
      row_number: 0,
      field_name: 'file',
      error_type: 'invalid_format',
      error_message: `Formato de archivo no soportado. Formatos válidos: ${allowedFormats.join(', ')}`,
      severity: 'error'
    });
  }

  // Validar tamaño de archivo (máximo 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push({
      row_number: 0,
      field_name: 'file',
      error_type: 'invalid_format',
      error_message: `El archivo es demasiado grande. Tamaño máximo: 10MB`,
      severity: 'error'
    });
  }

  return errors;
}

/**
 * Obtiene las categorías válidas para un tipo de cuenta
 */
export function getValidCategoriesForAccountType(accountType: string): string[] {
  const categories: Record<string, string[]> = {
    'ACTIVO': ['ACTIVO_CORRIENTE', 'ACTIVO_NO_CORRIENTE'],
    'PASIVO': ['PASIVO_CORRIENTE', 'PASIVO_NO_CORRIENTE'],
    'PATRIMONIO': ['CAPITAL', 'RESERVAS', 'RESULTADOS'],
    'INGRESO': ['INGRESOS_OPERACIONALES', 'INGRESOS_NO_OPERACIONALES'],
    'GASTO': ['GASTOS_OPERACIONALES', 'GASTOS_NO_OPERACIONALES'],
    'COSTOS': ['COSTO_VENTAS', 'COSTOS_PRODUCCION']
  };

  return categories[accountType] || [];
}

/**
 * Agrupa asientos contables por número
 */
export function groupEntriesByNumber(entries: JournalEntryImportData[]): Record<string, JournalEntryImportData[]> {
  return entries.reduce((groups, entry) => {
    if (!groups[entry.entry_number]) {
      groups[entry.entry_number] = [];
    }
    groups[entry.entry_number].push(entry);
    return groups;
  }, {} as Record<string, JournalEntryImportData[]>);
}

/**
 * Valida si una fecha está en formato válido YYYY-MM-DD
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date.toISOString().slice(0, 10) === dateString;
}

/**
 * Obtiene la extensión de un archivo
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Valida que no haya códigos duplicados en cuentas
 */
export function validateNoDuplicateCodes(accounts: AccountImportData[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenCodes = new Set<string>();

  accounts.forEach((account, index) => {
    if (seenCodes.has(account.code)) {
      errors.push({
        row_number: index + 1,
        field_name: 'code',
        error_type: 'business_rule',
        error_message: `Código duplicado: ${account.code}`,
        severity: 'error'
      });
    } else {
      seenCodes.add(account.code);
    }
  });

  return errors;
}
