# Implementación Completa del Parámetro "Force" para Todas las Operaciones Bulk

## Descripción
Se completó la implementación del parámetro "force" para todas las operaciones bulk de cambio de estado de asientos contables, no solo para "restablecer a borrador". Ahora todas las operaciones masivas (aprobación, contabilización, cancelación, reversión) pueden ser forzadas a través del checkbox en la interfaz.

## Archivos Modificados

### 1. **Servicio (`journalEntryService.ts`)**

#### Cambios Realizados:
- **`bulkPostEntries`**: Agregado parámetro `forcePost: boolean = false` y se envía como `force_post` al backend
- **`bulkCancelEntries`**: Agregado parámetro `forceCancel: boolean = false` y se envía como `force_cancel` al backend  
- **`bulkReverseEntries`**: Agregado parámetro `forceReverse: boolean = false` y se envía como `force_reverse` al backend
- **`bulkChangeStatus`**: Renombrado parámetro de `forceReset` a `forceOperation` y se propaga a todas las operaciones
- **`bulkReverseOperation`**: Agregado parámetro `forceReverse` para operaciones de reversión especiales

#### Parámetros Enviados al Backend por Estado:
```typescript
// Restaurar a borrador
{ journal_entry_ids, reason, force_reset: boolean }

// Aprobar 
{ journal_entry_ids, reason, force_approve: boolean }

// Contabilizar
{ journal_entry_ids, reason, force_post: boolean }

// Cancelar
{ journal_entry_ids, reason, force_cancel: boolean }

// Revertir
{ journal_entry_ids, reason, force_reverse: boolean }
```

### 2. **Modal de Razón (`ReasonPromptModal.tsx`)**

#### Cambios Realizados:
- **Interface renovada**: Cambio de `showForceReset` a props más genéricas:
  ```typescript
  interface ReasonPromptModalProps {
    showForceOption?: boolean;
    forceOptionLabel?: string;
    forceOptionDescription?: string;
    onConfirm: (reason: string, forceOperation?: boolean) => void;
  }
  ```
- **Estado generalizado**: Cambio de `forceReset` a `forceOperation`
- **Props por defecto**: Textos genéricos que se pueden personalizar según la operación

### 3. **Cambiador de Estado Bulk (`BulkStatusChanger.tsx`)**

#### Cambios Realizados:
- **Interface actualizada**: Cambio de `forceReset` a `forceOperation` en la prop `onStatusChange`
- **Funciones helper agregadas**:
  ```typescript
  getForceOptionLabel(status): string    // Etiqueta específica del checkbox
  getForceOptionDescription(status): string  // Descripción específica
  ```
- **Modal configurado**: Ahora pasa `showForceOption={true}` para todas las operaciones que requieren razón
- **Textos específicos por operación**:
  - DRAFT: "Forzar restauración"
  - APPROVED: "Forzar aprobación" 
  - POSTED: "Forzar contabilización"
  - CANCELLED: "Forzar cancelación"
  - REVERSE: "Forzar reversión"

### 4. **Lista de Asientos (`JournalEntryList.tsx`)**

#### Cambios Realizados:
- **`handleBulkStatusChange`**: Renombrado parámetro de `forceReset` a `forceOperation`
- **Propagación simplificada**: Ahora pasa `forceOperation` a todas las operaciones, no solo a DRAFT
- **Actualización de reversión**: El método `bulkReverseOperation` ahora recibe el parámetro force

## Funcionalidad Final

### Interfaz de Usuario
- ✅ **Checkbox visible**: En todas las operaciones bulk que requieren razón (no solo en DRAFT)
- ✅ **Textos específicos**: Cada operación tiene su etiqueta y descripción personalizada
- ✅ **Advertencia**: Mensaje de "Usar con precaución" en todas las operaciones
- ✅ **Estado por defecto**: Checkbox siempre inicia deshabilitado

### Backend Communication
- ✅ **Parámetros específicos**: Cada estado envía su parámetro force correspondiente:
  - `force_reset` para DRAFT
  - `force_approve` para APPROVED  
  - `force_post` para POSTED
  - `force_cancel` para CANCELLED
  - `force_reverse` para REVERSE

### Operaciones Soportadas
- ✅ **Restaurar a Borrador**: `force_reset`
- ✅ **Aprobar**: `force_approve` 
- ✅ **Contabilizar**: `force_post`
- ✅ **Cancelar**: `force_cancel`
- ✅ **Revertir**: `force_reverse`

## Testing Recomendado

1. **Test de UI**: Verificar que el checkbox aparece en todas las operaciones bulk
2. **Test de parámetros**: Verificar que se envían los parámetros correctos al backend
3. **Test de validación**: Verificar que el force realmente omite validaciones en el backend
4. **Test de texto**: Verificar que cada operación muestra el texto apropiado

## Estados de Compilación
- ✅ **Sin errores de TypeScript**: Todas las interfaces y tipos actualizados correctamente
- ✅ **Props validadas**: El modal acepta los nuevos props sin errores
- ✅ **Compatibilidad**: Mantiene compatibilidad con el comportamiento existente

## Próximos Pasos
1. Probar en ambiente de desarrollo la funcionalidad completa
2. Verificar que el backend procesa correctamente todos los parámetros force_*
3. Documentar para el equipo de backend los nuevos parámetros esperados
4. Implementar tests automatizados para las operaciones bulk con force

---
**Fecha de implementación**: 13 de junio de 2025  
**Implementado por**: AI Assistant  
**Estado**: ✅ Completado
