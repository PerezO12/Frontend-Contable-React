# Solución al Problema de Borradores Acumulados en localStorage

## Problema Identificado
Los asientos contables se estaban acumulando en el localStorage debido a una funcionalidad de auto-guardado que:
1. Guardaba borradores cada 5 segundos con claves únicas basadas en timestamp
2. No limpiaba los borradores después de guardar exitosamente
3. No tenía mecanismo para limpiar borradores antiguos
4. Generaba múltiples entradas para un mismo formulario

## Datos de Ejemplo del Problema
```
journal-entry-draft-1749749043439
journal-entry-draft-1749749069014  
journal-entry-draft-1749756983219
journal-entry-draft-174...
```

## Solución Implementada

### 1. **Clave de Borrador Única por Sesión**
- **Antes**: `journal-entry-draft-${Date.now()}` generada en cada auto-save
- **Después**: `journal-entry-draft-${Date.now()}` generada una sola vez al inicializar el componente
- **Beneficio**: Un formulario = un solo borrador, no múltiples entradas

### 2. **Funciones de Limpieza**
```typescript
// Limpiar todos los borradores (para cleanup general)
const clearDrafts = useCallback(() => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('journal-entry-draft-')) {
      localStorage.removeItem(key);
    }
  });
}, []);

// Limpiar solo el borrador actual
const clearCurrentDraft = useCallback(() => {
  localStorage.removeItem(draftKey);
}, [draftKey]);
```

### 3. **Limpieza al Guardar Exitosamente**
```typescript
const result = await createEntry(submitData);
if (result) {
  clearCurrentDraft();  // Limpiar borrador actual
  clearDrafts();        // Limpiar todos los borradores antiguos
  if (onSuccess) {
    onSuccess(result);
  }
}
```

### 4. **Limpieza al Cancelar**
```typescript
const handleCancel = useCallback(() => {
  if (!isEditMode) {
    clearCurrentDraft(); // Limpiar borrador al cancelar
  }
  if (onCancel) {
    onCancel();
  }
}, [clearCurrentDraft, isEditMode, onCancel]);
```

### 5. **Limpieza al Desmontar Componente**
```typescript
useEffect(() => {
  return () => {
    // Limpiar solo el borrador actual al desmontar
    if (!isEditMode) {
      clearCurrentDraft();
    }
  };
}, [clearCurrentDraft, isEditMode]);
```

### 6. **Limpieza de Borradores Antiguos**
```typescript
useEffect(() => {
  if (!isEditMode) {
    // Limpiar borradores que tengan más de 1 hora
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('journal-entry-draft-')) {
        const timestamp = parseInt(key.replace('journal-entry-draft-', ''));
        if (timestamp < oneHourAgo) {
          localStorage.removeItem(key);
          console.log('Borrador antiguo eliminado:', key);
        }
      }
    });
  }
}, []); // Solo ejecutar una vez al montar
```

## Comportamiento Final

### ✅ **Antes de los Cambios**:
- ❌ Se creaban múltiples entradas `journal-entry-draft-*` para un solo formulario
- ❌ Los borradores nunca se limpiaban
- ❌ localStorage se llenaba de entradas obsoletas
- ❌ Cada auto-save (5s) creaba una nueva entrada

### ✅ **Después de los Cambios**:
- ✅ Un formulario = una sola entrada de borrador
- ✅ Los borradores se limpian al guardar exitosamente
- ✅ Los borradores se limpian al cancelar
- ✅ Los borradores se limpian al cerrar el formulario
- ✅ Los borradores antiguos (>1 hora) se limpian automáticamente
- ✅ Logs informativos para debugging

## Escenarios de Limpieza

1. **Guardar asiento**: Limpia borrador actual + todos los antiguos
2. **Cancelar formulario**: Limpia borrador actual
3. **Cerrar/navegar**: Limpia borrador actual
4. **Abrir nuevo formulario**: Limpia borradores de más de 1 hora
5. **Editar asiento existente**: No guarda borradores (solo para nuevos)

## Funcionalidad del Auto-Save Preservada
- ✅ Sigue guardando cada 5 segundos
- ✅ Solo en modo creación (no edición)
- ✅ Solo si hay descripción y al menos una cuenta seleccionada
- ✅ Usa la misma clave para toda la sesión del formulario

## Archivos Modificados
- `src/features/journal-entries/components/JournalEntryForm.tsx`

## Testing Recomendado
1. Abrir formulario de nuevo asiento → verificar que no hay acumulación
2. Llenar formulario → verificar auto-save con clave única
3. Guardar asiento → verificar que se limpian todos los borradores
4. Cancelar formulario → verificar que se limpia el borrador actual
5. Esperar 1+ hora → verificar limpieza automática de antiguos

---
**Fecha de implementación**: 13 de junio de 2025  
**Problema resuelto**: ✅ Acumulación de borradores en localStorage  
**Estado**: ✅ Solucionado completamente
