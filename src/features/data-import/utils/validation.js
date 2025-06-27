/**
 * Valida los campos obligatorios para cuentas contables
 */
export function validateAccountData(data, rowNumber) {
    var _a, _b;
    var errors = [];
    // Campos obligatorios
    if (!((_a = data.code) === null || _a === void 0 ? void 0 : _a.trim())) {
        errors.push({
            row_number: rowNumber,
            field_name: 'code',
            error_type: 'required',
            error_message: 'El código de cuenta es obligatorio',
            severity: 'error'
        });
    }
    if (!((_b = data.name) === null || _b === void 0 ? void 0 : _b.trim())) {
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
    var validAccountTypes = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTOS'];
    if (data.account_type && !validAccountTypes.includes(data.account_type)) {
        errors.push({
            row_number: rowNumber,
            field_name: 'account_type',
            error_type: 'invalid_value',
            error_message: "Tipo de cuenta inv\u00E1lido. Valores v\u00E1lidos: ".concat(validAccountTypes.join(', ')),
            severity: 'error'
        });
    }
    // Validaciones de categorías por tipo de cuenta
    if (data.account_type && data.category) {
        var validCategories = getValidCategoriesForAccountType(data.account_type);
        if (!validCategories.includes(data.category)) {
            errors.push({
                row_number: rowNumber,
                field_name: 'category',
                error_type: 'invalid_value',
                error_message: "Categor\u00EDa inv\u00E1lida para el tipo ".concat(data.account_type, ". Valores v\u00E1lidos: ").concat(validCategories.join(', ')),
                severity: 'error'
            });
        }
    }
    return errors;
}
/**
 * Valida los campos obligatorios para asientos contables
 */
export function validateJournalEntryData(data, rowNumber) {
    var _a, _b, _c, _d, _e;
    var errors = [];
    // Campos obligatorios
    if (!((_a = data.entry_number) === null || _a === void 0 ? void 0 : _a.trim())) {
        errors.push({
            row_number: rowNumber,
            field_name: 'entry_number',
            error_type: 'required',
            error_message: 'El número de asiento es obligatorio',
            severity: 'error'
        });
    }
    if (!((_b = data.entry_date) === null || _b === void 0 ? void 0 : _b.trim())) {
        errors.push({
            row_number: rowNumber,
            field_name: 'entry_date',
            error_type: 'required',
            error_message: 'La fecha del asiento es obligatoria',
            severity: 'error'
        });
    }
    if (!((_c = data.description) === null || _c === void 0 ? void 0 : _c.trim())) {
        errors.push({
            row_number: rowNumber,
            field_name: 'description',
            error_type: 'required',
            error_message: 'La descripción del asiento es obligatoria',
            severity: 'error'
        });
    }
    if (!((_d = data.account_code) === null || _d === void 0 ? void 0 : _d.trim())) {
        errors.push({
            row_number: rowNumber,
            field_name: 'account_code',
            error_type: 'required',
            error_message: 'El código de cuenta es obligatorio',
            severity: 'error'
        });
    }
    if (!((_e = data.line_description) === null || _e === void 0 ? void 0 : _e.trim())) {
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
    var hasDebit = data.debit_amount !== undefined && data.debit_amount !== null && data.debit_amount > 0;
    var hasCredit = data.credit_amount !== undefined && data.credit_amount !== null && data.credit_amount > 0;
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
    var validEntryTypes = ['MANUAL', 'AUTOMATIC', 'ADJUSTMENT', 'OPENING', 'CLOSING', 'REVERSAL'];
    if (data.entry_type && !validEntryTypes.includes(data.entry_type)) {
        errors.push({
            row_number: rowNumber,
            field_name: 'entry_type',
            error_type: 'invalid_value',
            error_message: "Tipo de asiento inv\u00E1lido. Valores v\u00E1lidos: ".concat(validEntryTypes.join(', ')),
            severity: 'error'
        });
    }
    return errors;
}
/**
 * Valida que los asientos contables estén balanceados
 */
export function validateJournalEntriesBalance(entries) {
    var errors = [];
    var entriesByNumber = groupEntriesByNumber(entries);
    Object.entries(entriesByNumber).forEach(function (_a) {
        var entryNumber = _a[0], entryLines = _a[1];
        var totalDebit = entryLines.reduce(function (sum, line) { return sum + (line.debit_amount || 0); }, 0);
        var totalCredit = entryLines.reduce(function (sum, line) { return sum + (line.credit_amount || 0); }, 0);
        if (Math.abs(totalDebit - totalCredit) > 0.01) { // Tolerancia de 1 centavo
            var firstRowNumber = Math.min.apply(Math, entryLines.map(function (_, index) { return index + 1; }));
            errors.push({
                row_number: firstRowNumber,
                field_name: 'entry_number',
                error_type: 'business_rule',
                error_message: "El asiento ".concat(entryNumber, " no est\u00E1 balanceado. D\u00E9bitos: ").concat(totalDebit, ", Cr\u00E9ditos: ").concat(totalCredit),
                severity: 'error'
            });
        }
        if (entryLines.length < 2) {
            var firstRowNumber = Math.min.apply(Math, entryLines.map(function (_, index) { return index + 1; }));
            errors.push({
                row_number: firstRowNumber,
                field_name: 'entry_number',
                error_type: 'business_rule',
                error_message: "El asiento ".concat(entryNumber, " debe tener al menos 2 l\u00EDneas (principio de doble partida)"),
                severity: 'error'
            });
        }
    });
    return errors;
}
/**
 * Valida el formato de archivo
 */
export function validateFileFormat(file, allowedFormats) {
    var errors = [];
    var fileExtension = getFileExtension(file.name);
    if (!allowedFormats.includes(fileExtension)) {
        errors.push({
            row_number: 0,
            field_name: 'file',
            error_type: 'invalid_format',
            error_message: "Formato de archivo no soportado. Formatos v\u00E1lidos: ".concat(allowedFormats.join(', ')),
            severity: 'error'
        });
    }
    // Validar tamaño de archivo (máximo 10MB)
    var maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        errors.push({
            row_number: 0,
            field_name: 'file',
            error_type: 'invalid_format',
            error_message: "El archivo es demasiado grande. Tama\u00F1o m\u00E1ximo: 10MB",
            severity: 'error'
        });
    }
    return errors;
}
/**
 * Obtiene las categorías válidas para un tipo de cuenta
 */
export function getValidCategoriesForAccountType(accountType) {
    var categories = {
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
export function groupEntriesByNumber(entries) {
    return entries.reduce(function (groups, entry) {
        if (!groups[entry.entry_number]) {
            groups[entry.entry_number] = [];
        }
        groups[entry.entry_number].push(entry);
        return groups;
    }, {});
}
/**
 * Valida si una fecha está en formato válido YYYY-MM-DD
 */
export function isValidDate(dateString) {
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    var date = new Date(dateString);
    return date.toISOString().slice(0, 10) === dateString;
}
/**
 * Obtiene la extensión de un archivo
 */
export function getFileExtension(filename) {
    var _a;
    return ((_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
}
/**
 * Valida que no haya códigos duplicados en cuentas
 */
export function validateNoDuplicateCodes(accounts) {
    var errors = [];
    var seenCodes = new Set();
    accounts.forEach(function (account, index) {
        if (seenCodes.has(account.code)) {
            errors.push({
                row_number: index + 1,
                field_name: 'code',
                error_type: 'business_rule',
                error_message: "C\u00F3digo duplicado: ".concat(account.code),
                severity: 'error'
            });
        }
        else {
            seenCodes.add(account.code);
        }
    });
    return errors;
}
