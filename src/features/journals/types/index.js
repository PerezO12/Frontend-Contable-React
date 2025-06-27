/**
 * Tipos TypeScript para el módulo de Journals (Diarios)
 * Basado en los esquemas del backend
 */
export var JournalTypeConst = {
    SALE: 'sale',
    PURCHASE: 'purchase',
    CASH: 'cash',
    BANK: 'bank',
    MISCELLANEOUS: 'miscellaneous',
};
// Labels para mostrar en UI
export var JournalTypeLabels = {
    sale: 'Ventas',
    purchase: 'Compras',
    cash: 'Efectivo',
    bank: 'Banco',
    miscellaneous: 'Misceláneos',
};
// Colores para badges según tipo
export var JournalTypeColors = {
    sale: 'bg-green-100 text-green-800',
    purchase: 'bg-blue-100 text-blue-800',
    cash: 'bg-yellow-100 text-yellow-800',
    bank: 'bg-indigo-100 text-indigo-800',
    miscellaneous: 'bg-gray-100 text-gray-800',
};
// Exportar todos los tipos principales directamente al final
