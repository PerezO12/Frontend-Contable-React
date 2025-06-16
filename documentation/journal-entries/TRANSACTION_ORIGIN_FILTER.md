# Filtro de Origen de Transacción - Journal Entries

## Resumen

Se ha implementado un filtro de múltiple selección para el origen de transacción (`transaction_origin`) en el listado de asientos contables, permitiendo filtrar por naturaleza de operación (venta, compra, ajuste, etc.).

## Cambios Implementados

### 1. Tipos y Esquemas

#### Actualización de `journalEntryFiltersSchema`
```typescript
export const journalEntryFiltersSchema = z.object({
  // ...campos existentes...
  transaction_origin: z.array(z.enum(['sale', 'purchase', 'adjustment', 'transfer', 'payment', 'collection', 'opening', 'closing', 'other'])).optional(),
  // ...campos existentes...
});
```

### 2. Servicio (JournalEntryService)

#### Manejo de Arrays en Filtros
Se actualizó el método `getJournalEntries` para manejar correctamente arrays en los filtros:

```typescript
if (filters) {
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Manejar arrays (como transaction_origin)
      if (Array.isArray(value)) {
        value.forEach(item => {
          params.append(key, String(item));
        });
      } else {
        params.append(key, String(value));
      }
    }
  });
}
```

#### Funciones de Exportación
También se actualizaron las funciones `exportToExcel` y `exportToPDF` para manejar arrays en los filtros.

### 3. Componente JournalEntryList

#### Estado para Múltiple Selección
```typescript
const [selectedTransactionOrigins, setSelectedTransactionOrigins] = useState<Set<TransactionOrigin>>(
  new Set(filters.transaction_origin || [])
);
```

#### Funciones de Manejo
```typescript
// Manejar selección de origen de transacción (múltiple selección)
const handleTransactionOriginToggle = (origin: TransactionOrigin) => {
  const newSelected = new Set(selectedTransactionOrigins);
  if (newSelected.has(origin)) {
    newSelected.delete(origin);
  } else {
    newSelected.add(origin);
  }
  setSelectedTransactionOrigins(newSelected);
  
  const newFilters = {
    ...filters,
    transaction_origin: newSelected.size > 0 ? Array.from(newSelected) : undefined
  };
  setFilters(newFilters);
  refetchWithFilters(newFilters);
};

// Limpiar filtros de origen de transacción
const clearTransactionOriginFilter = () => {
  setSelectedTransactionOrigins(new Set());
  const newFilters = { ...filters, transaction_origin: undefined };
  setFilters(newFilters);
  refetchWithFilters(newFilters);
};
```

#### UI de Filtros
Se agregó una nueva sección de filtros con botones tipo "chip" para selección múltiple:

```tsx
{/* Filtro de origen de transacción */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Origen de Transacción
  </label>
  <div className="flex flex-wrap gap-2">
    {Object.entries(TransactionOriginLabels).map(([value, label]) => (
      <button
        key={value}
        type="button"
        onClick={() => handleTransactionOriginToggle(value as TransactionOrigin)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedTransactionOrigins.has(value as TransactionOrigin)
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    ))}
    {selectedTransactionOrigins.size > 0 && (
      <button
        type="button"
        onClick={clearTransactionOriginFilter}
        className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
      >
        Limpiar filtros
      </button>
    )}
  </div>
</div>
```

#### Nueva Columna en Tabla
Se agregó una columna "Origen" en la tabla de asientos contables:

```tsx
<th className="text-left py-3 px-4 font-medium text-gray-900">Origen</th>
```

Con la correspondiente celda de datos:

```tsx
<td 
  className="py-3 px-4"
  onClick={() => onEntrySelect?.(entry)}
>
  {entry.transaction_origin ? (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTransactionOriginColor(entry.transaction_origin)}`}>
      {TransactionOriginLabels[entry.transaction_origin]}
    </span>
  ) : (
    <span className="text-xs text-gray-400">-</span>
  )}
</td>
```

## Funcionalidades

### 1. Filtrado de Múltiple Selección
- Los usuarios pueden seleccionar múltiples orígenes de transacción
- Los filtros se aplican inmediatamente al hacer clic
- El estado visual muestra claramente qué filtros están activos

### 2. Visualización en Tabla
- Nueva columna "Origen" muestra el origen de transacción de cada asiento
- Usa colores diferentes para cada tipo de origen (definidos en `getTransactionOriginColor`)
- Muestra "-" cuando no hay origen de transacción definido

### 3. Limpieza de Filtros
- Botón "Limpiar filtros" aparece cuando hay filtros activos
- Permite resetear todos los filtros de origen de transacción de una vez

### 4. Integración con Exportación
- Los filtros de origen de transacción se incluyen en las exportaciones a Excel y PDF
- Manejo correcto de arrays en los parámetros de URL

## Tipos de Origen de Transacción

Los tipos disponibles corresponden al enum del backend:

- **sale** - Venta (Verde)
- **purchase** - Compra (Azul)
- **adjustment** - Ajuste (Amarillo)
- **transfer** - Transferencia (Púrpura)
- **payment** - Pago (Azul)
- **collection** - Cobro (Verde)
- **opening** - Apertura (Índigo)
- **closing** - Cierre (Rojo)
- **other** - Otro (Gris)

## Compatibilidad con Backend

El filtro está diseñado para ser compatible con el filtro implementado en el backend:

```python
transaction_origin: Optional[List[TransactionOrigin]] = Field(None, description="Filtrar por naturaleza de operación")
```

Los parámetros se envían como múltiples valores del mismo key en la URL:
```
?transaction_origin=sale&transaction_origin=purchase
```

## Notas de Implementación

1. **Performance**: Los filtros se aplican inmediatamente sin necesidad de un botón "Aplicar"
2. **Estado**: El estado de filtros se mantiene sincronizado entre la UI y el hook de datos
3. **Validación**: Se usa Zod para validar los tipos de filtros
4. **Compatibilidad**: Los arrays se manejan correctamente tanto en consultas como en exportaciones
