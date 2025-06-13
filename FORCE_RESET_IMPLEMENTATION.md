# Implementación de Force Reset para Journal Entries

## ✅ Funcionalidad Implementada

Se ha agregado la capacidad de **forzar el restablecimiento** de asientos contables a estado borrador mediante el parámetro `force_reset: true`.

## 🔧 Cambios Realizados

### 1. **Servicio (`journalEntryService.ts`)**

#### Función `bulkRestoreToDraft`
```typescript
// ANTES
static async bulkRestoreToDraft(entryIds: string[], reason: string)

// AHORA
static async bulkRestoreToDraft(entryIds: string[], reason: string, forceReset: boolean = false)
```

#### Función `bulkChangeStatus`
```typescript
// ANTES
static async bulkChangeStatus(entryIds: string[], newStatus: JournalEntryStatus, reason?: string)

// AHORA
static async bulkChangeStatus(entryIds: string[], newStatus: JournalEntryStatus, reason?: string, forceReset?: boolean)
```

#### Request Data
```typescript
const requestData = {
  journal_entry_ids: entryIds,
  reason: reason.trim(),
  force_reset: forceReset  // Ahora dinámico en lugar de hardcodeado false
};
```

### 2. **Modal de Restauración (`BulkRestoreModal.tsx`)**

#### Nuevo Estado
```typescript
const [forceReset, setForceReset] = useState(false);
```

#### Nueva UI - Checkbox
```tsx
<label className="flex items-start space-x-3">
  <input
    type="checkbox"
    checked={forceReset}
    onChange={(e) => setForceReset(e.target.checked)}
    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
  />
  <div className="flex-1">
    <span className="text-sm font-medium text-gray-700">
      Forzar restauración
    </span>
    <p className="text-xs text-gray-500 mt-1">
      Activa esta opción para forzar la restauración de asientos que normalmente no pueden ser restaurados a borrador. 
      <span className="text-yellow-600 font-medium"> Usar con precaución.</span>
    </p>
  </div>
</label>
```

#### Interfaz Actualizada
```typescript
// ANTES
onBulkRestore: (entryIds: string[], reason: string) => Promise<...>

// AHORA
onBulkRestore: (entryIds: string[], reason: string, forceReset?: boolean) => Promise<...>
```

### 3. **Wrapper Component (`BulkRestoreWrapper.tsx`)**

#### Función Handler Actualizada
```typescript
// ANTES
const handleBulkRestore = async (entryIds: string[], reason: string)

// AHORA
const handleBulkRestore = async (entryIds: string[], reason: string, forceReset: boolean = false)
```

### 4. **Helper Utilities (`restoreHelpers.ts`)**

#### Función Helper Actualizada
```typescript
// ANTES
export const restoreToDraftHelper = async (entryIds: string[], reason: string)

// AHORA
export const restoreToDraftHelper = async (entryIds: string[], reason: string, forceReset: boolean = false)
```

## 🎯 Comportamiento

### **Por Defecto (force_reset: false)**
- Respeta todas las validaciones del backend
- Solo permite restaurar asientos que cumplan las reglas de negocio
- Operación segura y estándar

### **Con Fuerza (force_reset: true)**
- Intenta forzar la restauración incluso si hay restricciones
- Útil para casos especiales donde se necesita anular validaciones
- Requiere decisión consciente del usuario
- **Advertencia visual**: "Usar con precaución"

## 🔒 Seguridad

1. **Deshabilitado por defecto**: El checkbox inicia en `false`
2. **Advertencia visual**: Texto de precaución en amarillo
3. **Decisión consciente**: Requiere acción explícita del usuario
4. **Logging completo**: Se registra cuando se usa force_reset

## 📱 Experiencia de Usuario

### **Flujo Normal**
1. Usuario selecciona asientos para restaurar
2. Ingresa razón obligatoria
3. Hace clic en "Restaurar"
4. Sistema respeta validaciones normales

### **Flujo con Fuerza**
1. Usuario selecciona asientos para restaurar
2. Ingresa razón obligatoria
3. **Activa checkbox "Forzar restauración"**
4. Lee advertencia de precaución
5. Hace clic en "Restaurar"
6. Sistema envía `force_reset: true` al backend

## ✅ Estado Final

| Componente | Estado | Descripción |
|------------|--------|-------------|
| **Servicio** | ✅ Completado | Acepta parámetro `forceReset` |
| **Modal UI** | ✅ Completado | Checkbox con advertencia |
| **Wrapper** | ✅ Completado | Pasa parámetro correctamente |
| **Helpers** | ✅ Completado | Función actualizada |
| **Logging** | ✅ Completado | Registra uso de force_reset |
| **UX** | ✅ Completado | Advertencia visual clara |

## 🎉 Resultado

Los usuarios ahora pueden:
- **Usar operación normal** por defecto (segura)
- **Activar force_reset** cuando sea necesario
- **Ver advertencias claras** sobre el uso de la función de fuerza
- **Tener control granular** sobre el comportamiento de restauración

La funcionalidad está **completamente implementada** y lista para usar.
