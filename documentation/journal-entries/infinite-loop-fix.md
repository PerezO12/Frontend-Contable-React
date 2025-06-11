# Solución del Bucle Infinito en Asientos Contables

## 🐛 Problema Identificado

Se estaba generando un bucle infinito de peticiones al backend cuando se creaba un nuevo asiento contable. El problema se producía por una combinación de factores:

### Causas del Bucle Infinito

1. **Hook `useJournalEntries` con dependencias problemáticas**:
   ```typescript
   const fetchEntries = useCallback(async (filters) => {
     // ...lógica de fetch
   }, [initialFilters, showError]); // ❌ Dependencias que cambian constantemente

   useEffect(() => {
     fetchEntries();
   }, [fetchEntries]); // ❌ Se ejecuta cada vez que fetchEntries cambia
   ```

2. **Eventos excesivos en el sistema de actualización en tiempo real**:
   ```typescript
   // ❌ Emitía eventos 'updated' en cada operación
   emitUpdated(newEntry.id, newEntry);
   ```

3. **Listeners que refrescaban automáticamente**:
   ```typescript
   // ❌ Escuchaba todos los eventos, incluyendo 'updated'
   useJournalEntryListListener(() => {
     refetch(filters); // Causaba nuevas peticiones
   });
   ```

## ✅ Soluciones Implementadas

### 1. Optimización del Hook `useJournalEntries`

**Antes:**
```typescript
const fetchEntries = useCallback(async (filters) => {
  // ...
}, [initialFilters, showError]); // Dependencias problemáticas

useEffect(() => {
  fetchEntries();
}, [fetchEntries]); // Se re-ejecuta constantemente
```

**Después:**
```typescript
const fetchEntries = useCallback(async (filters) => {
  const filtersToUse = filters || initialFilters;
  // ...lógica mejorada
}, []); // Sin dependencias para evitar re-creación

useEffect(() => {
  fetchEntries(initialFilters);
}, []); // Solo se ejecuta una vez al montar
```

### 2. Eliminación de Eventos Innecesarios

**Antes:**
```typescript
const createEntry = useCallback(async (data) => {
  // ...crear asiento
  setEntries(prev => [newEntry, ...prev]);
  emitUpdated(newEntry.id, newEntry); // ❌ Evento innecesario
}, [success, showError, emitUpdated]);
```

**Después:**
```typescript
const createEntry = useCallback(async (data) => {
  // ...crear asiento
  setEntries(prev => [newEntry, ...prev]);
  // ✅ No emitimos evento 'updated' para evitar bucles
}, [success, showError]);
```

### 3. Optimización del Sistema de Eventos

**Antes:**
```typescript
useJournalEntryListListener(() => {
  refetch(filters); // ❌ Refrescaba en todos los eventos
});
```

**Después:**
```typescript
useJournalEntryListListener((event) => {
  // ✅ Solo refresca para eventos específicos
  if (['approved', 'posted', 'cancelled', 'reversed', 'deleted'].includes(event.type)) {
    refetch(filters);
  }
});
```

### 4. Mejora en la Operación de Reversión

**Antes:**
```typescript
const reverseEntry = useCallback(async (id, reason) => {
  // ...
  await fetchEntries(); // ❌ Refrescaba toda la lista
  emitReversed(id);
}, [success, showError, fetchEntries, emitReversed]);
```

**Después:**
```typescript
const reverseEntry = useCallback(async (id, reason) => {
  // ...
  // ✅ Solo emite evento, el listener maneja la actualización
  emitReversed(id);
}, [success, showError, emitReversed]);
```

## 🎯 Beneficios de la Solución

1. **Eliminación del bucle infinito**: No más peticiones redundantes al backend
2. **Mejor rendimiento**: Menos re-renderizados innecesarios
3. **Sistema de eventos más eficiente**: Solo se actualizan cuando es realmente necesario
4. **Código más mantenible**: Dependencias más claras y lógica simplificada

## 🔍 Eventos del Sistema

### Eventos que Actualizan la Lista
- `approved`: Cuando se aprueba un asiento
- `posted`: Cuando se contabiliza un asiento
- `cancelled`: Cuando se cancela un asiento
- `reversed`: Cuando se crea una reversión
- `deleted`: Cuando se elimina un asiento

### Eventos que NO Actualizan la Lista
- `updated`: Operaciones de creación/edición simples (se manejan localmente)

## 🧪 Pruebas Recomendadas

1. **Crear nuevo asiento contable**: Verificar que no se generen peticiones extras
2. **Aprobar asiento**: Confirmar que la lista se actualiza correctamente
3. **Contabilizar asiento**: Verificar actualización en tiempo real
4. **Crear reversión**: Confirmar que no hay bucles infinitos
5. **Navegación entre páginas**: Verificar que los filtros funcionan correctamente

## 📝 Notas Técnicas

- Los `useCallback` sin dependencias son seguros cuando la función no depende de valores externos que cambien
- El estado local se actualiza inmediatamente para mejor UX, sin esperar eventos
- Los eventos solo se usan para sincronización entre componentes, no para actualizar el mismo componente que ejecutó la acción
